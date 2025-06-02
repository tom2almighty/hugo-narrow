---
categories: 
- 实用教程
date: 2024-03-21
description: Webstack-Hugo导航部署及问题解决。
slug: webstack-hugo
summary: Webstack-Hugo导航部署及问题解决。
tags:
- Hugo
title: Webstack Hugo导航
---
## 前言

`Webstack-Hugo` 导航是基于纯静态的网址导航网站 [webstack.cc](https://github.com/WebStackPage/WebStackPage.github.io) 制作的 [Hugo](https://gohugo.io/) 主题，是一个基于 `Hugo` 的静态响应式网址导航主题。添加了天气及夜间模式，主要的配置信息都集成到了 `config.toml`，导航的各个信息都集成在 `data/webstack.yml` 文件中。

## 部署

1. 首先下载 `Hugo` 到本地，同时添加系统环境变量。找到一个文件夹，然后在文件夹下打开 `Windows Terminal` 创建一个新的 `Hugo` 站点。

```powershell
hugo new site webstack-hugo
```

2. 下载 `Webstack-Hugo` 源码，并解压到 `~/webstack-hugo/themes` 文件夹下，名称更改为 `Webstack-Hugo`，将 `~/webstack-hugo/themes/Webstack-Hugo/exampleSite` 文件夹下所有内容复制到 `Hugo` 站点根目录，并删除站点根目录的 `hugo.toml` 文件。
3. 修改网站配置。
   - 配置信息在 `config.toml` 文件中
   - 导航信息在 `data/webstack.yml` 文件中
4. 新建一个 `Github` 仓库，将 `Hugo` 站点根目录下的文件推送到仓库，然后在 `Vercel` 创建新的项目并导入仓库。

## 网站 icon 获取

可以通过 API 获取网站的图标，地址如下：

```bash
https://api.iowen.cn/favicon/www.iowen.cn.png
```

将需要获取的网址替换到 `favicon/` 后 `.png` 前，也可以通过在线工具箱：

```bash
https://tool.cccyun.cc/favicon
```

## 问题修复

部署好站点后会发现网站样式无法正常加载，但是本地部署正常，解决方法：将 `layouts/partials` 文件夹下文件中 `relURL` 更换为 `absURL` 即可。

> [!NOTE]
> 在 `Hugo` 的模板中，`relURL` 用于将给定的路径转换为相对于网站根目录的 `URL`。如果你的 `Hugo` 网站部署在 `https://example.com/blog/`，则 `{{ "css/styles.css" | relURL }}` 将被渲染为 `/blog/css/styles.css`。
>
> 然而，如果你的 `Hugo` 网站部署在域名的根目录（如 `https://example.com/`），则 `relURL` 可能会导致问题，因为它会在路径的开始处添加一个额外的 `/`。因此删除所有的 `relURL` 调用可以解决样式不显示的问题。
>
> 另外，`GitHub Pages` 和 `Cloudflare Pages` 在处理静态资源路径时可能有所不同。`GitHub Pages` 默认将项目部署在子路径（如 `https://username.github.io/repo/`），而 `Cloudflare Pages` 可能将项目部署在域名的根目录。因此，如果 Hugo 模板使用了 `relURL`，则可能在 `GitHub Pages` 上出现问题，但在 `Cloudflare Pages` 上正常。

## 去掉网格背景

如果不喜欢网格背景可以更改下面两个文件内代码解决：

修改 `assets/css/custom-style.css` 文件内 `109` 行也就是倒数第二行代码的背景颜色代码：

```diff
- background-color: #d8d8d8;
+ background-color: #f9f9f9;
```
修改 `layouts/partials/content_header.html` 文件内第一行代码：

```diff
- <div class="main-content flex-fill grid-bg">
+ <div class="main-content flex-fill">
```

## 参考

- [页面样式和路径问题](https://github.com/shenweiyan/WebStack-Hugo/issues/24)
- [Yelle 博客](https://yelleis.top/p/13cf63f4/)
