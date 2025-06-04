# 阅读进度条功能

一个优雅的页面阅读进度指示器，固定在页面顶部，根据用户的滚动位置动态显示阅读进度。

## 功能特性

### ✨ 核心功能
- **实时进度** - 根据页面滚动位置实时计算阅读进度
- **主题适配** - 自动适配当前主题的主色调和暗色模式
- **平滑动画** - 流畅的宽度过渡效果
- **性能优化** - 使用节流机制避免过度渲染
- **响应式设计** - 适配移动端和桌面端

### 🎯 用户体验
- **非侵入式** - 固定在顶部，不影响正常阅读
- **即时反馈** - 提供清晰的阅读进度视觉反馈
- **导航辅助** - 帮助用户估算剩余阅读时间
- **可配置性** - 支持多种显示和行为配置

## 配置选项

### 全局配置

在 `hugo.yaml` 中配置：

```yaml
# 阅读进度条配置
readingProgress:
  enabled: true             # 启用阅读进度条
  height: 3                 # 进度条高度(px)
  showOnHomepage: false     # 是否在首页显示
  smoothScroll: true        # 是否启用平滑滚动效果
  hideOnComplete: false     # 阅读完成后是否隐藏
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `true` | 是否启用阅读进度条 |
| `height` | number | `3` | 进度条高度（像素） |
| `showOnHomepage` | boolean | `false` | 是否在首页显示 |
| `smoothScroll` | boolean | `true` | 是否启用平滑滚动效果 |
| `hideOnComplete` | boolean | `false` | 阅读完成后是否隐藏 |

## 显示逻辑

### 页面类型
- **首页** (`home`): 根据 `showOnHomepage` 配置决定是否显示
- **文章页** (`page`): 自动显示
- **列表页** (`list`): 自动显示
- **分类页** (`taxonomy`): 自动显示

### 显示条件
```go
{{- $shouldShow := false -}}
{{- if $enabled -}}
  {{- if eq .Kind "home" -}}
    {{- $shouldShow = $showOnHomepage -}}
  {{- else -}}
    {{- $shouldShow = true -}}
  {{- end -}}
{{- end -}}
```

## 技术实现

### HTML 结构
```html
<div id="reading-progress-container" 
     class="reading-progress-container fixed top-0 left-0 right-0 z-50">
  <!-- 进度条背景 -->
  <div class="reading-progress-bg w-full bg-border/20"></div>
  
  <!-- 进度条 -->
  <div id="reading-progress-bar" 
       class="reading-progress-bar absolute top-0 left-0 h-full"></div>
</div>
```

### CSS 样式（使用 Tailwind 类和主题变量）
```html
<!-- 进度条容器 -->
<div class="fixed top-0 left-0 right-0 z-50 pointer-events-none
            transition-opacity duration-300 ease-out">

  <!-- 进度条背景 -->
  <div class="w-full"
       style="background-color: var(--reading-progress-bg);"></div>

  <!-- 进度条 -->
  <div class="absolute top-0 left-0 h-full w-0
              bg-gradient-to-r from-primary to-primary/80
              transition-all duration-150 ease-out"
       style="box-shadow: 0 0 8px var(--reading-progress-shadow);"></div>
</div>
```

### 主题变量（@theme inline）
```css
@theme inline {
  /* 阅读进度条主题变量 */
  --reading-progress-bg: color-mix(in srgb, var(--color-border) 30%, transparent);
  --reading-progress-shadow: color-mix(in srgb, var(--color-primary) 30%, transparent);
}
```

### JavaScript 逻辑（优化版）
```javascript
// 简化的进度计算
function calculateProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollableHeight = documentHeight - windowHeight;

  if (scrollableHeight <= 0) return 0;

  return Math.min(Math.max(scrollTop / scrollableHeight * 100, 0), 100);
}

// 优化的更新函数
function updateProgress() {
  const progress = calculateProgress();
  progressBar.style.width = progress + '%';

  // 处理完成时隐藏
  if (config.hideOnComplete && progress >= 99.5) {
    if (isVisible) {
      progressContainer.style.opacity = '0';
      isVisible = false;
    }
  } else if (!isVisible) {
    progressContainer.style.opacity = '1';
    isVisible = true;
  }
}

// 简化的节流处理
let ticking = false;
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
    ticking = true;
  }
}
```

## 主题适配

### 自动主题适配
进度条通过 `@theme inline` 中的 CSS 变量自动适配所有主题：

#### 主题变量系统
```css
@theme inline {
  /* 自动适配的主题变量 */
  --reading-progress-bg: color-mix(in srgb, var(--color-border) 30%, transparent);
  --reading-progress-shadow: color-mix(in srgb, var(--color-primary) 30%, transparent);
}
```

#### 优势
- **自动适配** - 无需为每个主题单独配置
- **未来兼容** - 新增主题自动支持
- **一致性** - 与主题色彩系统完全一致
- **动态计算** - 使用 `color-mix()` 动态生成颜色

#### Tailwind 类支持
```html
<!-- 使用 Tailwind 工具类 -->
<div class="bg-gradient-to-r from-primary to-primary/80">
  <!-- 自动适配当前主题的主色调 -->
