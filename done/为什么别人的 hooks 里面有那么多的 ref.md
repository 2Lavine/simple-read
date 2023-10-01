> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7271643757640007680?utm_source=gold_browser_extension)

前言
--
在学习一些开源的库的时候，很容易发现开源库中 `hooks` 里面会写很多的 `ref` 来存储`hooks`的参数。

使用了 `ref` 之后，使用变量的地方就需要 `.current` 才能拿到变量的值，这比我直接使用变量肯定是变得麻烦了。对于有代码洁癖的人来说，这肯定是很别扭的。

但是在开源库的 `hooks` 中频繁的使用了 `ref`，这肯定不是一个毫无原因的点，那么究竟是什么原因，让开源库也不得不使用 `.current` 去获取变量呢？

`useCallback`
-------------
### 第二阶段 - 可以缓存

可以缓存就遇到了两个点：

1.  缓存是吧，不会每一次都重新创建是吧，这样是不是性能就能提高了！那我把我所有用到的函数都使用 `useCallback`缓存一下。
2.  `react` 每一次`render`的时候会导致子组件重新渲染，使用`memo`可以缓存这个子组件，在父组件更新的时候，会浅层的比较子组件的`props`，所以传给子组件的函数就需要使用缓存`useCallback`起来，那么父组件中定义函数的时候图方便，一股脑的都使用 `useCallback`缓存。


### 第三阶段 - 缓存不一定是好事
 到这里我们就大概的意识到了，处处使用`useCallback`可能并不是我们想象的那样，对正确的使用`useCallback`有了一定的了解

### 总结

那么究竟在何时应该使用`useCallback`呢？

1.  我们知道 `react` 在父组件更新的时候，会对子组件进行全量的更新，我们可以使用 `memo`对子组件进行缓存，在更新的时候浅层的比较一下`props`，如果`props`没有变化，就不会更新子组件，那如果`props`中有函数，我们就需要使用 `useCallback`缓存一下这个父组件传给子组件的函数。
2.  我们的`useEffect`中可能会有依赖函数的场景，这个时候就需要使用`useCallback`缓存一下函数，避免`useEffect`的无限调用



---
针对`useEffect`这个`hooks`补充一点`react`官方文档里面有提到，[建议我们使用自定义的 hooks 封装 useEffect](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.react.dev%2Freference%2Freact%2FuseEffect%23wrapping-effects-in-custom-hooks "https://zh-hans.react.dev/reference/react/useEffect#wrapping-effects-in-custom-hooks")。

3.  那使用`useCallback`的第三个场景就出现了，就是我们在自定义`hooks`需要返回函数的时候，建议使用 `useCallback`缓存一下，因为我们不知道用户拿我们返回的函数去干什么，万一他给加到他的`useEffect`的依赖里面不就出问题了嘛。

一个自定义`hook`的案例
--------------
### 提出问题

那么，现在就有一个很严重的问题，`onEnd`和 `countdownCallBack`这两个函数是外部传入的，我们要不要把他放到我们自定义`hook`的`useEffect`依赖项里面呢

我们不能保证外部传入的变量一定是一个被`useCallback`包裹的函数，那么肯定就不能放到`useEffect`依赖项里面。

如何解决这个问题呢？答案就是使用`useRef`。
总结
--
编写自定义`hooks`时候，我们需要注意一下外部传入的参数，以及我们返回给用户的返回值，核心点是决不相信外部传入的内容，以及绝对要给用户一个可靠的返回值。