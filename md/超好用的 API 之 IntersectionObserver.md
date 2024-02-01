> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903874302574599?searchId=202402012325316CE94CF6E1922963D4F6)

IntersectionObserver
--------------------

这是个还在草案中的 API，不过大部分浏览器均已实现（除了 IE）。先看下 MDN 中的介绍：

> IntersectionObserver 接口提供了一种异步观察目标元素与祖先元素或顶级文档 [viewport](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fviewport "https://developer.mozilla.org/en-US/docs/Glossary/viewport") 的交集中的变化的方法。祖先元素与视窗 viewport 被称为**根 (root)。**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdcedfbbf1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

不知大家有没有发现随着网页发展，对**检测某个（些）元素是否出现在可视窗**相关的需求越来越多了？比如：

*   当页面滚动时，懒加载图片或其他内容。
*   实现 “可无限滚动” 网站，也就是当用户滚动网页时直接加载更多内容，无需翻页。
*   对某些元素进行埋点曝光
*   滚动到相应区域来执行相应动画或其他任务。

一直以来，检测元素的可视状态或者两个元素的相对可视状态都不是件容易事，大部分解决办法并不完全可靠，实现方式很丑陋，也极易拖慢整个网站的性能。

**IntersectionObserver 正因此而生**

### API 解读：

#### 1. 用法

是以`new`的形式声明一个对象，接收两个参数`callback`和`options`

```
const io = new IntersectionObserver(callback, options)

io.observe(DOM)
```

```
const options = {
  root: null,
  rootMargin: 0,
  thresholds: 1,
}
const io = new IntersectionObserver(entries => {
  console.log(entries)
  // Do something
}, options)
```

#### 2.callback

callback 是添加监听后，当监听目标发生滚动变化时触发的回调函数。接收一个参数 entries，即 IntersectionObserverEntry 实例。描述了目标元素与 root 的交叉状态。具体参数如下：

<table><thead><tr><th>属性</th><th>说明</th></tr></thead><tbody><tr><td>boundingClientRect</td><td>返回包含目标元素的边界信息，返回结果与 element.getBoundingClientRect() 相同</td></tr><tr><td><strong>intersectionRatio</strong></td><td>返回目标元素出现在可视区的比例</td></tr><tr><td>intersectionRect</td><td>用来描述 root 和目标元素的相交区域</td></tr><tr><td><strong>isIntersecting</strong></td><td>返回一个布尔值，下列两种操作均会触发 callback：1. 如果目标元素出现在 root 可视区，返回 true。2. 如果从 root 可视区消失，返回 false</td></tr><tr><td>rootBounds</td><td>用来描述交叉区域观察者 (intersection observer) 中的根.</td></tr><tr><td>target</td><td>目标元素：与根出现相交区域改变的元素 (Element)</td></tr><tr><td>time</td><td>返回一个记录从 IntersectionObserver 的时间原点到交叉被触发的时间的时间戳</td></tr></tbody></table>

表格中加粗的两个属性是比较常用的判断条件：**isIntersecting** 和 **intersectionRatio**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdd043b259~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

#### 3.options

options 是一个对象，用来配置参数，也可以不填。共有三个属性，具体如下：

<table><thead><tr><th>属性</th><th>说明</th></tr></thead><tbody><tr><td>root</td><td>所监听对象的具体祖先元素。如果未传入值或值为<code>null</code>，则默认使用顶级文档的视窗 (一般为 html)。</td></tr><tr><td>rootMargin</td><td>计算交叉时添加到<strong>根 (root)<strong> 边界盒 <a target="_blank" title="https://developer.mozilla.org/en-US/docs/Glossary/bounding_box" href="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fbounding_box" ref="nofollow noopener noreferrer">bounding box</a> 的矩形偏移量，&nbsp;可以有效的缩小或扩大根的判定范围从而满足计算需要。所有的偏移量均可用</strong>像素</strong> (<code>px</code>) 或<strong>百分比</strong> (<code>%</code>) 来表达, 默认值为 "0px 0px 0px 0px"。</td></tr><tr><td>threshold</td><td>一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会触发 callback。默认值为 0。</td></tr></tbody></table>

#### 4. 方法

介绍了这么多配置项及参数，差点忘了最重要的，IntersectionObserver 有哪些方法？ 如果要监听某些元素，则必须要对该元素执行一下 observe

<table><thead><tr><th>方法</th><th>说明</th></tr></thead><tbody><tr><td>observe()</td><td>开始监听一个目标元素</td></tr><tr><td>unobserve()</td><td>停止监听特定目标元素</td></tr><tr><td>takeRecords()</td><td>返回所有观察目标的 IntersectionObserverEntry 对象数组</td></tr><tr><td>disconnect()</td><td>使 IntersectionObserver 对象停止全部监听工作</td></tr></tbody></table>

### 应用：

#### 1. 图片懒加载

```
const imgList = [...document.querySelectorAll('img')]

var io = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // isIntersecting是一个Boolean值，判断目标元素当前是否可见
    if (item.isIntersecting) {
      item.target.src = item.target.dataset.src
      // 图片加载后即停止监听该元素
      io.unobserve(item.target)
    }
  })
}, {
  root: document.querySelector('.root')
})

// observe遍历监听所有img节点
imgList.forEach(img => io.observe(img))
```

#### 2. 埋点曝光

假如有个需求，对一个页面中的特定元素，只有在其完全显示在可视区内时进行埋点曝光。

```
const boxList = [...document.querySelectorAll('.box')]

var io = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // intersectionRatio === 1说明该元素完全暴露出来，符合业务需求
    if (item.intersectionRatio === 1) {
      // 。。。 埋点曝光代码
      io.unobserve(item.target)
    }
  })
}, {
  root: null,
  threshold: 1, // 阀值设为1，当只有比例达到1时才触发回调函数
})

// observe遍历监听所有box节点
boxList.forEach(box => io.observe(box))
```

#### 3. 滚动动画

用上面的例子随便写了一个，太丑勿喷

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/25/16b8d8fdd0bba525~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

**总之，这是一个相当方便好用的 API！**

参考链接🔗

[MDN: IntersectionObserver](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FIntersectionObserver "https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver")

[MDN: IntersectionObserverEntry](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FIntersectionObserverEntry "https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry")