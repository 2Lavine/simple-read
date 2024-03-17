> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.zhihu.com](https://www.zhihu.com/question/49496872/answer/3316787220) 



## reconcileChildFibers
再往下看触发 Diffing 的 reconcileChildFibers。

```js
function reconcileChildFibers(returnFiber: Fiber, currentFirstChild: Fiber | null, newChild: any): Fiber | null {
  const isObject = typeof newChild === 'object' && newChild !== null;
  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
    }
  }
  if (isArray(newChild)) {
    return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
  }
}
```

children 可能是单个对象也可能是数组，这里优先走 reconcileSingleElement 处理单个子节点情况，其次走 reconcileChildrenArray 处理多个子节点。说明单多节点是不一样的逻辑。

**这是一种「先做简单题」的思路。单节点的场景比较多但计算简单，到这里能结束多数场景避免不必要开销；而多节点计算复杂，不要轻易发起。**

**无论内部逻辑有什么差异，单多节点的协调函数都要做几件事：**

*   **和 current 节点的子节点做 Diffing，创建或复用**
*   **为可复用的新旧子节点建立 alternate 关联**
*   **返回第一个子节点（会一直往外返回给到 next 指针，作为下一步遍历对象）**

这个口径统一了，我们再分开看二者的差异。

### 子节点 Diffing：当 workInProgress 子节点为单节点

先想一下，为什么说单节点的场景计算简单？因为我只需要一层循环，把 current 节点的所有子节点挨个拿出来对比，找到一个和单节点匹配的就算 Diffing 完了。看代码：

```
function reconcileSingleElement(returnFiber: Fiber, currentFirstChild: Fiber | null, element: ReactElement): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  while (child !== null) {
    if (child.key === key) {
      if (child.elementType === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling);
        const existing = useFiber(child, element.props);
        existing.return = returnFiber;
        return existing;
      } else {
        deleteRemainingChildren(returnFiber, child);
        break;
      }
    } else {
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  const created = createFiberFromElement(element, returnFiber.mode);
  created.return = returnFiber;
  return created;
}
```

1.  去 current 子节点里找一个和 workInProgress 唯一子节点 key 相同的节点，过程中遍历到的所有 key 不相同的都 deleteChild 删掉
2.  找得到且 type 相同，就 useFiber 复用，并把复用节点挂到 workInProgress 下
3.  找得到但 type 不同，就 deleteChild 删掉，创建一个新节点并挂在 workInProgress 下。无论 2、3 哪一种，剩余的 current 子节点都可以 deleteRemainingChildren 批量删掉，因为不会再有 key 相同的了
4.  找不到，创建一个新节点并挂在 workInProgress 下

![](_resources/v2-82e60c367bcd9e4664c4e5e197ca00a5_r.jpg.png)

**这里的 2、3 遵循了 Diffing 思想的假设一——不同类型的节点元素会有不同的形态，所以 type 不同就直接被删掉了。**

### useFiber 做了什么

基于可复用节点和新属性复制一个 workInProgress 节点出来，并将二者通过 alternate 关联。这就是 useFiber 做的事。

```
function useFiber(fiber: Fiber, pendingProps: mixed): Fiber {
  const clone = createWorkInProgress(fiber, pendingProps);
  return clone;
}
function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
  workInProgress.alternate = current;
  current.alternate = workInProgress;
  return workInProgress;
}
```

其实 createWorkInProgress 还有很大篇幅的其他属性复制，这里没有列出来。

### Effect：删掉的含义是什么

删掉一个节点，在 React 中叫做 “副作用 Effect”。Effect 的细节会在下一节展开，这里我们暂时只需要知道 Effect 是挂在节点上的一个标记，用来最终执行对 DOM 的删除操作。同样前面也有个 placeSingleChild 函数，其实也是标记了一个新增 DOM 的 Effect。

### 子节点 Diffing：当 workInProgress 子节点为多节点

当 workInProgress 子节点是个数组，就会调 reconcileChildrenArray 进行多节点对比，返回第一个子节点。

由于相对复杂，我们直接拆开函数体。首先定义了一堆指针 / 索引：

```
let resultingFirstChild: Fiber | null = null;  // 构建后的第一个子节点，也就是 return 回去的节点
let previousNewFiber: Fiber | null = null;  // 前一个新节点，用来接 sibling 指针的
let oldFiber = currentFirstChild;  // 旧节点遍历指针
let lastPlacedIndex = 0;  // 最后的放置位置，这个和节点位置交叉移动方式有关
let newIdx = 0;  // 新 children 的遍历 index
let nextOldFiber = null;  // 旧节点遍历指针
```

有必要提一嘴，因为不论新旧，Fiber 子节点都是 sibling 链表相连的，所以用指针；但我们用来生成新节点的 children 是 element 数组，所以用 index。

接下来逻辑进入到多节点 Diffing，仍然体现了 “先做简单题” 的思路。

### 第一轮：先假设子节点从头开始的 key 顺序不变

最简单的情况是，“新旧节点的 key 顺序不变，仅仅在尾部增删节点”。那对比过程中至多只有三种操作：

1.  新增尾部若干个新子节点
2.  删除尾部若干个旧子节点
3.  替换掉 key 相同但 type 不同的节点

```
for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
  nextOldFiber = oldFiber.sibling;
  const key = oldFiber !== null ? oldFiber.key : null;
  let newFiber = null;
  if (newChild.key === key) {
    if (current !== null && current.elementType === element.type) {
      newFiber = useFiber(oldFiber, newChild.props);
    } else {
      newFiber = createFiberFromElement(newChild);
    }
  }
  if (newFiber === null) break;
  if (oldFiber && newFiber.alternate === null) {
    deleteChild(returnFiber, oldFiber);
  }
  lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  if (previousNewFiber === null) {
    resultingFirstChild = newFiber;
  } else {
    previousNewFiber.sibling = newFiber;
  }
  previousNewFiber = newFiber;
  oldFiber = nextOldFiber;
}
```

首先，发起循环，从第一个子节点开始逐步构建后续兄弟节点。循环是组件 children 数组 newIdx 发起的，在内部新（newFiber）老（oldFiber）节点指针也跟着跑。这个过程中新节点 siblings 链表也同步建起来。

过程中位置同步且 key 相同的节点会进行复用或替换。如果新旧节点 key 相同、type 相同，复用；key 相同、type 不同，deleteChild 删掉旧节点。placeChild 中也依赖这个判断，有 alternate 就复用，没有就插入新节点（加一个 “Placement” 的 Effect）

循环结束的可能有三种原因：

1.  这个循环继续的假设是 “新旧节点的 key 顺序不变”，所以一旦不满足这个条件就退出了。代码体现为：“本轮循环不满足 newChild.key === oldFiber.key”—>“newFiber 为 null”—>“break”。
2.  旧节点跑完了。代码体现为：“oldFiber 为 null” —> “key 为 null” —> “newFiber 为 null”—>“break”。
3.  新节点跑完了。也就是循环正常退出。

退出后怎么办？

如果是上面原因 3，就删掉剩余的所有旧节点（可能正好没有剩余），对比结束：

```
if (newIdx === newChildren.length) {
  deleteRemainingChildren(returnFiber, oldFiber);
  return resultingFirstChild;
}
```

如果是上面原因 2，就继续新增剩余所有新节点，并构造链表，然后对比结束：

```
if (oldFiber === null) {
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = createChild(returnFiber, newChildren[newIdx]);
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    previousNewFiber.sibling = newFiber;
    previousNewFiber = newFiber;
  }
  return resultingFirstChild;
}
```

到此为止，“简单题” 就做完了，大多数场景都能用这种相对低开销的方式解决。一张图回顾下：

![](_resources/v2-0e134a05ded8a55cf8f1baae8a992e63_r.jpg.png)

那中途退出的呢？进入第二轮

![](_resources/v2-d7dd437820bed9ff20cb3cd0f8de0be9_r.jpg.png)

### 第二轮

能进到第二轮有几种情况：

1.  中途出现了增删的节点
2.  有节点位置发生交换

这时，循环的 index 已经不足以映射新旧节点的 key 了，所以首先要建一个 map。

```
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

这里 existingChildren 就是一个 key 到旧节点的 map。

```
for (; newIdx < newChildren.length; newIdx++) {
  const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
  lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
  previousNewFiber.sibling = newFiber;
  previousNewFiber = newFiber;
}
```

updateFromMap 会试图到 map 里找一个 key 和 type 都相同的旧节点复用（调 useFiber）并返回，或者创建一个新节点。这很易懂，但下一行 placeChild 就有点意思了，前面也调过，这次打开看看。

```
function placeChild(newFiber: Fiber, lastPlacedIndex: number, newIndex: number): number {
  newFiber.index = newIndex;
  const current = newFiber.alternate;
  if (current !== null) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // This is a move.
      newFiber.effectTag = Placement;
      return lastPlacedIndex;
    } else {
      // This item can stay in place.
      return oldIndex;
    }
  } else {
    // This is an insertion.
    newFiber.effectTag = Placement;
    return lastPlacedIndex;
  }
}
```

首先无论如何，这个函数都会返回最近操作的节点 index。然后注意当有可复用节点（current !== null）时的逻辑：

*   如果旧节点位置比最近操作的位置靠左，就标记 “Placement”，“移动” 到新位置
*   如果旧节点位置比最近操作的位置相同或靠右，不需要任何操作

所以当新树对旧树的子节点进行了交叉换位，一定是左边的旧节点挪到右边，而右边的不动。咱们用一个例子再试下下

![](_resources/v2-07e8a8b0c34d79e81d42c970d458fd87_r.jpg.png)

### 小结

这章内容比较多，稍微总结下：

*   Fiber 树通过 beginWork 同时进行创建和 “向下” 遍历
*   创建过程也是 current（旧）、workInProgress（新）两棵树 Diffing 的过程，决定哪些旧节点需要复用、删除、移动，哪些新节点需要创建
*   只有父节点相互复用，才会触发子节点 Diffing，所以跨父节点的移动是铁定 Diffing 不到的
*   复用的条件是 key 和 type 都相同，所以 key 能提升复用率
*   子节点间的 Diffing 是一个 “先做简单题” 的过程，假设的优先级为：新子节点只有一个 —> 子节点只发生末尾的增删 —> 其他情况
*   对应的，Diffing 策略也分为：单节点 Diffing —> 一轮循环 —> 二轮循环
*   Diffing 过程中会把结果（操作）以 Effect 的形式挂到节点上

Part 4 EffectList：副作用及其收集
-------------------------
在 Diffing 的过程中，我们已经注意到几次 effectTag 的标记，比如 placeChild 中的 newFiber.effectTag = Placement;，deleteChild 中的 childToDelete.effectTag = Deletion;，来标记节点的创建、移动、删除。
React 的所有 effect 类型都在这里 packages/shared/ReactSideEffectTags.js。
### 为什么要向上收集？

给单个节点添加 effectTag 很好理解，等 Diffing 全部结束，我们统一找到有 effectTag 的节点做对应操作就好。比如某个节点标记了 Deletion，并且关联了一个 DOM 节点，就可以卸载这个 DOM 了。

从性能的角度，因为我们可以预见 Diffing 结束后要收集全部节点的 effectTag，那必然再发起一轮遍历，是不划算的，就不如在 Diffing 过程中直接同步完成收集。

还有另外一个场景：某个旧节点标记了 Deletion，但 Diffing 结束后，新树中并没有这个节点，也就不知道要删这个节点。那看起来唯一的办法就是把这个节点以某种形式挂到新节点上，但它自己又没有关联节点，就只能往上挂父节点的关联节点（这个是存在的，因为前面 Diffing 就发生在 “已存在复用关系的新旧节点的子节点之间”）。

### effectList 链表

Diffing 遍历过程是深度优先的，必然存在 “子节点 effect 早于父节点得出”，所以在遍历离开节点时，只要不断沿着树向父节点传递，就能让每个节点收集到所有后代节点的 effect，最终传到根节点就完成了整棵树的收集。

为了让每个节点都有 “保存所有后代节点 effect 的能力”，Fiber 给节点定义一个 effectList，通过链表实现。

![](_resources/v2-1e599a46f43449693fa0b696c8c24657_r.jpg.png)

*   BCZ 都是后代节点（新旧都有可能），因为没有什么能比原节点更能全面覆盖节点的信息，比如它关联的 DOM 等等。
*   但此结构和树结构没有任何关系，不要混淆，BCZ 可能是子节点、关联旧节点的子节点，或者是若干代以下的新旧节点
*   整个链表通过 fisrtEffect —> nextEffect —> lastEffect 串起来，链表的好处在于方便合并，比如下面报上来一串，你可以在链表任意位置打断把那一串拼进去

### 收集过程

当某个节点不存在子节点，就要从这个节点离开了，改执行 completeUnitOfWork。遍历那块说过，completeUnitOfWork 有个内层 do while 循环，从当前节点沿着 Fiber 树往上爬。

每次循环经过一个节点，都会向上合并 effectList，又分为两部分：合并后代节点的、合并自己的。

**合并后代节点 effectList**

```
if (returnFiber.firstEffect === null) {
  returnFiber.firstEffect = workInProgress.firstEffect;
}
if (workInProgress.lastEffect !== null) {
  if (returnFiber.lastEffect !== null) {
    returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
  }
  returnFiber.lastEffect = workInProgress.lastEffect;
}
```

![](_resources/v2-e26e7f9cb1059c6dc057cca56bddac69_r.jpg.png)

**上报自己的 effectTag**

```
const effectTag = workInProgress.effectTag;
if (effectTag > PerformedWork) {
  if (returnFiber.lastEffect !== null) {
    returnFiber.lastEffect.nextEffect = workInProgress;
  } else {
    returnFiber.firstEffect = workInProgress;
  }
  returnFiber.lastEffect = workInProgress;
}
```

![](_resources/v2-4f4eaf52b904ec637bcf3b3e9d415d03_r.jpg.png)

### 删除旧节点的 effect 怎么上报的？

前面的逻辑没提，其实答案在删除节点时调用的 deleteChild 上。

```
function deleteChild(returnFiber: Fiber, childToDelete: Fiber): void {
  const last = returnFiber.lastEffect;
  if (last !== null) {
    last.nextEffect = childToDelete;
    returnFiber.lastEffect = childToDelete;
  } else {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
  }
  childToDelete.nextEffect = null;
  childToDelete.effectTag = Deletion;
}
```

![](_resources/v2-1643438531664db4c2450e9b668012c6_r.jpg.png)

Part 5 stateNode：Host 实例的关联和更新
------------------------------

到目前为止，Fiber 树上的一系列动作还都没 DOM 什么事。但前面有提到，带有副作用的节点可能关联一个 DOM，并根据 effectTag 操作这个 DOM。

在 React 中，我们自己实现的组件是不直接关联到 DOM 的，但 JSX 中引用的诸如 div、span 这种原生标签由宿主实现，称为 HostComponent。（宿主指的是 UI 层，比如 react-dom、react-native，他们提供 API 对接 react 本身的框架能力，并负责具体渲染）。

在这类 fiber 节点上，有一个 stateNode 属性，关联具体的宿主实例，比如 react-dom 下的原生 DOM 对象，它们是通过 ReactFiberHostConfig 连接到宿主环境的诸如 document.createElement 这样的 API 返回的。如果需要的话，react 会在节点 effect 收集前完成对 stateNode 的创建、更新，以及对应 effect 的标记。

![](_resources/v2-15ea7d092a8d02c6e2f7579988bc38c9_r.jpg.png)

### completeWork

现在回到 completeUnitOfWork。

```
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  workInProgress = unitOfWork;
  do {
    completeWork(current, workInProgress);
    // 省略：收集 effect 的逻辑（Part 4）
  } while (workInProgress !== null);
}
```

在它的内部循环里，可以看到对每个节点，都会在收集 effect 之前调用 completeWork。

```
function completeWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case FunctionComponent:
      break;
    // ... 很多直接 break 的类型
    case HostComponent: {
      if (current !== null && workInProgress.stateNode != null) {
        // 更新分支
        updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance);
      } else {
        // 创建分支...
      }
      break;
    }
  }
}
```

进到 completeWork 后，我们看到大部分组件都直接 break 了，只有少部分涉及 Host 的会做一些操作，比如 HostComponent、HostRoot、HostText、HostPortal 等等。以最典型的 HostComponent 为例，更新 / 创建 Host 实例 —> 打 effectTag，这个流程又分更新和创建分支。

看分支前，我们先认识一个 markUpdate 方法。只有一行代码，就是给节点打上 Update tag，这也是在 effect 收集前执行的原因 —— 保证 Update tag 能被收集到。

```
function markUpdate(workInProgress: Fiber) {
  workInProgress.effectTag |= Update;
}
```

### 更新 Host 实例

如果 workInProgress.stateNode 存在，说明有绑定旧实例，updateHostComponent。updateHostComponent 会根据宿主配置（是否支持修改、持久化）有几种不同的实现，其中 DOM 下因为支持修改，实现如下：

```
updateHostComponent = function(current: Fiber,workInProgress: Fiber,type: Type,newProps: Props,rootContainerInstance: Container) {
  const instance: Instance = workInProgress.stateNode;
  const currentHostContext = getHostContext();
  const updatePayload = prepareUpdate(instance,type,oldProps,newProps,rootContainerInstance,currentHostContext);
  workInProgress.updateQueue = (updatePayload: any);
  if (updatePayload) {
    markUpdate(workInProgress);
  }
};
```

1.  prepareUpdate（由宿主配置提供）：获取更新现有实例要修改的属性
2.  markUpdate：标记 Update effectTag

### 创建 Host 实例

如果 workInProgress.stateNode 不存在，说明没有旧实例，要创建新实例。

```
let instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
appendAllChildren(instance, workInProgress, false, false);
if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance, currentHostContext)) markUpdate(workInProgress);
workInProgress.stateNode = instance;
```

1.  createInstance（由宿主配置提供）：创建新 DOM 对象
2.  appendAllChildren：遍历子节点，逐个调 appendInitialChild（由宿主配置提供）把子节点的 DOM 节点挂到当前 DOM 节点下。**这也是从下往上执行的一个重要原因 —— DOM 树也需要先构建子节点再插入父节点。**
3.  markUpdate：标记 Update effectTag
4.  workInProgress.stateNode = instance：挂载 stateNode

Part Z 总结
---------

本文从协调过程出发，讨论 Fiber 树在构建过程中表现出的遍历方式、Diffing 理念、副作用收集方式。

*   Fiber 树由链表构成，节点间通过 return（父节点）、child（第一个子节点）、sibling（下一个兄弟节点）相连。
*   当前视图对应的 Fiber 树称为 current 树，每次协调发起，都会构建新的 workInProgress 树，并在结束时替换 current 树。
*   Fiber 树的遍历方式是深度优先遍历，向下的过程由 beginWork 发起，向上的过程由 completeUnitOfWork 发起。beginWork 每次只向下一步，completeUnitOfWork 则每次向上若干步（由其内部若干个一步循环达成）。
*   Fiber 树是边构建边遍历的，构建在 beginWork 向下过程中发起。
*   Fiber 树的 Diffing 策略体现在构建过程中：父节点已复用、key 和 type 相同是节点复用的基本条件；子节点 Diffing 从易向难，单节点 Diffing —> 多节点末尾增删（一轮循环） —> 多节点其他情况（二轮循环）。
*   Diffing 的结果，诸如节点的删除、新增、移动，称为 effect，以 effectTag 的形式挂在节点上。
*   completeUnitOfWork 的内部循环会自底向上收集 effect，不断把有 effectTag 的子节点和自身向上合并到父节点的 effectList 中，直至根节点。effectList 是个链表。
*   宿主相关组件节点会把宿主实例挂到 stateNode 上，间接调用宿主方法对其完成创建、更新，由此也会产生 effectTag。
