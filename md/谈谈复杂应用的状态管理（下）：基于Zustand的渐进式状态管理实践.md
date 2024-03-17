> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7182462103297458236?searchId=20240126153450902039BAB3C63517BA67)

> 🙋🏻‍♀️ 编者按：本文作者是蚂蚁集团体验设计师闻冰（社区称呼：空谷），本篇将从具体使用的角度来详细介绍下作者如何用 zustand 这一个状态管理库，来解决目前所遇到的所有状态管理诉求。

银弹存在吗？
------

在上篇[《为什么是 Zustand》](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Fantfe%2Ffeatured%2Fqzq6glbbgg5rhyep "https://www.yuque.com/antfe/featured/qzq6glbbgg5rhyep")中，我总结了在 ProEditor 这个重交互操作的场景下对状态管理的诉求，本篇将会从具体使用的角度来详细介绍下我是怎么用 zustand 这一个状态管理库，解决目前我所遇到的所有状态管理诉求的。

首先想从云谦老师《数据流 2022》最后的总结开始说起。

> **所以怎么选？** 没有银弹！如果站在社区开发者的角度来看。先看远程状态库是否满足需求，满足的话就无需传统数据流方案了；然后如果是非常非常简单的场景用 useState + Context，复杂点的就不建议了，因为需要自行处理渲染优化，手动把 Context 拆很细或者尝试用 use-context-selector；再看心智模型，按内部 store 或外部 store 区分选择，个人已经习惯后者，前者还在观望；如果选外部 store，无兼容性要求的场景优先用类 Valtio 基于 proxy 的方案，写入数据时更符合直觉，同时拥有全自动的渲染优化，有兼容性要求时则选 Zustand。

其实我对上述的这个决策方案并不是非常太认同，原因是状态管理会有一个重要但容易被忽略的核心需求：**在遇到更加复杂的场景时，我们能不能用当前的模式轻松地承接住？** 例如：

*   当前只是 5 个状态，但业务突然加了一坨复杂的业务需求，然后要膨胀到 15 个状态。这个时候状态还容不容易维护？性能还能保证和之前一样吗？
*   当前是 React 环境，但突然业务说要加个 canvas 图表的需求，图表又有一些配置切换功能，还是用 React ，这个时候还能愉快地共享状态么？
*   当前是个业务应用，突然某个时候业务说要把这个应用板块抽成组件供外部复用，当前的模式能不能轻松实现受控的模式改造成组件？（设想一下将语雀编辑器从应用抽取变成组件）

如果承接不住，那么就意味着推翻重写，这在我看来是不可接受的。理想的架构选型，就应该为可以预见的未来避开大部分坑，而不是遇到了再换一枪打一发。所以我自己做状态管理库决策选型的两个核心原则是：

1.  这个库本身的 DX 好不好；
2.  这个库在未来一旦要遇到复杂场景的时候，能不能用简单、低成本的方式兜住我的需求？

虽然我自己的实践有限，**但我还想说 zustand 是银弹。**

基于 Zustand 的渐进式状态管理
-------------------

最近在给 ProEditor 做 ProLayout 的可视化装配器。其中一个很重要的编辑能力就是图标的选择。而这个组件也存在一点点复杂度，刚好拿来作为 Zustand 用法的案例，可谓是 **「真 · 实战案例」**。 首先简单介绍一下图标选择器这个组件。它的核心用途就是让用户可以快速选择所需的图标。用户可以选择内置的 Ant Design 的图标，也可以使用 Iconfont 的图标。简单的演示如下：

<table><thead><tr><th><img class="" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41cec7ed82a04dbb9499f7b60efbcab2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp" style="max-height: 400px;"></th><th><img class="" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1700174e0a54eeb9551342cba6e7305~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp" style="max-height: 400px;"></th></tr></thead></table>

为了满足上述的目标，这个组件具有下述功能：

1.  展示图标列表；
2.  选择、删除图标；
3.  搜索图标；
4.  切换 antd 图标和 iconfont 图标类目；
5.  添加与删除 Iconfont 脚本（暂不准备加编辑）；
6.  切换 iconfont 脚本展示不同的 iconfont 脚本下的图标；

同时，由于这个组件需要被多个场景复用，因此它需要支持非受控模式与受控模式。同时为了提升研发效率，我也希望能用 devtools 检查相应的状态情况。

讲完基础的需求后，一起来看看这个组件是如何通过 Zustand 完整实现的。

### Step 1: store 初始化 ：State

首先拿最简单的 tabs 切换做一个组件 tabs 切换的功能。新建一个 `store.ts` 文件，然后写下如下代码：

```
import create from 'zustand';

// 注意一个小细节，建议直接将该变量直接称为 useStore
export const useStore = create(() => ({
  panelTabKey: 'antd',
})
```

在相应的组件（`PickerPanel`）中引入 `useStore` ，用 hooks 的方式即可解构获得 `panelTabKey`。而需要修改状态时，可直接使用 `useStore.setState` 即可对 `panelTabKey` 进行修改。这样， zustand 最简单的状态管理方法就完成了~

```
import { Segmented } from 'antd';

import { useStore } from '../store';

const PickerPanel = () => {
  const { panelTabKey } = useStore();

  return (
    // ...
    <Segmented
      value={panelTabKey}
      onChange={(key) => {
        useStore.setState({ panelTabKey: key });
      }}

      // 其他配置
      size={'small'}
      options={[
        { label: 'Ant Design', value: 'antd' },
        { label: 'Iconfont', value: 'iconfont' },
      ]}
      block
    />

    // ...
  );
};
```

