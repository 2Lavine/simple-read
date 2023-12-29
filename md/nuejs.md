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




