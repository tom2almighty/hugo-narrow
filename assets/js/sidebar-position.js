/**
 * 侧边栏位置调整
 * 当 TOC 和 Series 在同一侧时，动态调整 Series 的位置
 */

function adjustSeriesPosition() {
  const tocSidebar = document.getElementById('toc-sidebar');
  const seriesSidebar = document.getElementById('series-sidebar');
  
  // 检查两个侧边栏是否都存在
  if (!tocSidebar || !seriesSidebar) {
    return;
  }
  
  // 检查是否在同一侧
  const sameSide = seriesSidebar.getAttribute('data-same-side') === 'true';
  
  if (!sameSide) {
    return;
  }
  
  // 计算 TOC 的实际高度并设置 Series 的位置
  function updatePosition() {
    const tocHeight = tocSidebar.offsetHeight;
    const gap = 32; // 2rem = 32px 间距
    const topOffset = 96; // 6rem = 96px 初始位置
    
    // 设置 Series 的 top 位置
    const newTop = topOffset + tocHeight + gap;
    seriesSidebar.style.top = `${newTop}px`;
  }
  
  // 初始调整
  setTimeout(updatePosition, 100);
  
  // 监听窗口大小变化
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updatePosition, 200);
  });
  
  // 使用 ResizeObserver 监听 TOC 高度变化（如果支持）
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(updatePosition);
    observer.observe(tocSidebar);
  }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', adjustSeriesPosition);
} else {
  adjustSeriesPosition();
}

