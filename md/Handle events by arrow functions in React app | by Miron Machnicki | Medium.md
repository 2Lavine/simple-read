> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [machnicki.medium.com](https://machnicki.medium.com/handle-events-in-react-with-arrow-functions-ede88184bbb)

> I like using ESLint and JSCS with Airbnb preset, so code needs to be strict. Sometimes this is painfu......

[

![](https://miro.medium.com/v2/resize:fill:88:88/1*7aYrcppGUIZMNgY3AqCoNw.jpeg)

](https://machnicki.medium.com/?source=post_page-----ede88184bbb--------------------------------)

I like using **ESLint and JSCS with Airbnb preset**, so code needs to be strict. Sometimes this is painful, but I definitely agree, that this kind of work keeps code more cleaner and helps cooperate with programmers, which very often have different coding styles.

If you don’t use ESLint, lets try and install also Airbnb package: [https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

Event handlers in React
-----------------------

If you work on component in React you probably need to create some custom events, callback functions. Popular convention in React is to name handler method similar as

```
handleChange() {...}
```

when your component looks similar as

```
render() {
   return(<MyInput onChange={...} />)
}
```

and you want to handle onChange callback. Now all what you need is to pass your method into _onChange_ property. Simply _onChange={this.handleChange}_ won’t work because you need to bind **this** value from function to our class (each function creates own environment).

We could use some tricks, as assignment **that = this** or use **lodash** method _.bind(), but thankfully most of browser support native **.bind()** method.

So finally your code should look like this:

```
render() {
   return(<MyInput onChange={ this.handleChange.bind(this) } />)
}
```

Binding methods in property is anti-pattern
-------------------------------------------

It works, so everything should be fine, but what will happen if you would like to use _handleChange_ method in another components in the same class?

```
render() {
   return(
     <MyInput onChange={ this.handleChange.bind(this) } />
     <MyAnotherInput onChange={ this.handleChange.bind(this) } />
   )
}
```

Not really cool, because you need to add binding twice. Another problem is ESLint with Airbnb configuration -> it won’t agree to bind your methods in props.

Thanks to ES6 class notation we have solution for this problem. We can bind our event handlers in **class constructor**:

```
class MyClass extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
}
```

Looks fine. When we add more event handlers to our class, code should look similar to this:

This is, what we can do with **Babel** compiler with **es2015** as preset configuration.

Event handlers with arrow functions
-----------------------------------

As you have probably seen, when we create event handler method, we always need to add this to constructor, to bind _this_. Quite tiresome. To be honest, there is no sense to create **constructor** method only for binding your methods. There should be another solution, and there is.

All what you need is to install **stage-1 Babel preset** and use **arrow functions**. If you don’t know, how to do this, go to Babel documentation, it’s very good.

Arrow functions in props
------------------------

Nice documentation of arrows functions is in MDN: [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions). In our case instead of binding methods to **this** we can writ something like this:

```
render() {
   return(<MyInput onChange={ (e) => this.handleOnChange(e) } />)
}
```

We have created new anonymous function, which automatically bind **this**, that’s why we don’t need to use .bind() method. We have still the same methods in class, and new arrow functions as wrappers in callbacks properties.

This is still not perfect solution, because we need to update parameters in arrow function wrappers and we create new instances each time when render method is triggered. Arrow functions in React properties are also not great idea.

Arrow function as method
------------------------

What we need to to, is to instead of standard method notation

```
handleChange(e) {...}
```

use arrow function expression.:

```
handleChange = (e) => {...}
```

Body of our method will be the same, but we don’t need to change context of **this** in callbacks and create wrappers.

This is, how should look our example code:

Sometimes when we iterate through data in array, we want to pass information about item in array to events handler. Callback of component event knows nothing about parent item, so simple

```
<MyInput onKeyPress={ this.handleKeyPress } />
```

won’t work, because _onKeyPress_ return only _event_ object as a parameter.

We need to create scope for events handler which will contain information about item from the list. Popular pattern in JS is to create function which will return another function, which will use argument/value from parent (**partial application**):

Now instead of passing method into property, we need to trigger this method. This will return events handler with item information in scope:

```
<MyInput onKeyPress={ this.handleKeyPress(...) } />
```

_handleKeyPress_ returns function which is **closure** (because it uses variable from another scope). So finally we pass into _MyInput onKeyPress property_ function which have access to _item_ variable (it exists in parent scope created by _handleKeyPress_).

Prepend new argument by .bind
-----------------------------

Similar as in first example we can do work in much easier way. Again very helpful is native **.bind()** implementation. As you see in [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind), .bind() method can get some attributes — first one is about binding **this**, others _to prepend to arguments provided to the bound function when invoking the target function_.

Let’s change before example and use .bind to prepend argument to our events handler:

First argument in _handleKeyPress_ comes from binding methods in onKeyPress property. Second argument (e) is the one, which is returned by component event -> before binding method it was our first argument.

As I have mentioned before, binding to **this** is not very good idea in React classes. We don’t want to repeat ourselves, so we can use arrow function, which will automatically bind **this** value.

If we don’t want to bind **this**, and just prepend new arguments, we need to pass **undefined** as the first argument of **.bind()** method:

Partial application with arrow functions
----------------------------------------

Finally we don’t need to use **.bind()** method at all. We use **arrow functions,** so we can pass handler in this way:

```
<MyInput onKeyPress={ (e) => handleKeyPress(item, e) } />
```

Creating arrow function in JSX property is not good pattern, so instead we can use similar pattern as mentioned before and return function by another function. Thanks to arrow functions it takes us less effort:

```
handleKeyPress = (item) => (e) => {...}
```

When we run handleKeyPress(item) method, we get new anonymous function, which first parameter is _e_, and which has reference to _item_ from parent function scope.

The final code should look similar like this:

Now we don’t need to bind methods. We also don’t need to create new function in JSX property, so code should be valid with **ESLint**.

Static context vs. dynamic context
----------------------------------

If you bind normal function, you can rebind it later, so the context is dynamic. In case of arrow function you cannot change this context, it’s static.