> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [segmentfault.com](https://segmentfault.com/a/1190000022842875)

CSRF
----
跨站请求伪造（Cross Site Request Forgery），是指黑客诱导用户打开黑客的网站，在黑客的网站中，利用用户的登陆状态发起的跨站请求。
CSRF 攻击就是利用了用户的登陆状态，并通过第三方的站点来做一个坏事。
#cs/security/csrf

---
要完成一次 CSRF 攻击, 受害者依次完成两个步骤:
1.  登录受信任网站 A，并在本地生成 Cookie
2.  在不登出 A 的情况，访问危险网站 B

![[../_resources/25751f9e43ccecbad94105f36feaf639_MD5.png]]

下面会通过一个例子来讲解 CSRF 攻击的表现是什么样子的。  
实现的例子：  
在前后端同域的情况下，前后端的域名都为 `http://127.0.0.1:3200`, 第三方网站的域名为 `http://127.0.0.1:3100`，钓鱼网站页面为 `http://127.0.0.1:3100/bad.html`。

### 自动发起 Get 请求

在上面的 bad.html 中，我们把代码改成下面这样

```
<!DOCTYPE html>
<html>
  <body>
    <img src="http://127.0.0.1:3200/payMoney?money=1000">
  </body>
</html>

```

当用户访问含有这个 img 的页面后，浏览器会自动向自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么会认为这是一个正常的链接。

### 自动发起 POST 请求

上面例子中演示的就是这种情况。

```
<body>
    <div>
        哈哈，小样儿，哪有赚大钱的方法，还是踏实努力工作吧！
        <!-- form 表单的提交会伴随着跳转到action中指定 的url 链接，为了阻止这一行为，可以通过设置一个隐藏的iframe 页面，并将form 的target 属性指向这个iframe，当前页面iframe则不会刷新页面 -->
        <form action="http://127.0.0.1:3200/pay" method="POST" class="form" target="targetIfr">
            <input type="text" >
            <input type="text" >
        </form>
        <iframe ></iframe>
    </div>
</body>
<script>
    document.querySelector('.form').submit();
</script>

```

上面这段代码中构建了一个隐藏的表单，表单的内容就是自动发起支付的接口请求。当用户打开该页面时，这个表单会被自动执行提交。当表单被提交之后，服务器就会执行转账操作。因此使用构建自动提交表单这种方式，就可以自动实现跨站点 POST 数据提交。

### 引导用户点击链接
诱惑用户点击链接跳转到黑客自己的网站，示例代码如图所示

```
<a href="http://127.0.0.1:3100/bad.html">听说点击这个链接的人都赚大钱了，你还不来看一下么</a>

```
用户点击这个地址就会跳到黑客的网站，黑客的网站可能会自动发送一些请求，比如上面提到的自动发起 Get 或 Post 请求。

如何防御 CSRF
---------
利用 cookie 的 SameSite
验证请求的来源点
CSRF Token

### 防御 CSRF之利用 cookie 的 SameSite

SameSite 有 3 个值： Strict, Lax 和 None

1.  Strict。浏览器会完全禁止第三方 cookie。比如 a.com 的页面中访问 b.com 的资源，那么 a.com 中的 cookie 不会被发送到 b.com 服务器，只有从 b.com 的站点去请求 b.com 的资源，才会带上这些 Cookie
2.  Lax。相对宽松一些，在跨站点的情况下，从第三方站点链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。但如果在第三方站点中使用 POST 方法或者通过 img、Iframe 等标签加载的 URL，这些场景都不会携带 Cookie。
3.  None。任何情况下都会发送 Cookie 数据
#cs/security/cookie/SameSite #cs/security/csrf  



#cs/security/cookie/SameSite/例子
---
假设你在 a.com 登录后，该网站会种下一个名为 session 的 Cookie，用于标识你的登录状态。然后你在 a.com 上浏览其他页面，这些页面会发送 GET 请求来获取一些数据，此时浏览器会自动带上 session Cookie。

现在，假设有一个恶意网站 b.com，它想利用 CSRF 攻击来伪造请求并盗取你的数据。在 b.com 上，有一个图片标签 \<img src="http://a.com/api/delete-account"\> ，它会向 a.com 发送一个请求来删除你的账户。

在没有 SameSite 属性的情况下，浏览器会自动带上 session Cookie，导致这个请求被 a.com 接受并执行删除账户的操作，而你并不知情。

但是，如果 session Cookie 设置了 SameSite 属性为 Strict 或 Lax，浏览器在跨站点请求中不会自动发送 Cookie。在这种情况下，b.com 发送的请求将不会携带 session Cookie，a.com 会拒绝该请求，从而防止了 CSRF 攻击。

#cs/security/cookie/SameSite/代码 
---
response.setHeader('Set-Cookie', 'session=abc123; SameSite=Strict');


### 验证请求的来源点

由于 CSRF 攻击大多来自第三方站点，可以在服务器端验证请求来源的站点，禁止第三方站点的请求。  
可以通过 HTTP 请求头中的 Referer 和 Origin 属性。
但是这种 Referer 和 Origin 属性是可以被伪造的，碰上黑客高手，这种判断就是不安全的了。

### CSRF Token

1.  最开始浏览器向服务器发起请求时如登录，或者 GetHTML 页面，服务器生成一个 CSRF Token。
	1. CSRF Token 其实就是服务器生成的字符串，
2. 然后将该字符串用 js 放到表单当中。如 form 表单的input 的一个值里面
3.  浏览器之后准备提交表单时，需要带上之前获取的 `CSRF Token`, 然后服务器会验证该 Token 是否合法。第三方网站发出去的请求是无法获取到用户会话中的 CSRF Token


### 1. 第三方 cookie

Cookie 是种在服务端的域名下的，比如客户端域名是 a.com，服务端的域名是 b.com， Cookie 是种在 b.com 域名下的，在 Chrome 的 Application 下是看到的是 a.com 下面的 Cookie，是没有的，之后，在 a.com 下发送 b.com 的接口请求会自动带上 Cookie(因为 Cookie 是种在 b.com 下的)

### 第三方cookie 如何工作的
假设你在浏览器中打开一个新闻网站，该网站使用了广告服务提供商的服务，属于另外一个域名。当你访问该网站时，广告服务提供商的服务器会在你的浏览器中设置一个第三方cookie（也就是广告服务域名下的 cookie）。
由于这个cookie包含一个唯一的标识符，用于标识你的浏览器。广告服务提供商可以通过从哪些网站发出的请求分析出用户喜欢逛哪些网站。


### 3. Fetch 的 credentials 参数

如果没有配置 credential 这个参数，fetch 是不会发送 Cookie 的
credential 的参数如下
*   include：不论是不是跨域的请求，总是发送请求资源域在本地的 Cookies、HTTP Basic anthentication 等验证信息
*   same-origin：只有当 URL 与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息
*   omit： 从不发送 cookies.
平常写一些简单的例子，从很多细节问题上也能补充自己的一些知识盲点。


### origin 和 referer 头

Origin 头和 Referer 头在不同情况下会被携带：

1. Origin 头：Origin 头通常在跨域请求中被携带。当浏览器发送跨域请求时，会自动在请求头中添加 Origin 字段，指示请求的源（协议+域名+端口）。例如，从 `a.com` 发送请求到 `b.com`，请求头中会包含 `Origin: http://a.com`。服务器可以通过检查 Origin 头来判断请求的来源，并根据需要进行跨域资源共享（CORS）的处理。

2. Referer 头：Referer 头通常在同域请求中被携带。当浏览器发送请求时，会自动在请求头中添加 Referer 字段，指示该请求的来源页面的 URL。例如，从页面 `http://a.com/page1` 发送请求到 `http://a.com/page2`，请求头中会包含 `Referer: http://a.com/page1`。服务器可以通过检查 Referer 头来获取请求的来源页面信息，用于统计、日志记录等目的。

需要注意的是，浏览器在发送请求时会自动添加 Origin 头和 Referer 头，并且可以通过在服务器端设置相应的响应头来控制是否允许或限制这些头的携带。在某些情况下，例如隐私保护的考虑，可能会限制或删除这些头的携带。