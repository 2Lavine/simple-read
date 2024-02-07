> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [moxo.io](https://moxo.io/blog/2016/05/05/%E7%BF%BB%E8%AF%91rendering-repaint-reflow-relayout-restyle/)

> 《Rendering: repaint, reflow/relayout, restyle》的中文翻译

原文链接：[《Rendering: repaint, reflow/relayout, restyle》](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)

标题中的五个字母「R」是不是有点吓人？今天我们来讨论一下，在 [Life of Page 2.0](http://www.phpied.com/the-performance-roadmap/) 中产生的一个词，之后出现在下载组件（components）时的浏览器渲染（rendering）。 （更确切一些，是想讨论）在浏览器接受到一堆 HTML、CSS 或者有时候存在的 JavaScript 时候，浏览器是如何将这些内容显示在屏幕上的。

浏览器渲染过程（The rendering process）
------------------------------

不同的浏览器的处理过程并不一致，但一定会有大家都会遵从统一的地方，下面这张图表就把这个过程作了总结，各家的浏览器接收到代码之后，多多少少都会按照这个步骤将代码转化成显示器上的网页。

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/render.png)

*   浏览器解析首先解析 HTML 代码，将其所有转化成一个我们所熟悉的树形的文档对象模型（DOM tree）：每一个 HTML 标签都活得一个对应的 node，而 text 内容则被转换成 text node。树形的根部（the root node）则是 `documentElement` （`<html>` 标签）。
    
*   接着，浏览器开始处理 CSS 样式表文件。当遇到浏览器自己不认识的前缀定义的样式（`-moz-`、`-webkit-` 等各家浏览器自己预定义的样式）的时候，会直接被忽略。样式信息就和名称中的「层叠（cascade）」一次所指的一样，是层叠的。基本的层叠规则是：每家浏览器自己的默认样式，也就是 `user-agent` 样式，之后是用户自己和页面制作者的各种样式信息，这些样式信息通过外部（external，`<link>` 标签引入的）、引入（CSS 文件中的 `@import`）、行内，或者直接在 HTML 标签内使用属性 `style=""` 的方法写入；
    
*   完成了上面两部，之后一步就有有意思了，来到了构建渲染树的部分（constructing a render tree）。渲染树有点像是树形的文档对象模型，但也不完全一致。（和文档对象模型不同的是）渲染树本身是知道 CSS 样式表的，所以当对一个 HTML 标签加上了 `display: none` 的样式，渲染树就不会显示（represent）这个 HTML 标签。这一点对例如 `<head>` 标签和它其中的内容也适用，渲染树是知道这些都是隐形的元素（invisible elements）。另一方面，想象 `<p>` 标签里的每一行都是一个 text node，但是在渲染树里，要为买一个 text node 里的每一个行来创建一个渲染节点（render node），这时文档对象模型在渲染树里就是一个一对多的情况（一个 text node 变成很多 render node）。渲染树里的每一个节点（node）被称为一个 frame，或者说一个 box（就像 CSS 中的 box-model）。这里的每一个渲染节点都有类似 CSS 盒模型里的树形，宽度，高度，边框，边距等等；
    
*   当渲染树构建完毕，浏览器就开始将渲染树里（render tree）的每一个渲染节点（render tree node）都会绘制到屏幕上。
    

森林和树（The forest and the trees）
------------------------------

我们以如下这个 HTML 结构来作为一个例子：

```
<html>
<head>
  <title>Beautiful page</title>
</head>
<body>

  <p>
    Once upon a time there was
    a looong paragraph...
  </p>

  <div style="display: none">
    Secret message
  </div>

  <div><img src="..." /></div>
  ...

</body>
</html>
```

例子中的 HTML 结构对应的文档对象模型的树形结构，基本可以认为是：一个标签对应一个节点（node），而每一个标签里的文字部分又对应一个文字节点（text node）（这里忽略到空格其实也是一个 text node 的事实）。

```
documentElement (html)
    head
        title
    body
        p
            [text node]

        div
            [text node]

        div
            img

        ...
```

在这里，渲染树，首先，会是文档对象中的可见部分。它会忽略掉 `<head>` 部分内的内容和其它隐藏的标签。但它也会为多行文字增加一些节点（frame 或者 box）。

```
root (RenderView)
    body
        p
            line 1
	    line 2
	    line 3
	    ...

	div
	    img

	...
```

渲染树的根节点是一个包含其他所有节点的 frame（或者 box），可以把它想象成浏览器的内部（出去边框，工具栏等）的可绘制区域。技术上来说 WebKit 称这个根节点为 RenderView，它对应的了 CSS 中的 initial containing block，而这个 initial containing block 基本上就是浏览器从左上 (0, 0) 一直到右下 (window.innerWidth, window.innerHeight) 的整个可视区域。

渲染书在浏览器上显示的内容到底是什么，并且是怎么显示出来的，需要渲染树不断地循环遍历自己来搞清楚

重绘和回流（Repaints and reflows）
---------------------------

在浏览器打开任何一个网页的时候，都会进行一次绘制（当然，除非是一张空白页面）。在此之后，对构建渲染书的信息进行任何改变都会造成以下两者中的一个或者两者：

*   渲染树的部分或者全部需要重新验证自己并且渲染节点的需要重新计算自己的大小。这个过程被称为回流（reflow），或者 layout，或者 layouting （或者 relayout，这个词作者说是自己造出来为了在标题中的用词统一）。重点是，网页的初始 layout 至少会 reflow 一次。
*   网页里部分的内容需要获得更新，比如一些 node 节点的几何（geometry）信息变化，或者一些类似背景颜色之类的 CSS 样式上的变化。这个更新过程叫做 repaint，或者 redraw。

reflows 和 repaints 的代价是昂贵的，会造成性能损失，同时影响用户体验，而且还会让界面的反应显得迟钝。

什么会触发一个 reflow 或者一个 repaint（What triggers a reflow or a repaint）
----------------------------------------------------------------

对构建渲染书的信息进行任何改变都会造成 repaint 或者 reflow，比如以下的这些操作： - 添加，删除，或者更新 DOM 节点； - 使用 `display: none` 来隐藏一个 DOM 节点会造成 reflow 和 repaint，同时 `visibility: hidden` 只会造成 repaint，因为没有几何（geometry）信息上的变化； - 在网页上将一个 DOM 节点进行移动的操作，或者制作动画； - 添加，调整样式； - 用户的一些操作，比如调整浏览器窗口的大小，改变文字大小，或者，进行页面滚动（scrolling）。

来看一些简单的例子：

```
var bstyle = document.body.style; // 保存 body 的 style 对象

bstyle.padding = "20px"; // 造成回流reflow, 重绘repaint
bstyle.border = "10px solid red"; // another reflow and a repaint

bstyle.color = "blue"; // repaint only, no dimensions changed
bstyle.backgroundColor = "#fad"; // repaint

bstyle.fontSize = "2em"; // reflow, repaint

// new DOM element - reflow, repaint
document.body.appendChild(document.createTextNode('dude!'));
```

一些 reflow 会比另外一些造成更大的性能损失。比如说，如果你调整的是`<body/>` 元素的最后一个直接子级元素（direct descendant），那样就不会让很多别的元素实效（造成 reflow 或者 repaint）。但如果你将页面顶部的一个 `div` 进行动画操作并且将其变大，将之后的所有的元素的位置下压，这听上去对性能的影响就挺大。

聪明的浏览器（Browsers are smart）
--------------------------

正因为渲染树的 repaint 和 reflow 会造成比较大的性能损失，所以浏览器本身也一直在努力将其损失减少到最少。一个减少损失的策略就是，当遇到会造成 reflow 或者 repaint 的操作时，选择不执行，或者，至少不马上执行。不马上执行的意思是，浏览器会在其内部生成一个队列对这些会造成损失的操作进行缓存，到了合适的时机再分批执行。通过这种方式，许多次会造成的 reflow 的操作被合并成一次，结果是只会造成一次 reflow。这里合适的时机往往是缓存操作的列队达到了一定的数量，或者过了间隔了足够长的时间。

但是有些脚本执行的操作则会打破浏览器针对性能损失的优化操作，迫使浏览器立即将当前列队里是操作提取出来、没有批次一口气全部执行。以下这些对元素样式表的查询就会造成这样的结果：

*   offsetTop, offsetLeft, offsetWidth, offsetHeight
*   scrollTop/Left/Width/Height
*   clientTop/Left/Width/Height
*   getComputedStyle(), or currentStyle in IE

例子中的这些样式信息基本上就是对文档模型节点的样式信息，每次对它们进行查询，浏览器必须给你最新的信息。为了获取到这些最新的信息，浏览器必须将所有缓存着的队列操作取出执行完毕，吞了这口大便，强制自己进行 reflow。

比如说，在循环中将获取到（get）的节点信息（通过一些简单的计算）立即赋值（set）到节点身上：

```
// no-no!
el.style.left = el.offsetLeft + 10 + "px";
```

尽可能减少 repaints 和 reflows（Minimizing repaints and reflows）
---------------------------------------------------------

要减少 reflow 或者 repaint 带来的糟糕用户体验的本质方法就是尽量避免会引起 reflow 或者 repaint 的操作，尽可能避免对元素样式信息的查询，帮助浏览器尽可能优化 reflow ，但是如何做到这些，可以从以下几个例子出发：

不要对元素的样式属性一个个的手动修改，更加明智并且好维护的方式是通过封装不同的 class，从而元素在不同的 class 间切换样式，这种方法属于静态样式。如果是动态，可以考虑修改元素的 cssText 属性来修改样式。

```
// bad
var left = 10,
    top = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";

// better
el.className += " theclassname";

// or when top and left are calculated dynamically...

// better
el.style.cssText += "; left: " + left + "px; top: " + top + "px;";
```

*   尽可能选择「离线」的方式来执行批量的 DOM 操作。「离线」 的意思是这些操作执行的时候，被操作的 DOM 脱离 DOM 树，比如：
    
    *   使用 `documentFragment` 对需要操作的 DOM 对象进行收集，然后进行临时处理；
    *   将需要操作的 DOM 元素拷贝一份，针对拷贝的那一份进行操作，完成之后将原始的替换掉；
    *   在对一个 DOM 节点进行操作前，利用 `display: none;` 隐藏它，这会造成一次 reflow 和 一次 repaint，隐藏了之后操作一百次，然后将 `display` 恢复到操作之前的属性值。这么一来就是两次 reflow 而不是一百次。
*   不要集中国度频繁的请求 DOM 节点的样式信息。如果需要浏览器返回一个最新的样式信息来操作样式，比较好的方法是获取到第一次之后，本地做一个变量保存这个值，然后计算本地的变量，以上面获取（get）、操作（set） DOM 节点的例子做一下示范：
    

```
// no-no!
for(big; loop; here) {
    el.style.left = el.offsetLeft + 10 + "px";
    el.style.top  = el.offsetTop  + 10 + "px";
}

// better
var left = el.offsetLeft,
    top  = el.offsetTop
    esty = el.style;
for(big; loop; here) {
    left += 10;
    top  += 10;
    esty.left = left + "px";
    esty.top  = top  + "px";
}
```

*   总之，在操作 DOM 的时候，琢磨一下操作完之后发生的改变有多大，对渲染树来说这些改变造成原始渲染结果实效的比重有多大。比如说将一个 DOM 元素设置为 `position: absolute` 在渲染树中对应的渲染结果是生成了一个 body 的一个子级元素，所以对这个子级元素执行动画操作并不会影响别的元素已经成型的渲染结果。又比如如果将一个元素置于比的元素之上的时候，被覆盖的区域就会需要 repaint，同时这个操作却不会 reflow。

仅仅一年之前也没有任何针对浏览器 repaint 和 reflow 的可视化工具。但现在不同了出现了很多很酷的工具：

首先是 Firefox nightlies 提供了 `MozAfterPaint` 事件，紧接着 Kyle Scholz 就开发出了这个插件。mozAfterPaint 非常 cool，但只能测试 repaints。

Google 提供了 [SpeedTracer](https://code.google.com/webtoolkit/speedtracer/))，IE 提供了 [DynaTrace Ajax](http://ajax.dynatrace.com/pages/download/download.aspx)。这两个工具都可以帮助测试 repaints 和 reflow。

去年 Douglas Crockford 提到，包括我自己在内，总是对一些不太了解的 CSS 做一些愚蠢的事情。我加入的一个项目组的研究现象就是：在 IE6 中增大 font-size 会引起 CPU 占用率到达 100%，持续 10 到 15 分钟之后，IE 6 才会完成 repaint。

有了这些工具的帮助，在我们的工作中这些愚蠢的事情就不会发生了。

其实如果有一个可以像 Firebug 查看 DOM 树一样的工具来查看渲染树，是不是非常 cool？

最后，给一个更加完整的例子（A final example）
------------------------------

接下来用实例来过一遍如何使用工具证明 restyle（没有几何变化）、reflow（影响 layout）和 repaint（重绘），并且观察这三者之间的区别。

比较的方法就是对比完成一个操作的两种方法。第一个方法，只是改变一些样式（不影响布局），在每一次样式改变之后，再去获取完全没有被改变过的样式属性信息。

```
bodystyle.color = 'red';
tmp = computed.backgroundColor;
bodystyle.color = 'white';
tmp = computed.backgroundImage;
bodystyle.color = 'green';
tmp = computed.backgroundAttachment;
```

之后，在改变了样式信息之后，再去获取样式属性信息：

```
bodystyle.color = 'yellow';
bodystyle.color = 'pink';
bodystyle.color = 'blue';

tmp = computed.backgroundColor;
tmp = computed.backgroundImage;
tmp = computed.backgroundAttachment;
```

```
var bodystyle = document.body.style;
var computed;
if (document.body.currentStyle) {
  computed = document.body.currentStyle;
} else {
  computed = document.defaultView.getComputedStyle(document.body, '');
}
```

测试里样式的改变通过 click 事件来触发，测试页面在 [restyle.html](http://www.phpied.com/files/reflow/restyle.html)（点击「dude」），名叫「restyle 测试」。

第二个测试基本和第一个测试一致，但这次我们会修改那些能够导致页面布局产生变化的信息：

```
// touch styles every time
bodystyle.color = 'red';
bodystyle.padding = '1px';
tmp = computed.backgroundColor;
bodystyle.color = 'white';
bodystyle.padding = '2px';
tmp = computed.backgroundImage;
bodystyle.color = 'green';
bodystyle.padding = '3px';
tmp = computed.backgroundAttachment;

// touch at the end
bodystyle.color = 'yellow';
bodystyle.padding = '4px';
bodystyle.color = 'pink';
bodystyle.padding = '5px';
bodystyle.color = 'blue';
bodystyle.padding = '6px';
tmp = computed.backgroundColor;
tmp = computed.backgroundImage;
tmp = computed.backgroundAttachment;
```

这个测试在名叫「relayout 测试」，地址在[这里](http://www.phpied.com/files/reflow/relayout.html)。

在 DynaTrace 中对这个 restyle 测试的可视化结果： ![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/dyna1.png)

测试的过程很简单，当页面加载完毕之后，先点击一下按钮「dude」（即每次修改完样式之后就查询样式信息，差不多 2 秒），完成之后再点击一次来触发第二个方案（即完成所有样式修改完后再进行查询，在差不多第四秒的时候）。

工具（DynaTrace）会显示整个页面的绘制过程。把鼠标悬停在点击事件之后的渲染部分，放大想要追踪的区域就可以看到更加详细的信息：

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/dyna2.png)

现在就可以非常清晰地看到，蓝色色块所表示的 JavaScript 的执行时间，和之后绿色色块所表示的渲染时间。虽然这只是一个非常简单的例子，但是渲染时间对比 JavaScript 的执行时间的结果仍旧非常值得注意—渲染的时间很长。在 Ajax 驱动的 rich web app 中，JavaScript 往往并不是瓶颈，真正的短板都在 DOM 的操作和渲染部分。

现在来做第二个会改变 `<body>` 几何属性信息 relayout 测试，在 DynaTrace 中切换到「PurePaths」视图。这里会使用时间线加信息的方式展示网页加载的过程。我在图中高亮的部分是第一次点击，是 JavaScript 在这里执行完了点击之后造成的 layout。

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/dyna3.png)

将视图放大，就可以清晰地看到「绘制」部分，而且，在它之前多了一个新的部分，叫做「计算流布局（calculating flow layout）」，因为在这次测试中，同时出发了 repaint 和 reflow。

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/dyna4.png)

接着，我们在 Chrome 的 SpeedTracer 里进行测试。

下面这幅图展示的是 restyle 测试第一部分的过程：

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/speedtracer3.png)

