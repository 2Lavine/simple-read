> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7297159273906159657?searchId=20240130221020658A065315F1CE364277)

CSR
---
客户端渲染（CSR）是在用户的浏览器端进行页面渲染的一种方式，比如 Vue 和 React。在项目开发结束后，Vue 或 React 的代码会被打包成多个 bundle.js 文件。这些文件放在服务器上，当用户访问网站时，服务器会返回这些 bundle.js 。浏览器接收到这些文件后，开始解析执行它们，触发网络请求获取数据并最终渲染页面内容。

这个流程包含了两个主要阶段。首先是请求并解析 bundle.js 文件，然后根据其中的逻辑，发起网络请求以获取数据并完成页面渲染。然而，当 bundle.js 文件过大时，它可能会阻塞解析过程，导致网络请求的延迟，进而导致页面出现白屏现象。另外，由于返回的 js 文件对搜索引擎爬虫不友好，可能导致爬虫无法获取有用的页面信息。

SSR
---

服务端渲染（SSR）是在服务器端进行页面渲染的方式，例如古早的 php、jsp 等技术。

用户访问网站时，会先在服务器请求数据并将其渲染为 HTML 字符串页面。如果页面包含交互逻辑（例如 click 事件），服务器会生成相应的 js 文件，然后将 HTML 字符串页面、js 发送到客户端，让 HTML 和 js 进行融合，恢复交互逻辑。

不同于 CSR 需要返回 bundle.js，SSR 返回的是 HTML 字符串和少量的 js 文件，明显减少了 bundle 体积。数据请求和渲染都在服务端进行，返回的是 HTML 字符串，浏览器能够即刻识别并呈现，有利于搜索引擎优化和提升首屏加载速度。

但 SSR 也不是没有缺点。
- 首先，由于在服务端渲染，因此不能像 CSR 那样写复杂的交互逻辑，只能写简单的 click 事件。其次增加服务端的开销。最后如果请求的数据量过大，会导致服务端的压力，也会造成白屏。

RSC
---

RSC 全称为 **React Server Compent**，是 React 团队提出在服务端运行 React 组件的方法。RSC 是 React 新的开发范式，目前 Nextjs 已经实现了 RSC。

下面这段代码是 Nextjs 中实现的服务端组件：

```
import prisma from "@/lib/prisma"

const fetcher = async () =>{
  return prisma.user.findUnique({where: { id: 1 }})
}

export default async function Home() {
  const data = await fetcher()
  return (
    <main>
      <div>{data?.username}</div>
      <div>{data?.email}</div>
    </main> 
  )
}
```

> 在 Nextjs 中所有组件默认为 RSC。

这段代码中，Home 组件通过 fetcher 函数中的 prisma 向数据库查询了 id = 1 的用户，并将部分些信息放到的 jsx 中。你可能会担心，这段代码安全吗？事实上这段代码十分的安全，它是完全运行在服务端中，拿到结果以后会渲染为 HTML 返回给浏览器。
在传统的 React 组件中，我们需要将请求放在 useEffect 里面，这样才能保证只发送一次请求。 服务端组件支持异步 ，意味着可以在组件中请求数据，而不需要 useEffect 。
也由于是服务端渲染，所以 服务端组件不能使用 useState 和 useEffect，实现不了复杂的交互逻辑，那怎么办？别急，我会在往后的小节中介绍新的客户端组件。
到目前为止，看起来 RSC 跟 SSR 没什么区别呀，其实 RSC 跟 SSR 最大的区别是，它支持流式渲染。

### 流式渲染
流式渲染顾名思义，服务端组件支持将组件一点一点地流到浏览器中，并最终形成完整的页面。
假如一个页面有 A、B、C 三个组件，它们获取到数据的时间各不同。A 获取到数据的时间比较快，先将 A 返回到浏览器，后续依次把 B、C 返回到浏览器中，最终合并成完整的页面，就不用像 SSR 那样整个页面渲染为 HTML 才返回。 流式渲染返回的是类似 json 的数据，记录的组件的 dom 元素和内容。 
**那怎么使用流式渲染呢？**
很简单，使用流式渲染需要搭配 React 的 `<Suspense>`，它支持子组件没完成加载时显示预备的组件，比如 loading。
先实现一个 A 组件，等 3 秒后才返回数据。
```
import React from 'react'

const fetcher = async (): Promise<string[]> =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['大海', '河', '蝴蝶结']);
    }, 3000);
  });
}

async function A() {
  const data = await fetcher()
  return (
    <div>
      {data.map( i => (<span key={i}>{i}</span>))}
    </div>
  )
}

export default A
```

在 `src/app/page.tsx`里面使用 `<Suspense>`包裹 A 组件就开启了流式渲染。

