import { initCodeBlocks } from "./codeblock.js";
import { initTabs } from "./tabs.js";
import { initUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initTabs();
  initCodeBlocks();
});