:::info 为了续统一心智，我在这里先将 create 中声明的状态部分，都称为 **State**。 ::: 由于 zustand 默认全局单例，因此只要声明一个 useStore 即可在所有地方使用，不用在外层套一个 Context ，非常舒心。同时 `useStore` 又包含了一个 `setState` 的方法，因此在需要 React 中修改状态时，可以直接使用 `setState` 进行状态修改。 这是 zustand 的最最简单的使用方式，在场景初始化的时候，这样就能直接上手使用，非常简单，直接干掉 useStore + Context 妥妥的。

### Step 2: 状态变更方法：Action

在 Step 1 中，我们用 `setState` 来管理非常简单的状态，这些状态基本上用不着为其单独设定相应的变更功能。但是随着业务场景的复杂性增多，我们不可避免地会遇到存在一次操作需要变更多个状态的场景。 :::info 而这些具有特定功能的状态变更方法，我统一称之为 **Action**。 ::: 在图标选择器中，Action 其中之一的体现就是选择图标的操作。选择图标这个操作，除了设定当前选中的图标以外，还需要关闭 popover、清除筛选关键词（否则下次打开还是有筛选词的）。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fd22abb4164a21ae0c72bb780760e0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 因此我们首先在 store 中添加三个状态：

```
import create from 'zustand';


export const useStore = create(() => ({
  panelTabKey: 'antd',
  iconList: ...,
  
  open: false,
  filterKeywords: '',
  icon: null,
})
```

如果我们直接用 Step1 的方式，大致的写法如下：

```
import { useStore } from '../store';

const IconList = () => {
  const { iconList } = useStore();
  return (
    <div>
      {iconList.map((icon) => (
        <IconThumbnail onClick={(icon) => {
            useStore.setState({ icon, open: false, filterKeywords: undefined });
        })} />
      ))}
    </div>
  );
};
```

但此时会遇到新的问题，如果我在另外一个地方也需要使用这样一段操作逻辑时，我要写两次么？当然不，这既不利于开发，也不利于维护。 所以，在这里我们需要抽取一个 `selectIcon` 方法专门用于选择图标这个操作，相关的状态只要都写在那里即可。而这就引出了状态管理的第二步：**自定义 Action**。 在 `store.ts` 中直接声明并定义 `selectIcon` 函数，然后第一个入参改为 set，就可以在 store.ts 的方法内部直接修改状态了，代码如下所示：

```
import create from 'zustand';


// 添加第一个入参 set 
export const useStore = create((set) => ({
  panelTabKey: 'antd',
  iconList: ...,

  open: false,
  filterKeywords: '',
  icon: null,
  
  // 新增选择图标的 action
  selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined });
	},
})
```

对应在 `IconList` 中，只需引入 `selectIcon` 方法即可。

```
import { useStore } from '../store';

const IconList = () => {
  const { iconList, selectIcon } = useStore();
  return (
    <div>
      {iconList.map((icon) => (
        <IconThumbnail onClick={selectIcon} />
      ))}
    </div>
  );
};
```

另外值得一提的两个小点：

*   Action 支持 `async/await`，直接给函数方法添加 async 符号即可；
*   zustand 默认做了变量的优化，只要是从 `useStore`解构获得的函数，默认是引用不变的，也就是使用 zustand store 的函数本身并不会造成不必要的重复渲染。

### Step 3: 复杂状态派生：Selector

在 Step2 中大家应该有看到 iconList 这个状态，在上例中由于 iconList 并不是重点，因此简化了写法。但事实上在图标选择器组件中， iconList 并不是一个简简单单的状态，而是一个复合的派生状态。 在选择器组件中， iconList 首先需要基于 是 Ant Design 的 tab 或者 Iconfont 的 tabs 做原始图标数据源的进行切换，同时还需要支持相应的检索能力。而由于 Ant Design Tab 和 Iconfont 下的 list 具有不同的数据结构，因此筛选逻辑的实现也是不同的。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b91b83ef68bb47468dd35f537b0726e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 那在 zustand 的 Store 中，这个 iconList 是怎么实现的呢？在这里就要介绍 zustand 的又一个利器： **Selector** 。 此 selector 和 redux 的 selector 的理念基本上是一致的，因此如果之前了解过 zustand 的 selector， zustand 的也一样很容易理解。但从使用上来说，我认为 zustand 的 selector 更加灵活易用。 首先是定义 selector， selector 的入参是完整的 store （包含 state 和 action ），出参是目标对象。

```
import create from 'zustand';


export const useStore = create(() => ({
  // 数据源
  panelTabKey: 'antd',
  antdIconList,
  iconfontIconList,

  //...
})
                               
// 展示用户会看到 icon list
export const displayListSelector = (s: typeof useStore) => {
  // 首先判断下来自哪个数据源
  const list = s.panelTabKey === 'iconfont' ? s.iconfontIconList : s.antdIconList
  // 解构拿到 store 中的关键词
  const { filterKeywords } = s;

  // 然后做一轮筛选判断
  return list.filter((i) => {
    if (!filterKeywords) return true;

    // 根据不同的图标类型使用不同的筛选逻辑
    switch (i.type) {
      case 'antd':
      case 'internal':
        return i.componentName.toLowerCase().includes(filterKeywords.toLowerCase());

      case 'iconfont':
        return i.props.type.toLowerCase().includes(filterKeywords.toString());
    }
  });
};
```

当定义完成 selector 后，在组件层面作为 useStore 的第一个入参即可：

```
import { useStore, displayListSelector } from '../store';

const IconList = () => {
  const { selectIcon } = useStore();
  const iconList = useStore(displayListSelector);
  
  return (
    <div>
      {iconList.map((icon) => (
        <IconThumbnail onClick={selectIcon} />
      ))}
    </div>
  );
};
```

