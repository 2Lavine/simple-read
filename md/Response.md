> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [developer.mozilla.org](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)

[Fetch API](/zh-CN/docs/Web/API/Fetch_API) 的 `Response` 接口呈现了对一次请求的响应数据。

你可以使用 [`Response.Response()`](/zh-CN/docs/Web/API/Response/Response) 构造函数来创建一个 `Response` 对象，但通常更可能遇到的情况是，其他的 API 操作返回了一个 Response 对象。例如一个 service worker 的 [`Fetchevent.respondWith`](/zh-CN/docs/Web/API/FetchEvent/respondWith)，或者一个简单的 [`GlobalFetch.fetch()`](/zh-CN/docs/Web/API/fetch)。

[构造函数](#构造函数)
-------------

[`Response()`](/zh-CN/docs/Web/API/Response/Response "Response()")

创建一个新的 `Response` 对象。

[属性](#属性)
---------

[`Response.headers`](/zh-CN/docs/Web/API/Response/headers) 只读

包含此 Response 所关联的 [`Headers`](/zh-CN/docs/Web/API/Headers) 对象。

[`Response.ok`](/zh-CN/docs/Web/API/Response/ok) 只读

包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）。

[`Response.redirected`](/zh-CN/docs/Web/API/Response/redirected) 只读

表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。

[`Response.status`](/zh-CN/docs/Web/API/Response/status) 只读

包含 Response 的状态码（例如 `200` 表示成功）。

[`Response.statusText` (en-US)](/en-US/docs/Web/API/Response/statusText "Currently only available in English (US)") 只读

包含了与该 Response 状态码一致的状态信息（例如，OK 对应 `200`）。

[`Response.type`](/zh-CN/docs/Web/API/Response/type) 只读

包含 Response 的类型（例如，`basic`、`cors`）。

[`Response.url`](/zh-CN/docs/Web/API/Response/url) 只读

包含 Response 的 URL。

`Response.useFinalURL`

包含了一个布尔值，来标示这是否是该 Response 的最终 URL。

`Response` 实现了 `Body` 接口，所以以下属性亦可用：

[`Response.body`](/zh-CN/docs/Web/API/Response/body) 只读

一个简单的 getter，用于暴露一个 [`ReadableStream`](/zh-CN/docs/Web/API/ReadableStream) 类型的 body 内容。

[`Response.bodyUsed`](/zh-CN/docs/Web/API/Response/bodyUsed) 只读

包含了一个[`布尔值` (en-US)](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean "Currently only available in English (US)") 来标示该 Response 是否读取过 `Body`。

[方法](#方法)
---------

[`Response.clone()`](/zh-CN/docs/Web/API/Response/clone)

创建一个 `Response` 对象的克隆。

[`Response.error()`](/zh-CN/docs/Web/API/Response/error_static)

返回一个绑定了网络错误的新的 `Response` 对象。

[`Response.redirect()`](/zh-CN/docs/Web/API/Response/redirect_static)

用另一个 URL 创建一个新的 `Response`。

`Response` 实现了 `Body` 接口，所以以下方法同样可用：

[`Body.arrayBuffer()` (en-US)](/en-US/docs/Web/API/Response/arrayBuffer "Currently only available in English (US)")

读取 [`Response`](/zh-CN/docs/Web/API/Response) 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 [`ArrayBuffer`](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 格式的 Promise 对象。

[`Body.blob()` (en-US)](/en-US/docs/Web/API/Response/blob "Currently only available in English (US)")

读取 [`Response`](/zh-CN/docs/Web/API/Response) 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 [`Blob`](/zh-CN/docs/Web/API/Blob) 格式的 Promise 对象。

[`Body.formData()` (en-US)](/en-US/docs/Web/API/Response/formData "Currently only available in English (US)")

读取 [`Response`](/zh-CN/docs/Web/API/Response) 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 [`FormData`](/zh-CN/docs/Web/API/FormData) 格式的 Promise 对象。

[`Body.json()` (en-US)](/en-US/docs/Web/API/Response/json "Currently only available in English (US)")

读取 [`Response`](/zh-CN/docs/Web/API/Response) 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 `JSON` 格式的 Promise 对象。

[`Body.text()` (en-US)](/en-US/docs/Web/API/Response/text "Currently only available in English (US)")

读取 [`Response`](/zh-CN/docs/Web/API/Response) 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 [`USVString`](/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 格式的 Promise 对象。

[示例](#示例)
---------

在我们的[基础实例](https://github.com/mdn/fetch-examples/tree/master/basic-fetch) ([点击运行](https://mdn.github.io/fetch-examples/basic-fetch/)) 中，我们使用了一个简单的函数调用，调用了 `fetch()` 函数来获取一张图片并将其显示在 HTML 的 IMG 标签中，`fetch()` 函数返回了一个 Promise，它使用与资源获取操作相关联的 Response 对象进行解析。你会注意到，由于我们正在请求一张图片，我们需要运行 [`Body.blob` (en-US)](/en-US/docs/Web/API/Response/blob "Currently only available in English (US)")（[`Response`](/zh-CN/docs/Web/API/Response) 实现了），以为响应提供正确的 MIME 类型。

```
const image = document.querySelector(".my-image");
fetch("flowers.jpg")
  .then(function (response) {
    return response.blob();
  })
  .then(function (blob) {
    const objectURL = URL.createObjectURL(blob);
    image.src = objectURL;
  });
```

你也可以使用 [`Response.Response()`](/zh-CN/docs/Web/API/Response/Response) 这样的构造方法，来创建自定义的 `Response` 对象：

```
const response = new Response();
```

[规范](#规范)
---------

<table><thead><tr><th scope="col">Specification</th></tr></thead><tbody><tr><td><a href="https://fetch.spec.whatwg.org/#response-class">Fetch Standard<br><small># response-class</small></a></td></tr></tbody></table>

[浏览器兼容性](#浏览器兼容性)
-----------------

[Report problems with this compatibility data on GitHub](https://github.com/mdn/browser-compat-data/issues/new?mdn-url=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FResponse&metadata=%3C%21--+Do+not+make+changes+below+this+line+--%3E%0A%3Cdetails%3E%0A%3Csummary%3EMDN+page+report+details%3C%2Fsummary%3E%0A%0A*+Query%3A+%60api.Response%60%0A*+Report+started%3A+2023-09-22T13%3A16%3A33.033Z%0A%0A%3C%2Fdetails%3E&title=api.Response+-+%3CSUMMARIZE+THE+PROBLEM%3E&template=data-problem.yml "Report an issue with this compatibility data")<table><thead><tr><td></td><th colspan="5" title="desktop">desktop</th><th colspan="6" title="mobile">mobile</th><th colspan="2" title="server">server</th></tr><tr><td></td><th>Chrome</th><th>Edge</th><th>Firefox</th><th>Opera</th><th>Safari</th><th>Chrome Android</th><th>Firefox for Android</th><th>Opera Android</th><th>Safari on iOS</th><th>Samsung Internet</th><th>WebView Android</th><th>Deno</th><th>Node.js</th></tr></thead><tbody><tr><th scope="row"><code>Response</code></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Node.js18.0.0<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/Response"><code>Response()</code> constructor</a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row">body parameter accepts ReadableByteStream</th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome52Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge79Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>FirefoxNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>SafariNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android52Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Firefox for AndroidNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android41Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet6.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android52Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><code>body</code> parameter is optional</th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge79Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox59Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android59Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/arrayBuffer"><code>arrayBuffer</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/blob"><code>blob</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/body"><code>body</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox65Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera30Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android65Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android30Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><code>body</code> is a readable byte stream</th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome116Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge116Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox102Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>OperaNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>SafariNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android116Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android102Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Opera AndroidNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Safari on iOSNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Samsung InternetNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android116Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>DenoNoToggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/bodyUsed"><code>bodyUsed</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/clone"><code>clone</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/error_static"><code>error()</code> static method</a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge16Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera30Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android30Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/formData"><code>formData</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome60Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge79Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera47Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari14.1<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android60Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android44Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS14.5<abbr title="Has more compatibility info.">more<i></i></abbr>Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet8.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android60Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/headers"><code>headers</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/json"><code>json</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/json_static"><code>json_static</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome105Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge105Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox115Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera91Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>SafariNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android105Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android115Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android72Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>Safari on iOSNoToggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet20.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android105Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.22Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/ok"><code>ok</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/redirect_static"><code>redirect()</code> static method</a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome44Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge16Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera31Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android44Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android32Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android44Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/redirected"><code>redirected</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome57Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge16Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox49Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera44Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android57Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android49Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android43Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet8.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android60Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/status"><code>status</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/statusText"><code>statusText</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/text"><code>text</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android29Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android42Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/type"><code>type</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-no
              icon
              icon-no" title="No support">No support</abbr>DenoNoToggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr><tr><th scope="row"><a href="/en-US/docs/Web/API/Response/url"><code>url</code></a></th><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Edge14Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari10.1Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Chrome Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Firefox for Android39Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Opera Android27Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Safari on iOS10.3Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Samsung Internet4.0Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>WebView Android40Toggle history</button></td><td aria-expanded="false"><button type="button" title="Toggle history"><abbr class="
              bc-level-yes
              icon
              icon-yes" title="Full support">Full support</abbr>Deno1.0Toggle history</button></td><td aria-expanded="false"><button type="button" disabled="" title="Toggle history"><abbr class="
              bc-level-unknown
              icon
              icon-unknown" title="Compatibility unknown; please update this.">Compatibility unknown; please update this.</abbr>Node.js?Toggle history</button></td></tr></tbody></table>

### Legend

Tip: you can click/tap on a cell for more information.

Full support

Full support

Partial support

Partial support

No support

No support

User must explicitly enable this feature.

Has more compatibility info.

The compatibility table on this page is generated from structured data. If you'd like to contribute to the data, please check out [https://github.com/mdn/browser-compat-data](https://github.com/mdn/browser-compat-data) and send us a pull request.

[相关链接](#相关链接)
-------------

*   [ServiceWorker API (en-US)](/en-US/docs/Web/API/Service_Worker_API "Currently only available in English (US)")
*   [HTTP access control (CORS)](/zh-CN/docs/Web/HTTP/CORS)
*   [HTTP](/zh-CN/docs/Web/HTTP)