> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/neoveee/article/details/95873911)

最近在团队内部 review 代码的过程中，引发了关于受控组件设计的一些思考。

关于受控组件，在刚接触 React 开发的时候，就了解到了这个概念，大体的实现就是给组件提供一个 value， 一个 onChange，value 用于渲染当前的 UI 视图，在用户触发操作，

需要更新 value 的时候，组件调用 onChange，由上层组件负责更新状态。整体设计的一个关键点就是：

受控组件内部不维护任何相关的状态，状态都由外部传入  
对于状态的更新，提供 onChange 回调  
组件的这种设计方式，对于对接方来说，有付出，也有收益，

付出，就是指顶层组件需要维护相关的状态，并定义状态更新的回调（其实这也算不上付出。。。）

收益，就是指组件的扩展性和灵活性提高了，对于组件来说，我给你什么，你就渲染什么，而且状态由顶层的组件维护，在任何的时刻，都可以监视到

当前的状态，对于一些需要扩展验证规则，以及其他特殊限制的情况，再适合不过。

（最近 Beisen 开发了一批新的组件，在对接过程中，已经体验过非受控组件的痛苦了）

所以，在提供一些模块，供其他人对接的情况下，尽量将组件设计为受控模式，并统一提供 value 与 onChange 回调。

当状态更新时，由组件内部处理状态，并传给 onChagne 回调。

这种设计，对于一些状态单一的组件来讲，是非常合适的。如果需要提供的是一个比较复杂的组件，有多个状态，比如 A B C 三个状态的情况，这时候，我们固然可以将

ABC 三个状态都放到 value 中，并定义统一的 onChange 回调，接受更新后的状态。但是如果对于 A 的变化，外部需要做一些额外的逻辑，如果仅仅通过一个 onChange 来实现，

可能会增加无谓的负责度。所以在组件设计上，我们就可以扩展一些回调出来，比如 onChangeA 等等，并且可以设计为可选参数。

下面来看一下，代码重构前与重构后的对接方式：

重构前：

![](https://img-blog.csdnimg.cn/20190715201631394.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25lb3ZlZWU=,size_16,color_FFFFFF,t_70)

重构后：

![](https://img-blog.csdnimg.cn/20190715201641587.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L25lb3ZlZWU=,size_16,color_FFFFFF,t_70)

下面是 review 过程中发现的其他一些问题：

### 数据层与 View 层解耦：

在组件的实现设计上，我抽象了 view 与 数据层，数据只负责对元数据过滤，view 负责渲染，然后写出了如下的代码：

```
<SCApp>
	<DataParser metaData={metaData} render={renderView} />
 </SCApp>
```

DataParser 就是数据处理层，这里他接受了一个 render 方法。这个设计其实是非常不合理的，作为数据处理层，其实就是函数，作为函数，就有输入和输出。很明显，这的输入就是未加工的元数据，

输出就是 加工好的元数据。 他不需要关心 UI 视图的渲染结果，参数设计上，不应该接受 render 方法。

所以，这里将 DataParse 层作为一个元数据处理的 hooks 更加合理，具体重构后的代码可以见 项目

### UI 数据与业务数据分离

由于任务列表是一个支持展开收起，显示子列表的结构，所以在设计组件的状态数据时，我当时的思路是这样子的：

```
export interface IDataPoolItem {
  metaData: {
    bizData: IBizData;
    row: Row;
  };
  childrenIds: string[];
  hasChildren: boolean;
  pid: string;
  isOpen: boolean;
}
```

metaData 就是组件渲染需要的一些元数据信息，对于展开和收起，在每一个数据上都设计了一个 isOpen 字段，标识是否是展开和收起。

这样设计，错是没有错，功能也可以实现，但或许不是最合理的。

首先，我没发一眼看到当前所有展开的节点，二是，如果我需要将所有的节点收起，那就需要先遍历找出所有展开的节点，然后将其 isOpen 置为 false。

光这两点，就能看出不合理的地方了。

在这里的状态设计上，没有遵守的一个原则就是，UI 与 业务数据分离。 节点的展开收起是一个 UI 状态，与其他的业务数据不同，我们需要对这种类型的数据做单独维护和处理，

所以，新开辟一个数组，存放所有展开 / 收起节点的 ID，是再合适不过的了