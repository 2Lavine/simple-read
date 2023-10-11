> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7095014044125364237?searchId=2023101110252673D9E36F2A841044F394)

### 今天主要讲的时`document.write()`

##### 基本语法: `write(...text: string[])`

##### 换个说法是`document.write(exp1,exp2,exp3,....);`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
​
​
<script>
  document.write("<div>111</div>","<div>222</div>")
</script>
</body>
</html>
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10c2bbf7930545f8aeb130fbaa605083~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

支持输入多个字符串参数 (其他类型会转为字符串格式输出);

用法还是相对比较简单，但是在使用的过程中，我会发现某些特定的情况下，使用 document.write() 向文档中写入内容时，document.write() 中的内容会将文档中的原本内容给覆盖掉，于是我决定深入测试测试探讨探讨这是怎么回事

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>document</title>
    <style>
        * {
            padding: 0;
            margin: 0;
        }
​
        .demo {
            padding: 25px;
            border: 1px dashed grey;
            text-align: center;
        }
    </style>
</head>
<body>
​
<div class="demo">
    <button onclick="test()"> 点击此按钮执行(执行调用document.write的操作)</button>
</div>
<br>
<p style="text-align: center">页面初始界面情况</p>
​
</body>
<script>
    function test(){
        document.write("<p style="text-align: center">点击按钮时执行的后显示的页面内容</p>");
    }
</script>
</html>
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1e3ef78704349cbbbb73fb9ff48095f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?) 点击之后发现按钮消失了，原来页面的内容也消失了，被 document.write 写入内容所替代，这是为啥？

```
document.write("<p style="text-align: center">点击按钮时执行的后显示的页面内容</p>");
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/252fb78f3d364037b09edc881a9b4f2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**观察发现前后两个 document.write 的操作**

第一个 document.write 的操作直接和原来内容显示在界面上

第二个 document.write 的操作被 button 调用覆盖了原先内容

**为什么会出现两种不同的情况呢？**

首先，介绍一个概念，**文档流**

> 文档流：元素排版布局过程中，元素会自动从左往右，从上往下地遵守这种流式排列方式。 当浏览器渲染 html 文档时，从顶部开始开始渲染，为元素分配所需要的空间，每一个块级元素单独占一行，行内元素则按照顺序被水平渲染直到在当前行遇到了边界，然后换到下一行的起点继续渲染。那么此时就不得不说一下块级元素和行内元素。

页面第一次打开时，浏览器会自上而下读取页面内容（第一次页面内容以及 js 里默认执行的 document.write 内容），这时候文档流没有关闭。`document.write()`方法中的内容会拼接到文档流中产生刚开始的界面显示的情况。之后继续加载时事件定义，文档流关闭。

```
<div class="demo">
    <button onclick="test()"> 点击此按钮执行(执行调用document.write的操作)</button>
</div>
<br>
<p style="text-align: center;margin-bottom: 30px;">页面初始界面情况</p>
​
</body>
​
<script>
    document.write("<p style="text-align: center">第一次加载执行的内容</p>");
</script>
```

被 button 点击触发事件之后执行，执行对应的函数内容时，由于页面初始的文档流已经关闭，所以`document.write()` 会调用`document.open()`创建一个新的文档流，并将`document.write()`中的内容写入到新的文档流中，这样新的文档流就会覆盖原本已加载的文档流。

```
function test(){
        document.write("<p style="text-align: center">点击按钮时执行的后显示的页面内容</p>");
 }
```

总结内容：

`document.write()`执行时如果文档流关闭，会调用`document.open()`创建一个新的文档流，这时候会覆盖原来的内容，一般这种事件情况下，通常使用`document.append`来添加内容从而不会创建新的文档流