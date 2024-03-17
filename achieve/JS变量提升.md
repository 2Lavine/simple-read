> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6933377315573497864?searchId=202310111103016E8274A0BA870F4C7E11)

变量提升机制
------
在变量提升阶段：带 `var` 的只声明还没有被定义，带 `function` 的已经声明和定义。
带 var 和带 function 重名条件下的变量提升优先级，函数先执行。

### 变量提升提升在哪里
如这里，当运行到`log(a)` 的时候，它上面显然没有声明任何变量。
部分语言中，此时的值可能是 12
但由于在这个作用域中，存在 var a声明，因此此时他的值为 undefined

```js
var a =12
function x(){
  console.log(a)
  var a =13
}
x()
```
二. 带 var 和不带 var 的区别
--------------------
*   全局作用域中不带`var`声明变量虽然也可以但是建议带上 `var`声明变量，不带 `var` 的相当于给 window 对象设置一个属性罢了。
*   私有作用域 (函数作用域)，带 `var` 的是私有变量。不带 `var` 的是会向上级作用域查找，如果上级作用域也没有那么就一直找到 window 为止，这个查找过程叫`作用域链`。
*   全局作用域中使用 `var` 申明的变量会映射到 window 下成为属性。
```
a = 12  // == window.a
console.log(a)  // 12
console.log(window.a) // 12

var a = b =12   // 这里的 b 也是不带 var 的。
/* 相当于*/
var a = 12;
b = 12
```

函数内声明提升到 windows
---
问题 3，再来看一道，问下面答案是什么？
```
function x(){
  b =13
}
x()
console.log(b)
```
思路：这是比较简单的一道题，需要注意的是函数内的 b 没有带 `var`，b 会一直向上查找到 window 下，发现 window 下也没有就直接给 window 设置了一个属性 `window.b = '林一一'`，同理全局下的 `a` 也一样。**


---
问题 4，问下面答案是什么
    ```
```
    function foo(){
        console.log(a)
        a =12;
        b = '林一一'
        console.log('b' in window)
        console.log(a, b)
    }
    foo()
    /* 输出
        Uncaught ReferenceError: a is not defined
    /
```

思路：问题 4 和问题 3 的主要区别在于第一个 `console.log(a)` 处，因为 `a` 不在函数作用域内，就会向上找 `window` 下的作用域，发现也没有就会直接抛出引用错误 ReferenceError**

三. 等号左边下的变量提升
-------------
```
print()
var print = function() {
    console.log('林一一')
}
print()
/*输出
    Uncaught TypeError: print is not a function
/
```

> **思路：同样由于变量提升机制带 `var` 的 print 是一开始值是 `undefined`，所以 print() 这时还不是一个函数，所以报出 类型错误 TypeError**


腾讯的一道变量提升的面试题
---   
```
var a=2;
function a() {
	console.log(3);
}
console.log(typeof a);

/* 输出
 * number
 /
```
> **思路：这是一道比较简单的变量提升题，JS 代码自上而下执行时，`a` 被赋值成 2，输出就是 `number` 型**