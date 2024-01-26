> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7129667747134308389?searchId=202401261549374C48CC23171B271C060A)

> 微信搜索 【大迁世界】, 我会第一时间和你分享前端行业趋势，学习途径等等。 本文 GitHub [github.com/qq449245884…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fqq449245884%2Fxiaozhi "https://github.com/qq449245884/xiaozhi") 已收录，有一线大厂面试完整考点、资料以及我的系列文章。

什么是 Vitest？
-----------

自从 **尤大** 的构建工具 Vite 获得了巨大的人气，现在有了一个由它驱动的极快的单元测试框架。**Vitest**。

Vitest 与 Jest 兼容，具有开箱即用的 ESM、Typescript 和 JSX 支持，并且由 **esbuild** 提供支持。它在测试过程中使用 Vite 开发服务器来转换你的文档，并监听你的应用程序的相同配置（通过`vite.config.js`），从而消除了使用 Jest 等测试替代品所涉及的重复工作。

为什么选择 Vitest？
-------------

Vite 是一个构建工具，旨在为现代 web 项目提供更快、更精简的开发体验，它开箱即用，支持常见的 web 模式、`glob`导入和 **SSR** 等功能。它的许多插件和集成正在促进一个充满活力的生态系统。

但这导致了一个新问题：如何在 Vite 上编写单元测试。

将 Jest 等框架与 Vite 一起使用，导致 Vite 和 Jest 之间有很多重复的配置，而 Vitest 解决了这一问题，它消除了为我们的应用程序编写单元测试所需的额外配置。Vitest 使用与 Vite 相同的配置，并在开发、构建和测试时共享一个共同的转换管道。它还可以使用与 Vite 相同的插件 API 进行扩展，并与 Jest 的 API 兼容，以方便从 Jest 迁移，而不需要做很多重构工作。

因此，Vitest 的速度也非常快。

如何使用 Vitest 来测试组件
-----------------

### 安装 Vitest

在项目中使用 `Vitest` 需要 `Vite >=v2.7.10` 和 `Node >=v14` 才能工作。

可以使用 `npm`、`yarn` 或 `pnpm` 来安装 Vitest，根据自己的喜好，在终端运行以下命令：

**NPM**

```
npm install -D vitest
```

**YARN**

```
yarn add -D vitest
```

**PNPM**

```
pnpm add -D vitest
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e83bc8229d474498882e8332db9fcf98~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

Vitest 配置
---------

安装完 Vitest 后，需要将其添加到 `vite.config.js` 文档中:

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

值得注意的是，Vitest 也可以在项目中通过在根文档夹中添加 `vitest.config.js` 文档来配置。如果这个文档存在，它将优先于 `vite.config.js` 来配置 Vitest。Vitest 也允许额外的配置，可以在[配置](https://link.juejin.cn?target=https%3A%2F%2Fvitest.dev%2Fconfig%2F%23configuration "https://vitest.dev/config/#configuration")页面中找到。

事例演示：Notification
-----------------

为了看看 Vitest 的运作情况，我们创建一个显示三种类型通知的通知组件：`info`、`error` `和success`。这个组件的每个状态如下所示：

### info

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aedf37442beb45ff923c5347be5796c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### error

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51e8e9f3392f425a87f4121a00389a5d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### success

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1df8ac15b12e4063956457e691a1a553~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

`notification.vue` 内容如下：

```
<template>
  <div
    :class="[
      'notification',
      type === 'error' ? 'notification--error' : null,
      type === 'success' ? 'notification--success' : null,
      type === 'info' ? 'notification--info' : null,
      message && message.length > 0 ? 'notification--slide' : null,
    ]"
  >
    <img
      src="https://res.cloudinary.com/djalafcj9/image/upload/v1634261166/getequityV2/denied_sbmv0e.png"
      v-if="type === 'error'"
    />
    <img
      src="https://res.cloudinary.com/djalafcj9/image/upload/v1656690265/getequityV2/Frame_irxz3e.png"
      v-if="type === 'success'"
    />
    <img
      src="https://res.cloudinary.com/djalafcj9/image/upload/v1634261166/getequityV2/pending_ctj1ke.png"
      v-if="type === 'info'"
    />
    <p class="notification__text">
      {{ message }}
    </p>
    <button
      ref="closeButton"
      class="notification__button"
      @click="$emit('clear-notification')"
    >
      <img
        src="https://res.cloudinary.com/djalafcj9/image/upload/v1635485821/getequityV2/close_muxdyb.png"
      />
    </button>
  </div>
</template>
<script>
  export default {
    name: "Notification",
    emits: ['clear-notification'],
    props: {
      type: {
        type: String,
        default: null,
      },
      message: {
        type: String,
        default: null,
      },
    },
  };
</script>

