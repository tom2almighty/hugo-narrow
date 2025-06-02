---
categories: 
- 效率工具
cover: https://pic.imgdb.cn/item/65dc436d9f345e8d0301ccba.webp
date: 2022-07-22
description: 自建 Bitwarden 密码管理服务，隐私掌握在自己手中。
slug: bitwarden
summary: 自建 Bitwarden 密码管理服务，隐私掌握在自己手中。
tags:
- Docker
title: 宝塔面板部署Bitwarden密码管理
---
## 前言

随着网站和程序注册增多，应用密码也难以记住，适用同一个密码存在风险，因此推荐使用密码管理软件，安全且方便，唯一的缺点可能是在别人设备登录，如果密码不能粘贴，输入会比较麻烦。这里推荐使用 `Bitwarden` 来进行管理，各个平台都有对应的客户端。
[Bitwarden](https://bitwarden.com/) 是一款免费开源的密码管理软件，同时官方提供了 `docker` 镜像，将服务端部署在自己的设备上。`Bitwarden` 官方 `docker` 要求服务器内存在 `2G` 以上，但有大佬使用 `Rust` 进行重写，项目名为 `vaultwarden`, 降低了配置要求,地址如下：[vaultwarden](https://github.com/dani-garcia/vaultwarden)。

> 如果不是特别担心密码安全，还是建议使用官方服务端，自建和官方并没有什么差别。

## 安装
### 方法一：宝塔面板配合 `Docker` 部署

首先安装好`宝塔面板`并配置好环境，这里采用的是`LNMP`，`PHP` 版本`7.4`，同时创建一个站点，不需要数据库。在软件商店第 `3` 页 找到 `Docker 管理器`并安装。

打开 `Docker 管理器`，点击 `镜像管理`，再点击 `获取镜像`，如果是国内机器可以使用镜像加速：

```bash
<https://docker.mirrors.ustc.edu.cn/>
# 也可自行寻找其他地址
```

然后将以下镜像名称填入输入框：`vaultwarden/server`，之后点击 `获取镜像`。

![https://pic.imgdb.cn/item/6321598d16f2c2beb17953c4.png](https://pic.imgdb.cn/item/6321598d16f2c2beb17953c4.png)

点击`容器列表`→`创建容器`，弹出创建容器界面后按如下填写四部分内容，并修改容器名称：

![https://pic.imgdb.cn/item/63215a0416f2c2beb179d02c.png](https://pic.imgdb.cn/item/63215a0416f2c2beb179d02c.png)

- 容器端口为`80`
- 服务器(TCP)端口可以自定义，这里使用`6789`
- 服务器目录自定义，这里使用站点目录
- 容器目录填写`/data`
- 内存配额按照自己服务器配置填写

> 端口映射和目录映射填写完成记得点击 + 添加，否则无效

接下来在面板网站设置中的站点设置添加反向代理：
![https://pic.imgdb.cn/item/63215a3816f2c2beb17a0383.png](https://pic.imgdb.cn/item/63215a3816f2c2beb17a0383.png)

`目标 URL` 填写 `http://127.0.0.1:6789`，端口即为上边服务器的端口，之后点击提交。

### 方法二：Docker CLI

**上述步骤也可直接使用命令安装（前提已安装 `docker`）**

```bash
# 安装 vaultwarden/拉取镜像
docker pull vaultwarden/server:latest
# 创建容器 (domain.com 换成自己的网站目录)
docker run -d --name vaultwarden -v /www/wwwroot/domain.com/:/data/ -p 6789:80 vaultwarden/server:latest
# 上述命令中：
# -v 参数后格式为<主机目录:容器目录>
# -p 参数后格式为<主机端口:容器端口>
# --name 后为容器名称
```

如果需要更新，直接拉取最新镜像，停止并删除旧容器，创建新容器

```bash
# 拉取最新镜像
docker pull vaultwarden/server:latest
# 停止旧容器
docker stop vaultwarden
# 删除旧容器
docker rm vaultwarden
# 创建新容器
docker run -d --name vaultwarden -v /www/wwwroot/domain.com/:/data/ -p 6789:80 vaultwarden/server:latest
```

### 方法三：`Docker Compose` 安装

直接使用 `Docker-compose` 部署，运行下面的命令，然后配置反向代理即可，安装、更新都比较方便。

```bash
mkdir -p /opt/bitwarden && cd /opt/bitwarden
cat > /opt/bitwarden/docker-compose.yml <<EOF
version: '3.9'
services:
    server:
        image: 'vaultwarden/server:latest'
        container_name: vaultwarden
        restart: always
        ports:
            - '6789:80'
        volumes:
            - ./vw_data:/data
        environment:
        	- DOMAIN: "https://domain.com" # 使用反向代理必填
            - SIGNUPS_ALLOWED=true # 注册后改为 false 则可以防止别人注册
        
EOF
docker compose up -d
```

反向代理可以使用 `Nginx Proxy Manager`

## 使用
### 注册账号

通过反向代理的域名访问服务，点击创建账号，填写相应信息即可创建管理员账号。

在官网下载相应的客户端以及浏览器插件

[客户端点此下载](https://bitwarden.com/download)

使用前需在设置页面填写自定义服务地址：

![https://pic.imgdb.cn/item/62da0fe6f54cd3f93710d35e.jpg](https://pic.imgdb.cn/item/62da0fe6f54cd3f93710d35e.jpg)

### 关闭注册

如果不希望别人注册账号可以自己注册账号后在管理器中先`停止容器`，再`删除容器`，然后重新创建一个不开启注册功能的容器，已注册的账户及数据仍然存在，然后运行如下命令再次创建容器，并重启容器。

**一定先停止再删除**

```bash
docker run -d --name vaultwarden -e SIGNUPS_ALLOWED=false -v /www/wwwroot/domain.com/:/data/ -p 6789:80 vaultwarden/server:latest
# 停止及重启容器
docker stop vaultwarden
docker start vaultwarden
```

`docker-compose` 将 `yaml` 文件 `environment` 中改为 `SIGNUPS_ALLOWED=false`，再次运行 `docker compose up -d` 即可。