---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/66cfc921d9c307b7e955ff0d.jpg
date: 2024-08-12 12:07:12+08:00
description: Hugo Diary 主题修改记录。
slug: hugo-diary-modify
summary: Hugo Diary 主题修改记录。
tags:
- Hugo
title: Hugo Diary主题修改记录
---
本文记录 Hugo Diary 主题的修改，包括细节调整、代码块优化、字体、首页文章列表布局等调整。
<!--more-->

>[!NOTE]
>更换了主题，所以 Diary 主题的博客部署到了 GitHub Pages，不再更新，访问 [Hugo Diary主题博客](https://tom2almighty.github.io/hugo-blog-diary/)

## 前言

 `Hugo Diary` 主题简约美观，但是一些细节不符合自己的要求，因此稍作调整并加以记录，修改的内容包括如下：
 - 正文行距调整
 - 表格显示优化
 - 目录优化
 - 滚动条美化
 - 代码块添加 `Mac` 红绿灯色块
 - 代码块添加复制按钮
 - 代码块添加语言显示
 - 字体修改
 - 首页文章列表布局调整

最终效果如下：

![desktop](https://pic.imgdb.cn/item/66cdd2a2d9c307b7e9368bbe.webp)

![mobile](https://pic.imgdb.cn/item/66cdd2a3d9c307b7e9368c84.webp)
## 准备工作

主题没有 `custom.scss` 文件，自定义方式可以将 `~/themes/diary/assets/scss/journal.scss` 文件复制到站点根目录下 `~/assets/scss` 中，在其中直接更改，也可以复制后，在末尾添加 `custom.scss` 引用，然后在自定义文件中修改，这里采用第二种方式，文中 `~` 均代表博客根目录。

1. 复制 `journal.scss` 文件到站点根目录下。
2. 创建两个文件 `custom.scss` 用来放置自定义样式。
3. 在复制的 `~/assets/scss/journal.scss` 末尾添加代码引用自定义样式：
```scss
@import "custom"
```

## 细节调整
整体细节调整如下：
- 正文的行间距稍微扩大
- 优化表格显示
- 不同目录层级使用不同的列表标记
- 目录背景色、阴影修改
- 主页背景色修改
在 `custom.scss` 添加下面的代码：

```scss
// 主页背景色修改
body, .stream-container .post-list-container {
  background: #FCFAF3;
}
// 调整正文部分的行间距
p, li, body {
  line-height: 1.8;  // 根据需求调整此值
}
// 表格优化
table{
  display: table;
  width: 100%;
  empty-cells: show;
}
table th{
  border: 1px solid #eee;
  padding: 6px 12px;
  background-color: lighten($color-accent, 35%);
  body.night & {
    background-color: lighten($color-accent, 10%);
  }
  width: 400px;
}
table td{
  border: 1px solid #eee;
  padding: 6px 12px;
  width: 400px;
}
// 目录样式修改
.toc{
  background: #FFFFFF;
  box-shadow:  0 2px 10px rgba(0, 0, 0, 0.1);
}
// 目录标题
.toc-title {
  font-size: large;
    text-align: left;
    font-weight: bold;
    color: #4d1e01;
    border-bottom: 1px solid $color-accent;
}
// 不同目录层级使用不同的列表标记
.toc ul ul {
  list-style-type: decimal;
}

.toc ul ul ul {
  list-style-type: none;
  padding-left: 10px;
  margin-left: 5px;
  border-left: 1px solid darkgrey;
}

.toc ul ul ul ul {
  list-style-type: none;
}
// 不同目录层级使用不同的列表标记
.toc ul ul {
  list-style-type: decimal;
}
.toc ul ul ul {
  list-style-type: disc;
}
.toc ul ul ul ul {
  list-style-type: circle;
}
```

## 滚动条美化

将滚动条滑块颜色改成主题强调色，并更改透明度，在 `custom.scss` 添加下面的代码：

```scss
// 全局自定义滚动条样式
* {
  &::-webkit-scrollbar {
    width: 8px; // 滚动条宽度
    height: 8px; // 滚动条高度
  }

  &::-webkit-scrollbar-track {
    background: transparent; // 滚动条轨道背景色
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($color-accent, 0.1); // 滚动条滑块颜色
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba($color-accent, 0.5); // 滚动条滑块悬停颜色
  }
}
```

> [!TIP]
> 上述代码 `background` 的值是主题内置变量强调色的值，如果要应用于其他主题，可以将对应的值修改一下。


## 标签微调
分类页和标签页标签微调，缩小圆角大小，更改背景色，并去除边线。
在 `custom.scss` 中添加下面的代码：

```scss
// 标签样式更改
.rounded-pill{
  background: lighten($color-accent, 35%);
  border-radius: 10px !important;
  border: none;
  color: #000;
  &:hover{
    background: lighten($color-accent, 20%);
  }
  body.night & {
    background: #555;
    color: black;
    &:hover{
      background: lighten($color-accent, 20%);
    }
  }
}
```

## 代码块优化
代码块做了如下优化：
- 右上角添加复制代码块按钮
- 中间添加代码块语言显示
- 左上角添加 `MAC` 红绿灯样式
- 添加代码块折叠功能，代码块默认高度 `300px` ，超出显示按钮控制折叠展开

首先在 `~/layouts/partials/extended_head.html` 中引入一个 `js` 文件：
```html
<script src="{{ "/js/codeblock-enhancements.js" | relURL }}" defer></script>
```

然后新建 `~/static/js/codeblock-enhancements.js` 文件，写入代码：
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('.highlight');

  codeBlocks.forEach(function(highlight) {
    // 创建横条
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    highlight.insertBefore(toolbar, highlight.firstChild);

    // 添加 Mac 风格圆点
    const macDots = document.createElement('div');
    macDots.className = 'mac-dots';
    toolbar.appendChild(macDots);

    // 检测语言
    let language = '';
    const possibleElements = [
      highlight,
      highlight.querySelector('code'),
      highlight.querySelector('pre > code'),
      highlight.querySelector('pre'),
      highlight.querySelector('td:nth-child(2) code')
    ];

    for (const element of possibleElements) {
      if (element && element.className) {
        const elementLanguageClass = element.className.split(' ').find(cls => cls.startsWith('language-'));
        if (elementLanguageClass) {
          language = elementLanguageClass.replace('language-', '');
          break;
        }
      }
    }

    // 添加语言显示
    if (language) {
      const languageDisplay = document.createElement('span');
      languageDisplay.className = 'language-display';
      languageDisplay.textContent = language;
      toolbar.appendChild(languageDisplay);
    }

    // 添加复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '📋';
    copyButton.title = '复制代码';
    toolbar.appendChild(copyButton);

    copyButton.addEventListener('click', function() {
      let codeText;
      const table = highlight.querySelector('table');
      if (table) {
        // 有行号的情况
        codeText = Array.from(table.querySelectorAll('td:last-child'))
          .map(td => td.textContent.replace(/\n$/, ''))  // 移除每行末尾的换行符
          .join('\n');
      } else {
        // 没有行号的情况
        const pre = highlight.querySelector('pre');
        codeText = pre.textContent;
      }

      // 移除开头和结尾的空白字符，并确保只有一个换行符
      codeText = codeText.trim().replace(/\n+/g, '\n');

      navigator.clipboard.writeText(codeText).then(function() {
        copyButton.innerHTML = '✅';
        setTimeout(function() {
          copyButton.innerHTML = '📋';
        }, 2000);
      }, function() {
        copyButton.innerHTML = '❌';
      });
    });

    // 添加折叠功能
    if (highlight.offsetHeight > 300) {
      highlight.classList.add('collapsible');
      const expandButton = document.createElement('button');
      expandButton.className = 'expand-button';
      expandButton.innerHTML = '▼';
      highlight.appendChild(expandButton);

      expandButton.addEventListener('click', function() {
        highlight.classList.toggle('expanded');
        expandButton.innerHTML = highlight.classList.contains('expanded') ? '▲' : '▼';
      });
    }

    // 调整横条宽度
    function adjustToolbarWidth() {
      toolbar.style.width = `${highlight.offsetWidth}px`;
    }

    // 初始调整和窗口大小变化时调整
    adjustToolbarWidth();
    window.addEventListener('resize', adjustToolbarWidth);
  });
});
```


然后在 `custom.scss` 中添加样式代码：

```scss
// 代码块样式
.highlight {
  position: relative;
  margin-bottom: 1em;
  background-color: #2d2d2d;
  border-radius: 6px;
  overflow: hidden;
}

.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e1e1e;
  padding: 8px 16px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.mac-dots {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fc625d;
  box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
}

.language-display {
  font-size: 0.9em;
  color: #a0a0a0;
}

.copy-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: #a0a0a0;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #ffffff;
  }
}

