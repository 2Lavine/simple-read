> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [web.dev](https://web.dev/articles/rendering-on-the-web?hl=zh-cn)

> 我们应该在应用中的什么位置实现逻辑和渲染？我们是否应该使用服务器端渲染？“Rehydration” 是什么？让我们来找出答案吧！

![](https://web.dev/_static/images/translated.svg?hl=zh-cn) 此页面由 [Cloud Translation API](//cloud.google.com/translate/?hl=zh-cn) 翻译。 [Switch to English](https://web.dev/articles/rendering-on-the-web?hl=en)

*   [首页](https://web.dev/?hl=zh-cn)
*   [Articles](https://web.dev/articles?hl=zh-cn)

该内容对您有帮助吗？

在网页上呈现
======

*   本页内容
*   [术语](#terminology)
*   [服务器端渲染](#server-side_rendering)
*   [静态渲染](#static_rendering)
*   [服务器端呈现与静态呈现](#server-side_rendering_versus_static_rendering)
*   [客户端渲染](#client-side_rendering)
*   [通过 Rehydration 结合使用服务器端渲染和客户端渲染](#combining_server-side_rendering_and_client-side_rendering_via_rehydration)
    *   [补水问题：一款应用花了两个钱](#a_rehydration_problem_one_app_for_the_price_of_two)
*   [流式服务器端渲染和渐进式重构](#streaming_server-side_rendering_and_progressive_rehydration)
    *   [部分补水](#partial_rehydration)
    *   [三重形渲染](#trisomorphic_rendering)
*   [搜索引擎优化 (SEO) 注意事项](#seo_considerations)
*   [总结](#wrapping_up)
*   [赠金](#credits)

我们应该在应用中的什么位置实现逻辑和渲染？是否应使用服务器端渲染？关于 Rehydration 呢？让我们来找到答案吧！

![](https://web.dev/images/authors/addyosmani.jpg?hl=zh-cn) Addy Osmani [Twitter](https://twitter.com/addyosmani) [GitHub](https://github.com/addyosmani) ![](https://web.dev/images/authors/developit.jpg?hl=zh-cn) Jason Miller [Twitter](https://twitter.com/_developit) [GitHub](https://github.com/developit) [首页](https://jasonformat.com)

作为开发者，我们经常面临着会影响整个应用架构的决策。Web 开发者必须做出的核心决策之一是，在应用中实现逻辑和呈现。由于构建网站的方式有很多种，因此这可能非常困难。

我们对这一领域的了解正是得益于我们在过去几年中与大型网站进行的 Chrome 开发工作。从广义上讲，我们建议开发者考虑采用服务器端渲染或静态渲染，而非完全重构方法。

为了更好地理解我们在做出这个决定时选择的架构，我们需要对每种方法有充分的了解，并在谈论它们时用到一致的术语。这两种方法之间的差异有助于从性能的角度说明在网页上进行渲染的利弊。

术语
--

**渲染**
*   **服务器端呈现 (SSR)**：将客户端或通用应用呈现为服务器上的 HTML。
*   **客户端呈现 (CSR)**：通过 JavaScript 在浏览器中呈现应用以修改 DOM。
*   **重构**：在客户端上 “启动”JavaScript 视图，以便它们可以重复使用服务器渲染的 HTML 的 DOM 树和数据。
*   **预渲染**：在构建时运行客户端应用，以静态 HTML 的形式捕获其初始状态。

**性能**

*   **[首字节时间 (TTFB)](https://web.dev/articles/ttfb?hl=zh-cn)**：指的是从点击链接到第一条内容传入之间的时间。
*   **[首次内容绘制 (FCP)](https://web.dev/articles/fcp?hl=zh-cn)**：请求的内容（文章正文等）变为可见的时间。
*   **[Interaction to Next Paint (INP)](https://web.dev/articles/inp?hl=zh-cn)**：被视为一种代表性指标，用于评估网页是否能够一致地快速响应用户输入。
*   **[总阻塞时间 (TBT)](https://web.dev/articles/tbt?hl=zh-cn)**：一种 [INP 的代理指标](https://almanac.httparchive.org/en/2022/performance#inp-and-tbt)，用于计算在网页加载期间主线程被阻塞的时间。

服务器端渲染
------

_服务器端渲染为服务器上的网页生成完整的 HTML，以响应导航。这样可以避免在客户端上执行额外的数据提取和模板设置，因为系统会在浏览器收到响应之前进行处理。_

服务器端渲染通常会生成快速的 FCP。在服务器上运行网页逻辑和呈现可以避免向客户端发送大量 JavaScript。这有助于减少页面的 TBT，这也可能会导致 INP 下降，因为主线程在网页加载期间阻塞率较低。如果主线程的阻塞频率降低，用户互动就会有更多机会更快地运行。这是合理的，因为使用服务器端呈现时，您实际上只是向用户浏览器发送文本和链接。这种方法可以很好地处理各种各样的设备和网络条件，并带来一些有趣的浏览器优化，例如流式文档解析。

![](https://web.dev/static/articles/rendering-on-the-web/image/diagram-showing-server-si-4c081d80ab5fe.png?hl=zh-cn)

使用服务器端呈现后，用户不太可能会等待受 CPU 限制的 JavaScript 运行完毕，然后才能使用您的网站。即使在无法避免[第三方 JS](https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript?hl=zh-cn) 的情况下，使用服务器端呈现来降低您自己的第一方 [JavaScript 费用](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)也可以让您为其余工作带来更多的[预算](https://medium.com/@addyosmani/start-performance-budgeting-dabde04cf6a3)。不过，这种方法有一个潜在的弊端：在服务器上生成网页需要时间，这可能会导致 TTFB 较高。

服务器端渲染对您的应用是否足够在很大程度上取决于您要构建的体验类型。关于服务器端呈现和客户端呈现的正确应用存在长期争论，但请务必注意，对于有些网页，您可以选择使用服务器端呈现，而不能为另一些网页使用服务器端呈现。一些网站采用了混合呈现技术，并取得了理想成效。[Netflix](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9) 服务器呈现其相对静态的着陆页，同时为互动量较大的网页[预提取](https://dev.to/addyosmani/speed-up-next-page-navigations-with-prefetching-4285) JS，从而使这些由客户端呈现且数量较大的网页更有可能快速加载。

利用许多现代化的框架、库和架构，可以在客户端和服务器上渲染同一应用。这些方法可用于服务器端渲染。但值得注意的是，同时在服务器和客户端上进行渲染的架构本身就属于一类解决方案，两者在性能特征和权衡方面有着很大的差异。React 用户可以使用[服务器 DOM API](https://react.dev/reference/react-dom/server) 或基于其构建的解决方案，例如用于服务器端渲染的 [Next.js](https://nextjs.org/)。Vue 用户可以查看 Vue 的[服务器端渲染指南](https://vuejs.org/guide/scaling-up/ssr.html)或 [Nuxt](https://nuxtjs.org)。Angular 具有 [Universal](https://angular.io/guide/universal)。不过，大多数热门解决方案都会采用某种形式的水合，因此在选择工具之前，请注意使用的方法。

静态渲染
----

[静态渲染](https://frontarm.com/james-k-nelson/static-vs-server-rendering/)在构建时进行。这种方法可以提供快速的 FCP 和更低的 TBT 和 INP（假设客户端 JS 的数量有限）。与服务器端呈现不同，由于无需在服务器上动态生成网页的 HTML，该呈现方式还能始终如一地实现快速的 TTFB。一般来说，静态呈现意味着为每个网址提前生成单独的 HTML 文件。借助预先生成的 HTML 响应，可以将静态渲染部署到多个 CDN，以充分利用边缘缓存。

![](https://web.dev/static/articles/rendering-on-the-web/image/diagram-showing-static-re-0659f8679c321.png?hl=zh-cn)

静态渲染解决方案有各种各样的形状和大小。[Gatsby](https://www.gatsbyjs.org) 等工具旨在让开发者感觉他们的应用是动态呈现的，而不是作为构建步骤生成的。[11ty](https://www.11ty.dev/)、[Jekyll](https://jekyllrb.com) 和 [Metalsmith](https://metalsmith.iooperationalizing-node-js-for-server-side-rendering-c5ba718acfc9speedier-server-side-rendering-in-react-16-with-component-caching-e8aa677929b1) 等静态网站生成工具充分利用其静态特性，提供了一种更加以模板为导向的方法。

**注意** ：Next.js 或 Nuxt 等热门框架的抽象同时提供静态呈现和服务器端呈现。这样一来，开发者便可以为符合条件的网页选用静态呈现，或者为需要动态生成的网页使用服务器端呈现（以便响应请求）。

静态呈现的缺点之一是，必须为每个可能的网址生成单独的 HTML 文件。如果您无法提前预测这些网址的具体内容，或者对于包含大量独特网页的网站来说，这可能会极具挑战性甚至不可行。

React 用户可能熟悉 Gatsby、[Next.js 静态导出](https://nextjs.org/learn/excel/static-html-export/)或 [Navi](https://frontarm.com/navi/)，所有这些都可以方便您使用组件编写网页。不过，您有必要了解静态呈现和预呈现之间的区别：静态呈现的网页具有互动性，无需在客户端执行大量 JavaScript，而预呈现可提高单页应用的 FCP（必须在客户端启动才能实现网页真正的互动性）。

如果您不确定给定的解决方案是静态呈现还是预呈现，请尝试停用 JavaScript 并加载要测试的网页。对于静态呈现的网页，大部分功能在未启用 JavaScript 的情况下仍会存在。对于预渲染的网页，可能仍然会有一些基本功能（例如链接），但大多数网页将处于非活跃状态。

另一个有用的测试是使用 [Chrome 开发者工具中的网络节流功能](https://developer.chrome.com/docs/devtools/device-mode/?hl=zh-cn#network)，并观察在网页进入可交互状态之前已下载了多少 JavaScript。预呈现通常需要更多的 JavaScript 才能实现可交互，而且 JavaScript 往往比静态呈现所用的[渐进式增强](https://developer.mozilla.org/docs/Glossary/Progressive_Enhancement)方法更复杂。

服务器端呈现与静态呈现
-----------

服务器端渲染并不是万能的，其动态特性可能会产生巨大的计算开销成本。许多服务器端渲染解决方案不会提前刷新，可能会延迟 TTFB，或使发送的数据翻倍（例如，客户端上的 JavaScript 使用的内嵌状态）。在 React 中，`renderToString()` 速度可能很慢，因为它是同步的、单线程的。支持流式传输的[新版 React 服务器 DOM API](https://react.dev/reference/react-dom/server)，可更快将 HTML 响应的初始部分发送给浏览器，而其他部分仍在服务器上生成。

“正确” 服务器端渲染涉及到找到或构建[组件缓存](https://medium.com/@reactcomponentcaching/)解决方案、管理内存消耗、应用[记忆](https://speakerdeck.com/maxnajim/hastening-react-ssr-with-component-memoization-and-templatization)技术以及其他问题。您通常会多次处理 / 重新构建同一应用 - 一次在客户端上，另一次在服务器上。服务器端渲染可以让某些内容更快显示，但并不意味着您的工作量就会变小。如果在服务器生成的 HTML 响应到达客户端后，您在客户端上会处理很多工作，这仍可能会导致您网站的 TBT 和 INP 较高。

服务器端渲染会按需为每个网址生成 HTML，但可能比仅提供静态呈现的内容更慢。如果您能够完成额外的工作，那么服务器端呈现和 [HTML 缓存](https://freecontent.manning.com/caching-in-react/)可以显著缩短服务器呈现时间。与静态呈现相比，服务器端呈现的优势在于，它能够拉取更多 “实时” 数据，并响应一组更完整的请求。需要个性化的网页是不适合静态呈现的请求类型的具体示例。

在构建 [PWA](https://web.dev/explore/progressive-web-apps?hl=zh-cn) 时，服务器端渲染也可能会做出一些有趣的决策：是使用整页 [Service Worker](https://developer.chrome.com/docs/workbox/service-worker-overview/?hl=zh-cn) 缓存，还是单纯通过服务器渲染个别内容，哪种做法更好？

客户端渲染
-----

客户端呈现是指使用 JavaScript 直接在浏览器中呈现网页。所有逻辑、数据提取、模板化和路由都是在客户端而非服务器上处理的。其有效结果是，服务器会向用户的设备传递更多数据，而这也带来了一系列需要权衡的利弊。

在移动设备上，客户端渲染可能难以获取且保持快速运行。如果只需完成极少的工作，客户端渲染可以接近纯服务器端渲染的性能，从而保持[严格的 JavaScript 预算](https://mobile.twitter.com/HenrikJoreteg/status/1039744716210950144)，并通过尽可能少的[往返](https://en.wikipedia.org/wiki/Round-trip_delay_time)提供价值。您可以使用 `<link rel=preload>` 更快地传送关键脚本和数据，让解析器更快地工作。为了确保初始和后续导航能够提供即时体验，[PRPL](https://web.dev/articles/apply-instant-loading-with-prpl?hl=zh-cn) 等模式也值得评估。

![](https://web.dev/static/articles/rendering-on-the-web/image/diagram-showing-client-si-42200b67e9867.png?hl=zh-cn)

客户端渲染的主要缺点是，需要的 JavaScript 数量往往会随着应用的增长而增加，这可能会对网页的 INP 产生负面影响。添加新的 JavaScript 库、Polyfill 和第三方代码会变得尤其困难，它们会争用处理能力，而且往往必须先进行处理，然后才能呈现网页内容。

如果体验使用的是依赖大型 JavaScript 软件包的客户端渲染，就应该考虑[积极的代码拆分](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting?hl=zh-cn)，以便在网页加载期间降低 TBT 和 INP，并确保延迟加载 JavaScript，即 “只在需要时提供您所需的内容”。对于互动很少或没有互动的体验，服务器端渲染可以代表这些问题的可扩展性更强的解决方案。

对于构建单页应用的人员来说，确定大多数页面共用的界面核心部分意味着您可以应用[应用 Shell 缓存](https://developer.chrome.com/blog/app-shell/?hl=zh-cn)技术。与 Service Worker 结合使用可以显著提升重复访问的感知性能，因为可以非常快地从 `CacheStorage` 加载 App Shell HTML 及其依赖项。

通过 Rehydration 结合使用服务器端渲染和客户端渲染
-------------------------------

此方法尝试通过同时在客户端渲染与服务器端渲染之间进行权衡取舍。以 HTML 形式呈现应用的服务器处理导航请求（例如完整网页加载或重新加载），然后将用于呈现的 JavaScript 和数据嵌入到生成的文档中。谨慎处理后，即可实现与服务器端渲染一样的快速 FCP，然后使用称为 “(re)hydration” 的技术在客户端上重新渲染，从而“接收”。[](https://react.dev/reference/react-dom/client/hydrateRoot)这是一个有效的解决方案，但可能存在相当大的性能缺陷。

使用 Rehydration 进行服务器端渲染的主要缺点是，即使能够改善 FCP，也会对 TBT 和 INP 产生明显的负面影响。服务器端呈现的页面可能看上去像是已加载且具有互动性，但实际上只有在执行组件的客户端脚本并附加事件处理脚本后，才能响应输入。在移动设备上，这可能需要几秒甚至几分钟的时间。

或许您曾亲自遇到过这种情况 - 有一段时间后，页面似乎已加载，点击或点按操作没有任何反应。这种情况很快就会变得令人沮丧，因为用户在尝试与网页互动时却不知道为什么没有任何反应。

### 补水问题：一款应用花了两个钱

水解问题通常比因 JavaScript 导致的互动延迟问题更严重。为了让客户端 JavaScript 能够准确地 “接续” 服务器停止的位置，而不必重新请求服务器用于呈现其 HTML 的所有数据，当前的服务器端呈现解决方案通常会将响应从界面的数据依赖关系序列化为脚本标记。生成的 HTML 文档包含大量重复内容：

![](https://web.dev/static/articles/rendering-on-the-web/image/html-document-containing-94fb8c198eab8.png?hl=zh-cn)

如您所见，服务器会返回应用界面的说明来响应导航请求，但也返回用于编写该界面的源数据以及界面实现的完整副本，后者随后会在客户端上启动。只有在 `bundle.js` 完成加载和执行之后，此界面才会变为交互式界面。

使用服务器端呈现和重构 (rehydration) 功能从真实网站收集的性能指标表明，不建议使用。归根结底，原因在于用户体验：极易导致用户陷入 “恐怖山谷”，虽然页面看起来已经准备就绪，但他们却觉得没有互动。

![](https://web.dev/static/articles/rendering-on-the-web/image/diagram-showing-client-re-be8ceca54b42e.png?hl=zh-cn)

不过，通过 Rehydration 进行服务器端渲染是有希望的。从短期来看，仅对可缓存性极强的内容使用服务器端渲染可以减少 TTFB，从而产生与预渲染类似的结果。[逐步](https://www.emberjs.com/blog/2017/10/10/glimmer-progress-report.html)、逐步或部分补充水分，可能是提高此技术将来可行性的关键。

流式服务器端渲染和渐进式重构
--------------

在过去几年里，服务器端渲染有了不少改进。

通过[流式服务器端渲染](https://mxstbr.com/thoughts/streaming-ssr)，您可以分块发送 HTML，浏览器在收到数据块时便可以逐步进行渲染。这样可以实现快速 FCP，因为标记到达用户的速度会更快。在 React 中，信息流在 [`renderToPipeableStream()`] 中是异步的（与同步 `renderToString()` 相比），意味着背压得到妥善处理。

渐进式补液功能也值得考虑，并且 React [已经推出](https://github.com/facebook/react/pull/14717)。通过这种方法，服务器渲染的应用的各个部分会随时间 “启动”，而不是目前常用的方法，即一次性初始化整个应用。这有助于减少使网页具有互动性所需的 JavaScript 数量，因为可以推迟页面低优先级部分的客户端升级，以防止阻塞主线程，从而使用户互动可在用户发起互动后更早地发生。

渐进式 Rehydration 还有助于避免一个最常见的服务器端渲染补全陷阱，即由服务器渲染的 DOM 树被销毁，然后立即重新构建，最常见的情况是初始同步客户端渲染所需的数据尚未准备就绪，可能在等待 `Promise` 的解析。

### 部分补水

事实证明，部分补水很难实施。这种方法是对渐进式补水理念的扩展，即对要逐步补水的各个部分（组件 / 视图 / 树）进行分析，并识别互动性很小或没有反应的部分（组件 / 视图 / 树）。对于每个主要是静态的部分，相应的 JavaScript 代码随后会转换为 inert 引用和装饰功能，从而将其客户端占用空间减少到几乎为零。

部分水分方法存在其自身的问题和折衷问题。这会给缓存带来一些有趣的挑战，而客户端导航意味着，我们无法假设在没有完整网页加载的情况下，应用的 inert 部分通过服务器渲染的 HTML 也可使用。

### 三重形渲染

如果 [Service Worker](https://developer.chrome.com/docs/workbox/service-worker-overview/?hl=zh-cn) 可供您选择，那么您也可能对 “三态” 渲染感兴趣。通过此方法，您可以使用流式服务器端渲染进行初始 / 非 JS 导航，然后让 Service Worker 在安装完毕后再渲染 HTML 以进行导航。这可以使缓存的组件和模板保持最新状态，并实现 SPA 式导航，以便在同一会话中呈现新视图。当您可以在服务器、客户端页面和 Service Worker 之间共享相同的模板和路由代码时，此方法效果最佳。

![](https://web.dev/static/articles/rendering-on-the-web/image/diagram-trisomorphic-ren-13fa9eea2e1a4.png?hl=zh-cn)

搜索引擎优化 (SEO) 注意事项
-----------------

在选择网页呈现策略时，团队往往会考虑 SEO 的影响。选择服务器端呈现通常是为了提供 “完整” 的体验，让抓取工具可以轻松解读这些体验。抓取工具[可能理解 JavaScript](https://web.dev/discoverable/how-search-works?hl=zh-cn)，但在呈现方式方面往往存在一些值得注意的[限制](https://developers.google.com/search/docs/guides/rendering?hl=zh-cn)。客户端渲染可以正常运行，但通常必须进行额外的测试和完成工作。最近，如果您的架构高度依赖客户端 JavaScript，[动态呈现](https://developers.google.com/search/docs/advanced/javascript/dynamic-rendering?hl=zh-cn)也已成为一个值得考虑的选项。

如果不确定，[移动设备适合性测试工具](https://search.google.com/test/mobile-friendly?hl=zh-cn)可有效测试您选择的方法能否达到预期效果。通过该表格，您可以直观地预览 Google 抓取工具看到的所有网页、发现的序列化 HTML 内容（执行 JavaScript 之后），以及呈现过程中遇到的任何错误。

![](https://web.dev/static/articles/rendering-on-the-web/image/screenshot-the-mobile-fr-058e6aeec73c3.png?hl=zh-cn)

总结
--

在决定渲染方法时，请衡量并了解有哪些瓶颈。考虑静态呈现或服务器端呈现能否助您得心应手。完全可以发布大部分 HTML 代码，同时尽量减少 JavaScript 以获得交互式体验。下面是一个展示服务器 - 客户端图谱的实用信息图：

![](https://web.dev/static/articles/rendering-on-the-web/image/infographic-showing-spec-cbd56ed4c56f1.png?hl=zh-cn)

赠金
--

感谢每个人的评价和启发：

Jeffrey Posnick、Houssein Djirdeh、Shubhie Panicker、Chris Harrelson 和 Sebastian Markbåge

该内容对您有帮助吗？