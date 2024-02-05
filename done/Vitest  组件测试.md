> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7129667747134308389?searchId=202401261549374C48CC23171B271C060A)

什么是 Vitest？
-----------
在测试过程中使用 Vite 开发服务器来转换你的文档，并监听你的应用程序的相同配置（通过`vite.config.js`），从而消除了使用 Jest 等测试替代品所涉及的重复工作。
- 与 Jest 兼容
- 开箱即用的 ESM、Typescript 和 JSX 支持，并且由 **esbuild** 提供支持。

为什么选择 Vitest？
-------------
Vite 是一个构建工具，
- 开箱即用，支持常见的 web 模式、`glob`导入和 **SSR** 等功能。
- 将 Jest 等框架与 Vite 一起使用，导致 Vite 和 Jest 之间有很多重复的配置，而 Vitest 解决了这一问题，它消除了为我们的应用程序编写单元测试所需的额外配置。
- Vitest 使用与 Vite 相同的配置，并在开发、构建和测试时共享一个共同的转换管道。它还可以使用与 Vite 相同的插件 API 进行扩展，并与 Jest 的 API 兼容，以方便从 Jest 迁移，而不需要做很多重构工作。

Vitest 配置
---------
**vite.config.js**
```
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
    plugins: [vue()],
    //add test to vite config
    test: {
        // ...
    },
});
```
为 TypeScript 配置 Vitest 是类似的，但如果从 Vite 导入 `defineConfig`，我们需要在配置文档的顶部使用三斜线命令添加对 Vitest 类型的引用。
```
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        // ...
    },
});
```


测试内容
---------
我们的测试需要检查以下内容：
*   该组件根据通知类型渲染出正确的样式。
*   当 `message` 为空时，通知就会逐渐消失。
*   当关闭按钮被点击时，该组件会发出一个事件。

为了测试这些功能，在项目中添加一个 `notification.test.js` 用于测试。

