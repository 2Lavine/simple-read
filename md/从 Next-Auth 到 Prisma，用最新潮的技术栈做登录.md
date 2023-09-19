> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7269424598260498488?searchId=202309192239579E013D75689F6D3568F9)

引言
==

使用`React`框架的前端工程师应该都听过一句话：`React`的成员不是在`NextJS`就是在去`NextJS`的路上。`NextJS`的内核团队多来自`React`，这正是`NextJS`快速成长的原因之一。

那么`NextJS`有什么特性呢？`NextJS`为`React`应用提供了非常便利的开箱即用功能，如路由、页面预获取、服务器端渲染等，极大地简化和加速了开发，这也让`NextJS`成为前端领域的当红炸子鸡。

`NextJS`背后的公司是`Vercel`，除了`NextJS`，这家公司还有当前最热门的前端云平台`Vercel`、下一代`Node.js`和`TypeScript`的`ORM`——`Prisma`。

在`NextJS`社区里，英国开发者 Iain Collins 开发了`next-auth`，这是一个支持多种登录方式如 `OAuth、email、credentials`的库，能够极大简化我们开发登录功能的时间。

`NextJS + Next-Auth + Prisma`，随着三个主角悉数亮相，就可以明确本文的目标了：用`NextJS、Next-Auth、Prisma`来完成一个`Github OAuth`登录的功能。

**看完本文你将学到：**

*   创建你的`Github`应用
*   在`NextJS`项目中使用`next-auth`完成登录流程（不限于`github`登录）
*   `docker`构建开发环境`postgres`数据库
*   当前最热门的`orm`——`prisma`的基本使用

创建 Github 应用
============

本文假定你对`OAuth`有基本的了解，如果你还不了解，找个可以扫码登录`WeChat`的网站体验一下，那就叫`OAuth`授权登录。

现在我们在自己的`Github`后台创建一个应用，用户通过`OAuth`授权登录，那就成为你这个应用的用户啦。

第一步：到 [github.com/settings/ap…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsettings%2Fapps "https://github.com/settings/apps") 创建`OAuth`应用

第二步：填写应用信息

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/477b5dd9d24c4747a9b6832b8410f9a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

注意：`Authorization callback URL`是授权登录后的回调地址，如果登录流程是自己开发，你可以根据自己代码来填，但是本文是用`next-auth`，所以得按`next-auth`的规范来做，必须填`/api/auth/callback/github`

第三步：创建完成后，会进入应用后台，此时需要生成 **Client** 和 **secrets**，并保存下 **Client ID** 和 **Client secrets**。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0086350567445a6937f082d48f61ea0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

因为现在还处于本地调试阶段，所以我把设置的两个 URL 改成`localhost`了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4aa8a89158154facbbbdfc582a89f47b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`Github`应用创建就是这么简单，很适合用来做一些实验性的功能。

扩展阅读：

如果想学习`Google`的`OAuth`，请猛烈点击我的历史文章：

