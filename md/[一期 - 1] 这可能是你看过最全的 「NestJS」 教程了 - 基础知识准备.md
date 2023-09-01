> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7078847428455530526?searchId=20230901115242BA94AF700DEF9495FDC5)

本文概要和目录
=======

> 接上节代码，我们已经构建了 gitlab CI 现在我们开始唠嗑唠嗑，偏向后端的知识 ，本章内容主要是向大家介绍 Nestjs（一个类似于 Spring、 Angular 的 Nodejs 框架）的基础使用。为什么要去发这篇 这篇文章呢，主要是 NestJS 官方文档有点很多东西说的不是很明白，例子也比较少且不完整，于是我打算弄来个比较全面的解读，构建一个比较完整的后端应用，汰！开始

```
重要提醒！：请不要照着文章照抄，建议你先阅读通篇，了解全貌之后再去实践。
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31014e8653814e6f9b924eed12b467df~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

理论知识
====

起步
--

> 这个主要是介绍了如何安装 NestJS 的 CLI 以及使用 NestJSCLI 构建一个最基础的 NestJS 应用。对于这个 NestJS 框架来说 ，正如官方所言： Nest 是一个用于构建高效，可扩展的 [Node.js](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2F "http://nodejs.cn/") 服务器端应用程序的框架。 它是一个功能比较全面的 Nodejs 后端框架，底层支持 Express 和 Fastify。

⚠️在 NestJS 中 OOP 的思想很多，你需要好好的理解和学习他们

```
# 没有废话，直接上代码
$ npm i -g @nestjs/cli 
$ nest new project-name
```

```
我们启动文档在哪儿呢？它在main.js
```

```
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);  
  // 一般来说我们选择 NestExpress ，别问为什么 因为网上对这方面的资源多，出bug好找解决方案，而且官方文档有很多例子都是 Express来说的
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
}
bootstrap();
```

控制器 Controller
--------------

> 如果你对 Spring 有一定的了解，这个东西实际上和它非常的类型，其功能是 **处理传入的请求和向客户端返回响应**。

### 理论知识

*   什么样的东西能叫 Controller？如何使用 ？ 被 @Controller 装饰的类 就是 一个 Controller ，在 module 中把它倒入到对应的 controller 中就能够使用它里，至于 module 是什么如何用我们下面详细展开说

```
// app.controller.ts
// @Controller(‘hello’) 当你访问3000/hello的时候你就能 导航 到这个controoler来了
@Controller()
export class AppController {
}

//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],  // 这个就是哈 把 controller放在这个里面就好了 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
  providers: [AppService],  // 这个我们暂且不管
})
export class AppModule {}
```

*   如何获取 HTTP 过来的请求和返回去的 Respose？

```
// 我们可以使用 @Get @Put @Post @Delete 来定义 请求类型。如果你给他传递了参数那么这个参数就是它的路径 如下
// 结合前面的代码，当我们使用get访问 3000/hello/nihao的时候就能得到 “你好” string的返回
  @Get(‘/nihao’)
  getHello(): string {
    return “你好”;
  }
  
// 上面是如何定义路径，如何定义请求方式，接下来我们看看请求参数的获取
// 1. 如何获取req 和res 对象，并且手动的设置值 cookie什么之类的
@Get("/getReq")
getReq( @Req() request: Request, @Res() response: Response ): any {
  console.log(request.headers);
  // 通过获取到ts的类型 我想你应该是理解这个对象的意义的 如果你调用了Req 和Res那么这个时候你就需要手动的res,sed()了，不推荐 如果你直接
  // 这样做将会导致 失去与依赖于 Nest 标准响应处理的 Nest 功能（例如，拦截器（Interceptors） 和 @HttpCode()/@Header() 装饰器）的兼容性
  // 要解决此问题，可以将 passthrough 选项设置为 true 比如下面的函数 “/getReq2” 这样就能兼容，你只定义了code 其它的定义依然交由Nest处理 比如下面👇 的列子
  // HttpStatus.OK是一个枚举值
  response.status(HttpStatus.OK).send();
}


@Get("/getReq2")
getReq2( @Req() request: Request, @Res({  passthrough: true }) response:Response ): any {
  response.status(HttpStatus.OK);
  return []
}