```
import React, {Suspense} from 'react'
import A from '../components/a-test'

function Home() {
  return (
    <div>
       <h2>Home Page</h2>
       <Suspense fallback={<div>Loading...</div>}>
         <A/>
       </Suspense>
    </div>
  )
}

export default Home
```

**流式渲染是怎么实现的？**
---
> 这里描述简单的流程，而非原理。

流式渲染返回的是一个 json 字符串，记录着 dom 元素类型，内容等，这个 json 被称为 **RSC Payload**
1. 等包裹在`<Suspense>`中的组件加载完成后，会被编译为 **RSC Payload**。
```
"a:[\"$\",\"div\",null,{\"children\":[[\"$\",\"span\",\"大海\",{\"children\":\"大海\"}],[\"$\",\"span\",\"河\",{\"children\":\"河\"}],[\"$\",\"span\",\"蝴蝶结\",{\"children\":\"蝴蝶结\"}]]}]\n"
```
2. 一开始返回的 HTML 中预留着 `<tamplate>`和`<!--$?-->`注释。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/725168f82ba54190837a140a33580b89~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=353&h=141&s=10464&e=png&b=fffefe)

3. 服务端返回 **RSC Payload** 并且渲染后，会通过 dom 操作查找到两个`<!--$?-->`和 `<tamplate>`并将它们替换掉。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f20e7183801b405aa0cd6e0653ef339d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=884&h=540&s=62536&e=png&b=ffffff)

### 客户端组件
在 RSC 范式中，传统的 React 组件被成为客户端组件 **React Clinet Compent**。在 客户端组件 中可以使用 `useEffect`、`useState`这些 hook，弥补了服务端组件不能进行复杂的交互逻辑的缺点。
那如何识别客户端组件呢？很简单，有 `use clinet`的就是 客户端组件。
```
'use client'
import React, { useState } from 'react'

function Count() {
  const [num, setNum] = useState(0)

  const handleClick = () => {
    const t = num + 1
    setNum(t)
  }
  return (
    <button onClick={handleClick}>{num}</button>
  )
}

export default Count
```

注意！不要看到 Client 就以为 客户端组件 只会在客户端渲染，在 Nextjs 中客户端组件也会在服务端预渲染一遍，但不会执行 `useEffect`，如果`useState`有初始值，也会渲染到页面中。

由于预渲染时 node 环境没有 dom，因此对于 dom 操作要将其放在 `useEffect`或者触发事件的函数里面。

### 边界

如果客户端组件包裹着服务端组组件，并且状态不断改变，那么服务端组件会重新渲染吗？
比如：
```
function server() {
  return (
    <div>RSC</div>
  )
}
```

```
'use client'

import React, { useState } from 'react'
import Server from './server'

function Count() {
  const [num, setNum] = useState(0)

  const handleClick = () => {
    const t = num + 1
    setNum(t)
  }
  return (
    <>
      <button onClick={handleClick}>{num}</button>
      <Server/>
    </>
    
  )
}
```

答案是会。因为，即使服务端组件已经在服务端完成了渲染，当它被引入到客户端组件并随着客户端组件的状态变化而重新渲染时，它也应该一同被重新渲染。

因此，Next.js 引入了一项新规则：在客户端组件中使用服务端组件时，将自动转换为客户端组件。
**那我就想在客户端组件使用服务端组件呢？**

其实也可以，将服务端组件以 children 的形式传到客户端组件中，服务端组件就不会为变为客户端组件。

```
function ServerCompent() {
  console.log('on server')
  return (
    <div>ServerCompent</div>
  )
}
```

```
'use client'
import React, { useState } from 'react'

function Count({
  children,
}: {
  children: React.ReactNode
}) {
  const [num, setNum] = useState(0)
  const handleClick = () => {
    const t = num + 1
    setNum(t)
  }
  return (
    <>
      <button onClick={handleClick}>{num}</button>
      {children}
    </>
  )
}
```

在服务端组件中使用 Count 并且将 ServerCompent 以 children 的形式传进去。

```
import React from 'react'
import Count from '../components/count'
import ServerCompent from '../components/server'

function About() {
  return (
    <>
      <Count>
        <ServerCompent/>
      </Count>
    </>
  )
}
```

我们提到过在客户端组件中使用的组件默认都是客户端组件。然而在服务端组件中，将其他服务端组件以 children 形式传入客户组件中，那该组件就不会变为客户端组件。

例如，About 和 ServerCompent 都是服务端组件，Count 是客户端组。在 About 中将 ServerCompent 以 children 的形式传入 Count 中， ServerCompent 依旧是客户端组件

为什么会这样呢？

在服务端组件的范围内属于服务端渲染，那么在服务端组件中使用客户端组件，客户端组件应该也要预渲染一遍，不然以 children 形式传入的服务端组件，怎么在服务端渲染。