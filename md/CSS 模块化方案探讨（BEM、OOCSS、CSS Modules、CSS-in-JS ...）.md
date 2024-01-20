> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6947335144894103583?searchId=20240120202017BD9D5A30E810FAEC4E61)

> 全文共 4000 余字，预计花费 30 分钟。

众所周知，CSS 根据选择器名称去全局匹配元素，它没有作用域可言，比如你在页面的两个不同的地方使用了一个相同的类名，先定义的样式就会被覆盖掉。CSS 一直缺乏模块化的概念，命名冲突的问题会持续困扰着你。每次定义选择器名称时，总会顾及其他文件中是否也使用了相同的命名，这种影响在组件开发中尤为明显。💣💣💣

理想的状态下，我们开发一个组件的过程中，应该可以随意的为其中元素进行命名，只需要保证其语义性即可，而不必担心它是否与组件之外的样式发生冲突。

与 JavaScript 社区中的 AMD、CMD、CommonJS、ES Modules 等类似，CSS 社区也诞生了相应的模块化解决方案：BEM、OOCSS、SMACSS、ITCSS，以及 CSS Modules 和 CSS-in-JS 等。

根据这些 CSS 模块化方案的特点，我简单的将它们分为了三大类：

1.  **CSS 命名方法论**：通过人工的方式来约定命名规则。
2.  **CSS Modules**：一个 CSS 文件就是一个独立的模块。
3.  **CSS-in-JS**：在 JS 中写 CSS。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3ad49b0044c4f759a023ac787804142~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

CSS 命名方法论
---------

为了避免 CSS 选择器命名冲突的问题，以及更好的实现 CSS 模块化，CSS 社区在早期诞生了一些 CSS 命名方法论，如 BEM、OOCSS、SMACSS、ITCSS、SUITCSS、Atomic CSS 等。

它们几乎都有一个共同的特点——为选择器增加冗长的前缀或后缀，并试图通过人工的方式来生成全局唯一的命名。这无疑会增加了类命名的复杂度和维护成本，也让 HTML 标签显得臃肿。

### BEM

