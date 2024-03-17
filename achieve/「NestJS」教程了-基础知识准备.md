> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7078847428455530526?searchId=20230901115242BA94AF700DEF9495FDC5)


理论知识
====
 Nest 是一个用于构建高效，可扩展的 [Node.js](https://link.juejin.cn?target=http%3A%2F%2Fnodejs.cn%2F "http://nodejs.cn/") 服务器端应用程序的框架。 它是一个功能比较全面的 Nodejs 后端框架，底层支持 Express 和 Fastify。

⚠️在 NestJS 中 OOP 的思想很多
起步
--

```
# 没有废话，直接上代码
$ npm i -g @nestjs/cli 
$ nest new project-name
```

我们启动文档在哪儿呢？它在main.js

```
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);  
  // 一般来说我们选择 NestExpress ，因为网上对这方面的资源多，出bug好找解决方案，而且官方文档有很多例子都是 Express来说的
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
}
bootstrap();
```



## Controller理论知识

*   被 @Controller 装饰的类 就是 一个 Controller ，
* 在 module 中把它倒入到对应的 controller 中就能够使用它
* 其功能是 **处理传入的请求和向客户端返回响应**。

## Controller代码

```
// app.controller.ts
// @Controller(‘hello’) 当你访问3000/hello的时候你就能 导航 到这个controoler来了
@Controller()
export class AppController {
}

```

## module 配置 controller 
```
//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],  
  // 这个就是把 controller放在这个里面就好了 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
  providers: [AppService],  // 这个我们暂且不管
})
export class AppModule {}
```

## 在 controller 里面定义路径

```
// app.controller.ts
// 我们可以使用 @Get @Put @Post @Delete 来定义 
// 如果你给他传递了参数就是它的路径 
// 结合前面的代码，当我们使用get访问 3000/hello/nihao的时候就能得到 “你好” string的返回
@Controller(‘hello’)
...
  @Get(‘/nihao’)
  getHello(): string {
    return “你好”;
  }
```

## 在 controller 里面获取参数

  如果你调用了Req 和Res那么这个时候你就需要手动的res.sed()了，不推荐 
  如果你直接 这样做将会导致 失去与依赖于 Nest 标准响应处理的 Nest 功能（例如，拦截器（Interceptors） 和 @HttpCode()/@Header() 装饰器）的兼容性
  // 要解决此问题，可以将 passthrough 选项设置为 true 比如下面的函数 “/getReq2” 这样就能兼容，你只定义了code 其它的定义依然交由Nest处理 比如下面👇 的列子
  
```
// 1. 如何获取req 和res 对象，并且手动的设置值 cookie什么之类的
@Get("/getReq")
getReq( @Req() request: Request, @Res() response: Response ): any {
  console.log(request.headers);
  // HttpStatus.OK是一个枚举值
  response.status(HttpStatus.OK).send();
}

@Get("/getReq2")
getReq2( @Req() request: Request, @Res({  passthrough: true }) response:Response ): any {
  response.status(HttpStatus.OK);
  return []
}
```


## 在 controller 里面获取get的query参数和parma参数
```
@Get("getQueryAndParam/:id?")
getQuery( @Param("id") params: string  ,@Query() query: { value:number,qx:number }) :any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log("params",params)
    console.log("query",query)
  return "2222"
}
```


## 在 controller 里面获取POST PUT 等请求的Body参数
```
@Post("postQuery/:id?")
postQuery( @Param("id") params: string  ,@Body() body: { value:number,qx:number }) :any {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log("params",params)
    console.log("body",body)
  return "PostQuery"
}
```

## 在 controller 里面自定义状态吗，
其实非常的简单 使用装饰器注入就好了@HttpCode 另外同类型的还有 @Redirect 
```
@Get("userState")
@HttpCode(204)
@Header('Cache-Control', 'none')
userState( ) :any {
  return "userState"
}
```


## 在 controller 里面重定向
```
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```


提供者 Providers
-------------
在 Nest 中随处可见的都是 Providers ，比如拦截器啊，配置模块啊，中间间
Provider 只是一个用 `@Injectable()` 装饰器注释的类。
在 Nestjs 凡被 @Injectable 装饰的类 都是 Providers ，他们都可以通过 `constructor` **注入**依赖关系。
这意味着对象可以彼此创建各种关系，并且 “连接” 对象实例的功能在很大程度上可以委托给 `Nest`运行时系统。 

###  Providers 使用

```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```
和controller 类似，你需要在module入口加入到指定的对象中去
```

@Module({
  imports: [],
  controllers: [AppController],  
  providers: [AppService],    // 声明provider
})
export class AppModule {}
```

模块 Module
---------
模块是具有 `@Module()` 装饰器的类。
`@Module()` 装饰器提供了元数据，Nest 用它来组织应用程序结构。

###  Module 如何使用

凡 被 `@module()`装饰的就是一个 Module 它可以接受下面的参数

```
@Global()如果你需要把这个模块 暴露到全局使用可以加 一个装饰器 @Global
@Module({ 
    controllers:[], // 前面说过
    imports:[], // 可以注入 其他module 或者provider
    exports:[], // 如果你这个模块中的provider 要在别的模块中使用 你必须要在这里声明 导出这鞋provider ，
    providers:[]  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
})
```


