text-align 使用规则：

只在快元素中使用，直接用在内联元素上不生效。
会对块元素中的所有内联内容对齐。

## 浮动的问题

## 清除浮动

1.  父元素高度塌陷 问题

    1.  父元素结束标签之前插入清除浮动的块级元素

        1. 可以为父元素添加伪元素,清除浮动 :after 会在结束标签之前插入

    1.  父元素添加 overflow: hidden(即创建 BFC)
        1. Flex 里面的 item 也是创建了 BFC
        2. inline-block 和 Absolute 也是创建了 BFC

    为什么 BFC 可以实现

    BFC 在计算高度的时候，内部浮动元素的高度也要计算在内

2.  兄弟元素重叠
    1.  给非浮动的兄弟元素添加 clear 属性,表示清楚浮动
    2.  给兄弟元素添加 BFC
    - 构建 BFC 区域的元素紧接着一个浮动盒子时，即，是该浮动盒子的兄弟节点，BFC 区域会首先尝试在浮动盒子的旁边渲染，但若宽度不够，就在浮动元素的下方渲染

## 相邻的行盒(或行快和) 直接没对齐

    - 使用vertical-align对某个行盒进行微调

## Model 的样式

Position: fixed
top: 0 bottom:100%
background-color: rgba(0,0,0,0.5)

Model 的内容是相对视口的,所以用 fixed

- absolute 参考有定位的父元素
- fixed 参考视口(viewport)

## 绝对 position 的宽高

一个元素是绝对定位的时候,他会自动变成一个 block 元素
    - 他的宽高是自动适应内容的
    - (float 也是)
如对一个 a 元素设置绝对定位,他会自动变成一个 block 元素
relative 的宽度是占据整行的(和参考系一直)

## 精灵图
用 background-position 来调整显示的位置
backgound: url() no-repeat 来显示图片


## CSS 冲突

1. 作者样式覆盖用户样式
2. 按照下列的出现个数计算
    - 内联选择 ID 类(属性,伪类) 元素
    body .h1  /* (0,0, 1, 1) */
