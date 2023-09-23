> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7269424598260498488?searchId=202309192239579E013D75689F6D3568F9)


用 Next-Auth 实现登录
================
`pages/api/auth/[...nextauth].ts`中使用`[...nextauth]`是为了动态匹配`nextauth`的所有 API 路由，如:
*   `/api/auth/callback` 处理认证回调
*   `/api/auth/signin` 处理登录
*   `/api/auth/signout` 处理登出
*   `/api/auth/session` 获取`session`等等

也就是说，使用`[...nextauth]`可以动态匹配所有包含`/api/auth/`和`nextauth`的`API`路由。


---

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


---

需要一个更准确的信息证明真的完成授权登录了？那就在首页把个人信息回显出来。这依然需要用到`next-auth`的`api`。让我们在`lib`下面新建一个文档叫做`session.ts`

```
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}
```



---
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

