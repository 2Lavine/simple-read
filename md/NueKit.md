# CLi
## URL 语法
new URL(url, base)
- base 表示基准 URL 的字符串，当 url 为相对 URL 时，它才会生效
他可以获取一些信息如 pathName, host,SearchParams
## import.meta.url
import.meta 是一个引用模块元数据的对象它提供了有关模块本身的信息
import.meta.url当前模块文档的URL。在Node.js中，这通常是以 file:// 开头的文档路径

## JS 如何以模块运行
1. Node 环境
	1. 使用 .mjs 扩展名:
	2. 在 package.json 中设置 "type": "module":
2. 浏览器环境
	1. 通过 \<script type="module"\> 标签加载您的脚本
	2. 服务器需要将 JavaScript 文档作为 application/javascript 类型提供。大多数现代服务器会自动做到这一点，


## Path
Path.parse
1. 是忽略最后一个是否是 slash
	1. parse('a/b/')  == parse('a/b')


# build
(bun and esbuild) 参数
external：这个参数指定哪些模块应该被视为外部模块，不应该包含在最终的打包文档中。
entryPoints：这个参数指定了打包的入口点（即要打包的主要文档）。
format：这个参数指定了输出的模块格式。在这里，它被设置为 'esm'，表示输出为ES Module。
outdir：这是指定输出目录的参数，表示打包后的文档将被放置在哪个目录中。
bundle：这个参数可能表示是否要将所有模块捆绑成一个单独的文档。
minify：这个参数可能表示是否进行代码的最小化（



## Event
dispatchEvent(new Event("before:route"));
- 会被 addEventListener("before:route")给监听到