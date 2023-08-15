> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7140642609806082061)

学习目标
----
*   同步更新 & 异步更新
*   为啥采用 MessageChannel 而不是 setTimeout 等 api 实现异步任务调度
*   任务切片
*   时间切片

同步更新页面
------

老板说了，他有一组任务，点击按钮的时候，需要遍历执行完这组任务，统计全部任务执行完成的耗时，然后更新到页面。每个任务执行耗时差不多 2ms，如下：

```
let works = [];
for (let i = 0; i < 3000; i++) {
  works.push(() => {
    const start = new Date().getTime();
    while (new Date().getTime() - start < 2) {}
  });
}
```

小李看了看，老板的需求总是这么简单，不到 2 秒，小李已经实现了如下：

```
btn.onclick = () => {
  const startTime = new Date().getTime();
  flushWork();
  const endTime = new Date().getTime();
  animate.innerHTML = endTime - startTime;
};

function flushWork() {
  works.forEach((w) => w());
}
```

---
点了下按钮。结果，过了差不多 6 秒页面才更新，同时页面卡死，再次点击按钮都点不了。
因为这组任务是同步执行的，所有任务执行完成，总共耗时差不多 6 秒，而在这个过程中，js 引擎一直占用着控制权，浏览器无法绘制页面，也无法响应用户，用户体验相当不好
所以，这组耗时长的任务不应该同步执行

使用 setTimeout 异步更新页面
--------------------

为了不长时间占用主线程，阻塞浏览器渲染，小李将任务拆分到定时器执行，每个定时器执行一个任务。
每执行一次都判断 works 是否全部执行完成，如果全部执行完成，则更新页面。
每执行完一次任务，都主动将控制权让出给浏览器。

```
btn.onclick = () => {
  startTime = new Date().getTime();
  flushWork();
};

function flushWork() {
  setTimeout(workLoop, 0);
}

function workLoop() {
  const work = works.shift();
  if (work) {
    work();
    setTimeout(workLoop, 0);
  } else {
    const endTime = new Date().getTime();
    animate.innerHTML = endTime - startTime;
  }
}
```

点击按钮，这次页面动画终于不卡顿了，然而等了差不多 19 秒的时间，页面才更新。

---
为啥这次执行耗时 19266 毫秒，远比之前多出了 13266 毫秒？
小李看了下 Performance。
虽然使用了`setTimeout(workLoop, 0)`0 毫秒的时间间隔，但是浏览器依然会有 4 到 5 毫秒的间隔时间。如果两次 setTimeout 之间最少间隔 4 毫秒，都有至少 3000 * 4 = 12000 毫秒的耗时了。
显然，setTimeout 由于 4 毫秒间隔的原因，不适用于我们的场景。

---
不使用 Promise 或者 MutationObserver 等微任务 API 的原因是，微任务是在页面更新前全部执行完成的，效果和同步执行任务差不多。

使用 MessageChannel 异步更新页面
------------------------
使用 `MessageChannel` 触发一个宏任务，在宏任务事件中执行工作。
每执行完一个工作，判断是否已经执行完全部的工作，如果是，则更新页面，否则调用`port.postMessage(null)`触发下一个宏任务，继续执行剩余的工作。

```
var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = workLoop;

let startTime;
btn.onclick = () => {
  startTime = new Date().getTime();
  port.postMessage(null);
};

function workLoop() {
  const work = works.shift();
  if (work) {
    work();
    port.postMessage(null);
  } else {
    const endTime = new Date().getTime();
    animate.innerHTML = endTime - startTime;
  }
}
```

自测了下，发现耗时只用了 6090 毫秒！
为什么会多出了 90 毫秒？观察 performance 可以看出，虽然两次宏任务之间间隔非常短，但也会导致额外的开销，累积起来就有了几毫秒的差异。不过，这已经很贴近 6000 毫秒的执行耗时了，优势远胜于 setTimeout

