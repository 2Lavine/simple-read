> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7310423470546354239?utm_source=gold_browser_extension)

常见布局
----
### 1. 顶部 + 内容

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9990def312ab4278836ea35d9398a53e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=23870&e=png&b=46c1f5)

```
        body {
            display: grid;
            grid-template-rows: 60px 1fr;
            height: 100vh;
        }

        .header,
        .content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="content">Content</div>
</body>
</html>
```

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

### 2. 顶部 + 内容 + 底部

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e12139330c0b4c9ea6588736450106bf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=25146&e=png&b=3dbcf3)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-rows: 60px 1fr 60px;
            height: 100vh;
        }

        .header {
            background-color: #039BE5;
        }

        .content {
            background-color: #4FC3F7;
        }

        .footer {
            background-color: #039BE5;
        }

        .header,
        .content,
        .footer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="content">Content</div>
<div class="footer">Footer</div>
</body>
</html>
```

> 这里示例和上面的示例唯一的区别就是多了一个`footer`，但是我们可以看到代码并没有多少变化，这就是`grid`的强大之处；
> 
> 可以看`码上掘金`的效果，这里的内容区域是单独滚动的，从而实现了`header`和`footer`固定，内容区域滚动的效果；
> 
> 实现这个效果也非常简单，只需要在`content`上加上`overflow: auto`即可；

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

### 3. 左侧 + 内容

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e96a0e196414e138bd33c5c8f6b11b0~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=25334&e=png&b=35b9f1)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-columns: 240px 1fr;
            height: 100vh;
        }

        .left {
            background-color: #039BE5;
        }

        .content {
            background-color: #4FC3F7;
        }
        
        .left,
        .content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }


    </style>
</head>
<body>
<div class="left">Left</div>
<div class="content">Content</div>
</body>
</html>
```

> 这个示例效果其实和第一个是类似的，只不过是把`grid-template-rows`换成了`grid-template-columns`，这里就不提供`码上掘金`的示例了；

### 4. 顶部 + 左侧 + 内容

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ccf026b9d064bffa5af8c5759519a6f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=26714&e=png&b=99ccff)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-rows: 60px 1fr;
            grid-template-columns: 240px 1fr;
            height: 100vh;
        }

        .header {
            grid-column: 1 / 3;
            background-color: #039BE5;
        }

        .left {
            background-color: #4FC3F7;
        }

        .content {
            background-color:  #99CCFF;
        }

        .header,
        .left,
        .content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="left">Left</div>
<div class="content">Content</div>
</body>
</html>
```

> 这个示例不同点在于`header`占据了两列，这里我们可以使用`grid-column`来实现，`grid-column`的值是`start / end`，例如：`1 / 3`表示从第一列到第三列；
> 
> 如果确定这一列是占满整行的，那么我们可以使用`1 / -1`来表示，这样如果后续变成`顶部 + 左侧 + 内容 + 右侧`的布局，那么`header`就不需要修改了；

### 5. 顶部 + 左侧 + 内容 + 底部

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d56136e189437d9fd95dee33dc34c5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=28024&e=png&b=91c4f8)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-areas:
            "header header"
            "left content"
            "left footer";
            grid-template-rows: 60px 1fr 60px;
            grid-template-columns: 240px 1fr;
            height: 100vh;
        }

        .header {
            grid-area: header;
            background-color: #039BE5;
        }

        .left {
            grid-area: left;
            background-color: #4FC3F7;
        }

        .content {
            grid-area: content;
            background-color: #99CCFF;
        }

        .footer {
            grid-area: footer;
            background-color: #6699CC;
        }

        .header,
        .left,
        .content,
        .footer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="left">Left</div>
<div class="content">Content</div>
<div class="footer">Footer</div>
</body>
</html>
```

> 这个示例的小技巧是使用了`grid-template-areas`，使用这个属性可以让我们通过代码来直观的看到布局的样式；
> 
> 这里的值是一个字符串，每一行代表一行，每个字符代表一列，例如：`"header header"`表示第一行的两列都是`header`，这里的`header`是我们自己定义的，可以是任意值；
> 
> 定义好了之后就可以在对应的元素上使用`grid-area`来指定对应的区域，这里的值就是我们在`grid-template-areas`中定义的值；

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 在`码上掘金`中的效果可以看到，左侧的菜单和内容区域都是单独滚动的，这里的实现方式和第二个示例是一样的，只需要需要滚动的元素上加上`overflow: auto`即可；

