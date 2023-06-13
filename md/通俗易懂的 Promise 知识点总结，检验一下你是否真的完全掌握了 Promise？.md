> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7020335414980378655#heading-10)

前言
==

Promise 想必大家都十分熟悉，想想就那么几个 api，可是你真的了解 Promise 吗？

本文就带大家彻底盘点 promise~

Promise 简介
==========

Promise 是一种处理异步代码（而不会陷入回调地狱）的方式。

多年来，promise 已成为语言的一部分（在 ES2015 中进行了标准化和引入），并且最近变得更加集成，在 ES2017 中具有了 async 和 await。

**异步函数** 在底层使用了 promise，因此了解 promise 的工作方式是了解 **async** 和 **await** 的基础。

`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）

一个 `Promise` 必然处于以下几种状态之一：

*   待定 `(pending)`: 初始状态，既没有被兑现，也没有被拒绝。
*   已成功 `(fulfilled)`: 意味着操作成功完成。
*   已拒绝 `(rejected)`: 意味着操作失败。

Promise 如何运作
============

当 promise 被调用后，它会以**处理中状态** `(pending)` 开始。 这意味着调用的函数会继续执行，而 promise 仍处于处理中直到解决为止，从而为调用的函数提供所请求的任何数据。

被创建的 promise 最终会以**被解决状态** `(fulfilled)` 或 **被拒绝状态** `(rejected)` 结束，并在完成时调用相应的回调函数（传给 **then** 和 **catch**）。

◾ 为了让读者尽快对 promise 有一个整体的理解，我们先来看一段 promise 的代码：

```
let p1 = new Promise((resolve, reject) => {
    resolve('成功')
    reject('失败')
})
console.log('p1', p1)

let p2 = new Promise((resolve, reject) => {
    reject('失败')
    resolve('成功')
})
console.log('p2', p2)

let p3 = new Promise((resolve, reject) => {
    throw('报错')
})
console.log('p3', p3)
```

输出结果为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6f97b54d4474b339c6b863c287160f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**这里包含了四个知识点：**

*   1、执行了`resolve`，Promise 状态会变成`fulfilled`，即 **已完成状态**
*   2、执行了`reject`，Promise 状态会变成`rejected`，即 **被拒绝状态**
*   3、Promise 只以`第一次为准`，第一次成功就`永久`为`fulfilled`，第一次失败就永远状态为`rejected`
*   4、Promise 中有`throw`的话，就相当于执行了`reject`

◾ 接下来看下面一段代码，学习新的知识点：

```
let myPromise1 = new Promise(() => {});

console.log('myPromise1 :>> ', myPromise1);

let myPromise2 = new Promise((resolve, reject) => {
    let a = 1;
    for (let index = 0; index < 5; index++) {
        a++;
    }
})

console.log('myPromise2 :>> ', myPromise2)

myPromise2.then(() => {
    console.log("myPromise2执行了then");
})
```

输出结果为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7803e9ea2864446be57893614cdb0d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**这里包含了三个知识点：**

*   1、Promise 的初始状态是`pending`
*   2、Promise 里没有执行`resolve`、`reject`以及`throw`的话，这个 **promise 的状态也是`pending`**
*   3、基于上一条，`pending`状态下的 promise 不会执行回调函数`then()`

**◾ 最后一点：**

```
let myPromise0 = new Promise();
console.log('myPromise0 :>> ', myPromise0);
```

输出结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69545d9620e24d0aa5e0595b92007fcf~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这个里包含了一个知识点：

*   规定必须给`Promise`对象传入一个执行函数，否则将会报错。

不同于 “老式” 的传入回调，在使用 Promise 时，会有以下约定：

*   在本轮 **事件循环** 运行完成之前，回调函数是不会被调用的。
*   即使异步操作已经完成（成功或失败），在这之后通过 then() 添加的回调函数也会被调用。
*   通过多次调用 then() 可以添加多个回调函数，它们会按照插入顺序进行执行。

Promise 很棒的一点就是**链式调用**。

创建 promise
==========

Promise API 公开了一个 Promise 构造函数，可以使用 `new Promise()` 对其进行初始化：

```
let done = true

