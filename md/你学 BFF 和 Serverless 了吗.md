> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844904185427673095?searchId=202310112321308327B15ADF8DF7D46EDD) ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729c96752f834da~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

> ❝
> 
> 前沿：前段时间在公司内部分享了关于 bff 和 serverless 的知识体会，从概念、特征、和应用场景再到简单的实践，今天借此机会跟大家分享，什么是 BFF? 什么是 serverless？
> 
> ❞

### 1.BFF

> ❝
> 
> 在聊 Serverless 之前跟大家先谈谈 BFF，BFF 顾名思义就是`Backend For Frontend`, 用中文解释就是服务于前端的后端，那么为什么会有 BFF？
> 
> ❞

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cabbd8356ca4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

前端同学和后端同学都各有各的道理，有没有一种解决方案可以化解这种尴尬的场景，于是就有了 BFF

#### 1.1 介绍

> ❝
> 
> BFF 层初衷是在后台服务与前端（客户端）之间添加一层，接下来我们来看看下面这张图
> 
> ❞

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729ca0cbce089f3~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

> ❝
> 
> 👦啊宽同学提问：那 BFF 到底发挥什么作用？
> 
> ❞

答案是：`用户体验适配层和API聚合层` : 主要负责快速跟进 UI 迭代，对后 端接口服务进行组合、处理，对数据进行：裁剪、格式化、聚合等

在 BFF 层下面是各种后端微服务，在 BFF 上层则是各种前端应用（多端应用），向下调用后端为服务，向上给客户端提供接口服务，后端为 BFF 层的前端提供的的 RPC 接口， BFF 层则直接调用服务端 RPC 接口拿到数据，按需加工数据，来完成整个 BFF 的闭环（以 Node+GraphQL 技术栈为主）

> ❝
> 
> 👧啊呆同学提问：那 BFF 层谁来开发？
> 
> ❞

遵循服务自治，谁使用谁开发的原则，也就意味着只能由前端同学来挑起这个重任，同时着离 “全栈工程师” 又进一步了。不知道🤷‍♂️ 是应该庆幸还是苦恼咯

BFF 是否可以由后端来做？当然可以，只是说带来新的问题，就总是包接口，会导致个人能力提升受限

> ❝
> 
> 🙆啊宇同学提问：你是不是漏了 api 网关？
> 
> ❞

这个问题好 BFF 和网关 Gateway 都是微服务架构中的重要的两个概念, 看下图简单的例子 👇

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cc59e632b001~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

> ❝
> 
> 分享一下蚂蚁金服体验技术部负责人玉伯，曾说的一句话：“BFF 模式不仅仅是一种技术架构，从社会分工角度讲，BFF 更是一种多元价值导向的分层架构”
> 
> ❞

#### 1.2 BFF 的优势

主要有以下几点优势👇

*   可以降低沟通成本：后端同学追求解耦，希望客户端应用和内部微服务不耦合，通过引入 BFF 这中间层，使得两边可以独立变化
*   多端应用适配：展示不同的（或更少量的）数据，比如 PC 端页面设计的 API 需要支持移动端，发现现有接口从设计到实现都与桌面 UI 展示需求强相关，无法简单适应移动端的展示需求 ，就好比 PC 端一个新闻推荐接口，接口字段 PC 端都需要，而移动端呢 H5 不需要，这个时候根据不同终端在 BFF 层做调整，同时也可以进行不同的（或更少的）API 调用（聚合）来减少 http 请求

> ❝
> 
> 总结：当你在设计 API 时，会因为不同终端存在不同的区分，它们对服务端提供的 API 访问也各有其特点，需要做一些区别处理。这个时候如果考虑在原有的接口上进行修改，会因为修改导致耦合，破坏其单一的职责。
> 
> ❞

#### 1.3 BFF 的痛点

*   重复开发：每个设备开发一个 BFF 应用，也会面临一些重复开发的问题展示，增加开发成本
*   维护问题：需要维护各种 BFF 应用。以往前端也不需要关心并发，现在并发压力却集中到了 BFF 上
*   链路复杂：流程变得繁琐，BFF 引入后，要同时走前端、服务端的研发流程，多端发布、互相依赖，导致流程繁琐
*   浪费资源: BFF 层多了，资源占用就成了问题，会浪费资源，除非有弹性伸缩扩容

