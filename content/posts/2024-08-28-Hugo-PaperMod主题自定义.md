---
categories: 
- 实用教程
cover: ''
date: 2024-08-28 16:49:22+08:00
description: Hugo PaperMod 主题 7.0 版本最新修改记录。
slug: papermod-modify
tags:
- Hugo
- PaperMod
- 主题
title: Hugo-PaperMod主题自定义
---
`Hugo` [PaperMod](https://github.com/adityatelange/hugo-PaperMod/) 主题轻量且美观，参考网上的教程，并借助 `AI` 和自己的理解加以修改，记录下来供自己和他人参阅。
<!--more-->

> [!NOTE]
> 更换了主题， PaperMod 站点访问链接：[PaperMod Blog](https://tom2almighty.github.io/hugo-blog-papermod)

## 准备
`PaperMod` 提供了丰富的自定义入口，提供了 `extended_head.html` 和 `extended_footer.html` 来修改，并且 `assets/css/extended/`  下可以添加任意名称 `CSS` 文件，主题都会引入。


## 悬浮动画
`CSS` 的修改直接在 `assets/css/extended/` 文件夹下新建文件写入，分开方便调试，后面都一样不再赘述。

```css
/* 悬浮动画 */
/* 左上角logo悬浮动画 */
.logo a:hover {
    transition: 0.15s;
    color: grey;
  }

/* 首页icon悬浮动画 */
svg:hover {
    transition: 0.15s;
    transform: scaleX(1.1) scaleY(1.1);
}

.social-icons a svg:hover{
    color: #ffbb3d !important;

}
/* 模式切换按钮悬浮动画 */
#moon:hover {
    transition: 0.15s;
    color: deepskyblue;
}

#sun:hover {
    transition: 0.15s;
    color: gold;
}
/* 菜单栏文字悬浮动画 */
#menu a:hover {
    transition: 0.15s;
    color: grey;
}

```

## 首页信息居中

```css
/* 首页信息居中 */
.first-entry .entry-header {
    align-self: center;
}
.home-info .entry-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.first-entry .entry-footer {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

## 字体修改

字体使用了两种，一个纯英文字体 `Nunito`，一个鸿蒙字体，字体设置中先使用英文字体，再使用中文，这样可以中英文字体分开，代码块字体也可以设置不一样的。

在 `~/layouts/partials/extended_head.html` 中引入字体，并且在 `CSS` 中添加样式：

```html
{{/*  字体引入  */}}
<link rel="stylesheet" href="https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
```

```css
body {
    font-family: Nunito, HarmonyOS_Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.post-content pre, code {
    font-family: consolas, sans-serif;
}

```

## 首页文章封面图侧边显示
首页文章列表的封面图很高，导致一页放不下几篇文章，希望可以把封面图放到文章信息侧边，有两种方法可以实现。

一种只需要添加自定义 `CSS` 文件到目录下就可以实现，简单方便，只是文章没有封面图时，文章的标题和描述会两列显示，即标题占用到了封面的位置。

另一种方法是通过修改模板文件实现，可以通过站点设置控制显示在左侧、右侧或默认的顶部。参考了这篇文章：[Hugo博客文章封面图片缩小并移到侧边 | PaperMod主题](https://www.sulvblog.cn/posts/blog/img_right/)。

### 方法一
可以直接到 `GitHub` 下载，这个项目还包含了其他的功能，具体访问[仓库地址](https://github.com/arashsm79/hugo-PaperMod-Mod)，或者直接在 `assets/css/extended/` 目录下新建文件粘贴下面的内容：

```css
/* Allocate a single column when the width of the page is small. */
.post-entry {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px 0px;
}

/* Allocate two columns when there is enough width. *
 * The thumbnail is placed in the first column, while the rest of
 * the children are placed in the second column. */
@media (min-width: 700px) {
    .post-entry {
        grid-template-columns: 2fr 3fr;
        grid-gap: 0px 10px;
    }
}

.post-entry .entry-cover {
    max-width: fit-content;
    margin: auto;
    grid-row: span 3;
}

.post-entry .entry-header {
    align-self: center;
}

.post-entry .entry-content {
    align-self: center;
}

.post-entry .entry-footer {
    align-self: end;
}

```

上述代码封面图显示在左侧，如果想要显示在右侧，替换成下面的：

```css
/* Allocate a single column when the width of the page is small. */
.post-entry {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px 0px;
}

/* Allocate two columns when there is enough width. */
/* The thumbnail is placed in the second column, while the rest of */
/* the children are placed in the first column. */
@media (min-width: 700px) {
    .post-entry {
        grid-template-columns: 3fr 2fr;
        grid-gap: 0px 10px;
    }
    .post-entry .entry-cover {
        grid-column: 2;
        grid-row: 1 / span 3;
    }
}

.post-entry .entry-cover {
    max-width: fit-content;
    margin: auto;
}

.post-entry .entry-header {
    align-self: center;
}

.post-entry .entry-content {
    align-self: center;
}

.post-entry .entry-footer {
    align-self: end;
}
```

### 方法二
这种方法较为复杂，好处是可以通过参数控制直接控制显示左侧或者右侧。

首先复制主题 `layouts\_default\list.html` 文件到根目录下，在其中修改，找到大概 `66` 行 `<article></article>` 包裹的元素，将代码换成这部分：

```html
<article class="{{ $class }}{{ if and .Site.Params.homeCoverPosition .Params.cover.image }} cover-{{ .Site.Params.homeCoverPosition }}{{ end }}">
  {{- $isHidden := (.Param "cover.hiddenInList") | default (.Param "cover.hidden") | default false }}
  {{- if and (not $isHidden) .Params.cover.image }}
  <div class="post-content-wrapper">
    <div class="post-cover">
      {{- partial "cover.html" (dict "cxt" . "IsSingle" false "isHidden" $isHidden) }}
    </div>
    <div class="post-info">
  {{- else }}
  <div class="post-content-wrapper">
    <div class="post-info">
  {{- end }}
      <header class="entry-header">
        <h2 class="entry-hint-parent">
          {{- .Title }}
          {{- if .Draft }}
          <span class="entry-hint" title="Draft">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M160-410v-60h300v60H160Zm0-165v-60h470v60H160Zm0-165v-60h470v60H160Zm360 580v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q9 9 13 20t4 22q0 11-4.5 22.5T862.09-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
            </svg>
          </span>
          {{- end }}
        </h2>
      </header>
      {{- if (ne (.Param "hideSummary") true) }}
      <div class="entry-content">
        <p>{{ .Summary | plainify | htmlUnescape }}{{ if .Truncated }}...{{ end }}</p>
      </div>
      {{- end }}
      {{- if not (.Param "hideMeta") }}
      <footer class="entry-footer">
        {{- partial "post_meta.html" . -}}
      </footer>
      {{- end }}
    </div>
  </div>
  <a class="entry-link" aria-label="post link to {{ .Title | plainify }}" href="{{ .Permalink }}"></a>
</article>
```

新建一个文件放置 `CSS` 代码：

```css
.post-entry {
  overflow: hidden;
}

.post-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cover-right .post-content-wrapper .post-cover .entry-cover,
.cover-left .post-content-wrapper .post-cover .entry-cover 
{
  margin-bottom: unset;
  margin-top: unset;
}

.entry-cover {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap);
}

.cover-left .post-content-wrapper,
.cover-right .post-content-wrapper {
  flex-direction: row;
  align-items: center;
}

.cover-left .post-cover,
.cover-right .post-cover {
  width: 40%;
  margin-bottom: 0;
  margin-right: 20px;
}

.cover-right .post-content-wrapper {
  flex-direction: row-reverse;
}

.cover-right .post-cover {
  margin-right: 0;
  margin-left: 20px;
}

.cover-left .post-info,
.cover-right .post-info {
  width: 60%;
}

/* 修复文章详情页图片描述位置 */
.post-single .entry-cover {
  flex-direction: column;
  margin-bottom: 10px;
}


/* 移动设备默认上方 */
@media (max-width: 768px) {
  .cover-left .post-content-wrapper,
  .cover-right .post-content-wrapper {
    flex-direction: column;
  }

  .cover-left .post-cover,
  .cover-right .post-cover,
  .cover-left .post-info,
  .cover-right .post-info {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
  }
  .entry-cover {
    margin-bottom: var(--gap) !important;
  }
}


```

最后在站点配置中添加配置来控制封面图位置：

```yaml
params:
  homeCoverPosition: right # left/right/top
```


## 代码块功能
优化了代码块的显示，添加了下面的功能：
- 语言显示
- Mac 风格外观
- 代码块折叠

复制主题的 `layouts\partials\footer.html` 到根目录下，找到其中代码块复制功能部分，大概在 `95` 行左右，替换代码：

```html
{{- if (and (eq .Kind "page") (ne .Layout "archives") (ne .Layout "search") (or (.Param "ShowCodeCopyButtons") (.Param "ShowMacDots") (.Param "ShowCodeLang") (.Param "ShowExpandButton"))) }}
<style>
    .code-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        {{/*  background: var(--code-block-bg);  */}}
        background: #232323;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 0.8em;
        position: relative;
    }
    .mac-dots {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ff5f56;
        box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
        margin-right: 5px;
    }
    .lang-label {
        flex-grow: 1;
        text-align: center;
        margin: 0 5px;
        color: rgba(255,255,255,.8);
    }
    .toolbar-group {
        display: flex;
        align-items: center;
    }
    .expand-button, .copy-code {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0 5px;
    }
    .highlight {
        position: relative;
    }
    .highlight.collapsible {
        max-height: {{ .Site.Params.codeMaxHeight | default "300px" }};
        overflow: hidden;
    }
    .highlight.expanded {
        max-height: none;
    }
    .highlight pre {
        margin-bottom: 0;
    }
    .expand-button {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: transparent;
        padding: 5px 10px;
        border-radius: 5px 5px 0 0;
        display: none;
        height: 30px;
        &:hover {
            background: rgba(255,255,255,.1);
            color: #fff;
        }
    }
    .highlight.collapsible .expand-button {
        display: block;
    }
    .highlight table {
        margin-bottom: 0;
    }
    .post-content pre code {
        overflow-x: auto;
        overflow-y: hidden;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const codeBlocks = document.querySelectorAll('.highlight');
        const maxHeight = parseInt('{{ .Site.Params.codeMaxHeight | default "300" }}');
        
        codeBlocks.forEach((block) => {
            const pre = block.querySelector('pre');
            const code = pre.querySelector('code');

            // Determine if a toolbar is needed
            let toolbarNeeded = false;
            if ({{ .Param "ShowMacDots" }} || {{ .Param "ShowCodeLang" }}) {
                toolbarNeeded = true;
            }

            if (toolbarNeeded) {
                const toolbar = document.createElement('div');
                toolbar.classList.add('code-toolbar');
                block.insertBefore(toolbar, block.firstChild);

                const leftGroup = document.createElement('div');
                leftGroup.classList.add('toolbar-group');
                toolbar.appendChild(leftGroup);

                const rightGroup = document.createElement('div');
                rightGroup.classList.add('toolbar-group');
                toolbar.appendChild(rightGroup);

                if ({{ .Param "ShowMacDots" }}) {
                    const macDots = document.createElement('div');
                    macDots.classList.add('mac-dots');
                    leftGroup.appendChild(macDots);
                }

                if ({{ .Param "ShowCodeLang" }}) {
                    let language = '';
                    const possibleElements = [
                        block,
                        block.querySelector('code'),
                        block.querySelector('pre > code'),
                        block.querySelector('pre'),
                        block.querySelector('td:nth-child(2) code')
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

                    if (language) {
                        const langLabel = document.createElement('div');
                        langLabel.classList.add('lang-label');
                        langLabel.textContent = language;
                        toolbar.insertBefore(langLabel, rightGroup);
                    }
                }

                if ({{ .Param "ShowCodeCopyButtons" }}) {
                    const copyButton = document.createElement('button');
                    copyButton.classList.add('copy-code');
                    copyButton.innerHTML = '{{- i18n "code_copy" | default "copy" }}';
                    rightGroup.appendChild(copyButton);

                    copyButton.addEventListener('click', () => {
                        let textToCopy = code.textContent;
                        if (code.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                            textToCopy = Array.from(code.parentNode.parentNode.parentNode.querySelectorAll('td:nth-child(2)'))
                                .map(td => td.textContent)
                                .join('\n');
                        }
                        
                        if ('clipboard' in navigator) {
                            navigator.clipboard.writeText(textToCopy);
                            copyingDone();
                            return;
                        }

                        const textArea = document.createElement('textarea');
                        textArea.value = textToCopy;
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                            document.execCommand('copy');
                            copyingDone();
                        } catch (e) { };
                        document.body.removeChild(textArea);
                    });

                    function copyingDone() {
                        copyButton.innerHTML = '{{- i18n "code_copied" | default "copied!" }}';
                        setTimeout(() => {
                            copyButton.innerHTML = '{{- i18n "code_copy" | default "copy" }}';
                        }, 2000);
                    }
                }
            } else if ({{ .Param "ShowCodeCopyButtons" }}) {
                const copyButton = document.createElement('button');
                copyButton.classList.add('copy-code');
                copyButton.innerHTML = '{{- i18n "code_copy" | default "copy" }}';
                if (block.classList.contains("highlight")) {
                    block.appendChild(copyButton);
                } else if (block.parentNode.firstChild == block) {
                    // td containing LineNos
                } else if (code.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                    // table containing LineNos and code
                    code.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(copyButton);
                } else {
                    // code blocks not having highlight as parent class
                    code.parentNode.appendChild(copyButton);
                }

                copyButton.addEventListener('click', () => {
                    let textToCopy = code.textContent;
                    if (code.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "TABLE") {
                        textToCopy = Array.from(code.parentNode.parentNode.parentNode.querySelectorAll('td:nth-child(2)'))
                            .map(td => td.textContent)
                            .join('\n');
                    }
                    
                    if ('clipboard' in navigator) {
                        navigator.clipboard.writeText(textToCopy);
                        copyingDone();
                        return;
                    }

                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        copyingDone();
                    } catch (e) { };
                    document.body.removeChild(textArea);
                });

                function copyingDone() {
                    copyButton.innerHTML = '{{- i18n "code_copied" | default "copied!" }}';
                    setTimeout(() => {
                        copyButton.innerHTML = '{{- i18n "code_copy" | default "copy" }}';
                    }, 2000);
                }
            }

            if ({{ .Param "ShowExpandButton" }}) {
                const expandButton = document.createElement('button');
                expandButton.classList.add('expand-button');
                expandButton.innerHTML = '&#9660;'; // Down arrow
                block.appendChild(expandButton);

                if (pre.offsetHeight > maxHeight) {
                    block.classList.add('collapsible');
                    expandButton.style.display = 'block';

                    expandButton.addEventListener('click', () => {
                        block.classList.toggle('expanded');
                        expandButton.innerHTML = block.classList.contains('expanded') ? '&#9650;' : '&#9660;';
                    });
                }
            }
        });
    });
