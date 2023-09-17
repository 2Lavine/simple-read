> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [javaguide.cn](https://javaguide.cn/tools/docker/docker-intro.html#%E5%8D%81-%E5%8F%82%E8%80%83)


### [#](#_1-1-什么是容器) 1.1 什么是容器?

容器就是将软件打包成标准化单元，以用于开发、交付和部署。
容器镜像是轻量的、可执行的独立软件包 ，包含软件运行所需的所有内容：代码、运行时环境、系统工具、系统库和设置。

### [#](#_2-2-docker-思想) 2.2 Docker 思想

*   **集装箱**
*   **标准化：** ① 运输方式 ② 存储方式 ③ API 接口
*   **隔离**

[#](#三-容器-vs-虚拟机) 三 容器 VS 虚拟机
-----------------------------

容器虚拟化的是操作系统而不是硬件，容器之间是共享同一套操作系统资源的。
虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统。
因此容器的隔离级别会稍低一些。

### [#](#_3-1-两者对比图) 3.1 两者对比
**容器是一个应用层抽象，用于将代码和依赖资源打包在一起。** **多个容器可以在同一台机器上运行，共享操作系统内核，但各自作为独立的进程在用户空间中运行** 。与虚拟机相比， **容器占用的空间较少**（容器镜像大小通常只有几十兆），**瞬间就能完成启动** 。

虚拟机 (VM) 是一个物理硬件层抽象，用于将一台服务器变成多台服务器。** 管理程序允许多个 VM 在一台机器上运行。每个 VM 都包含一整套操作系统、一个或多个应用、必要的二进制文件和库资源，因此 **占用大量空间** 。而且 VM **启动也十分缓慢** 。

[#](#四-docker-基本概念) 四 Docker 基本概念
---------------------------------

**Docker 中有非常重要的三个基本概念，

*   **镜像（Image）**
*   **容器（Container）**
*   **仓库（Repository）**

理解了这三个概念，就理解了 Docker 的整个生命周期

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5.jpeg)Docker 基本概念

### [#](#_4-1-镜像-image-一个特殊的文件系统) 4.1 镜像 (Image): 一个特殊的文件系统

**操作系统分为内核和用户空间**。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。

而 Docker 镜像（Image），就相当于是一个 root 文件系统。
**Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。** 
镜像不包含任何动态数据，其内容在构建之后也不会被改变。


---
Docker 设计时，就充分利用 **Union FS** 的技术，将其设计为**分层存储的架构** 。镜像实际是由多层文件系统联合组成。

**镜像构建时，会一层层构建，前一层是后一层的基础。
每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。** 
- 比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。
- 在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。
- 因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。

分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

### [#](#_4-2-容器-container-镜像运行时的实体) 4.2 容器 (Container): 镜像运行时的实体

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，
- 镜像是静态的定义，**容器是镜像运行时的实体。
- 容器可以被创建、启动、停止、删除、暂停等** 

**容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。前面讲过镜像使用的是分层存储，容器也是如此。**

**容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。**


---
按照 Docker 最佳实践的要求，**容器不应该向其存储层内写入任何数据** ，容器存储层要保持无状态化。
**所有的文件写入操作，都应该使用数据卷（Volume）、或者绑定宿主目录**，在这些位置的读写会跳过容器存储层，直接对宿主 (或网络存储) 发生读写，其性能和稳定性更高。
数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。
因此， **使用数据卷后，容器可以随意删除、重新 run ，数据却不会丢失。**

### [#](#_4-3-仓库-repository-集中存放镜像文件的地方) 4.3 仓库 (Repository): 集中存放镜像文件的地方

镜像构建完成后，可以很容易的在当前宿主上运行，但是， **如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。**

一个 Docker Registry 中可以包含多个仓库（Repository）；
每个仓库可以包含多个标签（Tag）；
每个标签对应一个镜像。
所以说：**镜像仓库是 Docker 用来集中存放镜像文件的地方类似于我们之前常用的代码仓库。**

通常，**一个仓库会包含同一个软件不同版本的镜像**，而**标签就常用于对应该软件的各个版本** 我们可以通过`<仓库名>:<标签>`的格式来指定具体是这个软件哪个版本的镜像。
如果不给出标签，将以 latest 作为默认标签.。


---
**这里补充一下 Docker Registry 公开服务和私有 Docker Registry 的概念：**
**Docker Registry 公开服务** 是开放给用户使用、允许用户管理镜像的 Registry 服务。一般这类公开服务允许用户免费上传、下载公开的镜像，并可能提供收费服务供用户管理私有镜像。

最常使用的 Registry 公开服务是官方的 **Docker Hub** ，这也是默认的 Registry，并拥有大量的高质量的官方镜像，
除了使用公开服务外，用户还可以在 **本地搭建私有 Docker Registry** 。Docker 官方提供了 Docker Registry 镜像，可以直接使用做为私有 Registry 服务。开源的 Docker Registry 镜像只提供了 Docker Registry API 的服务端实现，足以支持 docker 命令，不影响使用。但不包含图形界面，以及镜像维护、用户管理、访问控制等高级功能。


---
在 Docker Hub 的搜索结果中，有几项关键的信息有助于我们选择合适的镜像：

*   **OFFICIAL Image**：代表镜像为 Docker 官方提供和维护，相对来说稳定性和安全性较高。
*   **Stars**：和点赞差不多的意思，类似 GitHub 的 Star。
*   **Downloads**：代表镜像被拉取的次数，基本上能够表示镜像被使用的频度。


---
当然，除了直接通过 Docker Hub 网站搜索镜像这种方式外，我们还可以通过 `docker search` 这个命令搜索 Docker Hub 中的镜像，搜索的结果是一致的。

```
➜  ~ docker search mysql
NAME                              DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
mysql                             MySQL is a widely used, open-source relation…   8763                [OK]
mariadb                           MariaDB is a community-developed fork of MyS…   3073                [OK]
mysql/mysql-server                Optimized MySQL Server Docker images. Create…   650                                     [OK]
```




[#](#五-常见命令) 五 常见命令
-------------------

### [#](#_5-1-基本命令) 5.1 基本命令

```
docker version # 查看docker版本
docker images # 查看所有已下载镜像，等价于：docker image ls 命令
docker container ls # 查看所有容器
docker ps #查看正在运行的容器
docker image prune # 清理临时的、没有被使用的镜像文件。-a, --all: 删除所有没有用的镜像，而不仅仅是临时文件；
```

### [#](#_5-2-拉取镜像) 5.2 拉取镜像

```
docker search mysql # 查看mysql相关镜像
docker pull mysql:5.7 # 拉取mysql镜像
docker image ls # 查看所有已下载镜像
```

### [#](#_5-3-删除镜像) 5.3 删除镜像

比如我们要删除我们下载的 mysql 镜像。

通过 `docker rmi [image]` （等价于`docker image rm [image]`）删除镜像之前首先要确保这个镜像没有被容器引用（可以通过标签名称或者镜像 ID 删除）。通过我们前面讲的`docker ps`命令即可查看。

```
➜  ~ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
c4cd691d9f80        mysql:5.7           "docker-entrypoint.s…"   7 weeks ago         Up 12 days          0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
```

可以看到 mysql 正在被 id 为 c4cd691d9f80 的容器引用，我们需要首先通过 `docker stop c4cd691d9f80` 或者 `docker stop mysql`暂停这个容器。

然后查看 mysql 镜像的 id

```
➜  ~ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
mysql                   5.7                 f6509bac4980        3 months ago        373MB
```

通过 IMAGE ID 或者 REPOSITORY 名字即可删除

[#](#六-build-ship-and-run) 六 Build Ship and Run
-----------------------------------------------

**Docker 的概念以及常见命令基本上已经讲完，我们再来谈谈：Build, Ship, and Run。**
-   **Build（构建镜像）**：镜像就像是集装箱包括文件以及运行环境等等资源。
*   **Ship（运输镜像）**：主机和仓库间运输，这里的仓库就像是超级码头一样。
*   **Run （运行镜像）**：运行的镜像就是一个容器，容器就是运行程序的地方。

**Docker 运行过程也就是去仓库把镜像拉到本地，然后用一条命令把镜像运行起来变成容器。所以，我们也常常将 Docker 称为码头工人或码头装卸工，这和 Docker 的中文翻译搬运工人如出一辙。**

[#](#七-简单了解一下-docker-底层原理) 七 简单了解一下 Docker 底层原理
-----------------------------------------------

### [#](#_7-1-虚拟化技术) 7.1 虚拟化技术

Docker **容器虚拟化**技术为基础的软件，那么什么是虚拟化技术呢？


---
简单点来说，虚拟化技术可以这样定义：

虚拟化技术是一种资源管理技术，是将计算机的各种 [实体资源](https://zh.wikipedia.org/wiki / 資源_(計算機科學 "实体资源"))（[CPUopen in new window](https://zh.wikipedia.org/wiki/CPU "CPU")、[内存 open in new window](https://zh.wikipedia.org/wiki/%E5%86%85%E5%AD%98 "内存")、[磁盘空间 open in new window](https://zh.wikipedia.org/wiki/%E7%A3%81%E7%9B%98%E7%A9%BA%E9%97%B4 "磁盘空间")、[网络适配器 open in new window](https://zh.wikipedia.org/wiki/%E7%B6%B2%E8%B7%AF%E9%81%A9%E9%85%8D%E5%99%A8 "网络适配器") 等），予以抽象、转换后呈现出来并可供分割、组合为一个或多个电脑配置环境。由此，打破实体结构间的不可切割的障碍，使用户可以比原本的配置更好的方式来应用这些电脑硬件资源。这些资源的新虚拟部分是不受现有资源的架设方式，地域或物理配置所限制。一般所指的虚拟化资源包括计算能力和数据存储。

### [#](#_7-2-docker-基于-lxc-虚拟容器技术) 7.2 Docker 基于 LXC 虚拟容器技术

Docker 技术是基于 LXC（Linux container- Linux 容器）虚拟容器技术的。

LXC，其名称来自 Linux 软件容器（Linux Containers）的缩写，一种操作系统层虚拟化（Operating system–level virtualization）技术，为 Linux 内核容器功能的一个用户空间接口。
它将应用软件系统打包成一个软件容器（Container），内含应用软件本身的代码，以及所需要的操作系统核心和库。
通过统一的名字空间和共用 API 来分配不同软件容器的可用硬件资源，创造出应用程序的独立沙箱运行环境，使得 Linux 用户可以容易的创建和管理系统或应用容器。


---
LXC 技术主要是借助 Linux 内核中提供的 CGroup 功能和 namespace 来实现的，通过 LXC 可以为软件提供一个独立的操作系统运行环境。

#### namespace
  **namespace 是 Linux 内核用来隔离内核资源的方式。** 
通过 namespace 可以让一些进程只能看到与自己相关的一部分资源，而另外一些进程也只能看到与它们自己相关的资源，这两拨进程根本就感觉不到对方的存在。
具体的实现方式是把一个或多个进程的相关资源指定在同一个 namespace 中。
Linux namespaces 是对全局系统资源的一种封装隔离，使得处于不同 namespace 的进程拥有独立的全局系统资源，改变一个 namespace 中的系统资源只会影响当前 namespace 里的进程，对其他 namespace 中的进程没有影响。

#### CGroup
CGroup 是 Control Groups 的缩写，
* 是 Linux 内核提供的一种可以限制、记录、隔离进程组 (process groups) 所使用的物力资源 (如 cpu memory i/o 等等) 的机制。**
   

**cgroup 和 namespace 两者对比：**

两者都是将进程进行分组，但是两者的作用还是有本质区别。namespace 是为了隔离进程组之间的资源，而 cgroup 是为了对一组进程进行统一的资源监控和限制。
