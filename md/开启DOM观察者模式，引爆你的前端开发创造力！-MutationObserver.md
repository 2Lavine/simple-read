> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7249665935786229819)

观察者 `API` 家族，全部文章列表，欢迎点赞收藏

1.  IntersectionObserver - [《探秘神奇的 IntersectionObserver：释放网页性能的黑科技！》](https://juejin.cn/post/7247045258842996794 "https://juejin.cn/post/7247045258842996794")
2.  ResizeObserver - [《尺寸变化的魔术师：ResizeObserver 的神奇力量》](https://juejin.cn/post/7248832185808175141 "https://juejin.cn/post/7248832185808175141")
3.  MutationObserver - [《开启 DOM 观察者模式，引爆你的前端开发创造力！ - MutationObserver》](https://juejin.cn/post/7249665935786229819 "https://juejin.cn/post/7249665935786229819")
4.  PerformanceObserver - 待完成

引言
==

最早接触 `MutationObserve` 这个 `API`，是在蓝湖工作的时候，在做用户行为采集系统，名字叫做 **userview** ，用户行为就在你眼前，是一个集行为采集、数据分析、自动埋点和场景还原等多功能为一体的平台。其中录制功能类似 [rrweb](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frrweb-io%2Frrweb "https://github.com/rrweb-io/rrweb") 但那时候 **rrweb** 还很落后，对标产品是 [fullstory](https://link.juejin.cn?target=https%3A%2F%2Fwww.fullstory.com%2F "https://www.fullstory.com/")。 以上产品，全部都基于一个关键技术实现，那就是今天的主角 `MutationObserver`，基于这个 `API` 的更多产品还在诞生，其中 **fullstory** 在疫情几年逆流而上完成几轮融资，可以说 `MutationObserver` 真正引爆了前端**开发创造力**。

基于笔者过去使用 `MutationObserver` 的经验总结:

1.  简单介绍下 `MutationObserver API`
2.  介绍多个应用场景
    *   网站行为采集（rrweb、fullstory 原理）
    *   白屏检测
    *   其他 Observer 的 polyfill
    *   编辑器自动保存
    *   防止水印被删除
    *   保护 DOM 结构（及时删除广告等）
    *   表单验证
    *   vue $nexttick
    *   实时搜索和过滤
    *   文本输入时做出反应
    *   色块小游戏脚本
3.  总结使用经验
4.  提醒注意事项

> 文章约 7000 字，阅读时长 20 - 30 分钟，欢迎点赞收藏

简介
==

背景
--

`MutationObserver` 出现的时间是在 2012 年。它是在 `W3C（World Wide Web Consortium）` 的 `DOM` 规范的 `Level 4` 中被引入的。`MutationObserver` 的目标是解决传统的 `DOM` 变化监听方式的局限性和性能问题，并提供更高效、灵活的 `DOM` 变化监视机制。 在过去，开发人员使用 `DOM` 事件监听或定时器轮询的方式来监视 `DOM` 的变化。然而，这些方式都存在一些问题，如性能低下、无法捕捉细微变化等。为了解决这些问题，`MutationObserver` 被提出并引入到浏览器中，作为一种新的 `DOM` 变化监视的机制。  
`MutationObserver` 的出现不仅满足了实时 `DOM` 监测的需求，还推动了前端开发的发展。它为开发者提供了更灵活、高效的解决方案，使得我们能够创造出更具交互性和动态性的 `Web` 应用程序。`MutationObserver` 的背景和诞生，正是对于前端领域需求的深思熟虑和创新突破的产物，为我们开启了实时 `DOM` 监测的全新时代。

使用说明
----

`MDN` 简介请点击 [MutationObserver](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver")

> 简单摘要：
> 
> ### [构造函数](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%23%25E6%259E%2584%25E9%2580%25A0%25E5%2587%25BD%25E6%2595%25B0 "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0")
> 
> [`MutationObserver()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%2FMutationObserver "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver") 创建并返回一个新的 `MutationObserver` 它会在指定的 DOM 发生变化时被调用。
> 
> ### [方法](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%23%25E6%2596%25B9%25E6%25B3%2595 "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver#%E6%96%B9%E6%B3%95")
> 
> [`disconnect()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%2Fdisconnect "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/disconnect")  
> 阻止 `MutationObserver` 实例继续接收的通知，直到再次调用其 [`observe()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%2Fobserve "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe") 方法，该观察者对象包含的回调函数都不会再被调用。  
> [`observe()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%2Fobserve "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe")  
> 配置 `MutationObserver` 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。  
> [`takeRecords()`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationObserver%2FtakeRecords "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/takeRecords")  
> 从 `MutationObserver` 的通知队列中删除所有待处理的通知，并将它们返回到 [`MutationRecord`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMutationRecord "https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord") 对象的新 [`Array`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array") 中。

基础使用示例如下：

```
// 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

兼容性
---

兼容性非常棒，是 `Observer API` 家族中兼容性最好的 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/419e2e05a070464086c5553d096efc46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

应用
==

网站行为采集
------

要实现这个功能，我们需要记录相关的 `DOM` 节点的创建以及后续的销毁等行为，`MutationObserver` 正好可以用来完成这一功能。首先要了解 `MutationObserver` 的触发方式为**批量异步**回调，具体来说就是会在一系列 `DOM` 变化发生之后将这些变化一次性回调，传出的是一个 `mutation` 记录数组。

这一机制在常规使用时不会有问题，因为从 `mutation` 记录中我们可以获取到变更节点的 `JS` 对象，可以做很多等值比较以及访问父子、兄弟节点等操作来保证我们可以精准回放一条 `mutation` 记录。 下面是一个使用 `MutationObserver` 进行按钮点击事件监测的简单代码示例：

```
// 目标按钮的选择器
const targetButtonSelector = '.btn';

// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
  // 遍历每个 DOM 变化记录
  for (const mutation of mutationsList) {
    // 检查是否是节点的子节点发生了变化
    if (mutation.type === 'childList') {
      // 遍历每个新增的节点
      for (const addedNode of mutation.addedNodes) {
        // 检查新增节点是否是目标按钮
        if (addedNode.matches && addedNode.matches(targetButtonSelector)) {
          // 捕获按钮点击事件
          addedNode.addEventListener('click', (event) => {
            // 在此处执行数据采集或其他相应操作
            console.log('按钮被点击了');
          });
        }
      }
    }
  }
});

// 监视整个文档根节点的子节点变化
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// 停止监听
// observer.disconnect();
```

> 要实现【采集】-【回放】的整个过程还需要很多其他技术配合，感兴趣的可以参考 `rrweb` 和 `fullstory` 原理

> 注意: 在使用 `MutationObserver` 进行网站行为采集时，应遵守相关隐私和数据保护法规，确保用户数据的合法采集和使用，并提供透明的隐私政策。

白屏检测
----

白屏检测对于保障用户体验、优化性能、确保页面可用性以及快速故障排查都具有重要的意义。通过及时监测和处理白屏情况，可以提升网站的质量和用户满意度，提供更好的用户体验。 但是白屏检测往往是比较难和准的，`MutationObserver` 提供了一种机制，通过调用 `observer.observe()` 方法开始监视整个文档根节点的子节点变化。在回调函数中检查 `DOM` 变化记录的类型，如果是子节点变化，则通过判断页面是否还有子节点来判断页面的状态。如果页面没有子节点，即页面处于白屏状态；否则，页面已经加载完成。 代码如下：

```
// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
  // 遍历每个 DOM 变化记录
  for (const mutation of mutationsList) {
    // 检查是否是节点的子节点发生了变化
    if (mutation.type === 'childList') {
      // 检查页面是否还有子节点
      if (document.body.childNodes.length === 0) {
        // 页面处于白屏状态
        console.log('页面处于白屏状态');
      } else {
        // 页面已经加载完成
        console.log('页面加载完成');
      }
    }
  }
});

// 监视整个文档根节点的子节点变化
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// 停止监听
// observer.disconnect();
```

其他 Observer 的 polyfill
----------------------

`MutationObserver` 因为本身兼容性比较高，因此可以作为其他 `Observer` 的 `polyfill` 用于提供浏览器不支持的观察者功能。 下面是作为 `ResizeObserver polyfill` 的示例：

```
function createResizeObserver(element, callback) {
  let lastSize = getElementSize(element);

  const observer = new MutationObserver(() => {
    const newSize = getElementSize(element);

    if (newSize.width !== lastSize.width || newSize.height !== lastSize.height) {
      callback(newSize);
      lastSize = newSize;
    }
  });

  observer.observe(element, { attributes: true, childList: true, subtree: true });

  return observer;
}

function getElementSize(element) {
  const { width, height } = element.getBoundingClientRect();
  return { width, height };
}
```

> 注意：各 `Observer API` 都有非常全面的 `polyfill`，请使用经过验证的库。这里只是演示 `MutationObserver` 的一个作用

编辑器自动保存
-------

`MutationObserver` 在编辑器自动保存场景中可以用于监测编辑器内容的变化，从而实现自动保存功能。通过监听编辑器内容的变化，可以在用户输入或编辑内容时自动触发保存操作，避免用户因意外关闭页面或其他原因导致的数据丢失。以下是一个简单的示例代码，演示了如何利用 `MutationObserver` 实现编辑器的自动保存功能：

```
// 目标编辑器元素
const editor = document.getElementById('editor');

// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
  // 编辑器内容发生变化时触发保存操作
  saveEditorContent();
});

