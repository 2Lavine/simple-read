> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7270907826557009974?searchId=202309192239579E013D75689F6D3568F9)

> 通过 Prisma、Postgresql 和 NextAuth 的全栈创建博客应用程序，了解如何使用 Next.js 13 和应用程序目录结构。

[Next.js](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2F "https://nextjs.org/") 是一个强大而灵活的框架，可用于构建各种各样的 Web 应用程序，从小型个人项目到大型企业应用程序。

本文将使用以下技术构建一个完整的堆栈应用程序：

*   [Next.js](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2F "https://nextjs.org/")：作为 React 框架
*   [Next.js API routes](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fpages%2Fbuilding-your-application%2Frouting%2Fapi-routes "https://nextjs.org/docs/pages/building-your-application/routing/api-routes")：作为后端，用于服务器端 API 路由
*   [Prisma](https://link.juejin.cn?target=https%3A%2F%2Fwww.prisma.io%2F "https://www.prisma.io/")：作为迁移和数据库访问的 ORM
*   [PostgreSQL](https://link.juejin.cn?target=https%3A%2F%2Fwww.postgresql.org%2F "https://www.postgresql.org/") 数据库
*   [NextAuth.js](https://link.juejin.cn?target=https%3A%2F%2Fnext-auth.js.org%2F "https://next-auth.js.org/")：OAuth 身份验证
*   [TypeScript](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2F "https://www.typescriptlang.org/")：编程语言

用户将能够看到所有消息，但只能在登录状态下可以创建新博文和删除自己的博文。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb5a6b91a5de4f998fcfb6ab5d69529f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1128&h=601&e=png&b=210a47)

> 可以在此处找到该项目的完整代码，本文暂时只是实现博客最基本的最简单的功能，后续在此代码基础上持续迭代：[github.com/QuintionTan…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FQuintionTang%2Freact-blog%2Ftree%2Fdevelop "https://github.com/QuintionTang/react-blog/tree/develop")

为了更好的学习，需要一个基础环境：

*   [Node.js](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fen "https://nodejs.org/en")
*   GitHub 账号：用于创建 OAuth 应用程序

使用**启动全栈、类型安全的 Next.js 应用程序的最佳方式**来启动项目，使用以下命令（该命令将会创建一个项目目录）：

```
npm create t3-app@latest
```

1.  给项目起个名字（输入项目名称并按回车继续）
2.  选择 `typescript`（按回车键）
3.  选择 `nextauth`、`prisma` 和 `tailwind`（使用空格选择，箭头导航，按回车键继续）
4.  `Initialize a new git repository?`（`y/n`）
5.  `Would you like us to run 'npm install'?`（`y`）
6.  `What import alias would you like configured?` 配置路径别名（例如 `@/`）

安装完成后，进入项目目录 `react-blog`，先运行 `npx prisma db push` 命令，再运行 `npm run dev` 并在浏览器中打开 `http://localhost:3000/` 可以看到以下效果。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/999b183140f043a89a88faa8d9245f4f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1000&h=522&e=png&b=22094c)

在继续之前，对文档结构进行一些更改，并重新构建它，以便可以使用 `app` 目录。

首先，需要在 `next.conf.mjs` 中添加一个实验性标志（因为 `app` 目录目前处于 `beta` 阶段）：

```
experimental: { appDir: true }
```

接下来，在项目根目录中创建一个名为 `app` 的新文档夹，并在其中创建一个名为 `page.tsx` 的新文档，将 `src/pages/index.tsx` 中的示例页面的代码复制并粘贴到新的 `page.tsx` 文档中。由于现在有两个主页，会发生冲突，需要删除路径 `src/pages` 下的 `index.tsx` 和 `_app.tsx` 文档。还需要修改配置文档 `tailwind.config.cjs`，将 `app` 目录包含进去，完整代码如下：

```
import { type Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

运行 `npm run dev` 看看发生了什么，终端界面中会有很多输出，但最重要最显着的是：

```
Your page app/page.tsx did not have a root layout. We created app/layout.tsx for you.
```

现在可以在 `app` 目录中找到这两个新文档，有用于为每个路由段创建 UI 的特殊文档约定。最常见的特殊文档是 `page.tsx` 和 `layout.tsx`：

*   `page.tsx` 用于定义特定路由的唯一 UI。
*   `layout.tsx` 用于定义在多个路由之间共享的 UI。

文档夹中还可以有需要的元数据、错误和加载的保留文档：

*   `head.tsx` 用于定义 HTML 文档的元数据。
*   `error.tsx` 用于为一个段落及其子元素创建错误 UI。
*   `loading.tsx` 用于为一个段落及其子元素创建加载中 UI。

然而，当在浏览器中查看 `http://localhost:3000/` 时，会发现没有样式。

接下来是项目支持 `sass`，安装依赖：

```
npm install --save sass
```

将 `styles/globals.css` 改为 `globals.scss`，并将 `globals.css` 文档导入到 `layout.tsx` 文档中：

```
import "@/styles/globals.scss";
```

再次运行 `npm run dev` 就会有样式了。

### 数据库设置

接下里就是关于数据库的内容了，本文将使用 Supabase 托管的免费 PosgtreSQL 数据库。

当然也可以使用本地的 PostgreSQL 数据库，这里使用 supabase 来作为存储库。

访问 [supabase.com/](https://link.juejin.cn?target=https%3A%2F%2Fsupabase.com%2F "https://supabase.com/")，创建一个账户或使用 GitHub 登录，并创建一个新项目。

创建完项目，就可以从项目设置中获取连接字符串。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54d694e852e34262aa84c89a25f863d5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1342&h=641&e=png&b=202020)

使用 `.env` 文档中的连接字符串连接到新数据库（此处使用自己的连接字符串）：

```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.chdrgxolrbiemiafdqfo.supabase.co:5432/postgres"
```

如果是本地 PostgreSQL 数据库，只需要将上述连接 URL 改为如下格式：

```
DATABASE_URL="postgresql://username:mypassword@localhost:5432/dbname?schema=sample"
```

还必须将路径下 `prisma` 路径下的文档 `schema.prisma` 中的数据源提供程序更改为：

```
provider = "postgresql"
```

### 使用 Prisma

可以使用数据定义语言 (DDL) 定义数据库模式，Prisma 将自动生成一组 TypeScript 类型和 API，能够以类型安全和便捷的方式与数据库进行交互。Prisma 还提供了一个迁移系统，可以方便地随时间演变数据库模式，并与包括 PostgreSQL、MySQL、SQLite 在内的许多流行数据库进行集成。

在处理数据库时，首先开始创建模型，主要编辑 `prisma` 路径下的文档 `schema.prisma`。

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
    provider = "prisma-client-js"
    previewFeatures = ["jsonProtocol"]
}

