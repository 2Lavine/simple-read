> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7038780686991376415?searchId=20240126153450902039BAB3C63517BA67)

轻量级状态管理方案
---------
我们知道，redux 不仅是一个状态管理工具，其同时也提倡一种优秀的模式，即我们熟知的：
> Store -> Dispatch -> Action -> Reducer -> Store

而这种模式需要我们手写大量的模板代码，
- 有了官方解决方案 **@reduxjs/toolkit** 和社区方案 **@rematch/core**
- 经过分析，事实上我们可以看到 redux 的核心代码库仅有 **1.6kb** 的大小，但为了适配 React.js 和解决模板代码的问题，至少也要增加 **7.1kb** 的资源大小

在移动端场景下，项目一般较为简单、规模较小，对于工具的核心需求其实也仅仅是满足应用状态管理即可。于是，**zustand** 社区方案成为了我的一个选择。
　　
还列出了 jotai，它与 zustand 出自同一个开发者群体之手，前者仅适用于 React.js 组件内的状态管理，而后者还适用于组件之外的状态操作。**zustand** 足够简单，且无需太多模板代码，仅 **954B** 大小即可满足应用状态管理的核心需求。

redux vs zustand
----------------
分析一下两者的源码实现，第一步首先来看看两者的核心实现，即状态管理的机制。
## 状态管理做的是什么事情
状态即数据
对于一个原生的 Web 应用来说，某一时刻页面展示的结构和样式取决于此时的状
态
状态可能会由于用户交互动作发生变化。
- Web 应用有很多状态，比如表单的勾选按钮状态，我们
	- 将这种状态视为局部状态，该状态的变化不会导致页面其它部分发生变化；
- 更进一步，勾选按钮的状态会同步影响表单提交按钮是否处于可点击的状态，
	- 此时一个状态在页面两个部分都有影响，
	- 显然，对于局部状态来说，页面局部可以完成自治，而对于全局状态来说，则需要一个全局中心化的 “数据库” 来进行管理。
## redux 和 zustand 

```js
// Redux (https://redux.js.org/api/api-reference)
createStore(reducer, [preloadedState], [enhancer])
// Store
getState()
subscribe(listener)
dispatch(action)


// zustand (https://github.com/pmndrs/zustand)
createStore()
// Store
getState()
subscribe()
setState()// zustand (github.com/pmndrs/zust…)
createStore()
// Store
getState()
subscribe()
setState()
```

　两者都有一个 `createStore()` API 来创建一个中心化的数据存储区，
　- 同时创建的 store 实例均会暴露出主动获取状态的 API `getState()`
　- 订阅状态更新的 API `subscribe()`，
　- 更新状态的 API `dispatch()` 和 `setState()`，
　- 当然 redux 还引入了一个 `reducer` 的概念和 API。
### zustand subscribe()
　　在状态订阅的 `subscribe()` API 实现中
　　- zustand 仅是简单的直接将订阅函数添加到订阅列表中，
　　- 同时提供了一个 `selector` 机制来过滤状态：
```js
const subscribe: Subscribe<TState> = <StateSlice>(
  listener: StateListener<TState> | StateSliceListener<StateSlice>,
  selector?: StateSelector<TState, StateSlice>,
  equalityFn?: EqualityChecker<StateSlice>
) => {
  if (selector || equalityFn) {
    return subscribeWithSelector(
      listener as StateSliceListener<StateSlice>,
      selector,
      equalityFn
    )
  }
  listeners.add(listener as StateListener<TState>)
  // Unsubscribe
  return () => listeners.delete(listener as StateListener<TState>)
}


const subscribeWithSelector = <StateSlice>(
  listener: StateSliceListener<StateSlice>,
    selector: StateSelector<TState, StateSlice> = getState as any,
    equalityFn: EqualityChecker<StateSlice> = Object.is
) => {
        console.warn('[DEPRECATED] Please use subscribeWithSelector middleware')
let currentSlice: StateSlice = selector(state)
      function listenerToAdd() {
const nextSlice = selector(state)
      if (!equalityFn(currentSlice, nextSlice)) {
const previousSlice = currentSlice
      listener((currentSlice = nextSlice), previousSlice)
}
}
      listeners.add(listenerToAdd)
// Unsubscribe
return () => listeners.delete(listenerToAdd)
}// see https://github.com/pmndrs/zustand/blob/v3.6.5/src/vanilla.ts#L107
const subscribeWithSelector = <StateSlice>(
        listener: StateSliceListener<StateSlice>,
          selector: StateSelector<TState, StateSlice> = getState as any,
          equalityFn: EqualityChecker<StateSlice> = Object.is
) => {
              console.warn('[DEPRECATED] Please use subscribeWithSelector middleware')
let currentSlice: StateSlice = selector(state)
            function listenerToAdd() {
const nextSlice = selector(state)
            if (!equalityFn(currentSlice, nextSlice)) {
const previousSlice = currentSlice
            listener((currentSlice = nextSlice), previousSlice)
}
}
            listeners.add(listenerToAdd)
// Unsubscribe
return () => listeners.delete(listenerToAdd)
}
```

