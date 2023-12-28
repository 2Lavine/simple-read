> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6854573220306255880?searchId=2023122313512117F1088258584568D266)
Grid 布局和 flex 布局
----------------
flex 布局示例:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/28/173945aadff842d1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=486&h=70&s=5844&e=png&b=e6e6e6)

Grid 布局示例：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895918bcb5190~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=486&h=70&s=1126&e=png)

Grid 的一些基础概念
------------

```
.wrapper {
  /* 声明一个容器 */
  display: grid;
  /*  声明列的宽度  */
  grid-template-columns: repeat(3, 200px);
  /*  声明行的高度  */
  grid-template-rows: 100px 200px;
  /*  声明行间距和列间距  */
  grid-gap: 20px;
}
```

在元素上声明 `display：grid` 或 `display：inline-grid` 来创建一个网格容器，
	其直系子元素将成为网格项目。

网格轨道：
	`grid-template-columns` 和 `grid-template-rows` 属性来定义网格中的行和列。容器内部的水平区域称为行，垂直区域称为列。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895918ee0ecb6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=642&s=127585&e=png&b=f5e2dc)




---
网格线：划分网格的线，称为 "网格线"。应该注意的是，当我们定义网格时，我们定义的是网格轨道，而不是网格线。Grid 会为我们创建编号的网格线来让我们来定位每一个网格元素。m 列有 m + 1 根垂直的网格线，n 行有 n + 1 跟水平网格线。比如上图示例中就有 4 根垂直网格线。一般而言，是从左到右，从上到下，1，2，3 进行编号排序。当然也可以从右到左，从下到上，按照 -1，-2，-3... 顺序进行编号排序

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591934e1560~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=694&s=121324&e=png&b=f6ded9)

容器属性介绍
------
`Grid` 布局属性可以分为两大类，一类是容器属性，一类是项目属性。我们先来看容器属性

### display 属性
设置成 `display: inline-grid` 则容器元素为行内元素
```
.wrapper-1 {
  display: inline-grid;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591c03b6883~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=219&s=31574&e=png&b=fefefe)

### grid-template-columns 属性和 grid-template-rows 属性

`grid-template-columns` 属性设置列宽，`grid-template-rows` 属性设置行高，
**固定的列宽和行高**

```
.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
```

以上表示固定列宽为 200px 100px 200px，行高为 50px 50px

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591c0fc1214~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1078&h=302&s=27145&e=png&b=fbf5f4)


**repeat() 函数**
---
**repeat() 函数**：可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。比如上面行高都是一样的，我们可以这么去实现，实际效果是一模一样的

```
.wrapper-1 {
  display: grid;
  grid-template-columns: 200px 100px 200px;
  /*  2行，而且行高都为 50px  */
  grid-template-rows: repeat(2, 50px);
}
```

**auto-fill 关键字**
---
**auto-fill 关键字**：表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格。
`grid-template-columns: repeat(auto-fill, 200px)` 表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素，代码以及效果如下图所示：

```
.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591c300e81a~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=176&s=256151&e=gif&f=53&b=1d1e22)

fr 关键字
---
**fr 关键字**：`fr` 单位代表网格容器中可用空间的一等份。`grid-template-columns: 200px 1fr 2fr` 表示第一个列宽设置为 200px，后面剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3。代码以及效果如下图所示：

```
.wrapper-3 {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591ccc256d1~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1100&h=166&s=99702&e=gif&f=24&b=fcf7f7)

**minmax() 函数**：
---
**minmax() 函数**：我们有时候想给网格元素一个最小和最大的尺寸，
`minmax()` 接受两个参数，分别为最小值和最大值。
`grid-template-columns: 1fr 1fr minmax(300px, 2fr)` 的意思是，第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍。

```
.wrapper-4 {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(300px, 2fr);
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591dc05edac~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1100&h=166&s=177897&e=gif&f=35&b=f9e9e7)

**auto 关键字**：
---
由浏览器决定长度。通过 `auto` 关键字，我们可以轻易实现三列或者两列布局。`grid-template-columns: 100px auto 100px` 表示第一第三列为 100px，中间由浏览器决定长度，代码以及效果如下：

```
.wrapper-5 {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389591f2146e1d~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1100&h=166&s=86599&e=gif&f=21&b=f8edea)

### grid-row-gap 属性、grid-column-gap 属性以及 grid-gap 属性

[grid-row-gap 属性、grid-column-gap 属性以及 grid-gap 属性演示地址](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FjOWRNeg "https://codepen.io/gpingfeng/pen/jOWRNeg")

`grid-row-gap` 属性、`grid-column-gap` 属性分别设置行间距和列间距。 `grid-gap` 属性是两者的简写形式。

`grid-row-gap: 10px` 表示行间距是 10px，`grid-column-gap: 20px` 表示列间距是 20px。`grid-gap: 10px 20px` 实现的效果是一样的

### grid-template-areas 属性
`grid-template-areas` 属性用于定义区域，一个区域由一个或者多个单元格组成

一般这个属性跟网格元素的 `grid-area` 一起使用，我们在这里一起介绍。 `grid-area` 属性指定项目放在哪一个区域

```
.wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 120px  120px  120px;
  grid-template-areas:
    ". header  header"
    "sidebar content content";
  background-color: #fff;
  color: #444;
}
```

上面代码表示划分出 6 个单元格，
- 值得注意的是 `.` 符号代表空的单元格，也就是没有用到该单元格。

```
.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}
.header {
  grid-area: header;
}
```

以上代码表示将类 `.sidebar` `.content` `.header`所在的元素放在上面 `grid-template-areas` 中定义的 `sidebar` `content` `header` 区域中

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895920bbe824a~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=910&h=442&s=9335&e=png)

### grid-auto-flow 属性
`grid-auto-flow` 属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是 "先行后列"，即先填满第一行，再开始放入第二行，即下图英文数字的顺序 `one`,`two`,`three`...。这个顺序由 `grid-auto-flow` 属性决定，默认值是 `row`。

```
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895921548265c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=964&h=536&s=31488&e=png&b=ffffff)

