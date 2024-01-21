



### 更新渲染过程
1.  遍历当前浏览上下文中所有的 document ，必须按在列表中找到的顺序处理每个 document 。
2.  渲染时机（Rendering opportunities）：如果当前浏览上下文中没有到渲染时机则将所有 docs 删除，取消渲染（此处是 否存在渲染时机由浏览器自行判断，根据硬件刷新率限制、页面性能或页面是否在后台等因素）。
3.  如果当前文档不为空，设置 hasARenderingOpportunity 为 true 。
4.  不必要的渲染（Unnecessary rendering）：如果浏览器认为更新文档的浏览上下文的呈现不会产生可见效果且文档的 animation frame callbacks 是空的，则取消渲染。（终于看见 requestAnimationFrame 的身影了
5.  从 docs 中删除浏览器认为出于其他原因最好跳过更新渲染的文档。
6.  如果文档的浏览上下文是顶级浏览上下文，则刷新该文档的自动对焦候选对象。
7.  处理 resize 事件，传入一个 performance.now() 时间戳。
8.  处理 scroll 事件，传入一个 performance.now() 时间戳。
9.  处理媒体查询，传入一个 performance.now() 时间戳。
10.  运行 CSS 动画，传入一个 performance.now() 时间戳。
11.  处理全屏事件，传入一个 performance.now() 时间戳。
12.  执行 requestAnimationFrame 回调，传入一个 performance.now() 时间戳。
13.  执行 intersectionObserver 回调，传入一个 performance.now() 时间戳。
14.  对每个 document 进行绘制。
15.  更新 ui 并呈现。

流程基本如下图所示 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bee8d1d1e9b1437ebd0fa2ce5e5b795e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

至此，requestAnimationFrame 的回调时机就清楚了，它会在 style/layout/paint 之前调用。

浏览器渲染有个渲染时机（Rendering opportunity）的问题，也就是浏览器会根据当前的浏览上下文判断是否进行渲染，它会尽量高效，只有必要的时候才进行渲染，如果没有界面的改变，就不会渲染。按照规范里说的一样，因为考虑到硬件的刷新频率限制、页面性能以及页面是否存在后台等等因素，有可能执行完 setTimeout 这个 task 之后，发现还没到渲染时机，所以 setTimeout 回调了几次之后才进行渲染

