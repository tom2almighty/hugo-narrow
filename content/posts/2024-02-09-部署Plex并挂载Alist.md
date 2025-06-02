---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/65f0121c9f345e8d03f6691c.webp
date: 2024-02-09
description: 服务器部署 Plex 服务并通过 Rclone 挂载网盘。
slug: plex
summary: 服务器部署 Plex 服务并通过 Rclone 挂载网盘。
tags:
- Alist
- Docker
title: 部署Plex并挂载Alist
---
## 前言

由于最近 `Netflix` 清退了一大批低价区用户，并且不退款，需要与银行争议，就开了一个月的土耳其区，然而土耳其第一个月并不能用土耳其之外的 `IP` 观看，白白浪费一个月，虽然最近尼日利亚的低价已经超过了巴基斯坦，但还是决定放弃了，花钱找罪受，不如买个 `Emby` 。
之后在网上看到可以通过服务器部署 `Plex Media Server` ，将 `Alist` 挂载到服务器，`Plex` 添加 `Alist` 目录，然后 `infuse` 连接 `Plex` ，这样可以实现刮削，并且全平台同步，还可以搭配 `Aria2` 下载自动上传网盘，达到良好的观影效果。


## 一、可执行程序部署

### 1. 部署 Plex

部署可以通过可执行程序，也可以通过 `docker` ，如果想挂载 alist ，记得和 `alist` 程序安装在同一台服务器。

部署程序

```bash
# centos
yum -y update && yum -y install
wget https://downloads.plex.tv/plex-media-server-new/1.32.8.7639-fb6452ebf/redhat/plexmediaserver-1.32.8.7639-fb6452ebf.x86_64.rpm
yum install plexmediaserver*.rpm
# Debian/Ubuntu系统
apt-get -y update && apt-get -y upgrade
wget https://downloads.plex.tv/plex-media-server-new/1.32.8.7639-fb6452ebf/debian/plexmediaserver_1.32.8.7639-fb6452ebf_amd64.deb
dpkg -i plexmediaserver*.deb
```

设置开机自启

```bash
systemctl enable plexmediaserver.service
systemctl start plexmediaserver.service
# 状态查询
systemctl status plexmediaserver.service
```

