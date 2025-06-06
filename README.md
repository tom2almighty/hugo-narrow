<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/images/home.png"/>

# Hugo Narrow

English | [简体中文](https://github.com/tom2almighty/hugo-narrow/blob/main/README.zh.md)

A modern, clean Hugo theme built with Tailwind CSS 4.0, featuring customizable themes.


## ✨ Features

- **Multi-theme Design** - Built-in multiple themes with support for custom themes
- **Light/Dark Mode** - Auto-adapts to system theme or manual toggle, all themes support dark mode
- **Responsive Design** - Perfect adaptation for desktop, tablet, and mobile devices
- **Multi-language Support** - Multi-language support.
- **Enhanced Markdown** - Support for GitHub-style Markdown Alerts, supports Obsidian-style folding ( +/- )
- **Enhanced Code Blocks** - One-click copy, language display, code block folding support
- **Math Formulas** - KaTeX support
- **Chart Support** - Mermaid charts, supporting flowcharts, sequence diagrams, etc.
- **Table of Contents Navigation** - TOC with highlighting and scroll monitoring
- **Multiple Comment Systems** - Support for Giscus, Disqus, Utterances, Waline, Artalk, Twikoo
- **Search Functionality** - Site-wide search support
- **Great User Experience** - Bottom dock with common functions: back to previous page, jump to top or comments, view TOC, site-wide search
- **Multiple Analytics Platforms** - Support for Google Analytics, Microsoft Clarity, Baidu Analytics, Umami
- **SEO Optimized** - Complete Open Graph, Twitter Card, JSON-LD support


## 🚀 Quick Start

### Install Theme

If you already have a Hugo site, it's recommended to add the theme as a git submodule. After completion, copy the contents from the `~/themes/hugo-narrow/exampleSite` directory to your root directory.

```bash
# Add theme as submodule
git submodule add https://github.com/tom2almighty/hugo-narrow.git themes/hugo-narrow

# Update submodules
git submodule update --init --recursive
```

### Local Preview

```bash
hugo server -D
```
### Online Preview (Vercel)

You can directly fork this repository. When building on Vercel, replace the `Build Command` with `cp exampleSite/hugo.yaml . && cp -r exampleSite/content . && sed -i 's/theme:.*//' hugo.yaml && hugo --minify --gc`, and configure the environment variable `HUGO_VERSION=0.146.0`.

## ⚙️ Configuration

The `hugo.yaml` file contains complete configuration. Here's the information you might need for configuring your site:

### Menu Settings

Header navigation, footer, personal info card, and bottom social links can all use icons. Project icons are placed in the `~/assets/icons/` directory. Download the required icon SVGs locally and use the filename directly in Hugo configuration:

```yaml
menus:
  main:
    - name: nav.posts
      pageRef: /posts
      weight: 20
      params:
        icon: posts
  footer:
    - name: footer.about_us
      pageRef: /about
      weight: 10
      params:
        icon: about
  social:
    - name: GitHub
      url: https://github.com/username
      weight: 10
      params:
        icon: github
```

> [!NOTE]
>
> In the above configuration, `name: nav.posts` uses i18n configuration. You can change the name as needed.


### Post Front Matter

The following custom fields are available in `frontmatter` (all optional):

| Name        | Parameter  | Description                                                  |
| ----------- | ---------- | ------------------------------------------------------------ |
| cover       | image path | Post cover, supports local path (relative to `static` directory) or URL. Auto-generated if not set |
| katex       | bool       | KaTeX  toggle, can set delimiters under this field, same as Hugo config |
| mermaid     | bool       | Mermaid  toggle                                              |
| comments    | bool       | Comments  toggle                                             |
| showLicense | bool       | Copyright info toggle, can set specific copyright info, same as Hugo config |
| showRelated | bool       | Related posts toggle                                         |

## 🎨 Custom Themes

### Site Themes

Create a new file in the `~/assets/css/custom/` folder and add your desired themes. Theme variables need to include styles for both light and dark modes.

> [!NOTE]
>
> You can also add custom configurations in the `~/assets/css/custom.css` file, but you need to install `tailwindcss`, `@tailwindcss/cli`, and `@tailwindcss/typography` locally.

```css
[data-theme="dracula"] {
  --color-primary: oklch(0.70 0.15 346.812);
  --color-primary-foreground: oklch(0.98 0.007 106.545);
  --color-secondary: oklch(0.68 0.12 301.883);
  --color-secondary-foreground: oklch(0.98 0.007 106.545);
  --color-accent: oklch(0.75 0.10 66.558);
  --color-accent-foreground: oklch(0.20 0.024 66.558);
  --color-background: oklch(0.95 0.01 277.508);
  --color-foreground: oklch(0.30 0.022 277.508);
  --color-muted: oklch(0.90 0.015 277.508);
  --color-muted-foreground: oklch(0.50 0.02 277.508);
  --color-border: oklch(0.82 0.02 277.508);
  --color-card: oklch(0.95 0.01 277.508);
  --color-card-foreground: oklch(0.30 0.022 277.508);
  --color-popover: oklch(0.97 0.005 277.508);
  --color-popover-foreground: oklch(0.30 0.022 277.508);

  --color-note: oklch(0.65 0.15 240);
  --color-tip: oklch(0.70 0.14 160);
  --color-important: oklch(0.70 0.15 346.812);
  --color-warning: oklch(0.75 0.16 85);
  --color-caution: oklch(0.65 0.18 15);
}

[data-theme="dracula"].dark {
  --color-primary: oklch(0.755 0.183 346.812);
  --color-primary-foreground: oklch(0.151 0.036 346.812);
  --color-secondary: oklch(0.742 0.148 301.883);
  --color-secondary-foreground: oklch(0.148 0.029 301.883);
  --color-accent: oklch(0.834 0.124 66.558);
  --color-accent-foreground: oklch(0.167 0.024 66.558);
  --color-background: oklch(0.288 0.022 277.508);
  --color-foreground: oklch(0.977 0.007 106.545);
  --color-muted: oklch(0.394 0.032 275.524);
  --color-muted-foreground: oklch(0.879 0.006 275.524);
  --color-border: oklch(0.45 0.035 277.508);
  --color-card: oklch(0.32 0.025 277.508);
  --color-card-foreground: oklch(0.977 0.007 106.545);
  --color-popover: oklch(0.394 0.032 275.524);
  --color-popover-foreground: oklch(0.977 0.007 106.545);

  --color-note: oklch(0.70 0.14 240);
  --color-tip: oklch(0.75 0.13 160);
  --color-important: oklch(0.755 0.183 346.812);
  --color-warning: oklch(0.80 0.15 85);
  --color-caution: oklch(0.70 0.17 15);
}
```

After completion, configure the frontend switching options and switching order in `hugo.yaml`:

```yaml
  colorScheme: "default"
  themes:
    default:
      name: "Default"
      order: 1
    claude:
      name: "Claude"
      order: 2
```

### Code Block Highlighting Themes

> [!NOTE]
>
> For better theme adaptation, code highlighting colors are specified with theme variables, making it more complex to modify highlighting styles.

By default, uses `github` and `github-dark` as highlighting styles for light and dark modes. To change, use the following commands to generate the required styles:

```bash
# View all available styles
hugo gen chromastyles --help

# Generate common styles
hugo gen chromastyles --style=github > ./github.css
hugo gen chromastyles --style=github-dark > ./github-dark.css
```

Modify the class name colors for light and dark modes in the project's `~/assets/css/chroma.css` file.

## 📄 License

This project is open source under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Hugo](https://gohugo.io/) - Static site generator.
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework.
- [KaTeX](https://katex.org/) - Math formula rendering.
- [gumshoe](https://github.com/cferdinandi/gumshoe) - TOC scrollspy.
- [Mermaid](https://mermaid.js.org/) - Chart library.
- [Daisyui](https://daisyui.com/) - Theme color reference.
- [Hexo theme icarus](https://github.com/ppoffice/hexo-theme-icarus) - Search functionality reference.
- [iconify](https://iconify.design/) - Get icons here, thanks to all open source icon sets.
- [Augment Code](https://www.augmentcode.com/) - Programming assistant.

---

⭐ If this theme helps you, please give it a Star!