> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6857022744723849230?from=search-suggest)

.d.ts 的基本使用和一些常识解析
==================

> d.ts 主要是类型定义文件，对一些方法、对象、数据等进行限定。用来定义类型信息及接口规范。

为什么要有 d.ts
----------

用 ts 写的模块咋发布的时候仍然是用 ==js 发布 ==，这就导致了一个问题：**ts 很多的数据类型没了**，所以需要一个 d.ts 文件来标记某个 js 库里面对象类型。

*   引入一些第三方库的时候，没有类型限定，需要用 ts
*   自定义的一些对象，方法，复杂数据等，需要 ts
*   js 文件是给运行引擎用的，而. d.ts 文件是个 IDE(只能编辑器) 写代码时参考使用的。

d.ts 的用法
--------

> `declare const model:number`

`declare`是一个关键字，标识声明的意思，在`d.ts`文件里面，在最外层声明变量或者函数或者类要在前面加上这个关键字。在`typescript`的规则里面，如果一个`.ts、.d.ts`文件如果没有用到`import`或者`export`语法的话，那么最顶层声明的变量就是全局变量。

### 全局使用模式

**变量**

这里声明了一个全局变量 aaa, 类型是数字类型（number）。当然了也可以是 string 类型或者其他或者：

`declare let aaa:number|string` // 注意这里用的是一个竖线表示 "或" 的意思 如果是常量的话用关键字 const 表示：

`declare const max:200`

**函数**

由上面的全局变量的写法我们很自然的推断出一个全局函数的写法如下：

```
/** id是用户的id，可以是number或者string */
decalre function getName(id:number|string):string
```

如果有些参数可有可无，可以加个? 表示非必须。

```
declare function render(callback?:()=>void): string
js中调用的时候，回调传不传都可以：

render()

render(function () {
    alert('finish.')
})
```

**对象**

```
declare class Person {

    static maxAge: number //静态变量
    static getMaxAge(): number //静态方法

    constructor(name: string, age: number)  //构造函数
    getName(id: number): string 
}
```

### 模块化使用方式（CommonJS）

`declare var aaa: 1` `declare var bbb: 2` `declare var ccc: 3` // 因为这个文件里我们使用了 import 或者 export 语法，所以 bbb 和 ccc 在其他代码里不能访问到，即不是全局变量

`export { aaa }` 使用：

`import { a1, a2 } from "./A"`

`console.log(a1)` `console.log(a2)` 那么对应的 A.d.ts 文件是这样写的：

`declare var a1: 1` `declare var a2: 2`

`export { a1,a2 }` 当然了也能这样写：

`export declare var a1: 1` `export declare var a2: 2` 不过建议之前的第一种写法，原因看这里 **[segmentfault.com/a/11](https://link.juejin.cn?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F11 "https://segmentfault.com/a/11")...**

当然了还有人经常问 default 导出的写法：

`declare var a1: 1` `export default a1` 使用的时候当然就是这样用了：

`import a1 from "./A";`

`console.log(a1)`

d.ts 的优点
--------

*   可以对数据、方法、对象的类型进行限定
*   最大好处就是可以有对应方法、参数的提示信息，方便选择

d.ts 文件放的位置
-----------

> 经常有人问写出来的`d.ts文件（A.d.ts）`文件放到哪个目录里，如果是模块化的话那就放到和源码`（A.js）`文件同一个目录下，如果是全局变量的话理论上放到哪里都可以 ---—当然除非你在`tsconfig.json` 文件里面特殊配置过。

参考文档
----

*   [如何编写一个 d.ts 文件](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2FFree-Thinker%2Fp%2F10695612.html "https://www.cnblogs.com/Free-Thinker/p/10695612.html")
*   [如何编写一个 d.ts 文件的步骤详解](https://link.juejin.cn?target=https%3A%2F%2Fwww.jb51.net%2Farticle%2F138217.htm "https://www.jb51.net/article/138217.htm")