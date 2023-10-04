> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7063521133340917773?searchId=202310041542346C9FB55729D8C80F4D74)

「这是我参与 2022 首次更文挑战的第 16 天，活动详情查看：[2022 首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」。

前言
--

我在学习 TS 时遇到了一个问题：

比如下面这个例子，可以用 type，也可以用 interface。

```
interface Person {
    name: string
    age: number
}

const person: Person = {
    name: 'lin',
    age: 18
}
```

```
type Person = {
    name: string
    age: number
}

const person: Person = {
    name: 'lin',
    age: 18
}
```

那 type 和 interface 难道都可以随便用，总得有个区别吧。

于是我去翻 ts 的文档，想学习一下两者的区别。

真的很想吐槽一下 TypeScript 的 [官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.tslang.cn%2Fdocs%2Fhome.html "https://www.tslang.cn/docs/home.html")，没有搜索 API 的功能，很难找到答案，只能慢慢去翻，结果翻了半天也没翻到。

最后去查阅了很多其他资料才知道，type 叫类型别名，藏在高级类型这一篇里，我一个初学者，能翻得到才有鬼！

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/380880b434a2494aa7cca61955cdc307~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

既然如此，那 interface 和 type 应该是不同的东西才对，一个叫**接口**，一个叫**类型别名**。只是有时候两者都能实现同样的功能，才会经常被混淆。

interface
---------

interface（接口） 是 TS 设计出来用于定义对象类型的，可以对对象的形状进行描述。

```
interface Person {
    name: string
    age: number
}

const person: Person = {
    name: 'lin',
    age: 18
}
```

type
----

type (类型别名)，顾名思义，类型别名只是给类型起一个新名字。**它并不是一个类型，只是一个别名而已**

就像 NBA 球员 扬尼斯 - 阿德托昆博，名字太长难记，我们叫他`字母哥`。

就像我们项目中配置 `alias`，不用写相对路径就能很方便地引入文件

```
import componentA from '../../../../components/componentA/index.vue'
变成
import componentA from '@/components/componentA/index.vue
```

有了 type，我们书写 TS 的时候可以更加方便简洁。

比如下面这个例子，`getName` 这个函数接收的参数可能是字符串，可能是函数，就可以这么写。

```
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver          // 联合类型
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n
    }
    else {
        return n()
    }
}
```

这样调用时传字符串和函数都可以。

```
getName('lin')
getName(() => 'lin')
```

如果传的格式有问题，就会提示。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb9955f3f1b6474889aac8d6b443086b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/636598596524476bb941460370b16659~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

两者相同点
-----

### 都可以定义一个对象或函数

定义对象前面已经说了，我们来看一下如何定义函数。

```
type addType = (num1:number,num2:number) => number

interface addType {
    (num1:number,num2:number):number
}
这两种写法都可以定义函数类型
```

```
const add:addType = (num1, num2) => {
    return num1 + num2
}
```

### 都允许继承（extends）

我们定义一个 Person 类型和 Student 类型，**Student 继承自 Person**，可以有下面四种方式

#### interface 继承 interface

```
interface Person { 
  name: string 
}
interface Student extends Person { 
  grade: number 
}
```

```
const person:Student = {
  name: 'lin',
  grade: 100
}
```

#### type 继承 type

```
type Person = { 
  name: string 
}
type Student = Person & { grade: number  }    用交叉类型
```

#### interface 继承 type

```
type Person = { 
  name: string 
}

interface Student extends Person { 
  grade: number 
}
```

#### type 继承 interface

```
interface Person { 
  name: string 
}

type Student = Person & { grade: number  }    用交叉类型
```

interface 使用 extends 实现继承， type 使用交叉类型实现继承

两者不同点
-----

### type 可以，interface 不行

> 类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。 -- TS 文档

#### 声明基本类型、联合类型、交叉类型、元组

```
type Name = string                              // 基本类型

type arrItem = number | string                  // 联合类型

const arr: arrItem[] = [1,'2', 3]

type Person = { 
  name: Name 
}

type Student = Person & { grade: number  }       // 交叉类型

type Teacher = Person & { major: string  } 

type StudentAndTeacherList = [Student, Teacher]  // 元组类型

const list:StudentAndTeacherList = [
  { name: 'lin', grade: 100 }, 
  { name: 'liu', major: 'Chinese' }
]
```

### interface 可以，type 不行

#### 合并重复声明

```
interface Person {
    name: string
}

interface Person {         // 重复声明 interface，就合并了
    age: number
}

const person: Person = {
    name: 'lin',
    age: 18
}
```

重复声明 type ，就报错了

```
type Person = {
    name: string
}

type Person = {     // Duplicate identifier 'Person'
    age: number
}

const person: Person = {
    name: 'lin',
    age: 18
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2750d133755f412695749cdf4f418f8f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

小结
--

interface 和 type 被 TS 设计出来，是完全不同的东西，有各自的职责。

interface 是**接口**，用于描述一个对象。

type 是**类型别名**，用于给各种类型定义别名，让 TS 写起来更简洁、清晰。

只是有时候两者都能实现同样的功能，才会经常被混淆，相信看完本文你能分清他俩了。

平时开发中，一般**使用组合或者交叉类型**的时候，用 type。

一般要用类的 **extends** 或 **implements** 时，用 interface。

其他情况，比如定义一个对象或者函数，就看你心情了。

如果我的文章对你有帮助，点赞👍是你对我最大的支持 ^ _ ^

**传送门**

[「1.9W 字总结」一份通俗易懂的 TS 教程，入门 + 实战！](https://juejin.cn/post/7068081327857205261 "https://juejin.cn/post/7068081327857205261")

[轻松拿下 TS 泛型](https://juejin.cn/editor/drafts/7063759934759895077 "https://juejin.cn/editor/drafts/7063759934759895077")

[通俗易懂的 TS 基础知识总结](https://juejin.cn/post/7063970883227877390 "https://juejin.cn/post/7063970883227877390")

**参考文章**

[Typescript 中的 interface 和 type 到底有什么区别](https://juejin.cn/post/6844903749501059085#heading-10 "https://juejin.cn/post/6844903749501059085#heading-10")

[使用 TypeScript 常见困惑：interface 和 type 的区别是什么？](https://juejin.cn/post/6977147950266859557 "https://juejin.cn/post/6977147950266859557")