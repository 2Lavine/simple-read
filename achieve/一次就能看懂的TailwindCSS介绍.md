> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7042901516499288077?searchId=2023082216553056BD93B193AD0875235E)
## 什么是 tailwind CSS
Tailwind CSS 是一个利用公用程序类（`Utilize Class`）的 CSS 框架。
- Bootstrap 和 Bulma 等框架利用预先准备好的组件（例如按钮、菜单和面包屑）进行设计。
- 在 Tailwind CSS 中，没有准备任何组件，而是使用`Utilize Class`来创建和设计自己的组件。
## Headless UI
Tailwind CSS 还提供了一个 Headless UI，如果你想创建复杂的组件（例如下拉菜单和对话框），你可以使用

## 原创性
原来 Bootstrap 等框架可以通过提前准备组件集合来高效地设计网站，但是有一个缺点，就是因为使用了相同的设计，所以没有原创性。
相比之下，Tailwind CSS 没有组件集合，所以即使你创建一个名为相同按钮的组件，每个人都会应用不同的`Utilize Class`创建它，可以创建出一个高度原创的网站。

### 什么是 Utilize Class？

这里设置的`Utilize Class`在类本身中没有特定的含义（不像`Bootstrap`的 class `btn`代表的就是按钮）可以用在各种地方（有时用于按钮），
所以它被命名为实用程序类（`Utilize Class`）。也就是说`Utilize Class`是 Tailwind CSS 中预先配置的类。
在解释 Tailwind 的`Utilize Class`时，社区中使用了低级别一词，例如低级别样式、低级别实用程序类和低级别框架。
### 创建一个按钮

例如，如果要使用 Bootstrap 创建按钮，请将`class`设置为`btn` 
但在 Tailwind 中，并没有 `btn` 等用于创建按钮的 class，你可以通过编写如下所示的`Utilize Class`来创建按钮。

`bg-indigo-700` 设置颜色，`font-semibold` 设置字体粗细，`text-white` 设置文本颜色，`py-2` 设置左右填充，`px` 设置上下填充，`rounded` 设置圆角。
你可能会觉得要设置的类太多了，但是学习成本很低，可以通过搜索 `Tailwind CSS 文档`轻松找到要用的类名。

```
<button class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded">前端晚间课</button>
```
## 使用未注册颜色
有 9 种不同的字体大小和相当多的颜色的`Utilize Class`，因此你可以通过仅更新 html 文件进行设计，而无需编写自己的 css 样式
如果你想使用未在 Tailwind CSS 的`Utilize Class`中注册的颜色，你可能想知道该怎么做。在这种情况下，你可以通过在 Tailwind CSS 配置文件中注册它，以与其他 Tailwind CSS `Utilize Class`相同的方式使用它。

> 在当前版本中，即使未在`Utilize Class`中注册，也可以使用括号设置`text-[#121212]`和`w-[100px]`等固定值，而无需在配置文件中对其进行描述。对于经常使用的那些，继续在配置文件中进行设置会更有效率。

### 为什么选择 Tailwind CSS？

与 style 属性相比，使用 Tailwind CSS 是有一些优势的。

使用 Tailwind CSS，你可以使用`Utilize Class`轻松设置响应式设计，因此您无需设置媒体查询。
此外，作为伪类的悬停和焦点等设置无法通过 style 属性进行设置，但在 Tailwind CSS 中，可以通过利用类设置伪类。你还可以使用`Utilize Class`通过 CSS 设置动画和渐变颜色。

搭建环境
----
### 使用 cdn 的方法

使用 cdn 时，请将以下链接标签粘贴到 html 中。

```
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
```

请注意，如果你使用 cdn，你将无法自定义 Tailwind CSS，这将在本文档后面介绍，例如添加颜色。

### 使用 npm/yarn 安装 Tailwind css
```
$ npm install tailwindcss@latest
```

接下来，创建一个 style.css 文件。将以下三个 `tailwind 指令`添加到 style.css 文件中。
这个 style.css 不能直接从 html 中读取。因此，我们稍后会构建它，并将其转换为熟悉的 html 可以读取的 css 文件。
通过构建，Tailwindcss 使用的`Utilize Class`将从基础、组件和实用程序中提取。
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 构建 Tailwind css 文件
创建一个`public/css`目录来存放构建后创建的 css 文件。
让我们实际构建并创建一个 css 文件，以从添加了 Tailwind 指令的 style.css 文件中读取 html。

```
$  % npx tailwind build ./css/style.css -o ./public/css/style.css
   🚀 Building: css/style.css
```
使用 npx 命令构建，可以将 build 命令添加到 package.json 文件中
```
"scripts": {
  "build": "tailwind build css/style.css -o public/css/style.css"
},
```

## build 之后的 css 文件
你可以看到创建的 css 文件包含普通的 CSS。
由于 Twailwind 预先创建的所有`Utilize Class`都有描述，因此文件很大，行数为 50,000 或更多。
你还可以看到在创建的 style.css 文件的顶部应用了现代规范化。

