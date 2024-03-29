> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7082655545491980301?searchId=20230915142219A3CD8A18673BC5C81FAC)

Nginx 是什么？
----------

`Nginx` (engine x) 是一个**轻量级、高性能的 HTTP** 和**反向代理服务器**, 同时也是一个**通用代理服务器** (TCP/UDP/IMAP/POP3/SMTP), 最初由俄罗斯人 Igor Sysoev 编写。

简单的说：

*   `Nginx`是一个拥有高性能 HTTP 和反向代理服务器，其特点是`占用内存少`，`并发能力强`，并且在现实中，nginx 的并发能力要比在同类型的网页服务器中表现要好
*   `Nginx`专为`性能优化`而开发，最重要的要求便是`性能`，且十分注重效率，有报告 nginx 能支持高达 50000 个并发连接数

动静分离
----

当客户端发起请求时，正常的情况是这样的：我们将动态资源和静态资源分离出来，交给不同的服务器去解析，这样就加快了解析的速度，从而降低由单个服务器的压力

![[../_resources/23a49979bc5101ddbf823c9578080db6_MD5.webp]]

安装 Nginx
--------

关于 nginx 如何安装，这里就不做过多的介绍了，感兴趣的小伙伴看看这篇文章：[【Linux】中如何安装 nginx](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fyujing1314%2Farticle%2Fdetails%2F97267369 "https://blog.csdn.net/yujing1314/article/details/97267369")

这里让我们看看一些常用的命令：

*   查看版本：`./nginx -v`
*   启动：`./nginx`
*   关闭：`./nginx -s stop`(推荐) 或 `./nginx -s quit`
*   重新加载 nginx 配置：`./nginx -s reload`

Nginx 的配置文件
-----------

配置文件分为三个模块：

*   全局块：从配置文件开始到 events 块之间，主要是设置一些**影响 nginx 服务器整体运行的配置指令**。（按道理说：并发处理服务的配置时，值越大，可支持的并发处理量越多，但此时会受到硬件、软件等设备等的制约）
*   events 块：影响 **nginx 服务器与用户的网络连接**，常用的设置包括是否开启对多 workprocess 下的网络连接进行序列化，是否允许同时接收多个网络连接等等
*   http 块：如反向代理和负载均衡都在此配置

location 的匹配规则
--------------

共有四种方式：

```
location[ = | ~ | ~* | ^~ ] url {
    
    }
```

*   = ：`精确匹配`，用于**不含正则表达式**的 url 前，要求字符串与 url **严格匹配**，完全相等时，才能停止向下搜索并处理请求
*   `^~`：用于**不含正则表达式**的 url 前，要求 ngin 服务器找到表示 **url 和字符串匹配度最高**的 location 后，立即使用此 location 处理请求，而不再匹配
*   `~` ：`最佳匹配`，用于表示 url **包含正则表达式**，并且**区分**大小写。
*   `~*`：与`~`一样，只是**不区分**大小写

注意：

*   如果 `url` 包含正则表达式，则不需要 `~` 作为开头表示
*   nginx 的匹配具有`优先顺序`，一旦匹配上就会立马退出，不再进行向下匹配
