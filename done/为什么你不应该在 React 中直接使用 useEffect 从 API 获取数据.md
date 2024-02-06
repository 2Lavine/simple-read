> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.skk.moe](https://blog.skk.moe/post/why-you-should-not-fetch-data-directly-in-use-effect/)


TL; DR
------
*   绝大部分触发网络请求的原因都是用户操作，应该在 Event Handler 中发送网络请求
*   大部分时候，首屏需要的数据可以通过服务端渲染 SSR 直出、无需在客户端额外发送网络请求
*   即使需要客户端在首屏获取数据，未来 React 和社区维护的库会提供基于 Suspense 的数据请求 Pattern、实现「Render as your fetch」
*   即使在使用「Fetch on render」的 Pattern，也应该直接使用第三方库如 SWR 或 React Query，而不是直接使用 `useEffect`

从发送一个简单的请求开始
------------
设想一下你在编写一个 React 应用，需要从 API 获取产品列表数据、并渲染到页面上。你想到了网络请求不属于渲染、而是渲染的副作用，你还想到了 React 提供了一个专门的 Hook `useEffect` 用于处理渲染的副作用，最常见的场景就是将属于 React 外部的状态同步到 React 内部中。你不假思索，实现了一个 `<ProductList />` 组件：

```
const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <ul>
      {products.map(product => (
        <Product {...product} key={product.id} />
      ))}
    </ul>
  );
}
```
在 UI 中展示「加载中」和错误
----------------
你发现首次加载的时候，直到数据加载完成之前页面都是白屏，用户体验很不好。于是你决定实现一个「加载中」的进度条、引入了一个新的状态 `isLoading`：
然后你又意识到，除了一个「正在玩命加载中」以外，你还需要在服务器出错时显示错误提示、必要时还要上报错误日志，于是你又引入了一个新的状态 `error`：
```
const ProductList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        // TODO 错误日志上报
        setError(err)
      });
  }, []);

  if (isLoading) {
    {/* TODO 实现一个骨架屏 <Skeleton /> 改善 UX、避免 CLS */}
    return <Loading>正在玩命加载中...</Loading>;
  }

  if (error) {
    {/* TODO 添加「重试」按钮 */}
    return <div>出现错误啦！</div>
  }

  return (
    <ul>
      {products.map(product => (
        <Product {...product} key={product.id} />
      ))}
    </ul>
  );
}
```

封装一个新的 Hook
-----------
你发现每个需要从 API 获取数据的组件都需要重复上述的代码，非常繁琐。于是你决定将其封装成一个 `useFetch` 的 Hook，在组件中可以直接调用：
```
const useFetch = (url, requestInit = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(url, requestInit)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(err => setError(err));
  }, [url, requestInit]);

  return { data, isLoading, error };
}
```

现在，你可以直接在组件中使用 `useFetch` Hook 了：

```
const ProductList = () => {
  const { isLoading, data, error } = useFetch('https://dummyjson.com/products');
}

const Product = ({ id }) => {
  const { isLoading, data, error } = useFetch(`https://dummyjson.com/products/${id}`);
}
```

处理 Race Condition
-----------------
你实现了一个在多个产品之间切换的轮播组件，当前展示的产品存储在状态 `curentProduct` 中：

```
const Carousel = ({ intialProductId }) => {
  const [currentProduct, setCurrentProduct] = useState(intialProductId);
  const { data, isLoading, error } = useFetch(`https://dummyjson.com/products/${currentProduct}`);
};
```
结果你在测试时发现，在轮播组件中快速切换时，有时候当你点击下一个产品，界面上却展示了上一个产品。  
因为你没有在 `useEffect` 中声明如何清除你的副作用。
- 发送网络请求是一个异步的行为，收到服务器数据的顺序并不一定是网络请求发送时的顺序、出现了 Race Condition：

```
| =============== Request Product 1 ===============> | setState()
      | ===== Request Product 2 ====> | setState() |
```

如果发生了如上所示的第二个产品的数据返回地比第一个产品快的情况，你的 `data` 就会被第一个产品的数据覆盖掉。

于是你在 `useFetch` 中写了一个清除副作用的逻辑：
```
const useFetch = (url, requestInit = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    fetch(url, requestInit)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      setIsLoading(false);
    }
  }, [url, requestInit]);

  return { data, isLoading, error };
}
```

感谢 JavaScript 闭包的力量，现在即使 Product 2 的数据比 Product 1 的数据更早返回，Product 1 的数据也不会覆盖掉 Product 2 的数据。
你还可以在清除副作用时检测当前浏览器是否支持 `AbortController`、用 `AbortSignal` 取消中止网络请求：
```
const isAbortControllerSupported = typeof AbortController !== 'undefined';

