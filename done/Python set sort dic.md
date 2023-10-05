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
#python/内置函数
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