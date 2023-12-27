> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.zhihu.com](https://www.zhihu.com/question/49496872/answer/3316787220) ![](https://picx.zhimg.com/v2-f619b3f760c0502d36ff5ce479789dad_l.jpg?source=2c26e567)BigYe 程普

> _为了写这篇文章，我花了 5 天时间阅读 Fiber 的核心源码，尽管本文字符数过万，但相对于几十万行 Fiber 源码来说，只能算是介绍了 Fiber 的基础知识，所以如果内容有纰漏，请在评论区为我指正，我会进行更新，如果阅读文章后有哪个关于 Fiber 的专题你想了解，也可以评论区提出来，我很乐意继续研究源码和分享知识。_

自 React 16 开始，React 引入了 **Fiber** 架构，解决了以前的更新机制的问题，即在长时间的更新过程中，主线程会被阻塞，导致应用无法及时响应用户输入。本文我们就来聊聊 Fiber 是什么以及它的底层原理，学习完本文可以让你对 Fiber 架构的原理有一个比较清晰的认识。

本文首发于我的博客「 **[J 实验室](https://weijunext.com/)」**

欢迎加入「 **[独立全栈开发交流群](https://mp.weixin.qq.com/s/RXpu-Ck13zoHyLP1OOUZ-g)**」，一起学习交流前端和 Node 端技术

**Fiber 是什么？**
--------------

首先，我们先聊聊 React 的基本组成：当我们写 React 组件并使用 JSX 时，React 在底层会将 JSX 转换为元素的对象结构。例如：

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

为了将这个元素渲染到 DOM 上，React 需要创建一种内部实例，用来追踪该组件的所有信息和状态。在早期版本的 React 中，我们称之为 “实例” 或“虚拟 DOM 对象”。但在 Fiber 架构中，这个新的工作单元就叫做 Fiber。

所以，在本质上，**Fiber 是一个 JavaScript 对象**，代表 React 的一个工作单元，它包含了与组件相关的信息。一个简化的 Fiber 对象长这样：

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

在 React 16 之前的版本中，是使用递归的方式处理组件树更新，称为**堆栈调和（Stack Reconciliation）**，这种方法一旦开始就不能中断，直到整个组件树都被遍历完。这种机制在处理大量数据或复杂视图时可能导致主线程被阻塞，从而使应用无法及时响应用户的输入或其他高优先级任务。

Fiber 的引入改变了这一情况。Fiber 可以理解为是 React 自定义的一个带有链接关系的 DOM 树，每个 Fiber 都代表了一个工作单元，React 可以在处理任何 Fiber 之前判断是否有足够的时间完成该工作，并在必要时中断和恢复工作。

Fiber 的结构
---------

我们来看一下源码里 FiberNode 的结构：

```
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

Fiber 工作原理中最核心的点就是：可以中断和恢复，这个特性增强了 React 的并发性和响应性。

实现可中断和恢复的原因就在于：Fiber 的数据结构里提供的信息让 React 可以追踪工作进度、管理调度和同步更新到 DOM

现在我们来聊聊 Fiber 工作原理中的几个关键点：

*   **单元工作**：每个 Fiber 节点代表一个单元，所有 Fiber 节点共同组成一个 Fiber 链表树（有链接属性，同时又有树的结构），这种结构让 React 可以细粒度控制节点的行为。  
    
*   **链接属性**：**`child`**、**`sibling`** 和 **`return`** 字段构成了 Fiber 之间的链接关系，使 React 能够遍历组件树并知道从哪里开始、继续或停止工作。

![](https://picx.zhimg.com/v2-d253b3afc6e30729bcb07128074bc814_r.jpg?source=2c26e567)

*   **双缓冲技术：** React 在更新时，会根据现有的 Fiber 树（**Current Tree**）创建一个新的临时树（**Work-in-progress (WIP) Tree**），WIP-Tree 包含了当前更新受影响的最高节点直至其所有子孙节点。Current Tree 是当前显示在页面上的视图，WIP-Tree 则是在后台进行更新，WIP-Tree 更新完成后会复制其它节点，并最终替换掉 Current Tree，成为新的 Current Tree。因为 React 在更新时总是维护了两个 Fiber 树，所以可以随时进行比较、中断或恢复等操作，而且这种机制让 React 能够同时具备拥有优秀的渲染性能和 UI 的稳定性。

![](https://picx.zhimg.com/v2-f6aafc4408e74bf10af13f8a5abe3a6d_r.jpg?source=2c26e567)

*   **State 和 Props：`memoizedProps`**、**`pendingProps`** 和 **`memoizedState`** 字段让 React 知道组件的上一个状态和即将应用的状态。通过比较这些值，React 可以决定组件是否需要更新，从而避免不必要的渲染，提高性能。  
    
*   **副作用的追踪**：**`flags`** 和 **`subtreeFlags`** 字段标识 Fiber 及其子树中需要执行的副作用，例如 DOM 更新、生命周期方法调用等。React 会积累这些副作用，然后在 Commit 阶段一次性执行，从而提高效率。

Fiber 工作流程
----------

了解了 Fiber 的工作原理后，我们可以通过阅读源码来加深对 Fiber 的理解。React Fiber 的工作流程主要分为两个阶段：

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
        // ……
        case LazyComponent: // 懒加载组件
        // ……
        case FunctionComponent: // 函数组件
        // ……
        case ClassComponent: // 类组件
        // ……

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

### 调和阶段知识拓展

**1、为什么 Fiber 架构更快？**

在上面这段代码里，我们还可以看出来为什么 Fiber 架构比以前的递归 DOM 计算要快：**`flags`** 或 **`subtreeFlags`** 是 16 进制的标识，在这里进行按位或 (`|`) 运算后，可以记录当前节点本身和子树的副作用类型，通过这个运算结果可以减少节点的遍历，举一个简单的例子说明：

```
假设有两种标识符：
Placement (表示新插入的子节点)：0b001
Update (表示子节点已更新)：0b010

A
├─ B (Update)
│   └─ D (Placement)
└─ C
   └─ E

这个例子里，计算逻辑是这样：
1、检查到A的flags没有副作用，直接复用，但subtreeFlags有副作用，那么递归检查B和C
2、检查到B的flags有复用，更新B，subtreeFlags也有副作用，则继续检查D
3、检查到C的flags没有副作用，subtreeFlags也没有副作用，那么直接复用C和E
如果节点更多，则以此类推。
这样的计算方式可以减少递归那些没有副作用的子树或节点，所以比以前的版本全部递归的算法要高效
```

**2、调和过程可中断**

前面我们提到，调和过程可以被中断，现在我们就看看源码里是怎么进行中断和恢复的。首先，我们要明确可中断的能力是 React 并发模式（Concurrent Mode）的核心，这种能力使得 React 可以优先处理高优先级的更新，而推迟低优先级的更新。

可以从下面这段代码理解中断与恢复的处理逻辑：

```
// packages/react-reconciler/src/ReactFiberWorkLoop.js
// 以下只是核心逻辑的代码，不是renderRootConcurrent的完整源码
function renderRootConcurrent(root: FiberRoot, lanes: Lanes) {
    // 保存当前的执行上下文和 dispatcher
    const prevExecutionContext = executionContext;
  executionContext |= RenderContext;
  const prevDispatcher = pushDispatcher(root.containerInfo);
  const prevCacheDispatcher = pushCacheDispatcher();

    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
        // 如果当前的工作进度树与传入的 root 或 lanes 不匹配，我们需要为新的渲染任务准备一个新的堆栈。
        // ……
    }

    // 持续的工作循环，除非中断发生，否则会一直尝试完成渲染工作
    outer: do {
    try {
      if (
        workInProgressSuspendedReason !== NotSuspended &&
        workInProgress !== null
      ) {
        // 如果当前的工作进度是由于某种原因而被挂起的，并且仍然有工作待处理，那么会处理它
        const unitOfWork = workInProgress;
        const thrownValue = workInProgressThrownValue;

         // 根据不同挂起原因，进行中断、恢复等计算
        resumeOrUnwind: switch (workInProgressSuspendedReason) {
          case SuspendedOnError: {
            // 如果工作因错误被挂起，那么工作会被中断，并从最后一个已知的稳定点继续
            // ……省略逻辑
            break;
          }
          case SuspendedOnData: {
            // 工作因等待数据（通常是一个异步请求的结果）而被挂起，
            // ……省略逻辑
            break outer;
          }
         case SuspendedOnInstance: {
             // 将挂起的原因更新为SuspendedOnInstanceAndReadyToContinue并中断工作循环，标记为稍后准备好继续执行
            workInProgressSuspendedReason = SuspendedOnInstanceAndReadyToContinue;
            break outer;
          }
          case SuspendedAndReadyToContinue: {
             // 表示之前的挂起工作现在已经准备好继续执行
             if (isThenableResolved(thenable)) {
              // 如果已解析，这意味着需要的数据现在已经可用
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              replaySuspendedUnitOfWork(unitOfWork); // 恢复执行被挂起的工作
            } else {
              workInProgressSuspendedReason = NotSuspended;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(unitOfWork, thrownValue); // 继续循环
            }
            break;
          }
         case SuspendedOnInstanceAndReadyToContinue: {
             // ……省略部分逻辑
             const isReady = preloadInstance(type, props);
             if (isReady) {
              // 实例已经准备好
              workInProgressSuspendedReason = NotSuspended; // 该fiber已完成，不需要再挂起
              workInProgressThrownValue = null;
              const sibling = hostFiber.sibling;
              if (sibling !== null) {
                workInProgress = sibling; // 有兄弟节点，开始处理兄弟节点
              } else {
                // 没有兄弟节点，回到父节点
                const returnFiber = hostFiber.return;
                if (returnFiber !== null) {
                  workInProgress = returnFiber;
                  completeUnitOfWork(returnFiber); // 收集副作用，前面有详细介绍
                } else {
                  workInProgress = null;
                }
              }
              break resumeOrUnwind;
            }
         }
         // 还有其它case
        }
      }

      workLoopConcurrent(); // 如果没有任何工作被挂起，那么就会继续处理工作循环。
      break;
    } catch (thrownValue) {
      handleThrow(root, thrownValue);
    }
  } while (true);

    // 重置了之前保存的执行上下文和dispatcher，确保后续的代码不会受到这个函数的影响
  resetContextDependencies();
  popDispatcher(prevDispatcher);
  popCacheDispatcher(prevCacheDispatcher);
  executionContext = prevExecutionContext;

  // 检查调和是否已完成
  if (workInProgress !== null) {
    // 未完成
    return RootInProgress; // 返回一个状态值，表示还有未完成
  } else {
    // 已完成
    workInProgressRoot = null; // 重置root
    workInProgressRootRenderLanes = NoLanes; // 重置Lane
    finishQueueingConcurrentUpdates(); // 处理队列中的并发更新
    return workInProgressRootExitStatus; // 返回当前渲染root的最终退出状态
  }
}
```

### 第二阶段：Commit（提交）

*   **目标**: 更新 DOM 并执行任何副作用。
*   **原理**: 遍历在 Reconciliation 阶段创建的副作用列表进行更新。

源码里 **`commitRoot`** 和 **`commitRootImpl`** 是提交阶段的入口方法，在两个方法中，可以看出来提交阶段也有三个核心小阶段，我们一一讲解：

### **1、遍历副作用列表：`BeforeMutation`**

```
// packages/react-reconciler/src/ReactFiberCommitWork.js
// 以下只是核心逻辑的代码，不是commitBeforeMutationEffects的完整源码
export function commitBeforeMutationEffects(
  root: FiberRoot,
  firstChild: Fiber,
): boolean {
  nextEffect = firstChild; // nextEffect是遍历此链表时的当前fiber
  commitBeforeMutationEffects_begin(); // 遍历fiber，处理节点删除和确认节点在before mutation阶段是否有要处理的副作用

  const shouldFire = shouldFireAfterActiveInstanceBlur; // 当一个焦点元素被删除或隐藏时，它会被设置为 true
  shouldFireAfterActiveInstanceBlur = false;
  focusedInstanceHandle = null;

  return shouldFire;
}
```

### 2、正式提交：`CommitMutation`

```
// packages/react-reconciler/src/ReactFiberCommitWork.js
// 以下只是核心逻辑的代码，不是commitMutationEffects的完整源码
export function commitMutationEffects(
  root: FiberRoot,
  finishedWork: Fiber,
  committedLanes: Lanes,
) {
    // lanes和root被设置为"in progress"状态，表示它们正在被处理
  inProgressLanes = committedLanes;
  inProgressRoot = root;

    // 递归遍历Fiber，更新副作用节点
  commitMutationEffectsOnFiber(finishedWork, root, committedLanes);

    // 重置进行中的lanes和root
  inProgressLanes = null;
  inProgressRoot = null;
}
```

### 3、处理 layout effects：`commitLayout`

```
// packages/react-reconciler/src/ReactFiberCommitWork.js
export function commitLayoutEffects(
  finishedWork: Fiber,
  root: FiberRoot,
  committedLanes: Lanes,
): void {
  inProgressLanes = committedLanes;
  inProgressRoot = root;

  // 创建一个current指向就Fiber树的alternate
  const current = finishedWork.alternate;
  // 处理那些由useLayoutEffect创建的layout effects
  commitLayoutEffectOnFiber(root, current, finishedWork, committedLanes);

  inProgressLanes = null;
  inProgressRoot = null;
}
```

从源码里我们可以看到，一旦进入提交阶段后，React 是无法中断的。

结语
--

以上内容虽无法覆盖 Fiber 的方方面面，但可以确保你学完后对 Fiber 会有一个整体上的认识，并且让你在以后阅读互联网上其它关于 Fiber 架构的文章时，不再因为基础知识困惑，而是能够根据已有的思路轻松地拓展你大脑里关于 Fiber 架构的知识网。

欢迎加入「 **[独立全栈开发交流群](https://mp.weixin.qq.com/s/RXpu-Ck13zoHyLP1OOUZ-g)**」，一起学习交流前端和 Node 端技术

![](https://picx.zhimg.com/v2-7b157ace53f108d892c7a0cc97fb9dfd_l.jpg?source=1def8aca)几木​​

后面部分也出炉了，都在这里：

1.  [React Fiber 架构原理：关于 Fiber 树的一切](https://zhuanlan.zhihu.com/p/525244896)
2.  [React Fiber 架构原理：自底向上盘一盘 Scheduler](https://zhuanlan.zhihu.com/p/538378360)
3.  [React Fiber 架构 —— “更新” 到底是个啥](https://zhuanlan.zhihu.com/p/546865854)

以下是原回答（第一篇的内容）

* * *

这篇尝试通过源码结合图解，还原 React Fiber 树的实现（Fiber 树只是整个 Fiber 架构的一部分）。文中你将看到：

*   Fiber 树在协调过程中的作用
*   Fiber 树的数据结构和遍历方式
*   Diffing 的思路，和它在伴随树构造过程的实现
*   Diffing 结果的标识和收集
*   节点宿主实例的关联方式

Part 0 背景
---------

### Virtual DOM

众所周知，React 构造了一层 Virtual DOM。

> Virtual DOM 是一种编程概念。在这个概念里， UI 以一种理想化的，或者说 “虚拟的” 表现形式被保存于内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步。这一过程叫做协调。  
> ——[Virtual DOM 及内核 – React](https://zh-hans.reactjs.org/docs/faq-internals.html#what-is-react-fiber)

Virtual DOM 像 DOM 一样，是一棵树。在协调过程中，我们创建、改变的 React 组件，构建出新 Virtual DOM 树，通过 Diffing 算法和老树对比，得到差值，再同步给视图要修改哪些部分。

### Fiber

那 Fiber 又是什么？

> React Fiber 是 React 核心算法的重新实现。  
> 它的主要特点是渐进式渲染: 能够将渲染工作分割成块，并将其分散到多个帧。  
> 其他关键特性包括在新的更新到来时暂停、中止或重用工作的能力; 为不同类型的更新分配优先级的能力; 以及新的并发方式。  
> ——[GitHub - acdlite/react-fiber-architecture: A description of React’s new core algorithm, React Fiber](https://github.com/acdlite/react-fiber-architecture)

广义的 Fiber，是一种新架构。为了实现这套架构，React 也在 Virtual DOM 上重建了树和节点结构，叫做 fiber 树和 fiber 节点。

Part 1 Fiber 树的组织方式
-------------------

先不管 Fiber 怎么实现的。现在想想，让你表示一棵树，要怎么表示？

### 基于 children 数组的树

最先想到的用 children 是吧：

```
{
    "name": "A",
    "children": [
        { "name": "B" },
        {
            "name": "C",
            "children": [
                { "name": "E" }
            ]
        },
        { "name": "D" }
    ]
}
```

这也是最常见的方式，很多场景比如 DOM 树、antd 的 Tree 组件数据等等，都这么组织。这种结构符合正常思维，读起来清晰舒服，特别适合广度优先遍历。

### 基于链表的树

另一种则是通过节点之间的指针表示他们的关系，形成一棵树。

```
// 对于多个 children，往往是父节点指向第一个子节点 child，再通过子节点的兄弟节点 sibling 指针横着指
// 也可以加上 return 指父节点
A = { child: B }
B = { return: A, sibling: C }
C = { return: A, sibling: D, child: E }
D = { return: A }
E = { return: C }
```

![](https://pic1.zhimg.com/v2-ec2033d54f9ad30ee2305d175b24dcd6_r.jpg?source=1def8aca)

虽然损失了一些可读性，这个结构却有很多优势：

*   调整节点位置很灵活，只要改改指针
*   方便进行各种方式的遍历
*   可以随时从某一个节点出发还原整棵树

这一切，正符合 Fiber 架构的要求：遍历、分割、暂停……

Part 2 Fiber 树的遍历方式
-------------------

前面说过：「React 构建出新 Virtual DOM 树，通过 Diffing 算法和老树对比」。但实际上 Fiber 树是边构建、边遍历、边对比的，这样最大程度减少了遍历次数，也符合「可中断」的设定。

咱们暂且只关注遍历方式，先说答案，Fiber 树是深度优先遍历的。Part 1 那棵树的遍历顺序是：ABCED。

### 遍历的实现

通过源码我们看看遍历是如何实现的。从 “协调” 的入口开始，会删掉一些代码，只关注遍历相关的部分。

```
// packages/react-reconciler/src/ReactFiberScheduler.js
function workLoop() {
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
// packages/react-reconciler/src/ReactFiberScheduler.js
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  let next;
  next = beginWork(current, unitOfWork, renderExpirationTime);
  if (next === null) {
    next = completeUnitOfWork(unitOfWork);
  }
  return next;
}
```

遍历需要一个指针指向当前遍历到的节点，workInProgress 就是这个指针，进一步是 performUnitOfWork 的 next 指针，遍历在指针为 null 的时候结束。

next 先从 beginWork 获取，如果没有，就从 completeUnitOfWork 获取。这里 beginWork 是 “递”，即不停向下找到当前分支最深叶子节点的过程；completeUnitOfWork 是 “归”，即结束这个分支，向右或向上的过程。

### 递

先看 beginWork。

```
// packages/react-reconciler/src/ReactFiberBeginWork.js
function beginWork( current: Fiber | null, workInProgress: Fiber, renderExpirationTime: ExpirationTime,
): Fiber | null {
  switch (workInProgress.tag) {
    case ClassComponent: {
      return updateClassComponent(current, workInProgress, Component, resolvedProps);
    }
  }
}
```

beginWork 本身对递归没什么实际进展，主要是根据 tag 分发逻辑。我们关注的是 beginWork 把 updateClassComponent 的返回作为下一个遍历节点返回，按深度优先规则，这个节点应该是当前节点的第一个子节点。

```
// packages/react-reconciler/src/ReactFiberBeginWork.js
function updateClassComponent(current: Fiber | null, workInProgress: Fiber, Component: any, nextProps) {
  const nextUnitOfWork = finishClassComponent(current, workInProgress, Component, shouldUpdate);
  return nextUnitOfWork;
}
function finishClassComponent(
  current: Fiber | null, workInProgress: Fiber, Component: any, shouldUpdate: boolean, hasContext: boolean
) {
  return workInProgress.child; 
}
```

updateClassComponent 调 finishClassComponent，返回 workInProgress.child，确实是当前节点的第一个子节点。

### 归

需要注意的是，next 指针不应该重复经过同一个节点。因为如果向下的过程中经过某个节点，在向上的过程中又出现，就会再次进入 beginWork，造成死循环。继续看 completeUnitOfWork 如何解决这个问题。

```
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  workInProgress = unitOfWork;
  do {
    const siblingFiber = workInProgress.sibling;
    if (siblingFiber !== null) {
      return siblingFiber;
    }
    const returnFiber = workInProgress.return;
    workInProgress = returnFiber;
  } while (workInProgress !== null);
  return null;
}
```

completeUnitOfWork 内部又创建了一层循环，搭配一个向上的新指针 workInProgress（此 workInProgress 非彼 workInProgress），然后循环看当前指针节点，有兄弟节点就返回交还给外层循环，没有就向上到父节点，直到最上面的根节点。

### 一张图总结

假设我们有如下这样一棵树。

![](https://picx.zhimg.com/v2-eabcf03d0c43acfedb92c3933575c8f9_r.jpg?source=1def8aca)

*   整个遍历由 performUnitOfWork 发起，为深度优先遍历
*   从根节点开始，循环调 beginWork 向下爬树（黄色箭头，每个箭头表示一次调用）
*   到达叶子节点（beginWork 爬不下去）后，调 completeUnitOfWork 向上爬到下一个未遍历过的节点，也就是第一个出现的祖先兄弟节点（绿色箭头，每个箭头表示一次调用）
*   所以 beginWork 可能连续调用多次，一次最多只爬一步，但 completeUnitOfWork 只可能在 beginWork 之间连续调用一次，一次可以向上爬若干步
*   completeUnitOfWork 内部包下了若干步循环向上的爬树操作（绿色虚线箭头）

到这里有个疑问，Fiber 实现深度优先遍历为什么要这么复杂？为什么要区分内外两层循环？

### 服务于功能的遍历过程

Fiber 树是边创建边遍历的，每个节点都经历了「创建、Diffing、收集副作用（要改哪些节点）」的过程。其中，创建、Diffing 要自上而下，因为有父才有子；收集副作用要自下而上最终收集到根节点。

现在我们回头看遍历过程。外层循环每一步（也就是 beginWork 每次执行）都是自上而下的，并保证每个节点只走一次；内层循环每一步（在 completeUnitOfWork 里）都是自下而上的。显然，beginWork 负责创建、Diffing，completeUnitOfWork 负责收集副作用。

那这些功能具体又是怎么体现的？

Part 3 树的构建和 Diffing
--------------------

首先明确一点，所谓的 Diffing 算法并不是独立存在的，不是说先把树建完再执行 Diffing 算法找出差距，而是将 Diffing 算法体现在构建过程中对老节点的复用策略。

### 背景：两棵树

在 React 中最多会同时存在两棵 Fiber 树：

*   当前屏幕上显示内容对应的 Fiber 树称为 current Fiber 树
*   正在构建的 Fiber 树称为 workInProgress Fiber 树，我们这里讨论的所有遍历都在这棵树上

当一次协调发起，首先会开一棵新 workInProgress Fiber 树，然后从根节点开始构建并遍历 workInProgress Fiber 树。

![](https://pic1.zhimg.com/v2-ab587b626f5a0af15dac6fb9a825feeb_r.jpg?source=1def8aca)

如果构建到一半被打断，current 树还在。如果构建并提交完成，直接把 current 树丢掉，让 workInProgress Fiber 树成为新的 current 树。

![](https://pic1.zhimg.com/v2-48ee0248ff53e2e3ce1280f5b9de57f1_r.jpg?source=1def8aca)

所谓 Diffing 也是在这两棵树之间，如果构建过程中确认新节点对旧节点的复用关系，新旧节点间也会通过 alternate 指针相连。

![](https://picx.zhimg.com/v2-422ba239fe44fa9c8745039cc3b6d6b9_r.jpg?source=1def8aca)

### Diffing 算法思想

正常情况下，完全找到两棵树的差异，是个时间复杂度很高的操作。但 Diffing 算法通过一些假设，权衡了执行开销和完整性。

**假设一：不同类型的节点元素会有不同的形态**

当节点为不同类型的元素时，React 会拆卸原有节点并且建立起新的节点。举个例子，当一个元素从 a 变成 img，从 Article 变成 Comment，都会触发一个完整的重建流程。

该算法不会尝试匹配不同组件类型的子树。如果你发现你在两种不同类型的组件中切换，但输出非常相似的内容，建议把它们改成同一类型。

**假设二：节点不会进行跨父节点移动**

只会对比两个关联父节点的子节点，多了就加少了就减。没有提供任何方式追踪他们是否被移动到别的地方。

**假设三：用户会给每个子节点提供一个 key，标记它们 “是同一个”**

当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。在新增 key 之后，使得树的转换效率得以提高。比如两个兄弟节点调换了位置，有 key 的情况下能保证二者都复用仅做移动，但无 key 就会造成两个不必要的卸载重建。

### 深入 Diffing 过程

接下来我们看 Diffing 算法如何体现在具体实现中的。（代码会精简掉很多无关逻辑，只关注 Diffing 过程）

```
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  const current = unitOfWork.alternate;
  next = beginWork(current, unitOfWork);
  return next;
}
```

对每个遍历到的新节点 unitOfWork，取出它关联复用的 current 树节点，称为「current」，然后新旧节点一并传给 beginWork。这个关联关系是在前面某轮循环执行 beginWork 构造 unitOfWork 时建立的，取决于当时的 Diffing 判断新旧节点是否复用。所以可能存在 current 为 null 的情况。

```
function beginWork( current: Fiber | null, workInProgress: Fiber): Fiber | null {
  switch (workInProgress.tag) {
    case HostComponent: {
      return updateHostComponent(current, workInProgress);
    }
  }
}
```

beginWork 根据当前节点 tag 做分发，这里的 tag 比较丰富，都是从 shared/ReactWorkTags.js 导入的常量，常见的 HostComponent、FunctionComponent、ClassComponent、Fragment 等都在此列。以 updateHostComponent 为例。

```
function updateHostComponent(current: Fiber | null, workInProgress: Fiber) {
  reconcileChildren(current, workInProgress, workInProgress.pendingProps.children);
  return workInProgress.child;
}
function reconcileChildren(current: Fiber | null, workInProgress: Fiber, nextChildren: any) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  }
}
```

updateHostComponent 从 workInProgress 属性中取出 children，这个 children 不是 fiber 节点，而是组件 render 方法根据 JSX 结构 createElement 创建的 element 数组，这点不要混淆。

然后在 reconcileChildren 中构造子节点。可以看到如果 current 节点为 null，也就是当前节点无复用，就直接放弃子节点 Diffing 了。所以**父节点可复用，是子节点复用的必要不充分条件**。

**这里也遵循了 Diffing 算法的假设二——节点不会进行跨父节点移动，只对比关联节点的子节点的增减，不管它们有没有被移动到别处或从别处移动来。**

再往下看触发 Diffing 的 reconcileChildFibers。

```
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

