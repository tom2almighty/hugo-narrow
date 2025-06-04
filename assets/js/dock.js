/**
 * 底部 Dock 控制脚本
 *
 * 功能：
 * - 监听滚动事件，向上滚动时显示 dock
 * - 基础的按钮点击事件处理
 */

(function () {
  "use strict";

  let lastScrollTop = 0;
  let isScrollingUp = false;
  let scrollThreshold = 100; // 滚动阈值

  const dock = document.getElementById("dock");

  if (!dock) return;

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

    // 显示/隐藏 dock
    if (isScrollingUp && currentScrollTop > scrollThreshold) {
      showDock();
    } else if (!isScrollingUp || currentScrollTop <= scrollThreshold) {
      hideDock();
    }

    lastScrollTop = currentScrollTop;
  }

  // 显示 dock
  function showDock() {
    dock.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
    dock.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
  }

  // 隐藏 dock
  function hideDock() {
    dock.classList.remove(
      "translate-y-0",
      "opacity-100",
      "pointer-events-auto",
    );
    dock.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
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
          window.Search.show();
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

  // 初始化：确保 dock 正确隐藏
  hideDock();

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
