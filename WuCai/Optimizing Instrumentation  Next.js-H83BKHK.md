---
标题: "Optimizing:Instrumentation | Next.js"
创建时间: 2023-06-08 16:35
更新时间: 2023-06-08 16:36
笔记ID: H83BKHK
---

## 划线列表
%%begin highlights%%
If you export a function named register from this file, we will call that function whenever a new Next.js server instance is bootstrapped.

Sometimes, it may be useful to import a file in your code because of the side effects it will cause. For example, you might import a file that defines a set of global variables, but never explicitly use the imported file in your code. You would still have access to the global variables the package has declared.
You can import files with side effects in instrumentation.ts, which you might want to use in your register function as demonstrated in the following example:

import { init } from 'package-init';
export function register() {
init();
}

%%end highlights%%

## 页面笔记
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)