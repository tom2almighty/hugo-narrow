import { initAnnouncement } from "./announcement.js";
import { initCodeBlocks } from "./codeblock.js";
import { initDock } from "./dock.js";
import { initSearch } from "./search.js";
import { initTabs } from "./tabs.js";
import { initUI } from "./ui.js";

function boot() {
  initUI();
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
