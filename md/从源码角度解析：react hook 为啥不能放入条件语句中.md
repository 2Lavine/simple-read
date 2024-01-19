> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7279325329118625853?searchId=2024011909074637716191FEDA6F0DC2CF)

在我们刚开始学习 react 时，react 官方文档就提示我们`react hook`必须在函数组件顶层使用，不能在条件语句或者循环结构中使用。

之所以会有这样的规定，这和`react hook`的实现原理脱离不了关系。

本文就从源码的角度，帮助大家快速理解其中的原理。

> 虽然是以源码角度来解析，但本文并不会展示过多的源码，旨在于尽量简洁的说明其中的道理。

### 1，hooks 的加载

首先准备一个函数组件案例：

```
export default function MyFun(props) {
  // hook加载
  const [count, setCount] = useState(1)
  useEffect(() => {
    console.log('useEffect DOM渲染之后执行')
  }, [])
  function handleClick() {
    setCount(2)
  }
  return (
    <div className='MyFun'>
      <div>MyFun组件</div>
      <div>state: {count}</div>
      <button onClick={handleClick}>更新</button>
    </div>
  )
}
```

我们都知道在 react 应用中，函数组件加载的一个重点就是：会调用一次我们定义的函数，也就是案例中的`MyFun`。

而在函数调用的过程中，就会遇到我们定义的`hooks`，react 内部就会开始执行`hooks`的加载处理。

当然首先我们得知道，react 组件的加载处于`Fiber Reconciler`协调流程之中，这个流程的主要作用就是创建`FiberTree`【虚拟 DOM 树】，`Fiber`即 react 中的虚拟 DOM，每一个函数组件都会创建与之对应的`Fiber`节点，对于`Fiber`节点你只需要理解为一个`JS`对象，它有很多属性存储着与组件相关的信息，而与`hook`相关的部分内容就存储在`fiber.memoizedState`属性之中。

每一个`hook`在首次加载时，都会执行一个`mountWorkInProgressHook`方法：

比如`useState`加载时：

```
function mountState(initialState) {
    const hook = mountWorkInProgressHook();
    ...
}
```

这个方法内部会为我们在组件中定义的`hook`创建一个对应的`hook`对象：

```
// hook对象
const hook: Hook = {
  memoizedState: null,
  baseState: null,
  baseQueue: null,
  queue: null,
  next: null, // 指向下一个hook对象
};
```

这个`hook`对象的属性存储着我们组件中对应`hook`的相关信息，但是在这里我们只需要关心它的`next`属性即可：

在加载第一个`hook`即`useState`时，就会将第一个`hook`对象直接赋值给当前函数组件对应的`Fiber`节点的`memoizedState`属性。

```
fiber.memoizedState = hook;
```

所以此时函数组件`Fiber`节点的`memoizedState`属性指向为：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f19ddad1625c4f2ca16e70228fe6b704~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1229&h=190&s=15115&e=png&b=fdfdfd)

加载第二个`hook`即`useEffect`时，就会将上一个`hook`的`next`属性指向当前新建的`hook`对象。

所以此时函数组件`Fiber`节点的`memoizedState`属性指向为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d808cafeefb944109a6e63203cdaf440~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1256&h=193&s=19037&e=png&b=fdfdfd)

```
useState => hook1
useEffect => hook2
```

在函数组件在加载完成后，`fiber.memoizedState`属性形成了一个这样的单向链表。

### 2，hooks 的更新

来到函数组件的更新过程：函数组件的更新同样会调用一次`MyFun`，在这个过程中 react 内部就会开始执行`hooks`的更新处理。

同理每一个`hook`在更新时，都会执行一个`updateWorkInProgressHook`方法：

```
function updateState(initialState) {
    const hook = updateWorkInProgressHook();
    ...
}
```

**重点来了：** `updateWorkInProgressHook`方法内部会引用`current.memoizedState`属性的内容。

> 函数组件更新时，`current`代表旧的节点内容，其实就是新旧虚拟 DOM 概念，`current`变成了旧的虚拟 DOM。

所以`hook`更新时会引用**函数组件加载阶段**就已形成的`hook`链表，会按照这个链表顺序来取出对应的原`hook`对象，利用原`hook`信息生成新的`hook`对象参与计算或者更新。

这里取出顺序为：首先从`current.memoizedState`取出第一个`hook`对象，后面就是从 hook 对象的`next`属性依次取出下一个更新的 hook 对象，`hooks`的更新就可以按照顺序复用上一次的相关信息。

`hooks`的更新会按照函数组件加载阶段就已经固定的`hook`链表顺序，这就是`hook`必须置于函数组件顶层使用的**根本原因**。

如果我们将`hook`置于条件或者循环之中，在更新阶段就会出现无法与原来的`hook`链表相匹配的问题，将会导致渲染出现异常。

比如我们在条件语句之中新增一个`hook`：

```
export default function MyFun(props) {
  const [count, setCount] = useState(1)
  // 新增一个hook
  if (count === 2) {
    const [status, setStatus] = useState(false)
  }
  useEffect(() => {
    console.log('useEffect DOM渲染之后执行')
  }, [])
  function handleClick() {
    setCount(2)
  }
  return (
    <div className='MyFun'>
      <div>MyFun组件</div>
      <div>state: {count}</div>
      <button onClick={handleClick}>更新</button>
    </div>
  )
}
```

此时我们设置`count === 2`时才会执行新增的`hook`，`count`默认为`1`，所以在函数组件加载阶段时不会触发新增的`hook`。即函数加载阶段形成的`hook`链表中只有两个`hook`对象，但是当我们一点击更新按钮，变量条件得到满足，组件更新时就会出现三个`hook`，导致新增的`useState`复用了原来的第二个`useEffect`的`hook`对象信息，这必然会导致渲染出错。即使新增的 hook 为`useEffect`，也同样会导致渲染出错，因为在第三个`hook`更新时，找不到`hook`链表对应的 hook 对象，此时 react 同样会抛出错误：

```
if (nextCurrentHook === null) {
  throw new Error('Rendered more hooks than during the previous render.');
}
```

如果我们设置`count === 1`就执行新增的`hook`，则函数组件在加载阶段就会向我们发出一个`error`提示：

```
React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render
```

> 循环结构也一样的道理，循环的次数变了或者循环结构中有条件语句，都是相同的原理。

### 结束语

本文从源码的角度，以尽量简洁的语句向大家解释了`react hook`必须于函数组件顶层使用的原因，想了解`FiberTree`创建过程或者函数组件具体的加载过程可以阅读本系列的其他文章。