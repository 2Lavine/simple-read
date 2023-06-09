generator 来源
--

在 CLU 语言和 C# 语言中，生成器被称为迭代器（Iterator），而在 Ruby 语言中称为枚举器（Enumerator）。

生成器的主要目的是用于通过一段程序，来持续被迭代或枚举出符合某个公式或算法的有序数列中的元素

而这个程序便是用于实现这个公式或算法，而不需要将目标数列完整写出。

举一个简单的例子，斐波那契数列

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/683adad5e78b117fb60afbc0447d1ed0.jpg~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

依靠程序我们可以这样实现：

```
const fibonacci = [ 0, 1 ]
const n = 10

for (let i = 2; i < n - 1; ++i) {
  fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2])
}
console.log(fibonacci) //=> [0, 1, 1, 2, 3, 5, 8, 13, 21]
```

但是这种需要确定一个数量来取得相应的数列，但若需要按需获取元素，那就可以使用生成器来实现了。

```
function* fibo() {
  let a = 0
  let b = 1

  yield a
  yield b

  while (true) {
    let next = a + b
    a = b
    b = next
    yield next
  }
}

let generator = fibo()

for (var i = 0; i < 10; i++)
  console.log(generator.next().value) //=> 0 1 1 2 3 5 8 13 21 34 55
```

基本概念
----

生成器是 ES2015 中同时包含语法和底层支持的一个新特性，其中有几个相关的概念是需要先了解的。

### 生成器函数（Generator Function）

生成器函数在 `function` 语句之后和函数名之前，有一个 `*` 作为它是一个生成器函数的标示符。

```
function* fibo() {
  // ...
}
```

生成器函数的定义并不是强制性使用声明式的，与普通函数一样可以使用定义式进行定义。

```
const fnName = function*() { /* ... */ }
```

`yield` 语句的作用与 `return` 语句有些相似，

但 `yield` 语句的作用并非退出函数体，而是**切出当前函数的运行时**（此处为一个类协程，Semi-coroutine），

并与此同时可以讲一个值（可以是任何类型）带到主线程中。

### 生成器（Generator）

从计算机科学角度上看，生成器是一种类协程或半协程（Semi-coroutine）

生成器提供了一种可以通过特定语句或方法来使生成器的执行对象（Execution）暂停，而这语句一般都是 `yield`。

在 ES2015 中，`yield` 可以将一个值带出协程，而主线程也可以通过生成器对象的方法将一个值带回生成器的执行对象中去。

```
const inputValue = yield outputValue
```

生成器切出执行对象并带出 `outputValue`，

主线程经过同步或异步的处理后，通过 `.next(val)` 方法将 `inputValue` 带回生成器的执行对象中。

使用方法
----

### 构建生成器函数

假设我们需要按照下面这个公式来生成一个数列）

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/e8e47da543aaff47e4a51a58074f1add.jpg~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

为了使得生成器能够不断根据公式输出数列元素使用 `while (true)` 循环以保持程序的不断执行。

```
function* genFn() {
  let a = 2

  yield a

  while (true) {
    yield a = a / (2 * a + 1)
  }
}
```

在定义首项为 2 之后，首先将首项通过 `yield` 作为第一个值切出，其后通过循环和公式将每一项输出。

### 启动生成器

生成器函数不能直接作为函数来使用，执行生成器函数会返回一个生成器对象

生成器是通过生成器函数生成的一个生成器（类）实例。

用一段伪代码来说明生成器这个类的基本内容和用法。

```
class Generator {
  next(value)
  throw(error)
  [@iterator]()
}
```