datasource db {
    provider = "postgresql"
    // NOTE: When using mysql or sqlserver, uncomment the @db.Text annotations in model Account below
    // Further reading:
    // https://next-auth.js.org/adapters/prisma#create-the-prisma-schema
    // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string
    url      = env("DATABASE_URL")
}

model Posts {
  id        String     @default(cuid()) @id
  title     String
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  String?
  createdAt DateTime  @default(now())
}

// Necessary for Next auth
model Account {
    id                String  @id @default(cuid())
    userId            String
    type              String
    provider          String
    providerAccountId String
    refresh_token     String? // @db.Text
    access_token      String? // @db.Text
    expires_at        Int?
    token_type        String?
    scope             String?
    id_token          String? // @db.Text
    session_state     String?
    user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@unique([provider, providerAccountId])
}

model Session {
    id           String   @id @default(cuid())
    sessionToken String   @unique
    userId       String
    expires      DateTime
    user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
    id            String    @id @default(cuid())
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    accounts      Account[]
    sessions      Session[]
    posts         Posts[]
}

model VerificationToken {
    identifier String
    token      String   @unique
    expires    DateTime

    @@unique([identifier, token])
}
```

`Prisma` 模式定义了博客 `Posts` 与用户 `User` 之间的关系（一对多关系），通过 `Posts` 上的 `author` 字段和 `User` 上的 `posts` 字段进行关联。

在下一节中，将讨论与 NextAuth 相关的一切内容。

要实际在数据库中创建表格，可以使用 `Prisma CLI` 工具，执行以下命令：

```
npx prisma db push
```

执行完成后就可以可以在 `supabase` 表编辑器中看到已经创建的表。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba3053b312ef4e0891950bb3d9932f4d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=840&h=405&e=png&b=1d1d1d)

或者可以使用以下命令启动 `prisma studio`：

```
npx prisma studio
```

如 `create-t3-app` 的文档所建议的那样，位于 `src/server/db.ts`，`Prisma Client` 被实例化为一个全局变量（这是 `Prisma` 团队推荐的最佳实践），并导出以供在 API 路由中使用。默认在上下文中包含 `Prisma Client`，并建议使用这种方式，而不是在每个文档中单独导入它。

接下来将 PrismaClient 实例导入 Next.js 应用程序中，如下所示：

```
import { prisma } from "@/server/db";
```

为了确保 Prisma 客户端使用最新的架构，需要每次更改架构时都要运行以下命令来更新客户端：

```
npx prisma generate
```

### 设置 NextAuth

NextAuth.js 是一个流行的用于 Next.js 应用程序的开源身份验证库，提供了一种简单使用各种身份验证 Provider 程序（例如 Google、Facebook、GitHub、数字钱包等）以及自定义 Provider 程序。

NextAuth.js 支持多种身份验证流程，例如基于电子邮件和密码的身份验证、社交身份验证和基于令牌的身份验证。它提供了灵活且可定制的 API 来处理身份验证过程，并且与 Next.js 无缝集成，可以轻松地向应用程序添加身份验证。

通过 create-t3-app，已经在项目中创建了 NextAuth 配置，接下来需要进行一些个性化的配置。通常配置文档是在路径 `pages/api/auth` 中，文档名是 `[...nextauth].js` ，文档包含 NextAuth.js 的动态路由处理程序，该处理程序还将包含所有全局 NextAuth.js 配置。在本文实例中配置全部在 `src/server/auth.ts` 中进行修改。

项目创建后，默认的身份验证 Provider 是 Discord，接下里将其改为 Github，增加 GithubProvider 的导入：

```
import GithubProvider from "next-auth/providers/github";
```

在提供程序配置中将 Discord 提供程序替换为下面的 Github 提供程序：

```
GithubProvider({
  clientId: env.GITHUB_ID,
  clientSecret: env.GITHUB_SECRET,
}),
```

还必须更改 `.env.mjs` 文档，将 Discord 变量替换为 Github 变量：

```
GITHUB_ID: z.string(),
GITHUB_SECRET: z.string(),

