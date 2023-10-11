> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903623583891469?searchId=202310111123315FDEED241D604A6A6DA2)

> 本文首发在 github，感兴趣请[点击此处](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Flucefer%2Flucefer.github.io%2Fissues%2F3 "https://github.com/lucefer/lucefer.github.io/issues/3")

window 的 onload 事件对于前端童鞋来说肯定是熟的不能再熟了，相信大家在刚入门时，见的最多的可能就是 load 事件了。**load** 事件接触多了，大家就会接触到它的闺蜜 **DOMContentLoaded** 事件，网上有很多介绍这两个事件的文章，对`它们`的解释无外乎以下两种

*   **load**

> MDN 的解释：**load** 应该仅用于检测一个完全加载的页面 当一个资源及其依赖资源已完成加载时，将触发 load 事件。

意思是页面的 html、css、js、图片等资源都已经加载完之后才会触发 load 事件。

*   **DOMContentLoaded**

> MDN 的解释：当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。

意思是 HTML **下载、解析**完毕之后就触发。

看了这两个解释，我仍然一脸懵逼，只是像小学生背课文一样知道 load 和 DOMContentLoaded 事件的触发时机，但还是不明白究竟什么情况下触发这两种事件。

### 一些概念

#### 下载 / 加载

这两个词语表达的是一个意思，就是浏览器将资源下载到本地的过程。

#### 解析

解析的意思是将一个元素通过一定的方式转换成另一种形式。 比如 html 的解析。首先要明确，html 下载到浏览器的表现形式就是 包含字符串的文件。浏览器将 html 文件里面的字符串读取到内存中，按照 html 规则，对字符串进行取词编译，将字符串转化成另一种易于表达的数据结构。我们看下一段代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta >
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>只有css</title>
  <link rel="stylesheet" href="./index.css" />
</head>
<body>
  <div id="div1"></div>
  <link rel="stylesheet" href="./c1.css" />
  <link rel="stylesheet" href="./c3.css" />
  <script src="http://test.com:9000/mine/load/case2/j1.js
  "></script>
  <link rel="stylesheet" href="./c4.css" />
  <div id="div2"></div>
</body>
</html>
```

浏览器会对这个 html 文件进行编译，转化成类似下面的结构（这里把 head 中的其他标签省略了）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/6/22/1642575e52011397~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

浏览器会对转化后的数据结构自上而下进行分析：首先开启下载线程，对所有的资源进行优先级排序下载（注意，这里仅仅是下载）。同时主线程会对文档进行解析：

*   遇到 script 标签时，首先阻塞后续内容的解析，同时检查该 script 是否已经下载下来，如果已下载，便执行代码。
*   遇到 link 标签时，不会阻塞后续内容的解析（比如 DOM 构建），检查 link 资源是否已下载，如果已下载，则构建 cssom。
*   遇到 DOM 标签时，执行 DOM 构建，将该 DOM 元素添加到文档树中。

> 有一点要注意的是，在 body 中第一个 script 资源下载完成之前，浏览器会进行首次渲染，将该 script 标签前面的 DOM 树和 CSSOM 合并成一棵 Render 树，渲染到页面中。**这是页面从白屏到首次渲染的时间节点，比较关键**。

#### DOM 构建

DOM 构建的意思是，将文档中的所有 DOM 元素构建成一个树型结构。

> 注意，DOM 构建是自上而下进行构建的，会受到 js 执行的干扰。

#### CSS 构建

将文档中的所有 css 资源合并。

#### render 树

将 DOM 树和 CSS 合并成一棵渲染树，render 树在合适的时机会被渲染到页面中。（比如遇到 script 时, 该 script 还没有下载到本地时）。

### HTML 文档的加载与页面的首次渲染

当我们输入一个页面地址时，发生了哪些事情呢？

*   1、浏览器首先下载该地址所对应的 html 页面。
*   2、浏览器解析 html 页面的 DOM 结构。
*   3、开启下载线程对文档中的所有资源按优先级排序下载。
*   4、主线程继续解析文档，到达 head 节点 ，head 里的外部资源无非是外链样式表和外链 js。
    *   发现有外链 css 或者外链 js，如果是外链 js ，则停止解析后续内容，等待该资源下载，下载完后立刻执行。如果是外链 css，继续解析后续内容。
*   5、解析到 body
    
    > body 里的情况比较多，body 里可能只有 DOM 元素，可能既有 DOM、也有 css、js 等资源，js 资源又有可能异步加载 图片、css、js 等。DOM 结构不同，浏览器的解析机制也不同，我们分开来讨论。
    
    *   只有 DOM 元素
        *   这种情况比较简单了，DOM 树构建完，页面首次渲染。
    *   有 DOM 元素、外链 js。
        *   当解析到外链 js 的时候，该 js 尚未下载到本地，则 js 之前的 DOM 会被渲染到页面上，同时 js 会阻止后面 DOM 的构建，即后面的 DOM 节点并不会添加到文档的 DOM 树中。所以，js 执行完之前，我们在页面上看不到该 js 后面的 DOM 元素。
    *   有 DOM 元素、外链 css
        *   外链 css 不会影响 css 后面的 DOM 构建，但是会阻碍渲染。简单点说，外链 css 加载完之前，页面还是白屏。
    *   有 DOM 元素、外链 js、外链 css
        *   外链 js 和外链 css 的顺序会影响页面渲染，这点尤为重要。当 body 中 js 之前的外链 css 未加载完之前，页面是不会被渲染的。
        *   当 body 中 js 之前的 外链 css 加载完之后，js 之前的 DOM 树和 css 合并渲染树，页面渲染出该 js 之前的 DOM 结构。
*   6、文档解析完毕，页面重新渲染。当页面引用的所有 js 同步代码执行完毕，触发 DOMContentLoaded 事件。
*   7、html 文档中的图片资源，js 代码中有异步加载的 css、js 、图片资源都加载完毕之后，load 事件触发。

测试代码如下

```
<body>
  <!-- 白屏 -->
  <div id="div1"></div>
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c1.css" />
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c3.css" />
  <!-- 如果此时 j1.js 尚未下载到本地，则首次渲染，此时的 DOM 树 只有 div1 ，所以页面上只会显示 div1，样式是 c1.css 和 c3.css 的并集。-->
  <!-- 如果此时 j1.js 已经下载到本地，则先执行 j1.js，页面不会渲染，所以此时仍然是白屏。-->
  <!--下面的 js 阻塞了 DOM 树的构建，所以下面的 div2 没有在文档的 DOM 树中。 -->
  <script src="http://test.com:9000/mine/load/case2/j1.js
  "></script>
  <!-- j1.js 执行完毕，继续 DOM 解析，div2 被构建在文档 DOM 树中，此时页面上有了div2 元素，样式仍然是 c1.css 和 c3.css 的并集 -->
  <link rel="stylesheet" href="./c4.css" />
  <!-- c4.css 加载完毕，重新构建render树，样式变成了 c1.css、c3.css 和 c4.css 的并集 -->
  <div id="div2"></div>
  <script>
  // 利用 performance 统计 load 加载时间。
    window.onload=function(){console.log(performance.timing.loadEventStart - performance.timing.fetchStart);}
  </script>
