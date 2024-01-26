> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7158712727538499598?searchId=20240120202017BD9D5A30E810FAEC4E61)

什么是 CSS-in-JS
=============

CSS-in-JS 允许你直接使用 JavaScript 或者 TypeScript 修改你的 React 组件的样式

```
import styled from '@emotion/styled'

const ErrorMessageRed = styled.div`
  color: red;
  font-weight: bold;
`;

function App() {
  return (
   <div>
    <ErrorMessageRed>
      hello ErrorMessageRed !!
    </ErrorMessageRed>
   </div>
  );
}

export default App;
```

## CSS-in-JS 的类型
**运行时类型的 CSS-in-JS** ，styled-components 和 Emotion 都属于这个类型。
**编译时类型 CSS-in-JS** 这块会在文章末段稍微提及到。


CSS-in-JS优点
----
**1.Locally-scoped styles：** 当我们在裸写 CSS 的时候，很容易就污染到其他我们意想不到的组件。比如我们写了一个列表，每一行的需要加一个内边距和边框的样式。我们可能会写这样的 CSS 代码
CSS-in-JS 就可以通过 **Locally-scoped styles** 来完全解决这个问题。如果你的列表代码这么写的话：

```
<div className={css`
        padding: 0.5rem;
        border: 1px solid #ddd;
    `}>
	...row item...
 </div>
```
这样的话，内边距和边框的样式永远不会影响到其他组件。
> 提示：CSS Modules 也提供了 **Locally-scoped styles**

**2. Colocation：** 
你的 React 组件是写在 `src/components` 目录中的，当你裸写 CSS 的时候，你的 .css 文件可能是放置在 `src/styles` 目录中。随着项目越来越大，你很难明确哪些 CSS 样式是用在哪些组件上，
一个更好的组织代码的方式可能是将相关的代码文件放在同个地方。这种做法成为「共置」
如果你使用 CSS-in-JS，你可以直接在 React 组件内部书写样式，如果组织得好，那么你的项目的可维护性将大大提升。

> 提示：CSS Modules 也提供了「共置」的能力

**3. 在样式中使用 JavaScript 变量：** CSS-in-JS 提供了让你在样式中访问 JavaScript 变量的能力

```
function App(props) {
    const color = "red";
    const ErrorMessageRed = styled.div`
      color: ${props.color || color};
      font-weight: bold;
    `;
    
    return (
        <div>
            <ErrorMessageRed>
              hello ErrorMessageRed !!
            </ErrorMessageRed>
        </div>
    );
}
```

上面的例子展示了，我们可以在 CSS-in-JS 方案中使用 JavaScript 的 const 变量 或者是 React 组件的 props。这样可以减少很多重复代码，当我们需要同时在 JavaScript 和 CSS 两侧定义相同的变量的时候。我们通过这样的能力可以不需要使用 inline styles 这样的方式来完成高度自定义的样式。(inline styles 对性能不是特别友好，当我们有很多相同的样式写在不同的组件的时候)

 CSS-in-JS 缺点
----
1.  **CSS-in-JS 的运行时问题**。
	1. 当你的组件进行渲染的时候，CSS-in-JS 库会在运行时将你的样式代码 ” 序列化” 为可以插入文档的 CSS 。这无疑会消耗浏览器更多的 CPU 性能
