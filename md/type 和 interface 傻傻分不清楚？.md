> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7098491203443752974?searchId=202310041542346C9FB55729D8C80F4D74)

[7.1 W 播放量的 TS 动画版进阶教程合集来了！](https://juejin.cn/post/7095547569777934367 "https://juejin.cn/post/7095547569777934367")，通过形象生动的动画，让你轻松搞懂 TypeScript 的难点和核心知识点！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8776a0d30114fda90da2b96b6560d04~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> **[不想看文字，那就直接来看视频吧](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1HB4y1y7KG "https://www.bilibili.com/video/BV1HB4y1y7KG")**：[www.bilibili.com/video/BV1HB…](https://link.juejin.cn?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1HB4y1y7KG "https://www.bilibili.com/video/BV1HB4y1y7KG")

如果你简历上的技能有写 TypeScript，那么面试官可能会问你 type 和 interface 之间有什么区别？你知道怎么回答这个问题么？如果不知道的话，那看完本文也许你就懂了。

类型别名 type 可以用来给一个类型起个新名字，当命名基本类型或联合类型等非对象类型时非常有用：

```
type MyNumber = number;
type StringOrNumber = string | number;
type Text = string | string[];
type Point = [number, number];
type Callback = (data: string) => void;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95381b09336d425586700d28acfaf093~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在 TypeScript 1.6 版本，类型别名开始支持泛型。我们工作中常用的 Partial、Required、Pick、Record 和 Exclude 等工具类型都是以 type 方式来定义的。

```
// lib.es5.d.ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
​
type Required<T> = {
    [P in keyof T]-?: T[P];
};
​
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
​
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
​
type Exclude<T, U> = T extends U ? never : T;
```

而接口 interface 只能用于定义对象类型，Vue 3 中的 App 对象就是使用 interface 来定义的：

```
// packages/runtime-core/src/apiCreateApp.ts
export interface App<HostElement = any> {
  version: string
  config: AppConfig
  use(plugin: Plugin, ...options: any[]): this
  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined // Getter
  component(name: string, component: Component): this // Setter
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
}
```

由以上代码可知，在定义接口时，我们可以同时声明对象类型上的属性和方法。了解 type 和 interface 的作用之后，我们先来介绍一下它们的相似之处。

1、类型别名和接口都可以用来描述对象或函数

**类型别名**

```
type Point = {
  x: number;
  y: number;
};
​
type SetPoint = (x: number, y: number) => void;
```

在以上代码中，我们通过 type 关键字为对象字面量类型和函数类型分别取了一个别名，从而方便在其他地方使用这些类型。

**接口**

```
interface Point {
  x: number;
  y: number;
}
​
interface SetPoint {
  (x: number, y: number): void;
}
```

2、类型别名和接口都支持扩展

类型别名通过 &（交叉运算符）来扩展，而接口通过 extends 的方式来扩展。

**类型别名扩展**

```
type Animal = {
  name: string
}
​
type Bear = Animal & { 
  honey: boolean 
}
​
const bear: Bear = getBear() 
bear.name
bear.honey
```

**接口扩展**

```
interface Animal {
  name: string
}
​
interface Bear extends Animal {
  honey: boolean
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/032e6bb259724d1faf144e70a9f3ea72~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

此外，接口也可以通过 extends 来扩展类型别名定义的类型：

```
type Animal = {
  name: string
}
​
interface Bear extends Animal {
  honey: boolean
}
```

同样，类型别名也可以通过 &（交叉运算符）来扩展已定义的接口类型：

```
interface Animal {
  name: string
}
​
type Bear = Animal & { 
  honey: boolean 
}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3d9ebb1515b4a108a1b96abbbadb641~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

了解完 type 和 interface 的相似之处之后，接下来我们来介绍它们之间的区别。

1、类型别名可以为基本类型、联合类型或元组类型定义别名，而接口不行

```
type MyNumber = number;
type StringOrNumber = string | number;
type Point = [number, number];
```

2、同名接口会自动合并，而类型别名不会

**同名接口合并**

```
interface User {
  name: string;
}
​
interface User {
  id: number;
}
​
let user: User = { id: 666, name: "阿宝哥" };
user.id; // 666
user.name; // "阿宝哥"
```

**同名类型别名会冲突**

```
type User = {
  name: string;
};
​
// 标识符“User”重复。ts(2300)
type User = {
  id: number;
};
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e3634daa7704b62a8b845ac6c43ee54~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

利用同名接口自动合并的特性，在开发第三方库的时候，我们就可以为使用者提供更好的安全保障。比如 [webext-bridge](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fantfu%2Fwebext-bridge "https://github.com/antfu/webext-bridge") 这个库，使用 interface 定义了 ProtocolMap 接口，从而让使用者可自由地扩展 ProtocolMap 接口。之后，在利用该库内部提供的 `onMessage` 函数监听自定义消息时，我们就可以推断出不同消息对应的消息体类型。

**扩展 ProtocolMap 接口**

```
import { ProtocolWithReturn } from 'webext-bridge'
​
declare module 'webext-bridge' {
  export interface ProtocolMap {
    foo: { title: string }
    bar: ProtocolWithReturn<CustomDataType, CustomReturnType>
  }
}
```

**监听自定义消息**

```
import { onMessage } from 'webext-bridge'
​
onMessage('foo', ({ data }) => {
  // type of `data` will be `{ title: string }`
  console.log(data.title)
}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62f570dafdab4662b32a23c41017b4cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果你感兴趣的话，可以看一下该项目的源码。若遇到问题，可以跟阿宝哥交流。最后我们来总结一下类型别名和接口的一些使用场景。

使用类型别名的场景：

*   定义基本类型的别名时，使用 type
*   定义元组类型时，使用 type
*   定义函数类型时，使用 type
*   定义联合类型时，使用 type
*   定义映射类型时，使用 type

使用接口的场景：

*   需要利用接口自动合并特性的时候，使用 interface
*   定义对象类型且无需使用 type 的时候，使用 interface

阅读完本文，相信你已经了解 type 和 interface 之间的区别了。你喜欢以这种形式学 TS 么？喜欢的话，记得点赞与收藏哟。