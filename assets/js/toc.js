/**
 * 目录功能模块 (Native IntersectionObserver)
 */
class TOCManager {
  constructor() {
    this.container = document.getElementById("toc-container");
    if (!this.container) return;
    
    this.position = this.container.dataset.position || "center";
    this.headings = [];
    this.tocLinks = [];
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
    
    // 清理可能存在的遗留 DOM 节点以防多次加载（特别是由 PJAX/Turbo 机制等造成的重复）
    if (this.sideIndicator) {
      this.sideIndicator.innerHTML = "";
    }

    if (this.position === "side") {
      this.generateSideBlocks();
      this.updateSideBlocks();
    }
    
    this.initialized = true;
    this.exposeAPI();
  }

  setupElements() {
    // 找出所有的相关 DOM 元素
    Object.assign(this, {
      centerDropdown: document.getElementById("toc-center-dropdown"),
      centerToggle: document.getElementById("toc-center-toggle"),
      centerTitle: document.getElementById("toc-center-title"),
      
      sideIndicator: document.getElementById("toc-side-indicator"),
      sideDropdown: document.getElementById("toc-side-dropdown"),
      sideCloseBtn: document.getElementById("toc-side-close")
    });

    const links = document.querySelectorAll('#toc-container nav#TableOfContents a');
    const headingIds = [];
    
    links.forEach(link => {
      this.tocLinks.push(link);
      try {
        const urlList = link.href.split('#');
        const id = decodeURIComponent(urlList[urlList.length - 1]);
        if (id) headingIds.push(id);
      } catch (e) {
        if (link.hash.substring(1)) headingIds.push(link.hash.substring(1));
      }
    });

    // 找到具体的文章正文中的标题节点
    headingIds.forEach(id => {
      // 避免 id 内有特殊字符引发选择器问题，直接原样使用 id 取值
      const el = document.getElementById(id);
      if (el) {
        this.headings.push(el);
      }
    });
  }

  setupObserver() {
    // 观察器回调
    const callback = (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // 使用在屏幕中最靠上的标题作为当前高亮的标题
        let topEntry = visibleEntries[0];
        visibleEntries.forEach(entry => {
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
      threshold: [0, 1]
    });

    this.headings.forEach(heading => {
      this.observer.observe(heading);
    });
  }
  
  setActive(id) {
    if (!id) return;
    this.activeParam = id;
    const hash = '#' + id;
    let activeText = "";
    
    this.tocLinks.forEach(link => {
      const parentLi = link.closest('li');
      let linkHash = "";
      try {
        const urlList = link.href.split('#');
        linkHash = decodeURIComponent(urlList[urlList.length - 1]);
      } catch (e) {}

      if (linkHash === decodeURIComponent(id)) {
        link.classList.add("active", "font-medium");
        if(parentLi) parentLi.classList.add("active");
        activeText = link.textContent;
      } else {
        link.classList.remove("active", "font-medium");
        if(parentLi) parentLi.classList.remove("active");
      }
    });
    
    if (activeText) {
      if (this.centerTitle) this.centerTitle.textContent = activeText;
    }
    
    if (this.position === "side") {
      this.updateSideBlocks();
    }
  }

  generateSideBlocks() {
    if (!this.sideIndicator) return;
    this.sideIndicator.innerHTML = ""; // 强行清理已存 DOM 避免重复渲染
    
    this.tocLinks.forEach(link => {
      // 通过 DOM 树的 ul 嵌套深度来推断 header 层级
      let depth = 0;
      let el = link.parentElement;
      while (el && el.id !== 'TableOfContents') {
        if (el.tagName && el.tagName.toLowerCase() === 'ul') {
          depth++;
        }
        el = el.parentElement;
      }
      
      const block = document.createElement("div");
      // 用不同的宽表达不同的层级，进一步减小贴紧程度
      let widthClass = "w-4";
      if (depth === 2) widthClass = "w-3";
      else if (depth === 3) widthClass = "w-2";
      else if (depth >= 4) widthClass = "w-1";
      
      block.className = `h-1 ${widthClass} rounded-l-full rounded-r-none transition-all duration-300 bg-muted/50 block-item hover:bg-primary/60`;
      
      let blockHash = "";
      try {
        const urlList = link.href.split('#');
        blockHash = urlList[urlList.length - 1];
      } catch (e) {
        blockHash = link.hash.substring(1);
      }
      block.dataset.hash = blockHash;
      
      block.addEventListener("click", (e) => {
        // 如果是触控设备不支持 hover，此时点击色块不应触发滚动，而是交给父级去触发展开卡块的逻辑
        if (!window.matchMedia("(hover: hover)").matches) {
          return;
        }
        e.stopPropagation();
        this.scrollToTarget(link.hash);
      });
      
      this.sideIndicator.appendChild(block);
    });
  }

  updateSideBlocks() {
    if (!this.sideIndicator) return;
    const blocks = this.sideIndicator.querySelectorAll(".block-item");
    blocks.forEach(block => {
      let blockHash = block.dataset.hash;
      try { blockHash = decodeURIComponent(blockHash); } catch(e){}
      
      if (blockHash === decodeURIComponent(this.activeParam)) {
        block.classList.remove("bg-muted/50");
        block.classList.add("bg-primary", "scale-x-110", "origin-right");
      } else {
        block.classList.remove("bg-primary", "scale-x-110", "origin-right");
        block.classList.add("bg-muted/50");
      }
    });
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
        behavior: "smooth"
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

    // Side 模式显隐控制网络（包含 Hover 桌面端和 Click 触屏端）
    if (this.sideIndicator && this.sideDropdown) {
      const container = this.sideIndicator.parentElement;
      let sideHideTimeout = null;
      
      const toggleSide = (forceHoverActive) => {
        if (forceHoverActive) {
          this.sideDropdown.classList.add("is-open");
        } else {
          this.sideDropdown.classList.remove("is-open");
        }
      };

      // JS接管的 PC端 Hover 事件
      container.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          clearTimeout(sideHideTimeout);
          toggleSide(true);
        }
      });