### MessageChannel问题分析

这次，小李能够同时兼顾页面动画流畅、不卡顿以及快速响应用户输入，尽早更新页面。
但是还有一点小瑕疵，由于两次任务之间还是会有一点点的时间间隔，执行数量众多的任务时，这些间隔的时间就会累加起来，就会有几毫秒的额外开销。

任务切片：一次宏任务事件尽可能执行更多的任务
----------------------

在上一节中，额外消耗的时间等于两次宏任务之间的时间间隔 * 工作的数量：
显然，我们无法控制两次宏任务之间的时间间隔，但是我们可以减少触发宏任务事件的次数。
可以通过在一次宏任务事件中执行更多的任务来达到这个目的。
同时，一次宏任务事件的执行耗时又不能超过 1 帧的时间 (16.6ms)，毕竟我们需要留点时间给浏览器绘制页面
为了达到这个目的，小李将任务拆分成几小段执行，即**任务切片**。

---
既然一帧 16.6 毫秒，执行一次任务需要 2 毫秒，那只需要在一次宏任务事件中执行 7 个任务就好，这样浏览器还有 2.6 毫秒绘制页面。

```
var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = workLoop;

let startTime;
btn.onclick = () => {
  startTime = new Date().getTime();
  port.postMessage(null);
};
function workLoop() {
  let i = 0;
  while (i < 7) {
    let work = works.shift();
    if (work) {
      work();
      i++;
    } else {
      const endTime = new Date().getTime();
      animate.innerHTML = endTime - startTime;
      i = 7; // 没有剩余工作就直接退出循环
    }
  }
  if (works.length) {
    port.postMessage(null);
  }
}
```


### 任务切片问题分析

采用任务切片的方法极大减少了触发 message channel 的次数，减少了宏任务之间调度的额外消耗。
但任务切片的一个前提是，每个任务执行耗时是确定的，比如这里是 2 毫秒，但真实的业务场景是无法知道任务的执行耗时的
我们来探讨一种时间切片的方式
时间切片
----

我们知道浏览器一帧只有 16.6ms，同时我们的工作执行耗时又不是确定的。
那我们可以，将一次宏任务的执行时间尽可能的控制在一定的时间内，比如 5ms。
每完成一个工作任务，都判断执行时间是否超出了 5 毫秒，如果超出了 5 毫秒，则不继续执行下一个工作任务，结束本轮宏任务事件，**主动让出控制权**给浏览器绘制页面。
如果没有超过 5 毫秒，则继续执行下一个工作任务。

---
时间切片实现如下：

```
let works = [];
for (let i = 0; i < 3000; i++) {
  works.push(() => {
    const start = new Date().getTime();
    while (new Date().getTime() - start < 2) {}
  });
}
const btn = document.getElementById("btn");
const animate = document.getElementById("animation");

var channel = new MessageChannel();
var port = channel.port2;
channel.port1.onmessage = workLoop;

let endTime;
let startTime;
btn.onclick = () => {
  startTime = new Date().getTime();
  port.postMessage(null);
};
const yieldInterval = 5; // 单位毫秒
function workLoop() {
  const currentEventStartTime = new Date().getTime();
  let work = works.shift();
  while (work) {
    work();
    // 执行完当前工作，则判断时间是否超过5ms，如果超过，则退出while循环
    if (new Date().getTime() - currentEventStartTime > yieldInterval) {
      // 执行耗时超过了5ms，结束本轮事件，主动让出控制权给浏览器绘制页面或者执行其他操作
      break;
    }
    work = works.shift();
  }
  // 如果还有剩余的工作，则放到下一个事件中处理
  if (works.length) {
    port.postMessage(null);
  } else {
    const endTime = new Date().getTime();
    animate.innerHTML = endTime - startTime;
  }
}
```
小结
--

到目前为止，效果还是很不错的。小李收获了以下知识：

