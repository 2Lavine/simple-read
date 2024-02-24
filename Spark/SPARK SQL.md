## SPARK SQL
是Spark的一个模块, 用于处理结构化数据
使用SparkSQL直接计算并生成Hive数据表, SPARK
## SPARK vs HIVE

## 数据抽象
Pandas - DataFrame
	• 二维表数据结构
	• 单机(本地)集合
SparkCore - RDD
	• 无标准数据结构，存储什么数据均可 
	• 分布式集合(分区)
SparkSQL 的DataFrame
	• 二维表数据结构
	• 分布式集合(分区
DataFrame和RDD都是:弹性的、分布式的、数据集
![](https://raw.githubusercontent.com/2Lavine/ImgRep/main/img/202402211155398.png?token=AKMX3HTSEPCUQ5FABFIGOO3F2V2HM)

## SparkSql的数据抽象对象
• SchemaRDD对象(已废弃)
• DataSet对象:可用于Java、Scala语言
• DataFrame对象:可用于Java、Scala、Python 、R


## Spark Session
在RDD阶段，程序的执行入口对象是: SparkContext
在Spark 2.0后，推出了SparkSession对象，作为Spark编码的统一入口对象。
SparkSession对象可以:
- 用于SparkSQL编程作为入口对象
- 用于SparkCore编程，可以通过SparkSession对象中获取到SparkContext

## DataFrame的组成
在结构层面:
- StructType对象描述整个DataFrame的表结构 
- StructField对象描述一个列的信息
在数据层面
- Row对象记录一行数据
- Column对象记录一列数据并包含列的信息

## DataFrame 代码构建
DataFrame对象可以从RDD转换而来，都是分布式数据集 其实就是转换一下内部存储的结构，转换为二维表结构

1. df = spark.createDataFrame(rdd, schema = ['name', 'age'])
	1. 这里只传入列名称，类型从RDD中进行推断
2. 也可以创建 schema
```python
schema = StructType()
			.add("id", IntegerType(), nullable=False)
			.add("name", StringType(), nullable=True)
```
3. 也可以直接使用使用RDD的toDF方法转换RDD
	1. df = rdd.toDF(['id', 'subject', 'score'])
读取外部数据可以直接指定 inferSchema 为 true


## DSL风格和 SQL风格
DSL风格意思就是以调用API的方式来处理Data 比如:df.where().limit()
SQL风格就是使用SQL语句处理DataFrame的数据

## DSL基本方法
- df.show 默认展示20条
- df.printSchema() 输出df的schema信息
- select:选择DataFrame中的指定列(通过传入参数进行指定
- df.filter()df.where() where和filter功能上是等价的
- groupBy按照指定的列进行数据的分组 返回值是GroupedData对象

### groupedData 对象
- GroupedData对象其实也有很多API，
	- 比如前面的count方法就是这个对象的内置方法 除此之外，
	- 像:min、max、avg、sum等等许多方法都存在

## DF数据清洗
dropDuplicates可以去重
dropna可以删除缺失值
fillna可以填 充缺失值

## UDF函数
- 第一种：UDF(User-Defined-Function)函数
	- 一对一的关系，输入一个值经过函数以后输出一个值；
- 第二种：UDAF(User-Defined Aggregation Function)聚合函数
	- 多对一的关系，输入多个值输出一个值，通常与groupBy联合使用；

## SparkSQL 定义UDF函数
udf对象 = sparksession.udf.register(参数1，参数2，参数3) 
- 参数1:UDF名称，可用于SQL风格 
- 参数2:被注册成UDF的方法名
- 参数3:声明UDF的返回值类型
- udf对象: 返回值对象，是一个UDF对象，可用于DSL风格

udf对象 = F.udf(参数1， 参数2) 
- 参数1:被注册成UDF的方法名 
- 参数2:声明UDF的返回值类型
- udf对象: 返回值对象，是一个UDF对象，可用于DSL风格

## 窗口函数
- 窗口函数只用于SQL风格, 
开窗函数的是为了既显示聚集前的数据，又显示聚集后的数据。它能够不适用 Groupby 而同一行中同时返回基础行的列和聚合列。
- 聚合函数和开窗函数
	- 聚合函数是将多行变成一行，count,avg...
	- 开窗函数是将一行变成多行；
		- 聚合函数如果要显示其他的列必须将列加入到group by中
		- 开窗函数可以不使用group by,直接将所有信息显示出来
开窗函数分类
1.聚合开窗函数
- 聚合函数（列）OVER(选项）选项可以是PARTITION BY子句
2.排序开窗函数
- 排序函数（列）OVER(选项）可以是ORDER BY，PARTITION BY子句。
3.分区类型
	NTILE(number) Over (options)

## SParkSQL 自动优化
为什么SparkSQL可以自动优化 而RDD不可以?
- RDD:内含数据类型不限格式和结构 
- DataFrame:100% 是二维表结构，可以被针对
- SparkSQL的自动优化，依赖于:Catalyst优化 器

## Catalyst优化器
![](https://raw.githubusercontent.com/2Lavine/ImgRep/main/img/202402221636050.png)
## 优化总结
- 行过滤，提前执行where
	- 谓词下推（Predicate Pushdown)：将逻辑判断提前到前面，以减少shuffle阶段的数据量.
- 列过滤，提前规划select的字段数量
	- 列值裁剪（Column Pruning):将加载的列进行裁剪，尽量减少被处理数据的宽度
大白话：

## SPARK ON HIVE
SPARK SQL 执行的数据从哪里来？
- 表是来自DataFrame注册的.DataFrame中有数据，有字段，有类型，足够Spark用来翻译RDD用.
我们希望不从 DATAFRAME 注册 直接从文件获取数据
- Spark自己没有元数据管理功能
- 因此采用了 HIVE的元数据管理能力
## 分布式SQL执行引擎
分布式SQL执行引擎使用Spark提供的ThriftServer服务，以“后台 进程”的模式持续运行，对外提供端口。
- 可以通过客户端工具或者代码，以JDBC协议连接使用。
- SQL提交后，底层运行的就是Spark任务。
相当于构建了一个以MetaStore服务为元数据，Spark为执行引擎的数据库服务，像操作数据库那样方便的操作SparkSQL进行分布式的SQL 计算。