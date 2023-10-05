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
