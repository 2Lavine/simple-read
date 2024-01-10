# HTML and CSS
### 回流
1. 会改变位置
	1. 动画改变位置
		1. 用 css 代替 js 动画(css用 gpu 加速，如translate3d(0,0,0)强制使用 gpu)
		2. 使用[[requestAnimation]] 
	2. 减少次数
		1. 添加移除类来一次完成 样式的修改
		2. 用document Frgament 来完成DOM节点的修改
			3. Vue虚拟dom的方法
		3. 让文档脱离文档流，减少整体部分改变
			1. position:fixed
### Margin 塌陷
- 垂直排列的块级元素的外边距相遇时，它们之间的距离不是两者外边距之和，而是两者中较大的一个外边距
- 使用 [[#BFC]] 来解决
### BFC
- float
- overflow 不会visiable
- position = fixed  absoluted
- display: [[#inline-block]]，flex
### inline-block
它外部表现为行内元素，但内部可以像块级元素那样设置宽度和高度。
这意味着 inline-block 元素可以并排显示，同时保持块级元素的一些属性（如设置宽高）

### 隐藏元素
占位和点击事件
1. opacity
2. visibility/clip-path:circle(0)
3. display




# 计算机网络
Cache-control: max-age
Expirs: new Date()

