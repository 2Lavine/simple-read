### 调和阶段知识拓展
**1、为什么 Fiber 架构更快？**
**`flags`** 或 **`subtreeFlags`** 是 16 进制的标识，在这里进行按位或 (`|`) 运算后，可以记录当前节点本身和子树的副作用类型，通过这个运算结果可以减少节点的遍历
这样的计算方式可以减少递归那些没有副作用的子树或节点，所以比以前的版本全部递归的算法要高效
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
```

### 第二阶段：Commit（提交）
*   **目标**: 更新 DOM 并执行任何副作用。
*   **原理**: 遍历在 Reconciliation 阶段创建的副作用列表进行更新。
Commit的入口方法
- 源码里 **`commitRoot`** 和 **`commitRootImpl`** 是提交阶段的
在两个方法中，可以看出来提交阶段也有三个核心小阶段：
1. CommitBeforeMutationEffects:遍历副作用列表
2. CommitMutationEffects:正式提交副作用
3. CommitLayoutEffects:处理 layout effects
### **1、遍历副作用列表：`commitBeforeMutation`**
```js
export function commitBeforeMutationEffects(
  root: FiberRoot,
  firstChild: Fiber,
): boolean {
  nextEffect = firstChild; 
  commitBeforeMutationEffects_begin(); 
  // 遍历fiber，处理节点删除和确认节点在before mutation阶段是否有要处理的副作用
  const shouldFire = shouldFireAfterActiveInstanceBlur; 
  // 当一个焦点元素被删除或隐藏时，它会被设置为 true
  shouldFireAfterActiveInstanceBlur = false;
  focusedInstanceHandle = null;
  return shouldFire;
}
```
### 2、正式提交：`CommitMutationEffect`
```js
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
```js
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

Part 1 Fiber 树的组织方式
-------------------
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
虽然损失了一些可读性，这个结构却有很多优势：
*   调整节点位置很灵活，只要改改指针
*   方便进行各种方式的遍历
*   可以随时从某一个节点出发还原整棵树
这一切，正符合 Fiber 架构的要求：遍历、分割、暂停……
Part 2 Fiber 树的遍历方式
-------------------
React 构建出新 Virtual DOM 树，通过 Diffing 算法和老树对比。
- 但实际上 Fiber 树是边构建、边遍历、边对比的，这样最大程度减少了遍历次数，也符合「可中断」的设定。
### 遍历的实现
通过源码我们看看遍历是如何实现的。从 “协调” 的入口开始，会删掉一些代码，只关注遍历相关的部分。

```js
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

遍历需要一个指针指向当前遍历到的节点，workInProgress 就是这个指针，
进一步是 performUnitOfWork 的 next 指针，遍历在指针为 null 的时候结束。
- next 先从 beginWork 获取，
- 如果没有，就从 completeUnitOfWork 获取。
	- 这里 beginWork 是 “递”，即不停向下找到当前分支最深叶子节点的过程
	- completeUnitOfWork 是 “归”，即结束这个分支，向右或向上的过程。

### 递

先看 beginWork。
```js
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

beginWork 本身对递归没什么实际进展，主要是根据 tag 分发逻辑。
我们关注的是 beginWork 把 updateClassComponent 的返回作为下一个遍历节点返回，按深度优先规则，这个节点应该是当前节点的第一个子节点。

```js
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

```js
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


### 服务于功能的遍历过程
到这里有个疑问，Fiber 实现深度优先遍历为什么要这么复杂？为什么要区分内外两层循环？
Fiber 树是边创建边遍历的，每个节点都经历了「创建、Diffing、收集副作用（要改哪些节点）」的过程。
- 其中，创建、Diffing 要自上而下，因为有父才有子；
- 收集副作用要自下而上最终收集到根节点。
现在我们回头看遍历过程。外层循环每一步（也就是 beginWork 每次执行）都是自上而下的，并保证每个节点只走一次；内层循环每一步（在 completeUnitOfWork 里）都是自下而上的。

显然，beginWork 负责创建、Diffing，completeUnitOfWork 负责收集副作用。
那这些功能具体又是怎么体现的？

Part 3 树的构建和 Diffing
--------------------
首先明确一点，所谓的 Diffing 算法并不是独立存在的，不是说先把树建完再执行 Diffing 算法找出差距，而是将 Diffing 算法体现在构建过程中对老节点的复用策略。
### 背景：两棵树
在 React 中最多会同时存在两棵 Fiber 树：
*   当前屏幕上显示内容对应的 Fiber 树称为 current Fiber 树
*   正在构建的 Fiber 树称为 workInProgress Fiber 树，我们这里讨论的所有遍历都在这棵树上
当一次协调发起，首先会开一棵新 workInProgress Fiber 树，然后从根节点开始构建并遍历 workInProgress Fiber 树。

![](https://picx.zhimg.com/v2-ab587b626f5a0af15dac6fb9a825feeb_r.jpg?source=1def8aca)

如果构建到一半被打断，current 树还在。
如果构建并提交完成，直接把 current 树丢掉，让 workInProgress Fiber 树成为新的 current 树。
所谓 Diffing 也是在这两棵树之间，如果构建过程中确认新节点对旧节点的复用关系，新旧节点间也会通过 alternate 指针相连。

![](https://picx.zhimg.com/v2-422ba239fe44fa9c8745039cc3b6d6b9_r.jpg?source=1def8aca)


### Diffing 算法思想
正常情况下，完全找到两棵树的差异，是个时间复杂度很高的操作。但 Diffing 算法通过一些假设，权衡了执行开销和完整性。
- **假设一：不同类型的节点元素会有不同的形态**
当节点为不同类型的元素时，React 会拆卸原有节点并且建立起新的节点。举个例子，当一个元素从 a 变成 img，从 Article 变成 Comment，都会触发一个完整的重建流程。
该算法不会尝试匹配不同组件类型的子树。如果你发现你在两种不同类型的组件中切换，但输出非常相似的内容，建议把它们改成同一类型。
- **假设二：节点不会进行跨父节点移动**
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
对每个遍历到的新节点 unitOfWork，取出它关联复用的 current 树节点，称为「current」，然后新旧节点一并传给 beginWork。
这个关联关系是在前面某轮循环执行 beginWork 构造 unitOfWork 时建立的，取决于当时的 Diffing 判断新旧节点是否复用。
所以可能存在 current 为 null 的情况。
```
function beginWork( current: Fiber | null, workInProgress: Fiber): Fiber | null {
  switch (workInProgress.tag) {
    case HostComponent: {
      return updateHostComponent(current, workInProgress);
    }
  }
}
```
beginWork 根据当前节点 tag 做分发，这里的 tag 比较丰富常见的 HostComponent、FunctionComponent、ClassComponent、Fragment 等都在此列。以 updateHostComponent 为例。

```js
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