*   耗时长的同步任务会长时间占用浏览器导致无法响应用户输入，页面卡顿等问题
*   setTimeout 由于有至少 4 毫秒的延迟，因此不适合用于异步任务的调度
*   MessageChannel 在一帧的时间内调用频率超高，两次 message channel 宏任务事件之间的间隔开销极少，适合用于异步任务的调度。
*   由于无法提前得知任务执行时间，从而无法计算一帧之内应该执行几个任务，所以任务切片不太适用于一帧内调度异步任务。
*   时间切片是比较理想的选择

开源第一步
-----
小李决定将这个小工具开源

---
1. 将 Message Channel 抽成一个公用的调度方法

通过 requestHostCallback 触发一个 message channel 事件，
同时在 performWorkUntilDeadline 接收事件

如果 scheduledHostCallback 返回 true，说明还有剩余的工作没完成，则调度下一个宏任务事件执行剩余的工作。

```
const yieldInterval = 5;
let deadline = 0;
const channel = new MessageChannel();
let port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
function performWorkUntilDeadline() {
  if (scheduledHostCallback) {
    // 当前宏任务事件开始执行
    let currentTime = new Date().getTime();
    // 计算当前宏任务事件结束时间
    deadline = currentTime + yieldInterval;
    const hasMoreWork = scheduledHostCallback(currentTime);
    if (!hasMoreWork) {
      scheduledHostCallback = null;
    } else {
      // 如果还有工作，则触发下一个宏任务事件
      port.postMessage(null);
    }
  }
}
function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  port.postMessage(null);
}
```

---
这里需要注意，我们必须在 performWorkUntilDeadline (用来接受事件)开始时获取到当前的时间 currentTime，然后计算出本次事件执行的截止时间，performWorkUntilDeadline 的执行时间控制在 5 毫秒内，因此截止时间就是 deadline = currentTime + yieldInterval;

---
2. 我们需要一个 scheduleCallback 方法给用户添加任务，
我们将用户添加的任务保存在 taskQueue 中。然后触发一个 message channel 事件，异步执行任务。

```
let taskQueue = [];
let isHostCallbackSchedule = false;
function scheduleCallback(callback) {
  var newTask = {
    callback: callback,
  };
  taskQueue.push(newTask);
  if (!isHostCallbackScheduled) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
  return newTask;
}
```

---
3. 最后需要实现 flushwork 方法，在 workLoop 方法中，每执行一个工作，都需要判断当前 performWorkUntilDeadline 事件执行时间是否超过 5ms

```
let currentTask = null;
function flushWork(initialTime) {
  return workLoop(initialTime);
}

function workLoop(initialTime) {
  currentTask = taskQueue[0];

  while (currentTask) {
    if (new Date().getTime() >= deadline) {
      // 每执行一个任务，都需要判断当前的performWorkUntilDeadline执行时间是否超过了截止时间
      break;
    }
    var callback = currentTask.callback;
    callback();

    taskQueue.shift();
    currentTask = taskQueue[0];
  }
  if (currentTask) {
    // 如果taskQueue中还有剩余工作，则返回true
    return true;
  } else {
    return false;
  }
}
```

---
schedule 实现的使用

```
const btn = document.getElementById("btn");
const animate = document.getElementById("animation");
let startTime;
btn.onclick = () => {
  startTime = new Date().getTime();
  for (let i = 0; i < 3000; i++) {
    if (i === 2999) {
      scheduleCallback(() => {
        const start = new Date().getTime();
        while (new Date().getTime() - start < 2) {}
        const endTime = new Date().getTime();
        animate.innerHTML = endTime - startTime;
      });
    } else {
      scheduleCallback(() => {
        const start = new Date().getTime();
        while (new Date().getTime() - start < 2) {}
      });
    }
  }
};
```

以上就是 schedule 的简单实现。下一篇文章会继续实现优先级、延迟任务。