</script>
{{- end }}
```

> [!TIP]
> 这里直接将样式写入了模板中，工具栏的背景可以自己更换，可以设置成代码块背景色成为一个整体，也可以自己更改。


然后同样在站点配置文件中添加参数控制开关：

```yaml
params:
# 代码块功能
  ShowMacDots: true # Mac色块
  ShowCodeLang: true # 语言显示
  ShowExpandButton: true # 代码块折叠
  ShowCodeCopyButtons: true # 代码块复制按钮
  codeMaxHeight: "300px" # 代码块最大折叠高度
```

## 添加 Waline 评论
将主题目录下的 `layouts\partials\comments.html` 文件复制到站点根目录，写入代码：
```html
{{ if .Site.Params.walineServer }}
<div id="waline"></div>
<script>
    Waline.init({
        el: '#waline',
        //path: location.pathname,
        dark: "body.dark",
        serverURL: "{{.Site.Params.walineServer}}",
    });
    
    </script>
{{ end }}
```

然后在 `extended_head.html` 文件中引入 `js` 和 `css`：

```html
{{/*  Waline评论引入  */}}
{{ if and (.Site.Params.walineServer) (.IsPage) }}
<script src="https://unpkg.com/@waline/client@v2/dist/waline.js"></script>
  <link
    rel="stylesheet"
    href="https://unpkg.com/@waline/client@v2/dist/waline.css"
  />
{{ end }}
```

最后在站点配置中配置自己的地址：

```yaml
params:
  comments: true
  walineServer: https://waline.vercel.app
