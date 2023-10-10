> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7251802404877893689?searchId=202308271525500339E8A38274CBF18EF2)

不多废话，正文开始
---------
有两个主要原因导致了这两个 hooks 恶心地向四面八方扩散：
*   缓存（memorize） props，从而防止组件重渲染 (re-render)
*   缓存某些值，从而避免在每次重渲染时执行开销昂贵的计算任务

我们将在下面的文章里仔细审视这两个原因，但第一点是：`useMemo` 和 `useCallback` 的目的到底是什么？

我们为什么需要 useMemo 和 useCallback ？
-------------------------------
答案很简单：在每次**重渲染之间**缓存数据。
如果不使用它们，所有非原始类型的值，如 `array`、`object`，或 `function`，都会在每一次重渲染时被彻底重新创建。


---
如果你需要在每次重渲染时比较这些值，那么缓存它们是很有用的。例子是这样的：

```
const Component = () => {  
  const a = { test: 1 };
  useEffect(() => {    
    // "a" 将会在每次重渲染时被比较
  }, [a]);
  // 你剩下的代码
};
```

在 `Component` 的每次重渲染时， `React` 都会把它与的值与上次渲染时的值做比较. `a` 是一个在 `Component` 内部定义的 `object`，这意味着在每次重渲染时，`a` 都会被完完全全地重新创建 (re-create)。
因此，比较” 重渲染之前的 `a`“和” 重渲染之后的 `a`“，结果都会是 `false`，所以被 `useEffect` 包裹的函数也将会在每次重渲染的过程中触发调用。
为了避免以上结果，我们可以把 `a` 包裹在 `useMemo` 中：

```
const Component = () => {
  // 在每次重渲染之间保存 a
  const a = useMemo(() => ({ test: 1 }), []);

  useEffect(() => {
    // 只有当 a 的值真实发生改变时才会触发
  }, [a]);
  // 你剩下的代码
};
```

现在 `useEffect` 中的方法只有在 `a` 值确实发生变化的时候才会触发（不过在本例中这不会发生）。


---
在这里，需要记住的最重要的一件事是，`useMemo` 和 `useCallback` 只有在**重渲染的过程中**才有用。在初始渲染过程中，它们不仅是无用的，甚至是有害的：它们会让 React 做很多额外的工作。这意味着你的应用在初始渲染过程中会**稍稍更慢**一些。并且，如果你的应用有数百个这些 hooks 分布在各处，那么这些轻微的影响初始渲染的作用就可以被观察到。

缓存 props 以避免重渲染
---------------
这两个 hook最常被用到的一点，就是缓存 props 以避免重渲染。
在以下所有的例子里，这两个 hooks 都 毫无作用。它们让代码变得复杂，拖慢了初始渲染，却没有阻止任何事情（指重渲染）。

1. 把 onClick 包裹在 useCallback 中以避免重渲染

   ```
   const Component = () => {
     const onClick = useCallback(
       () => {    /* do something */  }, []
     );
     return (
       <>
         <button onClick={onClick}>Click me</button>
        ... // 其他组件  
       </>  
     );
   };
   ```
2. 把 value 包裹在 useMemo 中，因为它是被缓存的 onClick 的依赖：

   ```
   const Item = ({ item, onClick }) => <button onClick={onClick}>
     {item.name}
   </button>;
   const Component = ({ data }) => {
     const value = useMemo(() => ({ a: someStateValue }), [someStateValue]);
     const onClick = useCallback(() => {    console.log(value);  }, [value]);
     return (
       <>
         {data.map((d) => (<Item item={d} onClick={onClick} />))}
       </>
     );
   };
   ```

为什么一个组件会重渲染它自己？
---------------
当 state 或者 prop 发生变化的时候，组件就会重渲染自己
但这不意味着如果 prop 没有变化（比如，被缓存了），那组件就不会重渲染。
因为还有一个重要的原因会导致组件重渲染：**当组件的父组件重渲染！**
或者说，如果我们从相反的角度考虑：当一个组件重渲染它自己的时候，它也会同时重渲染它的 children。看一下下面的代码示例：

```
const App = () => {
  const [state, setState] = useState(1);
  return (
    <div class>
      <button onClick={() => setState(state + 1)}>
        click to re-render {state}
      </button>
      <br />
      <Page />
    </div>
  );
};
```

`App` 组件有一些 state，也有一些 children，包括 `Page` 组件。
button 被点击的时候，State 会变化，它会导致 App 的重渲染，并且会触发它重渲染它所有的 children，包括 `Page` 组件。在这过程中 `Page` 组件甚至没有 props！但是当 App 重渲染的时候， Page 组件依旧会重渲染，并连同重渲染它内部的 Item 组件。


