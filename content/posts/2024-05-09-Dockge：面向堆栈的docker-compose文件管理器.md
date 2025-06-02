---
categories: 
- 效率工具
cover: https://pic.imgdb.cn/item/66c434acd9c307b7e9485128.webp
date: 2024-05-09 11:57:11
description: 自建面向堆栈的 docker-compose 文件管理器。
slug: dockge
summary: 自建面向堆栈的 docker-compose 文件管理器。
tags:
- Docker
title: Dockge：面向堆栈的docker-compose文件管理器
---
## 前言

目前习惯使用 `Docker` 自建应用，而 `compose` 更是十分方便，本次使用的 `dockge` 是一个精美的、易于使用的、响应式的面向堆栈的自托管 `docker-compose.yaml` 管理器，项目地址如下：[dockge](https://github.com/louislam/dockge)。
项目特点如下：
- 可以在面板方便的启动、编辑、更新、停止、重启、删除项目
- 交互式编辑 `compose` 文件
- 方便地进入项目终端
- 将 `docker run` 命令转换为 `compose` 文件

项目如图：

![](https://dockge.kuma.pet/screenshot.png)

## 安装

以下使用的是项目推荐的命令，命令会在 `/opt` 目录下建立 `/dockge` 和 `/stacks` 目录，其中 `/dockge` 下为 `Dockge` 映射的文件夹， `/stacks` 为 `Dockge` 创建的项目，方便管理。

```bash
mkdir -p /opt/stacks /opt/dockge
cd /opt/dockge
curl "https://dockge.kuma.pet/compose.yaml?port=5001&stacksPath=%2Fopt%2Fstacks" --output compose.yaml
docker compose up -d
# V1版本或Podman启动命令
docker-compose up -d
```

> **注意**：如果想要更改端口以及安装文件夹，可以在官网手动下载 `docker-compose` 文件，[官网](https://dockge.kuma.pet/)可以在 `UI` 修改并直接下载。

