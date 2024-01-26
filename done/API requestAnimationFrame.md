> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6991297852462858277?searchId=202401111042005CE25745555C47841FB9)


 **window.requestAnimationFrame()**  

告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
**注意：若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`**

原来在回调函数中要再次调用 `requestAnimationFrame` 才可以，修改代码再试一下。

```
(() => {
  let n = 0
  function test() {
    n++
    console.log(`🚀🚀hello ~ requestAnimationFrame ${n}`);
    requestAnimationFrame(test)
  }
  requestAnimationFrame(test)
})()
```
执行频率
----

这时候有小伙伴就要问了，我没有像 `setTimeout` 和 `setInterval` 那样设置时间，它为什么会间隔执行呢？
再看看文档怎么说。
> 回调函数执行次数通常是每秒 **60** 次，但在大多数遵循 `W3C` 建议的浏览器中，回调函数执行次数通常与 **浏览器屏幕刷新次数** 相匹配。

这回就知道了，原来它根本就不用手动设置执行间隔时间，而是根据 **浏览器屏幕刷新次数** 自动调整了, 也就是说浏览器屏幕刷新多少次，它就执行多少次。看到这我只想说一句 **厉害坏了** 。
那么什么是 **浏览器屏幕刷新次数** 呢？
**屏幕刷新频率（次数）：** 屏幕每秒出现图像的次数。普通笔记本为 60Hz。

回调参数
----
> 回调函数会被传入 [`DOMHighResTimeStamp`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDOMHighResTimeStamp "https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp")参数，[`DOMHighResTimeStamp`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDOMHighResTimeStamp "https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp")指示当前被 `requestAnimationFrame()` 排序的回调函数被触发的时间。

修改代码来看一下这个参数。
```
(() => {
  function test(timestamp) {
    console.log(`🚀🚀hello ~ requestAnimationFrame ${timestamp}`);
    requestAnimationFrame(test)
  }
  requestAnimationFrame(test)
})()
```

在同一个帧中的 **多个回调函数** ，它们每一个都会接受到一个 **相同的时间戳** ，即使在计算上一个回调函数的工作负载期间已经 **消耗了一些时间** 。该时间戳是一个十进制数，单位毫秒，最小精度为 1ms(1000μs)。

修改代码，我们同时执行两个 `requestAnimationFrame` 来看一下。
可以看到，两个 `requestAnimationFrame` 在控制台输出的时间戳是一样的。也就是浏览器刷新一次的时候，执行所有的 `requestAnimationFrame` ，并且它们的回调参数是一模一样的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f779dd8e9fca40aa9aa8ba61b583fa4b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)


## requestAnimationFrame返回值
 一个 `long` 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。
以下代码点击开始的时候，输出 `requestAnimationFrame` 的返回值。可以看见，每执行一次，数值就会 **+1**
```
(() => {
  const beginBtn = document.querySelector("#begin")
  
  let myRef;
  
  beginBtn.addEventListener("click", () => {
    myRef = requestAnimationFrame(test)
  })
  
  function test() {
    myRef = requestAnimationFrame(test)
    console.log('🚀🚀~ myRef:', myRef);
  }
})()
```

终止执行
----
你可以传之前的返回值值给 [`window.cancelAnimationFrame()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FcancelAnimationFrame "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelAnimationFrame") 以取消回调函数。
那如果我想要在特定的条件下终止 `requestAnimationFrame` 怎么办呢，官方也给出了答案，那就是 `cancelAnimationFrame API` 。 只需要把 `requestAnimationFrame` 的返回值作为参数传递给 `cancelAnimationFrame` 就可以了。
```
(() => {
  const beginBtn = document.querySelector("#begin")
  const endBtn = document.querySelector("#end")
  let myRef;
  beginBtn.addEventListener("click", () => {
    myRef = requestAnimationFrame(test)
  })
  endBtn.addEventListener("click", () => {
    cancelAnimationFrame(myRef)
  })
  function test() {
    myRef = requestAnimationFrame(test)
    console.log('🚀🚀~ myRef:', myRef);
  }
})()
```
可以看到，当我点击开始的时候控制台持续输出内容，当我点击停止的时候，控制台停止输出。
其实不用这个 `API` 也可以达到终止执行的目的，比如简单的 `if语句` 。
```
(() => {
  function test(timestamp) {
    console.log(`🚀🚀hello ~ requestAnimationFrame ${timestamp}`);
    if (timestamp < 500) {
      requestAnimationFrame(test)
    }
  }
  requestAnimationFrame(test)
})()
```
可以看到，当 `timestamp` 超过 500 的时候就停止了。当然还有更多可能性，这就要靠小伙伴们开动聪明的脑袋瓜子了。
小技巧
---
我们这样就可以把每两次执行的时间间隔传递给外部使用了。外部拿到以后就可以搞事情了，比如时间间隔累加到 **1000** 就执行什么什么操作~
```
(() => {
  let startTime = Date.now();

  function handleTicker() {
    foo(Date.now() - startTime);
    startTime = Date.now();
    requestAnimationFrame(handleTicker);
  }

  requestAnimationFrame(handleTicker);

  let t = 0
  function foo(timeInterval) {
    t += timeInterval
    console.log('🚀🚀~ t:', t);
    if (t > 1000) {
      console.log('🚀🚀~ 搞事情');
      t = 0
    }
  }
})()
```

可以看到，当 `t` 累加大于 `1000` 的时候，就搞了一次事情，然后重置 `t` ，以此类推。
setTimeout && setInterval
-------------------------
`setTimeout` 和 `setInterval` 的问题是，它们不够精确。它们的内在运行机制决定了 **时间间隔参数** 实际上只是指定了把动画代码添加到 **浏览器 UI 线程队列** 中以等待执行的时间。如果队列前面已经加入了其它任务，那动画代码就要等前面的 **任务完成后** 再执行，并且如果时间间隔过短（小于 16.7ms）会造成丢帧，所以就会导致动画可能不会按照预设的去执行，降低用户体验。

`requestAnimationFrame` 采用 **浏览器时间间隔** ，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，消耗性能；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个 **统一** 的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

