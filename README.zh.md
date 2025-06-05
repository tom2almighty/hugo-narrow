<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/images/home.png"/>

# Hugo Narrow

简体中文 | [English](https://github.com/tom2almighty/hugo-narrow/blob/main/README.md)

一个现代化、简洁的 Hugo 主题，基于 Tailwind CSS 4.0 构建，支持自定义主题。


## ✨ 特性

- **多主题设计** - 内置多种主题，支持自定义主题
- **亮色/暗色模式** - 自动适配系统主题或手动切换，所有主题均支持暗色模式
- **响应式设计** - 完美适配桌面端、平板和移动设备
- **多语言支持** - 多种语言支持。
- **Markdown 增强** - 支持 GitHub 风格的 Markdown Alert，适配 Obsidian 折叠（+/-） Alert
- **代码块增强** - 代码块一键复制、语言显示、代码框折叠
- **数学公式** - KaTeX 支持
- **图表支持** - Mermaid 图表，支持流程图、序列图等
- **目录导航** - 目录支持高亮、滚动监听
- **多评论系统** - 支持 Giscus、Disqus、Utterances、Waline、Artalk、Twikoo
- **搜索功能** - 支持全站搜索
- **用户体验良好** - 底部 dock 包含常见功能：返回上一层、一键跳转顶部或评论区、查看目录、全站搜索
- **多分析平台** - 支持 Google Analytics、Microsoft Clarity、Baidu Analytics、Umami
- **SEO 优化** - 完整的 Open Graph、Twitter Card、JSON-LD 支持


## 🚀 快速开始

### 前置要求

- **Hugo Extended** >= 0.146.0
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### 安装主题

#### 方法一：Git Submodule（推荐）

```bash
# 添加主题作为子模块
git submodule add https://github.com/tom2almighty/hugo-narrow.git themes/hugo-narrow

# 更新子模块
git submodule update --init --recursive
```

#### 方法二：直接下载

```bash
# 下载并解压主题
wget https://github.com/tom2almighty/hugo-narrow/archive/main.zip
unzip main.zip -d themes/
mv themes/hugo-narrow-main themes/hugo-narrow
```

### 安装依赖

> [!NOTE]
> 由于使用了 Hugo 内置的 css.tailwind 函数，因此本地预览需要安装 tailwindcss 和 @tailwindcss/cli。

```bash
pnpm install
```

### 本地预览

```bash
hugo server -D
```
### 在线部署(Vercel)

需配置环境变量：`HUGO_VERSION=0.146.0`

## ⚙️ 配置说明

`hugo.yaml` 文件中包含了完整的配置，下面是配置站点可能用到的信息：

### 菜单栏设置

顶部导航栏、底部 Footer、个人信息卡片、底部社交链接都可使用 icon，项目 icon 放置在 `~/assets/icons/` 目录下，下载需要的图标 SVG 到本地，在 Hugo 配置中直接使用文件名：

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
> 上述配置中 `name:nav.posts` 值是使用了 i18n配置，你可以随意更换名称。


### 文章头信息

`frontmatter` 中有如下自定义字段，非必须：

| 名称        | 参数       | 含义                                                         |
| ----------- | ---------- | ------------------------------------------------------------ |
| cover       | image path | 文章头图，支持本地路径（相对于`static` 目录）或 URL 不设置自动生成 |
| katex       | bool       | katex 支持开关，可在此字段下设置分隔符，同 hugo 配置         |
| mermaid     | bool       | mermaid 支持开关                                             |
| comments    | bool       | 评论功能开关                                                 |
| showLicense | bool       | 版权信息开关，可设置具体版权信息，同 hugo 配置               |
| showRelated | bool       | 相关文章开关                                                 |

## 🎨 自定义主题

### 站点主题

你可以在 `~assets/css/theme.css` 或 `~/assets/css/custom.css` 中添加你想要的主题，主题变量需包含 light 和 dark 下的样式：

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

完成后在 `hugo.yaml` 中配置前端切换选项和切换顺序：

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

### 代码块高亮主题

> [!NOTE]
>
> 为更好的适配主题，代码高亮颜色指定了主题变量，因此修改高亮样式较为繁琐。

默认使用 `github` 和 `github-dark` 作为亮色和暗色模式下的高亮样式，如需更改，可使用命令生成需要的样式：

```bash
# 查看所有可用样式
hugo gen chromastyles --help

# 生成常用样式
hugo gen chromastyles --style=github > ./github.css
hugo gen chromastyles --style=github-dark > ./github-dark.css
```

在项目 `~/assets/css/chroma.css` 文件中修改亮色和暗色模式下的类名颜色。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Hugo](https://gohugo.io/) - 静态站点生成器。
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架。
- [KaTeX](https://katex.org/) - 数学公式渲染。
- [Mermaid](https://mermaid.js.org/) - 图表库。
- [Daisyui](https://daisyui.com/) - 主题颜色参考。
- [Hexo theme icarus](https://github.com/ppoffice/hexo-theme-icarus) - 搜索功能参考。
- [iconify](https://iconify.design/) - 在此处获取图标，感谢所有开源图标集。
- [Augment Code](https://www.augmentcode.com/) - 编程助手。

---

⭐ 如果这个主题对你有帮助，请给个 Star！
