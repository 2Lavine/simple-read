> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6924939429362532360?searchId=2023101110252673D9E36F2A841044F394)

译者：kayson

[原文链接](https://link.juejin.cn?target=http%3A%2F%2Fblog.dareboost.com%2Fen%2F2016%2F09%2Favoid-using-document-write-scripts-injection%2F "http://blog.dareboost.com/en/2016/09/avoid-using-document-write-scripts-injection/")

Web 性能测试工具比如 Google Page Speed 或者 [Dareboost](https://link.juejin.cn?target=https%3A%2F%2Fwww.dareboost.com "https://www.dareboost.com") 已经指出：使用 document.write 注入一段脚本会引起严重的网站加载耗时问题。让我们再次讨论这个话题，因为 Chrome 的下次更新将不再允许这样的脚本注入方式。你将面临什么问题？有什么替代方案？

Chrome 将不再执行通过 document.write 注入的脚本
-----------------------------------

9 月初 Paul Kinlan 在 [developers.google.com 网站](https://link.juejin.cn?target=https%3A%2F%2Fdevelopers.google.com%2Fweb%2Fupdates%2F2016%2F08%2Fremoving-document-write "https://developers.google.com/web/updates/2016/08/removing-document-write") 上宣布：Chrome 将很快干预 document.write 指令，并因此禁止通过该指令注入脚本。确实，随着 Chrome 54 的发布，这个改变会在 10 月中旬发生。相关网站在 Chrome 53 的开发者控制台可以看到一些警告。

**确切的说是哪种阻塞？**

幸运的是，对大部分网站来说，阻塞的情况是非常有限的，只有在同时满足以下条件时才会：

*   用户的网络连接非常糟糕，
    
*   脚本是阻塞解析器的（既没有 async 也没有 defer 属性）并且不在浏览器缓存里，
    
*   该指令被加在顶级的 document 里（也就是说 iframe 不受影响），
    

如果这些条件全都满足，脚本压根就不会被加载。因此如果你的网页集成了第三方服务，要注意。即使你自己不使用该指令，你的网站可能会有这样的依赖，导致部分用户很快无法使用。

即使这个变化会导致一些网站不能运行，Chrome 的策略却很有意思，它是为了排挤（非常）不好的实践。正如以下列出的，document.write 确实会带来严重的性能问题。

document.write 引发的问题
--------------------

当你用下面的 JavaScript 命令注入一段脚本时：

```
_document.write('<script src=""https://example.com/script.js""></script>');_
```

浏览器无法继续解析 HTML。web 浏览器被强制等待资源加载后才执行。情况可能会变得更糟，因为如果第一段脚本还注入其他脚本的话，浏览器会停止工作！考虑到你在网页里可能用到的所有第三方服务， 这种情况并不罕见。作为证明，在这次的更新通知中 Chrome 公布了他们自己的测试结果：7.6% 的网页与此相关！

顺便提一下，我们也可以了解到 document.write 指令是多么厉害的性能杀手。我们来看看 Chrome 的测试结果，其中 1% 的用户使用的是 2G 网络： 解析页面的平均时间减少了 38%， 近 6 秒的优势！

使用 document.write 的另外一个问题（不仅仅是注入的脚本的案例）：如果 DOM 已经创建好了，使用 document.write 会强制浏览器再创建一次…… 可惜了性能！（document.write 会写入文档流，在已经加载完毕的文档里调用 document.write 会重置当前的文档。）

如何避免 document.write
-------------------

通常来说，你应该避免使用阻塞的 JavaScript。“Defer” 和 “async” 属性会让你异步地调用外部脚本。然而要小心脚本的执行顺序，因为在异步加载的情况下不能保证它们的顺序！

如果 document.write 涉及到第三方服务，你需要看看你的提供商是否能提供异步加载的版本。如果没有，考虑替代方案。

最后，为了在网页里插入内容，考虑使用 DOM 操作而不是 document.write。这里有个脚本示例：

```
_var sNew = document.createElement(""script"");
sNew.async = true;
sNew.src = ""https://example.com/script.min.js"";
var s0 = document.getElementsByTagName('script')[0];
s0.parentNode.insertBefore(sNew, s0);_
```

结论是，请注意，根据这次更新，我们的 [网站测试工具](https://link.juejin.cn?target=https%3A%2F%2Fwww.dareboost.com%2F "https://www.dareboost.com/") 很快会加大对使用 document.write 的处罚，特别是对移动端环境下的分析结果。