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

const colorSchemes = {{ hugo.Data.themes | default dict | jsonify | safeJS }};
const configuredScheme = '{{ site.Params.colorScheme | default "default" }}';
const storedScheme = readStorage('colorScheme');
const colorScheme = Object.prototype.hasOwnProperty.call(colorSchemes || {}, storedScheme)
    ? storedScheme
    : configuredScheme;
const contentWidth = Number.parseInt(readStorage('contentWidth'), 10);
const hasStoredWidth = Number.isInteger(contentWidth) && contentWidth >= 40 && contentWidth <= 90;
const configuredBlur = Number.parseInt('{{ site.Params.backdropBlur | default 12 }}', 10);
const defaultBlur = Number.isInteger(configuredBlur) && configuredBlur >= 0 && configuredBlur <= 24 ? configuredBlur : 12;
const storedBlur = Number.parseInt(readStorage('backdropBlur'), 10);
const hasStoredBlur = Number.isInteger(storedBlur) && storedBlur >= 0 && storedBlur <= 24;
const initialBlur = hasStoredBlur ? storedBlur : defaultBlur;
const configuredGrain = Number.parseInt('{{ site.Params.grainSize | default 0 }}', 10);
const defaultGrain = Number.isInteger(configuredGrain) && configuredGrain >= 0 && configuredGrain <= 100 ? configuredGrain : 0;
const storedGrain = Number.parseInt(readStorage('grainSize'), 10);
const hasStoredGrain = Number.isInteger(storedGrain) && storedGrain >= 0 && storedGrain <= 100;
const initialGrain = hasStoredGrain ? storedGrain : defaultGrain;

// 尽早恢复用户设置的页面宽度、磨砂模糊度与噪点大小，避免首屏闪动
if (hasStoredWidth) {
    root.style.setProperty('--content-width', `${contentWidth}rem`);
}
root.style.setProperty('--backdrop-blur', `${initialBlur}px`);
root.style.setProperty('--surface-alpha', `${initialBlur > 0 ? Math.max(68, 92 - Math.round((initialBlur / 24) * 20)) : 100}%`);
root.style.setProperty('--grain-size', `${Math.round(64 + initialGrain * 2.5)}px`);
root.style.setProperty('--grain-opacity', initialGrain > 0 ? (0.04 + (initialGrain / 100) * 0.20).toFixed(3) : '0');
// 设置颜色主题
root.setAttribute('data-theme', colorScheme);

// 侧边目录：常显偏好覆盖模板渲染出的默认值
const storedPin = readStorage('tocPinned');
if (storedPin === 'true' || storedPin === 'false') {
    root.setAttribute('data-toc-pinned', storedPin);
}

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
