> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7207637337571901495?searchId=20230901115242BA94AF700DEF9495FDC5)

大家都写过 http 服务，接受 http 请求、做一些处理、返回 http 响应。
这样完成 web 服务器的功能没问题，
但随着功能的越来越多，比如现在有一百多个模块了，放在一个服务里导致管理不方便。
现在都是拆成微服务的方式，http 服务负责处理 http 请求，微服务完成不同模块的业务逻辑处理。

## 微服务和 http 服务通信
![[Pasted image 20230903193834.png]]

拆分微服务是很自然的事情，但有个问题，微服务和 http 服务之间怎么通信呢？
HTTP 是文本协议，传输效率太低了。所以一般都直接用 TCP 通信。


Nest 微服务

用 nest 跑个微服务的步骤如下：

*   用 nest new 创建一个 main 服务，一个微服务
*   都要安装 @nestjs/microservices 包，因为用到其中的 api
*   微服务里用 createMicroservice 启动服务，选择传输方式为 TCP，指定端口
*   微服务里在 Controller 使用 MessagePattern 或者 EventPattern 注册处理消息的 handler
*   main 服务使用 ClientsModule.register 来注册微服务
*   main 服务里注入 ClientProxy 对象，调用它的 send 方法给微服务发消息

### createMicroservice启动微服务

![[../_resources/ab549d4f236b1cec1298425a3b057379_MD5.webp]]
启动的时候指定用 TCP 来传输消息，然后指定 TCP 启动的端口为 8888。

### main 服务器calc 微服务
在 app.module.ts 里注册 calc 那个微服务：
![[../_resources/ea45292db6fbc7633595acf86ed721a3_MD5.webp]]

调用 ClientModule.register 指定名字、传输方式为 TCP、端口为 8888。

## ClientProxy 给微服务发请求
在 Controller 里注入这个微服务的 clientProxy，也就是客户端代理。

![[../_resources/b0a584439a7a189d9f90d1ca92916576_MD5.webp]]


这样就可以接收到 http 请求的时候调用微服务来处理了。
比如上面我们在收到请求的时候，调用代理对象的 send 方法发了一个 TCP 消息给微服务。
这也是为啥叫做 ClientProxy 了，不用你自己发 TCP 消息，你只要调用 send 方法即可。




