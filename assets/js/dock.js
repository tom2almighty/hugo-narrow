/**
 * 底部 Dock 控制脚本
 *
 * 功能：
 * - 支持三种显示模式：scroll（向上滚动显示）、always（始终显示）、float（悬浮显示）
 * - 基础的按钮点击事件处理
 */

(function () {
  "use strict";

  let lastScrollTop = 0;
  let isScrollingUp = false;
  let scrollThreshold = 100; // 滚动阈值
  let isDockVisible = false; // 悬浮模式的显示状态

  const dock = document.getElementById("dock");
  const floatTrigger = document.getElementById("dock-float-trigger");

  if (!dock) return;

  // 获取 dock 显示模式
  const dockMode = dock.dataset.dockMode || "scroll";

  // 滚动事件处理
  function handleScroll() {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    // 判断滚动方向
    if (currentScrollTop < lastScrollTop) {
      // 向上滚动
      isScrollingUp = true;
    } else {
      // 向下滚动
      isScrollingUp = false;
    }

    // 根据模式处理显示/隐藏 dock
    switch (dockMode) {
      case "scroll":
        if (isScrollingUp && currentScrollTop > scrollThreshold) {
          showDock();
        } else if (!isScrollingUp || currentScrollTop <= scrollThreshold) {
          hideDock();
        }
        break;
      case "always":
        showDock();
        break;
      case "float":
        // 悬浮模式在滚动时自动隐藏 dock
        if (isDockVisible && (currentScrollTop > lastScrollTop)) {
          hideDock();
        }
        break;
    }

    lastScrollTop = currentScrollTop;
  }

  // 显示 dock
  function showDock() {
    dock.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
    dock.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
    isDockVisible = true;
  }

  // 隐藏 dock
  function hideDock() {
    dock.classList.remove(
      "translate-y-0",
      "opacity-100",
      "pointer-events-auto",
    );
    dock.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
    isDockVisible = false;
  }

  // 切换悬浮模式 dock 显示状态
  function toggleFloatDock() {
    if (isDockVisible) {
      hideDock();
    } else {
      showDock();
    }
  }

  // 节流函数
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // 绑定滚动事件（使用节流）
  window.addEventListener("scroll", throttle(handleScroll, 16)); // ~60fps

  // 悬浮模式触发器事件处理
  if (floatTrigger && dockMode === "float") {
    let hoverTimer;
    
    // 点击触发器切换 dock
    floatTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleFloatDock();
    });

    // 悬浮显示 dock
    floatTrigger.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!isDockVisible) {
          showDock();
        }
      }, 150); // 150ms 延迟，避免误触发
    });

    floatTrigger.addEventListener("mouseleave", function () {
      clearTimeout(hoverTimer);
      // 鼠标离开时隐藏 dock
      setTimeout(() => {
        if (isDockVisible && !dock.matches(':hover')) {
          hideDock();
        }
      }, 200);
    });

    // dock 区域悬浮时保持显示
    dock.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
    });

    dock.addEventListener("mouseleave", function () {
      setTimeout(() => {
        if (isDockVisible && !floatTrigger.matches(':hover')) {
          hideDock();
        }
      }, 200);
    });

    // 点击页面其他区域时隐藏 dock
    document.addEventListener("click", function (e) {
      if (isDockVisible && !dock.contains(e.target) && !floatTrigger.contains(e.target)) {
        hideDock();
      }
    });

    // 阻止 dock 内部点击事件冒泡
    dock.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // 基础按钮事件处理（占位符，后续实现具体功能）

  // 返回按钮 - 只在非首页存在
  const backBtn = document.getElementById("dock-back");
  if (backBtn) {
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // 实现智能返回功能
      try {
        // 检查是否有历史记录可以返回
        if (window.history.length > 1 && document.referrer) {
          // 如果有引用页面且在同一域名下，使用浏览器返回
          const referrerUrl = new URL(document.referrer);
          const currentUrl = new URL(window.location.href);

          if (referrerUrl.origin === currentUrl.origin) {
            window.history.back();
            console.log("返回按钮点击 - 浏览器返回");
            return;
          }
        }

        // 否则跳转到首页
        window.location.href = "/";
        console.log("返回按钮点击 - 跳转首页");
      } catch (error) {
        // 如果出现错误，默认跳转到首页
        console.warn("返回功能出错，跳转到首页:", error);
        window.location.href = "/";
      }
    });
  }

  // 目录按钮 - 只在文章页面存在
  const tocBtn = document.getElementById("dock-toc");
  if (tocBtn) {
    tocBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // 调用目录功能，带重试机制
      function tryToggleTOC(retries = 5) {
        if (window.TOC && window.TOC.initialized) {
          // 如果搜索modal是打开状态，先关闭搜索
          if (window.Search && window.Search.isVisible && window.Search.isVisible()) {
            window.Search.hide();
          }
          
          // 切换目录状态
          window.TOC.toggle();
        } else if (window.TOC && !window.TOC.initialized && retries > 0) {
          setTimeout(() => tryToggleTOC(retries - 1), 200);
        } else if (!window.TOC && retries > 0) {
          setTimeout(() => tryToggleTOC(retries - 1), 200);
        }
      }

      tryToggleTOC();
    });
  }

  // 搜索按钮
  const searchBtn = document.getElementById("dock-search");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // 调用搜索功能，带重试机制
      function tryToggleSearch(retries = 5) {
        if (window.Search) {
          // 如果目录modal是打开状态，先关闭目录
          if (window.TOC && window.TOC.initialized && window.TOC.isVisible && window.TOC.isVisible()) {
            window.TOC.hide();
          }
          
          // 切换搜索状态（如果已打开则关闭，否则打开）
          if (window.Search.isVisible && window.Search.isVisible()) {
            window.Search.hide();
          } else {
            window.Search.show();
          }
        } else if (retries > 0) {
          setTimeout(() => tryToggleSearch(retries - 1), 200);
        }
      }

      tryToggleSearch();
    });
  }

  // 评论按钮 - 只在文章页面且评论启用时存在
  const commentsBtn = document.getElementById("dock-comments");
  if (commentsBtn) {
    commentsBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // 实现滚动到评论区域功能
      try {
        // 尝试多种可能的评论区域选择器
        const commentSelectors = [
          "#comments", // 通用评论区域 ID
          ".comments", // 通用评论区域类
          "#giscus-container", // Giscus 评论系统
          ".giscus", // Giscus 评论系统类
          "#disqus_thread", // Disqus 评论系统
          ".disqus", // Disqus 评论系统类
          "#utterances", // Utterances 评论系统
          ".utterances", // Utterances 评论系统类
          "#waline", // Waline 评论系统
          ".waline", // Waline 评论系统类
          "[data-comments]", // 带有 data-comments 属性的元素
          ".comment-section", // 评论区域类
          ".post-comments", // 文章评论类
        ];

        let commentElement = null;

        // 按优先级查找评论元素
        for (const selector of commentSelectors) {
          commentElement = document.querySelector(selector);
          if (commentElement) {
            console.log(`找到评论区域: ${selector}`);
            break;
          }
        }

        if (commentElement) {
          // 平滑滚动到评论区域
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
          console.log("评论按钮点击 - 滚动到评论区域");
        } else {
          // 如果找不到评论区域，滚动到页面底部
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
          console.log("评论按钮点击 - 未找到评论区域，滚动到页面底部");
        }
      } catch (error) {
        console.warn("滚动到评论区域失败:", error);
        // 出错时滚动到页面底部
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  }

  // 返回顶部按钮
  const topBtn = document.getElementById("dock-top");
  if (topBtn) {
    topBtn.addEventListener("click", function () {
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 初始化：根据模式设置 dock 状态
  switch (dockMode) {
    case "always":
      showDock();
      break;
    case "float":
      hideDock();
      // 确保悬浮触发器可见
      if (floatTrigger) {
        floatTrigger.style.opacity = "1";
      }
      break;
    case "scroll":
    default:
      hideDock();
      break;
  }

  // 调试信息
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log(
      "Dock initialized successfully - positioned at perfect center bottom",
    );
  }
})();
