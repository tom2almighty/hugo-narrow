/**
 * Native popover ARIA state, nav popover, and series popover behavior.
 */
import { SIDE_DOCK_QUERY } from "./layout.js";

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

export function initPopovers() {
  initPopoverState();
  initNavPopover();
  initSeriesPopover();
}
