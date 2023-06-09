> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [yanhaijing.com](https://yanhaijing.com/css/2017/09/29/principle-of-rem-layout/)

> 本文将讲解 rem 布局的原理和相关知识

面试中发现很多人对 rem 布局的原理不是很清楚，只停留在会使用的阶段，或者理解完全是错误的，本文将给大家讲清楚 rem 布局的原理，使用方案等知识

什么是 Rem
-------

rem 和 em 很容易混淆，其实两个都是 css 的单位，并且也都是相对单位，现有的 em，css3 才引入的 rem，在介绍 rem 之前，我们先来了解下 em

> em 作为 font-size 的单位时，其代表父元素的字体大小，em 作为其他属性单位时，代表自身字体大小——MDN

我在面试时经常问会一道和 em 有关的题，来看一下面试者对 css 细节的了解程度，如下，问 s1、s2、s5、s6 的`font-size`和`line-height`分别是多少 px，先来想一想，结尾处有答案和解释

```
<div class="p1">
    <div class="s1">1</div>
    <div class="s2">1</div>
</div>
<div class="p2">
    <div class="s5">1</div>
    <div class="s6">1</div>
</div>
```

```
.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 2em;}
.s2 {font-size: 2em; line-height: 2em;}

.p2 {font-size: 16px; line-height: 2;}
.s5 {font-size: 2em;}
.s6 {font-size: 2em; line-height: 2em;}
```

em 可以让我们的页面更灵活，更健壮，比起到处写死的 px 值，em 似乎更有张力，改动父元素的字体大小，子元素会等比例变化，这一变化似乎预示了无限可能

有些人提出用 em 来做弹性布局页面，但其复杂的计算让人诟病，甚至有人专门做了个 px 和 em 的[计算器](https://vasilis.nl/nerd/code/emcalc/)，不同节点像素值对应的 em 值，o(╯□╰)o

![](https://yanhaijing.com/blog/519.png)

em 做弹性布局的缺点还在于牵一发而动全身，一旦某个节点的字体大小发生变化，那么其后代元素都得重新计算，X﹏X

> rem 作用于非根元素时，相对于根元素字体大小；rem 作用于根元素字体大小时，相对于其出初始字体大小——MDN

rem 取值分为两种情况，设置在根元素时和非根元素时，举个例子

```
/* 作用于根元素，相对于原始大小（16px），所以html的font-size为32px*/
html {font-size: 2rem}

/* 作用于非根元素，相对于根元素字体大小，所以为64px */
p {font-size: 2rem}
```

rem 有 rem 的优点，em 有 em 的优点，尺有所短，寸有所长，我一直不觉得技术没有什么对错，只有适合不适合，有对错的是使用技术的人，杰出与优秀的区别就在于能否选择合适的技术，并让其发挥优势

我一直觉得 em 就是为字体和行高而生的，有些时候子元素字体就应该相对于父元素，元素行高就应该相对于字体大小；而 rem 的有点在于统一的参考系

Rem 布局原理
--------

rem 布局的本质是什么？这是我问过很多人的一个问题，但得到的回答都差强人意。

其实 rem 布局的本质是等比缩放，一般是基于宽度，试想一下如果 UE 图能够等比缩放，那该多么美好啊

假设我们将屏幕宽度平均分成 100 份，每一份的宽度用 x 表示，`x = 屏幕宽度 / 100`，如果将 x 作为单位，x 前面的数值就代表屏幕宽度的百分比

```
p {width: 50x} /* 屏幕宽度的50% */
```

如果想要页面元素随着屏幕宽度等比变化，我们需要上面的 x 单位，不幸的是 css 中并没有这样的单位，幸运的是在 css 中有 rem，通过 rem 这个桥梁，可以实现神奇的 x

通过上面对 rem 的介绍，可以发现，如果子元素设置 rem 单位的属性，通过更改 html 元素的字体大小，就可以让子元素实际大小发生变化

```
html {font-size: 16px}
p {width: 2rem} /* 32px*/

html {font-size: 32px}
p {width: 2rem} /*64px*/
```

如果让 html 元素字体的大小，恒等于屏幕宽度的 1/100，那 1rem 和 1x 就等价了

```
html {fons-size: width / 100}
p {width: 50rem} /* 50rem = 50x = 屏幕宽度的50% */
```

如何让 html 字体大小一直等于屏幕宽度的百分之一呢？ 可以通过 js 来设置，一般需要在页面 dom ready、resize 和屏幕旋转中设置

```
document.documentElement.style.fontSize = document.documentElement.clientWidth / 100 + 'px';
```

那么如何把 UE 图中的获取的像素单位的值，转换为已 rem 为单位的值呢？公式是`元素宽度 / UE图宽度 * 100`，让我们举个例子，假设 UE 图尺寸是 640px，UE 图中的一个元素宽度是 100px，根据公式`100/640*100 = 15.625`

下面来验证下上面的计算是否正确，下面的表格是 UE 图等比缩放下，元素的宽度

<table><thead><tr><th>UE 图宽度</th><th>UE 图中元素宽度</th></tr></thead><tbody><tr><td>640px</td><td>100px</td></tr><tr><td>480px</td><td>75px</td></tr><tr><td>320px</td><td>50px</td></tr></tbody></table>

下面的表格是通过我们的元素在不同屏幕宽度下的计算值

<table><thead><tr><th>页面宽度</th><th>html 字体大小</th><th>p 元素宽度</th></tr></thead><tbody><tr><td>640px</td><td>640/100 = 6.4px</td><td>15.625*6.4=100px</td></tr><tr><td>480px</td><td>480/100=4.8px</td><td>15.625*4.8=75px</td></tr><tr><td>320px</td><td>320/100=3.2px</td><td>15.625*3.2=50px</td></tr></tbody></table>

可以发现，UE 图宽度和屏幕宽度相同时，两边得出的元素宽度是一致的

上面的计算过程有些繁琐，可以通过预处理的 function 来简化过程，下面是 sass 的例子，less 类似

```
p {width: 15.625rem}
```

上面的代码编译完的结果如下

其实有了 postcss 后，这个过程应该放到 postcss 中，源代码如下

postcss 会对 px2rem 这个单位进行处理，处理后的结果如下，感兴趣的话来写一个 px2rem 的 postcss 插件吧

比 Rem 更好的方案
-----------

上面提到想让页面元素随着页面宽度变化，需要一个新的单位 x，x 等于屏幕宽度的百分之一，css3 带来了 rem 的同时，也带来了 vw 和 vh

> vw —— 视口宽度的 1/100；vh —— 视口高度的 1/100 —— MDN

聪明的你也许一经发现，这不就是单位 x 吗，没错根据定义可以发现 1vw=1x，有了 vw 我们完全可以绕过 rem 这个中介了，下面两种方案是等价的，可以看到 vw 比 rem 更简单，毕竟 rem 是为了实现 vw 么

```
$ue-width: 640; /* ue图的宽度 */

@function px2rem($px) {
  @return #{$px/$ue-width*100}rem;
}

p {
  width: px2rem(100);
}
```

vw 还可以和 rem 方案结合，这样计算 html 字体大小就不需要用 js 了

```
p {width: 15.625rem}
```

虽然 vw 各种优点，但是 vw 也有缺点，首先 vw 的兼容性不如 rem 好，使用之前要看下

<table><thead><tr><th>兼容性</th><th>Ios</th><th>安卓</th></tr></thead><tbody><tr><td>rem</td><td>4.1+</td><td>2.1+</td></tr><tr><td>vw</td><td>6.1+</td><td>4.4+</td></tr></tbody></table>

另外，在使用弹性布局时，一般会限制最大宽度，比如在 pc 端查看我们的页面，此时 vw 就无法力不从心了，因为除了 width 有 max-width，其他单位都没有，而 rem 可以通过控制 html 根元素的 font-size 最大值，而轻松解决这个问题

Rem 不是银弹
--------

rem 是弹性布局的一种实现方式，弹性布局可以算作响应式布局的一种，但响应式布局不是弹性布局，弹性布局强调等比缩放，100% 还原；响应式布局强调不同屏幕要有不同的显示，比如媒体查询

> 用户选择大屏幕有两个几个出发点，有些人想要更大的字体，更大的图片，比如老花眼的我；有些人想要更多的内容，并不想要更大的图标；有些人想要个镜子。。。——颜海镜

我认为一般内容型的网站，都不太适合使用 rem，因为大屏用户可以自己选择是要更大字体，还是要更多内容，一旦使用了 rem，就剥夺了用户的自由，比如百度知道，百度经验都没有使用 rem 布局；一些偏向 app 类的，图标类的，图片类的，比如淘宝，活动页面，比较适合使用 rem，因为调大字体时并不能调大图标的大小

rem 可以做到 100% 的还原度，但同事 rem 的制作成本也更大，同时使用 rem 还有一些问题，下面我们一一列举下：

首先是字体的问题，字体大小并不能使用 rem，字体的大小和字体宽度，并不成线性关系，这个函数我还没算出来，所以字体大小不能使用 rem；由于设置了根元素字体的大小，会影响所有没有设置字体大小的元素，因为字体大小是会继承的，难道要每个元素都显示设置字体大小？？？

我们可以在 body 上做字体修正，比如把 body 字体大小设置为 16px，但如果用户自己设置了更大的字体，此时用户的设置将失效，比如合理的方式是，将其设置为用户的默认字体大小

```
p {width: 100px2rem}
```

那字体的大小如何实现响应式呢？可以通过修改 body 字体的大小来实现，同时所有设置字体大小的地方都是用 em 单位，对就是 em，因为只有 em 才能实现，同步变化，我早就说过 em 就是为字体而生的

当然不同屏幕字体大小相同也是非常合理和不错的效果，需要你自己做决策

```
p {width: 15.625rem}
```

第二，如果用户在 PC 端浏览，页面过宽怎么办？一般我们都会设置一个最大宽度，大于这个宽度的话页面居中，两边留白

```
/* rem方案 */
html {fons-size: width / 100}
p {width: 15.625rem}

/* vw方案 */
p {width: 15.625vw}
```

设置 body 的宽度为 100rem，并水平居中

```
html {fons-size: 1vw} /* 1vw = width / 100 */
p {width: 15.625rem}
```

第三，如果用户禁用了 js 怎么破？其实这种用户真不多了，要不放弃吧。。。

首先可以添加 noscript 标签提示用户

```
html {fons-size: width / 100}
body {font-size: 16px}
```

给 html 添加一个 320 时的默认字体大小，保证页面可以显示

如果你想要更好的体验，不如添加媒体查询吧

```
@media screen and (min-width: 320px) {
    body {font-size: 16px}
}
@media screen and (min-width: 481px) and (max-width:640px) {
    body {font-size: 18px}
}
@media screen and (min-width: 641px) {
    body {font-size: 20px}
}

p {font-size: 1.2em}
p a {font-size: 1.2em}
```

rem 不是银弹，这个世上也没有银弹，每个方案都有其优点，也有其缺点，学会做出选择和妥协

rem 仅能做到内容的缩放，但是对于非矢量资源，比如图片放大时的失真，并无法解决，这个以后有缘再讨论。

Rem 布局方案
--------

通过上面可以得出实现缩放布局，共有四种方案，下面做一个对比

<table><thead><tr><th>缩放布局</th><th>用户体验</th><th>兼容性</th><th>依赖 js</th><th>超大屏幕</th><th>修正字体</th></tr></thead><tbody><tr><td>rem+media-query</td><td>可</td><td>IOS4.1 AN2.1</td><td>√</td><td>√</td><td>×</td></tr><tr><td>rem+js</td><td>良</td><td>IOS4.1 AN2.1</td><td>×</td><td>√</td><td>×</td></tr><tr><td>rem+vw</td><td>优</td><td>IOS6.1 AN4.4</td><td>√</td><td>√</td><td>×</td></tr><tr><td>vw</td><td>优</td><td>IOS6.1 AN4.4</td><td>√</td><td>×</td><td>√</td></tr></tbody></table>

如果要求兼容性，建议 rem+js 方案，需要解决的问题如下：

*   修正 body 字体大小
    
*   浏览器禁用 js（可选）
*   宽度限制，超大屏幕居中（可选）
*   字体缩放（可选）

如果兼容性满足，建议使用 rem+vw 方案，需要解决的问题如下：

*   修正 body 字体大小
*   宽度限制，超大屏幕居中（可选）
*   字体缩放（可选）

但是上面的方案还有个问题，就是分成 100 份的话，假设屏幕宽度 320，此时 html 大小是 3.2px，但浏览器支持最小字体大小是 12px，怎么办？那就分成 10 份呗，只要把上面的 100 都换成 10 就好了

下面给一个 rem+js 方案的完整例子，css 的计算没有使用预处理器，这个很简单

html 代码如下

```
var clientWidth = document.documentElement.clientWidth;
clientWidth = clientWidth < 780 ? clientWidth : 780;
document.documentElement.style.fontSize = clientWidth / 100 + 'px';
```

css 代码如下

```
body {
    margin: auto;
    width: 100rem
}
```

js 代码如下

```
<noscript>开启JavaScript，获得更好的体验</noscript>
```

完整的例子如下

*   [rem+js 的例子](http://yanhaijing.com/rem/rem-and-js.html)
*   [rem+vw 的例子](http://yanhaijing.com/rem/rem-and-vw.html)
*   [vw 的例子](http://yanhaijing.com/rem/vw.html)

页面效果如下

![](https://yanhaijing.com/blog/520.png)

总结
--

如果对本文有什么疑问，欢迎留言讨论；如果觉得本文对你有帮助，那就赶紧赞赏吧，^_^

最后填一下开头埋的雷吧，demo 在[这里](http://yanhaijing.com/rem/demo.html)，代码如下

```
html {fons-size: 3.2px}
```

```
@media screen and (min-width: 320px) {
    html {font-size: 3.2px}
}
@media screen and (min-width: 481px) and (max-width:640px) {
    html {font-size: 4.8px}
}
@media screen and (min-width: 641px) {
    html {font-size: 6.4px}
}
```

先来看第一组的答案

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta >

    <title>rem布局——rem+js</title>
</head>
<body>
    <noscript>开启JavaScript，获得更好的体验</noscript>

    <div class="p1">
        宽度为屏幕宽度的50%，字体大小1.2em
        <div class="s1">
            字体大小1.2.em
        </div>
    </div>

    <div class="p2">
        宽度为屏幕宽度的40%，字体大小默认
        <div class="s2">
            字体大小1.2em
        </div>
    </div>
</body>
</html>
```

和你的答案一样吗？下面来解释下

*   p1 无需解释
*   s1 em 作为字体单位，相对于父元素字体大小；line-height 继承父元素计算值
*   s2 em 作为行高单位时，相对于自身字体大小

再来看看第二组的答案

```
html {
    font-size: 32px; /* 320/10 */
}
body {
    font-size: 16px; /* 修正字体大小 */
    /* 防止页面过宽 */
    margin: auto;
    padding: 0;
    width: 10rem;
    /* 防止页面过宽 */
    outline: 1px dashed green;
}

/* js被禁止的回退方案 */
@media screen and (min-width: 320px) {
    html {font-size: 32px}
    body {font-size: 16px;}
}
@media screen and (min-width: 481px) and (max-width:640px) {
    html {font-size: 48px}
    body {font-size: 18px;}
}
@media screen and (min-width: 641px) {
    html {font-size: 64px}
    body {font-size: 20px;}
}

noscript {
    display: block;
    border: 1px solid #d6e9c6;
    padding: 3px 5px;
    background: #dff0d8;
    color: #3c763d;
}
/* js被禁止的回退方案 */

.p1, .p2 {
    border: 1px solid red;
    margin: 10px 0;
}

.p1 {
    width: 5rem;
    height: 5rem;

    font-size: 1.2em; /* 字体使用em */
}

.s1 {
    font-size: 1.2em; /* 字体使用em */
}

.p2 {
    width: 4rem;
    height: 4rem;
}
.s2 {
    font-size: 1.2em /* 字体使用em */
}
```

意不意外？惊不惊喜？下面来解释下

*   p2 `line-height: 2`自身字体大小的两倍
*   s5 数字无单位行高，继承原始值，s5 的 line-height 继承的 2，自身字体大小的两倍
*   s6 无需解释

相关资料
----

*   [使用 CSS3 REM 和 VW 打造等比例响应式页面的便捷工作流](https://zhuanlan.zhihu.com/p/23968868)
*   [从网易与淘宝的 font-size 思考前端设计稿与工作流](http://www.cnblogs.com/lyzg/p/4877277.html)
*   [移动 web 适配之 rem](https://www.nihaoshijie.com.cn/index.php/archives/593/)
*   [使用 rem 提供一致的字体大小](http://harttle.com/2016/12/20/rem-and-accessibility.html)
*   [再聊移动端页面的适配](http://www.w3cplus.com/css/vw-for-layout.html)
*   [使用 Flexible 实现手淘 H5 页面的终端适配](http://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)

原文网址：[http://yanhaijing.com/css/2017/09/29/principle-of-rem-layout/](http://yanhaijing.com/css/2017/09/29/principle-of-rem-layout/)

<aside class="chat-adver"> <strong > 手把手教你，大型项目如何接入 ES6，微信扫码了解 </strong> <figure> <img src="/img/chat.png" alt="微信公众号：颜海镜" width="400" height="206"> </figure> </aside>