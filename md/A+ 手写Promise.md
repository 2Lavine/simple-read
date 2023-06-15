

前言
==

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

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40c613f7a4534fda80b6c13c346dba15~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**这里包含了三个知识点** 👇：

*   1、Promise 的初始状态是`pending`
*   2、Promise 里没有执行`resolve()`、`reject()`以及`throw`的话，这个 **promise 的状态也是`pending`**
*   3、基于上一条，`pending`状态下的 promise 不会执行回调函数`then()`

**◾ 最后一点：**

```
let myPromise0 = new Promise();
console.log('myPromise0 :>> ', myPromise0);

```

输出结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b95ce2e9ddc74e4eae9eb80d8dd54ba8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

*   规定必须给`Promise`对象传入一个执行函数，否则将会报错。

二、实现 resolve 和 reject
=====================

接下来，大家都知道需要为这个函数参数传入它自己的函数，也就是`resolve()`和`reject()`

原生的 promise 里面可以传入`resolve`和`reject`两个参数

```
let promise = new Promise((resolve, reject) => {})

```

那么我们也得允许手写这边可以传入这两个参数：

```
class myPromise {
    constructor(func) {
+       func(this.resolve, this.reject);
    }
    resolve() {}
    reject() {}
}

```


1.管理状态和结果
----------
因此我们需要提前先把这些状态定义好，可以用`const`来创建外部的固定变量，但是这里为了统一就用`static`来创建`静态属性`：

```
+   static PENDING = 'pending';
+   static FULFILLED = 'fulfilled';
+   static REJECTED = 'rejected';

```

原生 Promise 用`PromiseState`这个字段来保存实例的状态属性，这里就也用 `this.PromiseState` 来保存实例的状态属性，

```
+       this.PromiseState = myPromise.PENDING;
```

那么在执行`resolve()`的时候就需要判断状态是否为 `待定 pending`，如果是 `待定 pending`的话就把状态改为 `成功 fulfilled`:

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        func(this.resolve, this.reject);
    }
    resolve() {
+       if (this.PromiseState === myPromise.PENDING) {
+           this.PromiseState = myPromise.FULFILLED;
+       }
    }
    reject() {}
}

```

同样，为给`reject`添加参数，并且把参数赋值给实例的`PromiseResult`属性:

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        func(this.resolve, this.reject);
    }
    resolve() {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
        }
    }
    reject() {
+       if (this.PromiseState === myPromise.PENDING) {
+           this.PromiseState = myPromise.REJECT;
+       }
    }
}

```

2.this 指向问题
------------
我们来`new`一个实例 🌰 执行一下代码就知道有没有问题了

```
class myPromise {
    ...
}

// 测试代码
+  let promise1 = new myPromise((resolve, reject) => {
+      resolve('这次一定');
+  })

```

运行上面代码，报错 🦁：

`Uncaught TypeError: Cannot read property 'PromiseState ' of undefined`


`resolve()`和`reject()`方法里调用`PromiseState` ，前面是有`this`关键字的

```
resolve(result) {
➡      if (this.PromiseState === myPromise.PENDING) {
➡          this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
➡      if (this.PromiseState === myPromise.PENDING) {
➡          this.PromiseState = myPromise.REJECT;
            this.PromiseResult = reason;
        }
    }

```

我们在`new`一个新实例的时候执行的是`constructor`里的内容，也就是`constructor`里的`this`确实是新实例的，
但现在我们是在新实例被创建后再在外部环境下执行`resolve()`方法的，这里的`resolve()`看着像是和实例一起执行的，其实不然，也就**相当于不在`class`内部使用这个`this`**，而**我们没有在外部定义任何`PromiseState` 变量，因此这里会报错**

在这里我们就可以使用`bind`来绑定`this`就可以了 😺:

```
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
+       func(this.resolve.bind(this), this.reject.bind(this));
```

对于`resolve`来说，这里就是给实例的`resolve()`方法绑定这个`this`为当前的实例对象，并且执行`this.resolve()`方法： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c4f15ab1711462892c301caee12191b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) 对于`reject`来说，这里就是给实例的`reject`方法绑定这个`this`为当前的实例对象，并且执行`this.reject`方法： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/753b61f4ae814801a5ebaafc5c8a3a94~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp) 咱们来测试一下代码吧：

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        func(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }
}


// 测试代码
let promise1 = new myPromise((resolve, reject) => {
    resolve('这次一定');
})
console.log(promise1); 
// myPromise {PromiseState: 'fulfilled', PromiseResult: '这次一定'}
let promise2 = new myPromise((resolve, reject) => {
    reject('下次一定');
})
console.log(promise2); 
// myPromise {PromiseState: 'rejected', PromiseResult: '下次一定'}

```

上面是我们手写的 `myPromise`的执行情况，看看原生 Promise 的执行情况：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/816ff5396d424f96ad4ce694b6a6c910~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

说明执行结果符合我们的预期，是不是觉得离成功又进了一步啦~ 👏👏👏

那么大家觉得下一步我们要做什么？是不是很多同学觉得需要写`then`了？那么我们就先来满足想要写`then`的同学们~

三、实现 then 方法
============

**因为`then`是在创建实例后再进行调用的，因此我们再创建一个 类方法，可千万不要创建在 `constructor` 里面了~** 😛

我想应该有些同学突然失忆😶，不记得`then`怎么用了，我们就来稍微写一下原生的`then`方法：

```
let promise = new Promise((resolve, reject) => {
    resolve('这次一定')
})

+  promise.then(
+      result => {
+          console.log(result);
+      },
+      reason => {
+          console.log(reason.message);
+      }
+  )

```

`then`方法可以传入两个参数，这两个参数都是函数，一个是当状态为`fulfilled 成功` 时执行的代码，另一个是当状态为 `rejected 拒绝` 时执行的代码。

虽然很多人可能一直只用一个函数参数，但不要忘记这里是两个函数参数🧐。

因此我们就可以先给手写的`then`里面添加 **两个参数**：

*   一个是 `onFulfilled` 表示 `“当状态为成功时”`
*   另一个是 `onRejected` 表示 `“当状态为拒绝时”`

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        func(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }
+   then(onFulfilled, onRejected) {}
}

```

1. 状态不可变
--------

这里我们先看看`原生 Promise` 产生的结果：

```
let promise = new Promise((resolve, reject) => {
    resolve('这次一定')
    reject('下次一定')
})

promise.then(
    result => {
        console.log('fulfilled', result);
    },
    reason => {
        console.log('rejected', reason.message);
    }
)

```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89a7957b5ca14038bcff46ff8601aaf8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

可以看到控制台只显示了一个`console.log`的结果，**证明 `Promise` 只会执行`成功状态` 或者 `拒绝状态` 的其中一个**

也就是我们前文讲到的，`Promise` 只以 `第一次为准`，第一次成功就`永久`为`fulfilled`，第一次失败就`永远`状态为`rejected`

因此我们在手写的时候就必须进行判断 🤖：

◾ 如果当前实例的 `PromiseState` 状态属性为 `fulfilled 成功` 的话，我们就执行传进来的 `onFulfilled` 函数，并且为`onFulfilled`函数传入前面保留的`PromiseResult`属性值：

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        func(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }
    then(onFulfilled, onRejected) {
+       if (this.PromiseState === myProise.FULFILLED) {
+           onFulfilled(this.PromiseResult);
+       }
    }
}