```
/*! tailwindcss v2.1.2 | MIT License | https://tailwindcss.com */

/*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

```

你还可以看到在创建的 style.css 文件的顶部应用了现代规范化。


### 字符大小设置

要设置字体大小，请使用 `text- {size}`。大小可以取 13 个值。相应的 CSS 样式在括号中。

```
.text-xs（字体大小：.75rem；）
.text-sm（字体大小：.875rem；）
.text-base（字体大小：1rem;）
.text-lg（字体大小：1.125rem；）
.text-xl（字体大小：1.25rem；）
.text-2xl（字体大小：1.5rem；）
.text-3xl（字体大小：1.875rem；）
.text-4xl（字体大小：2.25rem；）
.text-5xl（字体大小：3rem；）
.text-6xl（字体大小：4rem；）
.text-7xl（字体大小：4.5rem；）
.text-8xl（字体大小：6rem；）
.text-9xl（字体大小：8rem；）
```

### 字符粗细设置

要设置字符粗细，请使用 `font- {thickness}`。厚度可以取 9 个值。相应的 CSS 样式在括号中。

```
.font-thin (font-weight: 100;)
.font-extralight (font-weight: 200;)
.font-light (font-weight: 300;)
.font-normal (font-weight: 400;)
.font-medium (font-weight: 500;)
.font-semibold (font-weight: 600;)
.font-bold（font-weight：700；）
.font-extrabold（font-weight：800；）
.font-black（font-weight：900；）
```
### 文字颜色设置

要设置文本颜色，请使用 `text- {color}-{color depth}`。颜色强度可以取 **9** 个值。例如，在绿色的情况下，如下所示。

```
text-green-100（颜色：# f0fff4;）
text-green-200（颜色：#c6f6d5；）
text-green-300（颜色：#9ae6b4；）
text-green-400（颜色：#68d391；）
text-green-500（颜色：#48bb78；）
text-green-600（颜色：#38a169；）
text-green-700（颜色：#2f855a；）
text-green-800（颜色：#276749；）
text-green-900（颜色：#22543d；）
```

## 创建按钮

现在你知道`Utilize Class`的样子，让我们使用`Utilize Class`来创建一个按钮。

```
<button class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded">前端晚间课</button>
```

在`py-2`中，上下设置了`.5rem padding`，在`px-4`中，左右设置了`1rem padding`。在圆形中，边界半径 .25rem 被应用并且角被圆化。

### Tailwind CSS 自定义

由于按钮是一个很有可能被重用的组件，并且你希望在应用程序中统一设计，你可以注册`Utilize Class`集来创建按钮作为另一个类。

打开预构建的 `css / style.css` 文件并在 `@components` 和 `@utility` 指令之间添加以下内容。

```
@tailwind base;

@tailwind components;

.btn{
    @apply font-semibold text-white py-2 px-4 rounded;
}

@tailwind utilities;
```

然后重新构建一下，`npm run build`,

会覆盖构建完后的`public/css/style.css`，所以打开`style.css`文件，搜索`btn`

可以看到刚才用`@apply` 添加的内容已经作为 css 添加到`style.css`文件中了,

```
.btn{
  font-weight: 600;
  color: #fff;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.25rem;
}
```

### 伪类设置悬停

了解如何通过悬停在 Tailwind 中执行伪类，以在光标悬停在按钮上时更改按钮的颜色。如果要更改颜色，请在悬停后设置颜色，设置将可以体现出来。

```
<button class="bg-red-700 btn hover:bg-red-500">前端晚间课</button>
```
### 伪类设置焦点

单击按钮时还要设置焦点。为了清晰起见，从圆角变为圆形以强调按钮的圆度。修改`@apply`

```
@tailwind base;

@tailwind components;
.btn{
    @apply font-semibold text-white py-2 px-4 rounded-full;
}
@tailwind utilities;
```

当选择按钮（使用选项卡）时，将显示一个方框。单击时会出现一个方框，因此我们通过设置焦点以擦除方框。

当我将焦点设置为无轮廓时，外框消失，但我不知道按钮是否被选中。

```
<button class="bg-red-700 btn hover:bg-red-500 focus:outline-none">前端晚间课</button>
```

设置阴影轮廓，以便您可以看到按钮被选中。如果你设置它，会沿着按钮创建一个阴影，所以用户不会感到任何不适。

```
<button class="bg-red-700 btn hover:bg-red-500 focus:outline-none focus:shadow-outline">前端晚间课</button>
```

### 过渡设置

我确认通过设置伪类的悬停可以在光标移到按钮上时更改按钮的颜色。当光标悬停在按钮上时，你可以看到颜色。你可以通过使用过渡慢慢改变按钮的颜色。下
面通过设置 duration-1000，颜色会在 1 秒内缓慢变化。持续时间的多个值从 duration-75 到 duration-1000 注册。

```
<button class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded hover:bg-red-700 duration-1000">前端晚间课</button>
```

### 变换设置

