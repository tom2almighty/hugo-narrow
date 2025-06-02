---
categories: 
- 效率工具
cover: https://pic.imgdb.cn/item/62d6dc96f54cd3f937d50c8a.png
date: 2021-09-10
description: 通过 Office Tools Plus 工具部署 Office，并简单激活。
slug: office
summary: 通过 Office Tools Plus 工具部署 Office，并简单激活。
tags:
- Windows
title: Windows10 Office安装指南
---
## **前言**

`Office` 是日常办公必需品，目前新买到的笔记本都会自带正版 `Office 家庭中文版`，而且只需要拿邮箱激活一次，之后重装电脑只需要登录激活的邮箱账号即可自动激活，这里简单记录一下下载 `Office` 的步骤。

## **使用工具**

**`Office Tool Plus`**

> Office Tool Plus 基于 Office 部署工具制作，除此之外还集成了各种实用性工具帮助用户部署和管理 Office.
> 

- [Office Tool Plus官网](https://otp.landian.vip/zh-cn/)

- [帮助文档](https://help.coolhub.top/zh-cn/)

### **步骤**

1. 首先下载并解压工具，推荐下载包含框架的版本，不需要安装额外依赖，下载解压后运行文件夹内 `RunMe.bat`

2. 选择 `部署` 按钮，进去后看到如下界面，选择需要安装的版本以及需要安装的应用，如 `Word`、`Excel` 和 `PowerPoint`，添加需要安装的语言，之后点击 `开始部署` 即可开始安装。

![https://cdn.jsdelivr.net/gh/stcharlesc/images@3a5131fa92d32fb93e7a6fc0a62aeea8016f6b44/2021/09/25/f8bf6513ec310c10d22b7ed678ef50b8.png](https://cdn.jsdelivr.net/gh/stcharlesc/images@3a5131fa92d32fb93e7a6fc0a62aeea8016f6b44/2021/09/25/f8bf6513ec310c10d22b7ed678ef50b8.png)

3. 安装完成后登录第一次激活时的 `Office` 账号即可使用，若没有账号，可使用工具内的激活工具，首先点击主界面的 `代码` 按钮，然后在红框内输入代码按回车，等待激活结束

![https://cdn.jsdelivr.net/gh/stcharlesc/images@b3efe727fdaaad52f6b0ae7d3a98cfa8bd5dccf9/2021/09/25/073774c8eb6da29f7d92d33e5888eeee.png](https://cdn.jsdelivr.net/gh/stcharlesc/images@b3efe727fdaaad52f6b0ae7d3a98cfa8bd5dccf9/2021/09/25/073774c8eb6da29f7d92d33e5888eeee.png)

```powershell
/osppilbyid MondoVolume /osppsethst:kms.loli.beer /osppsetprt:1688 /osppact
```

`Office Tool Plus` 还提供了许多常用工具，可以解决日常使用中的许多问题，工具官方页面也有[帮助文档](https://help.coolhub.top/zh-cn/)，以及[新手教程](https://www.coolhub.top/archives/42)，自行探索。