/**
 * 统一导航功能模块
 *
 * 整合 TOC 和 Series 功能，支持 Tab 切换
 * 支持三种模式：card（卡片）、left（左侧边栏）、right（右侧边栏）
 */

class NavigationManager {
  constructor() {
    this.elements = {};
    this.gumshoe = null;
    this.gumshoeToc = null;
    this.isVisible = false;
    this.currentTab = 'toc';

    this.init();
  }

  // 初始化
  init() {
    this.cacheElements();
    this.bindEvents();
    this.initGumshoe();
    this.exposeAPI();
    this.handleResize();
  }

  // 缓存 DOM 元素
  cacheElements() {
    this.elements = {
      card: document.getElementById('navigation-card'),
      overlay: document.getElementById('navigation-overlay'),
      closeBtn: document.getElementById('navigation-close'),
      tocContent: document.getElementById('nav-content-toc'),
      seriesContent: document.getElementById('nav-content-series'),
      tocTab: document.getElementById('nav-tab-toc'),
      seriesTab: document.getElementById('nav-tab-series'),
      tocSidebar: document.getElementById('toc-sidebar'),
      seriesSidebar: document.getElementById('series-sidebar'),
    };
  }

  // 绑定事件
  bindEvents() {
    const { closeBtn, overlay, tocContent, seriesContent, tocTab, seriesTab } = this.elements;

    // 关闭事件
    closeBtn?.addEventListener('click', () => this.hide());
    overlay?.addEventListener('click', () => this.hide());

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });

    // Tab 切换事件
    tocTab?.addEventListener('click', () => this.switchTab('toc'));
    seriesTab?.addEventListener('click', () => this.switchTab('series'));

    // TOC 链接点击 - 使用事件委托
    tocContent?.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      this.scrollToTarget(link.hash);
    });

    // Series 链接点击 - 直接跳转，不需要特殊处理
    seriesContent?.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      // 延迟关闭卡片
      setTimeout(() => this.hide(), 100);
    });
  }

  // 切换 Tab
  switchTab(tab) {
    const { tocContent, seriesContent, tocTab, seriesTab } = this.elements;
    
    this.currentTab = tab;

    if (tab === 'toc') {
      // 显示 TOC
      tocContent?.classList.remove('hidden');
      tocContent?.classList.add('block');
      seriesContent?.classList.add('hidden');
      seriesContent?.classList.remove('block');

      // 更新 Tab 样式
      tocTab?.classList.add('border-primary', 'text-primary');
      tocTab?.classList.remove('border-transparent', 'text-muted-foreground');
      tocTab?.setAttribute('aria-selected', 'true');

      seriesTab?.classList.remove('border-primary', 'text-primary');
      seriesTab?.classList.add('border-transparent', 'text-muted-foreground');
      seriesTab?.setAttribute('aria-selected', 'false');
    } else {
      // 显示 Series
      seriesContent?.classList.remove('hidden');
      seriesContent?.classList.add('block');
      tocContent?.classList.add('hidden');
      tocContent?.classList.remove('block');

      // 更新 Tab 样式
      seriesTab?.classList.add('border-primary', 'text-primary');
      seriesTab?.classList.remove('border-transparent', 'text-muted-foreground');
      seriesTab?.setAttribute('aria-selected', 'true');

      tocTab?.classList.remove('border-primary', 'text-primary');
      tocTab?.classList.add('border-transparent', 'text-muted-foreground');
      tocTab?.setAttribute('aria-selected', 'false');
    }
  }

  // 滚动到目标位置
  scrollToTarget(hash) {
    const targetId = this.decodeHash(hash);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // 延迟关闭目录
      setTimeout(() => this.hide(), 300);
    }
  }

  // 解码 hash
  decodeHash(hash) {
    try {
      return decodeURIComponent(hash.substring(1));
    } catch (e) {
      console.warn('Hash 解码失败:', hash);
      return hash.substring(1);
    }
  }

  // 初始化 Gumshoe
  initGumshoe() {
    if (typeof Gumshoe === 'undefined') {
      console.warn('Gumshoe 库未加载');
      return;
    }

    // TOC Gumshoe (卡片模式)
    const tocLinks = document.querySelectorAll('#nav-content-toc a');
    if (tocLinks.length > 0) {
      this.gumshoeToc = new Gumshoe('#nav-content-toc a', {
        offset: () => window.innerHeight * 0.2,
        reflow: true,
        nested: true,
        nestedClass: 'active-parent',
        navClass: 'active',
        contentClass: 'active',
        events: true,
      });
    }

    // TOC Sidebar Gumshoe
    const tocSidebarLinks = document.querySelectorAll('#toc-sidebar-content a');
    if (tocSidebarLinks.length > 0) {
      this.gumshoe = new Gumshoe('#toc-sidebar-content a', {
        offset: () => window.innerHeight * 0.2,
        reflow: true,
        nested: true,
        nestedClass: 'active-parent',
        navClass: 'active',
        contentClass: 'active',
        events: true,
      });
    }
  }

  // 显示导航卡片
  show() {
    if (!this.elements.card || this.isVisible) return;

    this.isVisible = true;
    this.toggleElements(true);
    document.body.style.overflow = 'hidden';
  }

  // 隐藏导航卡片
  hide() {
    if (!this.elements.card || !this.isVisible) return;

    this.isVisible = false;
    this.toggleElements(false);
    document.body.style.overflow = '';
  }

  // 切换导航卡片显示
  toggle() {
    this.isVisible ? this.hide() : this.show();
  }

  // 切换元素显示状态
  toggleElements(show) {
    const { card, overlay } = this.elements;

    if (show) {
      overlay?.classList.remove('opacity-0', 'pointer-events-none');
      overlay?.classList.add('opacity-100');

      card?.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      card?.classList.add('opacity-100', 'scale-100');
    } else {
      overlay?.classList.add('opacity-0', 'pointer-events-none');
      overlay?.classList.remove('opacity-100');

      card?.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      card?.classList.remove('opacity-100', 'scale-100');
    }
  }

  // 处理窗口大小变化
  handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // 如果在大屏幕且卡片打开，自动关闭
        if (window.innerWidth >= 1280 && this.isVisible) {
          this.hide();
        }
      }, 200);
    });
  }

  // 暴露 API
  exposeAPI() {
    window.Navigation = {
      show: () => this.show(),
      hide: () => this.hide(),
      toggle: () => this.toggle(),
      switchTab: (tab) => this.switchTab(tab),
      isVisible: () => this.isVisible,
      currentTab: () => this.currentTab,
      initialized: true,
    };
  }

  // 清理资源
  cleanup() {
    this.gumshoe?.destroy();
    this.gumshoeToc?.destroy();
    this.gumshoe = null;
    this.gumshoeToc = null;
  }

  // 销毁
  destroy() {
    this.cleanup();
    document.body.style.overflow = '';
  }
}

// 初始化管理器
let navigationManagerInstance = null;

function initNavigation() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      navigationManagerInstance = new NavigationManager();
    });
  } else {
    // 小延迟确保 DOM 完全渲染
    setTimeout(() => {
      navigationManagerInstance = new NavigationManager();
    }, 50);
  }
}

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  navigationManagerInstance?.destroy();
});

// 立即初始化
initNavigation();

