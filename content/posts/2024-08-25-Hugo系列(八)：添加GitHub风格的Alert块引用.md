---
categories: 
- 实用教程
cover: ''
date: 2024-08-25 22:09:14+08:00
description: 让 Hugo 支持 GitHub 风格的 Alert 块引用。
slug: hugo-alert-blockquote
summary: 让 Hugo 支持 GitHub 风格的 Alert 块引用。
tags:
- Hugo
title: Hugo系列(八)：添加GitHub风格的Alert块引用
---
在[一篇博客](https://blog.hentioe.dev/posts/hugo-support-blockquote-alerts.html) 中看到 `Hugo` 新版本支持通过标记（Markups）的 Hook 模板来渲染 `Alert` 风格的块引用，因此参考那位博主的代码和 `ChatGPT` 直接在博客上尝试。
<!--more-->

## 配置
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
```

然后可以在 `custom.scss` 中添加样式代码，可以直接写到模板中用 `<style>` 和 `</style>` 包裹：

```scss
<style>
.alert-blockquote {
  --title-color: #fff;
  --content-color: inherit;
  padding: 18px;
  line-height: 24px;
  margin: 1rem 0;
  border-radius: 4px;
  color: var(--content-color);
  border-left: none !important;
}

.alert-blockquote * {
  color: var(--content-color) !important;
}

.alert-blockquote .alert-heading {
  margin: -18px -18px 12px;
  padding: 4px 18px;
  border-radius: 4px 4px 0 0;
  font-weight: 600;
  color: var(--title-color) !important;
  display: flex;
  align-items: center;
}

.alert-blockquote .alert-heading svg {
  width: 1em !important;
  height: 1em !important;
  margin-right: 0.5rem !important;
  fill: currentColor !important;
}

.alert-blockquote p:last-child {
  margin-bottom: 0;
}

/* Light theme */
.alert-blockquote.alert-note {
  --title-background-color: #166dd0;
  --content-background-color: #e7f2fa;
}

.alert-blockquote.alert-tip {
  --title-background-color: #1a7f37;
  --content-background-color: #efe;
}

.alert-blockquote.alert-important {
  --title-background-color: #8250df;
  --content-background-color: #f5f0ff;
}

.alert-blockquote.alert-warning {
  --title-background-color: #9a6700;
  --content-background-color: #fff8c5;
}

.alert-blockquote.alert-caution {
  --title-background-color: #cf222e;
  --content-background-color: #ffebe9;
}

/* Dark theme */
body.night .alert-blockquote {
  --content-color: #d0d7dd;
}

body.night .alert-blockquote.alert-note {
  --title-background-color: #58a6ff;
  --content-background-color: #0d1d30;
}

body.night .alert-blockquote.alert-tip {
  --title-background-color: #3fb950;
  --content-background-color: #0f2a1b;
}

body.night .alert-blockquote.alert-important {
  --title-background-color: #a371f7;
  --content-background-color: #2a1d3f;
}

body.night .alert-blockquote.alert-warning {
  --title-background-color: #d29922;
  --content-background-color: #3b2300;
}

body.night .alert-blockquote.alert-caution {
  --title-background-color: #f85149;
  --content-background-color: #3d0c0c;
}

.alert-blockquote .alert-heading {
  background: var(--title-background-color);
}

.alert-blockquote {
  background: var(--content-background-color);
}
</style>
```

我的样式是根据 `Hugo-notice`  的样式而来，如果想使用 `GitHub ` 风格，可以替换样式代码：
```scss
.alert-blockquote {
  all: revert !important;
  border-left-width: 4px !important;
  border-left-style: solid !important;
  padding: 0.25rem 1rem !important;
  margin: 1rem 0 !important;
  color: inherit !important;
}
.alert-blockquote * {
  color: inherit !important;
}
.alert-blockquote .alert-heading {
  display: flex !important;
  align-items: center !important;
  font-weight: 600 !important;
  margin-bottom: 0.5rem !important;
}
.alert-blockquote.alert-note {
  border-left-color: #0969da !important;
}
.alert-blockquote.alert-note .alert-heading {
  color: #0969da !important;
}
.alert-blockquote.alert-tip {
  border-left-color: #1a7f37 !important;
}
.alert-blockquote.alert-tip .alert-heading {
  color: #1a7f37 !important;
}
.alert-blockquote.alert-important {
  border-left-color: #8250df !important;
}
.alert-blockquote.alert-important .alert-heading {
  color: #8250df !important;
}
.alert-blockquote.alert-warning {
  border-left-color: #9a6700 !important;
}
.alert-blockquote.alert-warning .alert-heading {
  color: #9a6700 !important;
}
.alert-blockquote.alert-caution {
  border-left-color: #cf222e !important;
}
.alert-blockquote.alert-caution .alert-heading {
  color: #cf222e !important;
}
.alert-blockquote .alert-heading svg {
  width: 1rem !important;
  height: 1rem !important;
  margin-right: 0.5rem !important;
  fill: currentColor !important;
}
/* 暗黑模式适配 */
body.night .alert-blockquote {
  color: #c9d1d9 !important;
}
body.night .alert-blockquote * {
  color: #c9d1d9 !important;
}
body.night .alert-blockquote.alert-note .alert-heading {
  color: #58a6ff !important;
}
body.night .alert-blockquote.alert-tip .alert-heading {
  color: #3fb950 !important;
}
body.night .alert-blockquote.alert-important .alert-heading {
  color: #a371f7 !important;
}
body.night .alert-blockquote.alert-warning .alert-heading {
  color: #d29922 !important;
}
body.night .alert-blockquote.alert-caution .alert-heading {
  color: #f85149 !important;
}
body.night .alert-blockquote .alert-heading svg {
  fill: currentColor !important;
}
```

>[!NOTE]
>由于我的主题引入了 `Bootstrap` 的 `CSS` ，导致配置样式被覆盖，因此我都使用了 `!important` 来确保样式生效。


模板中使用了 `i18n` 来生成标题，所以需要在 `~/i18n/` 下的文件中配置名称，我的中文文件参考如下：

```yaml
- id: caution
  translation: '危险'
- id: important
  translation: '重要'
- id: note
  translation: '注释'
- id: tip
  translation: '提示'
- id: warning
  translation: '警告'
```

这个相比短代码的好处是 `obsidian` 很多主题都带有这种 `Alert` 引用，可以在 ` obsidian ` 直接显示样式，而短代码不行。

## 参考
- [让 Hugo 支持 GitHub 风格的块引用 Alerts](https://blog.hentioe.dev/posts/hugo-support-blockquote-alerts.html)