如果你想让按钮本身变大并通过悬停更改按钮的颜色，
您可以使用`transform` 和`scaling` 的`Utilize Class`来实现。

```
<button class="bg-indigo-700 font-semibold text-white py-2 px-4 rounded transform hover:scale-110 hover:bg-red-700 duration-1000">前端晚间课</button>
```

### 群组设置

到目前为止的 hover 设置中，当光标经过目标元素时，hover 的变化就会发生在元素上，但是在 group 设置中，当光标经过父元素时，设置 hover 的子元素中就可以呈现 hover 效果。

在下面的示例中，当光标经过设置了 group 的父元素时，由于为子元素设置的悬停设置，一个 p 标签元素的文本颜色变为红色，另一个变为蓝色。

```
<div class="group m-10 p-10 border hover:bg-gray-100">
  <p class="font-black group-hover:text-red-900">前端晚间课</p>
  <p class="font-black group-hover:text-blue-900">前端晚间课</p>
</div>
```

### 动画设置

只需将 `animate-bounce` 和 `animate-pulse` 设置为 class，您就可以轻松设置动画，而无需设置复杂的 CSS。

tailwind.confing.js 配置文件
------------------------

### 创建配置文件

使用 Tailwind CSS，你可以通过添加 Tailwind CSS `Utilize Class`中未包含的颜色、边距、宽度等进行自定义。自定义需要配置文件，但默认情况下不会创建，所以使用命令创建。

```
% npx tailwind init
   ✅ Created Tailwind config file: tailwind.config.js
```

上面的命令将创建一个 `tailwind.config.js` 文件。

### 添加颜色

```
module.exports = {
  theme: {
    extend: {
      colors: {
        cyan: '#9cdbff',
      }
    }
  },
  variants: {},
  plugins: []
}
```
添加后，构建，`npm run build`
将按钮颜色从红色更改为青色。由于加入青色时没有设置色深，所以设置为`bg-cyan`（从`bg-red-700`改为`bg-cyan`）。

```
<button class="bg-cyan btn hover:bg-red-500 focus:outline-none focus:shadow-outline">前端晚间课</button>
```
### 添加最大宽度并添加间距

你可以使用 `max-width` 设置浏览器上元素的最大宽度，但你可能希望将其设置为与 Tailwind CSS 中默认注册的宽度不同的宽度。
在这种情况下，请在 tailwind.config.js 以及颜色中进行其他设置。
```
theme: {
    extend: {
        colors:{
            'cyan':'#9cdbff',
        },
        maxWidth:{
            custom:'60rem',
        },
    },
    variants: {},
    plugins: []
},
```

在 class 属性中使用时，设置`max-w-custom`。
可以使用间距设置宽度。
```
theme: {
    extend: {
        colors:{
            'cyan':'#9cdbff',
        },
        maxWidth:{
            custom:'60rem',
        },
        spacing:{
            76: '19rem',
        },
    },
    variants: {},
    plugins: []
},
```

在 class 属性中使用时，设置为`w-76`。
即使你不使用配置文件，你也可以为那些不经常使用的样式设置一个诸如`p-[19rem]`之类的描述。

### 添加字体大小
最小的字体大小类是`text-xs`，但是如果你想添加一个更小的字体大小类，你可以这样做。

```
theme: {
    extend: {
        fontSize:{
            xxs:['0.625em',{lineHeight:'1rem'}],
        },
    },
    variants: {},
    plugins: []
},
```

如果要使用它，请在 class 属性中设置 `text-xxs` 。

### 如何自定义其他值

我解释了如何添加颜色、最大宽度、宽度和字体大小，但是当我想添加框阴影时，我应该在哪里查看设置方法，例如？
首先，转到官方 `Tailwind CSS` 文档并进行搜索。 
在文档中搜索 搜索时，将显示 Box Shadow 页面。
盒子阴影页面
滚动时，您会找到`自定义`。Tailwind CSS 中默认注册的值会显示在那里，所以如果你想用一个没有包含的值来设置它，请根据显示的设置方法将它添加到 `tailwind.config.js` 文件中。
Tailwind CSS 插件设置
-----------------
Tailwind CSS 提供了一些官方插件。
让我们检查一下如何设置`tailwindcss / line-clamp`，这是插件之一。
当在浏览器上显示像下面这样的长句时，它也会在浏览器上显示多行。
如果你只想查看前几行而不是所有行，则可以使用插件 `tailwindcss / line-clamp`。
```
% npm install @tailwindcss/line-clamp
```
安装完成后，需要在`tailwind.config.js`中注册安装包的信息。
```
plugins: [require('@tailwindcss/line-clamp'),],
```

进行设置构建完成后，使用插件的设置就完成了。
`line-clamp` 设置 `line-clamp` 后要显示的行数，如下所示。
```
<div class="m-20">
  <div class="line-clamp-3">
    Lorem ipsum dolor sit amet//略
  </div>
</div>
```
只能显示设置了 line-clamp-3 的 3 行。