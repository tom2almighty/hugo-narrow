---
categories:
- 实用教程
cover: https://pic.imgdb.cn/item/66c436aed9c307b7e94acc51.webp
date: 2024-04-08 10:58:03+08:00
description: 使用Docker部署Sub-Store，全平台管理订阅。
slug: sub-store
summary: 使用Docker部署Sub-Store，全平台管理订阅。
tags:
- Docker
title: Docker部署Sub-Store后端
---
## 前言
`Sub-Store` 是一个适用于 `Loon` 、 `Surge` 和 `Quantumult X` 的高级订阅管理工具。完全本地解析，无订阅泄露的风险。相关地址及文档见下方：
-  [Github 地址](https://github.com/sub-store-org/Sub-Store)
-  [使用教程](https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46)
-  [自建教程](https://xream.notion.site/Sub-Store-Docker-8efc1aea40fa431b9a562b78994e7fb8)
## 部署
```bash
mkdir -p /opt/sub-store && cd /opt/sub-store
cat > /opt/sub-store/docker-compose.yml <<EOF
version: "3"
services:
  sub-store:
    image: xream/sub-store:http-meta
    container_name: sub-store
    restart: always
    volumes:
      - ./sub-store-data:/opt/app/data
    environment:
      - SUB_STORE_FRONTEND_BACKEND_PATH=/xxx  # 20位随机字符串  
      - SUB_STORE_BACKEND_SYNC_CRON=0 0 * * *
      - SUB_STORE_BACKEND_UPLOAD_CRON=0 1 * * *
    ports:
      - 3001:3001
EOF
docker compose up -d
```
随机字符串生成可以使用下面的网站：
- [IT 工具箱](https://www.ittools.top/token-generator?length=20)
- [1Password 密码生成](https://1password.com/zh-cn/password-generator)
## 反向代理
使用 `Nginx` 或者其他工具反向代理，端口为 `3001`，代理完成后访问的地址为：
```bash
https://你的域名?api=https://你的域名/刚刚生成20位随机字符串
```
## 更新
```bash
cd /opt/sub-store
docker compose down
docker compose pull
docker compose up -d
```
## 参考文章
- [Lala's Blog](https://blog.lalalayyds.top/archives/e6d1a885-603f-4ef9-9cf2-26c411bb619d)
- [sub-store 自建教程](https://xream.notion.site/Sub-Store-Docker-8efc1aea40fa431b9a562b78994e7fb8)