```

◾ 如果当前实例的 `PromiseState` 状态属性为 `rejected 拒绝` 的话，我们就执行传进来的 `onRejected` 函数，并且为`onRejected`函数传入前面保留的`PromiseResult`属性值：

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        func(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }
    then(onFulfilled, onRejected) {
        if (this.PromiseState === myProise.FULFILLED) {
            onFulfilled(this.PromiseResult);
        }
+       if (this.PromiseState === myPromise.REJECTED) {
+           onRejected(this.PromiseResult);
+       }
    }
}

```

定义好了判断条件以后，我们就来测试一下代码，也是一样，在实例 🌰 上使用`then`方法：

```
class myPromise {
    ...
}


// 测试代码
let promise1 = new myPromise((resolve, reject) => {
    resolve('这次一定');
+   reject('下次一定');
})
+   promise1.then(
+       result => {
+           console.log(result)
+       },
+       reason => {
+           console.log(reason.message)
+       }
+   )

```

执行上面的测试代码，查看控制台：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e174ad9029c648b49d71be4a809fbc89~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

可以看到控制台只显示了一个`console.log`的结果：`这次一定` 😎，证明我们已经实现了 `promise的状态不可变` 👏👏👏

写到这里并没有报错，也就是我们`暂时安全`了，为什么说`暂时安全`呢？

因为这里还有很多没有完善的地方，手写 Promise 的时候，有一个难点就在于有很多地方需要和原生一样严谨，也就是说原生的 Promise 会考虑很多特殊情况~

我们在实际运用时可能暂时不会碰到这些情况，可是当我们遇到的时候 **却不知底层的原理，`这就是为什么我们要知道如何手写Promise`**

接着写 💪

2. 执行异常 throw
-------------

在`new Promise`的时候，执行函数里面如果抛出错误，是会触发`then`方法的第二个参数，即`rejected`状态的回调函数

也就是在原生的 Promise 里面，`then`方法的第二个参数，即`rejected`状态的回调函数可以把错误的信息作为内容输出出来

到这里，有的同学可能会说，执行异常抛错，不是用`catch()`方法去接吗？为什么这里又说 `是会触发then方法的第二个参数，即rejected状态的回调函数`？😵

那我们就说道说道吧🧐：

`catch()` 方法返回一个`Promise`，并且处理拒绝的情况。它的行为与调用`Promise.prototype.then(undefined, onRejected)` 相同。

事实上, calling `obj.catch(onRejected)` 内部 calls `obj.then(undefined, onRejected)`。(这句话的意思是，我们显式使用`obj.catch(onRejected)`，内部实际调用的是`obj.then(undefined, onRejected)`)

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then(
    null,
    err=> {console.log(err)}
) 

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));

```

◾ 注意看下面的例子 🌰：

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

比较上面两种写法，可以发现`reject()`方法的作用，等同于抛出错误。这一点很重要，因为我们手写 Promise 就是用`try/catch`来处理异常，用的就是上面的思想。

◾ **一般来说，不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。**

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

**回到正题**

原生 Promise 在`new Promise`的时候，执行函数里面如果抛出错误，是会触发`then`方法的第二个参数 `(即rejected状态的回调函数)`，把错误的信息作为内容输出出来:

```
let promise = new Promise((resolve, reject) => {
    throw new Error('白嫖不成功');
})

promise.then(
    result => {
        console.log('fulfiiled:', result)
    },
    reason => {
        console.log('rejected:', reason)
    }
)

```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4afbee05224a4eb99674007130dabf24~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

但是如果我们在手写这边写上同样道理的测试代码，很多人就会忽略这个细节😥：

```
class myPromise {
    ...
}


// 测试代码
let promise1 = new myPromise((resolve, reject) => {
+   throw new Error('白嫖不成功');
})
promise1.then(
+   result => {
+       console.log('fulfiiled:', result)
+   },
+   reason => {
+       console.log('rejected:', reason)
+   }
)

```

我们看看控制台

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/315d46ffbd8b4a9cb4959ad4437e43b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

> `Uncaught` 未捕获

可以发现报错了😰，没有捕获到错误，没有把内容输出出来

◾ 我们可以在执行`resolve()`和`reject()`之前用`try/catch`进行判断，在`构造函数 constructor`里面完善代码，判断生成实例的时候是否有报错 🔍：

*   如果没有报错的话，就按照正常执行`resolve()`和`reject()`方法
*   如果报错的话，就把错误信息传入给`reject()`方法，并且直接执行`reject()`方法

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
+       try {
            func(this.resolve.bind(this), this.reject.bind(this));
+       } catch (error) {
+           this.reject(error)
+       }
    }
    resolve(result) {
        ...
    }
    reject(reason) {
        ...
    }
    then(onFulfilled, onRejected) {
        ...
    }
}

```

◾ **注意这里不需要给`reject()`方法进行`this`的绑定了，因为这里是直接执行，而不是创建实例后再执行。**

▪ `func(this.resolve.bind(this), this.reject.bind(this));` 这里的`this.reject`意思是：把类方法`reject()`作为参数 传到构造函数`constructor` 里要执行的`func()`方法里，只是一个参数，并不执行，只有创建实例后调用`reject()`方法的时候才执行，此时`this`的指向已经变了，所以想要正确调用`myPromise`的`reject()`方法就要通过`.bind(this))`改变`this`指向。

▪ `this.reject(error)`，这里的`this.reject()`，是直接在构造函数里执行类方法，`this`指向不变，`this.reject()`就是直接调用类方法`reject()`，所以不用再进行`this`绑定。

◾ 这里考察了`this`绑定的一个细节🔍：

`call`、`apply`和`bind`都可以改变函数体内部 this 的指向，**但是 `bind` 和 `call/apply` 有一个很重要的区别：一个函数被 `call/apply` 的时候，会立即执行函数，但是 `bind` 会创建一个新函数，不会立即执行。**

这就是前面为什么说， `this.reject.bind(this)`只是作为参数，并没有直接执行的原因了~😀

**回到正文**

结合前面的讲解，刷新一下控制台，我们可以看到手写这边已经没有报错了👏👏👏: ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ccf8aaeace432dbe5c9879d2f65ff8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

3. 参数校验
-------

大家觉得目前代码是不是没问题了？可以进行下一步了？

如果你觉得是的话就又掉坑了~🦁

原生 Promise 里**规定`then`方法里面的两个参数如果不是函数的话就要被忽略**，我们就故意在原生代码这里不传入函数作为参数：

```
let promise = new Promise((resolve, reject) => {
    throw new Error('白嫖不成功');
})

promise.then(
    undefined,
    reason => {
        console.log('rejected:', reason)
    }
)

```

运行以后我们发现在这里执行是没有问题的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bea1e40f6cf4b86abb33233196791b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

我们再以同样类似的不传 **函数参数** 的代码应用在 **手写代码** 上面：

```
class myPromise {
	...
}

let promise1 = new myPromise((resolve, reject) => {
    resolve('这次一定');
})

promise1.then(
    undefined,
    reason => {
        console.log('rejected:', reason)
    }
)

```

大家想想会不会有什么问题？来看看结果会怎样？🧐

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/840804fc6bab4c71b95f75d9c99f1de3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