// 2. 如何获取get的query参数和parma参数
@Get("getQueryAndParam/:id?")
getQuery( @Param("id") params: string  ,@Query() query: { value:number,qx:number }) :any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log("params",params)
    console.log("query",query)
  return "2222"
}

// 3. 如何获取POST PUT 等请求的Body参数
@Post("postQuery/:id?")
postQuery( @Param("id") params: string  ,@Body() body: { value:number,qx:number }) :any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log("params",params)
    console.log("body",body)
  return "PostQuery"
}


// 4.如何自定义状态吗，其实非常的简单 使用装饰器注入就好了@HttpCode 另外同类型的还有 @Redirect 
@Get("userState")
@HttpCode(204)
@Header('Cache-Control', 'none')
userState( ) :any {
  return "userState"
}

// 4. 通过装饰器 重定向也非常容易实现
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

### 完整代码一览

```
import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import  { Request,Response, } from 'express'
// @Controller()
@Controller("cats")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

@Get("/send")
  sendMessage():string {
    return "222"
  }

@Get("/getReq")
getReq( @Req() request: Request, @Res() response: Response ): any {
  console.log(request.headers);
  response.status(HttpStatus.OK).send();
}

@Get("/getReq2")
getReq2( @Req() request: Request, @Res({  passthrough: true }) response:Response ): any {
  response.status(HttpStatus.OK);
  return []
}

@Get("getQueryAndParam/:id?")
getQuery( @Param("id") params: string  ,@Query() query: { value:number,qx:number }) :any {
    console.log("params",params)
    console.log("query",query)
  return "2222"
}

@Post("postQuery/:id?")
postQuery( @Param("id") params: string  ,@Body() body: { value:number,qx:number }) :any {
    console.log("params",params)
    console.log("body",body)
  return "PostQuery"
}

@Get("userState")
@HttpCode(204)
@Header('Cache-Control', 'none')
userState( ) :any {
  return "userState"
}


@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
}
```

提供者 Providers
-------------

> 在 Nest 中随处可见的都是 Providers ，比如接下来的拦截器啊，各种配置模块啊，各种中间间啊全都是统统都是 Providers

### 什么样的东西能被称为 Providers ？ Providers 如何使用？

在 Nestjs 凡被 @Injectable 装饰的类 都是 Providers ，他们都可以通过 `constructor` **注入**依赖关系。 这意味着对象可以彼此创建各种关系，并且 “连接” 对象实例的功能在很大程度上可以委托给 `Nest`运行时系统。 Provider 只是一个用 `@Injectable()` 装饰器注释的类。

```
// 比如下面就是一个 Provider 它被用作 service 角色 （什么叫做Service角色？建议可以去了解了解spring，不了解也无所谓了，Nestjs下有一个入口，在之后就是各个功能模块 module 在模块下 有三个基础角色 controller 和 module入口文档 ，以及service文档）

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// 它的使用也和前面 的controller 类似，你需要在module入口加入到指定的对象中去
@Module({
  imports: [],
  controllers: [AppController],  
  providers: [AppService],    // 声明provider
})
export class AppModule {}
```

### 高级操作 基于 Nestjs 内置 IOC 容器，实现的 Provider 的说明 ，我们挑几个重要的来说

在 Nestjs 下对于 Provider 还有许多高级的用法，建议去看看文档 这里不详细说明 。 最常见的是一种 基于 nest 内部的一个控制反转（`"IoC"`）容器，可以提供更加强大的功能，我们来看看它 我们看看下面的说明，我们回顾上面的代码

1.  在 `app.service.ts` 中 `@Injectable()` 装饰器声明 `CatsService` 类是一个可以由`Nest IoC`容器管理的类。
2.  在 `app.controller.ts` 中 `AppController` 声明了一个依赖于 `AppService` 令牌 (`token`) 的构造函数注入:

```
constructor(private readonly catsService: CatsService)
```

3.  在 `app.module.ts` 中，我们将标记 `CatsService`与 `cats.service.ts`文档中的 `CatsService` 类相关联。 我们将在下面确切地看到这种关联（也称为注册）的发生方式。