[谷歌 OAuth2.0 开发的正确配置步骤](https://link.juejin.cn?target=https%3A%2F%2Fweijunext.com%2Farticle%2F5a2f1378-e1c8-44a8-8ba3-54660811d5cd "https://weijunext.com/article/5a2f1378-e1c8-44a8-8ba3-54660811d5cd")

用 Next-Auth 实现登录
================

先创建一个`Next`项目：

```
npx create-next-app@latest
```

安装`next-auth`

```
yarn add next-auth
```

在`nextjs v13.2`推出后，`next-auth`已支持`app router`模式下在`app`文档夹内构建`API`，但是鉴于官方文档主要使用方式仍然是放在`pages`文档夹下，所以本例也将在`pages`下进行`API`编写。

在`pages/api/auth`中创建一个名为`[...nextauth].ts`的文档

```
import NextAuth from "next-auth"

import { authOptions } from "@/lib/auth"

// @see ./lib/auth
export default NextAuth(authOptions)
```

`pages/api/auth/[...nextauth].ts`中使用`[...nextauth]`是为了动态匹配`nextauth`的所有 API 路由，如:

*   `/api/auth/callback` 处理认证回调
*   `/api/auth/signin` 处理登录
*   `/api/auth/signout` 处理登出
*   `/api/auth/session` 获取`session`等等

也就是说，使用`[...nextauth]`可以动态匹配所有包含`/api/auth/`和`nextauth`的`API`路由。

我们把`next-auth`的基本配置放在了`lib/auth.ts`里：

```
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: '/auth/logout',
  },
  providers: [
    GithubProvider({
      clientId: `${process.env.GITHUB_ID}`,
      clientSecret: `${process.env.GITHUB_SECRET}`,
      httpOptions: {
        timeout: 50000,
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return token
    }
  },
}

export default NextAuth(authOptions)
```

`next-auth`的服务端内容就是这些，乍一看容易一头雾水，但确实就是这么简单，它把中间繁琐的过程都封装起来了。

现在来写个这样的登录页

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b279abe5e344ac0b8ad4e611d7f63fd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

内核代码是「使用 Github 登录」的按钮

```
// components/UserAuthForm.tsx

"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);

  const login = async () => {
    setIsGitHubLoading(true);
    signIn("github", { // 登录方法，第一个参数标注平台
      callbackUrl: `${window.location.origin}`, // 设置登录成功后的回调地址
    });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants())}
        onClick={login}
        disabled={isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner class />
        ) : (
          <Icons.gitHub class />
        )}{" "}
        Github
      </button>
    </div>
  );
}
```

前端部分也完成了。

这时候还要配一个环境变量

```
# .env
GITHUB_ID=YOUR_GITHUB_ID
GITHUB_SECRET=YOUR_GITHUB_SECRET

# NEXTAUTH_SECRET是必填项，用命令生成: openssl rand -base64 32
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3001 # 告诉next-auth授权回调的基础 URL，这个环境变量是必须的，虽然它没有在我们的代码里体现
```

现在试一下能不能完成`Github OAuth`登录。点击按钮确实会跳到授权页

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eb1a5ac0e434d32a0da57f0463a6cda~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

授权后会跳到首页，完成了授权登录流程了。

需要一个更准确的信息证明真的完成授权登录了？那就在首页把个人信息回显出来。这依然需要用到`next-auth`的`api`。让我们在`lib`下面新建一个文档叫做`session.ts`

```
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}
```

在`app/page.tsx`调用

```
import Image from 'next/image'
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  console.log(user);

  return (
    <main>
        ……
      <div>
        <div class>
          {user?.image ? (
            <>
              {" "}
              Current User:{" "}
              <Image
                className="relative rounded-full ml-3 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src={user.image}
                alt="Next.js Logo"
                width={36}
                height={36}
                priority
              />
            </>
          ) : (
            <></>
          )}
        </div>
        {!user ? (
          <div class>
            Next-Auth的demo请到
            <Link
              href="/login"
              class
            >
              登录页
            </Link>
            体验
          </div>
        ) : (
          <SignOut></SignOut>
        )}
      </div>
    ……
    </main>
  )
}
```

为了`Image`可以生效，我们需要在`next.config.js`里添加可信域

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'], // 添加github头像服务的域名
  },
}

module.exports = nextConfig
```

现在在首页就可以看到用户信息回显了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d2406c188504388a4578c06d3e9c1c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果你自己开发过`oauth`登录，再看到`next-auth`的流程，你一定会很兴奋，因为`next-auth`帮我们处理掉了很多中间过程。  
如果你没开发过`oauth`，可以到这一篇看看自己开发`oauth`登录有多麻烦：[接入谷歌 OAuth2.0 登录的分析和代码实践](https://juejin.cn/post/7252584767593627707 "https://juejin.cn/post/7252584767593627707")

搭建 postgres 测试数据库
=================

有时候我们不止是需要第三方授权的用户信息，我们还想自己保存一个用户表，把用户基本信息和我们自定义的一些字段共存，那么我们就需要建一个数据库了。

在`Mysql`被`oracle`收购后，`postgres`成为开源社区里最闪亮的新星。`postgres`也是本文代码用到的数据库。

如果我们自己安装`postgres`，很多操作会显得非常繁琐，但如果在`docker`中安装，一切就变得非常丝滑。

如果你还没安装`docker`，请通过官网安装一下，安装后用命令验证是否安装成功，如果安装成功，会返回`docker`的版本号。

```
docker-compose -v
```

docker 安装完成后，到项目根目录下创建文档`docker-compose.yml`

```
# docker-compose.yml
    version: '3.1'
    services:
      nextjs-learn-domes:
        image: postgres
        volumes:
          - ./postgres:/var/lib/postgresql/data
        ports:
          - 5432:5432
        environment:
          - POSTGRES_USER=myuser
          - POSTGRES_PASSWORD=mypassword

      adminer:
        image: adminer
        restart: always
        ports:
          - 8080:8080
```

启动`docker`

```
docker-compose up -d
```

如果启动失败，请排查 5432 和 8080 端口是否被占用，如果被占用需要先关闭占用的服务再启动`docker`。

现在访问`http://localhost:8080`就可以登录数据库了

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d1ff8fd01b450d8048b4d7a5fe7c35~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果要关闭`docker`，可以执行命令

```
docker-compose down
```

