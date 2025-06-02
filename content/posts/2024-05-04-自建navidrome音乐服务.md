---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/66c4350ad9c307b7e948a5bb.webp
date: 2024-05-04 10:28:07
description: 自建音乐服务 navidrome，搭配音流软件，优化听歌体验。
slug: navidrome
summary: 自建音乐服务 navidrome，搭配音流软件，优化听歌体验。
tags:
- Docker
title: 自建navidrome音乐服务
---
## 前言
最开始用网易云音乐，但很多歌曲没了版权，后来用了 `Apple Music` 学生会员，之后一直在使用 `Spotify`，体验很好，无意发现这个开源项目，因此试着体验并记录一下。
本次所使用的项目：
- [navidrome](https://github.com/navidrome/navidrome)
- [StreamMusic](https://github.com/gitbobobo/StreamMusic)
- [spotify-downloader](https://github.com/spotDL/spotify-downloader)

## Navidrome 部署
`Navidrome` 是一开源的音乐服务器，可以在任何设备随时收听音乐，就像个人版 `Spotify`。
特点如下：
- 几乎可以传输任何可用的音频格式
- 读取并使用所有元数据
- 对合辑（各种艺术家专辑）等支持
- 多用户，每个用户都有自己的播放次数、播放列表、收藏夹等...
- 资源使用率极低
- 多平台，可在 `macOS`、`Linux` 和 `Windows` 上运行。还提供了 `Docker` 镜像。
- 适用于所有主要平台的现成二进制文件，包括 `Raspberry Pi`
- 自动监控库的更改、导入新文件并重新加载新元数据
- 基于 `Material UI` 的主题化、现代且响应式 `Web` 界面
- 与所有 `Subsonic/Madsonic/Airsonic` 客户端兼容
- 即时转码。可以为每个用户设置。支持 `Opus` 编码
- 翻译成多种语言

### Docker 部署
推荐使用 Docker 部署，`docker-compose.yaml` 文件如下：
```yaml
version: "3"
services:
  navidrome:
    image: deluan/navidrome:latest
    user: 1000:1000 # should be owner of volumes
    ports:
      - "4533:4533"
    restart: unless-stopped
    environment:
      # Optional: put your config options customization here. Examples:
      ND_SCANSCHEDULE: 1h
      ND_LOGLEVEL: info  
      ND_SESSIONTIMEOUT: 24h
      ND_BASEURL: ""
    volumes:
      - "./data:/data"
      - "./music/folder:/music:ro"
```
部署后反向代理，端口为 `4533`

## 音乐下载

### 第三方网站
可以使用各种第三方网站下载，也可以使用一些软件，比如洛雪音乐助手，这里推荐一些简单的网站

| 网站名称        | 网址                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| 歌曲宝          | [https://www.gequbao.com/](https://www.gequbao.com/)                                       |
| HiFiNi 音乐磁场 | [https://www.hifini.com/](https://www.hifini.com/)                                         |
| 音乐搜索器      | [https://music.haom.ren/](https://music.haom.ren/)                                         |
| 洛雪音乐助手    | [https://github.com/lyswhut/lx-music-desktop](https://github.com/lyswhut/lx-music-desktop) |

> 目前洛雪音乐助手已经不自带音源，可以使用六音的[自定义音源](https://www.sixyin.com/8498.html)


### Spotify 音乐下载
由于我的音乐都在 Spotify，所以寻找了下载 Spotify 歌曲的办法，首先如果音乐不多，可以使用 [SpotifyDown](https://spotifydown.com/) 在线下载，比较方便。如果列表较多，可以使用下面的工具。

spotify-downloader 是一个命令行工具，在 YouTube 匹配 Spotify 播放列表和歌曲以及专辑封面和元数据并下载。

安装和使用非常简单，前提是需要设置终端代理可以参考之前的文章：[终端设置代理](https://blog.grew.cc/posts/61ca2491.html)

```python
# 安装
pip install spotdl
# 安装 FFmpeg 到 spotdl 目录
spotdl --download-ffmpeg
```

使用方法如下：

```bash
spotdl --output "/path/to/your/directory/{title}" "spotify_playlist_url"
```

> [!TIP]
`{title}` 是一个模板变量，它会被替换为每首歌曲的标题。你可以使用其他模板变量来自定义文件名，例如 `{artist}`、`{album}` 等。
可以在 `--output` 参数的帮助信息中找到所有可用的模板变量，可以使用 `spodtl -h` 查看所有帮助信息。


## 音乐软件
音乐软件推荐使用`音流`，软件地址如下：
- [音流官网](https://music.aqzscn.cn/)

## 参考
- [spotdl](https://spotdl.readthedocs.io/en/latest)
- [navidrome](https://www.navidrome.org/docs/installation/)

