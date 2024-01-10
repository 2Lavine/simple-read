# Parse
- mkdom( )  => return Children
	- if chsildren is tag => [[#createComponents]]( )=> components
	- GetJS( ) => js
- {components,js}

## createComponents
- [[#getComponentsName]]
- getJS( )  from component
- [[#compileNode]]()
RETURN  string（convert from a obj）

### getComponentsName
用来调用nue里面创建的组件
通过
```
attribs['@name'] || attribs['data-name'] || attribs.id
```
来创建
不允许有 HTML 默认的名字
### compileNode
1. 处理 attributes 的语法
	1. 预处理一下语法糖
		1. class="{}" --> :class="{}" 
		2. :disabled -> $disabled （if is a boolean attribute）
	2. 处理@event
		1. 待续
	3. 处理 :for
	4. 处理其他包含$或:的属性
		1. 属性对应的值包含了{}
			1. 解析 expression，并且用数组包裹，添加到expression数组里
		2. 不包含
			1. 为这个值设置上下文
				1. 默认的上下文是_ (也就是 foo=>\_.foo )挂载到_上，由_来调用
				2. 如果是JS 自带对象的，则把上下文给JS自带对象
		 3. 将属性对应的值变成 expression 的数组索引
1. 处理content 中的{}
	1. 获取被{{xxx}} 包含的 字符串html
	2. 如果存在 html
		1. 为这个值设置上下文,并且添加到expression数组里
		2. 给父组件添加 :html: index in expression
		3. 将组件的 data值置空
	3. 如果不存在 html
		1. 解析 expression，并且用数组包裹，添加到expression数组里
		2. 将自身的 data 改为expression的索引 格式为:index:


### setContext
如果 split 的separator 包含捕获括号（capturing parentheses），则其匹配结果将会包含在返回的数组中。
- 捕获括号就是 正则表达式的 （）




## Compile生成的数据
name
tageName
tmpl
Impl： 一个类，绑定了所有需要的数据和方法
fns: 包含了执行函数的数组，对应了exprs ； compile 会把变换的数据变成 fns 中的下标 