安装测试依赖项
-------
在编写单元测试时，我们需要用一个什么都不做的假组件来替换组件的现有实现。这被称为 **stub(存根)**，
- 为了在测试中使用存根，我们需要访问 Vue Test Utils 的`mount`方法，这是 Vue.js 的官方[测试工具库](https://link.juejin.cn?target=https%3A%2F%2Ftest-utils.vuejs.org%2F "https://test-utils.vuejs.org/")。

现在我们来安装 Vue Test Utils。

以从`"@vue/test-utils"`导入 `mount`。
```
import { mount } from "@vue/test-utils";
```
在测试中，我们还需要能够模拟 DOM。Vitest 目前同时支持 `happy-dom` 和 `jsdom`。对于这个演示，我们将使用`happy-dom`，然后安装它：
我们可以在测试文档的顶部添加以下注释...
**notification.test.js**
```
/**
 * @vitest-environment happy-dom
 */
```

. 或者将此添加到 `vite/vitest` 配置文档中，以避免在有多个需要 `happy-dom` 工作的测试文档时出现重复情况。
**vite.config.js**
```
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: "happy-dom",
    },
});
```

因为我们只有一个测试文档，所以我们可以选择第一个选项，所以我们测试文档内容如下：
**notification.test.js**
```
/**
 * @vitest-environment happy-dom
 */

import { mount } from "@vue/test-utils";
```

有了这些依赖关系，我们现在可以导入我们要测试的组件。

**notification.test.js**
```
/**
 * @vitest-environment happy-dom
 */
import { mount } from "@vue/test-utils";
import notification from "../components/notification.vue";
```
常见的 Vitest 方法
-------------
为了编写测试，我们需要利用以下常见的方法，这些方法可以从 Vitest 导入。
*   `describe`： `describe` 方法将测试分组这个函数接受一个名字和一个函数，用于将相关的测试组合在一起。当你为一个有多个测试点（如逻辑和外观）的组件编写测试时，它就会很方便。
*   `test/it`：这个函数代表被测试的实际代码块。它接受一个字符串，通常是测试案例的名称或描述（例如，渲染成功的正确样式）和另一个函数，所有的检查和测试在这里进行。
*   `expect`： 这个函数用于测试值或创建断言。它接受一个预期为实际值（字符串、数字、对象等）的参数 **x**，并使用任何支持的方法对其进行评估（例如`toEqual(y)`，检查 x 是否与 y 相同）。

因此，我们现在将这些导入我们的测试文档中
**notification.test.js**
```
/**
 * @vitest-environment happy-dom
 */

import { mount } from "@vue/test-utils";
import notification from "../components/notification.vue";
import { describe, expect, test } from "vitest";
```
有了这些函数，我们开始构建我们的单元测试。

创建 Vitest 单元测试
--------------
**notification.test.js**
在这里，我们使用 `mount` 来存根我们的组件，以便进行测试。
`mount` 接受组件作为第一个参数，接受一个选项列表作为第二个参数。
这些选项提供了不同的属性，目的是确保你的组件能在浏览器中正常工作。
在这个列表中，我们只需要 `props` 属性
```
describe("notification.vue", () => {
    test("renders the correct style for error", () => {
        const type = "error";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--error"])
        );
    });
});
```
在这一点上，剩下的就是写一个断言，或者更好的是，写出我们组件的预期行为，即：`renders the correct style for error`。

为了做到这一点，我们使用了 `expect` 方法。它接受我们的存根组件和所有的选项（在我们的例子中，我们把它命名为`wrapper`以方便参考）。

这个方法可以被链接到其他一些方法上，但是对于这个特定的断言，我们要重新检查组件的类列表是否返回一个包含这个 `notification——error` 的数组。。

我们使用 `classes` 函数来实现这一点，该函数返回包含该组件所有类的数组。在这之后，下一件事就是使用 `toEqual` 函数进行比较，它检查一个值 **X** 是否等于 ** Y**。在这个函数中，我们检查它是否返回一个包含我们的类的数组: `notification--error`。

## 测试点击事件
每当组件上的按钮被点击，它就会发出一个事件:

```js
test("emits event when close button is clicked", async() => {
	const wrapper = mount(notification, {
		data() {
			return {
				clicked: false,
			};
		},
	});
	const closeButton = wrapper.find("button");
	await closeButton.trigger("click");
	expect(wrapper.emitted()).toHaveProperty("clear-notification");
    });
```

在这个测试块中，我们使用了一个 **async** 函数，因为我们将触发一个事件，它返回一个 Promise，我们需要等待这个 Promise 的解决，以便捕捉这个事件所引起的变化。我们还使用了`data`函数，并添加了一个 `clicked` 属性，当点击时将被切换。

到这，我们需要触发这个点击事件，我们首先通过使用 `find` 函数来获得按钮。这个函数与`querySelector`相同，它接受一个类、一个 id 或一个属性，并返回一个元素。

在找到按钮后，使用 [trigger](https://link.juejin.cn?target=https%3A%2F%2Ftest-utils.vuejs.org%2Fapi%2F%23trigger "https://test-utils.vuejs.org/api/#trigger") 方法来触发一个点击事件。这个方法接受要触发的事件名称（click, focus, blur, keydown 等），执行这个事件并返回一个 promise。出于这个原因，我们等待这个动作，以确保在我们根据这个事件做出断言之前，已经对我们的 DOM 进行了改变。

最后，我们使用返回一个数组的 `[emitted](https://test-utils.vuejs.org/api/#emitted)` 方法检查我们的组件所发出的事件列表。然后我们检查这个数组是否包括 `clear-notification` 事件。

## 测试渲染
最后，我们测试以确保我们的组件渲染出正确的消息，并传递给 `message` prop。

```
test("renders message when message is not empty", () => {
        const message = "Something happened, try again";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.find("p").text()).toBe(message);
    });
```

这里，我们创建了一个 `message` 变量，给它分配了一个随机字符串，并把它作为一个 prop 传递给我们的组件。

然后，我们使用 `p` 标签搜索我们的消息文本，因为这里是显示消息的地方，并检查其文本是否与 `message` 相同。

我们使用 `text` 方法提取这个标签的内容，这和 `innerText`很相似。最后，我们使用前面的函数 `toBe` 来断言这个值与 `message` 相同。