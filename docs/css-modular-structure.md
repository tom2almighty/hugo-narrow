# CSS 模块化文件结构指南

## 概述

Hugo Narrow 主题的 CSS 文件已经重新组织为模块化结构，遵循 Tailwind CSS 4.0 最佳实践，保留了所有现有功能和样式，同时提供了更好的可维护性和自定义能力。

## 文件结构

```
assets/css/
├── main.css          # 主入口文件（仅包含导入语句）
├── themes.css        # 主题变量配置（8个完整主题）
├── prose.css         # Prose Typography 样式
├── toc.css          # 目录样式
├── components.css    # 组件样式
└── custom.css       # 自定义样式入口
```

## 文件详解

### 1. main.css - 主入口文件

```css
/* Hugo Narrow 主题 - 主样式文件 */

/* Tailwind CSS 4.0 基础导入 */
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@source "hugo_stats.json";
@custom-variant dark (&:where(.dark, .dark *));

/* 主题变量配置 */
@import "./themes.css";

/* Prose 文章样式 */
@import "./prose.css";

/* 目录样式 */
@import "./toc.css";

/* 组件样式 */
@import "./components.css";

/* 自定义样式入口 */
@import "./custom.css";
```

**特点：**
- ✅ 仅 20 行代码，极其简洁
- ✅ 使用 Tailwind CSS 4.0 的 @import 语法
- ✅ 清晰的模块导入顺序
- ✅ 支持 Hugo 的类检测和暗色模式

### 2. themes.css - 主题变量配置

**包含所有 8 个主题：**
- **shadcn** (默认主题)
- **claude** (Claude AI 风格)
- **emerald** (翠绿主题)
- **rose** (玫瑰主题)
- **forest** (森林主题)
- **vercel** (Vercel 风格)
- **spotify** (Spotify 风格)
- **airbnb** (Airbnb 风格)

**每个主题包含：**
- 完整的颜色变量定义
- 明暗模式适配
- Alert 颜色配置
- Tailwind 变量映射

**示例结构：**
```css
/* 基础主题变量 */
:root {
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  /* ... 更多变量 */
}

/* 暗色模式变量 */
.dark {
  --color-primary: oklch(0.922 0 0);
  /* ... 暗色模式变量 */
}

/* Claude 主题 */
[data-theme="claude"] {
  --color-primary: oklch(0.62 0.14 39.04);
  /* ... Claude 主题变量 */
}

/* Tailwind 变量映射 */
@theme inline {
  --color-primary: var(--color-primary);
  /* ... 映射所有变量 */
}
```

### 3. prose.css - Prose Typography 样式

**完整保留的 Typography 功能：**
- **标题样式** (h1-h6) - 带装饰效果
- **段落文本** - 优化的行高和间距
- **引用块** - 带引号装饰的美观样式
- **链接样式** - 悬停动画和下划线效果
- **列表样式** - 自定义的圆点和数字样式
- **代码样式** - 与 Chroma 语法高亮集成
- **表格样式** - 现代化的表格设计
- **图片样式** - 圆角和阴影效果
- **响应式调整** - 移动端优化

**特点：**
- ✅ 使用 @layer utilities 包装
- ✅ 使用主题变量，自动适配所有主题
- ✅ 与 render hook 和 Chroma 完美集成
- ✅ 支持代码块折叠功能

### 4. toc.css - 目录样式

**包含功能：**
- **目录卡片样式** - 毛玻璃效果
- **Hugo 生成的目录样式** - 清晰的层级结构
- **Gumshoe 活动状态** - 当前阅读位置高亮
- **嵌套目录缩进** - 最多 6 级缩进
- **滚动条样式** - 自定义滚动条外观

**特点：**
- ✅ 使用 @layer components 包装
- ✅ 完整的交互效果
- ✅ 响应式设计

### 5. components.css - 组件样式

**包含组件：**
- **移动端菜单动画** - slideDown 动画
- **搜索结果样式** - 选中状态高亮
- **滚动条隐藏工具类** - 跨浏览器兼容
- **文本截断样式** - line-clamp-2/3
- **移动端 Dock** - 文字隐藏功能

**特点：**
- ✅ 使用 @layer components 包装
- ✅ 保留所有关键帧动画
- ✅ 移动端优化

### 6. custom.css - 自定义样式入口

