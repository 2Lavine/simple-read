 # init matrix 
        matrix = [[0 for _ in range(n)] for _ in range(n)]

index in range(len(nums))) 
max  Number  float('inf')

None == None是相等的

True和 False 是大写的
用 and or not 来表示
#python #leetcode



s_dict.get(s[i]): 来获取sDict 中可能存在的 key=s[i]的元素
（不能直接用dict[s[i]]） 不存在会报错

## 二分法
right 永远无效，因此不可能取等号
`right=len(nums)
`# [left,right)
`while left<right:
 left,right 始终有效，因此可以取等号
`right = len(nums)-1
``#[left,right]
`while left<=right:


## Python 数组操作
在 Python 中，与 JavaScript 中的常用数组方法对应的方法如下：
1. `push`：在 Python 中，使用 `append` 方法来向列表中添加元素。例如，`arr.append(5)` 将数字 5 添加到列表 `arr` 的末尾。
2. `pop`：在 Python 中，使用 `pop` 方法来移除列表中的元素。默认情况下，`pop` 方法将移除并返回列表的最后一个元素。例如，`arr.pop()` 将移除并返回列表 `arr` 的最后一个元素。
3. `shift`：`arr.pop(0)` 将移除并返回列表 `arr` 的第一个元素。
4. `unshift`：使用切片和连接操作来实现类似的功能。例如，`arr = [5] + arr` 将数字 5 添加到列表 `arr` 的开头。或者insert方法 my_list.insert(0, 5)  # 在索引 0 处插入元素 5


## 二维数组生成
生成矩阵时，你使用了 arr = \[\[0\]*n\]*n，这会导致所有行都指向同一个列表对象。这意味着当你更新其中一行时，其他行也会被更新。你应该使用列表推导式生成矩阵，
如 arr = [[0]*n for _ in range(n)]。

## 移除元素
如果当前节点的值和给定的 val 相等，则将当前节点从链表中删除，
- 即将前一个节点 pre 的 next 指针指向当前节点的下一个节点 cur.next。
- 重点是 此时并不用移动 pre 节点 
如果当前节点的值和 val 不相等，则将 pre 移动到当前节点，继续遍历链表


## 翻转链表
定义pre,cur=>四步翻转
temp=cur.next
cur.next=pre
pre=cur
cur=temp


## 遍历节点
想要移动到最后一个节点或者不遍历最后一个节点： while cur.next:
想要遍历完最后一个节点:     while cur:


## Python 的字典是可以比较的

是的，两个字典可以直接使用相等运算符==
进行比较。当且仅当两个字典的键和对应的值都相等时，比较结果才为True。

示例：
```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'a': 1, 'b': 2, 'c': 3}
dict3 = {'a': 1, 'b': 2, 'c': 4}