```

## 目录侧边显示
有三种方法更改目录到侧边，两种是直接添加自定义 `CSS`，一种需要修改模板文件。
### 方法一
直接添加自定义 `CSS` 样式，方法来自：[Commit Make ToC float](https://github.com/JannikArndt/jannikarndt.github.io/commit/8b99f6cbc61c6b4f0238c592d5315cefe07c0599)

方法比较简单，缺点是目录没有激活项高亮，不会随着页面滚动而滚动。

```css
.toc {
    padding: 14px;
    border: solid 1px lightgray;
    font-size: 12px;
}


@media (min-width: 1280px) {
    .toc {
        position: sticky;
        float: left;
        --toc-left: calc(100vw / 50);
        left: var(--toc-left); /* _minimum_ distance from left screen border */
        top: 100px;
        margin-left: -1000px; /* overruled by left */

        width: calc((100vw - var(--main-width) - 2 * var(--gap)) / 2 - 2 * var(--toc-left));
        padding: 14px;
        border: solid 1px lightgray;
        font-size: 12px;
    }

    .toc .inner {
        padding: 0;
    }

    .toc details summary {
        margin-inline-start: 0;
        margin-bottom: 10px;
    }

}



summary {
    cursor: pointer !important;
}
```

### 方法二
同样使用 `CSS` 实现，访问[项目地址](https://github.com/arashsm79/hugo-PaperMod-Mod)

下载下来添加到自己的目录即可，还包含了文章缩略图。

> [!IMPORTANT]
> 测试后发现，如果只添加目录样式，会有错位，需要添加他的自定义设置文件，但是文章总体布局会变宽，具体自行测试。


### 方法三

更改模板文件，使用 `toc-container` 和 `wide` 等 `CSS` 类，在 `JavaScript` 中动态添加或移除这些类，以响应屏幕宽度的变化。动态样式控制通过 ` checkTocPosition () ` 函数来实现，确保目录在不同屏幕大小下的合适显示，最初来自一个外国博主的 `PR`，访问详细信息：[Toc on the side #675 ]( https://github.com/adityatelange/hugo-PaperMod/pull/675 )，可以参考博客：[Sulv's Blog | Hugo 博客目录放在侧边 | PaperMod 主题](https://www.sulvblog.cn/posts/blog/hugo_toc_side/)

复制模板文件 `~/themes\PaperMod\layouts\partials\toc.html` 到站点根目录下，替换内容并添加样式：

```html
{{- $headers := findRE "<h[1-6].*?>(.|\n])+?</h[1-6]>" .Content -}}
{{- $has_headers := ge (len $headers) 1 -}}
{{- if $has_headers -}}
<aside id="toc-container" class="toc-container wide">
    <div class="toc">
        <details {{if (.Param "TocOpen") }} open{{ end }}>
            <summary accesskey="c" title="(Alt + C)">
                <span class="details">{{- i18n "toc" | default "Table of Contents" }}</span>
            </summary>

            <div class="inner">
                {{- $largest := 6 -}}
                {{- range $headers -}}
                {{- $headerLevel := index (findRE "[1-6]" . 1) 0 -}}
                {{- $headerLevel := len (seq $headerLevel) -}}
                {{- if lt $headerLevel $largest -}}
                {{- $largest = $headerLevel -}}
                {{- end -}}
                {{- end -}}

                {{- $firstHeaderLevel := len (seq (index (findRE "[1-6]" (index $headers 0) 1) 0)) -}}

                {{- $.Scratch.Set "bareul" slice -}}
                <ul>
                    {{- range seq (sub $firstHeaderLevel $largest) -}}
                    <ul>
                        {{- $.Scratch.Add "bareul" (sub (add $largest .) 1) -}}
                        {{- end -}}
                        {{- range $i, $header := $headers -}}
                        {{- $headerLevel := index (findRE "[1-6]" . 1) 0 -}}
                        {{- $headerLevel := len (seq $headerLevel) -}}

                        {{/* get id="xyz" */}}
                        {{- $id := index (findRE "(id=\"(.*?)\")" $header 9) 0 }}

                        {{- /* strip id="" to leave xyz, no way to get regex capturing groups in hugo */ -}}
                        {{- $cleanedID := replace (replace $id "id=\"" "") "\"" "" }}
                        {{- $header := replaceRE "<h[1-6].*?>((.|\n])+?)</h[1-6]>" "$1" $header -}}

                        {{- if ne $i 0 -}}
                        {{- $prevHeaderLevel := index (findRE "[1-6]" (index $headers (sub $i 1)) 1) 0 -}}
                        {{- $prevHeaderLevel := len (seq $prevHeaderLevel) -}}
                        {{- if gt $headerLevel $prevHeaderLevel -}}
                        {{- range seq $prevHeaderLevel (sub $headerLevel 1) -}}
                        <ul>
                            {{/* the first should not be recorded */}}
                            {{- if ne $prevHeaderLevel . -}}
                            {{- $.Scratch.Add "bareul" . -}}
                            {{- end -}}
                            {{- end -}}
                            {{- else -}}
                            </li>
                            {{- if lt $headerLevel $prevHeaderLevel -}}
                            {{- range seq (sub $prevHeaderLevel 1) -1 $headerLevel -}}
                            {{- if in ($.Scratch.Get "bareul") . -}}
                        </ul>
                        {{/* manually do pop item */}}
                        {{- $tmp := $.Scratch.Get "bareul" -}}
                        {{- $.Scratch.Delete "bareul" -}}
                        {{- $.Scratch.Set "bareul" slice}}
                        {{- range seq (sub (len $tmp) 1) -}}
                        {{- $.Scratch.Add "bareul" (index $tmp (sub . 1)) -}}
                        {{- end -}}
                        {{- else -}}
                    </ul>
                    </li>
                    {{- end -}}
                    {{- end -}}
                    {{- end -}}
                    {{- end }}
                    <li>
                        <a href="#{{- $cleanedID -}}" aria-label="{{- $header | plainify -}}">{{- $header | safeHTML -}}</a>
                        {{- else }}
                    <li>
                        <a href="#{{- $cleanedID -}}" aria-label="{{- $header | plainify -}}">{{- $header | safeHTML -}}</a>
                        {{- end -}}
                        {{- end -}}
                        <!-- {{- $firstHeaderLevel := len (seq (index (findRE "[1-6]" (index $headers 0) 1) 0)) -}} -->
                        {{- $firstHeaderLevel := $largest }}
                        {{- $lastHeaderLevel := len (seq (index (findRE "[1-6]" (index $headers (sub (len $headers) 1)) 1) 0)) }}
                    </li>
                    {{- range seq (sub $lastHeaderLevel $firstHeaderLevel) -}}
                    {{- if in ($.Scratch.Get "bareul") (add . $firstHeaderLevel) }}
                </ul>
                {{- else }}
                </ul>
                </li>
                {{- end -}}
                {{- end }}
                </ul>
            </div>
        </details>
    </div>
