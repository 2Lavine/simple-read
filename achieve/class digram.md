## association
双向关联就是双方各自持有对方类型的成员变量
单向关联就是单方持有![[Pasted image 20230829121404.png]]
![[Pasted image 20230829122004.png]]
## aggregation is a special association
aggregation的图像是一边箭头一边菱形
have 对方类型的成员变量 and 强调是“整体”包含“部分”
## compositon is a special association
所以按照 association， compositon 的对象作为属性

## 依赖关系 
Supplier class is referred in one of the method:
• as a local variable
• as a input parameter
• as a return type
![[Pasted image 20230829122153.png]]