<table><thead><tr><th>操作方法（语法）</th><th>方法内容</th></tr></thead><tbody><tr><td><code>generator.next(value)</code></td><td>获取下一个生成器切出状态。（第一次执行时为第一个切出状态）。</td></tr><tr><td><code>generator.throw(error)</code></td><td>向当前生成器执行对象抛出一个错误，并终止生成器的运行。</td></tr><tr><td><code>generator[@iterator]</code></td><td><code>@iterator</code> 即 <code>Symbol.iterator</code>，为生成器提供实现可迭代对象的方法。
  使生成器可以直接被 <code>for...of</code> 循环语句直接使用。</td></tr></tbody></table>

其中 `.next(value)` 方法会返回一个状态对象，其中包含当前生成器的运行状态和所返回的值。

```
{
  value: Any,
  done: Boolean
}
```

生成器执行对象会不断检查生成器的状态，

一旦遇到生成器内的最后一个 `yield` 语句或第一个 `return` 语句时，生成器便进入终止状态，

- 即状态对象中的 `done` 属性会从 `false` 变为 `true`。

而 `.throw(error)` 方法会提前让生成器进入终止状态，并将 `error` 作为错误抛出。

### 运行生成器内容

因为生成器对象自身也是一种可迭代对象，所以我们直接使用 `for...of` 循环将其中输出的值打印出来。

```
for (const a of gen) {
  if (a < 1/100) break

  console.log(a)
}
//=>
//  2
//  0.4
//  0.2222222222
//  ...
```



深入理解
----

### 运行模式

为了能更好地理解生成器内部的运行模式，我们将上面的这个例子以流程图的形式展示出来。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/3d78d298726ebf980cff50f737f2adf9.jpg~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

生成器是一种可以被暂停的运行时，

在这个例子中，每一次 `yield` 都会将当前生成器执行对象暂停并输出一个值到主线程。

而这在生成器内部的代码是不需要做过多体现的，只需要清楚 `yield` 语句是暂停的标志及其作用即可。

### 生成器函数以及生成器对象的检测

事实上 ES2015 的生成器函数也是一种构造函数或类，开发者定义的每一个生成器函数都可以看做对应生成器的类，

而所产生的生成器都是这些类的派生实例。

在很多基于类（或原型）的库中，我们可以经常看到这样的代码。

```
function Point(x, y) {
  if (!(this instanceof Point)) return new Point(x, y)
  // ...
}

const p1 = new Point(1, 2)
const p2 = Point(2, 3)
```

这一句代码的作用是为了避免开发者在创建某一个类的实例时，没有使用 `new` 语句而导致的错误。

而 ECMAScript 內部中的绝大部分类型构造函数（不包括 `Map` 和 `Set` 及他们的 `Weak` 版本）都带有这种特性。

```
String()  //=> ""
Number()  //=> 0
Boolean() //=> false
Object()  //=> Object {}
Array()   //=> []
Date()    //=> the current time
RegExp()  //=> /(?:)/
```

> TIPS: 在代码风格检查工具 ESLint 中有一个可选特性名为 `no-new` 即相比使用 `new`，更倾向于使用直接调用构造函数来创建实例。

那么同样的，生成器函数也支持这种特性，而在互联网上的大多数文献都使用了直接执行的方法创建生成器实例。

如果我们尝试嗅探生成器函数和生成器实例的原型，我们可以到这样的信息。

```
function* genFn() {}
const gen = genFn()

console.log(genFn.constructor.prototype) //=> GeneratorFunction
console.log(gen.constructor.prototype)   //=> Generator
```

这样我们便可知，我们可以通过使用 `instanceof` 语句来得知一个生成器实例是否为一个生成器函数所对应的实例。

```
console.log(gen instanceof genFn) //=> true
```

十分可惜的是，目前原生支持生成器的主流 JavaScript 引擎（如 Google V8、Mozilla SpiderMonkey）并没有将 `GeneratorFunction` 和 `Generator` 类暴露出来。这就意味着没办法简单地使用 `instanceof` 来判定一个对象是否是生成器函数或生成器实例。

<br/>

但如果你确实希望对一个未知的对象检测它是否是一个生成器函数或者生成器实例，也可以通过一些取巧的办法来实现。

