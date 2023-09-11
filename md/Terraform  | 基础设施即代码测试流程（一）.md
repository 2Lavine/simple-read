> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7024751669409742861/)

小知识，大挑战！本文正在参与 “[程序员必备小知识](https://juejin.cn/post/7008476801634680869 "https://juejin.cn/post/7008476801634680869")” 创作活动。  
本文同时参与 **[「掘力星计划」](https://juejin.cn/post/7012210233804079141 "https://juejin.cn/post/7012210233804079141")** ，赢取创作大礼包，挑战创作激励金。

> 为了满足持续集成持续部署，提高代码的健壮性，管理更多不同的云基础设施，需要通过测试代码提升代码将按预期执行的信心。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de626a8e5c39462eb25ea285119c9bed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

### 一、测试范围

我们可通过不同工具的组合，执行不同类型的测试，以提供更广泛的代码覆盖率。总的测试范围包括：

*   **集成测试**
*   **单元测试**
*   **合规性测试**
*   **端到端测试**

在所有的测试工具中，总体来讲的比较优秀的有 **Terratest** 和 **TFLint。**

### **二、集成测试**

集成测试旨在测试所有代码或整个系统， 集成测试验证新引入的代码不会入侵现有的代码。

在工作流中使用以下测试方法并将它们包含在 **CI** 管道中将构成集成测试：

*   **terraform fmt**，命令执行验证是否正确格式化代码 
*   **terraform validate**，命令执行验证语法是否正确
*   **terraform plan**，命令执行验证验证配置文件是否将按预期工作
*   **[TFLint](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fterraform-linters%2Ftflint "https://github.com/terraform-linters/tflint")**，验证配置的内容以及语法和结构，还检查帐户限制（例如，VM 实例类型是否有效，以及是否未达到 Azure 中的 VM 数量限制）

除了上面提到的测试方法，我们还可以对代码进行静态分析。**静态代码分析**可以直接在 Terraform 配置代码上进行，无需执行。 此分析可用于检测安全问题和合规性不一致等问题，

并应该构成 **CI** 管道的一部分。 它通常可以在 **CI** 管道中的 Terraform 安装和初始化阶段之前完成。

能完成对 Terraform 文件进行静态分析的工具包括：

*   **[Checkov](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbridgecrewio%2Fcheckov%2F "https://github.com/bridgecrewio/checkov/")**
*   **[Terrascan](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faccurics%2Fterrascan "https://github.com/accurics/terrascan")**
*   **[Tfsec](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faquasecurity%2Ftfsec "https://github.com/aquasecurity/tfsec")**
*   **[Deepsource](https://link.juejin.cn?target=https%3A%2F%2Fdeepsource.io%2Fblog%2Frelease-terraform-static-analysis%2F "https://deepsource.io/blog/release-terraform-static-analysis/")**

上面四种工具都提供对基础设施即代码的静态分析，其中一些并不仅仅支持支持 Terraform。

[Terratest](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgruntwork-io%2Fterratest "https://github.com/gruntwork-io/terratest") 是一个流行的 Terraform 测试框架（也用于单元和 端到端的测试），测试代码是用 Go 编写的。 除了测试 Terraform，其还可以用于测试 Packer、Docker、Kubernetes、

Vault 等许多其他产品。

另外，[kitchen-terraform](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fnewcontext-oss%2Fkitchen-terraform "https://github.com/newcontext-oss/kitchen-terraform") 是一种比较受欢迎的 Terraform 集成测试框架。 它基于 Ruby 编程语言，有 Chef 经验的用户可能更熟悉，其还可用于测试操作系统级别的内容。

可参照 Azure 官方文档的集成测试 - [基于 Azure 的集成测试](https://link.juejin.cn?target=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fdeveloper%2Fterraform%2Fbest-practices-integration-testing "https://docs.microsoft.com/en-us/azure/developer/terraform/best-practices-integration-testing")。

### **三、单元测试**

单元测试旨在测试特定功能、多个功能或部分代码。 可以隔离基础设施的较小部分，并且可以并行运行测试以缩短反馈周期。

**terraform plan** 是单元测试的一种形式——这可用于验证配置文件对于特定组件是否按预期工作, 但对于较大的项目，快速手动审查执行起来会相当困难。

[Rspec](https://link.juejin.cn?target=https%3A%2F%2Frspec.info%2F "https://rspec.info/") 和衍生框架（例如 Chef InSpec 或 ServerSpec）可用于执行测试驱动开发 (TDD)， 它们是基于 Ruby 编程语言编写的。

[Goss](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Faelsabbahy%2Fgoss "https://github.com/aelsabbahy/goss") 是一个被设计用于测试的工具，不是专门用于 Terraform 代码，而是用于测试结果（例如检查端口 22 是否打开并且可以访问），它是用 **YAML** 格式编写的。

同样，如上面讲到的，**Terratest** 也可用于单元测试（以及集成和 E2E 测试）。

少年，没看够？点击石头的主页，随便点点看看，说不定有惊喜呢？欢迎支持**点赞 / 关注 / 评论**，有你们的支持是我更文最大的动力，多谢啦！