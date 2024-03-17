> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903887296528398?searchId=2024012213570360F7DC0954B0B4F08BCA)

前言
--

正常的开场本应该是 “什么是 Service Worker”，但 Service Worker 往往会和 PWA 被一同提起。无论屏幕前的你是有丰富 PWA 开发经验的大佬，还是从没有听过这个概念的小佬，本文都有义务讲清楚 Service Worker 和 PWA 的关系，在此假设大家仅仅是一个对 Service Worker 感兴趣的前端工程师，并没有丰富的相关经验。  
另外，本文力求抓住重点，理清思路，并不是一篇偏技术流的文章，如果您只是想了解某些 API 怎么用，或者遇到了什么问题需要解决，那本文将浪费您 5-20 分钟的时间，点个赞之后就快快关掉吧~

从 PWA 说起
--------

PWA 全称 [`Progressive Web Apps`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FProgressive_web_apps "https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps")，直译过来是 “渐进式网络应用程序”，看到这个翻译，大多数人应该是不接受的，因为我们并不能从字面上理解 PWA 是什么。以下是维基百科对 PWA 的定义：

> 渐进式网络应用程序（英语：Progressive Web Apps，简称：PWA）是一种普通网页或网站架构起来的网络应用程序，但它可以以传统应用程序或原生移动应用程序的形式展示给用户。

这也是一个正确但不充分的定义，不能很好描述 PWA 的真实特性。

经过一段时间的整理，在此表达一下本文对 PWA 的理解：  
Web 和 App 都懂，但 Progressive 是几个意思？说起 “Progressive 渐进式”，想必大家或多或少听过一些关于 Web 应用“平稳退化、渐进增强” 的设计理念，由于浏览器对于 Web 标准的跟进会有不同程度的滞后（更有甚者不但不跟进还要乱搞），很多优秀的新特性老旧浏览器并不支持，所以开发者有时会采取渐进式的策略，充分利用新特性，为支持新特性的浏览器提供更完善的功能和更好的体验（ ~让一部分人先富起来？~）。PWA 之 P，大约就是这个意思。  
众所周知，Web 应用和 Native 应用原本井水不犯河水，二者有着各自的应用场景和优势。但随着浮夸的移动互联网时代的到来，贪婪的人类想要取长补短，兼顾二者的优点，乐此不疲地发明了一坨又一坨血统不纯的烂尾混合开发技术，在此不一一列举，大家都懂。PWA 是为了达到同样目的的另一种尝试，它绝不是革命性的技术，只是传统 Web 应用向 Native 应用的又一次疯狂试探，也只是一次不大不小的进化而已。但区别于混合开发技术，PWA 是血统纯正的 Web 技术的自然延伸，背后有相关 Web 标准支撑。

这一次，PWA 相对于传统 Web 应用，主要在以下几个方面变得更强：

*   观感方面：在手机上，可以添加 Web 应用到桌面，并可提供类似于 Native 应用的沉浸式体验（翻译成人话就是可以隐藏浏览器的脑门）。这部分背后的技术是 manifest，虽然可以给带来全新的体验，但不是本文重点，就此别过。
*   性能方面：由于本文主角 Service Worker 具有拦截浏览器 HTTP 请求的超能力，搭配 [`CacheStorage`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FCacheStorage "https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage")，PWA 可以提升 Web 应用在网络条件不佳甚至离线时的用户体验和性能。
*   其它方面：推送通知、后台同步等可选的高级功能，这些功能也是利用 Service Worker 来实现的。

简单总结：PWA 是 Web 应用的自然进化，Service Worker 是 PWA 的关键。

目前来看，本文已疑似离题，所以让我们赶快回到 Service Worker
-------------------------------------

`Service Worker`是浏览器在后台独立于网页运行的、用 JavaScript 编写的脚本。  
让我们来看看最小的 Service Worker 长什么样，以及怎么跑起来：（朋友们请不要看见代码块就自动略过，请相信我真的没有几行）

```
// 不起眼的一行if，除了防止报错之外，也无意间解释了PWA的P：
// 如果浏览器不支持Service Worker，那就当什么都没有发生过
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // 所以Service Worker只是一个挂在navigator对象上的HTML5 API而已
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            console.log('我注册成功了666');
        }, function (err) {
            console.log('我注册失败了');
        });
    });
}
```

以上代码，在 load 事件触发后，下载并注册了 service-worker.js 这个文件，Service Worker 的逻辑，就写在这里:

```
// service-worker.js
// 虽然可以在里边为所欲为地写任何js代码，或者也可以什么都不写，
// 都不妨碍这是一个Service Worker，但还是举一个微小的例子：
self.addEventListener('fetch', function (event) {
    if (/\.png$/.test(event.request.url)) {
        event.respondWith(fetch('/images/支付宝收款码.png'));
    }
});
```

