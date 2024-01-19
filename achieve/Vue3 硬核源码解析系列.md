> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7201334455058923580?from=search-suggest)

Object.defineProperty 的缺陷
-------------------------

1.  object 中新增字段 没有响应性
2.  array 中指定下标的方式增加字段 没有响应性的

Array 是可以Object.defineProperty的
```js
Object.defineProperty(arr, "0", {
  get: function () {
    console.log("get");
    return 1;
  },
});
```

vue3 的解决方案
----------
**object.defineproperty**
*   代理的并非对象本身，而是对象中的属性
*   只能监听到对象被代理的指定属性，无法监听到对象本身的修改
*   修改对象属性的时候，是对原对象进行修改的，原有属性，则需要第三方的值来充当代理对象
**proxy**
*   proxy 针对对象本身进行代理
*   代理对象属性的变化都可以被代理到
*   修改对象属性的时候，我们针对代理对象进行修改

无论是逻辑的可读性，还是 API 能力上，**proxy** 都比 **object.defineProPerty** 要强很多，这也是 vue3 选择 proxy 的原因。

proxy 的好兄弟 Reflect
------------------
官方解释：**Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法。
```
let obj = { num:10 }
obj.num // 10
Reflect.get(obj,'num') // 10
```
这时候我们就要提一下 Reflect.get 的第三个参数了
```
Reflect.get(target, propertyKey, receiver]) 
// receiver 如果target对象中指定了propertyKey，receiver则为getter调用时的this值。
```
第三个参数 receiver 具有强制修改 this 指向的能力，接下来我们来看一个场景
```
let data = {
  name: '张三',
  age: '12岁',
  get useinfo() {
    return this.name + this.age
  },
}

let dataProxy = new Proxy(data, {
  get(target, key, receiver) {
    console.log('属性被读取')
    return target[key]
  },
})
console.log(dataProxy.useinfo)
```
打印情况如下
```
属性被读取
张三12岁
```

​ **dataProxy.useinfo** 的 get 输出的值是正常的，但是 get 只被触发了一次，这是不正常的；理想情况应当是 **get** 被触发三次。
为什么会出现这样的情况呢，这是因为调用 **userinfo** 的时候，**this 指向了 data，实际执行的是 data.userinfo，此时的 this 指向 data，而不是 dataProxy**，此时 get 自然是监听不到 name、age 的 get 了。

​ 这时候我们就用到了 Reflect 的第三个参数，**来重置 get set 的 this 指向**。
```
let dataProxy = new Proxy(data, {
  get(target, key, receiver) {
    console.log('属性被读取')
    return Reflect.get(target, key, receiver) // this强制指向了receiver
    // return target[key]
  },
})
```
打印情况如下
```
属性被读取
属性被读取
属性被读取
张三12岁
```
现在打印就正常了，**get** 被执行的 3 次，此时的 **this** 指向了 **dataProxy**，**Reflect** 很好的解决了以上的 this 指向问题。
​ 通过以上案例，我们可以看到使用 **target[key] **有些情况下是不符预期的，比如案例中的被代理对象 this 指向问题，而使用** Reflect** 则可以更加稳定的解决这些问题，在 vue3 源码中也确实是这么用的。

补充章节（WeakMap）
-------------

​ 通过以上文章，我们了解到了 **object.defineproperty** 相较于 **proxy** 的劣势，以及搭配 **proxy** 同时出现的 **Reflect** 的原因，这是 **vue3** 最核心的 **api**。
​ 但是仅仅知道理解 **proxy+reflect**，还不太够，为了尽量轻松的阅读 **Vue3** 源码，我们还要学习一个**原生 API**，那就是 **WeakMap**。
​ **weakMap** 和 **map** 一样都是 **key value** 格式，但是他们还是存在一些差别。
*   **weakMap** 的 **key** 必须是对象，并且是**弱引用**关系
*   **Map** 的 **key** 可以是任何值（基础类型 + 对象），但是 key 所引用的对象是**强引用**关系
​

## why vue3 weakMap
**weakMap** 可以实现的功能，**Map** 也是可以实现的，那为什么 **Vue3** 内部使用了 **WeakMap** 呢，问题就在**引用关系**上
**强引用：不会因为引用被清除而失效**
**弱引用：会因为引用被清除而自动被垃圾回收**

概念似乎还无法体现其实际作用，我们通过以下案例即可明白
```
// Map
let obj = { name: '张三' }
let map = new Map()
map.set(obj, 'name')
obj = null // obj的引用类型被垃圾回收
console.log(map) // map中key obj依旧存在
// WeakMap
let obj = { name: '张三' }
let map = new WeakMap()
map.set(obj, 'name')
obj = null // obj的引用类型被垃圾回收
console.log(map) // weakMap中key为obj的键值对已经不存在
```

通过以上案例我们可以了解到
*   弱引用在**对象与 key 共存**场景存在优势，**作为 key 的对象被销毁的同时，WeakMap 中的 key value 也自动销毁了**。
*   弱引用也解释了为什么 **weakMap** 的 **key** 不能是基础类型，因为基础类型存在栈内存中，不存在弱引用关系；
在 vue3 的依赖收集阶段，源码中用到了 WeakMap，具体什么作用？我们下一节进行解答。