通过上面 `listenerToAdd()` 函数可以看到，在订阅状态时提供了 `selector` 的话，状态更新时会首先将状态过滤一遍再通知给订阅者。
```js
const setState: SetState<TState> = (partial, replace) => {
    listeners.forEach((listener) => listener(state, previousState))
}
```
通过 `setState()` 更新状态时，所有订阅函数将会调用，同时会将新的状态和旧的状态传递给订阅函数。

## redux 订阅函数
接下来，看看 redux 的实现，redux 在添加订阅函数时做了一些特殊的判断，以及特殊处理：
```js
// see https://github.com/reduxjs/redux/blob/v4.1.2/src/createStore.js#L128
function subscribe(listener) {
  // ...
  if (isDispatching) {
    throw new Error("...");
  }
  let isSubscribed = true;
  ensureCanMutateNextListeners();
  nextListeners.push(listener);

  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }

    if (isDispatching) {
      throw new Error(<span class="hljs-string">'...'</span>);
    }
    isSubscribed = false;
    ensureCanMutateNextListeners();
    const index = nextListeners.indexOf(listener);
    nextListeners.splice(index, <span class="hljs-number">1</span>);
    currentListeners = null;
  };
}

// see https://github.com/reduxjs/redux/blob/v4.1.2/src/createStore.js#L82
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice();
  }
} // see https://github.com/reduxjs/redux/blob/v4.1.2/src/createStore.js#L82
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice();
  }
}
```
根据实现，redux 通过 `isDispatching` 标志位避免在状态更新期间添加订阅函数，以及通过 `ensureCanMutateNextListeners()` 函数将订阅函数列表做了浅拷贝再进行添加和删除操作，这都是对潜在的问题的规避。

```
function dispatch(action) {
  const listeners = (currentListeners = nextListeners);
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    listener();
  }
  return action;
}
```

redux 通过 `dispatch()` 更新状态时，由于在订阅时没有默认提供 `selector` 机制，所以会无差别的通知所有订阅者，同时也不会将新旧状态传递给订阅函数，当然在官方示例代码中可以看到，官方推荐在订阅函数中主动通过 `getState()` 获取新的状态以及完成 selector 操作。可以说，由于 redux 和 zustand 设计理念不同，订阅的实现方式也略有差别，前者控制的更细致，而灵活性很高，而后者在保持简单性的同时也没有牺牲灵活性。

### zustand的setState()函数 && dispatch()
状态更新机制是两者实现最大的不同，zustand 提供一个 `setState()` 函数来更新状态：
```ts
const setState: SetState<TState> = (partial, replace) => {
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: TState) => TState)(state)
        : partial
    if (nextState !== state) {
      const previousState = state
      state = replace
        ? (nextState as TState)
        : Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, previousState))
    }
  }
```

根据源码实现来看，zustand 通过 `Object.assign` 函数合并更新状态，同时提供 `replace` 标志位直接将旧状态完全替换。

## Redux 的状态更新函数
 redux 的状态更新则要复杂一些，
 - 官方推荐将状态更新拆分为多个步骤，
	 - `dispatch()` 函数触发一个 `Action`，
	 - 具体处理 Action 以及状态合并的操作均由 `Reducer` 函数完成，
		 - 该函数是一个纯函数。
 为什么要这么设计
 - 纯函数对于状态变化来说是可预测的，而且利于测试，更是实现时间旅行类似功能的基础。

```js
function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error();
    }
    if (typeof action.type === "undefined") {
      throw new Error();
    }
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }
  
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
  
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  
    return action;
  }
  
```

　　根据源码实现来看，这里出现了 `isDispatching` 标志位，主要是用来限制状态更新过程中不能再次发起状态更新操作，避免出现错误。

　　不过，有一点值得提一下，redux 默认不支持异步更新状态，需要借助 redux-thunk 库来支持；而 zustand 本身则是支持异步更新状态的。

　　根据以上分析来看，实际上核心实现是相似的，而且 zustand 作为后来者，对 redux 有借鉴也有简化的地方，满足状态管理的核心简单需求是没有多大问题的，可作为 redux 的一个替代方案。

### React.js 适配

如果说，核心库差异较小，而且包尺寸相近的话，那么最大的差异则出现在对 React.js 库的适配上面。
\ zustand 在对其适配的时候也是以 Hook API 的方式实现，没有提供类组件的适配。
zustand 将 `createStore` 函数的返回值作为一个自定义 hook 来实现，其中为了让 React.js 组件能感知到状态更新，是利用 `useEffect` 来完成订阅操作，而状态更新发布后，则通过 `forceUpdate()` 来强制组件进行 rerender 以获取最新的状态。

然而，react-redux 的实现则要复杂的多。由于其出现的较早，所以同时适配了类组件和函数组件。这里不再细究 react-redux 的具体实现，但其与 zustand 最大的差异则在于把状态放在了 `Context` 中存储，所以需要使用 `Provider` 将页面的根组件包裹起来才能使用。redux 的 `useSelector()` Hook API 与 zustand 上面提到的 `useStore()` 的实现逻辑也非常相似。