const useFetch = (url, requestInit = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let abortController = null;
    if (isAbortControllerSupported) {
      abortController = new AbortController();
    }

    setIsLoading(true);
    fetch(url, { signal: abortController?.signal, ...requestInit })
      // .then(...

    return () => {
      isCancelled = true;
      abortController?.abort();
      setIsLoading(false);
    }
  }, [url, requestInit]);

  return { data, isLoading, error };
}
```

缓存网络请求
------
让我们继续回到上述的轮播组件。
每当轮播组件切换时，`<Product />` 就会接受一个新的 `props.id`、组件就会经历一次更新、`url` 发生改变、`useEffect` 重新执行、触发一次新的网络请求。为了去除后续不必要的网络请求，`useFetch` 需要一个缓存：
```
const isAbortControllerSupported = typeof AbortController !== 'undefined';
/** TODO 将 RequestInit 对象也存在缓存里 */
const cache = new Map();

const useFetch = (url, requestInit = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isCancelled = false;
    let abortController = null;
    if (isAbortControllerSupported) {
      abortController = new AbortController();
    }
    if (cache.has(url)) {
      setData(cache.get(url));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetch(url, { signal: abortController?.signal, ...requestInit })
        .then(res => res.json())
        .then(data => {
          if (!isCancelled) {
            cache.set(url, data);
            setData(data);
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (!isCancelled) {
            setError(err);
            setIsLoading(false);
          }
        });
    }

    return () => {
      isCancelled = true;
      abortController?.abort();
      setIsLoading(false);
    }
  }, [url, requestInit]);

  return { data, isLoading, error };
}
```

缓存刷新
----
> There are 2 hard problems in computer science: naming things, cache invalidation, and off-by-1 errors.

有了缓存，你就需要刷新缓存，不然你的显示在 UI 上的数据就可能过时。你有很多的时机可以刷新缓存，比如你可以在标签页失去 Focus 的时候刷新缓存：
```
const isAbortControllerSupported = typeof AbortController !== 'undefined';
const cache = new Map();
const isSupportFocus = typeof document !== 'undefined' && typeof document.hasFocus === 'function';

