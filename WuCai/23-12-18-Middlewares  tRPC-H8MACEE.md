%%begin highlights%%
The middleware(s) will wrap the invocation of the procedure and must pass through its return value.

const isAdmin = middleware(async (opts) => {
const { ctx } = opts;
if (!ctx.user?.isAdmin) {
throw new TRPCError({ code: 'UNAUTHORIZED' });
}
return opts.next({
ctx: {
user: ctx.user,
},
});
});
export const adminProcedure = publicProcedure.use(isAdmin);

Context Extension​

"Context Extension" enables middlewares to dynamically add and override keys on a base procedure's context in a typesafe manner.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/server/middlewares)
更新时间: 2023-12-18 16:47