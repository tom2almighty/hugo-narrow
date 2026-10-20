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

function initNavDialog() {
  const dialog = document.getElementById("nav-dialog");
  const open = document.getElementById("dock-menu");
  const close = document.getElementById("nav-dialog-close");
  const main = dialog?.querySelector("[data-nav-main]");
  const panels = [...(dialog?.querySelectorAll("[data-nav-panel]") || [])];
  const triggers = [...(dialog?.querySelectorAll("[data-nav-target]") || [])];
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

    if (restoreFocus && lastTrigger) lastTrigger.focus();
  };

  const showPanel = (key, trigger) => {
    const panel = panels.find((item) => item.dataset.navPanel === key);
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

    dialog.querySelector("[data-nav-menu]")?.scrollTo({ top: 0 });
    panel.querySelector("[data-nav-back]")?.focus();
  };

  open.addEventListener("click", () => {
    if (dialog.open) return;
    showMain();
    open.setAttribute("aria-expanded", "true");
    dialog.showModal();
  });

  close?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
      return;
    }

    const target = event.target.closest("[data-nav-target]");
    if (target) {
      showPanel(target.dataset.navTarget, target);
      return;
    }

    if (event.target.closest("[data-nav-back]")) {
      showMain({ restoreFocus: true });
      return;
    }

    if (event.target.closest("a[href]")) dialog.close();
  });

  dialog.addEventListener("cancel", (event) => {
    if (!currentPanel) return;
    event.preventDefault();
    showMain({ restoreFocus: true });
  });

  dialog.addEventListener("close", () => {
    showMain();
    lastTrigger = null;
    open.setAttribute("aria-expanded", "false");
  });

  const sideQuery = window.matchMedia(
    "(min-aspect-ratio: 4/3) and (min-width: 48rem), (horizontal-viewport-segments: 2)"
  );
  sideQuery.addEventListener("change", () => {
    if (dialog.open) dialog.close();
  });
}

function initDeviceLayout() {
  const root = document.documentElement;
  const sideQuery = window.matchMedia(
    "(min-aspect-ratio: 4/3) and (min-width: 48rem), (horizontal-viewport-segments: 2)"
  );
  const verticalQuery = window.matchMedia("(vertical-viewport-segments: 2)");

  const syncPlacement = () => {
    root.dataset.dockPlacement = verticalQuery.matches
      ? "bottom"
      : sideQuery.matches
        ? "side"
        : "bottom";
  };

  syncPlacement();
  sideQuery.addEventListener("change", syncPlacement);
  verticalQuery.addEventListener("change", syncPlacement);

  const posture = navigator.devicePosture;
  if (posture) {
    const syncPosture = () => {
      root.dataset.devicePosture = posture.type;
    };
    syncPosture();
    posture.addEventListener("change", syncPosture);
  }

  const syncSegments = () => {
    const segments = window.viewport?.segments;
    if (!segments?.length || segments.length === 1) {
      root.removeAttribute("data-viewport-segments");
      root.style.removeProperty("--fold-content-width");
      root.style.removeProperty("--fold-margin-start");
      return;
    }

    root.dataset.viewportSegments = String(segments.length);
    const first = segments[0];
    const last = segments[segments.length - 1];
    root.style.setProperty("--viewport-segment-right", `${last.right}px`);
    root.style.setProperty("--viewport-segment-left", `${first.left}px`);

    if (segments.length > 1) {
      root.style.setProperty("--fold-content-width", `${Math.max(0, first.width - 16)}px`);
      root.style.setProperty("--fold-margin-start", "0");
    } else {
      root.style.removeProperty("--fold-content-width");
      root.style.removeProperty("--fold-margin-start");
    }
  };

  syncSegments();
  window.addEventListener("resize", syncSegments, { passive: true });
}

let initialized = false;

export function initUI() {
  if (initialized) return;
  initialized = true;

  initAppearance();
  initContentWidth();
  initPopoverState();
  initNavDialog();
  initDeviceLayout();
}
