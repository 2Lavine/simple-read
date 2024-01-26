> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7078906878779981832?searchId=202401261549374C48CC23171B271C060A)

大家在开发项目的时候，会不会出现以下这种情况：

*   需求来的太急，为了尽早实现功能导致代码结构混乱
*   很难对现有代码进行重构，导致屎山越堆越高，最后新加一个功能需要考虑很多方面
*   冗余代码太多

朋友，我想你需要了解 TDD 了：

*   TDD 是什么？Test Driven Development，测试驱动开发
*   TDD 有什么好处？测试来保证代码的功能正常，重构只需要通过测试即可。

TDD 是**测试驱动开发** （Test-Driven Development）的英文简称，是敏捷开发中的一项核心实践和技术，也是一种设计方法论。TDD 的原理是在开发功能代码之前，先编写单元测试用例代码，测试代码确定需要编写什么产品代码。

当然本文讲述的并不是 TDD 这项技术，而是 Vitest，并且网络上也有很多关于 TDD 的文章，这里就不再赘述。

那么我为什么要说，Vitest 是 TDD 的一大利器呢？不知道大家有没有了解 Vite，是 Vue 作者尤雨溪写的目前由 Vue 核心开发者维护的基于 ESM 的面向现代浏览器的前端打包工具。关于 Vite，我想大家第一个想法就是快，目前很多项目也使用 vite 作为打包工具。

[为什么选 vite，大家可以点击这里查看更多信息](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fwhy.html "https://cn.vitejs.dev/guide/why.html")

而 Vitest 的定位，则是 Vite 项目的首选测试框架，而因为 Vitest 足够优秀，我认为即使你的项目采用 jest 作为测试框架，或不以 Vite 作为项目驱动，依然可以采用或切换 Vitest 作为测试框架。

聊了这么多，我想我需要正式介绍一下 Vitest 了。

为什么要用 Vitest
------------

*   由 Vite ⚡️ 提供支持的极速单元测试框架，开发者与维护者为 Vue 核心团队成员之一 antfu。
*   与 Vite 的配置通用，watch 模式下极快的反应（相当于测试中 HMR）。
*   可以对 Vue/React 组件进行测试。
*   开箱即用 Typescript/JSX/ESM（这一点我想配过 jest 的人应该懂是什么意思）
*   与 Jest 几乎相同的 API，同时也有 Jest 的快照功能（这个非常好用！）
*   模拟 DOM
*   生成测试覆盖率
*   等等......

[Vitest 中文文档](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitest.dev%2F "https://cn.vitest.dev/")

目前还在全力翻译中，我也是贡献者一员，欢迎大家一起来翻译和校对！

使用 Vitest
---------

### 1. 安装 vitest

```
// 使用 npm
$ npm install -D vitest

// 使用 yarn
$ yarn add -D vitest

// 使用 pnpm
$ pnpm add -D vitest
```

几乎不用配置，你就可以来玩一玩 vitest 了！

### 2. 编写测试文件

默认可以匹配的文件为 `[filename].{spec, test}.{ts, js}`

例如，我们可以在项目根目录创建一个 `index.test.ts`

```
import { expect, test } from 'vitest'

test('hello vitest', () => {
  expect(1).toBe(2)
})
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2efd305049b54a04923dd97080d9225a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

vitest 默认以观察模式（watch 模式）启动，所以我们可以随时查看自己的代码是否通过测试。

如果你仅仅是想运行测试，那么可以使用 `vitest run`（非观察模式）

### 3. inlineSnapshot

剩下的例子你都可以通过官方文档来详细的了解，因为 vitest 的 jest 的 API 非常相似，如果你有 jest 的使用经验，那么 vitest 的上手也是极快的。

下面我来介绍一个非常好玩的特性 `inlineSnapshot`，这个功能可以让我们直接看到我们的代码运行后的效果

例如，我编写一个函数，用于生成一个数组

```
export function genNumber(min: number, max: number): number[] {
  const result = []
  for (let i = min; i <= max; i++) {
    result.push(i)
  }
  return result
}
```

这是我的测试文件

```
// 常规的写法，我们需要这样
test('hello vitest', () => {
 expect(genNumber(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
```

但是如果我们只是想看看这个函数运行之后的效果呢？有意思的地方来了，如果我们使用 `toMatchInlineSnapshot`，在开启观察模式的情况下， Vitest 将会自动更新快照。如果我们想更新快照，可以在观察模式下直接敲击 `u` 来更新快照。非观察模式下可以通过 `vitest -u` 可以批量更新快照

```
expect(genNumber(2, 20)).toMatchInlineSnapshot()
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4757d19a9a0342cf9343118f322b5f87~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

写在最后
----

希望这篇文章可以让你快速了解 vitest，并对前端 TDD 兴趣，相信我，TDD 是非常棒的开发模式！