const NAV_SHELL_CLASS =
  "tabs-nav-shell overflow-x-auto px-2 pt-2 pb-1 sm:px-3 sm:pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const NAV_CLASS =
  "tabs-nav inline-flex min-w-max items-center gap-1 rounded-xl border border-border bg-background/70 p-1 shadow-sm text-muted-foreground";
const TRIGGER_BASE_CLASS =
  "tabs-trigger inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-[color,background-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";
const TRIGGER_ACTIVE_CLASS = "bg-primary/10 text-primary shadow-xs";
const TRIGGER_INACTIVE_CLASS = "text-muted-foreground hover:bg-primary/10 hover:text-primary";

function getTabWrappers(root = document) {
  return [...root.querySelectorAll("[data-tabs]")];
}

function getTabButtons(wrapper) {
  return [...wrapper.querySelectorAll(".tabs-trigger[role='tab']")];
}

function getTabPanels(wrapper) {
  return [...wrapper.querySelectorAll(".tabs-panel[data-tabs-panel][role='tabpanel']")];
}

function getPanelsContainer(wrapper) {
  return wrapper.querySelector(".tabs-panels");
}

function buildTabNav(wrapper) {
  const panels = getTabPanels(wrapper);
  if (panels.length === 0) return [];

  wrapper.querySelector(".tabs-nav-shell")?.remove();

  const navShell = document.createElement("div");
  navShell.className = NAV_SHELL_CLASS;

  const nav = document.createElement("div");
  nav.className = NAV_CLASS;
  nav.setAttribute("role", "tablist");

  const wrapperId = wrapper.id || `tabs-${Math.random().toString(36).slice(2, 8)}`;
  wrapper.id = wrapperId;

  panels.forEach((panel, index) => {
    const panelId = panel.id || `${wrapperId}-panel-${index}`;
    const buttonId = `${wrapperId}-tab-${index}`;
    const label = panel.dataset.tabLabel || `Tab ${index + 1}`;

    panel.id = panelId;
    panel.setAttribute("aria-labelledby", buttonId);

    const button = document.createElement("button");
    button.id = buttonId;
    button.className = `${TRIGGER_BASE_CLASS} ${TRIGGER_INACTIVE_CLASS}`;
    button.type = "button";
    button.setAttribute("role", "tab");
    button.dataset.tabTarget = panelId;
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("aria-selected", "false");
    button.tabIndex = -1;
    button.textContent = label;

    nav.append(button);
  });

  navShell.append(nav);

  const panelsContainer = getPanelsContainer(wrapper);
  if (panelsContainer) {
    panelsContainer.before(navShell);
  } else {
    wrapper.prepend(navShell);
  }

  return getTabButtons(wrapper);
}

function updateTriggerState(button, isActive) {
  button.classList.toggle("active", isActive);
  TRIGGER_ACTIVE_CLASS.split(" ").forEach((className) => {
    button.classList.toggle(className, isActive);
  });
  TRIGGER_INACTIVE_CLASS.split(" ").forEach((className) => {
    button.classList.toggle(className, !isActive);
  });
}

function activateTab(button) {
  const wrapper = button.closest("[data-tabs]");
  if (!wrapper) return;

  const targetId = button.dataset.tabTarget;
  const targetPanel = wrapper.querySelector(`#${CSS.escape(targetId)}`);
  if (!targetPanel) return;

  getTabButtons(wrapper).forEach((tabButton) => {
    const isActive = tabButton === button;
    updateTriggerState(tabButton, isActive);
    tabButton.setAttribute("aria-selected", String(isActive));
    tabButton.tabIndex = isActive ? 0 : -1;
  });

  getTabPanels(wrapper).forEach((panel) => {
    const isActive = panel === targetPanel;
    panel.hidden = !isActive;
  });
}

function focusAdjacentTab(currentButton, direction) {
  const wrapper = currentButton.closest("[data-tabs]");
  if (!wrapper) return;

  const buttons = getTabButtons(wrapper);
  const currentIndex = buttons.indexOf(currentButton);
  if (currentIndex === -1) return;

  const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
  const nextButton = buttons[nextIndex];
  if (!nextButton) return;

  nextButton.focus();
  activateTab(nextButton);
}

function handleClick(event) {
  const tabButton = event.target.closest(".tabs-trigger[role='tab']");
  if (!tabButton) return;

  event.preventDefault();
  activateTab(tabButton);
}

function handleKeydown(event) {
  const button = event.target.closest(".tabs-trigger[role='tab']");
  if (!button) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    focusAdjacentTab(button, 1);
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    focusAdjacentTab(button, -1);
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    const wrapper = button.closest("[data-tabs]");
    const firstButton = wrapper ? getTabButtons(wrapper)[0] : null;
    if (!firstButton) return;
    firstButton.focus();
    activateTab(firstButton);
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    const wrapper = button.closest("[data-tabs]");
    const buttons = wrapper ? getTabButtons(wrapper) : [];
    const lastButton = buttons[buttons.length - 1];
    if (!lastButton) return;
    lastButton.focus();
    activateTab(lastButton);
  }
}

let initialized = false;

export function initTabs(root = document) {
  getTabWrappers(root).forEach((wrapper) => {
    const buttons = buildTabNav(wrapper);
    const panels = getTabPanels(wrapper);
    if (buttons.length === 0 || panels.length === 0) return;

    const activeButton =
      buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0];
    activateTab(activeButton);
  });

  if (initialized) return;
  initialized = true;

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);
}
