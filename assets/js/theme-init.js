// 主题初始化脚本
(function () {
const theme = localStorage.getItem('theme') || 'system';
const colorScheme = localStorage.getItem('colorScheme') || '{{ site.Params.colorScheme | default "shadcn" }}';

// 设置颜色主题
document.documentElement.setAttribute('data-theme', colorScheme);

// 设置明暗模式
function applyTheme() {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    } else {
    document.documentElement.classList.remove('dark');
    }
}

applyTheme();

// 监听系统主题变化
if (theme === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
}
})();
