# Prose 样式增强文档

## 概述

为 Hugo Narrow 主题的 prose.css 添加了完整的 Markdown 语法支持，包括任务列表、删除线、高亮文本、上下标、键盘按键、定义列表、嵌套引用、脚注、详情折叠等样式。

## 新增样式功能

### 1. 标题样式完善

#### **新增 h5 和 h6 标题**
```css
.prose h5 {
  @apply scroll-m-20 text-lg font-semibold tracking-tight;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.prose h6 {
  @apply scroll-m-20 text-base font-semibold tracking-tight;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
```

**特点：**
- ✅ 完整的 6 级标题支持
- ✅ 渐进式字体大小
- ✅ 一致的间距和颜色

### 2. 文本格式增强

#### **删除线文本**
```css
.prose del,
.prose s {
  text-decoration: line-through;
  color: var(--color-muted-foreground);
  opacity: 0.8;
}
```

#### **高亮文本**
```css
.prose mark {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--color-primary) 20%, transparent),
    color-mix(in srgb, var(--color-accent) 20%, transparent)
  );
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
}
```

#### **上标和下标**
```css
.prose sup {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 500;
}

.prose sub {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 500;
}
```

#### **键盘按键**
```css
.prose kbd {
  @apply inline-flex items-center px-2 py-1 text-xs font-mono font-semibold rounded border;
  background: var(--color-muted);
  border-color: var(--color-border);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--color-foreground) 10%, transparent);
}
```

#### **缩写**
```css
.prose abbr {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--color-primary);
  cursor: help;
}
```

### 3. 任务列表 (Checkbox)

#### **完整的任务列表支持**
```css
.prose ul li.task-list-item {
  list-style: none;
  padding-left: 2rem;
  margin: 0.5rem 0;
}

.prose ul li.task-list-item input[type="checkbox"] {
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  appearance: none;
  border: 2px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
  transition: all 0.2s ease;
}

.prose ul li.task-list-item input[type="checkbox"]:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.prose ul li.task-list-item input[type="checkbox"]:checked::after {
  content: '✓';
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}
```

**特点：**
- ✅ 自定义复选框样式
- ✅ 主题颜色适配
- ✅ 悬停和选中状态
- ✅ 支持嵌套任务列表

### 4. 定义列表

#### **术语和定义样式**
```css
.prose dt {
  font-weight: 600;
  color: var(--tw-prose-headings);
  position: relative;
  padding-left: 1rem;
}

.prose dt::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 4px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 50%;
}

.prose dd {
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}
```

**特点：**
- ✅ 术语带装饰点
- ✅ 定义带左边框
- ✅ 清晰的层级关系

### 5. 嵌套引用

#### **多层引用支持**
```css
.prose blockquote blockquote {
  margin: 1rem 0;
  border-left-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.prose blockquote blockquote::before {
  color: color-mix(in srgb, var(--color-accent) 20%, transparent);
}
```

**特点：**
- ✅ 嵌套引用使用不同颜色
- ✅ 视觉层级清晰
- ✅ 主题颜色适配

### 6. 脚注

#### **完整的脚注样式**
```css
.prose .footnote-ref {
  color: var(--color-primary);
  font-weight: 500;
  font-size: 0.875rem;
  vertical-align: super;
}

.prose .footnotes {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.875rem;
}

.prose .footnote-backref {
  color: var(--color-primary);
  margin-left: 0.5rem;
}
```

**特点：**
- ✅ 脚注引用上标样式
- ✅ 脚注区域分隔线
- ✅ 返回链接样式

### 7. 详情折叠 (Details/Summary)

#### **交互式折叠元素**
```css
.prose details {
  margin: 1.5rem 0;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-card);
}

.prose details summary {
  padding: 1rem 1.5rem;
  background: color-mix(in srgb, var(--color-muted) 50%, transparent);
  cursor: pointer;
  font-weight: 600;
  position: relative;
}

.prose details summary::before {
  content: '▶';
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.2s ease;
  color: var(--color-primary);
}

.prose details[open] summary::before {
  transform: translateY(-50%) rotate(90deg);
}
```

