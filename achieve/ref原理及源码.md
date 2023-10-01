## 学习目标

- 为什么 React 不将 ref 存在 fiber 的 props 中，这样在组件中就能通过 props.ref 获取到值
- ref 的值什么时候设置，什么时候被释放？

## React element 中的 ref 属性

React.createElement 对 ref 属性进行特殊处理
ref 属性和 key 属性一样都是比较特殊的，不会被添加到 props 中
我们知道在构建时，JSX 经过 babel 编译为一系列 React.createElement，比如下面的代码

```jsx
<div ref={this.domRef} id="counter" name="test">
  dom ref
</div>
```

经过 babel 编译，变成下面的函数调用

```js
React.createElement(
  "div",
  {
    ref: this.domRef,
    id: "counter",
    name: "test",
  },
  "dom ref"
);
```
接着我们具体看一下createElement函数

createElement
---
React.createElement 最终返回的是一个 react element 对象
他会判断config是否为null，如果不为null，则检查config中是否存在ref和key属性，并将其分别赋值给ref和key变量。
因此ref 和 key 都是直接添加到 fiber 的属性当中的。**为什么 React 不将 ref 存储在 props 中？**
```js
function createElement(type, config, children) {
  var propName;

  var props = {};
  var key = null;
  var ref = null;

  if (config != null) {
    if (config.ref) {
      ref = config.ref;
    }

    if (config.key) {
      key = "" + config.key;
    }

    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(type, key, ref, ReactCurrentOwner.current, props);
}

var ReactElement = function (type, key, ref, owner, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };
};
var RESERVED_PROPS = {
  key: true,
  ref: true,
};
```



## ref 对象

我们在使用 ref，必须显示的调用 React.createRef 或者 React.useRef 方法创建一个 ref 对象（回调 ref 不需要调用这两个方法）
这两个函数都比较简单，都是用于创建 ref 对象，比如：
```js
function createRef() {
  return {
    current: null,
  };
}
// 在函数组件初次渲染阶段，useRef就是mountRef
function mountRef(initialValue) {
  var hook = mountWorkInProgressHook();
  var ref = {
    current: initialValue,
  };

  hook.memoizedState = ref;
  return ref;
}

// 在函数组件更新阶段，useRef就是updateRef
function updateRef(initialValue) {
  var hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```


---
为什么 React 要采用对象保存 ref？这是因为对象是引用类型，方便存值，比如下面的例子中，我们给 div 传递了 ref 属性

```jsx
<div ref={this.domRef} id="counter" name="test">
  dom ref
</div>
```
this.domRef 是一个对象：
```js
this.domRef = { current };
```
在render阶段，当React为一个div创建fiber节点时，它会将该div的ref属性赋值给fiber节点的ref属性。这是通过fiber.ref = this.domRef来完成的，其中this.domRef是div的ref属性。

在commit阶段，React会将fiber节点的ref属性赋值给fiber.ref.current，这个current属性存储了与fiber节点相关联的DOM实例。这样，当commit阶段完成后，我们就可以通过this.domRef.current来访问到对应的DOM节点。

## fiber ref 属性是什么时候设置的？

**fiber ref 属性就是在协调阶段设置的**。
- 在 render 阶段，React会为当前的fiber协调子元素，即将当前fiber节点的子节点和新的子element节点比较，以创建新的workInProgress节点。
- 在协调时，会将element上的ref属性赋值给fiber ref属性。

前面说过，React.createElement 在创建 react element 对象时，会将 ref 单独放在 element 对象的属性中，而不是放在 element.props 属性中，element 对象属性如下所示：

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props: { id: "counter", name: "test", children: "dom ref：0", onClick },
  ref: { current: null },
  type: "div",
};
```

在 render 阶段，React 会为当前的 fiber 协调子元素，即将当前 fiber 节点的子节点和新的子 element 节点比较，以创建新的 workInProgress 节点。
在协调时，会将 element 上的 ref 属性赋值给 fiber ref 属性，


---
以下面的例子为例：

```jsx
<div id="container">
  <div ref={this.domRef} id="counter" name="test">
    dom ref
  </div>
</div>
```

在 beginWork 阶段，`div#container` 执行 reconcileChildren 工作，为 `div#counter` 创建子 fiber 节点，然后给新的 `div#counter` fiber 节点设置 ref 属性。伪代码如下：

```js
// returnFiber即 div#container，element即是新的div#counter对应的react element对象
// currentFirstChild是returnFiber的第一个子节点
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  if (!currentFirstChild) {
    // 第一次渲染
    var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);
    _created4.ref = element.ref;
    _created4.return = returnFiber;
    return _created4;
  } else {
    var _existing3 = useFiber(child, element.props);
    _existing3.ref = element.ref;
    _existing3.return = returnFiber;
    return _existing3;
  }
}
```

从上面的代码可以看出，在 reconcile 阶段，无论是第一次渲染还是更新阶段，都会使用 element.ref 重新赋值给新的 fiber。区别在于，第一次渲染时，会调用 createFiberFromElement 创建新的 fiber 节点，而在更新阶段，会调用 useFiber 复用旧的 fiber 节点。

**因此，fiber ref 属性是在父节点的 reconcile 阶段被设置的**

## fiber ref 副作用标记

render 阶段如果满足下面两个条件之一，会为 fiber 节点添加一个 Ref 副作用标记：
- 第一次渲染，并且 ref 有值，即 current === null && ref !== null
- 更新阶段，即第二次或者后续的渲染中，如果 ref 发生了变化，即 current !== null && current.ref !== workInProgress.ref


### markRef
下面是 HTML 元素和类组件的场景
从下面的代码可以看出，不管是类组件还是 HTML 元素的 fiber，在为他们调用 reconcileChildren 协调子元素之前，都会调用 markRef 判断是否为它们添加 Ref 副作用
```js
function beginWork(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case ClassComponent: {
      return updateClassComponent(current, workInProgress);
    }
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
  }
}
function updateClassComponent(current, workInProgress) {
  //....
  var nextUnitOfWork = finishClassComponent(current, workInProgress);
  return nextUnitOfWork;
}

function finishClassComponent(current, workInProgress) {
  // 即使是shouldComponentUpdate返回了false，Ref也要更新
  markRef(current, workInProgress);
  //...
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  //...
  return workInProgress.child;
}
function updateHostComponent(current, workInProgress, renderLanes) {
  //...
  markRef(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
function markRef(current, workInProgress) {
  var ref = workInProgress.ref;

  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // 添加一个 Ref 副作用（effect）
    workInProgress.flags |= Ref;
  }
}
```