如果你想学习 Docker 的基本知识，请阅读文章：[前端有了 Docker，全栈之路更轻松了](https://juejin.cn/post/7270830083747954723 "https://juejin.cn/post/7270830083747954723")

用 Prisma 操作数据库
==============

Prisma 是下一代`Node.js`和`TypeScript`的`ORM`。在 Node 中用过`Sequelize`操作数据库的兄弟都知道，这是一个让你可以用写对象的方式来写`sql`的工具，极大简化了前端对`sql`的学习成本和开发成本，`Prisma`也是这样的工具。

> 这里有对`Prisma`和`Sequelize`的简单优势对比：
> 
> 1.  `Prisma`拥有自己的查询语言`Prisma Query Language(PQL)`, 语法更接近 SQL, 上手更简单。`Sequelize`使用的是 JS 语法, 需要学习更多 API。
> 2.  `Prisma`有自动生成并更新数据库`Schema`的功能, 可以通过`Prisma Client`直接访问数据库, 更符合现代开发方式。`Sequelize`需要更多手动配置。
> 3.  `Prisma`基于下一代`ORM`理念, 如无缝的关系映射、类型安全等特性。`Sequelize`相对更传统。
> 4.  `Prisma`有更好的`TypeScript`支持, 提供良好的类型推导。`Sequelize`的`TypeScript`体验较差。
> 5.  `Prisma`有直观的数据模型可视化功能。`Sequelize`需要通过代码理解数据结构。
> 6.  `Sequelize`社区更加成熟, 资源更丰富。`Prisma`作为较新框架, 资源相对较少。

开始使用 Prisma

```
yarn add prisma @prisma/client
```

初始化 Prisma

```
npx prisma init
```

初始化后，在根目录会出现一个`prisma`的文档夹，这个文档夹用来存放`Prisma`相关配置；里面还有一个`schema.prisma`文档，是内核的数据库`Schema`定义文档，开发时主要通过修改它来更新数据库模型设计。

再去看. env 文档，会发现多了一条配置

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

需要改成我们的 postgres 配置

```
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
```

创建数据库
-----

现在开始思考我们的用户表结构，未来我们希望通过`next-auth`接入多个第三方平台的`OAuth`，那么可以记录下用户在第三方平台的唯一 id，还需要抹平不同平台的用户信息字段。那么就可以在用户表里添加`sub`和`platform`，再统一用户信息字段`username`、`avatar`。

`schema.prisma`是唯一的`Schema`定义文档，定义`User`表结构如下：

```
// schema.prisma

    ……

    model User {
      id        Int      @id @default(autoincrement())
      sub       String   @unique // 第三方平台的唯一id
      platform  String   // 第三方平台标识，如：github google
      username  String
      avatar    String
      email     String
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
```

定义了表结构后，本身不会自动创建表，需要执行`migrate`命令才会由`Prisma`来生成和执行创建表的 SQL 语句

```
npx prisma migrate dev --name "init"
```

打开数据库，会发现现在`User`表已经创建出来了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e765a11f0764140a7f22492ae88849c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果你想深入了解一下`prisma migrate`命令，请猛烈点击：[prisma migrate 命令简明教程](https://link.juejin.cn?target=https%3A%2F%2Fweijunext.com%2Farticle%2Fd542b265-131d-4553-9d2d-b0e72a35e8d5 "https://weijunext.com/article/d542b265-131d-4553-9d2d-b0e72a35e8d5")

实例化 PrismaClient
----------------

创建`lib/prisma.ts`，实例化`PrismaClient`

```
import { PrismaClient } from "@prisma/client";

    declare global {
      // eslint-disable-next-line no-var
      var prisma: PrismaClient
    }

    let prisma: PrismaClient;

    if (process.env.NODE_ENV === "production") {
      prisma = new PrismaClient();
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient();
      }
      prisma = global.prisma;
    }
    export default prisma;
```

`PrismaClient`实例的作用是连接数据库并执行数据库操作，可以把它理解为一个数据库客户端, 可以通过它来发送数据库查询、修改数据。

修改`auth/ts`，我们尝试把从`Github`获取的用户信息存到`User`表里

```
……
    import prisma from "@/lib/prisma";
    import { UserInfo } from "@/types/user";

    ……

    callbacks: {
        session: async ({ session, token }) => {
          const res = await prisma.user.upsert({
            where: {
              sub: token.sub
            },
            update: {
              // 使用token中的数据
              username: token.name,
              avatar: token.picture,
              email: token.email
            },
            create: {
              // 使用token中的数据 
              sub: token.sub,
              username: token.name,
              avatar: token.picture,
              email: token.email,
              platform: 'github',
            }
          })
          if (res) {
            session.user = {
              sub: res.sub,
              platform: res.platform,
              username: res.username,
              avatar: res.avatar,
              email: res.email,
            } as UserInfo
          }
          return session
        }
      },

    ……
```

回到页面，重新登录一下，会发现原本显示头像的位置不显示了，说明已经拿到我们封装后的用户信息了，只要修改一下字段就可以回显。

结语
==

通过本文的学习，我们用全新的技术栈`NextJS+Next-Auth+Postgres+Prisma`完成了一个登录模块，如果你自己折腾过登录流程，一定能感受到`Next-Auth`的强大。

本文涉及的技术栈，都是当前海外前端圈流行的新技术，比较适合个人开发者快速开发创意原型或实用工具。这套技术组合 both 前后端都能快速高效地工作，是构建 web 应用的绝佳选择。

源码
==

[github.com/weijunext/n…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fweijunext%2Fnextjs-learn-demos%2Ftree%2FNextAuth-Prisma "https://github.com/weijunext/nextjs-learn-demos/tree/NextAuth-Prisma")