献上之前 PPT 上看到一个 BFF 分层下的 “幸福烦恼”

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cd3cc6ddf9c7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 1.4 有什么方案可以解决传统 BFF 痛点？

*   包括解决前端需要关心应用的负载均衡、备份冗灾、监控报警等一些列运维部署的操作
*   如何统一管理和运维，提高发布速度、降低运维成本

答案是：`Serverless`

### 2.Serverless

> ❝
> 
> 我们可以将 `Serverless` 拆解为 server 和 less 两个单词，从字面上推断词意即为 “少服务器的，亦或是无服务器的，弱化后端和运维概念, 当前比较成熟的 Serverless 云产品主要有 Amazon Lambda、Google Cloud Function、Azure Function、AliCloud Function Compute、Tencent CloudBase 等
> 
> ❞

#### 2.1 Serverless 的演变

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cefd57ac2f3d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.2 什么是 Serverless

> ❝
> 
> Serverless = Faas (Function as a service) + Baas (Backend as a service)
> 
> ❞

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cf3b0a40a037~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.3 云函数（Faas）

> ❝
> 
> FaaS（Function-as-a-Service）是服务商提供一个平台、提供给用户开发、运行管理这些函数的功能，而无需搭建和维护基础框架，是一种事件驱动由消息触发的函数服务
> 
> ❞

前端同学调用 Faas 服务如同调用本地函数一样简洁，如下所示，是一个腾讯云中一个简单的小程序云开发 demo，cloudfunction 是用来定义云函数的方法

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729d0dc24e12fcb~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.4 后端即服务（ BaaS）

> ❝
> 
> BaaS（Backend-as-a-Service）后端即服务，包含了后端服务组件，它是基于 API 的第三方服务，用于实现应用程序中的核心功能，包含常用的数据库、对象存储、消息队列、日志服务等等。
> 
> ❞

比如腾讯云云开发中下面的这些服务👇：

*   微信小程序的云调用 [wx-server-sdk](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fwxcloud%2Fguide%2Fopenapi%2Fopenapi.html "https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/openapi/openapi.html")
    
*   云开发数据库 [wx.cloud.database](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.weixin.qq.com%2Fminiprogram%2Fdev%2Fwxcloud%2Freference-client-api%2Fdatabase%2Fdatabase.html "https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/database.html")
    

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729d1b56e0edf1f~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.5 Serverless 的架构

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cf4426afc8f8~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.6 Serverless 的优势

*   环境统一: 不需要搭建服务端环境,, 保持各个机器环境一致 Serverless 的机制天然可复制
*   按需计费: 我们只在代码运行的时候付费，没有未使用资源浪费的问题
*   丰富的 SDK: 有完善的配套服务, 如云数据库, 云存储, 云消息队列, 云音视频和云 AI 服务等
*   弹性伸缩: 不需要预估流量, 关心资源利用率, 备份容灾, 扩容机器 ，可以根据流量动态提前峰值流量

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cf6e1c4a750b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

> ❝
> 
> “Serverless 带来的其实是前端研发模式上的颠覆。相对以往纯前端研发的方式，Serverless 屏蔽底层基础设施的复杂度，后台能力通过 FaaS 平台化，我们不再需要关注运维、部署的细节，开发难度得到了简化，前端开发群体的边界就得以拓宽，能够参与到业务逻辑的开发当中，更加贴近和理解业务，做更有价值的输出。”
> 
> ❞

#### 2.7 Serverless 的缺点

*   云厂商强绑定：它们常常会和厂商的其他云产品相绑定，如对象存储、消息队列等，意味你需要同时开通其他的服务，迁移成本高，如果想迁移基本原有的逻辑不可服用，kennel 需要重构
*   不适合长时间任务：云函数平台会限制函数执行时间，如阿里云 Function Compute 最大执行时长为 10 min
*   冷启动时间：函数运行时，执行容器和环境需要一定的时间，对 HTTP 请求来讲，可能会带来响应时延的增加
*   调试与测试：开发者需要不断调整代码，打印日志，并提交到函数平台运行测试，会带来开发成本和产生费用

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729cfca173abde6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