print(dict1 == dict2)  # 输出: True
print(dict1 == dict3)  # 输出: False
```

在上述示例中，dict1和dict2的键和对应的值都相等，所以比较结果为True。而dict1和dict3的键相等，但值不相等，所以比较结果为False。

因此，在代码中使用`sDir == tDir`来比较两个字典是否相等是合法的。如果两个字典的键和对应的值都相等，则返回True；否则返回False。

## Python字典计算和
sum(sDir.values())是Python内置函数sum()的用法，用于计算字典中所有值的总和。

具体来说，sDir.values()返回一个可迭代对象，其中包含字典sDir中所有的值。然后，sum()函数将这些值相加，得到它们的总和。

## 遍历数组除第一个之外的其他元素
words\[1:\]表示从列表words的第二个元素开始，截取到列表末尾的部分。这样可以得到一个新的列表，其中包含了除第一个元素外的所有元素。在这种情况下，我们使用words[1:]来遍历除第一个单词外的所有单词。
for word in words\[1:\]:

## Python中的 ASCII 码
使用ord(letter) - ord('a')来计算差值。
用 chr 把 ASCII码转成字符


## Python中的 set
#python/set
直接用 newset=set(arr1)就可以
my_set = {1, 2, 3}
增加和删除元素 my_set.add(4) set.remove(4)
测试是否在   if 4 in my_set
集合的方法  union intersection difference

## Python中的dict ionary
#python/dict 
用{}或者 dict()来声明


## Python 中的 sort

如果要按照元素的大小进行降序排序，可以使用sort()方法的reverse参数：
```python
nums = [3, 1, 4, 2, 5]
nums.sort(reverse=True)
print(nums)  # 输出：[5, 4, 3, 2, 1]
```

如果要对列表中的元素进行自定义排序，可以使用sort()方法的key参数来指定排序的依据。
key参数接收一个函数，该函数将对列表中的每个元素进行处理，并返回一个用于排序的值。例如，按照元素的绝对值进行排序：
```python
nums = [-3, 1, -4, 2, 5]
nums.sort(key=abs)
print(nums)  # 输出：[1, 2, -3, -4, 5]
```

需要注意的是，sort()方法只适用于可排序的元素类型，例如数字、字符串等。对于自定义的对象，可以通过在对象类中实现__lt__方法来定义排序规则，然后使用sort()方法进行排序。


## Python中的数组方法
#python/array 
删除前后空白
s = s.strip()
反转整个字符串
s = s[::-1]
列表转成字符串
"-".join(sequence)
sequence表示要连接的串行，可以是列表、元组、字符串等。


---
join()函数只能用于字符串之间的连接，如果串行中包含非字符串类型的元素，需要先将其转换为字符串才能进行连接。例如：

numbers = [1, 2, 3]
result = '-'.join(str(num) for num in numbers)
print(result)

注意 py 的join 和js 的 join 相反
## Python 生成器
#python/generator 
range 是一个很常用的内置生成器。它接受以下输入值：
“start”（包括数字本身，默认为0）
“stop”（不包括数字本身）
“step”（默认为1）
### 生成器理解
Python提供了一个轻便的用一行代码定义简单生成器的语法；这种表达式叫做生成器理解（generator comprehension）
gene=(\[n, l\] for n in nums for l in letters if n!=1 and l!=2)for可以一直叠
相当于 js 中的generator，带有 next 和 value
可以用for i in gene遍历

### 生成器理解
是一种创建列表的语法
把生成器改成方括号

## python中的遍历
if letter in obj:
If letter in obj.keys():
这两个是等价的



#python/array 
用 stack[-1] 来获取 top元素

#python/除法
a//b 结果向下取整
int(number) 结果值保留整数部分
math.ceil, math.floor

#python/deque 
deque是一个双端队列
导入方法from collections import deque
append(x): 在deque的右侧添加元素x。
appendleft(x): 在deque的左侧添加元素x。
pop(): 移除并返回deque的最右侧的元素。
popleft(): 移除并返回deque的最左侧的元素。
rotate(n): 将deque中的元素向右循环移动n步（如果n是负数，则向左循环移动）。

#python/heapq
heapq 库是Python标准库之Lib，提供了构建小顶堆的方法
直接 import heapq 不用 from


在Python中，`deque`是`collections`模块中的一个类，而`heapq`是Python标准库中的一个模块。它们的导入方式略有不同,使用方式也不同。

   ```python
   from collections import deque
   d = deque()
   ```

2. `heapq`是Python标准库中的一个模块，用于实现堆（heap）数据结构。在导入时，只需要使用`import heapq`的方式即可。
3. 我们可以使用`heapq`模块中提供的函数来进行堆相关的操作。

   ```python
   import heapq
   heap = []
   heapq.heappush(heap, 1)
   ```

#python/heapq 使用方法
---
要创建堆，请使用初始化为[]的列表，或者您可以通过函数heapify()将填充列表转换为堆。
堆元素可以为元组。这样在第一个值（被比较的值）旁边添一个你实际要排序额值
```python
pri_que = [] #小顶堆
#用固定大小为k的小顶堆，扫描所有频率的数值
for key, freq in map_.items():
	heapq.heappush(pri_que, (freq, key))
	#堆元素可以为元组。这样在第一个值（被比较的值）旁边添一个你实际要排序额值
	if len(pri_que) > k: 
	#如果堆的大小大于了K，则队列弹出，保证堆的大小一直为k
		heapq.heappop(pri_que)
