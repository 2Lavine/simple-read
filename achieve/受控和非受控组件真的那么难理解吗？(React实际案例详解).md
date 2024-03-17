> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6858276396968951822?searchId=202402011426002E0BAE0A227ECB1B2AAC)

### 受控组件基本概念
通过名称，我们可以猜测一下这两个词是什么意思：
*   受控组件：受我们控制的组件
*   非控组件：不受我们控制的组件

其实也就是我们**对某个组件状态的掌控，它的值是否只能由用户设置，而不能通过代码控制**。

我们知道，在`React`中定义了一个`input`输入框的话，它并没有类似于`Vue`里`v-model`的这种双向绑定功能。
- 也就是说，我们并没有一个指令能够将数据和输入框结合起来，用户在输入框中输入内容，然后数据同步更新。

在 HTML 的表单元素中，它们通常自己维护一套`state`，并随着用户的输入自己进行`UI`上的更新，这种行为是不被我们程序所管控的。
如果将`React`里的`state`属性和表单元素的值建立依赖关系，再通过`onChange`事件与`setState()`结合更新`state`属性，就能达到控制用户输入过程中表单发生的操作。被`React`以这种方式控制取值的表单输入元素就叫做**受控组件**。
### select 受控组件
对于其它的表单元素使用起来也差不多，可能就是属性名和事件不同而已。
例如`input`类型为`text`的表单元素中使用的是：
*   `value`
*   `onChange`
对于`textarea`标签也和它一样是使用`value`和`onChange`：
```
<textarea value={this.state.value} onChange={this.handleChange} />
```
#### 单选 select
对于`select`表单元素来说，`React`中将其转化为受控组件可能和原生`HTML`中有一些区别。
在原生中，我们默认一个`select`选项选中使用的是`selected`，比如下面这样：

```
<select>
  <option value="sunshine">阳光</option>
  <option value="handsome">帅气</option>
  <option selected value="cute">可爱</option>
  <option value="reserved">高冷</option>
</select>
```
但是如果是使用`React`受控组件来写的话就不用那么麻烦了，因为它允许在根`select`标签上使用`value`属性，去控制选中了哪个。这样的话，对于我们也更加便捷，在用户每次重选之后我们只需要在根标签中更新它，就像是这个案例🌰：

```
class SelectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 'cute' };
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    alert('你今日相亲对象的类型是: ' + this.state.value);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          你今日相亲对象的类型是:
          <select value={this.state.value} onChange={(e) => this.handleChange(e)}>
            <option value="sunshine">阳光</option>
            <option value="handsome">帅气</option>
            <option value="cute">可爱</option>
            <option value="reserved">高冷</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
export default SelectComponent;
```

可以看到不论是`input`类型为`text`的控件还是`textarea、select`在实现为**受控组件**上都差不多。

#### 多选 select

多选`select`的话，对比单选来说，只有这两处改动：

*   给`select`标签设置`multiple`属性为`true`
*   `select`标签`value`绑定的值为一个数组

呆呆这里也来小小的写一个案例吧：

```
class SelectComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { value: 'cute' };
    this.state = { value: ['cute'] };
  }

  handleChange(event) {
    console.log(event.target.value)
    const val = event.target.value;
    const oldValue = this.state.value;
    const i = this.state.value.indexOf(val);
    const newValue = i > -1 ? [...oldValue].splice(i, 1) : [...oldValue, val];
    this.setState({value: newValue});
  }

  handleSubmit(event) {
    alert('你今日相亲对象的类型是: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          你今日相亲对象的类型是:
          <select multiple={true} value={this.state.value} onChange={(e) => this.handleChange(e)}>
            <option value="sunshine">阳光</option>
            <option value="handsome">帅气</option>
            <option value="cute">可爱</option>
            <option value="reserved">高冷</option>
          </select>
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
export default SelectComponent;
```