当 `Nest IoC` 容器实例化 `CatsController` 时，它首先查找所有依赖项 *。 当找到 `AppService` 依赖项时，它将对 `AppService`令牌 (`token`) 执行查找，并根据上述步骤（上面的＃3）返回 `AppService` 类。 假定单例范围（默认行为），`Nest` 然后将创建 `AppService` 实例，将其缓存并返回，或者如果已经缓存，则返回现有实例。

在 Module 中 Provider 有更完整的写法

**useClass**

```
providers: [ 
 { provide: AppService, 
   useClass: AppService,
 }, ];
// 在这里，我们明确地将令牌 `AppService`与类 `AppService` 关联起来。简写表示法只是为了简化最常见的用例，其中令牌用于请求同名类的实例。

// 当provider不为class的时候 比如一个string 这种就叫做 非类提供者，譬如下面的例子
@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_SERVICE',
      useValue: AppService,
      // useFactory  // 详见下文 这个非常常用
      // useExisting // 这里不展开讲了用到在说
    },
  ],
})

// 使用 Inject 也是常用的，在Angular中也常用 😂 Nestjs官方自己都说是借鉴了Angular的🐶 
@Controller()
export class AppController {
  private readonly appService;
  constructor(@Inject('APP_SERVICE') appService: AppService) {
    this.appService = appService;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

**useVaue**

```
// 其实上面的写法也不是最完整的写法，它还提供了许多额外的参数允许你去自定义它，譬如
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Injectable()
class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// const mockCatsService = new AppService();
const mockCatsService = { // new它或者你自己想办法能够实现这个类结构 也是ok的
  getHello: () => {
    return '666';
  },
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useValue: mockCatsService,
      // useFactory  // 详见下文 这个非常常用
      // useExisting // 这里不展开讲了用到在说
    },
  ],
})
```

**useFactory**

这个非常非常的重要‼️ 接下来很多功能的完成都需要依赖它，`useFactory` 语法允许动态创建提供程序。实工厂函数的返回实际的 `provider` 。工厂功能可以根据需要简单或复杂。一个简单的工厂可能不依赖于任何其他的提供者。更复杂的工厂可以自己注入它需要的其他提供者来计算结果。对于后一种情况，工厂提供程序语法有一对相关的机制:

1.  工厂函数可以接受 (可选) 参数。
2.  `inject` 属性接受一个提供者数组，在实例化过程中，`Nest` 将解析该数组并将其作为参数传递给工厂函数。这两个列表应该是相关的: `Nest` 将从 `inject` 列表中以相同的顺序将实例作为参数传递给工厂函数。

```
@Module({ 
    providers: [
     {
        provide: 'CONNECTION',
       // useFactory: (optionsProvider: OptionsProvider) => {
       //     const options = optionsProvider.get(); 
       //     return new DatabaseConnection(options); 
       // },
        // 它甚至可以说异步的
         useFactory: async () => {
          const connection = await createConnection(options);
          return connection;
        },
        inject:[/*其他的提供者*/]
     }
    ],
})

// 使用的时候和非类 Privider 保持一致 
@Controller()
export class AppController {
  private readonly appService;
  constructor(@Inject('CONNECTION') appService: AppService) {
    this.appService = appService;
  }

  @Get()
  getHello(): string {
   /*
   this.appService.xxxxx
   */
  }
}
```

模块 Module
---------

> Module 是 Nestjs 中 大的一个内容，它是整个 module 功能模块的收口 ，功能和特性和 Angular 保持一致。模块是具有 `@Module()` 装饰器的类。 `@Module()` 装饰器提供了元数据，Nest 用它来组织应用程序结构。

### 什么是 Module 它如何使用

凡 被 `@module()`装饰的就是一个 Module 它可以接受下面的参数

```
// 如果你需要把这个模块 暴露到全局使用可以加 一个装饰器 @Global
// 使一切全局化并不是一个好的解决方案。 全局模块可用于减少必要模板文档的数量。 `imports` 数组仍然是使模块 API 透明的最佳方式。

