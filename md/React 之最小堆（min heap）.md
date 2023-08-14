> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7168283003037155359)

> 本文为稀土掘金技术社区首发签约文章，14 天内禁止转载，14 天后未获授权禁止转载，侵权必究！
> 
> 本篇是 React 基础与进阶系列第 11 篇，[关注专栏](https://juejin.cn/column/7142674773930147853 "https://juejin.cn/column/7142674773930147853")

二叉树
---

二叉树（Binary tree），每个节点最多只有两个分支的树结构。通常分支被称作 “左子树” 或“右子树”。二叉树的分支具有左右次序，不能随意颠倒。

完全二叉树
-----

在一颗二叉树中，若除最后一层外的其余层都是满的，并且最后一层要么是满的，要么在右边缺少连续若干节点，则此二叉树为完全二叉树（Complete Binary Tree）

以下都是完全二叉树：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80f84d9e6d8e45a4b6be7fe3ab9a440d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

二叉堆
---

二叉堆（binary heap）是一种特殊的堆，二叉堆是完全二叉树或者是近似完全二叉树。

二叉堆满足堆特性：父节点的键值总是保持固定的序关系于任何一个子节点的键值，且每个节点的左子树和右子树都是一个二叉堆。

当父节点的键值总是大于或等于任何一个子节点的键值时为 “最大堆”（max heap）。

当父节点的键值总是小于或等于任何一个子节点的键值时为 “最小堆”（min heap）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de9b9f79b62b4e37bfb90e0691bd195f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

最小堆
---

今天我们只讲最小堆（min heap）。因为 React 的任务列表（taskQueue）用的就是最小堆。

React 用的是数组结构表示的最小堆，一张图带你明白最小堆如何映射为数组：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7f77f61ced94053aa0a1851459c9375~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

React 采用原因
----------

React 为什么采用最小堆结构呢？

这是因为在最小堆结构中，最小值就在第一个，React 可以快速的取出最小值。

React 为什么要取出最小值而不是最大值呢？我们可以这样设想，React 将更新任务拆成多个小任务，每个小任务的数据结构是一个带着 expirationTime 的对象，expirationTime 表示这个任务的过期时间，expirationTime 越小就表示过期时间越近，该任务的优先级就越高，取出最小值就相当于取出优先级最高的任务。

React 函数实现
----------

React 的最小堆涉及 5 个函数：

1.  push，往最小堆插入新节点
2.  pop，删除根节点，就是那个最小的值
3.  siftUp，上浮，不停地交换节点和父节点
4.  shiftDown，下沉，不停地交换节点和子节点
5.  peek，获取根节点，也就是数组的第一个元素，也就是优先级最高的那个任务

接下来我们进行详细的讲解。

插入过程（push）
----------

我们先讲二叉堆的插入过程：

当插入一个新节点的时候，我们会在二叉堆的最后添加，然后将其 “上浮” 到正确位置。举个例子：

我们尝试在下面这个二叉堆中，插入新节点，它的值为 1，我们会将这个值与父节点的值进行对比，如果小于父节点，就交换两个节点，就这样不断比较上浮，直到父节点比它小

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7791e0fab58e46fba8b310b3488bcc7e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

React 的实现代码如下：

```
// 源码地址：https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js
function push(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    // 获取父节点的索引位置
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // 如果父节点更大，就交换位置
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // 直到父节点更小，就退出
      return;
    }
  }
}

function compare(a, b) {
  // 首先比较 sortIndex，其次是 id
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// 测试代码
let taskQueue = [{sortIndex: 2}, {sortIndex: 7}, {sortIndex: 5}, {sortIndex: 12}, {sortIndex: 22}, {sortIndex: 17}];
push(taskQueue, {sortIndex: 1})
console.log(JSON.stringify(taskQueue))
复制代码
```

>>> 1
-----

这个实现过程中，可能不熟悉的是这句：

```
const parentIndex = (index - 1) >>> 1;
复制代码
```

这是用来获取父节点的索引值的。

我们先看下 `>>>` 这个运算符，引用 [MDN 的介绍](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FOperators%2FUnsigned_right_shift "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift")：

> 无符号右移运算符（>>>）（零填充右移）将左操作数计算为无符号数，并将该数字的二进制表示形式移位为右操作数指定的位数，取模 32。向右移动的多余位将被丢弃，零位从左移入。其符号位变为 0，因此结果始终为非负数。与其他按位运算符不同，零填充右移返回一个无符号 32 位整数。

看起来有些复杂？没关系，我们直接讲过程，我们以 `5 >>> 1`为例：

首先将 `5` 转为 32 位的二进制数：`00000000000000000000000000000101`。

`>>> 1`表示将该二进制向右移动 1 位，向右移动出去的被丢弃，左边部零，于是变成了`0000000000000000000000000000010`，换算成十进制，就是 `2`，所以 `5 >>> 1`的结果就是 `2`。

我们再举一个例子，`4 >>> 1`，4 是 `00000000000000000000000000000101`，向右移动一位变成 `0000000000000000000000000000010`，换算成十进制，就是 `2`，所以 `4 >>> 1`的结果也是 `2`。

我们再试几个例子：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4afc1c5d363242a2abd37205fbfb6141~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

所以你可以简单理解为，`x >>> 1`表示的就是除以 `2` 后取整。

我们再看下最小堆和数组的映射图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9739f3b7f084b90a36b539f03eacf27~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

你看父节点的索引值是不是就是 `(子节点的索引值 - 1) / 2 后取整`。

删除过程（pop）
---------

现在我们来看删除过程，因为我们删除的是根节点，它的具体流程是：

1.  取出最后一个节点，替换掉根节点
2.  将节点 “下沉” 到正确位置

我们举个例子：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/884310eeba4f406e868ec62fc57981ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

现在我们要删除根节点 2 ，我们将最后一个节点 25，替换掉根节点 2，然后将新的根节点 25，与两个子节点进行比较，将节点与更小的那个子节点进行交换，然后这样不断比较下沉，直到子节点都比它大。

它的具体实现如下：

```
// 源码地址：https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js
function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  // JavaScript 的 pop 方法删除并返回数组的最后一个元素
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];
    
    // 如果 left 比 node 小
    if (compare(left, node) < 0) {
      // 如果 right 比 left 还小，说明 right 最小，right 与 node 交换
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      }
      // 说明 left 最小，left 与 node 交换
      else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    }
    // 如果 left node 大，但 right 比 node 小，right 与 node 交换
    else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // 子元素都比 node 大
      return;
    }
  }
}

// 示例代码
let taskQueue = [{sortIndex: 2}, {sortIndex: 5}, {sortIndex: 7}, {sortIndex: 12}, {sortIndex: 22}, {sortIndex: 17}, {sortIndex: 25}];
pop(taskQueue)
// [{"sortIndex":5},{"sortIndex":12},{"sortIndex":7},{"sortIndex":25},{"sortIndex":22},{"sortIndex":17}]
console.log(JSON.stringify(taskQueue))
复制代码
```

halfLength
----------

siftDown 的实现中，我认为最有意思是在 `halfLength` 这里：

```
const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {//...}
复制代码
```

实际上 React 这里之前直接用的 `index < length` 而非 `index < halfLength`，我们可以查看当时的[提交记录](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fcommit%2F316aa368654427270a53543cd3f4952746374596 "https://github.com/facebook/react/commit/316aa368654427270a53543cd3f4952746374596")：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c774c0b548f44b33b7d014c0400c9594~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

那为什么只用比较一半就可以了呢？如果我们尝试自己去画几个最小堆，发现也确实如此，完全不用全部比较一遍。 如果非要从算术的角度来看的话，我们可以这样想： 假设父节点的 index 为 x，那么左子节点的 index 为 2x + 1，右子节点的 index 为 2x + 2，每一次 shiftDown，index 的最大变化就是 2x + 2，而 2x + 2 最大只能等于 length - 1，那么：

```
因为 2x + 2 <= length - 1 
所以 x <= length/2 - 1.5

我们知道 y >>> 1 ，在 y 为正数的情况下，计算的结果为 y/2 - 0.5 或者 y/2

如果 x <= length/2 - 1.5
那么肯定 x < length/2 - 0.5 以及 x < length/2
所以肯定 x < length >>> 1
复制代码
```

peek
----

除此之外，还有一个 peek 方法，获取数组的第一个元素：

```
function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}
复制代码
```

好了，React 的 [SchedulerMinHeap.js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Freact%2Fblob%2Fmain%2Fpackages%2Fscheduler%2Fsrc%2FSchedulerMinHeap.js "https://github.com/facebook/react/blob/main/packages/scheduler/src/SchedulerMinHeap.js") 这个文件的所有代码就正式讲完了，它是一个几乎完全独立的实现，当然 Scheduler 也是独立的，下篇我们接着讲 Scheduler。

React 系列
--------

1.  [React 之 createElement 源码解读](https://juejin.cn/post/7160981608885927972 "https://juejin.cn/post/7160981608885927972")
2.  [React 之元素与组件的区别](https://juejin.cn/post/7161320926728945701 "https://juejin.cn/post/7161320926728945701")
3.  [React 之 Refs 的使用和 forwardRef 的源码解读](https://juejin.cn/post/7161719602652086308 "https://juejin.cn/post/7161719602652086308")
4.  [React 之 Context 的变迁与背后实现](https://juejin.cn/post/7162002168529027079 "https://juejin.cn/post/7162002168529027079")
5.  [React 之 Race Condition](https://juejin.cn/post/7163202327594139679 "https://juejin.cn/post/7163202327594139679")
6.  [React 之 Suspense](https://juejin.cn/post/7163934860694781989 "https://juejin.cn/post/7163934860694781989")
7.  [React 之从视觉暂留到 FPS、刷新率再到显卡、垂直同步再到 16ms 的故事](https://juejin.cn/post/7164394153848078350 "https://juejin.cn/post/7164394153848078350")
8.  [React 之 requestAnimationFrame 执行机制探索](https://juejin.cn/post/7165780929439334437 "https://juejin.cn/post/7165780929439334437")
9.  [React 之 requestIdleCallback 来了解一下](https://juejin.cn/post/7166547963517337614 "https://juejin.cn/post/7166547963517337614")
10.  [React 之从 requestIdleCallback 到时间切片](https://juejin.cn/post/7167335700424196127 "https://juejin.cn/post/7167335700424196127")

React 系列的预热系列，带大家从源码的角度深入理解 React 的各个 API 和执行过程，全目录不知道多少篇，预计写个 50 篇吧。