响应式布局
-----

响应式布局指的是页面的布局会随着屏幕的大小而变化，这里的变化可以是内容区域大小可以自动调整，也可以是页面布局随着屏幕大小进行自动调整；

这里我就用掘金的页面来举例，这里只提供一个思路，所以不会像上面那样提供那么多示例；

### 1. 基础布局实现

#### 移动端布局

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edb68d85962f444d9a89a9ebe1df4ad6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=739&h=627&s=26585&e=png&b=99ccff)

> 以移动端的效果开始，掘金的移动端的布局就是上面的效果，这里我简单的将页面分为了三个部分，分别是`header`、`navigation`、`content`；
> 
> 注：这里不是要`100%`还原掘金的页面，只是为了演示`grid`布局，具体页面结构和最后实现的效果会有非常大的差异，这里只会实现一些基础的布局；

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-areas:
            "header"
            "navigation"
            "content";
            grid-template-rows: 60px 48px 1fr;
            height: 100vh;
        }

        .header {
            grid-area: header;
            background-color: #039BE5;
        }

        .navigation {
            grid-area: navigation;
            background-color: #4FC3F7;
        }

        .content {
            grid-area: content;
            background-color: #99CCFF;
        }


        .header,
        .navigation,
        .content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

    </style>
</head>
<body>
<div class="header">Header</div>
<div class="navigation">Navigation</div>
<div class="content">Content</div>
</body>
</html>
```

#### iPad 布局

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acb89f64b82b43f986ba5bfde63aca9b~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1050&h=627&s=33611&e=png&b=8bbef2)

> 这里是需要借助媒体查询来实现的，在媒体查询中只需要调整一下`grid-template-rows`和`grid-template-columns`的值即可；
> 
> 由于这里的效果是上面一个的延伸，为了阅读体验会移除上面相关的`css`代码，只保留需要修改的代码；

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>

        .right {
            display: none;
            background-color: #6699CC;
        }

        @media (min-width: 1000px) {
            body {
                grid-template-areas:
                  "header header"
                  "navigation navigation"
                  "content right";
                grid-template-columns: 1fr 260px;
            }

            .right {
                grid-area: right;

                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="navigation">Navigation</div>
<div class="content">Content</div>
<div class="right">Right</div>
</body>
</html>
```

#### PC 端布局

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ff6cafe21dd4b3198a9d11070914a25~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1271&h=627&s=39397&e=png&b=8bbef2)

> 和上面处理方式相同，由于`Navigation`移动到了左侧，所以还要额外的修改一下`grid-template-areas`的值；
> 
> 这里就可以体现`grid`的强大之处了，我们可以简单的修改`grid-template-areas`就可以实现一个完全不同的布局，而且代码量非常少；
> 
> 为了居中显示内容，我们需要在左右两侧加上一些空白区域，可以简单的使用`.`来实现，这里的`.`表示一个空白区域；
> 
> 由于内容的宽度基本上是固定的，所以留白区域简单的使用`1fr`进行占位即可，这样就可以平均的分配剩余的空间；

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        @media (min-width: 1220px) {
            body {
                grid-template-areas:
                  "header header header header header"
                  ". navigation content right .";
                grid-template-columns: 1fr 180px minmax(0, 720px) 260px 1fr;
                grid-template-rows: 60px 1fr;
            }
        }
    </style>
