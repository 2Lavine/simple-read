> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903922469961741?searchId=2023101114215534CBE9FA814D5B82147F)


Object.freeze() 是 “浅冻结”
要完全冻结具有嵌套属性的对象，您可以编写自己的库或使用已有的库来冻结对象，如 [Deepfreeze](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsubstack%2Fdeep-freeze "https://github.com/substack/deep-freeze") 或 [immutable-js](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fimmutable-js%2Fimmutable-js "https://github.com/immutable-js/immutable-js")

但是在写业务逻辑的时候很少用的知识点 `Object.getOwnPropertyNames(obj)` 。我们都知道在 JS 的 Object 中存在原型链属性，通过这个方法可以获取所有的非原型链属性。
利用`Object.freeze()`提升性能
-----------------------

除了组件上的优化，我们还可以对 vue 的依赖改造入手。
初始化时，vue 会对 data 做 getter、setter 改造，在现代浏览器里，这个过程实际上挺快的，但仍然有优化空间。

但 Vue 在遇到像 `Object.freeze()` 这样被设置为不可配置之后的对象属性时，不会为对象加上 setter getter 等数据劫持的方法。[**
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/23/16cbdd104a327a4e~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

Object.freeze()`应用场景
---------------------

由于 `Object.freeze()`会把对象冻结，所以比较适合展示类的场景，如果你的数据属性需要改变，可以重新替换成一个新的 `Object.freeze()`的对象。

Javascript 对象解冻
---------------

修改 React props React 生成的对象是不能修改 props 的, 但实践中遇到需要修改 props 的情况. 如果直接修改, js 代码将报错, 原因是 props 对象被冻结了, 可以用 Object.isFrozen() 来检测, 其结果是 true. 说明该对象的属性是只读的.

那么, 有方法将 props 对象解冻, 从而进行修改吗?

事实上, 在 javascript 中, 对象冻结后, 没有办法再解冻, 只能通过克隆一个具有相同属性的新对象, 通过修改新对象的属性来达到目的.

可以这样:

```
ES6: Object.assign({}, frozenObject);
lodash: _.assign({}, frozenObject);
```

来看实际代码:

```
function modifyProps(component) {
  let condictioin = this.props.condictioin,
    newComponent = Object.assign({}, component),
    newProps = Object.assign({}, component.props)
  
  if (condictioin) {
    if (condictioin.add) newProps.add = true
    if (condictioin.del) newProps.del = true
  }
  newComponent.props = newProps
  
  return newComponent
}
```

### 锁定对象的方法

*   Object.preventExtensions()

no new properties or methods can be added to the project 对象不可扩展, 即不可以新增属性或方法, 但可以修改 / 删除

*   Object.seal()

same as prevent extension, plus prevents existing properties and methods from being deleted 在上面的基础上，对象属性不可删除, 但可以修改

*   Object.freeze()

same as seal, plus prevent existing properties and methods from being modified 在上面的基础上，对象所有属性只读, 不可修改

以上三个方法分别可用 Object.isExtensible(), Object.isSealed(), Object.isFrozen() 来检测