如此一来，就完成了复杂状态的派生实现。因为 useStore 可以像多个 hooks 一样进行引入，因此我们就可以利用 selector 选出自己需要的各种状态，也可以多个 selector 间进行组合，复用通用逻辑。

<table><thead><tr><th><img class="" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f47e4ea514414d59904f1650f7b1111b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp" style="width: auto; max-height: 400px;"></th><th><img class="" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c8d627f302a4539a6f2efb0399a375f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp" style="max-height: 400px;"></th></tr></thead></table>

另外，如果用 selector 选择出来的变量也属于 react 世界中的状态，因此为了避免不必要的重复渲染，可以对复杂的对象或者数组使用 isEqual 方法做比较，保证它的不变性。

```
import { useStore, displayListSelector } from '../store';
import { isEqual } from 'lodash';

const IconList = () => {
  const { selectIcon } = useStore();
  // 通过加入 isEqual 方法即可实现对 iconList 的性能优化
	const iconList = useStore(displayListSelector, isEqual);
  
  return (
    <div>
      {iconList.map((icon) => (
        <IconThumbnail onClick={selectIcon} />
      ))}
    </div>
  );
};
```

最后，由于 selector 本身的定义只是个纯函数，也能非常方便地集成单元测试。

### Step 4: 结构组织与类型定义

经过一部分功能开发，一开始简单的 `store.ts` 文件开始变得很长了，同时估计也开始遇到类型定义不准确或找不到的情况了。那这对于后续项目的规模化发展非常不利，是时候做一次组织与整理了。

```
import create from 'zustand';


// 添加第一个入参 set 
export const useStore = create((set) => ({
  panelTabKey: 'antd',
  iconList: ...,
  antdIconList,

  open: false,
  filterKeywords: '',
  icon: null,


  iconfontScripts: [],
  iconfontIconList: [],
  onIconChange: null,
  
  // 新增选择图标方法
  selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined });
	},
  // 移除图标方法
  resetIcon: () => {
    set({ icon: undefined });
  },

  addSript:()=>{ /*...*/ },
  updateScripts:()=>{ /*...*/ },
  removeScripts:()=>{ /*...*/ },
  selectScript:async (url)=>{ /*...*/ }
  // ...
})

// 展示用户会看到 icon list
export const displayListSelector = (s: typeof useStore) => {
  // 首先判断下来自哪个数据源
  const list = s.panelTabKey === 'iconfont' ? s.iconfontIconList : s.antdIconList
  // 解构拿到 store 中的关键词
  const { filterKeywords } = s;

  // 然后做一轮筛选判断
  return list.filter((i) => {
    if (!filterKeywords) return true;

    // 根据不同的图标类型使用不同的筛选逻辑
    switch (i.type) {
      case 'antd':
      case 'internal':
        return i.componentName.toLowerCase().includes(filterKeywords.toLowerCase());

      case 'iconfont':
        return i.props.type.toLowerCase().includes(filterKeywords.toString());
    }
  });
};
```

所以在我建议在 Step4 开始，就要对 Zustand 的 Store 进行更加合理地划分。 首先是从 `store.ts` 重构为 `store` 文件夹，目录结构如下：

```
./store
├── createStore.ts        // Action 与 store
├── selectors.ts          // 状态派生
├── initialState.ts       // State 类型定义与 初始状态
└── index.ts
```

如此划分的依据本质上还是基于 State、Action 与 Selector 的三者切分：

*   `initialState.ts`：负责 State —— 添加状态类型与初始化状态值；
*   `createStore.ts`： 负责书写创建 Store 的方法与 Action 方法；
*   `selectors.ts`： 负责 Selector ——派生类选择器逻辑；

首先来看看 `initialState` ，这个文件中主要用于定于并导出后续在 Store 所有需要的状态。导出的部分包含两个： `State` 类型定义与 初始状态 `initialState`。将 State 和 initialState 定义在一个文件中会有一个好处：类型跳转会直接指向到这里，方便添加类型与类型的初始值。 由于 state 单独新建了一个文件，因此哪怕后续状态再多，也能在这一个文件中看得清清楚楚。

```
import type { ExternalScripts, IconfontIcon, IconUnit, ReactIcon } from '../types';
import { antdIconList } from '../contents/antdIcons';

export interface State {
  iconfontScripts: ExternalScripts[];
  icon?: IconUnit;
  showEditor: boolean;

  open: boolean;
  panelTabKey: 'antd' | 'iconfont';
  filterKeywords?: string;

  activeIconfontScript?: string;
  antdIconList: ReactIcon[];
  iconfontIconList: IconfontIcon[];
}

export const initialState: State = {
  open: false,
  showEditor: false,
  panelTabKey: 'antd',
  filterKeywords: '',
  antdIconList,

  iconfontScripts: [],
  iconfontIconList: [],
  onIconChange: null,
};
```

再来看看 `createStore` ，这个文件由于包含了 Action 和 Store，会稍显复杂一点，但是核心逻辑还是比较简单的。

```
import create from 'zustand';

import type { State } from './initialState';
import { initialState } from './initialState';

interface Action {
  resetIcon: () => void;
  togglePanel: () => void;
  selectIcon: (icon: IconUnit) => void;
  removeScripts: (url: string) => void;
  selectScript: (url: string) => void;
  toggleEditor: (visible: boolean) => void;
  addScript: (script: ExternalScripts) => void;
  updateScripts: (scripts: ExternalScripts[]) => void;
}

export type Store = State & Action;

export const useStore = create<Store>((set, get) => ({
  ...initialState,

  resetIcon: () => {
    set({ icon: undefined });
  },

  selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined });
  },

  addSript:()=>{ /*...*/ },
  updateScripts:()=>{ /*...*/ },
  removeScripts:()=>{ /*...*/ },
  selectScript:async (url)=>{ /*...*/ }
}));
```