2.  **CSS-in-JS 让你的包体积更大了。** 这是一个明显的问题。每个访问你的站点的用户都不得不加载关于 CSS-in-JS 的 JavaScript。Emotion 的包体积压缩之后是 [7.9k](https://link.juejin.cn?target=https%3A%2F%2Fbundlephobia.com%2Fpackage%2F%40emotion%2Freact%4011.10.4 "https://bundlephobia.com/package/@emotion/react@11.10.4") ，而 styled-components 则是 [12.7 kB](https://link.juejin.cn?target=https%3A%2F%2Fbundlephobia.com%2Fpackage%2Fstyled-components%405.3.6 "https://bundlephobia.com/package/styled-components@5.3.6") 。虽然这些包都不算是特别大，但是如果再加上 react & react-dom 的话，那也是不小的开销。
3.  **CSS-in-JS 让 React DevTools 变得难看。** 每一个使用 `css` prop 的 react 元素， Emotion 都会渲染成 `<EmotionCssPropInternal>` 和 `<Insertion>` 组件。如果你使用很多的 `css` prop，那么你会在 React DevTools 看到下面这样的场景
4.  **频繁的插入 CSS 样式规则会迫使浏览器做更多的工作。** 

在 concurrent 渲染模式下，React 可以在渲染之间让出浏览器的控制权。
- 如果你为一个组件插入一个新的 CSS 规则，然后 React 让出控制权，浏览器会检查这个新的规则是否作用到了已有的树上。所以浏览器重新计算了样式规则。
- 然后 React 渲染下一个组件，该组件发现一个新的规则，那么又会重新触发样式规则的计算。
- **实际上 React 进行渲染的每一帧，所有 DOM 元素上的 CSS 规则都会重新计算**。这会非常非常的慢
- 更坏的是，这个问题好像是无解的（针对运行时 CSS-in-JS）。运行时 CSS-in-JS 库会在组件渲染的时候插入新的样式规则，这对性能来说是一个很大的损耗。

性能检测
====
内部序列化渲染 vs. 外部序列化渲染
-------------------

样式序列化指的是 Emotion 将你的 CSS 字符串或者样式对象转化成可以插入文档的纯 CSS 字符串。Emotion 同时也会在序列化的过程中根据生成的存 CSS 字符串计算出相应的哈希值——这个哈希值就是你可以看到的动态生成的类名，比如 `css-an61r6`

在测试前，我预感到这个样式序列化是在 React 组件渲染周期里面完成还是外面完成，将对 Emotion 的性能表现起到比较大的影响。

在渲染周期内完成的代码如下

```
function MyComponent() {
  return (
    <div
      css={{
        backgroundColor: 'blue',
        width: 100,
        height: 100,
      }}
    />
  );
}
```

每次 `MyComponent` 渲染，样式对象都会被序列化一次。如果 `MyComponent` 渲染的比较频繁，重复的序列化将有很大的性能开销

一个性能更好的方案是把样式移到组件的外面，所以序列化过程只会在组件模块被载入的时候发生，而不是每次都要执行一遍。你可以使用 `@emotion/react` 的 `css` 方法

```
const myCss = css({
  backgroundColor: 'blue',
  width: 100,
  height: 100,
});

function MyComponent() {
  return <div css={myCss} />;
}
```

当然，这样使得你无法在样式种获得组件的 props，所以你会错失 CSS-in-JS 的一个主要的卖点。


我们的新样式方案
========

在我们下定决心要移除 CSS-in-JS 之后，剩下的问题就是：我们应该什么方案来代替。我们既想要有裸写 CSS 这样的性能，又想要尽可能保留 CSS-in-JS 的优点。

CSS Modules 其实也是可以提供 locally-scoped styles 和 colocated 这样类似的能力的。并且 CSS Modules 编译成原生 CSS 文件之后，没有运行时的性能开销。

Sass Modules ( 使用 [Sass](https://link.juejin.cn?target=https%3A%2F%2Fsass-lang.com%2F "https://sass-lang.com/") 来写 CSS Modules ) 。你既可以享受 CSS Modules 的 locally-scoped styles 能力，又可以享受 Sass 强大的编译时功能（去除运行时性能开销）。这就是我们会使用 Sass Modules 的一个重要原因。

> 注意：使用 Sass Modules ，你将无法享受到 CSS-in-JS 的第 3 个优点（在 CSS 中使用 JS 变量）。但是你可以使用 `:export` 块将 Sass 代码的常量导出到 JS 代码中。这个用起来不是特别方便，但是会使你的代码更加清晰。

**Utility Classes**
-------------------
比较担心我们团队从 Emotion 切换到 Sass Modules 之后，会在写一些极度常用的样式的时候不是很方便，比如 `display: flex` 。之前我们是这样写的

```
<FlexH alignItems="center">...</FlexH>
```

如果改用 Sass Modules 之后，我们需要创建一个 `.module.scss` 文件，然后写一个 `display: flex` 和 `align-item: center` 。这不是世界末日，但肯定是不够方便的。

为了提升开发体验，我们决定引入一个 Utility Classes。如果你对 Utility Classes 还不是很熟悉，用一句话概括就是，“他们是一些只包含一个 CSS 属性的 CSS 类”。通常情况下，你会在你的元素上使用多个这样的类，通过组合的方式来修改元素的样式。对于上面的这个例子，你可能需要这样写：

```
<div class>...</div>
```

我们已经在新组件上使用 Sass Modules 和 Utility Classes 好几个星期了。我们觉得都不错。它的开发体验跟 Emotion 差不多，但是运行时的性能更加的好。
我们也使用 [typed-scss-modules](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftyped-scss-modules "https://www.npmjs.com/package/typed-scss-modules") 来为 Sass Modules 生成 TypeScript 的类型文件。也许这样做最大的好处就是允许我们定一个帮助函数 `utils()` ，这样我们可以像使用 [classnames](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclassnames "https://www.npmjs.com/package/classnames") 去操作样式。

一些关于 构建时 **CSS-in-JS 方案**
-------------------------
本文主要关注的是 运行时 CSS-in- JS 方案，比如 Emotion 和 styled-components 。
最近，我们也关注到了一些将样式转换是纯 CSS 的构建时 CSS-in-JS 方案。
包括
*   [Compiled](https://link.juejin.cn?target=https%3A%2F%2Fcompiledcssinjs.com%2F "https://compiledcssinjs.com/")
*   [Vanilla Extract](https://link.juejin.cn?target=https%3A%2F%2Fvanilla-extract.style%2F "https://vanilla-extract.style/")
*   [Linaria](https://link.juejin.cn?target=https%3A%2F%2Flinaria.dev%2F "https://linaria.dev/")
这些库的目标是为了提供类似于运行时 CSS-in-JS 的能力，但是没有性能损耗。
目前我还没有在真实项目中使用构建时 CSS-in-JS 方案。

但我想这些方案对比 Sass Modules 大概会有以下的缺点：
*   依然会在组件 mount 的时候完成样式的第一次插入，这还是会使得浏览器重新计算每个 DOM 节点的样式
*   动态样式无法被抽取出来，所以会使用 CSS 变量加上行内样式的方法来替代。过多的行内样式依然会影响性能
*   这些库依然会插入一些特定的组件到项目的 React 树中，依然会导致 React DevTools 的可读性变得比较差
