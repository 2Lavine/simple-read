> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7032079740982788132?searchId=20230901115242BA94AF700DEF9495FDC5)

初识 Nest.js
---------- 
Nest 在这些常见的 Node.js 框架 (Express/Fastify) 之上提高了一个抽象级别，但仍然向开发者直接暴露了底层框架的 API。这使得开发者可以自由地使用适用于底层平台的无数的第三方模块。

`AngularJS`、`Spring`和`Nest.js`都是基于`控制反转`原则设计的, 而且都使用了依赖注入的方式来解决解耦问题。


### 第一个接口

首先就是找到入口文件`main.ts`

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

说明`Nest.js`创建项目默认就给写了一个接口例子、
使用`Nest.js`的工厂函数`NestFactory`来创建了一个`AppModule`实例，启动了 HTTP 侦听器，以侦听`main.ts` 中所定义的端口。


---
查看`AppModule`, 打开`src/app.module.ts`:

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`AppModule`是应用程序的根模块，根模块提供了用来启动应用的引导机制，可以包含很多功能模块。mudule文件需要使用一个`@Module()` 装饰器的类，


---
`@Module()` 装饰器接收四个属性：`providers`、`controllers`、`imports`、`exports`。
*   providers：`Nest.js`注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享；
*   controllers：处理 http 请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给 providers 处理；
*   imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入；
*   exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出；

---
在`app.module.ts`中，看到它引入了`app.controller.ts`和`app.service.ts`，分别看一下这两个文件：

使用`@Controller`装饰器来定义控制器, `@Get`是请求方法的装饰器，对`getHello`方法进行修饰， 表示这个方法会被 GET 请求调用。
```
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```


我们可以看出使用`@Injectable`修饰后的 `AppService`, 在`AppModule`中注册之后，在`app.controller.ts`中使用，我们就不需要使用`new AppService()`去实例化，直接引入过来就可以用。
```
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService { 
  getHello(): string {
    return 'Hello World!';
  }
}
```


路由装饰器
-----

`Nest.js`中没有单独配置路由的地方，而是使用装饰器。`Nest.js`中定义了若干的装饰器用于处理路由。

### @Controller
如每一个要成为控制器的类，都需要借助`@Controller`装饰器的装饰，
该装饰器可以传入一个路径参数，作为访问这个控制器的主路径：
对`app.controller.ts`文件进行修改

```
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

此时可以通过`http://localhost:9080/app`来访问。
### HTTP 方法处理装饰器

`@Get`、`@Post`、`@Put`等众多用于 HTTP 方法处理装饰器，经过它们装饰的方法，可以对相应的 HTTP 请求进行响应。
它们可以接受一个字符串或一个字符串数组作为参数，这里的**字符串**可以是固定的路径，也可以是通配符。

继续修改`app.controller.ts`，看下面的例子：

```
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 2.通配符路径(?+* 三种通配符 )
  // 可以匹配到 get请求, http://localhost:9080/app/user_xxx
  @Get("user_*")
  getUser(){return "getUser"}
  
  // 3.带参数路径
  // 可以匹配到put请求，http://localhost:9080/app/list/xxxx
  @Put("list/:id")
  update(){ return "update"}
}
```


---
由于修改了文件， 需要重启才能看到路由， 每次都重启简直就是噩梦，本来打算配置一个实时监听文件变化，发现`Nest.js`非常贴心的配置好了， 我们只要运行命令即可：

```
npm run start:dev
```

这样再修改什么内容， 保存后都会自动重启服务了。


---
关于路由匹配时的注意点， 当我们有一个 put 请求，路径为`/app/list/user`, 此时，我们在`app.controller.ts`控制器文件中增加一个方法：

```
@Put("list/user")
 updateUser(){
      return {userId:1}
  }
```

你觉得这个路由会被匹配到吗？我们测试一下：
发现`/app/list/user`匹配到的并不是`updateUser`方法， 而是`update`方法。这就是我要说的注意点。

> 如果因为在匹配过程中， 发现`@Put("list/:id")`已经满足了, 就不会继续往下匹配了，所以 `@Put("list/user")`装饰的方法应该写在它之前。

### 全局路由前缀

