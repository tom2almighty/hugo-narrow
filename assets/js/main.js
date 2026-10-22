import { initAnnouncement } from "./announcement.js";
import { initAppearance } from "./appearance.js";
import { initCodeBlocks } from "./codeblock.js";
import { initDock } from "./dock.js";
import { initFoldLayout } from "./fold.js";
import { initPopovers } from "./popovers.js";
import { initSearch } from "./search.js";
import { initTabs } from "./tabs.js";
import { initViewportControls } from "./viewport.js";

function boot() {
  initAppearance();
  initViewportControls();
  initPopovers();
  initFoldLayout();
  initSearch();
  initDock();
  initAnnouncement();
  initTabs();
  initCodeBlocks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
