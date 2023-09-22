> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903425814052872?searchId=20230922220824D75FAF6A213F99E4750A)

多年来，`XMLHttpRequest`一直是 web 开发者的亲密助手。无论是直接的，还是间接的， 当我们谈及 Ajax 技术的时候，通常意思就是基于`XMLHttpRequest`的 Ajax，它是一种能够有效改进页面通信的技术。 Ajax 的兴起是由于 Google 的 Gmail 所带动的，随后被广泛的应用到众多的 Web 产品（应用）中，可以认为， 开发者已经默认将`XMLHttpRequest`作为了当前 Web 应用与远程资源进行通信的基础。 而本文将要介绍的内容则是`XMLHttpRequest`的最新替代技术——[Fetch API](https://link.juejin.cn?target=https%3A%2F%2Ffetch.spec.whatwg.org%2F "https://fetch.spec.whatwg.org/")， 它是 W3C 的正式标准，本文将会介绍 Fetch API 的相关知识，以及探讨它所能使用的场景和能解决的问题。

Statement
---------

> 原文地址： http://www.sitepoint.com/introduction-to-the-fetch-api/

**译者：**景庄，前端开发工程师，主要关注于前端工程化技术、Node.js、React 等。

Fetch API
---------

Fetch API 提供了一个`fetch()`方法，它被定义在 BOM 的`window`对象中，你可以用它来发起对远程资源的请求。 该方法返回的是一个 Promise 对象，让你能够对请求的返回结果进行检索。

为了能够进一步的解释 Fetch API，下面我们写一些代码来具体的介绍它的用法： 下面这个例子将会通过 Flicker API 来检索一些图片，并将结果插入到页面中。到目前为止， Fetch API 还未被所有的浏览器支持。因此，如果你想体验这一技术，最好使用最新版本的 Chrome 浏览器。 为了能够正确的调用 Flicker API，你需要申请自己的 API KEY，将其插入到代码中的适当位置，即`your_api_key`那个位置。

来看看第一个任务：我们使用 API 来从 Flicker 中检索一些有关” 企鹅 “的照片，并将它们展示在也没中，代码如下。

```
/* API URL, you need to supply your API key */
var URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=your_api_key&format=json&nojsoncallback=1&tags=penguins';

function fetchDemo() {
	fetch(URL).then(function(response) {
		return response.json();
	}).then(function(json) {
		insertPhotos(json);
	});
}

fetchDemo();
```

上面的代码看起来很简单：首先是构造请求的 URL，然后将 URL 传递给全局的`fetch()`方法，它会立刻返回一个 Promise， 当 Promise 被通过，它会返回一个`Response`对象，通过该对象的`json()`方法可以将结果作为 JSON 对象返回。 `response.json()`同样会返回一个`Promise`对象，因此在我们的例子中可以继续链接一个`then()`方法。

为了能够和传统的`XMLHttpRequest`进行对比，我们使用传统的方法来编写一个同样功能的函数：

```
function xhrDemo() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		insertPhotos(JSON.parse(xhr.responseText));
	};
	xhr.open('GET', URL);
	xhr.send();
}
```

可以发现，主要的不同点在于：传统上我们会使用事件处理器，而不是 Promise 对象。 并且请求的发起完全依赖于`xhr`对象所提供的方法。

到目前为止，相比传统的`XMLHttpRequest`对象，我们使用 Fetch API 获得了更简洁的编码体验。但 Fetch API 不止于此， 下面我们进一步的深入下去。

为什么需要替代`XMLHttpRequest`
-----------------------

看了前面的例子，你可能会问，为什么不直接使用那些[现有的`XMLHttpRequest`包装器](https://link.juejin.cn?target=http%3A%2F%2Fwww.sitepoint.com%2Fcomparison-javascript-http-libraries%2F "http://www.sitepoint.com/comparison-javascript-http-libraries/")呢？ 原因在于 Fetch API 不仅仅为你提供了一个`fetch()`方法。

对于传统的`XMLHttpRequest`而言，你必须使用它的一个实例来执行请求和检索返回的响应。 但是通过 Fetch API，我们还能够明确的配置请求对象。

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

有关`Request`对象的另一件更酷的事在于，你还可以基于原有的对象创建一个新的对象。 新的请求和旧的并没有什么不同，但你可以通过稍微调整配置对象，将其用于不同的场景。 例如，你可以基于原有的 GET 请求创建一个 POST 请求，它们具有相同的请求源。代码如下：

```
// 基于req对象创建新的postReq对象
var postReq = new Request(req, {method: 'POST'});
```

每个`Request`对象都有一个`header`属性，在 Fetch API 中它对应了一个`Headers`对象。 通过`Headers`对象，你能够修改请求头。不仅如此，对于返回的响应，你还能轻松的返回响应头中的各个属性。 但是需要注意的是，响应头是只读的。

```
var headers = new Headers();
headers.append('Accept', 'application/json');
var request = new Request(URL, {headers: headers});

fetch(request).then(function(response) {
	console.log(response.headers);
});
```

在上面的代码中，你可以通过`Headers`构造器来获取这个对象，用于为新的`Request`对象配置请求头。

相似的，你可以创建一个`Response`对象：

```
function responseDemo() {
	var headers = new Headers({
		'Content-Type': 'application/json',
		'Cache-Control': 'max-age=3600'
	});
	
	var response = new Response(
		JSON.stringify({photos: {photo: []}}),
			{status: 200, headers: headers}
	);
	response.json().then(function(json) {
		insertPhotos(json);
	});
}
```

`Request`和`Response`都完全遵循 HTTP 标准。如果你曾经使用过某种服务器端语言，你应该对它们很熟悉。 但是对于浏览器而言创建 HTTP 响应的要点是什么？总之，你不能将它发送给其他人。但是， 你可以通过 [Service Worker API](https://link.juejin.cn?target=http%3A%2F%2Fwww.w3.org%2FTR%2Fservice-workers%2F "http://www.w3.org/TR/service-workers/") 将响应发送给你自己。 Service Worker 允许通过截取来自浏览器的请求头和提供本地构造的响应头来替换来自服务器的响应头的方式来构建离线应用。 你需要注意的是，在本文写作的时候 Service Worker 仍然是实验性的，并且仍处在不断变化之中。

Fetch API 面临的阻力
---------------

Fetch API 从提出到实现一直存在着争议，由于一直现存的历史原因（例如 HTML5 的拖拽 API 被认为太过稀疏平常，Web Components 标准被指意义不大）。 因此重新设计一个新的 API 来替代久经沙场历练的`XMLHttpRequest`就变得阻力重重。

其中一种反对观点认为，Promises 缺少了一些重要的`XMLHttpRequest`的使用场景。例如， 使用标准的 ES6 Promise 你无法收集进入信息或中断请求。而 Fetch 的狂热开发者更是试图提供 [Promise API 的扩展](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwhatwg%2Ffetch%2Fissues%2F27 "https://github.com/whatwg/fetch/issues/27")用于取消一个 Promise。 这个提议有点自挖墙角的意思，因为将这将让 Promise 变得不符合标准。但这个提议或许会导致未来出现一个可取消的 Promise 标准。 但另一方面，使用`XMLHttpRequest`你可以模拟进度（监听`progress`事件），也可以取消请求（使用`abort()`方法）。 但是，如果有必要你也可以使用 Promise 来包裹它。

另一种反对观点认为，Web 平台需要的是更多底层的 API，而不是高层的 API。对此的回答恰恰是， Fetch API 足够底层，因为[当前的 WHATWG 标准定义了`XMLHttpRequest.send()`方法](https://link.juejin.cn?target=https%3A%2F%2Fxhr.spec.whatwg.org%2F%23the-send%2528%2529-method "https://xhr.spec.whatwg.org/#the-send%28%29-method")其实等同于 fetch 的`Requset`对象。 Fetch 中的`Response.body`实现了`getReader()`方法用于渐增的读取原始字节流。 例如，如果照片列表过大而放不进内存的话，你可以使用下面的方法来处理：

```
function streamingDemo() {
	var req = new Request(URL, {method: 'GET', cache: 'reload'});
	fetch(req).then(function(response) {
		var reader = response.body.getReader();
		return reader.read();
	}).then(function(result, done) {
		if (!done) {
		// do something with each chunk
		}
	});
}
```

在上面的代码中处理器函数一块一块的接收响应体，而不是一次性的。当数据全部被读完后会将`done`标记设置为 true。 在这种方式下，每次你只需要处理一个 chunk，而不是一次性的处理整个响应体。

不幸的是，对于 [Stream API](https://link.juejin.cn?target=https%3A%2F%2Fstreams.spec.whatwg.org%2F "https://streams.spec.whatwg.org/") 而言，这仍然还处于早期阶段，这种方式下，如果你需要解析 JSON， 你仍然需要从头实现很多的工作。

浏览器支持
-----

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2016/11/29/6c3817fcd223a7c24b7862644ccfed30~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

[Fetch API](https://link.juejin.cn?target=http%3A%2F%2Fcaniuse.com%2F%23search%3DFetch "http://caniuse.com/#search=Fetch")

目前 Chrome 42+, Opera 29+, 和 Firefox 39 + 都支持 Fetch。微软也[考虑](https://link.juejin.cn?target=https%3A%2F%2Fstatus.modern.ie%2Ffetchapi "https://status.modern.ie/fetchapi")在未来的版本中支持 Fetch。 讽刺的是，当 IE 浏览器终于微响应实现了 progress 事件的时候，`XMLHttpRequest`也走到了尽头。 目前，如果你需要支持 IE 的话，你需要使用一个 [polyfill](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgithub%2Ffetch "https://github.com/github/fetch") 库。

总结
--

在本文中我们为你介绍了 Fetch API 的整体概况以及它所能解决的问题。在表层， 这个 API 看起来非常的简单，但它同时也与一些底层的 API 相关联，例如 Streams， 这让客户端编程有点类似于系统编程。

此外，本文中的代码示例你可以参考这个[仓库](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsitepoint-editors%2Ffetch-demo "https://github.com/sitepoint-editors/fetch-demo")。

References
----------

1.  [传统 Ajax 已死，Fetch 永生](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcamsong%2Fblog%2Fissues%2F2 "https://github.com/camsong/blog/issues/2")
2.  [That’s so Fetch!](https://link.juejin.cn?target=http%3A%2F%2Fjakearchibald.com%2F2015%2Fthats-so-fetch%2F "http://jakearchibald.com/2015/thats-so-fetch/")
3.  [Ain’t that fetch!](https://link.juejin.cn?target=http%3A%2F%2Fwebreflection.blogspot.co.uk%2F2015%2F03%2Faint-that-fetch.html "http://webreflection.blogspot.co.uk/2015/03/aint-that-fetch.html")
4.  [Fetch API on MDN](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FFetch_API "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API")