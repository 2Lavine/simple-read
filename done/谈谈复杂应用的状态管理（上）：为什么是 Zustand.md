> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7177216308843380797?searchId=20240126153450902039BAB3C63517BA67)

复杂应用的状态管理天坑
-----------
ProEditor 是内部组件库 TechUI Studio 的编辑器组件。牵扯到大量的状态管理需求。
**❶ Editor 容器状态管理与组件Table状态管理拆分，但可联动消费；**
- 容器状态负责了一些偏全局配置的状态维护，比如画布、代码页的切换，是否激活画布交互等等，
- 而组件的状态则是保存了组件本身的所有配置和状态。
好处在于
- 不同组件可能会有不同的状态，而 Editor 的容器状态可以复用，
- 比如做 ProForm 的时候，Editor 的容器仍然可以是同一个，组件状态只需额外实现 ProForm 的 Store 即可。

## 需要进行复杂的数据处理
ProEditor 针对表格编辑，做了大量的数据变换操作。
- 比如 ProTable 中针对 `columns` 这个字段的更新就有 14 种操作。
- 比如其中一个比较容易被感知的`updateColumnByOneAPI` 就是基于 oneAPI 的字段信息更新，细颗粒度地调整 columns 里的字段信息。
- 而这样的字段修改类型的 store，在 ProEditor 中除了 `columns` 还有一个 `data`。
当时，为了保证数据变更方法的可维护性与 action 的不变性，我采用了 userReducer 做变更方法的管理。

因为一旦采用自定义 hooks ，就得写成下面这样才能保证不会重复渲染，会造成极大的心智负担，一旦出现数据不对的情况，很难排查到底是哪个方法或者依赖有问题。

```
// 自定 hook 的写法
const useDataColumns = () => {
  const createOrUpdateColumnsByMockData = useCallback(()=>{
    // ...
  },[a,b]);
  const createColumnsByOneAPI = useCallback(()=>{
    // ...
  },[c,d]);
  const updateColumnsByOneAPI = useCallback(()=>{
    // ...
  },[a,b,c,d]);
  // ...
}
```

但 useReducer 也有很大的局限性，例如不支持异步函数、不支持内部的 reducer 互相调用，不支持和其他 state 联动（比如要当参数穿进去才可用），所以也不是最优解。

## 是个可被外部消费的组件
一旦提到组件，势必要提非受控模式和受控模式。为了支持好我们自己的场景，且希望把 ProEditor 变成一个好用的业务组件，所以我们做了受控模式，毕竟一个好用的组件一定是要能同时支持好这两种模式的。

在实际场景下，我们既需要配置项（`config`）受控，同时也需要画布交互状态（`interaction`）受控，
- 例如下面的场景：在激活某个单元格状态时点击生成，我们需要将这个选中状态进行重置，才能生成符合预期的设计稿。
- 所以为了支持细颗粒度的受控能力，我们提供了多个受控值，供外部受控模式。

```js
// ProEditor 外部消费的 Demo 示意
export default () => {
  const [status, setStatus] = useState();
  const { config, getState } = useState();

  return  (
    <ProEditor
      // config 和 onConfigChange 是一对
      config={config}
      onConfigChange={({ config }) => {
        setConfig(config);
      }}
      // interaction 和 onInteractionChange 是另一对受控
      interaction={status}
      onInteractionChange={(s) => {
        setStatus(s);
      }}
      />
  );
}
```


为什么是 Zustand ？
--------------
### 状态共享
**状态管理最必要的一点就是状态共享**。
- 这也是 context 出来以后，大部分文章说不需要 redux 的根本原因。
-  context 可以实现最最基础的状态共享。
	- 但这种方法（包括 redux 在内，都需要在最外层包一个 Provider。 Context 中的值都在 Provider 的作用域下有效。

```
// Context 状态共享
// store.ts
export const StoreContext = createStoreContext(() => { ... });
// index.tsx
import { appState, StoreContext } from './store';
root.render(
    <StoreContext.Provider value={appState}>
      <App />
    </StoreContext.Provider>
);
// icon.tsx
import { StoreContext } from './store';
const ReplaceGuide: FC = () => {
  const { i18n, hideGuide, settings } = useContext(StoreContext);
  // ...
  return ...
}
```

