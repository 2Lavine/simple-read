%%begin highlights%%
一个 EventSource 实例会对 HTTP 服务器开启一个持久化的连接，以 text/event-stream 格式发送事件，此连接会一直保持开启直到通过调用 EventSource.close() 关闭。

对于处理如社交媒体状态更新、消息来源（news feed）或将数据传递到客户端存储机制（如 IndexedDB 或 web 存储）之类的，EventSource 无疑是一个有效方案

当不使用 HTTP/2 时，服务器发送事件（SSE）受到打开连接数的限制，这个限制是对于浏览器的，并且设置为非常低的数字（6）

这个限制是每个浏览器和域名的，这意味着你可以在所有标签页中打开 6 个 SSE 连接到 www.example1.com，以及另外 6 个 SSE 连接到 www.example2.com（来源：Stackoverflow）。当使用 HTTP/2 时，最大并发 HTTP 流的数量是由服务器和客户端协商的（默认为 100）。

EventSource()
创建一个新的 EventSource，用于从指定的 URL 接收服务器发送事件，可以选择开启凭据模式

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource)
更新时间: 2024-01-18 15:46