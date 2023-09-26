> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7086325194934976519?searchId=202309222121251330180011D325DEEAB8)


1.Ajax
------
简单来说，Ajax 是一种思想，XMLHttpRequest 只是实现 Ajax 的一种方式。其中 XMLHttpRequest 模块就是实现 Ajax 的一种很好的方式，这也是很多面试官喜欢让面试者手撕的代码之一。
**注意：** 我们使用这种方式实现网络请求时，如果请求内部又包含请求，以此循环，就会出现回调地狱，这也是一个诟病，后来才催生了更加优雅的请求方式。


3.Axios
-------


> Axios 是一个基于 promise 封装的网络请求库，它是基于 XHR 进行二次封装。

**示例代码：**

```
// 发送 POST 请求
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
})
```
