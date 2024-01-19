## cross-env的作用
windows 不支持 NODE_ENV=development 的设置方式
cross-env 使得您可以使用单个命令，而不必担心为平台正确设置或使用环境变量
"build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"

# Next
## Page
获取传入的参数：
page=({ searchParams })=>{}

# TS
限定一个对象，所有的 key 都是 string 应该怎么写
:该索引签名表示对象可以有任意数量的属性，属性名是字符串类型，属性值可以是字符串、字符串数组或者未定义
```json
  searchParams: {
    [key: string]: string | string[] | undefined
  }
```
#ts/type 
所有的初始 type 都是小写开头的
如 string,number

#ts/可选链操作符
?. 的作用是避免左侧的对象是空的