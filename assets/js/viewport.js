/**
 * Runtime page-width, backdrop-blur, and grain controls.
 *
 * The pure token formulas are shared with the inline theme initializer so the
 * first paint and subsequent control changes stay consistent.
 */
import {
  STORAGE_KEYS,
  clamp,
  readStorage,
  removeStorage,
  writeStorage,
} from "./core.js";

export function surfaceAlphaFor(blur, max = 24) {
  return blur > 0 ? Math.max(68, 92 - Math.round((blur / max) * 20)) : 100;
}

export function grainTokensFor(value, max = 100) {
  return {
    size: Math.round(64 + value * 2.5),
    opacity: value > 0 ? (0.04 + (value / max) * 0.2).toFixed(3) : "0",
  };
}

function initContentWidth() {
  const container = document.getElementById("page-container");
  const range = document.getElementById("content-width-range");
  const output = document.getElementById("content-width-value");
  const reset = document.getElementById("content-width-reset");
  if (!container || !range || !output || !reset) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const configuredWidth = () => {
    const raw = getComputedStyle(container).getPropertyValue("--content-width-base").trim();
    const rem = Number.parseFloat(raw);
    return Number.isFinite(rem) ? rem : 56;
  };
  const defaultWidth = configuredWidth();
  const storedWidth = Number.parseInt(readStorage(STORAGE_KEYS.contentWidth), 10);
  const hasStoredWidth =
    Number.isInteger(storedWidth) && storedWidth >= min && storedWidth <= max;
  const initialWidth = hasStoredWidth ? storedWidth : defaultWidth;

  const updateControl = (value) => {
    const width = clamp(value, min, max);
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
    writeStorage(STORAGE_KEYS.contentWidth, String(width));
  });

  reset.addEventListener("click", () => {
    removeStorage(STORAGE_KEYS.contentWidth);
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
  const configuredBlur = () => {
    const raw = getComputedStyle(container).getPropertyValue("--backdrop-blur-base").trim();
    const px = Number.parseFloat(raw);
    return Number.isFinite(px) ? clamp(px, min, max) : 12;
  };
  const defaultBlur = configuredBlur();
  const storedBlur = Number.parseInt(readStorage(STORAGE_KEYS.backdropBlur), 10);
  const hasStoredBlur =
    Number.isInteger(storedBlur) && storedBlur >= min && storedBlur <= max;
  const initialBlur = hasStoredBlur ? storedBlur : defaultBlur;

  const applyTokens = (px) => {
    document.documentElement.style.setProperty("--backdrop-blur", `${px}px`);
    document.documentElement.style.setProperty(
      "--surface-alpha",
      `${surfaceAlphaFor(px, max)}%`
    );
  };

  const updateControl = (value) => {
    const px = clamp(value, min, max);
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
    writeStorage(STORAGE_KEYS.backdropBlur, String(px));
  });

  reset.addEventListener("click", () => {
    removeStorage(STORAGE_KEYS.backdropBlur);
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
  const configuredGrain = () => {
    const raw = getComputedStyle(container).getPropertyValue("--grain-size-base").trim();
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? clamp(value, min, max) : 0;
  };
  const defaultGrain = configuredGrain();
  const storedGrain = Number.parseInt(readStorage(STORAGE_KEYS.grainSize), 10);
  const hasStoredGrain =
    Number.isInteger(storedGrain) && storedGrain >= min && storedGrain <= max;
  const initialGrain = hasStoredGrain ? storedGrain : defaultGrain;

  const applyTokens = (value) => {
    const tokens = grainTokensFor(value, max);
    document.documentElement.style.setProperty("--grain-size", `${tokens.size}px`);
    document.documentElement.style.setProperty("--grain-opacity", tokens.opacity);
  };

  const updateControl = (value) => {
    const grain = clamp(value, min, max);
    range.value = String(grain);
    output.value = `${grain}%`;
    output.textContent = `${grain}%`;
    applyTokens(grain);
    return grain;
  };

  updateControl(initialGrain);

  range.addEventListener("input", () => {
    updateControl(Number(range.value));
  });

  range.addEventListener("change", () => {
    const value = updateControl(Number(range.value));
    writeStorage(STORAGE_KEYS.grainSize, String(value));
  });

  reset.addEventListener("click", () => {
    removeStorage(STORAGE_KEYS.grainSize);
    updateControl(defaultGrain);
  });
}

export function initViewportControls() {
  initContentWidth();
  initBackdropBlur();
  initGrainSize();
}
