%%begin highlights%%
Define Routers

Initialize tRPC

const t = initTRPC.create();
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

we are exporting certain methods of the t variable here rather than t itself. This is to establish a certain set of procedures that we will use idiomatically in our codebase.

Defining a router

define a router with a procedure

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/server/routers)
更新时间: 2023-12-18 16:30