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
### Explain "hoisting".[​](#explain-hoisting "Direct link to Explain "hoisting".")

Hoisting is a term used to explain the behavior of variable declarations in your code. Variables declared or initialized with the `var` keyword will have their declaration "moved" up to the top of their module/function-level scope, which we refer to as hoisting. However, only the declaration is hoisted, the assignment (if there is one), will stay where it is.

Note that the declaration is not actually moved - the JavaScript engine parses the declarations during compilation and becomes aware of declarations and their scopes. It is just easier to understand this behavior by visualizing the declarations as being hoisted to the top of their scope. Let's explain with a few examples.

```
const template = `<div>My name is: ${name}</div>`;
```

Function declarations have the body hoisted while the function expressions (written in the form of variable declarations) only has the variable declaration hoisted.

```
console.log(foo); // undefinedvar foo = 1;console.log(foo); // 1
```

Variables declared via `let` and `const` are hoisted as well. However, unlike `var` and `function`, they are not initialized and accessing them before the declaration will result in a `ReferenceError` exception. The variable is in a "temporal dead zone" from the start of the block until the declaration is processed.

```
// Function Declarationconsole.log(foo); // [Function: foo]foo(); // 'FOOOOO'function foo() {  console.log('FOOOOO');}console.log(foo); // [Function: foo]// Function Expressionconsole.log(bar); // undefinedbar(); // Uncaught TypeError: bar is not a functionvar bar = function () {  console.log('BARRRR');};console.log(bar); // [Function: bar]
```

