> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7190159077908381756?searchId=202401261549374C48CC23171B271C060A)

### 引入 Vue Test Utils
但这个时候我们不能直接就进行组件的单元测试，vitest 本身是不支持单元组件测试的，需要安装`Vue Test Utils`配合 vitest 才可进行，我们安装一下：
 `shallowMount`方法是 Vue Test Utils 库中的一个方法，它可以在测试环境中挂载一个 Vue 组件，并返回一个包装器对象，该对象可以用于访问组件的一些属性和方法，并且由于它是浅渲染，意味着它只会渲染当前组件，而不会渲染它的子组件。这对于单元测试来说很有用，因为它允许您专注于当前组件的行为，并避免与子组件的行为产生干扰。
搭配`shallowMount`方法对组件进行一个挂载，将 Link 组件挂载到测试环境中
### 测试组件是否渲染成功
我们引入组件后，再导入`describe` `expect` `test`方法，
对是否渲染成功进行判断，由于原组件当中我们对 link 组件定义了不同的颜色，
这里我们直接判断默认颜色是否为黑色即可
```js
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
        });​
        //断言
        expect(wrapper.text()).toBe("Link")
    })
})
//对组件颜色进行测试，测试默认link颜色
describe("Link", () => {
    test("default color is black", () => {
        // 使用 shallowMount 方法挂载组件
        const wrapper = shallowMount(Link);​
        // 断言组件默认颜色是否是 black
        expect(wrapper.props().color).toBe("black");
    });
});
```