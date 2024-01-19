> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7155673959084589070?searchId=2024011909074637716191FEDA6F0DC2CF)

大家好，我卡颂。

在 10 月 13 日的 [first-class-support-for-promises RFC](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Facdlite%2Frfcs%2Fblob%2Ffirst-class-promises%2Ftext%2F0000-first-class-support-for-promises.md "https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md") 中，介绍了一种新的`hook` —— `use`。

`use`什么？就是`use`，这个`hook`就叫`use`。这也是第一个：

*   可以在条件语句中书写的`hook`
    
*   可以在其他`hook`回调中书写的`hook`
    

本文来聊聊这个特殊的`hook`。

欢迎加入[人类高质量前端框架研究群](https://juejin.cn/user/1943592291009511/pins "https://juejin.cn/user/1943592291009511/pins")，带飞

use 是什么
-------

我们知道，`async`函数会配合`await`关键词使用，比如：

```
async function load() {
  const {name} = await fetchName();
  return name;
}
```

类似的，在`React`组件中，可以配合`use`起到类似的效果，比如：

```
function Cpn() {
  const {name} = use(fetchName());
  return <p>{name}</p>;
}
```

可以认为，`use`的作用类似于：

*   `async await`中的`await`
    
*   `generator`中的`yield`
    

`use`作为**读取异步数据的原语**，可以配合`Suspense`实现**数据请求、加载、返回**的逻辑。

举个例子，下述例子中，当`fetchNote`执行异步请求时，会由包裹`Note`的`Suspense`组件渲染**加载中状态**。

当请求成功时，会重新渲染，此时`note`数据会正常返回。

当请求失败时，会由包裹`Note`的`ErrorBoundary`组件处理失败逻辑。

```
function Note({id}) {
  const note = use(fetchNote(id));
  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
    </div>
  );
}
```

其背后的实现原理并不复杂：

1.  当`Note`组件首次`render`，`fetchNote`发起请求，会`throw promise`，打断`render`流程
    
2.  以`Suspense fallback`作为渲染结果
    
3.  当`promise`状态变化后重新触发渲染
    
4.  根据`note`的返回值渲染
    

实际上这套**基于 promise 的打断、重新渲染流程**当前已经存在了。`use`的存在就是为了替换上述流程。

与当前`React`中已经存在的上述 **promise 流程**不同，`use`仅仅是个**原语**（`primitives`），并不是完整的处理流程。

比如，`use`并没有**缓存 promise** 的能力。

举个例子，在下面代码中`fetchTodo`执行后会返回一个`promise`，`use`会消费这个`promise`。

```
async function fetchTodo(id) {
  const data = await fetchDataFromCache(`/api/todos/${id}`);
  return {contents: data.contents};
}

function Todo({id, isSelected}) {
  const todo = use(fetchTodo(id));
  return (
    <div className={isSelected ? 'selected-todo' : 'normal-todo'}>
      {todo.contents}
    </div>
  );
}
```

当`Todo`组件的`id prop`变化后，触发`fetchTodo`重新请求是符合逻辑的。

但是当`isSelected prop`变化后，`Todo`组件也会重新`render`，`fetchTodo`执行后会返回一个新的`promise`。

返回新的`promise`不一定产生新的请求（取决于`fetchTodo`的实现），但一定会影响`React`接下来的运行流程（比如不能命中性能优化）。

这时候，需要配合`React`提供的`cache API`（同样处于`RFC`）。

下述代码中，如果`id prop`不变，`fetchTodo`始终返回同一个`promise`：

```
const fetchTodo = cache(async (id) => {
  const data = await fetchDataFromCache(`/api/todos/${id}`);
  return {contents: data.contents};
});
```

use 的潜在作用
---------

当前，`use`的应用场景局限在**包裹 promise**。

但是未来，`use`会作为客户端中处理异步数据的主要手段，比如：

*   处理`context`

`use(Context)`能达到与`useContext(Context)`一样的效果，区别在于前者可以在条件语句，以及其他`hook`回调内执行。

*   处理`state`

可以利用`use`实现新的原生状态管理方案：

```
const currentState = use(store);
const latestValue = use(observable);
```

为什么不使用 async await
------------------

本文开篇提到，`use`原语类似`async await`中的`await`，那为什么不直接使用`async await`呢？类似下面这样：

```
// Note 是 React 组件
async function Note({id, isEditing}) {
  const note = await db.posts.get(id);
  return (
    <div>
      <h1>{note.title}</h1>
      <section>{note.body}</section>
      {isEditing ? <NoteEditor note={note} /> : null}
    </div>
  );
}
```

有两方面原因。

一方面，`async await`的工作方式与`React`客户端处理异步时的逻辑不太一样。

当`await`的请求`resolve`后，调用栈是从`await`语句继续执行的（`generator`中`yield`也是这样）。

而在`React`中，更新流程是从根组件开始的，所以当数据返回后，更新流程是从根组件从头开始的。

改用`async await`的方式势必对当前`React`底层架构带来挑战。最起码，会对性能优化产生不小的影响。

另一方面，`async await`这种方式接下来会在`Server Component`中实现，也就是异步的服务端组件。

服务端组件与客户端组件都是`React`组件，但前者在服务端渲染（`SSR`），后者在客户端渲染（`CSR`），如果都用`async await`，不太容易从代码层面区分两者。

总结
--

`use`是一个**读取异步数据的原语**，他的出现是为了规范`React`在客户端处理异步数据的方式。

既然是原语，那么他的功能就很底层，比如不包括请求的缓存功能（由`cache`处理）。

之所以这么设计，是因为`React`团队并不希望开发者直接使用他们。这些原语的受众是`React`生态中的其他库。

比如，类似`SWR`、`React-Query`这样的请求库，就可以结合`use`，再结合自己实现的请求缓存策略（而不是使用`React`提供的`cache`方法）

各种状态管理库，也可以将`use`作为其底层状态单元的容器。

值得吐槽的是，`Hooks`文档中`hook的限制`那一节恐怕得重写了。