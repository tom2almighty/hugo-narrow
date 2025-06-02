---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/65dc49059f345e8d03107123.webp
date: 2024-03-03
description: 自建 DNS 解锁服务，将全部 VPS 解锁 Netflix。
slug: netfli-dns
summary: 自建 DNS 解锁服务，将全部 VPS 解锁 Netflix。
tags:
- Netflix
- DNS
title: 自建DNS解锁Netflix
---
 通过 `DNSmasq` 和一台已解锁 `Netflix` 的服务器，将其余服务器全部解锁 `Netflix` 。

<!--more-->

> [!NOTE]
> 使用 [Dnsmasq](http://thekelleys.org.uk/dnsmasq/doc.html) 的DNS将网站解析劫持到 [SNIproxy](https://github.com/dlundquist/sniproxy) 反向代理的页面上。


> [!TIP]
> 脚本默认解锁 `Netflix Hulu HBO` 等，如需增减域名，请编辑下面文件：
> `/etc/dnsmasq.d/custom_netflix.conf`
> `/etc/sniproxy.conf`


**项目地址：**[Github](https://github.com/myxuchangbin/dnsmasq_sniproxy_install)

## 安装

**前提需求：**

- 一台解锁 `Netflix` 的服务器
- 放行 `53`、`80`、`443`端口

快速安装：

```bash
wget --no-check-certificate -O dnsmasq_sniproxy.sh https://raw.githubusercontent.com/myxuchangbin/dnsmasq_sniproxy_install/master/dnsmasq_sniproxy.sh && bash dnsmasq_sniproxy.sh -f
```
卸载：

```bash
wget --no-check-certificate -O dnsmasq_sniproxy.sh https://raw.githubusercontent.com/myxuchangbin/dnsmasq_sniproxy_install/master/dnsmasq_sniproxy.sh && bash dnsmasq_sniproxy.sh -u
```

## systemd-resolve 服务占用 53 端口解决方法

```bash
systemctl stop systemd-resolved
vim /etc/systemd/resolved.conf
```

按照下面说明修改文件

```bash
[Resolve]
DNS=8.8.8.8 1.1.1.1 #取消注释，增加dns
#FallbackDNS=
#Domains=
#LLMNR=no
#MulticastDNS=no
#DNSSEC=no
#Cache=yes
DNSStubListener=no  #取消注释，把yes改为no
```

重启服务：
```bash
ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
systemctl restart systemd-resolved.service
```

## 限制访问

通过 iptables 放行白名单 IP 访问 `53` 端口

```bash
iptables -I INPUT -p tcp --dport 53 -j DROP
iptables -I INPUT -s 1.1.1.1 -p tcp --dport 53 -j ACCEPT
```

## 📎 参考文章

- [Ypkin’s Blog](https://blog.passall.us/archives/627)