**特点：**
- ✅ 卡片式设计
- ✅ 动画箭头指示器
- ✅ 悬停效果
- ✅ 主题颜色适配

### 8. 嵌套列表增强

#### **多层列表视觉区分**
```css
/* 二级无序列表使用方形标记 */
.prose ul ul li::before {
  width: 4px;
  height: 4px;
  border-radius: 0;
  background: var(--color-accent);
}

/* 三级无序列表使用三角形标记 */
.prose ul ul ul li::before {
  content: '';
  width: 0;
  height: 0;
  border-left: 3px solid var(--color-accent);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

/* 嵌套有序列表样式调整 */
.prose ol ol li::before {
  background: var(--color-accent);
  font-size: 0.7rem;
  width: 1.1rem;
  height: 1.1rem;
}
```

**特点：**
- ✅ 不同层级使用不同标记
- ✅ 圆点 → 方形 → 三角形
- ✅ 有序列表渐进式大小
- ✅ 颜色层级区分

## 使用示例

### Markdown 语法测试

我创建了一个完整的测试文件 `content/posts/markdown-test.md`，包含：

1. **标题测试** - 6 级标题
2. **文本格式** - 粗体、斜体、删除线、高亮、上下标
3. **列表测试** - 无序、有序、任务列表、定义列表
4. **引用测试** - 简单引用、嵌套引用
5. **代码测试** - 行内代码、代码块
6. **表格测试** - 对齐方式
7. **链接测试** - 普通链接、参考链接
8. **脚注测试** - 数字脚注、命名脚注
9. **特殊元素** - 键盘按键、缩写、折叠详情
10. **混合内容** - 复杂嵌套结构

### 任务列表示例

```markdown
- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务
- [ ] 嵌套任务列表
  - [x] 子任务 1 (已完成)
  - [ ] 子任务 2 (未完成)
```

### 定义列表示例

```markdown
术语 1
: 这是术语 1 的定义。

术语 2
: 这是术语 2 的定义。
: 术语可以有多个定义。
```

### 详情折叠示例

```markdown
<details>
<summary>点击展开详情</summary>

这是折叠的详细内容。

可以包含任何 Markdown 语法：

- 列表项目
- **粗体文本**
- `代码`

</details>
```

## 主题适配

### 颜色变量使用

所有新增样式都使用主题变量：

- `var(--color-primary)` - 主要颜色
- `var(--color-accent)` - 强调颜色
- `var(--color-muted)` - 柔和颜色
- `var(--color-border)` - 边框颜色
- `var(--tw-prose-body)` - 正文颜色
- `var(--tw-prose-headings)` - 标题颜色

### 响应式支持

所有样式都支持响应式设计：

```css
@media (max-width: 640px) {
  .prose {
    font-size: 0.9rem;
  }
  
  .prose h1 {
    @apply text-3xl;
  }
  
  .prose h2 {
    @apply text-2xl;
  }
}
```

## 构建结果

- ✅ **构建成功** - 无错误
- ✅ **页面生成** - 188 个页面（新增测试页面）
- ✅ **静态文件** - 5 个文件
- ✅ **构建时间** - 3085ms

## 总结

现在 Hugo Narrow 主题的 prose 样式支持完整的 Markdown 语法：

✅ **完整的标题系统** - h1-h6 全部支持  
✅ **丰富的文本格式** - 删除线、高亮、上下标、键盘按键  
✅ **任务列表支持** - 自定义复选框样式  
✅ **定义列表支持** - 术语和定义的清晰样式  
✅ **嵌套引用支持** - 多层引用视觉区分  
✅ **脚注支持** - 完整的脚注系统  
✅ **详情折叠支持** - 交互式折叠元素  
✅ **嵌套列表增强** - 多层级视觉区分  
✅ **主题适配** - 所有样式都使用主题变量  
✅ **响应式设计** - 移动端优化  

这些增强使得 Hugo Narrow 主题能够完美渲染各种复杂的 Markdown 内容，提供了优雅、一致、功能完整的阅读体验！
