> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [ost.51cto.com](https://ost.51cto.com/posts/2536)

> JS 中的 this 是一个老生常谈的问题了，因为它并不是一个确定的值，在不同情况下有不同的指向，所以也经常使人困惑。

JS 中的 this 是一个老生常谈的问题了，因为它并不是一个确定的值，在不同情况下有不同的指向，所以也经常使人困惑。本篇文章会谈谈我自己对 this 的理解。

**this 到底是啥**  
其实 this 就是一个指针，它指示的就是当前的一个执行环境，可以用来对当前执行环境进行一些操作。因为它指示的是执行环境，所以在定义这个变量时，其实是不知道它真正的值的，只有运行时才能确定他的值。同样一段代码，用不同的方式执行，他的 this 指向可能是不一样的。我们来看看如下代码：

这个方法很简单，只是给 this 添加了一个 name 属性，我们把这个方法复制到 Chrome 调试工具看下结果：

![](https://dl-harmonyos.51cto.com/images/202101/b3ee817353af7143689614be5f879048a42df6.png)上图中我们直接调用了 func()，发现 this 指向的是 window，name 属性添加到了 window 上。下面我们换一种调用方式，我们换成 new func() 来调用：

![](https://dl-harmonyos.51cto.com/images/202101/b1d7c6308dadd68d9529020c1fb620f78617f0.png)我们看到输出了两个 func {name: "小小飞"}，一个是我们 new 返回的对象，另一个是方法里面的 console。这两个值是一样的，说明这时候方法里面 this 就指向了 new 返回的对象，而不是前面例子的 window 了。这是因为当你使用 new 去调用一个方法时，这个方法其实就作为构造函数使用了，这时候的 this 指向的是 new 出来的对象。

下面我们分别讲解下几种情况

**使用 new 调用时，this 指向 new 出来的对象**  
这个规则其实是 JS 面向对象的一部分，JS 使用了一种很曲折的方式来支持面向对象。当你用 new 来执行一个函数时，这个函数就变成了一个类，new 关键字会返回一个类的实例给你，这个函数会充当构造函数的角色。作为面向对象的构造函数，必须要有能够给实例初始化属性的能力，所以构造函数里面必须要有某种机制来操作生成的实例，这种机制就是 this。让 this 指向生成的实例就可以通过 this 来操作实例了。关于 JS 的面向对象更详细的解释可以看这篇文章。

this 的这种特性还有一些妙用。一个函数可以直接调用，也可以用 new 调用，那假如我只想使用者通过 new 调用有没有办法呢？下图截取自 Vue 源码：

![](https://dl-harmonyos.51cto.com/images/202101/b7c881854b442e3736d479885887141be4533b.png)Vue 巧妙利用了 this 的特性，通过检查 this 是不是 Vue 的一个实例来检测使用者是通过 new 调用的还是直接调用的。

**没有明确调用者时，this 指向 window**  
这个其实在最开始的例子就讲过了，那里没有明确调用者，this 指向的是 window。我们这里讲另外一个例子，函数里面的函数，this 指向谁？

我们执行一下看看：

直接执行：

![](https://dl-harmonyos.51cto.com/images/202101/787cd4c711315c740ff279c067f9a41ab4e344.png)使用 new 执行：

![](https://dl-harmonyos.51cto.com/images/202101/226a98518ebe5af82809364610bc69e6037898.png)我们发现无论是直接执行，还是使用 new 执行，this 的值都指向的 window。直接执行时很好理解，因为没有明确调用者，那 this 自然就是 window。需要注意的是使用 new 时，只有被 new 的 func 才是构造函数，他的 this 指向 new 出来的对象，他里面的函数的 this 还是指向 window。

**有明确调用者时，this 指向调用者**  
看这个例子：

上述例子很好理解，因为调用者是 obj，所以 func 里面的 this 就指向 obj，this.myName 就是 obj.myName。其实这一条和上一条可以合在一起，没有明确调用者时其实隐含的调用者就是 window，所以经常有人说 this 总是指向调用者。

下面我们将这个例子稍微改一下：

这里的输出应该是 “大飞哥”，因为虽然 anotherFunc 的函数体跟 obj.func 一样，但是他的执行环境不一样，他其实没有明确的调用者，或者说调用者是 window。这里的 this.myName 其实是 window.myName，也就是 “大飞哥”。

我们将这个例子再改一下：

这次我们只是将第一个 var 改成了 let，但是我们的输出却变成了 undefined。这是因为 let，const 定义变量，即使在最外层也不会变成 window 的属性，只有 var 定义的变量才会成为 window 的属性。

**箭头函数并不会绑定 this**  
这句话的意思是箭头函数本身并不具有 this，箭头函数在被申明确定 this，这时候他会直接将当前作用域的 this 作为自己的 this。还是之前的例子我们将函数改为箭头函数：

上述代码里面的 obj.func() 输出也是 “大飞哥”，是因为 obj 在创建时申明了箭头函数，这时候箭头函数会去寻找当前作用域，因为 obj 是一个对象，并不是作用域，所以这里的作用域是 window，this 也就是 window 了。

再来看一个例子：

两个输出都是 “小小飞”，obj.func().getName() 输出 “小小飞” 很好理解，这里箭头函数是在 obj.func()的返回值里申明的，这时他的 this 其实就是 func()的 this，因为他是被 obj 调用的，所以 this 指向 obj。

那为什么 anotherFunc()输出也是 “小小飞” 呢？这是因为 anotherFunc()输出的 this，其实在 anotherFunc 赋值时就确定了：

1.  var anotherFunc = obj.func().getName; 其实是先执行了 obj.func()
2.  执行 obj.func() 的时候 getName 箭头函数被申明
3.  这时候箭头函数的 this 应该是当前作用域的 this，也就是 func() 里面的 this
4.  func() 因为是被 obj 调用，所以 this 指向 obj
5.  调用 anotherFunc 时，其实 this 早就确定了，也就是 obj，最终输出的是 obj.myName。

再来看一个构造函数里面的箭头函数，前面我们说了构造函数里面的函数，直接调用时，他的 this 指向 window，但是如果这个函数时箭头函数呢：

这里输出的是 “小小飞”，原理还是一样的，箭头函数在申明时 this 确定为当前作用域的 this，在这里就是 func 的作用域，跟 func 的 this 一样指向 new 出来的实例。如果不用 new，而是直接调用，这里的 this 就指向 window。

**DOM 事件回调里面，this 指向绑定事件的对象**

currentTarget 指的是绑定事件的 DOM 对象，target 指的是触发事件的对象。DOM 事件回调里面 this 总是指向 currentTarget，如果触发事件的对象刚好是绑定事件的对象，即 target === currentTarget，this 也会顺便指向 target。如果回调是箭头函数，this 是箭头函数申明时作用域的 this。

**严格模式下 this 是 undefined**

注意这里说的严格模式下 this 是 undefined 是指在函数体内部，如果本身就在全局作用域，this 还是指向 window。

  
**this 能改吗**  
this 是能改的，call 和 apply 都可以修改 this，ES6 里面还新增了一个 bind 函数。

**使用 call 和 apply 修改 this**

注意上面输出的名字是 "小小飞"，也就是 obj2.myName。正常直接调用 obj.func() 输出的名字应该是 obj.myName，也就是 "大飞哥"。但是如果你使用 call 来调用，call 的第一个参数就是手动指定的 this。我们将它指定为 obj2，那在函数里面的 this.myName 其实就是 obj2.myName 了。

apply 方法跟 call 方法作用差不多，只是后面的函数参数形式不同，使用 apply 调用应该这样写，函数参数应该放到一个数组或者类数组里面：

之所以有 call 和 apply 两个方法实现了差不多的功能，是为了让大家使用方便，如果你拿到的参数是一个一个的，那就使用 call 吧，但是有时候拿到的参数是 arguments，这是函数的一个内置变量，是一个类数组结构，表示当前函数的所有参数，那就可以直接用 apply，而不用将它展开了。

**使用 bind 修改 this**  
bind 是 ES5 引入的一个方法，也可以修改 this，但是调用它并不会立即执行方法本身，而是会返回一个修改了 this 的新方法：

bind 和 call，apply 最大的区别就是 call，apply 会立即执行方法，而 bind 并不会立即执行，而是会返回一个新方法供后面使用。

bind 函数也可以接收多个参数，第二个及以后的参数会作为新函数的参数传递进去，比如前面的 bind 也可以这样写：

**自己写一个 call**  
知道了 call 的作用，我们自己来写一个 call：

**自己写一个 apply**  
apply 方法跟 call 方法很像，区别只是在取调用参数上：

**自己写一个 bind**  
自己写一个 bind 需要用到前面的 apply，注意他的返回值是一个方法

**总结**

1.  函数外面的 this，即全局作用域的 this 指向 window。
2.  函数里面的 this 总是指向直接调用者。如果没有直接调用者，隐含的调用者是 window。
3.  使用 new 调用一个函数，这个函数即为构造函数。构造函数里面的 this 是和实例对象沟通的桥梁，他指向实例对象。
4.  箭头函数里面的 this 在它申明时确定，跟他当前作用域的 this 一样。
5.  DOM 事件回调里面，this 指向绑定事件的对象 (currentTarget)，而不是触发事件的对象 (target)。当然这两个可以是一样的。如果回调是箭头函数，请参考上一条，this 是它申明时作用域的 this。
6.  严格模式下，函数里面的 this 指向 undefined，函数外面 (全局作用域) 的 this 还是指向 window。
7.  call 和 apply 可以改变 this，这两个方法会立即执行原方法，他们的区别是参数形式不一样。
8.  bind 也可以修改 this，但是他不会立即执行，而是返回一个修改了 this 的函数。