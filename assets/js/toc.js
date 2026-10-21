/**
 * 目录功能模块：Dock 驱动的单一目录面板。
 */

function tocHashOf(link) {
  const raw = link.hash ? link.hash.substring(1) : "";
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch (_) {
    return raw;
  }
}

class TOCManager {
  constructor() {
    this.panel = document.getElementById("toc-panel");
    if (!this.panel) return;

    this.content = document.getElementById("toc-content");
    this.pinBtn = document.getElementById("toc-pin");
    this.closeBtn = document.getElementById("toc-close");
    this.dockBtn = document.getElementById("dock-toc");
    this.entries = [];
    this.headings = [];
    this.activeId = null;

    this.setupEntries();
    if (this.entries.length === 0) return;

    this.setupObserver();
    this.bindEvents();
    this.syncPin();
    this.exposeAPI();
  }

  setupEntries() {
    const links = this.panel.querySelectorAll("nav#TableOfContents a");
    links.forEach((link) => {
      const id = tocHashOf(link);
      if (!id) return;

      this.entries.push({ link, id });
      const heading = document.getElementById(id);
      if (heading) this.headings.push(heading);
    });
  }

  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const top = visible.reduce((current, entry) =>
          entry.boundingClientRect.top < current.boundingClientRect.top ? entry : current
        );
        this.setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 1] }
    );

    this.headings.forEach((heading) => this.observer.observe(heading));
  }

  setActive(id) {
    if (!id) return;
    this.activeId = id;

    this.entries.forEach(({ link, id: linkId }) => {
      const active = linkId === id;
      link.classList.toggle("active", active);
      link.parentElement?.classList.toggle("active", active);
    });
  }

  isOpen() {
    return this.panel.dataset.open === "true";
  }

  setOpen(open) {
    const next = Boolean(open);
    this.panel.dataset.open = next ? "true" : "false";
    this.panel.setAttribute("aria-hidden", next ? "false" : "true");
    this.panel.inert = !next;
    this.dockBtn?.setAttribute("aria-expanded", next ? "true" : "false");

    if (next) {
      requestAnimationFrame(() => this.revealActive());
    }
  }

  toggle() {
    if (this.isPinned() && this.isPinAvailable()) {
      this.close();
    } else {
      this.setOpen(!this.isOpen());
    }
  }

  close() {
    if (this.isPinned() && this.isPinAvailable()) this.applyPin(false, true);
    this.setOpen(false);
  }

  isPinned() {
    return document.documentElement.dataset.tocPinned === "true";
  }

  isSideLayout() {
    return window.matchMedia(
      "(min-aspect-ratio: 4/3) and (min-width: 75rem), (horizontal-viewport-segments: 2)"
    ).matches;
  }

  isPinAvailable() {
    return window.matchMedia(
      "(min-width: 105rem) and (min-aspect-ratio: 4/3), (horizontal-viewport-segments: 2) and (min-width: 105rem)"
    ).matches;
  }

  applyPin(pinned, persist) {
    document.documentElement.dataset.tocPinned = pinned ? "true" : "false";
    if (persist) {
      try {
        localStorage.setItem("tocPinned", pinned ? "true" : "false");
      } catch (_) {
        // localStorage may be unavailable.
      }
    }

    this.pinBtn?.setAttribute("aria-pressed", pinned ? "true" : "false");
    if (this.pinBtn) {
      const label = pinned ? this.pinBtn.dataset.labelUnpin : this.pinBtn.dataset.labelPin;
      if (label) {
        this.pinBtn.setAttribute("aria-label", label);
        this.pinBtn.title = label;
      }
    }

    this.setOpen(pinned ? true : this.isOpen());
  }

  syncPin() {
    if (this.isPinAvailable() && this.isPinned()) {
      this.applyPin(true, false);
      return;
    }
    this.setOpen(false);
  }

  revealActive() {
    if (!this.content || !this.activeId) return;

    const entry = this.entries.find(({ id }) => id === this.activeId);
    if (!entry) return;

    const max = this.content.scrollHeight - this.content.clientHeight;
    if (max <= 0) return;

    const link = entry.link;
    const centered = link.offsetTop + link.offsetHeight / 2 - this.content.clientHeight / 2;
    this.content.scrollTop = Math.min(Math.max(centered, 0), max);
  }

  scrollToTarget(hash) {
    let id = hash.substring(1);
    try {
      id = decodeURIComponent(id);
    } catch (_) {
      // keep raw id
    }

    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!this.isPinned()) this.close();
  }

  bindEvents() {
    this.closeBtn?.addEventListener("click", () => this.close());

    this.pinBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.applyPin(!this.isPinned(), true);
    });

    document.addEventListener("toc:toggle", () => this.toggle());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isOpen() && !this.isPinned()) {
        this.close();
        this.dockBtn?.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!this.isOpen() || this.isPinned()) return;
      if (event.target.closest("#toc-panel, #dock-toc")) return;
      this.close();
    });

    const sideQuery = window.matchMedia(
      "(min-aspect-ratio: 4/3) and (min-width: 75rem), (horizontal-viewport-segments: 2)"
    );

    sideQuery.addEventListener("change", () => {
      if (!sideQuery.matches || !this.isPinAvailable()) {
        this.setOpen(false);
      } else if (this.isPinned()) {
        this.setOpen(true);
      }
    });

    const pinQuery = window.matchMedia(
      "(min-width: 105rem) and (min-aspect-ratio: 4/3), (horizontal-viewport-segments: 2) and (min-width: 105rem)"
    );
    pinQuery.addEventListener("change", () => {
      if (!pinQuery.matches) {
        this.setOpen(false);
      } else if (this.isPinned()) {
        this.setOpen(true);
      }
    });

    this.panel.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (link?.hash) {
        event.preventDefault();
        this.scrollToTarget(link.hash);
      }
    });
  }

  exposeAPI() {
    window.TOC = {
      open: () => this.setOpen(true),
      close: () => this.close(),
      toggle: () => this.toggle(),
      isOpen: () => this.isOpen(),
    };
  }
}

new TOCManager();
