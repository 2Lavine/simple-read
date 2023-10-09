> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7246777363257475129?utm_source=gold_browser_extension)

> ⛔这篇文章推荐的写法和`React`的理念是相违背的，请酌情使用。
> 
> 我的文章同步在我的公众号：萌萌哒草头将军，欢迎关注我。联系我请加`SunBoy_mmdctjj`，一起学习，一起进步。
> 
> 请不要较真儿，我就简单写个 hook，评论里一堆搬出第三方库来反驳我，真没必要，自己摸索一个东西的乐趣才是最重要的

### 💡 更多阅读

[新框架尝鲜](https://juejin.cn/post/7243975432088830009#heading-1 "https://juejin.cn/post/7243975432088830009#heading-1")

🚀 我的丝滑之旅
---------

### 🚗 useState 的难用之处

最近读新文档，文档中在介绍`useState`更新嵌套对象时提到，嵌套对象的写法比较繁琐：

```
const [info, setInfo] = useState({
    name: "萌萌哒草头将军",
    age: 18,
    project: {
        name: "raetable",
        adress: "mmdctjj.github.com/raetable",
        version: "v0.0.5"
    }
})

// 更新开源信息
setInfo({
    ...info,
    project: {
        ...info.project,
        version: 'v0.0.6'
    }
})
```

### 🚗 useImmer 的不足之处

同时还介绍了一个稍微简洁的更新状态的框架：`use-immer`

```
const [info, setInfo] = useImmer({
    name: "萌萌哒草头将军",
    age: 18,
    project: {
        name: "raetable",
        adress: "mmdctjj.github.com/raetable",
        info: "v0.0.5"
    }
})

// 更新项目版本号
setInfo((draft) => draft.project.version = 'v0.0.6')
```

看起来像`Vue`但又不完全像。因为这里的`draft`是使用`Proxy`封装的代理对象，可以记录对象的操作行为。那为啥还需要多此一举的使用操作函数再封装一层呢？

```
// 可以，但是喜欢不起来🙅‍
setInfo((draft) => draft.project.version = 'v0.0.6')
// =>
// 不可以用，但是很期待😘
draft.project.version = 'v0.0.6'
```

### 🚀 丝滑之旅开始

作为合格的摸鱼仔，不得写个玩具，满足下自己的期待吗？

接下来我手动实现一个返回`Proxy`对象的`hook`代替`useState`的功能。期待的功能是当修改这个对象时，使用这个对象的`dom`自动更新，并能`useEffect`可以监听到这个对象的变化。

所以，我们需要使用`useState`定义一个变量存储这个对象，最后并且返回这个对象

```
export const useProxy = <T>(state: T): T => {

  const [value, setValue] = useState<T | undefined>()
  
  return value
}
```

接下来，我们创建一个`Proxy`对象，并且赋值给`value`，当用户改变某个属性时，将变化的值重新赋值给`value`。

```
export const useProxy = <T extends Record<string | symbol, any>>(state: T): T => {

  const [value, setValue] = useState<T | undefined>()
  
  useEffect(() => {

    const state = new Proxy(state, {
      get: Reflect.get,
      set: (target, key: keyof T, value, reciver) => {
        target[key] = value
        setValue(target)
        return Reflect.set(target, key, value, reciver)
    })
    
    setValue(state)

  }, [])
  
  return value
}
```

看起来似乎没问题，但是实际上只要发生一次改变，当前的`target`就成为了普通对象，所以我们还需要将这个对象也变为代理对象....

这样思考下去，是不是都点递归的意思了，所以，我们改造下这里的逻辑，抽离创建代理对象过程。

```
import { useMemo, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProxy = <T extends Record<string | symbol, any>>(state: T): T => {

  const [value, setValue] = useState<T | undefined>()

  const createProxy = (target: T): T => {

    return new Proxy(target, {
      get: Reflect.get,
      set: (target, key: keyof T, value, reciver) => {
        target[key] = value
        setValue(createProxy(target))
        return Reflect.set(target, key, value, reciver)
      }
    })

  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initVlaue = useMemo(() => createProxy(state), [state])

  return value ?? initVlaue
}
```

这里当没有发生属性变化时，代理对象是基于原始`state`。

接下来我们验证下

```
import { useEffect } from 'react'
import { useProxy } from './useProxy'

function App() {

  const up = useProxy({
    name: "萌萌哒草头将军",
    age: 18,
  })

  useEffect(() => console.log(up), [up])

  return (
    <>
      <button onClick={() => {
        up.age ++
      }}>change</button>
      <p>{up.age}</p>
    </>
  )
}

export default App
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/922a7b8528f04234827d58364172e5e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

🚀 深层的响应式
---------

### 💎 手动嵌套版

不过此时，无法直接让嵌套对象具有响应式。

我们可以通过下面的方法间接的获得响应式

```
import { useEffect } from 'react'
import { useProxy } from './useProxy'

function App() {

  const project = useProxy({
    verison: 0.1,
    message: "o"
  })

  const up = useProxy({
    name: "萌萌哒草头将军",
    age: 18,
    project
  })

  useEffect(() => console.log(up), [up])

  return (
    <>
      <button onClick={() => {
        up.age ++
      }}>change age</button>
      
      <button onClick={() => {
        up.project.message += "h"
      }}>change message</button>
      
      <p>{up.age}</p>
      <p>{up.project.message}</p>
    </>
  )
}

export default App
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/250ab5c234624590a4a9587f2a0764d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 🎉 自动嵌套

这种写法还是不丝滑，不符合一个合格摸鱼仔的习惯。继续改造`useProxy`。

请先思考下面这个问题：

```
const obj = { count: 0 }

const proxy = new Proxy(obj, {})

proxy.count ++

console.log(obj.count) // 🚗 => ?
```

答案是 1，也就是说，源对象和代理对象是引用关系。

所以，我们在访问子对象时，给它也设置成代理对象，这样原始对象的嵌套对象也会被引用。

所以，我们每次当值改变时，重新根据源对象设置新的代理对象就可以了！

代码如下：

```
import { useMemo, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useProxy = <T extends Record<string | symbol, any>>(state: T): T => {

  const [value, setValue] = useState<T | undefined>()

  const createProxy = (targets: T): T => {

    return new Proxy(targets, {
      get: (target: T, key: keyof T, reciver) => {
        const res = Reflect.get(target, key, reciver)
        if (typeof res === 'object' && res !== null) {
          // 嵌套对象也设置代理对象
          return createProxy(res)
        }
        return res
      },
      set: (target, key: keyof T, value, reciver) => {
        // 基于原始对象重新设置新的代理对象
        setValue(createProxy(state))
        return Reflect.set(target, key, value, reciver)
      }
    })

  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initVlaue = useMemo(() => createProxy(state), [state])

  return value ?? initVlaue
}
```

我们继续验证下

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76f5ac83ccbc472da5efcb17167e0225~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 有个细节，自动嵌套时，`project`不是代理对象，手动嵌套时刚好相反。

如果需要代理的是数组，可以使用类似的逻辑实现。

```
const createProxyArray = (targets: T): T => {

    return new Proxy(targets, {
      get: (target: T, key: keyof T, reciver) => {
        const res = Reflect.get(target, key, reciver)
        
        if (typeof res === 'object' && res !== null) {
          // 嵌套对象也设置代理对象
          const proxy = createProxyObject(res)
          return proxy
        }
        return res
      },
      set: (target, key: keyof T, value, reciver) => {
        // 基于原始数组重新设置新的代理数组
        setValue(createProxyArray(state))
        return Reflect.set(target, key, value, reciver)
      }
    })
    
  }
 
  const initVlaue = useMemo(() => 
    Array.isArray(state)
      ? createProxyArray(state)
      : createProxyObject(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , [state])
```

> 注意，这种写法和`React`哲学是相违背的，慎重使用，另外，这是我摸鱼写的代码，我尽量验证了可行性，可能还会有 bug，欢迎反馈给我，我及时更正

今天的分享就到这了，谢谢您的观看，如果对你有启发，可以帮我点赞，十分感谢。