const isItDoneYet = new Promise((resolve, reject) => {
  if (done) {
    const workDone = '这是创建的东西'
    resolve(workDone)
  } else {
    const why = '仍然在处理其他事情'
    reject(why)
  }
})
```

如你所见，promise 检查了 done 全局常量，如果为真，则 promise 进入**被解决**状态（因为调用了 `resolve` 回调）；否则，则执行 `reject` 回调（将 promise 置于**被拒绝**状态）。 **如果在执行路径中从未调用过这些函数之一，则 promise 会保持处理中状态。**

使用 `resolve` 和 `reject`，可以向调用者传达最终的 promise 状态以及该如何处理。 在上述示例中，只返回了一个字符串，但是它可以是一个对象，也可以为 `null`。 由于已经在上述的代码片段中创建了 promise，因此它已经开始执行。

一个更常见的示例是一种被称为 Promisifying 的技术。 这项技术能够使用经典的 JavaScript 函数来接受回调并使其返回 promise：

```
const fs = require('fs')

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err)  // 调用 `reject` 会导致 promise 失败，无论是否传入错误作为参数，
        return        // 且不再进行下去。
      }
      resolve(data)
    })
  })
}

getFile('/etc/passwd')
.then(data => console.log(data))
.catch(err => console.error(err))
```

使用 promise
==========

在上一个章节中，介绍了如何创建 promise。

现在，看看如何使用 promise。

```
const isItDoneYet = new Promise(/* ... 如上所述 ... */)
//...

const checkIfItsDone = () => {
  isItDoneYet
    .then(ok => {
      console.log(ok)
    })
    .catch(err => {
      console.error(err)
    })
```

运行 `checkIfItsDone()` 会指定当 `isItDoneYet` promise 被解决（在 **then** 调用中）或被拒绝（在 **catch** 调用中）时执行的函数。

实例 promise 封装 AJAX
==================

```
// Promise封装Ajax请求
function ajax(method, url, data) {
    var xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }

        };
        xhr.open(method, url);
        xhr.send(data);
    });
}
```

使用上面封装好的 ajax 发起一个请求：

```
ajax('GET', '/api/categories').then(function (data) {
    // AJAX成功，拿到响应数据
    console.log(data);
}).catch(function (status) {
    // AJAX失败，根据响应码判断失败原因
    new Error(status)
});
```

Promise.resolve()
=================

有时需要将现有对象转为 Promise 对象，`Promise.resolve()`方法就起到这个作用。

> 注意 ❗ ❗ ❗ 这里的`Promise.resolve()`是直接使用的，不是在 promise 对象里的`resolve()`方法，是`Promise.resolve()` ，开头大写，不是`promise`

```
const jsPromise = Promise.resolve($.ajax('/whatever.json'));
```

上面代码将 jQuery 生成的对象，转为一个新的 Promise 对象。

`Promise.resolve()`等价于下面的写法。

```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve`方法的参数分成四种情况。

◾ **（1）参数是一个 Promise 实例**

如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。

◾ **（2）参数是一个 thenable 对象**

`thenable`对象指的是具有`then`方法的对象，比如下面这个对象。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

`Promise.resolve`方法会将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then`方法。

```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```

上面代码中，`thenable`对象的`then`方法执行后，对象`p1`的状态就变为`resolved`，从而立即执行最后那个`then`方法指定的回调函数，输出 42。

◾ **（3）参数不是具有 then 方法的对象，或根本就不是对象**

如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 `Promise` 对象，状态为`resolved`。

```
const p = Promise.resolve('Hello');
p.then(function (s){
  console.log(s)
});
// Hello
```

上面代码生成一个新的 `Promise` 对象的实例`p`。由于字符串`Hello`不属于异步操作（判断方法是字符串对象不具有 `then` 方法），返回 `Promise` 实例的状态从一生成就是`resolved`，所以回调函数会立即执行。`Promise.resolve`方法的参数，会同时传给回调函数。

◾ **（4）不带有任何参数**

`Promise.resolve()`方法允许调用时不带参数，直接返回一个`resolved`状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用`Promise.resolve()`方法。

```
const p = Promise.resolve();
p.then(function () {
  // ...
});
```