GITHUB_ID: process.env.GITHUB_ID,
GITHUB_SECRET: process.env.GITHUB_SECRET,
```

接下来，需要在 `.env` 文档中增加以下环境变量：

```
GITHUB_ID=""
GITHUB_SECRET=""
```

要获取 Github 提供商 Provider 的凭据，访问 [github.com](https://link.juejin.cn?target=github.com "github.com") 在登录状态下点击设置并单击左侧边栏底部的[开发人员设置](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsettings%2Fapps "https://github.com/settings/apps")。选择 OAuth 应用程序并注册一个新应用程序，当前是开发状态，回调路径可以设置为 `http://localhost:3000/api/auth/callback/github`。创建成功后，创建 `Client Secret` 并将和 `Client ID` 的值复制到文档 `.env` 对应的变量。

#### 登录和退出

对于一个博客系统，通常只有登录的用户才有权限管理博客信息，因此首选需要实现的功能就是登录和退出。

首先，在目录 `app` 中创建名为 `Actions.tsx` 的新文档，文档内容将包含登录和注销按钮。

另外，在 `src` 目录中创建名为 `components` 的文档夹，添加名为 `Icons.tsx` 的新文档，其中包含以下内容：

```
export function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9914_10)">
        <path
          d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_9914_10">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
```

接下来创建登录和注销按钮。由于 app 目录下的所有组件都是服务器组件，所以需要在 `Action.tsx` 文档的第一行增加 `"user client"`；这样这部分就会在客户端呈现，按钮就可以有一个 `onClick` 。

打开 `Actions.tsx` 并粘贴以下代码：

```
"use client";

import { GitHubIcon } from "@/components/Icons";
import { signIn, signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button
      className="mb-6 mt-2 text-xs text-white hover:text-[hsl(280,100%,70%)]"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => signOut()}
    >
      → Sign out
    </button>
  );
}

export function SignIn() {
  return (
    <button
      class
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => signIn("github")}
    >
      <GitHubIcon />
      <div class>Sign in with GitHub</div>
    </button>
  );
}
```

