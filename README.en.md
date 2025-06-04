<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/static/images/home.png"/>

# Hugo Narrow

English | [简体中文](https://github.com/tom2almighty/hugo-narrow/blob/main/README.md)

A modern, clean Hugo theme built with Tailwind CSS 4.0, featuring customizable themes.



## ✨ Features

- **Multi-theme Design** - Support for custom themes
- **Light/Dark Mode** - Auto-adapts to system theme or manual toggle
- **Responsive Design** - Perfect adaptation for desktop, tablet, and mobile devices
- **Modern UI** - Built with Tailwind CSS 4.0, clean and elegant
- **Multi-language Support** - Built-in Chinese and English
- **Enhanced Markdown** - Support for GitHub-style Markdown Alerts
- **Code Highlighting** - Based on Hugo Chroma, supports 100+ programming languages
- **Math Formulas** - KaTeX support for rendering mathematical expressions
- **Chart Support** - Mermaid charts, supporting flowcharts, sequence diagrams, etc.
- **Table of Contents** - Auto-generated article navigation
- **Multiple Comment Systems** - Support for Giscus, Disqus, Utterances, Waline, Artalk, Twikoo
- **Search Functionality** - Site-wide search
- **Multiple Analytics Platforms** - Google Analytics, Microsoft Clarity, Baidu Analytics, Umami
- **SEO Optimized** - Complete Open Graph, Twitter Card, JSON-LD support


## 🚀 Quick Start

### Prerequisites

- **Hugo Extended** >= 0.146.0
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Install Theme

#### Method 1: Git Submodule (Recommended)

```bash
# Add theme as submodule
git submodule add https://github.com/tom2almighty/hugo-narrow.git themes/hugo-narrow

# Update submodules
git submodule update --init --recursive
```

#### Method 2: Direct Download

```bash
# Download and extract theme
wget https://github.com/tom2almighty/hugo-narrow/archive/main.zip
unzip main.zip -d themes/
mv themes/hugo-narrow-main themes/hugo-narrow
```

### Install Dependencies

```bash
pnpm add -D tailwindcss @tailwindcss/cli
```

### **Start Development Server**

```bash
hugo server -D
```

### Online Deployment (Vercel)
Need to configure environment variable HUGO_VERSION = 0.146.0

## ⚙️ Configuration

### Footer & Social Icon Settings

Project icons are placed in the `~/assets/icons/` directory. Download the required icon SVGs locally and use the filename directly in Hugo configuration:

```yaml
menus:
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

### Code Block Highlighting Themes

By default, uses `github` and `github-dark` as highlighting styles for light and dark modes. To change, execute the following commands in the project root directory:

```bash
# View all available styles
hugo gen chromastyles --help

# Generate common styles
hugo gen chromastyles --style=github > assets/css/syntax/syntax-light.css
hugo gen chromastyles --style=github-dark > assets/css/syntax/syntax-dark.css
```

> Then use your IDE to add `.dark` prefix to all `.chroma` classes for dark mode.
>
> The project imports all CSS files from the `assets/css/syntax/` directory by default. It's recommended to store only the required style files in this directory.

## 📄 License

This project is open source under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Hugo](https://gohugo.io/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [KaTeX](https://katex.org/) - Math formula rendering
- [Mermaid](https://mermaid.js.org/) - Chart library

---

⭐ If this theme helps you, please give it a Star!