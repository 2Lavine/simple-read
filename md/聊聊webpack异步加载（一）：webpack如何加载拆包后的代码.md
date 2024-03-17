> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6888594303447531527)

> 作者 | vayne  
> 转载请注明出处：[juejin.cn/user/272334…](https://juejin.cn/user/272334612082910 "https://juejin.cn/user/272334612082910")

前端代码在使用 ​webpack​ 进行打包时，经常会做两种优化：

1.  把稳定的库代码（如 ​react​、​antd​ 等）与业务代码分离，业务代码的更改不影响用户本地的库代码缓存，同时也把一个大文件拆分成多个文件，充分利用浏览器并行加载网络资源的能力，提高加载性能。
2.  配合 ​react-router​ 使用 ​import()​ 异步按需加载组件，减少不必要的资源加载，提高首屏性能。

一般而言，常用的 ​CLI​ 工具基本上配置得足够好，可以开箱即用。​webpack​ 对于这两种的情况处理有交叉也有区别，这一篇文章先来讲解第一种情况。阅读之前，建议浏览这篇文章（[zhuanlan.zhihu.com/p/52826586）…](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F52826586%25EF%25BC%2589%25E7%2586%259F%25E6%2582%2589%25E5%259F%25BA%25E6%259C%25AC%25E7%259A%2584 "https://zhuanlan.zhihu.com/p/52826586%EF%BC%89%E7%86%9F%E6%82%89%E5%9F%BA%E6%9C%AC%E7%9A%84") ​webpack runtime​ 代码。

> 基本代码结构

首先要熟悉 ​webpack​ 中的 ​chunk​ 和 ​module​。​module​ 可以简单理解成在 ​js​ 文件中由 ​export​ 导出的模块，​chunk​ 是由多个 ​module​ 组成的代码块（准确来说，​webpack​ 把所有资源都当作 ​module​，​chunk​ 其实也包括了图片、​css​ 等资源，下面的分析都把 ​module​ 当成代码，其他资源同理）。先来看下打包出来的 ​html​ 模板文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f0ec6744df4a309143cd4125e63fd1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

之前一个 ​js​ 文件按照配置被拆分成了三个 ​js​ 文件。看到这里，应该会有疑问： ​webpack​ 怎么保证多个 ​js​ 文件的加载顺序（​script​ 标签不加 ​defer​、​async​ 等属性时，是按顺序执行加载的，即使前面的资源因为各种原因被阻塞也会按顺序加载，这里主要讨论加上 ​defer​、​async​ 的情况），又是怎么做到不同 ​js​ 文件中的代码协作，带着这些问题一步一步分析。

bootstrap：
==========

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14ba17f26c524d529e1393b81e05a6f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

首先要熟悉四个缓存变量（截图中从上到下的顺序）：

*   ​modules​：缓存 ​module​ 代码块，每个 ​module​ 有一个 ​id​，开发环境默认以 ​module​ 所在文件的文件名标识，生产环境默认以一个数字标识。​modules​ 是一个 ​object​， ​key​ 为 ​module id​，​value​ 为对应 ​module​ 的源代码块。
    
*   ​installedModules​：缓存已经**加载过的** ​**module**​，简单理解就是已经运行了源码中 ​import somemodule from 'xxx'​ 这样的语句。​installedModules​ 是一个 ​object​， ​key​ 为 ​module id​，​value​ 为对应 ​module​ 导出的变量。（跟 ​modules​ 的 ​value​ 是不一样的，这里的 ​value​ 保存的是 ​module​ 对应的代码中 ​export​ 的变量）
    
*   ​installedChunks​：缓存已经**加载过的** ​**chunk**​，简单理解就是把其他 ​js​ 文件中的 ​chunk​ 包含的 ​modules​ 同步到了当前文件中。每个 ​chunk​ 有一个 ​id​，默认以一个数字标识。​installedChunks​ 也是一个对象，​key​ 为 ​chunk id​，​value​ 有四种情况：
    
*   undefined：chunk not loaded
    
*   null：chunk preloaded/prefetched
    
*   Promise：chunk loading
    
*   0：chunk loaded
    
*   ​deferredModules​：缓存运行当前 ​web app​ 需要的 ​chunk id​ 以及**入口** ​module id​（截图中 299 标识入口 ​module​ 的 ​id​，0 和 1 标识运行必需的另外两个 ​chunk​ 的 ​id​），比如，​react​ 和 ​react-dom​ 被单独打包到了另外的 ​js​ 中，入口文件需要等待 ​react​ 和 ​react-dom​ 加载成功之后才能运行。
    

理解这四个变量之后，代码逻辑看起来就很容易了。

Chunk 代码块
=========

首先熟悉下拆分出来的 chunk 代码块的基本形式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23fe4b6cadc64b0482d846d800001391~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

简单理解就是 ​window["webpackJsonp"]​ 下 “push” 了一个二维数组，第一项是当前 ​chunk​ 的 ​id​，第二项就是当前 ​chunk​ 包含的 ​modules​。这一步的主要作用就是通过 ​window["webpackJsonp"]​ ，把在不同 ​js​ 文件中代码块联系起来。

checkDeferredModules：
=====================

入口文件首先填充 ​deferredModules​ 的内容，为运行作准备。之后会调用 ​checkDeferredModules​ 方法。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04209952f3d64d81b425e74765604fe5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

​checkDeferredModules​ 也很简单，判断必需的 ​chunk​ 是否已经加载，如果已经加载，执行入口 ​module​ 代码，否则啥也不做。之前一个 ​js​ 文件按照配置被拆分成了多个 ​js​ 文件，多个 ​js​ 文件的加载以及执行顺序存在着不确定性，所以做了一个检查，确保必需的的资源在当前环境下已经加载完毕。

webpackJsonpCallback：
=====================

入口代码块首先执行这几行代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9331a64d3c2f43ed8afd0c4e40238f11~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这几行代码看似简单，蕴含的逻辑其实比较多，设计得也很巧妙。我们分两种情况分析，第一种情况是 **chunk js 资源首先执行，入口 js 资源最后执行：**

*   jsonpArray 初始化为 window["webpackJsonp"]，当前情况下 window["webpackJsonp"] 已经包含了必需的 chunk。
    
*   保存 jsonpArray 的 push 方法（即为数组原生 push 方法），并赋值为 webpackJsonpCallback。实际上就是改写 window["webpackJsonp"] 的 push 方法，之后把 jsonpArray 还原成普通数组。
    
*   对 jsonpArray 的每一项执行 webpackJsonpCallback 方法：
    

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd789fe0c717440c8f635ba54dd770b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   参数 data 的形式为 [chunkId[], modules[], deferredModules[] ]
    
*   第一个 for 循环标识当前 chunk 已加载（installedChunks[chunkId] === 0 表示 chunk 已加载，resolves 数组是动态 import 需要使用的，此处暂时不涉及）。
    
*   第二个 for 循环把当前 chunk 包含的 module 保存到入口文件的 modules 变量
    
*   parentJsonpFunction 在当前情况下为空，resolves 数组暂时不涉及
    
*   如果 chunk 中还有其他 deferredModule，加入 deferredModules 中（拆分 webpack runtime 代码时会用到）
    
*   每次加载完当前 chunk 之后都会调用一次 checkDeferredModules 判断是否所有 chunk 已经加载完毕，当加载完毕后就会执行入口 module，从而构建整个 web app
    

第二种情况，** 入口 js 资源穿插在加载 chunk 的 js 资源当中执行，** 基本流程是一致的，有两点不同：

*   后续的 chunk js 执行时，window["webpackJsonp"] 的 push 方法已经被改写成了 webpackJsonpCallback
    
*   parentJsonpFunction 在这种情况下保存的是原生数组的 push 方法，this 指向了 window["webpackJsonp"]，目的是集中存在于多个 chunk js 中的 module ，方便多入口文件的其他入口 js 加载。
    

至此，chunk 拆分的逻辑已经完结了，可以画个流程图简单总结一下

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64b539acb4cf4ef9a7ddb7f5f903197b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)