除了上面这些装饰器可以设置路由外， 我们还可以设置全局路由前缀， 比如给所以路由都加上`/api`前缀。此时需要修改`main.ts`

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(9080);
}
bootstrap();
```

此时之前的路由，都要变更为：

```
http://localhost/api/xxxx
```


nest-cli 命令
----
写代码之前首先介绍几个`nest-cli`提供的几个有用的命令：

```
//语法
nest g [文件类型] [文件名] [文件目录]
```

**注意创建顺序**： 先创建`Module`, 再创建`Controller`和`Service`, 这样创建出来的文件在`Module`中自动注册，反之，后创建 Module, `Controller`和`Service`, 会被注册到外层的`app.module.ts`
### nest-cli 创建模块

nest g mo posts 
创建一个 posts 模块，文件目录不写，默认创建和文件名一样的`posts`目录，在`posts`目录下创建一个`posts.module.ts`

```
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class PostsModule {}
```

执行完命令后，我们还可以发现同时
- 在根模块`app.module.ts`中引入`PostsModule`这个模块
- 也在`@Model`装饰器的`inports`中引入了`PostsModule`

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PostsModule],
})
export class AppModule {}
```

### nest-cli 创建控制器

> nest g co posts

此时创建了一个 posts 控制器，命名为`posts.controller.ts`以及一个该控制器的单元测试文件.

```
// src/posts/posts.controller.ts
import { Controller } from '@nestjs/common';

@Controller('posts')
export class PostsController {}
```

执行完命令， 文件`posts.module.ts`中会自动引入`PostsController`, 并且在`@Module`装饰器的`controllers`中注入。

### nest-cli 创建服务类

> nest g service posts

```
// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {}
```

创建`app.service.ts`文件，并且在`app.module.ts`文件下，`@Module`装饰器的`providers`中注入注入。

Nest 数据库
--------
### TypeORM 连接数据库

#### 前置知识

什么是 ORM?
ORM 技术（`Object-Relational Mapping`）, 把关系数据库的变结构映射到对象上。


官方提供了两种连接数据库的方法， 这里分别介绍一下：

**方法 1**

首先在项目根目录下创建两个文件`.env`和`.env.prod`，分别存的是开发环境和线上环境不同的环境变量：
`.env.prod`中的是上线要用的数据库信息，如果你的项目要上传到线上管理，为了安全性考虑，建议这个文件添加到`.gitignore`中。

接着在根目录下创建一个文件夹`config`(与`src`同级)，然后再创建一个`env.ts`用于根据不同环境读取相应的配置文件。

```
import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production';

function parseEnv() {
  const localEnv = path.resolve('.env');
  const prodEnv = path.resolve('.env.prod');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件');
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path:filePath };
}
export default parseEnv();
```

然后在`app.module.ts`中连接数据库：
`@nestjs/config`依赖于 dotenv，可以通过 key=value 形式配置环境变量，项目会默认加载根目录下的. env 文件，我们只需在 app.module.ts 中引入 ConfigModule，使用 ConfigModule.forRoot() 方法即可，然后`ConfigService`读取相关的配置变量。

`TypeORM`提供了多种连接方式，这里再介绍一下使用`ormconfig.json`方式

**方法 2  ormconfig.json**

在根目录下创建一个`ormconfig.json`文件 (与`src`同级), 而不是将配置对象传递给`forRoot()`的方式。

```
{ 
    "type": "mysql",
    "host": "localhost", 
    "port": 3306, 
    "username": "root", 
    "password": "root", 
    "database": "blog", 
    "entities": ["dist/**/*.entity{.ts,.js}"], 
    "synchronize": true  // 自动载入的模型将同步
}
```