结果就是 `Uncaught TypeError: onFulfilled is not a function`。浏览器帮你报错了，这不是我们想要的~😥

我们只想要自己来抛出错误，再来看看刚刚的手写`then`部分：

```
then(onFulfilled, onRejected) {
    if (this.PromiseState === myPromise.FULFILLED) {
        onFulfilled(this.PromiseResult);
    }
    if (this.PromiseState === myPromise.REJECTED) {
        onRejected(this.PromiseResult);
    }
}

```

我们会在里面分别执行成功和拒绝两个参数，可是我们不想修改这里的代码，那么就只能把不是函数的参数改为函数

**`Promise` 规范如果 `onFulfilled` 和 `onRejected` 不是函数，就忽略他们**。所谓 “忽略” 并不是什么都不干，对于`onFulfilled`来说 “忽略” 就是将`value`原封不动的返回，对于`onRejected`来说就是返回`reason`，`onRejected`因为是错误分支，我们返回`reason`应该`throw`一个`Error`:

这里我们就可以用 `条件运算符`，我们在进行`if`判断之前进行预先判断：

▪ 如果`onFulfilled`参数是一个函数，就把原来的`onFulfilled`内容重新赋值给它，如果`onFulfilled`参数不是一个函数，就将`value`原封不动的返回

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
+       onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        if (this.PromiseState === myPromise.FULFILLED) {
            onFulfilled(this.PromiseResult);
        }
        if (this.PromiseState === myPromise.REJECTED) {
            onRejected(this.PromiseResult);
        }
    }
}

```

▪ 如果`onRejected`参数是一个函数，就把原来的`onRejected`内容重新赋值给它，如果`onRejected`参数不是一个函数，就`throw`一个`Error`

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
+       onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.FULFILLED) {
            onFulfilled(this.PromiseResult);
        }
        if (this.PromiseState === myPromise.REJECTED) {
            onRejected(this.PromiseResult);
        }
    }
}

```

现在我们再来测试一下代码：

```
class myPromise {
	...
}

let promise1 = new myPromise((resolve, reject) => {
    resolve('这次一定');
})
promise1.then(
    undefined,
    reason => {
        console.log('rejected:', reason)
    }
)

```

查看控制台，发现没有报错了👏👏👏：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d831063ec55e424691019c6039fa4fd2~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**当前实现的完整代码：**

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.FULFILLED) {
            onFulfilled(this.PromiseResult);
        }
        if (this.PromiseState === myPromise.REJECTED) {
            onRejected(this.PromiseResult);
        }
    }
}

```

四、实现异步
======

1. 添加定时器
--------

在对代码进行一些基本修补以后，我们就可以来进行下一个大功能了，也就是 Promise 的 **异步功能** ✨。

可以说我们在手写的代码里面依旧没有植入异步功能，毕竟最基本的`setTimeout`我们都没有使用，但是我们必须先了解一下原生 Promise 的一些`运行顺序规则`。

在这里我为原生代码添加上步骤信息：

```
console.log(1);

let promise = new Promise((resolve, reject) => {
    console.log(2);
    resolve('这次一定');
})

promise.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)

console.log(3);

```

我们配合这段原生 Promise 代码，结合控制台一起看看

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39fcb5dff169440985ce764c281c3b8c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

输出顺序为：

```
fulfilled: 这次一定

```

*   首先执行`console.log(1)`，输出`1`
*   接着创建`promise实例`，输出`2`，因为这里依旧是同步
*   然后碰到`resolve`的时候，修改结果值
*   到了`promise.then`会进行异步操作，也就是我们 **需要先把执行栈的内容清空**，于是就执行`console.log(3)`，输出`3`
*   接着才会执行`promise.then`里面的内容，也就是最后输出`“fulfilled: 这次一定”`

▪ 我们用同样的测试代码应用在 **手写代码** 上面：

```
class myPromise {
	...
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    resolve('这次一定');
})
promise1.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

这次我们发现有些不同了😯，输出顺序为：

```
fulfilled: 这次一定

```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da97821d707844529e81ee0882071271~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

`1` 和 `2` 都没有问题，问题就是`“fulfilled: 这次一定”`和`3`这里的顺序不对

◾ 其实问题很简单，就是我们刚刚说的 **没有设置异步执行** 😶

我们二话不说直接给`then`方法里面添加`setTimeout`就可以了😎，**需要在进行`if`判断以后再添加`setTimeout`，要不然状态不符合添加异步也是没有意义的**，然后在`setTimeout`里执行传入的函数参数：

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.FULFILLED) {
+           setTimeout(() => {
                onFulfilled(this.PromiseResult);
+           });
        }
        if (this.PromiseState === myPromise.REJECTED) {
+           setTimeout(() => {
                onRejected(this.PromiseResult);
+           });
        }
    }
}

```

我们使用前面的用例重新测试一下代码：

```
class myPromise {
	...
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    resolve('这次一定');
})
promise1.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

输出顺序为:

```
fulfilled: 这次一定

```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/937722da9c724fbea2a732000aeb8911~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这次的顺序就比较顺眼了~👏👏👏

**在这里我们解决异步的方法是给`onFulfilled`和`onRejected`添加`setTimeout`，但是为什么要这么做呢？**

◾ 这就要讲到 [**`Promises/A+` 规范**](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com%2F%23notes "https://promisesaplus.com/#notes") 了

规范 `2.2.4` ：

> `onFulfilled` or `onRejected` must not be called until the `execution context` stack contains only platform code. [3.1].

译文：

2.2.4 `onFulfilled` 和 `onRejected` 只有在`执行环境`堆栈仅包含平台代码时才可被调用 `注1`

规范对 2.2.4 做了注释：

> 3.1 Here “platform code” means engine, environment, and promise implementation code. In practice, this requirement ensures that `onFulfilled` and `onRejected` execute asynchronously, after the event loop turn in which `then` is called, and with a fresh stack. This can be implemented with either a “macro-task” mechanism such as setTimeout or `setImmediate`, or with a “micro-task” mechanism such as MutationObserver or process.nextTick. Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.

译文：

**3.1 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 `onFulfilled` 和 `onRejected` 方法异步执行，且应该在 `then` 方法被调用的那一轮事件循环之后的新执行栈中执行。这个事件队列可以采用 “宏任务（macro-task）” 机制，比如`setTimeout` 或者 `setImmediate`； 也可以采用 “微任务（micro-task）” 机制来实现， 比如 `MutationObserver` 或者`process.nextTick`。** 由于 promise 的实施代码本身就是平台代码（译者注： 即都是 JavaScript），故代码自身在处理在处理程序时可能已经包含一个任务调度队列或『跳板』)。

**这里我们用的就是规范里讲到的 “宏任务” `setTimeout`**。

2. 回调保存
-------

异步的问题真的解决了吗？现在又要进入 Promise 另一个难点了，大家务必竖起耳朵啦😛

我们来给原生的 Promise 里添加`setTimeout`，使得`resolve`也异步执行，那么就会出现一个问题了，`resolve`是异步的，`then`也是异步的，究竟谁会先被调用呢？

```
console.log(1);
let promise = new Promise((resolve, reject) => {
    console.log(2);
+   setTimeout(() => {
        resolve('这次一定');
+       console.log(4);
+   });
})
promise.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

输出顺序为：

```
fulfilled: 这次一定

