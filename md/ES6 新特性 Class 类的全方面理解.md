> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7021069095336411166#heading-1)

类的由来
====

JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。

```
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过`class`关键字，可以定义类。

基本上，ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用 ES6 的`class`改写，就是下面这样。

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

上面代码定义了一个 “类”，可以看到里面有一个`constructor()`方法，这就是构造方法，而`this`关键字则代表实例对象。这种新的 Class 写法，本质上与本文开头的 ES5 的构造函数`Point`是一致的。

◾ `Point`类除了构造方法，还定义了一个`toString()`方法。**注意，定义`toString()`方法的时候，前面不需要加上`function`这个关键字，直接把函数定义放进去了就可以了。另外，方法与方法之间不需要逗号分隔，加了会报错。**

ES6 的类，完全可以看作构造函数的另一种写法。

```
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

上面代码表明，类的数据类型就是函数，类本身就指向构造函数。

使用的时候，也是直接对类使用`new`命令，跟构造函数的用法完全一致。

```
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

const b = new Bar();
b.doStuff() // "stuff"
```

构造函数的`prototype`属性，在 ES6 的 “类” 上面继续存在。事实上，类的所有方法都定义在类的`prototype`属性上面。

```
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

上面代码中，`constructor()`、`toString()`、`toValue()`这三个方法，其实都是定义在`Point.prototype`上面。

因此，在类的实例上面调用方法，其实就是调用原型上的方法。

```
class B {}
const b = new B();

b.constructor === B.prototype.constructor // true
```

上面代码中，`b`是`B`类的实例，它的`constructor()`方法就是`B`类原型的`constructor()`方法。

由于类的方法都定义在`prototype`对象上面，所以类的新方法可以添加在`prototype`对象上面。`Object.assign()`方法可以很方便地一次向类添加多个方法。

```
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```

`prototype`对象的`constructor()`属性，直接指向 “类” 的本身，这与 ES5 的行为是一致的。

```
Point.prototype.constructor === Point // true
```

另外，类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

```
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

上面代码中，`toString()`方法是`Point`类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。

```
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function () {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

上面代码采用 ES5 的写法，`toString()`方法就是可枚举的。

_注：在 JavaScript 中，对象的属性分为可枚举和不可枚举之分。可枚举性决定了这个属性能否被 for…in 查找遍历到。_

> 可枚举属性是指那些内部 “可枚举” 标志设置为 `true` 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 `true`，对于通过 `Object.defineProperty` 等定义的属性，该标识值默认为 `false`。可枚举的属性可以通过 `for...in` 循环进行遍历（除非该属性名是一个 Symbol）。

属性的枚举性会影响以下三个函数的结果：

*   for…in
    
*   Object.keys()
    
*   JSON.stringify
    

构造函数 constructor
================

**`constructor`** 是一种用于创建和初始化`class`创建的对象的特殊方法。

```
class Polygon {
  constructor() {
    this.name = 'Polygon';
  }
}

const poly1 = new Polygon();

console.log(poly1.name);
// expected output: "Polygon"
```

`constructor()`方法是类的默认方法，**通过`new`命令生成对象实例时，自动调用该方法**。一个类必须有`constructor()`方法，如果没有显式定义，一个空的`constructor()`方法会被默认添加。

```
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

上面代码中，定义了一个空的类`Point`，JavaScript 引擎会自动为它添加一个空的`constructor()`方法。

`constructor()`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象。

```
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```

上面代码中，`constructor()`函数返回一个全新的对象，结果导致实例对象不是`Foo`类的实例。

类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。

```
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'
```

