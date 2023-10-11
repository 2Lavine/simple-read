> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844904084709834766?searchId=202310112321308327B15ADF8DF7D46EDD)

忙碌的日子总是过得特别快，回头一看，我已经做 node.js BFF 开发 8 个月了，基本上没写过 web 前端的事情，做了大半年，写篇文章来记录一下我这大半年的心路历程。

### 初步规划`BFF`

其实我刚进公司那会是做前端的，做 B 端前端开发，用 react 画页面，系统是一个持续做了一年多的，超过上百个模块的系统，画了 2 个月，项目人员调用，我进入移动组，参与移动端的开发，重新开发 `Hybrid App`，然后当时认为还有`h5`，`小程序`，所以当时画架构图，我把多端也考虑进去了，当时领导提出需要做`BFF`接入到中台到端，然而没有当时预料的多端，只有越来越壮大的`BFF`。

### 初步使用`node.js`，BFF 的起点

2019 年 7 月，搭建了前端`Vue`项目，写好了公共方法，另外的同事他们都是做`IOS`和`Android`开发的，所以没有使用过`Vue`，搭好了项目库框架，封装了`request`，`utils`, 等一些公共方法和样式，编写了两个页面，剩下的页面就先让他们开发。

也是在 2019 年 7 月，搭建了`BFF`第一个项目（已废弃），`BFF`公司已经内部自封框架了，我不是公司第一个使用`node.js`的（但是其他人应该没有前端和我一样吧，连续几个月全部是在做`node.js BFF`开发）。

第一个版本特别的简单，纯透传，当时的写法是每一个`api`都定义了一个`router`，然后 转发到另一个服务上（暂且叫 P 服务，缩写的第一个字母），数据全部来源自中台，P 系统在客户端没有请求后得 20 分钟后`Session`过期，所以这里只能把用户密码落入`session`中，透传发生 401 时重新使用用户账号密码解密。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba292a0ceec79~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

编写`jenkins`脚本，编写`Docker`脚本部署，由于以前没有接触过这两个东西，所以都是现学现用。

第一个版本上线的时候也踩了不少坑，因为一些`Docker`相关的服务转发和对容器不是很熟的原因，整体来说上线还算 OK。

### `BFF`拓展到了`CBS`层，也开始变得真正有价值，也开始有了踩坑

**CBS customer business System**  
开会时`leader`们都是这么叫的，我预计应该是这个意思

大概是 10 月份左右，我们接到了新的任务，接管另一套系统，融入到我们的`App`，从前端到后端（C 服务）都要我们写，这时候我开始看`Java`代码，用`Node.js`重写后端逻辑，也开始需要有了更多的后端的东西，`Mysql`,`服务发现`,`日志`，`Redis`缓存层，`BFF`鉴权，还提到了`cmq`(消息队列)，这些阶段我开始疯狂的学习相关后端的东西。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba299f3563a75~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

BFF 调用中台登录，登录后的权限，用户信息落入`Redis`，也解决分布式的权限问题，`api`由原来的 20 个透传，变成了 60 个接口左右，其中还有需要有两个登录接口，分别登录到两个不同的系统（P 和 C），把两个系统的授权信息全部存入`Redis`，可以说强行解决了用户授权的问题，其实这里我们意识到两个系统不容易融合，所以一直考虑`SSO`单点登录的问题，花了不少的时间考虑单点登录，但是最终不是我们来做这么事，由其它组的人开一个系统，把两个系统的账号密码`mapping`存入他们系统，再每次登录的时候去他们的系统寻找`mapping`关系，如果有 mapping，就自动登录另一个系统，也算强行解决了两个系统的登录差异，这里还设计了一张登录记录表，每次的登录信息存入表中。

由于对`Redis`，`Mysql`，和`mq`消息队列不太熟悉，所以在开发的时候也算苦不堪言，每天加班做业务，上下班做地铁，到家后就疯狂学习相关知识，在使用`Redis`的时候发现自己对`数据结构`的了解太少了，因为自己不是计算机专业，对数据结构的知识只有`JS数据类型`这么多，于是还花了时间去学习数据结构和算法，主要是`数据结构`方面的东西。以前听都没听过消息队列，即将要用了，还是要学习学习，`数据库`也是接触的少之又少的东西，从语法到 B + 树，简单的都了解了一下，语法学习了一下，数据库还是很菜，稍微复杂一点都得查。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba29d3064c0b2~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

用了三个星期的时间，虽然对 C 系统的业务没有什么很多的了解，但是把`Java`语法翻译到`JS`语法这个工作还是完成了。

期间部署踩了无数的坑，比如：我们的程序需要部署到多个地域，在深圳地域无法拉取到北京地域的镜像，最后让运维帮我把镜像复制到深圳镜像，并告知以后需要在另一个平台去推镜像。现在属于流程不规范。还有其他一些坑，没少麻烦架构师帮忙看问题，（也很感谢架构师

### 重新架构`BFF`层，`CBS`和`BFF`分开，开始拓展更多的业务系统

一段时间内相对平稳做迭代，这时候架构师开始对我们组进行要求，所有的日志必须齐全，公共组件的接入也必须规范化，同时我的代码开始被`code Review`，review 的时候我被吐槽的不要不要的，具体问题有：**语法太过于疏散，面向过程开发，习惯了`function`开发方式（面向过程），需要更规范的面向对象，以及所有的异步我基本都是使用了`try catch`包裹，一方面语法太难看，一方面不利于采集日志（这里我同架构师商量过了，也迭代了内部框架，直接调用，由框架进行错误捕捉，同时不会报出一些英文 / 代码错误的单词）**。

