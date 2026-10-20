/**
 * 全局 Dock 行为：导航、搜索、目录、评论、顶部。
 */

(function () {
  "use strict";

  const dock = document.getElementById("dock");
  if (!dock) return;

  const sideQuery = window.matchMedia(
    "(min-aspect-ratio: 4/3) and (min-width: 48rem), (horizontal-viewport-segments: 2)"
  );

  const syncPlacement = () => {
    const placement = sideQuery.matches ? "side" : "bottom";
    dock.dataset.placement = placement;
    dock.setAttribute("aria-orientation", placement === "side" ? "vertical" : "horizontal");
  };

  syncPlacement();
  sideQuery.addEventListener("change", syncPlacement);

  document.getElementById("dock-search")?.addEventListener("click", () => {
    if (window.Search?.show) {
      window.Search.show();
      return;
    }
    document.dispatchEvent(new CustomEvent("search:open"));
  });

  document.getElementById("dock-toc")?.addEventListener("click", () => {
    if (window.TOC?.toggle) {
      window.TOC.toggle();
      return;
    }
    document.dispatchEvent(new CustomEvent("toc:toggle"));
  });

  document.getElementById("dock-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("dock-comments")?.addEventListener("click", () => {
    const comments = document.getElementById("comments");
    if (!comments) return;

    window.scrollTo({
      top: comments.getBoundingClientRect().top + window.pageYOffset - 96,
      behavior: "smooth",
    });
  });
})();