对于原生支持生成器的运行环境来说，生成器函数自身带有一个 `constructor` 属性指向并没有被暴露出来的 `GeneratorFunction`。

那么我们就可以利用一个我们已知的生成器函数的 `constructor` 来检验一个函数是否是生成器函数。

```
function isGeneratorFunction(fn) {
  const genFn = (function*(){}).constructor

  return fn instanceof genFn
}

function* genFn() {
  let a = 2

  yield a

  while (true) {
    yield a = a / (2 * a + 1)
  }
}

console.log(isGeneratorFunction(genFn)) //=> true
```

显然出于性能考虑，我们可以将这个判定函数利用惰性加载进行优化。

```
function isGeneratorFunction(fn) {
  const genFn = (function*(){}).constructor

  return (isGeneratorFunction = fn => fn instanceof genFn)(fn)
}
```

相对于生成器函数，生成器实例的检测就更为困难。因为无法通过对已知生成器实例自身的属性来获取被运行引擎所隐藏起来的 `Generator` 构造函数，所以无法直接用 `instanceof` 语句来进行类型检测。也就是说我们需要利用别的方法来实现这个需求。

每一个对象都会有一个 `toString()` 方法的实现以及其中一部分有 `Symbol.toStringTag` 作为属性键的属性，以用于输出一个为了填补引用对象无法被直接序列化的字符串。

而这个字符串是可以间接地探测出这个对象的构造函数名称，即带有直接关系的类。

那么对于生成器对象来说，与它拥有直接关系的类除了其对应的生成器函数以外，便是被隐藏起来的 `Generator` 类了。

而生成器对象的 `@@toStringTag` 属性正正也是 `Generator`

```
function isGenerator(obj) {
  return obj.toString ? obj.toString() === '[object Generator]' : false
}

function* genFn() {}
const gen = genFn()

console.log(isGenerator(gen)) //=> true
console.log(isGenerator({}))  //=> false
```

而另外一方面，我们既然已经知道了生成器实例必定带有 `@@toStringTag` 属性并其值夜必定为 `Generator`，我们也可以通过这个来检测位置对象是否为生成器实例。

```
function isGenerator(obj) {
  return obj[Symbol && Symbol.toStringTag ? Symbol.toStringTag : false] === 'Generator'
}

console.log(isGenerator(gen)) //=> true
console.log(isGenerator({}))  //=> false
```

此处为了防止因为运行环境不支持 `Symbol` 或 `@@toStringTag` 而导致报错，需要使用先做兼容性检测以完成兼容降级。

<br/>

我们是否也可以使用 `@@toStringTag` 属性来对生成器函数进行类型检测呢？我们在一个同时支持生成器和 `@@toStringTag` 的运行环境中运行下面这段代码。

```
function* genFn() {}

console.log(genFn[Symbol.toStringTag]) //=> GeneratorFunction
```

这显然是可行的，那么我们就来为前面的 `isGeneratorFunction` 方法再进行优化。

```
function isGeneratorFunction(fn) {
  return fn[Symbol && Symbol.toStringTag ? Symbol.toStringTag : false] === 'GeneratorFunction'
}

console.log(isGeneratorFunction(genFn)) //=> true
```

而当运行环境不支持 `@@toStringTag` 时也可以通过 `instanceof` 语句来进行检测。

```
function isGeneratorFunction(fn) {
  // If the current engine supports Symbol and @@toStringTag
  if (Symbol && Symbol.toStringTag) {
    return (isGeneratorFunction = fn => fn[Symbol.toStringTag] === 'GeneratorFunction')(fn)
  }

  // Using instanceof statement for detecting
  const genFn = (function*(){}).constructor

  return (isGeneratorFunction = fn => fn instanceof genFn)(fn)
}

console.log(isGeneratorFunction(genFn)) //=> true
```

### 生成器嵌套

