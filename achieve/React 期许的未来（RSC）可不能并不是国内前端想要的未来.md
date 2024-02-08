> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7291936473079480355?searchId=20240130221020658A065315F1CE364277)

背景
--
*   **代码质量应该如何保证**，说实话之前工作的公司的同事水平都挺高，可为什么代码总是会变成屎山？是架构做的不好？管理不到位？时间年限太久了？还是什吗原因？
*   **模板化的代码有很多**，这个所谓的模板化充斥在各个地方，为了降本增效公司搞了多种方案的低代码，说实话作为程序员用的真心难受
    *   比如后台管理里的 CRUD ，无非都是表单表格弹窗，技术落地不难，恶心人的是业务和来之不尽的需求
    *   比如每次创建项目都得搭一遍基础架子，由于项目和业务灵活，脚手架自动生成有用，但不好用
*   **巨石应用的处理**。公司有维护了超 5 年以上的大项目，当应用大到一定程度，屎到一定程度，怎么砍屎山呢？
    *   传统的微前端做法，只能解一定程度，还得考虑线上事故，畏手畏脚
    *   现有的 ssr 方案搞不定这种级别的需求
    *   开发和打包难题
    *   应用治理，团队协作，敏捷开发
    *   项目怎么防腐，延缓屎下去
*   前后端耦合的畸形，**想要迁移技术栈**，可很难迁不完全导致以畸形方式继续耦合运行
    

这些是所有公司维护到后边最终都会面临的问题，看似我鬼扯了一堆和标题不符的话，其实我是想表达我想到个一个观点

**面向用户的前端代码的生命周期是从浏览器加载 js 的那一刻开始的，为了尽可能做到高效的用户体验，我们有太多太多的东西需要挤破头似的，需要在进入页面初期执行，可这是不现实的，都说 js 的效率低，可真的不算慢啊，而用户的耐心还有限，意味着留给首屏的时间有限**

或许可以从以下两个点解
1.  **生命周期前移**
    `ssr` 技术能让前端应用的生命周期从服务器接到请求的那一刻开始，这使得我们能做很多有意义的事情
    而 `React` 团队对 `RSC` 的推广话语完美了击中了这点，我觉得我需要这项技术
2.  **应用拆解**
    拆解即字面意思，我们需要做各种程度的拆解
    拆应用——微前端
    拆需求——别让产品把功能无脑堆首屏，哪怕首页分个屏内屏外都行
    拆依赖

它类似于 `umijs`，但我不在阿里，说实话 `umijs` 我用了后发现不是我想要的
- 它只是个为了内部服务，顺便开源的产物，我需要一个自己的框架，因为总得有个东西得干那些开发者不想干的脏活累活吧

挖坑到此为止，我们来围绕 `RSC` 聊聊服务端的事情

官方推荐版 RSC
---------
简单来说，它就是让我们的组件内部能写服务器的代码了，我们可以很轻松做到如下事情
1.  显著减少依赖，减少产物体积 —— 有些代码如果只在首屏用到只跑一次，那么在服务端执行后，浏览器内就直接拿结果而不用加载相关依赖了
2.  减少数据交流的开销 —— 前端是不存数据的，所有的都在后端，可 http 传输的开销是不可忽视的。此时就可以和后端交流，把允许的数据放 redis ，从服务端取，再把结果带到客户端然后水合，性能会大大的提高
3.  极致的数据加载，流式渲染 & 服务端并发 —— 流式渲染能够在组件没有全部渲染完的前提下就送给前端展示，大大提高了用户体验；nodejs 只是跑 `js` 的主线程是单线的，其他可是多线程的，怎么用取决实际情况了
4.  技术栈的无缝衔接 —— 前后都是前端技术栈，我们只是在像往常一样写组件代码

而能够让这些种种技术衔接起来的就是框架，我们只是在像往常一样写组件代码，就能享受到全部
你能想象一个只能看不能用的那种牙痒痒的感觉吗

`RSC` 把组件分成了 **客户端和服务端** 两个概念，顾名思义，客户端就是平常用的，服务端组件是只能跑在服务端，不能带到客户端的部分

粗看感觉还好，挺合理，但一用就发现有蹊跷

```
"use server"

export default function ServerComponent() {
  const configs = readFileSync("./project-configs", "utf-8")//用浏览器没有的 API 读取项目配置
  const cacheData = useRedis("web-home-slids") //轮播图
  const dbData = useMysql() //除了缓存，还能查库

  return <main>
  	<Slids images={cacheData}></Slids>
    <Article data={dbData}></Article>
  </main>
}
```

```
"use client"

export default function Slids({images}) {
  const [index, setIndex] = useState(0)
  const toggleIndex = () => {}
  useEffect(() => {
    setTimeout
    
    return () => {
      clearTimeout
    }
  }, [])
  return <div>{images.map(...)}</div>
}
```

这是一个非常简单的 demo，这是渲染新闻页的例子，有轮播图，有新闻文章，有了 RSC 在服务端就能把用到的数据全部读出来

`"use server"` 开头的是只能运行在服务端的组件，它可以做各种浏览器做不到的事，并且相关的依赖都不会带到浏览器，也不会被打包到客户端的产物中；相对的关于数据的响应式变更，副作用 `useEffect` 之类的会全部失效

`"use client"` 开头的是客户端组件，轮播图如果用插件的话，大多还是基于 js 的，所以纳入到客户端

看似一切顺利的背景下，再来想想我们经常面对的是什吗？

是后台管理系统，是一个**重客户端，轻服务端**的东西，而 `RSC` 的特点是 **重服务端，轻客户端** 国内外的需求和市场有有区别的

