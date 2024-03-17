

Vuex是一个程序里面的**状态管理模式**，它是**集中式**存储**所有**组件的状态的小仓库，并且保持我们存储的状态以一种**可以预测**的方式发生变化。

第一步，了解 Vuex
===========

### 🤯 想象一个场景
如果你的项目里有很多页面（组件 / 视图），页面之间存在多级的嵌套关系，此时，这些页面假如都需要共享一个状态的时候，此时就会产生以下两个问题：
*   多个视图依赖同一个状态
*   来自不同视图的行为需要变更同一个状态

*   对于第一个问题，
	* 假如是多级嵌套关系，你可以使用父子组件传参进行解决，虽有些麻烦，但好在可以解决；
	* 对于兄弟组件或者关系更复杂组件之间，就很难办了，等项目做大了，代码就会变成屎山，实在令人心烦。
*   对于第二个问题，你可以通过父子组件直接引用，或者通过事件来变更或者同步状态的多份拷贝，这种模式很脆弱，往往使得代码难以维护，而且同样会让代码变成屎山。

### 😇 换一种思路呢：

*   把各个组件都需要依赖的同一个状态抽取出来，在全局使用单例模式进行管理。
*   在这种模式下，任何组件都可以直接访问到这个状态，或者当状态发生改变时，所有的组件都获得更新。

 这时候，Vuex 诞生了！
- 这就是 Vuex 背后的基本思想，借鉴了 Flux、Redux。
- 与其他模式不同的是，Vuex 是专门为 Vue 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。

### 🤩 什么时候应该用 vuex 呢？
*   假如你的项目达到了中大型应用的规模，此时您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。

第二步 使用 vuex
======

- 安装`npm install vuex --save`
- 配置 vuex：创建src/store/index.js
- 修改 main.js：
- 修改 App.vue：
- 启动项目`npm run dev`

配置 vuex：
- 创建src/store/index.js
- 使用 Vue.use方法，
- 使用Vue.Store方法构造实例
Vue.Store方法的构造函数
	{state:xxx}
```
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    name: '张三',
    number: 0,
    list: [
      { id: 1, name: '111' },
      { id: 2, name: '222' },
      { id: 3, name: '333' },
    ],
  },
});

export default store;
```

- 修改 main.js： 引入前面导出的store对象，添加到 Vue 的构造函数里

```
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store'; // 引入我们前面导出的store对象

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store, // 把store对象添加到vue实例上
  components: { App },
  template: '<App/>',
});

```

- 最后修改 App.vue：使用this.$store.state.XXX可以直接访问到仓库中的状态

```
<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    // 使用this.$store.state.XXX可以直接访问到仓库中的状态
    console.log(this.$store.state.name);
  },
};
</script>

```

- 启动项目`npm run dev`，即可在控制台输出刚才我们定义在 store 中的 name 的值。

## 使用建议

*   🤖 官方建议 1： 操作 this.$store.state.XXX 最好放在计算属性中，就像这样：

```
export default {
  mounted() {
    console.log(this.getName);
  },
  computed: {
    getName() {
      return this.$store.state.name;
    },
  },
};
```

*   🤖 官方建议 2： 是不是每次都写 this.$store.state.XXX 让你感到厌烦，有解决方案，就像下面这样：

```
<script>
import { mapState } from 'vuex'; // 从vuex中导入mapState
export default {
  mounted() {
    console.log(this.name);
  },
  computed: {
    ...mapState(['name']), // 经过解构后，自动就添加到了计算属性中，此时就可以直接像访问计算属性一样访问它
  },
};
</script>

```

你甚至可以在解构的时候给它赋别名，取外号，就像这样：

```
...mapState({ aliasName: 'name' }),  // 赋别名的话，这里接收对象，而不是数组
```


第三步，了解修饰器：Getter
================
*   🤨 设想一个场景，产品经理：所有的 name 前面都要加上 “hello”！

我们可以直接在 store 中对 name 进行一些操作或者加工，从源头解决问题！

## Getter使用
- 在 store 对象中增加 getters 属性
- 在组件中把 state 更改为 getter

在 store 对象中增加 getters 属性
```
const store = new Vuex.Store({
  state: {
    name: '张三',
    number: 0,
    list: [
      { id: 1, name: '111' },
      { id: 2, name: '222' },
      { id: 3, name: '333' },
    ],
  },
  // 在store对象中增加getters属性
  getters: {
    getMessage(state) {
      // 获取修饰后的name，第一个参数state为必要参数，必须写在形参上
      return `hello${state.name}`;
    },
  },
});

export default store;
```

在组件中使用：

```
export default {
  mounted() {
    // 注意不是$store.state了，而是$store.getters
    console.log(this.$store.state.name);
    console.log(this.$store.getters.getMessage);
  },
};
```

