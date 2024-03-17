> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [github.com](https://github.com/YoRenChen/Blog/issues/4)


生成流程
----
骨架屏生成的流程如下：
1.  通过获取 DOM 节点，把元素解析成骨架页标签
2.  添加自定义骨架屏 class 进行样式覆盖
3.  填充到 index.html 并输出
![](https://user-images.githubusercontent.com/30005394/120107134-617e8680-c192-11eb-8dfc-cf3de1764d79.png)

使用场景
----
本章节介绍骨架屏使用的三个场景分析和实现。
1.  首屏
2.  去缓存刷新，根据不同的页面地址展示不同骨架屏
3.  组件局部 loading
### 首屏
对于首屏实现骨架屏，大致就是替换 index.html 页面的内容，在请求 html 的时候第一时间会渲染出骨架屏内容。

![](https://user-images.githubusercontent.com/30005394/120107365-66900580-c193-11eb-99c6-4d147d3003b1.png)

首屏生成大致流程：

![](https://user-images.githubusercontent.com/30005394/120107366-66900580-c193-11eb-9a2d-f0c721322ae0.png)

生成页面对应的骨架屏，需要获取到这些页面的 Dom 结构，但在生成页面之前先偷偷获取并生成骨架屏。这里使用到_Puppeteer(Headless Chrome Node.js API，模拟 Chrome 浏览器的运行) 插件_。

#### Puppeteer
简单说一下 Puppeteer 执行与骨架屏生成大致流程：
在转换过程中，涉及到 Puppteer 里需要把执行的页面 Js 注入到页面中：
```
# skeletonjs/skeleton.js
await page.addScriptTag({ content: this.scriptContent })
```
this.scriptContent 就是需要注入的 js 自运行代码，这里把 socket 和生成页面预览去除，单纯用 node 跑生成骨架页面程序服务。

（也尝试像 page-skelrton 那样做成个 plugin，在生成端口地址之后运行 puppeteer。按预期走非常不错，但是有一个致命的问题，就是每次热跟新的时候都会执行这个周期，那就导致每次都运行 puppeteer 生成骨架，可以是可以但没必要，所以干脆单独成为一个 node 服务 。）

### 组件局部 loading

这部分只有一个思路，尚未实现。观察到 antd vue 的骨架屏是通过，标签实现。  
那么思路就是使用标签包裹。  
通过获取包含内容的数据结构，解构生成骨架屏，在数据请求成功之后隐藏起来。

```
<skeleton show>
    ...dosomething
</skeleton>
```

元素处理
----

本章节介绍骨架屏根据页面内容生成方案，很大程度依赖的是已经被渲染过的页面，居于这个页面上进行筛选元素。

### 筛选元素

1.  深度遍历元素，获取 html 文档上所有元素
2.  屏幕宽高以内的元素
3.  筛选出特定设置元素

![](https://user-images.githubusercontent.com/30005394/120107901-5da03380-c195-11eb-8304-f230a7e5ec4f.png)

### 元素解析

#### 背景色
1.  将拥有除了白色之外的颜色默认置色为骨架屏背景色
2.  将所有拥有 textChildNode 子元素的元素的文本颜色设置成背景色

#### svgs、buttons、image、inputs
以上元素不能在里面进行添加其他元素的操作，所以需要用其他元素今天替换，同时避免其他资源的加载。

1.  获取元素位置和 position、display
2.  使用 span 元素替换该元素
3.  加入背景色
4.  加入 loading 效果

#### 伪类
伪类的使用场景比较多而且复杂，在变换骨架的时候会较为有难度，但使用伪类多为脱离文档流，故想在生成骨架屏的时候选择屏蔽伪类。

#### 字体处理
1.  获取文本内容
2.  根据实际高度和行高计算出文本的行数  
    a. 行数大于 1，将背景色填充所有行  
    b. 文本的长度背景色填充
3.  文本背景色填充  
    a. 绘制文本块中通过线性渐变来绘制灰色的文本条纹

下面简述如何处理文本和字体条纹颜色转换。

在判断文本行数时，会先获取文本填充到新建的内联元素，并继承 fontsize，获取到的内联元素 width 和 height 就是字体的宽和高，再对比原元素的宽高即可知道是否为多行文本。

对单行文本进行颜色填充：

> 摘自：CSS Secrets  
> “If a color stop has a position that is less than the specied position of any color stop before it in the list, set its position to be equal to the largest speci ed position of any color stop before it.”  
> — CSS Images Level 3 ([http://w3.org/TR/css3-images](http://w3.org/TR/css3-images))

我们可以根据文本块的 lineHeight 和 fontsize 得到文本距离块上下的距离，设置 linear-gradient

```
字体大小和行高比例: textHeightRatio = fontSize/lineHeight
字体顶部离行高的距离比: headerProportion = ((1 - textHeightRatio) / 2 * 100)
字体底部离行高的距离比: footerProportion = (((1 - textHeightRatio) / 2 + textHeightRatio) * 100)
设置backgroundSize: backgroundSize = (字体宽度比元素总长, 字体fontSize)
设置linear-gradient: linear-gradient(transparent ${headerProportion}%, ${color} 0%, ${color} ${footerProportion}%, transparent 0%)
```

![](https://user-images.githubusercontent.com/30005394/120108124-65140c80-c196-11eb-863f-6fa227c35d4f.png)

#### loading
1.  新建元素加载到目标元素的 childrenNode 里
2.  position 为 absolute
3.  继承父类的相对位置作为默认位置
4.  不同元素处理：

*   非字体元素
*   字体元素  
    a. 高度设置：字体高度  
    b. translate：`translate(-${{ 'left': 0, 'center': '50%', 'right':calc(100% - ${width})}[textAlign]}, 0)`  
    c. top: 字体顶部离行高的距离比  
    d. left: `{ 'left': 0, 'center': '50%', 'right':calc(100% - ${width})}[textAlign]`

![](https://user-images.githubusercontent.com/30005394/120108209-c63be000-c196-11eb-963b-e884679c218f.png)

