> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903474774147086?searchId=2023122313485056F6DC591B90F06889B6)

寻根溯源话布局
-------
`text-align: center`、`verticle-align: center` 是否可行呢？
- 答案也是否定的。这两个属性只能用于行内元素，对于块级元素的布局是无效的。

在网页布局没有进入 CSS 的时代，排版几乎是通过 `table` 元素实现的
CSS 标准为我们提供了 3 种布局方式：`标准文档流`、`浮动布局`和`定位布局`。
- 这几种方式的搭配使用可以轻松搞定 PC 端页面的常见需求，比如实现水平居中可以使用 `margin: 0 auto`，实现水平垂直同时居中可以如下设置：

flex 基本概念
---------
使用 flex 布局首先要设置父容器 `display: flex`，然后再设置 `justify-content: center` 实现水平居中，最后设置 `align-items: center` 实现垂直居中。

```
#dad {
    display: flex;
    justify-content: center;
    align-items: center
}
```

### 1. 容器

> 容器具有这样的特点：父容器可以统一设置子容器的排列方式，子容器也可以单独设置自身的排列方式，如果两者同时设置，以子容器的设置为准。

![](_resources/f443b657dbc39d361f68.png~tplv-t2oaga2asx-jj-mark!3024!0!0!0!q75.awebp.webp)

#### 1.1 父容器

*   设置子容器沿主轴排列：**justify-content**
`justify-content` 属性用于定义如何沿着主轴方向排列子容器。

![](_resources/be5b7f0e022a8da60ed8.png~tplv-t2oaga2asx-jj-mark!3024!0!0!0!q75.awebp.webp)
#### 1.2 子容器
*   在主轴上如何伸缩：**flex**
![](_resources/089d48122453e9fc372c.png~tplv-t2oaga2asx-jj-mark!3024!0!0!0!q75.awebp.webp)

子容器是有弹性的（flex 即弹性），它们会自动填充剩余空间，子容器的伸缩比例由 `flex` 属性确定。

`flex` 的值可以是无单位数字（如：1, 2, 3），也可以是有单位数字（如：15px，30px，60px），还可以是 `none` 关键字。子容器会按照 `flex` 定义的尺寸比例自动伸缩，如果取值为 `none` 则不伸缩。

虽然 `flex` 是多个属性的缩写，允许 1 - 3 个值连用，但通常用 1 个值就可以满足需求，它的全部写法可参考下图。

flex 进阶概念
---------

父容器
* 设置换行方式：**flex-wrap**
> **nowrap**：不换行
> **wrap**：换行

子容器
*   设置排列顺序：**order**
    改变子容器的排列顺序，覆盖 HTML 代码中的顺序，默认值为 0，可以为负值，数值越小排列越靠前。
    
