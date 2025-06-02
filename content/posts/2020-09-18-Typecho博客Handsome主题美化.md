---
categories: 
- 实用教程
cover: https://pic.imgdb.cn/item/65dc461a9f345e8d03090cf5.webp
date: 2020-09-18
description: 美化 Typecho 主题 Handsome，加入鼠标指针特效等功能。
slug: handsome
summary: 美化 Typecho 主题 Handsome，加入鼠标指针特效等功能。
tags:
- Typecho
title: Typecho博客Handsome主题美化
---
## **前言**

[Handsome](https://www.ihewro.com/archives/489/) 是一款精美的 `Typecho` 主题，后台功能强大，这里记录一下自己从网上找到的对主题的一些美化。

## **底部版权信息美化**

### **底部左侧信息**

在主题**后台设置-开发者设置-博客底部左侧信息**添加如下代码：

```css
<div class="github-badge">
<a href="./" title="©2021 XXX">
<span class="badge-subject">Copyright</span><span class="badge-value bg-blue">©2021 XXX</span>
</a>
</div>
 |
<div class="github-badge">
<a href="http://www.beian.gov.cn/" target="_blank" title="XICP备 XXXXXXXXXX号"), pointer;">
<span class="badge-subject">晋ICP备</span><span class="badge-value bg-green">XXXXXXXXXX号</span>
</a>
</div>
```

删除对应代码

```css
# 在 `handsome\component\footer.php` 文件中删除如下代码
by <a target="blank" href="https://www.ihewro.com/archives/489/">handsome</a>
© <?php echo date("Y");?> Copyright
```

### **底部右侧信息**

在主题**后台设置-开发者设置-博客底部右侧信息**添加如下代码：

```css
<div class="github-badge">
<a href="http://www.typecho.org" target="_blank" title="由 Typecho 强力驱动">
<span class="badge-subject">Powered</span><span class="badge-value bg-blue">Typecho</span>
</a>
</div>
  |
<div class="github-badge">
<a href="https://www.ihewro.com/archives/489/" target="_blank" title="站点使用 handsome 主题，作者：友人C">
<span class="badge-subject">Theme</span><span class="badge-value bg-orange">Handsome</span>
</a>
</div>
```

## **首页头像自动旋转**

在**设置外观-开发者设置-自定义CSS**中添加如下代码：

```css
/*首页头像自动旋转*/
.thumb-lg{
    width:130px;
}
 
.avatar{
    -webkit-transition: 0.4s;
    -webkit-transition: -webkit-transform 0.4s ease-out;
    transition: transform 0.4s ease-out;
    -moz-transition: -moz-transform 0.4s ease-out;
}

.avatar:hover{
    transform: rotateZ(360deg);
    -webkit-transform: rotateZ(360deg);
    -moz-transform: rotateZ(360deg);
}
 
#aside-user span.avatar{
    animation-timing-function:cubic-bezier(0,0,.07,1)!important;
    border:0 solid
}
 
#aside-user span.avatar:hover{
    transform:rotate(360deg) scale(1.2);
    border-width:5px;
    animation:avatar .5s
}
```

## **首页文章版式圆角化**

在**设置外观-开发者设置-自定义CSS**中添加如下代码：

```css
/*首页文章版式圆角化*/
.panel{
    border: none;
    border-radius: 10px;
}
 
.panel-small{
    border: none;
    border-radius: 10px;
}
 
.item-thumb{
    border-radius: 10px;
}
```

## **首页文章列表悬浮上停**

在**设置外观-开发者设置-自定义CSS** 中添加如下代码：

```css
/*首页文章列表悬停上浮*/
.blog-post .panel:not(article) {
    transition: all 0.3s;
}
 
.blog-post .panel:not(article):hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 10px rgba(73, 90, 47, 0.47);
}
```

## **首页文章图片获取焦点放大**

在**设置外观-开发者设置-自定义CSS** 中添加如下代码：

```css
 /*首页文章图片获取焦点放大*/
.item-thumb{
    cursor: pointer;
    transition: all 0.6s;
}

.item-thumb:hover{
      transform: scale(1.05);
}
 
.item-thumb-small{
    cursor: pointer;
    transition: all 0.6s;
}
 
.item-thumb-small:hover{
    transform: scale(1.05);
}
#post-content pre code {
    display:block;
    overflow-x:auto;
    position:relative;
    margin:0;
    padding-left:50px;
}
pre code {
    position:relative;
    display:block;
    overflow-x:auto;
    margin:4.4px 0.px .4px 1px;
    padding:0;
    max-height:500px;
    padding-left:3.5em
}
```

## **右侧列表导航栏图标颜色**

在**设置外观-开发者设置-自定义CSS** 中添加如下代码：

```css
/* 右侧列表导航栏图标颜色 */
.sidebar-icon svg.feather.feather-thumbs-up{color: #ff0000;}
.sidebar-icon svg.feather.feather-message-square{color:#495dc3;}
.sidebar-icon svg.feather.feather-gift{color:#52DE97;}
```

## **博客信息配套颜色**

在**设置外观-开发者设置-自定义CSS** 中添加如下代码：

```css
/* 博客信息配套颜色 */
 
#blog_info>ul>li:nth-child(1)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(2)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(3)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(4)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(5)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(6)>span.badge{
    background-color: #009688;
}
#blog_info>ul>li:nth-child(7)>span.badge{
    background-color: #009688;
}
```

## **底部页脚**

在**设置外观-开发者设置-自定义CSS** 中添加如下代码：

```css
/*底部页脚*/
.github-badge {
  display: inline-block;
  border-radius: 4px;
  text-shadow: none;
  font-size: 12px;
  color: #fff;
  line-height: 15px;
  background-color: #abbac3;
  margin-bottom: 5px
}
 
.github-badge .badge-subject {
  display: inline-block;
  background-color: #4d4d4d;
  padding: 4px 4px 4px 6px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px
}
 
.github-badge .badge-value {
  display: inline-block;
  padding: 4px 6px 4px 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px
}
 
.github-badge .bg-blue {
  background-color: #007ec6
}
 
.github-badge .bg-orange {
  background-color: #ffa500
}
 
.github-badge .bg-red {
  background-color: #f00
}
 
.github-badge .bg-green {
  background-color: #3bca6e
}
 
.github-badge .bg-purple {
  background-color: #ab34e9
}

/*这是优化底部栏的css，应该不会影响没开启炫酷透明功能时候的主题，如果有问题就删除下面这行即可*/
.wrapper {
  padding: 11px;
}
```

## **彩色云标签**

在**设置外观-开发者设置-自定义JavaScript** 中添加如下代码：

```jsx
<!--彩色标签云-->
let tags = document.querySelectorAll("#tag_cloud-2 a");
let colorArr = ["#428BCA", "#AEDCAE", "#ECA9A7", "#DA99FF", "#FFB380", "#D9B999"];
tags.forEach(tag => {
    tagsColor = colorArr[Math.floor(Math.random() * colorArr.length)];
    tag.style.backgroundColor = tagsColor;
});
```

## **鼠标点击特效**

将下列代码写入`handsome/component/footer.php`文件 `</body>` 之前

```jsx
<script type="text/javascript">
/* 鼠标特效 */
var a_idx = 0;
jQuery(document).ready(function($) {
    $("body").click(function(e) {
        var a = new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正" ,"法治", "爱国", "敬业", "诚信", "友善");
        var $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        var x = e.pageX,
        y = e.pageY;
        $i.css({
            "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": "#ff6651"
        });
        $("body").append($i);
        $i.animate({
            "top": y - 180,
            "opacity": 0
        },
        1500,
        function() {
            $i.remove();
        });
    });
});
</script>
```

## **参考**

- [Rats's Blog](https://www.moerats.com/archives/628/#%E6%96%B9%E6%B3%95)