</body>
```

大家可以调整资源摆放位置，观察浏览器的解析表现。

### head 中资源的加载

*   head 中 js 资源加载都会停止后面 DOM 的构建，但是不影响后面资源的下载。
*   css 资源不会阻碍后面 DOM 的构建，但是会阻碍页面的首次渲染。

### body 中资源的加载

*   body 中 js 资源加载都会停止后面 DOM 的构建，但是不影响后面资源的下载。
*   css 资源不会阻碍后面 DOM 的构建，但是会阻碍页面的首次渲染。

### DomContentLoaded 事件的触发

上面只是讲了 html 文档的加载与渲染，并没有讲 DOMContentLoaded 事件的触发时机。直截了当地结论是，DOMContentLoaded 事件在 **html 文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发**。

大家可以自己写一下测试代码，分别引用内联 js 和外链 js 进行测试。

### load 事件的触发

当页面 DOM 结构中的 js、css、图片，以及 js 异步加载的 js、css 、图片都加载完成之后，才会触发 load 事件。

注意：

*   页面中引用的 js 代码如果有异步加载的 js、css、图片，是会影响 load 事件触发的。
*   video、audio、flash 不会影响 load 事件触发。

大家可以在 chrome 中试一下。

### 浏览器对同一域名下的资源并发下载线程数，chrome 为 6 个。

*   浏览器对**同一域名**下的下载并发不超过 6 个。超过 6 个的话，剩余的将会在队列中等待，这就是为什么我们要将资源收敛到不同的域名下，也是为了充分利用该机制，最大程度的并发下载所需资源，尽快的完成页面的渲染。

> 这里要注意关键词：**同一域名**。如果 n 个不同域名的话，在浏览器设置的最大并发上限以内 (默认是 10 个)，是可以达到 n * 6 个的最大并发的下载的。

### performance 性能统计。

另外，load 事件与 DOMContentLoaded 事件触发所花费的时间，可以利用 performance 这个对象的一些属性进行统计，时间精确到纳秒级。一些大公司的性能统计也主要利用这个对象的数据进行上报。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/6/21/164221df201228c8~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

*   connectStart：HTTP（TCP）开始建立连接的时间。如果是持久连接，则和 fetchStart 的时间相等，注意，如果在传输层发生了错误且重新建立连接，这里显示的是新建立连接的开始时间。
*   connectEnd: 完成建立连接的时间。
*   domComplete：DOM 树解析完成，并且资源准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
*   domContentLoadedEventEnd：DOM 解析完成后，网页内资源加载完成的时间（如 JS、css 加载执行完毕）。
*   domContentLoadedEventStart：DOM 解析完成后，网页内资源加载开始的时间在 DOMContentLoaded 事件抛出前发生。
*   loadEventStart：load 事件触发，也即 load 回调函数开始执行的时间。注意：如果没有绑定 load 事件，值为 0。
*   loadEventEnd：load 事件的回调函数执行完毕的时间。
*   ...

还有一些其他的性能统计属性，大家可以研究下。

以上内容希望能给大家带来不一样的思考，并希望能帮到大家理解文档的加载机理。