总的来说，一次点击事件之后就会跟着一个 repaint。但是在第一次点击之后，会有多 50% 的时间来进行样式信息的重新计算，这是因为，当每次信息改变之后，我们都进行了重新获取。

展开详细信息之后，可以看到到底其中发生了什么：在第一次点击之后，样式信息被计算了三次，在第二次点击之后，样式信息只被计算了一次。

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/speedtracer4.png)

接着是运行 relayout 测试，结果大致上和之前使用 DynaTrace 的结果一致：

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/speedtracer1.png)

但是详情视图展示了为什么第一次点击事件导致了三次 reflow（因为我们查询了三次样式信息），同时也展示了第二次点击只遭致了一次 reflow。不得不说，这些工具使得观察在浏览器中具体发生了什么变得如此简单实在是非常棒。

![](https://moxo.io/assets/2016-05-05-translation-rendering-repaint-reflow-relayout-restyle/speedtracer2.png)

DynaTrace 和 SpeedTrcer 的区别在于：前者会显示 layout 行为被执行和加入执行队列的详细时间，而 SpeedTracer 不会；SpeedTracer 会将 restyle 与 reflow/layout 两种浏览器行为区别开，而 DynaTrace 不会。难道 IE 不会区分这两种行为？另外，在两种不同的测试方法 change-end-touch 与 change-then-touch 中，DynaTrace 不会显示三次 reflow 而仅仅只显示了一次，难道 IE 浏览器的工作机制本就如此？

把上述的例子运行上百遍可以证明：即使改变样式信息之后去请求新的样式，IE 也不会 care。

经过一番测试后，可以对不同浏览器作出以下结论：

*   在 Chrome 之中，在修改了样式信息之后不进行查询（或者是全部修改完了之后进行统一检查），restyle 测试快 2.5 倍，relayout 测试快 4.2 倍；
*   Firefox 中，restyle 测试快 1.87 倍，relayout 测试快 1.64 倍
*   IE6 和 IE8 无所谓。

经过对大多数的浏览器的测试之后，发现： 如果只修改样式信息所需要的时间，往往是既修改样式也触发了 relayout 所开销的时间的一半（既然我写到了，我也应该对比一下只改变样式和只改变的 layout 的时间对比）。除了 IE6，在 IE6 之中，仅仅修改 layout 的操作造成的性能损失，是紧紧修改样式的 4 倍。

最后的话（Parting Words）
-------------------

最后十分感谢大家抱着耐心讲这篇长文读完。希望各位能够使用文中提到的工具在工作中尝试优化自己的页面，尽可能避免 reflow，repaint。最后我们把关键术语再在这里梳理一遍：

*   渲染树 - DOM 树的可视化部分；
*   渲染树中的 node 节点，被称为 frame 或者 box；
*   渲染树中部分被进行重新计算被 Mozila 称为 reflow （回流），别的浏览器被称作 layout（布局）；
*   渲染树中部分被进行了重新计算，从而造成屏幕上的内容被更新，被称为 repaint，或者在 IE 的 DynaTrace 插件里被称为 redraw；
*   SpeedTracker 将没有设计几何计算的样式重新计算称为 「样式重新计算」，以此来和 layout 的概念区分开。

最后的最后是一些衍生阅读。不过需要说明的是，尤其是前面三篇，与我写的这篇不同的是，我认为我这篇是介绍给开发者和开发者息息相关的内容，而这三篇内容更偏向于浏览器实现层面。

*   Mozilla: [notes on reflow](http://www.mozilla.org/newlayout/doc/reflow.html)
*   David Baron of Mozilla: Google tech talk on [Layout Engine Internals for Web Developers](https://www.youtube.com/watch?v=a2_6bGNZ7bA)
*   WebKit: [rendering basics](http://webkit.org/blog/114/webcore-rendering-i-the-basics/) - 6-part series of posts
*   Opera: [repaints and reflows](http://dev.opera.com/articles/view/efficient-javascript/?page=3#reflow) is a part of an article on efficient JavaScript
*   Dynatrace: [IE rendering behavior](http://blog.dynatrace.com/2009/12/12/understanding-internet-explorer-rendering-behaviour/)