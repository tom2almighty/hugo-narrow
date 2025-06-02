---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/66c436e8d9c307b7e94b3e88.webp
date: 2024-03-21 17:13:54+08:00
description: Stack 主题修改记录。
slug: stack
summary: Stack 主题修改记录。
tags:
- Hugo
title: Hugo Stack主题修改
---
## 前言

上一篇文章介绍了如何部署 `Hugo` 博客，这里针对 `Stack` 主题的修改做一些记录。

## 准备

首先在博客根目录下的 `assets` 下创建一个名为 `scss` 的文件夹，然后在 `scss` 文件夹里创建一个名为 `custom.scss` 的文件，最终效果为`~blog/assets/scss/custom.scss`，创建好文件后，对于主题的大部分样式魔改都将写进这个 `custom.scss`，其中有很多冗余的代码。

## 整体细节调整

```scss
//  ~\blog\assets\scss\custom.scss
// 页面基本配色
:root {
  // 全局顶部边距
  --main-top-padding: 30px;
  // 全局卡片圆角
  --card-border-radius: 12px;
  // 标签云卡片圆角
  --tag-border-radius: 8px;
  // 卡片间距
  --section-separation: 40px;
  // 全局字体大小
  --article-font-size: 1.8rem;
  // 行内代码背景色
  --code-background-color: #f8f8f8;
  // 行内代码前景色
  --code-text-color: #e96900;
  // 主页背景
  --body-background: #F5F5F5;

  // 暗色模式下样式
  &[data-scheme="dark"] {
      // 行内代码背景色
      --code-background-color: #ff6d1b17;
      // 行内代码前景色
      --code-text-color: #e96900;
      // 暗黑模式下背景色
      --body-background: #303030;
      // 暗黑模式下卡片背景色
      --card-background: #424242;
      // 代码块背景色
  }
  // 亮色模式下样式
  &[data-scheme="light"] {
      .highlight,
      .chroma {
          background-color: #FFF9F3;
      }
  }
}

// 修复引用块内容窄页面显示问题
  a {
    word-break: break-all;
  }
  
  code {
    word-break: break-all;
  }
  
  // 文章内容图片圆角阴影
  .article-page .main-article .article-content {
    img {
      max-width: 96% !important;
      height: auto !important;
      border-radius: 8px;
    }
  }

// 文章内容引用块样式
  .article-content {
    blockquote {
      border-left: 6px solid #5E7092 !important;
    }
  }
// 设置选中字体的区域背景颜色
  ::selection {
    color: #fff;
    background: #34495e;
  }
  
  a {
    text-decoration: none;
    color: var(--accent-color);
  
    &:hover {
      color: var(--accent-color-darker);
    }
  
    &.link {
      color: #4288b9ad;
      font-weight: 600;
      padding: 0 2px;
      text-decoration: none;
      cursor: pointer;
  
      &:hover {
        text-decoration: underline;
      }
    }
  }

//全局页面小图片样式微调
  .article-list--compact article .article-image img {
    width: var(--image-size);
    height: var(--image-size);
    object-fit: cover;
    border-radius: 17%;
  }
```

## 代码块样式调整

```scss
// 代码块样式修改
  .highlight {
    max-width: 102% !important;
    background-color: var(--pre-background-color);
    padding: var(--card-padding);
    position: relative;
    border-radius: 13px;
    margin-left: -7px !important;
    margin-right: -12px;
    box-shadow: var(--shadow-l1) !important;
  
    &:hover {
      .copyCodeButton {
        opacity: 1;
      }
    }
  
    // keep Codeblocks LTR
    [dir="rtl"] & {
      direction: ltr;
    }
  
    pre {
      margin: initial;
      padding: 0;
      margin: 0;
      width: auto;
    }
  }
```

## 代码块引入 Mac 样式

```scss
//为代码块顶部添加macos样式
.article-content {
  .highlight:before {
    content: "";
    display: block;
    background: #fc625d;
    border-radius: 50%;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    height: 12px;
    width: 12px;
    margin-bottom: 5px;
  }
}
//--------------------------------------------------
```

