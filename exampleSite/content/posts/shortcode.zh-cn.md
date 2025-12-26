---
title: "短代码示例"
date: 2025-12-26
draft: false
description: "Hugo Narrow 主题可用的短代码"
tags: ["shortcode"]
categories: ["shortcode"]
---

本页面展示了 Hugo Narrow 主题中所有可用的短代码。

## Hugo 内置短代码

Hugo 提供了一些[内置短代码](https://gohugo.io/shortcodes/)，这些内容不稳定并且随时可能变化，你可以访问页面找到详细使用说明。

内置短代码包括：

- Details
- Figure
- Gist
- Highlight
- Instagram
- Param
- QR
- Ref
- Relref
- Vimeo
- X
- YouTube

---

## 主题自定义短代码

### 图标

显示主题图标库中的 SVG 图标：

```markdown
{{</* icon name="heart" */>}}
{{</* icon name="github" size="lg" */>}}
{{</* icon name="sun" class="text-primary" */>}}
```

**示例：**

{{< icon name="heart" >}} {{< icon name="github" size="lg" >}} {{< icon name="sun" size="xl" class="text-primary" >}}

**参数：**

- `name`：图标名称（必需）- 查看 `assets/icons/` 了解可用图标 或者将自定义图放置在此目录下
- `size`：`xs`、`sm`、`md`、`lg`、`xl`、`2xl`（默认：`md`）
- `class`：自定义 CSS 类，可以用来更改颜色

### 按钮

创建带主题颜色的样式化按钮：

```markdown
{{</* button text="了解更多" url="/about" */>}}
{{</* button text="GitHub" url="https://github.com" icon="github" target="_self" */>}}
{{</* button text="下载" url="/download" variant="outline" size="lg" */>}}
```

**示例：**

{{< button text="主要按钮" url="#" />}}
{{< button text="次要按钮" url="#" variant="secondary" />}}
{{< button text="轮廓按钮" url="#" variant="outline" />}}

{{< button text="小号" url="#" size="sm" />}}
{{< button text="中号" url="#" size="md" />}}
{{< button text="大号" url="#" size="lg" />}}

{{< button text="带图标" url="#" icon="github" />}}
{{< button text="外部链接" url="<https://github.com>" icon="external-link" target="_self" />}}

**参数：**

- `text`：按钮文字（必需，或使用内部内容）
- `url`：链接地址（必需）
- `variant`：`primary`、`secondary`、`outline`（默认：`primary`）
- `size`：`sm`、`md`、`lg`（默认：`md`）
- `icon`：主题图标名称
- `target`：`_blank`、`_self`（默认：`_blank`）
- `rel`：链接关系（`_blank` 时自动添加 `noopener noreferrer`）

### 链接卡片

显示带网站图标的链接卡片：

```markdown
{{</* link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" */>}}
```

**示例:**
{{< link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" >}}

### Bilibili

嵌入 Bilibili 视频：

```markdown
{{</* bilibili BV号 */>}}
{{</* bilibili AV号 分P号 */>}}
```

### 腾讯视频

```markdown
{{</* tencent 视频ID */>}}
```

### Masonry 图库

创建瀑布流式图片画廊：

```markdown
{{</* masonry */>}}
![图片 1](/images/1.jpg)
![图片 2](/images/2.jpg)
![图片 3](/images/3.jpg)
{{</* /masonry */>}}
```
