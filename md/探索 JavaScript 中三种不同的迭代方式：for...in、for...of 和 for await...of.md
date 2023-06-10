> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7222268370268831800)

前言
--

`for...in`、`for...of`和`for await...of`是`JavaScript`中三种不同的迭代方式，我们也经常会用到，但你真的了解它们吗？并知道怎么选择它们吗？

for...in
--------

**MDN**：**`for...in`** **语句**以任意顺序迭代一个对象的除 [Symbol](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FSymbol "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol") 以外的[可枚举](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FEnumerability_and_ownership_of_properties "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties")属性，包括继承的**可枚举属性**。

那么什么是**可枚举属性**？

在`JavaScript`中，**可枚举性**（enumerable）是是**对象属性**的一种特性，用于指示该属性是否可以通过循环访问，常见的可枚举的数据类型有：object、array、string、typedArray

我们可以通过`Object.getOwnPropertyDescriptor` 方法获取对象属性的描述对象。该方法接受**两个参数**：要获取的属性所在的对象和属性名。它返回一个对象，该对象包含以下属性：

*   value: 属性值
*   writable: 布尔类型，表示是否可写
*   enumerable: 布尔类型，表示是否可枚举
*   configurable: 布尔类型，表示是否可配置

```
const obj = {
  name: "张三",
  age: 18,
};

const desc = Object.getOwnPropertyDescriptor(obj, "name");

console.log(desc);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c79fd40f63f546fc9ed1621c68d1b067~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

普通对象的属性默认都是可枚举的，我们一般用于获取**对象的属性名（键）**

```
const obj = {
  name: "张三",
  age: 10,
  hello() {
    console.log("hello");
  },
};
for (const key in obj) {
  console.log(key); // name age hello
}
```

但是有两个点我们要注意：

*   for...in 用于获取对象的**属性名**，包括**自身属性**和**继承属性**
*   for...in 遍历对象时，**顺序并不是固定的**，并且可能会出现一些意外情况

我们以第一个点为例

```
// 定义一个父级对象
const parent = {
  name: "张三",
  say() {
    console.log(this.name);
  },
};

// 以parent为原型,定义一个子级对象
const son = Object.create(parent);
son.age = 19;

// 遍历子级对象的属性
for (const key in son) {
  console.log(key); // 输出 age name say
}
```

那么如何让`for...in`只遍历自己的属性呢？我们可以用`obj.hasOwnProperty()`来判断是否是自己的属性

修改如下：

```
for (const key in son) {
  if (son.hasOwnProperty(key)) {
    console.log(key); // 输出 age
  }
}
```

再说第二个点，如果键名都是字符串，那么顺序没问题，这也是我们大多数的使用情况

```
const obj = {
  name: "张三",
  age: 18,
  say() {
    console.log(this.name);
  },
};

for (const key in obj) {
  console.log(key); // name age say
}
```

要是出现其他类型的键名，顺序就有问题了

```
const obj = {
  name: "张三",
  age: 18,
  say() {
    console.log(this.name);
  },
  2: "数字2",
};

for (const key in obj) {
  console.log(key); // 2 name age say
}
```

for...of
--------

说完`for...in`，我们再来说说`for...of`。

**MDN**：**`for...of`语句**在[可迭代对象](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FIteration_protocols "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols")（包括`Array`, `Map`, `Set`, `String`, `TypedArray`, `arguments` 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

那么什么又是**可迭代对象**呢？

说到可迭代对象，就要讲到**迭代器**了，迭代器是一种对象，它提供统一的接口，为不同的集合（Object、Array、Set、Map）提供了统一的访问机制。总的来说，**可迭代对象就是实现 Symbol.iterator 方法的对象**

> 注意：普通对象不是可迭代对象，所以，for...of 是不能用来遍历普通对象的

还有一个直观感受就是`for...in`用于获取**键（key）**，`for...of`用于获取**值（value）**

```
const arr = ["张三", "李四", "王五"];