@Global()
@Module({ 
    controllers:[], // 前面说过
    imports:[], // 可以注入 其他module 或者provider
    exports:[], // 如果你这个模块中的provider 要在别的模块中使用 你必须要在这里声明 导出这鞋provider ，当然 你也可以把 这个module导出其他地方import 一下这样其他模块中的provider 也是可以使用的
    providers:[]  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
})
```

### **动态模块** 重要

动态模块在 Nest 中 也是非常常见的！我们来看下面的一个例子

```
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
  // 这里就能获取到你的参数，然后在这里进行一个 provicer ，最后把这依据参数生产的provider参数返回给你，在netsj-typeorm 中 到处都是这样的操作 
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// 实际上 它的使用非常的简单只需要

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

实战
==

> 这里我们来做一个 非常简单的 Serivce 它主要的功能就是实现一个 Blog 它将会实现下面这些功能

*   [基础的 Article Tag Use 的 CRUD]
*   [统一 config 管理]
*   [日志搜集]
*   [异常处理]
*   [请求参数验证 Dto]
*   [JWT]
*   [统一返回体]
*   [上传文档包括上传到本地和上传的 OSS 服务商]
*   [请求转发]
*   [job]
*   [用 redis 做单点登录]
*   [微服务]
*   [如果部署和运维（优雅重启）]

路由设计
----

> 我们将会有下面的的路由

### 路由总览

1.  Article 相关

*   get /artcels 获取所有文章
*   get /artcels:id 获取指定 id 的文章 -post /artcels 创建文章 -put /artcels:id 修改文章 -delete /artcels:id 删除文章

2.  Tag 相关

*   get /tags 获取所有 标签 -post /tag 创建标签 -put /tag:id 修改标签 -delete /tag:id 删除标签

3.  User 相关

*   get /users 获取所有用户
*   get /user:id 获取指定 id 用户的用户信息 -post /user 创建用户（注册） -put /user:id 修改用户 信息 -delete /user:id 删除用户

### 路由实现

