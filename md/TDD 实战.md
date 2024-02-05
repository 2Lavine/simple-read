 
TDD (Test-Driven Development 测试驱动开发）简单地说就是先根据需求写测试用例，然后实现代码，通过后再接着写下一个测试和实现，循环直到全部功能和重构完成。



## 覆盖率
查看测试跑完的测试覆盖率报告看看是否覆盖全面了，防止有遗漏

```
yarn text --coverage
```

此时 vitest 会帮我我们自动安装 `@vitest/coverage-c8` 安装完成后，我们便可以查看测试报告了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45e16eb755de4a19ae5ac10dd9a53bee~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到 branch 下覆盖率并非 100，说明代码中有没有测试到的条件。在项目根目录中会生成一个 coverage 目录，只有浏览器代开 coverage 下的 `index.html`，我们可以看到没有测试到的代码

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e97437b8f0a4fd6adbe1508052ef801~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

没有测试到的代码会高亮，继续补全测试用例即可。

随着编写组件代码和测试熟练度的增加，个人可以调整写组件和测试用例的先后顺序，或者 2 者同步进行，但是最终提交的时候，组件的测试代码和测试用例是同步提交在一个 commit 中，并不是等组件开发完成后再来补测试用例，以上便上 TDD 的过程。