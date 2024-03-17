> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [web.dev](https://web.dev/articles/rendering-on-the-web?hl=zh-cn)

术语
--

*   **[Interaction to Next Paint (INP)](https://web.dev/articles/inp?hl=zh-cn)**：被视为一种代表性指标，用于评估网页是否能够一致地快速响应用户输入。
*   **[总阻塞时间 (TBT)](https://web.dev/articles/tbt?hl=zh-cn)**：一种 [INP 的代理指标](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt)，用于计算在网页加载期间主线程被阻塞的时间。

服务器端渲染
------
服务器端渲染通常会生成快速的 FCP。在服务器上运行网页逻辑和呈现可以避免向客户端发送大量 JavaScript。
- 这有助于减少页面的 TBT，
- 这也可能会导致 INP 下降，因为主线程在网页加载期间阻塞率较低。
	- 如果主线程的阻塞频率降低，用户互动就会有更多机会更快地运行。
- 一个潜在的弊端：在服务器上生成网页需要时间，这可能会导致 TTFB 较高。

请务必注意，对于有些网页，您可以选择使用服务器端呈现，而不能为另一些网页使用服务器端呈现。一些网站采用了混合呈现技术，并取得了理想成效。
- [Netflix](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9) 服务器呈现其相对静态的着陆页，同时为互动量较大的网页[预提取](https://dev.to/addyosmani/speed-up-next-page-navigations-with-prefetching-4285) JS，从而使这些由客户端呈现且数量较大的网页更有可能快速加载。


静态渲染
----
[静态渲染](https://frontarm.com/james-k-nelson/static-vs-server-rendering/)在构建时进行。
- 与服务器端呈现不同，由于无需在服务器上动态生成网页的 HTML，该呈现方式还能始终如一地实现快速的 TTFB。
- 一般来说，静态呈现意味着为每个网址提前生成单独的 HTML 文件。借助预先生成的 HTML 响应，可以将静态渲染部署到多个 CDN，以充分利用边缘缓存。
静态呈现的缺点之一是，必须为每个可能的网址生成单独的 HTML 文件。如果您无法提前预测这些网址的具体内容，或者对于包含大量独特网页的网站来说，这可能会极具挑战性甚至不可行。
**注意** ：Next.js 或 Nuxt 等热门框架的抽象同时提供静态呈现和服务器端呈现。
您有必要了解静态呈现和预呈现之间的区别：
- 静态呈现的网页具有互动性，无需在客户端执行大量 JavaScript，
- 预呈现可提高单页应用的 FCP（必须在客户端启动才能实现网页真正的互动性）。

服务器端呈现与静态呈现
-----------
服务器端渲染并不是万能的，其动态特性可能会产生巨大的计算开销成本。

许多服务器端渲染解决方案不会提前刷新，可能会延迟 TTFB，或使发送的数据翻倍（例如，客户端上的 JavaScript 使用的内嵌状态）。
- 在 React 中，`renderToString()` 速度可能很慢，因为它是同步的、单线程的。
- 支持流式传输的[新版 React 服务器 DOM API](https://react.dev/reference/react-dom/server)，可更快将 HTML 响应的初始部分发送给浏览器，而其他部分仍在服务器上生成。

“正确” 服务器端渲染涉及到找到或构建[组件缓存](https://medium.com/@reactcomponentcaching/)解决方案、管理内存消耗、应用[记忆](https://speakerdeck.com/maxnajim/hastening-react-ssr-with-component-memoization-and-templatization)技术以及其他问题。您通常会多次处理 / 重新构建同一应用 - 一次在客户端上，另一次在服务器上。服务器端渲染可以让某些内容更快显示，但并不意味着您的工作量就会变小。如果在服务器生成的 HTML 响应到达客户端后，您在客户端上会处理很多工作，这仍可能会导致您网站的 TBT 和 INP 较高。

服务器端渲染会按需为每个网址生成 HTML，但可能比仅提供静态呈现的内容更慢。如果您能够完成额外的工作，那么服务器端呈现和 [HTML 缓存](https://freecontent.manning.com/caching-in-react/)可以显著缩短服务器呈现时间。与静态呈现相比，服务器端呈现的优势在于，它能够拉取更多 “实时” 数据，并响应一组更完整的请求。需要个性化的网页是不适合静态呈现的请求类型的具体示例。

在构建 [PWA](https://web.dev/explore/progressive-web-apps?hl=zh-cn) 时，服务器端渲染也可能会做出一些有趣的决策：是使用整页 [Service Worker](https://developer.chrome.com/docs/workbox/service-worker-overview/?hl=zh-cn) 缓存，还是单纯通过服务器渲染个别内容，哪种做法更好？

客户端渲染
-----

客户端呈现是指使用 JavaScript 直接在浏览器中呈现网页。
- 所有逻辑、数据提取、模板化和路由都是在客户端而非服务器上处理的。
- 其有效结果是，服务器会向用户的设备传递更多数据，而这也带来了一系列需要权衡的利弊。

在移动设备上，客户端渲染可能难以获取且保持快速运行。
- 您可以使用 `<link rel=preload>` 更快地传送关键脚本和数据，让解析器更快地工作。
- 为了确保初始和后续导航能够提供即时体验，[PRPL](https://web.dev/articles/apply-instant-loading-with-prpl?hl=zh-cn) 等模式也值得评估。

客户端渲染的主要缺点是，
- 需要的 JavaScript 数量往往会随着应用的增长而增加，这可能会对网页的 INP 产生负面影响。
- 添加新的 JavaScript 库、Polyfill 和第三方代码会变得尤其困难，它们会争用处理能力，而且往往必须先进行处理，然后才能呈现网页内容。

如果体验使用的是依赖大型 JavaScript 软件包的客户端渲染，
- 就应该考虑[积极的代码拆分](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting?hl=zh-cn)，以便在网页加载期间降低 TBT 和 INP，并确保延迟加载 JavaScript，即 “只在需要时提供您所需的内容”。
- 对于互动很少或没有互动的体验，服务器端渲染可以代表这些问题的可扩展性更强的解决方案。

对于构建单页应用的人员来说，
- 确定大多数页面共用的界面核心部分意味着您可以应用[应用 Shell 缓存](https://developer.chrome.com/blog/app-shell/?hl=zh-cn)技术。
- 与 Service Worker 结合使用可以显著提升重复访问的感知性能，因为可以非常快地从 `CacheStorage` 加载 App Shell HTML 及其依赖项。

通过 Rehydration 结合使用服务器端渲染和客户端渲染
-------------------------------
此方法尝试通过同时在客户端渲染与服务器端渲染之间进行权衡取舍。以 HTML 形式呈现应用的服务器处理导航请求（例如完整网页加载或重新加载），然后将用于呈现的 JavaScript 和数据嵌入到生成的文档中。谨慎处理后，即可实现与服务器端渲染一样的快速 FCP，然后使用称为 “(re)hydration” 的技术在客户端上重新渲染，从而“接收”。[](https://react.dev/reference/react-dom/client/hydrateRoot)这是一个有效的解决方案，但可能存在相当大的性能缺陷。

使用 Rehydration 进行服务器端渲染的主要缺点是，
- 即使能够改善 FCP，也会对 TBT 和 INP 产生明显的负面影响。
- 服务器端呈现的页面可能看上去像是已加载且具有互动性，但实际上只有在执行组件的客户端脚本并附加事件处理脚本后，才能响应输入。在
	- 移动设备上，这可能需要几秒甚至几分钟的时间。

这种情况很快就会变得令人沮丧，因为用户在尝试与网页互动时却不知道为什么没有任何反应。

### 补水问题：一款应用花了两个钱

水解问题通常比因 JavaScript 导致的互动延迟问题更严重。
为了让客户端 JavaScript 能够准确地 “接续” 服务器停止的位置，而不必重新请求服务器用于呈现其 HTML 的所有数据，当前的服务器端呈现解决方案通常会将响应从界面的数据依赖关系序列化为脚本标记。生成的 HTML 文档包含大量重复内容：

![](https://web.dev/static/articles/rendering-on-the-web/image/html-document-containing-94fb8c198eab8.png?hl=zh-cn)

如您所见，服务器会返回应用界面的说明来响应导航请求，但也返回用于编写该界面的源数据以及界面实现的完整副本，后者随后会在客户端上启动。只有在 `bundle.js` 完成加载和执行之后，此界面才会变为交互式界面。

使用服务器端呈现和重构 (rehydration) 功能从真实网站收集的性能指标表明，不建议使用。归根结底，原因在于用户体验：极易导致用户陷入 “恐怖山谷”，虽然页面看起来已经准备就绪，但他们却觉得没有互动。
不过，通过 Rehydration 进行服务器端渲染是有希望的。
- 从短期来看，仅对可缓存性极强的内容使用服务器端渲染可以减少 TTFB，从而产生与预渲染类似的结果。
- [逐步](https://www.emberjs.com/blog/2017/10/10/glimmer-progress-report.html)、逐步或部分补充水分，可能是提高此技术将来可行性的关键。

流式服务器端渲染和渐进式重构
--------------

在过去几年里，服务器端渲染有了不少改进。
通过[流式服务器端渲染](https://mxstbr.com/thoughts/streaming-ssr)，您可以分块发送 HTML，浏览器在收到数据块时便可以逐步进行渲染。这样可以实现快速 FCP，因为标记到达用户的速度会更快。
在 React 中，信息流在 [`renderToPipeableStream()`] 中是异步的（与同步 `renderToString()` 相比），意味着背压得到妥善处理。

渐进式补液功能也值得考虑，并且 React [已经推出](https://github.com/facebook/react/pull/14717)。通过这种方法，服务器渲染的应用的各个部分会随时间 “启动”，而不是目前常用的方法，即一次性初始化整个应用。这有助于减少使网页具有互动性所需的 JavaScript 数量，因为可以推迟页面低优先级部分的客户端升级，以防止阻塞主线程，从而使用户互动可在用户发起互动后更早地发生。

渐进式 Rehydration 还有助于避免一个最常见的服务器端渲染补全陷阱，即由服务器渲染的 DOM 树被销毁，然后立即重新构建，最常见的情况是初始同步客户端渲染所需的数据尚未准备就绪，可能在等待 `Promise` 的解析。

