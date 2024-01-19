%%begin highlights%%
context holds data that all of your tRPC procedures will have access to

is a great place to put things like database connections or authentication information.

Setting up the context is done in 2 steps, defining the type during initialization and then creating the runtime context for each request.

Defining the context type

When initializing tRPC using initTRPC, you should pipe .context<TContext>() to the initTRPC builder function before calling .create()

Creating the context​

createContext() is called for each invocation of tRPC, so batched requests will share a context.

const handler = createHTTPHandler({
router: appRouter,
createContext,
});

Inner and outer context​

Inner context is where you define context which doesn’t depend on the request, e.g. your database connection.

Outer context is where you define context which depends on the request, e.g. for the user's session

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/server/context)
更新时间: 2023-12-18 16:42