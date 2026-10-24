/**
 * Tabs shortcode. The tablist and panels are server-rendered by Hugo, so this
 * only handles state and keyboard navigation.
 */
function getTabs(wrapper) {
  return [...wrapper.querySelectorAll("[role='tab'][data-tab-target]")];
}

function getPanels(wrapper) {
  return [...wrapper.querySelectorAll("[role='tabpanel'][data-tabs-panel]")];
}

function activate(button) {
  const wrapper = button.closest("[data-tabs]");
  if (!wrapper) return;

  const targetId = button.dataset.tabTarget;

  getTabs(wrapper).forEach((tab) => {
    const isActive = tab === button;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  getPanels(wrapper).forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });
}

function handleClick(event) {
  const button = event.target.closest("[data-tabs] [role='tab'][data-tab-target]");
  if (!button) return;

  event.preventDefault();
  activate(button);
}

function handleKeydown(event) {
  const button = event.target.closest("[data-tabs] [role='tab'][data-tab-target]");
  if (!button) return;

  const wrapper = button.closest("[data-tabs]");
  const tabs = getTabs(wrapper);
  const index = tabs.indexOf(button);
  if (index === -1) return;

  let next = null;
  switch (event.key) {
    case "ArrowRight":
      next = tabs[(index + 1) % tabs.length];
      break;
    case "ArrowLeft":
      next = tabs[(index - 1 + tabs.length) % tabs.length];
      break;
    case "Home":
      next = tabs[0];
      break;
    case "End":
      next = tabs[tabs.length - 1];
      break;
    default:
      return;
  }

  if (!next) return;
  event.preventDefault();
  next.focus();
  activate(next);
}

let initialized = false;

export function initTabs() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleKeydown);
}
