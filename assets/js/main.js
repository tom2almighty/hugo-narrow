// UI管理器 - 管理主题、下拉菜单等界面交互
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
    this.setupEventListeners();
    this.updateUI();
  }

  // 通用下拉菜单处理函数 - 统一处理所有类型的菜单
  setupDropdown(type) {
    const toggleSelector = `.dropdown-toggle[data-dropdown-type="${type}"]`;
    const dropdownSelector = `.dropdown-menu[data-dropdown-type="${type}"]`;

    const toggles = document.querySelectorAll(toggleSelector);
    const dropdowns = document.querySelectorAll(dropdownSelector);

    toggles.forEach((toggle, index) => {
      const dropdown = dropdowns[index] || dropdowns[0];
      if (toggle && dropdown) {
        toggle.addEventListener("click", (e) => {
          e.stopPropagation();

          // 关闭其他所有类型的菜单
          this.closeOtherMenus(type);

          // 关闭同类型的其他下拉菜单
          document.querySelectorAll(dropdownSelector).forEach(d => {
            if (d !== dropdown) {
              d.classList.add("hidden");
              // 更新对应按钮的 aria-expanded
              const correspondingToggle = document.querySelector(`${toggleSelector}[aria-labelledby="${d.getAttribute('aria-labelledby')}"], ${toggleSelector}[aria-controls="${d.id}"]`);
              if (correspondingToggle) {
                correspondingToggle.setAttribute("aria-expanded", "false");
              }
            }
          });

          // 切换当前下拉菜单
          const isHidden = dropdown.classList.contains("hidden");
          dropdown.classList.toggle("hidden");

          // 更新当前按钮的 aria-expanded 属性
          toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");

          // 如果是移动端菜单，添加特殊处理
          if (type === "mobile-menu") {
            this.handleMobileMenuClick(dropdown, toggle);
          }
        });
      }
    });
  }

  // 关闭其他类型的菜单 - 统一处理所有菜单类型
  closeOtherMenus(currentType) {
    const allTypes = ['color-scheme', 'theme', 'language', 'mobile-menu'];
    allTypes.forEach(type => {
      if (type !== currentType) {
        document.querySelectorAll(`.dropdown-menu[data-dropdown-type="${type}"]`)
          .forEach(d => {
            d.classList.add("hidden");
            // 更新对应按钮的 aria-expanded
            const toggle = document.querySelector(`.dropdown-toggle[data-dropdown-type="${type}"]`);
            if (toggle) {
              toggle.setAttribute("aria-expanded", "false");
            }
          });
      }
    });
  }

  // 关闭所有下拉菜单
  closeAllDropdowns() {
    document.querySelectorAll(".dropdown-menu")
      .forEach(d => {
        d.classList.add("hidden");
        // 更新对应按钮的 aria-expanded
        const dropdownType = d.getAttribute("data-dropdown-type");
        if (dropdownType) {
          const toggle = document.querySelector(`.dropdown-toggle[data-dropdown-type="${dropdownType}"]`);
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        }
      });
  }

  // 关闭移动端菜单 - 保持向后兼容
  closeMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
    }

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    }
  }

  // 关闭所有菜单（包括下拉菜单和移动端菜单）
  closeAllMenus() {
    this.closeAllDropdowns();
  }

  // 移动端菜单特殊处理 - 点击菜单项后自动关闭
  handleMobileMenuClick(dropdown, toggle) {
    // 点击菜单项后关闭菜单
    dropdown.addEventListener("click", (e) => {
      const link = e.target.closest('a[href]');
      if (link) {
        // 延迟关闭，让导航有时间完成
        setTimeout(() => {
          dropdown.classList.add("hidden");
          toggle.setAttribute("aria-expanded", "false");
        }, 100);
      }
    });
  }

  // 设置移动端菜单 - 保持向后兼容，但现在使用统一的 setupDropdown
  setupMobileMenu() {
    // 这个方法现在主要用于向后兼容
    // 实际的事件处理由 setupDropdown("mobile-menu") 完成
    console.log("移动端菜单使用统一的下拉菜单处理逻辑");
  }

  setupEventListeners() {
    // 设置所有下拉菜单，包括移动端菜单
    this.setupDropdown("mobile-menu");
    this.setupDropdown("color-scheme");
    this.setupDropdown("theme");
    this.setupDropdown("language");

    // 主题风格选择事件
    const colorSchemeDropdowns = document.querySelectorAll(
      '.dropdown-menu[data-dropdown-type="color-scheme"]',
    );
    colorSchemeDropdowns.forEach((dropdown) => {
      if (dropdown) {
        dropdown.addEventListener("click", (e) => {
          const button = e.target.closest("[data-color-scheme]");
          if (button) {
            const newColorScheme = button.getAttribute("data-color-scheme");
            this.setColorScheme(newColorScheme);
            this.closeAllMenus();
          }
        });
      }
    });

    // 明暗模式选择事件
    const themeDropdowns = document.querySelectorAll(
      '.dropdown-menu[data-dropdown-type="theme"]',
    );
    themeDropdowns.forEach((dropdown) => {
      if (dropdown) {
        dropdown.addEventListener("click", (e) => {
          const button = e.target.closest("[data-theme]");
          if (button) {
            const newTheme = button.getAttribute("data-theme");
            this.setTheme(newTheme);
            this.closeAllMenus();
          }
        });
      }
    });

    // 点击外部关闭所有菜单 - 统一处理
    document.addEventListener("click", (e) => {
      // 检查是否点击在任何菜单相关元素内
      const isClickInsideMenu = e.target.closest('.dropdown-toggle, .dropdown-menu');

      // 如果点击在外部，关闭所有菜单
      if (!isClickInsideMenu) {
        this.closeAllMenus();
      }
    });

    // 键盘导航支持 - ESC键关闭所有菜单
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllMenus();
      }
    });

    // 监听系统主题变化
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (this.theme === "system") {
          this.applyTheme();
          this.updateUI();
        }
      });
  }

  setColorScheme(colorScheme) {
    this.colorScheme = colorScheme;
    localStorage.setItem("colorScheme", colorScheme);
    document.documentElement.setAttribute("data-theme", colorScheme);
    this.updateUI();

    // 触发自定义事件，通知主题已更改
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { colorScheme: colorScheme, theme: this.theme },
      }),
    );
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    this.applyTheme();
    this.updateUI();

    // 触发自定义事件，通知主题已更改
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { colorScheme: this.colorScheme, theme: theme },
      }),
    );
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

console.log("Hugo site with advanced UI management loaded.");
