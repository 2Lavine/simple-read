%%begin highlights%%
Adapters

tRPC is not a server on its own, and must therefore be served using other hosts, such as a simple Node.js HTTP Server, Express, or even Next.js.

Most tRPC features are the same no matter which backend you choose.

Adapters act as the glue between the host system and your tRPC API.

Adapters typically follow some common conventions, allowing you to set up context creation via createContext, and globally handle errors via onError,

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://trpc.io/docs/server/adapters)
更新时间: 2023-12-18 16:33