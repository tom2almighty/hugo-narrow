// ToolDropdown: theme/language/color-scheme menus.
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

    document.querySelectorAll(toggleSelector).forEach((toggle) => {
      const wrapper = toggle.closest(".relative") || toggle.parentElement;
      const dropdown = wrapper?.querySelector(dropdownSelector);
      if (!toggle || !dropdown) return;

      toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        this.ui.navDisclosure.closePanel({ restoreFocus: false });

        const isHidden = dropdown.classList.contains("hidden");
        this.closeAll(toggle, dropdown);

        if (isHidden) {
          dropdown.classList.remove("hidden");
          toggle.setAttribute("aria-expanded", "true");
          return;
        }

        dropdown.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  closeAll(exceptToggle = null, exceptDropdown = null) {
    this.types.forEach((type) => {
      document
        .querySelectorAll(`.dropdown-menu[data-dropdown-type="${type}"]`)
        .forEach((dropdown) => {
          if (dropdown === exceptDropdown) return;
          dropdown.classList.add("hidden");
        });

      document
        .querySelectorAll(`.dropdown-toggle[data-dropdown-type="${type}"]`)
        .forEach((toggle) => {
          if (toggle === exceptToggle) return;
          toggle.setAttribute("aria-expanded", "false");
        });
    });
  }
}

// NavDisclosure: mobile sheet + desktop submenus.
class NavDisclosure {
  constructor(uiManager) {
    this.ui = uiManager;
    this.panel = document.getElementById("mobile-nav-panel");
    this.toggle = document.getElementById("mobile-nav-toggle");
    this.lastFocusedElement = null;
    this.previousBodyOverflow = "";
    this.setup();
  }

  setup() {
    this.setupPanelToggle();
    this.setupAccordions();
    this.setupDesktopSubmenus();
    this.setupPanelLinkClose();
    this.setupPanelKeyboard();
  }

  setupPanelToggle() {
    if (!this.toggle || !this.panel) return;

    this.toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      this.ui.toolDropdown.closeAll();

      if (this.panel.classList.contains("hidden")) {
        this.openPanel();
      } else {
        this.closePanel();
      }
    });
  }

  openPanel() {
    if (!this.panel || !this.toggle) return;

    this.lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.panel.classList.remove("hidden");
    this.panel.setAttribute("aria-hidden", "false");
    this.toggle.setAttribute("aria-expanded", "true");
    this.lockScroll();
    this.focusFirstElement();
  }

  closePanel({ restoreFocus = true } = {}) {
    if (!this.panel) return;

    this.panel.classList.add("hidden");
    this.panel.setAttribute("aria-hidden", "true");

    if (this.toggle) {
      this.toggle.setAttribute("aria-expanded", "false");
    }

    this.closeAllAccordions();
    this.unlockScroll();

    if (restoreFocus && this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus();
    }

    this.lastFocusedElement = null;
  }

  setupAccordions() {
    document.querySelectorAll(".nav-accordion-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const id = toggle.getAttribute("data-accordion-id");
        const panel = document.querySelector(`.nav-accordion-panel[data-accordion-id="${id}"]`);
        if (!panel) return;

        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        this.closeAllAccordions();

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

  setupDesktopSubmenus() {
    document.querySelectorAll(".nav-submenu-toggle").forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const id = toggle.getAttribute("data-submenu-id");
        const submenu = document.querySelector(`.nav-submenu[data-submenu-id="${id}"]`);
        if (!submenu) return;

        const isOpen = !submenu.classList.contains("hidden");

        this.ui.toolDropdown.closeAll();
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
      if (!toggle) return;

      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector(".submenu-chevron")?.classList.remove("rotate-180");
    });
  }

  setupPanelLinkClose() {
    if (!this.panel) return;

    this.panel.addEventListener("click", (event) => {
      if (!event.target.closest("a[href]")) return;
      setTimeout(() => this.closePanel({ restoreFocus: false }), 100);
    });
  }

  setupPanelKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (!this.isPanelOpen() || event.key !== "Tab") return;
      this.trapFocus(event);
    });
  }

  isPanelOpen() {
    return Boolean(this.panel) && !this.panel.classList.contains("hidden");
  }

  getFocusableElements() {
    if (!this.panel) return [];

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    return [...this.panel.querySelectorAll(focusableSelector)].filter((element) => {
      if (!(element instanceof HTMLElement) || element.hasAttribute("hidden")) {
        return false;
      }

      return !element.closest('.nav-accordion-panel[aria-hidden="true"]');
    });
  }

  focusFirstElement() {
    const [firstFocusable] = this.getFocusableElements();
    if (firstFocusable) {
      firstFocusable.focus();
      return;
    }

    this.panel?.focus();
  }

  trapFocus(event) {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      this.panel?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!this.panel?.contains(activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
      return;
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  lockScroll() {
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  unlockScroll() {
    document.body.style.overflow = this.previousBodyOverflow;
  }

  closeAll(options) {
    this.closePanel(options);
    this.closeAllDesktopSubmenus();
  }
}

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
    this.navDisclosure = new NavDisclosure(this);
    this.toolDropdown = new ToolDropdown(this);
    this.setupGlobalListeners();
    this.updateUI();
  }

  closeAllMenus(options = {}) {
    this.toolDropdown.closeAll();
    this.navDisclosure.closeAll(options);
  }

  setupGlobalListeners() {
    document.addEventListener("click", (event) => {
      const colorSchemeButton = event.target.closest(
        '.dropdown-menu[data-dropdown-type="color-scheme"] [data-color-scheme]'
      );
      if (colorSchemeButton) {
        this.setColorScheme(colorSchemeButton.getAttribute("data-color-scheme"));
        this.closeAllMenus();
        return;
      }

      const themeButton = event.target.closest('.dropdown-menu[data-dropdown-type="theme"] [data-theme]');
      if (themeButton) {
        this.setTheme(themeButton.getAttribute("data-theme"));
        this.closeAllMenus();
        return;
      }

      const isInside = event.target.closest(
        ".dropdown-toggle, .dropdown-menu, .nav-submenu-toggle, .nav-submenu, .nav-panel-toggle, #mobile-nav-panel"
      );
      if (!isInside) {
        this.closeAllMenus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeAllMenus({ restoreFocus: true });
      }
    });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (this.theme !== "system") return;
      this.applyTheme();
      this.updateUI();
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
    const isDark =
      this.theme === "dark" ||
      (this.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
  }

  updateUI() {
    const sunIcons = document.querySelectorAll(".sun-icon, #sun-icon");
    const moonIcons = document.querySelectorAll(".moon-icon, #moon-icon");
    const systemIcons = document.querySelectorAll(".system-icon, #system-icon");

    [...sunIcons, ...moonIcons, ...systemIcons].forEach((icon) => {
      icon.classList.add("hidden");
    });

    if (this.theme === "light") {
      sunIcons.forEach((icon) => icon.classList.remove("hidden"));
    } else if (this.theme === "dark") {
      moonIcons.forEach((icon) => icon.classList.remove("hidden"));
    } else {
      systemIcons.forEach((icon) => icon.classList.remove("hidden"));
    }

    this.updateDropdownSelection();
  }

  updateDropdownSelection() {
    const selectedClasses = ["bg-accent", "text-accent-foreground"];

    document.querySelectorAll("[data-color-scheme]").forEach((button) => {
      const isSelected = button.getAttribute("data-color-scheme") === this.colorScheme;
      selectedClasses.forEach((className) => {
        button.classList.toggle(className, isSelected);
      });
    });

    document.querySelectorAll("[data-theme]").forEach((button) => {
      const isSelected = button.getAttribute("data-theme") === this.theme;
      selectedClasses.forEach((className) => {
        button.classList.toggle(className, isSelected);
      });
    });

    const currentLang = document.documentElement.lang || "en";
    document
      .querySelectorAll('.dropdown-menu[data-dropdown-type="language"] a[role="menuitem"]')
      .forEach((link) => {
        const href = link.getAttribute("href");
        const isSelected = this.isCurrentLanguageLink(href, currentLang);
        selectedClasses.forEach((className) => {
          link.classList.toggle(className, isSelected);
        });
      });
  }

  isCurrentLanguageLink(href, currentLang) {
    if (href === "/" && currentLang === "en") {
      return true;
    }

    return new RegExp(`^/${currentLang}(/|$)`).test(href);
  }
}

let initialized = false;

export function initUI() {
  if (initialized) return;
  initialized = true;
  new UIManager();
}