row dense
---
就是第五个项目和第六个项目之间有个空白（如下图所示），这个是由于第六块的长度大于了空白处的长度，被挤到了下一行导致的。在实际应用中，我们可能想让下面长度合适的填满这个空白，这个时候可以设置 `grid-auto-flow: row dense`，表示尽可能填满表格。代码以及效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389592211e1d6b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=707&s=96287&e=png&b=ffffff)

```
.wrapper-2 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row dense;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895923612a19b~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=874&h=478&s=30240&e=png&b=ffffff)
### justify-items 属性、align-items 属性以及 place-items 属性
`justify-items` 属性设置单元格内容的水平位置（左中右），`align-items` 属性设置单元格的垂直位置（上中下）

下面以 justify-items 属性为例进行讲解，align-items 属性同理，只是方向为垂直方向。它们都有如下属性：

```
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```

其代码实现以及效果如下：

```
.wrapper, .wrapper-1, .wrapper-2, .wrapper-3 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-items: start;
}
.wrapper-1 {
  justify-items: end;
}
.wrapper-2 {
  justify-items: center;
}
.wrapper-3 {
  justify-items: stretch;
}
```

*   start：对齐单元格的起始边缘
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738959244947d96~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=852&h=384&s=32164&e=png&b=fdfafa)
*   stretch：拉伸，占满单元格的整个宽度（默认值）
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/1738959270057d0c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=854&h=358&s=33177&e=png&b=f5e6e3)

### justify-content 属性、align-content 属性以及 place-content 属性
[justify-content 属性、align-content 属性演示地址](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fgpingfeng%2Fpen%2FqBbwBZx%3Feditors%3D1100 "https://codepen.io/gpingfeng/pen/qBbwBZx?editors=1100")

`justify-content` 属性是整个内容区域在容器里面的水平位置（左中右），`align-content` 属性是整个内容区域的垂直位置（上中下）。它们都有如下的属性值。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895926d20f5d6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1216&h=770&s=68085&e=png&b=fefbfb)

*   space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍
*   space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔
*   space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔
*   stretch - 项目大小没有指定时，拉伸占据整个网格容器
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895927ba770c4~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=741&s=121464&e=png&b=fefbfb)

### grid-auto-columns 属性和 grid-auto-rows 属性

先来看看隐式和显示网格的概念
**隐式和显示网格**：
- 显式网格包含了你在 `grid-template-columns` 和 `grid-template-rows` 属性中定义的行和列。
- 如果你在网格定义之外又放了一些东西，或者因为内容的数量而需要的更多网格轨道的时候，网格将会在隐式网格中创建行和列

隐式网格的行高和列宽可以根据 `grid-auto-columns` 属性和 `grid-auto-rows` 属性设置。
如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高

```
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px;
/*  只设置了两行，但实际的数量会超出两行，超出的行高会以 grid-auto-rows 算 */
  grid-template-rows: 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```

`grid-template-columns` 属性和 `grid-template-rows` 属性只是指定了两行两列，
实际有九个元素，就会产生隐式网格。
通过 `grid-auto-rows` 可以指定隐式网格的行高为 50px

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895927d99af1c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=882&h=980&s=54908&e=png&b=fcf6f6)

item属性介绍
------
### grid-column-start 属性、grid-column-end 属性、grid-row-start 属性以及 grid-row-end 属性
*   grid-column-start 属性：左边框所在的垂直网格线
*   grid-column-end 属性：右边框所在的垂直网格线
*   grid-row-start 属性：上边框所在的水平网格线
*   grid-row-end 属性：下边框所在的水平网格线
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/173895928bc7e88e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1240&h=685&s=126434&e=png&b=f5e2dc)

### grid-area 属性

`grid-area` 属性指定项目放在哪一个区域，在上面介绍 `grid-template-areas` 的时候有提到过，

Grid 实战——实现响应式布局
----------------
### repeat + auto-fit——固定列宽，改变列数量
`grid-template-columns: repeat(auto-fit, 200px)` 表示固定列宽为 200px，数量是自适应的，只要容纳得下，就会往上排列，代码以及效果实现如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389592c297495a~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1056&h=176&s=256151&e=gif&f=53&b=1d1e22)

### repeat+auto-fit+minmax 去掉右侧空白
将 `grid-template-columns: repeat(auto-fit, 200px)` 改成 `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` 表示列宽至少 200px，如果还有空余则一起等分。代码以及效果如下所示：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389592cc3c2bf9~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1510&h=364&s=175602&e=gif&f=28&b=fdfafa)

### repeat+auto-fit+minmax-span-dense 解决空缺问题
每个网格元素的长度可能不相同，
通过 `span` 关键字进行设置网格项目的跨度，`grid-column-start: span 3`，表示这个网格项目跨度为 3。具体的代码与效果如下所示：

```
.item-3 {
  grid-column-start: span 3;
}
```

此时会有是有一些长度太长了，放不下
`grid-auto-flow: row dense` 表示尽可能填充，而不留空白，代码以及效果如下所示：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/26/17389593009f7fe7~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=1532&h=477&s=220450&e=gif&f=24&b=fcf5f5)
