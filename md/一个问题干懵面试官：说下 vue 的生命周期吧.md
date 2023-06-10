> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7208823936300482619)

序
=

一个问题干懵面试官第二弹：**vue 声明周期**。（PS：博客所涉及到的所有源码均基于 `vue@3.2.37` 版本）

> 第一弹链接 [vue2 与 vue3 的区别](https://juejin.cn/post/7203195123433734203 "https://juejin.cn/post/7203195123433734203")

面试官问：你说下 vue 的生命周期吧
===================

首先 `vue2` 和 `vue3` 的生命周期是有区别的：

> Vue2 的生命周期主要是：
> 
> 1.  beforeCreate
> 2.  created
> 3.  beforeMount
> 4.  mounted
> 5.  beforeUpdate
> 6.  updated
> 7.  beforeDestroy
> 8.  Destoryed

而 `vue3` 在 `vue2` 的基础上进行了一些改变，主要是针对最后两个生命周期：

> beforeDestroy -> beforeUnmount
> 
> Destoryed -> Unmounted

另外 `options API` 和 `composition API` 在生命周期上也有一些小的不同：

> `composition API` 提供了 `setup` 函数作为入口函数，替换了 `beforeCreate` 和 `created` 这两个生命周期钩子。
> 
> 所以在实际开发中，我们可以简单的把 `setup` 理解为 `created` 进行使用。

在这 `8` 个常见的生命周期钩子中，我们最常用的就是 `created` 和 `mounted`。

其中在 `created` 中，因为组件实例已经处理好了所有与状态相关的操作，所以我们可以在这里 **获取数据、调用方法、`watch`、`computed`** 都可以。

而 `mounted` 主要是在 `DOM` 挂载之后被调用，所以如果我们想要获取 `DOM` 的话，那么需要在 `mounted` 之后进行。

除了这些之外，还有一些不太常见但是也比较有意义的，比如 `beforeUpdate`、`updated`。

其中 `beforeUpdate` 表示 **数据变化后，视图改变前**。`updated` 表示 **数据变化后，视图改变后**。

那么由这两个生命周期我们可以知道，`vue` 从数据变化到视图变化，其实是需要经历一定的时间的。原因是因为 `vue` 在内部通过 `queue` 队列的形式在更新视图（`packages/runtime-core/src/scheduler.ts`）：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b77da6ac7044c158209e890be358cc1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这个逻辑还被体现在了 `nextTick` 这个方法上（`packages/runtime-core/src/scheduler.ts`）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40749b7022c849c9a4068cd729dd659e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

而这种更新本质上是一种异步的更新形式，因为这种异步更新形式（微任务）的存在，才导致出现 **数据更新 -> 视图更新** 出现延迟的原因。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/408e6ec674194eb6a3626bdf7f58d540~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

因为它的异步更新是以微任务的形式呈现的，这也是为什么很多时候我们可以通过 `setTimeout` 代替 `nextTick` 的原因。

而如果从 `vue` 的源码中来看的话，整个组件的生命周期，其实是被分为两大部分的（`packages/runtime-core/src/renderer.ts`）：

1.  `isMounted` 之前
2.  `isMounted` 之后

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ab606fb457740deaf8c9fec25773e8f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`isMounted` 之前表示：视图被挂载之前。因为组件的渲染本质上是 `render` 渲染了所有的 `subVNode`，所以在 `isMounted` 之前，会得到一个 `subTree` 来进行渲染。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/594ec527d36444598d66656f9ddd4d06~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`isMounted` 之后表示：视图全部被渲染完成了，也就是 `mounted` 之后。着这个时候其实就是 `beforeUpdate` 和 `updated` 的活跃时期了。

总结
==

面试不易，珍惜每一次面试的机会，哪怕只增加一点成功的几率，那也是有价值的。

> 如果你想要了解更多有关源码的知识，那么可以查看我在慕课的课程 [Vue3 源码解析，打造自己的 Vue3 框架](https://link.juejin.cn?target=https%3A%2F%2Fcoding.imooc.com%2Fclass%2F608.html "https://coding.imooc.com/class/608.html")