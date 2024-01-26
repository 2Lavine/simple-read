> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6947335144894103583?searchId=20240120202017BD9D5A30E810FAEC4E61)

根据这些 CSS 模块化方案的特点，我简单的将它们分为了三大类：
1.  **CSS 命名方法论**：通过人工的方式来约定命名规则。
2.  **CSS Modules**：一个 CSS 文件就是一个独立的模块。
3.  **CSS-in-JS**：在 JS 中写 CSS。

CSS 命名方法论
---------
为了避免 CSS 选择器命名冲突的问题，以及更好的实现 CSS 模块化，CSS 社区在早期诞生了一些 CSS 命名方法论，它们几乎都有一个共同的特点——为选择器增加冗长的前缀或后缀，并试图通过人工的方式来生成全局唯一的命名。
这无疑会增加了类命名的复杂度和维护成本，也让 HTML 标签显得臃肿。
### BEM
核心思想是 **通过组件名的唯一性来保证选择器的唯一性，从而保证样式不会污染到组件外**。

BEM 命名规约是 `.block-name__element-name--modifier-name`，
即 `.模块名__元素名--修饰器名` 三个部分，
- 用双下划线 `__` 来明确区分模块名和元素名，
- 用双横线 `--` 来明确区分元素名和修饰器名。
在 BEM 中不建议使用子代选择器，因为每一个类名已经都是全局唯一的了，除非是 block 相互嵌套的场景。

```
<!-- 示例模块 -->
<div class="card">
  <div class="card__head">
    <ul class="card__menu">
      <li class="card__menu-item">menu item 1</li>
      <li class="card__menu-item card__menu-item--active">menu item 3</li>
      <li class="card__menu-item card__menu-item--disable">menu item 4</li>
    </ul>
  </div>
  <div class="card__body"></div>
  <div class="card__foot"></div>
</div>
```

### OOCSS
[OOCSS](https://link.juejin.cn?target=http%3A%2F%2Foocss.org "http://oocss.org")（Object-Oriented CSS）即面向对象的 CSS，它借鉴了 OOP（面向对象编程）的抽象思维，
- 主张将元素的样式抽象成多个独立的小型样式类，来提高样式的灵活性和可重用性。

OOCSS 有两个基本原则：
1.  **独立的结构和样式**。即不要将定位、尺寸等布局样式与字体、颜色等表现样式写在一个选择器中。
2.  **独立的容器和内容**。即让对象的行为可预测，避免对位置的依赖，子元素即使离开了容器也应该能正确显示。
3. 
OOCSS 要求为这个容器创建更多的 “原子类”，并且每个样式对应一个类，这样是为了后面可以重复使用这些组件的样式，避免重复写相同的样式，就拿这个实例来说，我们给这个容器增加下面的类：

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

CSS Modules
-----------
手写命名前缀后缀的方式让开发者苦不堪言，于是 [CSS Modules](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcss-modules%2Fcss-modules "https://github.com/css-modules/css-modules") 这种真正的模块化工具就诞生了。

CSS Modules 允许我们像 import 一个 JS Module 一样去 import 一个 CSS Module。
- 每一个 CSS 文件都是一个独立的模块，每一个类名都是该模块所导出对象的一个属性。通过这种方式，便可在使用时明确指定所引用的 CSS 样式。并且，
- CSS Modules 在打包时会自动将 id 和 class 混淆成全局唯一的 hash 值，从而避免发生命名冲突问题。

CSS Modules 特性：
*   **作用域**：
	* 模块中的名称默认都属于本地作用域，定义在 `:local` 中的名称也属于本地作用域，
	* 定义在 `:global` 中的名称属于全局作用域，全局名称不会被编译成哈希字符串。
*   **命名**：
	* 对于本地类名称，CSS Modules 建议使用 camelCase 方式来命名，这样会使 JS 文件更干净，即 `styles.className`。 
	* 但是你仍然可以固执己见地使用 `styles['class-name']`，允许但不提倡。
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

在 Vue 中编写 CSS 的正确姿势
--
方式一：使用 Scoped CSS（推荐）
为 \<style\> 区块添加 scoped 属性即可开启 “组件样式作用域（Scoped CSS）”。
在背后，Vue 会为该组件内所有的元素都加上一个全局唯一的属性选择器，形如 [data-v-5298c6bf]，这样在组件内的 CSS 就只会作用于当前组件中的元素。
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

方式二：使用 CSS Modules
为 <\style\> 区块添加 module 属性即可开启 CSS Modules。
在背后，Vue 会为组件注入一个名为 $style 的计算属性，并混淆类名，然后你就可以在模板中通过一个动态类绑定来使用它了。
<template>
  <header :class="$style.header">header</header>
</template>
```
<style module>
.header {
  background-color: green;
}
</style>
编译结果：

<header class="App__header--382G7">header</header>

<style>
.App__header--382G7 {
  background-color: green;
}
</style>
```

在 React 中编写 CSS 的正确姿势
--
React 并没有给我们提供与 Vue scoped 类似的特性，我们需要通过其他方式来实现 CSS 模块化。

在 React 中有很多编写 CSS 的姿势，这里推荐几种最常见的：
- 使用 styled-components：styled-components 是最流行也是最好用的 CSS-in-JS 库，它将 CSS、JS 以及 React 开发中最流行的一些语法整合起来，易上手，且功能强大。
- 使用 CSS Modules：在外部管理 CSS，然后将类名映射到组件内部，他会为每个 class 都分配一个全局唯一 hash。另外，这两个插件会帮你更好地在 React 中使用 CSS Modules：react-css-modules、babel-plugin-react-css-modules。


## CSS Modules 与 styled-components 
CSS Modules 与 styled-components 是两种截然不同的 CSS 模块化方案，它们最本质的区别是：前者是在外部管理 CSS，后者是在组件中管理 CSS。两者没有孰好孰坏，如果你能接受 CSS-in-JS 这种编程模式，更推荐使用 styled-components。如果一时无法接受，觉得其过于激进了，那就用 CSS Modules。It doesn't matter，选择了哪一个，就用哪一个的体系去管理项目就好了。