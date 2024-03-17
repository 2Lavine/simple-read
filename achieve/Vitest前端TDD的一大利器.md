> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7078906878779981832?searchId=202401261549374C48CC23171B271C060A)

*   TDD 是什么？Test Driven Development，测试驱动开发
*   TDD 有什么好处？测试来保证代码的功能正常，重构只需要通过测试即可。

为什么要用 Vitest
------------
*   与 Vite 的配置通用，watch 模式下极快的反应（相当于测试中 HMR）。
*   可以对 Vue/React 组件进行测试。
*   开箱即用 Typescript/JSX/ESM（这一点我想配过 jest 的人应该懂是什么意思）
*   与 Jest 几乎相同的 API，同时也有 Jest 的快照功能（这个非常好用！）
*   模拟 DOM
*   生成测试覆盖率

使用 Vitest
---------
### 2. 编写测试文件
默认可以匹配的文件为 `[filename].{spec, test}.{ts, js}`
例如，我们可以在项目根目录创建一个 `index.test.ts`
```
import { expect, test } from 'vitest'
test('hello vitest', () => {
  expect(1).toBe(2)
})
```
vitest 默认以观察模式（watch 模式）启动，所以我们可以随时查看自己的代码是否通过测试。
如果你仅仅是想运行测试，那么可以使用 `vitest run`（非观察模式）
### 3. inlineSnapshot
下面我来介绍一个非常好玩的特性 `inlineSnapshot`，这个功能可以让我们直接看到我们的代码运行后的效果
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