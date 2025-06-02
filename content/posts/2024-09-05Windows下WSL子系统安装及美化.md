---
categories:
- 实用教程
cover: https://r2.grew.cc/2025/01/de4d47ba7257f661930df3025a53341e.avif
date: 2024-09-05 11:34:50+08:00
description: Windows下WSL子系统的安装及美化。
slug: windows-wsl
tags:
- Windows
title: Windows下WSL子系统安装及美化
---
适用于 Linux 的 Windows 子系统 (WSL) 是 Windows 的一项功能，可用于在 Windows 计算机上运行 Linux 环境，而无需单独的虚拟机或双引导。 WSL 旨在为希望同时使用 Windows 和 Linux 的开发人员提供无缝高效的体验。
<!--more-->

## 前言

`WSL` 可以方便地使用 `Linux` 来进行一些操作，不需要到 VPS 运行，使用中发现连接本地代理并不是简单的使用 ` 127.0.0.1 `，发现已经有人写了现成的脚本，所以复制过来，简单记录一下，除此之外再记录一下其终端的美化。

## 安装

直接在终端输入安装命令，默认安装的是商店版本的 `WSL2 `

```powershell
wsl --install
```

如果需要完整的说明可以参考：[官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/install)

## 设置本地代理

方法来自：[WSL2 中访问宿主机 Windows 的代理](https://zinglix.xyz/2020/04/18/wsl2-proxy/)

新建一个脚本文件 `proxy.sh`

```bash
touch ./proxy.sh
chmod +x ./proxy.sh
vim ./proxy.sh
```

```bash
#!/bin/sh
hostip=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
wslip=$(hostname -I | awk '{print $1}')
port=<PORT>

PROXY_HTTP="http://${hostip}:${port}"

set_proxy(){
    export http_proxy="${PROXY_HTTP}"
    export HTTP_PROXY="${PROXY_HTTP}"

    export https_proxy="${PROXY_HTTP}"
    export HTTPS_proxy="${PROXY_HTTP}"
}

unset_proxy(){
    unset http_proxy
    unset HTTP_PROXY
    unset https_proxy
    unset HTTPS_PROXY
}

test_setting(){
    echo "Host ip:" ${hostip}
    echo "WSL ip:" ${wslip}
    echo "Current proxy:" $https_proxy
}

if [ "$1" = "set" ]
then
    set_proxy

elif [ "$1" = "unset" ]
then
    unset_proxy

elif [ "$1" = "test" ]
then
    test_setting
else
    echo "Unsupported arguments."
fi
```

将代码中的 `<PORT>` 更换为自己使用的程序的端口。

使用：

```bash
source ./proxy.sh set
source ./proxy.sh unset
source ./proxy.sh test
```

## 别名

如果想要方便使用，可以在 `~/.bashrc` 中设置别名，将路径更换为脚本路径：

```bash
alias proxy="source /path/to/proxy.sh"
```

之后可以直接使用 `proxy set` 和 `proxy unset` 来设置代理。

## 自启动

如果希望打开终端就可以自动启动，在 `~/.bashrc` 中添加下面的命令：

```bash
. /path/to/proxy.sh set
```

## 替换终端为 zsh

### 下载 `zsh` 

```bash
sudo apt install zsh
```

### 安装 `oh-my-zsh`

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装完成后会提示替换当前用户的 `shell`  为 `zsh` ，也可以通过下面的命令来设置默认 `shell`，完成后的配置文件为 `.zshrc`

```bash
chsh -s /bin/zsh
```

### 更换主题

可以[点此链接](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)来查看内置主题的截图，存放路径为 `~/.oh-my-zsh/themes` ，也可以替换其他的主题，这里推荐主题 `powerlevel10k`，安装命令如下：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
#  gitee.com 上的官方镜像
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

在 `~/.zshrc` 设置 `ZSH_THEME="powerlevel10k/powerlevel10k"`。然后重新进入终端，按照引导配置 `powerlevel10k`。

> [!TIP]
> `powerlevel10k` 用到了默认字体集没有的字符，所以需要将字体设置为 `Meslo LGM NF`。

### 多用户共享

上述设置仅仅是当前用户的 `shell` 设置，如果想要每个用户都使用 `zsh`，可以执行下面的设置，方法来自：[Windows11 Terminal: 配置与美化 Powershell7、WSL2、WSA](https://www.meow-2.com/posts/records/terminals)

```bash
# 移动 oh-my-zsh 目录到 /user/share
sudo mv /home/你的用户名/.oh-my-zsh /usr/share/oh-my-zsh
cd /usr/share/oh-my-zsh/
# 将配置文件模板复制到 zshrc，以后都从这个zshrc文件导出模板，方便使用
cp templates/zshrc.zsh-template zshrc
#从 MarcinWieczorek 的 AUR 包中获取补丁文件并应用于 zshrc 文件
wget https://aur.archlinux.org/cgit/aur.git/plain/0001-zshrc.patch\?h\=oh-my-zsh-git -O zshrc.patch && patch -p1 < zshrc.patch
# 创建到 zshrc 文件的硬链接，以便它为新用户创建一个实际的独立副本
sudo ln /usr/share/oh-my-zsh/zshrc /etc/skel/.zshrc
#默认新用户使用 zsh，这样每个新创建的用户都可以直接用 oh-my-zsh 了
sudo useradd -D -s /bin/zsh
```

如果要更改默认的 `zsh`  设置，就更改 `/usr/share/oh-my-zsh/zshrc` 这个文件，然后对每个用户执行以下操作即可：

```bash
cp /usr/share/oh-my-zsh/zshrc ~/.zshrc
```

## 参考

- [为 WSL2 一键设置代理](https://www.cnblogs.com/RioTian/p/17986762)
- [WSL2 中访问宿主机 Windows 的代理](https://zinglix.xyz/2020/04/18/wsl2-proxy/)
- [Zsh 安装与配置，使用 Oh-My-Zsh 美化终端](https://www.haoyep.com/posts/zsh-config-oh-my-zsh/)
- [Windows11 Terminal: 配置与美化 Powershell7、WSL2、WSA](https://www.meow-2.com/posts/records/terminals)