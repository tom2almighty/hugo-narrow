---
categories:
- 效率工具
cover: 
date: 2024-09-07 11:29:03+08:00
description: 使用 Watchtower 自动更新 Docker 容器。
slug: watchtower
tags:
- Docker
title: 使用Watchtower更新Docker项目
---
使用 Watchtower 自动更新 Docker 容器。
<!--more-->
## 前言
部署的容器多了之后更新比较麻烦，发现可以使用 `Watchtower` 自动更新项目，十分方便，适合一般的容器，那些使用脚本更新的项目就不适用了。

参考 [P3TERX 大佬的文章](https://p3terx.com/archives/docker-watchtower.html)，记录一下用到的配置。

## 部署

我这里使用的是 `docker-compose`，配置如下：

```yaml
version: "3.3"
services:
  watchtower:
    container_name: watchtower
    image: containrrr/watchtower
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_RESTARTING=true
      - WATCHTOWER_SCHEDULE=0 0 4 * * *
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    # command: nginx redis 
networks: {}
```

>[!TIP]
>  默认是更新所有容器，如果需要选择更新的容器，在 `command` 后面添加需要更新的容器名称。



## 参考
- [Watchtower - 自动更新 Docker 镜像与容器](https://p3terx.com/archives/docker-watchtower.html)
- [watchtower docker-compose 的正确写法](https://sleele.com/2020/04/01/watchtower-docker-compose-%e7%9a%84%e6%ad%a3%e7%a1%ae%e5%86%99%e6%b3%95/)