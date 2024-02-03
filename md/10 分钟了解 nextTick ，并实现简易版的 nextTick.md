> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7296016127552864297?utm_source=gold_browser_extension)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2f738fdb7a64e6dbe4c47bfbe0f57f9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=741&h=371&s=89400&e=png&b=2eb2fe)

前言
--

在 Vue.js 中，有一个特殊的方法 `nextTick`，它在 DOM 更新后执行一段代码，起到等待 DOM 绘制完成的作用。本文会详细介绍 `nextTick` 的原理和使用方法，并实现一个简易版的 `nextTick`，加深对它的理解。

一. 什么是 `nextTick`
-----------------

简单的说，`nextTick` 方法是在 Vue.js 中常见的一种异步更新 DOM 的机制。它的原理是利用 JavaScript 的事件循环机制以及浏览器的渲染流程来实现延迟执行 DOM 更新操作。

它的出现主要是为了解决 Vue 的异步更新导致的 DOM 更新后的操作问题。

在 Vue 中，数据的变化会触发重新渲染 DOM，但实际上，Vue 的数据更新是异步的。也就是说，当我们修改了 Vue 实例的数据后，并不会立即进行 DOM 更新，而是在下一个事件循环中才会进行。

这个异步更新机制的设计是为了优化性能。Vue 会对进行多次数据变化进行合并，然后在下一个事件循环中进行一次性的 DOM 更新，从而减少不必要的 DOM 操作，提高性能。

然而，由于异步更新的机制，有时候可能在修改数据后需要立即执行一些 DOM 操作，例如获取到更新后的 DOM 元素、更新后的样式计算、触发一些特定事件等。这时候就需要使用 `nextTick` 方法了。

`nextTick` 方法是 Vue 提供的一个实用工具，它能够将回调函数延迟到下一个 DOM 更新循环之后执行。也就是说，通过 `nextTick` 方法，我们可以确保在 DOM 更新完成后执行某些操作。

使用 `nextTick` 方法经常用来解决以下问题：

*   获取更新后的 DOM 元素
    
*   更新后的样式计算
    
*   触发一些特定事件
    

综上所述，`nextTick` 的出现解决了 Vue 的异步更新机制导致的 DOM 更新后的操作问题，使我们能够在正确的时机执行对应的操作，提高开发效率和灵活性。

二. 实现原理
-------

具体而言，当我们在代码中使用 `nextTick` 方法时，框架会将待更新的 DOM 操作推入一个队列中，然后在当前 JavaScript 任务执行完成之后，利用**宏任务**或**微任务**（具体取决于框架和浏览器实现）的机制进行执行，以确保代码逻辑执行完成后再去操作 DOM。

这样的设计能够确保在当前 JavaScript 运行环境中的任何同步操作完成之后才进行 DOM 的更新，以避免因为 DOM 更新带来的重排或重绘可能导致的性能问题。同时，通过使用异步更新机制，还能够更好地管理大量 DOM 更新的情况，优化渲染性能。

需要注意的是，虽然 `nextTick` 方法通常被封装在框架中使用，但在一些现代浏览器中也可以直接使用原生的 `Promise` 或 `MutationObserver` 等来实现类似的异步更新效果。具体实现方式可能会根据不同的框架和浏览器而有所不同。

`nextTick` 方法会在下一次 DOM 更新循环结束后执行一个回调函数。这样我们就能确保在操作 DOM 元素之前，DOM 已经更新完成。它通过一些异步的技术来实现，确保回调函数被添加到队列中，并在下一个 tick 执行。

三. 使用场景
-------

下面是我们在日常开发中，几个使用 `nextTick` 方法的应用场景：

### 1. 操作更新后的 DOM

当需要对更新后的 DOM 进行操作时，在使用 Vue.js 或其他类似框架的情况下，可以将 DOM 操作代码包裹在 `nextTick` 的回调函数中。这样可以确保 DOM 更新已经完成，并且在下一个 **「DOM 更新循环」** 中执行操作，避免出现操作未生效的问题。

```
<template>
  <div class="is-pd-50">
    <p>消息：{{ message }}</p>
    <el-button type="primary" @click="updateMessage">更新消息</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '原始消息'
    }
  },
  methods: {
    updateMessage() {
      this.message = '更新后的消息'
      // 消息更新后立即输出 DOM 信息
      this.getText()
      this.$nextTick(() => {
        // 在 nextTick 的回调函数输出 DOM 信息
        this.getText()
      })
    },
    getText() {
      // 操作更新后的 DOM
      const messageElement = document.querySelector('p')
      // 输出：更新后的消息
      console.log(messageElement.textContent)
    }
  }
}
</script>
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b65fde30ab69423fa4519e2b3acfc22f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=910&h=260&s=20408&e=gif&f=18&b=fefefe)

> 注意：以上的代码仅用于示例作用，在 Vue 中不建议直接操作 DOM 元素

当点击 **「更新消息」** 按钮时，`updateMessage` 方法会将 `message` 的值更新为 **「更新后的消息」**。在 `$nextTick` 的回调函数中，我们可以通过选择器获取到更新后的 DOM 元素，并进行相应的操作。

### 2. 异步更新后的操作

当需要在 DOM 更新后执行一些异步操作时，如在表单数据更新后提交表单、在列表数据更新后进行滚动定位等，可以在 `nextTick` 回调函数中触发相应的异步操作。这样可以保证在下一个事件循环周期中执行操作，以确保更新已经完成。

```
<template>
  <div class="is-pd-20">
    <button @click="updateItems">更新列表</button>

    <ul>
      <li v-for="item in items" :key="item.id" class="item">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  created() {
    // 生成 10 个 li 元素
    this.items = Array.from({ length: 10 }, (item, index) => {
      return { id: index + 1, name: `Item ${index + 1}` }
    })
  },
  methods: {
    updateItems() {
      // 异步更新数据
      setTimeout(() => {
        // 新加入一个元素 li
        this.items.push({ id: this.items.length + 1, name: `Item ${this.items.length + 1}` })
        this.$nextTick(() => {
          // 在更新后的 DOM 中进行滚动定位到最后一个 li 元素
          const lastItem = document.querySelector('li.item:last-child')
          lastItem.scrollIntoView({ behavior: 'smooth' })
        })
      }, 1000)
    }
  }
}
</script>
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80cd029c8b8f4b26a2e7d91024816cf8~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1000&h=376&s=140723&e=gif&f=20&b=fdfcfc)