在编写两个分段部分的生成器之前，我们需要先引入一个新语法 `yield*`。

它与 `yield` 的区别在于，`yield*` 的功能是为了将一个生成器对象嵌套于另一个生成器内，并将其展开。我们以一个简单地例子说明。

```
function* foo() {
  yield 1
  yield 2
}

function* bar() {
  yield* foo()
  yield 3
  yield 4
}

for (const n of bar()) console.log(n)
//=>
//  1
//  2
//  3
//  4
```

### 生成器 ≈ 协程？

从运行机制的角度上看，生成器拥有暂停运行时的能力，那么生成器的运用是否只仅限于生成数据呢？

在上文中，我们提到了生成器是一种类协程，而协程自身是可以通过生成器的特性来进行模拟呢。

在现代 JavaScript 应用开发中，当异步操作的层级过深时，就可能会出现回调地狱（Callback Hell）。

```
io1((err, res1) => {
  io2(res1, (err, res2) => {
    io3(res2, (err, res3) => {
      io4(res3, (err, res4) => {
        io5(res5, (err, res5) => {
          // ......
        })
      })
    })
  })
})
```

我们知道

- `yield` 语句可以将一个值带出生成器执行环境

- 生成器执行对象的暂停状态可以用 `.next(value)` 方法恢复，而这个方法是可以被异步执行的。

这就说明如果我们将异步 IO 的操作通过 `yield` 语句来从生成器执行对象带到主线程中，

在主线程中完成后再通过 `.next(value)` 方法将执行结果带回到生成器执行对象中，

这一流程在生成器的代码中是可以以同步的写法完成的。



一个简单的例子来实现。

为了实现以生成器作为逻辑执行主体，把异步方法带到主线程去，

就要先将异步函数做一层包装，使得其可以在带出生成器执行对象之后再执行。

```
// Before
function echo(content, callback) {
  callback(null, content)
}

// After
function echo(content) {
  return callback => {
    callback(null, content)
  }
}
```

这样我们就可以在生成器内使用这个异步方法了。

但是还不足够，将方法带出生成器执行对象后，还需要在主线程将带出的函数执行才可实现应有的需求。

上面我们通过封装所得到的异步方法在生成器内部执行后，可以通过 `yield` 语句将内层的函数带到主线程中。

这样我们就可以在主线程中执行这个函数并得到返回值，然后将其返回到生成器执行对象中。

```
function run(genFn) {
  const gen = genFn()

  const next = value => {
    const ret = gen.next(value)
    if (ret.done) return

    ret.value((err, val) => {
      if (err) return console.error(err)

      // Looop
      next(val)
    })
  }

  // First call
  next()
}
```

通过这个运行工具，我们便可以将生成器函数作为逻辑的运行载体，从而将之前多层嵌套的异步操作全部扁平化。

```
run(function*() {
  const msg1 = yield echo('Hello')
  const msg2 = yield echo(`${msg1} World`)

  console.log(msg2) //=> Hello Wolrd
})
```



Node.js 社区中有一个第三方库名为 co，意为 coroutine，这个库的意义在于利用生成器来模拟协程。

而我们这里介绍的就是其中的一部分，co 的功能则更为丰富，可以直接使用 Promise 封装工具，如果异步方法有自带 Promise 的接口，就无需再次封装。

此外 co 还可以直接实现生成器的嵌套调用，也就是说可以通过 co 来实现逻辑代码的全部同步化开发。

```
import co from 'co'
import { promisify } from 'bluebird'
import fs from 'fs'
import path from 'path'

const filepath = path.resolve(process.cwd(), './data.txt')
const defaultData = new Buffer('Hello World')

co(function*() {
  const exists = yield promisify(fs.exists(filepath))

  if (exists) {
    const data = yield promisify(fs.readFile(filepath))
    // ...
  } else {
    yield promisify(fs.writeFile(filepath, defaultData))
    // ...
  }
})
```
