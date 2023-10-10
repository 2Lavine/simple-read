> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6943055278212382750?searchId=20231010143625473ADCACAD0D98B9DFA3)

`undefined`和`null`在 js 中非常常见，而且两者都代表 "空" 的含义，但又有细微的差异，这俩每天都能见到的东西，你真的了解它们吗？来和 Blue 一起，重新认识`undefined`和`null`吧

> undefined 和 null 在使用中几乎可以等同（除了判断时），但探究内部的原理有助于加深对程序的理解

本文将包含以下内容

*   undefined 和 null 都是空，但又不是一个东西，**JS 为什么要搞两个空**？
*   undefined 是什么？什么时候出现 undefined？
*   null 是什么？什么时候用到 null？
*   undefined 和 null 的本质
*   如何正确使用 undefined 和 null

快速介绍
====

首先，`undefined`和`null`都是假值（falsy），都能作为条件进行判断，所以在**绝大多数情况下两者在使用上没有区别**

```
if(undefined){
  console.log('真的');
}else{
  console.log('假的');  //执行
}

if(null){
  console.log('真的');
}else{
  console.log('假的');  //执行
}
```

甚至连官方都 **“很贴心” 的让 null 和 undefined 判定为相等 **

```
console.log(null==undefined); //true
```

那么，`undefined`和`null`是不是完全相同呢？不是

```
//松散比较(loose equality)
console.log(null == undefined); //true

//严格比较(strict equality)
console.log(null === undefined); //false
```

上面的例子可以看出

*   `undefined`和`null`并不是同一个东西，严格比较会判定为不相等
    
*   它们到底是什么、有什么区别、如何影响我们是用呢
    

重新认识 undefined
==============

什么时候出现 undefined
----------------

字面上，`undefined`就是 "未定义" 的意思，所以当我们没有定义一个东西之前，它就是 undefined

```
//a并未定义过
console.log(typeof a);  //"undefined"

//注意，这里只能使用typeof，直接使用a会造成报错
console.log(a);  //Uncaught ReferenceError: a is not defined
```

我们知道 js 是弱类型的，所以变量本身没有类型，变量内存储的数据才有，所以当一个变量没有任何数据时，它也是`undefined`

```
//定义但未赋值
let a;

console.log(a);  //undefined
```

`undefined`是 js 的原始数据类型之一，我们也可以直接把 undefined 赋值给变量

```
let a=undefined;

console.log(a); //undefined
```

当然，不只变量，函数中也出现 undefined

```
//1-参数
function blueFn(a, b){
  console.log(a, b);
}

blueFn(12);  //12, undefined——因为b没有传值，所以是undefined


//2-返回值
function blueFn1(){
  return;
}
function blueFn2(){
  
}

blueFn1();  //undefined——return没写东西，类似于变量没赋值
blueFn2();  //undefined——连return都没有，跟变量没有声明过差不多
```

对象中也会出现`undefined`，当我们是用一个不存在的属性时，会得到 undefined 作为值（ts 等强类型语言会直接报错）

```
const blue={age: 18, gender: 'male'};

console.log(blue.height); //undefined——因为就没有叫height的东西
```

总结一下，`undefined`会出现的场景有五种

*   真的是没定义（仅 typeof 可用）
*   定义了但没赋值
*   直接赋值或返回 undefined
*   函数空 return 或者干脆没有 return
*   没有对应属性

undefined 是什么？——被迫的替代方案
-----------------------

经过上面的梳理其实我们可以看出——**`undefined`就是没有值**，不论是没赋值、没传参、没返回、没这个属性，都会导致系统无法找到对应的内容，从而返回 undefined 作为 "替代选项"

重新认识 null
=========

`null`和`undefined`不同，`null`不是没得选才出来，**想使用`null`必须主动要求**

什么时候出现 null
-----------

```
//变量
let name;
console.log(name);  //undefined

let name='blue';
console.log(name);  //null



//函数-参数
function fn1(a){
  console.log(a);
}
fn1(); //undefined
fn1(null); //null



//函数-返回值
function fn2(){
  return; //undefined
}
function fn2(){
  return null; //undefined
}

//对象属性
const person={name: 'blue'};
console.log(person1.age); //undefined

const person={name: 'blue', age: null};
console.log(person1.age); //null
```

null 是什么？——主动选择为空
-----------------

通过上面的例子，咱们能看出一个有意思的现象——**咱们不明说由系统来猜时，会得到`undefined`；而`null`则需要我们主动要求才给**

所以，这俩啥区别？
=========

**`null`是一个普通值，需要主动使用**，和 12、'abc'、false 没多大区别

*   只有主动使用时，`null`才会出现
*   没有声明`null`不会自己蹦出来

**`undefined`是一个特殊值**，是 js 中最后的备选方案

*   当我们向 js 要求一个 “不存在的东西” 时，会得到`undefined`（例如：没赋值的变量、没 return 的函数、没传的参数）

undefined 与 null 的本质
--------------------

相对来说，**`null`更接近其他语言的空**、而`undefined`则是 js 特有的机制

### null 本质上是个零，undefined 本质上是个特殊对象

```
Number(null); //0
Number(undefined); //NaN

12+null; //12
12+undefined; //NaN


//跟数字比较会更加明显
-5<null; //true——null是0，-5<0

-5<undefined;  //false
-5>undefined;  //false
-5==undefined; //false
//undefined就不是数字，跟数字没有可比性
```

当然，我猜肯定有人会说——“不对啊，Blue，null 的 type 才是 Object 啊”，这个简单，因为 **js 里充满了作者的主观规定，仅此而已**

```
//null的类型是object，没错
typeof null; //"object"

//但这只是作者硬性规定null的类型罢了
//不然怎么解释
12+null  //12
5-null  //5
8*null  //0
19&null //0
```

有讲解有应用，完美
=========

通过上面我们基本弄明白了 null 和 undefined，那有没有什么使用上的区别呢？不多，但是有

默认参数与 undefined、null
--------------------

```
//age参数有默认值——也就是说，不传就是18
function blue(age=18){
  console.log(age);
}


//传个undefined跟没传一样，系统认为“没有”和undefined等价
blue(undefined);  //18

//传null就是有了，不会触发默认值
blue(null);  //null
```

解构赋值与 undefined、null
--------------------

类似于参数，其实解构赋值也有类似的情况

```
const [a=1,b=2]=[undefined, null];

//undefined就是没给——触发默认值
console.log(a);  //1

//null是给了，但是空——不触发默认值
console.log(b);  //null
```

总结
==

是时候梳理一遍 Blue 讲过的东西了，那么首先

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e13ef6e64254455fb9b1ccb3156b145b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   `null`是主动使用，`undefined`是被动的备选手段
*   `null`本质上是零，`undefined`本质上是个对象（js 作者规定了 type 而已）
*   判断`null`和`undefined`时，应永远使用严格判断（===）
*   js 中 “没有传”、“没有给” 和`undefined`基本等价；而`null`是有值的——例如：默认参数

有 bug？想补充？
----------

感谢大家观看这篇教程，有任何问题或想和 Blue 交流，请直接留言，发现文章有任何不妥之处，也请指出，提前感谢