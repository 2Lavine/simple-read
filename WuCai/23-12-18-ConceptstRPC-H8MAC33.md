%%begin highlights%%
What is RPC

RPC is short for "Remote Procedure Call".

With traditional HTTP/REST APIs, you call a URL and get a response. With RPC, you call a function and get a response

You call functions, and tRPC takes care of everything else. You should ignore details like HTTP Verbs, since they carry meaning in REST APIs, but in RPC form part of your function names instead, for instance: getUser(id) instead of GET /users/:id

Term

Procedure ↗	API endpoint - can be a query, mutation, or subscription.

Subscription ↗	A procedure that creates a persistent connection and listens to changes.

Router ↗	A collection of procedures (and/or other routers) under a shared namespace.

Context ↗	Stuff that every procedure can access. Commonly used for things like session state and database connections.

Middleware ↗	A function that can run code before and after a procedure. Can modify context.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/concepts)
更新时间: 2023-12-18 16:20