.highlight pre {
  margin: 0;
  padding: 1em;
  overflow-x: auto;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  // background: rgba(46,46,46, 1) !important;
  // color: rgba(255,255,255, 1);
}

.collapsible pre {
  max-height: 300px;
  overflow-y: hidden;
}

.collapsible::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(45,45,45,0), rgba(45,45,45,1));
  pointer-events: none;
}

.collapsible.expanded pre {
  max-height: none;
}

.collapsible.expanded::after {
  display: none;
}

.expand-button {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  background-color: transparent;
  border: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  color: #a0a0a0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
}

// 调整 Hugo 行号样式
.highlight table {
  width: 100%;
  border-spacing: 0;
}

.highlight td {
  padding: 0;
}

.highlight .lntd:first-child {
  width: 10px;
  user-select: none;
}

.highlight .lnt {
  margin-right: 0.4em;
  padding: 0 0.4em 0 0.4em;
  color: #7f7f7f;
}

.highlight .ln {
  margin-right: 0.4em;
  padding: 0 0.4em 0 0.4em;
}

// 确保行号和代码在同一行
.highlight .lntable {
  display: table;
  width: 100%;
  margin: 0;
  padding: 0;
}

.highlight .lntd {
  display: table-cell;
  vertical-align: top;
}
```

> [!TIP]
> `js` 代码中第 ` 78 ` 行可以设置代码块的最大高度


## 更改字体

这里给出两个中文字体样式，一个是霞鹜文楷，一个是鸿蒙字体，英文字体使用 `Nunito`。英文字体的修改可以找一个不带中文的，然后第一个字体设置为英文字体，第二个设置为中文，字体的地址如下：

- [霞鹜文楷 GitHub 仓库](https://github.com/lxgw/LxgwWenKai)
- [霞骛文楷浏览器使用的 WebFont](https://github.com/chawyehsu/lxgw-wenkai-webfont)
- [鸿蒙字体 WebFont](https://github.com/IKKI2000/harmonyos-fonts) 
- [Nunoti](https://fonts.google.com/specimen/Nunito)

首先引入字体 CSS 样式，需要在其他 CSS 样式前引用，所以直接将主题目录下的 `~/themes/diary/layouts/partials/head.html` 复制到主题根目录同名文件夹下，然后在 `<head>` 下引用，二选一直接放到开头：

```html
// 霞鹜文楷
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css" />
// 鸿蒙字体
<link rel="stylesheet" href="https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css" />
// Nunoti
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
```

在 `journal.scss` 中更改字体设置，选择对应的字体替换：

```scss
$default-font-list: Nunoti, HarmonyOS_Regular, -apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
$default-font-list: Nunoti, "LXGW WenKai Screen", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