</aside>
<script>
    let activeElement;
    let elements;
    window.addEventListener('DOMContentLoaded', function (event) {
        checkTocPosition();

        elements = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
         // Make the first header active
         activeElement = elements[0];
         const id = encodeURI(activeElement.getAttribute('id')).toLowerCase();
         document.querySelector(`.inner ul li a[href="#${id}"]`).classList.add('active');
     }, false);

    window.addEventListener('resize', function(event) {
        checkTocPosition();
    }, false);

    window.addEventListener('scroll', () => {
        // Check if there is an object in the top half of the screen or keep the last item active
        activeElement = Array.from(elements).find((element) => {
            if ((getOffsetTop(element) - window.pageYOffset) > 0 && 
                (getOffsetTop(element) - window.pageYOffset) < window.innerHeight/2) {
                return element;
            }
        }) || activeElement

        elements.forEach(element => {
             const id = encodeURI(element.getAttribute('id')).toLowerCase();
             if (element === activeElement){
                 document.querySelector(`.inner ul li a[href="#${id}"]`).classList.add('active');
             } else {
                 document.querySelector(`.inner ul li a[href="#${id}"]`).classList.remove('active');
             }
         })
     }, false);

    const main = parseInt(getComputedStyle(document.body).getPropertyValue('--article-width'), 10);
    const toc = parseInt(getComputedStyle(document.body).getPropertyValue('--toc-width'), 10);
    const gap = parseInt(getComputedStyle(document.body).getPropertyValue('--gap'), 10);

    function checkTocPosition() {
        const width = document.body.scrollWidth;

        if (width - main - (toc * 2) - (gap * 4) > 0) {
            document.getElementById("toc-container").classList.add("wide");
        } else {
            document.getElementById("toc-container").classList.remove("wide");
        }
    }

    function getOffsetTop(element) {
        if (!element.getClientRects().length) {
            return 0;
        }
        let rect = element.getBoundingClientRect();
        let win = element.ownerDocument.defaultView;
        return rect.top + win.pageYOffset;   
    }
</script>
{{- end }}
```

```css
:root {
    --nav-width: 1380px;
    --article-width: 650px;
    --toc-width: 300px;
}

.toc {
    margin: 0 2px 40px 2px;
    border: 1px solid var(--border);
    background: var(--entry);
    border-radius: var(--radius);
    padding: 0.4em;
}

.toc-container.wide {
    position: absolute;
    height: 100%;
    border-right: 1px solid var(--border);
    left: calc((var(--toc-width) + var(--gap)) * -1);
    top: calc(var(--gap) * 2);
    width: var(--toc-width);
}

.wide .toc {
    position: sticky;
    top: var(--gap);
    border: unset;
    background: unset;
    border-radius: unset;
    width: 100%;
    margin: 0 2px 40px 2px;
}

.toc details summary {
    cursor: zoom-in;
    margin-inline-start: 20px;
    padding: 12px 0;
}

.toc details[open] summary {
    font-weight: 500;
}

.toc-container.wide .toc .inner {
    margin: 0;
}

.active {
    font-size: 110%;
    font-weight: 600;
}

.toc ul {
    list-style-type: circle;
}

.toc .inner {
    margin: 0 0 0 20px;
    padding: 0px 15px 15px 20px;
    font-size: 16px;

    /*目录显示高度*/
    max-height: 83vh;
    overflow-y: auto;
}

.toc .inner::-webkit-scrollbar-thumb {  /*滚动条*/
    background: var(--border);
    border: 7px solid var(--theme);
    border-radius: var(--radius);
}

.toc li ul {
    margin-inline-start: calc(var(--gap) * 0.5);
    list-style-type: none;
}

.toc li {
    list-style: none;
    font-size: 0.95rem;
    padding-bottom: 5px;
}