而 zustand 做到的第一点创新就是：
- **默认不需要 Provider**。
- 直接声明一个 hooks 式的 useStore 后就可以在不同组件中进行调用。它们的状态会直接共享，简单而美好。
由于没有 Provider 的存在，所以声明的 useStore 默认都是单实例，
- 如果需要多实例的话，zustand 也提供了对应的 Provider 的[书写方式](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand%23react-contexthttps%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand%23react-context "https://github.com/pmndrs/zustand#react-contexthttps://github.com/pmndrs/zustand#react-context")，
- 这种方式在组件库中比较常用。 ProEditor 也是用的这种方式做到了多实例。
此外，zustand 的 store 状态既可以在 react 世界中消费，也可以在 react 世界外消费。

### ❷ 状态变更
- hooks 的 `setState` 是原子级的变更状态，hold 不住复杂逻辑；
-  `useReducer` 的 hooks 借鉴了 redux 的思想，提供了 dispatch 变更的方式，但和 redux 的 reducer 一样，这种方式没法处理异步，且没法互相调用，
- 最新的 `redux-toolkit` 中优化大量 redux 的模板代码，针对同步异步方法的书写仍然让人心生畏惧。
而在 zustand 中，函数可以直接写，完全不用区分同步或者异步，一下子把区分同步异步的心智负担降到了 0。

```
// zustand store 写法

// store.ts
import create from 'zustand';

const initialState = {
 // ...
};

export const useStore = create((set, get) => ({
  ...initialState,
  createNewDesignSystem: async () => {
    const { params, toggleLoading } = get();

    toggleLoading();
    const res = await dispatch('/hitu/remote/create-new-ds', params);
    toggleLoading();

    if (!res) return;

    set({ created: true, designId: res.id });
  },
  toggleLoading: () => {
    set({ loading: !get().loading });
  }
}));

// CreateForm.tsx
import { useStore } from './store';

const CreateForm: FC = () => {
  const { createNewDesignSystem } = useStore();

  // ...
}
```

**zustand 会默认将所有的函数保持同一引用**。
- 所以用 zustand 写的方法，默认都不会造成额外的重复渲染。
在下图可以看到，所有 zustand 的 useStore 出来的值或者方法，都是橙色的变量，具有稳定引用，不会造成不必要的重复渲染。
**需要调用当前快照下的值或方法**。
===
在常规的开发心智中，
- 我们往往会在异步方法中直接调用当前快照的值来发起请求，
- 或使用同步方法进行状态变更，这会有极好的状态内聚性。

比如说，我们有一个方法叫「废弃草稿」，需要获取当前的一个 id ，向服务器发起请求做数据变更，同时为了保证当前界面的数据显示有效性，变更完毕后，我们需要重新获取数据。
我们来看看 hooks 版本和 zustand 的写法对比，如下所示：
```js
// hooks 版本
export const useStore = () => {
  const [designId, setDesignId] = useState();
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(() => {
    if (designId) {
      mutateKitchenSWR('/hitu/remote/ds/versions', designId);
    }
  }, [designId]);

  const deprecateDraft = useCallback(async () => {
    setLoading(true);
    const res = await dispatch('/hitu/remote/ds/deprecate-draft', designId);
    setLoading(false);
    if (res) {
      message.success('草稿删除成功');
    }
    // 重新获取一遍数据
    refetch();
  }, [designId, refetch]);

  return {
    designId,
    setDesignId,
    loading,
    deprecateDraft,
    refetch,
  }
};
```

```js
// zustand 写法
const initialState = { designId: undefined, loading: false };
export const useStore = create((set, get) => ({
  ...initialState,
  deprecateDraft: async () => {
    set({ loading: true });
    const res = await dispatch('/hitu/remote/ds/deprecate-draft', get().designId);
    set({ loading: false });

    if (res) {
      message.success('草稿删除成功');
    }
    // 重新获取一遍数据
    get().refetch();
  },
  refetch: () => {
    if (get().designId) {
      mutateKitchenSWR('/hitu/remote/ds/versions', get().designId);
    }
  },
})
```

可以明显看到，光是从代码量上 zustand 的 store 比 hooks 减少了 30% 。


