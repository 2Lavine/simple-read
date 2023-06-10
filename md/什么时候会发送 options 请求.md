> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903821634699277)

### 1 偶然的相遇——options 请求

最近写的项目，应用里所有的 ajax 请求都发送了 2 遍。由于新项目，基础模块是新搭的，所以出现一些奇葩问题也是意料之中，啊终于第一次在 chrome 的 devTools 遇见了活的 options 请求。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1ef19b66d8e5f~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 1.1 第 1 次请求

这里首先发送了一次额外的 options 请求，在浏览器里看到请求 request header 和 response header 的信息如下：

#### （1）预检请求头 request header 的关键字段：

<table><thead><tr><th>Request Header</th><th>作用</th></tr></thead><tbody><tr><td><strong>Access-Control-Request-Method</strong></td><td>告诉服务器实际请求所使用的 HTTP 方法</td></tr><tr><td><strong>Access-Control-Request-Headers</strong></td><td>告诉服务器实际请求所携带的自定义首部字段，本次实际请求首部字段中 content-type 为自定义</td></tr></tbody></table>

服务器基于从预检请求头部获得的信息来判断，是否接受接下来的实际请求。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1f23b021b7720~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

#### （2）预检响应头 response header 的关键字段：

<table><thead><tr><th>response header</th><th>作用</th></tr></thead><tbody><tr><td><strong>Access-Control-Allow-Methods</strong></td><td>返回了服务端允许的请求，包含 GET/HEAD/PUT/PATCH/POST/DELETE</td></tr><tr><td><strong>Access-Control-Allow-Credentials</strong></td><td>允许跨域携带 cookie（跨域请求要携带 cookie 必须设置为 true）</td></tr><tr><td><strong>Access-Control-Allow-Origin</strong></td><td>允许跨域请求的域名，这个可以在服务端配置一些信任的域名白名单</td></tr><tr><td><strong>Access-Control-Request-Headers</strong></td><td>客户端请求所携带的自定义首部字段 content-type</td></tr></tbody></table>

此次 OPTIONS 请求返回了响应头的内容，但没有返回响应实体 response body 内容。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1f053cb92db6c~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 1.2 第 2 次请求

这是本来要发送的请求，如图所示是普通的 post 请求。其中 **Content-Type** 的 _application/json_ 是此次和后端约定的请求内容格式，这个也是后面讲到为什么会发送 options 请求的原因之一。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1ef15e805bad2~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

### 2 关于 OPTIONS 请求

从很多资料我们可以了解到使用 OPTIONS 方法对服务器发起请求，可以检测服务器支持哪些 HTTP 方法。但是这次我们并没有主动去发起 OPTIONS 请求，那 OPTIONS 请求为何会自动发起？

#### 2.1 OPTIONS 请求自动发起

MDN 的 [CORS](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTTP%2FAccess_control_CORS "https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS") 一文中提到：

> 规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。

所以这个跨域请求触发了浏览器自动发起 OPTIONS 请求，看看此次跨域请求具体触发了哪些条件。

#### 2.2 跨域请求时，OPTIONS 请求触发条件

<table><thead><tr><th>CORS 预检请求触发条件</th><th>本次请求是否触发该条件</th></tr></thead><tbody><tr><td>1. 使用了下面<strong>任一</strong> HTTP 方法：</td><td></td></tr><tr><td>PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH</td><td>否，本次为 post 请求</td></tr><tr><td>2. 人为设置了<strong>以下集合之外</strong>首部字段：</td><td></td></tr><tr><td>Accept/Accept-Language/Content-Language/Content-Type/DPR/Downlink/Save-Data/Viewport-Width/Width</td><td>否，未设置其他头部字段</td></tr><tr><td>3. Content-Type 的值<strong>不属于</strong>下列之一:</td><td></td></tr><tr><td>application/x-www-form-urlencoded、multipart/form-data、text/plain</td><td>是，为 application/json</td></tr></tbody></table>

由于修改了 Content-Type 为 application/json，触发了 CORS 预检请求。

### 3 优化 OPTIONS 请求：Access-Control-Max-Age 或者 避免触发

可见一旦达到触发条件，跨域请求便会一直发送 2 次请求，这样增加的请求数是否可优化呢？答案是可以，OPTIONS 预检请求的结果可以被缓存。

> Access-Control-Max-Age 这个响应首部表示 preflight request （预检请求）的返回结果（即 Access-Control-Allow-Methods 和 Access-Control-Allow-Headers 提供的信息） 可以被缓存的最长时间，单位是秒。(MDN)

如果值为 -1，则表示禁用缓存，每一次请求都需要提供预检请求，即用 OPTIONS 请求进行检测。

评论区的朋友提醒了，尽量避免不要触发 OPTIONS 请求，上面例子中把 content-type 改掉是可以的。在其他场景，比如跨域并且业务有自定义请求头的话就很难避免了。现在使用的 axios 或者 superagent 等第三方 ajax 插件，如果出现 CORS 预检请求，可以看看默认配置或者二次封装是否规范。

### 4 总结

OPTIONS 请求即**预检请求**，可用于检测服务器允许的 http 方法。当发起跨域请求时，由于安全原因，触发一定条件时浏览器会在正式请求之前**自动**先发起 OPTIONS 请求，即 **CORS 预检请求**，服务器若接受该跨域请求，浏览器才继续发起正式请求。