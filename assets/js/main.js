import { initCodeBlocks } from "./codeblock.js";
import { initTabs } from "./tabs.js";
import { initUI } from "./ui.js";

function boot() {
  initUI();
  initTabs();
  initCodeBlocks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
