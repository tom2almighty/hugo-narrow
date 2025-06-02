---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/65e941339f345e8d03417c14.webp
date: 2024-03-07
description: 部署自己的 ChatGPT 页面，并通过 copilot 白嫖 GPT4
slug: cogpt
summary: 部署自己的 ChatGPT 页面，并通过 copilot 白嫖 GPT4
tags:
- Docker
- AIGC
title: 部署自己的ChatGPT并白嫖GPT4的API
---
>[!WARNING]
>目前微软加大了封号力度，使用的话会直接封禁账户的 `copilot` 权限，切忌使用个人常用账户


>[!NOTE]
>作者目前的仓库已经没了， [Gitee](https://gitee.com/jiangsasa1999/CoGPT) 还有备份，但是程序只有 `arm64` 版本，这里提供一个 `amd64` 版本文件，风险自行承担：[点击下载](https://pan.grew.cc/d/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98/Files/cogpt-linux-amd64.zip?sign=lH8_USzCWgM9ljERFBhRtRSbzkz6AAtEPx7BE9Ux7nM=:0)
## 前言

`ChatGPT` 官网使用不便，并且访问速度不佳，因此部署自己的 `web` 页面，通过 `API` 使用成为了主流选择，本文通过 `ChatGPTNextWeb` 部署页面，并通过 `copilot` 项目白嫖 `GPT4` 的 `API`。
**前提：**

- `copilot` 访问权限（Github 学生包可以白嫖）
- `vercel` 账号

本文用到的项目地址如下：

- [CoGPT](https://github.com/Geniucker/CoGPT)
- [NextChat](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)

> 💡 `cogpt` 可以把 `OpenAI` `API` 格式的请求转发到 `GitHub` `Copilot` 服务端，从而免费使用 `gpt-4`。


### 警告（来自作者博客）

这个项目仅适合**个人**使用。并不适合访问量巨大的盈利项目。

最佳实践方式：

- 本机部署，仅自己使用（推荐）
- 部署在个人服务器上，仅自己使用，或和几个朋友共同使用（不公开）

不建议的方式：

- 提供公共服务
    - 在一个 `ip` 上使用了很多 `token` 容易被判定为异常行为
- 使用 `Serverless` 服务
    - 由于 `Serverless` 服务的 `ip` 不固定，所以很容易被判定为异常行为
- 用于盈利项目
    - 请求量过大，容易被判定为异常行为

> 请不要尝试上述任何一种不建议的方式，否则可能会导致 `GitHub` `Copilot` 账号，甚至 `GitHub` 账号被封禁。
> 

### 部署服务

可以部署到本地电脑，也可以部署到 `vps`，这里以 `vps` 为例。

```bash
mkdir -p /opt/cogpt && cd /opt/cogpt && vim docker-compose.yml
```

粘贴下面内容

```yaml
version: '3'

services:
  cogpt-api:
    image: geniucker/cogpt:latest
    environment:
      - HOST=0.0.0.0
    ports:
      - 8080:8080
    volumes:
      - ./db:/app/db
      - ./log:/app/log
    restart: unless-stopped
    container_name: cogpt-api
```

完成后执行 `docker-compose up -d` 启动服务。部署完成后打开对应的页面端口会出现 `Hi, it's CoGPT!` 代表服务运行成功。


> 💡 **注意：如果在 `vps` 部署，需要反向代理并配置域名，如果使用 `http` 访问 `API` ，而 `web` 页面使用 `https`，会因为不一致返回错误。**


### 获取 token

部署完成后需要获取 `token` ，在 [Release](https://github.com/Geniucker/CoGPT/releases) 页面下载对应的版本，解压压缩包，之后运行 `cogpt-get-apptoken` 文件，终端会提示打开对应的页面，填入对应的代码，这时只需要登录有 `copilot` 使用权限的 `Github` 账号授权，随后终端会返回对应的 `token`，保存 `token`，可以多生成几个轮询使用。

## 部署 ChatGPTNextWeb

这里的部署非常简单，直接使用项目的 `vercel` 一键部署，如果想随时保持更新，首先 `fork` 官方的项目，在 `vercel` 选择自己 `fork` 的仓库即可，随后在 `Actions` 页面启用 `Workflows`，并启用 `Upstream Sync Action`，启用之后即可开启每小时定时自动更新。

**部署的时候务必添加以下几个环境变量：**

```bash
CODE:yourpassword # 务必设置强密码，否则会被爆破
OPENAI_API_KEY:token1,token2,token3 # 刚刚获取的 token，可以用英文逗号分隔多个 key(此项为必须)
BASE_URL:https://cogpt.yourdomain.com # 反向代理的域名，如果不使用 https 会出现错误
```

##  参考文章

- [CoGPT 作者博客](https://blog.geniucker.top/2024/01/26/%E9%80%9A%E8%BF%87-GitHub-Copilot-%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8-gpt-4/#%E4%BD%BF%E7%94%A8)
- [CoGPT](https://github.com/Geniucker/CoGPT)
- [NextChat](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/blob/main/README_CN.md)