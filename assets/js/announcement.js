(() => {
  "use strict";

  const element = document.getElementById("site-announcement");
  if (!element) return;

  const id = element.dataset.announcementId || "default";
  const storageKey = `hugo-narrow-announcement-${id}`;

  try {
    if (sessionStorage.getItem(storageKey) === "1") {
      element.remove();
      return;
    }
  } catch (_) {
    // sessionStorage may be unavailable.
  }

  document.getElementById("announcement-close")?.addEventListener("click", () => {
    element.classList.add("is-hiding");
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (_) {
      // ignore
    }
    window.setTimeout(() => element.remove(), 180);
  });
})();
