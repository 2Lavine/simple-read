> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6898629098323902471)

基本概念
----

模块是一种将 `JavaScript` 程序，拆分为可按需导入的单独模块的机制。在 `ES6` 之前，社区制定了一些模块加载方案，最主要的有 `CommonJS` 和 `AMD` 两种。前者用于服务器，后者用于浏览器。 以前浏览器端主要是依赖构建工具模拟实现模块系统，现在最新的浏览器已经开始逐步支持 ES 模块，`esModule` （这里是使用 `webpack` 中的拼写方式，表示 ES Module，模糊了所谓`ES6 Module` 的说法）正逐步变成浏览器和服务器通用的模块解决方案

`esModule` 有以下特点

*   `esModule` 不是对象
*   `esModule` 的加载是编译时加载 (静态加载)，即在编译完成时就完成了模块加载
*   `esModule` 自动采用严格模式，严格模式下的限制主要如下：
    *   变量必须声明后再使用
    *   顶层的 `this` 指向 `undefined`，不指向全局对象
    *   函数参数不能有同名属性
    *   不能使用 `with`
    *   不能对只读属性赋值
    *   不能使用前缀 `0` 表示八进制
    *   不能删除不可删除的属性
    *   `eval` 不会在它的外层作用域引入变量
    *   `eval` 和 `arguments` 不能被重新赋值
    *   `arguments` 不会自动反映函数参数的变化
    *   不能使用 `arguments.callee`
    *   不能使用 `arguments.caller`
    *   不能使用 `fn.caller` 和 `fun.arguments` 函数调用堆栈
    *   增加了保留字

`esModule` 主要是两个命令：`export（输出指定代码块）` 和 `import（输入其他模块的功能）`

**本文沿用 MDN 上的说法，导入导出的内容统一称为接口，这个定义和其他编程语言的说法不一样**

export
------

一个模块就是一个独立的文件，该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用 `export` 关键字输出该变量。

`export` 从模块中导出绑定的函数、对象或原始值，其他模块可以通过 `import` 语句使用它们。

存在两种 exports 导出方式：

*   命名导出（Named exports）
    *   可以导出变量、函数或类
    *   可以使用 as 关键字重命名导出值

```
/// 声明后立即导出
export const firstName = 'rede';
export const lastName = 'li';
...

/// 导出已经声明的值
const firstName = 'rede';
const lastName = 'li';
export {firstName, lastName};
...

/// 导出函数
export function multiply (x, y) {
	return x * y;
}
...

/// 使用 as 重命名
function v1() {}
function v2() {}
export {
	v1 as streamV1,
	v2 as streamV2
}
```

*   默认导出（export default）
    *   每个模块只能包含一个默认导出
    *   `export default` 本质是将后面的值，直接赋给 `default` 变量，所以它后面不能再跟变量声明语句。

```
/// 命名导出和默认导出可以混在一起使用
/// index.js
const name = 'index';
const info = 'index-info';
const age = 'index-age';

export {info, age};
export default name;
...

/// main.js
import index from './index.js';
import {info, age} from './index.js';
console.log(index); // index
console.log(info, age); // index-info index-age
/// index.js 中默认导出的是 name，所以在 main.js 中 index 就是默认导出的 name，由于 info与age 是命名导出，所以要引入时也要明确
...

/// 下面写法是合理的
export default 42;
...

/// export default 后面不能跟变量声明，所以下面语句错误
export default var a = 1;
...

/// export default 后面可以跟匿名函数
/// 下面会忽略函数名 foo
export default function foo() {
  console.log('foo');
}
```

*   `export` 值的动态绑定
    *   `export` 语句输出的接口，与其值是动态绑定关系，内部变量发生变化，外部引入的值也会跟着一起改变

```
// index.js
export let foo = 'bar';
setTimeout(() => foo = 'baz', 500); // 0.5s 后动态修改变量值
...
// main.js
import {foo} from './index';
console.log(foo);
setTimeout(() => {
   console.log(foo); 
}, 600);
// bar
** 0.5s后
// baz
```

### `export` 的异常情况

> `export` 规定对外的接口，必须与模块内部变量建立一一对应关系，直接对外输出数据会报错

```
export 1; // SyntaxError: Unexpected token, expected
...

/// 下面的写法，一样报错，因为下面的写法一样是属于直接输出数据的情况
const m = 1;
export m;
...

/// function 和 class 也是一样，不可直接对外输出
function f() {};
export f; // 报错
```

