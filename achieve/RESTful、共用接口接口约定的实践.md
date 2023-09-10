> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903505312890894?searchId=20230908140926AF9EE05097DF80CD2A24)




之前接口是这样子的：
--------

<table><thead><tr><th>接口地址</th><th>含义</th><th>请求方式</th></tr></thead><tbody><tr><td>…/A 项目 / 模块 1/getProducts</td><td>获得产品</td><td>GET</td></tr><tr><td>…/A 项目 / 模块 1/addProduct</td><td>添加产品</td><td>POST</td></tr><tr><td>…/A 项目 / 模块 1/getProductDetail</td><td>获得产品详情</td><td>GET</td></tr><tr><td>…/A 项目 / 模块 1/editProduct</td><td>修改产品</td><td>POST</td></tr></tbody></table>

之前客户端请求是这样的：
----------

*   …/A 项目 / 模块 1/getProducts?id=1&a=2&b=3&c=4&d=5…………
*   A 页面 =====》B 页面（携带 n 个变量）====》C 页面（携带 m 个变量，包含 i 个 A 页面的变量） ------- 经常 n>4
*   大部分请求是 POST，至于 put、patch、delete 是什么鬼，关我屁事。
*   关于接口入参使用 json，那完全是看开发心情。

之前出参是这样的：
-------

{"message":"success","code":0,"data": 具体内容}  
其中 data 里包含数组可能是  
[{"a":"1","b":"1"},{"a":"1","b":"1"},{"a":"1","b":"1"},{"a":"1","b":"1"}]  
即使下一个页面用到也不会使用 id，而是把所有字段都传进去。  
- A 接口中，返回产品用 product；
- B 接口中使用 good，多个接口很可能不统一。

之前后端是这样的
------

…/A 项目 / 模块 1/getProducts ---- 接口  
…/A 项目 / 模块 1/Products.html ---- 页面  
…/A 项目 / 模块 1/Products.js ---- 静态资源

接口和静态资源缠在一块，毕竟很多页面可能是一位开发人员同时开发前端、后端，这里的弊端是，只需要自己清楚逻辑，很多做法临时应付，方案并不优雅，别人也很难看懂。一旦这位同事离职，很多说不清的逻辑就留给后人采坑了。


resultfull 接口约定
---------------
### post 方法

新增一条 XXX  
比如 ……/products 则代表新增一条产品  
入参 json 如下：

```
{
    "name":"我是一款新产品",
    "price":100,
    "kind":"我的分类",
    "pic":[一组图片],
    等等还有很多

}
```

### put 方法

新增某条 XXX 记录  
比如 ……/products/1111111111  
入参 json 如下：

```
{
    "name":"我是一款新产品",
    "price":100,
    "kind":"我的分类",
    "pic":[一组图片],
    等等还有很多

}
```


### get 方法

获得所有 XXX  
……/products 则代表获取所有产品  
因为有分页，所以我们后面加了? page=1&pageSize=50
我们约定了所有名词复数，都会返回 list，且 list 每个对象都有字段为 id 的唯一 id。  
比如

```
{
    "data":{"list":[{"id":"唯一id","其他很多字段":""},{"id":"唯一id","其他很多字段":""}],"page":1,其他字段},
    "code":0,
    "message":"成功"
}
```

……/products/{id} 获取某个具体产品（一定比列表更详细）

比如某个具体产品里还包含一个 list，如该产品推荐列表，则：  
……/products/{id}/recommendations

假设它包含的不是一个 list，而是对象，比如产品佣金信息，则：  
……/products/{id}/Commission

这里我们以是否名词复数来判断是对象还是 list.

### patch 方法

更新局部 XXX 产品 YYY 信息  
入参是 post 方法时入参的子集，所有支持更新的参数会说明，并不是支持所有变量  
……/products/{id}

```
{
    "name":"我是一款新产品",
    "price":100,
    部分变量
}
```


### delete 方法

删除 XXX 记录  
……/products/11111
### 其他说明

我们尽可能少的使用动词，但有一些行为需要使用动词，比如登录等。  
关于版本号，我们打算在模块后增加`/v1/`等标识。


权限约定
----
服务端要对用户角色进行判断，是否有权限执行某个逻辑。