for (const key in arr) {
  console.log(key); // 0 1 2
}

for (const value of arr) {
  console.log(value); // "张三", "李四", "王五"
}
```

但我们一般不用于遍历数组，我们用于遍历`Map`，`Set`，`for...of`可以直接遍历`Set`和`Map`

```
const set = new Set(["red", "green", "blue"]);

for (const key of set) {
  console.log(key); // red green blue
}

const map = new Map([
  ["name", "张三"],
  ["age", 19],
]);

for (const [key, value] of map) {
  console.log(key, value); 
  // name 张三
  // age 19
}
```

它们的实例身上也都有如下几个方法，用于返回一个迭代器。

*   keys()：返回键名的迭代器
*   values()：返回键值的迭代器
*   entries()：返回键值对的迭代器

以 Set 为例

```
const set = new Set(["red", "green", "blue"]);

// 因为set只有值，没有键，结果就是这样了
for (const key of set.keys()) {
  console.log(key);
}
for (const key of set.values()) {
  console.log(key);
}
for (const [key, value] of set.entries()) {
  console.log(key, value);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/712045ce37b34344ac8311e02dd1c268~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

再来看看 Map

```
const map = new Map([
  ["name", "张三"],
  ["age", 19],
]);

for (const key of map.keys()) {
  console.log(key);
}
for (const key of map.values()) {
  console.log(key);
}
for (const [key, value] of map.entries()) {
  console.log(key, value);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0760bb19fb549558f215d0fc45a606e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们也可以使用`for...of`来遍历普通对象，借助`Object.keys()`、`Object.values()`、`Object.entries()`，它们都可以把一个对象包装成迭代器，使用起来就和`Map`差不多了。

```
const obj = {
  name: "张三",
  age: 19,
};

for (const key of Object.keys(obj)) {
  console.log(key);
}
for (const key of Object.values(obj)) {
  console.log(key);
}
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f15887d86c14b3dad9a28e63f08ea00~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如何选择`for...in`和`for...of`？

如果你只是想**遍历对象的属性名**，用`for...in`，其他的像`Map`、`Set`用`for...of`。

for await...of
--------------

`for await...of`是 **ES9** 才有的新东西。

**MDN**：**`for await...of` 语句**创建一个循环，该循环遍历**异步可迭代对象**以及**同步可迭代对象**，包括：内置的`String`，`Array`，类似数组对象 (例如`arguments`或 `NodeList`)，`TypedArray`，`Map`，`Set` 和用户定义的异步 / 同步迭代器。它使用对象的每个不同属性的值调用要执行的语句来调用自定义迭代钩子。

> 需要注意的是：我们知道`await`需要配合`async`一起使用，所以，使用了`for await...of`，外层需要`async`。

注意和`for...of`的区别，用于遍历**异步可迭代对象**，当然也可以遍历**同步可迭代对象**，但这样就失去了使用意义。

我们一个例子来讲解：

```
function createAsyncIterable(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
}

// 数组就是一个可迭代对象
const asyncIterable = [createAsyncIterable(2000), createAsyncIterable(1000), createAsyncIterable(3000)];

async function main() {
  for await (const item of asyncIterable) {
    console.log(item);
  }
}

main();
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55df4a01b8304ed793c883502b7cf452~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

它其实相当于

```
function createAsyncIterable(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(delay);
    }, delay);
  });
}

// 数组就是一个可迭代对象
const asyncIterable = [createAsyncIterable(2000), createAsyncIterable(1000), createAsyncIterable(3000)];

async function main() {
  const p1 = await asyncIterable[0];
  console.log(p1);
  const p2 = await asyncIterable[1];
  console.log(p2);
  const p3 = await asyncIterable[2];
  console.log(p3);
}

main();
```

最后
--

创作不易，希望可以点个赞支持一下🥰🥰。若文章有错误，还请指出。