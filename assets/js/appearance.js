/**
 * Color scheme and light/dark/system mode.
 */
import { EVENTS, STORAGE_KEYS, emit, readStorage, writeStorage } from "./core.js";

const MODES = ["light", "dark", "system"];

export function applyThemeMode(root, mode) {
  const theme = MODES.includes(mode) ? mode : "system";
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
  return theme;
}

export function initAppearance() {
  const root = document.documentElement;
  const schemeInputs = [...document.querySelectorAll('input[name="color-scheme"]')];
  const modeInputs = [...document.querySelectorAll('input[name="theme-mode"]')];

  if (schemeInputs.length === 0 && modeInputs.length === 0) {
    return;
  }

  const currentScheme = () =>
    readStorage(STORAGE_KEYS.colorScheme) || root.getAttribute("data-theme") || "default";
  const currentMode = () => {
    const stored = readStorage(STORAGE_KEYS.theme);
    return MODES.includes(stored) ? stored : "system";
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
    theme = applyThemeMode(root, mode);
    if (notify) emit(EVENTS.themeChanged, { colorScheme, theme });
  };

  applyTheme(theme, false);

  schemeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;

      colorScheme = input.value;
      writeStorage(STORAGE_KEYS.colorScheme, colorScheme);
      root.setAttribute("data-theme", colorScheme);
      emit(EVENTS.themeChanged, { colorScheme, theme });
    });
  });

  modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;

      writeStorage(STORAGE_KEYS.theme, input.value);
      applyTheme(input.value);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (theme === "system") applyTheme("system");
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.colorScheme) {
      colorScheme = currentScheme();
      if (schemeInputs.length > 0 && !hasScheme(colorScheme)) {
        colorScheme = root.getAttribute("data-theme") || "default";
      }
      setChecked(schemeInputs, colorScheme);
      root.setAttribute("data-theme", colorScheme);
      emit(EVENTS.themeChanged, { colorScheme, theme });
    }

    if (event.key === STORAGE_KEYS.theme) {
      theme = currentMode();
      setChecked(modeInputs, theme);
      applyTheme(theme);
    }
  });
}
