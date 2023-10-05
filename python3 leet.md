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


---
=======move to md line=====


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

如果要对列表中的元素进行自定义排序，可以使用sort()方法的key参数来指定排序的依据。key参数接收一个函数，该函数将对列表中的每个元素进行处理，并返回一个用于排序的值。例如，按照元素的绝对值进行排序：
```python
nums = [-3, 1, -4, 2, 5]
nums.sort(key=abs)
print(nums)  # 输出：[1, 2, -3, -4, 5]
```

需要注意的是，sort()方法只适用于可排序的元素类型，例如数字、字符串等。对于自定义的对象，可以通过在对象类中实现__lt__方法来定义排序规则，然后使用sort()方法进行排序。