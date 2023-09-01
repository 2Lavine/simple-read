> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7054421306845954056?searchId=20230901115242BA94AF700DEF9495FDC5)

初识 Nest
=======

前言
--

最近在考虑和小伙伴做一个 todolist 平台给自己用，很久之前学习过 `express` ，想着与时俱进一下, 看看近期热度较高的几个框架是怎样的。在几个对比下选择了 `nest` 在初步使用后记录一下，方便日后查阅。

贴出中文文档以便大家进一步学习 [Nest](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.cn%2F "https://docs.nestjs.cn/")

框架简介
----

*   Nest 是一个用于构建高效，可扩展的 [Node.js](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2F "http://nodejs.cn/") 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 [TypeScript](https://link.juejin.cn?target=https%3A%2F%2Fwww.tslang.cn%2F "https://www.tslang.cn/")（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 OOP（面向对象编程），FP（函数式编程）和 FRP（函数式响应编程）的元素。
*   Nest 框架底层 HTTP 平台默认是基于 Express 实现的，所以无需担心第三方库的缺失。 Nest 旨在成为一个与平台无关的框架。 通过平台，可以创建可重用的逻辑部件，开发人员可以利用这些部件来跨越多种不同类型的应用程序。 nest 目前有两个支持开箱即用的 HTTP 平台：express 和 fastify 可以在项目中直接引入。

为什么选择 Nest
----------

*   目前市面上有很多 node 框架可供大家选择。
*   Express.js 是 Node.JS 诞生之初，是一款基于 [Node.js](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2F "http://nodejs.cn/") 以及 Chrome V8 引擎，快速、极简的 JS 服务端开发框架。
*   Koa.js 是一款微型 Web 框架，写一个 hello world 很简单，但 web 应用离不开 session，视图模板，路由，文件上传，日志管理。这些 Koa 都不提供，需要自行去官方的 Middleware 寻找。然而，100 个人可能找出 100 种搭配。
*   Egg.js 是基于 Koa.js，解决了上述问题，将社区最佳实践整合进了 Koa.js，另取名叫 Egg.js，并且将多进程启动，开发时的热更新等问题一并解决了。这对开发者很友好，开箱即用，开箱即是最 (较) 佳配置。Egg.js 发展期间，ECMAScript 又推出了 async await，相比 yield 的语法 async 写起来更直。后面 Koa.js 也同步进行了跟进。
*   Midway 是阿里团队，基于渐进式理念研发的 Node.js 框架，结合了 OOP 和函数式两种编程范式。以 egg 是作为底层框架，加上了良好的 TypeScript 的定义支持等众多新特性, 推出了 Midway，有兴趣的小伙伴可以去官方文档学习一下
*   Nest.js 基于 Express.js 的全功能框架 Nest.js，他是在 Express.js 上封装的，充分利用了 TypeScript 的特性；Nest.js 的优点是社区活跃，涨势喜人，截止目前在 [GitHub](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnestjs%2Fnest "https://github.com/nestjs/nest") 拥有 `43.7k Star` 是近期比较热门的企业级框架。
*   基于支持底层支持 ts 与企业级和社区活跃度等综合考虑，这里我选择用 nest 来进行学习。各位同学可以按需选择。

创建项目
----

*   确保电脑安装了 Node.js (>= 10.13.0)
    
*   这里我使用的 node 版本为 `v14.16.1` 包用的是 yarn 管理的 版本为 `1.22.17`
    

#### 创建项目

*   ```
    $  npm i -g @nestjs/cli
    $  nest new project-name
    ```
    
*   创建好项目后看一下项目目录, 以下是核心文件的简单描述:
    
*   <table><thead><tr><th>app.controller.ts</th><th>带有单个路由的基本控制器示例</th></tr></thead><tbody><tr><td>app.controller.spec.ts</td><td>对于基本控制器的单元测试样例</td></tr><tr><td>app.module.ts</td><td>应用程序的根模块。</td></tr><tr><td>app.service.ts</td><td>带有单个方法的基本服务</td></tr><tr><td>main.ts</td><td>应用程序入口文件。用来创建 Nest 应用实例。</td></tr></tbody></table>
    
    ```
    /* main.ts */
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    
    async function bootstrap() {
      const app = await NestFactory.create(AppModule); // 使用核心类 NestFactory 返回一个 接口对象
      await app.listen(3000);  // 这里是默认设置的端口号
    }
    bootstrap();
    ```
    

#### 运行项目

*   ```
    $ npm run start:watch // 启动项目并监听代码变动 这里可以在package.json 中进行配置指令
    ```
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8fcbe7196cd4cf5928b0e454302acea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   ```
    我们可以看到服务已经启动,输入本机地址并带上端口号3000,发送一次 get 请求 则会返回 `Hello World`。 
      
      这里是因为在 app.controll.ts 文件中 @Get()HTTP请求装饰器告诉Nest为HTTP请求的特定端点创建处理程序。
    ```
    

路由
--

*   在开始写代码之前我们先简单看一下 nest 中的基础路由配置是怎样的，就目前而言我的理解为 nest 的路由是由 全局路由 路由前缀 (局部路由) 方法装饰器 组成路由映射提供给前端使用。
    
*   ```
    /* main.ts */
     main文件中我们可以在项目监听前配置一个全局的api前缀
    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
        //设置全局前缀
        app.setGlobalPrefix('api');
        await app.listen(3000);
      }
    /* app.controller.ts */
    @Controller('user') // 控制器设置路由前缀 我理解为局部路由
      export class AppController {
        constructor(private readonly appService: AppService) {}
        @Get('find') // 方法装饰器设置路由路径 这里我理解为设置api子路由
        getHello(): string {
          return this.appService.getHello();
            }
        }
    ```
    
*   以上方法在 api 中映射成完整的路由为 `GET api/user/find` 。
    
*   其中 @Get()HTTP 请求装饰器告诉 Nest 为 HTTP 请求的特定端点创建处理程序。
    

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e330a77665304aa9a0439378ad5c28de~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   可以看到上面的 `get` 接收请求及路由以可以使用，下面我们看一下 `nest` 中如何接收 `post` 等其他请求方式

不同方式接收请求
--------

*   这里用到的 Nest 提供的请求装饰器知识点 `Request` 对象代表 `HTTP` 请求，并具有查询字符串，请求参数参数，HTTP 标头（HTTP header） 和 正文（HTTP body）的属性（在[这里](https://link.juejin.cn?target=https%3A%2F%2Fexpressjs.com%2Fen%2Fapi.html%23req "https://expressjs.com/en/api.html#req")阅读更多）。在多数情况下，不必手动获取它们。 我们可以使用专用的装饰器，比如开箱即用的 `@Body()` 或 `@Query()` 。 下面是 Nest 提供的装饰器及其代表的底层平台特定对象的对照列表。
    
*   ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/530021517f3e4d2f83d4f3c563bcf645~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
*   下面我们看一下 nest 中如何接收 `get post put delete` 发起的请求，用几个可用的装饰器来创建基本控制器。 该控制器暴露了几个访问和操作内部数据的方法。
    

### Get

*   我们先创建一个 user 服务 / 控制器 / moudle
    
    ```
    / * user.service.ts  */ 先创建一个 user service服务文件
    import { Injectable } from '@nestjs/common';
       @Injectable() // 
       // 这里
       export class UserService {
         findUser(sid: string): string {
           console.log(sid);
           if (sid === '123456') {
             return 'kid is here';
           }
           return 'No one here';
         }
      }
    ```
    
*   该服务将负责数据存储和检索，其由 `UserController` 使用，我们用 `@Injectable()` 来装饰这个类
    
    ```
    / * user.controller.ts  */ 创建一个 user 控制器文件
    import { Controller, Get, Query } from '@nestjs/common';
    import { UserService } from './user.service';
    
    @Controller('user')
    export class UserController {
       constructor(private readonly userService: UserService) {}
       @Get('findOne') //这里暴露出的路由为 user/find
       findUser(@Query() query: any) {
         return this.userService.findUser(query.sid);
       }
    ```
    
*   控制器的目的是接收应用的特定请求。**路由**机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。
    
*   为了创建一个基本的控制器，我们使用类和`装饰器`。装饰器将类与所需的元数据相关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。
    
    ```
    / * user.module.ts  */ 创建一个 user mod
     import { Module } from '@nestjs/common';
     import { UserController } from './user.controller';
     import { UserService } from './user.service';
     @Module({
         controllers: [UserController],
         providers: [UserService],
       })
       export class UserModule {}
    
    /*  app.module.ts  */ 最后在app.module中引入我们自己写的module
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { UserModule } from './user/user.module';
    
    @Module({
         imports: [UserModule],
         controllers: [AppController],
         providers: [AppService],
       })
       export class AppModule {}
    ```
    
*   控制器已经准备就绪，可以使用，但是 Nest 依然不知道 `UserController` 是否存在，所以它不会创建这个类的一个实例。
    
*   控制器总是属于模块，这就是为什么我们在 `@Module()` 装饰器中包含 `controllers` 数组的原因。 由于除了根模块 `AppModule`之外，我们还没有定义其他模块，所以我们将使用它来介绍 `UserController`
    
    ##### 使用 postman 看下效果
    
*   ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db688fa7a89346f0b7bcb1ef072fae19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
    *   可以看到发送 get 请求 请求成攻。
    *   接下来我们依次使用 `post put delete` 发送请求, 看 nest 是如何接受并处理的

### Post

*   user.service 文件
    
    ```
    / * user.service.ts  */ 先创建一个 user service服务文件
    import { Injectable } from '@nestjs/common';
       @Injectable() // 
       // 这里
      setUser(sid: string, body: any): any {
           if (sid === '123456') {
             return {
               msg: '设置成功',
               body,
             };
         }
      }
    ```
    
*   user.controller 文件
    
    ```
    / * user.controller.ts  */ 创建一个 user 控制器文件
    import { Controller, Get, Query } from '@nestjs/common';
    import { UserService } from './user.service';
    
    @Controller('user')
    export class UserService {
        @Post('set')
        setUser(@Body() body: any, @Query() query: any) {
          return this.userService.setUser(query.sid, body);
        } 
    }
    ```
    

##### 使用 postman 看下效果

*   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/111b187c79074328a917e64ef8ec55d5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    *   可以看到发送 post 请求 请求成攻。

### Put

*   user.service 文件
    
    ```
    / * user.service.ts  */ 先创建一个 user service服务文件
    import { Injectable } from '@nestjs/common';
       @Injectable() // 
       // 这里
      updateUser(sid: string, body: any): any {
           if (sid === '123456') {
             return {
               msg: '设置成功',
               body,
             };
         }
      }
    ```
    
*   user.controller 文件
    
*   这里用到了 Param 装饰器 `@Param()` 用于修饰一个方法的参数（上面示例中的 `params`），并在该方法内将**路由参数**作为被修饰的方法参数的属性。如上面的代码所示，我们可以通过引用 `params.id`来访问（路由路径中的） `id` 参数。 您还可以将特定的参数标记传递给装饰器，然后在方法主体中按参数名称直接引用路由参数。
    
    ```
    / * user.controller.ts  */ 创建一个 user 控制器文件
    import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
    import { UserService } from './user.service';
    
    @Controller('user')
    export class UserService {
       @Put(':sid')
       updateUser(@Param('sid') sid: string, @Body() body: any) {
         return this.userService.updateUser(sid, body);
       }
    }
    ```
    

##### 使用 postman 看下效果

*   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e75e01526efa4cea94095d2ea8a194db~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
    *   可以看到发送 put 请求 请求成攻。

### Delete

*   user.service 文件
    
    ```
    / * user.service.ts  */ 先创建一个 user service服务文件
    import { Injectable } from '@nestjs/common';
       @Injectable() // 
       // 这里
     deleteUser(sid: string): any {
           if (sid === '123456') {
             return {
               msg: '删除成功',
             };
         }
      }
    ```
    
*   user.controller 文件
    
    ```
    / * user.controller.ts  */ 创建一个 user 控制器文件
    import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
    import { UserService } from './user.service';
    
    @Controller('user')
    export class UserService {
       @Delete(':sid')
       deleteUser(@Param('sid') sid: string) {
         return this.userService.deleteUser(sid);
       }
    }
    ```
    

##### 使用 postman 看下效果

*   ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ffd30ece6224db999f2455c09a5f466~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
    
    *   可以看到发送 delete 请求 请求成攻。
        

总结
--

*   至此我们用 Nest 的装饰器模拟了基础的接口请求增删改查，认识到 Nest 中的三种基本应用程序构建块 `Module Controller Service`
*   服务和控制的划分明确，带来更好的代码体验。`TypeScrip` 的个人使用还有待提高，以后还要继续学习 hhh

参考文献
----

*   [Nest](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.cn%2F8%2Ffundamentals "https://docs.nestjs.cn/8/fundamentals")
    
*   [koa.js,egg.js,express.js 三者区别](https://juejin.cn/post/6998355750917505061 "https://juejin.cn/post/6998355750917505061")