# 简洁代码块折叠功能

一个优雅简洁的代码块折叠功能，通过头部按钮控制整个代码块的展开/折叠状态。

## 功能特性

### ✨ 核心功能
- **一键折叠** - 通过头部按钮控制整个代码块
- **智能遮罩** - 折叠时显示渐变遮罩和展开提示
- **自动折叠** - 超过指定行数或高度自动折叠
- **流畅动画** - 平滑的展开/折叠过渡效果
- **点击展开** - 可点击遮罩区域快速展开

### 🎯 用户体验
- **简洁设计** - 不复杂的行级折叠，整体折叠更直观
- **无缝集成** - 与复制、行号功能完美兼容
- **响应式设计** - 适配移动端和桌面端
- **主题适配** - 自动适应亮色/暗色主题
- **键盘友好** - 支持键盘导航

## 配置选项

### 全局配置

在 `hugo.yaml` 中配置：

```yaml
# 代码块折叠配置
codeblock:
  collapse:
    enabled: true           # 启用折叠功能
    defaultState: expanded  # 默认状态: expanded, collapsed
    autoCollapseLines: 30   # 超过指定行数自动折叠
    autoCollapseHeight: 400 # 超过指定高度(px)自动折叠
    collapsedHeight: 120    # 折叠时显示的高度(px)
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `true` | 是否启用折叠功能 |
| `defaultState` | string | `expanded` | 默认状态：`expanded` 或 `collapsed` |
| `autoCollapseLines` | number | `30` | 超过此行数自动折叠 |
| `autoCollapseHeight` | number | `400` | 超过此高度(px)自动折叠 |
| `collapsedHeight` | number | `120` | 折叠时显示的高度(px) |

## 使用方法

### 基础用法

#### 普通代码块
```markdown
```python
def example():
    # 会显示折叠按钮，用户可以手动折叠
    pass
```
```

#### 强制折叠
```markdown
```python {collapsed=true}
def example():
    # 这个代码块会默认被折叠
    pass
```
```

#### 设置默认状态
```markdown
```python {defaultState="collapsed"}
def example():
    # 使用默认状态配置
    pass
```
```

### 自动折叠

#### 基于行数
当代码块超过 `autoCollapseLines` 设置的行数时，会自动折叠。

#### 基于高度
当代码块高度超过 `autoCollapseHeight` 设置的像素值时，会自动折叠。

## 交互方式

### 1. 头部按钮
- 点击代码块头部的折叠按钮
- 按钮图标会在 ↑ 和 ↓ 之间切换
- 按钮文字会在"折叠"和"展开"之间切换

### 2. 点击遮罩
- 在折叠状态下，点击渐变遮罩区域
- 点击底部的"点击展开查看更多"提示
- 提供快速展开的便捷方式

### 3. 视觉反馈
- 折叠时显示渐变遮罩效果
- 底部显示展开提示文字
- 鼠标悬停时提示文字会轻微放大

## 技术实现

### HTML 结构
```html
<div class="code-block-container">
  <div class="code-block-header">
    <!-- 折叠按钮 -->
    <button class="collapse-code-btn">
      <span class="collapse-icon">↑</span>
      <span class="collapse-text">折叠</span>
    </button>
  </div>
  <div class="code-block-content">
    <!-- 代码内容 -->
    <div class="collapse-overlay">
      <div>点击展开查看更多</div>
    </div>
  </div>
</div>
```

### CSS 样式
```css
/* 折叠遮罩 */
.collapse-overlay {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

/* 代码块内容过渡 */
.code-block-content {
  transition: max-height 0.3s ease-out;
}
```

### JavaScript 逻辑
```javascript
// 切换折叠状态
function setCollapsed(collapsed, animate = true) {
  if (collapsed) {
    codeContainer.style.maxHeight = collapsedHeight + 'px';
    collapseOverlay.style.opacity = '1';
  } else {
    codeContainer.style.maxHeight = '';
    collapseOverlay.style.opacity = '0';
  }
}
```

## 最佳实践

### 📝 内容组织
1. **适度使用** - 对于真正长的代码块使用折叠
2. **保持一致** - 在同一页面使用一致的折叠策略
3. **用户友好** - 提供清晰的展开提示
4. **性能考虑** - 合理设置自动折叠阈值

### 🎨 用户体验
1. **直观操作** - 头部按钮位置明显易找
2. **快速展开** - 提供多种展开方式
3. **视觉反馈** - 清晰的状态指示
4. **流畅动画** - 平滑的过渡效果

## 兼容性

### 功能兼容
- ✅ 复制功能 - 折叠不影响代码复制
- ✅ 行号显示 - 与内联行号完美兼容
- ✅ 语法高亮 - 保持 Hugo Chroma 高亮效果
- ✅ 主题切换 - 自动适应主题变化
- ✅ 响应式设计 - 移动端和桌面端都支持

### 浏览器支持
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 故障排除

### 折叠按钮不显示
1. 检查 `codeblock.collapse.enabled` 是否为 `true`
2. 确认浏览器控制台无 JavaScript 错误
3. 验证图标文件是否存在

### 折叠效果不正常
1. 检查 CSS 是否正确加载
2. 验证 `collapsedHeight` 配置是否合理
3. 确认代码块高度是否满足自动折叠条件

### 动画不流畅
1. 检查 CSS transition 属性
2. 验证浏览器是否支持相关 CSS 特性
3. 确认没有其他 CSS 冲突

## 与复杂折叠的对比

| 特性 | 简洁折叠 | 复杂行级折叠 |
|------|----------|--------------|
| **实现复杂度** | ✅ 简单 | ❌ 复杂 |
| **用户理解** | ✅ 直观 | ❌ 需要学习 |
| **性能影响** | ✅ 最小 | ❌ 较大 |
| **维护成本** | ✅ 低 | ❌ 高 |
| **兼容性** | ✅ 优秀 | ❌ 可能有问题 |
| **用户体验** | ✅ 流畅 | ❌ 可能困惑 |

## 更新日志

### v2.0.0 (简洁版)
- 重新设计为简洁的整体折叠
- 移除复杂的行级折叠功能
- 优化用户体验和性能
- 简化配置选项
- 改进视觉设计
