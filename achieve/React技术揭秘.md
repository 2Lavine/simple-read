> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [react.iamkasong.com](https://react.iamkasong.com/preparation/oldConstructure.html#react15%E6%9E%B6%E6%9E%84%E7%9A%84%E7%BC%BA%E7%82%B9)

### 递归更新的缺点

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。
在上一节中，我们已经提出了解决办法——用**可中断的异步更新**代替**同步的更新**。


---
那么 React15 的架构支持异步更新么？让我们看一个例子：
初始化时`state.count = 1`，每次点击按钮`state.count++`
列表中 3 个元素的值分别为 1，2，3 乘以`state.count`的结果
![](https://react.iamkasong.com/img/v15.png)
中间的是更新步骤
我们可以看到，**Reconciler** 和 **Renderer** 是交替工作的，当第一个`li`在页面上已经变化后，第二个`li`再进入 **Reconciler**。
由于整个过程都是同步的，所以在用户看来所有 DOM 是同时更新的。

如果中途中断更新会怎么样？
注意以下是我们模拟中断的情况，实际上`React15`并不会中断进行中的更新
![](https://react.iamkasong.com/img/dist.png)

当第一个`li`完成更新时中断更新，即步骤 3 完成后中断更新，此时后面的步骤都还未执行。
用户本来期望`123`变为`246`。实际却看见更新不完全的 DOM！（即`223`）
基于这个原因，`React`决定重写整个架构。