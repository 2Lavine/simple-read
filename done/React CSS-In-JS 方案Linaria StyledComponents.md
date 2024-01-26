> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7153146950701973518?searchId=20240120202017BD9D5A30E810FAEC4E61)

CSS-in-JS 解决方案
--------------

CSS-in-JS 解决方案给我们提供了新的编写 CSS 的方式。这些方案使用以 javascript 为基础的 API 来创建和编写样式。
主要的优点包括：
*   动态样式：允许开发者编写动态 CSS
*   元素作用域：可以把样式的范围固定在某些元素上
*   消除无用代码：会自动除去应用中冗余的 CSS 代码
*   支持自定义主题
*   更加容易编写单元测试
*   性能提升
*   支持 SSR
*   支持所有的 CSS 语法

Linaria
-------
Linaria 是最流行的 CSS-in-JS 解决方案之一
Linaria 是 「零运行时」方法，这意味着它将开发者写好的样式代码在构建时转换为一个单独的 .css 文件。
这个行为跟很多的 CSS 预处理器相似，比如 SASS ，LESS

它提供了很多功能，包括：
*   提供创建 CSS 类的 API 。”css” API 允许开发者创建所选择的样式，同时他也支持模版语法来满足当我们需要插入动态值。

```
import { css } from '@linaria/core';

const red = "red"
const header = css`
  text-transform: uppercase;
	color: ${red}
`;

<h1 className={header}>Hello world</h1>;
```
*   它也提供可以创建元素的 API. “styled” API 允许开发者创建任何元素，比如： div，p，等等。当然，这个 API 也是支持模版语法来插入对应的变量值的

```
import { styled } from '@linaria/react'

const Container = styled.div`
  font-size: 35px;
  color: red;
  border: 1px solid red;

  &:hover {
    border-color: blue;
  }

  h1 {
    margin-bottom: 24px;
  }
`;

const App = () => {
    return <Container>
        <h1>Hello World</h1>
    </Container>
  }
export default App;
```


*   它通过 React 的 Props 或者常规变量来管理动态样式。在下面的代码中，我们通过 React 组件传递 props 和一些常规变量到另一个元素上

```
import { styled } from '@linaria/react';

const Title = styled.h1`
  font-family: inherit;
`;
const medium = 30

const Navbar = styled.nav`
  font-size: ${medium}px;
  color: ${props => props.color};
  border: 1px solid red;

  &:hover {
    border-color: blue;
  }

  ${Title} {
    margin-bottom: 24px;
  }
`;

const App = () => {
    return <Navbar color="#999">
        <Title>Hello world</Title>
    </Navbar>
}

export default App;
```

其他的功能包括：

*   通过 CSS source maps 可以很容易的找到样式变量是在哪里定义的
*   可以在 JS 代码中开启 CSS Lint [](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstylelint%2Fstylelint "https://github.com/stylelint/stylelint")[github.com/stylelint/s…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstylelint%2Fstylelint "https://github.com/stylelint/stylelint")
*   通过 @linaria/atomic 可以支持原子样式

Styled-Components
-------------------------
Styled-Components 也是流行的 CSS-in-JS 解决方案之一。
Styled-components 让开发者能够通过编写真实的 CSS 代码来修改组件的样式。
它在组件和样式之间创建了一个抽象层，从而消除了直接的映射。

提供的能力，包括：
*   自动提取关键 CSS 和 代码分割：Styled-Components 监控组件，并且在组件渲染到页面的时候插入组件必要的样式代码。同时支持代码分割来加快组件加载的速度
*   为样式生成唯一的类名，以防止样式的覆盖，拼写错误以及冗余
*   Styled-component 也提供通过 props 或者常规变量为元素注入动态值。“styled” API 允许开发者创建选择的元素，跟 Linaria 一样，Styled-component 也支持大致相同的模版语法

```
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const App = () => {
    return <div>
        <Button>Normal</Button>
        <Button primary>Primary</Button>
  </div>
}

export default App;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b71464735a7c48cfb3966060e68da08c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

*   样式扩展：Styled-Components 允许在已有的样式上通过 styled 进行扩展

```
import styled from 'styled-components';

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

const App = () => {
    return <div>
        <Button>Normal Button</Button>
        <TomatoButton>Tomato Button</TomatoButton>
    </div>
}

export default App;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/113961d591ec476991654dfbc268dd07~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d7bb02fc4e499f8e6b40bb8ff443e4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

其他的功能，包括：

*   维护成本低
*   更简便的删除不必要的 CSS
*   支持 SSR
*   支持主题定制

对比 Linaria 和 Styled-Components
------------------------------

开发者在很长一段时间都在选择最适合自己项目的样式解决方案，而 Linaria 和 Styled-Components 无疑是当中的佼佼者。接下来我们将从：「功能」，「性能」以及 「生态」来对这两个方案进行比较

### 功能

*   Linaria 是「零运行时」方案，这意味着样式文件会在构建时被单独抽取成 CSS 文件；Styled-Components 则是在构建时通过 javascript 将 CSS 注入，不会生成额外的 CSS 文件
*   都拥有相似的 CSS 语法（类似 Sass 的风格）
*   在 React 应用中都可以基于 Prop 实现变量注入（原理是使用 CSS 变量）
*   都可以通过 CSS source maps 很快找到 CSS 变量定义的位置
*   都可以通过 [stylelint](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstylelint%2Fstylelint "https://github.com/stylelint/stylelint") 的方案进行代码检查
*   都使用 Javascript 来组织代码逻辑，无需使用 CSS 预处理器
*   都可以平替 Sass 或者 PostCSS 方案

通过上述的的功能描述，我们发现 Linaria 和 Styled-Components 的 API 都比较相似，所以开发者很容易就可以从其中一个方案迁移到另一个方案

### 基于请求的性能对比

*   在生产环境中， Linaria 会产生额外的 .css 文件，这将会引起 CSS 文件体积变大，文件数量变多，导致请求数量变多的问题
*   对于 Styled-Components 来说，相同情况下，CSS 文件体积和数量无疑是更少的，但是会增加 JS bundle 的体积大小

许多争论在于认为 Linaria 产生的 css 文件对性能的影响是比较小的，相对于 Styled-Components ，Linaria 不会增加 JS bundle 体积是一种更好的取舍；而另一些则认为 Linaria 增加了 CSS 冗余代码的可能性。

我们可以在 [这里](https://link.juejin.cn?target=https%3A%2F%2Fpustelto.com%2Fblog%2Fcss-vs-css-in-js-perf%2F%23network-comparison "https://pustelto.com/blog/css-vs-css-in-js-perf/#network-comparison") 看到更多关于请求的性能对比

### 基于页面加载的性能对比

在加入多种页面加载标准之后发现，大部分的页面使用 Linaria 的加载性能要 **好于** 使用 Styled-Components。其中一个比较重要的原因就是，Linaria 导致的 CSS 资源体积与数量的增加对于页面加载的影响要小于 Styled-Components 导致的 JS bundle 体积的增加