#### 2.8 Serverless 的应用场景

*   场景 1: 负载有波峰波谷

波峰波谷时，机器资源要按照峰值需求预，比如医院挂号这需求，假设在每天 10 点放号预约，那 10 点就会有峰值的出现，为了这个峰值并发的考虑，准备了相对应性能（固定）的服务器，然而在波谷时机器利用率又明显下降，不能进行资源复用导致浪费，而 serverless 不用为了波峰去做准备，不用留住水位，支持弹性缩扩容，在你高峰时再在进行动态扩容

*   场景 2: 定时任务（报表统计等）

服务空闲时间来处理批量数据，来生成数据报表，通过 Serverless 方式，不用额外购买利用率并不高的处理资源，比如每日的凌晨，分析前一天收集的数据并生成报告

*   场景 3: 小程序开发（云开发）

比如微信小程序开发 m 在实际开发中，如果我们不用云开发的 openid 获取流程，而用传统的方式，你就知道 openid 的获取是非常繁琐的一个过程，前端需要通过 wx.login 获取一个 code 值（具有时效性）再通过 code 值去后台用 appsecret 去调取 openid。

> ❝
> 
> 而云函数由于是部署在腾讯云的关系，腾讯云将云调用将鉴权部分有效的封装，让你的接口很容易的实现了鉴权保护，无需维护复杂的鉴权机制，从而让个人开发者和小团队可以更容易地开发小程序
> 
> ❞

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/10/1729da76deb541ba~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

### 3 总结

> ❝
> 
> 本文篇概念介绍，serverless 的更多实践会在后面介绍，有兴趣深入学习的同学可以先了解下以下这些个人的推荐阅读
> 
> ❞

*   “云” 端的语雀：用 JavaScript 全栈打造商业级应用 [阅读](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F101917567 "https://zhuanlan.zhihu.com/p/101917567")
*   Serverless 架构应用开发指南 [阅读](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fphodal%2Fserverless "https://github.com/phodal/serverless")
*   Serverless 掀起新的前端技术变革 [阅读](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F65914436 "https://zhuanlan.zhihu.com/p/65914436")
*   写给前端工程师的 Serverless 入门 [阅读](https://juejin.cn/post/6844903959224664077 "https://juejin.cn/post/6844903959224664077")
*   我们是如何从前端技术进化到体验科技的？ [阅读](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FIYddaaw2ps1wR2VT1dZWPg "https://mp.weixin.qq.com/s/IYddaaw2ps1wR2VT1dZWPg")

🌲酱往期文章：

*   [聊聊前端开发日常的协作工具](https://juejin.cn/post/6844904176330375181 "https://juejin.cn/post/6844904176330375181")
*   [前端表单数据那些事](https://juejin.cn/post/6844903632073129997 "https://juejin.cn/post/6844903632073129997")
*   [如何更好管理 Api 接口](https://juejin.cn/post/6844904154574356493 "https://juejin.cn/post/6844904154574356493")
*   [微前端那些事](https://juejin.cn/post/6844904112258023437 "https://juejin.cn/post/6844904112258023437")
*   [前端工程化那些事](https://juejin.cn/post/6844904132512317453 "https://juejin.cn/post/6844904132512317453")
*   [前端 Nginx 那些事](https://juejin.cn/post/6844904102447546382 "https://juejin.cn/post/6844904102447546382")
*   [前端运维部署那些事](https://juejin.cn/post/6844904118020997128 "https://juejin.cn/post/6844904118020997128")

#### 请你喝杯🍵 记得三连哦～

1. 阅读完记得给🌲 酱点个赞哦，有👍 有动力

2. 关注公众号前端那些趣事，陪你聊聊前端的趣事

3. 文章收录在 Github [frontendThings](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FlittleTreeme%2FfrontendThings "https://github.com/littleTreeme/frontendThings") 感谢 Star✨

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/14/1734b5c7eee1c03f~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)