## 避免子组件不必要的渲染
我们知道当一个组件重渲染它自己的时候，它也会同时重渲染它的 children
唯一去打断这链条的办法，是去缓存组件内的子组件。
我们能够用 `useMemo` 做到这些，更好的方法则是使用 [React.memo](https://link.juejin.cn?target=https%3A%2F%2Flegacy.reactjs.org%2Fdocs%2Freact-api.html%23reactmemo "https://legacy.reactjs.org/docs/react-api.html#reactmemo") 工具函数。
只有当组件被包裹在其以内时，React 才会在重渲染之前先停下来检查一下 props 是否产生了变化。
这样缓存一个组件：
```
const Page = () => <Item />;
const PageMemoized = React.memo(Page);
```
在一个包含 state 的 App 中使用它：
```
const App = () => {
  const [state, setState] = useState(1);
  return (
    ... // same code as before
    <PageMemoized />
  );
};
```
**只有**在以上场景中，props 是否被缓存才是重要的。


---
让我们想象 `Page` 组件存在一个 `onClick` prop，它接收一个函数。如果我在不缓存这个函数的情况下，把它传递给 `Page`，会发生什么呢？
```
const App = () => {
  const [state, setState] = useState(1);
  const onClick = () => {
    console.log('Do something on click');
  };
  return (
    // 不管 onClick 有没有缓存，page 都会重渲染
    <Page onClick={onClick} />
  );
};
```
`App` 会重渲染，React 会在 App 的 children 中找到 `Page` 组件，并且重渲染它。`onClick` 是否包裹在 `useCallback` 中并不重要。

那么如果我们把 `Page` 组件缓存起来了呢？
```
const PageMemoized = React.memo(Page);
const App = () => {
  const [state, setState] = useState(1);
  const onClick = () => {
    console.log('Do something on click');
  };
  return (
    // 因为 onClick 没有缓存，PageMemoized 「将会」重渲染
    <PageMemoized onClick={onClick} />
  );
};
```

`App` 会重渲染，React 会在它的 children 中发现 `PageMemoized` 组件，并意识到它被 `React.memo` 方法包裹，这会打断重渲染链条，React 会事先检查这个组件的 props 是否有变化。
在这个例子里，既然 `onClick` 是一个未被缓存的函数，props 比较的结果就会是 `false`，那么 `PageMemoized` 组件就会重渲染它自己。


什么时候缓存 props有意义
---
我们可以得出结论，只有在唯一的一种场景下，缓存 props 才是有意义的：
**当组件的每一个 prop，以及组件本身被缓存的时候**。

如果组件代码里有以下情形，我们可以毫无心理负担地删掉 `useMemo` 和 `useCallback`：
*   它们被作为 attributes ，直接地或作为依赖树的上层，被传递到某个 DOM 上
*   它们被作为 props，直接地或作为依赖树的上层，被传递到某个未被缓存的组件上
*   它们被作为 props，直接地或作为依赖树的上层，被传递到某个组件上，而那个组件至少有一个 prop 未被缓存


在每次重渲染时避免开销巨大的运算
----------------

`useMemo` 最主要的作用，就是在每次的渲染过程中避免开销巨大的运算。
在叙述中，并没有提到什么算是 “开销巨大” 的运算。

### 什么是开销巨大的运算？
考虑我们有一个国家列表（大概有 250 个元素），并且我们希望在页面上展示它们，并且允许用户去执行排序操作。

```
const List = ({ countries }) => {
  // sorting list of countries here
  const sortedCountries = orderBy(countries, 'name', sort);
  return (
    <>
      {
        sortedCountries.map((country) => (
          <Item country={country} key={country.id} />
        ))
      }
    </>
  );
};
```

使用我们常用的 performance api 就行了。来看看给 250 个元素排序属于开销巨大的操作么，

```
const List = ({ countries }) => {
  const before = performance.now();
  const sortedCountries = orderBy(countries, 'name', sort);
  // this is the number we're after
  const after = performance.now() - before;
  return (    // same  )
};
```

最终结果如果不缓存的话给 250 个元素排序耗时 少于 2 毫秒。 作为比较，渲染这个列表——仅仅是原生的按钮上带文字——就消耗了 20 毫秒。在实际场景中，数组往往比示例中的更小，同时渲染的内容比示例中的更复杂，因此更慢。所以总的来说「计算」与「渲染」之间的耗时往往超过 10 倍。
因此缓存js 的 order 排序，不如缓存需要渲染的组件


---
我们更应该缓存的是实际上是最耗时的计算——重渲染并更新组件。像下面这样：

```
const List = ({ countries }) => {
  const content = useMemo(() => {
    const sortedCountries = orderBy(countries, 'name', sort);
    return sortedCountries.map((country) =>
      <Item country={country} key={country.id} />
    );
  }, [countries, sort]);
  return content;
};
```

以上 `useMemo` 把大约 20ms 的重渲染时间，减少了不到 2ms（也就是 18ms 左右）。
因此我把把 useMemo 更多用在渲染组件上，而不是记录 JavaScript 的计算结果


---
考虑以上事实，我想说的关于缓存” 开销巨大 “操作的一条准则就是：除非你真的要搞类似大数阶乘，疯狂递归，大素数分解这样的操作，否则就在纯 javascript 操作中把 `useMemo` 删掉吧。重渲染元素才是你的瓶颈。请只在渲染树的重要部分使用 `useMemo`。


### 为什么要避免不必要的useMemo缓存
把所有东西缓存起来不是更好吗？哪怕只让重渲染速度提升了 2ms，累加起来就很可观了呀。
因为但是如果我们使用 `useMemo`，在初始渲染过程中 React 就需要缓存其值了——**这会产生叠加效应**！在初始渲染让你的应用第一次呈现在屏幕前的过程中，当前页面的**每一个**元素都会经历这一过程，这将导致 10~20 ms，

参与初始渲染的是整个页面相关的组件，参与重渲染的只是局部的组件，两者不是一个数量级。参与初始渲染的大量组件，被 `useMemo` 和 `useCallbak` 拖慢所产生的叠加明显，远远比参与重渲染的少量组件，被 `useMemo` 和 `useCallbak`所优化所产生的叠加效应来的明显！