## 首页添加欢迎样式

在博客的根目录下新建一个文件夹名为 `layouts` (默认生成站点时也生成了，没有的话手动创建),之后将 `~\blog\themes\hugo-theme-stack\layouts\index.html` 下的文件复制到刚刚创建的 `layouts` 文件夹里,这意味着主题 根目录下的 `layouts`文件夹里的 `index.html`将覆盖原主题目录下对应的文件，然后在复制出来的`index.html`修改为以下内容：

```scss
<!-- ~\site\blog\layouts\index.html -->
{{ define "main" }}
    {{ $pages := where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}
    {{ $notHidden := where .Site.RegularPages "Params.hidden" "!=" true }}
    {{ $filtered := ($pages | intersect $notHidden) }}
    {{ $pag := .Paginate ($filtered) }}
<!-- ---这是我们添加进去的--------- -->
<!-- 首页欢迎字幅板块 -->
<div class="welcome">
  <p style="font-size: 2rem; text-align: center; font-weight: bold">
    <span class="shake">👋</span>
    <span class="jump-text1" > Welcome</span>
    <span class="jump-text2"> To </span>
    <span class="jump-text3" style="color:#e99312">Tom</span>
    <span class="jump-text4" style="color:#e99312">'s</span>
    <span class="jump-text5" style="color:#e99312">Blog</span>
  </p>
</div>
<!-- ------首页欢迎字幅板块------ -->
<!-- 下面也是主题自带的,只展示一部分,其余省略 -->

    <section class="article-list">
        {{ range $index, $element := $pag.Pages }}
            {{ partial "article-list/default" . }}
        {{ end }}
    </section>

    {{- partial "pagination.html" . -}}
    {{- partial "footer/footer" . -}}
{{ end }}

{{ define "right-sidebar" }}
    {{ partial "sidebar/right.html" (dict "Context" . "Scope" "homepage") }}
{{ end }}

```

接下来在 `custom.scss` 中添加如下：
```scss
//首页欢迎板块样式
.welcome {
  color: var(--card-text-color-main);
  background: var(--card-background);
  box-shadow: var(--shadow-l2);
  border-radius: 30px;
  display: inline-block;
}

// 👋emoji实现摆动效果
.shake {
  display: inline-block;
  animation: shake 1s;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: shake;
  animation-timeline: auto;
  animation-range-start: normal;
  animation-range-end: normal;
  animation-delay: 2s;
  @keyframes shake {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(45deg) scale(1.2);
    }
    50% {
      transform: rotate(0) scale(1.2);
    }
    75% {
      transform: rotate(45deg) scale(1.2);
    }
    100% {
      transform: rotate(0);
    }
  }
}
// 实现字符跳动动画
.jump-text1 {
  display: inline-block;
  animation: jump 0.5s 1;
}

.jump-text2 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.1s;
}

.jump-text3 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.2s;
}

.jump-text4 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.3s;
}

.jump-text5 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.4s;
}


@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

```

## 归档页双栏

```scss
// 归档页面两栏
@media (min-width: 1024px) {
  .article-list--compact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: none;
    box-shadow: none;
    gap: 1rem;

    article {
      background: var(--card-background);
      border: none;
      box-shadow: var(--shadow-l2);
      margin-bottom: 8px;
      border-radius: 16px;
    }
  }
}
//归档页面卡片缩放
.article-list--tile article {
  transition: .6s ease;
}

.article-list--tile article:hover {
  transform: scale(1.03, 1.03);
}
```

## 链接页三栏

```scss
// 友情链接三栏
@media (min-width: 1024px) {
  .article-list--compact.links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background: none;
    box-shadow: none;
    gap: 1rem;

    article {
      background: var(--card-background);
      border: none;
      box-shadow: var(--shadow-l2);
      margin-bottom: 8px;
      border-radius: var(--card-border-radius);

      &:nth-child(odd) {
        margin-right: 8px;
      }
    }
  }
}
```



## 左侧栏

### 头像旋转