然后在`app.module.ts`中不带任何选项的调用`forRoot()`, 这样就可以了，想了解更多连接数据库的方式可以去有 [TypeORM 官网](https://link.juejin.cn?target=https%3A%2F%2Ftypeorm.bootcss.com%2Fconnection "https://typeorm.bootcss.com/connection")查看

```
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({ 
    imports: [TypeOrmModule.forRoot()],
})
export class AppModule {}
```

### 数据库 创建实体

好了，接下来就进行数据操作，
我们通过代码来建表， 先建立一个文章实体`PostsEntity`, 在`posts`目录下创建`posts.entity.ts`

```
//    posts/posts.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id:number; // 标记为主列，值自动生成

    @Column({ length:50 })
    title: string;

    @Column({ length: 20})
    author: string;

    @Column("text")
    content:string;

    @Column({default:''})
    thumb_url: string;

    @Column('tinyint')
    type:number

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    create_time: Date

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    update_time: Date
}
```

### 数据库CRUD
接下来在`posts.service.ts`文件中实现`CRUD`操作的业务逻辑，这里的表并不是最终的文章表，只是为了先实现一下简单的增删改查接口， 后面还会实现复杂的多表关联。

```
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }
  
  // 获取文章列表
  async findAll(query): Promise<PostsRo> {
    const qb = await getRepository(PostsEntity).createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne(id);
  }

  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
```


---
保存文件， 报错信息提示`PostsEntity`没有导入：

![[../_resources/1adad989226937df3ab01706de834c20_MD5.webp]]

此时在`posts.module.ts`中将`PostsEntity`导入：

```
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  ...
})
```

如果你是按照文章进行，使用第一种方式连接数据库，这里还有一个小坑`找不到PostsEntity实体`：

我们还需要在`app.module.ts`添加一下：

![[../_resources/6f88eb8a7b11862b8f4c46d81e70f14e_MD5.webp]]

### 数据库REST 风格实现
采用 REST 风格来实现接口，
在`posts.controller.ts`中设置路由了，处理接口请求，调用相应的服务完成业务逻辑：

```
import { PostsService, PostsRo } from './posts.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('post')
export class PostsController {
    constructor(private readonly postsService:PostsService){}

    /**
     * 创建文章
     * @param post
     */
    @Post()
    async create(@Body() post){
        return await this.postsService.create(post)
    }

    /**
     * 获取所有文章
     */
    @Get()
    async findAll(@Query() query):Promise<PostsRo>{
        return await this.postsService.findAll(query)
    }

    /**
     * 获取指定文章
     * @param id 
     */
    @Get(':id')
    async findById(@Param('id') id) {
        return await this.postsService.findById(id)
    }

    /**
     * 更新文章
     * @param id 
     * @param post 
     */
    @Put(":id")
    async update(@Param("id") id, @Body() post){
        return await this.postsService.updateById(id, post)
    }

    /**
     * 删除
     * @param id 
     */
    @Delete("id")
    async remove(@Param("id") id){
        return await this.postsService.remove(id)
    }
}
```

### 操作数据库踩过的坑

1.  实体的强替换，莫名其妙的删表，清空数据 以我们上面设置的实体为例：
```
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
}
```

最开初我设计表中`title`字段时，字段类型直接设置成`string`, 也就对应数据库类型是`varchar(255)`, 后来觉得不合适，对长度进行了限制, 更改为`varchar(50)`, 也就是这样修改一下代码：
```
@Column({length: 50})
    title: string;
```
保存代码后，结果！ 我数据库中所以的`title`都被清空了，这个坑真是谁踩谁知道~


### `entities`的三种设置方式 
各种方式的坑点：

### entities**方式 1： 单独定义**

```
TypeOrmModule.forRoot({
  //...
  entities: [PostsEntity, UserEntity],
}),]
```

就是用到哪些实体， 就逐一的在连接数据库时去导入，缺点就是麻烦，很容易忘记~

### **方式 2：自动加载**

```
TypeOrmModule.forRoot({
  //...
  autoLoadEntities: true,
}),]
```

自动加载我们的实体, 每个通过`forFeature()`注册的实体都会自动添加到配置对象的`entities`数组中, `forFeature()`就是在某个`service`中的`imports`里面引入的, 这个是我个人比较推荐的，实际开发我用的也是这种方式。

### 方式 3: 配置路径自动引入 

```
TypeOrmModule.forRoot({
      //...
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),]
```

通过配置的路径， 自动去导入实体。

这种方式就是前面介绍连接数据库第二种方式中使用的， But~ 超级不推荐。给你呈现一下我当时踩得坑：

1.  当时写了一个`Category`实体， 然后想增加一个`Tag`实体
2.  复制了`category.entity.ts`, 放到`tag`文件夹下，并且更名为`tag.entiry.ts`
3.  修改了内部的属性（删的删，改的改）， 变成了一个`Tag`实体，开心的保存了
4.  但是，我忘记了修改类名， 所以我的`category`表被清空了， 里面数据都没了~

就上面这两个坑，如果你是空数据库， 你随便折腾， 但是你数据库中有数据的童鞋， 建议一定要谨慎点， 连接数据库时， 上来先把`synchronize:false`设置上， 保命要紧

接口格式统一
------

> 一般开发中是不会根据`HTTP`状态码来判断接口成功与失败的， 而是会根据请求返回的数据，里面加上`code`字段

首先定义返回的 json 格式：

```
{
    "code": 0,
    "message": "OK",
    "data": {
    }
}
```

请求失败时返回：

```
{
    "code": -1,
    "message": "error reason",
    "data": {}
}
```

### 拦截错误请求
目标对请求错误就可以统一的返回了，返回请求错误只需要抛出异常即可, 比如之前的：

```
throw new HttpException('文章已存在', 401);
```
可以用过滤器来解决。


---
使用命令创建一个过滤器：

```
nest g filter core/filter/http-exception
```

过滤器代码实现：

```js
import {ArgumentsHost,Catch, ExceptionFilter, HttpException} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      message: message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
```

最后需要在`main.ts`中全局注册

```
...
import { TransformInterceptor } from './core/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
   // 注册全局错误的过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(9080);
}
bootstrap();
```



### 拦截成功的返回数据
对请求成功返回的格式进行统一的处理，可以用`Nest.js`的拦截器来实现。

首先使用命令创建一个拦截器：

```
nest g interceptor core/interceptor/transform
```

拦截器代码实现：

```
import {CallHandler, ExecutionContext, Injectable,NestInterceptor,} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          msg: '请求成功',
        };
      }),
    );
  }
}
```

最后和过滤器一样，在`main.ts`中全局注册：

```
...
import { TransformInterceptor } from './core/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
  // 全局注册拦截器
 app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(9080);
}
bootstrap();
```

过滤器和拦截器实现都是三部曲：`创建 > 实现 > 注册`，还是很简单的。
现在我们再试试接口，看看返回的数据格式是不是规范了?

配置接口文档 Swagger
--------------

这里用`swagger`，写接口文档`Nest.js`提供了专用的模块来使用它

安装后在`main.ts`中设置`Swagger`文档信息：

```js
...
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')   
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(9080);
}
bootstrap();
```

配置完成，我们就可以访问：`http://localhost:9080/docs`, 此时就能看到`Swagger`生成的文档：

![[../_resources/4add4a76c67d702c758a6637de1a465a_MD5.webp]]
### 接口标签

我们可以根据`Controller`来分类， 只要添加`@ApiTags`就可以

```
...
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@ApiTags("文章")
@Controller('post')
export class PostsController {...}
```

对`posts.controller.ts`和`app.controller.ts` 都分别加上分类标签，刷新`Swagger`文档，看到的效果是这样的：

![[../_resources/129f4dedb23abd5b4f00bf86be5124f6_MD5.webp]]

### 接口说明

进一步优化文档， 给每一个接口添加说明文字
同样在`Controller`中， 在每一个路由的前面使用`@ApiOperation`装饰器：

```
//  posts.controller.ts
...
import { ApiTags,ApiOperation } from '@nestjs/swagger';
export class PostsController {

  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() post) {....}
  
  @ApiOperation({ summary: '获取文章列表' })
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {...}
  ....
}
```

现在我们对每一个接口都写上了说明，再来看看接口文档展现： ![[../_resources/41fc78331409bdf3bf08f80bcaba09a7_MD5.webp]]

### 接口传参

最后我们要处理的就是接口参数说明， 
`Swagger`的优势之一就是，只要注解到位，可以精确展示每个字段的意义

---
这里需要先插入一段关于`DTO`的解释, 因为后面参数说明会用到：

> 数据传输对象（DTO)(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是数据访问对象从数据库中检索数据。数据传输对象与数据交互对象或数据访问对象之间的差异是一个以不具有任何行为除了存储和检索的数据（访问和存取器）。

这一段是官方解释， 看不懂没关系，可以理解成，`DTO 本身更像是一个指南`, 
在使用 API 时，方便我们了解`请求期望的数据类型`以及`返回的数据对象`。先使用一下，可能更方便理解。


---
在`posts`目录下创建一个`dto`文件夹，再创建一个`create-post.dot.ts`文件：

```
// dto/create-post.dot.ts
export class CreatePostDto {
  readonly title: string;
  readonly author: string;
  readonly content: string;
  readonly cover_url: string;
  readonly type: number;
}
```

然后在`Controller`中对创建文章是传入的参数进行类型说明：

```
//  posts.controller.ts
...
import { CreatePostDto } from './dto/create-post.dto';

@ApiOperation({ summary: '创建文章' })
@Post()
async create(@Body() post:CreatePostDto) {...}
```

这里提出两个问题：
1.  为什么不使用 `interface` 而要使用 `class` 来声明 `CreatePostDto`
2.  为什么不直接用之前定义的实体类型`PostsEntiry`，而是又定义一个 `CreatePostDto`


### 为什么不使用 `interface` 而要使用 `class` 来声明 `CreatePostDto`
对于第一个问题，我们都知道`Typescript`接口在编译过程中是被删除的，其次后面我们要给参数加说明, 使用`Swagger`的装饰器，`interface`也是无法实现的，比如：

```
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  readonly author: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly cover_url: string;

  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}
```

`@ApiPropertyOptional`装饰可选参数，继续看开一下 API 文档的 UI：

![[../_resources/1818494ce5b47994a1209a032bb08432_MD5.webp]]

### 为什么不直接使用实体类型`PostsEntiry`，而是又定义一个 `CreatePostDto`
为什么不直接使用实体类型`PostsEntiry`，而是又定义一个 `CreatePostDto`，因为 HTTP 请求传参和返回的内容可以采用和数据库中保存的内容不同的格式，所以将它们分开可以随着时间的推移及业务变更带来更大的灵活性，这里涉及到单一设计的原则，因为每一个类应该处理一件事，最好只处理一件事。

现在就可以从 API 文档上直观的看到每个传参的含义、类型以及是否必传。到这一步并没有完， 虽然以及告诉别人怎么传， 但是一不小心传错了呢， 比如上面作者字段没传，会发生什么呢？

![[../_resources/1ceda566625ad2568094b6952c318ef7_MD5.webp]]

接口直接报 500 了， 因为我们实体定义的`author`字段不能为空的，所有在写入数据时报错了。这样体验非常不好， 很可能前端就怀疑我们接口写错了，所有我们应该对异常进行一定的处理。

数据验证
----

怎么实现呢？首先想到的是在业务中去写一堆的`if-elese`判断用户的传参，一想到一堆的判断， 这绝对不是明智之举，

所有我去查了`Nest.js`中数据验证，发现`Nest.js`中的**管道**就是专门用来做数据转换的，我们看一下它的定义：

### 管道

> 管道是具有 `@Injectable()` 装饰器的类。管道应实现 `PipeTransform` 接口。
> 
> 管道有两个类型:
> *   **转换**：管道将输入数据转换为所需的数据输出
> *   **验证**：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

![[../_resources/8f025618d32de1121c9c95e16fe86de5_MD5.webp]]


### 管道异常处理

管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 [异常过滤器](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.cn%2F8%2Fexceptionfilters "https://docs.nestjs.cn/8/exceptionfilters") 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。

什么意思呢， 通俗来讲就是，对请求接口的入参进行验证和转换的前置操作，验证好了我才会将内容给到路由对应的方法中去，失败了就进入异常过滤器中。

### Nest自带管道

`Nest.js`自带了三个开箱即用的管道：`ValidationPipe`、`ParseIntPipe`和`ParseUUIDPipe`, 其中`ValidationPipe` 配合`class-validator`就可以完美的实现我们想要的效果（对参数类型进行验证，验证失败抛出异常）。

### 管道验证操作实例
管道验证操作通常用在`dto`这种传输层的文件中, 用作验证操作。
首先我们安装两个需要的依赖包：`class-transformer`和`class-validator`
然后在`create-post.dto.ts`文件中添加验证, 完善错误信息提示：

```
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @IsNotEmpty({ message: '缺少作者信息' })
  @ApiProperty({ description: '作者' })
  readonly author: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly cover_url: string;

  @IsNumber()
  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}
```

`class-validator`还提供了很多的验证方法， 大家感兴趣可以自己看[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypestack%2Fclass-validator%23validation-messages "https://github.com/typestack/class-validator#validation-messages").
最后我们还有一个重要的步骤， 就是在`main.ts`中全局注册一下管道`ValidationPipe`：

```
app.useGlobalPipes(new ValidationPipe());
```

此时我们在发送一个创建文章请求，不带`author`参数， 返回数据有很清晰了：
![[../_resources/596f2e64050c59200ca5cc8b9fb2e003_MD5.webp]]

通过上边的学习，可以知道`DTO`本身是不存在任何验证功能， 但是我们可以借助`class-validator`来让`DTO`可以验证数据