![](https://pic1.zhimg.com/v2-82e60c367bcd9e4664c4e5e197ca00a5_r.jpg?source=1def8aca)

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

![](https://pic1.zhimg.com/v2-0e134a05ded8a55cf8f1baae8a992e63_r.jpg?source=1def8aca)

那中途退出的呢？进入第二轮

![](https://picx.zhimg.com/v2-d7dd437820bed9ff20cb3cd0f8de0be9_r.jpg?source=1def8aca)

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

![](https://picx.zhimg.com/v2-07e8a8b0c34d79e81d42c970d458fd87_r.jpg?source=1def8aca)

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

![](https://pic1.zhimg.com/v2-1e599a46f43449693fa0b696c8c24657_r.jpg?source=1def8aca)

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

![](https://pica.zhimg.com/v2-e26e7f9cb1059c6dc057cca56bddac69_r.jpg?source=1def8aca)

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

![](https://picx.zhimg.com/v2-4f4eaf52b904ec637bcf3b3e9d415d03_r.jpg?source=1def8aca)

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

![](https://picx.zhimg.com/v2-1643438531664db4c2450e9b668012c6_r.jpg?source=1def8aca)

Part 5 stateNode：Host 实例的关联和更新
------------------------------

到目前为止，Fiber 树上的一系列动作还都没 DOM 什么事。但前面有提到，带有副作用的节点可能关联一个 DOM，并根据 effectTag 操作这个 DOM。

在 React 中，我们自己实现的组件是不直接关联到 DOM 的，但 JSX 中引用的诸如 div、span 这种原生标签由宿主实现，称为 HostComponent。（宿主指的是 UI 层，比如 react-dom、react-native，他们提供 API 对接 react 本身的框架能力，并负责具体渲染）。

在这类 fiber 节点上，有一个 stateNode 属性，关联具体的宿主实例，比如 react-dom 下的原生 DOM 对象，它们是通过 ReactFiberHostConfig 连接到宿主环境的诸如 document.createElement 这样的 API 返回的。如果需要的话，react 会在节点 effect 收集前完成对 stateNode 的创建、更新，以及对应 effect 的标记。

![](https://pic1.zhimg.com/v2-15ea7d092a8d02c6e2f7579988bc38c9_r.jpg?source=1def8aca)

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

![](https://picx.zhimg.com/v2-d07aa43f40c12e59a1a91fc59c719c25_l.jpg?source=1def8aca)寸志

在 [http://conf.reactjs.org/](http://conf.reactjs.org/) 上，Lin Clark 通过漫画为我们介绍 Fiber，结合她的介绍，我谈谈我的理解：

![](https://picx.zhimg.com/v2-d7a4541e9f9ccf34d3d3dc858e284ead_r.jpg?source=1def8aca)

Fiber 可以提升复杂 React 应用的可响应性和性能。Fiber 即是 React 新的调度算法（reconciliation algorithm）

![](https://picx.zhimg.com/v2-e5fbd24214f38824878b119a1e8bf4e0_r.jpg?source=1def8aca)

react 即 reconsiler（调度者），react-dom 则是 renderer。调度者一直都是又 React 本身决定，而 renderer 则可以由社区控制和贡献。

那新的调度算法是如何优化可响应性和性能的呢 ？

![](https://pic1.zhimg.com/v2-6615d1750f35f1b58ac0a8cf28c4f51a_r.jpg?source=1def8aca)

每次有 state 的变化 React 重新计算，如果计算量过大，浏览器主线程来不及做其他的事情，比如 rerender 或者 layout，那例如动画就会出现卡顿现象。

![](https://picx.zhimg.com/v2-d05d26726552a47b8d8c9aa3c306c6d9_r.jpg?source=1def8aca)

React 制定了一种名为 Fiber 的数据结构，加上新的算法，使得大量的计算可以被拆解，异步化，浏览器主线程得以释放，保证了渲染的帧率。从而提高响应性。

React 将更新分为了两个时期：

![](https://pic1.zhimg.com/v2-86baa2e125f73b2ae7fcd482eff4f11e_r.jpg?source=1def8aca)

render/reconciliation
---------------------

![](https://picx.zhimg.com/v2-f24c387d37d7e79692797b7e4a43eae4_r.jpg?source=1def8aca)

可打断，React 在 workingProgressTree 上复用 current 上的 Fiber 数据结构来一步地（通过 requestIdleCallback）来构建新的 tree，标记处需要更新的节点，放入队列中。

commit
------

![](https://picx.zhimg.com/v2-aea949f952367f5e149a9f05757e5df9_r.jpg?source=1def8aca)

不可打断。在第二阶段，React 将其所有的变更一次性更新到 DOM 上。

除此之外，还有更多的优化细节，可以参看 Lin Clark 的[演讲视频](http://conf.reactjs.org/speakers/lin)。

  

**广告时间**
--------

欢迎关注 [前端外刊评论 - 知乎专栏](https://zhuanlan.zhihu.com/FrontendMagazine)，外刊君将会代码 React Conf 2017 的全部解读。也可以微信、微博搜索 FrontendMagazine 关注，期待后续。