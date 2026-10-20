/**
 * 目录功能模块 (Native IntersectionObserver)
 */

// 侧边目录的空间阈值，与 assets/js/theme-init.js 保持一致（单位 rem）
const TOC_SPACE_WIDE = 13; // 留白足够放下面板
const TOC_SPACE_TIGHT = 2; // 留白仅够放下竖条
const TOC_MIN_VIEWPORT = 64; // 小于该视口宽度一律使用居中形态

// 竖条分段的权重：标题层级越深，段越短。
// 收起态用作 flex-grow（各段按权重分摊被压缩的高度），
// 展开态用作段高倍数（见 assets/css/toc.css）
const TOC_SEGMENT_WEIGHT = { 1: 3, 2: 2, 3: 1.5 };

function tocHashOf(link) {
  const raw = link.hash ? link.hash.substring(1) : "";
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch (e) {
    return raw;
  }
}

class TOCManager {
  constructor() {
    this.container = document.getElementById("toc-container");
    if (!this.container) return;

    this.position = this.container.dataset.position || "center";
    this.headings = [];
    this.tocLinks = [];
    this.entries = [];
    this.activeParam = null;
    this.initialized = false;

    this.init();
  }

  init() {
    if (this.initialized) return;
    this.setupElements();
    if (this.tocLinks.length === 0) return;

    this.setupObserver();
    this.bindEvents();

    if (this.position === "side") {
      this.setupSpaceTracking();
      this.buildRail();
      this.updateRail();
      this.setupScrollSync();
      this.syncPin();
    }

    this.initialized = true;
    this.exposeAPI();
  }

  setupElements() {
    // 找出所有的相关 DOM 元素（center / side 两种形态各自一套，只会存在其中一套）
    Object.assign(this, {
      centerDropdown: document.getElementById("toc-center-dropdown"),
      centerToggle: document.getElementById("toc-center-toggle"),
      centerTitle: document.getElementById("toc-center-title"),

      side: document.getElementById("toc-side"),
      rail: document.getElementById("toc-rail"),
      panel: document.getElementById("toc-panel"),
      panelScroll: document.getElementById("toc-side-content"),
      pinBtn: document.getElementById("toc-pin"),
      closeBtn: document.getElementById("toc-close"),
      sideToggle: document.getElementById("toc-trigger"),
      sideTitle: document.getElementById("toc-trigger-title"),
    });

    const links = this.container.querySelectorAll("nav#TableOfContents a");

    links.forEach((link) => {
      const id = tocHashOf(link);
      if (!id) return;
      this.tocLinks.push(link);

      // 通过 DOM 树的 ul 嵌套深度来推断 header 层级
      let depth = 0;
      let el = link.parentElement;
      while (el && el.id !== "TableOfContents") {
        if (el.tagName === "UL") depth++;
        el = el.parentElement;
      }
      this.entries.push({ link, id, depth });

      // 找到具体的文章正文中的标题节点
      const heading = document.getElementById(id);
      if (heading) this.headings.push(heading);
    });
  }