### 动态表单受控组件案例
上面👆咱们实现了一些简单的受控组件案例，接着来玩个稍微难点的。
先看一下我们的需求：
实现一个组件，传入以下数组，自动渲染出表单：
(`CInput`代表一个输入框，`CSelect`代表一个选择框)
```
// 决定表单的结构
const formConfig = [
  {
    Component: CInput,
    label: '姓名',
    field: 'name',
  },
  {
    Component: CSelect,
    label: '性别',
    field: 'sex',
    options: [{ label: '男', value: 'man' }, { label: '女', value: 'woman' }]
  }
]
// 决定表单的内容
this.state = {
  name: '霖呆呆',
  sex: 'man'
}
```

效果：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/269c41a5c93f4d1ca41c65cd430a1896~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

也就是来实现一个简单的动态表单，看看受控组件在其中的应用。
*   `formConfig`决定了表单的结构，也就是定义表单中会有哪些项
*   `this.state`中定义了表单中各项的值是什么，它与`formConfig`是靠`formConfig`中各项的`field`字段来建立链接的。

知道了上面👆这些东西，我们就能很快写出这个动态表单组件的大概样子了：

(我们就把这个组件命名为`formComponent`吧，重点看`render`部分)

```
import React, { Component } from 'react';
import { CInput, CSelect } from './components'
export default class FormComponent extends Component {
	constructor (props) {
    super(props);
    this.state = {
      name: '霖呆呆',
      sex: 'man'
    }
  }
  formConfig = [
    {
      Component: CInput,
      label: '姓名',
      field: 'name',
    },
    {
      Component: CSelect,
      label: '性别',
      field: 'sex',
      options: [{ label: '男', value: 'man' }, { label: '女', value: 'woman' }]
    }
  ]
  render () { // 重点在这
    return (
      <form style={{marginTop: '50px'}}>
        {
          this.formConfig.map((item) => { // 枚举formConfig
            const { Type, field, name } = item;
            const ControlComponent = item.Component; // 提取Component
            return (
              <ControlComponent key={field} />
            )
          })
        }
      </form>
    )
  }
}
```

可以看到，`render`部分我们做了这么几件事：

*   枚举`formConfig`数组
*   提取出每一项里的`Component`，赋值给`ControlComponent`
*   渲染出每一项`Component`

`ControlComponent`变量的意义在于告诉`React`，需要渲染出哪一个组件，如果`item.Component`是`CInput`，那么最终渲染出的就是`<CInput />`。

这样就保证了能把`formConfig`数组中的每一个表单项都渲染出来，但是这些表单项现在还是不受我们控制的，我们需要用前面学到的`value`和`onChange`和每个`ControlComponent`建立联系，就像是这样：

```
<ControlComponent
  key={field}
  name={field}
  value={this.state[field]}
  onChange={this.onChange}
  {...item}
/>
```

我们把`this.state[field]`设置到`value`上，把`this.onChange`设置到`onChange`属性上。(可想而之，`CInput`和`CSelect`组件中就能用`this.props`来接收传入的属性了，例如`this.props.value`)

那么这时候`value`已经确定了，它就是由`this.state[field]`决定的，如果`field`是`"sex"`的话，`value`的值就是`"man"`。

所以来看看`onChange`方法该怎样写：

```
onChange = (event, field) => {
  const target = event.target;
  this.setState({
    [field]: target.value
  })
}
```

这个方法其实也很简单，它接受一个`event`和`field`，在`event`中就可以获取到用户输入 / 选择的值了。

好的👌，接下来让我们快速的看一下`CInput`和`CSelect`是如何实现的吧：

_components/CInput.jsx_:

```
import React, { Component } from 'react';

export default class CInput extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    const { name, field, value, onChange } = this.props;
    return (
      <>
        <label>
          {name}
        </label>
        <input name={field} value={value} onChange={(e) => onChange(e, field)} />
      </>
    )
  }
}
```

_components/CSelect.jsx_:

```
import React, { Component } from 'react';

export default class CSelect extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    const { name, field, options, value, onChange } = this.props;
    return (
      <>
        <label>
          {name}
        </label>
        <select name={field} value={value} onChange={(e) => onChange(e, field)}>
          {options.length>0 && options.map(option => {
            return <option key={option.value} value={option.value}>{option.label}</option>
          })}
        </select>
      </>
    )
  }
}
```
### 非受控组件
上面👆向大家展示的是受控组件的一些基本概念还有相关操作，
- 对于受控组件，我们需要为每个`状态更新`(例如`this.state.username`) 编写一个`事件处理程序`(例如`this.setState({ username: e.target.value })`)。
那么还有一种场景是：我们仅仅是想要获取某个表单元素的值，而不关心它是如何改变的。对于这种场景，我们有什么应对的方法吗🤔️？
唔...`input`标签它实际也是一个`DOM`元素，那么我们是不是可以用获取`DOM`元素信息的方式来获取表单元素的值呢？也就是使用`ref`。
就像下面👇这个案例一样：
```
import React, { Component } from 'react';

export class UnControll extends Component {
  constructor (props) {
    super(props);
    this.inputRef = React.createRef();
  }
  handleSubmit = (e) => {
    console.log('我们可以获得input内的值为', this.inputRef.current.value);
    e.preventDefault();
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input defaultValue="lindaidai" ref={this.inputRef} />
        <input type="submit" value="提交" />
      </form>
    )
  }
}
```

在输入框输入内容后，点击提交按钮，我们可以通过`this.inputRef`成功拿到`input`的`DOM`属性信息，包括用户输入的值，这样我们就不需要像受控组件一样，单独的为每个表单元素维护一个状态。

同时我们也可以用`defaultValue`属性来指定表单元素的默认值。

### 特殊的文件 file 标签
另外在`input`中还有一个比较特殊的情况，那就是`file`类型的表单控件。
**对于 file 类型的表单控件它始终是一个不受控制的组件，因为它的值只能由用户设置，而不是以编程方式设置。**
例如我现在想要通过状态更新来控制它：
```
import React, { Component } from 'react';

export default class UnControll extends Component {
  constructor (props) {
    super(props);
    this.state = {
      files: []
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
  }
  handleFile = (e) => {
    console.log(e.target.files);
    const files = [...e.target.files];
    console.log(files);
    this.setState({
      files
    })
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input type="file" value={this.state.files} onChange={(e) => this.handleFile(e)} />
        <input type="submit" value="提交" />
      </form>
    )
  }
}
```

在选择了文件之后，我试图用`setState`来更新，结果却报错了：
所以我们应当使用非受控组件的方式来获取它的值，可以这样写：

```
import React, { Component } from 'react';

export default class FileComponent extends Component {
  constructor (props) {
    super(props);
    this.fileRef = React.createRef();
  }
  handleSubmit = (e) => {
    console.log('我们可以获得file的值为', this.fileRef.current.files);
    e.preventDefault();
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input type="file" ref={this.fileRef} />
        <input type="submit" value="提交" />
      </form>
    )
  }
}
```

这里获取到的`files`是一个数组哈，当然，如果你没有开启多选的话，这个数组的长度始终是`1`，开启多选也非常简单，只需要添加`multiple`属性即可：

```
<input type="file" multiple ref={this.fileRef} />
```


React 官方的话来说，绝大部分时候推荐使用`受控组件`来实现表单，因为在受控组件中，表单数据由`React`组件负责处理；当然如果选择`受受控组件`的话，表单数据就由`DOM`本身处理。

另外在学习两者的时候，呆呆也发现了一些写的比较好的文章，比这篇更深入，推荐给大家哟：

*   [《在实际业务中如何灵活运用受控组件与非受控组件》](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F37579677 "https://zhuanlan.zhihu.com/p/37579677")
*   [《关于受控组件的思考》](https://link.juejin.cn?target=https%3A%2F%2Fblog.csdn.net%2Fneoveee%2Farticle%2Fdetails%2F95873911 "https://blog.csdn.net/neoveee/article/details/95873911")