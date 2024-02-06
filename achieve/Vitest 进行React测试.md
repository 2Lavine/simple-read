## 前提条件
@vitejs/plugin-react 是为了让 Vitest 支持 React
jsdom 可以让 Node.js 环境中模拟真实的 dom api ，
比如下面代码就是依赖 jsdom， 在 nodejs 环境中有了 `document.querySelector` 这个 api.
```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent); //
```
紧接着，需要让 Vitest 支持 jsdom 和 react，我们需要添加一个配置文件
```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```
### 测试 React 组件
现在我们来试试，是否可以测试 React 组件代码。
首先我们随便新建一个文件`app.test.tsx` 文件，输入以下代码
```
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
function App() {
  return <div>app</div>;
}

describe("App", () => {
  it("it should be render", () => {
    render(<App />);
    expect(screen.getByText("app")).toBeInTheDocument();
  });
});
```

vitest 默认没有 `toBeInTheDocument` 方法，
toBeInTheDocument 是 testing library 中的断言方法，vitest 默认不包含，因此我们需要配置一下初始化文件，继承 testing library 断言库，新建一个 `vitest-setup.ts` 文件

```js
import { vi, expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers, {
  TestingLibraryMatchers,
} from "@testing-library/jest-dom/matchers";

declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}
// 继承 testing-library 的扩展 except
expect.extend(matchers);
// 全局设置清理函数，避免每个测试文件手动清理
afterEach(() => {
  cleanup();
});
```

上面代码中，`cleanup()` 是为了在每次 `render` 后清理 react dom 树，若不清理可能会导致内存泄漏和非 “幂等” 测试（这可能导致测试中难以调试的错误），详情请看[官方文档](https://link.juejin.cn?target=https%3A%2F%2Ftesting-library.com%2Fdocs%2Freact-testing-library%2Fapi%23cleanup "https://testing-library.com/docs/react-testing-library/api#cleanup")

然后在 vitest.config.ts 中设置 `setupFiles` 文件路径

```
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
 +   setupFiles: "./vitest-setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