**功能：**
- **自定义样式入口** - 添加你的个性化样式
- **覆盖默认样式** - 最后加载，优先级最高
- **详细示例** - 提供常见自定义场景的示例
- **最佳实践指导** - 注释中包含使用建议

**示例内容：**
```css
/* 示例：自定义组件样式 */
@layer components {
  .custom-button {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
    background: linear-gradient(45deg, var(--color-primary), var(--color-accent));
    color: var(--color-primary-foreground);
  }
}

/* 示例：自定义工具类 */
@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

## 使用指南

### 1. 添加自定义主题

在 `themes.css` 中添加新主题：

```css
/* 我的自定义主题 */
[data-theme="my-theme"] {
  --color-primary: oklch(0.61 0.15 280);
  --color-primary-foreground: oklch(1.00 0 0);
  /* ... 其他颜色变量 */
}

[data-theme="my-theme"].dark {
  --color-primary: oklch(0.67 0.15 280);
  /* ... 暗色模式变量 */
}
```

### 2. 自定义 Typography 样式

在 `custom.css` 中覆盖 prose 样式：

```css
/* 覆盖文章标题样式 */
.prose h1 {
  color: var(--color-primary);
  border-bottom: 3px solid var(--color-primary);
}

/* 覆盖引用块样式 */
.prose blockquote {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--color-primary) 10%, transparent),
    color-mix(in srgb, var(--color-accent) 10%, transparent)
  );
}
```

### 3. 添加自定义组件

在 `custom.css` 中添加新组件：

```css
@layer components {
  .my-card {
    @apply p-6 rounded-xl border;
    background: var(--color-card);
    border-color: var(--color-border);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .my-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--color-foreground) 12%, transparent);
  }
}
```

### 4. 添加自定义工具类

在 `custom.css` 中添加工具类：

```css
@layer utilities {
  .glass-effect {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: color-mix(in srgb, var(--color-background) 80%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  }

  .gradient-border {
    border: 1px solid transparent;
    background: linear-gradient(var(--color-background), var(--color-background)) padding-box,
                linear-gradient(135deg, var(--color-primary), var(--color-accent)) border-box;
  }
}
```

## 最佳实践

### 1. 使用 CSS 变量

```css
/* 推荐 - 使用主题变量 */
.my-component {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: 1px solid var(--color-border);
}

/* 不推荐 - 硬编码颜色 */
.my-component {
  background: #3b82f6;
  color: white;
  border: 1px solid #e5e7eb;
}
```

### 2. 使用 @layer 指令

```css
/* 组件样式 */
@layer components {
  .my-component {
    /* 组件样式 */
  }
}

/* 工具类 */
@layer utilities {
  .my-utility {
    /* 工具类样式 */
  }
}
```

### 3. 使用 color-mix 函数

```css
/* 推荐 - 动态透明度 */
.my-overlay {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

/* 不推荐 - 硬编码透明度 */
.my-overlay {
  background: rgba(59, 130, 246, 0.1);
}
```

## 优势总结

### 开发体验
- ✅ **模块化结构** - 每个文件职责单一，易于维护
- ✅ **保留所有功能** - Typography、主题、组件样式完整保留
- ✅ **自定义简单** - 在 custom.css 中添加样式即可
- ✅ **主题一致性** - 使用 CSS 变量保持统一

### 性能优化
- ✅ **按需加载** - 可以选择性导入模块
- ✅ **缓存友好** - 模块化文件便于浏览器缓存
- ✅ **构建优化** - Tailwind CSS 会自动优化未使用的样式

### 扩展性
- ✅ **新增模块** - 轻松添加新的 CSS 模块
- ✅ **主题扩展** - 在 themes.css 中添加新主题
- ✅ **组件复用** - components.css 提供丰富的组件库

### 兼容性
- ✅ **Tailwind CSS 4.0** - 遵循最新最佳实践
- ✅ **Hugo 集成** - 完美支持 Hugo 的类检测
- ✅ **现有功能** - 所有现有样式和功能完整保留

## 构建结果

- ✅ **构建成功** - 无错误
- ✅ **页面生成** - 181 个页面
- ✅ **静态文件** - 5 个文件
- ✅ **构建时间** - 2611ms

现在 Hugo Narrow 主题拥有了清晰的模块化 CSS 结构，既保持了所有现有功能，又提供了极大的自定义灵活性！
