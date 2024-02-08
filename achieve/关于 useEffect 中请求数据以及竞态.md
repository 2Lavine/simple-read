> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7072971408452059143)

背景
--

一切起因皆是因为下面这段代码而起，甚至跟小伙伴们讨论了很久，大家可以先上个眼，后面会细说，戳 👉 [codesandbox](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fs%2Fuseeffectzhi-nan-krlz2v%3Ffile%3D%2Fsrc%2FApp.js "https://codesandbox.io/s/useeffectzhi-nan-krlz2v?file=/src/App.js")

```js
function Article({ id }) {
  const [article, setArticle] = useState(null)
  useEffect(() => {
    let didCancel = false
    console.log('effect', didCancel)
    async function fetchData() {
      console.log('setArticle begin', didCancel)
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(id)
        }, id);
      }).then(article => {
        // 快速点击 Add id 的 button，这里为什么会打印 true
        console.log('setArticle end', didCancel, article)
        // if (!didCancel) { // 把这一行代码注释就会出现错误覆盖状态值的情况
          setArticle(article)
        // }
      })
    }
    console.log('fetchData begin', didCancel)
    fetchData()
    console.log('fetchData end', didCancel)

    return () => {
      didCancel = true
      console.log('clear', didCancel)
    }

  }, [id])

  return <div>{article}</div>
}

function App() {
  const [id, setId] = useState(5000)
  function handleClick() {
    setId(id-1000)
  }
  return (
    <>
      <button onClick={handleClick}>add id</button>
      <Article id={id}/>
    </>
  );
}

export default App;
```

关键代码是在 useEffect 中通过清除副作用函数来修改 didCancel 的值，再根据 didCancel 的值来判断是否立马执行 setState 的操作，其实就是为了解决 `竞态` 的情况。

> 竞态，就是在混合了 async/await 和自顶向下数据流的代码中（props 和 state 可能会在 async 函数调用过程中发生改变），出现错误覆盖状态值的情况

例如上面的例子，我们快速点击两次 button 后，在页面上我们会先看到 `3000` ，再看到 `4000` 的结果，这就是因为状态为 `4000` 的先执行，但是更晚返回，所以会覆盖上一次的状态，所以我们最后看到的是 `4000`

useEffect 清除副作用函数
-----------------
我们知道，如果在 useEffect 函数中返回一个函数，那么这个函数就是`清除函数`，它会在组件销毁的时候执行，但是其实，它会在组件每次重新渲染时执行，并且清除上一个 effect 的副作用。
> 副作用是指一个 function 做了和本身运算返回值无关的事，比如：修改了全局变量、修改了传入的参数、甚至是 console.log()，所以 ajax 操作，修改 dom ，计时器，其他异步操作，其他会对外部产生影响的操作都是算作副作用
```
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  };
});
```

假如第一次渲染的时候 props 是 {id: 10}，第二次渲染的时候是 { id: 20 }。你可能会认为发生了下面这些事：

*   React 清除了 `{id: 10}`的 effect
*   React 渲染`{id: 20}`的 UI
*   React 运行`{id: 20}`的 effect

事实并不是这样
React 只会在`浏览器绘制`后运行 effects。
- 这使得你的应用更流畅因为大多数 effects 并不会阻塞屏幕的更新。
- Effect 的清除同样被延迟了，上一次的 effect 会在重新渲染后被清除：

*   React 渲染`{id: 20}`的 UI
*   浏览器绘制，在屏幕上看到`{id: 20}`的 UI
*   React 清除`{id: 10}`的 effect
*   React 运行`{id: 20}`的 effect

这里就会出现让大家迷惑的点，如果清除上一次的 effect 发生在 props 变成`{id: 20}`之后，那它为什么还能拿到旧的`{id: 10}`
> 因为组件内的每一个函数（包括事件处理函数，effects，定时器或者 API 调用等等）会捕获定义它们的那次渲染中的 props 和 state

所以，effect 的清除并不会读取最新的 props，它只能读取到定义它的那次渲染中的 props 值

分析最开始的🌰
--------
### 分析
回到我们最开始的例子，把注释掉的代码放开，就有了下面的分析。第一次渲染后
```
function Article() {
  ...
  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(id)
        }, id);
      }).then(article => {
        if (!didCancel) {
          setArticle(article)
        }
      })
    }
    fetchData()
  }, [5000])
  return () => {
    // 清除本次渲染副作用，给它编号 NO1，这里有个隐藏信息，此时这个函数内，还未执行前 didCancel = false
    didCancel = true
  }
}
// 等待 5s 后，页面显示 5000，
```
可以在`console.log('setArticle end', didCancel, article)`这行代码上打上断点，我们可以更直观的分析接下来的操作 👉 快速点击两次`button`
```
/**
    第一次点击，在页面绘制完成后，执行 useEffect
    首先执行上一次的清除函数，即函数 NO1，NO1 将上一次 effect 闭包内的 didCancel 设置为了 true
*/
function Article() {
  ...
  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      new Promise((resolve) => {
        setTimeout(() => { // setTimeout1
          resolve(id)
        }, id);
      }).then(article => {
        if (!didCancel) {
          setArticle(article)
        }
      })
    }
    fetchData()
  }, [4000])
  return () => {
    // 清除本次渲染副作用，给它编号 NO2，这里有个隐藏信息，此时这个函数内作用域中的 didCancel = false
    didCancel = true
  }
}
```
从`DevTools`中可以看到：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e7fe3a7b8e49bbb8409d307c5e3109~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

