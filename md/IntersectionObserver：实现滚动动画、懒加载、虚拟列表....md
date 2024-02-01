> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7296058491289501696?searchId=202402012325316CE94CF6E1922963D4F6)

> 但行好事 莫问前程

前言🎀
----

在过去为了实现 懒加载、滚动动画 等需求并不容易，我们需要获取 **元素与视窗的交叉状态**，这通常使用 **监听滚动事件 + 计算偏移量 + 判断逻辑** 的方式实现，再辅以防抖节流等优化。

现如今随着技术的发展，浏览器推出了多种 **观察器**，让我们有更好的方式，去便捷、高效的收集页面与元素的信息。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c20dbadbb1e41288c9f019f46615c31~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1395&h=1052&s=16658952&e=gif&f=127&b=0e1f1e)

本文，我们一起学习适用于 **监听元素与视窗交叉状态** 的观察器：**`IntersectionObserver（交叉观察器）`**，了解它的相关知识与应用。

简介
--

[**`IntersectionObserver API`**](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FIntersectionObserver "https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver") 提供了一种创建`IntersectionObserver` 对象的方法，对象用于**监测目标元素与视窗 (viewport) 的交叉状态**，并在交叉状态变化时执行回调函数，回调函数可以接收到元素与视窗交叉的具体数据。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb5ad87a855b4861936b426cfd725a4b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=755&h=402&s=63782&e=png&b=fcfcfc)

一个 `IntersectionObserver` 对象可以监听多个目标元素，并通过队列维护回调的执行顺序。

`IntersectionObserver` 特别适用于：滚动动画、懒加载、虚拟列表等场景。

> 回调异步执行，不阻塞主线程。且监听不随着目标元素的滚动而触发，性能消耗极低。

API
---

### 构造函数

`IntersectionObserver` 构造函数 接收两个参数：

1.  **callback**： 当元素可见比例达到指定阈值后触发的回调函数
2.  **options**： 配置对象（可选，不传时会使用默认配置）

`IntersectionObserver` 构造函数 返回观察器实例，实例携带四个方法：

1.  **observe**：开始监听目标元素
2.  **unobserve**：停止监听目标元素
3.  **disconnect**：关闭观察器
4.  **takeRecords**：返回所有观察目标的 [`IntersectionObserverEntry`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FIntersectionObserverEntry "https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry") 对象数组

```
// 调用构造函数 生成IntersectionObserver观察器
const myObserver = new IntersectionObserver(callback, options);

// 开始监听 指定元素
myObserver.observe(element);

// 停止对目标的监听
myObserver.unobserve(element);

// 关闭观察器
myObserver.disconnect();
```

### 构造参数

#### - callback

回调函数，当交叉状态发生变化时（可见比例超过或者低于指定阈值）会进行调用，同时传入两个参数：

1.  **entries**：`IntersectionObserverEntry` 数组，每项都描述了目标元素与 root 的交叉状态
2.  **observer**：被调用的 `IntersectionObserver` 实例

#### - options

配置参数，通过修改配置参数，可以改变进行监听的视窗，可以缩小或扩大交叉的判定范围，或者调整触发回调的阈值 (交叉比例)。

<table><thead><tr><th>属性</th><th>说明</th></tr></thead><tbody><tr><td>root</td><td>所监听对象的具体祖先元素，默认使用顶级文档的视窗 (一般为 html)。</td></tr><tr><td>rootMargin</td><td>计算交叉时添加到根 (root) 边界盒 <a href="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fbounding_box" target="_blank" title="https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGlossary%2Fbounding_box">bounding box</a> 的矩形偏移量，&nbsp;可以有效的缩小或扩大根的判定范围从而满足计算需要。所有的偏移量均可用像素 (px) 或百分比 (%) 来表达, 默认值为 "0px 0px 0px 0px"。</td></tr><tr><td>threshold</td><td>一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会触发 callback。默认值为 0。</td></tr></tbody></table>

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8754c263f1f47b091ecb59a1f084d6b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=918&h=457&s=111967&e=png&b=fbfbfb)

#### - IntersectionObserverEntry

<table><thead><tr><th>属性</th><th>说明</th></tr></thead><tbody><tr><td>boundingClientRect</td><td>返回包含目标元素的边界信息，返回结果与 element.getBoundingClientRect() 相同</td></tr><tr><td>intersectionRatio</td><td>返回目标元素出现在可视区的比例</td></tr><tr><td>intersectionRect</td><td>用来描述 root 和目标元素的相交区域</td></tr><tr><td><strong>isIntersecting</strong></td><td>返回一个布尔值，下列两种操作均会触发 callback：1. 如果目标元素出现在 root 可视区，返回 true。2. 如果从 root 可视区消失，返回 false</td></tr><tr><td>rootBounds</td><td>用来描述交叉区域观察者 (intersection observer) 中的根.</td></tr><tr><td>target</td><td>目标元素：与根出现相交区域改变的元素 (Element)</td></tr><tr><td>time</td><td>返回一个记录从 IntersectionObserver 的时间原点到交叉被触发的时间的时间戳</td></tr></tbody></table>

应用
--

### 懒加载

核心是延迟加载不可视区域内的资源，在元素标签中存储 src`data-src="xxx"`，在元素进入视窗时进行加载。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cf3e4759ffa4ad985af49e201c7caf0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1411\&h=1052\&s=14137151\&e=gif\&f=73\&b=fbf7f7)

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 注意设置容器的预设高度，避免页面初始化时元素进入视窗