取出来值只要用queItem[1]
```




#python/math 
---
module 'math' has no attribute 'max'
直接用 max,min,abs

#python/类型转换 
---
可以用 str() 把 int 类型转成 字符串类型
用 chr( ) 把 ASCII 码转成字母


#python/nonlocal
---
在Python中，如果你想在嵌套函数中修改嵌套作用域外的变量，你需要使用nonlocal关键字。

你的代码中，ans是在sumOfLeftLeaves函数的作用域中定义的，但是在dfs函数中被修改。这是不允许的，除非你在dfs函数中使用nonlocal ans来声明你想要修改的是外部作用域的ans。

#python/type
---
树节点定义class TreeNode:
链表节点定义 class ListNode


#leetcode/tree/search_tree 
---
搜索二叉树是不能取等号的


---
=======move to md line=====


# todo python实现大根堆
# todo heapq的方法
# todo Python List 排序比较函数

key参数接收一个函数，它接收列表中的单个元素，然后返回一个值。
返回的值会用于 sort 比较
该函数将对列表中的每个元素进行处理，根据返回的值进行排序
```js
students = [('John', 20), ('Amy', 18), ('Bob', 22), ('Tom', 19)]
students.sort(key=lambda x: x[1])
或者
def getSecond(n):
	return n[1]
print(students)  
# 输出：[('Amy', 18), ('Tom', 19), ('John', 20), ('Bob', 22)]
```

基于多个键排序
如果你想基于多个键进行排序，可以返回一个包含这些键值的元组，如下所示：
```python
python
Copy code
data = [
    {'name': 'John', 'age': 25, 'score': 90},
    {'name': 'Jane', 'age': 25, 'score': 95},
    {'name': 'Dave', 'age': 23, 'score': 90}
# 首先按年龄排序，然后按分数排序
sorted_data = sorted(data, key=lambda x: (x['age'], x['score']))
```
print(sorted_data)
这将首先根据“age”键的值进行排序，然后在年龄相同的情况下，根据“score”键的值进行排序。


## enumerat用法
#python/enumerat 
在Python中，`enumerate`是一个内置函数，用于将一个可迭代对象（如列表、元组或字符串）组合为一个索引序列，同时返回索引和元素。

`enumerate`的语法如下：

```python
enumerate(iterable, start=0)
```

参数说明：
- `iterable`：要迭代的可迭代对象，如列表、元组、字符串等。
- `start`：可选参数，指定索引的起始值，默认为0。

下面是一些使用`enumerate`的示例：

```python
# 示例1：遍历列表，并打印每个元素及其索引
fruits = ['apple', 'banana', 'orange']
for index, fruit in enumerate(fruits):
    print(index, fruit)

# 示例2：使用指定的起始索引值
fruits = ['apple', 'banana', 'orange']
for index, fruit in enumerate(fruits, start=1):
    print(index, fruit)

# 示例3：将可迭代对象转换为字典
fruits = ['apple', 'banana', 'orange']
fruit_dict = dict(enumerate(fruits))
print(fruit_dict)
```

输出结果：
```
0 apple
1 banana
2 orange

1 apple
2 banana
3 orange

{0: 'apple', 1: 'banana', 2: 'orange'}
```

以上是`enumerate`函数的基本用法，它可以在循环中同时获取元素和索引，或者将可迭代对象转换为字典。

#python/insert 
result.insert(item[1],item)
#python/sort 
多种排序
people.sort(key=lambda item:(-item[0],item[1]))