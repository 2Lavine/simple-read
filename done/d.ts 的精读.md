> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6857022744723849230?from=search-suggest)

d.ts 的用法
--------
declare const model:number`

`declare`是一个关键字，标识声明的意思，在`d.ts`文件里面，在最外层声明变量或者函数或者类要在前面加上这个关键字。
在`typescript`的规则里面，如果一个`.ts、.d.ts`文件如果没有用到`import`或者`export`语法的话，那么最顶层声明的变量就是全局变量。

### 全局使用模式
全局变量  
`declare let aaa:number|string` 
`declare const max:200`


## 全局函数
由上面的全局变量的写法我们很自然的推断出一个全局函数的写法如下：
```
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

### 模块化使用方式（CommonJS）

如果文件里我们使用了 import 或者 export 语法，
那么 bbb 和 ccc 在其他代码里不能访问到，即不是全局变量

`export { aaa }` 使用：
`import { a1, a2 } from "./A"`
`console.log(a1)` `console.log(a2)` 那么对应的 A.d.ts 文件是这样写的：
`declare var a1: 1` `declare var a2: 2`
`export { a1,a2 }` 


d.ts 的优点
--------
*   可以对数据、方法、对象的类型进行限定
*   最大好处就是可以有对应方法、参数的提示信息，方便选择

d.ts 文件放的位置
-----------
> 经常有人问写出来的`d.ts文件（A.d.ts）`文件放到哪个目录里，如果是模块化的话那就放到和源码`（A.js）`文件同一个目录下，如果是全局变量的话理论上放到哪里都可以 ---—当然除非你在`tsconfig.json` 文件里面特殊配置过。