```

特别要注意的是当遇到`setTimeout`的时候被异步执行了，而`resolve('这次一定')`没有被马上执行，而是先执行`console.log(4)`，等到`then`的时候再执行`resolve`里保存的值。

这里涉及到了浏览器的事件循环，`promise.then()` 和 `setTimeout()` 都是异步任务，但实际上异步任务之间并不相同，因此他们的执行优先级也有区别。不同的异步任务被分为两类：`微任务 (micro task)` 和 `宏任务 (macro task`)。

*   `setTimeout()`属于宏任务
    
*   `promise.then()`属于微任务
    

在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的宏任务队列或者微任务队列中去。并且在当前执行栈为空的时候，主线程会 查看微任务队列是否有事件存在。如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈… 如此反复，进入循环。

我们只需记住 **当 当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。**

> 🔍 如果想要学习事件循环、微任务和宏任务，可以看我写的这篇文章：[JavaScript 深入系列之宏任务、微任务和事件循环 Event Loop](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyuanyuanbyte%2FBlog%2Fissues%2F92 "https://github.com/yuanyuanbyte/Blog/issues/92")

**回到正文**

我们用同样的代码应用到手写的部分：

```
class myPromise {
	...
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        resolve('这次一定');
        console.log(4);
    });
})
promise1.then(
    result => {
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

控制台输出：

```

```

可以发现 `fulfilled: 这次一定` 并没有输出

我们可以先猜测一下，没有输出的原因很可能是因为`then`方法没有被执行，看看`then`方法里面是根据条件判断来执行代码的：

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

也就是说很可能没有符合的条件，再换句话说可能没有符合的状态

那么我们就在三个位置分别输出当前的状态，这样分别来判断哪个位置出了问题:

```
class myPromise {
	...
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
+       console.log('A',promise1.PromiseState);
        resolve('这次一定');
+       console.log('B',promise1.PromiseState);
        console.log(4);
    });
})
promise1.then(
    result => {
+       console.log('C',promise1.PromiseState);
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

输出结果为：

```
A pending
B fulfilled

```

发现只有两组状态被输出，这两组都在`console.log(4)`前被输出，证明`setTimeout`里面的状态都被输出了，只有`then`里面的状态没有被输出

这基本就可以确定是因为`then`里的状态判断出了问题

这里涉及到事件循环，我们详细解读一下：

▪ **首先**，执行`console.log(1)`，输出`1`

▪ **第二步**，创建 promise，执行函数体里的`console.log(2)`，输出`2`

▪ **第三步**，遇到`setTimeout`，`setTimeout`是宏任务，将`setTimeout`加入宏任务队列，等待执行

▪ **第四步**，遇到`promise.then()`，`promise.then()`是微任务，将`promise.then()`加入微任务队列，等待执行

▪ **第五步**，执行`console.log(3)`，输出`3`，此时当前执行栈已经清空

▪ **第六步**，当前执行栈已经清空，先执行微任务队列的任务 `promise.then()`，发现 promise 的状态并没有改变，还是`pending`，所以没有输出。状态并没有改变的原因是：`resolve('这次一定')`是在`setTimeout`里的，但此时还没开始执行`setTimeout`，因为`setTimeout`是宏任务，宏任务在微任务后面执行

▪ **第七步**，微任务队列已经清空，开始执行宏任务 `setTimeout`：

```
setTimeout(() => {
     console.log('A',promise1.PromiseState);
     resolve('这次一定');
     console.log('B',promise1.PromiseState);
     console.log(4);
 });

```

▪ **第八步**，执行 `console.log('A',promise1.PromiseState)`，此时 promise 状态还没发生变化，还是`pending`，所以输出 `A pending`

▪ **第九步**，执行 `resolve('这次一定');`，改变 promise 的状态为`fulfilled`

▪ **第十步**，执行 `console.log('B',promise1.PromiseState)`，输出 `B fulfilled`

▪ **第十一步**，执行 `console.log(4)`，输出`4`

> 这里暂且认为我们写的 promise.then() 和原生一样，方便理解

◾ 分析完上面的代码，我们知道了，因为先执行了`then`方法，但发现这个时候状态依旧是 `pending`，而我们手写部分没有定义`pending`待定状态的时候应该做什么，因此就少了`fulfilled: 这次一定` 这句话的输出

所以我们就 **直接给`then`方法里面添加待定状态的情况就可以了**，也就是用`if`进行判断:

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
+       if (this.PromiseState === myPromise.PENDING) {
+ 		
+ 		}
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

◾ 但是问题来了，当`then`里面判断到 `pending` 待定状态时我们要干什么？

因为这个时候`resolve`或者`reject`还没获取到任何值，因此我们必须让`then`里的函数稍后再执行，等`resolve`执行了以后，再执行`then`

为了保留`then`里的函数，我们可以创建 `数组` 来 **保存函数**。

**为什么用 `数组` 来保存这些回调呢？因为一个 promise 实例可能会多次 `then`，也就是经典的 `链式调用`**，而且数组是先入先出的顺序

在实例化对象的时候就让每个实例都有这两个数组：

*   `onFulfilledCallbacks` ：用来 **保存成功回调**
*   `onRejectedCallbacks` ：用来 **保存失败回调**

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
+       this.onFulfilledCallbacks = []; // 保存成功回调
+       this.onRejectedCallbacks = []; // 保存失败回调
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
}

```

◾ 接着就完善`then`里面的代码，也就是当判断到状态为 `pending` 待定时，暂时保存两个回调，也就是说暂且把`then`里的两个函数参数分别放在两个数组里面：

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => {};
        onRejected = typeof onRejected === 'function' ? onRejected : () => {};
        if (this.PromiseState === myPromise.PENDING) {
+           this.onFulfilledCallbacks.push(onFulfilled);
+           this.onRejectedCallbacks.push(onRejected);
        }
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

◾ 数组里面放完函数以后，就可以完善`resolve`和`reject`的代码了

**在执行`resolve`或者`reject`的时候，遍历自身的`callbacks`数组**，看看数组里面有没有`then`那边 **保留** 过来的 **待执行函数**，**然后逐个执行数组里面的函数**，执行的时候会传入相应的参数：

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
+           this.onFulfilledCallbacks.forEach(callback => {
+               callback(result)
+           })
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
 +          this.onRejectedCallbacks.forEach(callback => {
 +              callback(reason)
 +          })
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.PENDING) {
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

完善好代码后，让我们再来测试以下刚才的实例：

```
class myPromise {
	...
}


// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        console.log('A', promise1.PromiseState);
        resolve('这次一定');
        console.log('B', promise1.PromiseState);
        console.log(4);
    });
})
promise1.then(
    result => {
        console.log('C', promise1.PromiseState);
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

输出结果：

```
A pending
C fulfilled
fulfilled: 这次一定
B fulfilled

```

**从上面的结果我们可以看到 `fulfilled: 这次一定` 打印出来啦，`promise1.then()`方法也正常执行，打印出了当前的状态：`B fulfilled`**

**但是**

细心的同学可能已经发现了，代码输出顺序还是不太对，原生 Promise 中，`fulfilled: 这次一定` 是最后输出的

◾ 这里有一个很多人忽略的小细节，**要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行**。因此，**在保存成功和失败回调时也要添加 `setTimeout`**

```
class myPromise {
    ...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.PENDING) {
+           this.onFulfilledCallbacks.push(() => {
+               setTimeout(() => {
+                   onFulfilled(this.PromiseResult);
+               });
+           });
+           this.onRejectedCallbacks.push(() => {
+               setTimeout(() => {
+                   onRejected(this.PromiseResult);
+               });
+           });
        }
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

细节补充好了，**当前实现的完整代码：**

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }
    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
            this.onFulfilledCallbacks.forEach(callback => {
                callback(result)
            })
        }
    }
    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => {
                callback(reason)
            })
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        if (this.PromiseState === myPromise.PENDING) {
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    onFulfilled(this.PromiseResult);
                });
            });
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    onRejected(this.PromiseResult);
                });
            });
        }
        if (this.PromiseState === myPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult);
            });
        }
        if (this.PromiseState === myPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult);
            });
        }
    }
}