// 监视编辑器内容的子节点变化
observer.observe(editor, { childList: true, subtree: true });

// 保存编辑器内容的函数
function saveEditorContent() {
  // 执行保存操作，可以通过 Ajax 请求或其他方式将内容发送到服务器进行保存
  console.log('正在保存编辑器内容...');
}

// 停止监听
// observer.disconnect();
```

> 注意: 在不需要自动保存时，应当调用 `observer.disconnect()` 方法停止监听，以避免不必要的资源消耗。

防止水印被删除
-------

`MutationObserver` 可以用于防止水印被删除的场景，通过监测相关元素的变化，可以检测到水印元素是否被删除或修改，并及时进行恢复。下面是一个简单的示例代码，演示了如何利用 `MutationObserver` 来保护水印元素：

```
// 目标水印元素
const watermark = document.getElementById('watermark');

// 创建 MutationObserver 实例
const observer = new MutationObserver(() => {
  // 水印元素发生变化时重新添加水印
  restoreWatermark();
});

// 监视水印元素的父节点变化
observer.observe(watermark.parentNode, { childList: true });

// 恢复水印的函数
function restoreWatermark() {
  // 检查水印元素是否存在，若不存在则重新添加
  if (!document.contains(watermark)) {
    // 重新添加水印到目标位置
    // ...
    console.log('水印被删除，已恢复');
  }
}

