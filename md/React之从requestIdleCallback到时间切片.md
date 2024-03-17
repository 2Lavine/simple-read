> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7167335700424196127?searchId=202401301155107A3864B398A1C37976BC)

> 本文为稀土掘金技术社区首发签约文章，14 天内禁止转载，14 天后未获授权禁止转载，侵权必究！
> 
> 本篇是 React 基础与进阶系列第 10 篇，[关注专栏](https://juejin.cn/column/7142674773930147853 "https://juejin.cn/column/7142674773930147853")

前言
--

在上篇[《React 之 requestIdleCallback 来了解一下》](https://juejin.cn/post/7166547963517337614 "https://juejin.cn/post/7166547963517337614")，我们讲解了 requestIdleCallback 这个 API，它可以实现在浏览器空闲的时候执行代码，这就与 React 的理念非常相似，都希望执行的时候不影响到关键事件，比如动画和输入响应，但因为兼容性、requestIdleCallback 定位于执行后台和低优先级任务、执行频率等问题，React 在具体的实现中并未采用 requestIdleCallback，本篇我们来讲讲 React 是如何实现类似于 requestIdleCallback，在空闲时期执行代码的效果，并由此讲解时间切片的背后实现。

setTimeout 模拟
-------------

[MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBackground_Tasks_API%23%25E5%259B%259E%25E9%2580%2580%25E5%2588%25B0_settimeout "https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#%E5%9B%9E%E9%80%80%E5%88%B0_settimeout") 提供了一种使用 setTimeout 的兜底实现：

```
window.requestIdleCallback = window.requestIdleCallback || function(handler) {
  let startTime = Date.now();

  return setTimeout(function() {
    handler({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50.0 - (Date.now() - startTime));
      }
    });
  }, 1);
}
```

但这个并不是 polyfill ，因为它在功能上并不相同。使用 setTimeout() 并不能像 requestIdleCallback 一样做到在空闲时段执行代码。

postMessage 介绍
--------------

那如何实现空闲时期执行呢？React 早期采用的是 requestAnimationFrame + postMessage 来实现的，requestAnimationFrame 我们在 [《React 之 requestAnimationFrame 执行机制探索》](https://juejin.cn/post/7165780929439334437 "https://juejin.cn/post/7165780929439334437")介绍过，我们简单说说 postMessage。

引用 [MDN 的介绍](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FpostMessage "https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage")：

> window.postMessage() 方法可以安全地实现跨源通信。

它的简单使用示例如下：

```
window.addEventListener("message", (e) => {console.log(e.data)}, false);

window.postMessage('Hello World!')
```

React v16 实现（rAF + postMessage）
-------------------------------

那 React 是怎么实现的呢？我们可以查看 [React 16.0.0 版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fv16.0.0%2Fsrc%2Frenderers%2Fshared%2FReactDOMFrameScheduling.js "https://github.com/facebook/react/blob/v16.0.0/src/renderers/shared/ReactDOMFrameScheduling.js")里的实现，这里为了方便理解，将代码极度简化了：

```
// Polyfill requestIdleCallback.
var scheduledRICCallback = null;
var frameDeadline = 0;
// 假设 30fps，一秒就是 33ms
var activeFrameTime = 33;

var frameDeadlineObject = {
  timeRemaining: function() {
    return frameDeadline - performance.now();
  }
};

var idleTick = function(event) {
    scheduledRICCallback(frameDeadlineObject);
};

window.addEventListener('message', idleTick, false);

var animationTick = function(rafTime) {
  frameDeadline = rafTime + activeFrameTime;
  window.postMessage('__reactIdleCallback$1', '*');
};

var rIC = function(callback) {
  scheduledRICCallback = callback;
  requestAnimationFrame(animationTick);
  return 0;
};
```

逻辑很简单，`rIC` 就是 requestIdleCallback 的简写，`rIC` 函数执行的时候，调用 `requestAnimationFrame(animationTick)`，animationTick 会被传入当前帧执行的时间 (rafTime)，我们假设要保持最低的 30fps，一帧就是 33ms，我们就可以得知这帧最晚应该在 `frameDeadline = rafTime + activeFrameTime`前结束。

然后我们通过 postMessage 进行通信，通信的内容并不重要，重点是浏览器会被推入一个宏任务，也就是 `idleTick` 函数，我们通过 `frameDeadline - performance.now()`就可以算出这帧还剩多少时间，然后将包含这个信息的对象（frameDeadlineObject）传入 callback 函数，由此实现了 requestIdleCallback 的模拟。

那你可能会问，“空闲时期执行” 这个效果怎么就实现了呢？我们之想要实现空闲时期执行，想要达到的效果是不阻碍浏览器对动画和用户输入的处理，我们没有直接执行 callback 回调，而是用 postMessage 推入到任务列表中，浏览器就可以响应更高优先级的动画或者用户输入，等执行完再去我们推入的任务。这效果不就一样达成了吗？

那你可能会问，这不就是延时执行？为什么不用 setTimeout 呢？

确实也可以，但当你设置 `setTimeout(fn, 0)`的时候，虽然想表达的意思是马上执行，但浏览器在实现的时候会有一个最低 4ms 的间隔，如果你想在浏览器中实现 0ms 延时的定时器，应该借助 postMessage，这也是 [MDN 文档给的建议](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FsetTimeout%23%25E5%25AE%259E%25E9%2599%2585%25E5%25BB%25B6%25E6%2597%25B6%25E6%25AF%2594%25E8%25AE%25BE%25E5%25AE%259A%25E5%2580%25BC%25E6%259B%25B4%25E4%25B9%2585%25E7%259A%2584%25E5%258E%259F%25E5%259B%25A0%25EF%25BC%259A%25E6%259C%2580%25E5%25B0%258F%25E5%25BB%25B6%25E8%25BF%259F%25E6%2597%25B6%25E9%2597%25B4 "https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#%E5%AE%9E%E9%99%85%E5%BB%B6%E6%97%B6%E6%AF%94%E8%AE%BE%E5%AE%9A%E5%80%BC%E6%9B%B4%E4%B9%85%E7%9A%84%E5%8E%9F%E5%9B%A0%EF%BC%9A%E6%9C%80%E5%B0%8F%E5%BB%B6%E8%BF%9F%E6%97%B6%E9%97%B4")。

取消使用 rAF
--------

随着代码的不断变更，实现又发生了一些变化，比如 React 在 [v16.2.0 版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fv16.12.0%2Fpackages%2Fscheduler%2Fsrc%2Fforks%2FSchedulerHostConfig.default.js "https://github.com/facebook/react/blob/v16.12.0/packages/scheduler/src/forks/SchedulerHostConfig.default.js")取消了使用 requestAnimationFrame，为什么会取消 rAF 呢？[这个 PR](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fpull%2F16214 "https://github.com/facebook/react/pull/16214") 进行了回答。

回顾之前的实现，我们是通过猜测这帧的结束时间，然后在这帧大概结束的时候再让出线程，但实际上没有必要这样实现。我们的想法是，将 React 的更新做成一个任务列表，我们不直接遍历这个任务列表，而是每执行几个任务，就调用 postMessage，告诉浏览器，我不遍历任务了，线程给你，你先忙，等处理完再接着遍历任务列表中剩下的任务。这样我们就不用管这帧是什么时候结束。为了方便起见，我们将这种实现方式叫做 message loop。

而且为了提高性能和电池寿命，在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的`<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。这对 React 的执行也会有一定的影响。

那 message loop 具体是怎么实现的呢？我们先额外介绍一下 MessageChannel

MessageChannel 介绍
-----------------

web 通信（web messaging）有两种方式，一种是跨文档通信 (cross-document messaging)，也就是我们熟知的 `window.postMessage()`，常被用于与 iframe 之间的通信，一种是通道通信（channel messaging），也就是我们现在要介绍的。

MessageChannel 接口允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据，使用示例如下：

```
var channel = new MessageChannel();

channel.port1.onmessage = (e) => {console.log(e.data)}

channel.port2.postMessage('Hello World')
```

了解过事件循环的同学应该知道宏任务与微任务，它们又被称为 “macro task” 和“micro task” ，像 promise 就属于微任务，setTimeout 属于宏任务，MessageChannel 跟 setTimeout 一样，也属于宏任务。知道这点就够了。

React v18 实现（message loop）
--------------------------

写这篇文章的时候，React 的版本是 [v18.2.0](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fv18.2.0%2Fpackages%2Fscheduler%2Fsrc%2Fforks%2FScheduler.js "https://github.com/facebook/react/blob/v18.2.0/packages/scheduler/src/forks/Scheduler.js")，代码为了方便阅读，同样做了简化：

```
// 记录 callback
let scheduledHostCallback;
let isMessageLoopRunning = false;
let getCurrentTime = () => performance.now();
let startTime;

// rIC 更名为 requestHostCallback
function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

let schedulePerformWorkUntilDeadline = () => {
  port.postMessage(null);
};

function performWorkUntilDeadline() {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    startTime = currentTime;
    const hasTimeRemaining = true;
    
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
};
```

可以看到在当前的实现中，原来的 `rIC` 改名为 `requestHostCallback`，requestHostCallback 函数执行的时候，会调用 `schedulePerformWorkUntilDeadline`，它只做了一件事情，就是 `postMessage`，通知浏览器等忙完自己的事情，再执行 `performWorkUntilDeadline`。

performWorkUntilDeadline 中会执行 `scheduledHostCallback(hasTimeRemaining, currentTime)`，scheduledHostCallback 就是传入 requestHostCallback 的 callback 函数，它返回一个布尔值告诉 performWorkUntilDeadline 是否还有更多任务，如果有，那就调用 `schedulePerformWorkUntilDeadline`，告诉浏览器等会再接着干，由此实现了任务小量执行，不断让出线程，从而保证浏览器能够及时处理动画或者用户输入。

那 scheduledHostCallback 到底是什么呢？我们可以知道它就是调用 requestHostCallback 时传入的函数，但这个被传入的函数执行的内容是什么呢？

既然都已经看了 React 的 [Scheduler 源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fv18.2.0%2Fpackages%2Fscheduler%2Fsrc%2Fforks%2FScheduler.js "https://github.com/facebook/react/blob/v18.2.0/packages/scheduler/src/forks/Scheduler.js")，来都来了，我们就再多看一点。

我们会发现 requestHostCallback 虽然有三处被调用，但传入的函数都是 flushWork 这个函数：

```
requestHostCallback(flushWork);
```

所以 performWorkUntilDeadline 中执行的 `scheduledHostCallback(hasTimeRemaining, currentTime)`，其实就相当于执行 `flushWork(hasTimeRemaining, currentTime)`

flushWork 做了什么呢？我们将 flushWork 相关的代码拿出来，这里同样做了简化：

```
function flushWork(hasTimeRemaining, initialTime) {
   return workLoop(hasTimeRemaining, initialTime);
}

var currentTask;

function workLoop(hasTimeRemaining, initialTime) {
  currentTask = taskQueue[0];
  while (currentTask != null) {
    if (
      currentTask.expirationTime > initialTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      break;
    }
    
    const callback = currentTask.callback;
    callback();

    taskQueue.shift()

    currentTask = taskQueue[0];
  }
  if (currentTask !== null) {
    return true;
  } else {
    return false;
  }
}

// 默认的时间切片
const frameInterval = 5;

function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    return false;
  }

  return true;
}
```

我们可以看到在 flushWork 中，我们调用的是 workLoop 函数，在 workLoop 中，我们取出任务列表中的第一个任务，然后判断任务是否过期，以及是否应该让出线程（shouldYieldToHost）

在 shouldYieldToHost 中，`getCurrentTime()` 表示当前的时间，`startTime` 我们是在收到 postMessage 的消息时执行 performWorkUntilDeadline 函数的时间，performWorkUntilDeadline 中，我们执行 `scheduledHostCallback(hasTimeRemaining, currentTime)`，也就是 `flushWork(hasTimeRemaining, initialTime)`，也就是 `workLoop(hasTimeRemaining, initialTime)`，workLoop 中我们又进行了 shouldYieldToHost 的判断。

那你可能要说，从 performWorkUntilDeadline 到 shouldYieldToHost，这中间全是同步操作，就没隔多少时间呀，确实如此，执行第一个任务的时候，getCurrentTime() 和 startTime 确实没有隔多少时间，耗时的任务是 taskQueue 中的任务，也就是 `const callback = currentTask.callback; callback()`这里。

等跑完第一个任务，我们又会判断一次 shouldYieldToHost，如果还不超过 5ms（默认的时间切片时间），我们就接着执行任务，再判断 shouldYieldToHost，直到任务列表空了，或者过了 5ms。

如果过了 5ms，发现还有任务，hasMoreWork 是 true，然后会执行 `schedulePerformWorkUntilDeadline`，也就是再执行一个 `port.postMessage(null)`，这样就让出了线程，让浏览器能够处理动画和用户输入，等浏览器处理完，它会执行 port1.onmessage 推入的 `performWorkUntilDeadline` 任务，在 `performWorkUntilDeadline` 中又接着遍历执行任务列表，就这样每执行 5ms 的任务，就让出线程，直到完成任务列表中的所有任务。

时间切片
----

现在我们终于得知了 React 时间切片的真相。

React 把 React 的更新操作做成了一个个任务，塞进了 taskQueue，也就是任务列表，如果直接遍历执行这个任务列表，纯同步操作，执行期间，浏览器无法响应动画或者用户的输入，于是借助 MessageChannel，依然是遍历执行任务，但当每个任务执行完，就会判断过了多久，如果没有过默认的切片时间（5ms），那就再执行一个任务，如果过了，那就调用 postMessage，让出线程，等浏览器处理完动画或者用户输入，就会执行 onmessage 推入的任务，接着遍历执行任务列表。

一个完整可用的简化版
----------

```
// 用于模拟代码执行耗费时间
const sleep = delay => {
	for (let start = Date.now(); Date.now() - start <= delay;) {}
}

// performWorkUntilDeadline 的执行时间，也就是一次批量任务执行的开始时间，通过现在的时间 - startTime，来判断是否超过了切片时间
let startTime;

let scheduledHostCallback;
let isMessageLoopRunning = false;
let getCurrentTime = () => performance.now();

const taskQueue = [{
	expirationTime: 1000000,
	callback: () => {
		sleep(30);
		console.log(1)
	}
}, {
	expirationTime: 1000000,
	callback: () => {
		sleep(30);
		console.log(2)
	}
}, {
	expirationTime: 1000000,
	callback: () => {
		sleep(30);
		console.log(3)
	}
}]

function requestHostCallback(callback) {
	scheduledHostCallback = callback;
	if (!isMessageLoopRunning) {
		isMessageLoopRunning = true;
		schedulePerformWorkUntilDeadline();
	}
}

const channel = new MessageChannel();
const port = channel.port2;

function performWorkUntilDeadline() {
	if (scheduledHostCallback !== null) {
		const currentTime = getCurrentTime();
		startTime = currentTime;
		const hasTimeRemaining = true;

		let hasMoreWork = true;
		try {
			hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
		} finally {
			console.log('hasMoreWork', hasMoreWork)
			if (hasMoreWork) {
				schedulePerformWorkUntilDeadline();
			} else {
				isMessageLoopRunning = false;
				scheduledHostCallback = null;
			}
		}
	} else {
		isMessageLoopRunning = false;
	}
};

channel.port1.onmessage = performWorkUntilDeadline;

let schedulePerformWorkUntilDeadline = () => {
	port.postMessage(null);
};

function flushWork(hasTimeRemaining, initialTime) {
	return workLoop(hasTimeRemaining, initialTime);
}

let currentTask;

function workLoop(hasTimeRemaining, initialTime) {
	currentTask = taskQueue[0];
	while (currentTask != null) {
		console.log(currentTask)
		if (
			currentTask.expirationTime > initialTime &&
			(!hasTimeRemaining || shouldYieldToHost())
		) {
			break;
		}

		const callback = currentTask.callback;
		callback();

		taskQueue.shift()

		currentTask = taskQueue[0];
	}

	if (currentTask != null) {
		return true;
	} else {
		return false;
	}
}

const frameInterval = 5;

function shouldYieldToHost() {
	const timeElapsed = getCurrentTime() - startTime;
	if (timeElapsed < frameInterval) {
		return false;
	}
	return true;
}

requestHostCallback(flushWork)
```

最后
--

从讲解 FPS 到 requestAnimationFrame 再到 requestIdleCallback，再到本篇的时间切片，算是为 React 系列的第一个大篇章 —— Scheduler 篇拉开了序幕。我们开始讲 React 的重要组成部分，Scheduler（调度器）。

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")
5.  [React 之 Race Condition](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")
6.  [React 之 Suspense](https://juejin.cn/post/7163934860694781989 "https://juejin.cn/post/7163934860694781989")
7.  [React 之从视觉暂留到 FPS、刷新率再到显卡、垂直同步再到 16ms 的故事](https://juejin.cn/post/7164394153848078350 "https://juejin.cn/post/7164394153848078350")
8.  [React 之 requestAnimationFrame 执行机制探索](https://juejin.cn/post/7165780929439334437 "https://juejin.cn/post/7165780929439334437")
9.  [React 之 requestIdleCallback 来了解一下](https://juejin.cn/post/7166547963517337614 "https://juejin.cn/post/7166547963517337614")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。