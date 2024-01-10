---
aliases: []
---

编程素养
    [看了这么多代码，谈一谈代码风格！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/代码风格.md)
    [力扣上的代码想在本地编译运行？](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/力扣上的代码想在本地编译运行？.md)
    [什么是核心代码模式，什么又是ACM模式？](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/什么是核心代码模式，什么又是ACM模式？.md)
    [刷题要不要用库函数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/刷力扣用不用库函数.md)
    [ACM模式如何构造二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/ACM模式如何构建二叉树.md)
    [解密互联网大厂研发流程](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/互联网大厂研发流程.md)

工具 
    [一站式vim配置](https://github.com/youngyangyang04/PowerVim)
    [保姆级Git入门教程，万字详解](https://mp.weixin.qq.com/s/Q_O0ey4C9tryPZaZeJocbA)
    [程序员应该用什么用具来写文档？](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/程序员写文档工具.md)

求职 
    [ACM模式练习网站，卡码网](https://kamacoder.com/)
    [程序员的简历应该这么写！！（附简历模板）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/程序员简历.md)
    [【专业技能】应该这样写！](https://programmercarl.com/other/jianlizhuanye.html)
    [【项目经历】应该这样写！](https://programmercarl.com/other/jianlixiangmu.html)
    [BAT级别技术面试流程和注意事项都在这里了](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/前序/BAT级别技术面试流程和注意事项都在这里了.md)



## 数组 

- [ ] [数组过于简单，但你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/数组理论基础.md) 
- [x] [数组：704.二分查找](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0704.二分查找.md) https://leetcode.cn/problems/binary-search/submissions/
- [x] [数组：27.移除元素](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0027.移除元素.md) https://leetcode.cn/problems/remove-element/description/
	- [ ] 用双指针在原数组上操作
- [x] [数组：977.有序数组的平方](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0977.有序数组的平方.md)    
- [x] [数组：209.长度最小的子数组](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0209.长度最小的子数组.md)
	1. [ ] 窗口的起始位置如何移动：如果当前窗口的值大于s了，窗口就要向前移动了（也就是该缩小了）。
	- [ ] 大于 s 再移动 left 就没有意义了。
- [x] [数组：59.螺旋矩阵II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0059.螺旋矩阵II.md)
- [ ] [数组：总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/数组总结篇.md)

## 链表

- [ ] [关于链表，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/链表理论基础.md)
- [x] [链表：203.移除链表元素](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0203.移除链表元素.md)
	- [ ] # 新建对象没有 new
	- [ ] 用哑结点,用 next.val 比较
	- [ ] return dummy.next instead of head bsc head may be deleted 
- [x] [链表：707.设计链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0707.设计链表.md)
	- [ ] 临界数据
	- [ ] get和 Delete的临界取不到 length，而 add的临界取得到length
- [x] [链表：206.翻转链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0206.翻转链表.md) 
	- [ ] 纯翻转不用空节点
	- [ ] 更改 next 之后，原来的 next 会改变,就会有节点变成孤岛
	- [ ] 注意用 cur.next和 cur 判断的不同
		- [ ] while cur.next判断，最后一个节点不会执行
		- [ ] cur判断，最后一个节点执行
- [x] [链表：24.两两交换链表中的节点](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0024.两两交换链表中的节点.md)
	- [ ] 判断哪个是 temp
	- [ ] 从左到右一步步转换箭头的方向，直到发现一个“孤岛”
	- [ ] cur 可以成为孤岛，因为已经有一个 cur 指向了这个节点
	- [ ] 由于是一次移动多个节点，所以要判断 cur.next是否为空要先判断cur是否为空
- [x] [链表：19.删除链表的倒数第 N 个结点](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0019.删除链表的倒数第N个节点.md)
	- [ ] 想要移动到最后一个节点或者不遍历最后一个节点： while cur.next:
	- [ ] 想要遍历完最后一个节点:     while cur:
- [x] [链表：链表相交](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/面试题02.07.链表相交.md)
- [x] [链表：142.环形链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0142.环形链表II.md)
- [ ] [链表：总结篇！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/链表总结篇.md)


## 哈希表

- [ ] [关于哈希表，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/哈希表理论基础.md)
- [x] [哈希表：242.有效的字母异位词](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0242.有效的字母异位词.md)
- [x] [哈希表：1002.查找常用字符](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1002.查找常用字符.md)
- [x] [哈希表：349.两个数组的交集](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0349.两个数组的交集.md)
- [x] [哈希表：202.快乐数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0202.快乐数.md)
- [x] [哈希表：1.两数之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0001.两数之和.md)
- [x] [哈希表：454.四数相加II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0454.四数相加II.md)
	- [ ] 重点在于遇到符合的要把所用情况相加
	- [ ] count += hashmap\[key\]而不是+1
- [x] [哈希表：383.赎金信](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0383.赎金信.md)
- [ ] [哈希表：15.三数之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0015.三数之和.md)
	- [ ] 双指针法
	- [ ] 当取到等号的时候要收缩两边的指针： 只收缩一边显然是不符合范围的
	- [ ] 收缩的时候要注意去重
	- [ ] 收缩的时候要注意范围
	- [ ] 同样调整 first 的时候注意范围
- [x] [双指针法：18.四数之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0018.四数之和.md)
	- [ ] 同三树之和
	- [ ] 前两个一次循环，然后后两个不断收缩确定
	- [ ] 前两个O(n^2) 收缩的是 O(n) 所以一共是 O(n^3)
- [ ] [哈希表：总结篇！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/哈希表总结.md)


## 字符串

- [ ] [字符串：344.反转字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0344.反转字符串.md)
- [ ] [字符串：541.反转字符串II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0541.反转字符串II.md)
- [ ] [字符串：替换空格](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/剑指Offer05.替换空格.md)
- [ ] [字符串：151.翻转字符串里的单词](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0151.翻转字符串里的单词.md)
- [ ] [字符串：左旋转字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/剑指Offer58-II.左旋转字符串.md)
- [ ] [帮你把KMP算法学个通透](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0028.实现strStr.md)
- [ ] [字符串：459.重复的子字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0459.重复的子字符串.md)
- [ ] [字符串：总结篇！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/字符串总结.md)

## 双指针法 

双指针法基本都是应用在数组，字符串与链表的题目上

- [x] [数组：27.移除元素](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0027.移除元素.md)
- [x] [字符串：344.反转字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0344.反转字符串.md)
- [x] [字符串：替换空格](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/剑指Offer05.替换空格.md)
- [x] [字符串：151.翻转字符串里的单词](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0151.翻转字符串里的单词.md)
- [ ] [链表：206.翻转链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0206.翻转链表.md)
- [ ] [链表：19.删除链表的倒数第 N 个结点](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0019.删除链表的倒数第N个节点.md)
- [ ] [链表：链表相交](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/面试题02.07.链表相交.md)
- [ ] [链表：142.环形链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0142.环形链表II.md)
- [ ] [双指针：15.三数之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0015.三数之和.md)
- [ ] [双指针：18.四数之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0018.四数之和.md)
- [ ] [双指针：总结篇！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/双指针总结.md)

## 栈与队列

[栈与队列：理论基础](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/栈与队列理论基础.md)
- [x] [栈与队列：232.用栈实现队列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0232.用栈实现队列.md)
	- [ ] out栈的顺序和队列是一样的
- [x] [栈与队列：225.用队列实现栈](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0225.用队列实现栈.md)
	- [ ] 一个队列。 自己 pop 自己 push 直到循环到最后一个（也就是栈的第一个）
- [x] [栈与队列：20.有效的括号](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0020.有效的括号.md)
	- [ ] 主要考虑极端情况
	- [ ] 最后如果不为空则是 False
	- [ ] POP之前要考虑是否会为空
- [x] [栈与队列：1047.删除字符串中的所有相邻重复项](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1047.删除字符串中的所有相邻重复项.md)
	- [ ] 
- [x] [栈与队列：150.逆波兰表达式求值](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0150.逆波兰表达式求值.md)
- [x] [栈与队列：239.滑动窗口最大值](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0239.滑动窗口最大值.md)
- [x] [栈与队列：347.前K个高频元素](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0347.前K个高频元素.md)
	- [ ] 小根堆可以每次把最小的去掉，因此可以保持前 k 个最大的元素
[栈与队列：总结篇！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/栈与队列总结.md)

## 二叉树 

[关于二叉树，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树理论基础.md)
- [x] 94中序 
- [x] 144前序 
- [x] 145后序
[二叉树：二叉树的递归遍历](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树的递归遍历.md)
[二叉树：二叉树的迭代遍历](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树的迭代遍历.md)
- [ ] 中序迭代遍历
	- [ ] 中序遍历必然结束再最右边的一个点
	- [ ] 最右边的一个点的右侧必然为空
	- [ ] 因为在处理二叉树的问题时，我们常常需要将当前节点的右子节点压入栈中，但是在这个问题中，我们需要对右子节点进行处理,s所以不是压入栈中而是直接处理
- [ ] [二叉树：二叉树的统一迭代法](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树的统一迭代法.md)
- [x] [二叉树：二叉树的层序遍历](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0102.二叉树的层序遍历.md) 
- [x] [二叉树：226.翻转二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0226.翻转二叉树.md) 
- [ ] [本周小结！（二叉树）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20200927二叉树周末总结.md)
- [x] [二叉树：101.对称二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0101.对称二叉树.md)
- [x] [二叉树：104.二叉树的最大深度](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0104.二叉树的最大深度.md)
- [x] [二叉树：111.二叉树的最小深度](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0111.二叉树的最小深度.md)
- [x] [二叉树：222.完全二叉树的节点个数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0222.完全二叉树的节点个数.md)
	- [ ] logN x logN 的复杂度
	- [ ] 如果左子树和右子树的高度相同，则左子树是一个满二叉树.
	- [ ] 如果不同，则右子树是一个满二叉树
- [ ] [二叉树：110.平衡二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0110.平衡二叉树.md)
	- [ ] 同计算高度，但是对于不平衡的情况额外返回-1
- [x] [二叉树：257.二叉树的所有路径](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0257.二叉树的所有路径.md)
- [ ] [本周总结！（二叉树）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201003二叉树周末总结.md)
---
- [ ] [二叉树：二叉树中递归带着回溯](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树中递归带着回溯.md)
- [x] [二叉树：404.左叶子之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0404.左叶子之和.md) not 迭代
- [x] [二叉树：513.找树左下角的值](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0513.找树左下角的值.md)
- [x] [二叉树：112.路径总和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0112.路径总和.md)
- [x] [二叉树：106.构造二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0106.从中序与后序遍历序列构造二叉树.md)
- [x] [二叉树：654.最大二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0654.最大二叉树.md)
	- [ ] 106和 654 的重点是不构造数组，直接有左右边界替代
- [ ] [本周小结！（二叉树）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201010二叉树周末总结.md) 
---
- [x] [二叉树：617.合并两个二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0617.合并二叉树.md)
- [x] [二叉树：700.二叉搜索树登场！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0700.二叉搜索树中的搜索.md)
- [x] [二叉树：98.验证二叉搜索树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0098.验证二叉搜索树.md)
- [x] [二叉树：530.搜索树的最小绝对差](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0530.二叉搜索树的最小绝对差.md)
- [ ] [二叉树：501.二叉搜索树中的众数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0501.二叉搜索树中的众数.md)
- [x] [二叉树：236.公共祖先问题](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0236.二叉树的最近公共祖先.md)
	- [ ] 递归 最后的基础点的处理
- [ ] [本周小结！（二叉树）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201017二叉树周末总结.md)

---
- [ ] [二叉树：235.搜索树的最近公共祖先](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0235.二叉搜索树的最近公共祖先.md)
	- [ ] 如果我在左子树中找不到p或q，我就返回右子树的结果，反之亦然。
	- [ ] 如果我在左右子树中都找到了p或q，我就返回root，因为root就是p和q的最低公共祖先
- [x] [二叉树：701.搜索树中的插入操作](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0701.二叉搜索树中的插入操作.md)
	- [ ] 返回节点，用父子树来接
- [ ] [二叉树：450.搜索树中的删除操作](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0450.删除二叉搜索树中的节点.md)
	- [ ] 方法 1： 找到右边最小的节点并且替换
	- [ ] 方法 2： 将左子树挂在右边最小的节点左侧，返回右子树的节点
	- [ ] 二叉搜索树 右树所有节点大于左树的所有节点 ！！
- [x] [二叉树：669.修剪二叉搜索树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0669.修剪二叉搜索树.md)
- [ ] [二叉树：108.将有序数组转换为二叉搜索树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0108.将有序数组转换为二叉搜索树.md)
	- [ ] 迭代法
- [ ] [二叉树：538.把二叉搜索树转换为累加树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0538.把二叉搜索树转换为累加树.md)
	- [ ] 右中左遍历
- [ ] [二叉树：总结篇！（需要掌握的二叉树技能都在这里了）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/二叉树总结篇.md)

## 回溯算法 

- [ ] [关于回溯算法，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/回溯算法理论基础.md)
- [x] [回溯算法：77.组合](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0077.组合.md)
- [ ] [回溯算法：77.组合优化](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0077.组合优化.md)
- [x] [回溯算法：216.组合总和III](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0216.组合总和III.md)
- [x] [回溯算法：17.电话号码的字母组合](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0017.电话号码的字母组合.md)
- [ ] [本周小结！（回溯算法系列一）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201030回溯周末总结.md)
- [x] [回溯算法：39.组合总和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0039.组合总和.md)
- [ ] [回溯算法：40.组合总和II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0040.组合总和II.md)
- [x] [回溯算法：131.分割回文串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0131.分割回文串.md)
- [x] [回溯算法：93.复原IP地址](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0093.复原IP地址.md)
- [x] [回溯算法：78.子集](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0078.子集.md)
- [ ] [本周小结！（回溯算法系列二）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201107回溯周末总结.md)
- [ ] [回溯算法：90.子集II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0090.子集II.md)
	- [ ] 去重为什么一定要排序
	- [ ] 为了让相同元素的在同一行出现（同一次循环出现），这样可以在这一次循环内进行条件判断
- [x] [回溯算法：491.递增子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0491.递增子序列.md)
	- [ ] 重复的处理： 
	- [ ] 用 used 数组
	- [ ] 这种方法不能适用于夹在中间的类型
- [x] [回溯算法：46.全排列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0046.全排列.md)
	- [ ] 排列是从 0 开始循环
	- [ ] 用 used 数组判断是否使用过
- [ ] [回溯算法：47.全排列II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0047.全排列II.md)
	- [ ] 三种方法去重： 排序，uset,used
- [ ] 全排列和子集的区别
	- [ ] 全排列问题和子集问题的处理方式不同，全排列问题关注元素的顺序，可以通过记录元素使用情况来避免重复，而子集问题不关注元素的顺序，需要通过排序和跳过相同元素来避免重复。
- [ ] [本周小结！（回溯算法系列三）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201112回溯周末总结.md)
- [ ] [回溯算法去重问题的另一种写法](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/回溯算法去重问题的另一种写法.md)
- [ ] [回溯算法：332.重新安排行程](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0332.重新安排行程.md)
- [x] [回溯算法：51.N皇后](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0051.N皇后.md)
- [ ] [回溯算法：37.解数独](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0037.解数独.md)
- [ ] [回溯算法总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/回溯总结.md)

## 贪心算法 
- [ ] [关于贪心算法，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/贪心算法理论基础.md)
- [x] [贪心算法：455.分发饼干](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0455.分发饼干.md)
- [ ] [贪心算法：376.摆动序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0376.摆动序列.md)
	- [ ] 只有变换的时候才会相加
	- [ ]  使用动规来解决
- [x] [贪心算法：53.最大子序和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0053.最大子序和.md)
- [ ] [本周小结！（贪心算法系列一）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201126贪心周末总结.md)
- [x] [贪心算法：122.买卖股票的最佳时机II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0122.买卖股票的最佳时机II.md)
- [x] [贪心算法：55.跳跃游戏](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0055.跳跃游戏.md)
- [x] [贪心算法：45.跳跃游戏II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0045.跳跃游戏II.md)
	- [ ] 每次都要更新最远的距离
- [x] [贪心算法：1005.K次取反后最大化的数组和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1005.K次取反后最大化的数组和.md)
- [ ] [本周小结！（贪心算法系列二）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201203贪心周末总结.md)

- [x] [贪心算法：134.加油站](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0134.加油站.md)
- [x] [贪心算法：135.分发糖果](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0135.分发糖果.md)
- [x] [贪心算法：860.柠檬水找零](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0860.柠檬水找零.md)
- [x] [贪心算法：406.根据身高重建队列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0406.根据身高重建队列.md)
- [ ] [本周小结！（贪心算法系列三）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201217贪心周末总结.md)
- [x] [贪心算法：406.根据身高重建队列（续集）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/根据身高重建队列（vector原理讲解）.md)
- [x] [贪心算法：452.用最少数量的箭引爆气球](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0452.用最少数量的箭引爆气球.md)
- [ ] [贪心算法：435.无重叠区间](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0435.无重叠区间.md)
	- [ ] 保持区间最小无重叠
- [x] [贪心算法：763.划分字母区间](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0763.划分字母区间.md)
- [x] [贪心算法：56.合并区间](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0056.合并区间.md)
- [ ] [本周小结！（贪心算法系列四）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20201224贪心周末总结.md)
- [x] [贪心算法：738.单调递增的数字](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0738.单调递增的数字.md)
	- [ ] 用list(str(n))  把字符串转成链表
	- [ ] chr(ord(list_n[i])-1)
- [ ] [贪心算法：968.监控二叉树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0968.监控二叉树.md)
	- [ ] 判断的顺序很重要
- [ ] [贪心算法：总结篇！（每逢总结必经典）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/贪心算法总结篇.md)

## 动态规划
- [ ] [关于动态规划，你该了解这些！](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/动态规划理论基础.md)
- [x] [动态规划：509.斐波那契数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0509.斐波那契数.md)
- [x] [动态规划：70.爬楼梯](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0070.爬楼梯.md)
- [x] [动态规划：746.使用最小花费爬楼梯](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0746.使用最小花费爬楼梯.md)
- [ ] [本周小结！（动态规划系列一）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210107动规周末总结.md)
- [x] [动态规划：62.不同路径](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0062.不同路径.md)
- [x] [动态规划：63.不同路径II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0063.不同路径II.md)
- [x] [动态规划：343.整数拆分](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0343.整数拆分.md)
	- [ ] j * (i - j) 是单纯的把整数拆分为两个数相乘，而j * dp[i - j]是拆分成两个以及两个以上的个数相乘。
	- [ ] 如果定义dp[i - j] * dp[j] 也是默认将一个数强制拆成4份以及4份以上了。
- [x] [动态规划：96.不同的二叉搜索树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0096.不同的二叉搜索树.md)
	- [x] 注意初始化
- [ ] [本周小结！（动态规划系列二）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210114动规周末总结.md)

- [ ] 背包问题系列：
- [x] [动态规划：01背包理论基础](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/背包理论基础01背包-1.md)
- [x] [动态规划：01背包理论基础（滚动数组）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/背包理论基础01背包-2.md)
- [x] [动态规划：416.分割等和子集](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0416.分割等和子集.md)
- [x] [动态规划：1049.最后一块石头的重量II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1049.最后一块石头的重量II.md)
- [ ] [本周小结！（动态规划系列三）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210121动规周末总结.md)
- [x] [动态规划：494.目标和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0494.目标和.md)
- [x] [动态规划：474.一和零](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0474.一和零.md) 
	- [ ] 重量有多个维度的背包
- [ ] [动态规划：完全背包总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/背包问题理论基础完全背包.md)
- [x] [动态规划：518.零钱兑换II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0518.零钱兑换II.md)
	- [ ] 如果求组合数就是外层for循环遍历物品，内层for遍历背包size。
	- [ ] 如果求排列数就是外层for遍历背包size，内层for循环遍历物品。
- [ ] [本周小结！（动态规划系列四）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210128动规周末总结.md)
- [x] [动态规划：377.组合总和Ⅳ](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0377.组合总和Ⅳ.md)
- [ ] [动态规划：70.爬楼梯（完全背包版本）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0070.爬楼梯完全背包版本.md)
- [x] [动态规划：322.零钱兑换](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0322.零钱兑换.md)
- [x] [动态规划：279.完全平方数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0279.完全平方数.md)
- [ ] [本周小结！（动态规划系列五）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210204动规周末总结.md)
- [x] [动态规划：139.单词拆分](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0139.单词拆分.md)
	- [ ] 本题其实我们求的是排列数
- [ ] [动态规划：多重背包理论基础](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/背包问题理论基础多重背包.md)
- [ ] [背包问题总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/背包总结篇.md)

打家劫舍系列：

- [x] [动态规划：198.打家劫舍](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0198.打家劫舍.md)
	- [ ] 初始化的特殊处理
- [x] [动态规划：213.打家劫舍II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0213.打家劫舍II.md)
	- [ ] 考虑两种情况，要么只算头，要么只算尾巴
	- [ ] 实际上就是分成两个子串，然后用198 的方法算
	- [ ] 注意临界值
- [x] [动态规划：337.打家劫舍III](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0337.打家劫舍III.md)
	- [ ] 考虑用记忆化递归

- [ ] 股票系列：
- [x] [动态规划：121.买卖股票的最佳时机](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0121.买卖股票的最佳时机.md)
- [ ] [动态规划：本周小结（系列六）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210225动规周末总结.md)
- [x] [动态规划：122.买卖股票的最佳时机II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0122.买卖股票的最佳时机II（动态规划）.md)
- [x] [动态规划：123.买卖股票的最佳时机III](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0123.买卖股票的最佳时机III.md)
- [x] [动态规划：188.买卖股票的最佳时机IV](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0188.买卖股票的最佳时机IV.md)
- [ ] [动态规划：309.最佳买卖股票时机含冷冻期](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0309.最佳买卖股票时机含冷冻期.md)
- [ ] [动态规划：本周小结（系列七）](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/周总结/20210304动规周末总结.md)
- [x] [动态规划：714.买卖股票的最佳时机含手续费](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0714.买卖股票的最佳时机含手续费（动态规划）.md)
- [ ] [动态规划：股票系列总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/动态规划-股票问题总结篇.md)

- [ ] 子序列系列： 
- [x] [动态规划：300.最长递增子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0300.最长上升子序列.md)
	- [ ] 最终答案不一定是 dp 的最后一个
- [x] [动态规划：674.最长连续递增序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0674.最长连续递增序列.md)
- [x] [动态规划：718.最长重复子数组](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0718.最长重复子数组.md)
	- [ ] 初始化考虑
- [x] [动态规划：1143.最长公共子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1143.最长公共子序列.md)
	- [ ] 公共子序列和子数组的区别
- [x] [动态规划：1035.不相交的线](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1035.不相交的线.md)
	- [ ] 就是最长公共子序列
- [x] [动态规划：53.最大子序和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0053.最大子序和（动态规划）.md)
- [x] [动态规划：392.判断子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0392.判断子序列.md)
- [ ] [动态规划：115.不同的子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0115.不同的子序列.md)
- [x] [动态规划：583.两个字符串的删除操作](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0583.两个字符串的删除操作.md)
- [x] [动态规划：72.编辑距离](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0072.编辑距离.md)
- [ ] [编辑距离总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/为了绝杀编辑距离，卡尔做了三步铺垫.md)
- [ ] [动态规划：647.回文子串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0647.回文子串.md)
	- [ ] 用双指针更快
- [x] [动态规划：516.最长回文子序列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0516.最长回文子序列.md)
- [ ] [动态规划总结篇](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/动态规划总结篇.md)


## 单调栈 

- [x] [单调栈：739.每日温度](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0739.每日温度.md)
	- [ ] 位置一个单调递减的队列，来获取第一个最大的数
- [x] [单调栈：496.下一个更大元素I](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0496.下一个更大元素I.md)
- [x] [单调栈：503.下一个更大元素II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0503.下一个更大元素II.md)
- [ ] [单调栈：42.接雨水](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0042.接雨水.md)
	- [ ] 还是分三类情况来写
	- [ ] 如果是大于中间节点，一定要先 pop 出来
		- [ ] 存在stack 只有1个节点的情况，此时如果大于这个节点应该更新
		- [ ] 采用stack[-2]的写法会导致不更新此时的节点
	- [ ] 要不断循环的往前面去找节点
	- [ ] 
- [ ] [单调栈：84.柱状图中最大的矩形](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0084.柱状图中最大的矩形.md)


### 图论 深搜广搜  

- [ ] [图论：深度优先搜索理论基础](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/图论深搜理论基础.md)
- [x] [图论：797.所有可能的路径](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0797.所有可能的路径.md)
	- [ ] 注意 深搜要做 used 标记
- [ ] [图论：广度优先搜索理论基础](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/图论广搜理论基础.md)
- [x] [图论：200.岛屿数量.深搜版](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0200.岛屿数量.深搜版.md)
- [x] [图论：200.岛屿数量.广搜版](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0200.岛屿数量.广搜版.md)
- [x] [图论：695.岛屿的最大面积](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0695.岛屿的最大面积.md)
	- [ ] 广搜的核心是什么时候处理 que 里的数据
	- [ ] 是放入 que 的时候处理还是从 que 里取出的时候处理
- [x] [图论：1020.飞地的数量](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1020.飞地的数量.md)
- [x] [图论：130.被围绕的区域](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0130.被围绕的区域.md)
	- [ ] 去掉之后剩下的 O 都是被 X 给围住的（因为没有和边界的 O 直接接触）
- [x] [图论：417.太平洋大西洋水流问题](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0417.太平洋大西洋水流问题.md)
	- [ ] 使用抽象出来的 bfs 来减少代码 - -
## 十大排序

## 数论 

## 高级数据结构经典题目 

并查集 
最小生成树 
线段树 
树状数组 
字典树 

## 数组

[1365.有多少小于当前数字的数字](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1365.有多少小于当前数字的数字.md)
[941.有效的山脉数组](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0941.有效的山脉数组.md)  （双指针）
[1207.独一无二的出现次数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1207.独一无二的出现次数.md) 数组在哈希法中的经典应用
[283.移动零](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0283.移动零.md) 【数组】【双指针】
[189.旋转数组](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0189.旋转数组.md)
[724.寻找数组的中心索引](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0724.寻找数组的中心索引.md)
[34.在排序数组中查找元素的第一个和最后一个位置](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0034.在排序数组中查找元素的第一个和最后一个位置.md) （二分法）
[922.按奇偶排序数组II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0922.按奇偶排序数组II.md) 
[35.搜索插入位置](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0035.搜索插入位置.md)

## 链表

[24.两两交换链表中的节点](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0024.两两交换链表中的节点.md)
[234.回文链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0234.回文链表.md)
[143.重排链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0143.重排链表.md)【数组】【双向队列】【直接操作链表】
[141.环形链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0141.环形链表.md)
[160.相交链表](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/面试题02.07.链表相交.md)

## 哈希表
[205.同构字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0205.同构字符串.md):【哈希表的应用】

## 字符串
[925.长按键入](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0925.长按键入.md) 模拟匹配
[0844.比较含退格的字符串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0844.比较含退格的字符串.md)【栈模拟】【空间更优的双指针】

## 二叉树
[129.求根到叶子节点数字之和](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0129.求根到叶子节点数字之和.md)
[1382.将二叉搜索树变平衡](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1382.将二叉搜索树变平衡.md) 构造平衡二叉搜索树
[100.相同的树](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0100.相同的树.md) 同101.对称二叉树 一个思路
[116.填充每个节点的下一个右侧节点指针](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0116.填充每个节点的下一个右侧节点指针.md)

## 回溯算法 

[52.N皇后II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0052.N皇后II.md)

## 贪心
[649.Dota2参议院](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0649.Dota2参议院.md) 有难度
[1221.分割平衡字符](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1221.分割平衡字符串.md) 简单贪心

## 动态规划 
[5.最长回文子串](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0005.最长回文子串.md) 和[647.回文子串](https://mp.weixin.qq.com/s/2WetyP6IYQ6VotegepVpEw) 差不多是一样的
[132.分割回文串II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0132.分割回文串II.md) 与647.回文子串和 5.最长回文子串 很像
[673.最长递增子序列的个数](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0673.最长递增子序列的个数.md) 

## 图论
[463.岛屿的周长](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0463.岛屿的周长.md) （模拟）
[841.钥匙和房间](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0841.钥匙和房间.md) 【有向图】dfs，bfs都可以
[127.单词接龙](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0127.单词接龙.md) 广搜

## 并查集 
[684.冗余连接](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0684.冗余连接.md) 【并查集基础题目】
[685.冗余连接II](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0685.冗余连接II.md)【并查集的应用】

## 模拟
[657.机器人能否返回原点](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0657.机器人能否返回原点.md) 
[31.下一个排列](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/0031.下一个排列.md) 

## 位运算
[1356.根据数字二进制下1的数目排序](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/1356.根据数字二进制下1的数目排序.md) 
