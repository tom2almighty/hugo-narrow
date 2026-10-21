import { SIDE_DOCK_QUERY } from "./layout.js";

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
  const configuredWidth = () => {
    const raw = getComputedStyle(container).getPropertyValue("--content-width-base").trim();
    const rem = Number.parseFloat(raw);
    return Number.isFinite(rem) ? rem : 56;
  };
  const defaultWidth = configuredWidth();
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
    const width = updateControl(Number(range.value));
    document.documentElement.style.setProperty("--content-width", `${width}rem`);
  });

  range.addEventListener("change", () => {
    const width = updateControl(Number(range.value));
    document.documentElement.style.setProperty("--content-width", `${width}rem`);
    writeStorage("contentWidth", String(width));
  });

  reset.addEventListener("click", () => {
    removeStorage("contentWidth");
    document.documentElement.style.removeProperty("--content-width");
    updateControl(defaultWidth);
  });
}

function initBackdropBlur() {
  const container = document.getElementById("page-container");
  const range = document.getElementById("backdrop-blur-range");
  const output = document.getElementById("backdrop-blur-value");
  const reset = document.getElementById("backdrop-blur-reset");
  if (!container || !range || !output || !reset) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const clamp = (value) => Math.min(max, Math.max(min, Math.round(value)));
  const configuredBlur = () => {
    const raw = getComputedStyle(container).getPropertyValue("--backdrop-blur-base").trim();
    const px = Number.parseFloat(raw);
    return Number.isFinite(px) ? clamp(px) : 12;
  };
  const defaultBlur = configuredBlur();
  const storedBlur = Number.parseInt(readStorage("backdropBlur"), 10);
  const hasStoredBlur =
    Number.isInteger(storedBlur) && storedBlur >= min && storedBlur <= max;
  const initialBlur = hasStoredBlur ? storedBlur : defaultBlur;

  const applyTokens = (px) => {
    const alpha = px > 0 ? Math.max(68, 92 - Math.round((px / max) * 20)) : 100;
    document.documentElement.style.setProperty("--backdrop-blur", `${px}px`);
    document.documentElement.style.setProperty("--surface-alpha", `${alpha}%`);
  };

  const updateControl = (value) => {
    const px = clamp(value);
    range.value = String(px);
    output.value = `${px}px`;
    output.textContent = `${px}px`;
    applyTokens(px);
    return px;
  };

  updateControl(initialBlur);

  range.addEventListener("input", () => {
    updateControl(Number(range.value));
  });

  range.addEventListener("change", () => {
    const px = updateControl(Number(range.value));
    writeStorage("backdropBlur", String(px));
  });

  reset.addEventListener("click", () => {
    removeStorage("backdropBlur");
    updateControl(defaultBlur);
  });
}

function initGrainSize() {
  const container = document.getElementById("page-container");
  const range = document.getElementById("grain-size-range");
  const output = document.getElementById("grain-size-value");
  const reset = document.getElementById("grain-size-reset");
  if (!container || !range || !output || !reset) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const clamp = (value) => Math.min(max, Math.max(min, Math.round(value)));
  const configuredGrain = () => {
    const raw = getComputedStyle(container).getPropertyValue("--grain-size-base").trim();
    const val = Number.parseFloat(raw);
    return Number.isFinite(val) ? clamp(val) : 0;
  };
  const defaultGrain = configuredGrain();
  const storedGrain = Number.parseInt(readStorage("grainSize"), 10);
  const hasStoredGrain =
    Number.isInteger(storedGrain) && storedGrain >= min && storedGrain <= max;
  const initialGrain = hasStoredGrain ? storedGrain : defaultGrain;

  const applyTokens = (val) => {
    const tilePx = Math.round(64 + val * 2.5);
    const opacity = val > 0 ? (0.04 + (val / max) * 0.20).toFixed(3) : "0";
    document.documentElement.style.setProperty("--grain-size", `${tilePx}px`);
    document.documentElement.style.setProperty("--grain-opacity", opacity);
  };

  const updateControl = (value) => {
    const val = clamp(value);
    range.value = String(val);
    output.value = `${val}%`;
    output.textContent = `${val}%`;
    applyTokens(val);
    return val;
  };

  updateControl(initialGrain);

  range.addEventListener("input", () => {
    updateControl(Number(range.value));
  });

  range.addEventListener("change", () => {
    const val = updateControl(Number(range.value));
    writeStorage("grainSize", String(val));
  });

  reset.addEventListener("click", () => {
    removeStorage("grainSize");
    updateControl(defaultGrain);
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

function initNavPopover() {
  const popover = document.getElementById("nav-menu-popover");
  if (!popover) return;

  popover.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) popover.hidePopover();
  });

  const placementQuery = window.matchMedia(SIDE_DOCK_QUERY);

  placementQuery.addEventListener("change", () => {
    if (popover.matches(":popover-open")) popover.hidePopover();
  });
}

function initSeriesPopover() {
  const popover = document.getElementById("series-popover");
  if (!popover) return;

  popover.addEventListener("toggle", (event) => {
    if (event.newState !== "open") return;
    popover.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  });

  popover.addEventListener("click", (event) => {
    if (event.target.closest("a[href]")) popover.hidePopover();
  });
}

function initFoldLayout() {
  const root = document.documentElement;

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
    root.style.setProperty("--fold-content-width", `${Math.max(0, first.width - 32)}px`);
    root.style.setProperty("--fold-margin-start", "0");
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
  initBackdropBlur();
  initGrainSize();
  initPopoverState();
  initNavPopover();
  initSeriesPopover();
  initFoldLayout();
}