      container.addEventListener("mouseleave", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          sideHideTimeout = setTimeout(() => {
            toggleSide(false);
          }, 200);
        }
      });

      // 触控端触碰展出逻辑
      this.sideIndicator.addEventListener("click", (e) => {
        if (!window.matchMedia("(hover: hover)").matches) {
           e.stopPropagation();
           this.sideCloseBtn?.classList.add("is-touch"); // 确保移动端出现关闭按钮
           this.sideDropdown.classList.toggle("is-open");
        }
      });
    }

    if (this.sideCloseBtn) {
      this.sideCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.sideDropdown) {
          this.sideDropdown.classList.remove("is-open");
        }
      });
    }

    // 全局点击遮罩关闭逻辑
    document.addEventListener("click", (e) => {
      let clickedInside = false;
      if (this.centerDropdown && this.centerToggle) {
        if (this.centerToggle.parentElement.contains(e.target)) clickedInside = true;
      }
      if (this.sideIndicator && this.sideDropdown) {
         if (this.sideIndicator.parentElement.contains(e.target) || this.sideDropdown.contains(e.target)) clickedInside = true;
      }
      
      if (!clickedInside) {
        this.closeAll();
      }
    });

    // TOC 内链接点击进行滚动绑定
    this.container.addEventListener("click", (e) => {
      const link = e.target.closest('a');
      if (link && link.hash) {
        e.preventDefault();
        this.scrollToTarget(link.hash);
      }
    });
  }

  closeAll() {
    [this.centerDropdown].forEach(dropdown => {
      if (dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("opacity-0", "scale-95");
        dropdown.classList.remove("opacity-100", "scale-100");
        setTimeout(() => {
          dropdown.classList.add("hidden");
        }, 300);
      }
    });

    if (this.sideDropdown && this.sideDropdown.classList.contains("is-open")) {
      this.sideDropdown.classList.remove("is-open");
    }
  }

  exposeAPI() {
    window.TOC = {
      toggle: () => {
        if (this.position === "center" && this.centerToggle) {
          this.centerToggle.click();
        }
      },
      hide: () => this.closeAll(),
      initialized: true
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