// 停止监听
// observer.disconnect();
```

通过利用 `MutationObserver` 来保护水印元素，可以有效防止水印被意外删除或修改，提高水印的可靠性和持久性。

保护 DOM 结构（及时删除广告等）
------------------

`MutationObserver` 可以用于保护 `DOM` 结构，及时删除广告或不需要的元素。通过监听 `DOM` 的变化，可以检测到广告元素的插入或修改，并及时进行删除或隐藏。下面是一个简单的示例代码，演示了如何利用 `MutationObserver` 来保护 `DOM` 结构：

```
// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
  // 遍历每个 DOM 变化
  for (const mutation of mutationsList) {
    // 检查是否有广告元素的插入或修改
    if (isAdElement(mutation.target) || hasAdDescendants(mutation.target)) {
      // 删除或隐藏广告元素
      removeAdElement(mutation.target);
    }
  }
});

// 监视整个文档根节点的子节点变化
observer.observe(document.documentElement, { childList: true, subtree: true });

// 删除或隐藏广告元素的函数
function removeAdElement(element) {
  // 删除或隐藏广告元素，可以根据具体需求来实现
  // element.remove(); // 删除广告元素
  // element.style.display = 'none'; // 隐藏广告元素
  console.log('广告已删除或隐藏');
}

// 检查元素是否为广告元素的辅助函数
function isAdElement(element) {
  // 根据元素的特征、类名、属性等判断是否为广告元素
  // 返回布尔值
  // ...
}

// 检查元素及其子孙节点是否包含广告元素的辅助函数
function hasAdDescendants(element) {
  // 递归检查元素的子孙节点是否包含广告元素
  // 返回布尔值
  // ...
}

// 停止监听
// observer.disconnect();
```

> 注意: 对广告元素的处理可以根据具体情况来选择删除或隐藏。删除广告元素可以彻底清除它们，而隐藏广告元素则可以在页面上隐藏它们，但仍保留其占用的空间。

表单验证
----

`MutationObserver` 在表单验证场景中可以用于实时监测表单字段的变化，并进行即时的验证和错误提示。通过监听表单字段的变化，可以对用户的输入进行实时验证，提供即时反馈和错误提示，从而改善用户体验。以下是一个简单的示例代码，演示了如何利用 `MutationObserver` 实现表单验证：

```
// 目标表单元素
const form = document.getElementById('myForm');

// 创建 MutationObserver 实例
const observer = new MutationObserver(() => {
  // 表单字段发生变化时进行验证
  validateForm();
});

