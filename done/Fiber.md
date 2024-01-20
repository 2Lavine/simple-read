**Fiber 是什么？**
--------------
当我们写 React 组件并使用 JSX 时，React 在底层会将 JSX 转换为元素的对象结构。例如：

```
const element = <h1>Hello, world</h1>;
```
上述代码会被转换为以下形式：
```
const element = React.createElement(
  'h1',
  null,
  'Hello, world'
);
```

createElement的 Element 是什么？
- 一种内部实例，一个 JavaScript 对象,用来追踪该组件的所有信息和状态。
- 在早期版本的 React 中，我们称之为 “实例” 或“虚拟 DOM 对象”。
- 但在 Fiber 架构中，这个新的工作单元就叫做 Fiber。

Fiber 对象
---
一个简化的 Fiber 对象长这样：
```
{
  type: 'h1',  // 组件类型
  key: null,   // React key
  props: { ... }, // 输入的props
  state: { ... }, // 组件的state (如果是class组件或带有state的function组件)
  child: Fiber | null,  // 第一个子元素的Fiber
  sibling: Fiber | null,  // 下一个兄弟元素的Fiber
  return: Fiber | null,  // 父元素的Fiber
  // ...其他属性
}
```

当 React 开始工作时，它会沿着 Fiber 树形结构进行，试图完成每个 Fiber 的工作（例如，比较新旧 props，确定是否需要更新组件等）。如果主线程有更重要的工作（例如，响应用户输入），则 React 可以中断当前工作并返回执行主线程上的任务。

因此，Fiber 不仅仅是代表组件的一个内部对象，它还是 React 的调度和更新机制的核心组成部分。

**为什么需要 Fiber？**
----------------

在 React 16 之前的版本中，是使用递归的方式处理组件树更新，称为**堆栈调和（Stack Reconciliation）**，这种方法一旦开始就不能中断，直到整个组件树都被遍历完。
- 处理大量数据或复杂视图时可能导致主线程被阻塞，从而使应用无法及时响应用户的输入或其他高优先级任务。

Fiber 的引入改变了这一情况。
- Fiber 可以理解为是 React 自定义的一个带有链接关系的 DOM 树，
- 每个 Fiber 都代表了一个工作单元，
- React 可以在处理任何 Fiber 之前判断是否有足够的时间完成该工作，并在必要时中断和恢复工作。

Fiber 的结构
---------

我们来看一下源码里 FiberNode 的结构：

```js
function FiberNode(
  this: $FlowFixMe,
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 基本属性
  this.tag = tag; // 描述此Fiber的启动模式的值（LegacyRoot = 0; ConcurrentRoot = 1）
  this.key = key; // React key
  this.elementType = null; // 描述React元素的类型。例如，对于JSX<App />，elementType是App
  this.type = null; // 组件类型
  this.stateNode = null; // 对于类组件，这是类的实例；对于DOM元素，它是对应的DOM节点。

  // Fiber链接
  this.return = null; // 指向父Fiber
  this.child = null; // 指向第一个子Fiber
  this.sibling = null; // 指向其兄弟Fiber
  this.index = 0; // 子Fiber中的索引位置

  this.ref = null; // 如果组件上有ref属性，则该属性指向它
  this.refCleanup = null; // 如果组件上的ref属性在更新中被删除或更改，此字段会用于追踪需要清理的旧ref

  // Props & State
  this.pendingProps = pendingProps; // 正在等待处理的新props
  this.memoizedProps = null; // 上一次渲染时的props
  this.updateQueue = null; // 一个队列，包含了该Fiber上的状态更新和副作用
  this.memoizedState = null; // 上一次渲染时的state
  this.dependencies = null; // 该Fiber订阅的上下文或其他资源的描述

  // 工作模式
  this.mode = mode; // 描述Fiber工作模式的标志（例如Concurrent模式、Blocking模式等）。

  // Effects
  this.flags = NoFlags; // 描述该Fiber发生的副作用的标志（十六进制的标识）
  this.subtreeFlags = NoFlags; // 描述该Fiber子树中发生的副作用的标志（十六进制的标识）
  this.deletions = null; // 在commit阶段要删除的子Fiber数组

  this.lanes = NoLanes; // 与React的并发模式有关的调度概念。
  this.childLanes = NoLanes; // 与React的并发模式有关的调度概念。

  this.alternate = null; // Current Tree和Work-in-progress (WIP) Tree的互相指向对方tree里的对应单元

    // 如果启用了性能分析
  if (enableProfilerTimer) {
    // ……
  }

    // 开发模式中
  if (__DEV__) {
    // ……
  }
}
```

其实可以理解为是一个更强大的虚拟 DOM。

