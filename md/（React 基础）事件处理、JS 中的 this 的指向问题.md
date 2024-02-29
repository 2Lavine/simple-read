> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7126104839049707557)

一、事件绑定
======

React 事件绑定语法与 DOM 事件语法相似

*   语法：on + 事件名称 = 事件处理函数，比如
    *   onClick = function(){}
    *   onClick = {() => {}}
*   注意：React 事件采用驼峰命名法
*   **类组件中绑定事件函数 要用 this，代表指向当前的类的引用，函数组件不需要调用 this**
*   从 JSX 中抽取事件处理函数：尽量将逻辑抽离到单独的方法中，保证 JSX 结构清晰

```
import React from 'react'
import ReactDOM from 'react-dom'

// class App extends React.Component {
//   handleClick(e) {
//     console.log('11')
//   }
//   render() {
//     return (
//       <button onClick={this.handleClick}>点击按钮</button>
//     )
//   }
// }

// 函数组件绑定事件：不用this
function App() {
  function handleClick() {
    console.log('2')
  }
  return (
    <button onClick={handleClick}>按钮</button>
    /*不能写成 onClick={handleClick()}，这是将该函数的返回值赋给了onClick
        该函数没有return语句时，会报undefined */
  )
}
```

二、事件对象
======

**发生事件的元素正好是需要操作的元素时，使用事件对象（尽量避免使用 ref）**：如果要拿到并操作的 DOM 元素，有触发什么事件，则可以用事件对象获取到该 DOM 元素，代替 ref 的使用

*   通过事件处理函数的参数`e`获取到事件对象
*   React 中的事件对象叫做：合成事件；它兼容所有浏览器，无需担心跨浏览器兼容问题。除了兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 `stopPropagation()`和 `preventDefault()`
*   触发事件的 DOM 元素，可以通过 `e.target` 属性来进行获取
*   原生事件对象，可以通过 `e.nativeEvent` 属性来进行获取

```
class App extends React.Component {
  handleClick(e) {
      // 事件对象
      console.log(e)
     // 获取原生事件对象
    console.log(e.nativeEvent)
    
    // 阻止浏览器的默认跳转链接行为
    e.preventDefault()
  }
  render() {
    return (
      <a href="http:" onClick={this.handleClick}>111</a>
    )
  }
}
```

```
showData2 = (e)=>{
    //<input type="text" placeholder="失去焦点提示数据"/>
    console.log('input这个元素：',e.target); 
    alert(e.target.value);
}

render(){
    return(
        <div>
            <input onBlur={this.showData2} type="text" placeholder="失去焦点提示数据"/>
        </div>
    )
}
```

三、JS 中的 this 的指向
================

报错：无法读取属性 setState，因为 this 是 undefined。

```
class Demo extends Component {
    state = {
        count: 0
    }
    //在类中的定义的一般方法（自定义方法），是放在Demo类的原型对象上的普通函数
    handleClick() {
        this.setState({count: this.state.count+1}) //这里的this报错
    }
    render(){
        return(
            <>
              {this.state.count}
              <button onClick={this.handleClick}>按钮</button> //这里的this不报错
            </>
        )
    }
}
```

1. React 类组件 render() 里的 this
-----------------------------

指向组件实例对象

`this.handleClick = Demo组件实例.handleClick` 所以不报错

2. 函数中的 this 指向
---------------

一般定义的函数，其中的 this 是指向该函数的调用者的。

通过`this.handleClick`顺利访问到了组件实例对象的 handleClick 这个函数，但是`onClick={this.handleClick}`是将 handleClick 这个函数作为了 onClick 事件的回调函数使用。

而回调函数执行时，本质上是由主函数直接调用它的，所以回调函数是没有调用者的，因此 handleClick 里的 this 会报 undefined。

> js 中，函数如果找不到调用者，最后就会在顶层对象中调用，也就是 this 会指向 window 对象，但由于类中的一般方法（除了构造器之外的方法）会默认开启局部的严格模式，所以当前方法（函数）的作用域内，不允许 this 指向 window。
> 
> 所以函数里的 this 报 undefined。

