> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6938581764432461854?searchId=2023101012253277002476EAD2ECAD31D4)

CommonJs 基本语法
-------------

### module导出

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

## 无 module直接导出
导出也可以省略`module`关键字，直接写 exports 导出也可以，看如下案例。

```
exports.name = "蛙人"
exports.sex = "male"
```

无 module 不能导出对象，因为他不是真实的导出值。只是的导出值是 module.exports
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


### ES 混合导入

混合导入，`import`语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则报错。

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

### 导入值的变化
`export`导出的值是值的引用，并且内部有映射关系，这是`export`关键字的作用。
导入的值，不能进行修改也就是只读状态。
但我们可以通过导入的函数进行修改
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