上面代码的变量 p 就是一个 Promise 对象。

需要注意的是，立即`resolve()`的 Promise 对象，是在本轮 “事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环” 的开始时。

```
setTimeout(function () {
  console.log('three');
}, 0);
Promise.resolve().then(function () {
  console.log('two');
});
console.log('one');
// one
// two
// three
```

上面代码中，`setTimeout(fn, 0)`在下一轮 “事件循环” 开始时执行，`Promise.resolve()`在本轮 “事件循环” 结束时执行，`console.log('one')`则是立即执行，因此最先输出。

Promise.reject()
================

`Promise.reject(reason)`方法也会返回一个新的 Promise 实例，该实例的状态为`rejected`。

```
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

上面代码生成一个 Promise 对象的实例`p`，状态为`rejected`，回调函数会立即执行。

注意，`Promise.reject()`方法的参数，会原封不动地作为`reject`的理由，变成后续方法的参数。这一点与`Promise.resolve`方法不一致。

```
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};
Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```

上面代码中，`Promise.reject`方法的参数是一个`thenable`对象，执行以后，后面`catch`方法的参数不是`reject`抛出的 “出错了” 这个字符串，而是`thenable`对象。

Promise.prototype.then()
========================

Promise 实例具有`then`方法，也就是说，`then`方法是定义在原型对象`Promise.prototype`上的。它的作用是为 Promise 实例添加状态改变时的回调函数。

`then`方法的第一个参数是`resolved`状态的回调函数。如果该参数不是函数，则会在内部被替换为 `(x) => x`，即原样返回 promise 最终结果的函数；

第二个参数（可选）是`rejected`状态的回调函数。如果该参数不是函数，则会在内部被替换为一个 "Thrower" 函数 (it throws an error it received as argument)。

`then`方法返回的是一个新的`Promise`实例（注意，不是原来那个`Promise`实例）。因此可以采用链式写法，即`then`方法后面再调用另一个`then`方法。

```
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

上面的代码使用`then`方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

采用链式的`then`，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个`Promise`对象（即有异步操作），这时后一个回调函数，就会等待该`Promise`对象的状态发生变化，才会被调用。

```
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  console.log("resolved: ", comments);
}, function (err){
  console.log("rejected: ", err);
});
```

上面代码中，第一个`then`方法指定的回调函数，返回的是另一个`Promise`对象。这时，第二个`then`方法指定的回调函数，就会等待这个新的`Promise`对象状态发生变化。如果变为`resolved`，就调用第一个回调函数，如果状态变为`rejected`，就调用第二个回调函数。

如果采用箭头函数，上面的代码可以写得更简洁。

```
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

前面介绍了 `then` 方法的参数和链式调用，下面详细介绍一下 `then` 方法的返回值，也就是 `then` 方法中的 `return`。

当一个 `Promise` 完成（fulfilled）或者失败（rejected）时，返回函数将被异步调用（由当前的线程循环来调度完成）。具体的返回值 `return` 依据以下规则返回。如果 `then` 中的回调函数：

*   返回 `(return)` 了一个值，那么 `then` 返回的 Promise 将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
*   没有返回 `(return)` 任何值，那么 `then` 返回的 Promise 将会成为接受状态，并且该接受状态的回调函数的参数值为 `undefined`。
*   抛出一个错误，那么 `then` 返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
*   返回 `(return)` 一个已经是接受状态的 Promise，那么 `then` 返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的 Promise 的接受状态回调函数的参数值。
*   返回 `(return)` 一个已经是拒绝状态的 Promise，那么 `then` 返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的 Promise 的拒绝状态回调函数的参数值。
*   返回 `(return)` 一个未定状态（`pending`）的 Promise，那么 `then` 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

链式调用 promise.then()
===================

**`then` 方法返回一个 Promise 对象，其允许方法链，从而创建一个 promise 链。**

链式 promise 的一个很好的示例是 Fetch API，可以用于获取资源，且当资源被获取时将 promise 链式排队进行执行。

Fetch API 是基于 promise 的机制，调用 `fetch()` 相当于使用 new Promise() 来定义 promsie。

```
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))
}

const json = response => response.json()

