> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903590058786824?searchId=202309222121251330180011D325DEEAB8)

### fetch


在 MDN 上，讲到它跟 jquery ajax 的区别，这也是 fetch 很奇怪的地方：

当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject， 即使该 HTTP 响应的状态码是 404 或 500。
相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ）， 仅当网络故障时或请求被阻止时，才会标记为 reject。 

默认情况下, fetch 不会从服务端发送或接收任何 cookies, 如果站点依赖于用户 session，则会导致未经认证的请求（要发送 cookies，必须设置 credentials 选项）.



---
还要提一下的是，fetch 是比较底层的 API，很多情况下都需要我们再次封装。 比如：

```
// jquery ajax
$.post(url, {name: 'test'})
// fetch
fetch(url, {
    method: 'POST',
    body: Object.keys({name: 'test'}).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&')
})
```

由于 fetch 是比较底层的 API，所以需要我们手动将参数拼接成'name=test'的格式，而 jquery ajax 已经封装好了。所以 fetch 并不是开箱即用的。
### axios

并发请求

```
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
  }));
```

