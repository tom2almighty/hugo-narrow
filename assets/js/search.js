/**
 * 搜索功能模块
 *
 * 提供全站搜索功能，支持键盘导航和高亮显示
 *
 */

(function () {
  "use strict";

  // DOM 元素
  let searchModal = null;
  let searchOverlay = null;
  let searchInput = null;
  let searchClear = null;
  let searchClose = null;
  let searchResults = null;
  let searchEmpty = null;
  let searchLoading = null;
  let searchNoResults = null;
  let searchResultsList = null;
  let searchStats = null;
  let searchItems = null;

  // 状态变量
  let isModalVisible = false;
  let searchData = null;
  let currentResults = [];
  let selectedIndex = -1;
  let searchTimeout = null;

  // 初始化
  function init() {
    // 获取 DOM 元素
    searchModal = document.getElementById("search-modal");
    searchOverlay = document.getElementById("search-overlay");
    searchInput = document.getElementById("search-input");
    searchClear = document.getElementById("search-clear");
    searchClose = document.getElementById("search-close");
    searchResults = document.getElementById("search-results");
    searchEmpty = document.getElementById("search-empty");
    searchLoading = document.getElementById("search-loading");
    searchNoResults = document.getElementById("search-no-results");
    searchResultsList = document.getElementById("search-results-list");
    searchStats = document.getElementById("search-stats");
    searchItems = document.getElementById("search-items");

    // 检查是否有搜索模态框
    if (!searchModal) {
      return;
    }

    // 绑定事件
    bindEvents();

    // 预加载搜索数据
    loadSearchData();
  }

  // 绑定事件
  function bindEvents() {
    // 关闭按钮
    if (searchClose) {
      searchClose.addEventListener("click", hideSearch);
    }

    // 清空按钮
    if (searchClear) {
      searchClear.addEventListener("click", clearSearch);
    }

    // 点击遮罩层关闭
    if (searchOverlay) {
      searchOverlay.addEventListener("click", hideSearch);
    }

    // 输入框事件
    if (searchInput) {
      searchInput.addEventListener("input", handleInput);
      searchInput.addEventListener("keydown", handleKeydown);
    }

    // 全局键盘事件
    document.addEventListener("keydown", handleGlobalKeydown);

    // 搜索结果点击事件
    if (searchItems) {
      searchItems.addEventListener("click", handleResultClick);
    }
  }

  // 处理全局键盘事件
  function handleGlobalKeydown(e) {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      showSearch();
      return;
    }

    // ESC 关闭搜索
    if (e.key === "Escape" && isModalVisible) {
      hideSearch();
      return;
    }
  }

  // 处理输入框键盘事件
  function handleKeydown(e) {
    if (!isModalVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        navigateResults(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        navigateResults(-1);
        break;
      case "Enter":
        e.preventDefault();
        selectResult();
        break;
      case "Escape":
        hideSearch();
        break;
    }
  }

  // 处理输入事件
  function handleInput(e) {
    const query = e.target.value.trim();

    // 显示/隐藏清空按钮
    toggleClearButton(query.length > 0);

    // 清除之前的搜索定时器
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // 重置导航状态
    resetNavigation();

    // 防抖搜索
    searchTimeout = setTimeout(() => {
      if (query.length === 0) {
        showEmptyState();
      } else {
        performSearch(query);
      }
    }, 300);
  }

  // 处理结果点击
  function handleResultClick(e) {
    const resultItem = e.target.closest("[data-url]");
    if (resultItem) {
      const url = resultItem.dataset.url;
      if (url) {
        window.location.href = url;
      }
    }
  }

  // 显示搜索模态框
  function showSearch() {
    if (!searchModal || isModalVisible) return;

    isModalVisible = true;

    // 显示遮罩层和模态框
    searchOverlay.classList.remove("opacity-0", "pointer-events-none");
    searchOverlay.classList.add("opacity-100");

    searchModal.classList.remove(
      "opacity-0",
      "scale-95",
      "pointer-events-none",
    );
    searchModal.classList.add("opacity-100", "scale-100");

    // 防止背景滚动
    document.body.style.overflow = "hidden";

    // 聚焦输入框
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  // 隐藏搜索模态框
  function hideSearch() {
    if (!searchModal || !isModalVisible) return;

    isModalVisible = false;

    // 隐藏遮罩层和模态框
    searchOverlay.classList.add("opacity-0", "pointer-events-none");
    searchOverlay.classList.remove("opacity-100");

    searchModal.classList.add("opacity-0", "scale-95", "pointer-events-none");
    searchModal.classList.remove("opacity-100", "scale-100");

    // 恢复背景滚动
    document.body.style.overflow = "";

    // 清空搜索内容和重置状态
    clearSearchContent();
    resetNavigation();
  }

  // 清空搜索内容
  function clearSearchContent() {
    if (searchInput) {
      searchInput.value = "";
    }
    toggleClearButton(false);
    showEmptyState();
    currentResults = [];
    selectedIndex = -1;
  }

  // 重置导航状态
  function resetNavigation() {
    // 移除之前的选中状态
    const prevSelected =
      searchItems && searchItems.querySelector(".search-result-selected");
    if (prevSelected) {
      prevSelected.classList.remove("search-result-selected");
    }
    selectedIndex = -1;
  }

  // 清空搜索
  function clearSearch() {
    clearSearchContent();
    if (searchInput) {
      searchInput.focus();
    }
  }

  // 切换清空按钮显示
  function toggleClearButton(show) {
    if (!searchClear) return;

    if (show) {
      searchClear.classList.remove("opacity-0", "pointer-events-none");
      searchClear.classList.add("opacity-100");
    } else {
      searchClear.classList.add("opacity-0", "pointer-events-none");
      searchClear.classList.remove("opacity-100");
    }
  }

  // 显示空状态
  function showEmptyState() {
    hideAllStates();
    resetNavigation();
    if (searchEmpty) {
      searchEmpty.classList.remove("hidden");
    }
  }

  // 显示加载状态
  function showLoadingState() {
    hideAllStates();
    resetNavigation();
    if (searchLoading) {
      searchLoading.classList.remove("hidden");
    }
  }

  // 显示无结果状态
  function showNoResultsState() {
    hideAllStates();
    resetNavigation();
    if (searchNoResults) {
      searchNoResults.classList.remove("hidden");
    }
  }

  // 显示结果列表
  function showResultsList() {
    hideAllStates();
    if (searchResultsList) {
      searchResultsList.classList.remove("hidden");
    }
  }

  // 隐藏所有状态
  function hideAllStates() {
    const states = [
      searchEmpty,
      searchLoading,
      searchNoResults,
      searchResultsList,
    ];
    states.forEach((state) => {
      if (state) {
        state.classList.add("hidden");
      }
    });
  }

  // 加载搜索数据
  async function loadSearchData() {
    if (searchData) return searchData;

    try {
      
      let indexURL = window.HUGO_SEARCH_CONFIG?.searchIndexURL || "/index.json";
      indexURL = indexURL.replace(/['"]/g, '').replace(/%22/g, '');

      const response = await fetch(indexURL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // 适配 insight.js 的数据结构
      if (data && typeof data === "object") {
        // 转换为我们需要的格式
        const posts = data.posts || [];
        searchData = posts.map((post) => ({
          title: post.title,
          content: post.text,
          summary: post.text ? post.text.substring(0, 200) : "",
          url: post.link,
          date: "",
          categories: [],
          tags: [],
        }));
      } else {
        searchData = [];
      }

      return searchData;
    } catch (error) {
      return [];
    }
  }

  // 执行搜索
  async function performSearch(query) {
    showLoadingState();

    try {
      const data = await loadSearchData();
      const results = searchInData(data, query);

      currentResults = results;
      // 重置导航索引但不设置选中状态
      selectedIndex = -1;

      if (results.length === 0) {
        showNoResultsState();
      } else {
        displayResults(results, query);
        showResultsList();
      }
    } catch (error) {
      showNoResultsState();
    }
  }

  // 解析关键词 - 基于 insight.js
  function parseKeywords(keywords) {
    return keywords
      .split(" ")
      .filter((keyword) => {
        return !!keyword;
      })
      .map((keyword) => {
        return keyword.toLowerCase();
      });
  }

  // 过滤函数 - 基于 insight.js，修复字段检查
  function filter(keywords, obj, fields) {
    const keywordArray = parseKeywords(keywords);
    const containKeywords = keywordArray.filter((keyword) => {
      const containFields = fields.filter((field) => {
        if (!obj.hasOwnProperty(field) || !obj[field]) {
          return false;
        }
        // 确保字段值是字符串
        const fieldValue = String(obj[field]).toLowerCase();
        if (fieldValue.indexOf(keyword) > -1) {
          return true;
        }
        return false;
      });
      if (containFields.length > 0) {
        return true;
      }
      return false;
    });
    return containKeywords.length === keywordArray.length;
  }

  // 权重计算函数 - 基于 insight.js，修复字段检查
  function weight(keywords, obj, fields, weights) {
    let value = 0;
    parseKeywords(keywords).forEach((keyword) => {
      const pattern = new RegExp(escapeRegExp(keyword), "gim"); // Global, Multi-line, Case-insensitive
      fields.forEach((field, index) => {
        if (obj.hasOwnProperty(field) && obj[field]) {
          // 确保字段值是字符串
          const fieldValue = String(obj[field]);
          const matches = fieldValue.match(pattern);
          value += matches ? matches.length * weights[index] : 0;
        }
      });
    });
    return value;
  }

  // 转义正则表达式特殊字符
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // 简化的搜索算法 - 适配 insight.js 数据结构
  function searchInData(data, query) {
    if (!query || query.trim() === "") {
      return [];
    }

    const keywords = parseKeywords(query);
    const results = [];

    data.forEach((item, index) => {
      let score = 0;
      let hasMatch = false;

      // 检查每个关键词
      keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();

        // 检查标题
        if (item.title && item.title.toLowerCase().includes(keywordLower)) {
          score += 10;
          hasMatch = true;
        }

        // 检查内容 (insight.js 使用 content 字段)
        if (item.content && item.content.toLowerCase().includes(keywordLower)) {
          score += 1;
          hasMatch = true;
        }

        // 检查摘要 (如果有的话)
        if (item.summary && item.summary.toLowerCase().includes(keywordLower)) {
          score += 5;
          hasMatch = true;
        }
      });

      if (hasMatch) {
        results.push({
          ...item,
          score,
          keywords,
        });
      }
    });

    // 按分数排序
    const sortedResults = results.sort((a, b) => b.score - a.score);

    return sortedResults;
  }

  // 显示搜索结果
  function displayResults(results, query) {
    if (!searchStats || !searchItems) return;

    // 更新统计信息 - 从模板元素读取翻译
    const statsTemplate = document.getElementById("search-stats");
    if (statsTemplate) {
      const template = statsTemplate.dataset.template;
      searchStats.textContent = template.replace('%d', results.length);
    } else {
      searchStats.textContent = `Found ${results.length} results`;
    }

    // 清空之前的结果
    searchItems.innerHTML = "";

    // 生成结果项
    results.forEach((result, index) => {
      const resultElement = createResultElement(result, query, index);
      searchItems.appendChild(resultElement);
    });
  }

  // 根据匹配度分数生成星星显示
  function generateStarRating(score) {
    if (!score || score <= 0) return "";

    // 定义星星数量的阈值
    // 基于当前评分系统：标题匹配10分，摘要匹配5分，内容匹配1分
    let starCount;
    if (score >= 20) {
      starCount = 5; // 高匹配度：多个关键词在标题中匹配
    } else if (score >= 15) {
      starCount = 4; // 较高匹配度：标题+摘要匹配
    } else if (score >= 10) {
      starCount = 3; // 中等匹配度：标题匹配或多个摘要匹配
    } else if (score >= 5) {
      starCount = 2; // 较低匹配度：摘要匹配
    } else {
      starCount = 1; // 低匹配度：仅内容匹配
    }

    // 生成星星字符串
    return "★".repeat(starCount);
  }

  // 创建结果元素
  function createResultElement(result, query, index) {
    const div = document.createElement("div");
    div.className =
      "search-result-item p-4 cursor-pointer rounded-lg transition-all duration-200 ease-out hover:bg-primary/10 hover:text-primary";
    div.dataset.url = result.url;
    div.dataset.index = index;

    // 使用改进的高亮算法
    const keywords = result.keywords || parseKeywords(query);

    // 高亮标题
    const highlightedTitle = highlightText(result.title, keywords);

    // 高亮摘要，限制长度
    const highlightedSummary = findAndHighlight(
      result.summary || result.content,
      keywords,
      120,
    );

    // 生成星星评级显示
    const starRating = generateStarRating(result.score);

    div.innerHTML = `
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-foreground line-clamp-1">
          ${highlightedTitle}
        </h3>
        <p class="text-sm text-muted-foreground line-clamp-2">
          ${highlightedSummary}
        </p>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>${result.date}</span>
          ${
            result.categories && result.categories.length > 0
              ? `<span>•</span><span>${result.categories[0]}</span>`
              : ""
          }
          ${starRating ? `<span style="color: #f59e0b;">${starRating}</span>` : ""}
        </div>
      </div>
    `;

    return div;
  }

  // 合并重叠的范围 - 基于 insight.js
  function merge(ranges) {
    let last;
    const result = [];

    ranges.forEach((r) => {
      if (!last || r[0] > last[1]) {
        result.push((last = r));
      } else if (r[1] > last[1]) {
        last[1] = r[1];
      }
    });

    return result;
  }

  // 查找并高亮文本 - 基于 insight.js
  function findAndHighlight(text, matches, maxlen) {
    if (!Array.isArray(matches) || !matches.length || !text) {
      return maxlen ? text.slice(0, maxlen) : text;
    }

    const testText = text.toLowerCase();
    const indices = matches
      .map((match) => {
        const index = testText.indexOf(match.toLowerCase());
        if (!match || index === -1) {
          return null;
        }
        return [index, index + match.length];
      })
      .filter((match) => {
        return match !== null;
      })
      .sort((a, b) => {
        return a[0] - b[0] || a[1] - b[1];
      });

    if (!indices.length) {
      return text;
    }

    let result = "";
    let last = 0;
    const ranges = merge(indices);
    const sumRange = [ranges[0][0], ranges[ranges.length - 1][1]];

    if (maxlen && maxlen < sumRange[1]) {
      last = sumRange[0];
    }

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      result += text.slice(last, Math.min(range[0], sumRange[0] + maxlen));
      if (maxlen && range[0] >= sumRange[0] + maxlen) {
        break;
      }
      result +=
        '<mark class="bg-primary/20 text-primary px-1 rounded font-medium">' +
        text.slice(range[0], range[1]) +
        "</mark>";
      last = range[1];
      if (i === ranges.length - 1) {
        if (maxlen) {
          result += text.slice(
            range[1],
            Math.min(text.length, sumRange[0] + maxlen + 1),
          );
        } else {
          result += text.slice(range[1]);
        }
      }
    }

    return result;
  }

  // 高亮文本 - 使用改进的算法
  function highlightText(text, keywords) {
    if (!text || !keywords || !Array.isArray(keywords)) return text;
    return findAndHighlight(text, keywords);
  }

  // 导航搜索结果 - 修复导航逻辑
  function navigateResults(direction) {
    // 检查是否有搜索结果
    if (!currentResults || currentResults.length === 0) {
      return;
    }

    // 确保 searchItems 存在
    if (!searchItems) {
      return;
    }

    // 移除之前的选中状态
    const prevSelected = searchItems.querySelector(".search-result-selected");
    if (prevSelected) {
      prevSelected.classList.remove("search-result-selected");
    }

    // 计算新的索引
    if (selectedIndex === -1) {
      // 首次导航
      selectedIndex = direction > 0 ? 0 : currentResults.length - 1;
    } else {
      selectedIndex += direction;
      // 循环导航
      if (selectedIndex < 0) {
        selectedIndex = currentResults.length - 1;
      } else if (selectedIndex >= currentResults.length) {
        selectedIndex = 0;
      }
    }

    // 添加新的选中状态
    const newSelected = searchItems.querySelector(
      `[data-index="${selectedIndex}"]`,
    );
    if (newSelected) {
      newSelected.classList.add("search-result-selected");
      // 滚动到可见区域
      newSelected.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }

  // 选择结果
  function selectResult() {
    if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
      const result = currentResults[selectedIndex];
      if (result.url) {
        window.location.href = result.url;
      }
    }
  }

  // 切换搜索显示状态
  function toggleSearch() {
    if (isModalVisible) {
      hideSearch();
    } else {
      showSearch();
    }
  }

  // 暴露全局方法
  window.Search = {
    show: showSearch,
    hide: hideSearch,
    toggle: toggleSearch,
    isVisible: () => isModalVisible,
  };

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
