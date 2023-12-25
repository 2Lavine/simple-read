%%begin highlights%%
manifest.json. This JSON object describes the extension's capabilities and configuration

most manifest files contain an "action" key which declares the image Chrome should use as the extension's action icon and the HTML page to show in a popup when the extension's action icon is clicked.

xtension's manifest is the only required file that must have a specific file name: manifest.json

It also has to be located in the extension's root directory. The manifest records important metadata, defines resources, declares permissions, and identifies which files to run in the background and on the page

extension service worker handles and listens for browser events.

here are many types of events, such as navigating to a new page, removing a bookmark, or closing a tab. It can use all the Chrome APIs, but it cannot interact directly with the content of web pages; that’s the job of content scripts.

Content scripts execute Javascript in the context of a web page. They can also read and modify the DOM of the pages they're injected into.

Content Scripts can only use a subset of the Chrome APIs but can indirectly access the rest by exchanging messages with the extension service worker.

The popup and other pages
An extension can include various HTML files, such as a popup, an options page, and other HTML pages.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/)
更新时间: 2023-11-17 13:19