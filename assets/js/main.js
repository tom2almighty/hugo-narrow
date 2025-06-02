// 主题管理器
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'system';
    this.colorScheme = localStorage.getItem('colorScheme') || document.documentElement.getAttribute('data-theme') || 'shadcn';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // 移动端菜单切换
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // 主题风格切换 - 支持多个按钮
    const colorSchemeToggles = document.querySelectorAll('.color-scheme-toggle, #color-scheme-toggle');
    const colorSchemeDropdowns = document.querySelectorAll('.color-scheme-dropdown, #color-scheme-dropdown');

    colorSchemeToggles.forEach((toggle, index) => {
      const dropdown = colorSchemeDropdowns[index] || colorSchemeDropdowns[0];
      if (toggle && dropdown) {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          // 关闭所有下拉菜单
          document.querySelectorAll('.theme-dropdown, #theme-dropdown').forEach(d => d.classList.add('hidden'));
          document.querySelectorAll('.color-scheme-dropdown, #color-scheme-dropdown').forEach(d => d.classList.add('hidden'));
          // 打开当前下拉菜单
          dropdown.classList.toggle('hidden');
        });
      }
    });

    // 主题风格选择 - 支持所有下拉菜单
    colorSchemeDropdowns.forEach(dropdown => {
      if (dropdown) {
        dropdown.addEventListener('click', (e) => {
          const button = e.target.closest('[data-color-scheme]');
          if (button) {
            const newColorScheme = button.getAttribute('data-color-scheme');
            this.setColorScheme(newColorScheme);
            // 关闭所有下拉菜单
            document.querySelectorAll('.color-scheme-dropdown, #color-scheme-dropdown').forEach(d => d.classList.add('hidden'));
          }
        });
      }
    });

    // 明暗模式切换 - 支持多个按钮
    const themeToggles = document.querySelectorAll('.theme-toggle, #theme-toggle');
    const themeDropdowns = document.querySelectorAll('.theme-dropdown, #theme-dropdown');

    themeToggles.forEach((toggle, index) => {
      const dropdown = themeDropdowns[index] || themeDropdowns[0];
      if (toggle && dropdown) {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          // 关闭所有下拉菜单
          document.querySelectorAll('.color-scheme-dropdown, #color-scheme-dropdown').forEach(d => d.classList.add('hidden'));
          document.querySelectorAll('.theme-dropdown, #theme-dropdown').forEach(d => d.classList.add('hidden'));
          // 打开当前下拉菜单
          dropdown.classList.toggle('hidden');
        });
      }
    });

    // 明暗模式选择 - 支持所有下拉菜单
    themeDropdowns.forEach(dropdown => {
      if (dropdown) {
        dropdown.addEventListener('click', (e) => {
          const button = e.target.closest('[data-theme]');
          if (button) {
            const newTheme = button.getAttribute('data-theme');
            this.setTheme(newTheme);
            // 关闭所有下拉菜单
            document.querySelectorAll('.theme-dropdown, #theme-dropdown').forEach(d => d.classList.add('hidden'));
          }
        });
      }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', () => {
      document.querySelectorAll('.color-scheme-dropdown, #color-scheme-dropdown').forEach(d => d.classList.add('hidden'));
      document.querySelectorAll('.theme-dropdown, #theme-dropdown').forEach(d => d.classList.add('hidden'));
    });

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme === 'system') {
        this.applyTheme();
        this.updateUI();
      }
    });
  }

  setColorScheme(colorScheme) {
    this.colorScheme = colorScheme;
    localStorage.setItem('colorScheme', colorScheme);
    document.documentElement.setAttribute('data-theme', colorScheme);
    this.updateUI();

    // 触发自定义事件，通知主题已更改
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { colorScheme: colorScheme, theme: this.theme }
    }));
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
    this.updateUI();

    // 触发自定义事件，通知主题已更改
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { colorScheme: this.colorScheme, theme: theme }
    }));
  }

  applyTheme() {
    if (this.theme === 'dark' || (this.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  updateUI() {
    // 更新主题图标显示 - 支持类选择器和 ID 选择器
    const sunIcons = document.querySelectorAll('.sun-icon, #sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon, #moon-icon');
    const systemIcons = document.querySelectorAll('.system-icon, #system-icon');

    // 隐藏所有图标
    [...sunIcons, ...moonIcons, ...systemIcons].forEach(icon => {
      if (icon) icon.classList.add('hidden');
    });

    // 显示当前主题对应的图标
    if (this.theme === 'light') {
      sunIcons.forEach(icon => icon.classList.remove('hidden'));
    } else if (this.theme === 'dark') {
      moonIcons.forEach(icon => icon.classList.remove('hidden'));
    } else if (this.theme === 'system') {
      systemIcons.forEach(icon => icon.classList.remove('hidden'));
    }

    // 更新下拉菜单中的选中状态
    this.updateDropdownSelection();
  }

  updateDropdownSelection() {
    // 更新主题风格选择状态
    document.querySelectorAll('[data-color-scheme]').forEach(button => {
      const isSelected = button.getAttribute('data-color-scheme') === this.colorScheme;
      button.classList.toggle('bg-accent', isSelected);
      button.classList.toggle('text-accent-foreground', isSelected);
    });

    // 更新明暗模式选择状态
    document.querySelectorAll('[data-theme]').forEach(button => {
      const isSelected = button.getAttribute('data-theme') === this.theme;
      button.classList.toggle('bg-accent', isSelected);
      button.classList.toggle('text-accent-foreground', isSelected);
    });
  }
}

// 页面加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});

console.log("Hugo site with advanced theme management loaded.");