## Getter官方建议
🤖 官方建议： 是不是每次都写 this.$store.getters.XXX 让你感到厌烦，官方建议我们可以使用 mapGetters 去解构到计算属性中，就像使用 mapState 一样，就可以直接使用 this 调用了，就像下面这样：

```
<script>
import { mapState, mapGetters } from 'vuex';
export default {
  mounted() {
    console.log(this.name);
    console.log(this.getMessage);
  },
  computed: {
    ...mapState(['name']),
    ...mapGetters(['getMessage']),
  },
};
</script>

```

和 mapState 一样你也可以取别名，取外号，就像下面这样：

```
...mapGetters({ aliasName: 'getMessage' }),  // 赋别名的话，这里接收对象，而不是数组
```

第四步，了解如何修改值：Mutation
====================


```
// 错误示范
this.$store.state.XXX = XXX;
```

#### 简单实现 mutations 的方法（没有传参）
*   修改 store/index.js，增加mutations属性
*   对this.$store commit 对应的 mutationcommit('setNumber')

修改 store/index.js，增加mutations属性
- mutation 方法的参数为 state
```
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    name: '张三',
    number: 0,
  },
  mutations: {
    // 增加nutations属性
    setNumber(state) {
      // 增加一个mutations的方法，方法的作用是让num从0变成5，state是必须默认参数
      state.number = 5;
    },
  },
});

export default store;

```

*   修改 App.vue

```
<script>
export default {
  mounted() {
    console.log(`旧值：${this.$store.state.number}`);
    this.$store.commit('setNumber');
    console.log(`新值：${this.$store.state.number}`);
  },
};
</script>

```

### mutation 传参
*   修改 store/index.js
	* mutation 方法的参数为 state，number
```
const store = new Vuex.Store({
  state: {
    name: '张三',
    number: 0,
  },
  mutations: {
    setNumber(state) {
      state.number = 5;
    },
    setNumberIsWhat(state, number) {
      // 增加一个带参数的mutations方法
      state.number = number;
    },
  },
});

export default store;

```

*   修改 App.vue

```
<script>
export default {
  mounted() {
    console.log(`旧值：${this.$store.state.number}`);
    this.$store.commit('setNumberIsWhat', 666);
    console.log(`新值：${this.$store.state.number}`);
  },
};
</script>

```

### 官方建议 mutation 传参
*   官方建议传递一个对象进去，对象一般命名为 payload
*   修改 store/index.js

```
mutations: {
    setNumber(state) {
      state.number = 5;
    },
    setNumberIsWhat(state, payload) {
      // 增加一个带参数的mutations方法，并且官方建议payload为一个对象
      state.number = payload.number;
    },
  },

```

*   修改 App.vue

```
<script>
export default {
  mounted() {
    console.log(`旧值：${this.$store.state.number}`);
    this.$store.commit('setNumberIsWhat', { number: 666 }); // 调用的时候也需要传递一个对象
    console.log(`新值：${this.$store.state.number}`);
  },
};
</script>

```

## mutation 重要原则：
Mutations里面的函数必须是同步操作，不能包含异步操作！

## mutation 的 map
*   我们在组件中可以使用 mapMutations 以代替 this.$store.commit('XXX')

```
<script>
import { mapMutations } from 'vuex';
export default {
  mounted() {
    this.setNumberIsWhat({ number: 999 });
  },
  methods: {
    // 注意，mapMutations是解构到methods里面的，而不是计算属性了
    ...mapMutations(['setNumberIsWhat']),
  },
};
</script>

```
*   当然你也可以给它叫别名，取外号，就像这样：
```
methods: {
  ...mapMutations({ setNumberIsAlias: 'setNumberIsWhat' }), // 赋别名的话，这里接收对象，而不是数组
},

```


第五步，异步操作：Actions
==================

*   修改 store/index.js

```
const store = new Vuex.Store({
  state: {
    name: '张三',
    number: 0,
  },
  mutations: {
    setNumberIsWhat(state, payload) {
      state.number = payload.number;
    },
  },
  actions: {
    // 增加actions属性
    setNum(content) {
      // 增加setNum方法，默认第一个参数是content，其值是复制的一份store
      return new Promise(resolve => {
        // 我们模拟一个异步操作，1秒后修改number为888
        setTimeout(() => {
          content.commit('setNumberIsWhat', { number: 888 });
          resolve();
        }, 1000);
      });
    },
  },
});

```

*   修改 App.vue

```
async mounted() {
  console.log(`旧值：${this.$store.state.number}`);
  await this.$store.dispatch('setNum');
  console.log(`新值：${this.$store.state.number}`);
},

```


action 就是去提交 mutation 的，什么异步操作都在 action 中消化了，最后再去提交 mutation 的。

### action 的 map
*   🤖 官方建议 1：你如果不想一直使用 this.$store.dispatch('XXX') 这样的写法调用 action，你可以采用 mapActions 的方式，把相关的 actions 解构到 methods 中，用 this 直接调用：

