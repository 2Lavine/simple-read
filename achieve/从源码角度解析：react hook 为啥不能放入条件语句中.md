> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7279325329118625853?searchId=2024011909074637716191FEDA6F0DC2CF)

`react hook`必须在函数组件顶层使用，不能在条件语句或者循环结构中使用。
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
当然首先我们得知道，react 组件的加载处于`Fiber Reconciler`协调流程之中，
- 这个流程的主要作用就是创建`FiberTree`【虚拟 DOM 树】，
- 与`hook`相关的部分内容就存储在`fiber.memoizedState`属性之中。
- 每一个`hook`在首次加载时，都会执行一个`mountWorkInProgressHook`方法：


## mountWorkInProgressHook`
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

### 2，hooks 的更新 updateWorkInProgressHook
来到函数组件的更新过程：函数组件的更新同样会调用一次`MyFun`，在这个过程中 react 内部就会开始执行`hooks`的更新处理。
同理每一个`hook`在更新时，都会执行一个`updateWorkInProgressHook`方法：

```
function updateState(initialState) {
    const hook = updateWorkInProgressHook();
    ...
}
```

**重点：** `updateWorkInProgressHook`方法内部会引用`current.memoizedState`属性的内容。
- 函数组件更新时，`current`代表旧的节点内容
- 所以`hook`更新时会引用**函数组件加载阶段**就已形成的`hook`链表，会按照这个链表顺序来取出对应的原`hook`对象，利用原`hook`信息生成新的`hook`对象参与计算或者更新。
- `hooks`的更新会按照函数组件加载阶段就已经固定的`hook`链表顺序，这就是`hook`必须置于函数组件顶层使用的**根本原因**。
- 如果我们将`hook`置于条件或者循环之中，在更新阶段就会出现无法与原来的`hook`链表相匹配的问题，将会导致渲染出现异常。
