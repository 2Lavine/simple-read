> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903505312890894?searchId=20230908140926AF9EE05097DF80CD2A24)

> 上次那篇[我是如何重构整个研发项目，促进自动化运维 DevOps 的落地？](https://juejin.cn/post/6844903503626764301 "https://juejin.cn/post/6844903503626764301")中提到 restful 接口重构具体详细内容没有写出来，今天补上。

前言
==

随着互联网高速发展，公司对项目开发周期不断缩短，我们面对各种需求，使用原有对接方式，各端已经很难快速应对各种需求，更难以提高效率。于是，我们不得不重新制定对接规范、开发逻辑以便快速上线项目。

我们的目标
=====

1.  尽可能的缩小沟通的成本，开最少的会，确定大部分的事。
2.  花最少的时间写文档，保证 90% 的开发人员看懂所有内容。
3.  哪怕不看文档，也能知道各种接口逻辑。
4.  不重复写代码
5.  尽可能的写高可读性的代码

我们做了哪些事
=======

1.  完成了前后端分离
2.  Android、ios、web 共用一套接口
3.  统一接口规范（post、put、get、patch、delete）
4.  统一了调试工具
5.  统一了接口文档

之前的我们
=====

接口是这样子的：
--------

<table><thead><tr><th>接口地址</th><th>含义</th><th>请求方式</th></tr></thead><tbody><tr><td>…/A 项目 / 模块 1/getProducts</td><td>获得产品</td><td>GET</td></tr><tr><td>…/A 项目 / 模块 1/addProduct</td><td>添加产品</td><td>POST</td></tr><tr><td>…/A 项目 / 模块 1/getProductDetail</td><td>获得产品详情</td><td>GET</td></tr><tr><td>…/A 项目 / 模块 1/editProduct</td><td>修改产品</td><td>POST</td></tr></tbody></table>

客户端请求是这样的：
----------

*   …/A 项目 / 模块 1/getProducts?id=1&a=2&b=3&c=4&d=5…………
*   A 页面 =====》B 页面（携带 n 个变量）====》C 页面（携带 m 个变量，包含 i 个 A 页面的变量） ------- 经常 n>4
*   大部分请求是 POST，至于 put、patch、delete 是什么鬼，关我屁事。
*   关于接口入参使用 json，那完全是看开发心情。

出参是这样的：
-------

{"message":"success","code":0,"data": 具体内容}  
其中 data 里包含数组可能是  
[{"a":"1","b":"1"},{"a":"1","b":"1"},{"a":"1","b":"1"},{"a":"1","b":"1"}]  
即使下一个页面用到也不会使用 id，而是把所有字段都传进去。  
A 接口中，返回产品用 product；B 接口中使用 good，多个接口很可能不统一。

客户端对接是这样子的：
-----------

*   安卓、ios 一套; 部分接口各自用一套；html5 端一套。
*   客户端和后台是不停交流的

接口文档是这样的
--------

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/21/ffb32c8bc534541d7a20127e5d85920c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/21/511f71024ade2654084af2ff84b3620e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

1.  swagger
2.  阿里的 rap
3.  Word 文档
4.  其它

当然了，我觉得 swagger 和 rap 神器都是非常强大的，能够实现各种功能逻辑，但是考虑到开发人员掌握程度不通，复杂度较高，难以提高效率，我决定初期并不使用这两样神器。

后端是这样的
------

…/A 项目 / 模块 1/getProducts ---- 接口  
…/A 项目 / 模块 1/Products.html ---- 页面  
…/A 项目 / 模块 1/Products.js ---- 静态资源

接口和静态资源缠在一块，毕竟很多页面可能是一位开发人员同时开发前端、后端，这里的弊端是，只需要自己清楚逻辑，很多做法临时应付，方案并不优雅，别人也很难看懂。一旦这位同事离职，很多说不清的逻辑就留给后人采坑了。

等等…………
------

重构
==

下面步入正题，面对以上众多问题聊聊我是如何重新制定流程的

数据库约定
-----

约定数据库里所有表必须包含名为 id 主键字段。  
可能有人会说，正常来说不是每张表里都应该有 id 主键吗？但是，我们项目中由于之前开发不严谨，部分表没有 id 主键，或者不为 id 的主键。这里我们采用分布式的全球唯一码来作为 id。

api 出参约定
--------

约定所有出参里含 list，且其他请求会用到这组 list，则 list 里所有对象必须含 id 唯一标识。

入参约定
----

约定 token 身份认证统一传入参数模式，后端采用 aop 切面编程识别用户身份。其他参数一律为 json。

resultfull 接口约定
---------------

首先我们选择一个名词复数，比如产品

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

java 代码 control 层

```
@ResponseBody
    @RequestMapping(value = "/A项目/B模块/products", method = {RequestMethod.POST})
    public ResultObject getProducts() {
        //具体逻辑。
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

表示增加一条 1111111111id 的记录  
java 代码 control 层

```
@ResponseBody
    @RequestMapping(value = "/A项目/B模块/products/{id}", method = {RequestMethod.PUT})
    public ResultObject putProducts(@PathVariable(value = "id") String id) {
        //具体逻辑。
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

java 代码 control 层

```
@ResponseBody
    @RequestMapping(value = "/A项目/B模块/products/{id}", method = {RequestMethod.GET})
    public ResultObject putProducts(@PathVariable(value = "id") String id) {
        //具体逻辑。
    }
```

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

java 代码 control 层

```
@ResponseBody
    @RequestMapping(value = "/A项目/B模块/products/{id}", method = {RequestMethod.PATCH})
    public ResultObject putProducts(@PathVariable(value = "id") String id) {
        //具体逻辑。
    }
```

### delete 方法

删除 XXX 记录  
……/products/11111

删除 11111 产品。  
java 代码 control 层

```
@ResponseBody
    @RequestMapping(value = "/A项目/B模块/products/{id}", method = {RequestMethod.DELETE})
    public ResultObject putProducts(@PathVariable(value = "id") String id) {
        //具体逻辑。
    }
```

### 其他说明

我们尽可能少的使用动词，但有一些行为需要使用动词，比如登录等。  
关于版本号，我们打算在模块后增加`/v1/`等标识。

权限约定
----

服务端要对用户角色进行判断，是否有权限执行某个逻辑。

前后端分离约定
-------

后端以开发接口为主，不再参与页面开发，或者混合式 jsp 页面开发，统一以接口形式返回，前端通过 js 渲染数据以及处理逻辑。

共用接口
----

web、Android、ios 使用统一接口，不在因为哪方特殊要求额外开放接口。

使用统一 dao 层生成工具
--------------

基于 mybatis-generator 改造成适合我们项目的 dao 层以及部分 service 层，内部共同维护共同使用。

使用 postman 最为接口文档、调试工具
----------------------

虽然有上文中介绍的 rap 和 swagger 都是特别牛的接口神器，但是我们还是选择了 postman，开发人员将接口名称、说明、入参、出参，以及各种出参示例都存储，这样开发直接可以看得清接口含义。

我们建议使用浏览器插件，这里以 360 极速浏览器为例。  
插件下载地址：  
[download.csdn.net/download/qq…](https://link.juejin.cn?target=http%3A%2F%2Fdownload.csdn.net%2Fdownload%2Fqq273681448%2F10033456 "http://download.csdn.net/download/qq273681448/10033456")

打开 360 浏览器扩展中心，然后勾选开发者模式，再点击加载已解压的扩展程序，选中压缩包解压后的目录，最后点击运行即可。  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/e6c4bba8482a45883285f94fe8fbd5a1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

其中出参注释、及接口说明，写在 tests 里：

```
/*
这里是接口说明，和每个出参、入参的意思。
*/
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/5c7516a1ee641dfc92663b4257d3a6d9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

接口按模块划分为文件夹：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/dde76fe5466662a38d344c3aa0a65784~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

入参：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/3a6c41aa21d21a022886a2f7c58de9a9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

出参示例：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/51f2bcb0cc868e3ca7d02e4e586e47c1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

正常请求：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/22/c67afc1c32e01c9a0c7307a209968109~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

开发人员即可直接看到接口示例进行开发，而开发人员开发的时候，自己调用一次即可保存为 postman 文件，为了加快上线，我们允许将 java 中实体类变量定义的代码（含注释）直接复制粘贴出来。

js 等静态资源缓存问题
------------

从短期角度上讲，我的要求是减少 js 文件的变更，如果有变更，务必更改版本号。那么如何减少修改，我们的做法是将一部分 js 写在 html 内，反正前后端分离，大不了刷新一下 cdn 的节点缓存，毕竟大部分浏览器也不会主动缓存 html 文件（大部分浏览器会缓存 js 等文件）。

统一 js 请求框架
----------

这里我们使用 angular js 的请求框架，因为我们内部对 angularjs 使用较多，比较熟悉，封装后的请求，可以自动弹窗错误请求，可复写错误回调。

目前效果
====

目前，我们客户端看到接口，大概能说出其意思，也能猜出一连串接口的含义，比如  
……/classes  
可以看出它是获取班级列表接口，猜到

……/classes/id get 获取 id 为 id 的班级详情  
……/classes/id patch 修改班级信息  
……/classes/id delete 删除班级信息

至于入参，patch 是 post 的子集、put=patch、delete 无入参。

而入参含义，直接打开 postman 可以直接查看每个字段的含义，并且，可以实时调取开发环境数据（非开发人员电脑），这里我们使用了多环境，详情可了解我之前写的一篇  
[我是如何重构整个研发项目，促进自动化运维 DevOps 的落地？](https://juejin.cn/post/6844903503626764301 "https://juejin.cn/post/6844903503626764301")

前端使用统一封装后的 js 请求框架也加快了开发进度，不用造轮子。

开发人员，一般代码开发写好，使用 postman 自我测试，测试完成后，接口文档也就写好了。

测试人员想了解接口文档的也可以直接使用 postman 进行导入查看。

至此，我们交流成本下降了一大半，剩下开会的内容就是按 ui 分解需求或者按 ui 施工了。

总结
==

经过一番的折腾，开发进度总算快了点，也一定程度上达到了快速上线项目的效果。关于 restful 风格 api，每个人都有自己的见解，只要内部约定清楚，能尽可能少的减少沟通，我觉得就是好的理解。至于接口工具，可能很多人会说为什么不用之前的，我觉得以后还是会用的，最好能做到插件自动化生成 api，但是对 java 开发注释要求比较严格，随意慢慢来吧，毕竟后面我们还有很多路要走。