```
<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions(['setNum']), // 就像这样，解构到methods中
  },
  async mounted() {
    await this.setNum({ number: 123 }); // 直接这样调用即可
  },
};
</script>

```

当然，你也可以取别名，取外号，就像下面这样：

```
...mapActions({ setNumAlias: 'setNum' }),   // 赋别名的话，这里接收对象，而不是数组

```

###  action 的结构
* 🤖 官方建议 2：在 store/index.js 中的 actions 里面，方法的形参可以直接将 commit 解构出来，这样可以方便后续操作：

```
actions: {
  setNum({ commit }) {
    // 直接将content结构掉，解构出commit，下面就可以直接调用了
    return new Promise(resolve => {
      setTimeout(() => {
        commit('XXXX'); // 直接调用
        resolve();
      }, 1000);
    });
  },
},

```

*   不要将 action 和 mutation 混为一谈，action 其实就是 mutation 的上一级，在 action 这里处理完异步的一些操作后，后面的修改 state 就交给 mutation 去做了。

第六步，按属性进行拆分
===========

如果你是一个稍微有些规格的项目，那么你将会得到一个成百上千行的 index.js，然后查找一些东西就会非常费劲，
既然问题出来了，我们看一下怎么拆分一下。
我们看到，一个 store/index.js 里面大致包含 state/getters/mutations/actions 这四个属性，
我们可以彻底点，index.js 里面就保持这个架子，把里面的内容四散到其他文件中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc39e92fcf7242d78da6329d64ce1d44~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

于是我们可以新建四个文件，分别是`state.js` `getters.js` `mutations.js` `actions.js`：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9443814df5e48579e1bac65e48a22f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

*   1.  拆出来`state`放到`state.js`中：

```
// state.js

export const state = {
  name: '张三',
  number: 0,
  list: [
    { id: 1, name: '111' },
    { id: 2, name: '222' },
    { id: 3, name: '333' },
  ],
};

```

*   2.  拆出来`getters`放到`getters.js`中：

```
// getters.js

export const getters = {
  getMessage(state) {
    return `hello${state.name}`;
  },
};

```

*   3.  拆出来`mutations`放到`mutations.js`中：

```
// mutations.js

export const mutations = {
  setNumber(state) {
    state.number = 5;
  },
};

```

*   4.  拆出来`actions`放到`actions.js`中：

```
// actions.js

export const actions = {
  setNum(content) {
    return new Promise(resolve => {
      setTimeout(() => {
        content.commit('setNumberIsWhat', { number: 888 });
        resolve();
      }, 1000);
    });
  },
};

```

5.  组装到主文件里面：

```
import Vue from 'vue';
import Vuex from 'vuex';
import { state } from './state'; // 引入 state
import { getters } from './getters'; // 引入 getters
import { mutations } from './mutations'; // 引入 mutations
import { actions } from './actions'; // 引入 actions

Vue.use(Vuex);

const store = new Vuex.Store({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
});

// 可以简写成下面这样：

// const store = new Vuex.Store({ state, getters, mutations, actions });

export default store;

```


第七步，按功能进行拆分 - Module
====================
‘按**功能**’，按功能拆分的话，就是我们的标题 **Module(模块)** 。

1. 新增仓库
2. modules 属性引入
3. this.$store.state.store2.name访问

*   1.  增加一个新的仓库 store2，主要代码如下：

```
const store2 = {
  state: {
    name: '我是store2',
  },
  mutations: {},
  getters: {},
  actions: {},
};

export default store2;
```

*   2.  然后在 store 中的 modules 属性引入我们新创建的 store2 模块：

```
import Vue from 'vue';
import Vuex from 'vuex';
import { state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';
import store2 from './store2'; // 引入store2模块

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { store2 }, // 把store2模块挂载到store里面
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
});

export default store;

```

*   3.  访问 state 通过this.$store.state.store2.name

```
<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$store.state.store2.name); // 访问store2里面的name属性
  },
};
</script>

```

我们通过下面的代码可以了解到在不同的属性里是怎么访问 **模块内的状态** 或者 **根状态**：

```
mutations: {
  changeName(state, payload) {
    // state 局部状态
    console.log(state);
    console.log(payload.where);
  },
},
getters: {
  testGetters(state, getters, rootState) {
    // state 局部状态
    console.log(state);
    // 局部 getters,
    console.log(getters);
    // rootState 根节点状态
    console.log(rootState);
  },
},
actions: {
  increment({ state, commit, rootState }) {
    // state 局部状态
    console.log(state);
    // rootState 根节点状态
    console.log(rootState);
  },
},

```


### module 的其他内容

其实以上并不是 module 的全部，还有一些比如`命名空间`、`模块注册全局 action`、`带命名空间的绑定函数`、`模块动态注册`、`模块重用`等方法这里就没介绍，如果你在项目中使用到了，再进行查阅即可，有时候不需要完全理解，知道有这个东西就行，知道出了问题的时候该去哪查资料就够啦。😊
