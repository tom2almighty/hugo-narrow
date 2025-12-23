/**
 * 目录功能模块
 *
 * 使用 Hugo 自带的 TableOfContents 和 Gumshoe 库实现目录高亮
 * 支持三种模式：card（卡片）、left（左侧边栏）、right（右侧边栏）
 *
 */

class TOCManager {
  constructor() {
    this.elements = {};
    this.gumshoe = null;
    this.gumshoeCard = null;
    this.gumshoeSidebar = null;
    this.isVisible = false;
    this.mode = this.detectMode();

    this.init();
  }

  // 检测 TOC 模式
  detectMode() {
    const sidebar = document.getElementById("toc-sidebar");
    if (sidebar && window.innerWidth >= 1280) {
      return "sidebar";
    }
    return "card";
  }

  // 初始化
  init() {
    this.cacheElements();

    // 根据模式初始化不同的功能
    if (this.mode === "sidebar") {
      this.initSidebarMode();
    } else {
      this.initCardMode();
    }

    this.exposeAPI();
    this.handleResize();
  }

  // 缓存 DOM 元素
  cacheElements() {
    this.elements = {
      card: document.getElementById("toc-card"),
      overlay: document.getElementById("toc-overlay"),
      closeBtn: document.getElementById("toc-close"),
      content: document.getElementById("toc-content"),
      sidebar: document.getElementById("toc-sidebar"),
      sidebarContent: document.getElementById("toc-sidebar-content"),
    };
  }

  // 初始化卡片模式
  initCardMode() {
    if (!this.elements.card) return;

    this.bindEvents();
    this.initGumshoeCard();
  }

  // 初始化侧边栏模式
  initSidebarMode() {
    if (!this.elements.sidebar) return;

    this.initGumshoeSidebar();
    this.bindSidebarEvents();
  }

  // 绑定卡片模式事件
  bindEvents() {
    const { closeBtn, overlay, content } = this.elements;

    // 关闭事件
    closeBtn?.addEventListener("click", () => this.hide());
    overlay?.addEventListener("click", () => this.hide());

    // ESC 键关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });

    // 目录链接点击 - 使用事件委托
    content?.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      this.scrollToTarget(link.hash);
    });
  }

  // 绑定侧边栏模式事件
  bindSidebarEvents() {
    const { sidebarContent } = this.elements;

    // 目录链接点击 - 使用事件委托
    sidebarContent?.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      this.scrollToTargetSidebar(link.hash);
    });
  }

  // 滚动到目标位置（卡片模式）
  scrollToTarget(hash) {
    const targetId = this.decodeHash(hash);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // 延迟关闭目录
      setTimeout(() => this.hide(), 300);
    }
  }

  // 滚动到目标位置（侧边栏模式）
  scrollToTargetSidebar(hash) {
    const targetId = this.decodeHash(hash);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  // 解码 hash
  decodeHash(hash) {
    try {
      return decodeURIComponent(hash.substring(1));
    } catch (e) {
      console.warn("Hash 解码失败:", hash);
      return hash.substring(1);
    }
  }

  // 初始化 Gumshoe（卡片模式）
  initGumshoeCard() {
    if (typeof Gumshoe === "undefined") {
      console.warn("Gumshoe 库未加载");
      return;
    }

    const tocLinks = document.querySelectorAll("#toc-content a");
    if (tocLinks.length === 0) return;

    this.gumshoeCard = new Gumshoe("#toc-content a", {
      offset: () => window.innerHeight * 0.2,
      reflow: true,
      nested: true,
      nestedClass: "active-parent",
      navClass: "active",
      contentClass: "active",
      events: true,
    });
  }

  // 初始化 Gumshoe（侧边栏模式）
  initGumshoeSidebar() {
    if (typeof Gumshoe === "undefined") {
      console.warn("Gumshoe 库未加载");
      return;
    }

    const tocLinks = document.querySelectorAll("#toc-sidebar-content a");
    if (tocLinks.length === 0) return;

    this.gumshoeSidebar = new Gumshoe("#toc-sidebar-content a", {
      offset: () => window.innerHeight * 0.2,
      reflow: true,
      nested: true,
      nestedClass: "active-parent",
      navClass: "active",
      contentClass: "active",
      events: true,
    });
  }

  // 显示目录
  show() {
    if (!this.elements.card || this.isVisible) return;

    this.isVisible = true;
    this.toggleElements(true);
    document.body.style.overflow = "hidden";
  }

  // 隐藏目录
  hide() {
    if (!this.elements.card || !this.isVisible) return;

    this.isVisible = false;
    this.toggleElements(false);
    document.body.style.overflow = "";
  }

  // 切换目录显示
  toggle() {
    this.isVisible ? this.hide() : this.show();
  }

  // 切换元素显示状态
  toggleElements(show) {
    const { card, overlay } = this.elements;

    if (show) {
      overlay.classList.remove("opacity-0", "pointer-events-none");
      overlay.classList.add("opacity-100");

      card.classList.remove("opacity-0", "scale-95", "pointer-events-none");
      card.classList.add("opacity-100", "scale-100");
    } else {
      overlay.classList.add("opacity-0", "pointer-events-none");
      overlay.classList.remove("opacity-100");

      card.classList.add("opacity-0", "scale-95", "pointer-events-none");
      card.classList.remove("opacity-100", "scale-100");
    }
  }

  // 处理窗口大小变化
  handleResize() {
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newMode = this.detectMode();
        if (newMode !== this.mode) {
          // 模式切换，重新初始化
          this.cleanup();
          this.mode = newMode;
          this.cacheElements();
          if (this.mode === "sidebar") {
            this.initSidebarMode();
          } else {
            this.initCardMode();
          }
        }
      }, 200);
    });
  }

  // 暴露 API
  exposeAPI() {
    window.TOC = {
      show: () => this.show(),
      hide: () => this.hide(),
      toggle: () => this.toggle(),
      isVisible: () => this.isVisible,
      mode: () => this.mode,
      initialized: true,
    };
  }

  // 清理资源
  cleanup() {
    this.gumshoeCard?.destroy();
    this.gumshoeSidebar?.destroy();
    this.gumshoeCard = null;
    this.gumshoeSidebar = null;
  }

  // 销毁
  destroy() {
    this.cleanup();
    document.body.style.overflow = "";
  }
}

// 初始化管理器
let tocManagerInstance = null;

function initTOC() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      tocManagerInstance = new TOCManager();
    });
  } else {
    // 小延迟确保 DOM 完全渲染
    setTimeout(() => {
      tocManagerInstance = new TOCManager();
    }, 50);
  }
}

// 页面卸载时清理
window.addEventListener("beforeunload", () => {
  tocManagerInstance?.destroy();
});

// 立即初始化
initTOC();
