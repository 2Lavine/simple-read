> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7063521133340917773?searchId=202310041542346C9FB55729D8C80F4D74)

那interface 和 type 是不同的东西，一个叫**接口**，一个叫**类型别名**。
只是有时候两者都能实现同样的功能，才会经常被混淆。

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


---
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

### interfaceh和 type如何定义一个对象或函数

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

### interfaceh和 type如何继承（extends）

我们定义一个 Person 类型和 Student 类型，**Student 继承自 Person**，可以有下面四种方式
1. interface 继承 interface: 直接 extends
3. interface 继承 type： 可以直接 extends
4. type 继承 type: 用交叉类型即 用&
5. type 继承 interface：用交叉类型

#### interface 继承 interface
直接 extends
```
interface Person { 
  name: string 
}
interface Student extends Person { 
  grade: number 
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
type 可以声明基本类型、联合类型、交叉类型、元组。但interface不行
Interface 可以合并重复声明，Type 不行
#### Type声明基本类型、联合类型、交叉类型、元组

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

### interface 可以合并重复声明
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
