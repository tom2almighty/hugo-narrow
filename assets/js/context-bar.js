/**
 * Context bar, article pages only: scrolling down hides the bar, scrolling up
 * brings it back as a title capsule. Clicking the capsule restores the original
 * breadcrumb trail. The trail and capsule share one surface, so the change is a
 * width/radius morph rather than a content swap.
 */

const COLLAPSE_AFTER = 96;
const SCROLL_DELTA = 8;
const HIDE_MS = 220;

export function initContextBar() {
  const bar = document.getElementById("context-bar");
  const pill = document.getElementById("context-pill");
  if (!bar || !pill || bar.dataset.collapsible !== "true") return;

  const surface = bar.querySelector(".context-top");
  const seriesPopover = document.getElementById("series-popover");
  const collapsible = [...bar.querySelectorAll(".context-crumbs, .series-bar")];

  let collapsed = false;
  let visible = true;
  let lastY = window.scrollY;
  let ticking = false;
  let hideTimer = 0;

  // The surface is sized from the capsule's natural width. Measure against the
  // full-width surface, then keep the value until the viewport changes.
  const measure = () => {
    bar.dataset.measuring = "true";
    const width = Math.min(pill.offsetWidth, bar.clientWidth);
    bar.style.setProperty("--context-pill-width", `${width}px`);
    delete bar.dataset.measuring;
  };

  const setCollapsed = (value) => {
    const next = Boolean(value);
    if (next === collapsed) return;
    collapsed = next;
    bar.dataset.collapsed = next ? "true" : "false";
    collapsible.forEach((element) => {
      element.inert = next;
    });
    if (!next && document.activeElement === pill) pill.blur();
  };

  const setVisible = (value) => {
    const next = Boolean(value);
    if (next === visible) return;
    visible = next;
    bar.dataset.visible = next ? "true" : "false";
    if (!next && document.activeElement === pill) pill.blur();
  };

  const expand = () => {
    window.clearTimeout(hideTimer);
    setCollapsed(false);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    // Collapse only after the bar is out of view, so the shrink never shows.
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (!visible) setCollapsed(true);
    }, HIDE_MS);
  };

  const sync = () => {
    const y = window.scrollY;
    const delta = y - lastY;

    // Keep the bar in place while the series panel is open.
    if (seriesPopover?.matches(":popover-open")) {
      lastY = y;
      return;
    }

    // Near the top the full trail is always the right state.
    if (y <= COLLAPSE_AFTER) {
      expand();
      lastY = y;
      return;
    }

    // Keep the last position until the delta passes the threshold, so slow
    // scrolling still accumulates a direction.
    if (Math.abs(delta) < SCROLL_DELTA) return;

    if (delta < 0) {
      // Scrolling up reveals the capsule; an expanded trail stays open.
      window.clearTimeout(hideTimer);
      setVisible(true);
    } else if (visible) {
      const focused = document.activeElement;
      if (focused !== pill && bar.contains(focused)) {
        // Never hide a focused breadcrumb or series control.
        lastY = y;
        return;
      }
      hide();
    }

    lastY = y;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      sync();
      ticking = false;
    });
  };

  measure();

  // Restore the visual state without animating on first paint.
  if (window.scrollY > COLLAPSE_AFTER) {
    setCollapsed(true);
    setVisible(false);
  }
  window.requestAnimationFrame(() => {
    bar.dataset.ready = "true";
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      measure();
      onScroll();
    },
    { passive: true }
  );
  document.fonts?.ready.then(measure);

  pill.addEventListener("click", expand);

  // The capsule padding belongs to the surface; keep the whole capsule clickable.
  surface?.addEventListener("click", (event) => {
    if (collapsed && !event.target.closest("#context-pill")) expand();
  });
}
