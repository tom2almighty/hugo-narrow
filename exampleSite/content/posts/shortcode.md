---
title: "Shortcode Examples"
date: 2025-12-26
draft: false
description: "A complete guide to all available shortcodes for the Hugo Narrow theme"
tags: ["shortcode"]
categories: ["shortcode"]
series: ["Test"]
series_order: 3
---

This page demonstrates all available shortcodes in the Hugo Narrow theme.

## Hugo Built-in Shortcodes

Hugo provides several [built-in shortcodes](https://gohugo.io/shortcodes/). The content of these shortcodes is subject to change without notice, so you can visit the official page for detailed usage instructions.

The built-in shortcodes include:

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

## Theme Custom Shortcodes

### Icon

Display SVG icons from the theme's icon library:

```markdown
{{</* icon name="heart" */>}}
{{</* icon name="github" size="lg" */>}}
{{</* icon name="sun" class="text-primary" */>}}
```

**Example:**
{{< icon name="heart" >}} {{< icon name="github" size="lg" >}} {{< icon name="sun" size="xl" class="text-primary" >}}

**Parameters:**

- name: Icon name (required) - Check assets/icons/ for available icons or place custom icons in this directory, or place the custom icon in this directory
- size: xs, sm, md, lg, xl, 2xl (default: md)
- class: Custom CSS class, which can be used to change colors

### Button

Create styled buttons with theme colors:

```markdown
{{</* button text="Learn More" url="/about" */>}}
{{</* button text="GitHub" url="https://github.com" icon="github" target="_self" */>}}
{{</* button text="Download" url="/download" variant="outline" size="lg" */>}}
```

**Example:**

{{< button text="Primary Button" url="#" />}}{{< button text="Secondary Button" url="#" variant="secondary" />}}{{< button text="Outline Button" url="#" variant="outline" />}}
{{< button text="Small Size" url="#" size="sm" />}}{{< button text="Medium Size" url="#" size="md" />}}{{< button text="Large Size" url="#" size="lg" />}}
{{< button text="With Icon" url="#" icon="github" />}}{{< button text="External Link" url="<https://github.com>" icon="external-link" target="_self" />}}

**Parameters:**

- text: Button text (required, or use inner content)
- url: Link address (required)
- variant: primary, secondary, outline (default: primary)
- size: sm, md, lg (default: md)
- icon: Theme icon name
- target: _blank,_self (default: _blank)
- rel: Link relationship (noopener noreferrer is automatically added when _blank is used)

### Link Card

Display a link card with a website icon:

```markdown
{{</* link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" */>}}
```

**Examples:**
{{< link title="Google" description="The world largest search engine." url="https://google.com" icon="https://google.com/favicon.ico" >}}

### Bilibili

Embed Bilibili videos:

```markdown
{{</* bilibili BV号 */>}}
{{</* bilibili AV号 分P号 */>}}
```

### Tencent Video

```markdown
{{</* tencent 视频ID */>}}
```

### Masonry Gallery

Create a waterfall-style image gallery:

```markdown
{{</* masonry */>}}
![Image 1](/images/1.jpg)
![Image 2](/images/2.jpg)
![Image 3](/images/3.jpg)
{{</* /masonry */>}}
```
