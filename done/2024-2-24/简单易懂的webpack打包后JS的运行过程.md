> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903520378814471?searchId=2024013109533719B9C5AE5C320162A1DF)

简单配置
----
既然需要用到 `webpack`，还是需要简单配置一下的，这里就简单贴一下代码，首先是 `webpack.config.js`:

```
const path = require('path');
const webpack = require('webpack');
//用于插入html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//清除输出目录，免得每次手动删除
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'index.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'js/[name].[chunkhash:4].js'
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    //持久化moduleId，主要是为了之后研究加载代码好看一点。
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
    })
  ]
};
```

之后是两个简单的 `js` 文件：
```
// test.js
const str = 'test is loaded';
module.exports = str;

// index.js
const test = require('./src/js/test');
console.log(test);
```

从 `index.js` 开始看代码
------------------
先从打包后的 `index.html` 文件看看两个 `JS` 文件的加载顺序：
```
<body>
	<script type="text/javascript" src="js/manifest.2730.js"></script>
	<script type="text/javascript" src="js/index.5f4f.js"></script>
</body>
```
打包后 `js` 文件的加载顺序是先 `manifest.js`，之后才是 `index.js`，
我们先看看 `index.js` 的内容是什么
```js
// index.js
webpackJsonp([0], {
  "JkW7": (function(module, exports, __webpack_require__) {
    const test = __webpack_require__("zFrx");
    console.log(test);
  }),
  "zFrx": (function(module, exports) {
    const str = 'test is loaded';
    module.exports = str;
  })
}, ["JkW7"]);

在 manifest.js可以发现这些代码
window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
    var moduleId, result;
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (executeModules) {
      for (i = 0; i < executeModules.length; i++) {
        result = __webpack_require__(executeModules[i]);
      }
    }
    return result;
  };
```
- 首先 `minifest.js` 会定义一个 `webpackJsonp` 方法，待其他打包后的文件（也可称为 `chunk`）调用。
- 当调用 `chunk` 时，会先将该 `chunk` 中所有的 `moreModules`， 也就是每一个依赖的文件也可称为 `module` （如 `test.js`）存起来。
- 之后通过 `executeModules` 判断这个文件是不是入口文件，决定是否执行第一次 `__webpack_require__`。


`__webpack_require__` 代码阅读
------------------

而 `__webpack_require__` 的作用，就是根据这个 `module` 所 `require` 的东西，不断递归调用 `__webpack_require__`，`__webpack_require__`函数返回值后供 `require` 使用。当然，模块是不会重复加载的，因为 `installedModules` 记录着 `module` 调用后的 `exports` 的值，只要命中缓存，就返回对应的值而不会再次调用 `module`。`webpack` 打包后的文件，就是通过一个个函数隔离 `module` 的作用域，以达到不互相污染的目的。

```js
(function(modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }
})([]);
```
