

vue 2,3生命周期比较
===================

> Vue2 的生命周期主要是：
> 1.  beforeCreate
> 3.  beforeMount
> 5.  beforeUpdate
> 7.  beforeDestroy

而 `vue3` 在 `vue2` 的基础上进行了一些改变，主要是针对最后两个生命周期：

> beforeDestroy -> beforeUnmount
> Destoryed -> Unmounted

 `options API` 和 `composition API` 生命周期不同：

> `composition API` 提供了 `setup` 函数作为入口函数，替换了 `beforeCreate` 和 `created` 这两个生命周期钩子。
> 所以在实际开发中，我们可以简单的把 `setup` 理解为 `created` 进行使用。



## 我们最常用的 `created` 和 `mounted`。

在 `created` 中，因为组件实例已经处理好了所有与状态相关的操作，所以我们可以在这里 **获取数据、调用方法、`watch`、`computed`** 都可以。

而 `mounted` 主要是在 `DOM` 挂载之后被调用，所以如果我们想要获取 `DOM` 的话，那么需要在 `mounted` 之后进行。

## beforeUpdate和updated

其中 `beforeUpdate` 表示 **数据变化后，视图改变前**。`updated` 表示 **数据变化后，视图改变后**。

那么由这两个生命周期我们可以知道，`vue` 从数据变化到视图变化，其实是需要经历一定的时间的。
原因是因为 `vue` 在内部通过 `queue` 队列的形式在更新视图（`packages/runtime-core/src/scheduler.ts`）：

![[../_resources/vue 的生命周期/a566158942b5d303f0ce5b7da990cc5b_MD5.webp]]

这个逻辑还被体现在了 `nextTick` 这个方法上（`packages/runtime-core/src/scheduler.ts`）：

![[../_resources/vue 的生命周期/111f3e8931daac24cb5e08c83f826adf_MD5.webp]]

而这种更新本质上是一种异步的更新形式，
因为这种异步更新形式（微任务）的存在，才导致出现 **数据更新 -> 视图更新** 出现延迟的原因。

![[../_resources/vue 的生命周期/ea410c00f19456bce925bcd15cd87472_MD5.webp]]

因为它的异步更新是以微任务的形式呈现的，这也是为什么很多时候我们可以通过 `setTimeout` 代替 `nextTick` 的原因。




## 从源码看生命周期
从 `vue` 的源码中来看的话，整个组件的生命周期，其实是被分为两大部分的（`packages/runtime-core/src/renderer.ts`）：

1.  `isMounted` 之前
2.  `isMounted` 之后

![[../_resources/vue 的生命周期/b15b54052f6b34b4a7f055e7d530a280_MD5.webp]]

`isMounted` 之前表示：视图被挂载之前。因为组件的渲染本质上是 `render` 渲染了所有的 `subVNode`，所以在 `isMounted` 之前，会得到一个 `subTree` 来进行渲染。

![[../_resources/vue 的生命周期/f2386d8dbc75425de7ad80927523b6ae_MD5.webp]]

`isMounted` 之后表示：视图全部被渲染完成了，也就是 `mounted` 之后。着这个时候其实就是 `beforeUpdate` 和 `updated` 的活跃时期了。