// 监视表单元素的子节点变化
observer.observe(form, { childList: true, subtree: true });

// 表单验证的函数
function validateForm() {
  // 遍历表单字段进行验证
  const fields = form.querySelectorAll('input, textarea, select');
  for (const field of fields) {
    const isValid = validateField(field);
    if (!isValid) {
      displayError(field);
    } else {
      removeError(field);
    }
  }
}

// 验证单个表单字段的函数
function validateField(field) {
  // 根据字段的值进行验证，并返回布尔值
  // ...
}

// 显示字段错误提示的函数
function displayError(field) {
  // 显示字段的错误提示，可以根据具体需求来实现
  // ...
}

// 移除字段错误提示的函数
function removeError(field) {
  // 移除字段的错误提示，可以根据具体需求来实现
  // ...
}

// 停止监听
// observer.disconnect();
```

通过利用 `MutationObserver` 实现表单验证，可以实现实时的字段验证和错误提示，提供更好的用户体验和数据完整性。

vue $nexttick
-------------

`vue $nextTick` 将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务，提供了四种异步方法 `Promise.then`、`MutationObserver`、`setImmediate`、`setTimeout(fn,0)`，这里展示下 `MutationObserver` 的实现示例：

```
// 创建 MutationObserver 实例
const observer = new MutationObserver(() => {
  // DOM 更新后执行回调
  performCallback();
});

// 监视目标元素的子节点变化
observer.observe(document.body, { childList: true, subtree: true });

// 在 DOM 更新后执行的回调函数
function performCallback() {
  // 执行需要在 DOM 更新后进行的操作
  // ...
  console.log('Performing callback after DOM update');
}

// 触发 DOM 更新，例如在 Vue 的异步更新后调用
// Vue.nextTick(() => {
//   // ...
// });
```

实时搜索和过滤
-------

`MutationObserver` 在实时搜索和过滤场景中可以用于监测搜索条件的变化，并在每次搜索条件发生变化时触发搜索或过滤操作。通过监听搜索条件的变化，可以及时响应用户的输入，并实时更新搜索结果或过滤列表，提供更好的搜索体验。以下是一个简单的示例代码，演示了如何利用 `MutationObserver` 实现实时搜索和过滤：

```
// 目标搜索输入框元素
const searchInput = document.getElementById('searchInput');

// 创建 MutationObserver 实例
const observer = new MutationObserver(() => {
  // 搜索条件发生变化时执行搜索或过滤操作
  performSearch();
});

// 监视搜索输入框的值变化
observer.observe(searchInput, { characterData: true, subtree: true });

// 搜索或过滤操作的函数
function performSearch() {
  // 获取搜索输入框的值
  const searchValue = searchInput.value.trim();

  // 执行搜索或过滤操作，根据具体需求来实现
  // ...
  console.log('Performing search or filter: ' + searchValue);
}

// 停止监听
// observer.disconnect();
```

通过利用 `MutationObserver` 实现实时搜索和过滤，可以实现对搜索条件的实时监测，并及时响应用户的输入，从而提供更好的搜索体验和结果展示。

文本输入时做出反应
---------

来自[这篇文章](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Froger-hiro%2FBlogFN%2Fissues%2F8 "https://github.com/roger-hiro/BlogFN/issues/8")的应用示例： 基本使用是：

```
const target = document.getElementById('target-id')
const observer = new MutationObserver(records => {
  // 输入变更记录
})

// 开始观察
observer.observe(target, {
  characterData: true
})
```

> 这里可以有几种处理。
> 
> *   聊天的气泡框彩蛋，检测文本中的指定字符串 / 表情包，触发类似微信聊天的表情落下动画。
> *   输入框的热点话题搜索，当输入 “`#`” 号时，启动搜索框预检文本或高亮话题。
> 
> 有个`Vue`的小型插件就是这么实现的： [vue-hashtag-textarea](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmitsuyacider%2Fvue-hashtag-textarea "https://github.com/mitsuyacider/vue-hashtag-textarea")

色块小游戏脚本
-------

来自[这篇文章](https://link.juejin.cn?target=https%3A%2F%2Fbenhuang.info%2F2019%2F02%2F20%2Fhacking-the-color-picker-game-mutationobserver%2F "https://benhuang.info/2019/02/20/hacking-the-color-picker-game-mutationobserver/")的示例

> 游戏的逻辑很简单，当中间的色块颜色改变时，在时间限制内于底下的选项选择跟它颜色一样的选项就得分。难的点在于越后面的关卡选项越多，而且选项颜色也越相近  
> 其实原理非常简单，就是观察色块的`backgroundColor`（属性变化`attributes`)，然后触发点击事件`e.click()`。