  setupObserver() {
    // 观察器回调
    const callback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // 使用在屏幕中最靠上的标题作为当前高亮的标题
        let topEntry = visibleEntries[0];
        visibleEntries.forEach((entry) => {
          if (entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
            topEntry = entry;
          }
        });

        this.setActive(topEntry.target.id);
      }
    };

    // 配置观察器：监听视口偏上部分作为激活阈值
    this.observer = new IntersectionObserver(callback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 1],
    });

    this.headings.forEach((heading) => {
      this.observer.observe(heading);
    });
  }

  setActive(id) {
    if (!id) return;
    this.activeParam = id;
    let activeText = "";

    this.entries.forEach(({ link, id: linkId }) => {
      const parentLi = link.closest("li");

      if (linkId === id) {
        link.classList.add("active", "font-medium");
        if (parentLi) parentLi.classList.add("active");
        activeText = link.textContent;
      } else {
        link.classList.remove("active", "font-medium");
        if (parentLi) parentLi.classList.remove("active");
      }
    });

    if (activeText) {
      if (this.centerTitle) this.centerTitle.textContent = activeText;
      if (this.sideTitle) this.sideTitle.textContent = activeText;
    }

    this.updateRail();
  }

  /* ---------------- Side 模式：分段竖条 ---------------- */

  buildRail() {
    if (!this.rail) return;
    // 强行清理已存 DOM 避免重复渲染（特别是由 PJAX/Turbo 机制等造成的重复）
    this.rail.innerHTML = "";

    this.entries.forEach(({ link, id, depth }) => {
      const segment = document.createElement("span");
      segment.className = "toc-seg";
      segment.dataset.target = id;
      segment.style.setProperty("--toc-seg-weight", String(TOC_SEGMENT_WEIGHT[depth] || 1));

      segment.addEventListener("click", (e) => {
        // 触控设备不支持 hover，此时点击竖条不应触发滚动，而是交给父级去触发展开面板的逻辑
        if (!window.matchMedia("(hover: hover)").matches) return;
        e.stopPropagation();
        this.scrollToTarget(link.hash);
      });

      this.rail.appendChild(segment);
    });

    // 收起态竖条高度随标题数量增长，达到上限后各段按权重压缩
    this.rail.style.setProperty("--toc-seg-count", String(this.entries.length));
  }

  updateRail() {
    if (!this.rail) return;
    this.rail.querySelectorAll(".toc-seg").forEach((segment) => {
      segment.classList.toggle("is-active", segment.dataset.target === this.activeParam);
    });
  }

  /* ---------------- Side 模式：竖条与面板同步滚动 ---------------- */

  // 两者行高不同，按滚动进度比例映射；写入时上锁，避免互相触发形成回环
  setupScrollSync() {
    if (!this.rail || !this.panelScroll) return;
    let syncing = false;

    const sync = (from, to) => {
      if (syncing) return;
      const fromMax = from.scrollHeight - from.clientHeight;
      const toMax = to.scrollHeight - to.clientHeight;
      if (fromMax <= 0 || toMax <= 0) return;

      syncing = true;
      to.scrollTop = (from.scrollTop / fromMax) * toMax;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };

    this.panelScroll.addEventListener("scroll", () => sync(this.panelScroll, this.rail), {
      passive: true,
    });
    this.rail.addEventListener("scroll", () => sync(this.rail, this.panelScroll), {
      passive: true,
    });
  }

  // 展开时把当前标题带进可视区域，否则长目录每次都从头开始
  revealActive() {
    if (!this.panelScroll || !this.activeParam) return;
    const entry = this.entries.find(({ id }) => id === this.activeParam);
    if (!entry) return;

    const link = entry.link;
    const max = this.panelScroll.scrollHeight - this.panelScroll.clientHeight;
    if (max <= 0) return;

    const centered =
      link.offsetTop + link.offsetHeight / 2 - this.panelScroll.clientHeight / 2;
    this.panelScroll.scrollTop = Math.min(Math.max(centered, 0), max);
  }

  /* ---------------- Side 模式：可用留白探测 ---------------- */

  setupSpaceTracking() {
    this.pageContainer = document.getElementById("page-container");
    this.rootFontSize =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    this.updateSpace();

    // 页面容器宽度会随视口和 --content-width（页面宽度滑块）变化，两者都要跟踪：
    // 容器被 max-width 限制时窗口缩放不会改变它的盒子尺寸，因此 resize 也要单独监听
    if (this.pageContainer && "ResizeObserver" in window) {
      this.spaceObserver = new ResizeObserver(() => this.updateSpace());
      this.spaceObserver.observe(this.pageContainer);
    }
    window.addEventListener("resize", () => this.updateSpace(), { passive: true });
  }

  updateSpace() {
    const root = document.documentElement;
    const rem = this.rootFontSize;
    const viewport = root.clientWidth;
    const pageWidth = this.pageContainer
      ? this.pageContainer.getBoundingClientRect().width
      : viewport;
    const gutter = Math.max(0, (viewport - Math.min(pageWidth, viewport)) / 2);

    let space = "narrow";
    if (viewport >= TOC_MIN_VIEWPORT * rem) {
      if (gutter >= TOC_SPACE_WIDE * rem) space = "wide";
      else if (gutter >= TOC_SPACE_TIGHT * rem) space = "tight";
    }

    if (root.dataset.tocSpace !== space) {
      root.dataset.tocSpace = space;
      // 形态切换时收起悬浮面板，避免停留在上一形态的位置
      this.setOpen(false);
    }
    root.style.setProperty("--toc-gutter", `${Math.round(gutter)}px`);
  }

  /* ---------------- Side 模式：展开与常显 ---------------- */

  setOpen(open) {
    if (this.position !== "side") return;
    this.container.dataset.open = open ? "true" : "false";
    const expanded = open ? "true" : "false";
    if (this.rail) this.rail.setAttribute("aria-expanded", expanded);
    if (this.sideToggle) this.sideToggle.setAttribute("aria-expanded", expanded);
    // 展开后竖条与面板才有滚动范围，此时定位到当前标题
    if (open) requestAnimationFrame(() => this.revealActive());
  }

  toggleSide() {
    this.setOpen(this.container.dataset.open !== "true");
  }

  isPinned() {
    return document.documentElement.dataset.tocPinned === "true";
  }

  // 常显状态写在 <html> 上，首屏前由 theme-init.js 预置，避免面板闪动
  applyPin(pinned, persist) {
    document.documentElement.dataset.tocPinned = pinned ? "true" : "false";
    if (persist) {
      localStorage.setItem("tocPinned", pinned ? "true" : "false");
    }
    if (this.pinBtn) {
      this.pinBtn.setAttribute("aria-pressed", pinned ? "true" : "false");
      const label = pinned ? this.pinBtn.dataset.labelUnpin : this.pinBtn.dataset.labelPin;
      if (label) {
        this.pinBtn.setAttribute("aria-label", label);
        this.pinBtn.title = label;
      }
    }
    // 常显由属性驱动，清掉 hover 展开态避免两者叠加
    if (pinned) {
      this.setOpen(false);
      requestAnimationFrame(() => this.revealActive());
    }
  }

  syncPin() {
    this.applyPin(this.isPinned(), false);
  }

  scrollToTarget(hash) {
    let targetId = hash.substring(1);
    try {
      targetId = decodeURIComponent(targetId);
    } catch (e) {}

    const target = document.getElementById(targetId);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100; // 给 fixed header 留出余量
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      this.closeAll();
      // 在滚动完成之后可以尝试主动 setActive，但原生的 Observer 一般就能够监听到了
    }
  }

  bindEvents() {
    const toggleDropdown = (parent, dropdown) => {
      if (!dropdown) return;
      const isHidden = dropdown.classList.contains("hidden");
      if (isHidden) {
        dropdown.classList.remove("hidden");
        // Trigger reflow 以激活过渡
        void dropdown.offsetWidth;
        dropdown.classList.remove("opacity-0", "scale-95");
        dropdown.classList.add("opacity-100", "scale-100");
      } else {
        dropdown.classList.add("opacity-0", "scale-95");
        dropdown.classList.remove("opacity-100", "scale-100");
        setTimeout(() => {
          dropdown.classList.add("hidden");
        }, 300); // Tailwind duration 参数预设
      }
    };

    if (this.centerToggle) {
      let hideTimeout = null;

      this.centerToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDropdown(this.centerToggle.parentElement, this.centerDropdown);
      });

      this.centerToggle.parentElement.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          clearTimeout(hideTimeout);
          if (this.centerDropdown.classList.contains("hidden")) {
            toggleDropdown(this.centerToggle.parentElement, this.centerDropdown);
          }
        }
      });

      this.centerToggle.parentElement.addEventListener("mouseleave", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          hideTimeout = setTimeout(() => {
            if (!this.centerDropdown.classList.contains("hidden")) {
              toggleDropdown(this.centerToggle.parentElement, this.centerDropdown);
            }
          }, 200);
        }
      });
    }

    // Side 模式显隐控制（桌面端 Hover + 触屏/窄屏 Click）
    if (this.side && this.panel) {
      let sideHideTimeout = null;
      // 窄屏形态下由胶囊按钮点击控制，不走 hover
      const canHover = () =>
        window.matchMedia("(hover: hover)").matches &&
        document.documentElement.dataset.tocSpace !== "narrow";

      this.side.addEventListener("mouseenter", () => {
        if (!canHover()) return;
        clearTimeout(sideHideTimeout);
        this.setOpen(true);
      });

      this.side.addEventListener("mouseleave", () => {
        if (!canHover()) return;
        sideHideTimeout = setTimeout(() => this.setOpen(false), 200);
      });
    }

    if (this.rail) {
      // 触控端触碰竖条展开
      this.rail.addEventListener("click", (e) => {
        if (window.matchMedia("(hover: hover)").matches) return;
        e.stopPropagation();
        this.toggleSide();
      });

      this.rail.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        this.toggleSide();
      });
    }

    if (this.sideToggle) {
      this.sideToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleSide();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setOpen(false);
      });
    }

    if (this.pinBtn) {
      this.pinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.applyPin(!this.isPinned(), true);
      });
    }

    document.addEventListener("toc:toggle", () => this.toggle());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAll();
    });

    // 全局点击遮罩关闭逻辑
    document.addEventListener("click", (e) => {
      let clickedInside = false;
      if (this.centerDropdown && this.centerToggle) {
        if (this.centerToggle.parentElement.contains(e.target)) clickedInside = true;
      }
      if (this.side && this.side.contains(e.target)) clickedInside = true;

      if (!clickedInside) {
        this.closeAll();
      }
    });

    // TOC 内链接点击进行滚动绑定
    this.container.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && link.hash) {
        e.preventDefault();
        this.scrollToTarget(link.hash);
      }
    });
  }

  toggle() {
    if (this.position === "side") {
      this.toggleSide();
    } else if (this.centerToggle) {
      this.centerToggle.click();
    }
  }

  closeAll() {
    [this.centerDropdown].forEach((dropdown) => {
      if (dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("opacity-0", "scale-95");
        dropdown.classList.remove("opacity-100", "scale-100");
        setTimeout(() => {
          dropdown.classList.add("hidden");
        }, 300);
      }
    });

    this.setOpen(false);
  }

  exposeAPI() {
    window.TOC = {
      toggle: () => this.toggle(),
      hide: () => this.closeAll(),
      pin: (pinned) => this.applyPin(pinned !== false, true),
      initialized: true,
    };
  }
}

// 延迟初始化以获取完备 DOM 渲染
// 为了防止由于诸如 pjax 等机制的无刷页面跳转导致的重复绑定，
// 可以将其赋权到 window 对象下保存唯一实例
function initTOC() {
  if (window.tocManagerInstance) return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (!window.tocManagerInstance) window.tocManagerInstance = new TOCManager();
    });
  } else {
    setTimeout(() => {
      if (!window.tocManagerInstance) window.tocManagerInstance = new TOCManager();
    }, 50);
  }
}

// 支持 pjax 或类 pjax 的页面级完全刷新
document.addEventListener("pjax:complete", () => {
  window.tocManagerInstance = null; // 重置实例
  initTOC();
});

initTOC();