## 互调带来了引用变更
更重要的是， **hooks 版本中互调带来了引用变更的问题**。
由于 `deprecateDraft` 和 `refetch` 都调用了 `designId`，这就会使得当 `designId` 发生变更时，`deprecateDraft` 和 `refetch` 的引用会发生变更，致使 react 触发刷新。这也是为什么 react 要搞一个 `useEvent` 的原因（[RFC](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freactjs%2Frfcs%2Fblob%2Fuseevent%2Ftext%2F0000-useevent.md "https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md")）。

而 zustand 则把这个问题解掉了。由于 zustand 在 create 方法中提供了 `get` 对象，使得我们可以用 get 方法直接拿到当前 store 中最新的 state 快照。这样一来，变更函数的引用始终不变，而函数本身却一直可以拿到最新的值。

在这一趴，最后一点要夸 zustand 的是，它可以直接集成 useReducer 的模式，而且直接在官网提供了[示例](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpmndrs%2Fzustand%23cant-live-without-redux-like-reducers-and-action-types "https://github.com/pmndrs/zustand#cant-live-without-redux-like-reducers-and-action-types")。这样就意味着之前在 ProEditor 中的那么多 action 可以极低成本完成迁移。

```
// columns 的 reducer 迁移
import { columnsConfigReducer } from './columns';
const createStore = create((set,get)=>({
  /**
   * 控制 Columns 的复杂数据变更方法
   */
  dispatchColumns: (payload) => {
    const { columns, internalUpdateTableConfig, updateDataByColumns } = get();
    // 旧的 useReducer 直接复用过来
    const nextColumns = columnsConfigReducer(columns, payload);
    internalUpdateTableConfig({ columns: nextColumns }, 'Columns 配置');

    updateDataByColumns(nextColumns);
  },
})
```

### ❸ 状态派生

状态派生是状态管理中一个不被那么多人提起，但是在实际场景中被大量使用的东西，只是大家没有意识到，这理应也是状态管理的一环。

状态派生可以很简单，也可以非常复杂。简单的例子，比如基于一个`name` 字段，拼接出对应的 url 。如果不考虑优化，其实都可以写一个中间的函数作为派生方法，但作为状态管理的一环，我们必须要考虑相应的优化。

在 hooks 场景下，状态派生的方法可以使用 `useMemo`，例如：

```
// hooks 写法

const App = () => {
  const [name,setName]=useState('')
  const url = useMemo(() => URL_HITU_DS_BASE(name || ''),[name])
  // ...
}
```

而 zustand 用了类似 redux selector 的方法，实现相应的状态派生，这个方式使得 useStore 的用法变得极其灵活和实用。而这种 selector 的方式使得 zustand 下细颗粒度的性能优化变为可能，且优化成本很低。

```
// zustand 的 selector 用法

// 写法1
const App = () => {
  const url = useStore( s => URL_HITU_DS_BASE(s.name || ''));
  // ...
}

// 写法2 将 selector 单独抽为函数
export const dsUrlSelector = (s) => URL_HITU_DS_BASE(s.name || '');
const App = () => {
  const url = useStore(dsUrlSelector);
  // ...
}
```

由于写法 2 可以将 selector 抽为独立函数，那么我们就可以将其拆分到独立文件来管理派生状态。由于这些 selector 都是纯函数，所以能轻松实现测试覆盖。

### ❹ 性能优化

讲完状态派生后把 zustand 的 selector 能力后，直接很顺地就能来讲讲 zustand 的性能优化了。

在裸 hooks 的状态管理下，要做性能优化得专门起一个专项来分析与实施。但基于 zustand 的 useStore 和 selector 用法，我们可以实现低成本、渐进式的性能优化。
上图中可以看到，虽然 `tabs`、`internalSetState` 没有变化，但是其中的 config 数据项（data、columns 等）发生了变化，进而使得 `TableConfig` 组件触发重渲染。
而我们的性能优化方法也很简单，只要利用 zustand 的 selector，将得到的对象聚焦到我们需要的对象，只监听这几个对象的变化即可。

```
// 性能优化方法

import shallow from 'zustand/shallow'; // zustand 提供的内置浅比较方法
import { useStore, ProTableStore } from './store'

const selector = (s: ProTableStore) => ({
  tabKey: s.tabKey,
  internalSetState: s.internalSetState,
});

const TableConfig: FC = () => {
  const { tabKey, internalSetState } = useStore(selector, shallow);
}
```

