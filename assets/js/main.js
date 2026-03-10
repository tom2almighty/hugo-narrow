// ── ToolDropdown：工具类下拉菜单（主题/语言/配色） ──────────────────
class ToolDropdown {
  constructor(uiManager) {
    this.ui = uiManager;
    this.types = ["color-scheme", "theme", "language"];
    this.setup();
  }

  setup() {
    this.types.forEach((type) => this.bindToggle(type));
  }

  bindToggle(type) {
    const toggleSelector = `.dropdown-toggle[data-dropdown-type="${type}"]`;
    const dropdownSelector = `.dropdown-menu[data-dropdown-type="${type}"]`;

    document.querySelectorAll(toggleSelector).forEach((toggle, index) => {
      const dropdown = document.querySelectorAll(dropdownSelector)[index]
        || document.querySelector(dropdownSelector);
      if (!toggle || !dropdown) return;

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();

        // 关闭导航面板（互斥）
        this.ui.navDisclosure.closePanel();

        // 关闭其他工具下拉
        this.closeAllExcept(type);

        // 切换当前下拉
        const isHidden = dropdown.classList.contains("hidden");
        dropdown.classList.toggle("hidden");
        toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
      });
    });
  }

  closeAllExcept(exceptType) {
    this.types.forEach((type) => {
      if (type === exceptType) return;
      document.querySelectorAll(`.dropdown-menu[data-dropdown-type="${type}"]`)
        .forEach((d) => d.classList.add("hidden"));
      document.querySelectorAll(`.dropdown-toggle[data-dropdown-type="${type}"]`)
        .forEach((t) => t.setAttribute("aria-expanded", "false"));
    });
  }

  closeAll() {
    this.closeAllExcept(null);
  }
}

// ── NavDisclosure：导航展开面板（移动端宽面板 + 桌面端子菜单） ────────
class NavDisclosure {
  constructor(uiManager) {
    this.ui = uiManager;
    this.panel = document.getElementById("mobile-nav-panel");
    this.toggle = document.getElementById("mobile-nav-toggle");
    this.setup();
  }

  setup() {
    this.setupPanelToggle();
    this.setupAccordions();
    this.setupDesktopSubmenus();
    this.setupPanelLinkClose();
  }

  // 汉堡按钮 → 切换宽面板
  setupPanelToggle() {
    if (!this.toggle || !this.panel) return;

    this.toggle.addEventListener("click", (e) => {
      e.stopPropagation();

      // 关闭工具下拉（互斥）
      this.ui.toolDropdown.closeAll();

      const isHidden = this.panel.classList.contains("hidden");
      if (isHidden) {
        this.openPanel();
      } else {
        this.closePanel();
      }
    });
  }

  openPanel() {
    if (!this.panel || !this.toggle) return;
    this.panel.classList.remove("hidden");
    this.toggle.setAttribute("aria-expanded", "true");
  }

  closePanel() {
    if (!this.panel) return;
    this.panel.classList.add("hidden");
    if (this.toggle) {
      this.toggle.setAttribute("aria-expanded", "false");
    }
    // 重置所有手风琴子菜单
    this.closeAllAccordions();
  }

  // 手风琴子菜单（同一时间只展开一个）
  setupAccordions() {
    document.querySelectorAll(".nav-accordion-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = toggle.getAttribute("data-accordion-id");
        const panel = document.querySelector(`.nav-accordion-panel[data-accordion-id="${id}"]`);
        if (!panel) return;

        const isOpen = toggle.getAttribute("aria-expanded") === "true";

        // 先折叠所有
        this.closeAllAccordions();

        // 若之前是关闭的，则打开
        if (!isOpen) {
          panel.style.gridTemplateRows = "1fr";
          panel.setAttribute("aria-hidden", "false");
          toggle.setAttribute("aria-expanded", "true");
          toggle.querySelector(".accordion-chevron")?.classList.add("rotate-180");
          toggle.classList.add("bg-primary/10", "text-primary");
        }
      });
    });
  }

  closeAllAccordions() {
    document.querySelectorAll(".nav-accordion-panel").forEach((panel) => {
      panel.style.gridTemplateRows = "0fr";
      panel.setAttribute("aria-hidden", "true");
    });
    document.querySelectorAll(".nav-accordion-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".accordion-chevron")?.classList.remove("rotate-180");
      toggle.classList.remove("bg-primary/10", "text-primary");
    });
  }

  // 桌面端子菜单（保留 absolute 浮层行为）
  setupDesktopSubmenus() {
    document.querySelectorAll(".nav-submenu-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = toggle.getAttribute("data-submenu-id");
        const submenu = document.querySelector(`.nav-submenu[data-submenu-id="${id}"]`);
        if (!submenu) return;

        const isOpen = !submenu.classList.contains("hidden");

        // 关闭工具下拉（互斥）
        this.ui.toolDropdown.closeAll();
        // 关闭所有桌面端子菜单
        this.closeAllDesktopSubmenus();

        if (!isOpen) {
          submenu.classList.remove("hidden");
          toggle.setAttribute("aria-expanded", "true");
          toggle.querySelector(".submenu-chevron")?.classList.add("rotate-180");
        }
      });
    });
  }

  closeAllDesktopSubmenus() {
    document.querySelectorAll(".nav-submenu").forEach((submenu) => {
      submenu.classList.add("hidden");
      const id = submenu.getAttribute("data-submenu-id");
      const toggle = document.querySelector(`.nav-submenu-toggle[data-submenu-id="${id}"]`);
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.querySelector(".submenu-chevron")?.classList.remove("rotate-180");
      }
    });
  }

  // 面板内链接点击 → 自动关闭面板（事件委托，一次性绑定）
  setupPanelLinkClose() {
    if (!this.panel) return;

    this.panel.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (link) {
        setTimeout(() => this.closePanel(), 100);
      }
    });
  }

  // 关闭所有导航相关（面板 + 桌面子菜单）
  closeAll() {
    this.closePanel();
    this.closeAllDesktopSubmenus();
  }
}