```
首先我们设计了下面的一些模块
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/753be07a3e08457e81c521b9fa7032b3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
每一个模块 都具备 “MCM”三件套
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a62c1b612694d78b545d128dc007d90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 详细代码实现

```
我们拿其中的一个，tag做例子，来讲一下Controller的构建，在这里我们可以先忽略其他的数据比如Dto 参数 注入的Sercice什么的，我们只关注路由定义和参数获取就好了
```

```
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { Request, Response } from 'express';
import { InterParams } from 'src/typings/controller';
import { Tag } from 'src/entities/tag.entity';
import { AuthGuard } from '@nestjs/passport';
import { HttpReqTransformInterceptor } from 'src/filter/http-req.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tag相关')
@ApiBearerAuth()
@Controller('tag')
@UseInterceptors(new HttpReqTransformInterceptor<any>()) // 统一返回体
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/tags')
  async getAll() {
    const value = await this.tagService.getAll();
    return value;
  }

  @UseGuards(AuthGuard('local'))
  @Post()
  async createTag(@Body() tagInfo: Tag) {
    const value = await this.tagService.create(tagInfo);
    return value;
  }

  @Put('/:id')
  async updateTag(@Param() params: InterParams, @Body() tagInfo: Tag) {
    const value = await this.tagService.updateById(params.id, tagInfo);
    return value;
  }

  @Delete('/:id')
  async deleteTag(@Param() params: InterParams) {
    const value = this.tagService.deleteById(params.id);
    return value;
  }
}
```

数据库设计
-----

> 我们将会有下面的 数据库设计

article 表

<table><thead><tr><th>name</th><th>typ</th><th>Description</th></tr></thead><tbody><tr><td>rticle</td><td>id</td><td>int</td><td>主键</td></tr><tr><td>title</td><td>varchar(100)</td><td>标题</td></tr><tr><td>create_time</td><td>init</td><td>创建时（时间戳）</td></tr><tr><td>update_time</td><td>init</td><td>修改时间</td></tr><tr><td>create_by</td><td>userId</td><td>被谁创建</td></tr><tr><td>content</td><td>varchar(255)</td><td>文章内容</td></tr><tr><td>desc</td><td>varchar(100)</td><td>摘要</td></tr><tr><td>cover_image_url</td><td>varchar(100)</td><td>封面</td></tr><tr><td>state</td><td>tinyinit</td><td>状态 0 1 （0 隐藏 1 开启）</td></tr><tr><td>tags</td><td>tagId</td><td>被关联的 tag 外健</td></tr></tbody></table>

tag 表

<table><thead><tr><th>name</th><th>typ</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td>int</td><td>主键</td></tr><tr><td>name</td><td>varchar(100)</td><td>名称</td></tr><tr><td>create_time</td><td>init</td><td>创建时（时间戳）</td></tr><tr><td>update_time</td><td>init</td><td>修改时间</td></tr><tr><td>state</td><td>tinyinit</td><td>状态 0 1 （0 隐藏 1 开启）</td></tr><tr><td>create_by</td><td>userId</td><td>被谁创建</td></tr></tbody></table>

user 表

<table><thead><tr><th>name</th><th>typ</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td>int</td><td>主键</td></tr><tr><td>username</td><td>varchar(100)</td><td>用户名</td></tr><tr><td>password</td><td>varchar(255)</td><td>密码</td></tr><tr><td>create_time</td><td>init</td><td>创建时（时间戳）</td></tr><tr><td>update_time</td><td>init</td><td>修改时间</td></tr><tr><td>state</td><td>tinyinit</td><td>状态 0 1 （0 隐藏 1 开启）</td></tr><tr><td>email</td><td>varchar(100</td><td>邮箱地址</td></tr></tbody></table>

讲道理，到这里一步之后，我们应该使用 sql 进行数据库准备了，但是我们这里先不怎么干，因为在使用 typeorm 的情况下，当你定义 Entity 实体的时候，如果有多 表关联 外键什么的它会自动为你生产一下唯一的 key 。但是如果你们公司数据库要求严格把控，那么这个操作估计就不行了，不晓得有没有大佬来指导一下😂 ，要不就换不用 typeorm

Nodejs 上的 ORM 工具 TypeORM
------------------------

> 对于我们这个项目来说，最重要的就是 TypeOrm 了，

### 我们来看看理论知识

我们这里 放了一个 type-orm 的官方文档，我们的重点是 表之间的关联关系

[typeorm 官方文档](https://link.juejin.cn?target=https%3A%2F%2Ftypeorm.bootcss.com%2F%23%25E5%2588%259B%25E5%25BB%25BA%25E4%25B8%2580%25E5%25AF%25B9%25E4%25B8%2580%25E7%259A%2584%25E5%2585%25B3%25E7%25B3%25BB "https://typeorm.bootcss.com/#%E5%88%9B%E5%BB%BA%E4%B8%80%E5%AF%B9%E4%B8%80%E7%9A%84%E5%85%B3%E7%B3%BB")

通过文档，我们可以得出的下面这些关于多表关联的结论

1.  对于一对一关联必须有一个主从关系，关系可以是单向的或双向的。但是只有一方是拥有者。保存的时候你得把那个 Entity 拿到然后. xxx 字段 关联到另一个 Entity 才可以完成保存
    
2.  对于一对多 / 多对一关联必须有一个主从关系，关系拥有方总是多对一的，而另一方就是 一对多了 ，保持的时候和前面说的类似 也要把 Entity 拿进来保存再保存上
    
3.  关于多对多关系，TypeOrm 会为你创建一张中间表，同样的它可以上需要一个关系的所有方
    

通过上述文档和 说明我们构建了下面的 Entity

*   TagEntity

```
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  update_time: number;

  @Column()
  create_time: number;

  @Column()
  state: number;

  // 这里需要多学习一些 sql数据库的知识，=> 一个tag只能由一个User创建，一个User可以拥有多个Tag
  //注意如果你的关系是一对一的，那么一般来说是由一个主表关联这些东西，采用官方为建议，添加返向关系
  // 对于tag来说 它和user 是 多对一的关系（Tag是一个抽象，） 一般来说 这边是ManyToOne
  @ManyToOne((type) => User, (user) => user.tags)
  create_by: User;

  @ManyToMany((type) => Article, (article) => article.tags)
  article: Article[];
}
```

*   UseEntity

```
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { Tag } from './tag.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  update_time: number;

  @Column()
  create_time: number;

  @Column()
  email: string;

  @Column()
  state: number;

  //  user => tag = 一对多关系
  @OneToMany(() => Tag, (tag) => tag.create_by)
  tags: Tag[];

  //  user => tag = 一对多关系
  @OneToMany(() => Article, (article) => article.create_by)
  articles: Article[];
}
```

*   ArtiveEntity

```
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Tag } from './tag.entity';
import { User } from './user.entity';

