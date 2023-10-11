> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6983702070293430303?searchId=202310111103016E8274A0BA870F4C7E11)

最近在和同事闲聊 **var 和 let 的区别**时，我被嘲笑了，起因是我提出了 **var 具有变量提升的特性而 let 没有**的观点。在我看来这不是最常刷到的面试题吗？但是在一番仔细研究之后我发现事情并不是我想象的这样，即 **let 同样存在变量提升，只是 let 存在暂时性死区。**

变量提升
----

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

原因就是 js 在创建执行上下文时，会检查代码，找出变量声明和函数声明，并将函数声明完全存储在环境中，而将通过 var 声明的变量设定为 undefined，这就是所谓的变量提升。从字面上理解就是变量和函数声明会被移动到函数或者全局代码的开头位置。

那么当我们将 var 替换为 let 时，结果又会如何？

```
function fn(){
    console.log(a) // Uncaught ReferenceError: a is not defined
    let a = 12
}
fn()
```

意料之中，代码报错了。很多人通过这个反例，便认为 let 没有变量提升，但其实这是错误的。上面举的例子只能证明，var 存在变量提升，但是并不能证明 let 不存在变量提升。

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

想不到吧！此时的代码又会报错了，从这里其实可以看出 let 也是存在**变量提升**的，知识在变量显式赋值之前不能对变量进行读写，否则就会报错，这也就是所谓的 let 和 const 的**暂时性死区**。

**[暂时性死区（Temporal Dead Zone ）](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FStatements%2Flet%3FretiredLocale%3Dhe "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let?retiredLocale=he")**

引用 MDN 上的定义

> let bindings are created at the top of the (block) scope containing the declaration, commonly referred to as “hoisting”. Unlike variables declared with var, which will start with the value undefined, let variables are not initialized until their definition is evaluated. Accessing the variable before the initialization results in a ReferenceError. The variable is in a “temporal dead zone” from the start of the block until the initialization is processed.

大概意思便是 let 同样存在变量提示（hoisting），只是形式与 var 不同，var 定义的变量将会被赋予 undefined 的初始值，而 let 在被显式赋值之前不会被赋予初始值，并且在赋值之前读写变量都会导致 ReferenceError 的报错。从代码块 (block) 起始到变量求值 (包括赋值) 以前的这块区域，称为该变量的暂时性死区。

```
var x = 'parent value';
(function() {
  // let x 此时暂时性死区开始
  console.log(x); // Uncaught ReferenceError: x is not defined
  //暂时性死区结束
  let x = 'child value' 
}())
```

总结
--

**事实证明 let 和 var 同样存在变量提升，而且 let 声明还具有暂时性死区的概念。**