```

检验一下这次是否能行：

```
class myPromise {
    ...
}

// 测试代码
console.log(1);
let promise1 = new myPromise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        console.log('A', promise1.PromiseState);
        resolve('这次一定');
        console.log('B', promise1.PromiseState);
        console.log(4);
    });
})
promise1.then(
    result => {
        console.log('C', promise1.PromiseState);
        console.log('fulfilled:', result);
    },
    reason => {
        console.log('rejected:', reason)
    }
)
console.log(3);

```

输出顺序：

```
A pending
B pending
C fulfilled
fulfilled: 这次一定

```

**可以看到最后输出 `fulfilled: 这次一定` ，和原生 Promise 顺序一致！**

到这里我们已经完成了 **promise 的回调保存**，已经越来越接近胜利了😺

3. 验证 then 方法多次调用
-----------------

Promise 的 then 方法可以被多次调用。

用一个 🌰 ，来验证一下我们写的 promise `then` 方法是否可以多次调用：

```
class myPromise {
    ...
}


// 测试代码
const promise = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 2000);
})
promise.then(value => {
    console.log(1)
    console.log('resolve', value)
})
promise.then(value => {
    console.log(2)
    console.log('resolve', value)
})
promise.then(value => {
    console.log(3)
    console.log('resolve', value)
})

```

运行上面 🌰，输出结果👇

```
resolve success
resolve success
resolve success

```

所有 `then` 中的回调函数都已经执行 😎

说明我们当前的代码，已经可以实现 `then` 方法的多次调用✨

👏👏👏 完美，继续

五、实现 then 方法的链式调用
=================

**我们常常用到 `new Promise().then().then()`，这就是链式调用，用来解决回调地狱**

举个例子 🌰

```
let p1 = new Promise((resolve, reject) => {
    resolve(100)
})
p1.then(res => {
    console.log('fulfilled', res);
    return 2 * res
}).then(res => {
    console.log('fulfilled', res)
})

```

输出👇：

```
fulfilled 100
fulfilled 200

```

再举一个例子 🌰 ：

```
const p2 = new Promise((resolve, reject) => {
    resolve(100)
})

p2.then(res => {
    console.log('fulfilled', res);
    return new Promise((resolve, reject) => resolve(3 * res))
}).then(res => {
    console.log('fulfilled', res)
})

```

输出👇：

```
fulfilled 100
fulfilled 300

```

我们先试一下当前的`myPromise`是否可以实现链式调用：

```
class myPromise {
    ...
}

// 测试代码
let p1 = new myPromise((resolve, reject) => {
    resolve(10)
})
p1.then(res => {
    console.log('fulfilled', res);
    return 2 * res
}).then(res => {
    console.log('fulfilled', res)
}) 

```

毫无疑问在控制台里面是会报错的，提示 `then` 方法没有定义：

`Uncaught TypeError: Cannot read property 'then' of undefined`

**`Promise.prototype.then()` 方法返回一个新的 Promise 实例（注意，不是原来那个`Promise`实例）。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法。**

1. Promises/A+ 规范的理解
--------------------

◾ **想要实现`then`方法的链式调用，就必须彻底搞懂`then`方法，这里我们参考 [**`Promises/A+` 规范**](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com%2F%23notes "https://promisesaplus.com/#notes")** 👇

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/113f66b486b748fd82312640d981f4a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**规范在`2.2.7`中这样描述 👇：**

◾ **2.2.7 then 方法必须返回一个 promise 对象**

```
promise2 = promise1.then(onFulfilled, onRejected);

```

*   **2.2.7.1** 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 **Promise 解决过程：`[[Resolve]](promise2, x)`**
*   **2.2.7.2** 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
*   **2.2.7.3** 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值
*   **2.2.7.4** 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因

理解上面的`“返回”`部分非常重要，即：**不论 promise1 被 reject 还是被 resolve 时 promise2 都会执行 Promise 解决过程：`[[Resolve]](promise2, x)`，只有出现异常时才会被 rejected。**

注意 **2.2.7.1** ：

> If either onFulfilled or onRejected returns a value x, **`run the Promise Resolution Procedure [[Resolve]](promise2, x).`**

即：如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 **Promise 解决过程：`[[Resolve]](promise2, x)`**

规范在 **2.3** 中详细描述 **Promise 解决过程** `The Promise Resolution Procedure` 👇

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4fc438128f4b3aa1f665733a491bca~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

译过来 👇：

◾ **2.3 Promise 解决过程**

**Promise 解决过程** 是一个抽象的操作，其需输入一个 `promise` 和一个值，我们表示为 `[[Resolve]](promise, x)`，如果 `x` 有 `then` 方法且看上去像一个 `Promise` ，解决程序即尝试使 `promise` 接受 `x` 的状态；否则其用 `x` 的值来执行 `promise` 。

这种 `thenable` 的特性使得 `Promise` 的实现更具有通用性：**只要其暴露出一个遵循 `Promises/A+` 协议的 `then` 方法即可；这同时也使遵循 `Promises/A+` 规范的实现可以与那些不太规范但可用的实现能良好共存。**

**运行 `[[Resolve]](promise, x)` 需遵循以下步骤：**

▪ **2.3.1 `x` 与 promise 相等**

如果 `promise` 和 `x` 指向同一对象，以 `TypeError` 为据因拒绝执行 `promise`

▪ **2.3.2 `x` 为 Promise**

如果 `x` 为 Promise ，则使 `promise` 接受 `x` 的状态

*   2.3.2.1 如果 `x` 处于等待态， `promise` 需保持为等待态直至 `x` 被执行或拒绝
*   2.3.2.2 如果 `x` 处于执行态，用相同的值执行 `promise`
*   2.3.2.3 如果 `x` 处于拒绝态，用相同的据因拒绝 `promise`

▪ **2.3.3 `x` 为对象或函数**

如果 x 为对象或者函数：

*   2.3.3.1 把 `x.then` 赋值给 `then`
    
*   2.3.3.2 如果取 `x.then` 的值时抛出错误 `e` ，则以 `e` 为据因拒绝 `promise`
    
*   2.3.3.3 如果 `then` 是函数，将 `x` 作为函数的作用域 `this` 调用之。传递两个回调函数作为参数，第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`:
    
    *   2.3.3.3.1 如果 `resolvePromise` 以值 `y` 为参数被调用，则运行 `[[Resolve]](promise, y)`
        
    *   2.3.3.3.2 如果 `rejectPromise` 以据因 `r` 为参数被调用，则以据因 `r` 拒绝 `promise`
        
    *   2.3.3.3.3 如果 `resolvePromise` 和 `rejectPromise` 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
        
    *   2.3.3.3.4 如果调用 `then` 方法抛出了异常 `e`：
        
        *   2.3.3.3.4.1 如果 `resolvePromise` 或 `rejectPromise` 已经被调用，则忽略之
        *   2.3.3.3.4.2 否则以 `e` 为据因拒绝 `promise`
    *   2.3.3.4 如果 `then` 不是函数，以 `x` 为参数执行 `promise`
        