fetch('/todos.json')
  .then(status)    // 注意，`status` 函数实际上在这里被调用，并且同样返回 promise，
  .then(json)      // 这里唯一的区别是的 `json` 函数会返回解决时传入 `data` 的 promise，
  .then(data => {  // 这是 `data` 会在此处作为匿名函数的第一个参数的原因。
    console.log('请求成功获得 JSON 响应', data)
  })
  .catch(error => {
    console.log('请求失败', error)
  })
```

在此示例中，调用 `fetch()` 从域根目录中的 `todos.json` 文件中获取 TODO 项目的列表，并创建一个 promise 链。

运行 `fetch()` 会返回一个响应 `response`，该响应具有许多属性，在属性中引用了：

*   `status`，表示 HTTP 状态码的数值。
*   `statusText`，状态消息，如果请求成功，则为 OK。

`response` 还有一个 `json()` 方法，该方法会返回一个 promise，该 promise 解决时会传入已处理并转换为 JSON 的响应体的内容。

因此，考虑到这些前提，发生的过程是：链中的第一个 promise 是我们定义的函数，即 `status()`，它会检查响应的状态，如果不是成功响应（介于 200 和 299 之间），则它会拒绝 promise。

此操作会导致 promise 链跳过列出的所有被链的 promise，且会直接跳到底部的 `catch()` 语句（记录`请求失败`的文本和错误消息）。

如果成功，则会调用定义的 `json()` 函数。 由于上一个 promise 成功后返回了 response 对象，因此将其作为第二个 promise 的输入。

在此示例中，返回处理后的 JSON 数据，因此第三个 promise 直接接收 JSON：

```
.then((data) => {
  console.log('请求成功获得 JSON 响应', data)
})
```

Promise.prototype.catch()
=========================

`catch()` 方法返回一个`Promise`，并且处理拒绝的情况。它的行为与调用`Promise.prototype.then(undefined, onRejected)` 相同。

事实上, calling `obj.catch(onRejected)` 内部 calls `obj.then(undefined, onRejected)`。(这句话的意思是，我们显式使用`obj.catch(onRejected)`，内部实际调用的是`obj.then(undefined, onRejected)`)

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

上面代码中，`getJSON()`方法返回一个 Promise 对象，如果该对象状态变为`resolved`，则会调用`then()`方法指定的回调函数；如果异步操作抛出错误，状态就会变为`rejected`，就会调用`catch()`方法指定的回调函数，处理这个错误。另外，`then()`方法指定的回调函数，如果运行中抛出错误，也会被`catch()`方法捕获。

```
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));
  
// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```

◾ 下面是一个例子。

```
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
```

上面代码中，promise 抛出一个错误，就被`catch()`方法指定的回调函数捕获。注意，上面的写法与下面两种写法是等价的。

```
// 写法一
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});
promise.catch(function(error) {
  console.log(error);
});
// 写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function(error) {
  console.log(error);
});
```

比较上面两种写法，可以发现 reject() 方法的作用，等同于抛出错误。

◾ 如果 Promise 状态已经变成 resolved，再抛出错误是无效的。

```
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

上面代码中，Promise 在 resolve 语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

◾ Promise 对象的错误具有 “冒泡” 性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

```
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

上面代码中，一共有三个 Promise 对象：一个由`getJSON()`产生，两个由`then()`产生。它们之中任何一个抛出的错误，都会被最后一个`catch()`捕获。

◾ 一般来说，不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

```
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });
  
// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面`then`方法执行中的错误，也更接近同步的写法（`try/catch`）。因此，建议总是使用`catch()`方法，而不使用`then()`方法的第二个参数。

◾ 跟传统的`try/catch`代码块不同的是，如果没有使用`catch()`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

```
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};
someAsyncThing().then(function() {
  console.log('everything is great');
});
setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

在浏览器中运行上面这段代码，等待两秒后，你会看到控制台正常打印 "123"，并没有因为`someAsyncThing()`方法里的错误阻塞代码运行。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/819b3df49f7b472d8f1f0ad850632955~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

上面代码中，`someAsyncThing()`函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示`ReferenceError: x is not defined`，但是不会退出进程、终止脚本执行，2 秒之后还是会输出 123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是 “Promise 会吃掉错误”。

