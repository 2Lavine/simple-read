
### 1 偶然的相遇——options 请求

最近写的项目，应用里所有的 ajax 请求都发送了 2 遍。由于新项目，基础模块是新搭的，所以出现一些奇葩问题也是意料之中，啊终于第一次在 chrome 的 devTools 遇见了活的 options 请求。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1ef19b66d8e5f~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 1.1 第 1 次请求

这里首先发送了一次额外的 options 请求，在浏览器里看到请求 request header 和 response header 的信息如下：

#### （1）预检请求头 request header 的关键字段：

<table><thead><tr><th>Request Header</th><th>作用</th></tr></thead><tbody><tr><td><strong>Access-Control-Request-Method</strong></td><td>告诉服务器实际请求所使用的 HTTP 方法</td></tr><tr><td><strong>Access-Control-Request-Headers</strong></td><td>告诉服务器实际请求所携带的自定义首部字段，本次实际请求首部字段中 content-type 为自定义</td></tr></tbody></table>

服务器基于从预检请求头部获得的信息来判断，是否接受接下来的实际请求。

![[Pasted image 20230612231655.png]]

#### （2）预检响应头 response header 的关键字段：

<table><thead><tr><th>response header</th><th>作用</th></tr></thead><tbody><tr><td><strong>Access-Control-Allow-Methods</strong></td><td>返回了服务端允许的请求，包含 GET/HEAD/PUT/PATCH/POST/DELETE</td></tr><tr><td><strong>Access-Control-Allow-Credentials</strong></td><td>允许跨域携带 cookie（跨域请求要携带 cookie 必须设置为 true）</td></tr><tr><td><strong>Access-Control-Allow-Origin</strong></td><td>允许跨域请求的域名，这个可以在服务端配置一些信任的域名白名单</td></tr><tr><td><strong>Access-Control-Request-Headers</strong></td><td>客户端请求所携带的自定义首部字段 content-type</td></tr></tbody></table>

![[Pasted image 20230612231921.png]]
此次 OPTIONS 请求返回了响应头的内容，但没有返回响应实体 response body 内容。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1f053cb92db6c~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 1.2 第 2 次请求

这是本来要发送的请求，如图所示是普通的 post 请求。
其中 **Content-Type** 的 _application/json_ 是此次和后端约定的请求内容格式，
- 这个也是后面讲到为什么会发送 options 请求的原因之一。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/15/16a1ef15e805bad2~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)