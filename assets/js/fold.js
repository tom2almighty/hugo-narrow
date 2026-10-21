/**
 * Foldable-device layout: constrain content to the first viewport segment.
 */
export function initFoldLayout() {
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