> `export` 必须位于模块的顶层，不能处于任何块级作用域内

```
function foo () {
	export default 'bar'; /// 不能处于块级作用域内
}
foo(); // 报错
```

import
------

使用 `export` 定义对外接口后，其他模块就可以通过 `import` 加载这个模块引入相关内容。`import` 命令会被 JavaScript 引擎静态分析，会先于模块内的其他语句执行

*   命名空间导入 (Namespace Imports) 导入整个模块的内容

```
/// list.js
export const name = 'list.js';
export const age = 18;
...

/// index.js
import * as list from './list';
console.log(list.name, list.age);
```

*   命名导入 (Named Imports) 从模块导入特定接口
    *   导入时可以自定义名称

```
/// list.js
export const name = 'list.js';
export const age = 18;
...

/// index.js
import { name, age} list from './list.js';
console.log(name, age);
...

/// import 时可以重新定义一个名称
import {name as na} from './list.js';
```

*   默认导入 (Default Import)
    
    *   这个是和默认导出相对应，如果对应的导出文件没有使用 `export default` ，导入的值会是 undefined
*   空导入 (Empty Import)
    
    *   只会加载模块代码，但不创建任何新对象

```
import './module.js';
```

### `import` 异常情况

> `import` 加载的变量都是只读的，不可以进行修改

```
import {name} from './index.js';
name = 'main.js'; // 编译到这里报错 SyntaxError: "name" is read-only
```

> `import` 时必须明显指明需要加载的文件，不可使用表达式或变量，因为这些只有运行时才会有结果

```
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
/// 三种写法均会报错，因为在静态分析阶段这些语法根本尚未执行，无法得知需要加载的模块
...

/// 由于 import 是在编译阶段进行解析，所以如果同时载入两个同名的模块，也不会产生重复引入的情况
import './index.js';
import './index.js';
...

/// 如果是从同一个模块加载多个变量，最好写成一条语句
// bad
import {foo} from './index.js';
import {baz} from './index.js';
// good
import {foo, baz} from './index.js';
```

### 相关建议

> 不要使用模块的整体加载 (`*`)，需要什么功能就从指定模块加载什么功能

```
/// list.js
export const name = 'list.js';
export const age = 18;
...

/// index.js
import * as list from './list';
console.log(list.name); // 如果代码中只使用到了name，应该只导入name

/// 如果改写为下面这种写法，在打包代码时还会触发 tree shaking，打包出的代码提交更小
import {name} from './list';
```

> 不要使用 `export` 与 `import` 的复合写法

`export` 与 `import` 的过程都发生在编译阶段，写在一起和分开写本质上没什么区别，并不会有什么性能提升或者别的优势，分开写的话看起来语义更明显

```
// bad
export { firstName as default } from './index';

// good
// 这样更加明晰
import { firstName } from './index';

export default firstName;
```

其他
--

*   跨模块常量
    *   这主要是一个项目管理的思路，我们可以把页面中公共变量提取到一个模块中，需要使用的这些公共变量的再按需引入，比较明显的例子就是对接口 url 的管理

```
// urls.js
export const link1 = '...';
export const link2 = '...';
...

/// 需要使用请求的模块，通过这种方式，我们可以把所以的url存放在同一个文件下，使用时按需引入
import {link1} from 'urls.js';
```

### import()

`import()` 是一个提案，因为 `import` 无法进行动态加载，主要解决下面问题

*   按需加载
*   条件加载
*   动态的模块路径

目前借助 webpack，可以实现前两个功能

```
if (true) { // 条件加载
    import(/* webpackChunkName:"main" */'./main').then(item => {
        console.log(item.main);
    }); // 按需加载
} else {
    import(/* webpackChunkName:"list" */'./list').then(item => {
    	console.log(item.list);
    });
}
...

/// 同时加载多个模块，可以采用下面的写法
Promise.all([
    import(/* webpackChunkName:"main"*/'./main'),
    import(/* webpackChunkName:"main1"*/'./main1'),
    import(/* webpackChunkName:"main2"*/'./main2'),
]).then(([main, main1, main2]) => {
    console.log(main);
    console.log(main1);
    console.log(main2);
})
```

Module 加载
---------

### 浏览器加载 js

网页中，浏览器通过 `<script>` 标签加载 JavaScript 脚本，默认情况下，浏览器是同步加载 JavaScript 脚本，渲染引擎遇到 `<script>` 标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外链脚本，还必须等脚本加载完。