```
<div class="skin_img">
  <img 
    class="lazyload" 
    data-src="//game.gtimg.cn/images/lol/act/img/skinloading/412017.jpg" 
    alt="灵魂莲华 锤石" 
  />
</div>

.skin_img {
  margin-bottom: 20px;
  width: auto;
  height: 500px;
  overflow: hidden;
  position: relative;
}
```

```
const imgList = [...document.querySelectorAll('img')]

const observer = new IntersectionObserver((entries) =>{
  entries.forEach(item => {
    // isIntersecting是一个Boolean值，判断目标元素当前是否可见
    if (item.isIntersecting) {
      console.log(item.target.dataset.src)
      item.target.src = item.target.dataset.src
      // 图片加载后即停止监听该元素
      observer.unobserve(item.target)
    }
  })
}, {
  root: document.querySelector('.root')
})

// observe遍历监听所有img节点
imgList.forEach(img => observer.observe(img))
```

### 滚动动画

在元素进入视窗时添加动画样式，让内容出现的更加平滑。

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

```
const elements = document.querySelectorAll('.observer-item')

const observer = new IntersectionObserver(callback);
elements.forEach(ele => {
  ele.classList.add('opaque')
  observer.observe(ele);
})


function callback(entries, instance) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.remove("opaque");
            element.classList.add("come-in");
            instance.unobserve(element);
        }
    })
}

// css
.come-in {
  opacity: 1;
  transform: translateY(150px);
  animation: come-in 1s ease forwards;
}
.come-in:nth-child(odd) {
  animation-duration: 1s;
}

@keyframes come-in {
  100% {
    transform: translateY(0);
  }
}
```

### 无限滚动

添加底部占位元素`lastContentRef`，在元素和视窗交叉回调时添加`loading`并加载新数据。

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

```
const [list, setList] = useState(new Array(10).fill(null));
const [loading, setLoading] = useState(false);

const lastContentRef = useRef(null);

const loadMore = useCallback(async () => {
    if (timer) return;
    setLoading(true);
    await new Promise((resolve) => timer = setTimeout(() => resolve(timer = null), 1500));
    setList(prev => [...prev, ...new Array(10).fill(null)]);
    setLoading(false);
}, [loading]);

useEffect(() => {
    const io = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && !loading) {
            loadMore();
        }
    });
    lastContentRef?.current && io.observe(lastContentRef?.current);
}, [])
```

### 虚拟列表

`options`参数中的`rootMargin`特别符合虚拟列表中缓存区的设计，我们再根据元素的可见性 `element.visible ? content : (clientHeight || estimateHeight)`。

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

```
<template v-for="(item, idx) in listData" :key="item.id">
  <div class="content-item" :data-index="idx">
    <template v-if="item.visible">
      <!-- 模仿元素内容渲染 -->
      {{ item.value }}
    </template>
  </div>
</template>
    
_entries.forEach((row) => {
    const index = row.target.dataset.index
    // 判断是否在可视区域
    if (!row.isIntersecting) {
        // 离开可视区时设置实际高度进行占位 并使数据无法渲染
        if (!isInitial) {
            row.target.style.height = `${row.target.clientHeight}px`
            listData.value[index].visible = false
        }
    } else {
        // 元素进入可视区，使数据可以渲染
        row.target.style.height = ''
        listData.value[index].visible = true
    }
})
```

> 可能有小伙伴会说这是虚拟列表吗？这么多 div 都在页面上？

这些 DOM 是用于 **占位撑起高度** 和 **供观察器监听**，在`callback`时渲染成 实际内容 / 占位元素。

虚拟列表的核心是 **只渲染可视区内的内容**，而我们在窗口外的元素都是空`div`，性能开销小到忽略不计（在页面上建 10w 个空 div 都不会卡顿）。

当然这里只是简单实现，还有很多优化方向;

1.  选取部分内容监听，避免全量监听浪费资源
2.  合并视窗外的元素，避免空 div 的性能消耗和渲染成本
3.  缓存渲染完成的 DOM，避免重复渲染  
    . . . . . .

这里主要讨论 API 的使用，对虚拟列表感兴趣的同学可以看看我的另一篇文章：  
[深入【虚拟列表】动态高度、缓冲、异步加载... Vue 实现](https://juejin.cn/post/7168645862296879117 "https://juejin.cn/post/7168645862296879117")

### 兼容性

发展成熟，除 IE 外，主流浏览器均已实现该 API

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1b26761e83f4cdd8237552a7e75157a~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1458&h=782&s=155636&e=png&b=ede0c7)

总结
--

通过`IntersectionObserver`我们能够轻松获取获取元素与视窗的交叉状态，除了前文中的应用，还有诸如埋点监控、视差滚动、自动播放等多种场景都可以使用`IntersectionObserver`，感兴趣可以尝试。

`IntersectionObserver`性能表现良好，用法简洁，能够准确把控交叉的每一个阶段。它为前端带来了更好的便利性和用户体验，非常值得尝试！

结语🎉
----

不要光看不实践哦，希望本文能对你有所帮助。

持续更新前端知识，脚踏实地不水文，真的不关注一下吗~

写作不易，如果有收获还望 点赞 + 收藏 🌹

> 才疏学浅，如有问题或建议还望指教！