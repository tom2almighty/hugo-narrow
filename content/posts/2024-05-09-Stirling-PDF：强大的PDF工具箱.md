---
categories: 
- 效率工具
cover: https://pic.imgdb.cn/item/66c433e2d9c307b7e94744d8.webp
date: 2024-05-09 16:36:57
description: 使用 Docker 部署自己的 PDF 工具箱。
slug: stirling-pdf
summary: 使用 Docker 部署自己的 PDF 工具箱。
tags:
- Docker
title: Stirling-PDF：强大的PDF工具箱
---
## 前言

通常我们需要处理一些 `PDF` 文档，使用时再寻找工具多有不便，不妨自己部署一个工具箱。

`Stirling-PDF` 是一个使用 `Docker` 部署的本地托管的、基于 `Web` 的 PDF 操作工具，支持多种语言它使您能够对 `PDF` 文件进行各种操作，包括分割、合并、转换、重组、添加图像、旋转、压缩等。这个本地托管的 `Web` 应用程序已发展为包含一组全面的功能，可满足您的所有 `PDF` 要求。

项目功能强大，详细的 `Feature` 可查看项目地址：

[Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF)

本站预览地址如下：

https://pdf.grew.cc

## 部署

## 版本差异

`Stirling PDF` 有两个不同的版本：完整版和超精简版，二者相差 `400MB` 左右，版本区别如下：

| Technology | Ultra-Lite | Full |
| ---------- | :--------: | :--: |
| Java       |     ✔️      |  ✔️   |
| JavaScript |     ✔️      |  ✔️   |
| Libre      |            |  ✔️   |
| Python     |            |  ✔️   |
| OpenCV     |            |  ✔️   |
| OCRmyPDF   |            |  ✔️   |

| Operation              | Ultra-Lite | Full |
| ---------------------- | ---------- | ---- |
| add-page-numbers       | ✔️          | ✔️    |
| add-password           | ✔️          | ✔️    |
| add-image              | ✔️          | ✔️    |
| add-watermark          | ✔️          | ✔️    |
| adjust-contrast        | ✔️          | ✔️    |
| auto-split-pdf         | ✔️          | ✔️    |
| auto-redact            | ✔️          | ✔️    |
| auto-rename            | ✔️          | ✔️    |
| cert-sign              | ✔️          | ✔️    |
| crop                   | ✔️          | ✔️    |
| change-metadata        | ✔️          | ✔️    |
| change-permissions     | ✔️          | ✔️    |
| compare                | ✔️          | ✔️    |
| extract-page           | ✔️          | ✔️    |
| extract-images         | ✔️          | ✔️    |
| flatten                | ✔️          | ✔️    |
| get-info-on-pdf        | ✔️          | ✔️    |
| img-to-pdf             | ✔️          | ✔️    |
| markdown-to-pdf        | ✔️          | ✔️    |
| merge-pdfs             | ✔️          | ✔️    |
| multi-page-layout      | ✔️          | ✔️    |
| overlay-pdf            | ✔️          | ✔️    |
| pdf-organizer          | ✔️          | ✔️    |
| pdf-to-csv             | ✔️          | ✔️    |
| pdf-to-img             | ✔️          | ✔️    |
| pdf-to-single-page     | ✔️          | ✔️    |
| remove-pages           | ✔️          | ✔️    |
| remove-password        | ✔️          | ✔️    |
| rotate-pdf             | ✔️          | ✔️    |
| sanitize-pdf           | ✔️          | ✔️    |
| scale-pages            | ✔️          | ✔️    |
| sign                   | ✔️          | ✔️    |
| show-javascript        | ✔️          | ✔️    |
| split-by-size-or-count | ✔️          | ✔️    |
| split-pdf-by-sections  | ✔️          | ✔️    |
| split-pdfs             | ✔️          | ✔️    |
| compress-pdf           |            | ✔️    |
| extract-image-scans    |            | ✔️    |
| ocr-pdf                |            | ✔️    |
| pdf-to-pdfa            |            | ✔️    |
| remove-blanks          |            | ✔️    |

### Docker 部署

可以使用  `docker run` 命令运行，如下：

```bash
docker run -d \
  -p 8080:8080 \
  -v /location/of/trainingData:/usr/share/tessdata \
  -v /location/of/extraConfigs:/configs \
  -v /location/of/logs:/logs \
  -e DOCKER_ENABLE_SECURITY=false \
  -e INSTALL_BOOK_AND_ADVANCED_HTML_OPS=false \
  -e LANGS=en_GB \
  --name stirling-pdf \
  frooodle/s-pdf:latest


  Can also add these for customisation but are not required

  -v /location/of/customFiles:/customFiles \
```

> 注意将其中挂载的卷目录更改为自己的实际目录



`docker-compose` 文件如下：
```bash
version: '3.3'
services:
  stirling-pdf:
    image: frooodle/s-pdf:latest
    ports:
      - '8080:8080'
    volumes:
      - ./trainingData:/usr/share/tessdata #Required for extra OCR languages
      - ./extraConfigs:/configs
#      - /location/of/customFiles:/customFiles/
      - ./logs:/logs/
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=false
      - LANGS=en_GB
```
更多丰富的功能可以查看：[官方文档](https://stirlingtools.com/)