</div>
```

#### 支持的主题
- **Shadcn 主题** - 蓝色系 (自动适配)
- **Claude 主题** - 橙色系 (自动适配)
- **自定义主题** - 任何新主题都会自动适配
- **暗色模式** - 所有主题的暗色变体

## 性能优化

### 节流机制
```javascript
let ticking = false;

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateProgress);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick, { passive: true });
```

### 优化策略
1. **requestAnimationFrame**: 避免过度渲染
2. **passive 事件**: 提升滚动性能
3. **will-change**: 启用硬件加速
4. **事件清理**: 页面卸载时清理监听器

### 内存管理
```javascript
function cleanup() {
  window.removeEventListener('scroll', requestTick);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
}

window.addEventListener('beforeunload', cleanup);
```

## 响应式设计

### 移动端适配
```css
@media (max-width: 768px) {
  .reading-progress-container {
    z-index: 40; /* 避免与移动端元素冲突 */
  }
}
```

### 触摸设备优化
- 支持触摸滚动
- 优化触摸事件性能
- 适配不同屏幕尺寸

## 兼容性

### 浏览器支持
- **Chrome 60+**: 完全支持
- **Firefox 55+**: 完全支持
- **Safari 12+**: 完全支持
- **Edge 79+**: 完全支持

### 功能兼容
- ✅ **其他组件**: 不影响现有功能
- ✅ **主题切换**: 自动适配主题变化
- ✅ **响应式**: 适配所有设备尺寸
- ✅ **无障碍**: 不影响屏幕阅读器

## 使用场景

### 适合使用
- **长文章**: 帮助用户了解阅读进度
- **教程文档**: 提供学习进度反馈
- **博客文章**: 增强阅读体验
- **技术文档**: 辅助导航和进度管理

### 不建议使用
- **短页面**: 内容较少时意义不大
- **首页**: 通常内容结构复杂
- **特殊页面**: 如登录页、错误页等

## 故障排除

### 进度条不显示
1. **检查配置**: 确认 `enabled: true`
2. **页面类型**: 确认不是首页（除非配置显示）
3. **JavaScript 错误**: 检查浏览器控制台
4. **CSS 加载**: 确认样式文件正确加载

### 进度不准确
1. **页面高度**: 确认页面内容完全加载
2. **动态内容**: 检查是否有影响页面高度的动态内容
3. **滚动容器**: 验证滚动计算是否正确
4. **窗口大小**: 确认窗口大小变化时重新计算

### 性能问题
1. **事件冲突**: 检查是否有其他滚动事件冲突
2. **节流机制**: 确认 requestAnimationFrame 正常工作
3. **内存泄漏**: 验证事件监听器是否正确清理
4. **硬件加速**: 确认 CSS 动画使用硬件加速

### 样式问题
1. **主题适配**: 检查主题变量是否正确
2. **z-index**: 确认层级关系正确
3. **颜色对比**: 验证在不同主题下的可见性
4. **响应式**: 测试不同设备尺寸下的显示

## 自定义配置示例

### 在首页显示
```yaml
readingProgress:
  enabled: true
  showOnHomepage: true
```

### 调整样式
```yaml
readingProgress:
  enabled: true
  height: 5                 # 更粗的进度条
  smoothScroll: false       # 禁用平滑动画
  hideOnComplete: true      # 完成后隐藏
```

### 最小配置
```yaml
readingProgress:
  enabled: true
```

## 优化总结

### v2.0.0 优化版本
本次优化主要包含以下改进：

#### 1. 样式优化
- **Tailwind 类替代** - 使用 Tailwind 工具类替代自定义 CSS
- **主题变量统一** - 通过 `@theme inline` 实现自动主题适配
- **CSS 体积减少** - 移除了约 40 行自定义 CSS 代码

#### 2. JavaScript 简化
- **代码精简** - 减少了约 50% 的 JavaScript 代码
- **逻辑优化** - 简化了进度计算和更新逻辑
- **性能提升** - 更高效的节流处理机制

#### 3. 主题系统改进
- **自动适配** - 无需为特定主题编写样式
- **未来兼容** - 新增主题自动支持进度条
- **一致性** - 与整体主题系统完全一致

#### 4. 维护性提升
- **代码简洁** - 更易于理解和维护
- **模块化** - 更好的代码组织结构
- **可扩展** - 便于后续功能扩展

### 对比表

| 方面 | v1.0.0 | v2.0.0 优化版 |
|------|--------|---------------|
| **CSS 行数** | ~40 行 | ~6 行 (主题变量) |
| **JavaScript 行数** | ~120 行 | ~60 行 |
| **主题适配** | 硬编码主题 | 自动适配 |
| **Tailwind 使用** | 部分使用 | 完全使用 |
| **维护复杂度** | 中等 | 低 |
| **扩展性** | 有限 | 优秀 |

## 更新日志

### v2.0.0 (优化版)
- 使用 Tailwind 类替代自定义 CSS
- 通过 @theme inline 实现自动主题适配
- 简化 JavaScript 逻辑，提升性能
- 减少代码体积，提升维护性
- 完全兼容所有现有和未来主题

### v1.0.0
- 初始版本发布
- 支持基础阅读进度显示
- 主题颜色自动适配
- 性能优化和响应式设计
- 完整的配置选项
