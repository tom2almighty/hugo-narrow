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

  // 通用下拉菜单处理函数
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
          // 关闭其他类型的下拉菜单
          this.closeOtherDropdowns(type);
          // 关闭同类型的其他下拉菜单
          document.querySelectorAll(dropdownSelector).forEach(d => {
            if (d !== dropdown) d.classList.add("hidden");
          });
          // 切换当前下拉菜单
          dropdown.classList.toggle("hidden");
        });
      }
    });
  }

  // 关闭其他类型的下拉菜单
  closeOtherDropdowns(currentType) {
    const allTypes = ['color-scheme', 'theme', 'language'];
    allTypes.forEach(type => {
      if (type !== currentType) {
        document.querySelectorAll(`.dropdown-menu[data-dropdown-type="${type}"]`)
          .forEach(d => d.classList.add("hidden"));
      }
    });
  }

  // 关闭所有下拉菜单
  closeAllDropdowns() {
    document.querySelectorAll(".dropdown-menu")
      .forEach(d => d.classList.add("hidden"));
  }

  setupEventListeners() {
    // 移动端菜单切换
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // 设置所有下拉菜单
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
            this.closeAllDropdowns();
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
            this.closeAllDropdowns();
          }
        });
      }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener("click", (e) => {
      // 检查是否点击在任何下拉菜单相关元素内
      const isClickInsideAnyDropdown = e.target.closest('.dropdown-toggle, .dropdown-menu');

      // 如果点击在外部，关闭所有下拉菜单
      if (!isClickInsideAnyDropdown) {
        this.closeAllDropdowns();
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
  }
}

// 页面加载完成后初始化UI管理器
document.addEventListener("DOMContentLoaded", () => {
  new UIManager();
});

console.log("Hugo site with advanced UI management loaded.");