还有一个很重要的问题就是，`BFF`对接两个两个系统，以及还有对端的一些`api`，全都是在`单体系统`中，需要做架构拆分，于是架构师最后给出了一个方法，先拆成三个服务，一个是`BFF代理服务`，另外两个，一个对接`P`服务，一个对接`C`服务 于是在 19 年年底，快放假的前两个星期，我开始了改造之路，一边进行改造，一边进行迭代，组人并不多，`BFF`我在写，其他同事在做微前端改造（感觉自己错过了一个亿的经验值），于是这些事一点点积压的非常忙，有时间就疯狂学习，在家就疯狂写代码。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba2d3af599eda~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

在 2020 年的 2 月份，具体就是上个月中，这三个系统上线了，上线过程中不算顺利，本来半分钟就能启动成功的容器，两分钟能切换的转发，因为一些别的配置，上了两个小时......

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba2d8be8d01c7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

### 重新架构后带来的好处

面向对象式编程，代码更简洁易懂，也更好维护了。 100% 原汁原味的`Airbnb规范`。 拆分成了三个服务，三个服务迭代开发互不影响，互相发布部署也各不影响。 新框架迭代后日志更全了，`rpc调用日志`，`db操作日志`，`三方调用日志`，`api访问日志`，对于错误记录再也不用慌了。 新框架的服务发现采用中用到了多进程模式，也不会因为服务发现而影响主线程的逻辑处理。

### 重新架构后我遇到的鉴权问题

不同服务之间如何对客户端的请求进行鉴权，比如我现在手头又新启了一个积分服务，这个积分服务的逻辑比较复杂，和中台的交互较少，和数据库的交互比较多，数据是自己存取的，所以也就是接口除了提供给`App`，还需要提供给`B端管理平台`，这时候管理平台的鉴权和 APP 的鉴权是不一样的，需要调用 B 端系统来做管理平台的鉴权，鉴权通过后我才能给数据，同时`APP`的鉴权（虽然 APP 的鉴权也是我写的，可是不在这一个服务上，我还是需要调用另一个服务才能达到鉴权的目的），觉得有一些繁琐，我想大厂里成百个系统一定不可能是这么鉴权的，对接起来会累死。这一点目前还没有想到好的解决办法。

### node 开发的优点

第一优点当然是 `JS`语言的优势，语法上上手的成本非常少。 之前我们是考虑了多端的场景的，多端在这里依然是优势，中台只需要给出一份数据，BFF 可以根据不同端给出不同数据 适用`nodejs`做接入层非常合适，开发迅速，部署方便，成本极低 前端开发的时候总是要和后端沟通字段的问题，`CBS`给出的接口基本上是完全对照页面给的，跟我基本上不需要沟通字段的问题，一方面 BFF 可以做接口聚合，多个接口的数据放到一个接口上，客户端减少请求次数。 这种趋势越来越流行，比如`小程序云开发`，`Serverless` 超轻量级服务，在一些业务场景中还是很适用的。

### 槽点

Node.js 的学习资源还是太少了，比如我在学习`Redis`的实战教程的时候，就只能看`Java`版本的，学习`RabbitMq`的时候也是`Java`的。我看的`数据结构和算法教程`也是`Java`的，当然这个可能大家都是看 C 的，但我不会 C，就很无奈了，当然书籍有`JavaScript`版本的，大家感兴趣可以自己看。  
实战方面的踩坑，我也踩过不少，比如使用`node`图片处理，这方面我也是踩坑了两天才上手了。[node-canvas 生成营销图](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoolliyong%2Fcoolliyong.github.io%2Fblob%2Fmaster%2Fdocs%2Fnode%2Fnode_canvas.md "https://github.com/coolliyong/coolliyong.github.io/blob/master/docs/node/node_canvas.md")。

但是，作为一个开发工程师，除了开发的能力，还要具备工程师不折不扣的折腾主义精神。奥力给。

### 总结

这段时间的 node.js 开发，接触到了许多前端之外的东西，借着这段时间也把后端的一些知识简单的学了一下，后端其实也有很多东西，远不止我提到的这些。 对异步编程的理解也更深入了，对于`nodejs`的了解也不是以前的 _demo 级_。 虽然有学习资源相对较少，但还是不影响`node.js性价比`很强的事实，内存使用很少，`CPU`占用也很小，这一点对于企业来说也很重要，资源就是钱。

性价比体现可以看 [Node + MQ 限流小计](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoolliyong%2Fcoolliyong.github.io%2Fblob%2Fmaster%2Fdocs%2Fnode%2Fcurrent_limiting.md "https://github.com/coolliyong/coolliyong.github.io/blob/master/docs/node/current_limiting.md")，虽然没有体现出极致性能，但还是可以看得出一些效果的。

**路漫漫其修远兮，吾将上下而求索**

### 其他链接：

[github 博客：欢迎 star，一起学习，一起成长](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoolliyong%2Fcoolliyong.github.io "https://github.com/coolliyong/coolliyong.github.io")

[KOA 中间件机制和实现](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoolliyong%2Fcoolliyong.github.io%2Fblob%2Fmaster%2Fdocs%2Fnode%2Fkoa_middle.md "https://github.com/coolliyong/coolliyong.github.io/blob/master/docs/node/koa_middle.md")

[Nodejs 操作 RabbitMq 快速上手](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcoolliyong%2Fnode_rabbitMQ_mqtutorial%2Fblob%2Fmaster%2FREADME.md "https://github.com/coolliyong/node_rabbitMQ_mqtutorial/blob/master/README.md")

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170ba283bb12e3c4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)