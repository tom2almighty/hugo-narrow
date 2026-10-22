export function initAnnouncement() {
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

  let timer = 0;

  const dismiss = () => {
    if (element.classList.contains("is-hiding")) return;
    window.clearTimeout(timer);
    element.classList.add("is-hiding");
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (_) {
      // ignore
    }
    window.setTimeout(() => element.remove(), 180);
  };

  const autoClose = Number.parseInt(element.dataset.autoClose || "0", 10);
  if (autoClose > 0) {
    timer = window.setTimeout(dismiss, autoClose * 1000);
  }

  document.getElementById("announcement-close")?.addEventListener("click", dismiss);
}
