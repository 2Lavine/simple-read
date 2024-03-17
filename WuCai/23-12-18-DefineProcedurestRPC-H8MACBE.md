%%begin highlights%%
Procedures

A procedure is a function which is exposed to the client

Writing procedures

t object you create during tRPC setup returns an initial t.procedure which all other procedures are built on

Reusable "Base Procedures

we recommend you rename and export t.procedure as publicProcedure, which then makes room for you to create other named procedures for specific use cases and export those too

const authorizedProcedure = publicProcedure
.input(z.object({ townName: z.string() }))
.use((opts)

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/server/procedures)
更新时间: 2023-12-18 16:27