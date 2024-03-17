> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6983702070293430303?searchId=202310111103016E8274A0BA870F4C7E11)
### 证明 var 声明存在变量提升

通常我们是这样子来证明 var 存在变量提升的。

```
function fn(){
    console.log(a) // undefined
    var a = 12
}
fn()
```

为什么这段代码会输出 undefined，而不是报错呢？
原因就是 js 在创建执行上下文时，会检查代码，找出变量声明和函数声明，并将函数声明完全存储在环境中，而将通过 var 声明的变量设定为 undefined，这就是所谓的变量提升。
从字面上理解就是变量和函数声明会被移动到函数或者全局代码的开头位置。
### 证明 let 声明存在变量提升

我们再举一个例子：

```
var x = 'parent value';
(function() {
  console.log(x); // parent value
}())
```

代码会输出 parent value，原因很简单，涉及到了**作用域链**的知识。在匿名函数作用域中没有找到 x 变量，便会沿着作用域链，找到父级作用域，然后便再父级作用域中找到了 x 变量，并输出。

接着我们在匿名函数中，加入 let 进行变量声明，此时结果会是如何呢？

```
var x = 'parent value';
(function() {
  console.log(x); // Uncaught ReferenceError: x is not defined
  let x = 'child value'
}())
```

此时的代码又会报错了，从这里其实可以看出 let 也是存在**变量提升**的，这也就是所谓的 let 和 const 的**暂时性死区**。
暂时性死区只是在变量提升这一层额外加上了禁止访问。
- 即读写变量都会导致 ReferenceError 的报错