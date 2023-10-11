> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6933377315573497864?searchId=202310111103016E8274A0BA870F4C7E11)

> **前言： 大家好，我是林一一，这是一篇关于变量提升的面试题及其概念，每一道题都基本使用画图的方式讲解来保证大家能理解的更深。让我们来开始阅读吧。**

思维导图
----

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29123856098442e993f188a77cfd21f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

变量提升机制
------

一. 什么是变量提升？
-----------

*   变量提升示例

```
/* 你应该见过下面的类似代码，那你知道这是为什么*/
console.log(a)  // undefined
var a = 10
```

> 定义：变量提升是当栈内存作用域形成时，JS 代码执行前，浏览器会将带有`var, function`关键字的变量**提前**进行声明 declare(值默认就是 undefined)，定义 defined(就是赋值操作)，这种预先处理的机制就叫做变量提升机制也叫预定义。 在变量提升阶段：带 `var` 的只声明还没有被定义，带 `function` 的已经声明和定义。所以在代码执行前有带 `var` 的就提前声明，比如这里的 `a` 就赋值成 `undefined`，在代码执行过程中遇到`创建函数的代码`浏览器会直接跳过。

> 不考虑变量提升阶段的 js 运行机制相关参考 [JS 运行机制基础版](https://juejin.cn/post/6926729456790798343 "https://juejin.cn/post/6926729456790798343")

### 讲解示例

```
var a =12
var b = a
b = 1
function sum(x, y) {
    var total = x + y
    return total
}
sum(1, 2)
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/579be5ba5dd644f09e7c85ce9b366de1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 变量提升只发生在当前作用域。比如：在页面开始加载时，只有全局作用域发生变量提升，这时候的函数中存储的都是代码字符串。

> **PS: 函数在调用时创建执行上下文对象还有其他关键的步骤作用域创建，this 指向等这些内容放在后面文章讲，这样的机制有点类似变量提升。下面的函数创建过程都会被按作类似于变量提升来理解。**

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
    

### 思考题

1.  问下面分别输出什么？
    
    ```
    // 1
    console.log(a, b)
    var a =12, b ='林一一'
    function foo(){
    // 2
        console.log(a, b)
    // 3
        var a = b =13
        console.log(a, b)
    }
    foo()
    console.log(a, b)
    
    /* 输出：
        undefined undefined
        undefined "林一一"
        13 13
        12 13
    */
    ```
    
2.  问下面的结果和上面的有何不同？
    
    ```
    console.log(a, b)
    var a =12, b = '林一一'
    function foo(){
        console.log(a, b)
    //  var a =b =13
        console.log(a, b)
    }
    foo()
    // 4
    console.log(a, b)
    
    /* 输出：
        undefined undefined
        12 "林一一"
        12 "林一一"
        12 "林一一
    */
    ```
    

### 解答

> **上面的思考题不知道你都对了没，下面让我来解答，详情看图**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b4d95156c6c4a0ca41dbb9a7e245663~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> **思路：1 处的 a, b 其实就是 window 下面的属性为 undefined。在函数内部由于变量提升机制 `a`带 `var` 一开始就是 undefined，`b`不带`var` 将向上级作用域查找，找到全局作用域下的`林一一`所以 2 处打印出来的就是 `undefined "林一一"`。随后 `a =13，window.b =13`，即原来 `b='林一一'` 变成了 `b=13`，打印出`13, 13`，最后第 4 处打印处`12, 13`。所以结合流程图，很明显知道答案**

3.  问题 3，再来看一道，问下面答案是什么？
    
    ```
    a = 2
    function foo(){
        var a =12;
        b = '林一一'
        console.log('b' in window)
        console.log(a, b)
    }
    
    foo()
    console.log(b)
    console.log(a)
    
    /* 输出
        true
        12 "林一一"
        林一一
    /
    ```
    
    > **思路：这是比较简单的一道题，需要注意的是函数内的 b 没有带 `var`，b 会一直向上查找到 window 下，发现 window 下也没有就直接给 window 设置了一个属性 `window.b = '林一一'`，同理全局下的 `a` 也一样。**
    
    ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f30f07481d74adb9e52409cd5df3174~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp )
4.  问题 4，问下面答案是什么？和问题 3 有什么区别
    
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
    
    > **思路：问题 4 和问题 3 的主要区别在于第一个 `console.log(a)` 处，因为 `a` 不在函数作用域内，就会向上找 `window` 下的作用域，发现也没有就会直接抛出引用错误 ReferenceError**
    
5.  经典面试题
    
    ```
    fn();
    console.log(v1);
    console.log(v2);
    console.log(v3);
    function fn(){
        var v1 = v2 = v3 = 2019;
        console.log(v1);
        console.log(v2);
        console.log(v3);
    }
    /*输出
        Uncaught ReferenceError: v1 is not defined
    /
    ```
    
    > **思路：和问题 4 类似，不做分析**
    

三. 等号左边下的变量提升
-------------

*   函数左边的变量提升
    
    *   普通函数下变量提升示例
    
    ```
    print()
    function print(){
        console.log('林一一')
    }
    print()
    ```
    
    > **很显然上面都输出了 `林一一`，因为带 function 的已经进行了变量提升**
    
    *   匿名函数下的带`=`的变量提升

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

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aeeedbf69f44ef7a945619dd70c32ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

四. 条件判断下的变量提升
-------------

*   if else 条件判断下的变量提升

```
console.log(a)
if(false){
    var a = '林一一'
}
console.log(a)
/* 输出
    undefined
    undefined
/
```

> **在当前作用域中不管条件是否成立都会进行变量提升**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f4c79d9c7d6428fa514e2708370cbe9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   if 中 `()` 内的表达式不会变量提升

```
var y = 1
if(function f(){}){ 
    console.log(typeof f)  // undefined
    y = y + typeof f
}
console.log(y)  // 1undefined
```

> 判断的条件没有提升，所以条件内部的 f 是未定义

*   新版浏览器中，在条件判断块级作用域之外使用条件内函数。
*   **为了迎合 ES6 语法只有 JS 执行到条件语句，判断条件是成立的才会对条件内的函数`赋值`，不成立不被赋值只被定义成`undefined`**

```
console.log(print())    // == window.print()
if(true){
    function print() {
        console.log('林一一')
    }
}
console.log(print())
/* 输出
    undefined
    林一一
    undefined
*/
```

> 第一行代码 `console.log(print())` 相当于 `window.print()` 是内置函数，返回值就是 `undefined`

```
console.log(a)
console.log(p())
if(true){
    var a = 12
    function p() {
        console.log('林一一')
    }
}
/*
* undefined
* Uncaught TypeError: p is not a function
*/
```

> 全局下不管条件是否成立都会对带 `var, function` 进行变量提升，所以输出的 `a`是 `undefined`。JS 还没对条件语句进行判断，同样 `p` 也是`undefined` 相当于 `undefined()` 所以会报错 `TypeError`。

*   新版浏览器中，在条件判断块级作用域中使用条件内函数

```
if(true) {
    console.log(print())    // ？？？
    function print() {
        console.log('林一一')
    }
}
console.log(print())
/* 输出
    林一一
    undefined
    林一一
    undefined
/
```

> **思路：在 `if else` 中带 `function` 的函数同样也会先被声明和定义所以条件判断中的 `print()` 可以直接使用**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73ea027a638a46bba861b2416c9b08c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 思考题

1.  题目 1，if 判断语句中的变量提升

```
if(!("value" in window)){
    var value = 2019; 
}
console.log(value); 
console.log('value' in window); 

/* 输出
    undefined
    true
/
```

> **思路：和上面所说的一样，不管条件是否成立带 `var` 的变量提升，当前在全局作用域 `value` 就是 `window` 的属性，所以结果显而易见输出 `undefined 和 true`**

五. 重名问题下的变量提升
-------------

*   带 var 和带 function 重名条件下的变量提升优先级，函数先执行。

```
console.log(a);   
var a=1;
function a(){
    console.log(1);
}

// 或

console.log(a);   
function a(){
    console.log(1);
}
var a=1;
// 输出都是： ƒ a(){ console.log(1);}
```

> 在 `var 和 function` 同名的变量提升的条件下，函数会先执行。所以输出的结果都是一样的。换一句话说，`var 和 function` 的变量同名 `var` 会先进行变量提升，但是在变量提升阶段，函数声明的变量会覆盖 `var` 的变量提升，所以直接结果总是函数先执行优先。

*   函数名和 `var` 声明的变量重名

```
var fn = 12
function fn() {
    console.log('林一一')
}
console.log(window.fn)
fn()
/* 输出
*  12
*  Uncaught TypeError: fn is not a function
/
```

> **思路：带 `var` 声明的和带 `function` 声明的其实都是在 window 下的属性，也就是重名了，根据变量提升的机制，`fn`的变量提升过程是`fn =>undefined =>oxffeeaa`，随后 JS 代码自上而下执行时此的 `fn` 是`fn = 12`，输出的`window.fn = 12`，所以 `fn() ==> 12()` 又是一个类型错误 TypeError**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a64539202544a519877cd950c51443b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   变量重名在变量提升阶段会重新定义也就是重新赋值

```
console.log('1',fn())
function fn(){
    console.log(1)
}

console.log('2',fn())
function fn(){
    console.log(2)
}

console.log('3',fn())
var fn = '林一一'

console.log('4',fn())
function fn(){
    console.log(3)
}

/* 输出
*   3
*   1 undefined
*   3
*   2 undefined
*   3
*   3 undefined
*   Uncaught TypeError: fn is not a function
/
```

> **思路：同样由于变量提升机制，`fn` 会被多次重新赋值最后赋值的地址值 (假设为 oxfffee) 为最后一个函数，所以调用 `fn`都只是在调用最后一个函数输出都是 `3`， 代码执行到`var fn = '林一一'`，所以 `fn() 其实 == 林一一()` 导致类型错误 TypeError**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd136a2432b14eb48c0d46771e043c37~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 思考题

1.  腾讯的一道变量提升的面试题
    
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
    
    ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9d61dcf017c44cb890ce18753efdb33~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
2.  再来一道面试题
    
    ```
    console.log(fn);
    var fn = 2019;
    console.log(fn);
    function fn(){}
    
    /* 输出
        fn(){}
    /
    ```
    
    > **思路：这也是重名下的一道面试题，在变量提升阶段 `fn`由变量值声明为 `undefined`被修改定义为 `fn函数本身 fn(){}`，所以第一个输出就是 `fn(){}`，第二个输出 `fn` 由被赋值成 `fn=12` 输出 12**
    
3.  留一道思考题（字节）
    

```
let a = 0, b = 0;
function fn(a) {
  fn = function fn2(b) {
    console.log(a, b)
    console.log(++a+b)
  }
  console.log('a', a++)
}
fn(1); // a, 1
fn(2); // 2, 2   5
```

> 这题就留给大家思考了，还是比较简单的。

六. 函数形参的变量提升
------------

*   **函数的形参也会进行一次变量提升**。

> 在上面标题 "一、什么是变量提升" 中也提到过，这里特地领出来讲讲，提个醒

```
function a(b){
　　console.log(b);　　
}
a(45);

// 等价于
// function a(b) {
//     var b = undefined;
//     b = 45;
// }
```

#### 练习题

```
var a = 1;
function foo(a) {
    console.log(a)
    var a
    console.log(a)
}
foo(a);
// 输出 1 1
```

> 在函数的形参阶段 `var a = undefined，a=1`, 这里特别需要注意的是，函数内部虽然也使用 `var a` 声明了变量 `a` 但是这里不会再次声明赋值成 `undefined`。因为在形参阶段已经变量提升过一次了。

### 思考题

1.  求输出结果

```
var foo = '林一一';
(function(f){
    console.log(foo);
    var foo = f || 'hello';
    console.log(foo)
})(foo);
console.log(foo)

// undefined， 林一一，林一一
```

> 变量提升阶段，函数形参 `f` 一开始是 `undefined`，后被实参赋值成 `林一一`。函数内部的变量 `foo=undefined`，输出就是`undefined`，后变成`林一一`。**这里提个醒由于匿名函数不带 变量 是不会有变量提升的操作的**

2. 求输出结果

```
var foo = '林一一';
(function(foo){
    console.log(foo);
    var foo = foo || 'world';
    console.log(foo)
})(foo);
console.log(foo)

// 林一一， 林一一， 林一一
```

> 同样变量提升阶段，形参 foo 和函数作用域内变量 foo 同名，变量提升阶段不会重复声明，只声明一次为 `undefined`，随后形参赋值为 `林一一`，第一个输出就是 `林一一`。函数内部的变量`foo`不会再声明成`undefined`，因为已经的形参阶段被声明过一次，后面被`var foo = foo || 'world';` 赋值成`林一一`。最后输出的都是`林一一`。

3. 求输出结果 (字节)

```
var a = 10;
(function () {
    console.log(a)
    a = 5
    console.log(window.a)
    var a = 20;
    console.log(a)
})()

var b = {
    a,
    c: b
}
console.log(b.c);
```

> 一道易错的题目，函数内声明的变量 a 属于函数的私有作用域的，所以和全局变量 a 无关。最后的 b.c 输出的结果是 `undefined`。一开始还以为是循环引用了，但是 `=` 优先级是从右到左的，所以变量提升阶段 `b=undefined`后，将 c 赋值成 undefined，最后才将这个对象的引用地址给 b。所以最后输出的是 undefined。

4.  求输出结果 (某大厂)

```
var a = 1;
function foo(a, b) {
  console.log(a); // 1
  a = 2;
  arguments[0] = 3;
  var a;
  console.log(a, this.a, b); // 3, 1, undefined
}
foo(a);
```

> 这里只需要注意 var a 在形参阶段声明一次后不会再声明即可。

七. 非匿名自执行函数的变量提升
----------------

> 非匿名自执行函数和匿名自执行函数之间的变量提升是有差别的

*   匿名执行函数和非匿名自执行函数在全局环境下不具备变量提升的机制

```
var a = 10;
(function c(){
})()
console.log(c)
// Uncaught ReferenceError: c is not defined
```

> **IIFE 函数具备自己的作用域，所以全局下不会变量提升**

*   匿名自执行函数在自己的作用域内存在正常的变量提升

```
var a = 10;
(function(){
    console.log(a)
    a = 20
    console.log(a)
})()
console.log(a)
// 10, 20, 20
```

*   非匿名自执行函数的函数名在自己的作用域内变量提升，且修改函数名的值无效，这是非匿名函数和普通函数的差别

```
var a = 10;
(function a(){
    console.log(a)
    a = 20
    console.log(a)
})()
// ƒ a(){a = 20 console.log(a)}  ƒ a(){a = 20 console.log(a)}
```

> 首先在全局环境下，var 声明的变量 a 会变量提升，但是非匿名函数不会在全局环境下变量提升因为具备自己的作用域了，而且上面的函数名 a 同样变量提升了，值就是函数 a 的应用地址值，输出的结果就是`a(){a = 20 console.log(a)}`。**而且非匿名自执行函数名是不可以修改的，即使修改了也不会有任何作用，严格模式下还会报错**，所以最后输出的 a 还是 `a(){a = 20 console.log(a)}`

参考
--

> **[JavaScript 面试题分析之变量提升和执行上下文](https://link.juejin.cn?target=http%3A%2F%2Fwww.srcmini.com%2F939.html "http://www.srcmini.com/939.html")**

结束
==

> **感谢阅读，我是林一一，下次见**