**▪ 2.3.4 如果 `x` 不为对象或者函数，以 `x` 为参数执行 `promise`**

如果一个 `promise` 被一个循环的 `thenable` 链中的对象解决，而 `[[Resolve]](promise, thenable)` 的递归性质又使得其被再次调用，根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励施者检测这样的递归是否存在，若检测到存在则以一个可识别的 `TypeError` 为据因来拒绝 `promise`。

2. Promises/A+ 规范的总结
--------------------

基于规范的描述，我们得到以下几点：

**◾ 1.** `then`方法本身会返回一个新的`Promise`对象，返回一个新的 Promise 以后它就有自己的`then`方法，这样就能实现无限的链式

**◾ 2.** 不论 `promise1` 被 `resolve()` 还是被 `reject()` 时 `promise2` 都会执行 **`Promise 解决过程：[[Resolve]](promise2, x)`**

在手写这里我们把这个 **`Promise 解决过程：[[Resolve]](promise2, x)`** 命名为 `resolvePromise()` 方法，参数为 `(promise2, x, resolve, reject)` 即：

```
function resolvePromise(promise2, x, resolve, reject) {}

```

`resolvePromise()`各参数的意义：

```
/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

其实，这个`resolvePromise(promise2, x, resolve, reject)` 即 `Promise 解决过程：[[Resolve]](promise2, x)` 就是对`resolve()、reject()` 进行**改造增强**， 针对`resolve()`和`reject()`中不同值情况 进行处理。

`resolve()`和`reject()` 返回的 `x` 值的几种情况：

1.  普通值
2.  Promise 对象
3.  thenable 对象 / 函数

**下面我们就根据总结的两点，结合 `Promises/A+ 规范` 来实现 `then` 方法的链式调用 💪💪💪**

3. then 方法返回一个新的 Promise
------------------------

◾ **2.2.7 规范 then 方法必须返回一个 promise 对象**

我们在`then`方法里面返回一个 **`新的手写Promise实例`**，再把原来的代码复制上去：

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        
+       const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    onFulfilled(this.PromiseResult);
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    onRejected(this.PromiseResult);
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        onFulfilled(this.PromiseResult);
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        onRejected(this.PromiseResult);
                    });
                });
            }
+       })
        
+       return promise2
    }
}

```

**◾ 2.2.7.1 规范** 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 **Promise 解决过程：`[[Resolve]](promise2, x)`**

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : +reason => {
            throw reason;
        };

        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
+                   let x = onFulfilled(this.PromiseResult);
+                   resolvePromise(promise2, x, resolve, reject);
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
+                   let x = onRejected(this.PromiseResult);
+                   resolvePromise(promise2, x, resolve, reject);
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        onFulfilled(this.PromiseResult);
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        onRejected(this.PromiseResult);
                    });
                });
            }
        })

        return promise2
    }
}

+/**
+ * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
+ * @param  {promise} promise2 promise1.then方法返回的新的promise对象
+ * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
+ * @param  {[type]} resolve   promise2的resolve方法
+ * @param  {[type]} reject    promise2的reject方法
+ */
+ function resolvePromise(promise2, x, resolve, reject) {}

```

我们在 `myPromise` 类外面声明了一个 **Promise 解决过程**：

```
function resolvePromise(promise2, x, resolve, reject) {

}

```

**`resolvePromise()` 具体方法我们后面会补充~**

**◾ 2.2.7.2 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`**

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
+                   try {
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
+                   } catch (e) {
+                       reject(e); // 捕获前面onFulfilled中抛出的异常
+                   }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
+                   try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
+                   } catch (e) {
+                       reject(e)
+                   }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        onFulfilled(this.PromiseResult);
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        onRejected(this.PromiseResult);
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

**◾ `fulfilled` 和 `rejected` 状态处理完，不要忘了 `pending` 状态的情况**

我们在 `pending` 状态保存的 `resolve()` 和 `reject()` 回调也要符合 `2.2.7.1 和 2.2.7.2 规范`：

> 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行 Promise 解决过程：`[[Resolve]](promise2, x)`

> 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`

```
class myPromise {
	...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e); // 捕获前面onFulfilled中抛出的异常
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
+                       try {
+                           let x = onFulfilled(this.PromiseResult);
+                           resolvePromise(promise2, x, resolve, reject)
+                       } catch (e) {
+                           reject(e);
+                       }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
+                       try {
+                           let x = onRejected(this.PromiseResult);
+                           resolvePromise(promise2, x, resolve, reject);
+                       } catch (e) {
+                           reject(e);
+                       }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

**◾ 2.2.7.3 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的值**

```
class myPromise {
    ...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
+                       if (typeof onFulfilled !== 'function') {
+                           resolve(this.PromiseResult);
+                       } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
+                       }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
+                           if (typeof onFulfilled !== 'function') {
+                               resolve(this.PromiseResult);
+                           } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
+                           }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

**◾ 2.2.7.4 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的据因**

```
class myPromise {
    ...
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.PromiseResult);
                        } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
+                       if (typeof onRejected !== 'function') {
+                           reject(this.PromiseResult);
+                       } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
+                       }
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
+                           if (typeof onRejected !== 'function') {
+                               reject(this.PromiseResult);
+                           } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
+                           }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

规范 **2.2.7.3** 和 **2.2.7.4** 对 `onFulfilled` 和 `onRejected` 不是函数的情况做了更详细的描述，根据描述我们对 `onFulfilled` 和 `onRejected` 引入了新的参数校验，所以之前的参数校验就可以退役了：

```
class myPromise {
    ...
    then(onFulfilled, onRejected) {
-       onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
-       onRejected = typeof onRejected === 'function' ? onRejected : reason => {
-           throw reason;
-       };
    
    ...
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {}

```

搞定 `then` 方法 😎

下面我们开始着手写 **promise 解决过程 `resolvePromise(promise2, x, resolve, reject)`**

六、实现 resolvePromise 方法
======================

**◾ 2.3.1 如果 `promise` 和 `x` 指向同一对象，以 `TypeError` 为据因拒绝执行 `promise`**

```
class myPromise {
    ...
    then(onFulfilled, onRejected) {
        const promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.PromiseResult);
                        } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
+   if (x === promise2) {
+       throw new TypeError('Chaining cycle detected for promise');
+   }
}

```

在这里我们只需要抛出一个 `TypeError` 的异常即可，因为调用 `resolvePromise` 方法外层的 `try...catch` 会抓住这个异常，然后 **以 TypeError 为据因拒绝执行 promise。**

如果从 `onFulfilled` 或 `onRejected` 中返回的 x 就是 promise2，会导致 **循环引用报错**，这部分的处理就是要解决这个问题。

