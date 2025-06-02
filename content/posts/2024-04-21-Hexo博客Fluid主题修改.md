---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/66c43646d9c307b7e94a2344.webp
date: 2024-04-21
description: Hexo 博客 Fluid 主题的修改记录。
slug: fluid-modify
summary: Hexo 博客 Fluid 主题的修改记录。
tags:
- Hexo
title: Hexo博客Fluid主题修改
---
## 前言

记录对于 `Hexo` 主题 `Fluid` 的修改，来源于网络。

## 替换 Mac 风格代码块

在主题文件 `themes\fluid\source\css` 目录下新建样式文件，如 `macpanel.styl`，内容参考：

```css
.highlight
    background: #21252b
    border-radius: 5px
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, .4)
    padding-top: 30px

    &::before
      background: #fc625d
      border-radius: 50%
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b
      content: ' '
      height: 12px
      left: 12px
      margin-top: -20px
      position: absolute
      width: 12px
```

修改主题配置文件`_config.fluid.yml`，找到 `custom_css` 配置项，引入刚刚新建的样式文件（此处引入`.styl` 文件无需加后缀）：

```yaml
custom_css:
  - /css/macpanel
```

## 参考

- [Kevin's Blog](https://blog.kevinchu.top/2023/07/17/hexo-theme-fluid-modify/)