```
function demo() {
//在函数体里局部开启严格模式
    'use strict'
    console.log(this) //undefined
}
demo()
```

就算不开启严格模式，找不到函数的调用者时，函数里的 this 指向 window，也会报错。因为 window 里不存在 setState 方法，setState() 是在组件实例对象里的。

### 解决方法之一：使用箭头函数

箭头函数里的 this 指向：箭头函数没有自己的 this 指针，会继承外层作用域的 this 指向

**写法 1：将一般方法写成 赋值语句 + 箭头函数**

```
class Demo extends Component {
    state = {
        count: 0
    }
    
    //在类中可以直接写赋值语句。相当于给Demo的实例对象添加了a属性，值为1
    a = 1
    
    //错误，类不同于函数体，不能随便写语句
    //console.log(this)
    
    //把方法写成赋值语句，handleClick就成了实例自身的一个属性，不在Demo的原型对象（打印Demo.prototype可以查看）上了
    //给属性handleClick的值 赋箭头函数
    handleClick = () => {
        console.log('箭头函数的this继承外层作用域的this，会发现外层作用域处的this 确实是实例对象',this)
        this.setState({count: this.state.count+1})
    }
    
    render(){
        console.log('render里的this是实例对象',this)
        return(
            <>
              {this.state.count}
              <button onClick={this.handleClick}>按钮</button>
            </>
        )
    }
}
```

此时，箭头函数 handleClick 的外层作用域里的 this 指向的是组件实例，那么 handleClick 里的 this 也指向组件实例，setState 是在实例对象上的，所以正常。

**写法 2：**

```
class Demo extends Component {
    state = {
        count: 0
    }
    handleClick() {
        this.setState({count: this.state.count+1})
    }
    render(){
        return(
            <>
              {this.state.count}
              <button onClick={() => this.handleClick()}>按钮</button>
            </>
        )
    }
}
```

将`() => this.handleClick()}`整体作为 onClick 事件触发时的回调函数来调用，这里的 this 在箭头函数里。

此时箭头函数外层作用域的 this 为 render 方法里的 this，而 render 里的 this 指的是组件实例，所以箭头函数里的 this 也指向了组件实例，即`Demo组件实例.handleClick`，顺利访问到了定义的 handleClick 函数。

而 handleClick 里的 this 是谁调用该函数 就指谁，组件实例调用了 handleClick 函数，所以 handleClick 中的 this 也指向了组件实例，可以正常调用实例对象上的 setState。

3. 构造函数里的 this
--------------

指向其生成的实例对象