## 调整首页文章列表布局
将首页文章列表布局调整为卡片样式，并且根据奇偶数交错显示文章封面图，移动设备仍然将封面图显示在文章信息上方，样式参考 `Hexo Butterfly` ，在 `custom.scsss` 中添加如下代码：
```scss
// 首页文章列表布局调整
.stream-container {
  .post-list-container {
    padding: 20px;

    > * {
      .post-item-wrapper {
        margin: 0 auto 20px;
        width: 95%;
        max-width: 800px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background-color: #fff;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .post-item {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: stretch;
          border-bottom: none;

          .post-item-image-wrapper {
            flex: 0 0 35%;
            max-width: 280px;
            margin: 0;
            overflow: hidden;

            .post-item-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
          }

          &:hover {
            .post-item-image {
              transform: scale(1.05);
            }
          }

          .post-item-info-wrapper {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .post-item-title {
              margin-bottom: 10px;
              font-size: 1.3em;
            }

            .post-item-summary {
              margin-bottom: 15px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
      }

      // 奇数项文章，图片在左边（默认情况）
      &:nth-child(odd) {
        .post-item-wrapper .post-item {
          flex-direction: row;
        }
      }

      // 偶数项文章，图片在右边
      &:nth-child(even) {
        .post-item-wrapper .post-item {
          flex-direction: row-reverse;

          .post-item-image-wrapper {
            margin-left: 0;
            margin-right: 0;
          }
        }
      }
    }
  }
}

// 暗色模式调整
body.night {
  .stream-container {
    .post-list-container > * {
      .post-item-wrapper {
        background-color: #2d2d2d;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

        &:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }

        .post-item {
          border-bottom: none;
        }
      }
    }
  }
}

// 针对移动设备的调整
@media screen and (max-width: $single-column-max-width) {
  .stream-container {
    .post-list-container {
      padding: 10px;

      > * {
        .post-item-wrapper {
          width: 100%;
          margin-bottom: 15px;

          .post-item {
            flex-direction: column !important; // 强制垂直布局

            .post-item-image-wrapper {
              flex: none;
              max-width: none;
              width: 100%;
              height: 200px;
              order: -1; // 确保图片始终在上方
            }

            .post-item-info-wrapper {
              padding: 15px;

              .post-item-title {
                font-size: 1.2em;
              }
            }
          }
        }
      }
    }
  }
}
```