<style>
  .notification {
    transition: all 900ms ease-out;
    opacity: 0;
    z-index: 300001;
    transform: translateY(-100vh);
    box-sizing: border-box;
    padding: 10px 15px;
    width: 100%;
    max-width: 730px;
    /* margin: 0 auto; */
    display: flex;
    position: fixed;
    /* left: 0; */
    top: 20px;
    right: 15px;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    min-height: 48px;
    box-sizing: border-box;
    color: #fff;
  }

  .notification--slide {
    transform: translateY(0px);
    opacity: 1;
  }

  .notification--error {
    background-color: #fdecec;
  }

  .notification__text {
    margin: 0;
    margin-left: 17px;
    margin-right: auto;
  }

  .notification--error .notification__text {
    color: #f03d3e;
  }

  .notification--success {
    background-color: #e1f9f2;
  }

  .notification--success > .notification__text {
    color: #146354;
  }

  .notification--info {
    background-color: #ffb647;
  }

  .notification__button {
    border: 0;
    background-color: transparent;
  }
</style>
```

在这里，我们使用 `message` prop 创建了一个显示动态消息的组件。我们还利用 `type` prop 来设计这个组件的背景和文本，并利用这个 `type` prop 显示我们计划的不同图标（error, success, info）。

最后，我们有一个按钮，用来通过发出一个自定义事件：`clear-notification`来解除通知。

我们应该测试什么？
---------

现在我们对需要测试的组件的结构有了了解，我们可以再思考一下，这个组件需要做什么，以达到预期的功能。

我们的测试需要检查以下内容：

*   该组件根据通知类型渲染出正确的样式。
*   当 `message` 为空时，通知就会逐渐消失。
*   当关闭按钮被点击时，该组件会发出一个事件。

为了测试这些功能，在项目中添加一个 `notification.test.js` 用于测试。

安装测试依赖项
-------

在编写单元测试时，可能会有这样的情况：我们需要用一个什么都不做的假组件来替换组件的现有实现。这被称为 **stub(存根)**，为了在测试中使用存根，我们需要访问 Vue Test Utils 的`mount`方法，这是 Vue.js 的官方[测试工具库](https://link.juejin.cn?target=https%3A%2F%2Ftest-utils.vuejs.org%2F "https://test-utils.vuejs.org/")。

现在我们来安装 Vue Test Utils。

安装
--

```
npm install --save-dev @vue/test-utils@next

# or

yarn add --dev @vue/test-utils@next
```

现在，在我们的测试文档中，我们可以从`"@vue/test-utils"`导入 `mount`。

**notification.test.js**

```
import { mount } from "@vue/test-utils";
```

在测试中，我们还需要能够模拟 DOM。Vitest 目前同时支持 `happy-dom` 和 `jsdom`。对于这个演示，我们将使用`happy-dom`，然后安装它：

```
yarn add happy-dom --dev
```

安装后，我们可以在测试文档的顶部添加以下注释...

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

*   `describe`：这个函数接受一个名字和一个函数，用于将相关的测试组合在一起。当你为一个有多个测试点（如逻辑和外观）的组件编写测试时，它就会很方便。
    
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

首先使用 `describe` 方法将测试分组。

**notification.test.js**

```
describe("notification.vue", () => {
    
});
```

在 `describe` 块内，我们添加每个实际的测试。

我们第一个要测试的用例是：**组件根据通知类型渲染出正确的样式**。

**notification.test.js**

```
describe("notification.vue", () => {
    test("renders the correct style for error", () => {

    });
});
```

`renders the correct style for error` 表示 `test` 所检查的内容的 **name**。它有助于为代码块检查的内容提供上下文，这样就可以由原作者以外的人轻松维护和更新。它也使人们容易识别一个特定的失败的测试案例。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc53c1159384e73bc06784b8032ea78~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**notification.test.js**

```
describe("notification.vue", () => {
    test("renders the correct style for error", () => {
       const type = "error";
    });
});
```

在我们组件中，定义了一个 `type` 参数，它接受一个字符串，用来决定诸如背景颜色、图标类型和文本颜色在组件上的渲染。在这里，我们创建一个变量 `type`，并将我们正在处理的类型之一，error （`error`, `info`, 或 `success`）分配给它。

**notification.test.js**

```
describe("notification.vue", () => {
    test("renders the correct style for error", () => {
        const type = "error";
        const wrapper = mount(notification, {
            props: { type },
        });
    });
});
```

在这里，我们使用 `mount` 来存根我们的组件，以便进行测试。

`mount` 接受组件作为第一个参数，接受一个选项列表作为第二个参数。这些选项提供了不同的属性，目的是确保你的组件能在浏览器中正常工作。

在这个列表中，我们只需要 `props` 属性。我们使用这个属性是因为我们的 `notification.vue`组件至少需要一个 **prop** 才能有效工作。

**notification.test.js**

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

同样，对于 type 为 `success` 或 `info` 类型，测试过程也差不多。

```
import { mount } from "@vue/test-utils";
import notification from "../components/notification.vue";
import { describe, expect, test } from "vitest";
describe("notification.vue", () => {
    test("renders correct style for error", () => {
        const type = "error";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--error"])
        );
    });

    test("renders correct style for success", () => {
        const type = "success";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--success"])
        );
    });

    test("renders correct style for info", () => {
        const type = "info";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--info"])
        );
    });

    test("slides down when message is not empty", () => {
        const message = "success";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--slide"])
        );
    });
});
```

到这，我们已经写好了测试，以确保我们的通知是根据其类型来进行样式设计的。当用户点击组件上的关闭按钮时，我们会重置 `message` 参数。根据我们的代码，我们要根据这个 `message` 参数的值来添加或删除 `notification--slide` 类，如下所示:

**notification.vue**

```
<div
    :class="[
      'notification',
      type === 'error' ? 'notification--error' : null,
      type === 'success' ? 'notification--success' : null,
      type === 'info' ? 'notification--info' : null,
      message && message.length > 0 ? 'notification--slide' : null,
    ]"
  >
