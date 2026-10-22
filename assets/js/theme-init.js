// Inlined before first paint to restore theme, width, blur, and grain without
// a flash. This file is templated by Hugo and bundled with js.Build, so it can
// share the same helpers as the runtime controls.
import { STORAGE_KEYS, readStorage } from "./core.js";
import { applyThemeMode } from "./appearance.js";
import { grainTokensFor, surfaceAlphaFor } from "./viewport.js";

(function () {
  const root = document.documentElement;

  const colorSchemes = {{ hugo.Data.themes | default dict | jsonify | safeJS }};
  const configuredScheme = '{{ site.Params.colorScheme | default "default" }}';
  const storedScheme = readStorage(STORAGE_KEYS.colorScheme);
  const colorScheme = Object.prototype.hasOwnProperty.call(colorSchemes || {}, storedScheme)
    ? storedScheme
    : configuredScheme;
  root.setAttribute("data-theme", colorScheme);

  const contentWidth = Number.parseInt(readStorage(STORAGE_KEYS.contentWidth), 10);
  if (Number.isInteger(contentWidth) && contentWidth >= 40 && contentWidth <= 90) {
    root.style.setProperty("--content-width", `${contentWidth}rem`);
  }

  const configuredBlur = Number.parseInt("{{ site.Params.backdropBlur | default 12 }}", 10);
  const defaultBlur =
    Number.isInteger(configuredBlur) && configuredBlur >= 0 && configuredBlur <= 24
      ? configuredBlur
      : 12;
  const storedBlur = Number.parseInt(readStorage(STORAGE_KEYS.backdropBlur), 10);
  const blur =
    Number.isInteger(storedBlur) && storedBlur >= 0 && storedBlur <= 24 ? storedBlur : defaultBlur;

  root.style.setProperty("--backdrop-blur", `${blur}px`);
  root.style.setProperty("--surface-alpha", `${surfaceAlphaFor(blur)}%`);

  const configuredGrain = Number.parseInt("{{ site.Params.grainSize | default 0 }}", 10);
  const defaultGrain =
    Number.isInteger(configuredGrain) && configuredGrain >= 0 && configuredGrain <= 100
      ? configuredGrain
      : 0;
  const storedGrain = Number.parseInt(readStorage(STORAGE_KEYS.grainSize), 10);
  const grain =
    Number.isInteger(storedGrain) && storedGrain >= 0 && storedGrain <= 100
      ? storedGrain
      : defaultGrain;
  const grainTokens = grainTokensFor(grain);

  root.style.setProperty("--grain-size", `${grainTokens.size}px`);
  root.style.setProperty("--grain-opacity", grainTokens.opacity);

  const storedPin = readStorage(STORAGE_KEYS.tocPinned);
  if (storedPin === "true" || storedPin === "false") {
    root.setAttribute("data-toc-pinned", storedPin);
  }

  const currentTheme = () => {
    const stored = readStorage(STORAGE_KEYS.theme);
    return ["light", "dark", "system"].includes(stored) ? stored : "system";
  };

  applyThemeMode(root, currentTheme());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => applyThemeMode(root, currentTheme()));
})();
