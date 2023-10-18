> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6943055278212382750?searchId=20231010143625473ADCACAD0D98B9DFA3)

首先，`undefined`和`null`都是假值（falsy），在**绝大多数情况下两者在使用上没有区别**
甚至连官方都 **“很贴心” 的让 null 和 undefined 判定为相等 **

```
console.log(null==undefined); //true
```

重新认识 undefined
==============

什么时候出现 undefined
----------------
总结一下，`undefined`会出现的场景有五种

*   真的是没定义（ typeof 对没定义的会返回 Undefined）
*   定义了但没赋值
*   直接赋值 undefined
*   函数空 return 或者干脆没有 return
*   对象没有对应属性

null 是什么？——主动选择为空
-----------------
**`null`是一个普通值，需要主动使用**，和 12、'abc'、false 没多大区别

*   只有主动使用时，`null`才会出现
*   没有声明`null`不会自己蹦出来
### null 本质上是个零，undefined 本质上是个特殊对象


当然，我猜肯定有人会说——“不对啊，Blue，null 的 type 才是 Object 啊”，这个简单，因为 **js 里充满了作者的主观规定，仅此而已**

```
//null的类型是object，没错
typeof null; //"object"
```

但除此之外的运算他都表现的像个0
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