//...
```

如果我们要测试这个特定的断言，它的内容如下：

```
test("slides up when message is empty", () => {
        const message = "";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.classes("notification--slide")).toBe(false);
    });
```

在这段测试代码中，我们用一个空字符串创建一个 `message` 变量，并把它作为一个 prop 传递给我们的组件。

之后，我们检查我们组件的类数组，确保它不包括 `notification--slide` 类，该类负责使我们的组件向下 / 向外滑动到用户的视图。为了做到这一点，我们使用 `toBe` 函数，它接收一个值 **A**，并试图检查它是否与 **B** 相同。

我们还想测试一下，每当组件上的按钮被点击，它就会发出一个事件:

```
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

完整的测试文档
-------

在涵盖所有这些之后，下面是完整的测试文档内容：

**notification.test.js**

```
/**
 * @vitest-environment happy-dom
 */

import { mount } from "@vue/test-utils";
import notification from "../components/notification.vue";
import { describe, expect, test } from "vitest";

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

    test("renders the correct style for success", () => {
        const type = "success";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--success"])
        );
    });

    test("renders the correct style for info", () => {
        const type = "info";
        const wrapper = mount(notification, {
            props: { type },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--info"])
        );
    });

    test("slides down when message is not empty", () => {
        const message = "success";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.classes()).toEqual(
            expect.arrayContaining(["notification--slide"])
        );
    });

    test("slides up when message is empty", () => {
        const message = "";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.classes("notification--slide")).toBe(false);
    });

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
        expect(wrapper.emitted()).toHaveProperty("clear-notificatioon");
    });

    test("renders message when message is not empty", () => {
        const message = "Something happened, try again";
        const wrapper = mount(notification, {
            props: { message },
        });
        expect(wrapper.find("p").text()).toBe(message);
    });
});
```

有几件事需要注意:

*   我们利用 `mount` 来存根我们要测试的组件，它是由 Vue Test Utils 提供的。 (`yarn add --dev @vue/test-utils@next`)

运行测试
----

现在已经完成了测试的编写，需要运行它们。要实现这一点，我们去 `package.json`，`在我们的scripts` 部分添加以下几行。

```
"scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
},
```

如果在终端运行 `yarn vitest` 或 `yarn test`，我们的测试文档就会被运行，我们应该看到测试结果和故障。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6877580ad7784356a82914c0c99bf4d1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

到这，我们已经成功地使用 Vitest 运行了我们的第一次测试。从结果中需要注意的一点是，由于 Vitest 的智能和即时观察模式，这个命令只需要运行一次，并在我们对测试文档进行更新和修改时被重新运行。

总结
--

使用 Vitest 对我们的应用程序进行单元测试是无缝的，与 Jest 等替代品相比，需要更少的步骤来启动和运行。Vitest 还可以很容易地将现有的测试从 Jest 迁移到 Vitest，而不需要进行额外的配置。

作者：Timi Omoyeni 译者：前端小智 来源：vuemastery

原文：[www.vuemastery.com/blog/gettin…](https://link.juejin.cn?target=https%3A%2F%2Fwww.vuemastery.com%2Fblog%2Fgetting-started-with-vitest "https://www.vuemastery.com/blog/getting-started-with-vitest")

**代码部署后可能存在的 BUG 没法实时知道，事后为了解决这些 BUG，花了大量的时间进行 log 调试，这边顺便给大家推荐一个好用的 BUG 监控工具 [Fundebug](https://link.juejin.cn?target=https%3A%2F%2Fwww.fundebug.com%2F%3Futm_source%3Dxiaozhi "https://www.fundebug.com/?utm_source=xiaozhi")。**

### 交流

> 有梦想，有干货，微信搜索 **【大迁世界】** 关注这个在凌晨还在刷碗的刷碗智。
> 
> 本文 GitHub [github.com/qq449245884…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fqq449245884%2Fxiaozhi "https://github.com/qq449245884/xiaozhi") 已收录，有一线大厂面试完整考点、资料以及我的系列文章。