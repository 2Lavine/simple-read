> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903782296338440)

Event loop 的初步理解
----------------

Event loop 大概步骤是:
*   1,Javascript 的事件分为同步任务和异步任务.
*   2, 遇到同步任务就放在执行栈中执行.
*   3, 遇到异步任务就放到任务队列之中，等到执行栈执行完毕之后再去执行任务队列之中的事件.

Event loop 相关概念
---------------

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/533990d8a6a449cf9e67c6b86e6f6a1d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### JS 调用栈

Javascript 有一个 主线程 (main thread) 和 调用栈 (call-stack)
所有的代码都要通过函数, 放到调用栈(也被称为执行栈) 中的任务等待主线程执行。
JS 调用栈采用的是后进先出的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。

### WebAPIs

**MDN 的解释:** Web 提供了各种各样的 API 来完成各种的任务。这些 API 可以用 JavaScript 来访问， 就是浏览器提供一些接口, 让 JavaScript 可以调用, 这样就可以把任务甩给浏览器了, 这样就可以实现异步了!

### 任务队列 (Task Queue)

"任务队列" 是一个先进先出的数据结构，排在前面的事件，优先被主线程读取。
主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列" 上第一位的事件就自动进入主线程。
但是，如果存在 "定时器"，主线程首先要检查一下执行时间，某些事件只有到了规定的时间，才能返回主线程。

### 同步任务和异步任务

Javascript 单线程任务被分为同步任务和异步任务.

*   同步任务会**在调用栈** 中按照顺序等待主线程依次执行.
*   异步任务会甩给在 WebAPIs 处理, 处理完后有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。

### 宏任务（MacroTask）和 微任务（MicroTask）

宏任务（`MacroTask`）也叫`Task`，一种叫微任务（`MicroTask`）。
**宏任务（MacroTask）**