</head>
<body>
<div class="header">Header</div>
<div class="navigation">Navigation</div>
<div class="content">Content</div>
<div class="right">Right</div>
</body>
</html>
```

#### 完善一些细节

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28b6ddc175144e0f8355446a03e81b46~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=726&h=370&s=839493&e=gif&f=65&b=fefefe)

> 最终的布局大概就是上图这样，这里主要处理的各个版块的间距和响应式内容区域的大小，这里的处理方式主要是使用`column-gap`和一个空的区域进行占位来实现的；
> 
> 这里的`column-gap`表示列与列之间的间距，值可以是`px`、`em`、`rem`等基本的长度属性值，也可以使用计算函数，但是不能使用弹性值`fr`；
> 
> 空区域进行占位留间距其实我并不推荐，这里只是演示`grid`布局可以实现的一些功能，具体的实现方式还是要根据实际情况来定，这里我更推荐使用`margin`来实现；
> 
> 完整代码如下：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        body {
            display: grid;
            grid-template-areas:
            "header header header"
            "navigation navigation navigation"
            ". . ."
            ". content .";
            grid-template-columns: 1fr minmax(0, 720px) 1fr;
            grid-template-rows: 60px 48px 10px 1fr;
            column-gap: 10px;
            height: 100vh;
        }

        .header {
            grid-area: header;
            background-color: #039BE5;
        }

        .navigation {
            grid-area: navigation;
            background-color: #4FC3F7;
        }

        .content {
            grid-area: content;
            background-color: #99CCFF;
        }

        .right {
            display: none;
            background-color: #6699CC;
        }

        @media (min-width: 1000px) {
            body {
                grid-template-areas:
                  "header header header header"
                  "navigation navigation navigation navigation"
                  ". . . ."
                  ". content right .";
                grid-template-columns: 1fr minmax(0, 720px) 260px 1fr;
            }

            .right {
                grid-area: right;

                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
            }
        }

        @media (min-width: 1220px) {
            body {
                grid-template-areas:
                  "header header header header header"
                  ". . . . ."
                  ". navigation content right .";
                grid-template-columns: 1fr 180px minmax(0, 720px) 260px 1fr;
                grid-template-rows: 60px 10px 1fr;
            }
        }

        .header,
        .navigation,
        .content {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

    </style>
</head>
<body>
<div class="header">Header</div>
<div class="navigation">Navigation</div>
<div class="content">Content</div>
<div class="right">Right</div>
</body>
</html>
```

#### 简单复刻版

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 以`码上掘金`上的效果来说已经完成了大部分的布局和一些效果，目前来说就是还差一些交互，还有一些细节上的处理，感兴趣的同学可以自行完善；

异型布局
----

异性布局指的是页面中的元素不是按照常规的流式布局进行排版，又或者说不规则的布局，这里我简单的列出几个布局，来看看`grid`是如何实现的；

### 1. 照片墙

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc3447530e86447091c4eaa8a0accb3d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1380&h=732&s=50124&e=png&b=f2f3f5)

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            background: #f2f3f5;
            overflow: auto;
        }

        body {
            display: grid;
            grid-template-columns: repeat(12, 100px);
            grid-auto-rows: 100px;
            place-content: center;
            gap: 6px;
            height: 100vh;
        }

        .photo-item {
            width: 200px;
            height: 200px;
            clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
        }

    </style>
</head>
<body>

</body>
<script>
    function randomColor() {
        return '#' + Math.random().toString(16).substr(-6);
    }

    let row = 1;
    let col = 1;
    for (let i = 0; i < 28; i++) {
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.style.backgroundColor = randomColor();
        div.style.gridRow = `${row} / ${row + 2}`;
        div.style.gridColumn = `${col} / ${col + 2}`;

        document.body.appendChild(div);
        col += 2;
        if (col > 11) {
            row += 1;
            col = row % 2 === 0 ? 2 : 1;
        }
    }
