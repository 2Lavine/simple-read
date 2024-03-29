> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7218942994467389498)

面试题 用hooks实现componentWillMount
一、Class Component 时代的生命周期
=========================
先来回顾一下 `class component` 的生命周期。
 *   `componentWillReceiveProps()` 在 `v16.4` 已经被标记为不建议使用，官方建议使用新的`getDerivedStateFromProps()`方法代替。
 *   还有一个细微的更新是： `setState` 和 `forceUpdate` 的调用也会触发 `getDerivedStateFromProps`。

React class 组件在其生命周期中经历三个阶段：**挂载**、**更新**和**卸载**。
1.  **挂载阶段**是在创建新组件并将其插入 DOM 时，或者换句话说，在组件生命周期开始时。这只会发生一次，通常称为 “初始渲染”。
2.  **更新阶段**是组件更新或重新渲染的时候。当道具更新或状态更新时，会触发此反应。这个阶段可以发生多次，这就是 React 的意义所在。
3.  组件生命周期的最后一个阶段是**卸载阶段**，当组件从 DOM 中移除时。
以下是每个生命周期函数的详细描述和执行时机：

1、挂载阶段
------
这个阶段发生在组件被创建并插入到 DOM 中的时候。按照上图，
这个阶段会执行这几个钩子函数：
- `constructor`
- `static getDerivedStateFromProps`
- `componentWillMount/UNSAVE_componentWillMount`
- `render`
- `componentDidMount`。

### constructor()
构造函数，在组件创建时调用，用于初始化状态和绑定方法。
### static getDerivedStateFromProps()
需要注意的是: `props` 和 `state` 是完全不同的概念，一个成熟的 React 开发者最基本的是要知道组件的数据从哪里来，要往哪里去。
顾名思义，`getDerivedStateFromProps` 的字面意思就是：从 `props` 获取 `衍生state`。
在许多情况下，你的组件的 `state` 实际上是其 `props` 的衍生品。
这个方法允许你用 `任何props值` 来修改 `state 值`。

这个方法在组件挂载前调用，并且在组件每次更新时也会被调用。
它的作用是根据 `props` 的改变来更新 `state`，返回一个 `新的state`。
如果不需要更新 `state`，返回 `null` 即可。
### componentWillMount/UNSAVE_componentWillMount
这个生命周期函数在 `render` 之前调用，在此生命周期中使用 `setState` 不会触发额外渲染，因为你不可能在创建的时候把数据渲染出来。
只能在 `componentDidMount` 中使用 `setState` 把数据塞回去，通过更新界面来展示数据。
所以一般建议把网络请求的逻辑放在 `componentDidMount`，而不是 `componentWillMount` 中。
### render()

`render()` 方法是唯一必须的钩子函数，它在 `getDerivedStateFromProps` 方法之后被调用，用于渲染组件的 UI。

> 注意：不要在 `render()` 方法中改变 `state`，否则会陷入死循环，导致程序崩溃。
### componentDidMount()

`componentDidMount` 是在挂载阶段调用的最后一个生命周期方法，组件被挂载后调用，这个方法可以用于发起网络请求或者设置定时器等异步操作。
它可能在组件被渲染或挂载到 DOM 之后被调用。

这个方法中，你可以添加副作用，如发送网络请求或更新组件的状态，`componentDidMount` 中还可以订阅 `Redux store`。你也可以立即调用 `this.setState` 方法；但这将导致重新渲染，因为它启动了更新阶段，因为状态已经改变。
所以，你需要小心使用 `componentDidMount`，因为它可能导致不必要的重新渲染。

2、更新阶段
------
当组件的 `props 或 state` 改变时，组件会被重新渲染，此时就会进入到更新阶段。
这个阶段会执行这几个钩子函数：
`static getDerivedFromProps`
`shouldComponentUpdate`
`render`
`getSnapshotBeforeUpdate` 
`componentDidUpdate`。

### static getDerivedStateFromProps()
在更新阶段，第一个调用的生命周期方法是 `getDerivedStateFromProps`。
在组件更新前被调用，和挂载阶段的作用相同，但是尽量不要在这个方法中执行副作用操作，因为这个方法会在每次更新时都被调用。
> 例如，一个组件的状态可能取决于其 `props` 的值。通过 `getDerivedStateFromProps`，在组件被重新渲染之前，它的 `state` 可以反映这些变化，并且可以显示在新更新的组件中。
### shouldComponentUpdate()
`shouldComponentUpdate` 是专门用于性能优化的， 通常来说，只有 `props` 或 `state` 变化时才需要再重新渲染。这个方法接受两个参数：nextProps 和 nextState，可以用于控制组件是否需要重新渲染，如果返回 false，组件将不会重新渲染，默认返回 true。
> 注意，当调用 `forceUpdate()` 时，`shouldComponentUpdate` 方法被忽略。
### render()
`render()` 方法会根据 `最新的props和state` 来重新渲染组件的 UI，在挂载阶段已经说明，这里就不赘述了。
### getSnapshotBeforeUpdate
`getSnapshotBeforeUpdate` 方法让你可以访问组件更新前的 `props` 和 `state`。
这使你能够处理或检查 `props` 和 `state` 的先前值。这是一个很少使用的方法。
> 例如，这个方法的一个很好的使用场景是处理 `聊天APP` 中的滚动位置。当用户在查看旧的信息时有一条新的信息进来，它不应该把旧的信息推到视野之外。

