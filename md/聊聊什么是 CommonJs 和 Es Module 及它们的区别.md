> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6938581764432461854?searchId=2023101012253277002476EAD2ECAD31D4)

前言
--

**初衷：** 将我整理的笔记分享给大家，希望本篇文章能给你带来不一样的认知，不喜勿喷。

**适合人群：** 前端初级开发，大佬绕道。

**内容结构：** 为什么有模块化 -> 基本语法 -> 两者区别。

为什么会有 CommonJs 和 Es Module 呢
----------------------------

我们都知道在早期`JavaScript`模块这一概念，都是通过`script`标签引入`js`文件代码。当然这写基本简单需求没有什么问题，但当我们的项目越来越庞大时，我们引入的`js`文件就会越多，这时就会出现以下问题：

*   js 文件作用域都是顶层，这会造成变量污染
*   js 文件多，变得不好维护
*   js 文件依赖问题，稍微不注意顺序引入错，代码全报错

为了解决以上问题`JavaScript`社区出现了`CommonJs`，`CommonJs`是一种模块化的规范，包括现在的`NodeJs`里面也采用了部分`CommonJs`语法在里面。那么在后来`Es6`版本正式加入了`Es Module`模块，这两种都是解决上面问题，那么都是解决什么问题呢。

*   解决变量污染问题，每个文件都是独立的作用域，所以不存在变量污染
*   解决代码维护问题，一个文件里代码非常清晰
*   解决文件依赖问题，一个文件里可以清楚的看到依赖了那些其它文件

**那么我们下面来一一了解它们的语法及弊端吧**

CommonJs 基本语法
-------------

### 导出

`CommonJs`中使用`module.exports`导出变量及函数，也可以导出任意类型的值，看如下案例。

```
// 导出一个对象
module.exports = {
    name: "蛙人",
    age: 24,
    sex: "male"
}

// 导出任意值
module.exports.name = "蛙人"
module.exports.sex = null
module.exports.age = undefined
```

**直接导出**

导出也可以省略`module`关键字，直接写 exports 导出也可以，看如下案例。

```
exports.name = "蛙人"
exports.sex = "male"
```

> 注意：如果使用 exports 导出单个值之后，就不能在导出一个对象值，这只会修改 exports 的对象改变，然而修改无效，最终导出还是 name，和 sex，因为最终的导出是由 module.exports 决定的。

```
exports.name = "蛙人"
exports.sex = "male"
exports = {
    name: "蛙人"
}
```

上面 example 中，这种情况会改变对象的引用值则导出无效，所以最后导出的还是`name`，`sex`。

### 混合导出

混合导出，`exports`和`module.exports`可以同时使用，不会存在问题。

```
exports.name = "蛙人"
module.exports.age = 24
```

### 导入

`CommonJs`中使用`require`语法可以导入，如果想要单个的值，可以通过解构对象来获取。

```
// index.js
module.exports.name = "蛙人"
module.exports.age = 24

let data = require("./index.js")
console.log(data) // { name: "蛙人", age: 24 }
```

### 重复导入

不管是`CommonJs`还是`Es Module`都不会重复导入，就是只要该文件内加载过一次这个文件了，我再次导入一次是不会生效的。

```
let data = require("./index.js")
let data = require("./index.js") // 不会在执行了
```

### 动态导入

`CommonJs`支持动态导入，什么意思呢，就是可以在语句中，使用`require`语法，来看如下案例。

```
let lists = ["./index.js", "./config.js"]
lists.forEach((url) => require(url)) // 动态导入

if (lists.length) {
    require(lists[0]) // 动态导入
}
```

### 导入值的变化

`CommonJs`导入的值是拷贝的，所以可以修改拷贝值，但这会引起变量污染，一不小心就重名。

```
// index.js
let num = 0;
module.exports = {
    num,
    add() {
       ++ num 
    }
}

let { num, add } = require("./index.js")
console.log(num) // 0
add()
console.log(num) // 0
num = 10
```

上面 example 中，可以看到`exports`导出的值是值的拷贝，更改完`++ num`值没有发生变化，并且导入的`num`的值我们也可以进行修改

### 总结

`CommonJs`解决了变量污染，文件依赖等问题，上面我们也介绍了它的基本语法，它可以动态导入 (代码发生在运行时)，不可以重复导入。

Es Module 基本语法
--------------

### 导出

在`Es Module`中导出分为两种，单个导出 (`export`)、默认导出 (`export default`)，单个导出在导入时不像`CommonJs`一样直接把值全部导入进来了，`Es Module`中可以导入我想要的值。那么默认导出就是全部直接导入进来，当然`Es Module`中也可以导出任意类型的值。