Fiber 工作原理
----------
Fiber 核心的点就是：可以中断和恢复，这个特性增强了 React 的并发性和响应性。
实现可中断和恢复的原因就在于：
- Fiber 的数据结构里提供的信息让 React 可以追踪工作进度、管理调度和同步更新到 DOM

为什么 FIber 的数据结构支持可中断和恢复?
*   **单元工作**：每个 Fiber 节点代表一个单元，所有 Fiber 节点共同组成一个 Fiber 链表树（有链接属性，同时又有树的结构），这种结构让 React 可以细粒度控制节点的行为。  
*   **链接属性**：**`child`**、**`sibling`** 和 **`return`** 字段构成了 Fiber 之间的链接关系，使 React 能够遍历组件树并知道从哪里开始、继续或停止工作。
*   **双缓冲技术：**
	* React 在更新时，会根据现有的 Fiber 树（**Current Tree**）创建一个新的临时树（**Work-in-progress (WIP) Tree**），
	* WIP-Tree 是在后台进行更新，包含更新受影响的最高节点直至其所有子孙节点。
		*  WIP-Tree 更新完成后会复制其它节点，并最终替换掉 Current Tree，成为新的 Current Tree。
	* Current Tree 是当前显示在页面上的视图
	* 因为 React 在更新时总是维护了两个 Fiber 树，所以可以随时进行比较、中断或恢复等操作，而且这种机制让 React 能够同时具备拥有优秀的渲染性能和 UI 的稳定性。
*   **State 和 Props：`memoizedProps`**、**`pendingProps`** 和 **`memoizedState`** 字段让 React 知道组件的上一个状态和即将应用的状态。通过比较这些值，React 可以决定组件是否需要更新，从而避免不必要的渲染，提高性能。  
*   **副作用的追踪**：**`flags`** 和 **`subtreeFlags`** 字段标识 Fiber 及其子树中需要执行的副作用，例如 DOM 更新、生命周期方法调用等。React 会积累这些副作用，然后在 Commit 阶段一次性执行，从而提高效率。


![](_resources/v2-f6aafc4408e74bf10af13f8a5abe3a6d_r.jpg)

Fiber 工作流程
----------
### 第一阶段：Reconciliation（调和）
*   **目标**: 确定哪些部分的 UI 需要更新。
*   **原理**: 这是 React 构建工作进度树的阶段，会比较新的 props 和旧的 Fiber 树来确定哪些部分需要更新。
调和阶段又分为三个小阶段：
### 1、创建与标记更新节点：`beginWork`

1.  **判断 Fiber 节点是否要更新：**
```
// packages/react-reconciler/src/ReactFiberBeginWork.js
// 以下只是核心逻辑的代码，不是beginWork的完整源码
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
    if (current !== null) {
        // 这是旧节点，需要检查props和context是否有变化再确认是否需要更新节点
        const oldProps = current.memoizedProps;
        const newProps = workInProgress.pendingProps;

        if(oldProps !== newProps || hasLegacyContextChanged()) {
            didReceiveUpdate = true; // props和context有变化，说明节点有更新
        } else {
            // 其它特殊情况的判断
        }
    } else {
        didReceiveUpdate = false; // 这是新节点，要创建，而不是更新
    }

    workInProgress.lanes = NoLanes; // 进入beginWork表示开始新的工作阶段，所以要把旧的workInProgress优先级清除掉

    switch (workInProgress.tag) {
        // 通过workInProgress的tag属性来确定如何处理当前的Fiber节点
        // 每一种tag对应一种不同的Fiber类型，进入不同的调和过程（reconcileChildren()）
        case IndeterminateComponent: // 尚未确定其类型的组件
        case LazyComponent: // 懒加载组件
        case FunctionComponent: // 函数组件
        case ClassComponent: // 类组件

        // 其它多种Fiber类型
        // case ……
    }
}
```

1.  **判断 Fiber 子节点是更新还是复用：**