举一个 **循环引用** 的例子🌰：

```
const promise = new Promise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then(value => {
  console.log(value)
  return p1
})

```

使用原生 Promise 执行这个代码，会报类型错误：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ce362aa04d1474899056757d69c2a80~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**◾ 2.3.2 如果 `x` 为 Promise ，则使 `promise` 接受 `x` 的状态**

```
class myPromise {
	...
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

+   if (x instanceof myPromise) {
+       /**
+        * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
+        *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
+        */
+       x.then(y => {
+           resolvePromise(promise2, y, resolve, reject)
+       }, reject);
+   }
}

```

马上就要成功啦😸，还有最后一条😎

**◾ 2.3.3 如果 `x` 为对象或者函数** **◾ 2.3.4 如果 `x` 不为对象或者函数，以 `x` 为参数执行 `promise`**

在判断`x`是对象或函数时，`x` 不能是 `null`，因为 `typeof null`的值也为 `object`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1976a2fb1142468185be97771c418c3c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

我们应该显式的声明 `x != null`，这样 当 `x` 为 `null` 时，直接执行`resolve(x)`，否则，如果不这样不声明，`x` 为 `null` 时就会走到`catch`然后`reject`，这不是我们要的，所以需要检测下`null`：

```
if (x != null && ((typeof x === 'object' || (typeof x === 'function'))))

```

**◾ 2.3.3 和 2.3.4 规范实现如下：**

```
class myPromise {
	...
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

    if (x instanceof myPromise) {
        /**
         * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
         *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
         */
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject)
        }, reject);
+   } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
+       // 2.3.3 如果 x 为对象或函数
+       try {
+           // 2.3.3.1 把 x.then 赋值给 then
+           var then = x.then;
+       } catch (e) {
+           // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
+           return reject(e);
+       }
+
+       /**
+        * 2.3.3.3 
+        * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
+        * 传递两个回调函数作为参数，
+        * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
+        */
+       if (typeof then === 'function') {
+           // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
+           let called = false; // 避免多次调用
+           try {
+               then.call(
+                   x,
+                   // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
+                   y => {
+                       if (called) return;
+                       called = true;
+                       resolvePromise(promise2, y, resolve, reject);
+                   },
+                   // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
+                   r => {
+                       if (called) return;
+                       called = true;
+                       reject(r);
+                   }
+               )
+           } catch (e) {
+               /**
+                * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
+                * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
+                */
+               if (called) return;
+               called = true;
+
+               /**
+                * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
+                */
+               reject(e);
+           }
+       } else {
+           // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
+           resolve(x);
+       }
+   } else {
+       // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
+       return resolve(x);
+   }
}

```

**打完收工**✨✨✨✨

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083987eb143d45f7bb02b903dc56fe99~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**`resolvePromise()`方法 完整代码：**

```
/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

    if (x instanceof myPromise) {
        /**
         * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
         *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
         */
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject)
        }, reject);
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        // 2.3.3 如果 x 为对象或函数
        try {
            // 2.3.3.1 把 x.then 赋值给 then
            var then = x.then;
        } catch (e) {
            // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(e);
        }

        /**
         * 2.3.3.3 
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
        if (typeof then === 'function') {
            // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            let called = false; // 避免多次调用
            try {
                then.call(
                    x,
                    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
                if (called) return;
                called = true;

                /**
                 * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
                 */
                reject(e);
            }
        } else {
            // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}

```

七、完整的 Promises/A+ 实现
====================

到这里我们的`myPromsie`已经完成了 **Promises/A+ 规范** 😸

> ES6 的官方 Promise 还有很多 API，但这些都不在 Promises/A + 里面

这里为大家提供了两个完整的 Promises/A+ 实现版本：

1.  清爽简洁 无注释版
2.  按步分析 注释加持版

1. 清爽简洁 无注释版
------------

**完整的 Promises/A+ 实现 `(清爽简洁 无注释版)`：**

_完整版的代码较长，这里如果看不清楚的可以去我的 GitHub 上看，我专门维护了一个 手写 Promsie 的仓库_：[github.com/yuanyuanbyt…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyuanyuanbyte%2FPromise "https://github.com/yuanyuanbyte/Promise")

```
class myPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(func) {
        this.PromiseState = myPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try {
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error)
        }
    }

    resolve(result) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
            this.onFulfilledCallbacks.forEach(callback => {
                callback(result)
            })
        }
    }

    reject(reason) {
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => {
                callback(reason)
            })
        }
    }

    then(onFulfilled, onRejected) {
        let promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolve(this.PromiseResult);
                        } else {
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

    if (x instanceof myPromise) {
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject)
        }, reject);
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        try {
            var then = x.then;
        } catch (e) {
            return reject(e);
        }

        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(
                    x,
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                if (called) return;
                called = true;

                reject(e);
            }
        } else {
            resolve(x);
        }
    } else {
        return resolve(x);
    }
}

```

2. 按步分析 注释加持版
-------------

**完整的 Promises/A+ 实现 `(按步分析 注释加持版)`：**

_完整版的代码较长，这里如果看不清楚的可以去我的 GitHub 上看，我专门维护了一个 手写 Promsie 的仓库_：[github.com/yuanyuanbyt…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyuanyuanbyte%2FPromise "https://github.com/yuanyuanbyte/Promise")

```
class myPromise {
    // 用static创建静态属性，用来管理状态
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
    constructor(func) { // 给类的构造方法constructor添加一个参数func
        this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
        this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            /**
             * func()传入resolve和reject，
             * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
             * new 对象实例时，自动执行func()
             */
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
            this.reject(error)
        }
    }

    resolve(result) { // result为成功态时接收的终值
        // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
            /**
             * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
             * 看看数组里面有没有then那边 保留 过来的 待执行函数，
             * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
             */
            this.onFulfilledCallbacks.forEach(callback => {
                callback(result)
            })
        }
    }

    reject(reason) { // reason为拒绝态时接收的终值
        // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => {
                callback(reason)
            })
        }
    }

    /**
     * [注册fulfilled状态/rejected状态对应的回调函数] 
     * @param {function} onFulfilled  fulfilled状态时 执行的函数
     * @param {function} onRejected  rejected状态时 执行的函数 
     * @returns {function} newPromsie  返回一个新的promise对象
     */
    then(onFulfilled, onRejected) {
        // 2.2.7规范 then 方法必须返回一个 promise 对象
        let promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                /**
                 * 为什么这里要加定时器setTimeout？
                 * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
                 * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
                 * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
                 * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
                 */
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            // 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
                            resolve(this.PromiseResult);
                        } else {
                            // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                        reject(e); // 捕获前面onFulfilled中抛出的异常
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1，2.2.7.2，2.2.7.3 和 2.2.7.4 规范
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

    if (x instanceof myPromise) {
        /**
         * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
         *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
         */
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject)
        }, reject);
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        // 2.3.3 如果 x 为对象或函数
        try {
            // 2.3.3.1 把 x.then 赋值给 then
            var then = x.then;
        } catch (e) {
            // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(e);
        }

        /**
         * 2.3.3.3 
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
        if (typeof then === 'function') {
            // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            let called = false; // 避免多次调用
            try {
                then.call(
                    x,
                    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
                if (called) return;
                called = true;

                // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
                reject(e);
            }
        } else {
            // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}

```