// typeorm 关于外键的修改并不会让你 把值能够附上 而且manyToMany 需要
// 多维护一张表 save操作也不一样 如何修改和查询关联表需要参考 typeoorm
@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @Column('int')
  create_time: number;

  @Column('int')
  update_time: number;

  @Column('varchar')
  content: string;

  @Column('varchar')
  desc: string;

  @Column('varchar')
  cover_image_url: string;

  @Column('int')
  state: number;

  @ManyToOne((type) => User, (user) => user.tags)
  create_by: User;

  @ManyToMany(() => Tag, (tag) => tag.id)
  // @JoinTable需要指定这是关系的所有者方。
  @JoinTable()
  tags: Tag[];
}
```

### 我们看看 Nestjs 如何链接上数据库 具体的 Service 操作

**创建连接**

首先我们在 AppModule 中把链接 TypeOrmModule 注入，TypeOrmModule 来源于 @nestjs/typeorm 你需要安装它

```
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 192.168.1.1,
      port: 3306,
      username: root,
      password: root,
      database: /*youer DatabeseName*/,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文档  可以看看我的目录结构，当然你可以自己构建自己的 目录结构
      synchronize: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/751dee84146d4948bb54e025f98712df~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**进行操作**

注意，在进行操作之前你需要将实体 导入到这个 module 中，以便你这个 module 中的其它 provider 使用

```
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, User])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
```

```
@Injectable()
export class TagService {
  constructor(
  // InjectRepository 这个是不是和我们前面说的 “非类注入器”非常相识 它的底层实现其实就说Inject 
  // 并且注入了指定的参数，对此感兴趣的同学可以去阅读它的源码，我相信你在前面学习了Provider相关知识之后，阅读源码应该不困难
  
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAll() {
    return this.tagRepository.find({ relations: ['create_by'] });
  }

  async create(tag: Tag) {
    // 依据typeorm 的文档 如果需要保存关系需要使用 ，这样方式来做
    const user = await this.userRepository.findOne(tag.create_by);
    tag.create_by = user;
    return this.tagRepository.save(tag);
  }

  updateById(id, tag: Tag) {
    return this.tagRepository.update(id, tag);
  }

  deleteById(id) {
    return this.tagRepository.delete(id);
  }
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4c150e0abc048f4b0cd8727b0f6a992~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

总结
--

好了以上就说我们的所有的内容了，这一篇文章，我们介绍了 NestJS 的基础使用，并且完成了一个最简单的 CRUD，其他的 Articele 和 user 模块 也是如此。讲解了 Nestjs 中内核重点 Provider ，下篇文章，我们将要深入，把其他的模块完成_前方预警这也许会更加复杂请你做好准备可以提前阅读阅读官方文档_，希望你好好消化它们。我是 “无双”，原创不易，求各位大爷点赞👍

参考
==

[NestJS 官方文档](https://link.juejin.cn?target=https%3A%2F%2Ftypeorm.bootcss.com%2F%23%25E5%2588%259B%25E5%25BB%25BA%25E5%25A4%259A%25E5%25AF%25B9%25E5%25A4%259A%25E5%2585%25B3%25E7%25B3%25BB "https://typeorm.bootcss.com/#%E5%88%9B%E5%BB%BA%E5%A4%9A%E5%AF%B9%E5%A4%9A%E5%85%B3%E7%B3%BB")

[TypeOrm 官方文档](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.cn%2F8%2Fintroduction "https://docs.nestjs.cn/8/introduction")

[本项目 Github 地址](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FBM-laoli%2Fnestjs-http-server-template "https://github.com/BM-laoli/nestjs-http-server-template")