当点击 **「更新列表」** 按钮时，`updateItems` 方法会通过异步操作向 `items` 数组中添加新的项。在 `$nextTick` 的回调函数中，我们可以在 DOM 更新后将最后一个项滚动到可视区域。

通过以上两个示例，我们可以看到 `nextTick` 的应用场景，其中关键就是将需要在 DOM 更新后进行操作的代码放在 `nextTick` 的回调函数中，以确保更新已经完成。同时，可以结合异步操作来优化用户体验或性能。

四. 如何实现一个简易版的 `nextTick`
------------------------

当我们在 Vue 中自己实现一个类似 `$nextTick` 的方法时，可以考虑使用 JavaScript 的 `Promise` 和 `MutationObserver` 来模拟其行为，下面我们具体来看一下吧：

```
// 自定义的 $nextTick 方法
Vue.prototype.$myNextTick = function () {
  return new Promise((resolve) => {
    if (typeof MutationObserver !== "undefined") {
      // 使用 MutationObserver 监听 DOM 变化
      let observer = new MutationObserver(resolve);
      let textNode = document.createTextNode("1");
      observer.observe(textNode, {
        characterData: true,
      });
      textNode.textContent = "2";
    } else {
      // fallback 方案，使用 setTimeout 模拟异步
      setTimeout(resolve, 0);
    }
  });
};
```

1.  首先，我们在 `Vue.prototype` 上添加了一个名为 `$myNextTick` 的方法。通过在 `prototype` 对象上添加该方法，我们可以在 Vue 的实例上使用 `$myNextTick` 方法。
    
2.  `Vue.prototype.$myNextTick` 方法内部返回了一个 `Promise` 对象。通过返回 `Promise` 对象，我们可以使用 `.then` 或 `async/await` 语法来处理 `Promise` 的解析。
    
3.  在方法的 Promise 回调函数中，我们首先检查当前环境是否支持 `MutationObserver`。`MutationObserver` 是一个用于异步监听 DOM 变化的 API。
    
4.  如果当前环境支持 `MutationObserver`，我们会创建一个 `MutationObserver` 实例，并将它的回调函数设置为 `resolve`。我们创建了一个文本节点，并将其添加到 DOM 中，然后通过修改文本节点的内容来触发 DOM 变化。当 DOM 变化时，`MutationObserver` 的回调函数 `resolve` 就会被调用。
    
5.  如果当前环境不支持 `MutationObserver`，我们将使用 `setTimeout` 来模拟异步操作。我们使用一个 0 毫秒的延迟来确保 `resolve` 在下一个事件循环中执行，模拟了异步的效果。
    

完成了简易版`$nextTick`后，下面看一下如何使用 `$myNextTick` 吧：

```
// 示例组件
new Vue({
  el: "#app",
  data() {
    return {
      message: "Hello, Vue!",
    };
  },
  methods: {
    updateMessage() {
      this.message = "Updated Message";

      this.$myNextTick().then(() => {
        console.log("DOM 已更新");
        // 在 DOM 更新后进行其他操作
      });
    },
  },
});
```

在这个示例中，当点击按钮时，会调用 `updateMessage` 方法，该方法会将 `message` 的值更新为 **「Updated Message」**。然后通过 `$myNextTick` 方法返回的 `Promise` 对象来确保在 DOM 更新之进行其他操作。

通过这样的实现，我们可以在 Vue 组件中使用 `$myNextTick` 方法来执行在 DOM 更新后的操作，类似于 Vue 原生的 `$nextTick` 方法的效果。

> 注意，这只是一种模拟实现，其目的为了加深对 Vue 版 `$nextTick` 的理解，代码可能无法完全复制 Vue 原生的 `$nextTick` 的行为。因此，在实际开发中，建议还是使用 Vue 提供的内置 `$nextTick` 方法来保证更准确和可靠的 DOM 更新后操作。

五. 注意事项
-------

在使用 `nextTick` 方法时，需要注意以下几点：

*   `nextTick` 方法是一个实例方法，在 Vue 组件中可以直接使用，但在其他地方需要通过 Vue 实例来调用，例如：`this.$nextTick()`
    
*   `nextTick` 方法是异步的，回调函数会在下一次 DOM 更新循环结束后执行，因此并不是立即执行的。
    
*   `nextTick` 方法支持使用 Promise 或返回 Promise 的函数来进行链式调用。
    

总结
--

`nextTick` 方法是 Vue.js 框架中重要的一个特殊方法。它能够确保在 DOM 更新完成后执行回调函数，适用于获取最新的 DOM 和操作更新后的 DOM。在实际开发中，合理运用 `nextTick` 方法能够帮助我们避免一些潜在的问题，提高代码的可靠性。

希望本篇文章能够帮助你更好地理解和使用 `nextTick` 方法，如果有任何错误，敬请指出!

如果本篇文章对你有所帮助，恳请千万不要吝啬您的小手，一键三连（**点赞、收藏、关注**）再走吧！感谢有你！