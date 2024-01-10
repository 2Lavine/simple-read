
# 1 commit
#js/合并对象
Object.assign(impl, obj) 是JavaScript中的一个表达式，用于将所有可枚举的属性从一个或多个源对象 (obj) 复制到目标对象 (impl)。这是一个对象合并的常用方法

只可读对象
{
	get root(){}
}

#js/赋值表达式的返回值
a=b 返回的值是 b（或 a）



## walk
对于 text 数组提取 冒号之间的数字
```js
const [_, i] = /:(\d+):/.exec(node.textContent.trim()) || []
```
这个正则表达式第一个元素（索引 0是整个匹配到的字符串
后续元素是正则表达式中每个捕获组（圆括号内的部分）匹配到的字符串



# [[Compile]]

# Client 端
compile会通过 DFS 深搜，生成一个数组 compile生成的数据
# createApp 
输入参数
- component 通过compile生成（第一个元素）
- data={}
- deps=[] 也通过compile生成
- $parent={} 通过 createParent(node)生成，第一次调用为空

输出参数
[[#self]]

# createApp中的函数
## createParent
输入 node
1. 通过getAttrs获取所有attribute

## getAttrs
1. 输入  node
2. 遍历所有[[#node.attributes]]的属性
	1. 仅仅对这些attribute进行获取non-core (id, class, style) attributes with primitive value
3. 返回一个对象 attr
	1. attr\[name\] = val == null ? true : val


## getAttr
得到 dom 的所有属性值
	1. expr的值
	2. attribute 值 或者 data-set值
具体流程
1. 是否是响应式的数据，或者是否可以通过 fns 来计算
	1. 是，就通过 fn(ctx) 来计算获取之后的值
	2. 不是
		1. 通过 ctx.val来访问对应的值
		2. 或者通过node.getAttribute(key) 
		3. 或者通过node\[key\]来访问（dataSet）
		4. 返回 undefined
## processAttrs 
1. 处理name 或者 ref 属性
	1. 如果 AttrsName = ref 或者 name 则设置 self.$ref
		1. key为该attr对应的值: 
		2. value为当前的 node 节点
2. 处理有 对应fn的属性：
	1. 读取 属性对应的值，得到 fns 的索引。如果没有就返回
		1. （这里 compile 把所有 Reactive 的数据转换成了 expr 索引）
	2. 有的话把属性解析得到 char 和 real （如 :for 中 char 为:    real 为 for）
	3. 对含有:@$ 的属性在原来node 节点上移除
	4. 如果是：开头且不是:bind
		1. 添加 expr，内容为执行 renderVal(fn(ctx)) 并把渲染后的值赋给 node的real属性
	5. 如果是@开头的
		1. 为node[`on${real}`] 添加函数
			1. 参数为 evt，
			2. 函数内容为
				1. 直接执行函数fn.call(ctx, ctx, evt)
				2. 调用$parent的 update 函数 或者自身的 update 函数
## processAttr

## setAttrs
输入： root,parent
目的是讲parent的id class style 赋值给root
(root的当前的 dom 节点，parent 是被挂载节点的 proxy)
1. 将 root 的 class 和 parent 的 class 合并 返回arr 数组
	1. 将 arr 渲染，并且赋给 root.className
2. 解析出 parent 的 id 和 style 并且赋给 root

## setAttr
Sets the attribute of a given DOM node.
当和原属性不同是才执行
## update
输入 obj
1. 将 obj 和impl的属性合并
2. 依次执行 expr 里面的操作
3. 执行impl 的updated函数
4. 返回 self
## walk
walk 函数 （输入: node）(返回一个带有next的对象 用于遍历)
	如果是 element 类型
		1.  执行 :for 和 :if
			1. 移除 node 上的:for或者:if(removeAttributes(key))
			2. 调用相关函数 获得ext （内容是 update和 next）
			3. 添加 expr expr.push(ext)
			4. 返回ext
		2.  执行 slot
			1. 如果传入的 component 有inner和slot
				1. (inner是一个 Nue node)
				2. 
		3.  查找 child：查找node是否是自定义的组件；
			1. 是，则我们需要把自定义节点挂在到 node 上
				1. 如果 node 里面还有其他元素
					1. 创建一个 dom节点，把所有子元素append进去
					2. childInnercomp: 为这个 dom 节点创建nue node (执行createaApp)
					3. child.inner = childInnercomp
				2. 创建parent : 用createParent(node)创建（是一个 proxy）
				3. 创建comp: 用createApp创建新节点（传入 parent）并且 mount到当前节点
				4. 添加 expr：内容为setAttrs(comp.$el, parent)
				5. 更新self.$refs：
					1. key 为当前node的 ref 值或者是tagName; 
					2. value是 comp.impl (也就是新组件的 impl)
				6. 返回当前节点的兄弟节点
			1. 不是
				1. 处理属性[[#processAttrs]](node)
				2. 遍历 node 节点重复执行 walk

## walkChildren



# createApp中的属性
## components获得属性
Impl, tmpl, fns=[], dom, inner
## Self
self 是createApp 返回一个对象
在挂在期间他的值也会发生变化
```
    属性
	    $el: dom,（也可以通过    get root() { return self.$el }访问）
	    $refs: {},
	    $parent,
	    impl,(初始化为{}，类Impl的对象)
    方法
	    mount
	    mountChild
	    unmount
		update,
		append
		replace
		before
```
### Self 中的函数
#### mount
输入wrap(挂载节点)
过程
1. 创建 root 属性: 通过 tmpl 创建一个 dom，并且挂在到self.$el. 并将这个值赋给 root
1. 如果有Impl 
	1. 创建impl :将Impl 实例化并加上这些值
		1. self.mountChild
		2. self.$refs
		3. update
2. 从 root 开始 [[#walk]]
3. 将wrap替换为 root
4. 将wrap上的值赋给root
5. 运行impl.mounted
6. 执行 [[#update]] 函数，并且返回结果（返回的结果是 self）

### before
1. 必须有dom
	1. 赋值$el  self.\$el=dom 
	2. 检查 documents.body是否有dom节点
		1. 没有： 调用archor.before(dom)插入节点
	3. 如果dom节点没有遍历过
		1. walk(dom)
	4. 执行 [[#update]]函数并且返回（update 函数返回 self）
### unmount
1. 通过 self.root 调用 dom 节点  并且移除（self.root.remove）
2. 执行 impl 的unmont函数
3. [[#update]]()

## replace 
输入 wrap
1. walk dom节点
2. 将 wrap 替换为 dom.childen
3. 更新
## CTX
CTX代理了什么
1. get 属性
	1. 代理了 [[#Self]]
	2. 传入的impl和 data
	3. $parent, $parent.bind
2. set属性
	1. 如果有\$parent对象，且\$parent对象有对应的 key 则更新\$parent\[key]
		1. 此时对应 for loop选项
	2. 否则更新self




# node.attributes
它返回一个类似数组（但不是真正的数组）的对象，其中包含了该元素上的所有属性
```
<div id="myDiv" class="container" data-custom="example">
// Attribute Name: id, Value: myDiv
// Attribute Name: class, Value: container
// Attribute Name: data-custom, Value: example
```


# IF函数
1. 执行[[#addblock]]
2. 循环遍历相邻兄弟节点
	1. 找到 else 和elseif .通过addblock加到 blocks 中
		1. :else的fn 必然是()=>true  通过在 blocks 的前后顺序判断
	2. 一旦不是相邻的就退出，并且把当前的节点赋值给next
3. 
## addBlock
函数 输入 node,fn
1. 通过[[#processAttrs]]  处理 node 上的属性
	1. 会把所有:@$的属性处理一遍
2. 创建impl:通过createApp 创建并返回一个节点
	1. 传入参数 components 只有 dom 和fns
	2. data 为 ctx
	3. deps 不变
	4. $parent 为 ctx
3. 添加到 blocks当中（blocks中的每一个都是 createApp创建的节点）
4. 把 fn 挂在到impl上

## update
1. 第一次执行初始化anchor
	1. 找到root的父元素 wrap
	2. 将achor赋值一个空白文字节点
	3. 将 achor插入到root 之前
2. 


# FOR函数
\<bind-item :for="el in items" :bind="el"/\>
目的是变成多个Bind-item

update：
	1. 执行fn(ctx) 获得 key array index is_object_loop
	2. 第一次进入需要 （是否第一次用 items来判断）
		1. 获取root的父元素，将锚点 achor 插入到 root 的前侧，移除 root
		2. 得到 items: 给 arr 进行 proxy 包裹（[[#arrProxy]]）返回 items
		3. 进行挂载arr.forEach(mountItem)
		4. 设置current为 arr
	3. 否则只用
		1. 如果有 items（ items 是 proxy 包裹后的 array，用来优化）
		1. 如果整个 array 变换了（即和 current 不同）则重新包裹，重绘，记录 current
		2. 调用blocks每一个block.update进行更新（用的是nue node 的 update 方法）

## arrProxy
1. 利用Object.assign进行代理
2. 重写unshift, splice, push, sort, reverse 让 arr 变化自动 mount
### mountItem(item, i, arr, first) 
1. 根据 { fns, dom: root.cloneNode(true) }, createProxy(item), deps, ctx 创建 block
2. 添加到blocks 中
3. 插入节点： block.insert(first||archor)
	1. first 就是代表插入到第一个节点
	2. archor 就是插入到最后
4. 调用oninsert：oninsert callback for transition/animation purposes