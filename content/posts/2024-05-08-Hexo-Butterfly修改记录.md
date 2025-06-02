---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/66c434c3d9c307b7e9486462.webp
date: 2024-05-08 08:46:52
description: Hexo Butterfly 修改记录。
slug: e1485cce
summary: Hexo Butterfly 修改记录。
tags:
- Hexo
title: Hexo-Butterfly修改记录
---
## 准备
1. 在 `[BlogRoot]\source` 文件夹下新建一个文件夹 `css`，该文件夹用于存放自定义的 `css` 样式，再新建一个名为 `custom.css`，修改代码存于此处。

2. 在主题配置文件 `[BlogRoot]\_config.butterfly.yml` 文件中的 `inject` 配置项的 `head` 子项加入以下代码，引入刚刚创建的 `custom.css` 文件（这是相对路径的写法）

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css" media="defer" onload="this.media='all'">
```

## 背景一图流

```css
/* 页脚与头图透明 */
#footer {
  background: transparent !important;
}
#page-header {
  background: transparent !important;
}

/* 白天模式遮罩透明 */
#footer::before {
  background: transparent !important;
}
#page-header::before {
  background: transparent !important;
}

/* 夜间模式遮罩透明 */
[data-theme="dark"] #footer::before {
  background: transparent !important;
}
[data-theme="dark"] #page-header::before {
  background: transparent !important;
}
```

编辑主题设置 `index_img`、`background`、`footer_bg` 选项。

```yaml
index_img: 
background: url(https://example.com/img/background.jpg)
footer_bg: false
```

## 文章目录模糊效果

```css

/* 文章目录 */
#aside-content #card-toc .toc-content .toc-link.active {
  line-height: 1.2;
  border-radius: 12px;
  border-left-color: var(--heo-hovertext);
  background-color: var(--heo-card-bg);
  color: var(--heo-lighttext);
  font-weight: bold;
  font-size: 20px;
}

[data-theme=dark].toc .toc-item.active .toc-link .toc-text {
  color: var(--heo-white);
}

#aside-content #card-toc .toc-content .toc-item.active .toc-link {
  opacity: 1;
  border-radius: 8px;
}

#aside-content #card-toc .toc-content .toc-link {
  line-height: 1.2;
  padding: 8px;
  border-left: 0px solid transparent;
  border-radius: 12px;
  color: var(--heo-secondtext);
  cursor: default;
}

#aside-content #card-toc .toc-content .toc-link:not(.active) span {
  opacity: 0.6;
  cursor: pointer;
  filter: blur(1px);
  transition: 0.3s;
}

#aside-content #card-toc:hover .toc-content .toc-link:not(.active) span {
  filter: blur(0px);
  opacity: 1;
}

#aside-content #card-toc .toc-content .toc-link:not(.active) span:hover {
  color: var(--heo-lighttext);
}
```

## 页面透明度

```css
:root {
  --trans-light: rgba(255, 255, 255, 0.88);
  --trans-dark: rgba(25, 25, 25, 0.88);
  --border-style: 1px solid rgb(169, 169, 169);
  --backdrop-filter: blur(5px) saturate(150%);
}

/* 首页文章卡片 */
#recent-posts > .recent-post-item {
  background: var(--trans-light);
  backdrop-filter: var(--backdrop-filter);
  border-radius: 25px;
  border: var(--border-style);
}

/* 首页侧栏卡片 */
#aside-content .card-widget {
  background: var(--trans-light);
  backdrop-filter: var(--backdrop-filter);
  border-radius: 18px;
  border: var(--border-style);
}

/* 文章页、归档页、普通页面 */
div#post,
div#page,
div#archive {
  background: var(--trans-light);
  backdrop-filter: var(--backdrop-filter);
  border: var(--border-style);
  border-radius: 20px;
}

/* 导航栏 */
#page-header.nav-fixed #nav {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: var(--backdrop-filter);
}

[data-theme="dark"] #page-header.nav-fixed #nav {
  background: rgba(0, 0, 0, 0.7) !important;
}

/* 夜间模式遮罩 */
[data-theme="dark"] #recent-posts > .recent-post-item,
[data-theme="dark"] #aside-content .card-widget,
[data-theme="dark"] div#post,
[data-theme="dark"] div#archive,
[data-theme="dark"] div#page {
  background: var(--trans-dark);
}


/* 夜间模式页脚页头遮罩透明 */
[data-theme="dark"] #footer::before {
  background: transparent !important;
}
[data-theme="dark"] #page-header::before {
  background: transparent !important;
}

/* 阅读模式 */
.read-mode #aside-content .card-widget {
  background: rgba(158, 204, 171, 0.5) !important;
}
.read-mode div#post {
  background: rgba(158, 204, 171, 0.5) !important;
}

/* 夜间模式下的阅读模式 */
[data-theme="dark"] .read-mode #aside-content .card-widget {
  background: rgba(25, 25, 25, 0.9) !important;
  color: #ffffff;
}
[data-theme="dark"] .read-mode div#post {
  background: rgba(25, 25, 25, 0.9) !important;
  color: #ffffff;
}
```

- `--trans-light`：白天模式带透明度的背景色，如 `rgba(255, 255, 255, 0.88)` 底色是纯白色，其中 `0.88` 就透明度，在 `0-1` 之间调节，值越大越不透明；
- `--trans-dark`: 夜间模式带透明度的背景色，如 `rgba(25, 25, 25, 0.88)` 底色是柔和黑色，其中 `0.88` 就透明度，在 `0-1` 之间调节，值越大越不透明；
- `--border-style`: 边框样式，`1px solid rgb(169, 169, 169)` 指宽度为 `1px` 的灰色实体边框；
- `--backdrop-filter`: 背景过滤器，如 `blur(5px) saturate(150%)` 表示饱和度为 `150%` 的、高斯模糊半径为 `5px` 的过滤器，这是亚克力效果的一种实现方法。

## 参考

- [hexo 背景一图流](https://jiangyuhui.top/2023/08/03/hexo%E8%83%8C%E6%99%AF%E4%B8%80%E5%9B%BE%E6%B5%81/)
- [hexo 主题 butterfly4.5.1css 美化教程二](https://blog.4t.pw/posts/eb769414.html)
