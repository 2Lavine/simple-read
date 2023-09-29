 # init matrix 
        matrix = [[0 for _ in range(n)] for _ in range(n)]

index in range(len(nums))) 
max  Number  float('inf')

None == None是相等的

True和 False 是大写的
用 and or not 来表示


s_dict.get(s[i]): 来获取sDict 中可能存在的 key=s[i]的元素
（不能直接用dict[s[i]]） 不存在会报错

## 二分法
right 永远无效，因此不可能取等号
`right=len(nums)
`# [left,right)
`while left<=right:
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
