## ref.current 属性赋值

在 render 阶段，会调用 markRef 为 fiber 节点添加 Ref 副作用。
在 commit 阶段，React 会判断 fiber 是否具有 Ref 副作用，如果有，则为 fiber.ref 设置 current 值。

###  Ref 操作有关的阶段
在[深入概述 React 初次渲染及状态更新主流程](https://raw.githubusercontent.com/lizuncong/mini-react/master/docs/render/%E6%B7%B1%E5%85%A5%E6%A6%82%E8%BF%B0%20React%E5%88%9D%E6%AC%A1%E6%B8%B2%E6%9F%93%E5%8F%8A%E7%8A%B6%E6%80%81%E6%9B%B4%E6%96%B0%E4%B8%BB%E6%B5%81%E7%A8%8B.md)中介绍过，commit 分为三个小阶段：
- commitBeforeMutationEffects
- commitMutationEffects
- commitLayoutEffects
与 Ref 操作有关的阶段只有`commitMutationEffects`以及`commitLayoutEffects`
```js
function commitRootImpl(root, renderPriorityLevel) {
  //...
  commitBeforeMutationEffects();
  //...
  commitMutationEffects(root, renderPriorityLevel);
  //...
  commitLayoutEffects(root, lanes);
  //...
}
```
### commitMutationEffects：重置 ref 为 null

`commitMutationEffects`主要是执行节点的增删改操作，
在执行这些操作之前，会先调用 commitDetachRef 重置 ref。
然后根据 flag 执行不同的操作
```js
function commitMutationEffects(root, renderPriorityLevel) {
  while (nextEffect !== null) {
    var flags = nextEffect.flags;
    if (flags & Ref) {
      var current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
    var primaryFlags = flags & (Placement | Update | Deletion | Hydrating);
    switch (primaryFlags) {
      case Deletion: {
        commitDeletion(root, nextEffect);
        break;
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
### commitDeletion操作
这里，删除节点（commitDeletion）的操作比较特殊，
commitDeletion 最终会调用 commitUnmount 卸载节点
在 commitUnmount 中会调用 safelyDetachRef 小心的重置 ref 为 null

```js
function commitUnmount(finishedRoot, current, renderPriorityLevel) {
  onCommitUnmount(current);
  switch (current.tag) {
    case ClassComponent: {
      safelyDetachRef(current);
      var instance = current.stateNode;
      if (typeof instance.componentWillUnmount === "function") {
        safelyCallComponentWillUnmount(current, instance);
      }
      return;
    }
    case HostComponent: {
      safelyDetachRef(current);
      return;
    }
  }
}
```


### safelyDetachRef
现在版本用的是 safelyDetachRef
```jsx
function commitDetachRef(current) {
  var currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === "function") {
      currentRef(null);
    } else {
      currentRef.current = null;
    }
  }
}

