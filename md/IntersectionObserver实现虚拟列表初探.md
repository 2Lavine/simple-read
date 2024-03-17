> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7158607083699437605?searchId=202402012325316CE94CF6E1922963D4F6)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfefad3ee3474e3a8a461251aaddceb4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdb140efc78b4c28a84a70654794b122~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 这是第 162 篇不掺水的原创，想获取更多原创好文，请搜索公众号关注我们吧~ 本文首发于政采云前端博客：[IntersectionObserver 实现虚拟列表初探](https://link.juejin.cn?target=http%3A%2F%2Fzoo.zhengcaiyun.cn%2Fblog%2Farticle%2Fintersectionobserver "http://zoo.zhengcaiyun.cn/blog/article/intersectionobserver")

前言
--

前端开发中经常会遇到大数据量列表展示的性能问题，即大数据量一次性展示时前端渲染大量 Dom，触发渲染性能问题，造成初始加载白屏，交互卡顿等。解决这类问题的方案也有很多，使用虚拟列表展示是一个比较常见的解决方案。今天我们来介绍如何使用 IntersectionObserver 这个 API 来自定义实现虚拟列表。

传统列表
----

在未使用虚拟列表之前，传统列表很难处理大量数据的渲染问题，常出现以下情况：

*   列表数据渲染时间长甚至出现白屏
*   列表交互卡顿

为了解决该类问题，我们可以选用虚拟列表来承载大量数据的渲染，增强用户体验，`IntersectionObserver API` 作为浏览器原生的 API 可以做到 “观察” 所需元素是否需要在页面上显示，以此来对大量数据的渲染进行优化。

虚拟列表
----

在介绍 IntersectionObserver 之前，我们先简单介绍下虚拟列表概念。前面已经提到，页面的性能问题是由于太多数据渲染展示引起的。但一个页面总共就那么大，人一屏能浏览的内容就这么多，如果我们可以只渲染展示当前可见区域内的内容，当内容已出可见区域外时只作简单渲染，这样不就可以大大提高页面性能了吗？虚拟列表就是这个思路的实现

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b32d6a17d9af4c6292518288cf2ea51b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

传统的实现方案
-------

根据刚才的介绍我们知道，关键是要计算出哪些 dom 出现在可视区域需要实际渲染，哪些在视野外只需简单渲染。传统方法一般是监听 scroll, 在回调方案中 手动计算偏移量然后计算定位，由于 scroll 事件密集发生，计算量很大，容易造成性能问题。另外如果行行高不固定（实际业务中往往需要这样）, 那计算将会更加复杂。

自己观察不难发现，所有的这些计算都是为了判断一个 dom 是否在可视范围内，如果存在一个方法可以方便地让我们知道这点，那实现虚拟列表方案将大大简化。幸运的是目前大部分浏览器已经提供了这个 api——IntersectionObserver

IntersectionObserver 介绍
-----------------------

IntersectionObserver 接口 (从属于 Intersection Observer API) 提供了一种异步观察目标元素与其祖先元素或顶级文档视窗 (viewport) 交叉状态的方法。祖先元素与视窗 (viewport) 被称为根 (root)。

当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

示例

```
var intersectionObserver = new IntersectionObserver(function(entries) {
  // If intersectionRatio is 0, the target is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) return;

  loadItems(10);
  console.log('Loaded new items');
});
// start observing
intersectionObserver.observe(document.querySelector('.scrollerFooter'));
```

可以看到用法很简单：

1.  首先 new IntersectionObserver 构造函数，这个函数接受两个参数：callback 是可见性变化时的回调函数，option 是配置对象（该参数可选）, 然后就得到一个观察器实例
2.  调用实例的 observe 方法对目标 dom 元素进行监听
3.  在回调函数 callback 中拿到 entries， entries 是一个数组，里面每个成员都是一个 IntersectionObserverEntry 对象，监听了几个元素， entries 就包含了几个成员。IntersectionObserverEntry 对象描述了目标对象与容器之前的相交信息。其中 intersectionRatio 目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0。在这里我们取 entries[0].intersectionRatio 来判断目标元素是否在视野中, 大于 0 代表在视野中，小于 0 表示已移出视野。

使用 IntersectionObserver 实现虚拟列表方案
--------------------------------

#### 基本思路

1.  实例化配置一个观察器，在这里除了传入回调函数外我们还会传入配置项： config = {root: document.querySelector('.main'), } 这样我们就设置了 class 为 main 的 dom 元素为容器
2.  监听列表的每一行元素
3.  在回调函数中拿到每一个行元素的 intersectionRatio，一次判断是否在可是区域内。如果进入视野则给这一行附上实际的数据进行渲染，如果移出视野则将这一行的数据置为空。此外为了定位准确，我们在元素移出视野时给一个实际渲染时的高度。

简化示例代码如下：

```
<div class="main">
     <div v-for="(row, index0) in uiPeriodList" :key="index0">
         <div class="period" :style="periodStyle">
            <div
              v-for="(column, index1) in row.columnList"
              :key="column.id"
            >
                /* 详细展示元素 */
            </div>
          </div>
      </div>
  </div>
```

```
update() {
    let rolwList = document.querySelectorAll('.period')
    let _this = this
    let config = {
        root: document.querySelector('.main'),
    }
    let intersectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach((row)=> {
            if (row.intersectionRatio <= 0) {
                if (!_this.isFirst) {
                    row.target.style.height = `${row.target.clientHeight}px`
                }
                _this.uiPeriodList[index].coordList = []
            } else {
                row.target.className = 'period'
                row.target.style.height = ''
                _this.uiPeriodList[index].columnList = _this.periodList[index].columnList // 附上实际元素
            }
        })
    }, config)
    if (this.isFirst) {
        rowList.forEach((row, index) => {
            intersectionObserver.observe(row)
    	})
        this.isFirst = false
    }
}
```

#### 没有效果

当按照上面实现后，实际测试却发现并没有达到预想效果，初始加载时仍然非常缓慢，出现长时间白屏。 这是为什么呢？打印发现，初始时每一行的元素都进入了视野中，触发了附上实际数据的动作从而引发渲染。 怀疑是初始加载元素时没有实际内容，导致大量的行元素没有高度而一下子直接进入了视野区，进而触发大数据量渲染。 为了解决这个问题，我们在初始时给行元素设置一个非常大的行高，使得在视野中只存在一行，然后对这一行附上实际数据，去除行高样式，使行的高度由实际内容决定。这样可以使各个行依次进入视野，逐个渲染直到实际的高度的行元素撑满视野

```
created() {
    this.periodStyle = {
        'grid-template-columns': `52px repeat(${this.headList.length}, 1fr)`,
        height: '2000px',
    }
}
```

```
let intersectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach((row)=>{
        if (row.intersectionRatio <= 0) {
            if (!_this.isFirst) {
                row.target.style.height = `${row.target.clientHeight}px`
            }
            _this.uiPeriodList[index].coordList = []
        } else {
            row.target.style.height = ''
            _this.uiPeriodList[index].columnList = _this.periodList[index].columnList // 附上实际元素
       }
   })
}, config)
```

再试一下，问题解决

#### 快速下拉出现空白行

解决了上面的问题，我们的虚拟列表方案已基本实现，但还有瑕疵。当我们快速滚动列表时有可能出现空白区域，原因是监听回调是异步触发，不随着目标元素的滚动而触发，这样性能消耗很低，但也会导致回调函数没有执行，导致出现在视野中的元素但没有附上实际数据。

自然地我们想到增加冗余量来解决这个问题，在行元素还没出现在视野当中时就附上实际数据进行渲染。查看发现在初始化 IntersectionObserver 可以传入配置项 rootMargin, rootMargin 定义根元素的 margin，用来扩展或缩小 rootBounds 这个矩形的大小，从而影响 intersectionRect 交叉区域的大小。这样就变相地达成在视野单位外就进行数据实际渲染的目的

```
let config = {
    root: document.querySelector('.main'),
    rootMargin: '100px 0px',
}
```

再试，问题基本解决

方案对比
----

由下图我们能看到，目前主流浏览器新版本基本都支持了这个 API， 但老版本及 IE 不支持 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00bb2493557401aa5f05b260b80aea1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

传统的监听 scroll 方案性能消耗大，交汇计算复杂，但浏览器兼容性高。 而 IntersectionObserver 异步特性降低了提高了性能且实现简便，但相应的兼容性较差些。

结语
--

虚拟列表是解决大数据量列表渲染的有效方案。对于实际业务中对老版本浏览器兼容性要求不高的场景，大家可以考虑使用 IntersectionObserver，可以方便地实现自定义的虚拟列表。

##### 参考资料

*   [MDN: IntersectionObserver](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FIntersection_Observer_API "https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API")
*   [阮一峰博客](https://link.juejin.cn?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2016%2F11%2Fintersectionobserver_api.html "https://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html")

推荐阅读
----

[所见即所得 —— HTML 转图片组件开发](https://juejin.cn/post/7153410606673395725 "https://juejin.cn/post/7153410606673395725")

[探索组件在线预览和调试](https://juejin.cn/post/7145604963593355277 "https://juejin.cn/post/7145604963593355277")

[规范升级 NPM 包](https://juejin.cn/post/7143025612267978760 "https://juejin.cn/post/7143025612267978760")

[你想知道的前后端协作规范都在这了](https://juejin.cn/post/7140422304920109092 "https://juejin.cn/post/7140422304920109092")

[带你了解 Tree Shaking](https://juejin.cn/post/7135217402983235592 "https://juejin.cn/post/7135217402983235592")

开源作品
----

*   政采云前端小报

**开源地址 [www.zoo.team/openweekly/](https://link.juejin.cn?target=https%3A%2F%2Fwww.zoo.team%2Fopenweekly%2F "https://www.zoo.team/openweekly/")** (小报官网首页有微信交流群)

*   商品选择 sku 插件

**开源地址 [github.com/zcy-inc/sku…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fzcy-inc%2FskuPathFinder-back "https://github.com/zcy-inc/skuPathFinder-back")**

招贤纳士
----

政采云前端团队（ZooTeam），一个年轻富有激情和创造力的前端团队，隶属于政采云产品研发部，Base 在风景如画的杭州。团队现有 90 余个前端小伙伴，平均年龄 27 岁，近 4 成是全栈工程师，妥妥的青年风暴团。成员构成既有来自于阿里、网易的 “老” 兵，也有浙大、中科大、杭电等校的应届新人。团队在日常的业务对接之外，还在物料体系、工程平台、搭建平台、性能体验、云端应用、数据分析及可视化等方向进行技术探索和实战，推动并落地了一系列的内部技术产品，持续探索前端技术体系的新边界。

如果你想改变一直被事折腾，希望开始能折腾事；如果你想改变一直被告诫需要多些想法，却无从破局；如果你想改变你有能力去做成那个结果，却不需要你；如果你想改变你想做成的事需要一个团队去支撑，但没你带人的位置；如果你想改变既定的节奏，将会是 “5 年工作时间 3 年工作经验”；如果你想改变本来悟性不错，但总是有那一层窗户纸的模糊… 如果你相信相信的力量，相信平凡人能成就非凡事，相信能遇到更好的自己。如果你希望参与到随着业务腾飞的过程，亲手推动一个有着深入的业务理解、完善的技术体系、技术创造价值、影响力外溢的前端团队的成长历程，我觉得我们该聊聊。任何时间，等着你写点什么，发给 `ZooTeam@cai-inc.com`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98d3aa3d1f8646a8bcda8cfd9e335a4b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)