受到身后 TL 大哥桌面上扫码提需求支付宝二维码的启发，以上代码，可以拦截网页上所有 png 图片的请求，返回你的支付宝收款码图片，只要用户够多，总会有人给你打钱的。  
代码中的 self 是第一个匪夷所思的地方，看起来是一个未定义的变量，但稍加思索我们就可以意识到这是一个关键字，类似于 window 或 global，代表该 Service Worker 自身，所以想要玩转 Service Worker，是需要学习它的 API 的。  
我们暂且不去仔细看那些需要背的 API，只需要记得这段代码做了什么，它像一个 middleware 一样，拦截并处理了 HTTP 请求，此时的 Service Worker，可以理解为一个客户端代理。由于代码是人为编写的，开启了无限可能。另外，最可怕的就是流氓会武术了，所以 Service Worker 要求 HTTPS，注意那个 "S"，但为了开发调试方便，localhost 除外。

简单总结：

*   我们需要手动编写 service-worker.js 文件。
*   我们需要在网页中下载并注册 service-worker.js 文件。
*   Service Worker 具有超能力，可以拦截并处理 HTTP 请求。

Service Worker 的生命周期
--------------------

按照一篇文章的一贯节奏，到这个该深入的阶段，阅读体验往往突然变差，为了避免这种情况，不得不提的 Service Worker 生命周期话题，推荐大家去其它地方阅读，这种文章已经很多了，本文作者认为，此处可以写但没必要，并且没有信心写得比它们好，写了反而有抄袭凑字之嫌，所以在此仅仅贴出 MDN 的图，并简单总结（微笑）。  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/11/16bdf1a9d743e5f4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

简单总结：

*   Service Worker 生命周期：安装中、安装后、激活中、激活后、我废了。（有点像组件的生命周期不是吗？）
*   首次导航到网站时，会下载、解析并执行 Service Worker 文件，触发 install 事件，尝试安装 Service Worker，如果 install 事件回调函数中的操作都执行成功，标志 Service Worker 安装成功，此时进入 waiting 状态，注意这时的 Service Worker 只是准备好了而已，并没有生效，当用户二次进入网站时，才会激活 Service Worker，此时会触发 activate 事件，标志 Service Worker 正式启动，开始响应 fetch、post、sync 等事件。

Service Worker 的主要事件
--------------------

*   install：顾名思义，Service Worker 安装时触发，通常在这个时机缓存文件。
*   activate：顾名思义，Service Worker 激活时触发，通常在这个时机做一些重置的操作，例如处理旧版本 Service Worker 的缓存。
*   fetch：顾名思义，浏览器发起 HTTP 请求时触发，通常在这个事件的回调函数中匹配缓存，是最常用的事件。
*   push：顾名思义，和推送通知功能相关，没有相关需求的话可以不去了解。
*   sync：顾名思义，和后台同步功能相关，没有相关需求的话可以不去了解。

Service Worker 的应用
------------------

当我们掌握了 Service Worker 的基础，就可以尝试着应用了，在此着重介绍一些关乎网页性能方面的应用，不会粘贴代码，而主要谈谈思路和方法。

### 1. 缓存静态资源

Service Worker 的一大应用是可以利用 CacheStorage API 来缓存 js、css、字体、图片等静态文件。我们可以在 Service Worker 的 install 阶段，指定需要缓存的具体文件，在 fetch 事件的回调函数中，检查请求的 url，如果匹配了已缓存的资源，则不再从服务端获取，以此达到提升网页性能的目的。常用的构建 PWA 的`App Shell`架构，就是利用这种方式实现的。  
需要注意的是，性能的提升是相对于完全没有缓存的情况来讲的，而浏览器本身有着相对完善的 HTTP 缓存机制。所以使用 Service Worker 缓存，并不能使我们已经相对完善的架构有立竿见影的性能提升，Service Worker 缓存真正有意义的地方在于，利用它可以更精准地、以编码方式控制缓存，如何缓存、缓存什么、如何更新缓存，完全取决于代码如何写，所以这提供了很大的自由度，但同时也带来维护成本。它只是换了一种缓存方式，而不是从无到有的突破。

### 2. 离线体验

上一部分我们只是缓存了 js、css、字体、图片等静态资源，但如果我们将首页 index.html 也缓存呢？那结果是我们的网页甚至可以支持离线浏览。  
听起来很棒是吧？请坐下，这里有一个巨大的问题：假定我们的主页是 index.html，里边注册了 service-worker.js，service-worker.js 中缓存了 index.html 以达到离线浏览的目的，那么问题来了，在我们下次上线，死活是不会生效的，因为用户访问的总是缓存过的 index.html，是不是很尴尬？我们需要更新 service-worker.js 来重新缓存 index.html，虽然网上也有一些方案解决这种问题，但似乎异常纠结，让我们难免怀疑离线浏览是否有意义。  
下面的做法似乎更好一些：既然我们现在具有了离线缓存文件和拦截 HTTP 请求的能力，那我们可以在 Service Worker 安装时，缓存一个 offline.html，类似于 404 页面。离线状态下，我们访问 index.html 文件的请求是会失败的，在这个时机，我们返回 offline.html 文件展示给用户，至于具体展示些什么，取决于具体需求，甚至可以像 chrome 离线时那样，做一个小游戏来调戏没有网络的用户。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/11/16bdf1a99a593ace~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

