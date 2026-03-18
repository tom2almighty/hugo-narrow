import { copyText } from "./clipboard.js";

const COPY_FEEDBACK_MS = 2000;
const copyTimers = new WeakMap();

function getCodeBlocks(root = document) {
  return [...root.querySelectorAll("[data-code-block]")];
}

function countSourceLines(block) {
  const sourceNode = block.querySelector("[data-code-source]");
  const sourceText = sourceNode?.textContent ?? "";
  if (!sourceText) return 0;
  return sourceText.split("\n").length;
}

function shouldAutoCollapse(block) {
  const autoCollapseLines = Number.parseInt(block.dataset.autoCollapseLines || "30", 10);
  const autoCollapseHeight = Number.parseInt(block.dataset.autoCollapseHeight || "400", 10);
  const renderedCode = block.querySelector(
    ".code-block-content pre.chroma, .code-block-content pre"
  );
  const renderedHeight = renderedCode?.offsetHeight || 0;
  const sourceLines = countSourceLines(block);

  return sourceLines > autoCollapseLines || renderedHeight > autoCollapseHeight;
}

function updateCollapseButton(block, collapsed) {
  const button = block.querySelector(".collapse-code-btn");
  if (!button) return;

  const label = collapsed ? button.dataset.labelExpand : button.dataset.labelCollapse;
  const text = button.querySelector(".collapse-text");
  const chevron = button.querySelector(".collapse-chevron");

  if (text) text.textContent = label || "";
  if (chevron) chevron.classList.toggle("rotate-180", !collapsed);

  button.title = label || "";
  button.setAttribute("aria-label", label || "");
  button.setAttribute("aria-expanded", String(!collapsed));
}

function updateCollapseOverlay(block, collapsed) {
  const overlay = block.querySelector(".collapse-overlay");
  if (!overlay) return;

  overlay.hidden = !collapsed;
  overlay.classList.toggle("pointer-events-none", !collapsed);
  overlay.classList.toggle("opacity-0", !collapsed);
  overlay.classList.toggle("pointer-events-auto", collapsed);
  overlay.classList.toggle("opacity-100", collapsed);
}

function setCollapsed(block, collapsed, { animate = true } = {}) {
  const content = block.querySelector(".code-block-content");
  if (!content) return;

  const collapsedHeight = Number.parseInt(block.dataset.collapsedHeight || "120", 10);

  block.dataset.collapsed = String(collapsed);
  content.style.transition = animate ? "max-height 0.3s ease-out" : "";
  content.style.maxHeight = collapsed ? `${collapsedHeight}px` : "";
  content.style.overflow = collapsed ? "hidden" : "";

  updateCollapseButton(block, collapsed);
  updateCollapseOverlay(block, collapsed);

  if (animate) {
    window.setTimeout(() => {
      content.style.transition = "";
    }, 300);
  }
}

function initCollapsibleBlocks(root = document) {
  getCodeBlocks(root).forEach((block) => {
    if (block.dataset.collapsible !== "true") return;

    const defaultState = block.dataset.defaultState || "expanded";
    const collapsedAttr = block.dataset.collapsed === "true";
    const startCollapsed =
      collapsedAttr || defaultState === "collapsed" || shouldAutoCollapse(block);
    setCollapsed(block, startCollapsed, { animate: false });
  });
}

function getCodeSource(block) {
  const sourceNode = block.querySelector("[data-code-source]");
  return sourceNode?.textContent ?? "";
}

function setCopyFeedback(button, copied) {
  const text = button.querySelector(".copy-text");
  const label = copied ? button.dataset.labelCopied : button.dataset.labelCopy;

  if (text) text.textContent = label || "";

  button.classList.toggle("text-green-600", copied);
  button.title = label || "";
  button.setAttribute("aria-label", label || "");
}

async function handleCopy(button) {
  const block = button.closest("[data-code-block]");
  if (!block) return;

  const copied = await copyText(getCodeSource(block));
  if (!copied) return;

  setCopyFeedback(button, true);

  const previousTimer = copyTimers.get(button);
  if (previousTimer) {
    window.clearTimeout(previousTimer);
  }

  const timer = window.setTimeout(() => {
    setCopyFeedback(button, false);
    copyTimers.delete(button);
  }, COPY_FEEDBACK_MS);

  copyTimers.set(button, timer);
}

function handleCodeBlockClick(event) {
  const copyButton = event.target.closest(".copy-code-btn[data-code-action='copy']");
  if (copyButton) {
    event.preventDefault();
    handleCopy(copyButton);
    return;
  }

  const collapseButton = event.target.closest(
    ".collapse-code-btn[data-code-action='toggle-collapse']"
  );
  if (collapseButton) {
    event.preventDefault();
    const block = collapseButton.closest("[data-code-block]");
    if (!block) return;
    const isCollapsed = block.dataset.collapsed === "true";
    setCollapsed(block, !isCollapsed);
    return;
  }

  const expandButton = event.target.closest(".collapse-overlay-btn[data-code-action='expand']");
  if (expandButton) {
    event.preventDefault();
    const block = expandButton.closest("[data-code-block]");
    if (!block) return;
    setCollapsed(block, false);
  }
}

let initialized = false;

export function initCodeBlocks(root = document) {
  if (initialized) return;
  initialized = true;

  initCollapsibleBlocks(root);

  document.addEventListener("click", handleCodeBlockClick);
}
