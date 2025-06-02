---
categories: 
- 效率工具
cover: https://pic.imgdb.cn/item/66c43486d9c307b7e9482eb0.webp
date: 2024-05-09 12:14:50
description: 简洁美观的反向代理面板，快速反向代理并申请证书。
slug: npm
summary: 简洁美观的反向代理面板，快速反向代理并申请证书。
tags:
- Docker
title: Nginx Proxy Manager：替代宝塔的又一选择
---
## 前言
由于低版本的宝塔面板存在漏洞，高版本需要绑定手机，且占用较高，加上自己的服务大多是 `Docker` 部署，因此直接使用反向代理的面板更加方便。
`Nginx Proxy Manager` 是一个 `Nginx` 的代理管理器，简单方便，并且支持一键申请证书、自动续期。
项目地址如下：[nginx-proxy-manager](https://github.com/NginxProxyManager/nginx-proxy-manager)
## 部署
使用 `Docker` 部署，命令如下：
```bash
mkdir /opt/npm && cd /opt/npm && cat << EOF > docker-compose.yml
version: '3.8'
services:
  app:
    image: 'docker.io/jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF
docker compose up -d
```
安装完成后可以使用 `http://IP:81` 访问后台，默认的用户名密码如下：

```bash
Email:    admin@example.com
Password: changeme
```

## 反向代理
### 添加网站
主界面点击 `Proxy Host`- `Add Proxy Host`
![proxy-host](https://nginxproxymanager.com/screenshots/proxy-hosts-add.png)


三个选项可以自己选择是否开启
- `Cache Assets`: 缓存
- `Block Common Exploits`: 屏蔽常见漏洞
- `Websockets Support`: `Websockets` 支持


`Forward Hostname / IP` 处填写反向代理的网站，如果服务部署在本机，可以使用如下命令获取 `docker` 的网络接口的 `IP`，一般为 `172.17.0.1`
```bash
ip addr show docker0
```
### 申请证书
依次点击 `SSL Certificates`-`Add SSL Cerfificate`-`Let's Encrypt`，填写域名，点击 `Use a DNS Challenge` 填写对应域名商的 `API`
![ssl](https://image.dooo.ng/c/2024/05/09/663c5ae445503.webp)
以 `Cloudflare`为例，申请一个自定义令牌，依次点击`创建令牌`-`编辑区域DNS`-`使用模板`，区域资源处选择对应的资源，可以选定所有区域，然后选择账号，最后点击`继续以显示摘要`-`创建令牌`，完成后只显示一次，注意保存。
![](https://image.dooo.ng/c/2024/05/09/663c5bd77a2d6.webp)
将创建的令牌填写到对应的位置
```bash
dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567
```
完成后反向代理的网站就可以在 `SSL` 选项卡选择对应的证书。

## 添加静态网站
1. 在 `/data` 下建立对应的网站路径
2. 将静态文件保存到里面
3. 添加反向代理，代理的地址填写服务器地址
4. 在 Advanced 设置中添加下面的设置，将其中的 `domain.com` 换成自己的域名即可
```nginx
location / {
  root /data/domain.com;
}
```

## 参考
- [如何在 Nginx Proxy Manager（NPM）上部署静态网站](https://blog.laoda.de/archives/host-static-sites-on-npm)