八、Promise A+ 测试
===============

如何证明我们写的`myPromise`就符合 **Promises/A+** 规范呢？

跑一下 Promise A+ 测试 就好啦~

1. 安装官方测试工具
-----------

我们使用 Promises/A + 官方的测试工具 [promises-aplus-tests](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpromises-aplus%2Fpromises-tests "https://github.com/promises-aplus/promises-tests") 来对我们的`myPromise`进行测试

**安装 `promises-aplus-tests`:**

```
npm install promises-aplus-tests -D

```

**安装完测试工具后的项目目录：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7151919f5a44882b61466d0e2cf7d31~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

2. 使用 CommonJS 对外暴露 myPromise 类
-------------------------------

```
class myPromise {
	...
}

function resolvePromise(promise2, x, resolve, reject) { 
	...
}

+ module.exports = myPromise;

```

3. 实现静态方法 deferred
------------------

要使用 `promises-aplus-tests` 这个工具测试，必须实现一个静态方法`deferred()`，官方对这个方法的定义如下:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/370aab7c0bed4cd6b360ddee24b0cd0d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

意思就是：

我们要给自己手写的`myPromise`上实现一个静态方法`deferred()`，该方法要返回一个包含`{ promise, resolve, reject }`的对象：

*   `promise` 是一个处于`pending`状态的 Promsie。
*   `resolve(value)` 用`value`解决上面那个`promise`
*   `reject(reason)` 用`reason`拒绝上面那个`promise`

**`deferred()`的实现如下：**

```
class myPromise {
	...
}

function resolvePromise(promise2, x, resolve, reject) { 
	...
}

+  myPromise.deferred = function () {
+      let result = {};
+      result.promise = new myPromise((resolve, reject) => {
+          result.resolve = resolve;
+          result.reject = reject;
+      });
+      return result;
+  }

module.exports = myPromise;

```

4. 配置 package.json
------------------

我们实现了`deferred` 方法，也通过 CommonJS 对外暴露了`myPromise`，最后配置一下`package.json`就可以跑测试啦~😺

新建一个 `package.json` ，**配置如下：**

```
// package.json
{
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  },
  "scripts": {
    "test": "promises-aplus-tests myPromise"
  }
}

```

**项目目录：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/830bd69f1d4f42c397004c45e954e33a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

准备工作已就绪👏👏👏

激动人心的时刻马上就要到啦，嘿嘿😸

5. 完美通过官方 872 个测试用例
-------------------

**执行测试命令：**

```
npm run test

```

肯定都等不及了吧~😜 快来看看我们的测试结果吧，走起 🚀

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d8240233514a888b2276a84afbbcb3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

Promises/A+ 测试总共 872 用例，我们写的 Promise 完美通过了所有用例:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/825b38548ff847b1afbd4342da1aebad~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

九、其他方法
======

在 ES6 的官方 Promise 还有很多 API，比如：

*   Promise.resolve
*   Promise.reject
*   Promise.prototype.catch
*   Promise.prototype.finally
*   Promise.all
*   Promise.allSettled
*   Promise.race

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d7cd1a55e1342019cb28ba1405a9da5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

虽然这些都不在 Promises/A+ 规范里面，但是我们也来实现一下吧，加深理解。其实我们前面我们用了很大功夫实现了 Promises/A+ ，现在再来实现这些已经是小菜一碟了，因为这些 API 全部是前面的封装而已。

1. 实现 Promise.resolve
---------------------

2. 实现 Promise.reject
--------------------

3. 实现 Promise.prototype.catch
-----------------------------

4. 实现 Promise.prototype.finally
-------------------------------

5. 实现 Promise.all
-----------------

6. 实现 Promise.allSettled
------------------------

7. 实现 Promise.any
-----------------

8. 实现 Promise.race()
--------------------

_因文章字数限制，Promise 其他方法的手写实现已放在下篇：_ [看了就会，手写 Promise 全部 API 教程，包括处于 TC39 第四阶段草案的 Promise.any()](https://juejin.cn/post/7044088065874198536 "https://juejin.cn/post/7044088065874198536")

❤️ 结尾
=====

如果这篇文章 **对你的学习** 有所 **帮助**，欢迎 **点赞** 👍 **收藏** ⭐ **留言** 📝 ，**你的支持** 是我 **创作分享** 的 **动力！**

_学习过程中如果有疑问，[点击这里](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyuanyuanbyte%2FBlog "https://github.com/yuanyuanbyte/Blog")，可以获得我的联系方式，与我交流~_

**关注公众号「前端圆圆」**，第一时间获取文章更新。

**更多更全更详细** 的 **优质内容**， **[猛戳这里查看](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyuanyuanbyte%2FBlog "https://github.com/yuanyuanbyte/Blog")**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd520cf6949f40fcae03b779c4019802~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

声明
==

本文 “第四节：实现异步” 之前的内容 都是学习自 B 站 up 主 **技术蛋老师**：[www.bilibili.com/video/BV1RR…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1RR4y1p7my "https://www.bilibili.com/video/BV1RR4y1p7my")

_注：本篇文章的内容我已于 B 站 up 主 **技术蛋老师** 交流并取得认可，已经获得免责。_

没有 蛋老师 的视频，这篇文章可能要很晚才能跟大家见面~

**蛋老师 [space.bilibili.com/327247876](https://link.juejin.cn?target=https%3A%2F%2Fspace.bilibili.com%2F327247876 "https://space.bilibili.com/327247876") 的视频质量都很高**，节流和防抖我就是通过蛋老师的视频学习的，里面还有很多视频内容，通俗易懂，我自己都后悔没有早点接触蛋老师，少走多少弯路啊，**欢迎大家支持关注蛋老师**💝~

参考
==

*   [Promises/A+ (promisesaplus.com)](https://link.juejin.cn?target=https%3A%2F%2Fpromisesaplus.com%2F "https://promisesaplus.com/")
*   [Promise A+ 规范 (malcolmyu.github.io)](https://link.juejin.cn?target=https%3A%2F%2Fmalcolmyu.github.io%2F2015%2F06%2F12%2FPromises-A-Plus%2F "https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/")
*   [手写 Promise 核心代码](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1RR4y1p7my%3Ffrom%3Dsearch%26seid%3D14552865939751412953%26spm_id_from%3D333.337.0.0 "https://www.bilibili.com/video/BV1RR4y1p7my?from=search&seid=14552865939751412953&spm_id_from=333.337.0.0")
*   [Promise 详解与实现（Promise/A + 规范）](https://link.juejin.cn?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2F459a856c476f "https://www.jianshu.com/p/459a856c476f")
*   [手写一个 Promise/A+, 完美通过官方 872 个测试用例](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fdennisj%2Fp%2F12660388.html "https://www.cnblogs.com/dennisj/p/12660388.html")
*   [剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fxieranmaya%2Fblog%2Fissues%2F3 "https://github.com/xieranmaya/blog/issues/3")
*   [Promise.prototype.then() - JavaScript | MDN (mozilla.org)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise%2Fthen "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then")
*   [Promise.prototype.catch() - JavaScript | MDN (mozilla.org)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise%2Fcatch "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch")
*   [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469#heading-19 "https://juejin.cn/post/6945319439772434469#heading-19")