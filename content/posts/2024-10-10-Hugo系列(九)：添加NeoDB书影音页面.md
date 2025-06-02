---
categories:
- 实用教程
cover: https://img20.360buyimg.com/openfeedback/jfs/t1/271677/24/14488/28290/67edfd1cF5f59bf1f/9ee060f24024caac.webp
date: 2024-10-10 20:45:31+08:00
description: 通过 `Neodb API` 获取书影音数据，并展示在 `Hugo` 页面。 
slug: neodb-media
summary: 通过 `Neodb API` 获取书影音数据，并展示在 `Hugo` 页面。 
tags:
- Hugo
title: Hugo系列(九)：添加NeoDB书影音页面
---
通过 `Neodb API` 获取书影音数据，并展示在 `Hugo` 页面。 

<!--more-->

## 前言

之前通过 [doumark-action](https://github.com/lizheming/doumark-action) 项目获取了豆瓣观影数据，并存入博客仓库，然后展示在页面，由于豆瓣关闭了 `API`，因此获取到的封面其实是项目作者反代后的地址，然而最近图片全部挂掉，后面尝试将条目封面换成 `NeoDB` 的封面（详情见 [Hugo系列(五)：添加豆瓣观影页面](https://blog.grew.cc/posts/hugo-douban/)），但是替换会使得部署时间大幅提高，所以直接一步到位，通过 [doumark-action](https://github.com/lizheming/doumark-action) 同步到 `NeoDB`，然后使用 `GitHub Action` 下载数据，最后通过模板展示。

> [!NOTE]
> 文章参考了：[NeoDB API 创建观影页面](https://www.eallion.com/neodb/)

## 豆瓣同步数据到 NeoDB

豆瓣同步到 `NeoDB` 的方法很简单，参考 [doumark-action 文档](https://github.com/lizheming/doumark-action?tab=readme-ov-file#sync-to-neodb)。

## NeoDB 数据下载

`NeoDB` 的数据下载需要申请 `API`，详情可以参考下面的这篇文章和官方文档：
- [NeoDB 获取 Access Token](https://www.eallion.com/neodb_token/)
- [NeoDB API](https://neodb.net/api/)

申请到 `API` 后在博客仓库创建一个工作流，路径为 `~/.github/workflows/neodb.yml`

```yaml
name: Sync NeoDB Data

on:
  schedule:
    - cron: "0 17 * * *"
  workflow_dispatch:

env:
  NEODB_DATA_PATH: assets/data/neodb

jobs:
  sync_neodb:
    name: Sync NeoDB Data
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Environment
      run: |
        # 检查是否安装了 jq
        if ! command -v jq &> /dev/null; then
          echo "jq is not installed. Installing..."
          sudo apt-get update
          sudo apt-get install -y jq
        else
          echo "jq is already installed."
        fi
        # 创建数据目录
        mkdir -p ${{ env.NEODB_DATA_PATH }}

    - name: Get Local and Remote Count
      run: |
        # 获取本地 count
        if [ -f "${{ env.NEODB_DATA_PATH }}/media.json" ]; then
          LOCAL_COUNT=$(jq -r '.count // 0' ${{ env.NEODB_DATA_PATH }}/media.json)
        else
          LOCAL_COUNT=0
        fi
        echo "LOCAL_COUNT=$LOCAL_COUNT" >> $GITHUB_ENV

        # 获取远程 count
        RESPONSE=$(curl -s -X 'GET' \
          'https://neodb.social/api/me/shelf/complete?page=1' \
          -H 'accept: application/json' \
          -H "Authorization: Bearer ${{ secrets.NEODB_ACCESS_TOKEN }}")

        REMOTE_COUNT=$(echo "$RESPONSE" | jq -r '.count')
        REMOTE_PAGES=$(echo "$RESPONSE" | jq -r '.pages')

        echo "REMOTE_COUNT=$REMOTE_COUNT" >> $GITHUB_ENV
        echo "REMOTE_PAGES=$REMOTE_PAGES" >> $GITHUB_ENV

    - name: Sync NeoDB Data
      if: env.LOCAL_COUNT != env.REMOTE_COUNT
      run: |
        mkdir -p ${{ env.NEODB_DATA_PATH }}/temp_data

        for ((i=1; i<=${{ env.REMOTE_PAGES }}; i++)); do
          url="https://neodb.social/api/me/shelf/complete?page=$i"
          filename="${{ env.NEODB_DATA_PATH }}/temp_data/page$i.json"
          curl -X 'GET' "$url" \
            -H 'accept: application/json' \
            -H "Authorization: Bearer ${{ secrets.NEODB_ACCESS_TOKEN }}" > "$filename"
        done

        # 合并所有数据到一个文件
        jq -c -s '{
          data: map(.data[]) | unique | sort_by(.created_time) | reverse,
          pages: .[0].pages,
          count: .[0].count
        }' ${{ env.NEODB_DATA_PATH }}/temp_data/*.json > "${{ env.NEODB_DATA_PATH }}/media.json"

        # 清理临时文件
        rm -rf ${{ env.NEODB_DATA_PATH }}/temp_data

    - name: Git Add and Commit
      if: env.LOCAL_COUNT != env.REMOTE_COUNT
      uses: EndBug/add-and-commit@v9
      with:
        message: 'chore(data): update neodb data'
        add: '${{ env.NEODB_DATA_PATH }}'
```


然后在仓库 `settings` - `Secrets and variables` - `Actions` 下 `Repository secrets` 点击 `New repository secret`，创建一个名称为 `NEODB_ACCESS_TOKEN` 的密钥，值为获取到的 `NeoDB API`。


这个工作流会检查本地 `~/assets/data/neodb/media.json` 中条目的数量和 `NeoDB`  获取到标记为完成的数量是否一致，如果不一致，则在 `assets/data/neodb` 下载数据并保存为 `media.json`，如果一致则跳过。

> [!NOTE]
> Hugo 会在 `0.136` 版本舍弃 `get.CSV` 函数，而 `resource.Get` 获取全局数据默认路径为 `assets` 文件夹，因此上述代码中 `NEODB_DATA_PATH` 是在 `assets` 中。


## 添加书影音页面


新建 `~/layouts\_default\media.html` 并写入代码：

```html
{{- define "title" -}}
  {{- title .Title -}}
  {{- if .Site.Params.withSiteTitle }} {{ .Site.Params.titleDelimiter }} {{ .Site.Title }}{{- end -}}
{{- end -}}

{{- define "content" -}}
  {{- $title := title .Title -}}
  {{- $params := partial "function/params.html" -}}
  {{- $toc := .Scratch.Get "toc" -}}
  {{- $tocEmpty := eq .TableOfContents `<nav id="TableOfContents"></nav>` -}}
  {{/*  样式引入  */}}
  <link rel="stylesheet" href="/movie.css">
  <div class="media-page">
    <header>
      <h1>{{ .Title }}</h1>
    </header>

    <div class="media-filters">
      <span class="category-item active" data-category="all">全部</span>
      <span class="category-item" data-category="movie">电影</span>
      <span class="category-item" data-category="tv">电视剧</span>
      <span class="category-item" data-category="book">书籍</span>
      <span class="category-item" data-category="music">音乐</span>
      <span class="category-item" data-category="game">游戏</span>
      <span class="category-item" data-category="podcast">播客</span>
    </div>

    <div class="media-grid">
      {{ $mediaResource := resources.Get "data/neodb/media.json" }}
      {{ $media := $mediaResource | transform.Unmarshal }}
      {{ range $media.data }}
        {{ $title := .item.title }}
        {{ $localizedTitles := .item.localized_title }}
        {{ $orig_title := (index ($localizedTitles) 1).text }}
        {{ $category := .item.category }}
        {{ $cover := .item.cover_image_url }}
        {{ $rating := float .item.rating }}
        {{ $rating_percent := mul $rating 10 }}
        {{ $rating_count := .item.rating_count }}
        {{ $id := .item.id }}
        {{ $brief := .item.brief }}
        {{ $comment_text := .item.comment_text }}
        {{ $type := .item.type }}

        <div class="media-card m-cate-{{ $category }}">
          <div class="media-cover">
            <img class="lazyload" data-src="{{ $cover }}" alt="{{ $title }}">
          </div>
          <div class="media-overlay">
            <div class="media-overlay-content">
              <div class="media-localized-title">
                <h2 class="media-title">
                    <a href="{{ $id }}">{{ $title }}</a>
                </h2>
                <span class="media-orig-title">{{ $orig_title }}</span>
              </div>
              <div class="media-rating">
                <div class="stars">
                  <div class="star-bg"></div>
                  <div class="star-fill" style="width: {{ $rating_percent }}%"></div>
                </div>
              </div>
                <div class="media-rating-info">
                    <span class="rating-num">{{ $rating }} 分</span>
                    <span class="rating-count">{{ $rating_count }} 人点评</span>
                </div>
              </div>
              <div class="media-brief">
                {{ if $comment_text }}
                  <p>短评：{{ $comment_text }}</p>
                {{ else }}
                  <p>简介：{{ $brief }}</p>
                {{ end }}
              </div>
              <div class="media-type">
                {{ $type }}
              </div>
            </div>
          </div>
      {{ end }}
    </div>
  </div>


  {{/*  图片懒加载  */}}
  <script src='{{ "/js/lazyload.iife.min.js" | relURL }}'></script>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      new LazyLoad({
        elements_selector: ".lazyload"
      });
    });
  </script>

  {{/*  类别过滤  */}}
  <script>
    const buttons = document.querySelectorAll('.category-item');
    const cards = document.querySelectorAll('.media-card');

    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const category = event.target.dataset.category;
        buttons.forEach(btn => {
          btn.classList.remove('active');
        });
        event.target.classList.add('active');

        if (category === 'all') {
          cards.forEach(card => {
            card.classList.remove('hidden');
          });
        } else {
          cards.forEach(card => {
            if (card.classList.contains(`m-cate-${category}`)) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        }
      });
    });
  </script>
{{ end }}
```

>[!TIP]
>样式引入前的代码和最后的 `{{ end }}` 是本主题的模板，其他主题需要更换

在 `~/static` 文件夹下新建 `media.css` 文件，写入样式：

```scss
/* media.css */
.media-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.media-filters {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.category-item {
  cursor: pointer;
  margin-right: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #f3f4f6;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0.5rem;
}
.category-item:hover {
  background-color: #e2e8f0;
}

.category-item.active {
  background-color: #4b5563;
  color: #f3f4f6;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.media-card {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  background-color: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.media-card:hover {
  transform: scale(1.05) translateY(-8px); /* 悬浮时放大并上移 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* 增强悬浮时的阴影效果 */
}

/* 媒体封面 */
.media-cover {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  transition: filter 0.5s ease; /* 过渡效果应用于模糊和亮度 */
}

.media-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.5s ease; /* 添加图片模糊和亮度过渡 */
}

.media-card:hover .media-cover img {
  filter: blur(5px) brightness(75%); /* 仅对封面图片应用模糊和亮度降低 */
}


.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding: 10px;
}

.media-card:hover .media-overlay {
  opacity: 1;
}

.media-overlay-content {
  width: 100%;
}

.media-localized-title h2 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}
.media-localized-title a {
  color: #f3f4f6;
}
.media-localized-title a:hover {
  text-decoration: underline;
  color: #ff9800;
}

.media-orig-title {
  font-size: 0.875rem;
  color: #f3f4f6;
}

.stars {
  position: relative;
  display: inline-block;
  width: 80px; /* 星星的总宽度 */
  height: 16px; /* 星星的高度 */
}

.star-bg, .star-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-size: 16px 16px; /* 星星的大小 */
  background-repeat: repeat-x;
}

.star-bg {
  width: 100%;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6TTY2NC44IDU2MS42bDM2LjEgMjEwLjNMNTEyIDY3Mi43IDMyMy4xIDc3MmwzNi4xLTIxMC4zLTE1Mi44LTE0OUw0MTcuNiAzODIgNTEyIDE5MC43IDYwNi40IDM4MmwyMTEuMiAzMC43LTE1Mi44IDE0OC45eiIgZmlsbD0iI2Y5OWIwMSIvPjwvc3ZnPg==);
}

.star-fill {
  width: 100%;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6IiBmaWxsPSIjZjk5YjAxIi8+PC9zdmc+);
}

.media-rating-info span {
  font-size: 0.875rem;
  margin-top: 2px;
  background-color: #334155;
  border-radius: 3px;
  padding: 3px;
}

.media-brief p {
  font-size: 14px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.media-type {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff9800;
  color: #fff;
  padding: 5px 10px;
  border-radius: 0 0 0 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-card:hover .media-type {
  opacity: 1;
}

.hidden {
  display: none;
}

@media (max-width: 600px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px; /* 减小卡片间距 */
  }

  .media-card:hover {
    transform: scale(1.03) translateY(-4px); /* 减小悬浮效果 */
  }

  .media-overlay {
    padding: 6px; /* 减小内边距 */
  }

  .media-localized-title h2 {
    font-size: 1rem; /* 减小标题字体大小 */
  }

  .media-orig-title {
    font-size: 0.75rem; /* 减小原标题字体大小 */
  }

  .star {
    font-size: 1rem; /* 减小星星大小 */
  }

  .media-rating-info span {
    font-size: 0.75rem; /* 减小评分信息字体大小 */
    padding: 2px; /* 减小评分信息内边距 */
  }

  .media-brief p {
    font-size: 12px; /* 减小简介字体大小 */
    margin: 6px 0; /* 减小上下间距 */
    -webkit-line-clamp: 2; /* 减少显示行数 */
  }

  .media-type {
    padding: 3px 6px; /* 减小类型标签内边距 */
    font-size: 0.75rem; /* 减小类型标签字体大小 */
  }

  .category-item {
    padding: 3px 6px; /* 减小分类按钮内边距 */
    font-size: 0.75rem; /* 减小分类按钮字体大小 */
    margin-right: 6px; /* 减小分类按钮右侧间距 */
    margin-bottom: 0.3rem; /* 减小分类按钮下方间距 */
  }
}
```

最后在 `~/static/js/` 文件夹下放入 `lazyload.iife.min.js` 代码文件，可以[点击此链接下载](https://unpkg.com/vanilla-lazyload/dist/lazyload.iife.min.js)保存，上述代码中已经包括了样式文件和懒加载文件的引入。

完成后新建 `~/content/media.md` 文件，写入信息：

```markdown
---
title: 书影音记录
layout: "media"
---
```

最后在 `Hugo` 站点配置中添加菜单即可。

## 参考

- [NeoDB API 创建观影页面](https://www.eallion.com/neodb/)