const useFetch = (url, requestInit = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const removeCache = useCallback(() => {
    cache.delete(url);
  }, [url]);
  const revalidate = useCallback(() => {
    // TODO 重新 fetch 获取数据填充缓存
  }， []);

  useEffect(() => {
    const onBlur = () => {
      removeCache();
    };

    const onFocus = () => {
      revalidate();
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  })

  // fetch 相关逻辑
  // useEffect(() => ...

  return { data, isLoading, error };
}
```

你还可以定时重复更新缓存（interval），你还可以当用户网络状态发生改变时（从数据流量切换到 Wi-Fi 时）更新缓存。现在你需要写更多的 `useEffect` 和 `addEventListener` 了。

而且，当组件卸载、重新挂载时，你虽然可以先使用缓存渲染界面避免再次白屏，但是你随后需要异步刷新缓存、最后将最新数据再更新到 UI 上。

兼容 React 18 Concurrent Rendering
--------------------------------
React 18 引入了 Concurrent Rendering 的概念。
- 简单来说，当 opt-in 了 Concurrent Rendering 之后，React 能够打断、暂停、
- 甚至中止被标记为「低优先级」的 Update（如 Transition）、为「高优先级」的 Update 让路。

在实现 `useFetch` 的缓存时，`cache` 是一个全局变量，每一个组件中的每一个 `useFetch` 都能够直接读写 `cache`。虽然 `cache.get` 时得到的数据都是最新的，
- 但是一个 `useFetch` 调用 `cache.set` 后，`cache` 却无法通知其他 `useFetch` 需要更新、只能被动地等待其他 `useFetch` 的下次 `cache.get`。

假设你的 `<ProductList />` 组件使用了 React 18 的 Concurrent API，如 `useTransition` 或 `startTransition`，同时 `<ProductList />` 和 `<Carousel />` 都使用了 `useFetch('https://dummyjson.com/products')` 获取从同一个 API 获取数据。
-  由于 `<ProductList>` 组件 opt in 了 Concurrent Rendering，因此 `<ProductList />` 和 `<Carousel />` 渲染和更新不一定是同时发生的（React 可能会为了响应用户与 `<Carousel />` 的交互，暂停 `<ProductList />` 的更新，即两个组件的更新不是同步的），
- 而在两次更新之间，`useFetch` 的缓存可能由于刷新、发生了改变，最终导致 `<ProductList />` 和 `<Carousel />` 分别的 `useFetch` 使用了不同的缓存数据，导致了不一致（Tearing）。
- 为了避免 Tearing、通知 React 全局变量的更新并安排重新渲染，你需要重新实现 `cache`、以使用 React 18 的另一个 Hook `useSyncExternalStore`：

```
const cache = {
  __internalStore: new Map(),
  __listeners: new Set(),
  set(key) {
    this.__internalStore.set(key);
    this.__listeners.forEach(listener => listener());
  },
  delete(key) {
    this.__internalStore.delete(key);
    this.__listeners.forEach(listener => listener());
  },
  subscribe(listener) {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  },
  getSnapshot() {
    return this.__internalStore;
  }
}

const useFetch = (url, requestInit) => {
  const currentCache = useSyncExternalStore(
    cache.subscribe,
    useCallback(() => cache.getSnapshot().get(url), [url])
  );

  // 缓存刷新逻辑
  // useEffect(() => ...

  useEffect(() => {
    let isCancelled = false;
    let abortController = null;
    if (isAbortControllerSupported) {
      abortController = new AbortController();
    }

    // 不再直接 `cache.get`，而是读取通过 useSyncExternalStore 获取到的 currentCache
    // TODO：理想中应该直接将 currentCache 视为 data，而不是将 currentCache 同步到 data 中
    if (currentCache) {
      setData(localCache);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetch(url, { signal: abortController?.signal, ...requestInit })
        .then(res => res.json())
        .then(data => {
          if (!isCancelled) {
            // 写入 cache 时，直接使用 cache.set
            cache.set(url, data);
            setData(data);
            setIsLoading(false);
          }
        })
        .catch(err => {
          // if (!isCancelled) ...
        });
    }

    return () => {
      isCancelled = true;
      abortController?.abort();
      setIsLoading(false);
    }
  }, [url, requestInit]);
}
```

现在，每当有一个 `useFetch` 写入 `cache` 后，React 都会使用 `cache` 中的最新值更新所有使用了 `useFetch` 的组件。

感觉到头昏脑涨了吗？绑紧你的安全带，让我们继续。

请求合并去重
------

> There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors.  
> Oh and weird concurrency bugs.  
> Oh and weird concurrency bugs.

你的 React 应用可能是这样的：

```
<Layout>
  <Carousel list={hotProductLists}>
    {
      (productId) => <Product id={productId} />
    }
  </Carousel>
  <ProductList>
    {allProductLists.map(product => <Product key={product.id} id={product.id} />)}
  </ProductList>
</Layout>
```

由于你在 `<Product />` 组件中 Fetch on render，因此同一时刻，你的 React Tree 中可能存在不止一个 `<Product id={114514} />`；
因此在页面首次加载、没有缓存时，你可能仍然会同时向同一个 URL 发送不止一次的请求。
- 为了合并相同请求，你需要实现一个 mutex lock，避免多个 `useFetch` 向同一个 URL 发送多个请求；
- 然后你还需要实现一个 pub/sub，将 API 的响应数据广播到所有使用这个 URL 的 `useFetch`。

更多，我还要更多
--------

作为一个用于发送网络请求的、low-level 的 React Hook，`useFetch` 需要实现的功能只多不少：

*   Error Retry：在数据加载出问题的时候，要进行有条件的重试（如仅 5xx 时重试，403、404 时放弃重试）
*   Preload：预加载数据，避免瀑布流请求
*   SSR、SSG：服务端获取的数据用来提前填充缓存、渲染页面、然后再在客户端刷新缓存
*   Pagination：大量数据、分页请求
*   Mutation：响应用户输入、将数据发送给服务端
*   Optimistic Mutation：用户提交输入时先更新本地 UI、形成「已经修改成功」的假象，同时异步将输入发送给服务端；如果出错，还需要回滚本地 UI
*   Middleware：日志、错误上报、Authentication

既然一个 `useFetch` 的需求这么多，为什么不直接使用现成的 React Data Fetching Hook 呢？不论 [SWR](https://swr.vercel.app/) 还是 [React Query](https://tanstack.com/query/v4) 都能够覆盖这些功能。