> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7158478077670981662?searchId=202401261549374C48CC23171B271C060A)

TDD
---
现在我们就根据 TDD 测试方法论来测试开发 `VideoList` 组件。
1.  首先新建一个 `video-list.test.tsx` 测试文件，先写一个 `snapshot` 测试，此时保存测试肯定会报错，因为我们的组件还没建立；
2.  根据页面功能需求，写组件测试用例，可以先使用 `skip` 代替真实用例，也可以直接使用中文描述；

```
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import VideoList from "@/components/video-list";

describe("VideoList", () => {
  it("it should be render", () => {
    const { container } = render(<VideoList data={[]} />);
    expect(container).toMatchSnapshot();
  });

  it("it should be render with data", () => {});
  it.skip("it should be render with className", () => {});
});
```

1）渲染必须有数据 
2）渲染必须带 className
3）渲染可以通过 editable 控制状态
3.  建立 VideoList 组件文件，根据首页编写组件代码;

```
type Props = {
  className?: string;
  editable?: boolean;
  horizontal?: boolean;
  data: (Video & {
    author: User;
  })[];
};

export default function VideoList({
  data,
  editable,
  className,
  horizontal,
}: Props) {
  return (
    <div className={className}>
      {data.map((item) => {
        return (
          <VideoItem
            key={item.id}
            editable={editable}
            horizontal={horizontal}
            item={item}
          />
        );
      })}
    </div>
  );
}
```

下面是 VideoItem 组件代码
4.  替换组件中的数据为 mock 数据，确保 mock 数据在页面中显示，并且显示数据 count 与 mock 数据一致

```
it("it should be editable with editable props", () => {
  const { container } = render(<VideoList data={mockData} editable />);
  expect(screen.queryAllByRole("edit")).toHaveLength(mockData.length);
expect(screen.queryAllByRole("delete")).toHaveLength(mockData.length);
});
```

5.  测试 className、 editable 等其他 props，根据测试用例修改组件代码，直至组件全部测试通过


测试自定义 Hooks
-----------
IntersectionObserver API，可以自动 "观察" 元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做 "交叉观察器"，我们用它来实现无限滚动加载。

1.  这个 api，是浏览器特有的，Node 环境中不存在这个 api，因此我们需要 mock 一下这个 api
2. 我们通过使用 `vi.stubGlobal` 来模拟 `jsdom` 或 `node` 中不存在的全局变量。它将把全局变量的值放入 `globalThis` 对象，现在我们可以在测试环境中通过 `IntersectionObserver` 或 `window.IntersectionObserver` 访问。

```js
import { vi } from 'vitest'
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
```

接下来新建一个测试文件，由于 useOnScreen 必须配合一个 domRef 值，所以我们必须重新写一个组件来配合测试：

```js
function App() {
  const ref = useRef();
  const visible = useOnScreen(ref);
  return (
    <div role="test" ref={ref}>
      {visible ? "true" : "false"}
    </div>
  );
}
```

紧接着的是测试代码：
```js
describe("useOnScreen", () => {
  it("default value is false，After tigger function should be true", async () => {
    render(<App />);
expect(screen.getByRole("test")).toHaveTextContent("false");
  });
});
```

默认值返回 false，当触发交叉观察器的时候会返回 true。
IntersectionObserver 构造函数的回调方法没有主动执行，但是这一步在浏览器中是主动触发的，因此我们需要手动触发 mock 函数的回调方法, 最终测试代码如下：

```js
describe("useOnScreen", () => {
  it("default value is false，After callback value should be true", async () => {
    render(<App />);
    //  获得 mock 函数调用的参数
    const callback = IntersectionObserverMock.mock.calls[0][0];
expect(screen.getByRole("test")).toHaveTextContent("false");
act(() => {
      callback([{ isIntersecting: true }]);
    });
expect(screen.getByRole("test")).toHaveTextContent("true");
  });
});
```

上面代码中，我们可以使用 `IntersectionObserverMock.mock.calls` 来获得 mock 函数调用的参数，然后使用 `act` 方法 模拟浏览器真实操作，保存代码后，测试自动运行，我们可以看到测试成功，并且覆盖率 100%。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0acdb6e9445742b08d8c50c6f6a78ec0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

虽然是这一行代码解决了我的问题，但是我在写这个单元测试的过程中，也花费了我不少时间。
小结
--
**思考**
对于前端单元测试，我觉得不要过多地去追求 100% 测试覆盖率，也不要为了单侧而单侧，而是需要根据功能和场景来写单侧，在成本和信心值中间找到一个平衡，应用一些好的实践去降低写单测的成本，提升写测试带来的回报，让我们的项目质量越来越高。