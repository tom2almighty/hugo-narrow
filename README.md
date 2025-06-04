<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/static/images/home.png"/>

# Hugo Narrow

简体中文 | [English](https://github.com/tom2almighty/hugo-narrow/blob/main/README.en.md)

一个现代化、简洁的 Hugo 主题，基于 Tailwind CSS 4.0 构建，支持自定义主题。


## ✨ 特性

- **多主题设计** - 支持自定义主题
- **亮色/暗色模式** - 自动适配系统主题或手动切换
- **响应式设计** - 完美适配桌面端、平板和移动设备
- **现代化 UI** - 基于 Tailwind CSS 4.0，简洁优雅

- **多语言支持** - 内置中文和英文

- **Markdown 增强** - 支持 GitHub 风格的 Markdown Alert
- **代码高亮** - 基于 Hugo Chroma，支持 100+ 编程语言
- **数学公式** - KaTeX 支持，渲染数学表达式
- **图表支持** - Mermaid 图表，支持流程图、序列图等
- **目录导航** - 自动生成文章目录

- **多评论系统** - 支持 Giscus、Disqus、Utterances、Waline、Artalk、Twikoo
- **搜索功能** - 全站搜索

- **多分析平台** - Google Analytics、Microsoft Clarity、百度统计、Umami
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

```bash
pnpm add -D tailwindcss @tailwindcss/cli
```

### **启动开发服务器**

```bash
hugo server -D
```



## ⚙️ 配置说明

### Footer & Social Icon 设置

项目 icon 放置在 `~/assets/icons/` 目录下，下载需要的图标 svg 到本地，在 Hugo 配置中直接使用文件名：

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

### 代码块高亮主题

默认使用 `github` 和 `github-dark` 作为亮色和暗色模式下的高亮样式，如需更改，在项目根目录执行如下命令：

```bash
# 查看所有可用样式
hugo gen chromastyles --help

# 生成常用样式
hugo gen chromastyles --style=github > assets/css/syntax/syntax-light.css
hugo gen chromastyles --style=github-dark > assets/css/syntax/syntax-dark.css
```

> 之后使用 IDE 为暗色模式的所有 .chroma 添加 .dark 前缀。
>
> 项目默认引入 `assets/css/syntax/` 目录下所有 css 文件，推荐此目录只存放需要的样式文件。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [Hugo](https://gohugo.io/) - 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [KaTeX](https://katex.org/) - 数学公式渲染
- [Mermaid](https://mermaid.js.org/) - 图表库

---

⭐ 如果这个主题对你有帮助，请给个 Star！