在这里，创建一个注销按钮，单击时调用 NextAuth 的 `signout()` 函数，并创建一个登录按钮，分别使用 Github 图标和使用 tailwind 定义的特定样式调用 `signin()` 函数。

现在可以继续编辑 `page.tsx` 文档并使用刚刚定义的 `Actions.tsx`：

```
import { SignIn, SignOut } from "./Actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export default async function Home() {
  let session;

  try {
    const [sessionRes] = await Promise.allSettled([
      getServerSession(authOptions),
    ]);

    if (sessionRes.status === "fulfilled") {
      session = sessionRes.value;
    } else {
      console.error(sessionRes);
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div class>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Crayon <span className="text-[hsl(280,100%,70%)]">BLOG</span>
          </h1>
          {session?.user ? (
            <>
              <SignOut />
            </>
          ) : (
            <SignIn />
          )}
        </div>
      </main>
    </>
  );
}
```

上面代码使用 `getServerSession` 并将已确定的 `Promise` 的值存储在 `session` 中，稍后可以使用该值来检查是否存在该 `session`。

现在，可以通过运行 `npm run dev` 并登录来测试应用程序。将在数据库中创建一个用户，其中包含架构中定义的所有信息。首次登录后，每次登录都会看到以下内容：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bf026cc5802455992f8c03313c30a03~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=995&h=636&e=png&b=210b47)

### 博客文章管理

成功登录后就可以开始管理博客了，通常所有用户可以查看博文，只能在登录时创建和删除自己的博客。

#### API 路由

首先，通过在 `src/pages/api` 中创建一个名为 `posts.ts` 的新文档来创建 API Endpoint：

```
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/server/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });
    if (!session || !session.user) {
        return res.status(403).send("Unauthorized");
    }

    const id = session.user.id;

    if (req.method === "POST") {
        await prisma.posts.create({
            data: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                title: req.body.title,
                authorId: id,
            },
        });

        return res.status(200).json({ error: null });
    }

    if (req.method === "DELETE") {
        await prisma.posts.delete({
            where: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                id: req.body.id,
            },
        });

        return res.status(204).end();
    }

    return res.send("Method not allowed.");
}
```

这是一个 Next.js API 路由处理程序，用于处理对 `/api/posts` 的 `POST` 和 `DELETE` 请求。它首先使用 `next-auth/react` 包中的 `getSession` 获取用户的会话。如果没有会话或会话中没有用户，它会发送带有消息 `Unauthorized` 的 403 响应。

如果请求方法是 POST，它会使用 `Prisma ORM` 中 `posts` 模型的 `create` 方法创建一个新博文。博文数据取自 `req.body` 对象的 `title` 属性，用户的 `id` 取自 `session`。

如果请求方法是 DELETE，它将使用 `Prisma ORM` 中 `posts` 模型的删除方法删除博文。帖子 ID 取自 `req.body` 对象的 `id` 属性。

如果请求方法既不是 POST 也不是 DELETE，则会在响应中发送 `Method not allowed` 消息。

响应格式取决于请求方法。如果请求方法是 `POST`，则返回 `200` 状态码，并带有包含 `error: null` 的 JSON 对象。如果请求方法是 `DELETE`，则返回 `204` 状态码，正文为空。

#### Form 组件

接下来创建表单组件，继续在 `app` 目录中创建一个名为 `Form.tsx` 的新文档，完整代码如下：

```
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Form() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsFetching(true);

    const form = e.currentTarget;
    const input = form.elements.namedItem("entry") as HTMLInputElement;

    const res = await fetch("/api/posts", {
      body: JSON.stringify({
        title: input.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    input.value = "";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error } = await res.json();

    setIsFetching(false);
    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  }

  return (
    <form
      style={{ opacity: !isMutating ? 1 : 0.7 }}
      className="relative max-w-[500px] text-sm"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={onSubmit}
    >
      <input
        aria-label="Your message"
        placeholder="Your message..."
        disabled={isPending}
        
        type="text"
        required
        class
      />
      <button
        class
        disabled={isMutating}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
```

这是一个 React 组件，用于在博客创建新博文的表单，使用 `useRouterNext.js` 中的钩子来获取路由器实例，并使用 React 中的 `useState` 和 `useTransition` 钩子来管理表单提交过程的状态。