```
// packages/react-reconciler/src/ReactFiberBeginWork.js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any, // 要调和的新的子元素
  renderLanes: Lanes,
) {
  if (current === null) {
    // 如果current为空，说明这个Fiber是首次渲染，React会为nextChildren生成一组新的Fiber节点
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // 当current非空时，React会利用现有的Fiber节点（current.child）和新的子元素（nextChildren）进行调和
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

**`mountChildFibers`**和**`reconcileChildFibers`**最终会进入同一个方法**`createChildReconciler`**，执行 Fiber 节点的调和（处理诸如新的 Fiber 创建、旧 Fiber 删除或现有 Fiber 更新等操作）。而整个 **`beginWork`** 完成后，就会进入 **`completeWork`** 流程。



### 2、收集副作用列表：`completeUnitOfWork`和`completeWork`

**`completeUnitOfWork`** 负责遍历 Fiber 节点，同时记录了有副作用节点的关系。下面从源码上理解它的工作：
**`completeWork`** 在 **`completeUnitOfWork`** 中被调用，下面是 **`completeWork`** 的逻辑，主要是根据 tag 进行不同的处理，真正的核心逻辑在 **`bubbleProperties`** 里面

completeUnitOfWork
---
completeUnitOfWork`** 负责遍历 Fiber 节点，同时记录了有副作用节点的关系。下面从源码上理解它的工作：
```
// packages/react-reconciler/src/ReactFiberWorkLoop.js
// 以下只是核心逻辑的代码，不是completeUnitOfWork的完整源码
function completeUnitOfWork(unitOfWork: Fiber): void {
    let completedWork: Fiber = unitOfWork; // 当前正在完成的工作单元
    do {
        const current = completedWork.alternate; // 当前Fiber节点在另一棵树上的版本
        const returnFiber = completedWork.return; // 当前Fiber节点的父节点

        let next;
        next = completeWork(current, completedWork, renderLanes); // 调用completeWork函数

        if (next !== null) {
          // 当前Fiber还有工作要完成
          workInProgress = next;
          return;
        }
        const siblingFiber = completedWork.sibling;
        if (siblingFiber !== null) {
          // 如果有兄弟节点，则进入兄弟节点的工作
          workInProgress = siblingFiber;
          return;
        }
        // 如果没有兄弟节点，回到父节点继续
        completedWork = returnFiber;
        workInProgress = completedWork;
    } while (completedWork !== null);

    // 如果处理了整个Fiber树，更新workInProgressRootExitStatus为RootCompleted，表示调和已完成
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  } 
}
```


completeWork
---
**`completeWork`** 在 **`completeUnitOfWork`** 中被调用，下面是 **`completeWork`** 的逻辑，主要是根据 tag 进行不同的处理，真正的核心逻辑在 **`bubbleProperties`** 里面

```
// packages/react-reconciler/src/ReactFiberCompleteWork.js
// 以下只是核心逻辑的代码，不是completeWork的完整源码
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
    // 多种tag
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
         bubbleProperties(workInProgress)
         return null;
    case ClassComponent:
         // 省略逻辑
         // ……
         bubbleProperties(workInProgress)
         return null;
    case HostComponent:
         // 省略逻辑
         // ……
         return null;
    // 多种tag
        // ……
  }
}
```

**`bubbleProperties`** 为 **`completeWork`** 完成了两个工作：
1.  **记录 Fiber 的副作用标志**
2.  **为子 Fiber 创建链表**

这两个工作都从下面这段代码中看出来：
```
// packages/react-reconciler/src/ReactFiberCompleteWork.js
// 以下只是核心逻辑的代码，不是bubbleProperties的完整源码
function bubbleProperties(completedWork: Fiber) {
    const didBailout =
    completedWork.alternate !== null &&
    completedWork.alternate.child === completedWork.child; // 当前的Fiber与其alternate（备用/上一次的Fiber）有相同的子节点，则跳过更新

    let newChildLanes = NoLanes; // 合并后的子Fiber的lanes
    let subtreeFlags = NoFlags; // 子树的flags。

    if (!didBailout) {
        // 没有bailout，需要冒泡子Fiber的属性到父Fiber
        let child = completedWork.child;
        // 遍历子Fiber，并合并它们的lanes和flags
        while (child !== null) {
          newChildLanes = mergeLanes(
            newChildLanes,
            mergeLanes(child.lanes, child.childLanes),
          );

          subtreeFlags |= child.subtreeFlags;
          subtreeFlags |= child.flags;

          child.return = completedWork; // Fiber的return指向父Fiber，确保整个Fiber树的一致性
          child = child.sibling;
        }
        completedWork.subtreeFlags |= subtreeFlags; // 合并所有flags（副作用）
    } else {
        // 有bailout，只冒泡那些具有“静态”生命周期的flags
        let child = completedWork.child;
        while (child !== null) {
          newChildLanes = mergeLanes(
            newChildLanes,
            mergeLanes(child.lanes, child.childLanes),
          );

          subtreeFlags |= child.subtreeFlags & StaticMask; // 不同
          subtreeFlags |= child.flags & StaticMask; // 不同

          child.return = completedWork;
          child = child.sibling;
        }
        completedWork.subtreeFlags |= subtreeFlags;
    }
    completedWork.childLanes = newChildLanes; // 获取所有子Fiber的lanes。
    return didBailout;
}
```
