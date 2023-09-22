> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6868138631714848775?searchId=20230922220824D75FAF6A213F99E4750A)

Fetch API
=========

`Fetch API`提供了一个 JavaScript 接口，用于访问和操纵 HTTP 的请求和响应等。提供了一个全局 `fetch()` 方法来跨网络异步获取资源。

与 AJAX 的区别
==========

Fetch 规范与 jQuery.ajax() 主要有三种方式的不同：

*   当接收到一个代表错误的 HTTP 状态码， 即使响应的 HTTP 状态码是 404 或 500。从 `fetch()` 返回的 Promise ** 不会被标记为 reject，** 相反，会标记为 resolve （但是会把 resolve 的返回值的 `ok` 属性设置为 false ），**仅当网络故障时或请求被阻止时，才会标记为 reject**。
*   `fetch()` 可以接收跨域 cookies；也可以使用 `fetch()` 建立起跨域会话。
*   `fetch` 不会发送 cookies。除非你使用了 _credentials_ 的[初始化选项](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindowOrWorkerGlobalScope%2Ffetch%23Parameters "https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters")

Fetch() 示例
==========

给`fetch()` 提供一个参数指明资源路径，会返回一个包含响应结果的 promise。当然它只是一个 HTTP 响应，为了获取 JSON 的内容，我们需要使用 [`json()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2Fjson "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/json") 方法：

**默认发送 GET 请求**

```
fetch('http://example.com/movies.json')	
  .then(response => response.json())
  .then(data => console.log(data));
```

**带参数的 GET 请求：**

```
var id=1
fetch(`https://www.easy-mock.com/mock/5f507e38a758c95f67d6eb42/fetch/getmsg?id=${id}`)	
.then(response => response.json())
.then(data => console.log(data));
```

**发送 POST 请求**

```
var data={
    id:'1',
}
fetch('https://www.easy-mock.com/mock/5f507e38a758c95f67d6eb42/fetch/postmsg',{
    method:'POST',
    body:data
})	
.then(response => response.json())
.then(data => console.log(data));
```

Fetch()
=======

用于发起获取资源的请求。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 Response 对象。当遇到网络错误时，[`fetch()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWorkerOrGlobalScope%2Ffetch "https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerOrGlobalScope/fetch") 返回的 promise 会被 reject，并传回 [`TypeError`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FTypeError "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError")。成功的 fetch() 检查不仅要包括 promise 被 resolve，还要包括 [`Response.ok`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FResponse%2Fok "https://developer.mozilla.org/zh-CN/docs/Web/API/Response/ok") 属性为 true。HTTP 404 状态并不被认为是网络错误。

语法
--

```
fetch(input,{init});
```

参数
--

`input`——定义要获取的资源，可以是：

*   一个 [`USVString`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FUSVString "https://developer.mozilla.org/zh-CN/docs/Web/API/USVString") 字符串，包含要获取资源的 URL。
*   一个 [`Request`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FRequest "https://developer.mozilla.org/zh-CN/docs/Web/API/Request") 对象。

`init`—— 可选 | 一个配置项对象，包括所有对请求的设置。可选的参数有：

```
var myInit={
    //请求的 body 信息 //如：Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象
    body: JSON.stringify(data), //这里必须匹配 'Content-Type' //注意 GET 或 HEAD 方法的请求不能包含 body 信息。 
   
    //请求的 cache 模式。//如：default, no-cache, reload, force-cache, only-if-cached
    cache: 'no-cache', 	 
    
    //请求的 credentials。//包括：omit、same-origin，include
    credentials: 'same-origin',  
      
    //请求的头信息
    headers: {	
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
      
    //请求使用的方法  //如：GET, POST, PUT, DELETE等
    method: 'POST', 
    
    //请求的模式	 //如 cors、 no-cors 或者 same-origin。
    mode: 'cors', 
      
    //重定向模式 //如 follow|自动重定向, error|如果产生重定向将自动终止并且抛出一个错误, manual|手动处理重定向
    redirect: 'follow', 
    
    //USVString  //如 no-referrer、client或一个 URL。默认是 client
    referrer: 'no-referrer',
}
```