```
// 导出变量
export const name = "蛙人"
export const age = 24

// 导出函数也可以
export function fn() {}
export const test = () => {}


// 如果有多个的话
const name = "蛙人"
const sex = "male"
export { name, sex }
```

### 混合导出

可以使用`export`和`export default`同时使用并且互不影响，只需要在导入时地方注意，如果文件里有混合导入，则必须先导入默认导出的，在导入单个导入的值。

```
export const name = "蛙人"
export const age = 24

export default {
    fn() {}，
    msg: "hello 蛙人"
}
```

### 导入

`Es Module`使用的是`import`语法进行导入。如果要单个导入则必须使用花括号`{}` ，**注意：这里的花括号跟解构不一样**。

```
// index,js
export const name = "蛙人"
export const age = 24

import { name, age } from './index.js'
console.log(name, age) // "蛙人" 24

// 如果里面全是单个导出，我们就想全部直接导入则可以这样写
import * as all from './index.js'
console.log(all) // {name: "蛙人", age: 24}
```

### 混合导入

混合导入，则该文件内用到混合导入，`import`语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则报错。

```
// index,js
export const name = "蛙人"
export const age = 24
export default {
    msg: "蛙人"
}

import msg, { name, age } from './index.js'
console.log(msg) // { msg: "蛙人" }
```

上面 example 中，如果导入的名称不想跟原本地名称一样，则可以起别名。

```
// index,js
export const name = "蛙人"
export const age = 24
export default {
    msg: "蛙人"
}

import { default as all,  name, age } from './index.js'
console.log(all) // { msg: "蛙人" }
```

### 导入值的变化

`export`导出的值是值的引用，并且内部有映射关系，这是`export`关键字的作用。而且导入的值，不能进行修改也就是只读状态。

```
// index.js
export let num = 0;
export function add() {
    ++ num
}

import { num, add } from "./index.js"
console.log(num) // 0
add()
console.log(num) // 1
num = 10 // 抛出错误
```

### Es Module 是静态

就是`Es Module`语句 ``import`只能声明在该文件的最顶部，不能动态加载语句，`Es Module` 语句运行在代码编译时。

```
if (true) {
	import xxx from 'XXX' // 报错
}
```

### 总结

`Es Module`也是解决了变量污染问题，依赖顺序问题，`Es Module`语法也是更加灵活，导出值也都是导出的引用，导出变量是可读状态，这加强了代码可读性。

CommonJs 和 Es Module 的区别
------------------------

### CommonJs

*   CommonJs 可以动态加载语句，代码发生在运行时
*   CommonJs 混合导出，还是一种语法，只不过不用声明前面对象而已，当我导出引用对象时之前的导出就被覆盖了
*   CommonJs 导出值是拷贝，可以修改导出的值，这在代码出错时，不好排查引起变量污染

### Es Module

*   Es Module 是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时
    
*   Es Module 混合导出，单个导出，默认导出，完全互不影响
    
*   Es Module 导出是引用值之前都存在映射关系，并且值都是可读的，不能修改
    

感谢
--

谢谢各位在百忙之中点开这篇文章，希望对你们能有所帮助，如有问题欢迎各位大佬指正。

我是蛙人，如果觉得写得可以的话，请点个赞吧。

感兴趣的小伙伴可以加入 [[前端娱乐圈交流群]](https://link.juejin.cn?target=http%3A%2F%2Fchuantu.xyz%2Ft6%2F741%2F1615689907x2073530471.png "http://chuantu.xyz/t6/741/1615689907x2073530471.png") 欢迎大家一起来交流讨论

**往期好文**

[《带你轻松理解数据结构之 Map》](https://juejin.cn/post/6937855370220011551 "https://juejin.cn/post/6937855370220011551")

[《这些工作中用到的 JavaScript 小技巧你都知道吗？》](https://juejin.cn/post/6937092511508725774 "https://juejin.cn/post/6937092511508725774")

[《理解数据结构之 Set，只要 5 分钟！》](https://juejin.cn/post/6934860872704032781 "https://juejin.cn/post/6934860872704032781")

[《【建议收藏】分享一些工作中常用的 Git 命令及特殊问题场景怎么解决》](https://juejin.cn/post/6934487656873082887 "https://juejin.cn/post/6934487656873082887")

[《解构：使数据访问更便捷！》](https://juejin.cn/post/6933063693487833102 "https://juejin.cn/post/6933063693487833102")

[《你真的了解 ES6 中的函数特性么？》](https://juejin.cn/post/6930428551091109896 "https://juejin.cn/post/6930428551091109896")

[《一看就懂的 var、let、const 三者区别》](https://juejin.cn/post/6925641096152399880 "https://juejin.cn/post/6925641096152399880")