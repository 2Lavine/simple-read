> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7207637337571901495?searchId=20230901115242BA94AF700DEF9495FDC5)

想必大家都写过 http 服务，接受 http 请求、做一些处理、返回 http 响应。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70cc293b9e384569b996c7bd0ceb63ae~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这样完成 web 服务器的功能没问题，但随着功能的越来越多，比如现在有一百多个模块了，总不能都放在一个服务里吧，这样管理不方便。

于是就有了拆分的需求，也就有了微服务的概念。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a07572bdf7047f18fed936dcf661b5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

拆分微服务是很自然的事情，但有个问题，微服务和 http 服务之间怎么通信呢？

用 HTTP？

这个是可以，但是 HTTP 是文本协议，传输效率太低了。

所以一般都直接用 TCP 通信。

微服务架构是主流了，各种服务端开发框架都提供了微服务的支持，Nest 自然也不例外。

而且，Nest 对微服务封装的很好，写个微服务是特别简单的事情。

不信我们一起来写一个吧！

首先全局安装 nest 的 cli 工具：

```
npm i -g @nestjs/cli
```

然后用 nest 的 cli 快速创建一个 nest 项目：

```
nest new xxx
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9799cd0569ef4b089f3c0fd5a3fb0f2f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

选一个依赖管理工具，我这里用的 yarn。

执行 yarn start 就可以看到跑起来的 http 服务了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e62488eef3c43b891586512cf802ed3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

浏览器访问下 [http://localhost:3000](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A3000 "http://localhost:3000")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1177f3d250435693b961a1cccfbba2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

到这一步，http 服务就启动成功了。

然后我们创建个微服务，同样的方式，用 nest new 创建个项目：

```
nest new micro-service-calc
```

这里要创建微服务，需要安装一个包：

```
yarn add @nestjs/microservices
```

然后改下 main.ts：

之前创建 http 服务是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0c260ca723a44189002364eb1d9bba5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在要改成这样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0792d17de3464fc59ee0b40e5d11202c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 8888,
      },
    },
  );
  app.listen();
}
bootstrap();
```

很容易理解，之前是启 http 服务，现在是起微服务了嘛，所以启动方式不一样。

启动的时候指定用 TCP 来传输消息，然后指定 TCP 启动的端口为 8888。

之后在 AppController 里注册下怎么处理 TCP 的消息：

这里用 MessagePattern 的方式来声明处理啥消息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c2f6f2daa39425c88250eaa9cc7e897~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }
}
```

这个 sum 方法就是接受 sum 消息，返回求和的结果的 handler。

然后同样是 yarn start 把这个微服务跑起来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e54afe9dc764803a0ce7543b1f62d7a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在我们有两个服务了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba494db82c84a25996a2f1f5b63a6db~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

一个 http 服务，一个 TCP 协议的微服务，然后把两者连起来就可以了。

怎么连起来呢？

我们来改造下 http 服务。

先安装 @nestjs/microservices 依赖：

```
yarn add @nestjs/microservices
```

然后在 app.module.ts 里注册 calc 那个微服务：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dbfa6b8f709483f90da3f33a837c116~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

调用 ClientModule.register 指定名字、传输方式为 TCP、端口为 8888。

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CALC_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 8888,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
```

这样就注册完了。

然后就可以用了，在 Controller 里注入这个微服务的 clientProxy，也就是客户端代理。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b93dc67ef92455786513ba1f726e78f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('CALC_SERVICE') private calcClient: ClientProxy) {}

  @Get()
  calc(@Query('num') str): Observable<number> {
    const numArr = str.split(',').map((item) => parseInt(item));

    return this.calcClient.send('sum', numArr);
  }
}
```

这样就可以接收到 http 请求的时候调用微服务来处理了。

比如上面我们在收到请求的时候，调用代理对象的 send 方法发了一个 TCP 消息给微服务。

这也是为啥叫做 ClientProxy 了，不用你自己发 TCP 消息，你只要调用 send 方法即可。

然后把它重新跑起来：

```
yarn start
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b3a10e1b77c49269ca0ea4d4c8b43c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后，看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c089241b7840b89da26b4f7f18cd22~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我们 num 传了 1,2,3，这里返回了 6 ，这明显就是 calc 微服务处理的。

这样，我们第一个 Nest 微服务就跑成功了！

是不是挺简单的？

其实微服务还有一种消息传输的类型，这里我们需要响应，所以是 message 的方式，如果不需要响应，那就可以直接声明 event 的方式。

我们再来创建个微服务，用来打印日志。

用 nest new mirco-app-log 创建项目，然后安装 @nestjs/microservices 包，之后像上一个微服务一样改用 createMicroservice 的 api 启动服务。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6d96e79b91944058db8195f0a645c3d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这个微服务起在 9999 端口。

然后 Controller 改一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/267ee338690f46129001fb780625f6b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这里不需要响应，只是处理事件，所以不用 MessagePattern 注册消息了，用 EventPattern。

然后在 main 项目里注册下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0500eb4cb3f741a2921fb4b2713b4741~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

名字叫做 LOG_SERVICE，端口 9999。

然后在 Controller 里注入这个微服务的 clientProxy：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28f6976491f1475385fa29aee8dcc032~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这样我们在这个 http 请求的 handler 里同时用到了两个微服务：

用 calc 微服务来做计算，用 log 微服务来记录日志。

yarn start 重跑一下。

浏览器刷新下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/566601d4789a4094ac293166406fcbf1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

同样返回了 6，说明 calc 微服务正常。

再去 log 微服务的控制台看看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62d0d0a50d074a4eb3bb766a8755286f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

log 的微服务打印了日志，说明 log 微服务正常。

至此，Nest 微服务跑成功了！

完整 demo 代码上传了 github： [github.com/QuarkGluonP…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FQuarkGluonPlasma%2Fnest-microservice-demo "https://github.com/QuarkGluonPlasma/nest-microservice-demo")

总结
--

http 服务大了难免要拆分，现在都是拆成微服务的方式，http 服务负责处理 http 请求，微服务完成不同模块的业务逻辑处理。

微服务和 http 服务之间用 TCP 通信。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb35810637d44f54977cb76e89a13d6f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

用 nest 跑个微服务的步骤如下：

*   用 nest new 创建一个 main 服务，一个微服务
*   都要安装 @nestjs/microservices 包，因为用到其中的 api
*   微服务里用 createMicroservice 启动服务，选择传输方式为 TCP，指定端口
*   微服务里在 Controller 使用 MessagePattern 或者 EventPattern 注册处理消息的 handler
*   main 服务使用 ClientsModule.register 来注册微服务
*   main 服务里注入 ClientProxy 对象，调用它的 send 方法给微服务发消息

这就是 Nest 跑微服务的方式。

当然，现在都是本机部署的，你完全可以把微服务放到不同的服务器，甚至可以不同微服务用不同的集群部署。

Nest 里跑微服务以及 http 服务里注册微服务的方式，还是挺简单的，这块封装的确实好。