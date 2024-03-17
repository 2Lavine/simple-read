> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7213744681392783417?searchId=20240207110831E23CB356F76D9A7F1847)

> 本文翻译自文章 [useSyncExternalStore First Look](https://link.juejin.cn?target=https%3A%2F%2Fjulesblom.com%2Fwriting%2Fusesyncexternalstore "https://julesblom.com/writing/usesyncexternalstore")，本文主要介绍 useSyncExternalStore 的应用场景。

useSyncExternalStore 是 React 18 引入的一个 hook。起初我以为它主要用于第三方库，比如 @tanstack/rect-query、Jotai、Zustand、Redux 等。在 React 官方文档中，将它和 useInsertionEffect 一起被称为 "library hooks（库 hooks）"。

> 以下 hooks 是为库作者提供的，用于将库深入集成到 React 模型中，通常不会在应用程序代码中使用。 - [Hooks Reference](https://link.juejin.cn?target=https%3A%2F%2Fzh-hans.reactjs.org%2Fdocs%2Fhooks-reference.html%23library-hooks "https://zh-hans.reactjs.org/docs/hooks-reference.html#library-hooks")

在 React 的 changelog 中也同样在强调它是为第三方库服务的。

> 添加 useSyncExternalStore 以帮助外部 store 库与 React 集成 - [React v18.0 Changelog](https://link.juejin.cn?target=https%3A%2F%2Freactjs.org%2Fblog%2F2022%2F03%2F29%2Freact-v18.html%23react "https://reactjs.org/blog/2022/03/29/react-v18.html#react")

我自己并不写工具库，因此之前也没有关注过 useSyncExternalStore。直到有一天，我看到这条[推文](https://link.juejin.cn?target=https%3A%2F%2Ftwitter.com%2Fsebastienlorber%2Fstatus%2F1615329010761842689 "https://twitter.com/sebastienlorber/status/1615329010761842689")：

> 🔴 在 React SSR 中，不能写这样的代码：
> 
> ```
> if (typeof window !== "undefined") {
>   return localStorage.getItem("xyz")
> }
>   return fallback;
> })
> ```
> 
> 🐛 会导致在 hydration 时出问题
> 
> ➡️ 正确的方式是使用 [useSyncExternalStore](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore "https://react.dev/reference/react/useSyncExternalStore") 来防止 hydration 时出现错误
> 
> ![](https://s2.loli.net/2023/03/19/lza9WdBLPC4ne2k.jpg)

这让我感到很好奇，于是阅读了 React 文档中 “[Subscribing to a browser API](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore "https://react.dev/reference/react/useSyncExternalStore")” 的那一章节，其中有这样一句话：

> 添加 useSyncExternalStore 的另一个原因是，当您使用浏览器的某些值时，但这些值可能会在将来某个时刻发生变化。 -[useSyncExternalStore – Subscribing to a browser API](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore%23subscribing-to-a-browser-api "https://react.dev/reference/react/useSyncExternalStore#subscribing-to-a-browser-api")

原来是我狭隘了，没有意识到 “外部 store” 不仅仅是指 “第三方库”。页面运行的宿主环境 — 或者更简单地说，浏览器 — 也可以算作是存储 state 的外部 store。我们也会在 React 应用程序中访问那些位于 window 对象上的值，这时就需要 useSyncExternalStore 为我们提供一些帮助。

为什么不是 useEffect 或 useState
--------------------------

很多人都会有这样的疑问，为什么要使用这么麻烦的方式？使用 useState & useEffect 组合读取浏览器中的 state 会有什么问题？关于这个问题，在 React 官方文档中只是简单提了一下，并没有解释真正的原因：

> [浏览器提供的值] 可能随时会发生变化，但是 React 却感知不到它的变化，因此您需要使用 useSyncExternalStore - [useSyncExternalStore – Subscribing to a browser API](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore%23subscribing-to-a-browser-api "https://react.dev/reference/react/useSyncExternalStore#subscribing-to-a-browser-api")

其本质原因，是与 React 18 的运行机制有关，与它最新的特性[并发渲染（concurrent rendering）](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Fblog%2F2022%2F03%2F29%2Freact-v18%23what-is-concurrent-react "https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react")有关。

通过并发渲染，React 同时维护多个版本的 UI（“并发”），一个用于在屏幕展示（Current Firber），一个用于准备更新（WorkInProgress Firber）。而且在渲染过程中，为了让应用程序的体验更加顺滑，React 允许暂停渲染来高优响应事件等。

通常 React 自带的 state 在更新时不会有任何问题。但是，对于 React 之外的外部 state 则存在一些差异，因为每次访问外部 state 时，这个 state 的值都可能发生变化。

这样导致的结果是，在同一次渲染中，不同时刻（比如处理事件前后）获取的外部 state 值可能会不同，而 React 对此毫无知情。这就有可能导致 UI 撕裂的边缘情况发生，即使用同一个 state 渲染出了不同的值，也就是在 UI 上显示了同一 state 的多个值。

> 简单介绍一下什么是撕裂
> 
> ![](https://user-images.githubusercontent.com/2440089/124805949-29edc180-df2a-11eb-9621-4cd9c5d0bc5c.png)
> 
> *   第一张图中，组件访问 external store 来获取颜色的数值，组件渲染成蓝色，在并发渲染过程中 React 在完成渲染之前可以停下来，“让位” 给其他工作，假设这时用户点击了按钮，将 store 的颜色值由蓝色改为红色；
> *   第二张图中，我们看到 React 已经暂停渲染，external store 发生变化；
> *   第三张图中，React 继续进行渲染，其他组件访问外部状态的组件得到的值却都是红色；
> *   最后一张图，我们看到组件的颜色有红色和也有蓝色。它们虽然读取同一个数据却显示出不同的值，这种边缘情况就是 “撕裂”。

useSyncExternalStore 可以解决这种情况。它在渲染期间检测外部 state 是否变化，并在为用户展示出不一致的 UI 之前重新开始渲染。由于这些更新是强制同步的，React 可以保证 UI 始终保持一致

简而言之，在使用外部数据时，useSyncExternalStore 有助于避免 UI 的不一致。除此之外，它还有一些额外的好处，比如支持服务器渲染，而且简单易用。

示例
--

如何在应用程序中使用 useSyncExternalStore？我试着重写了两个 hooks：

**useMediaQuery**

useMediaQuery 是一个 hook，用 JavaScript 来访问 CSS 领域中的媒体查询，例如获取用户偏好，如 prefers-color-scheme 等。

```
type MediaQuery = `(${string}:${string})`;

function getSnapshot(query: MediaQuery) {
  return window.matchMedia(query).matches;
}

function subscribe(onChange: () => void, query: MediaQuery) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);

  return () => {
    mql.removeEventListener("change", onChange);
  };
}

export function useMediaQuery(query: MediaQuery) {
  const subscribeMediaQuery = React.useCallback((onChange: () => void) => {
    subscribe(onChange, query)
  }, [query])

  const matches = React.useSyncExternalStore(
    subscribeMediaQuery,
    () => getSnapshot(query),
  );

  return matches;
}
```

请注意，由于 subscribeMediaQuery 中使用了 query，因此此函数必须在 useMediaQuery 内部进行定义，从而使函数引用随每次调用而变化。

将 subscribeMediaQuery 包装在 useCallback 中，并且只有在 query 变化时才重新进行 subscribe，这样可以在一定程度上避免出现性能问题。

**useWindowSize**

这是另一个常见的 hook，从名称上即可看出它的功能：

```
function onWindowSizeChange(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function getWindowWidthSnapshot() {
  return window.innerWidth;
}

function getWindowHeightSnapshot() {
  return window.innerHeight;
}

function useWindowSize({ widthSelector, heightSelector }) {
  const windowWidth = useSyncExternalStore(
    onWindowSizeChange,
    getWindowWidthSnapshot
  );

  const windowHeight = useSyncExternalStore(
    onWindowSizeChange,
    getWindowHeightSnapshot
  );

  return { width: windowWidth, height: windowHeight };
}
```

起初，我尝试直接从同一个 useSyncExternalStore 返回对象，如下所示：

```
function getWindowSizeSnapshot() {
  return { width: window.innerHeight, height: window.innerHeight } // 💥
}
```

最终，因为出现 “渲染次数太多” 错误而告终。这是因为 [getSnapshot 返回的值必须是不可变的](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore%23im-getting-an-error-the-result-of-getsnapshot-should-be-cached "https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached")。也就是说不能返回数组或字面量对象！

要么使用 memoize 来修复这个问题，要么将高度和宽度分开。后者更简单，因此我选择后者。这可能是一个常见的错误，特别是对于一个初学者来说，如果能有一个 ESLint 规则就好了。

**使用 Selector Function 避免重新渲染**

Sébastian 在他的[博文中提到](https://link.juejin.cn?target=https%3A%2F%2Fthisweekinreact.com%2Farticles%2FuseSyncExternalStore-the-underrated-react-api "https://thisweekinreact.com/articles/useSyncExternalStore-the-underrated-react-api")，useSyncExternalStore 是一个被低估的 React API，在他看来该 hooks 并未被充分利用，它的一个主要优点是支持 selector function（这里借用了 Redux 中的概念）。

selector 接收 state 作为它的参数，并根据 state 返回具体的值。通过把 selector function 传递给 getSnapshot，组件更新次数会被限制。

比如，我们并不需要窗口每发生一个像素变化时，就触发某些更新动作。在下面的代码示例中做了一些优化，假设我们只关心每 100 像素的宽度变化：

```
const widthStep = 100; // px

const widthSelector = (w: number) => (w ? Math.floor(w / widthStep) * widthStep : 1)

function windowWidthSnapshot(selector = (w: number) => w) {
  return selector(window.innerWidth);
}

function App() {

  const width = useSyncExternalStore(onWindowSizeChange, () =>
    windowWidthSnapshot(widthSelector)
  );

  ...
}
```

SSR
---

useSyncExternalStore 的秘密大杀器是它的第三个可选参数 getServerSnapshot。作为一个函数它会返回一个初始快照，并在服务端渲染和 hydration 过程中会使用这个快照。进而避免 rehydration 问题 (rehydration perils)。

使用 getServerSnapshot 需要注意两件事。

1.  如果在服务器上使用 useSyncExternalStore，则必须定义 getServerSnapshot，否则会引发错误。
    
2.  必须保证 getServerSnapshot 的输出结果在客户端和服务端上的输出一致。
    

对于上面提到的哪些访问浏览器上变量值的 hooks，SSR 又如何处理呢？在 SSR 中，这些 hooks 根本不起作用，因为 window 上的信息只能在客户端上获得，那么只能为服务端渲染造一个初值。

**只在客户端渲染的组件**

在 React 文档中建议不要在服务端渲染这样的组件，也就是说只在客户端渲染这些组件。

> 在页面可交互之前，可以使用 getServerSnapshot 提供的初始 snapshot。在服务端渲染过程中，如果 snapshot 的初始值没有任何意义，可以[强制组件只在客户端渲染](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FSuspense%23providing-a-fallback-for-server-errors-and-server-only-content "https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content")。 - [useSyncExternalStore](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FuseSyncExternalStore%23adding-support-for-server-rendering "https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering")

如果组件在服务端上抛出错误，React 也不会中止服务端渲染，它会找到最近的 <Suspense> 组件，并将它的 fallback 添加到服务端生产的 HTML 中。在客户端上，React 将尝试再次渲染相同的组件。如果客户端上没有出现错误，React 将不会显示错误。因为我们可以利用这个特点，对那些[只在客户端上渲染组件](https://link.juejin.cn?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2FSuspense%23providing-a-fallback-for-server-errors-and-server-only-content "https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content")，只需在服务端抛出一个错误，然后将它们包装在 <Suspense>，并用 fallback 替换它们的 HTML

对于一个只需要客户端信息的组件，在服务端渲染是没有意义的。因此，可以通过抛出错误在服务端的组件树中留下一个孔洞，然后将其传递给客户端，让它填补这个孔洞。

总结
--

本文介绍了 useSyncExternalStore “是什么” 和 “为什么”，希望藉此能揭开它的些许神秘面纱。

*   useSyncExternalStore 主要适用于三方库，但不限于此。
    
    *   它服务于外部 state，但它的使用范围要比想象中的更广泛
    *   浏览器也是一个外部 store，某些场景下 React 应用程序需要使用它与之同步
    *   它是并发安全的，因此可以避免 UI 中的视觉不一致
*   如果 subscribe 的参数不稳定，React 将在每次渲染时重新订阅 store
    
*   getSnapshot 必须返回不可变的值
    
*   它的第三个参数 getServerSnapshot 主要用于 SSR 中
    
    *   在客户端渲染中返回的初值要与服务端完全相同，因为我们无法在服务器上使用浏览器的 API
    *   如果在服务端渲染时不能提供一个初值，可将组件转换成一个只在客户端渲染的组件，方法是在服务端渲染时抛出一个异常并通过 <Suspense> 展示 fallback 的 UI