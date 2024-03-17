> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.zhangxinxu.com](https://www.zhangxinxu.com/wordpress/2021/07/js-proxy-reflect/)

> 本文详细介绍 JS 中的 Reflect 对象，与 Proxy 代理之间的关系，内容详实，应该可以学到点东西。


### 一、Reflect 有什么用？
准确讲应该是这样的，Reflect 更像是一种语法变体，其挂在的所有方法都能找到对应的原始语法，也就是 Reflect 的替代性非常强。

Reflect 对象挂载了很多静态方法，
比较常用的两个方法就是`get()`和`set()`方法：
```
Reflect.get(target, propertyKey[, receiver])
Reflect.set(target, propertyKey, value[, receiver])
```

就作用而言，等同于：

```
target[propertyKey]
target[propertyKey] = value;
```

Object.defineProperty完全可以使用 Reflect 对象实现，具体的 JavaScript 代码如下所示。
```
const props = Reflect.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
Reflect.defineProperty(input, 'value', {
    ...props,
    set (v) {
        let oldv = this.value;
        props.set.call(this, v);
        
        if (oldv !== v) {
            this.dispatchEvent(new CustomEvent('change'));
        }
    }
});
```

### 二、细微差异 - 返回值

事物存在必有道理，如果 Reflect 仅仅是换了种语法，存在的意义并不大，很显然，Reflect 对象的出现必然有其他的考量。

我认为其中有意义的一点就是返回值。

对于某个对象，赋值并不总是成功的。

例如，我们把 `input` 的`type`属性设置为只读，如下：

```
Object.defineProperty(input, 'type', {
    get () {
       return this.getAttribute('type') || 'text';
    }
});
```

传统的使用等于号进行的属性赋值并不能知道最后是否执行成功，需要开发者自己进行进一步的检测。

例如：

```
console.log(input.type = 'number');

// 输出 false
console.log(Reflect.set(input, 'type', 'number'));
```

上面一行赋值返回值是`'number'`，至于改变输入框的`type`属性值是否成功，不得而知。

但是下面一行语句使用的`Reflect.set()`方法，就可以知道是否设置成功，因为`Reflect.set()`的返回值是`true`或者`false`（只要参数类型准确）。

除了知道执行结果外，Reflect 方法还有个好处，不会因为报错而中断正常的代码逻辑执行。

例如下面的代码：

```
(function () {
    'use strict';

    var frozen = { 1: 81 };
    Object.freeze(frozen);

    frozen[1] = 'zhangxinxu';

    console.log('no log');
})();
```

会出现下面的 TypeError 错误：

> Uncaught TypeError: Cannot assign to read only property ‘1’ of object ‘#\<Object\>’

后面的语句`console.log('no log')`就没有被执行。
但是如果使用 Reflect 方法，则 console 语句是可以执行的，例如：
```
(function () {
    'use strict';
    var frozen = { 1: 81 };
    Object.freeze(frozen);
    Reflect.set(frozen, '1', 'zhangxinxu');
    console.log('no log');
})();
```

控制台运行后的 log 输出值如下图所示：

![](https://image.zhangxinxu.com/image/blog/202107/2021-07-01_190503.png)

###  三、set、get 方法中的 receiver 参数

就功能而言，`Reflect.get()`和`Reflect.set()`方法和直接对象赋值没有区别，都是可以互相替代的，例如，下面两段 JS 效果都是一样的。

还是使用`input`这个 DOM 元素示意。

有人可能会疑问，为什么不用纯对象示意呢？

因为我发现大多数前端都对 DOM 不怎么感兴趣，那我就反其道行之，故意膈应人 ![](https://image.zhangxinxu.com/image/emtion/emoji/1f92a.svg)；另外一个原因就是 DOM 对象更具象，所见即所得，适合偏感性的同学的学习。

```
const xyInput = new Proxy(input, {
    set (target, prop, value) {
        if (prop == 'value') {
            target.dispatchEvent(new CustomEvent('change'));
        }
        target[prop] = value;

        return true;
    },
    get (target, prop) {
        return target[prop];
    }
});

input.addEventListener('change', () => {
  document.body.append('变化啦~');
});
xyInput.value = 'zhangxinxu';
```

和下面的 JS 代码效果类似的。

```
const xyInput = new Proxy(input, {
    set (target, prop, value) {
        if (prop == 'value') {
            target.dispatchEvent(new CustomEvent('change'));
        }
        return Reflect.set(target, prop, value);
    },
    get (target, prop) {
        return Reflect.get(target, prop);
    }
});

input.addEventListener('change', () => {
  document.body.append('变化啦~');
});
xyInput.value = 'zhangxinxu';
```

均有如下图所示的效果：

![](https://image.zhangxinxu.com/image/blog/202107/2021-07-01_161934.png)

但是，当需要使用可选参数 receiver 参数的时候，直接对象赋值和使用 Reflect 赋值就会出现差异。

首先，对于 DOM 元素，应用 receiver 参数会报错。

例如下面的 JS 就会报错：

```
Reflect.set(input, 'value', 'xxx', new Proxy({}, {}));
```

> Uncaught TypeError: Illegal invocation

但是把 input 换成普通的纯对象，则不会有问题，例如：

```
Reflect.set({}, 'value', 'xxx', new Proxy({}, {}));
```

#### 关于 receiver 参数

说了这么多，`receiver`参数到底是干嘛用的呢？

receiver 是接受者的意思，表示调用对应属性或方法的主体对象，通常情况下，receiver 参数是无需使用的，但是如果发生了继承，为了明确调用主体，receiver 参数就需要出马了。

比方说下面这个例子：

```
let miaoMiao = {
  _name: '疫苗',
  get name () {
    return this._name;
  }
}
let miaoXy = new Proxy(miaoMiao, {
  get (target, prop, receiver) {
    return target[prop];
  }
});

let kexingMiao = {
  __proto__: miaoXy,
  _name: '科兴疫苗'
};


console.log(kexingMiao.name);
```

实际上，这里预期显示应该是 “科兴疫苗”，而不是 “疫苗”。

这个时候，就需要使用`receiver`参数了，代码变化部分参见下面标红的那一行：

```
let miaoMiao = {
  _name: '疫苗',
  get name () {
    return this._name;
  }
}
let miaoXy = new Proxy(miaoMiao, {
  get (target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
    
  }
});

let kexingMiao = {
  __proto__: miaoXy,
  _name: '科兴疫苗'
};


console.log(kexingMiao.name);
```

此时，运行结果就是预期的 “科兴疫苗” 了，如下截图所示：

![](https://image.zhangxinxu.com/image/blog/202107/2021-07-01_223705.png)

这就是 receiver 参数的作用，可以把调用对象当作 target 参数，而不是原始 Proxy 构造的对象。

### 四、其他以及结束语

Reflect 对象经常和 Proxy 代理一起使用，原因有三点：

1.  Reflect 提供的所有静态方法和 Proxy 第 2 个 handle 参数方法是一模一样的。具体见后面的对比描述。
2.  Proxy get/set() 方法需要的返回值正是 Reflect 的 get/set 方法的返回值，可以天然配合使用，比直接对象赋值 / 获取值要更方便和准确。
3.  receiver 参数具有不可替代性。

下表是自己整理的 Reflect 静态方法和对应的其他函数或功能符。

<table><thead><tr><th>Reflect 方法</th><th>类似于</th></tr></thead><tbody><tr><td>Reflect.apply(target, thisArgument, argumentsList)</td><td>Function.prototype.apply()</td></tr><tr><td>Reflect.construct(target, argumentsList[, newTarget])</td><td>new target(…args)</td></tr><tr><td>Reflect.defineProperty(target, prop, attributes)</td><td>Object.defineProperty()</td></tr><tr><td>Reflect.deleteProperty(target, prop)</td><td>delete target[name]</td></tr><tr><td>Reflect.get(target, prop[, receiver])</td><td>target[name]</td></tr><tr><td>Reflect.getOwnPropertyDescriptor(target, prop)</td><td>Object.getOwnPropertyDescriptor()</td></tr><tr><td>Reflect.getPrototypeOf(target)</td><td>Object.getPrototypeOf()</td></tr><tr><td>Reflect.has(target, prop)</td><td>in 运算符</td></tr><tr><td>Reflect.isExtensible(target)</td><td>Object.isExtensible()</td></tr><tr><td>Reflect.ownKeys(target)</td><td>Object.keys()</td></tr><tr><td>Reflect.preventExtensions(target)</td><td>Object.preventExtensions()</td></tr><tr><td>Reflect.set(target, prop, value[, receiver])</td><td>target[prop] = value</td></tr><tr><td>Reflect.setPrototypeOf(target, prototype)</td><td>Object.setPrototypeOf()</td></tr></tbody></table>

正是人如其名，Reflect 就是其他方法、操作符的 “反射”。

好，以上就是本文的内容，带大家了解了下 Reflect 的七七八八。

希望可以对大家的学习有所帮助。

欢迎转发，欢迎分享，谢谢谢谢！

**参考文档**

*   [MDN Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

![](https://image.zhangxinxu.com/image/emtion/emoji/1f618.svg)

（本篇完）![](https://image.zhangxinxu.com/image/emtion/emoji/1f44d.svg) 是不是学到了很多？可以分享到微信！  
![](https://image.zhangxinxu.com/image/emtion/emoji/1f44a.svg) 有话要说？点击[这里](#comment "点击定位到评论")。