```
/**
    第二次点击，在页面绘制完成后，执行 useEffect
    首先执行上一次的清除函数，即函数 NO2，NO2 将上一次 effect 闭包内的 didCancel 设置为了 true
*/
function Article() {
  ...
  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      new Promise((resolve) => {
        setTimeout(() => { // setTimeout2
          resolve(id)
        }, id);
      }).then(article => {
        if (!didCancel) {
          setArticle(article)
        }
      })
    }
    fetchData()
  }, [3000])
  return () => {
    // 清除本次渲染副作用，给它编号 NO3，这里有个隐藏信息，此时这个函数内作用域中的 didCancel = false
    didCancel = true
  }
}
```
从`DevTools`中可以看到：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5569e7301eab4016bf0da74c4c8ce7a5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
### 结论
第二次点击后，setTimeout2 先执行完，此时 didCancel 值为 false，所以会执行`setArticle`的操作，页面展示`3000`，为什么这里的 didCancel 为 false 呢，因为此时 NO2 的清除函数没有执行，它会在组件下一次重新渲染，或者组件卸载时执行。

再等待差不多 1s 后，setTimeout2 执行完，此时 didCancel 的值被 NO2 的清除函数设置为了 true，所以它不会执行`setArticle`的操作。这样就不会出现，先看到`4000`然后再变成`3000`的情况。

useEffect 请求数据的方式
-----------------

### 使用 async/await 获取数据

```
// 有同学想在组件挂在时请求初始化数据，可能就会用下面的写法
function App() {
    const [data, setData] = useState()
    useEffect(async () => {
        const result = await axios('/api/getData')
        
        setData(result.data)
    })
}
```
但是我们会发现，在控制台中有警告信息：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54192a2fa45243dc92667367e72eaaf4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
意思就是在 useEffect 中不能直接使用 async，因为 async 函数声明定义一个异步函数，该函数默认会返回一个隐式 Promise，但是，在 effect hook 中我们应该不返回任何内容或者返回一个清除函数。所以我们可以改成下面这样
```
function App() {
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            '/api/getData',
          );
          setData(result.data);
        };
        fetchData();
    })
}
```

### 准确告诉 React 你的依赖项

```
function Greeting({ name }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    document.title = 'Hello, ' + name;
  });

  return (
    <h1 class>
      Hello, {name}
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
    </h1>
  );
}
```

我们每次点击 button 使 counter+1 的时候，effect hook 都会执行，这是没必要的，我们可以将`name`加到 effect 的依赖数组中，相当于告诉 React，当我`name`的值变化时，你帮我执行 effect 中的函数。

如果我们在依赖中添加所有 effect 中用到的组件内的值，有时效果也不太理想。比如：

```
useEffect(() => {
    const id = setInterval(() => {
        setCount(count+1)
    }, 1000)
    return () => clearInterval(id)
}, [count])
```

虽然，每次 count 变化时会触发 effect 执行，但是每次执行时定时器会重新创建，效果不是最理想。我们添加`count`依赖，是因在`setCount`调用中用到了`count`，其他地方并没有用到`count`，所以我们可以将`setCount`的调用改成函数形式，让`setCount`在每次定时器更新时，自己就能拿到当前的`count`值。所以在 effect 依赖数组中，我们可以踢掉`count`

```
useEffect(() => {
    const id = setInterval(() => {
        setCount(count => count+1)
    }, 1000)
    return () => clearInterval(id)
}, [])
```

### 解耦来自 Actions 的更新

我们修改上面的例子让它包含两个状态：`count`和`step`
```
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + step);    
    }, 1000);
    return () => clearInterval(id);
  }, [step]);
  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}
```

此时，我们修改`step`又会重启定时器，因为它是依赖性之一。假如我们不想在`step`改变后重启定时器呢，该如何从 effect 中移除对`step`的依赖。
当你想更新一个状态，并且这个状态更新依赖于另一个状态的时候，在例子中就是`count`依赖`step`，我们可以用`useReducer`去替换它们
```
function Counter() {
  const [state, dispatch] = useReducer(reducer, initState)
  const { count, step } = state
  
  const initState = {
      count: 0,
      step: 1
  }
  
  function reducer(state, action) {
      const { count, step } = state
      switch (action.type) {
          case 'tick':
              return { count: count + step, step }
          case 'step':
              return { count, step: action.step }
          default:
              throw new Error()
      }
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' })   
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);
  
  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}
```
上面代码中将`dispatch`作为 effect 依赖不会每次都触发 effect 的执行，因为 React 会保证`dispatch`在组件的声明周期内保持不变，所以不会重新创建定时器。

> 你可以从依赖中去除`dispatch`，`setState`，`useRef`包裹的值，因为 React 会确保它们是静态的

相比于直接在 effect 里面读取状态，它`dispatch`了一个`action`来描述发生了什么，这使得我们的 effect 和 step 状态解耦。我们的 effect 不再关心怎么更新状态，它只负责告诉我们发生了什么。更新的逻辑全都交由`reducer`去统一处理

> 当你 dispatch 的时候，React 只是记住了 action，它会在下一次渲染中再次调用 reducer，所以 reducer 可以访问到组件中最新的`props`
