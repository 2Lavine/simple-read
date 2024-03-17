> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.aflybird.cn](https://blog.aflybird.cn/2023/09/zeabur-cli/#cli-%E6%96%87%E7%AB%A0%E5%B7%A5%E5%85%B7%E6%8E%A8%E8%8D%90)


#### Zeabur Architecture

你只要将代码托管到 GitHub，Zeabur 会监测代码变更，自动分析项目语言 / 框架，并自动构建与部署！
#### Zeabur Dashboard

Zeabur 有这样几个概念：

*   Service：一个代码库一个 Service；
*   Project：多个 Service 的集合；
*   Environment：一键创建新环境，用于隔离生产 / 测试 / 开发环境。


Zeabur CLI 应该具备：
*   用户模块：包含登录、登出等；
*   Zeabur 资源管理：包含 Service、Project、Environment 的创建、查询等等；
*   优秀的用户体验：友好的提示、现代化的 CLI UI、操作符合用户直觉等等；
*   多模式兼容：既能在交互式命令行中使用，也能在 CI/CD 中等非交互式环境中使用。
*   文档：包含使用文档、开发文档等等。
在交互式模式下，用户直接输入 `zeabur auth login`，我们将会自动打开浏览器，通过 Zeabur OAuth2 登录。
#### Zeabur CLI Login

原理如下，CLI 在后台启动一个 HTTP 服务，监听一个随机端口，充当 OAuth2 Client，然后打开浏览器，通过 Zeabur OAuth Server 完成登录。我们还内置了 Refresh Token 机制，默认在每次命令结束后，视情况刷新 Token。

当然，在非交互式环境下，也可通过 `zeabur auth login --token=xxx` 直接使用 Token 登录。

> 该模块代码在 [/pkg/auth](https://github.com/zeabur/cli/tree/main/pkg/auth) 与 [/pkg/webapp](https://github.com/zeabur/cli/tree/main/pkg/webapp) ，基于 [cli/oauth](https://github.com/cli/oauth) 进行修改。

Zeabur 的资源管理命令遵循以下的命令格式：

```
zeabur <resource> <action> [options]
```

例如，`zeabur service create` 用于创建 Service，`zeabur project list` 用于列出 Project。

大部分命令都设置了「参数（flag）」：

*   在非交互模式下，可以通过 `--flag=value` 指定参数；
*   在交互式模式下，既可以通过 `--flag=value` 指定参数，也可以不填任何参数，CLI 将自动检测缺失的参数，通过交互的方式让用户选择。

例如，当用户想要获取特定 Service 信息的时候，交互如下：

![](https://blog.aflybird.cn/2023/09/zeabur-cli/zeabur-cli-interact.png)

#### Zeabur CLI interact

1.  用户未指定 Service ID 或 Name，CLI 触发提示性参数补全
2.  Service 归属于 Project，而用户未指定 Project ID 或 Name，CLI 列出所有 Project，让用户选择
3.  由于用户只有一个 Project，CLI 自动选择该 Project
4.  CLI 列出该 Project 下的所有 Service，让用户选择
5.  用户可以通过方向键选择 Service，也可以输入进行模糊搜索

（当然，你也可以选择通过形如 `--service-id=xxx` 的方式指定 Service，这在非交互式环境下非常有用）

> 该模块代码在 [/pkg/prompt](https://github.com/zeabur/cli/tree/main/pkg/prompt), 基于 [go-survey](https://github.com/go-survey/survey) 。

虽然 Zeabur CLI 能够自动检测缺失的参数，但是通常我们会连续操作同一个资源（Project/Service/Environment），能不能只输入一次参数？

当然可以！

Zeabur 设计了上下文的概念，可以通过 `zeabur context set <project|service|environment>` 指定默认上下文。

同样的，在 `set` 上下文时，也可以通过交互的方式选择，而不用去记住 ID 或 Name。

我们设计了一个 `BasicInfo` 接口，用于抽象出对应的基本信息，例如 `Project`、`Service`、`Environment`。

```
// BasicInfo represents the basic information of a resource.
type BasicInfo interface {
	GetID() string
	GetName() string
	Empty() bool
}

// Context represents the current context of the CLI, including the current project, environment, service, etc.
type Context interface {
    GetProject() BasicInfo
    SetProject(project BasicInfo)
    ClearProject()
	
	// Service and Environment are similar
	// ...
    
    ClearAll()
}
```

因为几乎所有的资源都有 ID 和 Name 这两个属性，前者是唯一标识，后者在上下文明确的情况下，对用户更友好。

每当上下文更新的时候，对应信息会存储到 Zeabur CLI 的配置文档中（`~/.config/zeabur/cli.yaml`）。

如何实现自动保存上下文呢？其实 `zcontext` 本身也是 `Config` 的一部分，如下：

```
type Config interface {
	// other methods
	GetXXX()
	SetXXX()
	...

	GetContext() zcontext.Context   // get the context interface

	Write() error // the wrapper of viper.WriteConfig
}
```

Zeabur CLI 基于 [Cobra 命令行框架](https://github.com/spf13/cobra), 配置基于 [viper](https://github.com/spf13/viper), CLI 会在命令执行结束前，在 `PersistentPostRunE` 中调用 `Write` 方法，将配置持久化到文档中。

> 对应的代码在这里 [/pkg/zcontext](https://github.com/zeabur/cli/tree/main/pkg/zcontext) ，取名为 `zcontext` 是为了防止和 Go 的 `context` 冲突。

Zeabur 使用 [GoReleaser](https://goreleaser.com/) 进行自动发版，通过 `git tag` 触发 GitHub Action，将 CLI 发布到 Homebrew、Scoop、Install Script 等等。

![](https://blog.aflybird.cn/2023/09/zeabur-cli/zeabur-release.png)

#### Zeabur Release

> Homebrew 与 Scoop 由社区贡献，感谢 [@Abdfn](https://github.com/abdfnx)

Zeabur 遵循「依赖抽象而不是依赖于实现」的原则，将所有的功能抽象成接口，全部放到 `cmdutil.Factory` 中，
通过在项目初始化时，将对应的实现注入到 `Factory` 中，而不是直接在代码中调用相应的实现。

这是 Factory 的定义，可以看到，无论是日志，还是对 API 的调用，又或是交互式，都定义成了接口。

```
// Factory is a factory for command runners
	// It is used to pass common dependencies to commands.
	// It is kind of like a "context" for commands.
	Factory struct {
		Log         *zap.SugaredLogger // logger
		Printer     printer.Printer    // printer
		Config      config.Config      // config(flag, env, file)
		ApiClient   api.Client         // query api
		AuthClient  auth.Client        // login, refresh token
		Prompter    prompt.Prompter    // interactive prompter
		Selector    selector.Selector  // interactive selector
		ParamFiller fill.ParamFiller   // fill params
		PersistentFlags
	}
	// PersistentFlags are flags that are common to all commands
	PersistentFlags struct {
		Debug            bool // debug mode, default false
		Interactive      bool // interactive mode, default true
		AutoRefreshToken bool // auto refresh token, default true, only when token is from browser(OAuth2)
	}
```

这样的好处非常大：
1.  代码解耦，轻易替换 / 扩展实现（例如将 `ApiClent` 的默认 `GraphQL` 实现替换成 `RESTful`）
2.  便于测试，可以轻易 mock 掉对应的实现
3.  便于外部项目引入

同时我们使用了 [mockery](https://github.com/vektra/mockery) 生成了对应的 mock 实现，方便单元测试。

我们甚至为 `zap`(日志) 写了一个专门用于单元测试的 `mock` 实现，可以在测试时将日志输出到字符串数组中，可以实现日志比对级别的单元测试，「令人发指」。

你可能在前面注意到了，`cmdutil.Factory` 中有有这样几个接口：

```
type Factory struct {
    ...
	Prompter    prompt.Prompter    // interactive prompter
	Selector    selector.Selector  // interactive selector
    ParamFiller fill.ParamFiller   // fill params
    ...
}
```

其中，[`Prompter`](https://github.com/zeabur/cli/tree/main/pkg/prompt) 封装了基本的交互，比如传入一个列表，渲染，让用户选择，返回选择的结果。

[`Selector`](https://github.com/zeabur/cli/tree/main/pkg/selector) 的定义如下：

```
type (
	Selector interface {
		ProjectSelector
		ServiceSelector
		EnvironmentSelector
	}

	ProjectSelector interface {
		SelectProject() (zcontext.BasicInfo, *model.Project, error)
	}
	ServiceSelector interface {
		SelectService(projectID string) (zcontext.BasicInfo, *model.Service, error)
	}
	EnvironmentSelector interface {
		SelectEnvironment(projectID string) (zcontext.BasicInfo, *model.Environment, error)
	}
)
```

我们前面提到，当参数缺失的时候，我们会通过交互式的方式，让用户选择，就是通过 `Selector` 实现的。

例如，`ProjectSelector` 会列出所有的项目，让用户选择；`ServiceSelector` 会列出当前项目下的所有服务，让用户选择。

这就够了吗？——远远不够！我们还需要完善的参数补全中间件，这就是 `ParamFiller` 的作用。

参数补全是一个非常复杂的过程：

*   资源可以通过 ID 或者 Name 来指定；
*   需要考虑到前面的上下文，比如当前项目，当前服务，当前环境等等；
*   有些资源存在从属关系，例如 Service 依赖于 Project，所以在补全 Service 的时候，需要先补全 Project；
*   有些 API 接口同时支持 ID 和 Name，有些只支持 ID，有些只支持 Name。（这其实是 Zeabur Backend 的技术债导致的）。

[`ParamFiller`](https://github.com/zeabur/cli/blob/main/pkg/fill/fill.go) 的定义如下：

```
type ParamFiller interface {
	// Project fills the projectID if it is empty by asking user to select a project
	Project(projectID *string) (changed bool, err error)
	// ProjectByName makes sure either projectID or projectName is not empty
	// if necessary, it will ask user to select a project first
	ProjectByName(projectID, projectName *string) (changed bool, err error)
	// Environment fills the environmentID if it is empty by asking user to select an environment,
	// when the projectID is not empty, it will ask user to select a project first
	Environment(projectID, environmentID *string) (changed bool, err error)
	// Service fills the serviceID if it is empty by asking user to select a service,
	// when the projectID is not empty, it will ask user to select a project first
	Service(projectID, serviceID *string) (changed bool, err error)
	// ServiceByName makes sure either serviceID or serviceName is not empty by asking user to select a service,
	// if necessary, it will ask user to select a project first
	ServiceByName(projectCtx zcontext.Context, serviceID, serviceName *string) (changed bool, err error)
	// ServiceWithEnvironment fills the serviceID and environmentID if they are empty by asking user to select a service and an environment,
	// when the projectID is not empty, it will ask user to select a project first
	ServiceWithEnvironment(projectID, serviceID, environmentID *string) (changed bool, err error)
	// ServiceByNameWithEnvironment behaves like ServiceByName, but it will also fill the environmentID if it is empty
	ServiceByNameWithEnvironment(projectCtx zcontext.Context, serviceID, serviceName, environmentID *string) (changed bool, err error)
}
```

以 Project 为例，拥有两个方法：

*   `Project(projectID *string)`: 该方法确保`projectID`最后不为空。如果 `projectID` 为空，会交互式地让用户选择一个项目，然后填充 `projectID`。
*   `ProjectByName(projectID, projectName *string)`: 该方法确保 ID 或 Name 至少一个不为空，否则让用户交互式地选择一个项目，并告知调用方 `projectID` 和 `projectName` 是否发生了变化。（因为有的 API 接口只支持 ID，有的二者都支持，所以 `ParamFiller` 只能这么设计）

其他接口也是类似的，比如 Service 相关接口，会先填充 Project，再填充 Service。

使用方式，大概是这样的，例如在 `zeabur service get` 中，是这样的：

```
// f := cmdutil.NewFactory()
// type Options struct {
// 	id   string
// 	name string
// }
if _, err := f.ParamFiller.ServiceByName(f.Config.GetContext(), &opts.id, &opts.name); err != nil {
	return err
}
```

虽然只有一行代码，但它会：

*   检测 Project Context 是否为空，如果为空，会交互式地让用户选择一个项目，然后填充 Project Context
*   检测 id 和 name 是否都为空，如果都为空，会交互式地让用户选择一个服务，然后填充 id 和 name
*   最后保证：Project Context 不为空，id 和 name 至少一个不为空

*   [https://clig.dev/](https://clig.dev/)
*   [https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46](https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46)
*   [https://charm.sh/](https://charm.sh/)

[Zeabur CLI](https://github.com/zeabur/cli) 仍处于 beta 阶段，欢迎一起完善~🚀