// ── UIManager：协调层 ─────────────────────────────────────────────
class UIManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "system";
    this.colorScheme =
      localStorage.getItem("colorScheme") ||
      document.documentElement.getAttribute("data-theme") ||
      "default";
    this.init();
  }

  init() {
    // 先创建两套子系统（互相引用通过 this.ui）
    this.navDisclosure = new NavDisclosure(this);
    this.toolDropdown = new ToolDropdown(this);
    this.setupGlobalListeners();
    this.updateUI();
  }

  // 关闭所有菜单
  closeAllMenus() {
    this.toolDropdown.closeAll();
    this.navDisclosure.closeAll();
  }

  setupGlobalListeners() {
    // 主题风格选择事件
    document.querySelectorAll('.dropdown-menu[data-dropdown-type="color-scheme"]')
      .forEach((dropdown) => {
        dropdown.addEventListener("click", (e) => {
          const button = e.target.closest("[data-color-scheme]");
          if (button) {
            this.setColorScheme(button.getAttribute("data-color-scheme"));
            this.closeAllMenus();
          }
        });
      });

    // 明暗模式选择事件
    document.querySelectorAll('.dropdown-menu[data-dropdown-type="theme"]')
      .forEach((dropdown) => {
        dropdown.addEventListener("click", (e) => {
          const button = e.target.closest("[data-theme]");
          if (button) {
            this.setTheme(button.getAttribute("data-theme"));
            this.closeAllMenus();
          }
        });
      });

    // 点击外部关闭所有菜单
    document.addEventListener("click", (e) => {
      const isInside = e.target.closest(
        ".dropdown-toggle, .dropdown-menu, " +
        ".nav-submenu-toggle, .nav-submenu, " +
        ".nav-panel-toggle, #mobile-nav-panel"
      );
      if (!isInside) {
        this.closeAllMenus();
      }
    });

    // ESC 关闭
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllMenus();
      }
    });

    // 监听系统主题变化
    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (this.theme === "system") {
          this.applyTheme();
          this.updateUI();
        }
      });
  }

  emitThemeChanged() {
    const detail = { colorScheme: this.colorScheme, theme: this.theme };

    window.dispatchEvent(new CustomEvent("theme:changed", { detail }));
    window.dispatchEvent(new CustomEvent("themeChanged", { detail }));
  }

  setColorScheme(colorScheme) {
    this.colorScheme = colorScheme;
    localStorage.setItem("colorScheme", colorScheme);
    document.documentElement.setAttribute("data-theme", colorScheme);
    this.updateUI();
    this.emitThemeChanged();
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    this.applyTheme();
    this.updateUI();
    this.emitThemeChanged();
  }

  applyTheme() {
    if (
      this.theme === "dark" ||
      (this.theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  updateUI() {
    // 更新主题图标显示 - 支持类选择器和 ID 选择器
    const sunIcons = document.querySelectorAll(".sun-icon, #sun-icon");
    const moonIcons = document.querySelectorAll(".moon-icon, #moon-icon");
    const systemIcons = document.querySelectorAll(".system-icon, #system-icon");

    // 隐藏所有图标
    [...sunIcons, ...moonIcons, ...systemIcons].forEach((icon) => {
      if (icon) icon.classList.add("hidden");
    });

    // 显示当前主题对应的图标
    if (this.theme === "light") {
      sunIcons.forEach((icon) => icon.classList.remove("hidden"));
    } else if (this.theme === "dark") {
      moonIcons.forEach((icon) => icon.classList.remove("hidden"));
    } else if (this.theme === "system") {
      systemIcons.forEach((icon) => icon.classList.remove("hidden"));
    }

    // 更新下拉菜单中的选中状态
    this.updateDropdownSelection();
  }

  updateDropdownSelection() {
    // 更新主题风格选择状态
    document.querySelectorAll("[data-color-scheme]").forEach((button) => {
      const isSelected =
        button.getAttribute("data-color-scheme") === this.colorScheme;
      button.classList.toggle("bg-accent", isSelected);
      button.classList.toggle("text-accent-foreground", isSelected);
    });

    // 更新明暗模式选择状态
    document.querySelectorAll("[data-theme]").forEach((button) => {
      const isSelected = button.getAttribute("data-theme") === this.theme;
      button.classList.toggle("bg-accent", isSelected);
      button.classList.toggle("text-accent-foreground", isSelected);
    });

    // 更新语言切换选择状态
    const currentLang = document.documentElement.lang || 'en';
    document.querySelectorAll('.dropdown-menu[data-dropdown-type="language"] a[role="menuitem"]').forEach((link) => {
      // 从链接的href中提取语言代码
      const href = link.getAttribute('href');
      const isSelected = this.isCurrentLanguageLink(href, currentLang);
      link.classList.toggle("bg-accent", isSelected);
      link.classList.toggle("text-accent-foreground", isSelected);
    });
  }

  // 辅助方法：判断链接是否为当前语言
  isCurrentLanguageLink(href, currentLang) {
    // 处理根路径的情况
    if (href === '/' && currentLang === 'en') {
      return true;
    }

    // 处理语言前缀路径的情况 (如 /zh/, /en/)
    const langPattern = new RegExp(`^/${currentLang}(/|$)`);
    return langPattern.test(href);
  }
}

// 页面加载完成后初始化UI管理器
document.addEventListener("DOMContentLoaded", () => {
  new UIManager();
});