```scss
/*头像旋转动画*/
.sidebar header .site-avatar .site-logo {
    transition: transform 1.65s ease-in-out; //旋转时间
    &:hover {
      transform: rotate(360deg); //旋转角度为360度
    }
  }
```

## 右侧栏

### 标签栏

```scss
/*右侧标签放大动画*/
.tagCloud .tagCloud-tags a {
  border-radius: 10px; //圆角
  font-size: 1.4rem; //字体大小
  font-family: var(--article-font-family); //字体
  transition: transform 0.3s ease, background 0.3s ease; //动画时间
  &:hover {
    background: #b7d2ea7b; //背景颜色
    transform: translateY(-5px); //上移
  }
}
```

### 归档栏

```scss
/* 归档年份放大动画 */
.widget.archives .archives-year {
  &:first-of-type {
    border-top-left-radius: var(--card-border-radius);
    border-top-right-radius: var(--card-border-radius);
  }

  &:last-of-type {
    border-bottom-left-radius: var(--card-border-radius);
    border-bottom-right-radius: var(--card-border-radius);
  }

  &:hover {
    background-color: #b7d2ea7b;
  }

  &:not(:first-of-type):not(:last-of-type) {
    border-radius: 0; /* 确保中间的元素没有圆角 */
  }
}
```

### 搜索栏

```scss
// 修改首页搜索框样式
.search-form.widget input {
  font-size: 1.5rem;
  padding: 44px 25px 19px;
}

//搜索菜单动画
.search-form.widget {
  transition: transform 0.6s ease;
  &:hover {
    transform: scale(1.1, 1.1);
  }
}
```

## 修改字体为鸿蒙字体

