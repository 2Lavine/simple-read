%%begin highlights%%
![](https://wd.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/hjccQNanPjTDpIajkhPU.png?auto=format)

Extensions can monitor browser events in the background using the extension's service worker. Service workers are special JavaScript environments that are loaded to handle events and terminated when they're no longer needed.

The first event our service worker will listen for is runtime.onInstalled(). This method allows the extension to set an initial state or complete some tasks on installation. Extensions can use the Storage API and IndexedDB to store the application state.

The activeTab permission grants the extension temporary ability to execute code on the currently active tab. It also allows access to sensitive properties of the current tab.

The activeTab permission allows users to purposefully choose to run the extension on the focused tab; this way, it protects the user’s privacy. Another benefit is that it does not trigger a permission warning.

There are many ways to structure an extension project; however, you must place the manifest.json file in the extension's root directory.

Extensions can run scripts that read and modify the content of a page. These are called content scripts. They live in an isolated world, meaning they can make changes to their JavaScript environment without conflicting with their host page or other extensions' content scripts.

The "matches" field can have one or more match patterns. These allow the browser to identify which sites to inject the content scripts into. Match patterns consist of three parts <scheme>://<host><path>. They can contain '*' characters

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-reading-time/)
更新时间: 2023-11-17 13:41