[（JS 基础）构造函数与原型、类与对象](https://juejin.cn/post/7131377331574145061 "https://juejin.cn/post/7131377331574145061")

4. 类中的 this
-----------

构造器 constructor 中的 this：指向该类生成的实例对象。

一般方法中的 this：指向调用了该方法调用者。如果是实例对象调用了该方法，则 this 指向该实例对象（注意使用了 call、bind 这些调用的情况

[p15](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1wy4y1D7JT%3Fp%3D15%26spm_id_from%3DpageDriver%26vd_source%3Df8f48a8c2ef47acb550b9a5d9db4a6bd "https://www.bilibili.com/video/BV1wy4y1D7JT?p=15&spm_id_from=pageDriver&vd_source=f8f48a8c2ef47acb550b9a5d9db4a6bd")

四、事件绑定 this 指向的方法
=================

1. 使用箭头函数
---------

见上述。

2. 利用 bind 方法
-------------

利用 ES5 中的 bind 方法，将事件处理程序中的 this 与组件实例绑定到一起

**注意：construct 里面的 this 指向当前组件实例**

### 写法 1：在构造函数内部声明 this 指向

```
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      count: 0
    }
    
    this.demo = this.onIncrement.bind(this)
  }

  // 事件处理程序
  onIncrement() {
    console.log('事件处理程序中的this：', this)
    //bind()把onIncrement函数里的this，指向了组件实例，所以能正常访问setState方法，因为setState()是在组件实例对象里的
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        <h1>计数器：{ this.state.count }</h1>
        <button onClick={this.demo}>+1</button> 
        {/* this在上面已经绑定后，返回的函数不管再以什么方式调用，this都会指向绑定好的this，即组件实例 */}
      </div>
    )
  }
}
```

> bind 的作用：生成一个新的函数、修改函数里的 this 指向
> 
> bind() 里的第一个参数：函数里的 this 指向要改成的目标

`this.demo = this.onIncrement.bind(this)`

等号右边：

*   第一个 this：组件实例对象
    
*   this.onIncrement：找到组件类 App 的原型对象上的 onIncrement
    
*   () 里传入的 this：组件实例对象
    

**即：找到原型对象上的 onIncrement，调用 bind 生成了一个 内部的 this 指向的是组件实例对象 的新函数**

等号左边：

this：组件实例对象

赋给 this.demo：把新的函数挂在了实例对象自身的 demo 属性上

[p16](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1wy4y1D7JT%3Fp%3D16%26spm_id_from%3DpageDriver%26vd_source%3Df8f48a8c2ef47acb550b9a5d9db4a6bd "https://www.bilibili.com/video/BV1wy4y1D7JT?p=16&spm_id_from=pageDriver&vd_source=f8f48a8c2ef47acb550b9a5d9db4a6bd")

### 写法 2：在行间定义事件后面 使用 bind 绑定 this

```
class Demo extends Component{
    state = {
        count: 0
    }
    handleClick() {
        this.setState({count: this.state.count+1})
    }
    render(){
        return(
            <>
              {this.state.count}
              <button onClick={this.handleClick.bind(this)}>按钮</button>
            </>
        )
    }
}
```

**bind 方法还可以接收参数：**

```
class App extends React.Component {
  handleClick(a, b, e) {
    console.log(this);// 正常
    console.log(a, b, e);// "1"，"2",事件对象e
  }
  render() {
    return <>
      <div onClick={this.handleClick.bind(this, "1", "2")} >点我</div>
    </>
  }
}
```

**给事件对象添加自定义属性：**

```
class App extends React.Component {
  handleClick(e) {
    console.log(this);// 正常
    console.log(e.target.dataset.msg);// 
  }
  render() {
    return <>
      <div data-msg="法三枪每首都好听" onClick={this.handleClick.bind(this)} >点我</div>
    </>
  }
}
```

五、回调函数
======

把函数 A 作为参数 供主函数调用，则把 A 叫做回调函数。

当主函数里面的事情干完，再回头去执行当做参数传进去的回调函数 A。

[JS 回调函数中的 this 指向](https://link.juejin.cn?target=https%3A%2F%2Fcloud.tencent.com%2Fdeveloper%2Farticle%2F1537087 "https://cloud.tencent.com/developer/article/1537087")

```
//定义主函数，回调函数作为参数
function B(callback) {
    callback();
    console.log('我是主函数');
}

//定义回调函数
function A() {
    setTimeout("console.log('我是回调函数')",2000);//即使此时时间设置为0，也会先输出主函数
}

//调用主函数，将B传进去
B(A);
```

1. JS 的执行机制：
------------

*   先执行 执行栈里面的同步任务
*   异步任务（回调函数）放入任务队列中
*   同步任务结束，依次执行异步任务，把异步任务放入执行栈开始执行

2. 常见的回调函数：
-----------

*   dom 事件回调函数（如点击按钮事件的函数）
*   定时器
*   ajax 请求
*   生命周期回调函数

3. 回调函数里的 this 指向问题：
--------------------

因为回调函数本质上是由主函数调用它的，所以回调函数没有调用者，函数如果找不到调用者，最后就会在顶层对象中调用，也就是说 回调函数里的 this 会指向 window 对象。

如果使用了严格模式，不允许 this 指向 window 对象，会报 undefined。

**解决办法：** 用箭头函数来写回调函数