`getSnapshotBeforeUpdate` 在渲染方法之后，组件 `DidUpdate` 之前被调用。
如果 `getSnapshotBeforeUpdate` 方法返回任何东西，它将被传递给 `componentDidUpdate` 方法作为参数：
### componentDidUpdate()
`componentDidUpdate` 方法是在更新阶段调用的最后一个生命周期方法。
组件更新后被调用，可以用于处理 `DOM的更新` 或者 `发起网络请求` 等异步操作。
这个方法最多可以接受三个参数：`prevProps`、`prevState` 和 `snapshot`（如果你调用了 `getSnapshotBeforeUpdate` 方法）。
下面是一个使用 `componentDidUpdate` 方法来实现自动保存功能的例子：
- 要在render()之后，因为可能涉及后端操作，需要大量时间

![](_resources/eaf55d94c7dd4226b033b96e64679b82~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

3、卸载阶段
------
当组件从 DOM 中移除时，就会进入到卸载阶段。
卸载阶段只涉及一个生命周期方法：`componentWillUnmount`。
### componentWillUnmount()
组件被卸载时调用，可以用于清除定时器、取消网络请求等操作。一旦这个方法执行完毕，该组件将被销毁。

下面是一个使用 `componentWillUnmount` 的例子：

![](_resources/7f366eeff1b54f79a9cd2868e917a813~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

二、React Hooks 时代的生命周期
=====================
3、实际的 “生命周期”
------------
绘制下图中这样一个比较容易理解的流程：

![](_resources/f66af51668554669a52ebcb2281c5e6b~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)
正如上图中看到的，挂载阶段按照下面的顺序执行：
1.  首先 react 运行 （[惰性初始化程序](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fhooks-reference.html%23lazy-initial-state "https://reactjs.org/docs/hooks-reference.html#lazy-initial-state")）
2.  第一次渲染
3.  React 更新 DOM
4.  运行 `LayoutEffects`
5.  浏览器绘制屏幕
6.  运行 `Effects`
### 更新

在每次更新时，React 都会从由 state 或 props 变化引起的重新渲染开始。现在就没有惰性的初始化调用了。

1.  `render`
2.  React 更新 DOM
3.  清除 `LayoutEffects`
4.  运行 `LayoutEffects`
5.  浏览器绘制屏幕
6.  清理 `Effects`
7.  运行 `Effects`

> 注意，在渲染之后，React 清理了 `LayoutEffects`，使其紧接着运行。浏览器然后绘制屏幕，之后 React 清理 `Effects` 并紧接着运行它。

挂载和更新之间的主要区别是：
*   惰性初始化仅在挂载时
*   挂载阶段不存在清理工作
### 卸载

在卸载期间，React 清理所有效果：
1.  清理 `LayoutEffects`
2.  清理 `Effects`

4、React Hooks 的执行时机
-------------------
执行顺序
- useState
- useMemo
- render
- useLayoutEffect
- effect

三、实现 componentWillMount
=======================

在类组件中，`componentWillMount` 被认为是 `legacy` 的（“遗留的”），就是要被干掉的。因为它可能会运行不止一次，而且有一个替代方法 —— `constructor`。

1、基于 useState 的实现
-----------------

![](_resources/de1a8b1fcc7c4e81afd252e11ad66f37~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

使用：

![](_resources/333bb2cbf9e04809a94c310f878824d3~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

2、基于 useMemo 实现
---------------

还可以使用 `useMemo` 来实现：
> 是因为 `useMemo` 不需要实际返回一个值，你也不需要实际使用它，但是因为它根据依赖关系缓存了一个值，而这个依赖关系只运行一次（在依赖为 "[]" 的情况下），而且当组件挂载时，它在其他东西之前运行一次。
> 
> 但不建议这么做：这可能会使用当前实现，[React 文档特别说明不要这样操作](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fhooks-reference.html%23usememo "https://reactjs.org/docs/hooks-reference.html#usememo")。你应该将 `useMemo` 作为性能优化的工具，而不是作为语义保证。

![](_resources/23a771dbed144e368f347d737bfeafb3~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

3、基于 useRef 实现
--------------
`useRef` 是在函数组件初始渲染之前就会执行，而且它的值改变不会触发重渲染。

![](_resources/19f098756da9430e917296e34f130702~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

甚至，我们还可以用来防止 `useEffect` 在挂载的时候执行：

![](_resources/582947b6cbd342c9962b7df7f76cc0e9~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)

4、基于 useLayoutEffect 实现
-----------------------

`useLayoutEffect` 在第二个依赖值为空的情况下可以实现跟 `componentWillMount` 相似的作用。`useLayoutEffect` 会在第一次页面挂载之前运行第一个函数里的回调。虽然实际上有两个更新，但在绘制到屏幕之前它们是同步的。

![](_resources/aa86ea59d6f14a47bdc8447236a2fb36~tplv-k3u1fbpfcp-zoom-in-crop-mark!1512!0!0!0.awebp.webp)
