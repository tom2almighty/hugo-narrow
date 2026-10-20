function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // localStorage may be unavailable in private browsing modes.
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {
    // localStorage may be unavailable in private browsing modes.
  }
}

function emitThemeChanged(colorScheme, theme) {
  document.dispatchEvent(
    new CustomEvent("themeChanged", {
      detail: { colorScheme, theme },
      bubbles: true,
    })
  );
}

function initAppearance() {
  const root = document.documentElement;
  const schemeInputs = [...document.querySelectorAll('input[name="color-scheme"]')];
  const modeInputs = [...document.querySelectorAll('input[name="theme-mode"]')];

  if (schemeInputs.length === 0 && modeInputs.length === 0) {
    return;
  }

  const modes = ["light", "dark", "system"];
  const currentScheme = () =>
    readStorage("colorScheme") || root.getAttribute("data-theme") || "default";
  const currentMode = () => {
    const stored = readStorage("theme");
    return modes.includes(stored) ? stored : "system";
  };

  let colorScheme = currentScheme();
  let theme = currentMode();

  const hasScheme = (value) => schemeInputs.some((input) => input.value === value);
  if (schemeInputs.length > 0 && !hasScheme(colorScheme)) {
    colorScheme = root.getAttribute("data-theme") || "default";
  }

  const setChecked = (inputs, value) => {
    inputs.forEach((input) => {
      input.checked = input.value === value;
    });
  };

  setChecked(schemeInputs, colorScheme);
  setChecked(modeInputs, theme);

  const applyTheme = (mode, notify = true) => {
    theme = modes.includes(mode) ? mode : "system";
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
    if (notify) emitThemeChanged(colorScheme, theme);
  };

  applyTheme(theme, false);

  schemeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;

      colorScheme = input.value;
      writeStorage("colorScheme", colorScheme);
      root.setAttribute("data-theme", colorScheme);
      emitThemeChanged(colorScheme, theme);
    });
  });

  modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;

      writeStorage("theme", input.value);
      applyTheme(input.value);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (theme === "system") applyTheme("system");
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "colorScheme") {
      colorScheme = currentScheme();
      if (schemeInputs.length > 0 && !hasScheme(colorScheme)) {
        colorScheme = root.getAttribute("data-theme") || "default";
      }
      setChecked(schemeInputs, colorScheme);
      root.setAttribute("data-theme", colorScheme);
      emitThemeChanged(colorScheme, theme);
    }

    if (event.key === "theme") {
      theme = currentMode();
      setChecked(modeInputs, theme);
      applyTheme(theme);
    }
  });
}

function initContentWidth() {
  const container = document.getElementById("page-container");
  const range = document.getElementById("content-width-range");
  const output = document.getElementById("content-width-value");
  const reset = document.getElementById("content-width-reset");
  if (!container || !range || !output || !reset) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const clamp = (value) => Math.min(max, Math.max(min, Math.round(value)));
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const defaultWidth = Number.parseFloat(getComputedStyle(container).maxWidth) / rootFontSize;
  const storedWidth = Number.parseInt(readStorage("contentWidth"), 10);
  const hasStoredWidth =
    Number.isInteger(storedWidth) && storedWidth >= min && storedWidth <= max;
  const initialWidth = hasStoredWidth ? storedWidth : defaultWidth;

  const updateControl = (value) => {
    const width = clamp(value);
    range.value = String(width);
    output.value = `${width}rem`;
    output.textContent = `${width}rem`;
    return width;
  };

  updateControl(initialWidth);

  range.addEventListener("input", () => {
    updateControl(Number(range.value));
  });

  range.addEventListener("change", () => {
    const width = updateControl(Number(range.value));
    document.documentElement.style.setProperty("--content-width", `${width}rem`);
    writeStorage("contentWidth", String(width));
  });

  reset.addEventListener("click", () => {
    removeStorage("contentWidth");
    document.documentElement.style.removeProperty("--content-width");
    const configuredWidth = Number.parseFloat(getComputedStyle(container).maxWidth) / rootFontSize;
    updateControl(configuredWidth);
  });
}

function initPopoverState() {
  document.querySelectorAll("[popovertarget]").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("popovertarget"));
    if (!panel) return;

    const sync = () => {
      const open = panel.matches(":popover-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    };

    panel.addEventListener("toggle", sync);
    sync();
  });
}

function initNavDetails() {
  const details = [...document.querySelectorAll("details.nav-details")];
  if (details.length === 0) return;

  details.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      const group = item.getAttribute("name");
      if (!group) return;

      details.forEach((other) => {
        if (other !== item && other.open && other.getAttribute("name") === group) {
          other.open = false;
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    details.forEach((item) => {
      if (item.open && !item.contains(event.target)) {
        item.open = false;
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;

    const open = details.find((item) => item.open);
    if (!open) return;

    event.preventDefault();
    open.open = false;
    open.querySelector("summary")?.focus();
  });
}

function initMobileNav() {
  const dialog = document.getElementById("mobile-nav");
  const open = document.getElementById("mobile-nav-open");
  const close = document.getElementById("mobile-nav-close");
  const main = dialog?.querySelector("[data-mobile-main]");
  const panels = [...(dialog?.querySelectorAll("[data-mobile-panel]") || [])];
  const triggers = [...(dialog?.querySelectorAll("[data-mobile-target]") || [])];
  if (!dialog || !open || !main) return;

  let currentPanel = null;
  let lastTrigger = null;

  const showMain = ({ restoreFocus = false } = {}) => {
    main.hidden = false;
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    triggers.forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
    });
    currentPanel = null;

    if (restoreFocus && lastTrigger) {
      lastTrigger.focus();
    }
  };

  const showPanel = (key, trigger) => {
    const panel = panels.find((item) => item.dataset.mobilePanel === key);
    if (!panel) return;

    main.hidden = true;
    panels.forEach((item) => {
      item.hidden = item !== panel;
    });
    triggers.forEach((item) => {
      item.setAttribute("aria-expanded", item === trigger ? "true" : "false");
    });
    currentPanel = panel;
    lastTrigger = trigger;

    dialog.querySelector("[data-mobile-menu]")?.scrollTo({ top: 0 });
    panel.querySelector("[data-mobile-back]")?.focus();
  };

  open.addEventListener("click", () => {
    if (dialog.open) return;
    showMain();
    dialog.showModal();
  });

  close?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
      return;
    }

    const target = event.target.closest("[data-mobile-target]");
    if (target) {
      showPanel(target.dataset.mobileTarget, target);
      return;
    }

    if (event.target.closest("[data-mobile-back]")) {
      showMain({ restoreFocus: true });
      return;
    }

    if (event.target.closest("a[href]")) {
      dialog.close();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    if (!currentPanel) return;

    event.preventDefault();
    showMain({ restoreFocus: true });
  });

  dialog.addEventListener("close", () => {
    showMain();
    lastTrigger = null;
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}

let initialized = false;

export function initUI() {
  if (initialized) return;
  initialized = true;

  initAppearance();
  initContentWidth();
  initPopoverState();
  initNavDetails();
  initMobileNav();
}