```
var targetNode = document.querySelector('#kolor-kolor');
var config = { attributes: true };
var callback = function(mutationsList, observer) {
    if (mutationsList[0].type == 'attributes') {
        console.log('attribute change!');
        let ans = document.querySelector('#kolor-kolor').style.backgroundColor;
        document.querySelectorAll('#kolor-options a').forEach( (e) => {
            if (e.style.backgroundColor == ans) {
                e.text = 'Ans!';
                e.click()
            }
        })
    }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);
```

最佳实践
====

以下是一些 `MutationObserver` 的最佳实践：

1.  精确指定目标：在创建 `MutationObserver` 实例时，明确指定要观察的目标元素，避免过于宽泛的监测范围。这可以提高性能并减少不必要的回调触发。
2.  选择合适的观察选项：根据需求选择合适的观察选项。常见的选项包括 `childList`（监听子节点的变化）、`attributes`（监听属性的变化）、`characterData`（监听文本节点内容的变化）等。根据实际情况，只选择需要监测的选项，避免监听不必要的变化。
3.  使用 `disconnect` 方法停止监听：在不再需要监听的时候，调用 `disconnect` 方法停止 `MutationObserver` 的监听。这可以释放资源并避免不必要的回调触发。
4.  避免频繁的回调触发：回调函数可能会在短时间内多次触发，尤其是在监测范围较大或有频繁变化的情况下。在回调函数中尽量避免执行耗时操作，以免影响性能。
5.  结合其他技术和优化手段：`MutationObserver` 可以与其他技术和优化手段结合使用，以实现更好的效果。例如，可以结合 `Debounce` 或 `Throttle` 技术来限制回调函数的触发频率，以减少频繁的回调。
6.  浏览器兼容性考虑：`MutationObserver` 在大多数现代浏览器中得到支持，但仍需注意浏览器的兼容性。如果需要在旧版本的浏览器中使用 `MutationObserver`，可以考虑使用 `polyfill` 或其他替代方案。
7.  回调函数执行时间：回调函数在每次 `DOM` 更新之后都会被触发，因此应尽量避免在回调函数中执行耗时操作，以免影响页面的响应性能。

注意事项
====

`MutationObserver` 在使用过程中可能会遇到一些潜在的坑，下面列举了一些常见的问题和注意事项：

1.  回调函数的执行顺序不确定：`MutationObserver` 的回调函数是异步执行的，并不能保证执行顺序和 `DOM` 变化的顺序完全一致。因此，在回调函数中不应该依赖于 `DOM` 变化的顺序来进行操作。
2.  无法监测样式变化：`MutationObserver` 默认无法监测样式的变化，只能监测到 `DOM` 结构的变化。如果需要监测样式的变化，可以使用 `CSSOM` 或其他技术进行检测。
3.  无法监测属性的初始值变化：`MutationObserver` 只能监测到属性的后续变化，而无法监测到属性初始值的变化。如果需要监测属性初始值的变化，可以通过其他方法进行检测，如在元素创建之前记录初始值。
4.  可能触发多次回调：在某些情况下，`MutationObserver` 可能会在短时间内触发多次回调，尤其是当监测范围较大或有频繁的 `DOM` 变化时。因此，在回调函数中应考虑回调的频率和性能消耗，避免执行过多的耗时操作。
5.  无法跨域监测和操作：由于浏览器的安全策略限制，`MutationObserver` 无法跨域监测和操作 `DOM`。只能在同域的情况下使用 `MutationObserver` 进行 `DOM` 监测。
6.  不支持 `IE9` 及以下版本：`MutationObserver` 不支持 `IE9` 及以下版本的浏览器，如果需要在旧版本的浏览器中使用 `MutationObserver`，可以考虑使用 `polyfill` 或其他替代方案。
7.  注意 DOM 修改的影响：在回调函数中对 DOM 进行修改可能会触发新的 `DOM` 变化，从而再次触发 `MutationObserver` 的回调函数。这可能导致无限循环的情况发生，因此在修改 `DOM` 时要小心谨慎。

最后
==

`MutationObserver` 的出现极大地拓宽了前端开发的思路和应用场景。它使开发者能够更好地捕捉和处理 `DOM` 的变化，实现更丰富、更高效的交互体验和页面操作。通过灵活运用 `MutationObserver`，开发者可以发挥前端开发的创造力，提供优秀的用户体验和功能。