它做了这么几件事：

1.  定义了 store 中 Action 的类型，然后将 State 和 Action 合并为 Store 类型，并**导出了 Store 的类型**（比较重要）；
2.  给 create 方法添加了 Store 的类型，让 store 内部识别到自己这个 store 包含了哪些方法；
3.  将 `initialState` 解构导入 store（原来定义 state 的部分已经抽出去到 initialState 里了）；
4.  在 useStore 里逐一实现 Action 中定义的方法；

所以将从 `store.ts` 重构到 `createStore.ts` ，基本上只有补充类型定义的工作量。

接下来再看下 selectors，这个文件很简单，只需要导入 Store 的类型，然后逐一导出相应的 selector 即可。

```
import type { Store } from './createStore';
import type { IconUnit } from '../types';

export const isEmptyIconfontScripts = (s: Store) => s.iconfontScripts.length === 0;

export const selectedListSelector = (s: Store): IconUnit[] =>
  s.panelTabKey === 'iconfont' ? s.iconfontIconList : s.antdIconList;

export const isEmptyIconListSelector = (s: Store) => selectedListSelector(s).length === 0;

export const displayListSelector = (s: Store) => {
  const list = selectedListSelector(s);
  const { filterKeywords } = s;

  return list.filter((i) => {
    if (!filterKeywords) return true;

    switch (i.type) {
      case 'antd':
      case 'internal':
        return i.componentName.toLowerCase().includes(filterKeywords.toLowerCase());

      case 'iconfont':
        return i.props.type.toLowerCase().includes(filterKeywords.toString());
    }
  });
};
```

最后在 `index.ts` 中输出相应的方法和类型即可：

```
export { useStore } from './createStore';
export type { Store } from './createStore';
export type { State } from './initialState';
export * from './selectors';
```

如此一来，我们通过 将 store.ts 单一职责的文件，拆分成各司其职的多个文件后，就初步解决了接下来可能的状态大量扩展的问题与类型定义不准确的问题，基本上可以保证项目的可维护性。

### Step 5: 复杂 Action 交互：get()

Step1~Step3 可能在很大程度上就能满足大部分场景的状态管理诉求，从 Step4 开始，其实意味着状态管理的复杂性开始上升，因此 Step4 也是为了驾驭复杂性而做的一个铺垫。 在图标选择器这个组件中，ant design 的图标选择部分并没有太复杂的逻辑，最复杂的部分也只是关键词搜索的展示。但 iconfont 部分的图标不同，这一部分由于存在用户的输入和多个数据源的配置、切换，复杂性是急剧上升的。 譬如存在的展示状态就有：空数据 、空数据但要添加数据源、有数据未选中态、有数据选中态等总共 7 种状态。所以在状态管理的复杂性也是急剧上升。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be55f2cf600140dbbc950d183170191c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

那 zustand 如何做到有效地收敛这些操作呢？核心思路就是基于用户行为分层拆解一级承接的 Action ，最后在多个方法的基础上统一抽取原子操作 Action。 ![](https://intranetproxy.alipay.com/skylark/lark/0/2022/jpeg/300581/1663154055965-6151fe6c-8002-419e-a1c9-26880aa93293.jpeg) 首先是要识别用户操作维度上的行为，在 Iconfont 这个场景下，用户的行为有三类：**添加数据源**、**选择数据源**和 **移除数据源**。

*   先来看「添加数据源」 ：用户感知到的添加数据源这个行为看起来简单，但在数据流上其实包含四个步骤：❶ 显示表单 -> ❷ 将数据源添加到数据源数组中 -> ❸ 隐藏表单 -> ❹ 选中添加的数据源。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c260c2fe9af444c2a1650e35420c055c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   再来看「选择数据源」：选择数据源就是当用户存在多个 Iconfont 图标源的时候，用户可以按自己的诉求切换不同的 Iconfont 数据源；

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dfe673c495b4506ac6db7b6b2dde499~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

*   最后再看下「移除数据源」：移除数据源看似很简单，但是其实也存在坑。即：移除当前选中的数据源时，怎么处理选中态的逻辑？基于良好的用户体验考虑，我们会自动帮用户切换一个选中的数据源。但这里就会有边界问题：如果删除的数据源第一个，那么应该往后选择，如果删除的是最后一个数据源，那么应该往前选择。 | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f61149c5ea24886858240b0f5c1f4cc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee3f6b651bbd47cea239d1d5ac51d897~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) | | --- | --- |

那这样的功能从数据流来看，移除数据源会包含三个阶段：❶ 从数据源数组中移除相应项 -> ❷ 决策需要选中哪个数据源 -> ❸ 选中相应的数据源。

