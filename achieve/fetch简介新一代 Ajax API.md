> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903432613019661?searchId=20230922220824D75FAF6A213F99E4750A)

Request  clone
----------

在 `Request` 对象创建完成之后, 所有的属性都变为只读属性. 请注意, `Request` 有一个很重要的 `clone` 方法, 特别是在 Service Worker API 中使用时 —— 一个 Request 就代表一串流 (stream), 如果想要传递给另一个 `fetch` 方法, 则需要进行克隆。

处理Blob结果
--------

如果你想通过 fetch 加载图像或者其他二进制数据, 则会略有不同:

```
fetch('flowers.jpg')
    .then(function(response) {
      return response.blob();
    })
    .then(function(imageBlob) {
      document.querySelector('img').src = URL.createObjectURL(imageBlob);
    });
```

响应 Body mixin 的 `blob()` 方法处理响应流(Response stream), 并且将其读完。



---
另一种常用的 AJAX 调用是提交表单数据 —— 示例代码如下:

```
fetch('/submit', {
    method: 'post',
    body: new FormData(document.getElementById('comment-form'))
});
```

提交 JSON 的示例如下:

```
fetch('/submit-json', {
    method: 'post',
    body: JSON.stringify({
        email: document.getElementById('email').value
        answer: document.getElementById('answer').value
    })
});
```

