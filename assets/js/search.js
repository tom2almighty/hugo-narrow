/**
 * Search modal controller: dialog state, input debouncing, data loading,
 * keyboard navigation and result selection. Indexing and result markup live
 * in search-engine.js and search-render.js.
 */
import { EVENTS, emit, prefersReducedMotion, readJSONConfig } from "./core.js";
import { prepareRecords, searchRecords } from "./search-engine.js";
import { createResultsFragment } from "./search-render.js";

export function initSearch() {
  let modal = null;
  let input = null;
  let clearButton = null;
  let closeButton = null;
  let emptyState = null;
  let loadingState = null;
  let noResultsState = null;
  let resultsList = null;
  let stats = null;
  let items = null;

  let data = null;
  let dataPromise = null;
  let currentResults = [];
  let totalResults = 0;
  let selectedIndex = -1;
  let inputTimer = null;

  function init() {
    modal = document.getElementById("search-modal");
    input = document.getElementById("search-input");
    clearButton = document.getElementById("search-clear");
    closeButton = document.getElementById("search-close");
    emptyState = document.getElementById("search-empty");
    loadingState = document.getElementById("search-loading");
    noResultsState = document.getElementById("search-no-results");
    resultsList = document.getElementById("search-results-list");
    stats = document.getElementById("search-stats");
    items = document.getElementById("search-items");

    if (!modal) return;

    bindEvents();

    window.Search = {
      show: show,
      hide: hide,
      toggle: toggle,
      isVisible: () => Boolean(modal?.open),
    };
  }

  function bindEvents() {
    closeButton?.addEventListener("click", hide);
    clearButton?.addEventListener("click", clear);

    if (input) {
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleInputKeydown);
    }

    modal.addEventListener("click", handleBackdropClick);
    modal.addEventListener("close", handleDialogClose);

    document.addEventListener("keydown", handleGlobalKeydown);
    document.addEventListener(EVENTS.searchOpen, handleSearchOpenEvent);
    document.addEventListener(EVENTS.searchClose, handleSearchCloseEvent);
    document.addEventListener(EVENTS.searchToggle, handleSearchToggleEvent);
  }

  function handleBackdropClick(event) {
    if (event.target === modal) hide();
  }

  function handleDialogClose() {
    clearContent();
    emit(EVENTS.searchClose, { origin: "search-module" });
  }

  function handleSearchOpenEvent(event) {
    if (event?.detail) event.detail.handled = true;
    if (event?.detail?.origin === "search-module") return;
    show();
  }

  function handleSearchCloseEvent(event) {
    if (event?.detail) event.detail.handled = true;
    if (event?.detail?.origin === "search-module") return;
    hide();
  }

  function handleSearchToggleEvent(event) {
    if (event?.detail) event.detail.handled = true;
    if (event?.detail?.origin === "search-module") return;
    toggle();
  }

  function handleGlobalKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      show();
    }
  }

  function handleInputKeydown(event) {
    if (!modal?.open) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        navigate(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        navigate(-1);
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          event.preventDefault();
          select();
        }
        break;
      default:
        break;
    }
  }

  function show() {
    if (!modal || modal.open) return;

    document.querySelectorAll("[popover]:popover-open").forEach((popover) => {
      try {
        popover.hidePopover();
      } catch (_) {
        // Ignore browsers without a usable popover API.
      }
    });

    document.querySelectorAll("dialog[open]").forEach((dialog) => {
      if (dialog !== modal) dialog.close();
    });

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }

    window.setTimeout(() => input?.focus(), 50);
    ensureData().catch(() => {});
    emit(EVENTS.searchOpen, { origin: "search-module" });
  }

  function hide() {
    if (modal?.open) modal.close();
  }

  function toggle() {
    if (modal?.open) {
      hide();
    } else {
      show();
    }

    emit(EVENTS.searchToggle, { origin: "search-module" });
  }

  function clear() {
    clearContent();
    input?.focus();
  }

  function clearContent() {
    if (input) input.value = "";

    if (inputTimer) {
      clearTimeout(inputTimer);
      inputTimer = null;
    }

    currentResults = [];
    totalResults = 0;
    resetNavigation();
    toggleClearButton(false);
    showEmptyState();
  }

  function toggleClearButton(show) {
    if (!clearButton) return;

    if (show) {
      clearButton.classList.remove("opacity-0", "pointer-events-none");
      clearButton.classList.add("opacity-100");
    } else {
      clearButton.classList.add("opacity-0", "pointer-events-none");
      clearButton.classList.remove("opacity-100");
    }
  }

  function resetNavigation() {
    selectedIndex = -1;
    syncSelectedResult();
  }

  function setComboboxExpanded(expanded) {
    input?.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (!expanded) input?.removeAttribute("aria-activedescendant");
  }

  function showEmptyState() {
    hideAllStates();
    if (emptyState) emptyState.hidden = false;
  }

  function showLoadingState() {
    hideAllStates();
    if (loadingState) loadingState.hidden = false;
  }

  function showNoResultsState() {
    hideAllStates();
    if (noResultsState) noResultsState.hidden = false;
  }

  function showResultsList() {
    hideAllStates();
    setComboboxExpanded(true);
    if (resultsList) resultsList.hidden = false;
  }

  function hideAllStates() {
    setComboboxExpanded(false);
    [emptyState, loadingState, noResultsState, resultsList].forEach((element) => {
      if (element) element.hidden = true;
    });
  }

  async function ensureData() {
    if (data) return data;
    if (dataPromise) return dataPromise;

    const config = readJSONConfig("search-config");
    const indexURL = config?.searchIndexURL || "/index.json";

    dataPromise = fetch(indexURL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((records) => {
        data = prepareRecords(records);
        return data;
      })
      .catch((error) => {
        data = [];
        throw error;
      })
      .finally(() => {
        dataPromise = null;
      });

    return dataPromise;
  }

  function handleInput(event) {
    const query = event.target.value.trim();
    toggleClearButton(query.length > 0);
    resetNavigation();

    if (inputTimer) clearTimeout(inputTimer);

    inputTimer = window.setTimeout(() => {
      if (!query) {
        currentResults = [];
        showEmptyState();
        return;
      }

      performSearch(query);
    }, 200);
  }

  async function performSearch(query) {
    showLoadingState();

    try {
      const records = await ensureData();
      const { results, total } = searchRecords(records, query);
      currentResults = results;
      totalResults = total;

      if (totalResults === 0) {
        showNoResultsState();
        return;
      }

      renderResults();
      showResultsList();
    } catch (_) {
      currentResults = [];
      showNoResultsState();
    }
  }

  function renderResults() {
    if (!items || !stats) return;

    updateStats(totalResults);
    items.replaceChildren(createResultsFragment(currentResults));
    syncSelectedResult();
  }

  function updateStats(count) {
    const template = stats?.dataset.countOther || stats?.textContent || `Found ${count} results`;
    stats.textContent = template.replace("%d", count);
  }

  function navigate(direction) {
    if (!currentResults.length || !items) return;

    if (selectedIndex === -1) {
      selectedIndex = direction > 0 ? 0 : currentResults.length - 1;
    } else {
      selectedIndex += direction;
      if (selectedIndex < 0) selectedIndex = currentResults.length - 1;
      else if (selectedIndex >= currentResults.length) selectedIndex = 0;
    }

    syncSelectedResult();

    const selected = items.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function syncSelectedResult() {
    if (!items) return;

    items.querySelectorAll(".search-result-item").forEach((element, index) => {
      const isSelected = index === selectedIndex;
      const item = element.parentElement;

      element.classList.toggle("bg-accent", isSelected);
      element.classList.toggle("text-accent-foreground", isSelected);
      item?.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    const activeItem =
      selectedIndex >= 0 ? document.getElementById(`search-option-${selectedIndex}`) : null;
    if (activeItem) {
      input?.setAttribute("aria-activedescendant", activeItem.id);
    } else {
      input?.removeAttribute("aria-activedescendant");
    }
  }

  function select() {
    if (selectedIndex < 0 || selectedIndex >= currentResults.length || !items) return;

    const selected = items.querySelector(`[data-index="${selectedIndex}"]`);
    selected?.click();
  }

  init();
}