.toc li a:hover {
    color: var(--secondary);
}
```

## 添加网站访问量
参考之前的文章：[Hugo-Diary 主题修改记录](https://blog.grew.cc/posts/hugo-diary-modify/)

## 添加 GitHub 风格的 Alert 块引用
参考之前的文章：[Hugo博客添加GitHub风格的Alert块引用](https://blog.grew.cc/posts/hugo-alert-blockquote/)

> [!IMPORTANT]
> 需要 `Hugo` 版本在 `0.132` 以上


新建 `~/layouts/_default/_markup/render-blockquote-alert.html`，写入模板内容：

```html
{{ $alertTypes := dict
    "note" "<path d=\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\"></path>"
    "tip" "<path d=\"M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z\"></path>"
    "important" "<path d=\"M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z\"></path>"
    "warning" "<path d=\"M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z\"></path>"
    "caution" "<path d=\"M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z\"></path>"
  }}
  {{ if eq .Type "alert" }}
    <blockquote class="alert-blockquote alert-{{ .AlertType }}">
      <p class="alert-heading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
          {{ index $alertTypes .AlertType | safeHTML }}
        </svg>
        <span>{{ or (i18n .AlertType) (title .AlertType) }}</span>
      </p>
      {{ .Text | safeHTML }}
    </blockquote>
  {{ else }}
    <blockquote>
      {{ .Text | safeHTML }}
    </blockquote>
  {{ end }}