</script>
</html>
```

> 这是一个非常简单的照片墙效果，如果不使用`grid`的话，我们大概率是会使用定位去实现这个效果，但是换成`grid`的话就非常简单了；
> 
> 而且代码量是非常少的，这里就不提供`码上掘金`的 demo 了，感兴趣的同学可以将代码复制下来自行查看效果；

### 2. 漫画效果

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8eeae99e25641339949bfba107e8e83~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=555&h=671&s=27982&e=png&b=d87f26)

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 在漫画中有很多类似这种不规则的漫画框，如果使用定位的话，那么代码量会非常大，而且还需要计算一些位置，使用`grid`的话就非常简单了；
> 
> 可以看到这里还有一个气泡文本显示的效果，按照页面书写顺序，气泡是不会显示的，这里我们可以使用`z-index`来实现，这里的`z-index`值越大，元素就越靠前；
> 
> 而且气泡文本效果也是通过`grid`来进行排版的，并没有使用其他的布局来实现，代码量也并不多，感兴趣的同学可以自行查看；

### 3. 画报效果

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a621a1dd499434885fd9de53967ef6d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=400&h=491&s=63283&e=png&b=ffffff)

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 在一个画报中，我们经常会看到文本和图片混合排版的效果，由于这里直接使用的是渐变的背景，而且我的文本都是随意进行排列的，没有什么规律，所以看起来会比较混乱；
> 
> 在画报效果中看似文本排版非常混乱不规则，但是实际上设计师在设计的时候也是会划分区域的，当然用定位也是没问题的，但是使用`grid`的话就会简单很多；
> 
> 我这里将页面划分为`12 * 12`区域的网格，然后依次对不同的元素进行单独排列和样式的设置；

流式布局
----

流式布局指的是页面的内容会随着屏幕的大小而变化，流式布局也可以理解为响应式布局；

但是不同于响应式布局的是，流式布局的布局不会像响应式布局那样发生变化，只是内容会随着轴进行流动；

通常这种指的是`grid-template-columns: repeat(auto-fit, minmax(0, 1fr))`这种；

直接看效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b4564af95449898639880f113e05c5~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=670&h=400&s=1119755&e=gif&f=71&b=fdfafa)

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAJElEQVRoge3BMQEAAADCoPVP7WkJoAAAAAAAAAAAAAAAAAAAbjh8AAFte11jAAAAAElFTkSuQmCC)

> 这里有两个关键字，一个是`auto-fit`，还有一个是`auto-fill`，在行为上它们是相同的，不同的是它们在网格创建的不同，

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f7aeee693184f1aa7e6c89d85d8bd92~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1212&h=640&s=55275&e=png&b=fefefe)

> 就像上面图中看到的一样，使用`auto-fit`会将空的网格进行折叠，可以看到他们的结束`colum`的数字都是`6`;
> 
> 像我们上面的实例中不会出现这个问题，因为我们使用了响应式单位`fr`，只有使用固定单位才会出现这个现象；
> 
> 感兴趣的同学可以将`minmax(200px, 1fr)`换成`200px`尝试；

对比 Flex 布局
----------

在我上面介绍了这么多的布局场景和案例，其实可以很明显的发现一件事，那就是我使用`grid`进行的布局基本上都是大框架；

当然上面也有一些布局使用`flex`也是可以实现的，但是我们再换个思路，除了`flex`可以做到上面的一些布局，`float`布局、`table`布局、定位布局其实也都能实现；

不同的是`float`布局、`table`布局、定位布局基本上都是一些`hack`的方案，就拿`table`布局来说，`table`本身就是一个`html`标签，作用就是用来绘制表格，被拿来当做布局的一种方案也是迫不得已；

而`web布局`发展到现在的我们有了正儿八经可以布局的方案`flex`，为什么又要出一个`grid`呢？

`grid`的出现绝对不是用来替代`flex`的，在我上面的实现的一些布局案例中，也可以看到我还会使用`flex`；

我个人理解的是使用`grid`进行主体的大框架的搭建，`flex`作为一些小组件的布局控制，两者搭配使用；

`flex`能实现一些`grid`不好实现的布局，同样`grid`也可以实现`flex`实现困难的布局；

本身它们的定位就不痛，`flex`作为一维布局的首选，`grid`定位就是比`flex`高一个维度，它的定位是二维布局，所以他们之间没有必要进行对比，合理使用就好；

总结
--

上面介绍的这么多基于`grid`布局实现的布局方案，足以看出`grid`布局的强大；

`grid`布局的体系非常庞大，本文只是梳理出一些常见的布局场景，通过`grid`布局去实现这些布局，来体会`grid`带来的便利；

可能需要完全理解我上面的全部示例需要对`grid`有一定的了解才可以，但是都看到这里了，不妨去深挖一下；

`grid`布局作为一项强大的布局技术，有望在未来继续发展，除了我上面说到的布局，`grid`还有很多小技巧来实现非常多的布局场景；

碍于我的见识和文笔的限制，我这次介绍`grid`肯定是有很多不足的，但是还是希望这篇文章能为你对于布局相关能有新的认识；