function safelyDetachRef(current) {
  var ref = current.ref;
  if (ref !== null) {
    if (typeof ref === "function") {
      try {
        ref(null);
      } catch (refError) {
        captureCommitPhaseError(current, refError);
      }
    } else {
      ref.current = null;
    }
  }
}
```


### commitLayoutEffects：为 ref 设置新值

commitLayoutEffects 会判断 fiber 是否具有 Ref 副作用，
如果有，则调用 commitAttachRef 设置 ref 的新值

```js
function commitLayoutEffects(root, committedLanes) {
  while (nextEffect !== null) {
    var flags = nextEffect.flags;
    if (flags & Ref) {
      commitAttachRef(nextEffect);
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
commitAttachRef
---
commitAttachRef 主要就是设置 ref 的值，
这里会判断 ref 属性是否是函数，如果是函数，则执行。否则直接设置 ref.current 属性

```js
function commitAttachRef(finishedWork) {
  var ref = finishedWork.ref;
  if (ref !== null) {
    var instance = finishedWork.stateNode;
    if (typeof ref === "function") {
      ref(instance);
    } else {
      ref.current = instance;
    }
  }
}
```

## useImperativeHandle

### useImperativeHandle   render 阶段
在 render 阶段，执行函数调用 useImperativeHandle 时，React 会为 forwardRef 创建一个 imperativeHandle 类型的 Effect 对象，并添加到 updateQueue 队列中，如下：

```js
function imperativeHandleEffect(create, ref) {
  if (typeof ref === "function") {
    var refCallback = ref;

    var _inst = create();

    refCallback(_inst);
    return function () {
      // 注意这里会返回一个函数!!!
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    var refObject = ref;

    var _inst2 = create();

    refObject.current = _inst2;
    return function () {
      refObject.current = null;
    };
  }
}
const imperativeEffect = {
  create: imperativeHandleEffect,
  deps: null,
  destroy: undefined,
  next: null,
  tag: 3,
};
imperativeEffect.next = imperativeEffect;

fiber.updateQueue = {
  lastEffect: imperativeEffect,
};
```


#### useImperativeHandle例子
以下面的代码为例：
```jsx
const FunctionCounter = (props, ref) => {
  const createInst = () => ({
    focus: () => {
      console.log("focus...");
    },
  });
  useImperativeHandle(ref, createInst);
  return <div>{`计数器：${props.count}`}</div>;
};

const ForwardRefCounter = React.forwardRef(FunctionCounter);
```

`imperativeHandleEffect(create, ref)`中的
第一个参数`create`对应中的第二个参数`createInst`。
第二个参数`ref`对应第一个参数`ref

>注意，这里我们用 React.forwardRef 包裹 FunctionCounter，React 会为 forwardRef 创建一个 fiber 节点，但不会为 FunctionCounter 创建一个 fiber 节点。因此 render 阶段执行的工作是针对 forwardRef 类型的 fiber 节点

### commitLayoutEffects 阶段：设置 ref.current 的值
当finishedWork的tag为ForwardRef时，会调用commitHookEffectListMount函数，
这个函数会遍历fiber.updateQueue的effect队列，然后执行effect.create方法，
effect.create这个方法就是我们前面提到的imperativeHandleEffect方法。
```js
function commitLifeCycles(current, finishedWork) {
  switch (finishedWork.tag) {
    case ForwardRef: {
      commitHookEffectListMount(Layout | HasEffect, finishedWork);
      return;
    }
  }
}
function commitHookEffectListMount(tag, finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        var create = effect.create;
        effect.destroy = create(); // 调用effect.create
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
const imperativeEffect = {
  create: imperativeHandleEffect,
	...
};
```

###  imperativeHandleEffect 
这个函数会根据ref的类型（函数或对象）来创建一个实例，并将这个实例赋值给ref。
同时，这个函数会返回一个函数，这个函数用来重置ref.current属性为null。
返回函数会在 commitMutationEffects 阶段执行

```js
function imperativeHandleEffect(create, ref) {
  if (typeof ref === "function") {
    var refCallback = ref;

    var _inst = create();

    refCallback(_inst);
    return function () {
      // 注意这里会返回一个函数!!!
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    var refObject = ref;

    var _inst2 = create();

    refObject.current = _inst2;
    return function () {
      refObject.current = null;
    };
  }
}
```

### commitMutationEffects 阶段：重置 ref.current 为 null
commitMutationEffects 阶段调用 commitWork,他会重置 ref.current为 null
```js
function commitWork(current, finishedWork) {
  switch (finishedWork.tag) {
    case ForwardRef:
      commitHookEffectListUnmount(Layout | HasEffect, finishedWork);
      return;
  }
}
function commitHookEffectListUnmount(tag, finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    do {
      if ((effect.tag & tag) === tag) {
        // Unmount
        var destroy = effect.destroy;
        effect.destroy = undefined;

        if (destroy !== undefined) {
          destroy();
        }
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

> 从这个过程也可以看出，如果 ref 是一个函数，会被执行两次，第一次在 commitMutationEffects 阶段执行，用于重置 ref.current 为 null，第二次在 commitLayoutEffects 阶段执行，用于设置 ref.current 为最新的值
