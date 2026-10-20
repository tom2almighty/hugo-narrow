// 主题初始化脚本
// 注意：本文件经 resources.ExecuteAsTemplate 渲染且输出路径固定，结果会跨页面缓存，
// 因此只能读取站点级参数，不能读取页面 front matter。
(function () {
const root = document.documentElement;

function readStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (_) {
        return null;
    }
}

function currentTheme() {
    const stored = readStorage('theme');
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

const colorSchemes = {{ site.Params.themes | default dict | jsonify | safeJS }};
const configuredScheme = '{{ site.Params.colorScheme | default "default" }}';
const storedScheme = readStorage('colorScheme');
const colorScheme = Object.prototype.hasOwnProperty.call(colorSchemes || {}, storedScheme)
    ? storedScheme
    : configuredScheme;
const contentWidth = Number.parseInt(readStorage('contentWidth'), 10);
const hasStoredWidth = Number.isInteger(contentWidth) && contentWidth >= 40 && contentWidth <= 90;

// 尽早恢复用户设置的页面宽度，避免首屏布局闪动
if (hasStoredWidth) {
    root.style.setProperty('--content-width', `${contentWidth}rem`);
}

// 设置颜色主题
root.setAttribute('data-theme', colorScheme);

// 侧边目录：常显偏好覆盖模板渲染出的默认值
const storedPin = readStorage('tocPinned');
if (storedPin === 'true' || storedPin === 'false') {
    root.setAttribute('data-toc-pinned', storedPin);
}

// 侧边目录：首屏前算出页面容器两侧的留白，决定竖条与面板的形态，避免闪动
// 阈值与 assets/js/toc.js 保持一致（单位 rem）
const rootFontSize = Number.parseFloat(getComputedStyle(root).fontSize) || 16;
const defaultWidth = '{{ site.Params.contentWidth | default "56rem" }}';
const defaultWidthValue = Number.parseFloat(defaultWidth);
let pageWidth = 56 * rootFontSize;
if (Number.isFinite(defaultWidthValue)) {
    pageWidth = /r?em\s*$/.test(defaultWidth) ? defaultWidthValue * rootFontSize : defaultWidthValue;
}
if (hasStoredWidth) {
    pageWidth = contentWidth * rootFontSize;
}

const viewport = root.clientWidth;
const gutter = Math.max(0, (viewport - Math.min(pageWidth, viewport)) / 2);
let tocSpace = 'narrow';
if (viewport >= 64 * rootFontSize) {
    if (gutter >= 13 * rootFontSize) tocSpace = 'wide';
    else if (gutter >= 2 * rootFontSize) tocSpace = 'tight';
}
root.setAttribute('data-toc-space', tocSpace);
root.style.setProperty('--toc-gutter', `${Math.round(gutter)}px`);

// 设置明暗模式
function applyTheme() {
    const theme = currentTheme();
    const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
}

applyTheme();

// 监听系统主题变化；applyTheme 每次读取当前偏好，用户切走后不会误触发
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
})();
