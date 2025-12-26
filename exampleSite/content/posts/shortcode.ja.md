---
title: "ショートコード例"
date: 2025-12-26
draft: false
description: "Hugo Narrow テーマで利用可能なすべてのショートコードの完全ガイド"
tags: ["shortcode"]
categories: ["shortcode"]
---

このページでは、Hugo Narrow テーマで利用可能なすべてのショートコードを紹介します。

## Hugo 組み込みショートコード

Hugo はいくつかの[組み込みショートコード](https://gohugo.io/shortcodes/)を提供します。これらの内容や動作は変更される場合があるため、詳細は公式ドキュメントを参照してください。

組み込みショートコードには次のものが含まれます：

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

## テーマ独自のショートコード

### Icon

テーマのアイコンライブラリから SVG アイコンを表示します：

```markdown
{{</* icon name="heart" */>}}
{{</* icon name="github" size="lg" */>}}
{{</* icon name="sun" class="text-primary" */>}}
```

**例：**
{{< icon name="heart" >}} {{< icon name="github" size="lg" >}} {{< icon name="sun" size="xl" class="text-primary" >}}

**パラメーター：**

- `name`：アイコン名（必須） — 利用可能なアイコンは `assets/icons/` を参照、またはカスタムアイコンをこのディレクトリに配置してください
- `size`：`xs`、`sm`、`md`、`lg`、`xl`、`2xl`（デフォルト：`md`）
- `class`：色などを変更するためのカスタム CSS クラス

### Button

テーマ色のスタイル付きボタンを作成します：

```markdown
{{</* button text="Learn More" url="/about" */>}}
{{</* button text="GitHub" url="https://github.com" icon="github" target="_self" */>}}
{{</* button text="Download" url="/download" variant="outline" size="lg" */>}}
```

**例：**

{{< button text="Primary Button" url="#" />}}{{< button text="Secondary Button" url="#" variant="secondary" />}}{{< button text="Outline Button" url="#" variant="outline" />}}
{{< button text="Small Size" url="#" size="sm" />}}{{< button text="Medium Size" url="#" size="md" />}}{{< button text="Large Size" url="#" size="lg" />}}
{{< button text="With Icon" url="#" icon="github" />}}{{< button text="External Link" url="<https://github.com>" icon="external-link" target="_self" />}}

**パラメーター：**

- `text`：ボタンのテキスト（必須、または内部コンテンツを利用）
- `url`：リンク先（必須）
- `variant`：`primary`、`secondary`、`outline`（デフォルト：`primary`）
- `size`：`sm`、`md`、`lg`（デフォルト：`md`）
- `icon`：テーマのアイコン名
- `target`：`_blank`、`_self`（デフォルト：`_blank`）
- `rel`：リンクの関係（`_blank` 使用時は自動で `noopener noreferrer` が追加されます）

### Link Card

サイトのアイコン付きリンクカードを表示します：

```markdown
{{</* link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" */>}}
```

**例:**
{{< link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" >}}

### Bilibili

Bilibili の動画を埋め込みます：

```markdown
{{</* bilibili BV号 */>}}
{{</* bilibili AV号 分P号 */>}}
```

### Tencent Video

```markdown
{{</* tencent 视频ID */>}}
```

### Masonry Gallery

ウォーターフォール（マasonry）スタイルの画像ギャラリーを作成します：

```markdown
{{</* masonry */>}}
![画像 1](/images/1.jpg)
![画像 2](/images/2.jpg)
![画像 3](/images/3.jpg)
{{</* /masonry */>}}
```