如果脚本体积很大，下载和执行的时间就会很长，造成浏览器堵塞，用户就会感觉到浏览器`“卡死”`了，没有任何响应。

可以在 `<script>` 标签上，添加 `defer` 或 `async` 属性，脚本就会异步加载。渲染引擎遇到有这两个属性的 `<script>` 标签就会开始下载外部脚本，然后继续执行后面的命令。

*   `defer` 会等到整个页面在内存中正常渲染结束 (DOM 结构完全生成，以及其他脚本执行完成)，才会执行
    *   `defer` 是渲染完再执行
    *   多个 `defer` 脚步也会按照它们在页面出现的顺序进行加载
*   `async` 是下载完成，渲染引擎则会中断渲染，执行这个脚本，然后再继续渲染。
    *   `async` 是下载完就执行
    *   `async` 则比较随意，不保证加载顺序

### 浏览器加载 esModule

如果浏览器还不支持，可以开启浏览器的的实验性 web 平台功能，非 `chrome` 自行查找解决方案

> chrome://flags/#enable-experimental-web-platform-features

```
// 开启后，直接在页面中设置script的type为module
<script type="module">
    import foo from './foo.js';
    console.log(foo);
</script>
```

*   `esModule` 与 `CommonJS模块` 区别
    *   `CommonJS模块` 输出的是一个值的拷贝，`esModule` 输出的是值的引用
        
        *   `CommonJS模块` 因是值拷贝，一旦值输出，那么模块内的变化就不会影响到外部引用 ，不过这也有例外，如果输出的是一个函数，那么 `CommonJS` 一样有办法取到内部变动后的值
        *   `esModule` 运行机制与 `CommonJS` 不同，`JS引擎` 对脚本进行静态分析时，如果遇到 `import` 命令，就会生成一个只读引用，只有脚本真正执行时，再根据这个只读引用，到被加载模块中取值，所以模块内部值发生变化时，外部加载值自然会跟着变动
    *   `CommonJS模块` 是运行时加载，`esModule` 是编译时输出
        
    *   `CommonJS模块` 的 `require()` 是同步加载模块，`esModule` 的 import 命令是异步加载，有一个独立的模块依赖的解析阶段
        

> 从 Node.js v13.2 版本开始，Node.js 已经默认打开了 esModule 支持。Node.js 要求 esModule 采用 .mjs 后缀文件名。Node.js 遇到 .mjs 文件，就认为它是 ES6 模块，如果不希望将后缀名改成 .mjs，可以在项目的 package.json 文件中，指定 type 字段为 module

```
{
   "type": "module"
}
```

*   esModule 在 Node 环境下的路径解析规则
    
    *   如果引入模块不含路径，就会去`node_modules` 下寻找这个模块
    *   `package.json` 文件有两个字段可以指定模块的入口文件：`main`、`exports`
        *   `main` 模块加载的入口文件
            *   比如 `import { something } from 'es-module-package';` Node.js 就会到 `./node_modules` 目录下面，寻找 `es-module-package` 模块，然后根据该模块`package.json` 的 `main` 字段去执行入口文件
        *   `exports` 字段可以指定脚本或子目录的别名，字段的优先级高于 `main` 字段
            *   `"exports": {"./submodule": "./src/submodule.js"}` 指定`src/submodule.js` 别名为 `submodule`，如果引入的是 `import submodule from 'es-module-package/submodule';`，则实际加载 `./node_modules/es-module-package/src/submodule.js`
    *   如果引入的脚本文件不存在后缀名比如`import './foo'`
        *   Node 会依次尝试按`.mjs`、`.js`、`.json`、`.node` 去尝试加载
        *   如果上面脚本都不存在 Node 就会去加载对应`package.json` 中的`main` 字段指定的脚本
        *   如果对应的文件或者字段还不存在，就会依次去尝试加载`./foo/index.mjs`、`./foo/index.js`、`./foo/index.json`、`./foo/index.node`
        *   如果依然不存在，就会报错
*   esModule 在浏览器环境也可以使用，浏览器对于带有 `type="module"` 的 `<script>`，就可以使用 esModule
    
    *   esModule 都是异步加载，等同于打开了 `defer` 属性。
    *   如果网页有多个 `<script type="module">`，它们会按照在页面出现的顺序依次执行
        *   如果主动设置了 `async` 属性，这时只要加载完成，渲染引擎就会中断渲染立即执行 ，不会按照在页面出现的顺序执行

