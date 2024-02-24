
 ## RDD
 A distributed memory abstraction that lets programmers perform in-memory computations
on large clusters in a fault-tolerant manner.
- 是整个 Spark 的核心数据结构，Spark 整个平台都围绕着RDD进行

## Spark
Spark是一款分布式内存计算的统一分析引擎。 
- 其特点就是对任意类型的数据进行自定义计算
## Spark VS Hadoop
Spark仅做计算，而Hadoop生态圈不仅有计算(MR)也有存储(HDFS)和资源管理调度(YARN)
- 进程和线程的区别
Hadoop中的MR中每个map/reduce task都是一个java进程方式运行，
- 好处在于进程之间是互相独立的，每个task独享进程资源，没有互相干扰，监控方便，
- 问题在于task之间不方便共享数据，执行效率比较低。比如多个map task读取不同数据源文件需要将数据源加 载到每个map task中，造成重复加载和浪费内存。

Spark采用了线程的最小的执行 单位，
- 线程是CPU的基本调度单位
- 而基于线程的方式计算是为了数据共享和提高执行效率，
- 但缺点是线程之间会有资源竞争。

## Spark 模式
-  本地模式(单机)
本地模式就是以一个独立的进程，通过其内部的多个线程来模拟整个Spark运行时环境 
- Standalone模式(集群)
	- Standalone模 式是真实地在多个机器之间搭建Spark集群的环境
	- Spark中的各个角色以独立进程的形式存在，并组成Spark集群环境 
	- 运行在 linux 上而不是 yarn 上
- Hadoop YARN模式(集群)
Spark中的各个角色运行在YARN的容器内部，并组成Spark集群环境
 运行在 yarn 上而不是 Linux 上

Spark Standalone集群是Master-Slaves架构的集群模式，和大部分的Master-Slaves结构集群一样，存在着Master 单点故障(SPOF)的问题
## Spark 角色

资源管理层面
- 集群资源管理者(Master):ResourceManager 
- 单机资源管理者(Worker):NodeManager
	- 资源信息包含内存Memory和CPU Cores核数
任务计算层面
- 单任务管理者(Driver):ApplicationMaster
- 单任务执行者(Executor):Task(容器内计算框架的工作角色)

