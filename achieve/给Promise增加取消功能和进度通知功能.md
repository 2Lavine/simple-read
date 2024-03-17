> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7312349904046735400?utm_source=gold_browser_extension)

取消功能
----

我们都知道 Promise 的状态是不可逆的，
- 也就是说只能从 pending -> fulfilled 或 pending -> rejected，这一点是毋庸置疑的。
但现在可能会有这样的需求，在状态转换过程当中我们可能不再想让它进行下去了，也就是说让它**永远停留至 pending 状态**。

- 方法一：不调用resolve和 reject
```
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      // handler data, no resolve and reject
    }, 1000);
 });
 console.log(p); // Promise {<pending>} 💡
```
但注意我们的需求条件，是**在状态转换过程中**，也就是说必须有调用 resolve 和 reject，只不过中间可能由于某种条件，阻止了这两个调用。



---
利用 `Promise.race` 来看看：模拟一个发送请求，如果超时则提示超时错误：
```
const getData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log("发送网络请求获取数据"); // ❗
      resolve("success get Data");
    }, 2500);
  });

const timer = () =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject("timeout");
    }, 2000);
  });

const p = Promise.race([getData(), timer()])
  .then((res) => {
    console.log("获取数据:", res);
  })
  .catch((err) => {
    console.log("超时: ", err);
  });
```

问题是现在确实能够确认超时了，但 `race` 的本质是内部会遍历传入的 promise 数组对它们的结果进行判断，即使超时网络请求还会发出：

----

我们直接先来看红宝书上给出的答案：

```js
      class CancelToken {
        constructor(cancelFn) {
          this.promise = new Promise((resolve, reject) => {
            cancelFn(() => {
              console.log("delay cancelled");
              resolve();
            });
          });
        }
      }
      const sendButton = document.querySelector("#send");
      const cancelButton = document.querySelector("#cancel");

      function cancellableDelayedResolve(delay) {
        console.log("prepare send request");
        return new Promise((resolve, reject) => {
          const id = setTimeout(() => {
            console.log("ajax get data");
            resolve();
          }, delay);
          const cancelToken = new CancelToken((cancelCallback) =>
            cancelButton.addEventListener("click", cancelCallback)
          );
          cancelToken.promise.then(() => clearTimeout(id));
        });
      }
      sendButton
	.addEventListener("click", () => cancellableDelayedResolve(1000));

```

我就按照自己的思路封装个不一样的：

```js
const sendButton = document.querySelector("#send");
const cancelButton = document.querySelector("#cancel");

class CancelPromise {
 // delay: 取消功能期限  request：获取数据请求(必须返回 promise)
  constructor(delay, request) {
    this.req = request;
    this.delay = delay;
    this.timer = null;
  }

  delayResolve() {
    return new Promise((resolve, reject) => {
      console.log("prepare request");
      this.timer = setTimeout(() => {
        console.log("send request");
        this.timer = null;
        this.req().then(
          (res) => resolve(res),
          (err) => reject(err)
        );
      }, this.delay);
    });
  }

  cancelResolve() {
    console.log("cancel promise");
    this.timer && clearTimeout(this.timer);
  }
}

// 模拟网络请求
function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("this is data");
    }, 2000);
  });
}

const cp = new CancelPromise(1000, getData);
sendButton.addEventListener("click", () =>
  cp.delayResolve().then((res) => {
    console.log("拿到数据：", res);
  })
);
cancelButton.addEventListener("click", () => cp.cancelResolve());
```
进度通知功能
-----
进度通知？那不就是类似发布订阅嘛？还真是，我们来看红宝书针对这块的描述：

> 执行中的 Promise 可能会有不少离散的 “阶段”，在最终解决之前必须依次经过。某些情况下，监控 Promise 的执行进度会很有用

这个需求就比较明确了，我们直接来看红宝书的实现吧，核心思想就是扩展之前的 Promise，为其添加 `notify` 方法作为监听，并且在 executor 中增加额外的参数来让用户进行通知操作：

```
class TrackablePromise extends Promise {
  constructor(executor) {
    const notifyHandlers = [];
    super((resolve, reject) => {
      return executor(resolve, reject, (status) => {
        notifyHandlers.map((handler) => handler(status));
      });
    });
    this.notifyHandlers = notifyHandlers;
  }
  notify(notifyHandler) {
    this.notifyHandlers.push(notifyHandler);
    return this;
  }
}
let p = new TrackablePromise((resolve, reject, notify) => {
  function countdown(x) {
    if (x > 0) {
      notify(`${20 * x}% remaining`);
      setTimeout(() => countdown(x - 1), 1000);
    } else {
      resolve();
    }
  }
  countdown(5);
});

p.notify((x) => setTimeout(console.log, 0, "progress:", x));
p.then(() => setTimeout(console.log, 0, "completed"));
```



End
===
关于取消功能在红宝书上 TC39 委员会也曾准备增加这个特性，但相关提案最终被撤回了。
结果 ES6 Promise 被认为是 “激进的”：只要 Promise 的逻辑开始执行，就没有办法阻止它执行到完成。
实际上我们学了这么久的 Promise 也默认了这一点，因此这个取消功能反而就不太符合常理，而且十分鸡肋。
比如说我们有使用 then 回调接收数据，但因为你点击了取消按钮造成 then 回调不执行，我们知道 Promise 支持链式调用，那如果还有后续操作都将会被中断，这种中断行为 debug 时也十分痛苦，更何况最麻烦的一点是你还需要传入一个 delay 来表示取消的期限，而这个期限到底要设置多少才合适呢...