## 网站访问量
主题自带了谷歌分析和微软的 `Clarity`，但是还是推荐使用其他的服务。这里可以使用 `Umami` ，后台能看到访问的详细记录，搭建方法可以参考访问[之前的文章](https://blog.grew.cc/umami/)。
前台的展示可以使用不蒜子计数。
### Umami
首先在 `~/layouts\partials\extended_head.html` 中添加 `js` 引入：
```html
{{ if .Site.Params.umami -}}
<script 
    defer 
    src="https://umami.grew.cc/myscript" 
    data-website-id="b2daf838-b6d4-4783-a157-e2fbe0cc225d"
    data-domains="blog.grew.cc"
></script>
{{- end }}
```

>[!NOTE]
>	上述参数可以直接复制 `umami` 的跟踪代码，可以加一行 `data-domains` ，设置成自己的域名，这样可以防止本地调试时的访问被统计进去。

最后在站点配置文件中 `[params]` 下加入配置开关，注意配置格式
```toml
umami = true
```

### 不蒜子
这个前台展示可以使用杜老师说建的 `API`，提高国内访问速度，访问地址：[杜老师说自建国内不蒜子 API](https://bsz.dusays.com/)

首先在 `~/layouts\partials\extended_head.html` 中添加 `js` 引入：
```html
{{/*  busuanzi统计  */}}
{{ if .Site.Params.busuanzi -}}
<script async src="https://npm.elemecdn.com/penndu@1.0.0/bsz.js"></script>
{{- end }}
```

然后在页脚添加本站访问量，在文章详情页添加本文访问量，`Diary` 主题页脚是 `copyright.html`

将主题目录下的 `copyright.html` 和 `single.html` 复制到站点相同路径下，然后在 `copyright.html` 中添加：

```html
{{ if .Site.Params.busuanzi -}}
<br>
<span id="busuanzi_container_site_pv">本站总访问量 <span id="busuanzi_value_site_pv"></span> 次</span>&nbsp;
<span id="busuanzi_container_site_pv">本站总访客数 <span id="busuanzi_value_site_uv"></span> 人</span>
{{- end }}
```

在 `single.html` 中 `59` 行，阅读时间配置后面添加：

```html
{{ if .Site.Params.busuanzi -}}
<br>
<span id="busuanzi_container_page_pv">本文阅读量 <span id="busuanzi_value_page_pv"></span> 次</span>&nbsp;
<span id="busuanzi_container_page_pv">本文访客数 <span id="busuanzi_value_page_uv"></span> 人</span>
{{- end }}
```

最后在站点配置文件中 `[params]` 下添加开关，同 `umami` 一样：
```toml
busuanzi = true
```
## 参考


- [黄忠德的博客](https://huangzhongde.cn/post/2020-02-21-hugo-code-copy-to-clipboard/)
- [使用Github Pages+Hugo+PaperMod搭建博客](https://www.elegantcrazy.com/posts/blog/build-blog-with-github-pages-hugo-and-papermod/#%E6%B7%BB%E5%8A%A0%E8%AE%BF%E9%97%AE%E9%87%8F%E7%BB%9F%E8%AE%A1%E5%8A%9F%E8%83%BD)
