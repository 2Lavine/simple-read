> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7219189313723154489?from=search-suggest)

一、.d.ts 是干嘛用的
=============

.d.ts 文件是 ts 用来声明变量，模块，type，interface 等等的，
在. d.ts 声明变量或者模块等东西之后，在其他地方可以不用 import 导入这些东西就可以直接用。

但是也不是说创建了. d.ts 文件，里面声明的东西就能生效了，毕竟归根到底也是. ts 文件，需要[预编译](https://link.juejin.cn?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3D%25E9%25A2%2584%25E7%25BC%2596%25E8%25AF%2591%26spm%3D1001.2101.3001.7020 "https://so.csdn.net/so/search?q=%E9%A2%84%E7%BC%96%E8%AF%91&spm=1001.2101.3001.7020")，所以需要在 tsconfig.json 文件里面的`include`数组里面添加这个文件，

比如我们在 vue3+Ts 项目中的 tsconfig.json 中可以做如下配置：

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "noImplicitThis": false, // js/ts 混用时设为false
    "allowJs": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,

    "lib": ["esnext", "dom"],
    "types": [
      "@dcloudio/types",
      "pinia-plugin-persist-uni",
      "miniprogram-api-typings"
    ],
    "typeRoots": ["./node_modules/@types/","./node_modules/@dcloudio/types/", "./types"],
    "paths": {
      "@/*": ["src/*"],
      "@vant/weapp/*": ["path/to/node_modules/@vant/weapp/dist/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/typings/*.d.ts",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

include 数组里面可以不用写. d.ts 文件的绝对路径，可以通过 [glob](https://link.juejin.cn?target=https%3A%2F%2Fso.csdn.net%2Fso%2Fsearch%3Fq%3Dglob%26spm%3D1001.2101.3001.7020 "https://so.csdn.net/so/search?q=glob&spm=1001.2101.3001.7020") 通配符，匹配这个文件所在的文件夹或者是 “祖宗级别” 文件夹.

具体 tsconfig.json 配置请看这 [www.tslang.cn/docs/handbo…](https://link.juejin.cn?target=https%3A%2F%2Fwww.tslang.cn%2Fdocs%2Fhandbook%2Ftsconfig-json.html "https://www.tslang.cn/docs/handbook/tsconfig-json.html")

其中 `src/**/*.vue`, 就表 示在 vue 文件中，使用在. d.ts 中声明的 type 和 interface 时，是不需要单独 import 的，可以直接使用。比如在 src 下 @types 中有 test.d.ts

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b9b2af0e61d411fb9ec6d7966121f64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
// test.d.ts

declare interface Obj {
        a:number,
        b:string
}
```

我们在 vue 文件中，可以直接使用：

```
<script lang='ts' setup>
    import {reactive} from 'vue'
    // 可以直接使用Obj
    const obj = reactive<Obj>({
      a:1,
      b:'q'
    })
</script>
```

二、declare 用法

d.ts 文件中的顶级声明必须以 `declare` 或 `export` 修饰符开头.

通过`declare`声明的类型或者变量或者模块，在`include`包含的文件范围内，都可以直接引用而不用去 import 或者 import type 相应的变量或者类型。

declare 声明一个类型
--------------

```
declare type Asd =   {
        a:number
    }
```

在 include 包含的文件范围内，可以直接使用 Asd 这个 type

declare 声明一个模块
--------------

```
declare module '*.css'
    declare module '*.less'
    declare module '*.png'
```

在编辑 ts 文件的时候，如果你想导入一个. css/.less/.png 格式的文件，如果没有经过 declare 的话是会提示语法错误的

declare 声明一个作用域
---------------

```
在test.d.ts中声明：

declare namespace API {
    interface ResponseList {
        code:number,
      
    }
}
```

在 vue 文件中可以直接使用, 不用 import

```
index.vue

const res = ref<API.ResponseList>({})
```