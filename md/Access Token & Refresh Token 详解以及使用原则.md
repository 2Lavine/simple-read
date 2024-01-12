> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6859572307505971213?searchId=20240112202231678693B99788D345C320)

本文通过分析 Access Token 和 Refresh Token 的配合流程和安全要点，得到正确管理和使用 Access Token 和 Refresh Token 的方法和原则。

Oauth2 使用 Token 的基本流程
---------------------

我们先看看一个来自 [RFC6749](https://link.juejin.cn?target=http%3A%2F%2Fwww.rfcreader.com%2F%23rfc6749 "http://www.rfcreader.com/#rfc6749") 定义的 Oauth2 中 token 使用的基本流程，大概可以明白 Access Token 和 Refresh Token 两个的用法。

```
+--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+
               Figure 2: Refreshing an Expired Access Token
```

上图中 Authorization Server 翻译为授权服务，负责 Token 的签发。Resource Server 翻译为资源服务，也就是被授权访问的资源，比如 API 接口。在分布式应用中，他们应该分属不同的服务。 值得注意的是，资源服务器不签发 Token，但是可以具备独立验证 Access Token 的能力。

上面的流程图包括了下面的步骤。

*   (A) 客户端向授权服务器请求 Access Token（整个认证授权的流程，可以是多次请求完成该步骤）
*   (B) 授权服务器验证客户端身份无误，且请求的资源是合理的，则颁发 Access Token 和 Refresh Token，可以同时返回 Access Token 的过期时间等附加属性。
*   (C) 带着 Access Token 请求资源
*   (D) 资源服务器验证 Access Token 有效则返回请求的内容。
*   (E) **注意：** 上面的 (C)(D) 步骤可以反复进行，直到 Access Token 过期。 如果客户端在请求之前就能判断 Access Token 已过期或临近过期（下发过期时间），就可以直接跳到步骤(G)。否则，就会再请求一次，也就产生了本步骤。
*   (F) 当 Access Token 无效的时候，资源服务器会拒绝响应资源并返回 Token 无效的错误。
*   (G) 客户端重新向授权服务器请求 Access Token，但是这次只需带着 Refresh Token 即可，而不需要用户再执行认证和授权的流程。这样就可以做到用户无感。
*   (H) 授权服务器验证 Refresh Token，如果有效，则签发新的 Access Token（或者同时下发一个新的 Refresh Token）。

我们总结几个点，Access Token 作为请求资源的凭证，是使用最频繁的，但是有效期比较短，Refresh Token 有效期较长，只会发给授权服务器，用来获取新的 Access Token。

那么问题来了：

### 资源服务如何脱离授权服务验证 Access Token？

以 JTW 为例。如果 Access Token 是 JWT 形式签发，资源服务可以使用验证签名的方式判断是否合法，只需要把签名密钥在资源服务同步一份即可。也有使用非对称加密的，授权服务使用私钥签发，资源服务使用公钥验证。由于 JWT 允许携带一些信息，用户，权限，有效期等，因此资源服务判断 JWT 合法之后可以继续根据携带信息来判断是否可访问资源。仅此而已，这样的好处是可以快速验证有效性，坏处是 Access Token 一旦签发，将很难收回，只能通过过期来失效。

### Refresh Token 机制如何提升安全？

Refresh Token 的其中一个目的是让用户在较长的时间保持登录状态，那么可否直接让 Access Token 具有更长的有效期，从而可以省去许多没用的步骤。答案是不安全，理由参考上面问题的答案。

举个例子，某个用户登录成功，获得了一个可以发帖的 Access Token，这时管理员发现他发布垃圾内容吊销了发帖权限，而这个信息一般属于授权服务管理，也就是说他下次向授权服务请求 Access Token 将不会得到发帖权限。但是如果用户之前拿到的 Access Token 是长期有效的，那么这个用户就可以发帖很长时间。如果 Access Token 在短时间内失效，那么他必须重新去授权服务请求，这时授权服务将不会颁发具备发帖权限的 Access Token。

第二个例子，如果 Access Token 具有较长的有效期，一旦被盗用，攻击者就可以拿 Access Token 使用很长时间。聪明的你可能会想到，攻击者可以同时盗取 Refresh Token。

[RFC6749](https://link.juejin.cn?target=http%3A%2F%2Fwww.rfcreader.com%2F%23rfc6749 "http://www.rfcreader.com/#rfc6749") 第 10 节中有说明，授权服务**必须维护 Refresh Token 与客户端的绑定关系**，也就是说只有合法用户的客户端（可通过 IP,UA 等资料判断）来请求是可以通过的。退一步讲，如果攻击者模拟了客户端可以执行刷新请求，那么就要看谁先刷。由于授权服务**可以设置 Refresh Token 一次有效**，因此不管哪个先刷新，另一个人刷新就会报错。如果用户先刷新，攻击者以 Access Token 和 Refresh Token 的双重失效结束游戏。如果攻击者先刷新了，合法用户就会收到报错信息，授权服务会引导用户从上图的步骤 (A) 重新开始认证，从而把有效的 Refresh Token 拿回到合法用户这里。

总结
--

Access Token 应该维持在较短有效期，过长不安全，过短也会影响用户体验，因为频繁去刷新带来没有必要的网络请求。可以参考我们常常在某些网站停止操作一段时间之后就会掉线，这个时间是 Refresh Token 的有效期，Access Token 不应长过这个时间。

Refresh Token 的有效期就是允许用户在多久时间内不用重新登录的时间，可以很长，视业务而定。我们在使用某些 APP 的时候，即使一个月没有开过也是登录状态的，这就是 Refresh Token 决定的。授权服务在接到 Refresh Token 的时候还要进一步做客户端的验证，尽可能排除盗用的情况。

所有 token 应该保管在 private 的地方，也就是只能客户端自己使用，所有 token 都应该在 [TLS](https://link.juejin.cn?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E5%2582%25B3%25E8%25BC%25B8%25E5%25B1%25A4%25E5%25AE%2589%25E5%2585%25A8%25E6%2580%25A7%25E5%258D%2594%25E5%25AE%259A%23TLS_1.3 "https://zh.wikipedia.org/wiki/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E6%80%A7%E5%8D%94%E5%AE%9A#TLS_1.3") 信道下发送（比如 HTTPS）。

参考
--

[The OAuth 2.0 Authorization Framework](https://link.juejin.cn?target=http%3A%2F%2Fwww.rfcreader.com%2F%23rfc6749_line2308 "http://www.rfcreader.com/#rfc6749_line2308")

[JWT 原理简析](https://link.juejin.cn?target=https%3A%2F%2Fczj.so%2F198%2Fjwt-json-web-token-%25e5%258e%259f%25e7%2590%2586%25e7%25ae%2580%25e6%259e%2590.html "https://czj.so/198/jwt-json-web-token-%e5%8e%9f%e7%90%86%e7%ae%80%e6%9e%90.html")

[请关注我的个人博客](https://link.juejin.cn?target=https%3A%2F%2Fczj.so%2F1218%2Faccess-token-refresh-token-xiangjieyijizhengquedeyongfa.html "https://czj.so/1218/access-token-refresh-token-xiangjieyijizhengquedeyongfa.html")