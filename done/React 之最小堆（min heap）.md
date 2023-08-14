> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7168283003037155359)

 

React 采用原因
----------

React 的任务列表（taskQueue）用的就是最小堆。
React 为什么采用最小堆结构呢？
React 将更新任务拆成多个小任务，每个小任务的数据结构是一个带着 expirationTime 的对象，expirationTime 表示这个任务的过期时间，expirationTime 越小就表示过期时间越近，该任务的优先级就越高，取出最小值就相当于取出优先级最高的任务。


插入过程（push）
----------
二叉堆的插入过程：
当插入一个新节点的时候，我们会在二叉堆的最后添加，然后将其 “上浮” 到正确位置。举个例子：
\>\>\> 1
-----

```
const parentIndex = (index - 1) >>> 1;
```

这是用来获取父节点的索引值的。
\>\>1 是有符号右移位操作符
\>\>\> 11 是无符号右移位操作符

删除过程（pop）
---------

现在我们来看删除过程，因为我们删除的是根节点，它的具体流程是：

1.  取出最后一个节点，替换掉根节点
2.  将节点 “下沉” 到正确位置

halfLength
----------

siftDown 的实现中，我认为最有意思是在 `halfLength` 这里：
```
const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {//...}

```
那为什么只用比较一半就可以了呢？如果我们尝试自己去画几个最小堆，发现也确实如此，完全不用全部比较一遍。 
我们可以这样想： 假设父节点的 index 为 x，那么左子节点的 index 为 2x + 1，右子节点的 index 为 2x + 2，每一次 shiftDown，index 的最大变化就是 2x + 2，而 2x + 2 最大只能等于 length - 1，那么：

```
因为 2x + 2 <= length - 1 
所以 x <= length/2 - 1.5

我们知道 y >>> 1 ，在 y 为正数的情况下，计算的结果为 y/2 - 0.5 或者 y/2

如果 x <= length/2 - 1.5
那么肯定 x < length/2 - 0.5 以及 x < length/2
所以肯定 x < length >>> 1

```