处理错误
====

在上一章节的示例中，有个 `catch` 被附加到了 promise 链上。

当 promise 链中的任何内容失败并引发错误或拒绝 promise 时，则控制权会转到链中最近的 `catch()` 语句。

```
new Promise((resolve, reject) => {
  throw new Error('错误')
}).catch(err => {
  console.error(err)
})

// 或

new Promise((resolve, reject) => {
  reject('错误')
}).catch(err => {
  console.error(err)
})
```

级联错误
====

如果在 `catch()` 内部引发错误，则可以附加第二个 `catch()`来处理，依此类推。

```
new Promise((resolve, reject) => {
  throw new Error('错误')
})
  .catch(err => {
    throw new Error('错误')
  })
  .catch(err => {
    console.error(err)
  })
```

Promise.prototype.finally()
===========================

`finally()`方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

`finally()` 方法返回一个 Promise。在 promise 结束时，无论结果是`fulfilled`或者是`rejected`，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式。

这避免了同样的语句需要在`then()`和`catch()`中各写一次的情况。

```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

上面代码中，不管`promise`最后的状态，在执行完`then`或`catch`指定的回调函数以后，都会执行`finally`方法指定的回调函数。

如果你想在 `promise` 执行完毕后无论其结果怎样都做一些处理或清理时，`finally()` 方法可能是有用的。

◾ 由于无法知道`promise`的最终状态，所以`finally`的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。

◾ 与`Promise.resolve(2).then(() => {}, () => {})` （resolved 的结果为`undefined`）不同，`Promise.resolve(2).finally(() => {})` resolved 的结果为 `2`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4c3b75fb94146ae8a35a3f424bc28ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

◾ 同样，`Promise.reject(3).then(() => {}, () => {})` (fulfilled 的结果为`undefined`), `Promise.reject(3).finally(() => {})` rejected 的结果为 `3`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6733f2cd59ac47e5bc43cbe8a3aeaee5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

并发 promise.all()
================

可以使用`Promise.all()`，**发起多个并发请求**，然后在所有 promise 都被解决后执行一些操作。

```
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()])
  .then(function (results) {
    const acct = results[0];
    const perm = results[1];
  });
```

ES2015 解构赋值语法也可以执行：

```
Promise.all([getUserAccount, getUserPermissions]).then(([res1, res2]) => {
  console.log('结果', res1, res2)
})
```

当然，不限于使用 `axios`，任何 promise 都可以以这种方式使用，比如：

```
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
```

竞速 promise.race()
=================

race 的用法是：**传入多个 promise 实例，谁跑的快，就以谁的结果执行回调**

`Promise.race赛跑机制，只认第一名`

传给 `race()` 的 `promise列表`，**只要有一个 promise 被解决，则 `Promise.race()` 开始运行，并且只运行一次附加的回调（传入第一个被解决的 `promise` 的结果）**。

示例：

```
const first = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, '第一个')
})
const second = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, '第二个')
})

Promise.race([first, second]).then(result => {
  console.log(result) // 第二个
})
```

**◾ 使用场景**

*   1、把异步操作和定时器放到一起，如果定时器先触发，认为超时，告知用户；
*   2、如果图片等资源有多个存放路径，但是不确定哪个路径的资源更快，可以用该方法同时请求多个路径，哪个路径的资源最先拿到，使用哪个资源
*   3、如果指定时间内没有获得结果，就将 Promise 的状态变为`reject`，否则变为`resolve`

实例：

◾ 把异步操作和定时器放到一起，如果定时器先触发，认为超时，告知用户:

```
function timeOut(time) {
    let result = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("请求超时")
        }, time) // 为了验证方法，可以把时间设小点
    });
    return result;
}

Promise.race([timeOut(200), fetch('https://api.github.com/users/ruanyf')]).then(res => {
    console.log(res);
})
```

现代浏览器原生支持 fetch，所以我们可以直接在浏览器上运行上面的代码：

为了演示效果，这里`setTimeout`时间设小一点，可以看到定时器先完成，然后 `race()` 方法以定时器的结果执行了回调

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e388a53e1874d5792ad3fca3792766f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

把`setTimeout`设大一点，这次接口先请求完成，所以 `race()` 以接口的结果执行了回调

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c8e7f92b3a644fd8308e31d9fa3b773~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

◾ 下面是一个例子，如果指定时间内没有获得结果，就将 Promise 的状态变为`reject`，否则变为`resolve`。

```
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

