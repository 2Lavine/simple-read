selfClose
将自封闭的 tag 改成 不是自封闭的
1. 找到所有 />结尾的字符串，并一一执行一下操作
	1. 找到对应的前一个 < 开头字符串
	2. 找到匹配的 tagName 并替代

步骤：
1. str.replace(//g, (match,index)=>{}) 可以将匹配的所有元素替换
	1.1 match 表示匹配的元素，index 表示 match 在 str 的索引
2. 用str.lastIndexOf('<', i), 获取 前一个字符串的位置
3. /<([\\w-]+)/.exec(slice) 匹配 （注意 tagname 是可以包含 - 的）
	1. 同理 他返回的第一个是匹配的字符串，第二个是圆括号的内容
	2. \['<img', 'img'\]。


```js
\\{([^}]+)\\}的含义 
([^}]+) 
	（ ）表示捕获组
	[]表示匹配 []+ 表示 1 个或多个
	^} 表示除了 } 匹配所有其他字符
	
```



## render
## exec执行
用来执行expr:
	new Function('\_', 'return ' + expr)
	new Function(arg1, arg2, ..., argN, functionBody) 是JavaScript中的一个构造函数，用于动态创建一个新的函数。arg1, ..., argN 是新函数的参数名，而 functionBody 是新函数的执行体。
## isJs判断
如果是对象，数组或者函数则返回 True
原文的方法
```
1. obj.constructor === Object
2. Array.isArray()
3. typeof val == 'function'
```
判断 的方法
```
Object.prototype.toString.call(obj) === '[object Object]'

```




## setAttribute


# JS定义属性和方法
```js
{
	num0:0
	get num1(){}//getter方法不能接受参数
	method1(){}
	method2:function(){
	}
}
```