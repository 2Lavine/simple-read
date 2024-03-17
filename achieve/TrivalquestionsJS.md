> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.frontendinterviewhandbook.com](https://www.frontendinterviewhandbook.com/javascript-questions/)
### Explain event delegation[​](#explain-event-delegation "Direct link to Explain event delegation")

Event delegation is a technique involving 
- adding event listeners to a parent element 
- instead of adding them to the descendant elements. 
The listener will fire whenever the event is triggered on the descendant elements due to event bubbling up the DOM.  
(use target to detect the element ;CurrentTarget is parent element)

The benefits of this technique are:
*   Memory footprint goes down because only one single handler is needed on the parent element
*   There is no need to unbind the handler from elements that are removed and to bind the event for new elements.

### Explain how `this` works in JavaScript[​](#explain-how-this-works-in-javascript "Direct link to explain-how-this-works-in-javascript")

depondes on context
1. global context: get windows or global(node)
2. function context:
	1. dependon how call, obj call, this refered to obj
	2. arrow function is different, its this 被永久绑定到了它外层函数的 this。
		1. not decided this
		2. this dont change
3. contructor context:  refer to newly created obj
4. eventlistener context: refer to DOM element that trigger event
### Arrow `this` not change
例子如下
如果是普通函数
```
class person{
  age=0
  grow=()=>{
    this.age++
    return this.age
  }
}
p1 = new person()
let obj={
  age:-100,
}
obj.grow=p1.grow
console.log(p1.grow())1   
console.log(obj.grow())2  普通函数：-99
console.log(obj.grow())3  普通函数：-98
console.log(obj.grow())4
```


### Arrow `this` problems

since arrow function prevent the caller from controlling context via `.call` or `.apply`—
the consequences being that a library such as `jQuery` will not properly bind `this` in your event handler functions. 
Thus, it's important to keep this in mind when refactoring large legacy applications.

### Explain how prototypal inheritance works

### 函数的`prototype`和对象的`prototype`是不同的。
1. 函数的`prototype`：每个函数都有一个`prototype`属性，它是一个对象。他是用于给通过该构造函数创建的实例对象添加共享的属性和方法。
2. 对象的`prototype`：每个对象都有一个`__proto__`（或者ES6中的`[[Prototype]]`）属性，它指向该对象的原型（也就是另外一个对象）

- 函数的`prototype`属性是一个对象，
- 对象的`__proto__`属性是一个指向该对象的原型的引用，通过原型链的机制，对象可以访问和继承原型对象上的属性和方法。


---
	通过函数的`prototype`，我们可以给所有通过该构造函数创建的对象添加共享的属性和方法。
示例：
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person('John');
person1.sayHello(); // 输出: Hello, my name is John
```
![[Pasted image 20231010122134.png]]

---
2. 对象的`prototype`：每个对象都有一个`__proto__`（或者ES6中的`[[Prototype]]`）属性，它指向该对象的原型（也就是另外一个对象）
	通过原型链的机制，我们可以访问和继承原型对象上的属性和方法。
```javascript
const parent = {
  name: 'John',
  age: 40
};

const child = Object.create(parent);
console.log(child.__proto__ \=\== parent); // 输出: true
console.log(child.name); // 输出: John
```
在这个例子中，`child`对象的原型`__proto__`指向`parent`对象，因此`child`对象可以访问和继承`parent`对象上的属性。
### Object.create 实现
要实现一个类似于`Object.create()`的函数，可以按照以下步骤进行：
```javascript
function createObject(proto) {
  // 创建一个空对象
  const obj = {};
  // 将空对象的原型指向传入的proto对象
  obj.__proto__ = proto;
  
  // ES6 方法
  const obj = Object.create(null);
  // 将空对象的原型设置为传入的proto对象
  Object.setPrototypeOf(obj, proto);
  return obj;
}
```
这个自定义的`createObject()`函数接受一个参数`proto`，表示要设置为新对象的原型对象。它执行以下操作：

1. 创建一个空对象`obj`。
2. 将`obj`的`__proto__`属性设置为传入的`proto`对象，从而将新对象的原型指向`proto`对象。
3. 返回新创建的对象`obj`。
注意尽管__proto__属性在大多数现代浏览器中都被支持，但它是非标准的属性。在ES6中，推荐使用Object.getPrototypeOf()和Object.setPrototypeOf()来访问和设置对象的原型。
因此可以把上面的改写


### What do you think of ES moudle vs CommonJS?[​](#what-do-you-think-of-amd-vs-commonjs "Direct link to What do you think of AMD vs CommonJS?")
加载方式：
- ES模块是在编译时加载，也就是在脚本开始执行之前加载所有模块。
	- 这意味着它可以进行静态分析，并且可以在编译时进行优化。
- CommonJS是在运行时加载，也就是在代码执行过程中动态加载模块。
导入和导出的特性：
- ES模块的导入和导出是静态的，意味着导入和导出的模块路径必须是字符串常量，不能使用变量。
- CommonJS的导入和导出是动态的，可以使用变量作为模块路径。



### What is a closure, and how/why would you use one?[​](#what-is-a-closure-and-howwhy-would-you-use-one "Direct link to What is a closure, and how/why would you use one?")

A closure is the combination of a function and the lexical environment within which that function was declared. 
Closures are functions that have access to the outer (enclosing) function's variables—scope chain even after the outer function has returned.

**Why would you use one?**
*   Data privacy / emulating private methods with closures. Commonly used in the [module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript).
*   [Partial applications or currying](https://medium.com/javascript-scene/curry-or-partial-application-8150044c78b8#.l4b6l1i3x).




### What's the difference between host objects and native objects?[​](#whats-the-difference-between-host-objects-and-native-objects "Direct link to What's the difference between host objects and native objects?")

Native objects are objects that are part of the JavaScript language defined by the ECMAScript specification, such as `String`, `Math`, `RegExp`, `Object`, `Function`, etc.
Host objects are provided by the runtime environment (browser or Node), such as `window`, `XMLHTTPRequest`, etc.
### Difference between: `function Person(){}`, `var person = Person()`, and `var person = new Person()`?[​](#difference-between-function-person-var-person--person-and-var-person--new-person "Direct link to difference-between-function-person-var-person--person-and-var-person--new-person")

`var person = Person()` invokes the `Person` as a function, and not as a constructor. Invoking as such is a common mistake if the function is intended to be used as a constructor. Typically, the constructor does not return anything, hence invoking the constructor like a normal function will return `undefined` and that gets assigned to the variable intended as the instance.

`var person = new Person()` creates an instance of the `Person` object using the `new` operator, which inherits from `Person.prototype`. An alternative would be to use `Object.create`, such as: `Object.create(Person.prototype)`.

### What's the difference between `.call` and `.apply`?[​](#whats-the-difference-between-call-and-apply "Direct link to whats-the-difference-between-call-and-apply")

An easy way to remember this is C for `call` and comma-separated and A for `apply` and an array of arguments.

### When would you use `document.write()`?[​](#when-would-you-use-documentwrite "Direct link to when-would-you-use-documentwrite")

`document.write()` writes a string of text to a document stream opened by `document.open()`. 
When `document.write()` is executed after the page has loaded, it will call `document.open` which clears the whole document (`<head>` and `<body>` removed!) and replaces the contents with the given parameter value. Hence it is usually considered dangerous and prone to misuse.

#interview
Please do correct me if I'm wrong about this.

### What's the difference between feature detection, feature inference,?[​](#whats-the-difference-between-feature-detection-feature-inference-and-using-the-ua-string "Direct link to What's the difference between feature detection, feature inference, and using the UA string?")

**Feature Detection**
Feature detection involves 
working out whether a browser supports a certain block of code, and running different code depending on whether it does (or doesn't),
**Feature Inference**
Feature inference checks for a feature just like feature detection, but uses another function because it assumes it will also exist
This is not really recommended. Feature detection is more fool proof.
```
if ('geolocation' in navigator) {  
// Can use navigator.geolocation} 
else {  // Handle lack of feature}
```

### UA String

This is a browser-reported string that allows the network protocol peers to identify the application type, operating system, software vendor or software version of the requesting software user agent. It can be accessed via `navigator.userAgent`. However, the string is tricky to parse and can be spoofed. For example, Chrome reports both as Chrome and Safari. So to detect Safari you have to check for the Safari string and the absence of the Chrome string. Avoid this method.

### What are the advantages and disadvantages of using Ajax?[​](#what-are-the-advantages-and-disadvantages-of-using-ajax "Direct link to What are the advantages and disadvantages of using Ajax?")
**Advantages**
*   Better interactivity. enables real-time updates and interactions on web pages,
*   Reduce connections to the server since scripts and stylesheets only have to be requested once.
*   Basically most of the advantages of an SPA.
**Disadvantages**
*   Some webcrawlers do not execute JavaScript  hard SEO
*  low-end mobile devices might struggle with this.

### What's the difference between an"attribute"and a"property"?[​](#whats-the-difference-between-an-attribute-and-a-property "Direct link to What's the difference between an "attribute" and a "property"?")

Attributes are defined on the HTML markup but properties are defined on the DOM. 
To illustrate the difference, imagine we have this text field in our HTML: `<input type="text" value="Hello">`.
But after you change the value of the text field by adding "World!" to it, this becomes:

```
const input = document.querySelector('input');
console.log(input.getAttribute('value')); // Helloconsole.log(input.value); // Hello
```
### Why is extending built-in JavaScript objects not a good idea?[​](#why-is-extending-built-in-javascript-objects-not-a-good-idea "Direct link to Why is extending built-in JavaScript objects not a good idea?")
when  your code uses a few libraries that both extend the `Array.prototype` by adding the same `contains` method, the implementations will overwrite each other and your code will break if the behavior of these two methods is not the same.

The only time you may want to extend a native object is when you want to create a polyfill, essentially providing your own implementation for a method that is part of the JavaScript specification but might not exist in the user's browser due to it being an older browser.


### Difference between document `load` event and document `DOMContentLoaded` event?[​](#difference-between-document-load-event-and-document-domcontentloaded-event "Direct link to difference-between-document-load-event-and-document-domcontentloaded-event")

The `DOMContentLoaded` event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.此时可能某些资源（如图像）尚未加载完成。
`window`'s `load` event is only fired after the DOM and all dependent resources and assets have loaded.

### Why is it called a Ternary expression, what does the word "Ternary" indicate?[​](#why-is-it-called-a-ternary-expression-what-does-the-word-ternary-indicate "Direct link to Why is it called a Ternary expression, what does the word "Ternary" indicate?")

"Ternary" indicates three, and a ternary expression accepts three operands, the test condition, the "then" expression and the "else" expression. 
Ternary expressions are not specific to JavaScript and I'm not sure why it is even in this list.

### What is `"use strict";`? What are the advantages and disadvantages to using it?[​](#what-is-use-strict-what-are-the-advantages-and-disadvantages-to-using-it "Direct link to what-is-use-strict-what-are-the-advantages-and-disadvantages-to-using-it")

Disadvantages:
*   No more access to `function.caller` and `function.arguments`.
*   Concatenation of scripts written in different strict modes might cause issues.

### Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?[​](#why-is-it-in-general-a-good-idea-to-leave-the-global-scope-of-a-website-as-is-and-never-touch-it "Direct link to Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?")

Every script has access to the global scope, and if everyone uses the global namespace to define their variables, collisions will likely occur. Use the module pattern (IIFEs) to encapsulate your variables within a local namespace.
### What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript?[​](#what-are-some-of-the-advantagesdisadvantages-of-writing-javascript-code-in-a-language-that-compiles-to-javascript "Direct link to What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript?")

Disadvantages:

*   Require a build/compile process as browsers only run JavaScript and your code will need to be compiled into JavaScript before being served to browsers.
*   Debugging can be a pain if your source maps do not map nicely to your pre-compiled source.

Practically, ES2015 has vastly improved JavaScript and made it much nicer to write. I don't really see the need for CoffeeScript these days.

### What language constructions do you use for iterating over object properties and array items?[​](#what-language-constructions-do-you-use-for-iterating-over-object-properties-and-array-items "Direct link to What language constructions do you use for iterating over object properties and array items?")

#### For objects iterating:

*   `for-in` loops - `for (var property in obj) { console.log(property); }`. However, this will also iterate through its inherited properties, and you will add an `obj.hasOwnProperty(property)` check before using it.
*   `Object.keys()` - `Object.keys(obj).forEach(function (property) { ... })`. `Object.keys()` is a static method that will lists all enumerable properties of the object that you pass it.
*   `Object.getOwnPropertyNames()` - `Object.getOwnPropertyNames(obj).forEach(function (property) { ... })`. `Object.getOwnPropertyNames()` is a static method that will lists all enumerable and non-enumerable properties of the object that you pass it.

#### For arrays objects:

*   `for` loops - `for (var i = 0; i < arr.length; i++)`. The common pitfall here is that `var` is in the function scope and not the block scope and most of the time you would want block scoped iterator variable. ES2015 introduces `let` which has block scope and it is recommended to use that instead. So this becomes: `for (let i = 0; i < arr.length; i++)`.
*   `forEach` - `arr.forEach(function (el, index) { ... })`. This construct can be more convenient at times because you do not have to use the `index` if all you need is the array elements. There are also the `every` and `some` methods which will allow you to terminate the iteration early.
*   `for-of` loops - `for (let elem of arr) { ... }`. ES6 introduces a new loop, the `for-of` loop, that allows you to loop over objects that conform to the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) such as `String`, `Array`, `Map`, `Set`, etc. It combines the advantages of the `for` loop and the `forEach()` method. The advantage of the `for` loop is that you can break from it, and the advantage of `forEach()` is that it is more concise than the `for` loop because you don't need a counter variable. With the `for-of` loop, you get both the ability to break from a loop and a more concise syntax.
```
const arr = ['a', 'b', 'c'];
for (let [index, elem] of arr.entries()) {  
	console.log(index, ': ', elem);
}
```

### Explain the difference between mutable and immutable objects.[​](#explain-the-difference-between-mutable-and-immutable-objects "Direct link to Explain the difference between mutable and immutable objects.")
Immutability is a core principle in functional programming, and has lots to offer to object-oriented programs as well. 
A mutable object is an object whose state can be modified after it is created. 
An immutable object is an object whose state cannot be modified after it is created.
#### What is an example of an immutable object in JavaScript?[​](#what-is-an-example-of-an-immutable-object-in-javascript "Direct link to What is an example of an immutable object in JavaScript?")
In JavaScript, some built-in types (numbers, strings) are immutable, but custom objects are generally mutable.
Some built-in immutable JavaScript objects are `Math`, `Date`.

#### How to simulateimmutability ob plain objects
Here are a few ways to add/simulate immutability on plain JavaScript objects.
- make properties constant
- Prevent Extensions
- seal
- freeize

#### Object Constant Properties
By combining `writable: false` and `configurable: false`
you can essentially create a constant (cannot be changed, redefined or deleted) as an object property, like:
```js
let myObject = {};
Object.defineProperty(myObject, 'number', {  
	value: 42,  writable: false,  configurable: false,
	});
console.log(myObject.number); // 42
myObject.number = 43;console.log(myObject.number); // 42
```

configurable（可配置性）：当configurable设为false时，
- 表示该属性不可再次修改writable和configurable的值。
- 如果configurable设为true，则可以删除该属性，并且可以再次修改writable和configurable的值。


#### Prevent Extensions
If you want to prevent an object from having new properties added to it, but otherwise leave the rest of the object's properties alone, call `Object.preventExtensions(...)`:
```js
var myObject = { a:2,};
Object.preventExtensions(myObject);
myObject.b = 3;
myObject.b; // undefined
```
In non-strict mode, the creation of `b` fails silently. In strict mode, it throws a `TypeError`.

#### Seal
`Object.seal()` creates a "sealed" object, which means it takes an existing object and essentially calls `Object.preventExtensions()` on it, but also marks all its existing properties as `configurable: false`.

So, not only can you not add any more properties, but you also cannot reconfigure or delete any existing properties (though you can still modify their values).

#### Freeze

`Object.freeze()` creates a frozen object, which means it takes an existing object and essentially calls `Object.seal()` on it, 
but it also marks all "data accessor" properties as writable:false, so that their values cannot be changed.
This approach is the highest level of immutability that you can attain for an object itself, as it prevents any changes to the object or to any of its direct properties (though, as mentioned above, the contents of any referenced other objects are unaffected).

Freezing an object does not allow new properties to be added to an object and prevents from removing or altering the existing properties. `Object.freeze()` preserves the enumerability, configurability, writability and the prototype of the object. It returns the passed object and does not create a frozen copy.

#### What are the pros and cons of immutability?[​](#what-are-the-pros-and-cons-of-immutability "Direct link to What are the pros and cons of immutability?")

**Pros**
- Thread-safe - Immutable objects can be safely used between threads in a multi-threaded environment since there is no risk of them being modified in other concurrently running threads.
*   Easier change detection - Object equality can be determined in a performant and easy manner through referential equality. This is useful for comparing object differences in React and Redux.
* 缓存优化：不可变对象可以被安全地用作缓存的键，因为它们的哈希值不会改变。
* 简化代码逻辑：如函数式编程可以用链式操作来处理数据，而不需要使用循环或变量。

**Cons**
* 内存占用
* Performance 
*  Cyclic data structures such as graphs are difficult to build. If you have two objects which can't be modified after initialization, how can you get them to point to each other?
#### How can you achieve immutability in your own code?[​](#how-can-you-achieve-immutability-in-your-own-code "Direct link to How can you achieve immutability in your own code?")
One way to achieve immutability is to use libraries like [immutable.js](http://facebook.github.io/immutable-js/), [mori](https://github.com/swannodette/mori) or [immer](https://github.com/immerjs/immer).
The alternative is to use `const` declarations combined with the techniques mentioned above for creation. 
For "mutating" objects, use the spread operator, `Object.assign`, `Array.concat()`, etc., to create new objects instead of mutate the original object.
Examples:
```
var immutable = Object.freeze({});
```
### Explain the difference between synchronous and asynchronous functions.[​](#explain-the-difference-between-synchronous-and-asynchronous-functions "Direct link to Explain the difference between synchronous and asynchronous functions.")
Synchronous functions are blocking while asynchronous functions are not. 
Heavy duty operations such as loading data from a web server or querying a database should be done asynchronously so that the main thread can continue executing other operations instead of blocking until that long operation to complete (in the case of browsers, the UI will freeze).

### What are the differences between ES6 class and ES5 function constructors?[​](#what-are-the-differences-between-es6-class-and-es5-function-constructors "Direct link to What are the differences between ES6 class and ES5 function constructors?")

The main difference in the constructor comes when using inheritance.
If we want to create a `Student` class that subclasses `Person` and add a `studentId` field, this is what we have to do in addition to the above.

```js
// ES5 Function Constructor
function Student(name, studentId) {  
	Person.call(this, name);  
// Initialize subclass's own members.  
	this.studentId = studentId;
}
Student.prototype=Object.create(Person.prototype);
Student.prototype.constructor = Student;
// ES6 Class
class Student extends Person {  
	constructor(name, studentId) {    
	super(name);    
	this.studentId = studentId;  
}}
```


### What advantage is there for using the arrow syntax for a method in a constructor?[​](#what-advantage-is-there-for-using-the-arrow-syntax-for-a-method-in-a-constructor "Direct link to What advantage is there for using the arrow syntax for a method in a constructor?")

The main advantage of using an arrow function as a method inside a constructor is that the value of `this` gets set at the time of the function creation and can't change after that. 
This can be particularly helpful in React class components. 
If you define a class method for something such as a click handler using a normal function, and then you pass that click handler down into a child component as a prop, you will need to also bind `this` in the constructor of the parent component. 
If you instead use an arrow function, there is no need to also bind "this", as the method will automatically get its "this" value from its enclosing lexical context. (See this article for an excellent demonstration and sample code: 

```js
const Person = function (firstName) {
  this.firstName = firstName;
  this.sayName1 = function () {
    console.log(this.firstName);
  };
  this.sayName2 = () => {
    console.log(this.firstName);
  };
};

const john = new Person('John');
const dave = new Person('Dave');
// The regular function can have its 'this' value changed, but the arrow function cannot
john.sayName1.call(dave); // Dave (because "this" is now the dave object)
john.sayName2.call(dave); // John
```
### What is the definition of a higher-order function?[​](#what-is-the-definition-of-a-higher-order-function "Direct link to What is the definition of a higher-order function?")

A higher-order function is any function that takes one or more functions as arguments, which it uses to operate on some data, and/or returns a function as a result. Higher-order functions are meant to abstract some operation that is performed repeatedly. 
Something like `map`, `filter`,`reduce`
### Can you give an example for destructuring an object or an array?[​](#can-you-give-an-example-for-destructuring-an-object-or-an-array "Direct link to Can you give an example for destructuring an object or an array?")
```
const [one, two, three] = foo;
[a, b] = [b, a];
const o = {p: 42, q: true};
const {p, q} = o;
```
### ES6 Template Literals offer a lot of flexibility in generating strings, can you give an example?[​](#es6-template-literals-offer-a-lot-of-flexibility-in-generating-strings-can-you-give-an-example "Direct link to ES6 Template Literals offer a lot of flexibility in generating strings, can you give an example?")

Template literals help make it simple to do string interpolation, or to include variables in a string. Before ES2015, it was common to do something like this:

```
// Variable assignment.const o = {p: 42, q: true};
const {p, q} = o;
console.log(p); // 42console.log(q); // true
```
### What are the benefits of using spread syntax and how is it different from rest syntax?[​](#what-are-the-benefits-of-using-spread-syntax-and-how-is-it-different-from-rest-syntax "Direct link to What are the benefits of using spread syntax and how is it different from rest syntax?")

ES6's spread syntax is very useful when coding in a functional paradigm as we can easily create copies of arrays or objects without resorting to `Object.create`, `slice`, or a library function. This language feature is used often in Redux and RxJS projects.

```js
function putDookieInAnyArray(arr) {
  return [...arr, 'dookie'];
}
const copyOfTodd = {...person};
```

ES6's rest syntax offers a shorthand for including an arbitrary number of arguments to be passed to a function. It is like an inverse of the spread syntax, taking data and stuffing it into an array rather than unpacking an array of data, and it works in function arguments, as well as in array and object destructuring assignments.

```js
function addFiveToABunchOfNumbers(...numbers) {
  return numbers.map((x) => x + 5);
}

const result = addFiveToABunchOfNumbers(4, 5, 6, 7, 8, 9, 10); // [9, 10, 11, 12, 13, 14, 15]

const [a, b, ...rest] = [1, 2, 3, 4]; // a: 1, b: 2, rest: [3, 4]

const {e, f, ...others} = {
  e: 1,
  f: 2,
  g: 3,
  h: 4,
};
```

### Why you might want to create static class members?[​](#why-you-might-want-to-create-static-class-members "Direct link to Why you might want to create static class members?")

Static class members (properties/methods) are not tied to a specific instance of a class and have the same value regardless of which instance is referring to it. 
Static properties are typically configuration variables and static methods are usually pure utility functions which do not depend on the state of the instance.
