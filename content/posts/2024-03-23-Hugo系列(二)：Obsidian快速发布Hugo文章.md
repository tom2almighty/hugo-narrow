---
categories: 
- 实用教程
cover: https://r2.grew.cc/2024/07/67bf37b865eb80925e38e747c0e355a5.webp
date: 2024-03-23 13:13:25+08:00
description: 使用 `Obsidian` 配合 `Shell commands` 插件快速创建文章并预览发布
lastmod: 2024-03-23 13:13:25+08:00
slug: obsidian-hugo
summary: 使用 `Obsidian` 配合 `Shell commands` 插件快速创建文章并预览发布
tags:
- Hugo
- Obsidian
title: Hugo系列(二)：Obsidian快速发布Hugo文章
---
## 前言

 通常使用静态博客写文章比较麻烦，上传图片也不方便，最近发现使用 `Obsidian` 配合 `Shell commands` 插件可以快速创建文章并预览发布，配合 `Image auto upload Plugin` 还可以快捷上传图片到图床。
需要用到的工具：
- `Obsidian`
- `Picgo` 或者 `Piclist` 软件
## 快捷发布文章
首先下载好 `Obsidian` 并且开启第三方插件，在插件市场下载三个插件：
- `Image auto upload Plugin`
- `Shell commands`
- `Commander`

然后在博客文章所在目录打开项目，即可看到所有博客文章。接下来通过 `Shell commands` 插件配置文章新建、预览、发布。

> [!NOTE]
> 原理很简单，就是通过插件调用 `CMD` 程序，使用命令新建发布文章，然后通过 `Commander` 将命令绑定到  `Obsidian ` 左侧快捷键，这样只需要点击对应的按钮即可快速运行命令。

### 创建命令

> [!TIP]
详细步骤以 `新建文章` 命令为参考，其余命令步骤相同。


#### 设置工作目录
首先进入插件设置页面，选择 `Environments` 选项卡，在 `Working Directiory` 处输入自己博客的根目录。
#### 新建命令
首先打开 `Shell commands` 插件设置，点击 `New shell command`，新建一个命令，输入命令 `hugo new posts/{{date:YYYY-MM-DD}}-{{_post_title}}.md`

> [!TIP]
> 这里新建文章的命令我添加了日期，这样方便文章排序，如果设置了日期添加，`Hugo` 模板中的 `title` 最好通过正则来设置从第几个字符开始，参考如下：
> ```bash
> title: ' {{ substr .File.ContentBaseName 11 | replaceRE "-" " " | title }} '
> ```

#### 设置别名
点击齿轮图标可以进入命令设置页面，在 `Alias` 处输入命名别名，输入 `新建文章 ` ，可以自定义。
#### 选择 `Preactions`
1. 在 `Preactions` 界面 `Prompt` 选项选择 ` Create a new prompt ` ，`Prompt title` 写 `新建文章` 
2. 点击 `New prompt field`，`Field lable` 设置为 `请输入文章标题：`，这个是文章运行前的提示
3. 然后 `target value` 处选择 `create a new custom variable`，在 `Variable name` 处填写 `post_title` ，点击创建，最终值应该为为 `{{_post_title}}`，完成后点击创建，效果参考下图。

   ![Uploading file...5sar2](https://r2.grew.cc/2024/07/7fc107a56ef839a4de59e8d6667a255d.webp)

4. 接着在 `Preaction` 页面选择新创建的 `Prompt` 即可。

按照同样的步骤再创建预览文章、发布文章、停止 `Hugo` 进程几个命令。其中发布文章还需要创建新的 `Prompt` ，预览文章和停止进程仅需要输入命令即可。具体的命令和参数如下：

```bash
# 新建文章命令
hugo new posts/{{date:YYYY-MM-DD}}-{{_post_title}}.md
# 新建文章 Prompt Variable 注意输入时仅需要输入 `post_title`
{{_post_title}}
# 文章预览命令
hugo server --gc -p 1313 & start chrome http://localhost:1313
# 发布文章命令
git add . & git commit -m "{{_comment}}" & git push -u origin main
# 发布文章 Prompt Variable 注意输入时仅需要输入 `comment`
{{_comment}}
# 停止 Hugo 进程命令
taskkill /f /t /im hugo.exe
```

**注意：** 停止进程命令需要在命令设置页面的 `Events` 选项卡下将 `Obsidian quits` 打勾，即退出应用时执行。

> 如果使用的是 Mac 那么命令连接符需要使用 `&&`，如果使用 `Windows` 的 `Powershell` ，命令连接符需要使用 `;`。

### 绑定左侧菜单
这一部分很简单，只需要打开 `commander` 插件设置，将命令绑定到自己想要的位置即可，这里以左侧菜单为例。

![](https://r2.grew.cc/2024/07/b54068650b8925cdf80686e4fe0ee0c4.webp)


## 快捷上传图片

下载 `Image auto upload Plugin` 插件后，打开剪贴板上传，上传模式可以选择核心模式或者应用模式，应用模式需要打开应用才能正常上传，核心模式则需要输入 `.exe` 程序的路径，自行选择即可，图床的设置可以参考另一篇文章：[Typora 配合 Piclist 快速上传图片并加速 ](https://blog.grew.cc/article/typora)

## 参考
- [Hugo 发布流程](https://yelleis.top/p/38f84bb0/)