上面代码中，如果 5 秒之内`fetch`方法无法返回结果，变量`p`的状态就会变为`rejected`，从而触发`catch`方法指定的回调函数。

Promise.allSettled()
====================

该`Promise.allSettled()`方法返回一个在所有给定的 promise 都已经`fulfilled`或`rejected`后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个 promise 的结果时，通常使用它。

相比之下，`Promise.all()` 更适合彼此相互依赖或者在其中任何一个`reject`时立即结束。

`Promise.allSettled()`方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。该方法由 ES2020 引入。

```
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];
await Promise.allSettled(promises);
removeLoadingIndicator();// 移除加载的滚动图标
```

上面代码对服务器发出三个请求，等到三个请求都结束，不管请求成功还是失败，加载的滚动图标就会消失。

该方法返回的新的 Promise 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。状态变成`fulfilled`后，Promise 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 Promise 实例。

```
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

上面代码中，`Promise.allSettled()`的返回值`allSettledPromise`，状态只可能变成`fulfilled`。它的监听函数接收到的参数是数组`results`。该数组的每个成员都是一个对象，对应传入`Promise.allSettled()`的两个 Promise 实例。每个对象都有`status`属性，该属性的值只可能是字符串`fulfilled`或字符串`rejected`。`fulfilled`时，对象有`value`属性，`rejected`时有`reason`属性，对应两种状态的返回值。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a22e24ecb384387ab4b3d2426e1b15a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

◾ 下面是返回值用法的例子。

```
const promises = [ fetch('index.html'), fetch('https://does-not-exist/') ];
const results = await Promise.allSettled(promises);

// 过滤出成功的请求
const successfulPromises = results.filter(p => p.status === 'fulfilled');

// 过滤出失败的请求，并输出原因
const errors = results
  .filter(p => p.status === 'rejected')
  .map(p => p.reason);
```

有时候，我们不关心异步操作的结果，只关心这些操作有没有结束。这时，`Promise.allSettled()`方法就很有用。如果没有这个方法，想要确保所有操作都结束，就很麻烦。`Promise.all()`方法无法做到这一点。

```
const urls = [ /* ... */ ];
const requests = urls.map(x => fetch(x));

try {
  await Promise.all(requests);
  console.log('所有请求都成功。');
} catch {
  console.log('至少一个请求失败，其他请求可能还没结束。');
}
```

上面代码中，`Promise.all()`无法确定所有请求都结束。想要达到这个目的，写起来很麻烦，有了`Promise.allSettled()`，这就很容易了。

常见的错误
=====

**◾ `Uncaught TypeError: undefined is not a promise`**

如果在控制台中收到 `Uncaught TypeError: undefined is not a promise` 错误，则请确保使用 `new Promise()` 而不是 `Promise()`。

**◾ `UnhandledPromiseRejectionWarning`**

这意味着调用的 promise 被拒绝，但是没有用于处理错误的 catch。 在 then 之后添加 catch 则可以正确地处理。

参考
==

*   [Promise - JavaScript | MDN (mozilla.org)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise")
*   [JavaScript Promise (nodejs.cn)](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2Flearn%2Funderstanding-javascript-promises "http://nodejs.cn/learn/understanding-javascript-promises")
*   [阮一峰 ECMAScript 6 (ES6) 标准入门教程 第三版](https://link.juejin.cn?target=https%3A%2F%2Fwww.bookstack.cn%2Fread%2Fes6-3rd%2Fdocs-promise.md "https://www.bookstack.cn/read/es6-3rd/docs-promise.md")
*   [看了就会，手写 Promise 原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630 "https://juejin.cn/post/6994594642280857630")
*   [Promise.all 和 Promise.race 的使用场景](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Flgdaren%2Farticle%2Fdetails%2F105095611 "https://blog.csdn.net/lgdaren/article/details/105095611")