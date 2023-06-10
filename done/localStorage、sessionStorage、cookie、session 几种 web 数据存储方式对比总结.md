> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903989096497159)

cookie 和 session
================

cookie 和 session 都是普遍用来跟踪浏览用户身份的会话方式。

*   cookie 数据存放在客户端，session 数据放在服务器端。
-  考虑到安全应当使用 session。 cookie 本身并不安全，
- 
*   session 会在一定时间内保存在服务器上。如果访问量比较大，会比较消耗服务器的性能。
* 考虑到减轻服务器性能方面的开销，应当使用 cookie 。

* 单个 cookie 保存的数据不能超过 4K，很多浏览器都限制一个域名最多保存 50 个 cookie。 
* 将登陆信息等重要信息存放为 session、其他信息如果需要保留，可以放在 cookie 中。

cookie 的使用
----------

cookie 可通过 `document.cookie` 获取全部 cookie。
它是一段字符串，是键值对的形式。

```
name=sdsdsdd;name2=sdsdsd;
```

localStorage 和 sessionStorage
=============================

cookie 的使用（4kb）受到种种限制，存储容量太小和数据无法持久化存储。
storage 均为 5mb

localStorage理论上永久有效的，除非主动清除。
sessionStorage仅在当前网页会话下有效，关闭页面或浏览器后会被清除。

应用场景：
* localStorage 适合持久化缓存数据，比如页面的默认偏好配置等；
* sessionStorage 适合一次性临时数据保存。

WebStorage(localStorage 和 sessionStorage) 本身就提供了比较好用的方法：

```
localStorage.setItem("name", "value");
localStorage.getItem("name"); // => 'value'
localStorage.removeItem("name");
localStorage.clear(); // 删除所有数据

sessionStorage.setItem("name", "value");
```

<br>

注意事项：

*   localStorage 写入的时候，如果超出容量会报错，但之前保存的数据不会丢失。
*   localStorage 存储容量快要满的时候，getItem 方法性能会急剧下降。
*   web storage 在保存复杂数据类型时，较为依赖 `JSON.stringify`，在移动端性能问题比较明显。
