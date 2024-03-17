
## 1. typeof、instanceof、Number.isInteger
=====================================

`typeof`判断值是不是基本类型`number`，比如：

```
let num = 1;
typeof num === 'number'; // true

```

`instanceof`判断值是不是[包装类](https://so.csdn.net/so/search?q=%E5%8C%85%E8%A3%85%E7%B1%BB&spm=1001.2101.3001.7020)`Number`，比如：

```
let num = new Number(1);
num instanceof Number; // true

```

`Number.isInteger`判断值是否是整数：

```
Number.isInteger(1);   // true
Number.isInteger('1'); // false
Number.isInteger(1.1); // false

```

这几种方式的缺点，都是只能基于类型判断，无法判断字符串是否是数值。
## . parseInt、[parseFloat](https://so.csdn.net/so/search?q=parseFloat&spm=1001.2101.3001.7020)

这个方法的特点，一句话，返回字符串开头最长的有效数字。
我们可以用`!isNaN(parseFloat(value))`来判断字符串是否是数值。

```
let str1 = '123';
let str2 = 'abc';
!isNaN(parseFloat(str1)); // true，是数字
!isNaN(parseFloat(str2)); // false，不是数字

```

`parseInt`和`parseFloat`解析的时候遇到非法字符结束，返回解析到的数值。也就是说只要字符串头部是合法数值，那么就能解析出数值，哪怕整体不是数值。比如`123abc`，会被解析程`123`。

因此，上面的判断方式还不够严谨，下面的终极方案是比较严谨的方式。

## . [isNaN](https://so.csdn.net/so/search?q=isNaN&spm=1001.2101.3001.7020)、isFinite

在介绍这两个方法之前，先讲下`NaN`，它表示`Not-a-Number`。两个`NaN`无法直接比较相等，因为我们只知道它不是数值，是啥不确定，也就无法比较相等。

```
NaN === NaN;         // false
NaN == NaN;          // false
Object.is(NaN, NaN); // false

```

*   `isNaN(value)`，如果`ToNumber(value)`的结果为`NaN`返回`true`，否则返回`false`。
*   `isFinite(value)`，如果`ToNumber(value)`的结果为数值，且不等于`Infinity`或`-Infinity`返回`true`，否则返回`false`。

`isNaN`和`isFinite`都会先将传入的值转成数值，再进行判断。`ToNumber`的规则跟直接使用`Number`函数一样。一些非数值在类型转换的时候都能转成数值，比如：

```
Number(true);         // 1
Number(false);        // 0
Number(null);         // 0
Number('');           // 0

```

对`null`、`true`、`false`、`''`使用`isNaN`结果都是`false`，但是它们本身不是数值，因此不能单独使用`isNaN`。

##  Number.isNaN、Number.isFinite
===============================

这两个方法跟对应的全局方法是不一样的。

*   `Number.isNaN(value)`，如果`value`为`NaN`返回`true`，否则返回`false`。
*   `Number.isFinite(value)`，如果`value`为数值，且不等于`Infinity`或`-Infinity`返回`true`，否则返回`false`。

区别是全局方法会有强制类型转换，而这两个方法没有强制类型转换：

```
Number.isNaN(null);      // true
Number.isNaN(true);      // true
Number.isNaN(false);     // true
Number.isNaN('');        // true

```

可以看，由于没有类型转换，所以`Number.isNaN`判断`null`、`true`、`false`、`''`的结果都是`true`。

但是 “副作用” 是数字字符串也会得到`true`：

```
Number.isNaN('123');    // true

```

`Number.isNaN`等价与：

```
Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
}

```

而`Number.isFinite`等价于：

```
if (Number.isFinite === undefined) Number.isFinite = function(value) {
    return typeof value === 'number' && isFinite(value);
}

```

因此，这两个方法本质上也是基于类型的，没法判断一个字符串是否为数值。

## 正则表达式
========

```
let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/;
exp.test('+1.9');   // true
exp.test('-.1e11'); // true

```

这个正则可以判断整数、浮点数、正负数和科学计数法。

不过我觉得判断是否是数值用正则，有点小题大做了。

## . 终极方案（推荐）
===========

我们先看方案：

```
!isNaN(parseFloat(value)) && isFinite(value);

```

这其实是 jquery 中`$.isNumeric`的源码，多么简洁且优雅。

接下来我们看看它的原理，我们以字符串`123abc`为例，我们应该得到`false`。

1.  `parseFloat('123abc')`得到`123`；
2.  `!isNaN(123)`得到`true`；
3.  `isFinite('123abc')`得到`false`；
4.  最终结果为`false`。

单独使用`!isNaN(parseFloat(value))`会将`123abc`当成数值，所以用`isFinite`额外判断一次，`isFinite`的另一个作用是排除无穷数。

```
!isNaN(parseFloat(Infinity));  // true
!isNaN(parseFloat(Infinity)) && isFinite(Infinity); // false

```

而且，因为`parseFloat`的解析是纯字符串解析，没有类型转换，所以不会将`null`、`true`、`false`、`''`当成数值。

```
!isNaN(parseFloat(null)) && isFinite(null);   // false
!isNaN(parseFloat(true)) && isFinite(true);   // false
!isNaN(parseFloat(false)) && isFinite(false); // false
!isNaN(parseFloat('')) && isFinite('');       // false

```