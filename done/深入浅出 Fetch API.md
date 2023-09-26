> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903425814052872?searchId=20230922220824D75FAF6A213F99E4750A)

为什么需要替代`XMLHttpRequest`
-----------------------

看了前面的例子，你可能会问，为什么不直接使用那些[现有的`XMLHttpRequest`包装器](https://link.juejin.cn?target=http%3A%2F%2Fwww.sitepoint.com%2Fcomparison-javascript-http-libraries%2F "http://www.sitepoint.com/comparison-javascript-http-libraries/")呢？ 原因在于 Fetch API 不仅仅为你提供了一个`fetch()`方法。

对于传统的`XMLHttpRequest`而言，你必须使用它的一个实例来执行请求和检索返回的响应。 但是通过 Fetch API，我们能够明确的配置请求对象。



---
你可以通过`Request`构造器函数创建一个新的请求对象，这也是建议标准的一部分。 第一个参数是请求的 URL，第二个参数是一个选项对象，用于配置请求。请求对象一旦创建了， 你便可以将所创建的对象传递给`fetch()`方法，用于替代默认的 URL 字符串。示例代码如下：

```
var req = new Request(URL, {method: 'GET', cache: 'reload'});
fetch(req).then(function(response) {
	return response.json();
}).then(function(json) {
	insertPhotos(json);
});
```

上面的代码中我们指明了请求使用的方法为`GET`，并且指定不缓存响应的结果。



---
有关`Request`对象的另一件更酷的事在于，你还可以基于原有的对象创建一个新的对象。 新的请求和旧的并没有什么不同，但你可以通过稍微调整配置对象，将其用于不同的场景。 例如，你可以基于原有的 GET 请求创建一个 POST 请求，它们具有相同的请求源。代码如下：

```
// 基于req对象创建新的postReq对象
var postReq = new Request(req, {method: 'POST'});
```



---
每个`Request`对象都有一个`header`属性，在 Fetch API 中它对应了一个`Headers`对象。 
通过`Headers`对象，你能够修改请求头。
不仅如此，对于返回的响应，你还能轻松的返回响应头中的各个属性。 但是需要注意的是，响应头是只读的。

```
var headers = new Headers();
headers.append('Accept', 'application/json');
var request = new Request(URL, {headers: headers});

fetch(request).then(function(response) {
	console.log(response.headers);
});
```

在上面的代码中，你可以通过`Headers`构造器来获取这个对象，用于为新的`Request`对象配置请求头。

---
`Request`和`Response`都完全遵循 HTTP 标准。如果你曾经使用过某种服务器端语言，你应该对它们很熟悉。
但是对于浏览器而言创建 HTTP 响应的要点是什么？总之，你不能将它发送给其他人。
但是， 你可以通过 [Service Worker API](https://link.juejin.cn?target=http%3A%2F%2Fwww.w3.org%2FTR%2Fservice-workers%2F "http://www.w3.org/TR/service-workers/") 将响应发送给你自己。 

Service Worker 允许通过截取来自浏览器的请求头和提供本地构造的响应头来替换来自服务器的响应头的方式来构建离线应用。 你需要注意的是，在本文写作的时候 Service Worker 仍然是实验性的，并且仍处在不断变化之中。

Fetch API 面临的阻力
---------------
其中一种反对观点认为，Promises 缺少了一些重要的`XMLHttpRequest`的使用场景。
使用`XMLHttpRequest`你可以模拟进度（监听`progress`事件），也可以取消请求（使用`abort()`方法

但是，如果有必要你也可以使用 Promise 来包裹它。
