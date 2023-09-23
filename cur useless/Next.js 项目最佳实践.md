> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7194410416879960125?searchId=2023091014020494F47DEAC7ED50289C32)

引擎锁定
====

我们在本项目中使用的 v16 的 Node.js。你可以通过 `node --version` 检查版本。打开 `package.json` engines 字段是你指定所使用工具的特定版本的地方。

```
{
  "name": "nextjs-fullstack-app-template-zn",
  "version": "0.1.0",
  "private": true,
  "author": "YOUR_NAME",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@next/font": "13.1.6",
    "@types/node": "18.11.18",
    "@types/react": "18.0.27",
    "@types/react-dom": "18.0.10",
    "next": "13.1.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "4.9.4"
  },
  "engines": {
    "node": ">=16.0.0",
    "yarn": ">=1.22.0"
  }
}
```

代码格式化和质量工具
==========

为了设定一个标准，供项目的所有贡献者使用，以保持代码风格一致并遵循基本的最佳实践，我们将使用两个工具：

*   [eslint](https://link.juejin.cn?target=https%3A%2F%2Feslint.org%2F "https://eslint.org/") - 代码规范的最佳实践
*   [prettier](https://link.juejin.cn?target=https%3A%2F%2Fprettier.io%2F "https://prettier.io/") - 自动格式化代码文件

ESLint
------

`.eslintrc.json`

```
{
  "extends": ["next", "next/core-web-vitals", "eslint:recommended"],
  "globals": {
    "React": "readonly"
  },
  "rules": {
    "no-unused-vars": [1, { "args": "after-used", "argsIgnorePattern": "^_" }]
  }
}
```


你可以测试一下你的配置通过运行：

```
yarn lint
```

你会得到类型的提示

```
✔ No ESLint warnings or errors
✨  Done in 3.48s.
```

如果你遇到任何错误，那么 ESLint 非常擅长清楚地解释它们是什么。如果遇到你不喜欢的规则，你可以简单的将它从 1（告警）设置成 0（忽略） 来关闭它

```
"rules": {
    "no-unused-vars": 0, 
 }
```

让我们在这时候进行一次提交，带上信息 `build: configure eslint`

## Husky
Husky 是一个用于在 git 进程的不同阶段运行脚本的工具，例如 add、commit、push 等。
我们希望能够设置某些条件，并且只有在我们的代码满足这些条件时才允许提交和推送之类的事情成功，假设这表明我们的项目质量是可以接受的。

安装 Husky
```
yarn add -D husky
npx husky install
```

npx husky install命令将在你的项目中创建一个 `.husky` 目录。
这就是你的 hooks 存放的地方。确保此目录包含在你的代码仓库中，因为它也适用于其他开发人员，而不仅仅是你自己。
在 `package.json` 文件中添加 script

`package.json`

```
...
  "scripts: {
    ...
    "prepare": "husky install"
  }
```

这将确保在其他开发人员运行该项目时自动安装 Husky

---
创建一个 hook

```
npx husky add .husky/pre-commit "yarn lint"
```

上面说为了让我们的提交成功，`yarn lint` 必须首先运行并成功。 在这种情况下，” 成功 ” 意味着没有错误。 它将允许你有告警（请记住，在 ESLint 配置中，设置 1 是警告，设置 2 是错误）

让我们再添加一个

```
npx husky add .husky/pre-push "pnpm build"
```

以上确保我们只有在代码构建成功的时候才可以将代码推送到远程仓库中。 这似乎是一个相当合理的条件，不是吗？ 通过提交此更改并尝试推送来随意测试它。

让我们在这时候进行一次提交，带上信息 `ci: implement husky` 。
如果所有设置都完成，在你进行提交之前就会运行 lint script
commitlint
---
最后，我们将再添加一个工具。 到目前为止，我们一直在遵循所有提交消息的标准约定，让我们确保团队中的每个人都遵循它们（包括我们自己！）。 我们可以为我们的提交消息添加一个 linter：

```
yarn add -D @commitlint/config-conventional @commitlint/cli
```

要配置它，我们将使用一组标准默认值，但我喜欢将该列表显式包含在 commitlint.config.js 文件中，因为我有时会忘记可用的前缀：
`commitlint.config.js`

```
// build: 影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）
// ci: 更改我们的 CI 配置文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）
// docs: 文档修改
// feat: 一个新的功能
// fix: 一个 bug 修复
// perf: 提升性能的代码修改
// refactor: 既不修复错误也不添加功能的代码更改
// style: 不影响代码含义的更改（空格、格式、缺少分号等）
// test: 添加缺失的测试或更正现有测试

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};
```

然后使用 Husky 启用 commitlint：

```
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
# 有的时候上述的命令会在某些命令行环境失效，也可以试试下面的命令
npx husky add .husky/commit-msg \"npx --no -- commitlint --edit '$1'\"
# 或者
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

我现在要使用消息 `ci: implement commitlint` 创建一个新的提交

你可以在下面的屏幕截图中看到此设置的最终结果，希望你的结果与此类似：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3c07fe860cc4845bd26343d7f4e22a5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果提交信息格式不正确的话，则会报错

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c2dd50ad0674135a01efac48aef7280~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

**VS Code 配置**
==============

现在我们已经实现了 ESLint 和 Prettier，我们可以利用一些便利的 VS Code 功能让它们自动运行。

在项目的根目录中创建一个名为 .vscode 的目录和一个名为 settings.json 的文件。 这将是一个覆盖已安装 VS 代码默认设置的值列表。

在 settings.json 中，我们将添加以下值

`.vscode/settings.json`

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  }
}
```

以上将告诉 VS Code 使用你的 Prettier 扩展作为默认格式化程序（如果你愿意，可以手动覆盖另一个）并在每次保存时自动格式化你的文件并组织你的导入语句
让我们在这时候进行一次提交，带上信息 `build: implement vscode project settings`

调试
==

让我们设置一个方便的环境来调试我们的应用程序，以防我们在开发过程中遇到任何问题。
在 `.vscode` 目录下创建 `launch.json` 文件

`launch.json`

```
{
    "version": "0.1.0",
    "configurations": [
      {
        "name": "Next.js: debug server-side",
        "type": "node-terminal",
        "request": "launch",
        "command": "npm run dev"
      },
      {
        "name": "Next.js: debug client-side",
        "type": "pwa-chrome",
        "request": "launch",
        "url": "<http://localhost:3000>"
      },
      {
        "name": "Next.js: debug full stack",
        "type": "node-terminal",
        "request": "launch",
        "command": "npm run dev",
        "console": "integratedTerminal",
        "serverReadyAction": {
          "pattern": "started server on .+, url: (https?://.+)",
          "uriFormat": "%s",
          "action": "debugWithChrome"
        }
      }
    ]
  }
```

使用该脚本你可以选择三种调试方式。单击 VS Code 左侧的小 “错误和播放图标” 或按 `Ctrl + Shift + D` 访问调试菜单。你可以选择要运行的脚本并使用启动 / 停止按钮启动 / 停止它

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4623d869613e4937b54f2a34f7f4e3bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

除此之外，或者如果你没有使用 VS Code，我们也可以在项目中设置一些有用的调试脚本

首先，我们将安装 [cross-env](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-env "https://www.npmjs.com/package/cross-env") ， 如果你有同事在不同的环境（Windows、Linux、Mac 等）上工作，则有必要设置环境变量。

```
yarn add -D cross-env
```

安装完这个包之后，我们可以更新下 `package.json` 文件中的 `dev` 脚本

```
{
  ...
  "scripts": {
    ...
    "dev": "cross-env NODE_OPTIONS='--inspect' next dev",
  },
}
```

这将允许你在开发模式下工作时在浏览器中记录服务器数据，从而更容易调试问题。
在这个阶段，我将创建一个新的提交 `build: add debugging configuration`

目录结构====


我个人喜欢采用相当简单的方法，基本上以类的 model / view 将事物分开。

我们将使用三个主要文件夹
> PS: 原文没有 src 目录，我个人喜欢用 src 目录，所以加了 src 根目录
*   components - 组成应用程序的各个 UI 组件将位于此处
*   lib - 业务 / 应用程序 / 领域 逻辑将存在于此
*   pages - 项目的实际 路由 / 页面

除此之外，我们还会有其他目录来支持该项目，但构成我们的应用程序的几乎所有内容的核心都将位于这三个目录中

在 `components` 中，我们将有子目录，这些子目录将相似类型的组件组合在一起。你可以使用你喜欢的任何方法来执行此操作。 我过去经常使用 MUI 库，所以我倾向于遵循他们在[文档](https://link.juejin.cn?target=https%3A%2F%2Fmui.com%2Fmaterial-ui%2Fgetting-started%2Finstallation%2F "https://mui.com/material-ui/getting-started/installation/")中用于组件的相同组织

这里我再使用 `feat: create directory structure` 创建一个提交

添加 Storybook
============

我们可以使用的一种很棒的现代工具叫做 [Storybook](https://link.juejin.cn?target=https%3A%2F%2Fstorybook.js.org%2F "https://storybook.js.org/")

Storybook 为我们提供了一个环境来展示和测试我们在我们正在使用它们的应用程序之外构建的 React 组件。它是将开发人员与设计人员联系起来并能够根据设计要求验证我们开发的组件的外观和功能的好工具

请注意，Storybook 是一种可视化测试工具，稍后我们将引入其他工具来进行功能单元测试和端到端测试

学习如何使用 Storybook 的最佳方式是安装并试用它！
```
npx sb init --builder webpack5
```

我们将使用 webpack5 版本来与最新版本的 webpack 保持同步（我不确定为什么它仍然不是默认版本。也许在你使用本教程时已经是了）。


----
当 Storybook 安装时，它会自动检测有关项目的很多信息，比如它是一个 React 应用程序，以及正在使用的其他工具。 它应该兼容好所有配置本身。

如果你收到有关 eslintPlugin 的提示，你可以选择 “是”。 
- 不过，我们将手动配置它，所以如果你收到一条消息说它没有自动配置，请不要担心。

打开 `eslintrc.json` 文件并更新它

```
{
  "extends": [
    "plugin:storybook/recommended", // 新加入
    "next",
    "next/core-web-vitals",
    "eslint:recommended"
  ],
  "globals": {
    "React": "readonly"
  },
  // 新加入
  "overrides": [
    {
      "files": ["*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
      "rules": {
        // example of overriding a rule
        "storybook/hierarchy-separator": "error"
      }
    }
  ],
  "rules": {
    "no-unused-vars": [1, { "args": "after-used", "argsIgnorePattern": "^_" }]
  }
}
```

我添加了 `// 新加入` 来标记 Storybook 特定的两个新部分和行。

---
我们注意到，Storybook 也已将 /stories 目录添加到项目中，其中包含许多示例。如果你是 Storybook 的新手，我强烈建议你通读它们并将它们留在那里，直到你能够脱离模板自如地创建自己的示例。

在我们运行它之前，我们需要确保我们使用的是 webpack5。 将以下内容添加到 `package.json` 文件中：

```
{
  ...
  "resolutions": {
    "webpack": "^5"
  }
}
```

然后运行

```
yarn install
```

确保 webpack5 已经被安装

接下来更新 `.storybook/main.js` 文件

```
module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
	/** 暴露 public 目录给到 stotrybook，作为静态资源目录 */
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
```

在这里，我们更改了 stories 文件的模式，以便它可以在我们的组件（或其他）目录中选取任何 .stories 文件。

我们暴露了 Next.js 的 “public” 目录作为 Storybook 的静态资源目录，这样我们就可以在 Storybook 中测试类似图片，视频等资源了

最后，在我们运行 Storybook 本身之前，让我们在 `.storybook/preview.js` 中添加一些有用的值。 这是我们控制 stories 渲染方式默认值的文件。

`storybook/preview.js`

```
import '../styles/globals.css';
import * as NextImage from 'next/image';

const BREAKPOINTS_INT = {
  xs: 375,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const customViewports = Object.fromEntries(
  Object.entries(BREAKPOINTS_INT).map(([key, val], idx) => {
    console.log(val);
    return [
      key,
      {
        name: key,
        styles: {
          width: `${val}px`,
          height: `${(idx + 5) * 10}vh`,
        },
      },
    ];
  })
);

// 允许 Storybook 处理 Next 的 <Image> 组件
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports: customViewports },
};
```

上面有几个属于个人喜好，大家可以随意配置。请务必设置默认断点以匹配应用中对你重要的任何内容。我们还添加了一个处理方法，以便 Storybook 可以处理 Next 的 ![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACbklEQVRoQ+2aMU4dMRCGZw6RC1CSSyQdLZJtKQ2REgoiRIpQkCYClCYpkgIESQFIpIlkW+IIcIC0gUNwiEFGz+hlmbG9b1nesvGW++zxfP7H4/H6IYzkwZFwQAUZmpJVkSeniFJKA8ASIi7MyfkrRPxjrT1JjZ8MLaXUDiJuzwngn2GJaNd7vyP5IoIYY94Q0fEQIKIPRGS8947zSQTRWh8CwLuBgZx479+2BTkHgBdDAgGAC+fcywoyIFWqInWN9BSONbTmFVp/AeA5o+rjKRJ2XwBYRsRXM4ZXgAg2LAPzOCDTJYQx5pSIVlrC3EI45y611osMTHuQUPUiYpiVooerg7TWRwDAlhSM0TuI+BsD0x4kGCuFSRVzSqkfiLiWmY17EALMbCAlMCmI6IwxZo+INgQYEYKBuW5da00PKikjhNNiiPGm01rrbwDwofGehQjjNcv1SZgddALhlJEgwgJFxDNr7acmjFLqCyJuTd6LEGFttpmkYC91Hrk3s1GZFERMmUT01Xv/sQljjPlMRMsxO6WULwnb2D8FEs4j680wScjO5f3vzrlNJszESWq2LYXJgTzjZm56MCHf3zVBxH1r7ftU1splxxKYHEgoUUpTo+grEf303rPH5hxENJqDKQEJtko2q9zGeeycWy3JhpKhWT8+NM/sufIhBwKI+Mta+7pkfxKMtd8Qtdbcx4dUQZcFCQ2I6DcAnLUpf6YMPxhIDDOuxC4C6djoQUE6+tKpewWZ1wlRkq0qUhXptKTlzv93aI3jWmE0Fz2TeujpX73F9TaKy9CeMk8vZusfBnqZ1g5GqyIdJq+XrqNR5AahKr9CCcxGSwAAAABJRU5ErkJggg==) 组件而不会崩溃。

现在我们准备来测试一下，运行

```
yarn storybook
```

如果一切顺利，将在控制台中看到一条消息，如下所示：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34843873fbaa440e8226669c76102587~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后你可以通过 [http://localhost:6006](https://link.juejin.cn?target=http%3A%2F%2Flocalhost%3A6006%2F "http://localhost:6006/") 访问到

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c77a98509a3a4ecca17f2fda390f53ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

如果你以前从未使用过这些示例，我希望你尝试并熟悉这些示例。
在这个阶段，我再创建一个提交 `build: implement storybook`

创建一个组件模版
========

是时候将我们已经完成的所有配置放在一起，看看如何使用我们为自己设定的标准来创建和实现我们的第一个组件了

我们将创建一个简单的卡片。创建如下的目录

`/src/components/template/base`

在这个目录中创建 `BaseTemplate.tsx` 。这将遵循文件名的标准模式，该模式与指向它的目录相匹配。例如，这允许我们在卡片目录中拥有其他类型的卡片，如 `PhotoCard` 或 `TextCard` 等。

`BaseTemplate.tsx`

```
export interface IBaseTemplate {}

const BaseTemplate: React.FC<IBaseTemplate> = () => {
  return <div>Hello world!</div>;
};

export default BaseTemplate;
```

我们的每一个组件都将遵循这个确切的结构。即使它不使用 props，它仍然会为组件导出一个空的 props 接口。这样做的原因是它将允许我们在许多组件和文件中复制这个精确的结构，并使用相同的模式交换组件，并且只查找 / 替换组件的名称。

当你开始使用 stories 和 mock props 时，就会明白为所有组件文件维护一致的命名方案和界面是多么方便和强大。

这其中就遵循了我们之前提及到的 **一致性就是一切**

接下来我们会为组件创建样式文件。我个人更喜欢将样式文件存放在各个组件的文件夹中

`BaseTemplate.module.css`

```
.component {
}
```

作为顶级样式，将在你的组件目录中放置标准空模板。你可以像如下一样更新 `BaseTemplate` 文件

`BaseTemplate.tsx`

```
import styles from './BaseTemplate.module.css';

export interface IBaseTemplate {}

const BaseTemplate: React.FC<IBaseTemplate> = () => {
  return <div className={styles.container}>Hello world!</div>;
};

export default BaseTemplate;
```

现在，我们拥有了一个干净的样式模版

现在让我们为组件添加一个实验性质的 prop

`BaseTemplate.tsx`

```
import styles from './BaseTemplate.module.css';

export interface IBaseTemplate {
  sampleTextProp: string;
}

const BaseTemplate: React.FC<IBaseTemplate> = ({ sampleTextProp }) => {
  return <div className={styles.container}>{sampleTextProp}</div>;
};

export default BaseTemplate;
```

对于每一个我们创建的组件，我们希望能够快速的方便的在不同环境（比如在 storybook，或者在 app 内，或者在我们编写的单元测试中）中去测试它。快速访问数据来渲染组件将会很方便。

让我们创建一个文件来存储这个组件的模拟数据，这些模拟数据是给后续测试使用的。

`BaseTemplate.mocks.ts`

```
import { IBaseTemplate } from './BaseTemplate';

const base: IBaseTemplate = {
  sampleTextProp: 'Hello world!',
};

export const mockBaseTemplateProps = {
  base,
};
```

这个结构看起来有点点复杂，但很快我们将看到它的优点。我使用十分见名知意的一致命名模式，所以这个模板很容易复制并粘贴到你创建的每个新组件。

现在我们为这个组件创建一个 story

`BaseTemplate.stories.tsx`

```
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseTemplate, { IBaseTemplate } from './BaseTemplate';
import { mockBaseTemplateProps } from './BaseTemplate.mocks'

export default {
    title: 'templates/BaseTemplate',
    component: BaseTemplate,
    argTypes: {},
} as ComponentMeta<typeof BaseTemplate>;
  
const Template: ComponentStory<typeof BaseTemplate> = (args) => (
    <BaseTemplate {...args} />
);

export const Base = Template.bind({});

Base.args = {
    ...mockBaseTemplateProps.base,
} as IBaseTemplate;
```

我不会告诉你每一个 story 文件的具体细节，对你来说，做好的学习资源是 Storybook 的官方文档。

这里目标是创建一个容易复制粘贴的一致性的组件模版，以供组件进行开发和测试

现在测试一下

```
yarn storybook
```

如果一切顺利，你将会看到下面的界面（如果有问题，我建议你再重新检查一下之前的配置正不正确）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d651f6fba112498fb2fd2eefc87e09f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在我们开始创建更多文件，最好养成在提交之前运行 `yarn lint` 的习惯，以确保一切都是干净的并准备就绪。我在这里再创建一个提交 `build: create BaseTemplate component`

使用组件模版
======

既然我们已经有了组件模版，接下来我们就创建一个真实的组件

创建 `components/cards` 目录。然后将 `templates` 目录下的 `base` 文件夹拷贝到 `cards` 下面，然后再将 `base` 重命名为 `cat` 。我们将创建一个 `CatCard` 。重命名每个文件以匹配。 完成后应该是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/764f9341fffe46eeb7416c19ab325756~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

然后在 `components/cards/cat` 目录下，全局将 `BaseTemplate` 替换为 `CatCard` ，如下

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d30672b1cd441e3ad8de6cd6844be3f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在我们准备开始工作，我们已经有了一个干净的预生成的模版，其中已经为我们的 Card 组件包含了 story 文件和模拟数据文件。相当的方便！让我们开始开发 Card 组件吧：

`CatCard.tsx`

```
import Image from 'next/image';
import styles from './CatCard.module.css';

export interface ICatCard {
  tag: string;
  title: string;
  body: string;
  author: string;
  time: string;
}

const CatCard: React.FC<ICatCard> = ({ tag, title, body, author, time }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.card__header}>
          <Image
            src="/time-cat.jpg"
            alt="card__image"
            className={styles.card__image}
            width="600"
            height="400"
          />
        </div>
        <div className={styles.card__body}>
          <span className={`${styles.tag} ${styles['tag-blue']}`}>{tag}</span>
          <h4>{title}</h4>
          <p>{body}</p>
        </div>
        <div className={styles.card__footer}>
          <div className={styles.user}>
            <Image
              src="<https://i.pravatar.cc/40?img=3>"
              alt="user__image"
              className={styles.user__image}
              width="40"
              height="40"
            />
            <div className={styles.user__info}>
              <h5>{author}</h5>
              <small>{time}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatCard;
```

设置样式

`CatCard.module.css`

```
@import url('<https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap>');

.container {
  margin: 1rem;
}

.container * {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.card__image {
  max-width: 100%;
  display: block;
  object-fit: cover;
}

.card {
  font-family: 'Quicksand', sans-serif;
  display: flex;
  flex-direction: column;
  width: clamp(20rem, calc(20rem + 2vw), 22rem);
  overflow: hidden;
  box-shadow: 0 0.1rem 1rem rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  background: #ece9e6;
  background: linear-gradient(to right, #ffffff, #ece9e6);
}

.card__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag {
  align-self: flex-start;
  padding: 0.25em 0.75em;
  border-radius: 1em;
  font-size: 0.75rem;
}

.tag-blue {
  background: #56ccf2;
  background: linear-gradient(to bottom, #2f80ed, #56ccf2);
  color: #fafafa;
}

.card__body h4 {
  font-size: 1.5rem;
  text-transform: capitalize;
}

.card__footer {
  display: flex;
  padding: 1rem;
  margin-top: auto;
}

.user {
  display: flex;
  gap: 0.5rem;
}

.user__image {
  border-radius: 50%;
}

.user__info > small {
  color: #666;
}
```

设置模拟数据

`CatCard.mocks.ts`

```
import { ICatCard } from './CatCard';

const base: ICatCard = {
  tag: 'Felines',
  title: `What's new in Cats`,
  body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis molestiae non nemo doloribus. Doloremque, nihil! At ea atque quidem!',
  author: 'Alex',
  time: '2h ago',
};

export const mockCatCardProps = {
  base,
};
```

注意这里从项目的 public 目录用了一张 🐱 的照片 (/time-cat.jpg)，你可以从项目的仓库中找到它

`CatCard.stories` 的修改就是需要将 story 的 title 从 `templates/CatCard` 改为 `cards/CatCard`

我们需要更新 `next.config.js`，因为我们正在使用一个没有明确声明允许的域（对于头像）。 只需将配置文件更新为如下所示

`next.config.js`

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
};

module.exports = nextConfig;
```

或者，你可以将头像图像放在 public 目录中，但为了学习使用外部域的过程，我们将保留此设置。

现在运行 Storybook，如果你足够幸运，你将会看到

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2401a5b442e436aa1f562c01dce9006~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

这个组件可以很方便的放置在实际项目中的任何位置。在短期内测试时使用 `mock` prop，并在准备好后更换为真实 prop

`pages/index.tsx`

```
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import CatCard from '../components/cards/cat/CatCard';
import { mockCatCardProps } from '../components/cards/cat/CatCard.mocks';

const Home: NextPage = () => {
    return (
      <div>
        <Head>
          <title>Create Next App</title>
          <meta  />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <h1>
            Welcome to <a href="<https://nextjs.org>">Next.js!</a>
          </h1>
  
          <div style={{ display: 'flex'}}>
            <CatCard {...mockCatCardProps.base} />
            <CatCard {...mockCatCardProps.base} />
            <CatCard {...mockCatCardProps.base} />
            <CatCard {...mockCatCardProps.base} />
          </div>
        </main>
  
        <footer>
          <a
            href="<https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app>"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    );
  };
  
  export default Home;
```

运行如下命令查看界面样式

```
yarn dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95cee7221dae40b0b808c659c711b402~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

添加自定义文档
=======

虽然在这个阶段没有必要，但你可能希望对应用的 `<head>` 中的内容进行更细粒度的控制。在`pages`目录中创建自定义 `_document.tsx`

`pages/_document.tsx`

```
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="<https://fonts.googleapis.com>" />
          <link rel="preconnect" href="<https://fonts.gstatic.com>" />
          <link
            href="<https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap>"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

_请注意，我已经移除了 `components/cards/cat/CatCard.module.css` 中的 `@import` 字体，并且把 google 字体放在这里进行预加载_

您需要在 `<head>` 元素中执行或自定义的任何其他操作现在都可以在此文件中完成。

请注意，此 `<Head>` 与从 `next/head` 导入的不同。 它们将一起工作，而这个仅用于你希望在每个页面上加载的数据。

更多的关于自定义 `_document` ，可以查看这个[文档](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fcustom-document "https://nextjs.org/docs/advanced-features/custom-document")

添加 **Layouts**
==============

Layouts 是 Next.js 中的重要概念。他们协助我们管理页面间的状态。对于本节，我们将使用与[官方示例](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Flayout-component "https://github.com/vercel/next.js/tree/canary/examples/layout-component") 中提供的相同的基本模板，并简单地对其进行自定义以适合我们的项目。

在 `components` 中创建新的目录 `layouts` 。我们将复制两次 `templates/case` 目录。一个叫做 `primary` ，另一个叫做 `sidebar` 。如下图所示

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4034b7ea9b88422285bd0dd2a7129912~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在每个文件中对 `BaseTemplate` 进行区分大小写的查找 / 替换，并分别替换为 `PrimaryLayout` 和 `SidebarLayout`。 如果你在这一步有遇到困难，可以直接参考这个[仓库的结构](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FzidanDirk%2Fnextjs-fullstack-app-template-zn "https://github.com/zidanDirk/nextjs-fullstack-app-template-zn")

更新  `PrimaryLayout.tsx` 和  `PrimaryLayout.module.css` 文件：

`components/layouts/primary/PrimaryLayout.tsx`

```
import Head from 'next/head';
import styles from './PrimaryLayout.module.css';

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({ children }) => {
 return (
   <>
     <Head>
       <title>Primary Layout Example</title>
     </Head>
     <main className={styles.main}>{children}</main>
   </>
 );
};

export default PrimaryLayout;
```

`components/layouts/primary/PrimaryLayout.module.css`

```
.main {
  display: flex;
  height: calc(100vh - 64px);
  background-color: white;
}

.main > section {
  padding: 32px;
}
```

然后是 sidebar

`components/layouts/sidebar/SidebarLayout.tsx`

```
import Link from 'next/link';
import styles from './SidebarLayout.module.css';

export interface ISidebarLayout {}

const SidebarLayout: React.FC<ISidebarLayout> = () => {
  return (
    <nav className={styles.nav}>
      <input className={styles.input} placeholder="Search..." />
      <Link href="/">
        Home
      </Link>
      <Link href="/about">
        About
      </Link>
      <Link href="/contact">
        Contact
      </Link>
    </nav>
  );
};

export default SidebarLayout;
```

`components/layouts/sidebar/SidebarLayout.module.css`

```
.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: #fafafa;
  padding: 32px;
  border-right: 1px solid #eaeaea;
}

.nav > a {
  margin: 8px 0;
  text-decoration: none;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  padding: 12px 16px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #333;
  border: 1px solid #eaeaea;
  transition: all 0.125s ease;
}

.nav > a:hover {
  background-color: #eaeaea;
}

.input {
  margin: 32px 0;
  text-decoration: none;
  background: white;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  font-size: 14px;
  padding: 8px 16px;
  height: 28px;
}
```

现在这些文件都创建好了，我们需要使用他们。我们将更新我们的主页并创建另一个名为 `about.tsx` 的页面来展示如何使用共享 layouts 并在页面之间保持组件状态。

首先，我们需要添加一个类型来扩展默认的 NextPage 接口，因为出于某种原因它不包含开箱即用的 `getLayout` 函数。

创建一个自定义类型文件，它将为我们处理此问题提供[方案](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F62115518%2Fpersistent-layout-in-next-js-with-typescript-and-hoc%2F65898224%2365898224 "https://stackoverflow.com/questions/62115518/persistent-layout-in-next-js-with-typescript-and-hoc/65898224#65898224")

`pages/page.d.ts`

```
import { NextPage } from 'next';
import { ComponentType, ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (_page: ReactElement) => ReactNode;
  layout?: ComponentType;
};
```

当你需要创建自定义 layouts 的页面，你可以使用 `NextPageWithLayout` 接口来替代 `NextPage` 接口

现在让我们更新主页

`pages/index.tsx`

```
import CatCard from '../components/cards/cat/CatCard';
import { mockCatCardProps } from '../components/cards/cat/CatCard.mocks';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import SidebarLayout from '../components/layouts/sidebar/SidebarLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
    return (
      <section >
        <h1>
          Welcome to <a href="<https://nextjs.org>">Next.js!</a>
        </h1>
        <CatCard {...mockCatCardProps.base} />
      </section>
    );
  };
  export default Home;

  Home.getLayout = (page) => {
    return (
      <PrimaryLayout>
        <SidebarLayout />
        {page}
      </PrimaryLayout>
    );
  };
```

并且在 `pages` 目录中创建一个新的 `about` 页面

`pages/about.tsx`

```
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import SidebarLayout from '../components/layouts/sidebar/SidebarLayout';
import { NextPageWithLayout } from './page';

const About: NextPageWithLayout = () => {
return (
  <section>
    <h2>Layout Example (About)</h2>
    <p>
      This example adds a property <code>getLayout</code> to your page,
      allowing you to return a React component for the layout. This allows you
      to define the layout on a per-page basis. Since we're returning a
      function, we can have complex nested layouts if desired.
    </p>
    <p>
      When navigating between pages, we want to persist page state (input
      values, scroll position, etc.) for a Single-Page Application (SPA)
      experience.
    </p>
    <p>
      This layout pattern will allow for state persistence because the React
      component tree is persisted between page transitions. To preserve state,
      we need to prevent the React component tree from being discarded between
      page transitions.
    </p>
    <h3>Try It Out</h3>
    <p>
      To visualize this, try tying in the search input in the{' '}
      <code>Sidebar</code> and then changing routes. You'll notice the
      input state is persisted.
    </p>
  </section>
);
};

export default About;

About.getLayout = (page) => {
return (
  <PrimaryLayout>
    <SidebarLayout />
    {page}
  </PrimaryLayout>
);
};
```

更新 `_app.tsx`

`pages/_app.tsx`

```
import type { AppProps } from 'next/app';
import './globals.css';
import { NextPageWithLayout } from './page';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	// 如果这个 layout 是可用的，则在页面中使用 
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
```

最后我更新了 `PrimaryLayout.mocks.ts` 文件，为 _`IPrimaryLayout`_ 添加了 `children: '{{component}}’` 用于在 Storybook 中展示

同时我更新 layout 的 story title 从 `templates/...`变成 `layouts/...`

最后你可以保存测试一下

```
yarn dev
```

在侧边栏（ Home 和 about ）的按钮单击可以进行页面切换。 请注意，所使用的布局将持续存在而无需重新加载（正如我们的意图），并且用户将获得超快速的体验。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ede7bb0dc56d47059496fcc0a123deda~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68f8d8dd53fd4318a2d021e41caa092f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

在 Storybook 这边，我们可以独立于应用预览和测试我们的 layout 组件。这个 PrimaryLayout 组件在没有自组件的情况下没有什么作用，而侧边栏则可以完美的显示。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f957175add54a5d88856e37efdd25bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

部署
==

最后一步将讲解如何部署一个 Next.js 应用

我们将使用 Vercel，因为它是 Next.js 应用程序最简单、最直接的部署解决方案。

请注意，Vercel 绝对不是唯一的选择，其他主要服务（如 [AWS](https://link.juejin.cn?target=https%3A%2F%2Faws.amazon.com%2Fblogs%2Fmobile%2Fhost-a-next-js-ssr-app-with-real-time-data-on-aws-amplify%2F "https://aws.amazon.com/blogs/mobile/host-a-next-js-ssr-app-with-real-time-data-on-aws-amplify/")、[Netlify](https://link.juejin.cn?target=https%3A%2F%2Fwww.netlify.com%2Fwith%2Fnextjs%2F "https://www.netlify.com/with/nextjs/") 等）也都可以使用。

假设你使用的不是 [静态站点生成](https://link.juejin.cn?target=https%3A%2F%2Fnextjs.org%2Fdocs%2Fadvanced-features%2Fstatic-html-export "https://nextjs.org/docs/advanced-features/static-html-export") 模式，那么实际上你仅仅需要找个服务来运行 `next start` 命令就行了

作为一个普通用户在 Vercel 上进行部署是完全免费的，我们需要从[创建账号](https://link.juejin.cn?target=https%3A%2F%2Fvercel.com%2F "https://vercel.com/")开始

登录后，单击 `+ New Project` 并授予 Vercel 访问你的 Github 仓库的权限。 你可以授予全局访问权限，也可以仅选择要部署的仓库。我将选择 `nextjs-fullstack-app-template-zn` 这个仓库。

选择它后，需要对其进行配置。 在 `Build and Output Settings` 部分，确保将默认的 NPM 命令替换为 yarn 命令（除非你使用的是 NPM）。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9c184e6b94b447f914d78a24e2b6ac3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

我们还没有使用任何环境变量，所以不需要添加

一旦完成，只需单击 `Deploy` 即可！ 就这么简单。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/befa5f520fcf45feb53176af7e9edc75~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

现在不仅部署了站点，而且每次提交到主分支时，它都会继续自动重新部署。 如果你不想要这种行为，那么在 Vercel 仪表板中进行配置也很容易。

好消息是，你已经配置了 `yarn build` 命令以确保在推送代码之前构建有效的生产版本，因此可以自信地推送代码，并假设部署会成功。

唯一需要记住的是两个环境之间的差异。 如果你的脚本不同（使用 NPM 而不是 yarn 或反之亦然），或者更常见的情况是缺少环境变量，你的构建仍然有可能在本地成功但在 Vercel 上失败。

我们将在以后的教程中添加 env 值，因此你需要确保在本地和生产环境中都配置了这些值，因为它们是机密，永远不应提交给公共仓库。

下一步
===

我希望你找到了本教程并学到了一些知识，为你和你的团队设置可靠且可扩展的 Next.js 项目。

这是关于创建生产高质量 Next.js 应用程序的系列教程的第一部分。

下面是我对未来教程的一些想法，我希望你能留下一些反馈，告诉我哪些是你认为最有用的（如果你没有在下面看到它们，则可以留下其他反馈）

*   如何使用 API 路由和 Tailwind CSS 构建全栈 Next.js 应用程序
*   如何使用 Recoil 将全局状态管理器添加到 Next.js 应用程序
*   如何使用 jest 和 playwright 在 Next.js 应用程序中实施单元测试和端到端测试
*   如何使用 Github actions 和 Vercel 创建 CI/CD 流水线
*   如何使用 NextAuth 和 i18next 在 Next.js 应用程序中实现 SSO 身份验证和国际化
*   如何使用 Prisma 和 Supabase 将数据库连接到 Next.js 应用程序
*   如何使用 Next.js 和 Nx 在 monorepo 中管理多个应用程序

请继续关注，请不要犹豫，提出任何问题，如果可以的话，我很乐意回答！