<style>
  :root {
    --alert-title-color: #fff;
    --alert-content-color: inherit;
  }
  
  .post-content .alert-blockquote {
    --title-background-color: #166dd0;
    --content-background-color: #e7f2fa;
    padding: 0;
    margin: 1rem 0;
    border-radius: 4px;
    color: var(--alert-content-color);
    border-inline-start: none;
  }
  
  .alert-blockquote * {
    color: inherit;
  }
  
  .alert-blockquote .alert-heading {
    padding: 4px 18px;
    border-radius: 4px 4px 0 0;
    font-weight: 600;
    color: var(--alert-title-color);
    display: flex;
    align-items: center;
    background: var(--title-background-color);
    margin-bottom: 0;
  }
  
  .alert-heading svg {
    width: 1em;
    height: 1em;
    margin-right: 0.5rem;
    fill: currentColor;
  }
  
  .alert-blockquote > :not(.alert-heading) {
    padding: 18px;
    background-color: var(--content-background-color);
  }
  
  .alert-blockquote p:last-child {
    text-align: justify;
    margin-bottom: 0;
  }
  
  .alert-blockquote.alert-tip { --title-background-color: #1a7f37; --content-background-color: #efe; }
  .alert-blockquote.alert-important { --title-background-color: #8250df; --content-background-color: #f5f0ff; }
  .alert-blockquote.alert-warning { --title-background-color: #9a6700; --content-background-color: #fff8c5; }
  .alert-blockquote.alert-caution { --title-background-color: #cf222e; --content-background-color: #ffebe9; }
  
  body.dark {
    :root {
      --alert-content-color: #d0d7dd;
    }
  
    .post-content .alert-blockquote {
      --title-background-color: #58a6ff;
      --content-background-color: #0d1d30;
    }
  
    .alert-blockquote.alert-tip { --title-background-color: #3fb950; --content-background-color: #0f2a1b; }
    .alert-blockquote.alert-important { --title-background-color: #a371f7; --content-background-color: #2a1d3f; }
    .alert-blockquote.alert-warning { --title-background-color: #d29922; --content-background-color: #3b2300; }
    .alert-blockquote.alert-caution { --title-background-color: #f85149; --content-background-color: #3d0c0c; }
  }
</style>
```

> [!IMPORTANT]
> 下面这是 `GitHub` 风格


```css
<style>
    .post-content .alert-blockquote {
      border-left: 4px solid;
      border-radius: 5px;
    }
    
    .alert-blockquote .alert-heading {
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .alert-blockquote .alert-heading svg {
      margin-right: 0.5rem;
      fill: currentColor;
    }

    /* 左侧border颜色 */
    .post-content .alert-note { border-left-color: #0969da; }
    .post-content .alert-tip { border-left-color: #1a7f37; }
    .post-content .alert-important { border-left-color: #8250df; }
    .post-content .alert-warning { border-left-color: #9a6700; }
    .post-content .alert-caution { border-left-color: #cf222e; }

    /* 标题颜色 */
    .alert-note .alert-heading { color: #0969da; }
    .alert-tip .alert-heading { color: #1a7f37; }
    .alert-important .alert-heading { color: #8250df; }
    .alert-warning .alert-heading { color: #9a6700; }
    .alert-caution .alert-heading { color: #cf222e; }
    
    body.dark .alert-note .alert-heading { color: #58a6ff; }
    body.dark .alert-tip .alert-heading { color: #3fb950; }
    body.dark .alert-important .alert-heading { color: #a371f7; }
    body.dark .alert-warning .alert-heading { color: #d29922; }
    body.dark .alert-caution .alert-heading { color: #f85149; }
</style>
```

## 热力图
代码直接复制的原博主代码，[访问原文](https://www.eallion.com/blog-heatmap/)，也可以参考下面两篇文章：

- [如何给 Hugo 博客添加热力图 | 最早的文章](https://blog.douchi.space/hugo-blog-heatmap/)
- [给博客添加heatmap](https://blog.liminalnegativespace.xyz/posts/heatmap/)


新建一个短代码 `~/layouts/shortcodes/heatmap.html`

```html
<p style="text-align: center;">文章统计</p>
<div class="heatmap_container"> <!-- 全部用 Flex 排版 -->
    <div class="heatmap_content">
        <div class="heatmap_week">
            <span>Mon</span>
            <span>&nbsp;</span> <!-- 不需要显示的星期用空格表示 -->
            <span>Wed</span>
            <span>&nbsp;</span>
            <span>Fri</span>
            <span>&nbsp;</span>
            <span>Sun</span>
        </div>
        <div class="heatmap_main">
            <div class="month heatmap_month">
                <!-- js 检测屏幕宽度动态生成月份 -->
            </div>
            <div id="heatmap" class="heatmap">
                <!-- js 检测屏幕宽度动态生成年度日历小方块 -->
            </div>
        </div>
    </div>
    <div class="heatmap_footer">
        <div class="heatmap_less">Less</div>
        <div class="heatmap_level">
            <span class="heatmap_level_item heatmap_level_0"></span>
            <span class="heatmap_level_item heatmap_level_1"></span>
            <span class="heatmap_level_item heatmap_level_2"></span>
            <span class="heatmap_level_item heatmap_level_3"></span>
            <span class="heatmap_level_item heatmap_level_4"></span>
        </div>
        <div class="heatmap_more">More</div>
    </div>
</div>


<style>
    :root {
        /* GitHub Light Color */
        --ht-main: #334155;
        --ht-day-bg: #ebedf0;
        --ht-tooltip: #24292f;
        --ht-tooltip-bg: #fff;
        --ht-lv-0: #ebedf0;
        --ht-lv-1: #9be9a8;
        --ht-lv-2: #40c463;
        --ht-lv-3: #30a14e;
        --ht-lv-4: #216e39;
    }
    
    body.dark {
        /* GitHub Dark Dimmed Color */
        --ht-main: #94a3b8;
        --ht-day-bg: #161b22;
        --ht-tooltip: #24292f;
        --ht-tooltip-bg: #fff;
        --ht-lv-0: #161b22;
        --ht-lv-1: #0e4429;
        --ht-lv-2: #006d32;
        --ht-lv-3: #26a641;
        --ht-lv-4: #39d353;
    }
    
    .heatmap_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10px;
        line-height: 12px;
        color: var(--ht-main);
    }
    
    .heatmap_content {
        display: flex;
        flex-direction: row;
        align-items: flex-end
    }
    
    .heatmap_week {
        display: flex;
        margin-top: 0.25rem;
        margin-right: 2px;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        text-align: right
    }
    
    .heatmap_main {
        display: flex;
        flex-direction: column
    }
    
    .heatmap_month {
        display: flex;
        margin-top: 0.25rem;
        margin-right: 0.25rem;
        justify-content: space-around;
        align-items: flex-end;
        text-align: right;
    }
    
    .heatmap {
        display: flex;
        flex-direction: row;
        height: 84px;
    }
    
    .heatmap_footer {
        display: flex;
        margin-top: 0.5rem;
        align-items: center
    }
    
    .heatmap_level {
        display: flex;
        gap: 2px;
        margin: 0 0.25rem;
        flex-direction: row;
        align-items: center;
        width: max-content;
        height: 10px
    }
    
    .heatmap_level_item {
        display: block;
        border-radius: 0.125rem;
        width: 10px;
        height: 10px;
    }
    
    .heatmap_level_0 {
        background: var(--ht-lv-0);
    }
    
    .heatmap_level_1 {
        background: var(--ht-lv-1);
    }
    
    .heatmap_level_2 {
        background: var(--ht-lv-2);
    }
    
    .heatmap_level_3 {
        background: var(--ht-lv-3);
    }
    
    .heatmap_level_4 {
        background: var(--ht-lv-4);
    }
    
    .heatmap_week {
        display: flex;
        flex-direction: column;
    }
    
    .heatmap_day {
        width: 10px;
        height: 10px;
        background-color: var(--ht-day-bg);
        margin: 1px;
        border-radius: 2px;
        display: inline-block;
        position: relative;
    }
    
    .heatmap_tooltip {
        position: absolute;
        bottom: 12px;
        left: 50%;
        width: max-content;
        color: var(--ht-tooltip);
        background-color: var(--ht-tooltip-bg);
        font-size: 12px;
        line-height: 16px;
        padding: 8px;
        border-radius: 3px;
        white-space: pre-wrap;
        opacity: 1;
        transition: 0.3s;
        z-index: 1000;
        text-align: right;
        transform: translateX(-50%);
    }
    
    .heatmap_tooltip_count,
    .heatmap_tooltip_post {
        display: inline-block;
    }
    
    .heatmap_tooltip_title,
    .heatmap_tooltip_date {
        display: block;
    }
    
    .heatmap_tooltip_date {
        margin: 0 0.25rem;
    }
    
    .heatmap_day_level_0 {
        background-color: var(--ht-lv-0);
    }
    
    .heatmap_day_level_1 {
        background-color: var(--ht-lv-1);
    }
    
    .heatmap_day_level_2 {
        background-color: var(--ht-lv-2);
    }
    
    .heatmap_day_level_3 {
        background-color: var(--ht-lv-3);
    }
    
    .heatmap_day_level_4 {
        background-color: var(--ht-lv-4);
    }
</style>


<script>
    // 获取最近一年的文章数据
{{ $pages := where .Site.RegularPages "Date" ">" (now.AddDate -1 0 0) }}
{{ $pages := $pages.Reverse }}
var blogInfo = {
    "pages": [
        {{ range $index, $element := $pages }}
            {
                "title": "{{ replace (replace .Title "《" "〈") "》" "〉" }}",
                "date": "{{ .Date.Format "2006-01-02" }}",
                "year": "{{ .Date.Format "2006" }}",
                "month": "{{ .Date.Format "01" }}",
                "day": "{{ .Date.Format "02" }}",
                "word_count": "{{ .WordCount }}"
            }{{ if ne (add $index 1) (len $pages) }},{{ end }}
            {{ end }}
    ]
};
// console.log(blogInfo)

let currentDate = new Date();
currentDate.setFullYear(currentDate.getFullYear() - 1);

let startDate;

let monthDiv = document.querySelector('.month');
let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

if (window.innerWidth < 768) {
    numMonths = 6;
} else {
    numMonths = 12;
}

let startMonthIndex = (currentDate.getMonth() - (numMonths - 1) + 12) % 12;
for (let i = startMonthIndex; i < startMonthIndex + numMonths; i++) {
    let monthSpan = document.createElement('span');
    let monthIndex = i % 12;
    monthSpan.textContent = monthNames[monthIndex];
    monthDiv.appendChild(monthSpan);
}

function getStartDate() {
    const today = new Date();

    if (window.innerWidth < 768) {
        numMonths = 6;
    } else {
        numMonths = 12;
    }

    const startDate = new Date(today.getFullYear(), today.getMonth() - numMonths + 1, 1, today.getHours(), today.getMinutes(), today.getSeconds());

    while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() + 1);
    }

    return startDate;
}

function getWeekDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

function createDay(date, title, count, post) {
    const day = document.createElement("div");

    day.className = "heatmap_day";

    day.setAttribute("data-title", title);
    day.setAttribute("data-count", count);
    day.setAttribute("data-post", post);
    day.setAttribute("data-date", date);

    day.addEventListener("mouseenter", function () {
        const tooltip = document.createElement("div");
        tooltip.className = "heatmap_tooltip";

        let tooltipContent = "";

        if (post && parseInt(post, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_post">' + '共 ' + post + ' 篇' + '</span>';
        }

        if (count && parseInt(count, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_count">' + ' ' + count + ' 字；' + '</span>';
        }

        if (title && parseInt(title, 10) !== 0) {
            tooltipContent += '<span class="heatmap_tooltip_title">' + title + '</span>';
        }

        if (date) {
            tooltipContent += '<span class="heatmap_tooltip_date">' + date + '</span>';
        }

        tooltip.innerHTML = tooltipContent;
        day.appendChild(tooltip);
    });

    day.addEventListener("mouseleave", function () {
        const tooltip = day.querySelector(".heatmap_tooltip");
        if (tooltip) {
            day.removeChild(tooltip);
        }
    });

    if (count == 0 ) {
        day.classList.add("heatmap_day_level_0");
    } else if (count > 0 && count < 1000) {
        day.classList.add("heatmap_day_level_1");
    } else if (count >= 1000 && count < 2000) {
        day.classList.add("heatmap_day_level_2");
    } else if (count >= 2000 && count < 3000) {
        day.classList.add("heatmap_day_level_3");
    } else {
        day.classList.add("heatmap_day_level_4");
    }

    return day;
}

function createWeek() {
    const week = document.createElement('div');
    week.className = 'heatmap_week';
    return week;
}

function createHeatmap() {
    const container = document.getElementById('heatmap');
    const startDate = getStartDate();
    const endDate = new Date();
    const weekDay = getWeekDay(startDate);

    let currentWeek = createWeek();
    container.appendChild(currentWeek);

    let currentDate = startDate;
    let i = 0;

    while (currentDate <= endDate) {
        if (i % 7 === 0 && i !== 0) {
            currentWeek = createWeek();
            container.appendChild(currentWeek);
        }

        const dateString = `${currentDate.getFullYear()}-${("0" + (currentDate.getMonth()+1)).slice(-2)}-${("0" + (currentDate.getDate())).slice(-2)}`;

        const articleDataList = blogInfo.pages.filter(page => page.date === dateString);

        if (articleDataList.length > 0) {
            const titles = articleDataList.map(data => data.title);
            const title = titles.map(t => `《${t}》`).join('<br />');

            let count = 0;
            let post = articleDataList.length;

            articleDataList.forEach(data => {
                count += parseInt(data.word_count, 10);
            });

            const formattedDate = formatDate(currentDate);
            const day = createDay(formattedDate, title, count, post);
            currentWeek.appendChild(day);
        } else {
            const formattedDate = formatDate(currentDate);
            const day = createDay(formattedDate, '', '0', '0');
            currentWeek.appendChild(day);
        }

        i++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function formatDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

createHeatmap();
</script>
```

可以修改其中的颜色适应自己的博客，使用方法如下：

```bash
{\{< heatmap >}\}
```

## 图片展示
### 图片排版优化
代码来自：[木木木木木博客](https://immmmm.com/about-images-gird/)
正文中的图片排版优化，直接通过 `CSS` 来，在自定义样式目录新建文件添加下面的样式：
```css
.post-content p:has(> img:nth-child(2)){column-count:2;column-gap:8px;margin:6px 0;}
.post-content p:has(> img:nth-child(3)){column-count:3;}
.post-content p:has(> img:nth-child(4)){column-count:4;}
.post-content p:has(> img:nth-child(5)){column-count:5;}
.post-content p:has(> img:nth-child(6)){column-count:4;}
.post-content p:has(> img:nth-child(2)) img{display:inherit;}
.post-content p:has(> img:nth-child(6)) img{margin-bottom:8px;}
```

使用时直接以 `markdown` 书写即可，中间不要有空行。

### 图片瀑布流
代码来自：[木木木木木博客](https://immmmm.com/hi-waterfall-js/)
在 `extend_footer.html` 中添加 `js`：

```javascript
{{/*  gallery瀑布流  */}}
<script src="https://immmmm.com/waterfall.min.js"></script>
<script src="https://immmmm.com/imgStatus.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    //外链 gallery 标签相册瀑布流
    var photosAll = document.getElementsByTagName('gallery') || '';
    if(photosAll){
      for(var i=0;i < photosAll.length;i++){
        photosAll[i].innerHTML = '<div class="gallery-photos">'+photosAll[i].innerHTML+'</div>'
        var photosIMG = photosAll[i].getElementsByTagName('img')
        for(var j=0;j < photosIMG.length;j++){
          wrap(photosIMG[j], document.createElement('div'));
        }
      }
    }
    function wrap(el, wrapper) {
      wrapper.className = "gallery-photo";
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
    //相册瀑布流
    let galleryPhotos = document.querySelectorAll('.gallery-photos') || ''
    if(galleryPhotos){
      imgStatus.watch('.gallery-photo img', function(imgs) {
        if(imgs.isDone()){
          for(var i=0;i < galleryPhotos.length;i++){
            waterfall(galleryPhotos[i]);
            let pagePhoto = galleryPhotos[i].querySelectorAll('.gallery-photo');
            for(var j=0;j < pagePhoto.length;j++){pagePhoto[j].className += " visible"};
          }
        }
      });
      window.addEventListener('resize', function () {
        for(var i=0;i < galleryPhotos.length;i++){
          waterfall(galleryPhotos[i]);
        }
      });
    }
  });
</script>
<script type="text/javascript" src="https://immmmm.com/view-image.js"></script>
<script>
  window.ViewImage && ViewImage.init('.gallery-photo img')
</script>
```

> [!TIP]
> 建议将代码中的 `JS` 文件放入自己博客根目录 `static` 文件夹下引入。

引入样式：
```css
/* gallery瀑布流 */
.gallery-photos{width:100%;}
.gallery-photo{width:24.9%;position: relative;visibility: hidden;overflow: hidden;}
.gallery-photo.visible{visibility: visible;animation: fadeIn 2s;}
.gallery-photo img{display: block;width:100%;border-radius:0;padding:4px;animation: fadeIn 1s;cursor: pointer;transition: all .4s ease-in-out;}
.gallery-photo span.photo-title,.gallery-photo span.photo-time{background: rgba(0, 0, 0, 0.3);padding:0px 8px;font-size:0.9rem;color: #fff;display:none;animation: fadeIn 1s;}
.gallery-photo span.photo-title{position:absolute;bottom:4px;left:4px;}
.gallery-photo span.photo-time{position:absolute;top:4px;left:4px;font-size:0.8rem;}
.gallery-photo:hover span.photo-title{display:block;}
.gallery-photo:hover img{transform: scale(1.1);}
@media screen and (max-width: 1280px) {
    .gallery-photo{width:33.3%;}
}
@media screen and (max-width: 860px) {
    .gallery-photo{width:49.9%;}
}
@media (max-width: 683px){
    .photo-time{display: none;}
}
@keyframes fadeIn{
    0% {opacity: 0;}
   100% {opacity: 1;}
}
```

使用如下：

```html
<gallery>
    <img src="https://xxxxx.jpg">
    <img src="https://xxxxx.jpg">
    <img src="https://xxxxx.jpg">
</gallery>
```

> [!TIP]
> 可以引入外链图片，也可以引入本地图片，默认路径为 `~/static/` ，如果使用 `markdown` 直接将图片放置到一行，不要换行。


### 图片橱窗
通过橱窗样式展示图片，代码来自：[codepen](https://codepen.io/ycw/pen/NWByWoE)

新建 `~/layouts/shortcodes/image-showcase.html`，直接将所有内容放入其中：

```html
<div class="app">
    <form class="plate">
      {{ range $index, $src := .Params }}
        <label class="item">
          <input type="radio" name="item" {{ if eq $index 0 }}checked="checked"{{ end }}/>
          <img src="{{ $src }}"/>
        </label>
      {{ end }}
    </form>
  </div>
  

<style>
/** side by side **/
.app:nth-of-type(1) {
    place-self: center right;
  }
  .app:nth-of-type(2) {
    place-self: center left;
  }
  
  .app {
    --preview-item-width: calc(100% / (var(--item-count) - 1));
    --preview-item-height: 10%;
    width: 50vmin;
    height: 80vmin;
    margin: auto;
  }
  
  .app [type="radio"] {
    display: none;
  }
  
  .app .plate {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .app .plate .item {
    display: block;
    width: var(--preview-item-width);
    height: var(--preview-item-height);
    position: absolute;
    bottom: 0;
    left: var(--left);
    transform-origin: top left;
    transition: transform 0.5s, bottom 0.6s, left 0.6s, width 0.3s,
      box-shadow 0.6s;
  }
  
  .app .plate .item img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .app .plate .item.active {
    --preview-item-width: 100%;
    bottom: var(--preview-item-height); /* bubble up */
    left: 0 !important;
    height: calc(100% - var(--preview-item-height));
    box-shadow: 0 0 0 transparent;
    animation: anim 2s 1;
    transform: translate3d(0, 0, -10px);
    transition: transform 0.5s, bottom 0.6s, left 0.6s, width 0.3s, box-shadow 0s;
  }
  
  .app .plate .item.active img {
    object-fit: contain;
  }
  
  /* 
  optional
  */
  
  .app .plate {
    perspective: 100px;
    perspective-origin: center center;
    transform-style: preserve-3d;
    pointer-events: none;
  }
  
  .app .plate::after {
    content: "";
    display: block;
    width: 100%;
    height: 15px;
    position: absolute;
    bottom: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    transform: rotateX(90deg);
    transform-origin: bottom center;
  }
  
  .app .plate .item:not(.active) {
    transform-origin: center;
    transform: scale(0.8) translate3d(0, 0, -5px);
    pointer-events: auto;
  }
  
  .app .plate .item:not(.active):hover {
    transform-origin: center;
    transform: scale(0.8) translate3d(0, -1px, -5px);
    box-shadow: 0 20px 10px -10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  
  /*
  animation
  */
  
  @keyframes anim {
    from {
      transform: rotateY(6deg) rotateX(3deg);
    }
  }
</style>


<script>
document.querySelectorAll('.app').forEach(init)

function init(app) {
  const items = app.querySelectorAll('.item')
  app.style.setProperty('--item-count', items.length)
  const form = app.querySelector('.plate')
  form.addEventListener('input', () => update(app))
  update(app)
}

function update(app) {
  const items = Array.from(app.querySelectorAll('.item'))
  const active = items.filter(x => x.querySelector(':checked'))[0]
  const inactives = items.filter(x => x != active)
  // toggle class
  items.forEach(x => x.classList.toggle('active', x === active))
  // re-calc anim props
  inactives.forEach((x, i, xs) => x.style.setProperty('--left', `${i / xs.length}e2%`))
}
</script>

```

使用短代码如下：
```bash
{\{< image-showcase "/images/pic1.jpg" "/images/pic2.jpg" "/images/pic3.jpg" >}\}
```

>[!TIP]
>图片地址默认仍然是博客根目录下 `static` 文件夹，或者引入外链图片也可以


### 图片轮播 | Carousel
原始代码来自：[一种在 MemE 主题中实现轮播图功能的思路](https://guanqr.com/tech/website/a-way-to-realize-carousel-in-meme/)

修改代码来自：[Hugo | 在文章中插入轮播图片](https://mantyke.icu/posts/2021/cf2cf0fb/)

新建 `~/lauouts/shortcodes/loop.html`

```html
{{ if .Site.Params.enableimgloop }}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.2/css/swiper.min.css">
    <!-- Swiper -->
    <div class="swiper-container">
        <div class="swiper-wrapper">
            {{$itItems := split (.Get 0) ","}}
            {{range $itItems }}
            <div class="swiper-slide">
                <img src="{{.}}" alt="">
            </div>
            {{end}}
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.4.2/js/swiper.min.js"></script>
     <!-- Initialize Swiper -->
     <script>
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
        //自动调节高度
        autoHeight: true,
        //键盘左右方向键控制
        keyboardControl : true,
        //鼠标滑轮控制
        mousewheelControl : true,
        //自动切换
        //autoplay : 5000,
        //懒加载
        lazyLoading : true,
		lazyLoadingInPrevNext : true,
		//无限循环
		loop : true,
        });
        </script>
{{ end }}

<style>
    .swiper-container {
        width: 100%;
        margin: 2em auto;
        height: 330px;
        border-radius: 10px;
    
    }
    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background-color: #fff;
        /* Center slide text vertically */
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            margin: 0 !important;
        }
    }
    
</style>
```

**使用方法：**
在站点配置文件中写入参数：

```yaml
params:
  enableimgloop: true
```

```bash
{\{< loop "/images/1.jpg,/images/2.jpg,/images/3.jpg" >}\}
```


## 参考
- [Hugo博客文章封面图片缩小并移到侧边 | PaperMod主题](https://www.sulvblog.cn/posts/blog/img_right/)
- [使用Github Pages+Hugo+PaperMod搭建博客](https://www.elegantcrazy.com/posts/blog/build-blog-with-github-pages-hugo-and-papermod/#%E6%B7%BB%E5%8A%A0%E8%AE%BF%E9%97%AE%E9%87%8F%E7%BB%9F%E8%AE%A1%E5%8A%9F%E8%83%BD)
- [Hugo blog & PaperMod](https://www.lilmp.com/2022-06-22/hugo-papermod-blog)
- [折腾 Hugo & PaperMod 主题](https://dvel.me/posts/hugo-papermod-config/)
- [JannikArndt/jannikarndt.github.io@8b99f6c](https://github.com/JannikArndt/jannikarndt.github.io/commit/8b99f6cbc61c6b4f0238c592d5315cefe07c0599)
- [Sulv's Blog | Hugo 博客目录放在侧边 | PaperMod 主题](https://www.sulvblog.cn/posts/blog/hugo_toc_side/)
- [如何给 Hugo 博客添加热力图]( https://blog.douchi.space/hugo-blog-heatmap/ )
- [给博客添加heatmap](https://blog.liminalnegativespace.xyz/posts/heatmap/)
- [CSS 和 JS 实现博客热力图](https://www.eallion.com/blog-heatmap/)
- [Hugo 相册短代码](https://immmmm.com/hugo-shortcodes-gallery/)
- [Hugo 多图排版这样来](https://immmmm.com/about-images-gird/)
- [图片瀑布流折腾记](https://immmmm.com/hi-waterfall-js/)
- [Simplicity {multi}](https://codepen.io/ycw/pen/NWByWoE)
- [Hugo | 在文章中插入轮播图片](https://mantyke.icu/posts/2021/cf2cf0fb/)
- [一种在 MemE 主题中实现轮播图功能的思路](https://guanqr.com/tech/website/a-way-to-realize-carousel-in-meme/)
