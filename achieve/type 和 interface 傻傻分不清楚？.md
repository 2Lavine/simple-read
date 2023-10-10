> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7098491203443752974?searchId=202310041542346C9FB55729D8C80F4D74)

#cs/ts/type #cs/ts/interface

类型别名 type 可以用来给一个类型起个新名字，当命名基本类型或联合类型等非对象类型时非常有用：
类型别名也支持泛型。我们工作中常用的 Partial、Required、Pick、Record 和 Exclude 等工具类型都是以 type 方式来定义的。
接口 interface 只能用于定义对象类型
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

## Partial、Required、Pick、Record 和 Exclude 的实现
```
// lib.es5.d.ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
​T[P] 表示类型 T 中属性 P 的类型。
这个表示循环T中的属性

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
作用是创建一个新的类型，其中属性名来自于类型 K 的属性，而属性值都是类型 T
如type Keys = 'name' | 'age' | 'address';
type Person = Record<Keys, string>;
​
type Exclude<T, U> = T extends U ? never : T;
如果T 表示一个联合类型，它可以是多个类型的组合，例如 number | string | boolean。当使用 Exclude<T, U> 时，T 会被分解为联合类型中的每个单独的类型，并逐个进行判断。
```


### 类型别名和接口都可以用来描述对象或函数
```
type Point = {
  x: number;
  y: number;
};
type SetPoint = (x: number, y: number) => void;
interface Point {
  x: number;
  y: number;
}
​
interface SetPoint {
  (x: number, y: number): void;
}
```

## 总结一下类型别名和接口的一些使用场景。

使用类型别名的场景：

*   定义基本类型的别名时，使用 type
*   定义元组类型时，使用 type
*   定义函数类型时，使用 type
*   定义联合类型时，使用 type
*   定义映射类型时，使用 type

使用接口的场景：

*   需要利用接口自动合并特性的时候，使用 interface
*   定义对象类型且无需使用 type 的时候，使用 interface

