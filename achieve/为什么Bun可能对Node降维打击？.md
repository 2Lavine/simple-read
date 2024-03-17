> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7330143281525243958?utm_source=gold_browser_extension)

deno 的产品定位
---------
Deno 是 JS/TS 的安全运行时，原生支持 TS，无需手动配置。与 Node 不同，Node 的脚本默认具有广泛的权限，Deno 则认为 “脚本千万条，安全第一条”，要求开发者显式赋予敏感操作的权限，比如文件系统的读写。这自然增加了我们的学习成本和心智负担，但 Deno 的鲁棒性确实对 Node “降维打击”。
运行时测评
-----
Bun 是一个 JS/TS 的运行时。所谓运行时，顾名思义就是一个提供使用和运行程序的环境。

运行时的关键组件之一是 JS 引擎，用于将 JS 代码转换为机器码。Node 使用为 Chrome 浏览器提供支持的谷歌 V8 引擎，而 Bun 则使用 JSC（JavaScriptCore），此乃苹果为 Safari 浏览器开发的开源 JS 引擎。

V8 和 JSC 各有千秋，两者使用了不同的架构和优化策略。JSC 优先考虑更快的启动时间和更少的内存占用，短板在于更慢的执行时间。V8 优先考虑更快的执行和更多的运行时优化，短板在于更多的内存开销。

Node 原生并不支持 TS，Bun 内置了 TS 转译器，
- 原生支持 `.js/.ts/.jsx/.tsx` 文件，无需安装任何外部依赖。
- Bun 的内置转译器将各种乱七八糟的文件无缝转换为平平无奇的 JS，无需额外步骤就能直接跑 TS。

在 Node 中使用 ESM 常见方案，包括但不限于：
*   在 `package.json` 中添加 `"type": "module"` 属性
*   使用 `.mjs` 扩展名取代 `js` 扩展名

Bun 原生兼容 CJS/ESM，无需任何配置。Bun 的亮点功能是，它能够在同一文件中同时支持 `import/require()`，类似于旧版 TS 的奇葩模块语法，这在 Node 中是不可能事件：

```
// Bun 中的混合模块语法
import vue from 'vue'
const react = require('react')
```


---

Bun 使用 `--hot` flag 原生支持热重载，与需要重启整个进程的 Node 不同，Bun 会就地重载代码，而不会终止旧进程。这可以确保 HTTP 和 `WebSocket` 的连接不间断，并保留 App 状态，提供更丝滑的开发体验。

除了 JS 的标准（比如模块），对浏览器标准的 Web API（比如 `WebSocket`），Node 的支持也不一致。
举个栗子，Node 的早期版本不支持浏览器中常用的 `fetch` API，我们必须依赖 `node-fetch` 等第三方模块来 “曲线救国”。虽然但是，Node 18+ 开始实验性支持 `fetch`，目测未来可期。
Bun 则内置支持这些 Web 标准 API，我们可以直接使用稳定的 `fetch/Request/Response` 等 API，无需任何额外依赖。由于这些 API 是 Bun 的原生实现，所以其性能比第三方备胎更快、更可靠。
使用 Web 标准 API 设置 HTTP 服务器或 `WebSocket` 服务器，它每秒处理的请求比 Node 多 `4` 倍，处理的 `WebSocket` 消息比 Node 的 `ws` 包多 5 倍。
打包器
---
所谓打包，指的是是获取多个 JS 文件，并将其合并到一个或多个优化包中的过程。此过程还可能涉及转换，比如将 TS 转换为 JS，或者压缩代码减小体积。Node 的打包通常由第三方工具而不是 Node 本身处理。

- vite之类它们都提供了代码分割、树摇优化和热模块替换等功能。
- Bun 本身也是一个打包器。它旨在打包各种平台的 JS/TS 代码，包括浏览器中的前端 App（Vue/React App）和 Node。Bun 比 esbuild 快 `1.75` 倍，并且对 Webpack 等其他打包器 “降维打击”。
Bun 的一个天秀功能是 JS 宏，这允许在打包期间执行 JS 函数，并将结果直接内联到最终打包中。

举个栗子，在打包过程中利用 JS 宏来获取猫猫的名字，该宏不是运行时的 API 调用，而是在打包时获取数据，将结果直接内联到最终产物中：

```
// cats.ts
export async function getCat() {
  const response = await fetch('https://space.bilibili.com/3493137875994964?spm_id_from=333.1245.0.0')
  const cat = await response.json()
  return cat.name
}

// index.ts
// Bun 的 JS 宏
import { getCat } from './cats.ts' with { type: 'macro' }
const cat = await getCat()

// build/index.js
// 打包后直接内联数据，比如猫猫的名字
var cat = await '人猫神话'
console.log(cat)
```