> type="module" 模式下，不支持” 裸” import 语法（不支持 Node 路径查找方式）

```
/// 目录结构如下，本地起的服务是http://127.0.0.1:8080
|- index.html
|- src
	|- script
		|- index.js
		
/// index.js
export const info = 'index.js';
...

/// index.html
<script type="module">
	/// 支持绝对路径的 URL
  import {info} from 'http://127.0.0.1:8080/src/script/index.js';
  console.log(info);
</script>

/// 支持相对路径，必须以 "/", "./", or "../" 开头
import {foo} from '/src/script/index.js'; // 以/开头
import {foo} from './src/script/index.js'; // 以./开头
import {foo} from '../bar.js'; // 以../开头

// 不支持
import {foo} from 'src/script/index.js';
```

> 使用 nomodule 属性向后兼容 (和早期的 noscript 有同种功效)

```
<script type="module" src="./foo.js"></script>
<script nomodule src="./foo.nomodule.js"></script>
```

> type="module" 模式下，外链的 script 标签默认为 defer

```
<script type="module" src="1.js"></script>
<script src="2.js"></script>
<script defer src="3.js"></script>
/// 3个脚本的执行顺序为2.js、1.js、3.js，另外1.js和3.js并不会阻断DOM的渲染
```

> type="module" 模式下，内联的 script 同样是 defer

```
<!-- 内联 module -->
<script type="module">
  addTextToBody("Inline module executed");
</script>

<script src="1.js"></script>

<!-- 普通的内联 script -->
<script defer>
  addTextToBody("Inline script executed");
</script>

<script defer src="2.js"></script>

// 执行的顺序是 1.js, 普通的内联 script, 内联 module, 2.js
```

普通的内联 script 会忽略 defer 属性，而 内联 module scripts 永远是 deferred 的，不管它是否有 import 行为，然后因为内联 module 先于外链的 2.js 定义，所以执行顺序在 2.js 前面

> async 对 `外链` 和 `内联的 modules script` 同样适用

```
<!-- 这个脚本将会在imports完成后立即执行 -->
<script async type="module">
  import {addTextToBody} from './utils.js';

  addTextToBody('Inline module executed.');
</script>

<!-- 这个脚本将会在脚本加载和imports完成后立即执行 -->
<script async type="module" src="1.js"></script>
```

`async` 属性能让 script 加载的同时并不阻碍 HTML 解析器的工作，而且在加载完成后立即执行。与普通的 内联 scripts 不同的是, async 属性在 内联 modules 脚本上也有效，执行顺序也许并不会像它们出现在 DOM 里的顺序

> type="module" 模式下，就算多次引入也只执行一次

```
<!-- 1.js 只执行一次 -->
<script type="module" src="1.js"></script>
<script type="module" src="1.js"></script>
<script type="module">
  import "./1.js";
</script>

<!-- 而普通的脚本会执行多次 -->
<script src="2.js"></script>
<script src="2.js"></script>
```

> 与普通的 script 标签不同，type="module" 模式下如果加载非同域下的 js 会存在限制

```
/// 假定在 http://127.0.0.1:8080/index.html 页面，加载下面的 js
<script type="module" src="http://localhost:3111/index.js"></script>
/// 会提示跨域，并且告知 Access-Control-Allow-Origin 没有设置，如果这里不加 type="module" ，js 会正常加载
```

当请求在同一域下，大多数的 CORS-based APIs 都会发送凭证信息 (cookies 等)，但 fetch() 和 module scripts 例外，除非手动声明，否则是不会发送相关凭证的。

可以为其添加 crossorigin 属性，这样在请求时就可以携带相关凭证了（crossorigin="use-credentials")。需要注意的是，接收凭证的域必须返回 Access-Control-Allow-Credentials: true 的响应头，表示允许客户端携带验证信息，例如 cookie 之类的。这样客户端在发起跨域请求的时候，可以携带相关验证信息

```
<!-- 有凭证信息 (cookies等) -->
<script src="1.js"></script>

<!-- 没有凭证信息 -->
<script type="module" src="1.js"></script>

<!-- 有凭证信息 -->
<script type="module" crossorigin src="1.js?"></script>

<!-- 没有凭证信息 -->
<script type="module" crossorigin src="https://other-origin/1.js"></script>

<!-- 有凭证信息-->
<script type="module" crossorigin="use-credentials" src="https://other-origin/1.js?"></script>
```