基于上述的分析，我们可以发现三层方法会存在一些重复的部分，主要是对数据源数组的更新与设定激活数据源。所以相应的 Action 可以拆解如下： ![](https://intranetproxy.alipay.com/skylark/lark/0/2022/jpeg/300581/1663211683067-cbad1fb7-9e8e-405e-b1df-0ef09263d649.jpeg) 所以我们在 store 中定义这些这些方法：

```
import create from 'zustand';

import type { State } from './initialState';
import { initialState } from './initialState';

interface Action {
  /* 一级 action */
  addScript: (script: ExternalScripts) => void;
  removeScripts: (url: string) => void;
  selectScript: (url: string) => void;

  /* 原子操作 action */
  updateScripts: (scripts: ExternalScripts[]) => void;
  toggleForm: (visible: boolean) => void;
}

export type Store = State & Action;
```

来看下具体的实现，在 zustand 中能实现上述架构的核心能力在于一个 `get()` 方法，能从自身中拿到所有的状态（State & Action）。

```
// ...

export type Store = State & Action;

// create 函数的第二个参数 get 方法
export const useStore = create<Store>((set, get) => ({
  ...initialState,

  // 用户行为 action // 

  addScript: (script) => {
    // 从 get() 中就可以拿到这个 store 的所有的状态与方法
    const { selectScript, iconfontScripts, updateScripts, toggleForm } = get();

    // 1. 隐藏 Form
    toggleForm(false);
    
    // 2. 更新数据源
    updateScripts(
      produce(iconfontScripts, (draft) => {
        if (!draft.find((i) => i.url === script.url)) {
          draft.push(script);
        }
      }),
    );
    
		// 3. 选择脚本
    selectScript(script.url);
  },
  removeScripts:(url)=>{
    const { iconfontScripts, selectScript, updateScripts } = get();

    const nextIconfontScripts = iconfontScripts.filter((i) => i.url !== url);

    // 找到临近的图标库并选中

    const currentIndex = iconfontScripts.findIndex((i) => i.url === url);

    const nextIndex =
      currentIndex === 0
        ? 0
        : nextIconfontScripts.length <= currentIndex + 1
        ? currentIndex - 1
        : currentIndex;

    const nextScript = nextIconfontScripts[nextIndex]?.url;

    updateScripts(nextIconfontScripts);

    selectScript(nextScript);
  },

  
  // 原子操作方法 // 

  toggleForm: (visible) => {
    set((s) => ({ ...s, showForm: typeof visible === 'undefined' ? !s.showForm : visible }));
  },
	selectScript:async (url)=>{ 
    // 如果没有 url ，就说明是取消选择
    if (!url) {
        set({ activeIconfontScript: '', iconfontIconList: [] });
        return;
      }

    // 2. 一个异步方法获取脚本中的图标列表
    const iconfontList = await fetchIconList(url);
    
    // 3. 设定选中后的数据更新
    set({
      activeIconfontScript: url,
      iconfontIconList: iconfontList.map((i) => ({
        type: 'iconfont',
        componentName: iconfontScripts.name,
        scriptUrl: url,
        props: { type: i },
      })),
    });
	},
  updateScripts: (scripts) => {
    const { iconfontScripts } = get();

    if (isEqual(iconfontScripts, scripts)) return;
    set({ iconfontScripts: scripts });
  },
}));
```

当完成相应的功能实现后，只需要在相应的触发入口中添加方法即可。

```
const IconfontScripts: FC = memo(() => {
  const {
    iconfontScripts,
    showForm,
    activeIconfontScript,
    removeScripts,
    selectScript,
    toggleEditor,
  } = useStore();
  const isEmptyScripts = useStore(isEmptyIconfontScripts);

  return (
    <Flexbox gap={8}>     
      <Flexbox gap={4} horizontal>
        {showForm ? (
          <ActionIcon onClick={() => toggleEditor(false)} icon={<UpOutlined />} />
        ) : (
          <Tag
            onClick={() => {
              toggleEditor(true);
            }}
          >
            <PlusOutlined /> 添加
          </Tag>
        )}
        <Flexbox horizontal>
          {iconfontScripts.map((s) => {
            const checked = s.url === activeIconfontScript;

            return (
              <Tag
                onClose={() => {
                  removeScripts(s.url);
                }}
                onClick={() => {
                  selectScript(checked ? '' : s.url);
                }}
              >
                {s.name}
              </Tag>
            );
          })}
        </Flexbox>
      </Flexbox>
      {showForm ? <ScriptEditor /> : null}
    </Flexbox>
  );
});

export default IconfontScripts;
```

基于这样的一种模式，哪怕是这样一个复杂的组件，在实现层面的研发心智仍然非常简单：

*   React 层面仍然只是一个渲染层；
*   复杂的状态逻辑仍然以 hooks 式的模式进行引入；
*   复杂的入口方法通过拆分子 Action 进行组合与复用；

而且我们在 Step2 中已经知道，在这种模式下，所有的 Action 都是默认不需要包 useCallback 的~

### Step 6: 从应用迈向组件：Context 与 StoreUpdater

不知道有没有小伙伴从 Step1 开始就在纳闷，你不是说这是个组件吗？为啥一直没提受控模式呢？在你这个模式下，不是就变成全局单例了么？怎么搞成组件？那这一步不就来了么，就让我们来看看在 zustand 模式下，一个已经略显复杂的应用，如何轻轻松松变成一个受控的业务组件。 因为 zustand 是默认全局单例，所以如果需要变成组件，那么一定需要使用 Context 来隔离多个实例。而 这其中的关键，就是 zustand 提供的 `createContext` 方法。 这个改造分为四步： ![](https://intranetproxy.alipay.com/skylark/lark/0/2022/jpeg/300581/1663168504057-5bff8704-3169-4f32-89cd-4374d1538a9e.jpeg) 第一步： **创建 Context 并添加 Provider** 先在 `createStore.ts` 下

```
import create from 'zustand';
import createContext from 'zustand/context';
import type { StoreApi } from 'zustand';

import type { State } from './initialState';
import { initialState } from './initialState';

interface Action {
  // *** /
}

export type Store = State & Action;

// 将 useStore 改为 createStore， 并把它改为 create 方法
export const createStore = ()=> create<Store>((set, get) => ({
  ...initialState,

  resetIcon: () => {
    set({ icon: undefined });
  },

  selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined });
  },

  addSript:()=>{ /*...*/ },
  updateScripts:()=>{ /*...*/ },
  removeScripts:()=>{ /*...*/ },
  selectScript:async (url)=>{ /*...*/ }
}));

// 新建并导出一下 Provider、useStore、useStoreApi 三个对象
export const { Provider, useStore, useStoreApi } = createContext<StoreApi<Store>>();
```

```
import type { FC } from 'react';
import React, { memo } from 'react';
import App from './App';

import { Provider, createStore } from '../store';

type IconPickerProps = StoreUpdaterProps;

const IconPicker: FC<IconPickerProps> = (props) => {
  return (
    <Provider createStore={createStore}>
      <App /> /* <- 这个App就是之前的引用入口 */
    </Provider>
  );
};
export default memo(IconPicker);
```

第二步：** 创建并添加受控更新组件 **`**StoreUpdater**`** **

首先在组件入口处添加 `StoreUpdater` 组件。

```
import type { FC } from 'react';
import React, { memo } from 'react';
import App from './App';
import StoreUpdater from './StoreUpdater';
import type { StoreUpdaterProps } from './StoreUpdater';

import { Provider, createStore } from '../store';

type IconPickerProps = StoreUpdaterProps;
const IconPicker: FC<IconPickerProps> = (props) => {
  return (
    <Provider createStore={createStore}>
      <App />
      <StoreUpdater {...props} />
    </Provider>
  );
};
export default memo(IconPicker);
```

那 StoreUpdater 具体是干什么的？ 看下面这张图，我想大家就懂了。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d90dd8cd1b24580a67bd710e1717cd8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 简单来说，就是通过 `StoreUpdater` 这个组件，做到外部 props 和内部状态的隔离。这样一来，当没有外部 props 时，我们直接可以把这个 App 当成普通应用。而当有外部的 props 时，可以通过 `StoreUpdater` 实现外部状态的受控。利用这样的思想，我们就可以很简单地把一个 App 改造成受控的业务组件。这种架构模式，也称为「分形架构」。

> 如果子组件能够以同样的结构，作为一个应用使用，这样的结构就是分形架构。在分形架构下，每个应用都可以变成组件，被更大的应用合并消费。

具体来看看代码：

```
import type { FC } from 'react';

import type { State } from '../store';
import type { IconUnit, ExternalScripts } from '../types';

import { useStoreApi } from '../store';


/**
 * 更新方法
 */
export const useStoreUpdater =
  (key: keyof T, value: any, deps = [value], updater?) => {
    const store = useStoreApi();

    useEffect(() => {
      if (typeof value !== 'undefined') {
        store.setState({ [key]: value });
      }
    }, deps);
  };


export interface StoreUpdaterProps
  extends Partial<Pick<
      State, | 'icon' | 'onIconChange' | 'iconfontScripts' | 'onIconfontScriptsChange'
    >
  > {
  defaultIcon?: IconUnit;
  defaultIconfontScripts?: ExternalScripts[];
  defaultActiveScripts?: ExternalScripts[];
}

const StoreUpdater: FC<StoreUpdaterProps> = ({
  icon,
  defaultIcon,
  iconfontScripts,
  
  defaultIconfontScripts,
  onIconChange,
  onIconfontScriptsChange,
}) => {
  useStoreUpdater('icon', defaultIcon, []);
  useStoreUpdater('icon', icon);
  useStoreUpdater('onIconChange', onIconChange);

  useStoreUpdater('iconfontScripts', iconfontScripts);
  useStoreUpdater('iconfontScripts', defaultIconfontScripts, []);
  useStoreUpdater('onIconfontScriptsChange', onIconfontScriptsChange);

  return null;
};
export default StoreUpdater;
```

在 `StoreUpdater` 这个组件中，核心分为三个部分：

*   `useStoreUpdater` ：将外部的 props 同步到 store 内部的方法；
*   `StoreUpdaterProps`：从 store 的 State 中 pick 出需要受控的状态，并相应补充 defaultXX 的 props；
*   `StoreUpdater`：逐一补充调用外部组件 props 的受控状态，将外部 props 更新到 store 的内部状态中；

针对受控组件来说，要实现一个状态 props 的受控，一定会有的孪生的两个 props。例如一个 props 叫 value ，一定会有一个 defaultValue 和一个 onValueChange，才能满足所有和这个 value 相关的场景诉求。因此我在 `StoreUpdater` 中是也完全基于这个规则书写受控代码。不过这里有个很有意思的点：**就是在受控模式下，把 onChange 也当成 store 的自持的状态去思考**。所有的 onChange 类方法，只有两种状态 `null` 和 `function`。 这样就能在 store 内部很轻松地完成受控方法的集成。

而 zustand 在这个过程中发挥最关键一点的 hooks 叫做 `useStoreApi`。这个 props 可能大家在 Step1~ Step5 中都没看到过，因为这个 hooks 只在 context 的场景下出现。它的功能就是获得相应 `Context` 下的 `useStore` 方法。如果直接使用 `useStore`，那么是获得不到挂在在 useStore 上的变量的。 大家是否还记得 Step1 中的 `useStore.setState({ ... })`这个方法？它在这个场景下发挥了巨大的作用，大大减少了更新受控 props 的代码量。这是我们需要在这里使用 `useStoreApi` 的原因。

这一步写完之后，组件接受外部 props ，并受控的部分就完成了。最后就只剩内部状态变更需要 onChange 出来了。

第三步：**在相应的 Action 里添加 onChange 方法** 在第二步中看到，我们需要在 Store 的 State 中把 onChange 方法作为状态自持，因此在 initalState 文件中，就需要补充相应的类型定义和初始值：

```
import type { ExternalScripts, IconfontIcon, IconUnit, ReactIcon } from '../types';
import { antdIconList } from '../contents/antdIcons';

export interface State {
  iconfontScripts: ExternalScripts[];
  icon?: IconUnit;
  showForm: boolean;
  /**
   * 开启面板
   */
  open: boolean;
  panelTabKey: 'antd' | 'iconfont';

  filterKeywords?: string;

  activeIconfontScript?: string;
  antdIconList: ReactIcon[];
  iconfontIconList: IconfontIcon[];

  // 外部状态
  onIconChange?: (icon: IconUnit) => void;
  onIconfontScriptsChange?: (iconfontScripts: ExternalScripts[]) => void;
}

export const initialState: State = {
  open: false,
  showForm: false,
  panelTabKey: 'antd',
  filterKeywords: '',
  antdIconList,

  iconfontScripts: [],
  iconfontIconList: [],
  
  onIconChange: null,
  onIconfontScriptsChange: null
};
```

而因为我们在 Step5 中通过收敛了一些原子级的 Action，基本做到了一个 State 有一个对应的 Action，因此只需要相应的 Action 处添加受控更新的 onChange 方法即可。

```
// ...

export type Store = State & Action;

export const createStore = ()=> create<Store>((set, get) => ({
  ...initialState,

    selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined });
    
    // 受控更新 icon
    get().onIconChange?.(icon);
  },
  // 用户行为 action // 

  addScript: (script) => {
    // 从 get() 中就可以拿到这个 store 的所有的状态与方法
    const { selectScript, iconfontScripts, updateScripts, toggleForm } = get();

    // 1. 隐藏 Form
    toggleForm(false);
    
    // 2. 更新数据源
    updateScripts(
      produce(iconfontScripts, (draft) => {
        if (!draft.find((i) => i.url === script.url)) {
          draft.push(script);
        }
      }),
    );
    
		// 3. 选择脚本
    selectScript(script.url);
  },
  removeScripts:(url)=>{
    const { iconfontScripts, selectScript, updateScripts } = get();

    const nextIconfontScripts = iconfontScripts.filter((i) => i.url !== url);

    // 找到临近的图标库并选中

    const currentIndex = iconfontScripts.findIndex((i) => i.url === url);

    const nextIndex =
      currentIndex === 0
        ? 0
        : nextIconfontScripts.length <= currentIndex + 1
        ? currentIndex - 1
        : currentIndex;

    const nextScript = nextIconfontScripts[nextIndex]?.url;

    updateScripts(nextIconfontScripts);

    selectScript(nextScript);
  },

  
  // 原子操作方法 // 

  toggleForm: (visible) => {
    set((s) => ({ ...s, showForm: typeof visible === 'undefined' ? !s.showForm : visible }));
  },
	selectScript:async (url)=>{ 
    // 如果没有 url ，就说明是取消选择
    if (!url) {
        set({ activeIconfontScript: '', iconfontIconList: [] });
        return;
      }

    // 2. 一个异步方法获取脚本中的图标列表
    const iconfontList = await fetchIconList(url);
    
    // 3. 设定选中后的数据更新
    set({
      activeIconfontScript: url,
      iconfontIconList: iconfontList.map((i) => ({
        type: 'iconfont',
        componentName: iconfontScripts.name,
        scriptUrl: url,
        props: { type: i },
      })),
    });
	},
  updateScripts: (scripts) => {
    const { iconfontScripts } = get();

    if (isEqual(iconfontScripts, scripts)) return;
    set({ iconfontScripts: scripts });

    // 受控更新 IconfontScripts
    get().onIconfontScriptsChange?.(scripts);
  },
}));
```

如此一来，组件的受控就完成了。

（可选）第四步：**查找 useStore.setState 用法，补充 useStoreApi** 如果有一些状态非常简单，从写下的一开始就始终是 `useStore.setState` 的写法，那么这些写法在组件化之后需要做一点点小调整。因为 useStore 是完全来自于 context 下的 useStore，因此会丢失 setState 的相关方法。因此需要额外引入 `useStoreApi` ，并用 storeApi 来实施 setState。这可能算是算 zustand 从应用迁移到组件的一点点小瑕疵。

```
import { useStore, useStoreApi } from '../store';

const IconList = () => {
  const { iconList } = useStore();
  
  const storeApi = useStoreApi()
  
  return (
    <div>
      {iconList.map((icon) => (
        <IconThumbnail onClick={(icon) => {
            storeApi.setState({ icon, open: false, filterKeywords: undefined });
        })} />
      ))}
    </div>
  );
};
```

不过如果是真正的复杂应用，经历过 Step1~Step5 之后，估计大部分状态变更都会收敛到 Store 中，因此如果需要修改 setState 的部分，在我实际使用下来并不算太多。 最后来看下这样的一个效果： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78ca23af783940378b60103f13336ff8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到，基于 zustand 的这样的开发模式，一个业务应用可以非常简单地迁移成为一个受控的业务组件，且任何一个需要对外暴露的数据源，都可以非常轻松地做到受控。而这是我认为 zustand 作为状态管理库极其好用的一点。

PS：这个 `StoreUpdater` 的用法我也是翻了 react-flow 才了解到的。它的 `StoreUpdater` 比我这个组件可是多多了。而这样的 props，使得 react-flow 这个复杂组件的灵活度和可玩性得到了保障。（有兴趣的同学可以看看它的源码 [传送门 ->](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fwbkd%2Freact-flow%2Fblob%2Fmain%2Fsrc%2Fcomponents%2FStoreUpdater%2Findex.tsx "https://github.com/wbkd/react-flow/blob/main/src/components/StoreUpdater/index.tsx")）

### Step 7: 性能优化：又是 selector ?

作为一个制作精良的组件，性能上一定不能拉胯。因此我们需要来做下优化了。最近云谦老师写了篇《关于 React Re-Render》，可以看到如果要裸写 hooks 做性能优化，得学习一堆基础知识和踩一堆坑，最后代码里一坨一坨的 useXXX，心智负担非常重。那在 zustand 中怎么做性能优化呢？

首先，在 Step2 中我们已经知道，所有 zustand 的 action 都默认不会造成重复渲染，因此，理论上只有 state 会造成重复渲染。我们来看下实际情况。 首先我使用 `useWhyDidYouUpdate` 的 hooks 来检查并确认 PickerPanel 组件的 state 和 action 是否会会发变化，从下图中可以看到，无论是 resetIcon 还是还是 storeApi ，它们的引用在其他状态变化下，都保持不变，没有造成重复渲染。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54c128a24240489db12d9c3ca1d86735~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 但在上图中我们可以看到一个挺诡异的现象。就是明明 `useWhyDidYouUpdate` 已经包含了所有的该组件使用的状态，在修改搜索关键词时，State 都没有变化，但是 Segment 那部分却可以看到有重复渲染。那这是为什么？ 我们来改一下，写法，将 store 从单独定义为一个变量，然后用 `useWhyDidYouUpdate` 来检查变更，可以看到下面这样的情况： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba481e21b8ab4248bc93b1cd2b9889d5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 即当关键词 state 修改了，就会造成 store 的变化。而 store 的变化就会触发当前这个界面的重新渲染。哎？那这个不就是和 context 一模一样了么？对，你想的没错， zustand 并不像 valtio 这样会自动收集依赖，并做性能优化。 所以我们是需要手动搞一轮优化的。那咋搞呢？思路上其实也非常简单：既然我在 PickerPanel 这个组件中只关心`{ panelTabKey, icon, resetIcon }` 这几个状态，那我「手动」做一个依赖收集不就好了么？那怎么手动做呢？ 还记得 step2 中的 selector 吗？又轮到它出场了。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ca469e39c5d40b29b0067fca3f7d682~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 只需要利用 zustand 的 useStore 的 selector 能力，配合 zustand 默认提供的 `shallow` 浅比较能力。我们就能实现「人工的依赖收集」。如此一来，性能优化也就做好了。 我们来看看优化前和优化后的代码区别：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85a3b7d64c4e4ec98b7044fa23ad4537~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a2900129c74418cbf3f4820dbe57992~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

可以看到，除了多一个几乎一样的 selector 和一个 shallow，其他代码没有任何区别，但是性能优化就是这么做好了。 那这是基于 zustand selector 的写法可以做到的渐进式性能优化。「需要优化？加个 selector 就好~」这样的研发心智，可以让业务开发有很多选择，譬如：

*   前期撒开来默认解构 useStore，不必担心未来的性能优化难题。等发现某些地方真的需要优化时，相应的套上 selector 就好；
*   反正只是加个 selector，也可以写完应用定型后也可以顺手加一下；
*   既然 selector 可以做优化，那我干脆全部都直接 `const x = useStore(s=>s.x)`，这样引入好，也直接优化完了。

### Step 8: 研发增强：Devtools

当 Store 复杂度到现在这样之后，接下来每一步 debug 都有可能变得比较麻烦，因此我们可以集成一下 devtools，将 Store 研发模式变得更加可视化，做到可控。

而写法也非常简单，只需在 create 方法下包一个 devtools 即可，并在 create 后多一个 () 执行。

```
// ...
import { devtools } from 'zustand/middleware';

export type Store = State & Action;

// 多一个函数执行，然后包裹 devtools
export const createStore = ()=> create<Store>()(devtools((set, get) => ({
  ...initialState,

  // ... action
  
}),{ name: 'IconPicker' }));
```

如此一来，我们就能够使用 redux-dev-tools 可视化地查看 IconPicker 的数据流了。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1473f992c81f49c5ba55d05f9389f912~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 不过大家可能会发现，这个时候每一次的数据变更，都是是 anoymous 的变更说明，那有没有可能让每条变更都更加语义化呢？可以！

只需在 set 方法的第三个参数中添加更新说明文本，就可以让 devtools 识别到这项状态变更。

```
// ...
import ""

export type Store = State & Action;

// 多一个函数执行，然后包裹 devtools
export const createStore = ()=> create<Store>()(devtools((set, get) => ({
  ...initialState,

  // ... action
  selectIcon: (icon) => {
    set({ icon, open: false, filterKeywords: undefined },false, "选择 Icon");
  
    get().onIconChange?.(icon);
  },
}),{ name: 'IconPicker' }));
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d1db2c98f8b4c099c3b65eb679933c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

基于这样的写法，我们甚至可以畅享一个面向用户的历史记录能力~

还有吗？
----

写完上面 Step1~Step 8，基本上绝大多数状态管理的需求就都能满足了。但在一些各种边界条件与复杂场景下，一定还是会有各种奇奇怪怪的诉求的。所以我在这里再列了一些自己 zustand 的其他用法，但不再细讲：

*   集成 redux reducer 或 react useReducer 的写法；
*   觉得事件处理麻烦，需要借用 rxjs 简化事件流处理；
*   需要结合一些请求库，比如 swr 的使用方式，将 hooks 集成到 store 中；
*   结合 persist 做本地数据缓存的方式；
*   结合社区库 zundo 简单实现的一个历史记录功能；
*   利用 subscribe 监听状态变更，自动更新内部状态；
*   单一 store 的切片化；
*   集成一些复杂三方库（例如 y-js）；

写到这里，就基本上把这大半年所有基于 zustand 的状态管理经验写完了。希望对大家做状态管理的相关决策有些帮助吧~