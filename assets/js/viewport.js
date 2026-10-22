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

function initRangeControl({ name, baseProperty, fallback, storageKey, format, apply }) {
  const container = document.getElementById("page-container");
  const range = document.getElementById(`${name}-range`);
  const output = document.getElementById(`${name}-value`);
  const reset = document.getElementById(`${name}-reset`);
  if (!container || !range || !output || !reset) return;

  const min = Number(range.min);
  const max = Number(range.max);
  const parsedBase = Number.parseFloat(
    getComputedStyle(container).getPropertyValue(baseProperty).trim()
  );
  const defaultValue = clamp(Number.isFinite(parsedBase) ? parsedBase : fallback, min, max);
  const stored = Number.parseInt(readStorage(storageKey), 10);
  const initialValue =
    Number.isInteger(stored) && stored >= min && stored <= max ? stored : defaultValue;

  const update = (value) => {
    const next = clamp(value, min, max);
    range.value = String(next);
    const text = format(next);
    output.value = text;
    output.textContent = text;
    apply(next, max);
    return next;
  };

  update(initialValue);

  range.addEventListener("input", () => {
    update(Number(range.value));
  });

  range.addEventListener("change", () => {
    writeStorage(storageKey, String(update(Number(range.value))));
  });

  reset.addEventListener("click", () => {
    removeStorage(storageKey);
    update(defaultValue);
  });
}

export function initViewportControls() {
  const rootStyle = document.documentElement.style;

  initRangeControl({
    name: "content-width",
    baseProperty: "--content-width-base",
    fallback: 56,
    storageKey: STORAGE_KEYS.contentWidth,
    format: (value) => `${value}rem`,
    apply: (value) => rootStyle.setProperty("--content-width", `${value}rem`),
  });

  initRangeControl({
    name: "backdrop-blur",
    baseProperty: "--backdrop-blur-base",
    fallback: 12,
    storageKey: STORAGE_KEYS.backdropBlur,
    format: (value) => `${value}px`,
    apply: (value, max) => {
      rootStyle.setProperty("--backdrop-blur", `${value}px`);
      rootStyle.setProperty("--surface-alpha", `${surfaceAlphaFor(value, max)}%`);
    },
  });

  initRangeControl({
    name: "grain-size",
    baseProperty: "--grain-size-base",
    fallback: 0,
    storageKey: STORAGE_KEYS.grainSize,
    format: (value) => `${value}%`,
    apply: (value, max) => {
      const tokens = grainTokensFor(value, max);
      rootStyle.setProperty("--grain-size", `${tokens.size}px`);
      rootStyle.setProperty("--grain-opacity", tokens.opacity);
    },
  });
}
