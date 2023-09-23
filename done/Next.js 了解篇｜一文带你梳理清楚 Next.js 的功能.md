> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7206261082452639802)


如果你需要具体的分析 JS 资源的组成，那么可以使用 [@next/bundle-analyzer](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fpackages%2Fnext-bundle-analyzer "https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer") 来分析，其可具体分析服务端代码、edge 运行时代吗、客户端代码


### 可扩展配置

分析一下它的可配置功能。

*   配置文件 `next.config.js` 中暴露了 webpack 实例，因此你可以完全控制 webpack
*   配置文件 `next.config.js` 中支持配置自定义配置，你可以把一些公用的不变的配置写在 `serverRuntimeConfig` 或者 `publicRuntimeConfig` 中，前者只会出现在服务端，后者会暴露到客户端。
*   可 [自定义 server](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustom-server "https://nextjs.org/docs/advanced-features/custom-server") ，你可以在启动服务的时候做一些自己想要做的处理，比如 node.js 性能监控等等。
*   不自定义 server ，也可以使用它提供的 [middreware](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fmiddleware "https://nextjs.org/docs/advanced-features/middleware") 机制来拦截请求或者校验权限等事项。
*   [自定义 APP](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustom-app "https://nextjs.org/docs/advanced-features/custom-app")，也就是 `_app.js`，它用于处理多个页面公共部分。
*   [自定义 Document](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustom-document "https://nextjs.org/docs/advanced-features/custom-document")，也就是`_document.js`，用于自定义配置 html 生成内容，比如插入 Google 分析脚本。
*   [自定义错误界面](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustom-error-page "https://nextjs.org/docs/advanced-features/custom-error-page") 也就是 404 或者 500 错误状态的页面。
*   [自定义页面 head 属性](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fapi-reference%2Fnext%2Fhead "https://nextjs.org/docs/api-reference/next/head")，使用 `next/head` 提供的 Head 组件，用于自定义 html document 头部的 title/meta/base 等标签信息。
*   可自定义 [`babel`](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustomizing-babel-config "https://nextjs.org/docs/advanced-features/customizing-babel-config") 和 [`postcss`](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustomizing-postcss-config "https://nextjs.org/docs/advanced-features/customizing-postcss-config") 等工程化规则配置。

可以看出基本上各个方面都可以自定义配置，扩展性还是很强的。


### 提供性能数据

Next.js 提供了获取应用性能数据的方法 [reportWebVitals](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fmeasuring-performance%23sending-results-to-analytics "https://nextjs.org/docs/advanced-features/measuring-performance#sending-results-to-analytics"), 只能在 `App` 组件中使用。

```
// _app.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}
```

