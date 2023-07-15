

## **this 到底是啥**  
其实 this 就是一个指针，它指示的就是当前的一个执行环境，可以用来对当前执行环境进行一些操作。
因为它指示的是执行环境，所以在定义这个变量时，其实是不知道它真正的值的，只有运行时才能确定他的值。

这个方法很简单，只是给 this 添加了一个 name 属性，我们把这个方法复制到 Chrome 调试工具看下结果：

![](https://dl-harmonyos.51cto.com/images/202101/b3ee817353af7143689614be5f879048a42df6.png)上图中我们直接调用了 func()，发现 this 指向的是 window，name 属性添加到了 window 上。

下面我们换一种调用方式，我们换成 new func() 来调用：

![](https://dl-harmonyos.51cto.com/images/202101/b1d7c6308dadd68d9529020c1fb620f78617f0.png)我们看到输出了两个 func {name: "小小飞"}，一个是我们 new 返回的对象，另一个是方法里面的 console。这两个值是一样的，说明这时候方法里面 this 就指向了 new 返回的对象，而不是前面例子的 window 了。
这是因为当你使用 new 去调用一个方法时，这个方法其实就作为构造函数使用了，这时候的 this 指向的是 new 出来的对象。

## 分别讲解下几种情况

### **使用 new 调用时，this 指向 new 出来的对象**  
当你用 new 来执行一个函数时，这个函数就变成了一个类，new 关键字会返回一个类的实例给你，这个函数会充当构造函数的角色。作为面向对象的构造函数，必须要有能够给实例初始化属性的能力，所以构造函数里面必须要有某种机制来操作生成的实例，这种机制就是 this。让 this 指向生成的实例就可以通过 this 来操作实例了。

this 的这种特性还有一些妙用。

一个函数可以直接调用，也可以用 new 调用，那假如我只想使用者通过 new 调用有没有办法呢？下图截取自 Vue 源码：

![](https://dl-harmonyos.51cto.com/images/202101/b7c881854b442e3736d479885887141be4533b.png)Vue 巧妙利用了 this 的特性，通过检查 this 是不是 Vue 的一个实例来检测使用者是通过 new 调用的还是直接调用的。

### **没有明确调用者时，this 指向 window**  
这个其实在最开始的例子就讲过了，那里没有明确调用者，this 指向的是 window。
我们这里讲另外一个例子，函数里面的函数，this 指向谁？我们执行一下看看：

![](https://dl-harmonyos.51cto.com/images/202101/787cd4c711315c740ff279c067f9a41ab4e344.png)使用 new 执行：

![](https://dl-harmonyos.51cto.com/images/202101/226a98518ebe5af82809364610bc69e6037898.png)我们发现无论是直接执行，还是使用 new 执行，this 的值都指向的 window。直接执行时很好理解，因为没有明确调用者，那 this 自然就是 window。
需要注意的是使用 new 时，只有被 new 的 func 才是构造函数，他的 this 指向 new 出来的对象，他里面的函数的 this 还是指向 window。

### **有明确调用者时，this 指向调用者**  
上述例子很好理解，因为调用者是 obj，所以 func 里面的 this 就指向 obj，this.myName 就是 obj.myName。其实这一条和上一条可以合在一起，没有明确调用者时其实隐含的调用者就是 window，所以经常有人说 this 总是指向调用者。

### **箭头函数并不会绑定 this**  
箭头函数在申明时 this 确定为当前作用域的 this，在这里就是 func 的作用域，跟 func 的 this 一样指向 new 出来的实例。如果不用 new，而是直接调用，这里的 this 就指向 window。

### **DOM 事件回调里面，this 指向绑定事件的对象**

currentTarget 指的是绑定事件的 DOM 对象，target 指的是触发事件的对象。
DOM 事件回调里面 this 总是指向 currentTarget，如果触发事件的对象刚好是绑定事件的对象，即 target === currentTarget，this 也会顺便指向 target。
如果回调是箭头函数，this 是箭头函数申明时作用域的 this。

### **严格模式下 this 是 undefined**

注意这里说的严格模式下 this 是 undefined 是指在函数体内部，如果本身就在全局作用域，this 还是指向 window。