### 3. 其它

Service Worker 只是提供了一些厉害的功能，但如何应用完全取决于开发者，如果脑洞大开，完全有可能提供令人耳目一新的体验。在此仅仅举一个小例子：  
我们知道，网页中图片是很消耗带宽资源的，用户等待网站加载，很多时候都是在等图片，而大多数放在 CDN 上的图片，都支持添加后缀参数获取不同分辨率照片的功能。假设我们有办法知道一个用户的网络条件的好坏（至于如何判断一个用户的网络条件，是另外一件事，可以让用户选择，也可用技术手段解决），把用户分级，暂且分为两级：网速快的和网速慢的。我们把网速级别信息放到 HTTP 请求的 header 中（或其它你想得到的合适的地方），当发起图片请求的时候，我们有机会拿到用户的网络级别，如果是网速快的用户，我们通过后缀参数返回 CDN 上高分辨率的图片，反之相反。  
这样的结果是网速快的用户可以看到更清晰的照片，而网速慢的用户虽然看到的照片清晰度差，但可以更早地看到照片，不必经过漫长的等待。

注意事项
----

以上的讨论，都是纸上谈兵，当我们真的要在生产环境实际应用的时候，仔细想想，就会发现事情不是那么简单，在此列举一些需要注意和考虑的地方。

*   首先，我们要做的是买好后悔药。因为无论如何，Service Worker 是在千奇百怪的客户端做一些危险的操作，如果出现问题（肯定会出现问题），往往不是 bug，而是事故级别。那样的话，我们恐怕需要在另一家公司才能继续试验我们可爱的 Service Worker 了。想的到的办法是，在类似配置中心的地方，或服务端，提供开关接口，请求页面前调用接口，如果发现事情不妙，就关闭开关，触发销毁 Service Worker 的代码。
*   如果项目经过了迭代，那么在项目测试的时候，QA 同学的浏览器环境和真实用户的浏览器环境是不同的，至少是覆盖不全的。Service Worker 的存在，本质上把原本就有状态的客户端变成了状态更加复杂的客户端。所以可能导致一些 bug 无法在测试阶段被发现，而且目测这些 bug 极难复现、调试、解决和检验。

应用场景
----

接下来让我们来谈谈 Service Worker 的应用场景，或者说什么样的情况才需要上 Service Worker，这很好理解，但很重要，我们不能拿着锤子，看什么都像钉子。

*   网站功能趋于稳定：频繁迭代的网站似乎不方便加 Service Worker。
*   网站需要拥有大量用户：管理后台、OA 系统等场景似乎不是很有必要加 Service Worker。
*   网站真的在追求用户体验：Bug 多多、脸不好看的网站似乎不是很有必要加 Service Worker。
*   网站用户体验关乎用户留存：12306 似乎完全不需要加 Service Worker。
*   等等等等。。。 ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/7/11/16bdf1a99ab517d0~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

简单总结：Service Worker 的初衷是极致优化用户体验，是用来锦上添花的，技术只是技术，但实际应用前，应考虑成本和收益。

一些废话
----

本文简单谈了谈 PWA 和 Service Worker 的关系、Service Worker 的基础、Service Worker 的生命周期和事件、Service Worker 的简单应用，以及实际应用中的注意事项和场景，只是一篇入门级的科普文章，大家可根据自己感兴趣的具体方面，去深入了解。鉴于本文作者是个才疏学浅的喷子，文章难免有所疏漏甚至误导，欢迎指正。

另外在码字过程中，有一些感想在此和大家分享：

*   Service Worker 和 PWA 已经出现大约 4 年左右了，但似乎一直是叫好不叫座的状态，也看不到什么爆发的趋势，其原因可能是多方面的，但最大的原因，可能是没有巨大的需求来推动，真正有潜力的技术，一定是你觉得不学都混不下去的那种。
*   Web 应用和 Native 应用的本质区别，是编译产物放在服务端还是客户端。Web 应用的静态资源需要从服务端获取，是造成了 Web 应用体验差的一大原因。浏览器 HTTP 缓存，和 Service Worker 的缓存，都是折中的方案，至少解决不了首屏加载慢的问题。
*   眼看着 5G 时代就要到来，Web 应用的性能问题，是否还是问题？Service Worker 可能带来的那几百毫秒级的性能提升，是否还有意义？当大多数人的网络条件上了新的台阶之后，可能网页将不再卡那么几秒，APP 也可以瞬间下载完成，那时我们真的还会折腾缓存吗？网页和 APP 还都会存在吗？

事已至此，本文已离题无误，至于 Service Worker，用来吹牛实在是再合适不过了，如果真要大规模应用，大家可能需要结合具体情况综合考虑。但无论如何，作为一项技术储备还是有必要的。不说了，外卖凉了。那你还愣着干嘛？快赶快点赞评论加收藏啊！  

![](https://static.daojia.com/assets/project/tosimple-pic/%E5%8A%A0%E4%B8%80_1562748283876.jpeg)

关于我们
----

快狗打车前端团队专注前端技术分享，定期推送高质量文章，欢迎关注点赞。