Master角色以Master进程存在, Worker角色以Worker进程存在 
Driver和Executor运行于Worker进程内, 由Worker提供资源供给它们运行
![Pasted image 20240220141924](https://raw.githubusercontent.com/2Lavine/ImgRep/main/img/Pasted%20image%2020240220141924.png?token=AKMX3HUJZ3APKBI2VB5FQCDF2RMZM)


## Spark模块
核心SparkCore、SQL计算(SparkSQL)、流计算(SparkStreaming )、图计算(GraphX)、机器学习(MLlib)

## Local 模式原理
Local模式就是以一个独立进程配合其内部线程来提供完成Spark运行时环境. 
Local 模式可以通过spark-shell/pyspark/spark-submit等来开启
## Local下的 Spark 角色
注意: Local模式只能运行一个Spark程序, 如果执行多个Spark程序, 那就是由多个相互独立的Local进程在执行

Local 下的角色分布:
资源管理: 
- Master:Local进程本身
- Worker:Local进程本身
任务执行:
Driver:Local进程本身
Executor:不存在，没有独立的Executor角色, 由Local进程(也就是Driver)内的线程提供计算能力
- Driver也算一种特殊的Executor, 
- 只不过多数时候, 我们将Executor当做纯Worker对待, 这样和Driver好区分(一类是管理 一类是工人)



## Spark应用架构
![Pasted image 20240220143547](https://raw.githubusercontent.com/2Lavine/ImgRep/main/img/Pasted%20image%2020240220143547.png?token=AKMX3HRHYAMNH2TL56MOAULF2RMZO)
1. Driver Program
整个应用管理者，负责应用中所有Job的调度执行;
运行JVM Process，运行程序的MAIN函数，必须创建SparkContext上下文对象;
一个SparkApplication仅有一个 Driver Program;
2.  Executors
相当于一个线程池，运行JVM Process，其中有很多线程，
- 每个线程运行一个Task任务，
- 一个Task任务运行需要1 Core CPU，
- 所有可以认为Executor中线程数就等于CPU Core核数;
- 一个Spark Application可以有多个exectuors，可以设置个数和资源信息


Driver创建 SparkContext ，
- SparkContext 实例会连接到 ClusterManager。 
	- Cluster Manager 会根据用户 提交时设置的 CPU 和内存等信息为本次提交分配计算资源，启动 Executor。


## 程序运行层次结构
一个Spark Application中，包含多个Job，
 - 每个Job执行按照DAG图进行的
- 每个Job有多个Stage组成，
Driver会将Job划分为不同的执行阶段Stage，
- 每个执行阶段Stage由一组完全相同Task组成，
	- 这些Task分别作用于待处 理数据的不同分区。
	- 这些 task 以线程来并行运行
Task分为两种
	- 一种是Shuffle Map Task，它实现数据的重新 洗牌，洗牌的结果保存到Executor 所在节点的文件系统中;
	- 一种是Result Task，它负责生成结果数据;

Driver会向Executor发送 Task,Executor在接收到Task，
- 执行Task，并且将Task的运行状态 汇报给Driver;
Driver会根据收到的Task的运行状态来处理不同的状态更新。 

Driver 会不断地调用Task，将Task发送到Executor执行，在所有的Task 都正确执行或者超过执行次数的限制仍然没有执行成 功时停止;

## SparkAlone HA
Spark Standalone集群是Master-Slaves架构的集群模式，和大部分的Master-Slaves结构集群一样，存在着Master 单点故障(SPOF)的问题

ZooKeeper提供了一个Leader Election机制
在集群中存在多个 Master 节点
- 虽然存在多个Master，但是只有一个是Active 的，其他的都是Standby。
- 当Active的Master出现故障时，另外的一个Standby Master会被选举出来。（被 zookeeper cluster）
- 由于集群的信息 ，包括Worker， Driver和Application的信息都已经持久化到文件系统，因此在切换的过程中只会影响新Job的提交，对 于正在进行的Job没有任何的影响。加入ZooKeeper的集群整体架构如下图所示
## zookeeper
为什么需要Zookeeper?
	分布式进程是分布在多个服务器上的, 状态之间的同步需要协调,比如谁是master,谁 是worker.谁成了master后要通知worker等, 这些需要中心化协调器Zookeeper来 进行状态统一协调


## Spark on yarn
在已有YARN集群的前提下在单独准备Spark StandAlone集群,对资源的利用就不高. 所以, 在企业中,多数场景下,会将Spark运行到YARN集群中

Spark On YARN, 无需部署Spark集群, 只要找一台服务器, 充当Spark的客户端, 即可提交任务到YARN集群 中运行

## Spark On Yarn的本质? 
由于有 yarn，所以不需要资源层次的管理(Master)，只需要具体任务上的管理(Driver)

Master角色由YARN的ResourceManager担任. 
Worker角色由YARN的NodeManager担任.
Driver角色运行在YARN容器内 或 提交任务的客户端进程中 
- 并没有替代 ApplicationMaster
真正干活的Executor运行在YARN提供的容器内
![Pasted image 20240220154831](https://raw.githubusercontent.com/2Lavine/ImgRep/main/img/Pasted%20image%2020240220154831.png?token=AKMX3HXX6O47LFW4CWRH5PDF2RMZO)


## Spark On YARN运行模式的,

两种模式的区别就是Driver运行的位置.
Cluster模式即:Driver运行在YARN容器内部, 和ApplicationMaster在同一个容器内
- 在容器中，所以和Exector 的通信效率更高
Client模式即:Driver运行在客户端进程中, 比如Driver运行在spark-submit程序的进程中
- 在客户端进程中，更方便查看 log
- 但容易受客户端进程影响，不时候生成环境
- （客户端暂时理解是运行时的终端）

## SPARK YARN 具体运行步骤

1. ResourceManager分配Container，在合适的NodeManager上启动ApplicationMaster，此时的 ApplicationMaster就是Driver;
	1. 如果是客户端模式则Driver在任务提交的本地机器上
	2. 但是仍然要 APplicationMaster 来管理提交容器的资源申请
2. Driver启动后向ResourceManager申请Executor内存
3. ResourceManager接到ApplicationMaster的资源申请 后会分配Container,然后在合适的NodeManager上启动Executor进程;
4. Executor进程启动后Driver注册;
5. Executor开始执行main函数
	1. 执行到Action算子时触发一个job，并根据宽依赖开始划分stage，
	2. 每个stage生成对应的taskSet，之后将task分发到各个Executor上执行;

## PySpark和bin/pyspark 程序有何区别?
PySpark是一个Python的类库, 提供Spark的操作API
- 只支持本地调试
- 不能再daemon（守护进程）上运行
bin/pyspark 是一个交互式的程序,可以提供交互式编程并执行Spark计算
- 属于标准Spark框架，支持分布式集群运行