字体的修改主题作者提供了模板，链接 [点击这里](https://stack.jimmycai.com/config/header-footer#example-custom-font-family-for-article-content)。

首先将鸿蒙字体保存到 `Github` 或其他 `CDN` 存储中，字体链接可以在 [这里](https://github.com/Irithys/cdn/tree/master/src/fonts?ref=irithys.com) 找到。然后修改 `~\blog\layouts\partials\head\custom.html` 文件，添加以下内容：

```html
<style>
    :root {
    /* 在style中,apple系统优先调用系统字体，其余优先调用 HarmonyOS_Sans_SC_Medium */
    --sys-font-family: -apple-system, "HarmonyOS_Sans_SC_Medium", Georgia, 'Nimbus Roman No9 L', 'PingFang SC', 'Hiragino Sans GB', 'Noto Serif SC', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'ST Heiti', sans-serif;
    --code-font-family: "JetBrainsMono Regular", Menlo, Monaco, Consolas, "Courier New";
    --article-font-family: -apple-system, "HarmonyOS_Sans_SC_Medium", var(--base-font-family);
  }
</style>
<script>  // 正文自重300，标题字重700
		(function () {
		    const customFont = document.createElement('link');
		    customFont.href = "https://cdn.jsdmirror.com/gh/tom2almighty/files@master/fonts/font.css";  // css文件地址
		
		    customFont.type = "text/css";
		    customFont.rel = "stylesheet";
		
		    document.head.appendChild(customFont);
		}());
</script>

```

> 记得在 `font.css` 文件中修改字体文件地址。

## 页面布局调整

```scss
// 页面布局调整 
.container {
    &.extended{
      @include respond(md) {
        max-width: 1024px;
        --left-sidebar-max-width: 20%;
        --right-sidebar-max-width: 25%;
    }

    @include respond(lg) {
        max-width: 1280px;
        --left-sidebar-max-width: 20%;
        --right-sidebar-max-width: 25%;
    }

    @include respond(xl) {
        max-width: 1536px;
        --left-sidebar-max-width: 20%;
        --right-sidebar-max-width: 20%;
    }
    }
}
```

## 菜单栏样式

```scss
// 菜单栏样式
// 下拉菜单改圆角样式
.menu {
  padding-left: 0;
  list-style: none;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  flex-grow: 1;
  font-size: 1.6rem;
  background-color: var(--card-background);

  box-shadow: var(--shadow-l2); //改个阴影
  display: none;
  margin: 0; //改为0
  border-radius: 10px; //加个圆角
  padding: 30px 30px;

  @include respond(xl) {
    padding: 15px 0;
  }

  &,
  .menu-bottom-section {
    gap: 30px;

    @include respond(xl) {
      gap: 25px;
    }
  }

  &.show {
    display: flex;
  }

  @include respond(md) {
    align-items: flex-end;
    display: flex;
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    margin: 0;
  }

  li {
    position: relative;
    vertical-align: middle;
    padding: 0;

    @include respond(md) {
      width: 100%;
    }

    svg {
      stroke-width: 1.33;

      width: 20px;
      height: 20px;
    }

    a {
      height: 100%;
      display: inline-flex;
      align-items: center;
      color: var(--body-text-color);
      gap: var(--menu-icon-separation);
    }

    span {
      flex: 1;
    }

    &.current {
      a {
        color: var(--accent-color);
        font-weight: bold;
      }
    }
  }
}
```

## 滚动条美化

首先将 `~/themes/hugo-theme-stack/assets/scss/partials/base.scss` 文件复制到根目录同名文件夹下，然后将其中 `Firefox` 的滚动条代码注释或删除掉：

```scss
/* scrollbar styles for Firefox */
* {
    scrollbar-width: auto;
    scrollbar-color: var(--scrollbar-thumb) transparent;
}
/**/
```

在 `custom.scss` 中添加代码：

```scss
/*滚动条样式*/
//菜单滚动条美化
.menu::-webkit-scrollbar {
  display: none;
}

// 全局滚动条美化
html {
  ::-webkit-scrollbar {
    width: 20px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #6a797c;
  }
}
```

## 豆瓣卡片

在 `~/layouts/shortcodes/` 文件夹下创建新文件 `douban.html`，写入代码：

```html
{{ $dbUrl := .Get 0 }}
{{ $dbApiUrl := "https://neodb.social/api/catalog/fetch?url=" }}
{{ $dbFetch := getJSON $dbApiUrl $dbUrl }}

{{ if $dbFetch }}
    {{ $itemRating := 0 }}{{ with $dbFetch.rating }}{{ $itemRating = . }}{{ end }}
    <div class="db-card">
        <div class="db-card-subject">
            <div class="db-card-post"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="{{ $dbFetch.cover_image_url }}"></div>
            <div class="db-card-content">
                <div class="db-card-title"><a href="{{ $dbUrl }}" class="cute" target="_blank" rel="noreferrer">{{ $dbFetch.title }}</a></div>
                <div class="rating"><span class="allstardark"><span class="allstarlight" style="width:{{ mul 10 $itemRating }}%"></span></span><span class="rating_nums">{{ $itemRating }}</span></div>
                <div class="db-card-abstract">{{ $dbFetch.brief }}</div>
            </div>
            <div class="db-card-cate">{{ $dbFetch.category }}</div>
        </div>
    </div>
{{else}}
    <p style="text-align: center;"><small>远程获取内容失败，请检查 API 有效性。</small></p>
{{end}}
```

然后在 `custom.scss` 写入样式代码：
```scss
/* db-card -------- start */
.db-card {
  margin: 2rem 3rem;
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.25);
}

.db-card-subject {
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
  padding: 12px;
  position: relative;
}

.db-card-content {
  flex: 1 1 auto;
}

.db-card-post {
  width: 96px;
  margin-right: 15px;
  display: flex;
  flex: 0 0 auto;
}

.db-card-title {
  margin-bottom: 5px;
  font-size: 18px;
}

.db-card-title a {
  text-decoration: none !important;
}

.db-card-abstract,
.db-card-comment {
  font-size: 14px;
  overflow: auto;
  max-height: 7rem;
}

.db-card-cate {
  position: absolute;
  top: 0;
  right: 0;
  background: #f99b01;
  padding: 1px 8px;
  font-size: small;
  font-style: italic;
  border-radius: 0 8px 0 8px;
  text-transform: capitalize;
}

.db-card-post img {
  width: 96px !important;
  height: 96px !important;
  border-radius: 4px;
  -o-object-fit: cover;
  object-fit: cover;
}

.rating {
  margin: 0 0 5px;
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
}

.rating .allstardark {
  position: relative;
  color: #f99b01;
  height: 16px;
  width: 80px;
  background-size: auto 100%;
  margin-right: 8px;
  background-repeat: repeat;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6TTY2NC44IDU2MS42bDM2LjEgMjEwLjNMNTEyIDY3Mi43IDMyMy4xIDc3MmwzNi4xLTIxMC4zLTE1Mi44LTE0OUw0MTcuNiAzODIgNTEyIDE5MC43IDYwNi40IDM4MmwyMTEuMiAzMC43LTE1Mi44IDE0OC45eiIgZmlsbD0iI2Y5OWIwMSIvPjwvc3ZnPg==);
}

.rating .allstarlight {
  position: absolute;
  left: 0;
  color: #f99b01;
  height: 16px;
  overflow: hidden;
  background-size: auto 100%;
  background-repeat: repeat;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6IiBmaWxsPSIjZjk5YjAxIi8+PC9zdmc+);
}

[data-scheme="dark"] { 
  .db-card {
    background: #212121;
  }
  .db-card-abstract,
  .db-card-comment {
    color: #e6e6e6;
  }
 .db-card-cate {
    color: #e6e6e6;
  }
  .rating_nums{
    color: #e6e6e6
  }
}
@media (max-width: 550px) {
  .db-card {
    margin: 0.8rem 1rem;
  }

  .db-card-comment {
    display: none;
  }
}
/* db-card -------- end */
```

接下来就可以在文章中添加短代码，语法如下(将大括号中间的 `\` 去掉)：

```bash
{\{< douban "https://book.douban.com/subject/35496106/">}\}
{\{< douban "https://movie.douban.com/subject/35267208/">}\}
```

## Footer 添加 Shields.io Badges

1. 首先新建 `~\layouts\partials\footer\badge.html` 文件，名字可以随意，后续引用更改即可。

2. 将主题文件夹下的 `~\themes\hugo-theme-stack\layouts\partials\footer\footer.html` 复制到根目录同名文件夹下，在 `</footer>` 上一行添加：

```html
{{ partial "footer/badge.html" . }}
```

> 直接在 `/footer/custom.html` 会出现徽章重复的问题，原因未知。

3. 在 `badge.html` 中添加自己的徽标即可，下面是参考，可以在 [Shields.io](https://shields.io) 创建自己的样式。

```html
<!-- custom.html -->
<div class="custom-badges">
    <a href="https://gohugo.io/" target="_blank">
        <img src="https://img.shields.io/badge/Frame-Hugo-deeppink?style=flat&logo=hugo" title="博客框架为 Hugo">
    </a>
    <a href="https://blogcdn.net/" target="_blank">
        <img src="https://img.shields.io/badge/CDN-blogcdn-orange?style=flat&logo=c" title="本站使用 blogcdn 为静态资源提供 CDN加速">
    </a>
    <a href="https://vercel.com/" target="_blank">
        <img src="https://img.shields.io/badge/Host-Vercel-gray?style=flat&logo=vercel" title="本站托管于 Vercel">

    </a>
    <a href="https://github.com" target="_blank">
        <img src="https://img.shields.io/badge/Source-Github-d021d6?style=flat&logo=GitHub" title="本站源码托管于 GitHub">

    </a>
    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
        <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-red?style=flat&logo=creative-commons" title="本站内容采用 CC BY-NC-SA 4.0 国际许可协议">
    </a>
</div>
```

## 参考

- [L1nSn0w's Blog](https://blog.linsnow.cn/p/modify-hugo/)
- [Lovir's Blog](https://lovir.cn/p/changes-in-my-blog/)
- [山茶花舍](https://irithys.com/hugo-mod-3/)
- [Hugo 豆瓣短代码](https://immmmm.com/hugo-shortcodes-douban/)
- [豆瓣书影音同步 GitHub Action](https://imnerd.org/doumark.html)