`onSubmit` 提交表单时调用该函数，首先阻止默认的表单提交行为，然后将 `isFetching` 状态设置为 `true` 。然后，它从表单获取输入值，并向端点 `/api/posts` 发送 POST 请求 。请求完成后，`isFetching` 状态将设置回 `false` 并调用函数 `startTransition` 来刷新当前页面，而不会丢失客户端状态。该表单有一个用于输入帖子标题的输入字段和一个用于提交表单的 `发送` 按钮。当表单正在提交时，`发送`按钮将被禁用。

#### 删除组件

创建删除组件，继续在 `app` 目录中创建一个名为 `Delete.tsx` 的新文档，完整代码如下：

```
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Delete({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  async function onClick() {
    setIsFetching(true);

    await fetch("/api/posts", {
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    setIsFetching(false);
    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
  }

  return (
    <button
      class
      disabled={isMutating}
      type="button"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={onClick}
    >
      {isMutating ? "Deleting..." : "Delete"}
    </button>
  );
}
```

这是一个名为 `Delete` 的 React 组件，它创建一个允许用户删除博客的按钮。单击该按钮时，会触发 `onClick` 函数，该函数会向 `/api/posts` 端点发送一个 DELETE 请求，其中包含要删除的博客的 `id`。

该组件使用 `next/navigation` 中的 `useRouter` 钩子来访问当前路由，并使用 React 中的 `useTransition` 和 `useState` 钩子来管理删除过程的状态。当删除过程正在进行时，`isMutating` 变量为 `true`。如果请求成功，则 `isFetching` 设置为 `false`，并调用 `router.refresh()` 函数刷新当前路由并从服务器获取新数据。

#### Homepage

最后但并非最不重要的一点是，可以在 `page.tsx` 中实现所有组件，并创建一个异步函数来获取所有帖子，即使用户未登录：

```
import { SignIn, SignOut } from "./Actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import Image from "next/image";
import Form from "./Form";
import { prisma } from "@/server/db";
import Delete from "./Delete";
import { type Session } from "next-auth";

async function getPosts() {
  const data = await prisma.posts.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export default async function Home() {
  let session: Session | null | undefined;
  let posts;

  try {
    const [postsRes, sessionRes] = await Promise.allSettled([
      getPosts(),
      getServerSession(authOptions),
    ]);

    if (postsRes.status === "fulfilled" && postsRes.value[0]) {
      posts = postsRes.value;
    } else {
      console.error(postsRes);
    }

    if (sessionRes.status === "fulfilled") {
      session = sessionRes.value;
    } else {
      console.error(sessionRes);
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div class>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-devpoint text-[hsl(280,100%,70%)]">
              DevPoint
            </span>{" "}
            BLOG
          </h1>
          <h2 class>
            Use Next.js 13,Prisma, Postgresql and NextAuth creating a full stack
            blog webapp
          </h2>
          <div class>
            {session?.user ? (
              <>
                <Image
                  class
                  width={128}
                  height={128}
                  src={session.user.image as string}
                  alt={session.user.name as string}
                />
                <SignOut />
                <Form />
              </>
            ) : (
              <SignIn />
            )}
          </div>
          <div class>
            {posts?.map((post) => (
              <div
                key={post.id}
                class
              >
                <h2 class>{post.author?.name}:</h2>
                <p class>{post.title}</p>
                {session?.user.email === post.author?.email && (
                  <Delete id={post.id} />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
```

现在可以测试应用程序了。使用 `npm run dev` 并打开浏览器 `http://localhost:3000/`。

> 可以在此处找到该项目的完整代码，本文暂时只是实现博客最基本的最简单的功能，后续在此代码基础上持续迭代：[github.com/QuintionTan…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FQuintionTang%2Freact-blog%2Ftree%2Fdevelop "https://github.com/QuintionTang/react-blog/tree/develop")

### 总结

在本文中，学习了如何使用 Next.js、[Prisma](https://link.juejin.cn?target=https%3A%2F%2Fprisma.io "https://prisma.io")、PostgreSQL 和 [NextAuth](https://link.juejin.cn?target=https%3A%2F%2Fnext-auth.js.org "https://next-auth.js.org") 创建全栈博客。还探索了使用 Prisma 设置数据库模型，使用 NextAuth 添加身份验证，创建 API 路由，并实现博客的创建和删除组件。