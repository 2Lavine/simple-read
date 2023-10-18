> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6924939429362532360?searchId=2023101110252673D9E36F2A841044F394)

Chrome 将不再执行通过 document.write 注入的脚本
-----------------------------------

Chrome 将很快干预 document.write 指令，并因此禁止通过该指令注入脚本。
只有在同时满足以下条件时才会阻塞：
*   用户的网络连接非常糟糕，
*   脚本是阻塞解析器的（既没有 async 也没有 defer 属性）并且不在浏览器缓存里，
*   该指令被加在顶级的 document 里（也就是说 iframe 不受影响），
#### document.write 问题 1 注入脚本
当你用下面的 JavaScript 命令注入一段脚本时：
```
_document.write('<script src=""https://example.com/script.js""></script>');_
```

浏览器无法继续解析 HTML。web 浏览器被强制等待资源加载后才执行。
情况可能会变得更糟，因为如果第一段脚本还注入其他脚本的话，浏览器会停止工作！

#### document 问题 2 强制刷新
如果 DOM 已经创建好了，使用 document.write 会强制浏览器再创建一次…… 可惜了性能！（document.write 会写入文档流，在已经加载完毕的文档里调用 document.write 会重置当前的文档。）

如何避免 document.write
-------------------

通常来说，
1. 你应该避免使用阻塞的 JavaScript。“Defer” 和 “async” 属性会让你异步地调用外部脚本。然而要小心脚本的执行顺序，因为在异步加载的情况下不能保证它们的顺序！
2. 如果 document.write 涉及到第三方服务，你需要看看你的提供商是否能提供异步加载的版本。如果没有，考虑替代方案。
3. 为了在网页里插入内容，考虑使用 DOM 操作而不是 document.write。这里有个脚本示例：
```
_var sNew = document.createElement(""script"");
sNew.async = true;
sNew.src = ""https://example.com/script.min.js"";
var s0 = document.getElementsByTagName('script')[0];
s0.parentNode.insertBefore(sNew, s0);_
```