这样一来，TableConfig 的性能优化就做好了~
基于这种模式，性能优化就会变成极其简单无脑的操作，而且对于前期的功能实现的侵入性极小，代码的后续可维护性极高。
就我个人的感受上， zustand 使用 selector 来作为性能优化的思路真的很精巧，就像是给函数式的数据流加上了一点点主观意愿上的响应式能力，堪称优雅。
### ❺ 数据分形与状态组合
如果子组件能够以同样的结构，作为一个应用使用，这样的结构就是分形架构。
数据分形在状态管理里我觉得是个比较高级的概念。
但从应用上来说很简单，就是更容易拆分并组织代码，而且具有更加灵活的使用方式，如下所示是拆分代码的方式。但这种方式其实我还没大使用，所以不多展开了。

```js
import create, { StateCreator } from 'zustand'
interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}
const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

interface FishSlice {
  fishes: number
  addFish: () => void
}
const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useBoundStore = create<BearSlice & FishSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```
**我用的更多的是基于这种分形架构下的各种中间件**。由于这种分形架构，状态就具有了很灵活的组合性，例如将当前状态直接缓存到 localStorage。在 zustand 的架构下， 不用额外改造，直接加个 `persist` 中间件就好。

```
// 使用自带的 Persist Middleware

import create from 'zustand'
import {  persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>(
  persist((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
  }))
)
```

在 ProEditor 中，我使用最多的就是 `devtools` 这个中间件。这个中间件具有的功能就是：将这个 Store 和 Redux Devtools 绑定。

```
// devtools 中间件

// store 逻辑
const vanillaStore = (set,get)=> ({ 
  syncOutSource: (nextState) => {
    set({ ...get(), ...nextState }, false, `受控更新：${Object.keys(nextState).join(' ')}`);
  },
  syncOutSourceConfig: ({ config }) => {
    // ...
    set({ ...get(), ...config }, false, `受控更新：🛠 组件配置`);
    // ...
  },
}); 

const createStore = create(
  devtools(vanillaStore, { name: 'ProTableStore' })
);
```

然后我们就可以在 redux-devtools 中愉快地查看数据变更了：
可能有小伙伴会注意到，为什么我这边的状态变更还有中文名，那是因为 `devtools` 中间件为 zustand 的 set 方法，提供了一个额外参数。只要设置好相应的 set 值的最后一个变量，就可以直接在 devtools 中看到相应的变更事件名称。

正是这样强大的分形能力，我们基于社区里做的一个 [zundo](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcharkour%2Fzundo "https://github.com/charkour/zundo") 中间件，在 ProEditor 中提供了一个简易的撤销重做 的 Demo 示例。
而实现核心功能的代码就只有一行~ 😆
PS：至于一开始提到的协同能力，我在社区中也有发现中间件 [zustand-middleware-yjs](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fjoebobmiles%2Fzustand-middleware-yjs "https://github.com/joebobmiles/zustand-middleware-yjs") （不过还没尝试）。

### ❻ 多环境集成（ react 内外环境联动 ）

实际的复杂应用中，一定会存在某些不在 react 环境内的状态数据，以图表、画布、3D 场景最多。一旦要涉及到多环境下的状态管理，可以让人掉无数头发。

而 zustand 说了，不慌，我已经考虑到了，`useStore` 上直接可以拿值，是不是很贴心~

```
// 官方示例

// 1. 创建Store
const useDogStore = create(() => ({ paw: true, snout: true, fur: true }))

// 2. react 环境外直接拿值
const paw = useDogStore.getState().paw

// 3. 提供外部事件订阅
const unsub1 = useDogStore.subscribe(console.log)

// 4. react 世界外更新值
useDogStore.setState({ paw: false })

const Component = () => {
  // 5. 在 react 环境内使用
  const paw = useDogStore((state) => state.paw)
  ...
```

虽然这个场景我还没遇到，但是一想到 zustand 在这种场景下也能支持，真的是让人十分心安。
其实还有其他不太值得单独提的点，比如 zustand 在测试上也相对比较容易做，直接用 test-library/react-hooks 即可。