###### References[​](#references-16 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types#Variable_hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types#Variable_hoisting)
*   [https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-not-hoisted-in-es6/31222689#31222689](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-not-hoisted-in-es6/31222689#31222689)

### Describe event bubbling.[​](#describe-event-bubbling "Direct link to Describe event bubbling.")

When an event triggers on a DOM element, it will attempt to handle the event if there is a listener attached, then the event is bubbled up to its parent and the same thing happens. This bubbling occurs up the element's ancestors all the way to the `document`. Event bubbling is the mechanism behind event delegation.

### What's the difference between an"attribute"and a"property"?[​](#whats-the-difference-between-an-attribute-and-a-property "Direct link to What's the difference between an "attribute" and a "property"?")

Attributes are defined on the HTML markup but properties are defined on the DOM. To illustrate the difference, imagine we have this text field in our HTML: `<input type="text" value="Hello">`.

```
x; // undefinedy; // Reference error: y is not definedvar x = 'local';let y = 'local';
```

But after you change the value of the text field by adding "World!" to it, this becomes:

```
const input = document.querySelector('input');console.log(input.getAttribute('value')); // Helloconsole.log(input.value); // Hello
```

###### References[​](#references-17 "Direct link to References")

*   [https://stackoverflow.com/questions/6003819/properties-and-attributes-in-html](https://stackoverflow.com/questions/6003819/properties-and-attributes-in-html)

### Why is extending built-in JavaScript objects not a good idea?[​](#why-is-extending-built-in-javascript-objects-not-a-good-idea "Direct link to Why is extending built-in JavaScript objects not a good idea?")

Extending a built-in/native JavaScript object means adding properties/functions to its `prototype`. While this may seem like a good idea at first, it is dangerous in practice. Imagine your code uses a few libraries that both extend the `Array.prototype` by adding the same `contains` method, the implementations will overwrite each other and your code will break if the behavior of these two methods is not the same.

The only time you may want to extend a native object is when you want to create a polyfill, essentially providing your own implementation for a method that is part of the JavaScript specification but might not exist in the user's browser due to it being an older browser.

###### References[​](#references-18 "Direct link to References")

*   [http://lucybain.com/blog/2014/js-extending-built-in-objects/](http://lucybain.com/blog/2014/js-extending-built-in-objects/)

### Difference between document `load` event and document `DOMContentLoaded` event?[​](#difference-between-document-load-event-and-document-domcontentloaded-event "Direct link to difference-between-document-load-event-and-document-domcontentloaded-event")

The `DOMContentLoaded` event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.

`window`'s `load` event is only fired after the DOM and all dependent resources and assets have loaded.

###### References[​](#references-19 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)
*   [https://developer.mozilla.org/en-US/docs/Web/Events/load](https://developer.mozilla.org/en-US/docs/Web/Events/load)

### What is the difference between\=\= and \=\=\=?[​](#what-is-the-difference-between--and- "Direct link to what-is-the-difference-between--and-")

\=\= is the abstract equality operator while \=\=\= is the strict equality operator. The\=\= operator will compare for equality after doing any necessary type conversions. The \=\=\= operator will not do type conversion, so if two values are not the same type \=\=\= will simply return `false`. When using\=\=, funky things can happen, such as:

```
console.log(input.getAttribute('value')); // Helloconsole.log(input.value); // Hello World!
```

My advice is never to use the\=\= operator, except for convenience when comparing against `null` or `undefined`, where `a \=\= null` will return `true` if `a` is `null` or `undefined`.

```
1 \=\= '1'; // true1 \=\= [1]; // true1 \=\= true; // true0 \=\= ''; // true0 \=\= '0'; // true0 \=\= false; // true
```

###### References[​](#references-20 "Direct link to References")

*   [https://stackoverflow.com/questions/359494/which-equals-operator-vs-should-be-used-in-javascript-comparisons](https://stackoverflow.com/questions/359494/which-equals-operator-vs-should-be-used-in-javascript-comparisons)

### Explain the same-origin policy with regards to JavaScript.[​](#explain-the-same-origin-policy-with-regards-to-javascript "Direct link to Explain the same-origin policy with regards to JavaScript.")

The same-origin policy prevents JavaScript from making requests across domain boundaries. An origin is defined as a combination of URI scheme, hostname, and port number. This policy prevents a malicious script on one page from obtaining access to sensitive data on another web page through that page's Document Object Model.

###### References[​](#references-21 "Direct link to References")

*   [https://en.wikipedia.org/wiki/Same-origin_policy](https://en.wikipedia.org/wiki/Same-origin_policy)

### Make this work:[​](#make-this-work "Direct link to Make this work:")

```
var a = null;console.log(a \=\= null); // trueconsole.log(a \=\= undefined); // true
```

```
duplicate([1, 2, 3, 4, 5]); // [1,2,3,4,5,1,2,3,4,5]
```

Or with ES6:

```
function duplicate(arr) {  return arr.concat(arr);}duplicate([1, 2, 3, 4, 5]); // [1,2,3,4,5,1,2,3,4,5]
```

### Why is it called a Ternary expression, what does the word "Ternary" indicate?[​](#why-is-it-called-a-ternary-expression-what-does-the-word-ternary-indicate "Direct link to Why is it called a Ternary expression, what does the word "Ternary" indicate?")

"Ternary" indicates three, and a ternary expression accepts three operands, the test condition, the "then" expression and the "else" expression. Ternary expressions are not specific to JavaScript and I'm not sure why it is even in this list.

###### References[​](#references-22 "Direct link to References")

*   [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)

### What is `"use strict";`? What are the advantages and disadvantages to using it?[​](#what-is-use-strict-what-are-the-advantages-and-disadvantages-to-using-it "Direct link to what-is-use-strict-what-are-the-advantages-and-disadvantages-to-using-it")

'use strict' is a statement used to enable strict mode to entire scripts or individual functions. Strict mode is a way to opt into a restricted variant of JavaScript.

Advantages:

*   Makes it impossible to accidentally create global variables.
*   Makes assignments which would otherwise silently fail to throw an exception.
*   Makes attempts to delete undeletable properties throw an exception (where before the attempt would simply have no effect).
*   Requires that function parameter names be unique.
*   `this` is undefined in the global context.
*   It catches some common coding bloopers, throwing exceptions.
*   It disables features that are confusing or poorly thought out.

Disadvantages:

*   Many missing features that some developers might be used to.
*   No more access to `function.caller` and `function.arguments`.
*   Concatenation of scripts written in different strict modes might cause issues.

Overall, I think the benefits outweigh the disadvantages, and I never had to rely on the features that strict mode blocks. I would recommend using strict mode.

###### References[​](#references-23 "Direct link to References")

*   [http://2ality.com/2011/10/strict-mode-hatred.html](http://2ality.com/2011/10/strict-mode-hatred.html)
*   [http://lucybain.com/blog/2014/js-use-strict/](http://lucybain.com/blog/2014/js-use-strict/)

### Create a for loop that iterates up to `100` while outputting **"fizz"** at multiples of `3`, **"buzz"** at multiples of `5` and **"fizzbuzz"** at multiples of `3` and `5`.[​](#create-a-for-loop-that-iterates-up-to-100-while-outputting-fizz-at-multiples-of-3-buzz-at-multiples-of-5-and-fizzbuzz-at-multiples-of-3-and-5 "Direct link to create-a-for-loop-that-iterates-up-to-100-while-outputting-fizz-at-multiples-of-3-buzz-at-multiples-of-5-and-fizzbuzz-at-multiples-of-3-and-5")

Check out this version of FizzBuzz by [Paul Irish](https://gist.github.com/jaysonrowe/1592432#gistcomment-790724).

```
const duplicate = (arr) => [...arr, ...arr];duplicate([1, 2, 3, 4, 5]); // [1,2,3,4,5,1,2,3,4,5]
```

I would not advise you to write the above during interviews though. Just stick with the long but clear approach. For more wacky versions of FizzBuzz, check out the reference link below.

###### References[​](#references-24 "Direct link to References")

*   [https://gist.github.com/jaysonrowe/1592432](https://gist.github.com/jaysonrowe/1592432)

### Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?[​](#why-is-it-in-general-a-good-idea-to-leave-the-global-scope-of-a-website-as-is-and-never-touch-it "Direct link to Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?")

Every script has access to the global scope, and if everyone uses the global namespace to define their variables, collisions will likely occur. Use the module pattern (IIFEs) to encapsulate your variables within a local namespace.

### Why would you use something like the `load` event? Does this event have disadvantages? Do you know any alternatives, and why would you use those?[​](#why-would-you-use-something-like-the-load-event-does-this-event-have-disadvantages-do-you-know-any-alternatives-and-why-would-you-use-those "Direct link to why-would-you-use-something-like-the-load-event-does-this-event-have-disadvantages-do-you-know-any-alternatives-and-why-would-you-use-those")

The `load` event fires at the end of the document loading process. At this point, all of the objects in the document are in the DOM, and all the images, scripts, links and sub-frames have finished loading.

The DOM event `DOMContentLoaded` will fire after the DOM for the page has been constructed, but do not wait for other resources to finish loading. This is preferred in certain cases when you do not need the full page to be loaded before initializing.

TODO.

###### References[​](#references-25 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload)

### Explain what a single page app is and how to make one SEO-friendly.[​](#explain-what-a-single-page-app-is-and-how-to-make-one-seo-friendly "Direct link to Explain what a single page app is and how to make one SEO-friendly.")

The below is taken from the awesome [Grab Front End Guide](https://github.com/grab/front-end-guide), which coincidentally, is written by me!

Web developers these days refer to the products they build as web apps, rather than websites. While there is no strict difference between the two terms, web apps tend to be highly interactive and dynamic, allowing the user to perform actions and receive a response to their action. Traditionally, the browser receives HTML from the server and renders it. When the user navigates to another URL, a full-page refresh is required and the server sends fresh new HTML to the new page. This is called server-side rendering.

However, in modern SPAs, client-side rendering is used instead. The browser loads the initial page from the server, along with the scripts (frameworks, libraries, app code) and stylesheets required for the whole app. When the user navigates to other pages, a page refresh is not triggered. The URL of the page is updated via the [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). New data required for the new page, usually in JSON format, is retrieved by the browser via [AJAX](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) requests to the server. The SPA then dynamically updates the page with the data via JavaScript, which it has already downloaded in the initial page load. This model is similar to how native mobile apps work.

The benefits:

*   The app feels more responsive and users do not see the flash between page navigations due to full-page refreshes.
*   Fewer HTTP requests are made to the server, as the same assets do not have to be downloaded again for each page load.
*   Clear separation of the concerns between the client and the server; you can easily build new clients for different platforms (e.g. mobile, chatbots, smart watches) without having to modify the server code. You can also modify the technology stack on the client and server independently, as long as the API contract is not broken.

The downsides:

*   Heavier initial page load due to the loading of framework, app code, and assets required for multiple pages.
*   There's an additional step to be done on your server which is to configure it to route all requests to a single entry point and allow client-side routing to take over from there.
*   SPAs are reliant on JavaScript to render content, but not all search engines execute JavaScript during crawling, and they may see empty content on your page. This inadvertently hurts the Search Engine Optimization (SEO) of your app. However, most of the time, when you are building apps, SEO is not the most important factor, as not all the content needs to be indexable by search engines. To overcome this, you can either server-side render your app or use services such as [Prerender](https://prerender.io/) to "render your javascript in a browser, save the static HTML, and return that to the crawlers".

###### References[​](#references-26 "Direct link to References")

*   [https://github.com/grab/front-end-guide#single-page-apps-spas](https://github.com/grab/front-end-guide#single-page-apps-spas)
*   [http://stackoverflow.com/questions/21862054/single-page-app-advantages-and-disadvantages](http://stackoverflow.com/questions/21862054/single-page-app-advantages-and-disadvantages)
*   [http://blog.isquaredsoftware.com/presentations/2016-10-revolution-of-web-dev/](http://blog.isquaredsoftware.com/presentations/2016-10-revolution-of-web-dev/)
*   [https://medium.freecodecamp.com/heres-why-client-side-rendering-won-46a349fadb52](https://medium.freecodecamp.com/heres-why-client-side-rendering-won-46a349fadb52)

### What is the extent of your experience with Promises and/or their polyfills?[​](#what-is-the-extent-of-your-experience-with-promises-andor-their-polyfills "Direct link to What is the extent of your experience with Promises and/or their polyfills?")

Possess working knowledge of it. A promise is an object that may produce a single value sometime in the future: either a resolved value or a reason that it's not resolved (e.g., a network error occurred). A promise may be in one of 3 possible states: fulfilled, rejected, or pending. Promise users can attach callbacks to handle the fulfilled value or the reason for rejection.

Some common polyfills are `$.deferred`, Q and Bluebird but not all of them comply with the specification. ES2015 supports Promises out of the box and polyfills are typically not needed these days.

###### References[​](#references-27 "Direct link to References")

*   [https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261)

### What are the pros and cons of using Promises instead of callbacks?[​](#what-are-the-pros-and-cons-of-using-promises-instead-of-callbacks "Direct link to What are the pros and cons of using Promises instead of callbacks?")

**Pros**

*   Avoid callback hell which can be unreadable.
*   Makes it easy to write sequential asynchronous code that is readable with `.then()`.
*   Makes it easy to write parallel asynchronous code with `Promise.all()`.
*   With promises, these scenarios which are present in callbacks-only coding, will not happen:
    *   Call the callback too early
    *   Call the callback too late (or never)
    *   Call the callback too few or too many times
    *   Fail to pass along any necessary environment/parameters
    *   Swallow any errors/exceptions that may happen

**Cons**

*   Slightly more complex code (debatable).
*   In older browsers where ES2015 is not supported, you need to load a polyfill in order to use it.

###### References[​](#references-28 "Direct link to References")

*   [https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md)

### What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript?[​](#what-are-some-of-the-advantagesdisadvantages-of-writing-javascript-code-in-a-language-that-compiles-to-javascript "Direct link to What are some of the advantages/disadvantages of writing JavaScript code in a language that compiles to JavaScript?")

Some examples of languages that compile to JavaScript include CoffeeScript, Elm, ClojureScript, PureScript, and TypeScript.

Advantages:

*   Fixes some of the longstanding problems in JavaScript and discourages JavaScript anti-patterns.
*   Enables you to write shorter code, by providing some syntactic sugar on top of JavaScript, which I think ES5 lacks, but ES2015 is awesome.
*   Static types are awesome (in the case of TypeScript) for large projects that need to be maintained over time.

Disadvantages:

*   Require a build/compile process as browsers only run JavaScript and your code will need to be compiled into JavaScript before being served to browsers.
*   Debugging can be a pain if your source maps do not map nicely to your pre-compiled source.
*   Most developers are not familiar with these languages and will need to learn it. There's a ramp up cost involved for your team if you use it for your projects.
*   Smaller community (depends on the language), which means resources, tutorials, libraries, and tooling would be harder to find.
*   IDE/editor support might be lacking.
*   These languages will always be behind the latest JavaScript standard.
*   Developers should be cognizant of what their code is being compiled to — because that is what would actually be running, and that is what matters in the end.

Practically, ES2015 has vastly improved JavaScript and made it much nicer to write. I don't really see the need for CoffeeScript these days.

###### References[​](#references-29 "Direct link to References")

*   [https://softwareengineering.stackexchange.com/questions/72569/what-are-the-pros-and-cons-of-coffeescript](https://softwareengineering.stackexchange.com/questions/72569/what-are-the-pros-and-cons-of-coffeescript)

### What tools and techniques do you use for debugging JavaScript code?[​](#what-tools-and-techniques-do-you-use-for-debugging-javascript-code "Direct link to What tools and techniques do you use for debugging JavaScript code?")

*   React and Redux
    *   [React Devtools](https://github.com/facebook/react-devtools)
    *   [Redux Devtools](https://github.com/gaearon/redux-devtools)
*   Vue
    *   [Vue Devtools](https://github.com/vuejs/vue-devtools)
*   JavaScript
    *   [Chrome Devtools](https://hackernoon.com/twelve-fancy-chrome-devtools-tips-dc1e39d10d9d)
    *   `debugger` statement
    *   Good old `console.log` debugging

###### References[​](#references-30 "Direct link to References")

*   [https://hackernoon.com/twelve-fancy-chrome-devtools-tips-dc1e39d10d9d](https://hackernoon.com/twelve-fancy-chrome-devtools-tips-dc1e39d10d9d)
*   [https://raygun.com/blog/javascript-debugging/](https://raygun.com/blog/javascript-debugging/)

### What language constructions do you use for iterating over object properties and array items?[​](#what-language-constructions-do-you-use-for-iterating-over-object-properties-and-array-items "Direct link to What language constructions do you use for iterating over object properties and array items?")

For objects:

*   `for-in` loops - `for (var property in obj) { console.log(property); }`. However, this will also iterate through its inherited properties, and you will add an `obj.hasOwnProperty(property)` check before using it.
*   `Object.keys()` - `Object.keys(obj).forEach(function (property) { ... })`. `Object.keys()` is a static method that will lists all enumerable properties of the object that you pass it.
*   `Object.getOwnPropertyNames()` - `Object.getOwnPropertyNames(obj).forEach(function (property) { ... })`. `Object.getOwnPropertyNames()` is a static method that will lists all enumerable and non-enumerable properties of the object that you pass it.

For arrays:

*   `for` loops - `for (var i = 0; i < arr.length; i++)`. The common pitfall here is that `var` is in the function scope and not the block scope and most of the time you would want block scoped iterator variable. ES2015 introduces `let` which has block scope and it is recommended to use that instead. So this becomes: `for (let i = 0; i < arr.length; i++)`.
*   `forEach` - `arr.forEach(function (el, index) { ... })`. This construct can be more convenient at times because you do not have to use the `index` if all you need is the array elements. There are also the `every` and `some` methods which will allow you to terminate the iteration early.
*   `for-of` loops - `for (let elem of arr) { ... }`. ES6 introduces a new loop, the `for-of` loop, that allows you to loop over objects that conform to the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) such as `String`, `Array`, `Map`, `Set`, etc. It combines the advantages of the `for` loop and the `forEach()` method. The advantage of the `for` loop is that you can break from it, and the advantage of `forEach()` is that it is more concise than the `for` loop because you don't need a counter variable. With the `for-of` loop, you get both the ability to break from a loop and a more concise syntax.

Most of the time, I would prefer the `.forEach` method, but it really depends on what you are trying to do. Before ES6, we used `for` loops when we needed to prematurely terminate the loop using `break`. But now with ES6, we can do that with `for-of` loops. I would use `for` loops when I need even more flexibility, such as incrementing the iterator more than once per loop.

Also, when using the `for-of` loop, if you need to access both the index and value of each array element, you can do so with the ES6 Array `entries()` method and destructuring:

```
for (let i = 1; i <= 100; i++) {  let f = i % 3 \=\= 0,    b = i % 5 \=\= 0;  console.log(f ? (b ? 'FizzBuzz' : 'Fizz') : b ? 'Buzz' : i);}
```

###### References[​](#references-31 "Direct link to References")

*   [http://2ality.com/2015/08/getting-started-es6.html#from-for-to-foreach-to-for-of](http://2ality.com/2015/08/getting-started-es6.html#from-for-to-foreach-to-for-of)
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)

### Explain the difference between mutable and immutable objects.[​](#explain-the-difference-between-mutable-and-immutable-objects "Direct link to Explain the difference between mutable and immutable objects.")

Immutability is a core principle in functional programming, and has lots to offer to object-oriented programs as well. A mutable object is an object whose state can be modified after it is created. An immutable object is an object whose state cannot be modified after it is created.

#### What is an example of an immutable object in JavaScript?[​](#what-is-an-example-of-an-immutable-object-in-javascript "Direct link to What is an example of an immutable object in JavaScript?")

In JavaScript, some built-in types (numbers, strings) are immutable, but custom objects are generally mutable.

Some built-in immutable JavaScript objects are `Math`, `Date`.

Here are a few ways to add/simulate immutability on plain JavaScript objects.

**Object Constant Properties**

By combining `writable: false` and `configurable: false`, you can essentially create a constant (cannot be changed, redefined or deleted) as an object property, like:

```
const arr = ['a', 'b', 'c'];for (let [index, elem] of arr.entries()) {  console.log(index, ': ', elem);}
```

**Prevent Extensions**

If you want to prevent an object from having new properties added to it, but otherwise leave the rest of the object's properties alone, call `Object.preventExtensions(...)`:

```
let myObject = {};Object.defineProperty(myObject, 'number', {  value: 42,  writable: false,  configurable: false,});console.log(myObject.number); // 42myObject.number = 43;console.log(myObject.number); // 42
```

In non-strict mode, the creation of `b` fails silently. In strict mode, it throws a `TypeError`.

**Seal**

`Object.seal()` creates a "sealed" object, which means it takes an existing object and essentially calls `Object.preventExtensions()` on it, but also marks all its existing properties as `configurable: false`.

So, not only can you not add any more properties, but you also cannot reconfigure or delete any existing properties (though you can still modify their values).

**Freeze**

`Object.freeze()` creates a frozen object, which means it takes an existing object and essentially calls `Object.seal()` on it, but it also marks all "data accessor" properties as writable:false, so that their values cannot be changed.

This approach is the highest level of immutability that you can attain for an object itself, as it prevents any changes to the object or to any of its direct properties (though, as mentioned above, the contents of any referenced other objects are unaffected).

```
var myObject = {  a: 2,};Object.preventExtensions(myObject);myObject.b = 3;myObject.b; // undefined
```

Freezing an object does not allow new properties to be added to an object and prevents from removing or altering the existing properties. `Object.freeze()` preserves the enumerability, configurability, writability and the prototype of the object. It returns the passed object and does not create a frozen copy.

#### What are the pros and cons of immutability?[​](#what-are-the-pros-and-cons-of-immutability "Direct link to What are the pros and cons of immutability?")

**Pros**

*   Easier change detection - Object equality can be determined in a performant and easy manner through referential equality. This is useful for comparing object differences in React and Redux.
*   Programs with immutable objects are less complicated to think about, since you don't need to worry about how an object may evolve over time.
*   Defensive copies are no longer necessary when immutable objects are returning from or passed to functions, since there is no possibility an immutable object will be modified by it.
*   Easy sharing via references - One copy of an object is just as good as another, so you can cache objects or reuse the same object multiple times.
*   Thread-safe - Immutable objects can be safely used between threads in a multi-threaded environment since there is no risk of them being modified in other concurrently running threads.
*   Using libraries like ImmutableJS, objects are modified using structural sharing and less memory is needed for having multiple objects with similar structures.

**Cons**

*   Naive implementations of immutable data structures and its operations can result in extremely poor performance because new objects are created each time. It is recommended to use libraries for efficient immutable data structures and operations that leverage on structural sharing.
*   Allocation (and deallocation) of many small objects rather than modifying existing ones can cause a performance impact. The complexity of either the allocator or the garbage collector usually depends on the number of objects on the heap.
*   Cyclic data structures such as graphs are difficult to build. If you have two objects which can't be modified after initialization, how can you get them to point to each other?

###### References[​](#references-32 "Direct link to References")

*   [https://stackoverflow.com/questions/1863515/pros-cons-of-immutability-vs-mutability](https://stackoverflow.com/questions/1863515/pros-cons-of-immutability-vs-mutability)

#### How can you achieve immutability in your own code?[​](#how-can-you-achieve-immutability-in-your-own-code "Direct link to How can you achieve immutability in your own code?")

One way to achieve immutability is to use libraries like [immutable.js](http://facebook.github.io/immutable-js/), [mori](https://github.com/swannodette/mori) or [immer](https://github.com/immerjs/immer).

The alternative is to use `const` declarations combined with the techniques mentioned above for creation. For "mutating" objects, use the spread operator, `Object.assign`, `Array.concat()`, etc., to create new objects instead of mutate the original object.

Examples:

```
var immutable = Object.freeze({});
```

###### References[​](#references-33 "Direct link to References")

*   [https://stackoverflow.com/questions/1863515/pros-cons-of-immutability-vs-mutability](https://stackoverflow.com/questions/1863515/pros-cons-of-immutability-vs-mutability)
*   [https://www.sitepoint.com/immutability-javascript/](https://www.sitepoint.com/immutability-javascript/)
*   [https://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/](https://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)

### Explain the difference between synchronous and asynchronous functions.[​](#explain-the-difference-between-synchronous-and-asynchronous-functions "Direct link to Explain the difference between synchronous and asynchronous functions.")

Synchronous functions are blocking while asynchronous functions are not. In synchronous functions, statements complete before the next statement is run. In this case, the program is evaluated exactly in order of the statements and execution of the program is paused if one of the statements take a very long time.

Asynchronous functions usually accept a callback as a parameter and execution continue on the next line immediately after the asynchronous function is invoked. The callback is only invoked when the asynchronous operation is complete and the call stack is empty. Heavy duty operations such as loading data from a web server or querying a database should be done asynchronously so that the main thread can continue executing other operations instead of blocking until that long operation to complete (in the case of browsers, the UI will freeze).

### What is event loop? What is the difference between call stack and task queue?[​](#what-is-event-loop-what-is-the-difference-between-call-stack-and-task-queue "Direct link to What is event loop? What is the difference between call stack and task queue?")

The event loop is a single-threaded loop that monitors the call stack and checks if there is any work to be done in the task queue. If the call stack is empty and there are callback functions in the task queue, a function is dequeued and pushed onto the call stack to be executed.

If you haven't already checked out Philip Robert's [talk on the Event Loop](https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html), you should. It is one of the most viewed videos on JavaScript.

###### References[​](#references-34 "Direct link to References")

*   [https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html](https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html)

### Explain the differences on the usage of `foo` between `function foo() {}` and `var foo = function() {}`[​](#explain-the-differences-on-the-usage-of-foo-between-function-foo--and-var-foo--function- "Direct link to explain-the-differences-on-the-usage-of-foo-between-function-foo--and-var-foo--function-")

The former is a function declaration while the latter is a function expression. The key difference is that function declarations have its body hoisted but the bodies of function expressions are not (they have the same hoisting behavior as variables). For more explanation on hoisting, refer to the question above [on hoisting](#explain-hoisting). If you try to invoke a function expression before it is defined, you will get an `Uncaught TypeError: XXX is not a function` error.

**Function Declaration**

```
// Array Exampleconst arr = [1, 2, 3];const newArr = [...arr, 4]; // [1, 2, 3, 4]// Object Exampleconst human = Object.freeze({race: 'human'});const john = {...human, name: 'John'}; // {race: "human", name: "John"}const alienJohn = {...john, race: 'alien'}; // {race: "alien", name: "John"}
```

**Function Expression**

```
foo(); // 'FOOOOO'function foo() {  console.log('FOOOOO');}
```

###### References[​](#references-35 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

### What are the differences between variables created using `let`, `var` or `const`?[​](#what-are-the-differences-between-variables-created-using-let-var-or-const "Direct link to what-are-the-differences-between-variables-created-using-let-var-or-const")

Variables declared using the `var` keyword are scoped to the function in which they are created, or if created outside of any function, to the global object. `let` and `const` are _block scoped_, meaning they are only accessible within the nearest set of curly braces (function, if-else block, or for-loop).

```
foo(); // Uncaught TypeError: foo is not a functionvar foo = function () {  console.log('FOOOOO');};
```

```
function foo() {  // All variables are accessible within functions.  var bar = 'bar';  let baz = 'baz';  const qux = 'qux';  console.log(bar); // bar  console.log(baz); // baz  console.log(qux); // qux}console.log(bar); // ReferenceError: bar is not definedconsole.log(baz); // ReferenceError: baz is not definedconsole.log(qux); // ReferenceError: qux is not defined
```

`var` allows variables to be hoisted, meaning they can be referenced in code before they are declared. `let` and `const` will not allow this, instead throwing an error.

```
if (true) {  var bar = 'bar';  let baz = 'baz';  const qux = 'qux';}// var declared variables are accessible anywhere in the function scope.console.log(bar); // bar// let and const defined variables are not accessible outside of the block they were defined in.console.log(baz); // ReferenceError: baz is not definedconsole.log(qux); // ReferenceError: qux is not defined
```

Redeclaring a variable with `var` will not throw an error, but `let` and `const` will.

```
console.log(foo); // undefinedvar foo = 'foo';console.log(baz); // ReferenceError: can't access lexical declaration 'baz' before initializationlet baz = 'baz';console.log(bar); // ReferenceError: can't access lexical declaration 'bar' before initializationconst bar = 'bar';
```

`let` and `const` differ in that `let` allows reassigning the variable's value while `const` does not.

```
var foo = 'foo';var foo = 'bar';console.log(foo); // "bar"let baz = 'baz';let baz = 'qux'; // Uncaught SyntaxError: Identifier 'baz' has already been declared
```

###### References[​](#references-36 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)

### What are the differences between ES6 class and ES5 function constructors?[​](#what-are-the-differences-between-es6-class-and-es5-function-constructors "Direct link to What are the differences between ES6 class and ES5 function constructors?")

Let's first look at example of each:

```
// This is fine.let foo = 'foo';foo = 'bar';// This causes an exception.const baz = 'baz';baz = 'qux';
```

For simple constructors, they look pretty similar.

The main difference in the constructor comes when using inheritance. If we want to create a `Student` class that subclasses `Person` and add a `studentId` field, this is what we have to do in addition to the above.

```
// ES5 Function Constructorfunction Person(name) {  this.name = name;}// ES6 Classclass Person {  constructor(name) {    this.name = name;  }}
```

It's much more verbose to use inheritance in ES5 and the ES6 version is easier to understand and remember.

###### References[​](#references-37 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)
*   [https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5](https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5)

### Can you offer a use case for the new arrow => function syntax? How does this new syntax differ from other functions?[​](#can-you-offer-a-use-case-for-the-new-arrow--function-syntax-how-does-this-new-syntax-differ-from-other-functions "Direct link to Can you offer a use case for the new arrow => function syntax? How does this new syntax differ from other functions?")

One obvious benefit of arrow functions is to simplify the syntax needed to create functions, without a need for the `function` keyword. The `this` within arrow functions is also bound to the enclosing scope which is different compared to regular functions where the `this` is determined by the object calling it. Lexically-scoped `this` is useful when invoking callbacks especially in React components.

### What advantage is there for using the arrow syntax for a method in a constructor?[​](#what-advantage-is-there-for-using-the-arrow-syntax-for-a-method-in-a-constructor "Direct link to What advantage is there for using the arrow syntax for a method in a constructor?")

The main advantage of using an arrow function as a method inside a constructor is that the value of `this` gets set at the time of the function creation and can't change after that. So, when the constructor is used to create a new object, `this` will always refer to that object. For example, let's say we have a `Person` constructor that takes a first name as an argument has two methods to `console.log` that name, one as a regular function and one as an arrow function:

```
// ES5 Function Constructorfunction Student(name, studentId) {  // Call constructor of superclass to initialize superclass-derived members.  Person.call(this, name);  // Initialize subclass's own members.  this.studentId = studentId;}Student.prototype = Object.create(Person.prototype);Student.prototype.constructor = Student;// ES6 Classclass Student extends Person {  constructor(name, studentId) {    super(name);    this.studentId = studentId;  }}
```

The main takeaway here is that `this` can be changed for a normal function, but the context always stays the same for an arrow function. So even if you are passing around your arrow function to different parts of your application, you wouldn't have to worry about the context changing.

This can be particularly helpful in React class components. If you define a class method for something such as a click handler using a normal function, and then you pass that click handler down into a child component as a prop, you will need to also bind `this` in the constructor of the parent component. If you instead use an arrow function, there is no need to also bind "this", as the method will automatically get its "this" value from its enclosing lexical context. (See this article for an excellent demonstration and sample code: [https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb](https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb))

###### References[​](#references-38 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
*   [https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb](https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb)

### What is the definition of a higher-order function?[​](#what-is-the-definition-of-a-higher-order-function "Direct link to What is the definition of a higher-order function?")

A higher-order function is any function that takes one or more functions as arguments, which it uses to operate on some data, and/or returns a function as a result. Higher-order functions are meant to abstract some operation that is performed repeatedly. The classic example of this is `map`, which takes an array and a function as arguments. `map` then uses this function to transform each item in the array, returning a new array with the transformed data. Other popular examples in JavaScript are `forEach`, `filter`, and `reduce`. A higher-order function doesn't just need to be manipulating arrays as there are many use cases for returning a function from another function. `Function.prototype.bind` is one such example in JavaScript.

**Map**

Let say we have an array of names which we need to transform each string to uppercase.

```
const Person = function (firstName) {  this.firstName = firstName;  this.sayName1 = function () {    console.log(this.firstName);  };  this.sayName2 = () => {    console.log(this.firstName);  };};const john = new Person('John');const dave = new Person('Dave');john.sayName1(); // Johnjohn.sayName2(); // John// The regular function can have its 'this' value changed, but the arrow function cannotjohn.sayName1.call(dave); // Dave (because "this" is now the dave object)john.sayName2.call(dave); // Johnjohn.sayName1.apply(dave); // Dave (because 'this' is now the dave object)john.sayName2.apply(dave); // Johnjohn.sayName1.bind(dave)(); // Dave (because 'this' is now the dave object)john.sayName2.bind(dave)(); // Johnvar sayNameFromWindow1 = john.sayName1;sayNameFromWindow1(); // undefined (because 'this' is now the window object)var sayNameFromWindow2 = john.sayName2;sayNameFromWindow2(); // John
```

The imperative way will be as such:

```
const names = ['irish', 'daisy', 'anna'];
```

Use `.map(transformerFn)` makes the code shorter and more declarative.

```
const transformNamesToUppercase = function (names) {  const results = [];  for (let i = 0; i < names.length; i++) {    results.push(names[i].toUpperCase());  }  return results;};transformNamesToUppercase(names); // ['IRISH', 'DAISY', 'ANNA']
```

###### References[​](#references-39 "Direct link to References")

*   [https://medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99](https://medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99)
*   [https://hackernoon.com/effective-functional-javascript-first-class-and-higher-order-functions-713fde8df50a](https://hackernoon.com/effective-functional-javascript-first-class-and-higher-order-functions-713fde8df50a)
*   [https://eloquentjavascript.net/05_higher_order.html](https://eloquentjavascript.net/05_higher_order.html)

### Can you give an example for destructuring an object or an array?[​](#can-you-give-an-example-for-destructuring-an-object-or-an-array "Direct link to Can you give an example for destructuring an object or an array?")

Destructuring is an expression available in ES6 which enables a succinct and convenient way to extract values of Objects or Arrays and place them into distinct variables.

**Array destructuring**

```
const transformNamesToUppercase = function (names) {  return names.map((name) => name.toUpperCase());};transformNamesToUppercase(names); // ['IRISH', 'DAISY', 'ANNA']
```

```
// Variable assignment.const foo = ['one', 'two', 'three'];const [one, two, three] = foo;console.log(one); // "one"console.log(two); // "two"console.log(three); // "three"
```

**Object destructuring**

```
// Swapping variableslet a = 1;let b = 3;[a, b] = [b, a];console.log(a); // 3console.log(b); // 1
```

###### References[​](#references-40 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
*   [https://ponyfoo.com/articles/es6-destructuring-in-depth](https://ponyfoo.com/articles/es6-destructuring-in-depth)

### ES6 Template Literals offer a lot of flexibility in generating strings, can you give an example?[​](#es6-template-literals-offer-a-lot-of-flexibility-in-generating-strings-can-you-give-an-example "Direct link to ES6 Template Literals offer a lot of flexibility in generating strings, can you give an example?")

Template literals help make it simple to do string interpolation, or to include variables in a string. Before ES2015, it was common to do something like this:

```
// Variable assignment.const o = {p: 42, q: true};const {p, q} = o;console.log(p); // 42console.log(q); // true
```

With template literals, you can now create that same output like this instead:

```
var person = {name: 'Tyler', age: 28};console.log(  'Hi, my name is ' + person.name + ' and I am ' + person.age + ' years old!',);// 'Hi, my name is Tyler and I am 28 years old!'
```

Note that you use backticks, not quotes, to indicate that you are using a template literal and that you can insert expressions inside the `${}` placeholders.

A second helpful use case is in creating multi-line strings. Before ES2015, you could create a multi-line string like this:

```
const person = {name: 'Tyler', age: 28};console.log(`Hi, my name is ${person.name} and I am ${person.age} years old!`);// 'Hi, my name is Tyler and I am 28 years old!'
```

Or if you wanted to break it up into multiple lines in your code so you didn't have to scroll to the right in your text editor to read a long string, you could also write it like this:

```
console.log('This is line one.\nThis is line two.');// This is line one.// This is line two.
```

Template literals, however, preserve whatever spacing you add to them. For example, to create that same multi-line output that we created above, you can simply do:

```
console.log('This is line one.\n' + 'This is line two.');// This is line one.// This is line two.
```

Another use case of template literals would be to use as a substitute for templating libraries for simple variable interpolations:

```
console.log(`This is line one.This is line two.`);// This is line one.// This is line two.
```

**Note that your code may be susceptible to XSS by using `.innerHTML`. Sanitize your data before displaying it if it came from a user!**

###### References[​](#references-41 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

### Can you give an example of a curry function and why this syntax offers an advantage?[​](#can-you-give-an-example-of-a-curry-function-and-why-this-syntax-offers-an-advantage "Direct link to Can you give an example of a curry function and why this syntax offers an advantage?")

Currying is a pattern where a function with more than one parameter is broken into multiple functions that, when called in series, will accumulate all of the required parameters one at a time. This technique can be useful for making code written in a functional style easier to read and compose. It's important to note that for a function to be curried, it needs to start out as one function, then broken out into a sequence of functions that each accepts one parameter.

```
const person = {name: 'Tyler', age: 28};document.body.innerHTML = `  <div>    <p>Name: ${person.name}</p>    <p>Age: ${person.age}</p>  </div>`;
```

###### References[​](#references-42 "Direct link to References")

*   [https://hackernoon.com/currying-in-js-d9ddc64f162e](https://hackernoon.com/currying-in-js-d9ddc64f162e)

### What are the benefits of using spread syntax and how is it different from rest syntax?[​](#what-are-the-benefits-of-using-spread-syntax-and-how-is-it-different-from-rest-syntax "Direct link to What are the benefits of using spread syntax and how is it different from rest syntax?")

ES6's spread syntax is very useful when coding in a functional paradigm as we can easily create copies of arrays or objects without resorting to `Object.create`, `slice`, or a library function. This language feature is used often in Redux and RxJS projects.

```
function curry(fn) {  if (fn.length \=\== 0) {    return fn;  }  function _curried(depth, args) {    return function (newArgument) {      if (depth - 1 \=\== 0) {        return fn(...args, newArgument);      }      return _curried(depth - 1, [...args, newArgument]);    };  }  return _curried(fn.length, []);}function add(a, b) {  return a + b;}var curriedAdd = curry(add);var addFive = curriedAdd(5);var result = [0, 1, 2, 3, 4, 5].map(addFive); // [5, 6, 7, 8, 9, 10]
```

ES6's rest syntax offers a shorthand for including an arbitrary number of arguments to be passed to a function. It is like an inverse of the spread syntax, taking data and stuffing it into an array rather than unpacking an array of data, and it works in function arguments, as well as in array and object destructuring assignments.

```
function putDookieInAnyArray(arr) {  return [...arr, 'dookie'];}const result = putDookieInAnyArray(['I', 'really', "don't", 'like']); // ["I", "really", "don't", "like", "dookie"]const person = {  name: 'Todd',  age: 29,};const copyOfTodd = {...person};
```

###### References[​](#references-43 "Direct link to References")

*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
*   [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

This depends on the JavaScript environment.

On the client (browser environment), as long as the variables/functions are declared in the global scope (`window`), all scripts can refer to them. Alternatively, adopt the Asynchronous Module Definition (AMD) via RequireJS for a more modular approach.

On the server (Node.js), the common way has been to use CommonJS. Each file is treated as a module and it can export variables and functions by attaching them to the `module.exports` object.

ES2015 defines a module syntax which aims to replace both AMD and CommonJS. This will eventually be supported in both browser and Node environments.

###### References[​](#references-44 "Direct link to References")

*   [http://requirejs.org/docs/whyamd.html](http://requirejs.org/docs/whyamd.html)
*   [https://nodejs.org/docs/latest/api/modules.html](https://nodejs.org/docs/latest/api/modules.html)
*   [http://2ality.com/2014/09/es6-modules-final.html](http://2ality.com/2014/09/es6-modules-final.html)

### Why you might want to create static class members?[​](#why-you-might-want-to-create-static-class-members "Direct link to Why you might want to create static class members?")

Static class members (properties/methods) are not tied to a specific instance of a class and have the same value regardless of which instance is referring to it. Static properties are typically configuration variables and static methods are usually pure utility functions which do not depend on the state of the instance.

###### References[​](#references-45 "Direct link to References")

*   [https://stackoverflow.com/questions/21155438/when-to-use-static-variables-methods-and-when-to-use-instance-variables-methods](https://stackoverflow.com/questions/21155438/when-to-use-static-variables-methods-and-when-to-use-instance-variables-methods)

### Other Answers[​](#other-answers "Direct link to Other Answers")

*   [http://flowerszhong.github.io/2013/11/20/javascript-questions.html](http://flowerszhong.github.io/2013/11/20/javascript-questions.html)