按照 `React` 的约定，所有组件默认是服务端，只有自己手动写上 `"use client"` 才是客户端组件，只要忘写就是一片红（React 的报错老长了，加上框架的更长）

服务端和客户端的组件数据交互需要以嵌套的形式写

```
"use server"
function ServerComp() {
  return <> <ClientComp>{server data}</ClientComp> </>
}
```

框架会把编译后的服务端组件的数据字符串化注入给客户端组件，这意味着子组件无法直接引入客户端，特殊方式无法大面积铺开用

可以简单的认为，必须要在浏览器靠 js 运行维持功能的只能是客户端组件，而后台管理几乎全是

## action 技术
请求方面，按照官网的推荐，我们还可以用种叫 `action` 的技术来应对请求，它可以和 `RSC` 结合到一起做请求，demo 粘贴 [`nextjs`](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fapp%2Fapi-reference%2Ffunctions%2Fserver-actions "https://nextjs.org/docs/app/api-reference/functions/server-actions")

```
'use server'
export async function myAction() {
  // ...
}


'use client'
import { myAction } from './actions'
export default function ClientComponent() {
  return (
    <form action={myAction}>
      <button type="submit">Add to Cart</button>
    </form>
  )
}
```

简单来说就是所有关于接口出发请求，请全部放到 `<form>` 标签里，处理请求的是个函数，根据框架不同实现也不同

用 `remixjs` 框架你需要用到 `react-router` 的数据路由，并且喜提翻倍的路由打包体积

用 `nextjs` 你需要在服务端做校验

其实都相当于我们得把所有接口逻辑写到 `action function` 中，其他不变，工序喜 + n


以客户端为主的 `RSC`
-------------
当我意识到事情开始不对劲时，第一想法是能不能转变思路，把它给强行改成客户端为主的方式
让我有这么干的勇气是因为我搞定了核心卡点
1.  流式渲染怎么做
2.  流式渲染过程中产生的数据怎么带到客户端 —— 流式下和以前那种靠服务器路由钩子的做法不适用
3.  怎么做到服务端和客户端的分离
4.  怎么把服务端编译成数据喂给客户端组件内

按照 `React` 官方规范，组件是不是服务端是以 `use xxx` 指令的形式区分的，还必须在开头
在 `vite` 插件的 `transform` 中能扫出来，区分就做到了
服务端编译成数据喂给客户端组件内可以结合插件，把扫出来的客户端组件，外边套一层自定义组件，它用于接受服务端组件传给子组件的内容

不收集起来就没法提前送到客户端，在客户端水合的时候放进去占位，进而引发报错

动态收集需要依赖上下文，流式渲染，和在什么地方什么时间把收集的送给客户端直接套 API 就行 [renderToPipeableStream](https://link.juejin.cn?target=https%3A%2F%2Freact.docschina.org%2Freference%2Freact-dom%2Fserver%2FrenderToPipeableStream "https://react.docschina.org/reference/react-dom/server/renderToPipeableStream")

解释下为什么服务端给客户端注入数据没事，而客户端里引服务端就需要动态收集的原理
*   最终的目的是，浏览器显示正常，水合不报错，功能正常
*   客户度给服务端注入其实就不用管，套 API 服务端的就搞定了，麻烦的在客户端上的处理。这个东西文字很难讲，建议是实际体验下 nextjs 的 rsc，它会涉及到客户端多入口的问题，需要通过代码分析给扫出来，再动态编译客户端入口。在水合时，其实是从客户端组件那个点开始水合，而客户端组件没法套服务端组件，所以差异部分直接就不用管了。所以难点在怎么把那么多的服务度组件和客户端组件的临界点给找出来在做针对性的编译
*   但以客户端为主的不同，客户端组件内套着服务端，打成字符串后，本应该只在服务端处理的内容在浏览器水合阶段就参与进来了，所以必须收集相关数据，在这时进行自动填充

经过这么一番折腾，原型是做出来了，也能正常跑，功能一切正常，打包没报错

**但缺点有两个，致命缺点有一个**
1.  `useId` 坏掉了，我想了些方法弥补发现都不行
2.  客户端和服务端组件的临界点，也就是通过 plugin 扫出来的给包了一层的那个，必须要一层 dom 标签
3.  之所以套是因为，服务端组件返回的可以是个 dom 结构，如果直接以属性的方式放进去会变成普通字符串，所以必须操作 dom 进入注入，既然操作 dom 可能就会不安全
```
function Client() {
  return <div id="root">
    <ServerComponent />
  </div>
}

//这个组件内容是动态编译出来的，__html内才是组件原本的内容
function ServerComponent(props) {
  return  <div dangerouslySetInnerHTML={{__html: <OriginComp {...props} />}}></div>
}

//这是原始内容
function ServerComponent(props) {
  return <><p>server component</p><p>123</p></>
}
```

```
<div id="root">
  <div>
    <p>server component</p>
    <p>123</p>
  </div>
</div>
```
总结
--
新的做法是提供 `server-hook` 来在客户端组件内写服务端代码，然后把数据进行动态注入
```
function App() {
  const data = useServerData("id", async () => {
    return useMysql()
  })
  return <div>{data}</div>
}
```

这是其中一种，进入是 `Promise`，返回都不用 `Await` 看起来还是挺有意思的吧
原理是相通的，所以 `React/Vue` 都能做到，其中的脏活都放到了框架的逻辑中，以插件的方式做热插拔
不过框架不是重点，重点是 `React` 团队这种 `all in server` 的做法很多想法都非常好，要不然我也不会搞这玩意搞得死去活来的，可是技术是拿来用的，它目前的运作方式并不契合国内的前端业务