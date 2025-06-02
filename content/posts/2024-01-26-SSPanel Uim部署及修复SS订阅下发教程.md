---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/65f01aa99f345e8d03171a8d.webp
date: 2024-01-26
description: SSPanel-Uim 部署及修复订阅下发
draft: true
slug: sspanel
summary: SSPanel-Uim 部署及修复订阅下发
tags:
- Panel
title: SSPanel Uim部署及修复SS订阅下发教程
---
## 前言

请注意，本教程仅用于学习目的，切勿将其用于非法用途。使用本教程搭建面板需要遵循法律法规，谨慎使用相关技术。

## 1.  安装宝塔面板  7.7

```bash
# 更新系统和安装 wget、curl
apt-get update -y && apt-get install wget -y && apt-get install curl -y

# 安装宝塔面板
curl -sSO <https://raw.githubusercontent.com/zhucaidan/btpanel-v7.7.0/main/install/install_panel.sh> && bash install_panel.sh

# 删除登录验证
sed -i "s|if (bind_user == 'True') {|if (bind_user == 'REMOVED') {|g" /www/server/panel/BTPanel/static/js/index.js
rm -rf /www/server/panel/data/bind.pl

```

## 2.  配置宝塔面板

- 安装如下：
    - `Nginx 1.22.1`
    - `PHP 8.2 +`
    - `MySQL 10.11.6-MariaDB`
    - `Redis 7.0.11`
    - `phpMyAdmin 4.9`
    - `Pure-Ftpd 1.0.49`
- 安装 `PHP` 扩展：`fileinfo`、`redis`、`yaml`。
- 删除 `PHP` 被禁用函数：`proc_open`、`proc_get_status`、`putenv`。

## 3.  创建网站并添加 SSL 证书

## 4.  下载并安装面板源码

```bash
cd /www/wwwroot
# 版本参考 GitHub
git clone -b 2023.6 https://github.com/Anankke/SSPanel-Uim.git

```

## 5.  设置站点运行目录和伪静态

1. 站点目录设置为 `/www/wwwroot/SSPanel-Uim/public`，关闭`防跨站攻击`。
2. 编辑 Nginx 配置文件，在 location / 下添加：

```php
location / {
    try_files $uri /index.php$is_args$args;
}

```

1. 重启 Nginx。

## 6.  设置站点根目录整体权限

```bash
chmod -R 775 /www/wwwroot/SSPanel-Uim

```

## 7.  编辑网站配置文件

- 将 `appprofile.example.php` 重命名为 `appprofile.php`。
- 将 `.config.example.php` 重命名为 `.config.php`。
- 编辑 `.config.php`，填写必要的参数。

```php
$_ENV['key'] = 'abcde';  //Cookie加密密钥，请务必修改此key为随机字符串
$_ENV['appName']  = 'sspanel'; //站点名称
$_ENV['baseUrl']  = '<https://www.aaa.com>';  //站点地址,结尾不要带斜杠
$_ENV['muKey'] = 'abcde';   //WebAPI密钥，用于节点服务端与面板通信
$_ENV['db_database']  = 'database'; //数据库名
$_ENV['db_username']  = 'user'; //数据库用户名
$_ENV['db_password']  = 'password'; //用户名对应的密码
$_ENV['enable_login_bind_ip'] = false; //是否将登陆和IP绑定,建议false
$_ENV['checkNodeIp']  = false; //是否webapi验证节点ip,建议false
$_ENV['cloudflare_enable'] = true; //是否开启 Cloudflare 解析
$_ENV['cloudflare_email'] = 'aa@gmail.com'; //Cloudflare 邮箱地址
$_ENV['cloudflare_key'] = 'key'; //Cloudflare API Key
$_ENV['cloudflare_name'] = 'www.aaa.com'; //站点域名
// ...其他参数

```

## 8.  站点初始化

```bash
cd /www/wwwroot/SSPanel-Uim
# 切换为PHP8.2
sudo ln -sf /www/server/php/82/bin/php /usr/bin/php

wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install --no-dev
php xcat Migration new
php xcat Tool importAllSettings
php xcat Tool createAdmin

# 将目录权限用户设为 www
chmod -R 755 /www/wwwroot/SSPanel-Uim

```

## 9.  设置定时任务

```bash
# 安装 cron
sudo apt-get install cron

# 编辑定时任务
crontab -e

# 添加以下任务
*/5 * * * * /usr/bin/php /www/wwwroot/SSPanel-Uim/xcat Cron

# 保存并退出，重启 cron
systemctl restart cron

```

## 10.  修改节点订阅下发端口问题

> 面板会将用户端口下发为ss节点端口
> 
1. 在 `SSPanel-Uim/src/Services/Subscribe` 目录下，除了 `base.php`、`Trojan.php`、`V2ray.php` 之外的文件都需要修改。
2. 在每个文件的 `foreach ($nodes_raw as $node_raw) {` 后添加以下代码：

```php
# 在 foreach ($nodes_raw as $node_raw) { 这一行的下一行添加下面这一行代码：
$node_custom_config = json_decode($node_raw->custom_config, true);

# 在if ((int) $node_raw->sort === 0) { 这一行的下一行添加下面这一行代码：
$ss_port = $node_custom_config['offset_port_user'] ?? ($node_custom_config['offset_port_node'] ?? $user->port);
# 这里是指按照 offset_port_user、offset_port_node、用户端口的顺序加载端口

```

3. 将后面 `$links` 开头的代码中的 `$user->port` 改为 `$ss_port`。
4. 重启服务器

## 参考

- [Streamerfans之家](https://streamernote.online/index.php/2024/01/12/sspanel%E9%9D%A2%E6%9D%BF%E6%90%AD%E5%BB%BA%E6%94%AF%E6%8C%81reality/)