*   `script(整体代码)`、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有 IE10 支持，具体可见 [`MDN`](https://link.juejin.im?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FsetImmediate "https://link.juejin.im?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FsetImmediate")）、`I/O`、`UI Rendering`。

**微任务（MicroTask）**
*   `Process.nextTick（Node独有）`、`Promise`、`Object.observe(废弃)`、`MutationObserver`

Event loop 执行过程
---------------
注意:
*   **只要主线程空了，就会去读取 "任务队列"，这就是 JavaScript 的运行机制。这个过程会不断重复。**
*   在上图的 Event Table 里存放着宏任务与微任务, 所以在它里面 还发生了一些更细致的事情.

前面介绍宏任务的时候, 提过 script 也属于其中. 那么一段代码块就是一个宏任务。
故所有一般执行代码块的时候，先执行的是宏任务 script, 也就是程序执行进入主线程了，主线程再会根据不同的代码再分微任务和宏任务等待主线程执行完成后，不停地循环执行。

主线程（宏任务） => 微任务 => 宏任务 => 主线程

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc84e6e4875245e5aa9b1f32c9cc58fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

事件循环的顺序是从 script 开始第一次循环，随后全局上下文进入函数调用栈，
- 碰到 macro-task 就将其交给处理它的模块处理完之后将回调函数放进 macro-task 的队列之中，
- 碰到 micro-task 也是将其回调函数放进 micro-task 的队列之中。
- 直到函数调用栈清空只剩全局执行上下文，然后开始执行所有的 micro-task。
- 当所有可执行的 micro-task 执行完毕之后。 
- 接着浏览器会执行下必要的渲染 UI, 然后循环再次执行 macro-task 中的一个任务队列，执行完之后再执行所有的 micro-task，就这样一直循环。

**注意:** 通过上述的 Event loop 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的 界面响应，我们可以把操作 DOM 放入微任务中。

例子分析
----
这里需要先理解`async/await`。

### **引用贺老师知乎上的一个例子**

```
async function f() {
  await p
  console.log('ok')
}
```

简化理解为：

```
function f() {
  return RESOLVE(p).then(() => {
    console.log('ok')
  })
}
```


`async/await` 在底层转换成了 `promise` 和 `then` 回调函数。 也就是说，这是 `promise` 的语法糖。
每次我们使用 `await`, 解释器都创建一个 `promise` 对象，然后把**剩下的** `async` 函数中的操作放到 `then` 回调函数中

*   如果 `RESOLVE(p)` 对于 `p` 为 `promise` 直接返回 `p` 的话，那么 `p`的 `then` 方法就会被马上调用，其回调就立即进入 `job` 队列。
*   而如果 `RESOLVE(p)` 严格按照标准，应该是产生一个新的 `promise`，尽管该 `promise`确定会 `resolve` 为 `p`，但这个过程本身是异步的，也就是现在进入 `job` 队列的是新 `promise` 的 `resolve`过程，所以该 `promise` 的 `then` 不会被立即调用，而要等到当前 `job` 队列执行到前述 `resolve` 过程才会被调用，然后其回调（也就是继续 `await` 之后的语句）才加入 `job` 队列，所以时序上就晚了。

### 谷歌 (金丝雀)73 版本
**主要原因是因为在谷歌 (金丝雀)73 版本中更改了规范，如下图所示：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50e66c59d922431988acc97241835da1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

*   区别在于`RESOLVE(thenable)`和之间的区别`Promise.resolve(thenable)`。


### **在 73 以下版本中**

```
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```
* 首先，传递给 `await` 的值被包裹在一个 `Promise` 中。
* 然后，处理程序附加到这个包装的 `Promise`，以便在 `Promise` 变为 `fulfilled` 后恢复该函数，并且暂停执行异步函数，一旦 `promise` 变为 `fulfilled`，恢复异步函数的执行。
* 每个 `await` 引擎必须创建两个额外的 Promise（即使右侧已经是一个 `Promise`）并且它需要至少三个 `microtask` 队列 `ticks`（`tick`为系统的相对时间单位，也被称为系统的时基，来源于定时器的周期性中断（输出脉冲），一次中断表示一个`tick`，也被称做一个 “时钟滴答”、时标。）。

*   在 73 版本以下，先执行`promise1`和`promise2`，再执行`async1`。
**详细过程：**
*   首先，打印`script start`，调用`async1()`时，返回一个`Promise`，所以打印出来`async2 end`。
*   每个 `await`，会新产生一个`promise`, 但这个过程本身是异步的，所以该`await`后面不会立即调用。
*   继续执行同步代码，打印`Promise`和`script end`，将`then`函数放入**微任务**队列中等待执行。
*   同步执行完成之后，检查**微任务**队列是否为`null`，然后按照先入先出规则，依次执行。
*   然后先执行打印`promise1`, 此时`then`的回调函数返回`undefinde`，此时又有`then`的链式调用，又放入**微任务**队列中，再次打印`promise2`。
*   再回到`await`的位置执行返回的 `Promise` 的 `resolve` 函数，这又会把 `resolve` 丢到微任务队列中，打印`async1 end`。
*   当**微任务**队列为空时，执行宏任务, 打印`setTimeout`。

### **谷歌（金丝雀）73 版本中**

```
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

在 73 版本，先执行`async1`再执行`promise1`和`promise2`。
*   使用对`PromiseResolve`的调用来更改`await`的语义，以减少在公共`awaitPromise`情况下的转换次数。
*   如果传递给 `await` 的值已经是一个 `Promise`，那么这种优化避免了再次创建 `Promise` 包装器，在这种情况下，我们从最少三个 `microtick` 到只有一个 `microtick`。


*   如果传递给 `await` 的值已经是一个 `Promise`，那么这种优化避免了再次创建 `Promise` 包装器，在这种情况下，我们从最少三个 `microtick` 到只有一个 `microtick`。
*   引擎不再需要为 `await` 创造 `throwaway Promise` - 在绝大部分时间。
*   现在 `promise` 指向了同一个 `Promise`，所以这个步骤什么也不需要做。然后引擎继续像以前一样，创建 `throwaway Promise`，安排 `PromiseReactionJob` 在 `microtask` 队列的下一个 `tick` 上恢复异步函数，暂停执行该函数，然后返回给调用者。

Node.js 的 Event Loop
--------------------
Node.js 的运行机制如下。

（1）V8 引擎解析 JavaScript 脚本。
（2）解析后的代码，调用 Node API。
（3）libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
（4）V8 引擎再将结果返回给用户。

### `Node`的`Event loop`一共分为 6 个阶段，每个细节具体如下：

*   `timers`: 执行`setTimeout`和`setInterval`中到期的`callback`。
*   `pending callback`: 上一轮循环中少数的`callback`会放在这一阶段执行。
*   `idle, prepare`: 仅在内部使用。
*   `poll`: 最重要的阶段，执行`pending callback`，在适当的情况下回阻塞在这个阶段。
*   `check`: 执行`setImmediate`(`setImmediate()`是将事件插入到事件队列尾部，主线程和事件队列的函数执行完成之后立即执行`setImmediate`指定的回调函数) 的`callback`。
*   `close callbacks`: 执行`close`事件的`callback`，例如`socket.on('close'[,fn])`或者`http.server.on('close, fn)`。


线程和进程
---------

### 比喻理解

一个进程好比是一个工厂，每个工厂有它的独立资源（类比到计算机上就是系统分配的一块独立内存），而且每个工厂之间是相互独立、无法进行通信。都是由私有的虚拟地址空间、代码、数据和其它系统资源所组成；进程在运行过程中能够申请创建和使用系统资源

每个工厂都有若干个工人（一个工人即是一个线程，一个进程由一个或多个线程组成），多个工人可以协作完成任务（即多个线程在进程中协作完成任务），当然每个工人可以共享此工厂的空间和资源（即同一进程下的各个线程之间共享程序的内存空间（包括代码段、数据集、堆等））。

到此你应该能初步理解了进程和线程之间的关系，这将有助于我们理解浏览器为什么是多进程的，而 JavaScript 是单线程。

**浏览器是多进程的 (一个窗口就是一个进程), 每个进程包含多个线程. 但 JavaScript 是单线程的. 一个主线程 (一个 stack), 多个子线程.**