[BEM](https://link.juejin.cn?target=https%3A%2F%2Fwww.bemcss.com "https://www.bemcss.com")（Block Element Modifier）是一种典型的 CSS 命名方法论，由 [Yandex](https://link.juejin.cn?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FYandex%2F10230168 "https://baike.baidu.com/item/Yandex/10230168") 团队（相当于中国的百度）在 2009 年前提出，它的核心思想是 **通过组件名的唯一性来保证选择器的唯一性，从而保证样式不会污染到组件外**。

BEM 命名规约是 `.block-name__element-name--modifier-name`，即 `.模块名__元素名--修饰器名` 三个部分，用双下划线 `__` 来明确区分模块名和元素名，用双横线 `--` 来明确区分元素名和修饰器名。你也可以在保留 BEM 核心思想的前提下，自定义命名风格，如驼峰法、使用单下划线、使用单横线等。

在 BEM 中不建议使用子代选择器，因为每一个类名已经都是全局唯一的了，除非是 block 相互嵌套的场景。

```
<!-- 示例模块 -->
<div class="card">
  <div class="card__head">
    <ul class="card__menu">
      <li class="card__menu-item">menu item 1</li>
      <li class="card__menu-item">menu item 2</li>
      <li class="card__menu-item card__menu-item--active">menu item 3</li>
      <li class="card__menu-item card__menu-item--disable">menu item 4</li>
    </ul>
  </div>
  <div class="card__body"></div>
  <div class="card__foot"></div>
</div>
```

```
.card {}
.card__head {}
.card__menu {}
.card__menu-item {}
.card__menu-item--active {}
.card__menu-item--disable {}
.card__body {}
.card__foot {}
```

使用 Sass/Less/Stylus 的父元素选择器 `&` 可以更高效的编写 BEM：

```
.card {
  &__head {}
  &__menu {
    &-item {
      &--active {}
      &--disable {}
    }
  }
  &__body {}
  &__foot {}
}
```

### OOCSS

[OOCSS](https://link.juejin.cn?target=http%3A%2F%2Foocss.org "http://oocss.org")（Object-Oriented CSS）即面向对象的 CSS，它借鉴了 OOP（面向对象编程）的抽象思维，主张将元素的样式抽象成多个独立的小型样式类，来提高样式的灵活性和可重用性。

OOCSS 有两个基本原则：

1.  **独立的结构和样式**。即不要将定位、尺寸等布局样式与字体、颜色等表现样式写在一个选择器中。
2.  **独立的容器和内容**。即让对象的行为可预测，避免对位置的依赖，子元素即使离开了容器也应该能正确显示。

比如：我们有一个容器是页面的 1/4 宽，有一个蓝色的背景，1px 灰色的边框，10px 的左右边距，5px 的上边距，10px 的下边距。以前对于这样一个样式，我们常常给这个容器创建一个类，并把这些样式写在一起。像下面这样。

```
<div class="box"></div>

<style>
  .box {
    width: 25%;
    margin: 5px 10px 10px;
    background: blue;
    border: 1px solid #ccc;
  }
</style>
```

然而使用 OOCSS 的话，我们不能这样做，OOCSS 要求为这个容器创建更多的 “原子类”，并且每个样式对应一个类，这样是为了后面可以重复使用这些组件的样式，避免重复写相同的样式，就拿这个实例来说，我们给这个容器增加下面的类：

```
<div class="size1of4 bgBlue solidGray mt-5 ml-10 mr-10 mb-10"></div>

<style>
  .size1of4 { width: 25%; }
  .bgBlue { background: blue; }
  .solidGray { border: 1px solid #ccc; }
  .mt-5 { margin-top: 5px; }
  .mr-10 { margin-right: 10px }
  .mb-10 { margin-bottom: 10px; }
  .ml-10 { margin-left: 10px; }
</style>
```

OOCSS 最大的优点是让样式可复用性最大化，也能够显著减少整体的 CSS 代码数量。缺点也很明显，你需要为每个元素搜集一大堆类名，这可是一个不小的体力活 😅。

在 OOCSS 中，类名既要能传递对象的用途，也要有通用性，例如 mod、complex、pop 等。如果将 CSS 类命名的太语义化，例如 navigation-bar，那么就会将其限制在导航栏，无法应用到网页的其它位置。

### SMACSS

[SMACSS](https://link.juejin.cn?target=http%3A%2F%2Fsmacss.com "http://smacss.com")（Scalable and Modular Architecture for CSS）即可伸缩及模块化的 CSS 结构，由 Jonathan Snook 在 2011 年雅虎时提出。

SAMCSS 按照部件的功能特性，将其划分为五大类：

1.  基础（Base）是为 HTML 元素定义默认样式，可以包含属性、伪类等选择器。
2.  布局（Layout）会将页面分为几部分，可作为高级容器包含一个或多个模块，例如左右分栏、栅格系统等。
3.  模块（Module）又名对象或块，是可重用的模块化部分，例如导航栏、产品列表等。
4.  状态（State）描述的是任一模块或布局在特定状态下的外观，例如隐藏、激活等。
5.  主题（Theme）也就是换肤，描述了页面的外观，它可修改前面四个类别的样式，例如链接颜色、布局方式等。

SMACSS 推荐使用前缀来区分不同部件：

1.  基础规则是直接作用于元素的，因此不需要前缀。
2.  布局的前缀是 `l-` 或 `layout-`，例如 `.l-table`、`.layout-grid` 等。
3.  模块的前缀是 `m-` 或模块自身的命名，例如 `.m-nav`、`.card`、`.field` 等。
4.  状态的前缀是 `is-`，例如 `.is-active`、`.is-current` 等。
5.  主题的前缀是 `theme-`，例如 `.theme-light`、`.theme-dark` 等。

```
<form class="layout-grid">
  <div class="field">
    <input type="search" id="searchbox" />
    <span class="msg is-error">There is an error!</span>
  </div>
</form>
```

### ITCSS

[ITCSS](https://link.juejin.cn?target=https%3A%2F%2Fitcss.io "https://itcss.io")（Inverted Triangle CSS，倒三角 CSS）是一套方便扩展和管理的 CSS 体系架构，它兼容 BEM、OOCSS、SMACSS 等 CSS 命名方法论。ITCSS 使用 **分层** 的思想来管理你的样式文件，类似服务端开发中的 MVC 分层设计。

ITCSS 将 CSS 的样式规则划分成以下的几个层次：

1.  Settings：项目使用的全局变量，比如颜色，字体大小等等。
2.  Tools：项目使用的 mixins 和 functions。到 Tools 为止，不会生成具体的 CSS 代码。
3.  Generic：最基本的设定，比如 reset.css、normalize.css 等。
4.  Base：最基础的元素（elements），比如 img、p、link、list 等。
5.  Objects：某种设计模式，比如水平居中，
6.  Components：UI 组件，比如 button、switch、slider 等。
7.  Trumps：用于辅助和微调的样式，只有这一层才可以使用 `!important`。

ITCSS 的分层逻辑越往下就越具体，越局限在某个具体的场景。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e4cb70583db4d3bb8b5ed8bb2d604b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

根据 ITCSS 的思想，你可以这样组织你的 CSS 样式文件：

```
stylesheets/
├── settings/
│   ├── colors.scss
│   ├── z-layers.scss
│   └── breakpoints.scss
├── tools/
│   ├── mixins.scss
│   └── functions.scss
├── generic/
│   ├── box-sizing.scss
│   └── normalize.scss
├── base/
│   ├── img.scss
│   └── list.scss
├── objects/
│   ├── grid.scss
│   └── media.scss
├── components/
│   ├── buttons.scss
│   └── slider.scss
├── trumps/
│   ├── widths.scss
│   └── gaps.scss
└── index.scss
```

下面是几个基于 ITCSS 的模版项目，可供参考：

*   [github.com/itcss/itcss…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fitcss%2Fitcss-netmag "https://github.com/itcss/itcss-netmag")
*   [github.com/gpmd/itcss-…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgpmd%2Fitcss-boilerplate "https://github.com/gpmd/itcss-boilerplate")
*   [github.com/cameronroe/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcameronroe%2Fbootstrap-itscss "https://github.com/cameronroe/bootstrap-itscss")

CSS Modules
-----------

> 📚 上面提到的这些 CSS 命名方法论，虽然已经不适用于当今的自动化工作流和大前端环境，但是他们有其诞生的时代背景，也确实推动了 CSS 模块化的发展，其背后的设计思想同样值得我们学习，甚至有时候我们仍然能在某些场合下看到他们的影子。

手写命名前缀后缀的方式让开发者苦不堪言，于是 [CSS Modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fcss-modules "https://github.com/css-modules/css-modules") 这种真正的模块化工具就诞生了。

CSS Modules 允许我们像 import 一个 JS Module 一样去 import 一个 CSS Module。每一个 CSS 文件都是一个独立的模块，每一个类名都是该模块所导出对象的一个属性。通过这种方式，便可在使用时明确指定所引用的 CSS 样式。并且，CSS Modules 在打包时会自动将 id 和 class 混淆成全局唯一的 hash 值，从而避免发生命名冲突问题。

> 这里仅罗列一些 CSS Modules 的核心特性，更具体的用法可以参考 [官网](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fcss-modules "https://github.com/css-modules/css-modules") 或 [阮老师的《CSS Modules 用法教程》](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2016%2F06%2Fcss_modules.html "http://www.ruanyifeng.com/blog/2016/06/css_modules.html")。

CSS Modules 特性：

*   **作用域**：模块中的名称默认都属于本地作用域，定义在 `:local` 中的名称也属于本地作用域，定义在 `:global` 中的名称属于全局作用域，全局名称不会被编译成哈希字符串。
*   **命名**：对于本地类名称，CSS Modules 建议使用 camelCase 方式来命名，这样会使 JS 文件更干净，即 `styles.className`。 但是你仍然可以固执己见地使用 `styles['class-name']`，允许但不提倡。🤪
*   **组合**：使用 `composes` 属性来继承另一个选择器的样式，这与 Sass 的 `@extend` 规则类似。
*   **变量**：使用 `@value` 来定义变量，不过需要安装 PostCSS 和 [postcss-modules-values](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fpostcss-modules-values "https://github.com/css-modules/postcss-modules-values") 插件。

```
/* style.css */
:global(.card) {
  padding: 20px;
}
.article {
  background-color: #fff;
}
.title {
  font-size: 18px;
}
```

```
// App.js
import React from 'react'
import styles from './style.css'

export default function App() {
  return (
    <article className={styles.article}>
      <h2 className={styles.title}>Hello World</h2>
      <div class>Lorem ipsum dolor sit amet.</div>
    </article>
  )
}
```

编译结果：

```
<style>
  .card {
    padding: 20px;
  }
  .style__article--ht21N {
    background-color: #fff;
  }
  .style__title--3JCJR {
    font-size: 18px;
  }
</style>

<article class="style__article--ht21N">
  <h2 class="style__title--3JCJR">Hello World</h2>
  <div class="card">Lorem ipsum dolor sit amet.</div>
</article>
```

### CSS Modules 集成

在 webpack 中使用 CSS Modules（开启 [css-loader](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader "https://github.com/webpack-contrib/css-loader") 的 modules 特性）：

```
// webpack.config.js -> module.rules
{
  test: /\.(c|sa|sc)ss$/i,
  exclude: /node_modules/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        // 开启 CSS Modules
        modules: true,
        // 借助 CSS Modules，可以很方便地自动生成 BEM 风格的命名
        localIdentName: '[path][name]__[local]--[hash:base64:5]',
      },
    },
    'postcss-loader',
    'sass-loader',
  ],
},
```

在 PostCSS 中使用 CSS Modules（使用 [postcss-modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmadyankin%2Fpostcss-modules "https://github.com/madyankin/postcss-modules") 插件）：

```
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-modules': {
      generateScopedName: '[path][name]__[local]--[hash:base64:5]',
    },
  },
}
```

### 配合 CSS 预处理器使用

使用 CSS Modules 时，推荐配合 CSS 预处理器（Sass/Less/Stylus）一起使用。

CSS 预处理器提供了许多有用的功能，如嵌套、变量、mixins、functions 等，同时也让定义本地名称或全局名称变得容易。

```
:global(.title) {
  color: yellow;
}

:global {
  .global-class-name {
    color: green;
  }
}
```

### VSCode 扩展支持

在 VSCode 中写 CSS Modules 代码，默认是没有自动提示和跳转至定义处的功能，不够智能。

可以安装[](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")

[CSS-in-JS](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

[React 的出现，打破了以前 “关注点分离” 的网页开发原则，因其采用组件结构，而组件又强制要求将 HTML、CSS 和 JS 代码写在一起。表面上看是技术的倒退，实际上并不是。](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")

[React 是在 JS 中实现了对 HTML 和 CSS 的封装，赋予了 HTML 和 CSS 全新的 “编程能力”。对于 HTML，衍生了 JSX 这种 JS 的语法扩展，你可以将其理解为 HTML-in-JS；对于 CSS，衍生出一系列的第三方库，用来加强在 JS 中操作 CSS 的能力，它们被称为 CSS-in-JS。](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")

[随着 React 的流行以及组件化开发模式的深入人心，这种 "关注点混合" 的新写法逐渐成为主流。](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")

> [
> 
> Any application that can be written in JavaScript, will eventually be written in JavaScript. —— Jeff Atwood
> 
> ](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=")

[CSS-in-JS 库目前已有几十种实现，你可以在](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dclinyong.vscode-css-modules "https://marketplace.visualstudio.com/items?item>CSS Modules</a> 扩展。</p><p></p><p><img class=") [CSS in JS Playground](https://link.juejin.cn?target=https%3A%2F%2Fwww.cssinjsplayground.com%2F "https://www.cssinjsplayground.com/") 上快速尝试不同的实现。下面列举一些流行的 CSS-in-JS 库：

*   styled-components：[github.com/styled-comp…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstyled-components%2Fstyled-components "https://github.com/styled-components/styled-components") 33k（**推荐**）
*   emotion：[github.com/emotion-js/…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Femotion-js%2Femotion "https://github.com/emotion-js/emotion") 13k
*   Radium：[github.com/FormidableL…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FFormidableLabs%2Fradium "https://github.com/FormidableLabs/radium") 7k（已不再维护）
*   Styled System：[github.com/styled-syst…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstyled-system%2Fstyled-system "https://github.com/styled-system/styled-system") 7k
*   styled-jsx：[github.com/vercel/styl…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvercel%2Fstyled-jsx "https://github.com/vercel/styled-jsx") 6k
*   JSS：[github.com/cssinjs/jss](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcssinjs%2Fjss "https://github.com/cssinjs/jss") 6k

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c62c99ec289143bd9c0b5344c29d9048~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### styled-components 💅

styled-components 是目前最流行的 CSS-in-JS 库，在 React 中被广泛使用。

它使用 ES6 提供的模版字符串功能来构造 “样式组件”。

```
// styles.js
import styled, { css } from 'styled-components'

// 创建一个名为 Wrapper 的样式组件 (一个 section 标签, 并带有一些样式)
export const Wrapper = styled.section`
  padding: 10px;
  background: deepskyblue;
`

// 创建一个名为 Title 的样式组件 (一个 h1 标签, 并带有一些样式)
export const Title = styled.h1`
  font-size: 20px;
  text-align: center;
`

// 创建一个名为 Button 的样式组件 (一个 button 标签, 并带有一些样式, 还接收一个 primary 参数)
export const Button = styled.button`
  padding: 10px 20px;
  color: #333;
  background: transparent;
  border-radius: 4px;

  ${(props) => props.primary && css`
    color: #fff;
    background: blue;
  `}
`
```

```
// App.js
import React from 'react'
import { Wrapper, Title, Button } from './styles'

// 然后，像使用其他 React 组件一样使用这些样式组件
export default function App() {
  return (
    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
      <Button>Normal Button</Button>
      <Button primary>Primary Button</Button>
    </Wrapper>
  )
}
```

更多使用技巧（更具体的内容请参考 [官方文档](https://link.juejin.cn?target=https%3A%2F%2Fstyled-components.com%2F "https://styled-components.com/")）：

*   可以通过插值的方式给样式组件传递参数（`props`），这在需要动态生成样式规则时特别有用。
*   可以通过构造函数 `styled()` 来继承另一个组件的样式。
*   使用 `createGlobalStyle` 来创建全局 CSS 规则。
*   styled-components 会为自动添加浏览器兼容性前缀。
*   styled-components 基于 [stylis](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fthysultan%2Fstylis.js%23readme "https://github.com/thysultan/stylis.js#readme")（一个轻量级的 CSS 预处理器），你可以在样式组件中直接使用嵌套语法，就像在 Sass/Less/Stylus 中的那样。
*   强烈推荐使用 styled-components 的 Babel 插件 [babel-plugin-styled-components](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstyled-components%2Fbabel-plugin-styled-components "https://github.com/styled-components/babel-plugin-styled-components")（当然这不是必须的）。它提供了更好的调试体验的支持，比如更清晰的类名、SSR 支持、压缩代码等等。
*   你也可以在 Vue 中使用 styled-components，[vue-styled-components](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstyled-components%2Fvue-styled-components "https://github.com/styled-components/vue-styled-components")，不过好像没人会这么做~
*   默认情况下，模版字符串中的 CSS 代码在 VSCode 中是没有智能提示和语法高亮效果的，需要安装 [在 Vue 中编写 CSS 的正确姿势
    
    **方式一：使用 Scoped CSS（推荐）**
    
    为 `<style>` 区块添加 `scoped` 属性即可开启 “组件样式作用域（Scoped CSS）”。
    
    在背后，Vue 会为该组件内所有的元素都加上一个全局唯一的属性选择器，形如 `[data-v-5298c6bf]`，这样在组件内的 CSS 就只会作用于当前组件中的元素。
    
    ```
    <template>
      <header class="header">header</header>
    </template>
    
    <style scoped>
    .header {
      background-color: green;
    }
    </style>
    ```
    
    编译结果：
    
    ```
    <header class="header" data-v-5298c6bf>header</header>
    
    <style>
    .header[data-v-5298c6bf] {
      background-color: green;
    }
    </style>
    ```
    
    **方式二：使用 CSS Modules**
    
    为 `<style>` 区块添加 `module` 属性即可开启 CSS Modules。
    
    在背后，Vue 会为组件注入一个名为 `$style` 的计算属性，并混淆类名，然后你就可以在模板中通过一个动态类绑定来使用它了。
    
    ```
    <template>
      <header :class="$style.header">header</header>
    </template>
    
    <style module>
    .header {
      background-color: green;
    }
    </style>
    ```
    
    编译结果：
    
    ```
    <header class="App__header--382G7">header</header>
    
    <style>
    .App__header--382G7 {
      background-color: green;
    }
    </style>
    ```
    
    在 React 中编写 CSS 的正确姿势
    ---------------------
    
    React 并没有给我们提供与 Vue `scoped` 类似的特性，我们需要通过其他方式来实现 CSS 模块化。
    
    在 React 中有很多编写 CSS 的姿势，这里推荐几种最常见的：
    
    ](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Djpoissonnier.vscode-styled-components "https://marketplace.visualstudio.com/items?item>扩展</a>。</li>
    </ul><p></p><h2 data-id=")
    
    [*   **使用 styled-components**：styled-components 是最流行也是最好用的 CSS-in-JS 库，它将 CSS、JS 以及 React 开发中最流行的一些语法整合起来，易上手，且功能强大。](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Djpoissonnier.vscode-styled-components "https://marketplace.visualstudio.com/items?item>扩展</a>。</li>
    </ul><p></p><h2 data-id=")2.  [**使用 CSS Modules**：在外部管理 CSS，然后将类名映射到组件内部，他会为每个 class 都分配一个全局唯一 hash。另外，这两个插件会帮你更好地在 React 中使用 CSS Modules：](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Djpoissonnier.vscode-styled-components "https://marketplace.visualstudio.com/items?item>扩展</a>。</li>
        </ul><p></p><h2 data-id=")[react-css-modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgajus%2Freact-css-modules "https://github.com/gajus/react-css-modules")、[babel-plugin-react-css-modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgajus%2Fbabel-plugin-react-css-modules "https://github.com/gajus/babel-plugin-react-css-modules")。
    
    CSS Modules 与 styled-components 是两种截然不同的 CSS 模块化方案，它们最本质的区别是：前者是在外部管理 CSS，后者是在组件中管理 CSS。两者没有孰好孰坏，如果你能接受 CSS-in-JS 这种编程模式，更推荐使用 styled-components。如果一时无法接受，觉得其过于激进了，那就用 CSS Modules。It doesn't matter，选择了哪一个，就用哪一个的体系去管理项目就好了。
    
    参考资料
    ----
    
    1.  [BEM: A New Front-End Methodology — Smashing Magazine](https://link.juejin.cn?target=https%3A%2F%2Fwww.smashingmagazine.com%2F2012%2F04%2Fa-new-front-end-methodology-bem%2F "https://www.smashingmagazine.com/2012/04/a-new-front-end-methodology-bem/")
    2.  [Battling BEM CSS: 10 Common Problems And How To Avoid Them — Smashing Magazine](https://link.juejin.cn?target=https%3A%2F%2Fwww.smashingmagazine.com%2F2016%2F06%2Fbattling-bem-extended-edition-common-problems-and-how-to-avoid-them%2F "https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/")
    3.  [An Introduction To Object Oriented CSS (OOCSS) — Smashing Magazine](https://link.juejin.cn?target=https%3A%2F%2Fwww.smashingmagazine.com%2F2011%2F12%2Fan-introduction-to-object-oriented-css-oocss%2F "https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/")
    4.  [MicheleBertoli/css-in-js: React: CSS in JS techniques comparison](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMicheleBertoli%2Fcss-in-js "https://github.com/MicheleBertoli/css-in-js")
    5.  [CSS Modules 用法教程 - 阮一峰的网络日志](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fcss-modules "https://github.com/css-modules/css-modules")
    6.  [CSS in JS 简介 - 阮一峰的网络日志](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F04%2Fcss_in_js.html "http://www.ruanyifeng.com/blog/2017/04/css_in_js.html")