> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7190159077908381756?searchId=202401261549374C48CC23171B271C060A)

前言
--

一款合格的开源项目是避免不了单元测试的，这也是这几年单元测试的热度居高不下的原因。而在今年的`state of js 2022`中，我们可以看见在**代码库层级列表**中，`vitest`飞升一跃，直接到了第二名，仅次于同门师兄弟`vite`，而`element plus` `unocss`等知名开源项目都采用了 vitest 进行单元测试

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aeb4fd2c9694ee39835e8b78ca50782~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

不仅仅是在满意度上拔得头筹，vitest 相比 jest 来说，你几乎无需做任何的配置：

*   开箱即用的 TypeScript / JSX 支持
*   支持测试 Vue、React、Lit 等框架中的组件
*   jest 友好 (兼容 jest 的快照测试)

这对于新人来学习单元测试来说无疑是非常友好的，并且 vitest 与 [Vite](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2F "https://cn.vitejs.dev/") 通用的配置、转换器、解析器和插件，对 vite 生态支持十分友好，这对于一些日常使用 vite 的人来说就更爽了😂

> **Vitest 旨在将自己定位为 Vite 项目的首选测试框架，即使对于不使用 Vite 的项目也是一个可靠的替代方案。**

安装并配置
-----

这里我还是选择我心目中最好的包管理器了吧：

```
pnpm add -D vitest
```

由于 vitest 和 vite 是统一的配置，所以你无需再另写一个文件，直接在`vite.congi.ts`中进行配置即可：

```
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    // ...
  },
});
​
```

注意，这里由于我们是要进行配置 vite 本身，所以需要在**顶端**加上三斜线命令

再向`package.json`中加上如下命令即可开启我们的单元测试之旅：

```
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

简单感受一下单元测试的魅力：
--------------

对于没怎么接触过单元测试的同学，我们可以用个简短的例子来进行演示，首先让我们定义一个`sum.ts`:

```
export default function sum(...numbers:number[]){
    return numbers.reduce((total,number)=>total+number,0)
}
```

在写完这个函数后，我们再定义一个测试文件，命名为`sum.test.ts`:

```
import sum from './sum'
import {describe,expect,it} from "vitest"
​
describe("#sum",()=>{
    it("returns 0 with no numbers",()=>{
        expect(sum()).toBe(0)
    })
})
```

> *   **describe** 描述, `decribe`会形成一个作用域
> *   **it** 定义了一组关于测试期望的方法, 它接收测试名称和一个含有测试期望的函数
> *   **expect** 用来创建断言
> *   toBe 可用于断言基础对象是否相等

运行`pnpm run test`便可得到如下结果：![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a78449d96cda47239b3b4072b9d73587~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

那如果我们将 sum.ts 的结果从 0 改为 1 时，它便会立刻报错，并且提醒我们 **Expected** 和 **Received** 之前的区别，让我们能够快速定位原代码的错误位置

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1373854acfaf4215b94510a09e88c9a4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

实战演示
----

### 注册组件

接下来我们进行实战演示，看看在实际的项目开发中`vitest`又应该如何使用，这里就拿测试组件库来当做例子吧，举个例子，我注册了一个`Link`组件：

```
import { defineComponent, PropType, ref } from "vue";
import "uno.css";
​
export type IType = 'default' | 'primary' | 'success' | 'warning' | 'danger'| 'info'
export type IColor = 'black' | 'blue' | 'green' | 'yellow'| 'red' | 'gray'
export const props = {
  type: {
    type: String as PropType<IType>,
    default: "default",
  },
  color: {
    type: String as PropType<IColor>,
    default: "black",
  },
  plain: {
    type: Boolean,
    default: true,
  },
  href: {
    type: String,
    required: true,
  },
} as const;
​
export default defineComponent({
  name: "CLink",
  props,
  setup(props, { slots }) {
        return () => (
      <a
      class={`
        text-${props.plain ? props.color + "-500" : "white"}
        hover:text-${props.color}-400
        cursor-pointer
        text-lg
        hover:text-white
        transition duration-300 ease-in-out transform hover:scale-105
        mx-1
        decoration-none
        `}
      href={props.href}      
    >
      {slots.default ? slots.default() : 'Link'}
    </a>
    );    
  },
});
```

这时候我想要对该组件进行单元测试应该怎么做？这时候我们应该明白自己应该测试什么，才在 vitest 文档中找寻对应的 API；比如这时候我想要知道我的组件是否成功渲染上了，这时候就可以去文档查询，这里我们还是选择`expect`来进行判断，看看是否将 Link 组件成功的渲染上了

### 引入 Vue Test Utils

但这个时候我们不能直接就进行组件的单元测试，vitest 本身是不支持单元组件测试的，需要安装`Vue Test Utils`配合 vitest 才可进行，我们安装一下：

```
pnpm add @vue/test-utils -D
```

> `shallowMount`方法是 Vue Test Utils 库中的一个方法，它可以在测试环境中挂载一个 Vue 组件，并返回一个包装器对象，该对象可以用于访问组件的一些属性和方法，并且由于它是浅渲染，意味着它只会渲染当前组件，而不会渲染它的子组件。这对于单元测试来说很有用，因为它允许您专注于当前组件的行为，并避免与子组件的行为产生干扰。

搭配`shallowMount`方法对组件进行一个挂载，将 Link 组件挂载到测试环境中

### 测试组件是否渲染成功

我们引入组件后，再导入`describe` `expect` `test`方法，对是否渲染成功进行判断，由于原组件当中我们对 link 组件定义了不同的颜色，这里我们直接判断默认颜色是否为黑色即可

```
import Link from '../src/link/Link'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
​
//使用shallowMount()方法挂载组件，并使用expect断言方法来检验组件的渲染是否正确
describe('Link', () => {
    test("mount @vue/test-utils", () => {
        const wrapper = shallowMount(Link, {
            slots: {
                default: 'Link'
            }
        });
​
        //断言
        expect(wrapper.text()).toBe("Link")
    })
})
​
//对组件颜色进行测试，测试默认link颜色
describe("Link", () => {
    test("default color is black", () => {
        // 使用 shallowMount 方法挂载组件
        const wrapper = shallowMount(Link);
​
        // 断言组件默认颜色是否是 black
        expect(wrapper.props().color).toBe("black");
    });
});
```

运行测试：![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5252b354ee347df9d03a2829a5de675~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

组件渲染成功，我们成功完成了一个组件的基本测试

总结
--

`vitest`无疑是一款优秀的单元测试框架，他所拥有的的不仅仅是和 vite 一样的快，还有简单易上手的特色，他还有着庞大的 vue 生态在背后做着支撑，而现在单元测试热度越来越高，选择 vitest 当做自己的入门框架，是再合适不过了，如果你想查看更多的单元测试在组件库上的应用，欢迎查看我的项目：[github.com/isolcat/Cat…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fisolcat%2FCatIsol-UI "https://github.com/isolcat/CatIsol-UI") 如果能帮到你，还请点个 star😀