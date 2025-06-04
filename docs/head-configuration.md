# Head 模板配置指南

## 概述

Hugo Narrow 主题的 head 模板已经简化优化，专注于核心的 SEO 功能，移除了复杂的配置。

## 配置选项

### 1. 站点基本信息

```yaml
params:
  site:
    description: "一个简洁优雅的 Hugo 主题，专注于内容展示和用户体验"
    keywords: ["Hugo", "博客", "主题", "技术", "编程"]
    author: "Hugo Narrow"
```

### 2. Logo 配置

```yaml
params:
  logo:
    image: "/images/logo.svg"  # Logo 图片路径
    link: "/"                  # 点击跳转链接，默认首页
```

**注意：** Logo 的 alt 属性自动使用站点标题，无需手动配置。

### 3. Favicon 配置 (现代 SVG 格式)

```yaml
params:
  favicon:
    svg: "/favicon.svg"        # SVG 格式 favicon (推荐)
```

**优势：**
- SVG 格式支持任意缩放
- 自动适配明暗模式
- 文件体积小
- 现代浏览器完全支持

### 4. SEO 配置

```yaml
params:
  seo:
    enableOpenGraph: true      # 启用 Open Graph
    enableTwitterCard: true    # 启用 Twitter Card
    enableJsonLd: true         # 启用 JSON-LD 结构化数据
    defaultImage: "/images/og-default.jpg"  # 默认分享图片
```

**可选的搜索引擎验证：**
```yaml
params:
  seo:
    googleSiteVerification: "your-verification-code"
    bingVerification: "your-bing-code"
    yandexVerification: "your-yandex-code"
```

## 功能特性

### SEO 优化

#### Open Graph 标签
- 自动生成 Open Graph meta 标签
- 支持文章封面图片
- 包含发布时间、作者、分类等信息

#### Twitter Card
- 自动生成 Twitter Card 标签
- 支持大图和摘要卡片
- 包含作者和网站信息

#### JSON-LD 结构化数据
- 符合 Schema.org 标准
- 包含文章和网站信息
- 提升搜索引擎理解

#### 搜索引擎验证
- Google Search Console 验证
- Bing Webmaster Tools 验证
- Yandex Webmaster 验证

### Web App Manifest (自动生成)

主题会自动生成 Web App Manifest 文件，支持：
- PWA 安装
- 自定义应用名称和描述
- 自动使用配置的 favicon
- 响应式图标支持

## Logo 和 Favicon

### 首字母 Logo 优化

现在首字母 logo 使用主题变量：

```html
<!-- 桌面端 -->
<a class="bg-primary text-primary-foreground hover:bg-primary/90">
  {{ substr site.Title 0 1 | upper }}
</a>
```

**主题适配：**
- `bg-primary` - 主题主色调背景
- `text-primary-foreground` - 主色调前景色
- `hover:bg-primary/90` - 悬停时的颜色变化

### SVG Favicon 文件

只需要准备一个 SVG 文件：

```
static/
└── favicon.svg              # SVG 格式 favicon
```

**SVG Favicon 示例：**
```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆形 -->
  <circle cx="16" cy="16" r="14" fill="currentColor" stroke="currentColor" stroke-width="2"/>
  <!-- 字母 H -->
  <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">H</text>
</svg>
```

**自动适配明暗模式：**
- 使用 `currentColor` 自动适配主题色
- 在明暗模式切换时自动调整颜色

## 页面标题优化

### 标题格式

- **首页**: `站点标题 - 站点描述`
- **文章页**: `文章标题 | 站点标题`
- **其他页**: `页面标题 | 站点标题`

### Meta 描述

优先级：
1. 页面 `description` 参数
2. 页面 `summary` 参数
3. 全局站点描述

## 使用建议

### 基础配置

1. **设置站点信息**
   ```yaml
   params:
     site:
       description: "你的网站描述"
       keywords: ["关键词1", "关键词2"]
       author: "你的名字"
   ```

2. **准备 SVG Favicon**
   - 创建 `static/favicon.svg` 文件
   - 使用 `currentColor` 实现主题适配
   - 建议使用简单的图形或字母

3. **配置 SEO**
   ```yaml
   params:
     seo:
       enableOpenGraph: true
       enableTwitterCard: true
       enableJsonLd: true
       defaultImage: "/images/og-default.jpg"
   ```

### 高级配置

1. **搜索引擎验证**
   - 在 Google Search Console 获取验证码
   - 在 Bing Webmaster Tools 获取验证码
   - 添加到配置文件

2. **自定义 Logo**
   ```yaml
   params:
     logo:
       image: "/images/your-logo.svg"
       link: "/"
   ```

3. **自定义 Favicon**
   ```yaml
   params:
     favicon:
       svg: "/your-custom-favicon.svg"
   ```

## 验证和测试

### SEO 测试工具

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 总结

Hugo Narrow 主题的 head 模板现在已经简化优化，专注于核心功能：

✅ **简化配置** - 移除复杂的无障碍和性能配置
✅ **现代 Favicon** - 仅使用 SVG 格式，支持主题适配
✅ **自动生成** - Web App Manifest 自动生成
✅ **SEO 优化** - 完整的 Open Graph、Twitter Card 和 JSON-LD 支持
✅ **Logo 优化** - 首字母 logo 使用主题变量，自动适配颜色

配置简单，功能强大，专注于内容展示！