安装完成可以通过 [http://ip地址:32400](http://ip地址:32400) 进入后台管理，如果运行正常却无法打开，可能是防火墙问题，命令如下，也可以宝塔面板直接放行。

```bash
#CentOS 7
systemctl stop firewalld.service
systemctl disable firewalld.service
#其它系统
iptables -I INPUT -p tcp --dport 32400 -j ACCEPT
service iptables save                              
service iptables restart
```

### 2. 后台设置

安装完成后进入后台会发现无法找到服务器，这是因为 `Plex` 安全策略，第一次登录只允许本地 `IP` 可以通过端口转发或隧道转发解决。

#### 端口转发

Windows 打开 `Power shell`，然后通过下列命令连接服务器：

```bash
ssh root@服务器IP -L 8888:localhost:32400
```

浏览器打开：`http://localhost:8888/web` 就可以正常设置。

#### 隧道转发

这里以 `FinalShell` 为例，ssh 连接设置中添加如下隧道

![隧道示例](https://pic.imgdb.cn/item/65f012c79f345e8d03f8c367.webp)

连接服务器，浏览器打开 `http://localhost:8888/web` 即可。

### 3. 卸载

```bash
# centos
rpm -e plexmediaserver
rm -rf/var/lib/plexmediaserver/
userdel plex

# ubuntu/debian
dpkg -r plexmediaserver
rm -rf /var/lib/plexmediaserver/Library/Application Support/Plex Media Server/
```

## 二、Docker 部署

### 1. 安装 docker 和 docker-compose

```bash
# 卸载旧版本
sudo apt-get remove docker \
             docker-engine \
             docker.io
curl -fsSL get.docker.com -o get-docker.sh
# 启动并设置开机自启
sudo systemctl enable docker
sudo systemctl start docker
# 安装 docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
# 可用以下命令测试安装
docker-compose --version
```

### 2. 创建目录

```bash
sudo mkdir /plex
sudo mkdir /plex/{data,tv,movies}
cd /plex
vim ./docker-compose.yml
```

粘贴下列命令

```yaml
services:
  plex:
    image: lscr.io/linuxserver/plex:latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - VERSION=docker
      - PLEX_CLAIM= #optional
    volumes:
      - /plex/data:/config  # Library 目录，可能变得很大
      - /plex/tv:/tv
      - /plex/movies:/movies
    # - /CloudNAS:/CloudNAS    # 这是将 Clouddrive 的挂载目录映射到 plex 容器中，也可以更换            
    restart: unless-stopped
```

- `PUID`和`PGID`用于配置容器内进程的`UID`和`GID`，全都设置为 `0` 表示以`root`用户运行，如果你这里不是很明白的话可以无脑设置为 `0` 以避免部分权限问题
- `PLEX_CLAIM`环境变量用于认证自己的服务器，可以从 **[这里](https://www.plex.tv/claim/)** 获取(注意需要可用的plex账号)， 另外 `claim` 的有效期一般只有 **4** 分钟 ，如果服务器网络不佳，建议先通过执行`docker-compose pull`拉取镜像之后再获取，防止过期(虽说过期后再重新 claim 也行)

### 3. 启动容器

```bash
docker-compose up -d
```

浏览器打开 `http://IP地址:32400/web` 进入后台，出现无法找到服务器同样需要通过映射本地端口。

## 三、挂载网盘

**💡 挂载程序有很多，这里以 `rclone` 和 `cloudrive2`（推荐）为例。**


### 1. rclone

首先安装依赖和程序

```bash
# 安装依赖
apt-get install fuse3
# 安装 rclone
curl https://rclone.org/install.sh | sudo bash
```

接下来设置 rclone，终端输入 `rclone config` ，随后输入 `n` 添加远程设备，这里接下来的代码直接参考别人的：

```bash
# 选择新远程
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n #这里选择n

# 设置名字
name> remote
Type of storage to configure.
Choose a number from below, or type in your own value
[snip]
XX / WebDAV
   \ "webdav"
[snip]
Storage> webdav #这里输入远程的名字，之后就是你的远程名称

# 设置远程地址url http://your_alist_ip:port/dav
URL of http host to connect to
Choose a number from below, or type in your own value
 1 / Connect to example.com
   \ "https://example.com"
url> http://127.0.0.1:5244/dav #这里设置alist的地址和端口，后面要带dav，这是alist要求的

# 这里选6就可以了，1-5都不是我们使用的
Name of the WebDAV site/service/software you are using
Choose a number from below, or type in your own value
 1 / Fastmail Files
   \ (fastmail)
 2 / Nextcloud
   \ (nextcloud)
 3 / Owncloud
   \ (owncloud)
 4 / Sharepoint Online, authenticated by Microsoft account
   \ (sharepoint)
 5 / Sharepoint with NTLM authentication, usually self-hosted or on-premises
   \ (sharepoint-ntlm)
 6 / Other site/service or software
   \ (other)
vendor> 6

# 设置远程账号
User name
user> admin #这里是你alist的密码

# 设置远程密码
Password.
y) Yes type in my own password
g) Generate random password
n) No leave this optional password blank
y/g/n> y #这里输入y
Enter the password: #这输入你的密码，密码是看不到的
password:
Confirm the password: #再次输入你的密码
password:

# 这里直接回车即可
Bearer token instead of user/pass (e.g. a Macaroon)
bearer_token>
Remote config

# 这里可能会问你是默认还是高级，选择默认即可

# 你的远程信息
--------------------
[remote]
type = webdav
url = http://127.0.0.1:5244/dav
vendor = Other
user = admin
pass = *** ENCRYPTED ***
--------------------

# 确认
y) Yes this is OK
e) Edit this remote
d) Delete this remote
y/e/d> y #输入y即可，

# 最后按q退出设置
```

连接后需要挂载到本地，输入如下命令：

```bash
# 最后的 daemon 是后台挂载
rclone mount 远程网盘名字:/ /本地挂载地址 --cache-dir /tmp --allow-other --vfs-cache-mode writes --allow-non-empty --daemon
```

这样虽然后台挂载了，但是每次重启都需要重新运行，我们可以设置一个开机自启的文件：

```bash
#创建service文件
vim /usr/lib/systemd/system/rclone.service
```

输入如下内容：

```bash
[Unit] 
Description=rclone 
 
[Service] 
User=root 
ExecStart=/usr/bin/rclone mount 远程网盘名字:/ /本地挂载目录 --cache-dir /tmp --allow-other --vfs-cache-mode writes --allow-non-empty --daemon
[Install] 
WantedBy=multi-user.target
```

重载配置文件，并设置开机自启：

```bash
# reload守护进程
systemctl daemon-reload
 
# 设置service文件自启
systemctl enable rclone.service
 
# 启动service文件
systemctl start rclone.service
```

### 2. Clouddrive2

`rclone` 需要命令行操作，并且使用过程中出现了一些问题，这里推荐另一种有 `web` 界面的挂载方式 `clouddrive2`，官网地址如下，推荐使用 `docker` 安装：

[CloudDrive - Home](https://www.clouddrive2.com/)


> 💡 **注意：如果 `plex` 是通过 `docker` 安装的，需要添加 `-v` 参数，将 `clouddrive2` 映射的目录映射到 `plex` 中。**


1. 设置后台。安装完成后终端会输出访问地址，通过 `http://ip:19798` 就可以访问。
2. 进入后首先注册账号，然后点击云朵图标添加网盘，选择 `webdav` , 设置地址如下：

![webdav地址](https://pic.imgdb.cn/item/65f012fa9f345e8d03f96f02.webp)

3. 挂载 `webdav` 到本机，先点击右上角的电脑图标，然后挂载到 `/CloudNAS` 目录下，可以修改一下权限。

![挂载地址](https://pic.imgdb.cn/item/65f013389f345e8d03fa4442.webp)

> 💡 **注意：clouddrive 免费用户只可以添加两个网盘，挂载一个网盘，但我们可以首先通过 alist 挂载所有网盘，再将 alist 通过 webdav 挂载。**


这样所有的安装都结束了，我们可以在 `plex` 中设置媒体文件夹，刮削完后可以在移动端通过 `infuse`、`vidhub` 等应用挂载 `plex`，这样就能拥有一个资源丰富界面精美的媒体库。

## 参考

- [docker compose 安装](https://dockerdocs.cn/compose/install/)
- [docker 从入门到实践](https://yeasy.gitbook.io/docker_practice/install/ubuntu)
- [Rat’s Blog](https://www.moerats.com/archives/464/)
- [魔趣博客](https://blog.mokeedev.com/2022/05/549/)
- [Rin’s Home](https://blog.hinatarin.com/2021/04/21/set-up-your-own-media-server-with-plex-and-docker/index.html)
- [博客](https://yroot.site/?p=276)
- [Willxup](https://willxup.top/archives/deploy-alist-and-rclone)