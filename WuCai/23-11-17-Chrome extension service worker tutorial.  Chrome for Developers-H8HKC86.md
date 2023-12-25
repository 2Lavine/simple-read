%%begin highlights%%
Extensions register their service worker in the manifest, which only takes a single JavaScript file. There's no need to call navigator.serviceWorker.register(), like you would in a web app

For better maintainability, we will implement each feature in a separate module. First, we need to declare the service worker as an ES Module in our manifest, which allows us to import modules in our service worker:

Did you notice that inspecting the service worker woke it up? That's right! Opening the service worker in the devtools will keep it active. To make sure that your extension behaves correctly when your service worker is terminated, remember to close the DevTools.

Chrome will shut down service workers if they are not needed. We use the chrome.storage API to persist state across service worker sessions. For storage access, we need to request permission in the manifest:

All event listeners need to be statically registered in the global scope of the service worker. In other words, event listeners should not be nested in async functions. This way Chrome can ensure that all event handlers are restored in case of a service worker reboot.
In this example, we are going to use the chrome.omnibox API, but first we must declare the omnibox keyword trigger in the manifest:

{
...
"minimum_chrome_version": "102",
"omnibox": {
"keyword": "api"
},
}

The setTimeout() or setInterval() methods are commonly used to perform delayed or periodic tasks. However, these APIs can fail because the scheduler will cancel the timers when the service worker is terminated. Instead, extensions can use the chrome.alarms API.
Start by requesting the "alarms" permission in the manifest. Additionally, to fetch the extension tips from a remote hosted location, you need to request host permission:

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-quick-reference/)
更新时间: 2023-11-17 15:09