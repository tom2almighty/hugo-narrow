---
categories: 
- 实用教程
date: 2024-08-08
description: Windows 下安装 Jekyll 环境，将博客部署到 Vercel。
slug: jekyll
summary: Windows 下安装 Jekyll 环境，将博客部署到 Vercel。
tags:
- Jekyll
title: 2024年Windows下安装Jekyll环境并部署到Vercel
---
## 前言

`Hexo` 的博客虽然外观精美，主题和插件都比较多，但实在是太复杂，更换主题或者更新插件都容易出现错误，所以决定将博客更换为其他框架，最开始决定使用 `Hugo`，毕竟之前使用过，文档齐全并且速度也够快，但是想用的 `Stack` 主题没有返回顶部按钮，一些细节不喜欢，文章 `Feature` 图还得重新做，所以决定使用 `Jekyll Chirpy`，也图个新鲜。

## 基础环境安装

1. 首先根据官网教程安装基础环境，就像 `Hugo` 下载可执行文件一样，链接在此：[RubyInstaller](https://rubyinstaller.org/downloads/)

2. 下载后使用默认设置安装即可，完成后在终端输入 `ruby -v` 和 `gem -v`，出现版本号就代表环境安装成功了。
3. 接下来安装 `Jekyll`，终端输入 `gem install jekyll`，等待安装完成。
4. 输入 `jekyll -v` 检查是否安装成功。

## 新建站点

这里直接使用的是 [Chirpy](https://github.com/cotes2020) 主题的方法，文档链接：[点此](https://chirpy.cotes.page/posts/getting-started/)

首先使用 `chirpy-starter` 的模板新建一个仓库，我不使用 `GitHub Pages` 所以仓库名称就随便填写了。

将仓库拉到本地，然后在仓库跟目录执行下面的命令安装依赖：

```bash
bundle
```

然后可以使用命令预览一下是否成功：

```bash
bundle exec jekyll s
```

## 修改配置

在 `_config.yml` 中修改对应的配置，社交媒体配置对应的文件为 `_data/contact.yml`

### **依赖错误：`tzinfo`**

`Windows` 下部署时，使用 `bundle` 安装依赖后不会安装 `tzinfo`，如果设置了时区，会报错，因此手动安装下面两个依赖：

```ruby
gem install tzinfo
gem install tzinfo-data
```

然后在 `Gemfile` 文件中添加下面两行：

```ruby
gem 'tzinfo'
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```

### 修改 favicon

在 `~/assets/img` 下新建 `favicons` 文件夹，放入自己的 `favicons` 文件，可以在 [favicon.io](https://favicon.io/)

创建自己的图标，下载解压后将所有文件放入对应文件夹，删除下面两个文件：

```bash
about.txt
site.webmanifest
```

## 新建文章

文章的 `Front Matter` 信息如下,详细的设置可以参考 [Jekyll](https://jekyllrb.com/docs/front-matter/)

```yaml
---
title: TITLE
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [TOP_CATEGORIE, SUB_CATEGORIE]
tags: [TAG]     # TAG names should always be lowercase
permalink: 
---
```

新建文章需要将其命名为 `YYYY-MM-DD-TITLE.md` 或 `YYYY-MM-DD-TITLE.markdown` 格式，如果想方便地新建，可以使用插件 [Jekyll-Compose](https://github.com/jekyll/jekyll-compose)

在 `Gemfile` 文件添加一行内容：

```ruby
gem 'jekyll-compose', group: [:jekyll_plugins]
```

然后执行：

```ruby
bundle
```

输入 `bundle exec jekyll help `可以查看帮助，一些常用命令：

```bash
  draft      # Creates a new draft post with the given NAME
  post       # Creates a new post with the given NAME
  publish    # Moves a draft into the _posts directory and sets the date
  unpublish  # Moves a post back into the _drafts directory
  page       # Creates a new page with the given NAME
  rename     # Moves a draft to a given NAME and sets the title
  compose    # Creates a new file with the given NAME
```

> 这些是二级命令，具体的命令格式为 `jekyll post 第一篇博客` ，这样就会在 `_post/` 文件夹下新建一个名为 `第一篇博客.md` 的文件。

如果想自定义 `Front Matter`，可以在 `_config.yml` 中添加配置：

```yaml
jekyll_compose:
  default_front_matter:
    drafts:
      description:
      image:
      category:
      tags:
      permalink:
    posts:
      description:
      image:
      category:
      tags:
      permalink:
```

这个配置同样会添加 `time` 和 `title` 行，具体可以自己设置。

## 迁移文章

`Jekyll` 要求文章名字中要有日期，但是 `Hexo` 和 `Hugo` 不要求，这给迁移造成了一定的困难，因此使用 `Python` 将 `.md` 文件重命名，选择 `Front Matter` 信息中 `date` 值前 10 个字符和 `title` 值作为新的名字，并将二者用 `-` 拼接，下面是代码：

```python 
import os
import re
import yaml

def extract_frontmatter(content):
    """从文件内容中提取 YAML frontmatter"""
    match = re.search(r'(?s)^---.*?---', content)
    if match:
        frontmatter_str = match.group()
        return yaml.safe_load(frontmatter_str[3:-3])
    return {}

def rename_files_based_on_frontmatter(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf8') as f:
                    content = f.read()
                
                frontmatter = extract_frontmatter(content)
                
                # 提取 date 和 title 字段
                date = str(frontmatter.get('date', ''))  # 确保 date 是字符串
                title = str(frontmatter.get('title', 'untitled')).replace('/', '-').replace('\\', '-')
                
                # 处理 date 字段
                date = date.replace(':', '-')[:10]  # 用 - 替换 : 并截取前 10 个字符
                
                if date and title:
                    new_file_name = f"{date}-{title}.md"
                    new_file_path = os.path.join(root, new_file_name)
                    
                    if file_path != new_file_path:
                        os.rename(file_path, new_file_path)
                        print(f"Renamed: {file_path} -> {new_file_path}")
                else:
                    print(f"Skipping file {file_path}: Invalid date or title")

# 修改文件夹路径
folder_path = r"D:\GitHub\hexo-blog\source\_posts"
rename_files_based_on_frontmatter(folder_path)
```

而文件中 `Front Matter` 的 `Name` 的修改可以参考之前的文章：[Hugo 文章转 Hexo](https://blog.grew.cc/posts/993cff99/)

## 部署网站

接下来可以将站点部署到 `Vercel`，直接新建项目导入仓库即可完成部署。

## 总结

虽然 `Jekyll` 相比 `Hexo` 依赖的耦合低一点，但是仍比不上 `Hugo` 只需要安装一个二进制文件简单，建议用 `Hugo`。

> Jekyll 会把部分代码块内的代码解析，导致出现问题，所以放弃使用。

## 卸载

```bash
gem install jekyll
```
完成后软件里卸载 `Ruby` 即可


## 参考

- [Dependency Error: tzinfo](https://thegeekcat.github.io/blogging/tzinfoError/)

- [Install of Jekyll 3.4.1 gem does not install tzinfo](https://github.com/jekyll/jekyll/issues/5935)