发送带凭据的请求
--------

```
//发送包含凭据的请求
fetch('https://example.com', {
  credentials: 'include'  
})

//如果你只想在请求URL与调用脚本位于同一起源处时发送凭据
fetch('https://example.com', {
  credentials: 'same-origin'  
})

//确保浏览器不在请求中包含凭据
fetch('https://example.com', {
  credentials: 'omit'  
})
```

上传 json 数据
----------

```
var data = {username: 'example'};

fetch('https://example.com/profile', {
  method: 'POST', 
  body: JSON.stringify(data), 
  headers: new Headers({
    'Content-Type': 'application/json'
  })
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

上传文件
----

```
var formData = new FormData();
var fileField = document.querySelector("input[type='file']");// 获取<input type="file" /> 元素

formData.append('username', 'abc123');
formData.append('avatar', fileField.files[0]);

fetch('https://example.com/profile/avatar', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

上传多个文件
------

```
var formData = new FormData();/
var photos = document.querySelector("input[type='file'][multiple]");

formData.append('title', 'My Vegas Vacation');
// formData 只接受文件、Blob 或字符串，不能直接传递数组，所以必须循环嵌入
for (let i = 0; i < photos.files.length; i++) { 
    formData.append('photo', photos.files[i]); 
}

fetch('https://example.com/posts', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(response => console.log('Success:', JSON.stringify(response)))
.catch(error => console.error('Error:', error));
```

检测请求是否成功
--------

> 如果遇到网络故障，[`fetch()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FGlobalFetch%2Ffetch "https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalFetch/fetch") promise 将会 reject，带上一个 [`TypeError`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FTypeError "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError") 对象。虽然这个情况经常是遇到了权限问题或类似问题——比如 404 不是一个网络故障。想要精确的判断 `fetch()` 是否成功，需要包含 promise resolved 的情况，此时再判断 [`Response.ok`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FResponse%2Fok "https://developer.mozilla.org/zh-CN/docs/Web/API/Response/ok") 是不是为 true。类似以下代码：

```
fetch('flowers.jpg').then(function(response) {
  if(response.ok) {
    return response.blob();
  }
  throw new Error('Network response was not ok.');
}).then(function(myBlob) { 
  var objectURL = URL.createObjectURL(myBlob); 
  myImage.src = objectURL; 
}).catch(function(error) {
  console.log('There has been a problem with your fetch operation: ', error.message);
});
```

自定义请求对象
-------

```
var myHeaders = new Headers();
var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };
var myRequest = new Request('flowers.jpg', myInit);
fetch(myRequest).then(function(response) {
  return response.blob();
}).then(function(myBlob) {
  var objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});
```

与 xml 的区别
=========

> 与 xml 不同的是，Fetch 可以很容易地被其他技术使用，例如 [`Service Workers`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FServiceWorker_API "https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker_API")。它还提供了专门的逻辑空间来定义其他与 HTTP 相关的概念，例如 CORS 和 HTTP 的扩展。Fetch 提供了对 [`Request`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FRequest "https://developer.mozilla.org/zh-CN/docs/Web/API/Request") 和 [`Response`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FResponse "https://developer.mozilla.org/zh-CN/docs/Web/API/Response") （以及其他与网络请求有关的）对象的通用定义，使之应用于更多场景。

下面是 Fetch API 的三个接口：Headers、Rquest、Response：

1.Headers
---------

Headers 接口允许您对 HTTP 请求和响应头执行各种操作。 包括检索，设置，添加和删除。可以通过 `Headers()`构造函数来创建一个你自己的 headers 对象

**方法**

*   `append()`——给现有的 header 添加一个值, 或者添加一个未存在的 header 并赋值.
*   `delete()`——从 Headers 对象中删除指定 header.
*   `entries()`——以 迭代器 的形式返回 Headers 对象中所有的键值对
*   `get()`——以 ByteString 的形式从 Headers 对象中返回指定 header 的全部值
*   `has()`——以布尔值的形式从 Headers 对象中返回是否存在指定的 header

**示例**

```
let myHeaders = new Headers(); 
myHeaders.append('Content-Type', 'text/xml');

//可以传一个多维数组或者对象字面量来创建：
myHeaders = new Headers({
  "Content-Type": "text/plain",
  "X-Custom-Header": "ProcessThisImmediately",
});

//内容可以获取与修改
console.log(myHeaders.has("Content-Type")); // true
console.log(myHeaders.has("Set-Cookie")); // false
myHeaders.append("X-Custom-Header", "AnotherValue");
console.log(myHeaders.getAll("X-Custom-Header")); // ["ProcessThisImmediately", "AnotherValue"]
myHeaders.delete("X-Custom-Header");
console.log(myHeaders.getAll("X-Custom-Header")); // [ ]
```

2.Request
---------

Request 接口用来表示资源请求。可以通过 `Request()`构造函数来创建一个你自己的 Request 对象

**属性**

*   `method`——只读 | 包含请求的方法
*   `url`——只读 | 包含请求的 url
*   `headers`——只读 | 包含请求相关的 Headers 对象
*   `mode`——只读 | 包含请求模式
*   `credentials`——只读 | 包含请求的证书
*   `cache`——只读 | 包含请求的缓存模式

**示例**

```
//示例1
const myRequest = new Request('http://localhost/flowers.jpg');//创建一个request对象
const myURL = myRequest.url; // http://localhost/flowers.jpg
const myMethod = myRequest.method; // GET
const myCred = myRequest.credentials; // omit

//示例2
const myRequest = new Request('http://localhost/api', {method: 'POST', body: '{"foo":"bar"}'});
const myURL = myRequest.url; // http://localhost/api
const myMethod = myRequest.method; // POST
const myCred = myRequest.credentials; // omit
```

```
//可以将Request对象作为参数传递给fetch()
fetch(myRequest)
  .then(response => response.blob())
  .then(blob => {
    myImage.src = URL.createObjectURL(blob);
});
```

3.Response
----------

Response 接口呈现了对一次请求的响应数据。Response 实例是在 `fetch()` 处理完 promise 之后返回的。你也可以通过 `Response()`构造函数来创建一个你自己的 Response 对象

**属性**

*   `headers`——只读 | 包含此 Response 所关联的 Headers 对象
*   `ok`——只读 | 包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）
*   `redirected`——只读 | 表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目
*   `status`——只读 | 包含 Response 的状态码 （例如 `200` 表示成功）
*   `statusText`——只读 | 包含了与该 Response 状态码一致的状态信息（例如，OK 对应 `200`）
*   `type`——只读 | 包含 Response 的类型（例如，`basic`、`cors`）
*   `url`——只读 | 包含 Response 的 URL

**示例**

> 调用了 `fetch()`获取一张图片并将其显示在 HTML 的 IMG 标签中 , `fetch()` 函数返回了一个 Promise，它使用 Response 对象进行解析.。你会注意到，由于我们正在请求一张图片，我们需要运行`blob`为响应提供正确的 MIME 类型

```
const image = document.querySelector('.my-image');
fetch('flowers.jpg').then(function(response) {
  return response.blob();
}).then(function(blob) {
  const objectURL = URL.createObjectURL(blob);
  image.src = objectURL;
});
```

Body
----

**`Body`** [mixin](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FMixin "https://developer.mozilla.org/zh-CN/docs/Glossary/Mixin") 提供了与 response/request 中的 body 有关的方法，可以定义它的内容形式以及处理方式。

Body 定义了以下方法（这些方法都被 [`Request`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FRequest "https://developer.mozilla.org/zh-CN/docs/Web/API/Request") 和 [`Response`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FResponse "https://developer.mozilla.org/zh-CN/docs/Web/API/Response")所实现）以获取 body 内容。这些方法都会返回一个被解析后的 [`Promise`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPromise "https://developer.mozilla.org/zh-CN/docs/Web/API/Promise")对象和数据

*   [`arrayBuffer()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2FarrayBuffer "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/arrayBuffer")
*   [`blob()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2Fblob "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/blob")
*   [`json()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2Fjson "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/json")
*   [`text()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2Ftext "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/text")
*   [`formData()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBody%2FformData "https://developer.mozilla.org/zh-CN/docs/Web/API/Body/formData")