/**
 * Global dock behavior: placement semantics, reading progress,
 * back-to-top visibility, search/TOC dispatch, and toolbar keyboard focus.
 */
import { EVENTS, emit } from "./core.js";
import { REDUCED_MOTION_QUERY, SIDE_DOCK_QUERY } from "./layout.js";

export function initDock() {
  const dock = document.getElementById("dock");
  if (!dock) return;

  const sideQuery = window.matchMedia(SIDE_DOCK_QUERY);
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let collapsed = false;
  let lastScrollY = window.scrollY;

  const setCollapsed = (value) => {
    const next = sideQuery.matches ? Boolean(value) : false;
    if (next === collapsed) return;
    if (next) {
      const popoverOpen =
        document.getElementById("appearance-panel")?.matches(":popover-open") ||
        document.getElementById("nav-menu-popover")?.matches(":popover-open") ||
        document.getElementById("toc-panel")?.dataset.open === "true";
      if (popoverOpen) return;
    }
    collapsed = next;
    dock.dataset.collapsed = next ? "true" : "false";
  };

  const syncPlacement = () => {
    const placement = sideQuery.matches ? "side" : "bottom";
    dock.dataset.placement = placement;
    dock.setAttribute("aria-orientation", placement === "side" ? "vertical" : "horizontal");
    setCollapsed(false);
    syncBackToTop();
  };

  const progress = document.getElementById("reading-progress");
  const topButton = document.getElementById("dock-top");

  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const value = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
    progress.style.setProperty("--reading-progress", `${value}%`);
  };

  const syncBackToTop = () => {
    if (!topButton) return;
    topButton.hidden = window.scrollY <= window.innerHeight * 0.8;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateProgress();
      syncBackToTop();
      if (sideQuery.matches) {
        const scrollingUp = window.scrollY < lastScrollY;
        lastScrollY = window.scrollY;
        if (scrollingUp) {
          setCollapsed(false);
        } else if (
          window.scrollY > 320 &&
          !dock.matches(":hover") &&
          !dock.contains(document.activeElement)
        ) {
          setCollapsed(true);
        }
      } else {
        lastScrollY = window.scrollY;
      }
      ticking = false;
    });
  };

  syncPlacement();
  updateProgress();
  sideQuery.addEventListener("change", syncPlacement);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  dock.addEventListener("pointerenter", () => setCollapsed(false));
  dock.addEventListener("focusin", () => setCollapsed(false));

  document.getElementById("dock-search")?.addEventListener("click", () => {
    emit(EVENTS.searchOpen);
  });

  document.getElementById("dock-toc")?.addEventListener("click", () => {
    emit(EVENTS.tocToggle);
  });

  document.getElementById("dock-comments")?.addEventListener("click", () => {
    document.getElementById("comments")?.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  dock.addEventListener("keydown", (event) => {
    const items = [...dock.querySelectorAll(".dock-item")].filter(
      (item) => !item.hidden && item.getClientRects().length > 0
    );
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement);
    const vertical = dock.dataset.placement === "side";
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";

    let target = null;
    if (event.key === nextKey) target = current < 0 ? 0 : (current + 1) % items.length;
    if (event.key === prevKey) target = current <= 0 ? items.length - 1 : current - 1;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = items.length - 1;

    if (target !== null) {
      event.preventDefault();
      items[target].focus();
    }
  });
}