在一个类中只能有一个名为 “constructor” 的特殊方法。 一个类中出现多次构造函数 (`constructor)`方法将会抛出一个 `SyntaxError`错误。

在一个构造方法中可以使用`super`关键字来调用一个父类的构造方法。

如果没有显式指定构造方法，则会添加默认的 constructor 方法。

如果不指定一个构造函数 (constructor) 方法, 则使用一个默认的构造函数(constructor)。

**◾ 使用 constructor 方法**

```
class Square extends Polygon {
    constructor(length) {
        // 在这里, 它调用了父类的构造函数, 并将 lengths 提供给 Polygon 的"width"和"height"
        super(length, length);
        // 注意: 在派生类中, 必须先调用 super() 才能使用 "this"。
        // 忽略这个，将会导致一个引用错误。
        this.name = 'Square';
    }
    get area() {
        return this.height * this.width;
    }
    set area(value) {
        // 注意：不可使用 this.area = value
        // 否则会导致循环call setter方法导致爆栈
        this._area = value;
    }
}
```

这里包含两个重要知识点：

*   注意: 在派生类中, 必须先调用 super() 才能使用 "this"。忽略这个，将会导致一个引用错误。
*   注意：在 `set area(value)`中 不可使用 `this.area = value`，否则会导致循环 call setter 方法导致爆栈

**◾ 默认构造方法**

如前所述，如果不指定构造方法，则使用默认构造函数。对于基类，默认构造函数是：

```
constructor() {}
```

Copy to Clipboard

对于派生类，默认构造函数是：

```
constructor(...args) {
  super(...args);
}
```

类的实例化
=====

class 的实例化必须通过 new 关键字。

```
class Example {} 
let exam1 = Example(); 
// Class constructor Example cannot be invoked without 'new'
```

**◾ 实例化对象**

类的所有实例共享一个原型对象。

```
class Example {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        console.log('Example');
    }
    sum() {
        return this.a + this.b;
    }
}
let exam1 = new Example(2, 1);
let exam2 = new Example(3, 1);
console.log(exam1._proto_ == exam2._proto_); // true 

exam1._proto_.sub = function () {
    return this.a - this.b;
}
console.log(exam1.sub()); // 1 
console.log(exam2.sub()); // 2
```

上面代码中，`exam1`和`exam2`都是`Example`的实例，它们的原型都是`Example.prototype`，所以`__proto__`属性是相等的。

这也意味着，可以通过实例的`__proto__`属性为 “类” 添加方法。

> `__proto__` 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 `Object.getPrototypeOf` 方法来获取实例对象的原型，然后再来为原型添加方法 / 属性。

使用实例的`__proto__`属性改写原型，必须相当谨慎，不推荐使用，因为这会改变 “类” 的原始定义，影响到所有实例。

取值函数 (getter) 和存值函数 (setter)
============================

在 “类” 的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

上面代码中，`prop`属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

存值函数和取值函数是设置在属性的 Descriptor 对象上的。

```
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

上面代码中，存值函数和取值函数是定义在`html`属性的描述对象上面，这与 ES5 完全一致。

```
class Example {
    constructor(a, b) {
        this.a = a; // 实例化时调用 set 方法
        this.b = b;
    }
    get a() {
        console.log('getter');
        return this.a;
    }
    set a(a) {
        console.log('setter');
        this.a = a; // 自身递归调用
    }
}
let exam = new Example(1, 2); // 不断输出 setter ，最终导致 RangeError
class Example1 {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    get a() {
        console.log('getter');
        return this._a;
    }
    set a(a) {
        console.log('setter');
        this._a = a;
    }
}
let exam1 = new Example1(1, 2); // 只输出 setter , 不会调用 getter 方法
console.log(exam1._a); // 1, 可以直接访问
```

**◾ getter 不可单独出现**

```
class Example {
    constructor(a) {
        this.a = a;
    }
    get a() {
        return this.a;
    }
}
let exam = new Example(1); 
// Uncaught TypeError: Cannot set property a of #<Example> which has only a getter
```

**◾ getter 与 setter 必须同级出现**

```
class Father {
    constructor() {}
    get a() {
        return this._a;
    }
}
class Child extends Father {
    constructor() {
        super();
    }
    set a(a) {
        this._a = a;
    }
}
let test = new Child();
test.a = 2;
console.log(test.a); // undefined
```

**正确写法：创建类的时候同时声明`get` 和`set`，或者把 `get` 和`set`都放在子类中**

```
class Father1 {
    constructor() {}
    // 或者都放在子类中
    get a() {
        return this._a;
    }
    set a(a) {
        this._a = a;
    }
}
class Child1 extends Father1 {
    constructor() {
        super();
    }
}
let test1 = new Child1();
test1.a = 2;
console.log(test1.a); // 2
```

静态方法 static
===========

类（class）通过 **static** 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为 “静态方法”。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

上面代码中，`Foo`类的`classMethod`方法前有`static`关键字，表明该方法是一个静态方法，可以直接在`Foo`类上调用（`Foo.classMethod()`），而不是在`Foo`类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

◾ 注意，如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例。

```
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```

上面代码中，静态方法`bar`调用了`this.baz`，这里的`this`指的是`Foo`类，而不是`Foo`的实例，等同于调用`Foo.baz`。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。

◾ 父类的静态方法，可以被子类继承。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

上面代码中，父类`Foo`有一个静态方法，子类`Bar`可以调用这个方法。

◾ 静态方法也是可以从`super`对象上调用的。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"
```

关键字 super
=========

**super** 关键字用于访问和调用一个对象的父对象上的函数。

**在构造函数中使用时，`super`关键字将单独出现**，并且**必须在使用`this`关键字之前使用。`super`关键字也可以用来调用父对象上的函数**。

**◾ 调用父类的构造函数**

```
class Polygon {
  constructor(height, width) {
    this.name = 'Rectangle';
    this.height = height;
    this.width = width;
  }
  sayName() {
    console.log('Hi, I am a ', this.name + '.');
  }
  get area() {
    return this.height * this.width;
  }
  set area(value) {
    this._area = value;
  }
}

class Square extends Polygon {
  constructor(length) {
    this.height; // 这样直接 this.heigh t会报错：ReferenceError，因为 super 需要先被调用！

    // 这里，它调用父类的构造函数的,
    // 作为Polygon 的 height, width
    super(length, length);

    // 注意: 在派生的类中, 在你可以使用'this'之前, 必须先调用super()。
    // 忽略这, 这将导致引用错误。
    this.name = 'Square';
  }
}
```

**◾ 调用父类上的静态方法**

```
class Rectangle {
  constructor() {}
  static logNbSides() {
    return 'I have 4 sides';
  }
}

class Square extends Rectangle {
  constructor() {}
  static logDescription() {
    return super.logNbSides() + ' which are all equal';
  }
}
Square.logDescription(); // 'I have 4 sides which are all equal'
```

**◾ 子类 constructor 方法中必须有 super ，且必须出现在 this 之前。**

下面是两个错误写法：

```
class Father {
    constructor() {}
}
class Child extends Father {
    constructor() {}
}
let test = new Child();
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

```
class Father {
    constructor() {}
}
class Child extends Father {
    or
    constructor(a) {
        this.a = a;
        super();
    }
}
let test = new Child();
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

**◾ 调用父类构造函数, 只能出现在子类的构造函数。**

```
class Father {
    test() {
        return 0;
    }
    static test1() {
        return 1;
    }
}
class Child extends Father {
    constructor() {
        super();
    }
}
class Child1 extends Father {
    test2() {
        super(); // Uncaught SyntaxError: 'super' keyword unexpected     
        // here
    }
}
```

**◾ 调用父类方法, super 作为对象，在普通方法中，指向父类的原型对象，在静态方法中，指向父类。**

```
class Child2 extends Father {
    constructor(){
        super();
        // 调用父类普通方法
        console.log(super.test()); // 0
    }
    static test3(){
        // 调用父类静态方法
        return super.test1+2;
    }
}
Child2.test3(); // 3
```

继承 extends
==========

Class 可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```
class Point {
}

class ColorPoint extends Point {
}
```

上面代码定义了一个`ColorPoint`类，该类通过`extends`关键字，继承了`Point`类的所有属性和方法。但是由于没有部署任何代码，所以这两个类完全一样，等于复制了一个`Point`类。下面，我们在`ColorPoint`内部加上代码。

```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

上面代码中，`constructor`方法和`toString`方法之中，都出现了`super`关键字，它在这里表示父类的构造函数，用来新建父类的`this`对象。

◾ 子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。

```
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
```

上面代码中，`ColorPoint`继承了父类`Point`，但是它的构造函数没有调用`super`方法，导致新建实例时报错。

ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

如果子类没有定义`constructor`方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有`constructor`方法。

```
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```

另一个需要注意的地方是，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```

上面代码中，子类的`constructor`方法没有调用`super`之前，就使用`this`关键字，结果报错，而放在`super`方法之后就是正确的。

下面是生成子类实例的代码。

```
let cp = new ColorPoint(25, 8, 'green');

cp instanceof ColorPoint // true
cp instanceof Point // true
```

上面代码中，实例对象`cp`同时是`ColorPoint`和`Point`两个类的实例，这与 ES5 的行为完全一致。

最后，父类的静态方法，也会被子类继承。

```
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world
```

上面代码中，`hello()`是`A`类的静态方法，`B`继承`A`，也继承了`A`的静态方法。

不存在变量提升
=======

类不存在变量提升（hoist），这一点与 ES5 完全不同。

```
new Foo(); // ReferenceError
class Foo {}
```

上面代码中，`Foo`类使用在前，定义在后，这样会报错，因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。

```
{
  let Foo = class {};
  class Bar extends Foo {
  }
}
```

上面的代码不会报错，因为`Bar`继承`Foo`的时候，`Foo`已经有定义了。但是，如果存在`class`的提升，上面代码就会报错，因为`class`会被提升到代码头部，而`let`命令是不提升的，所以导致`Bar`继承`Foo`的时候，`Foo`还没有定义。

参考
==

*   [类 - JavaScript | MDN (mozilla.org)](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FClasses "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes")
*   [阮一峰 ECMAScript 6 (ES6) 标准入门教程 第三版](https://link.juejin.cn?target=https%3A%2F%2Fes6.ruanyifeng.com%2F "https://es6.ruanyifeng.com/")
*   [ES6 Class 类](https://link.juejin.cn?target=https%3A%2F%2Fwww.runoob.com%2Fw3cnote%2Fes6-class.html "https://www.runoob.com/w3cnote/es6-class.html")
*   [JavaScript 中的可枚举属性与不可枚举属性](https://link.juejin.cn?target=https%3A%2F%2Fwww.cnblogs.com%2Fkongxy%2Fp%2F4618173.html "https://www.cnblogs.com/kongxy/p/4618173.html")