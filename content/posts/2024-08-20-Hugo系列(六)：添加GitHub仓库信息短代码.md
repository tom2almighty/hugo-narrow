---
categories: 
- 实用教程
cover: ''
date: 2024-08-20 09:44:14+08:00
description: 给 Hugo 博客添加 GitHub 仓库信息短代码。
slug: hugo-github-card
summary: 给 Hugo 博客添加 GitHub 仓库信息短代码。
tags:
- Hugo
title: Hugo系列(六)：添加GitHub仓库信息短代码
---
通过两种方式给 `Hugo` 博客添加 `GitHub` 仓库信息短代码，一种基于 ` gitHub-readme-stats `，另一种基于 `GitHub API`。
<!--more-->

## 前言
`Hexo` `Butterfly` 主题的[标签插件](https://github.com/Akilarlxh/hexo-butterfly-tag-plugins-plus)可以实现 `GitHub` 仓库信息和个人信息展示，使用的项目是 [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)，其实就是展示一张仓库信息或者个人信息的图片，类似于 `sheild.io` 的徽标。
`Hugo` 可以通过短代码方便的实现，这里就以 `PaperMod` 主题为例添加一个短代码，其他主题也通用。
另外还可以使用 `GitHub API` 来获取 `JSON` 数据，然后选择需要的信息展示。

### 方法一
#### 配置
用到的仓库如下：

- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)

新建 `~/layouts/shortcodes/ghcard.html` 文件，在其中添加模板代码：

```html
{{ $baseURL := .Site.Params.githubStatsBaseURL | default "https://github-readme-stats.vercel.app" }}
{{ $theme := .Get "theme" | default "default_repocard" }}
<div class="ghcard">
  <a href="https://github.com/{{ .Get "username"}}/{{ .Get "repo" }}" style="transition: none;background-image: none;border-bottom: none; display: block;">
    <img align="center" src="{{ $baseURL }}/api/pin/?username={{ .Get "username" }}&amp;repo={{ .Get "repo" }}&amp;theme={{ .Get "theme" }}" alt="{{ .Get "repo" }}" style="width: 100%;" />
  </a> 
</div>
<style>
  .ghcard {
    width: 100%;
    margin-bottom: 20px;
    display: inline-block;
    vertical-align: top;
  }
  @media (min-width: 769px) {
    .ghcard {
      width: calc(50% - 10px);
    }
    .ghcard:nth-child(odd) {
      margin-right: 100px;
    }
  }
</style>
```

由于默认的地址访问量大后可能会失效，因此推荐自己部署项目到 `Vercel` ，可以参考这个链接：
[自己部署](https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md#%E8%87%AA%E5%B7%B1%E9%83%A8%E7%BD%B2)

部署后在站点配置文件中添加一行配置，替换成自己的地址即可。
```toml
[params]
githubStatsBaseURL: "https://yourdomain.com"
```

#### 使用

使用的短代码如下：

```bash
{\{< ghcard username="anuraghazra" repo="github-readme-stats" >}}
{\{< ghcard username="anuraghazra" repo="github-readme-stats" theme="noctis_minimus" >}}
```

主题参数默认是 `default_repocard`，可以自己指定。


> [!IMPORTANT]
> 模板中只包含了仓库信息的短代码，还可以实现 GitHub 个人信息、 Gist 卡片、 Top Languages 卡片等 ，可以依照对应的添加短代码，使用的参数都类似，分开也方便使用。


### 方法二
#### 配置
通过 `GitHub API` 来获取数据，放入下面的代码：

```html
{{ $repo := .Get 0 }}
{{ $parts := split $repo "/" }}
{{ $owner := index $parts 0 }}
{{ $repoName := index $parts 1 }}
{{ $apiUrl := printf "https://api.github.com/repos/%s/%s" $owner $repoName }}
{{ $repoData := resources.GetRemote $apiUrl }}
{{ if $repoData.Err }}
    <p>Error: {{ $repoData.Err }}</p>
{{ else }}
    {{ $repo := $repoData.Content | unmarshal }}
    <div class="github-card">
        <div class="github-title">
            <img src="{{ $repo.owner.avatar_url }}" alt="{{ $repo.owner.login }}" class="github-title-avatar">
            <a href="{{ $repo.html_url }}" target="_blank" class="repo-name">{{ $repo.owner.login }}/{{ $repo.name }}</a>
            <svg class="github-title-svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        </div>
        <div class="github-description">
            {{ $repo.description }}
        </div>

        <div class="github-footer">
            <span class="github-footer language">
                <svg class="github-footer-svg" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" />
                </svg>
                <span class="github-footer-content">    
                    {{ $repo.language }}
                </span>
            </span>

            <span class="github-footer stars">
                <svg class="github-footer-svg" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
                <span class="github-footer-content">
                    {{ $repo.stargazers_count }}
                </span>
            </span>

            <span class="github-footer forks">
                <svg class="github-footer-svg" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-2" /><path d="M12 12l0 4" />
                </svg>
                <span class="github-footer-content">
                    {{ $repo.forks }}
                </span>
            </span>
        </div>
    </div>

    <style>
        .github-card {
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 15px;
            color: #24292e;
            background-color: #fff;
            max-width: 400px;
            margin-top: 1rem;
            margin-bottom: 1rem;
            body.dark & {
                border-color: #30363d;
                background-color: #0d1117;
                color: #c9d1d9;
            }
        }
        .github-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .github-title-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .post-content .github-title a {
            color: inherit;
            text-decoration: none;
            box-shadow: none;
            &:hover {
                background: none;
                text-decoration: underline;
            }
            body.dark & {
                color: #c9d1d9;
            }
        }
        .repo-name {
            font-weight: 600;
            flex-grow: 1;
            margin-left: 8px;
        }
        .github-icon {
            fill: #24292e;
        }
        .github-description {
            margin-bottom: 16px;
        }
        .github-footer {
            display: flex;
            justify-content: space-between;
            color: #586069;
            align-items: center;
            body.dark & {
                color: #8b949e;
            }
        }
        .github-footer-content {
            margin-left: 4px;
        }
        .github-title-svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
    </style>
{{ end }}
```

#### 使用
```bash
{\{< github "gohugoio/hugo" >}\}
```

## 参考
- [hexo-butterfly-tag-plugins-plus](https://github.com/Akilarlxh/hexo-butterfly-tag-plugins-plus)
- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)