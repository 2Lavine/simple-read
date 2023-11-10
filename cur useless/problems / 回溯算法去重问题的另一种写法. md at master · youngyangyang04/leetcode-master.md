> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [github.com](https://github.com/youngyangyang04/leetcode-master/blob/master/problems/%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E5%8E%BB%E9%87%8D%E9%97%AE%E9%A2%98%E7%9A%84%E5%8F%A6%E4%B8%80%E7%A7%8D%E5%86%99%E6%B3%95.md)

![](https://github.com/youngyangyang04/leetcode-master/raw/master/pics/训练营.png)

**[参与本项目](https://mp.weixin.qq.com/s/tqCxrMEU-ajQumL1i8im9A)，贡献其他语言版本的代码，拥抱开源，让更多学习算法的小伙伴们收益！**

[回溯算法去重问题的另一种写法](#回溯算法去重问题的另一种写法)
=================================

> 在 [本周小结！（回溯算法系列三）](https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201112%E5%9B%9E%E6%BA%AF%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html) 中一位录友对 整棵树的本层和同一节点的本层有疑问，也让我重新思考了一下，发现这里确实有问题，所以专门写一篇来纠正，感谢录友们的积极交流哈！

接下来我再把这块再讲一下。

在[回溯算法：求子集问题（二）](https://programmercarl.com/0090.%E5%AD%90%E9%9B%86II.html)中的去重和 [回溯算法：递增子串行](https://programmercarl.com/0491.%E9%80%92%E5%A2%9E%E5%AD%90%E5%BA%8F%E5%88%97.html)中的去重 都是 同一父节点下本层的去重。

[回溯算法：求子集问题（二）](https://programmercarl.com/0090.%E5%AD%90%E9%9B%86II.html)也可以使用 set 针对同一父节点本层去重，但子集问题一定要排序，为什么呢？

我用没有排序的集合 {2,1,2,2} 来举例子画一个图，如图：

![](https://camo.githubusercontent.com/2842d018827afab2ebda8dfd31028b47ac8d5aac4fe8d4bcdc3face3823bfc62/68747470733a2f2f636f64652d7468696e6b696e672d313235333835353039332e66696c652e6d7971636c6f75642e636f6d2f706963732f323032303131313331363434303437392d32303233303331303132313933303331362e706e67)

图中，大家就很明显的看到，子集重复了。

那么下面我针对[回溯算法：求子集问题（二）](https://programmercarl.com/0090.%E5%AD%90%E9%9B%86II.html) 给出使用 set 来对本层去重的代码实现。

[90. 子集 II](#90子集ii)
--------------------

used 数组去重版本： [回溯算法：求子集问题（二）](https://programmercarl.com/0090.%E5%AD%90%E9%9B%86II.html)

使用 set 去重的版本如下：

```
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    void backtracking(vector<int>& nums, int startIndex, vector<bool>& used) {
        result.push_back(path);
        unordered_set<int> uset; // 定义set对同一节点下的本层去重
        for (int i = startIndex; i < nums.size(); i++) {
            if (uset.find(nums[i]) != uset.end()) { // 如果发现出现过就pass
                continue;
            }
            uset.insert(nums[i]); // set跟新元素
            path.push_back(nums[i]);
            backtracking(nums, i + 1, used);
            path.pop_back();
        }
    }

public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        result.clear();
        path.clear();
        vector<bool> used(nums.size(), false);
        sort(nums.begin(), nums.end()); // 去重需要排序
        backtracking(nums, 0, used);
        return result;
    }
};
```

针对留言区录友们的疑问，我再补充一些常见的错误写法，

### [错误写法一](#错误写法一)

把 uset 定义放到类成员位置，然后模拟回溯的样子 insert 一次，erase 一次。

例如：

```
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    unordered_set<int> uset; // 把uset定义放到类成员位置
    void backtracking(vector<int>& nums, int startIndex, vector<bool>& used) {
        result.push_back(path);

        for (int i = startIndex; i < nums.size(); i++) {
            if (uset.find(nums[i]) != uset.end()) {
                continue;
            }
            uset.insert(nums[i]);   // 递归之前insert
            path.push_back(nums[i]);
            backtracking(nums, i + 1, used);
            path.pop_back();
            uset.erase(nums[i]);    // 回溯再erase
        }
    }
```

在树形结构中，**如果把 unordered_set uset 放在类成员的位置（相当于全局变量），就把树枝的情况都记录了，不是单纯的控制某一节点下的同一层了**。

如图：

![](https://camo.githubusercontent.com/2c62e2984f4b0efbe3b3d716cea0fb7638b31edf8628b77026cf260efc8fec1b/68747470733a2f2f636f64652d7468696e6b696e672d313235333835353039332e66696c652e6d7971636c6f75642e636f6d2f706963732f3230323031313133313632353035342e706e67)

可以看出一旦把 unordered_set uset 放在类成员位置，它控制的就是整棵树，包括树枝。

**所以这么写不行！**

### [错误写法二](#错误写法二)

有同学把 unordered_set uset; 放到类成员位置，然后每次进入单层的时候用 uset.clear()。

代码如下：

```
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    unordered_set<int> uset; // 把uset定义放到类成员位置
    void backtracking(vector<int>& nums, int startIndex, vector<bool>& used) {
        result.push_back(path);
        uset.clear(); // 到每一层的时候，清空uset
        for (int i = startIndex; i < nums.size(); i++) {
            if (uset.find(nums[i]) != uset.end()) {
                continue;
            }
            uset.insert(nums[i]); // set记录元素
            path.push_back(nums[i]);
            backtracking(nums, i + 1, used);
            path.pop_back();
        }
    }
```

uset 已经是全局变量，本层的 uset 记录了一个元素，然后进入下一层之后这个 uset（和上一层是同一个 uset）就被清空了，也就是说，层与层之间的 uset 是同一个，那么就会相互影响。

**所以这么写依然不行！**

**组合问题和排列问题，其实也可以使用 set 来对同一节点下本层去重，下面我都分别给出实现代码**。

[40. 组合总和 II](#40-组合总和-ii)
--------------------------

使用 used 数组去重版本：[回溯算法：求组合总和（三）](https://programmercarl.com/0040.%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8CII.html)

使用 set 去重的版本如下：

```
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    void backtracking(vector<int>& candidates, int target, int sum, int startIndex) {
        if (sum == target) {
            result.push_back(path);
            return;
        }
        unordered_set<int> uset; // 控制某一节点下的同一层元素不能重复
        for (int i = startIndex; i < candidates.size() && sum + candidates[i] <= target; i++) {
            if (uset.find(candidates[i]) != uset.end()) {
                continue;
            }
            uset.insert(candidates[i]); // 记录元素
            sum += candidates[i];
            path.push_back(candidates[i]);
            backtracking(candidates, target, sum, i + 1);
            sum -= candidates[i];
            path.pop_back();
        }
    }

public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        path.clear();
        result.clear();
        sort(candidates.begin(), candidates.end());
        backtracking(candidates, target, 0, 0);
        return result;
    }
};
```

[47. 全排列 II](#47-全排列-ii)
------------------------

使用 used 数组去重版本：[回溯算法：排列问题（二）](https://programmercarl.com/0047.%E5%85%A8%E6%8E%92%E5%88%97II.html)

使用 set 去重的版本如下：

```
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    void backtracking (vector<int>& nums, vector<bool>& used) {
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }
        unordered_set<int> uset; // 控制某一节点下的同一层元素不能重复
        for (int i = 0; i < nums.size(); i++) {
            if (uset.find(nums[i]) != uset.end()) {
                continue;
            }
            if (used[i] == false) {
                uset.insert(nums[i]); // 记录元素
                used[i] = true;
                path.push_back(nums[i]);
                backtracking(nums, used);
                path.pop_back();
                used[i] = false;
            }
        }
    }
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        result.clear();
        path.clear();
        sort(nums.begin(), nums.end()); // 排序
        vector<bool> used(nums.size(), false);
        backtracking(nums, used);
        return result;
    }
};
```

[两种写法的性能分析](#两种写法的性能分析)
-----------------------

需要注意的是：**使用 set 去重的版本相对于 used 数组的版本效率都要低很多**，大家在 leetcode 上提交，能明显发现。

原因在[回溯算法：递增子串行](https://programmercarl.com/0491.%E9%80%92%E5%A2%9E%E5%AD%90%E5%BA%8F%E5%88%97.html)中也分析过，主要是因为程序运行的时候对 unordered_set 频繁的 insert，unordered_set 需要做哈希映射（也就是把 key 通过 hash function 映射为唯一的哈希值）相对费时间，而且 insert 的时候其底层的符号表也要做相应的扩充，也是费时的。

**而使用 used 数组在时间复杂度上几乎没有额外负担！**

**使用 set 去重，不仅时间复杂度高了，空间复杂度也高了**，在[本周小结！（回溯算法系列三）](https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201112%E5%9B%9E%E6%BA%AF%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html)中分析过，组合，子集，排列问题的空间复杂度都是 O(n)，但如果使用 set 去重，空间复杂度就变成了 O(n^2)，因为每一层递归都有一个 set 集合，系统栈空间是 n，每一个空间都有 set 集合。

那有同学可能疑惑 用 used 数组也是占用 O(n) 的空间啊？

used 数组可是全局变量，每层与每层之间公用一个 used 数组，所以空间复杂度是 O(n + n)，最终空间复杂度还是 O(n)。

[总结](#总结)
---------

本篇本打算是对[本周小结！（回溯算法系列三）](https://programmercarl.com/%E5%91%A8%E6%80%BB%E7%BB%93/20201112%E5%9B%9E%E6%BA%AF%E5%91%A8%E6%9C%AB%E6%80%BB%E7%BB%93.html)的一个点做一下纠正，没想到又写出来这么多！

**这个点都源于一位录友的疑问，然后我思考总结了一下，就写着这一篇，所以还是得多交流啊！**

如果大家对「代码随想录」文章有什么疑问，尽管打卡留言的时候提出来哈，或者在交流群里提问。

**其实这就是相互学习的过程，交流一波之后都对题目理解的更深刻了，我如果发现文中有问题，都会在评论区或者下一篇文章中即时修正，保证不会给大家带跑偏！**

[其他语言版本](#其他语言版本)
-----------------

### [Java](#java)

**47. 全排列 II**

```
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();
    private boolean[] used = null;

    public List<List<Integer>> permuteUnique(int[] nums) {
        used = new boolean[nums.length];
        Arrays.sort(nums);
        backtracking(nums);
        return res;
    }

    public void backtracking(int[] nums) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        HashSet<Integer> hashSet = new HashSet<>();//层去重
        for (int i = 0; i < nums.length; i++) {
            if (hashSet.contains(nums[i]))
                continue;
            if (used[i] == true)//枝去重
                continue;
            hashSet.add(nums[i]);//记录元素
            used[i] = true;
            path.add(nums[i]);
            backtracking(nums);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

**90. 子集 II**

```
class Solution {
    List<List<Integer>> reslut = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();
    
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        if(nums.length == 0){
            reslut.add(path);
            return reslut;
        }
        Arrays.sort(nums);
        backtracking(nums,0);
        return reslut;
    }

    public void backtracking(int[] nums,int startIndex){
        reslut.add(new ArrayList<>(path));
        if(startIndex >= nums.length)return;
        HashSet<Integer> hashSet = new HashSet<>();
        for(int i = startIndex; i < nums.length; i++){
            if(hashSet.contains(nums[i])){
                continue;
            }
            hashSet.add(nums[i]);
            path.add(nums[i]);
            backtracking(nums,i+1);
            path.removeLast();
        }
    }
}
```

**40. 组合总和 II**

```
class Solution {
    List<List<Integer>> result = new ArrayList<>();
    LinkedList<Integer> path = new LinkedList<>();
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort( candidates );
        if( candidates[0] > target ) return result;
        backtracking(candidates,target,0,0);
        return result;
    }

    public void backtracking(int[] candidates,int target,int sum,int startIndex){
        if( sum > target )return;
        if( sum == target ){
            result.add( new ArrayList<>(path) );
        }
        HashSet<Integer> hashSet = new HashSet<>();
        for( int i = startIndex; i < candidates.length; i++){
            if( hashSet.contains(candidates[i]) ){
                continue;
            }
            hashSet.add(candidates[i]);
            path.add(candidates[i]);
            sum += candidates[i];
            backtracking(candidates,target,sum,i+1);
            path.removeLast();
            sum -= candidates[i];
        }
    }
}
```

### [Python](#python)

**90. 子集 II**

```
class Solution:
    def subsetsWithDup(self, nums):
        nums.sort()  # 去重需要排序
        result = []
        self.backtracking(nums, 0, [], result)
        return result

    def backtracking(self, nums, startIndex, path, result):
        result.append(path[:])
        used = set()
        for i in range(startIndex, len(nums)):
            if nums[i] in used:
                continue
            used.add(nums[i])
            path.append(nums[i])
            self.backtracking(nums, i + 1, path, result)
            path.pop()
```

**40. 组合总和 II**

```
class Solution:
    def combinationSum2(self, candidates, target):
        candidates.sort()
        result = []
        self.backtracking(candidates, target, 0, 0, [], result)
        return result

    def backtracking(self, candidates, target, sum, startIndex, path, result):
        if sum == target:
            result.append(path[:])
            return
        used = set()
        for i in range(startIndex, len(candidates)):
            if sum + candidates[i] > target:
                break
            if candidates[i] in used:
                continue
            used.add(candidates[i])
            sum += candidates[i]
            path.append(candidates[i])
            self.backtracking(candidates, target, sum, i + 1, path, result)
            sum -= candidates[i]
            path.pop()
```

**47. 全排列 II**

```
class Solution:
    def permuteUnique(self, nums):
        nums.sort()  # 排序
        result = []
        self.backtracking(nums, [False] * len(nums), [], result)
        return result

    def backtracking(self, nums, used, path, result):
        if len(path) == len(nums):
            result.append(path[:])
            return
        used_set = set()
        for i in range(len(nums)):
            if nums[i] in used_set:
                continue
            if not used[i]:
                used_set.add(nums[i])
                used[i] = True
                path.append(nums[i])
                self.backtracking(nums, used, path, result)
                path.pop()
                used[i] = False
```

### [JavaScript](#javascript)

**90. 子集 II**

```
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b);
    const resArr = [];
    backTraking(nums, 0, []);
    return resArr;
    function backTraking(nums, startIndex, route) {
        resArr.push([...route]);
        const helperSet = new Set();
        for (let i = startIndex, length = nums.length; i < length; i++) {
            if (helperSet.has(nums[i])) continue;
            helperSet.add(nums[i]);
            route.push(nums[i]);
            backTraking(nums, i + 1, route);
            route.pop();
        }
    }
};
```

**40. 组合总和 II**

```
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const resArr = [];
    backTracking(candidates, target, 0, 0, []);
    return resArr;
    function backTracking( candidates, target, curSum, startIndex, route ) {
        if (curSum > target) return;
        if (curSum === target) {
            resArr.push([...route]);
            return;
        }
        const helperSet = new Set();
        for (let i = startIndex, length = candidates.length; i < length; i++) {
            let tempVal = candidates[i];
            if (helperSet.has(tempVal)) continue;
            helperSet.add(tempVal);
            route.push(tempVal);
            backTracking(candidates, target, curSum + tempVal, i + 1, route);
            route.pop();
        }
    }
};
```

**47. 全排列 II**

```
function permuteUnique(nums) {
    const resArr = [];
    const usedArr = [];
    backTracking(nums, []);
    return resArr;
    function backTracking(nums, route) {
        if (nums.length === route.length) {
            resArr.push([...route]);
            return;
        }
        const usedSet = new Set();
        for (let i = 0, length = nums.length; i < length; i++) {
            if (usedArr[i] === true || usedSet.has(nums[i])) continue;
            usedSet.add(nums[i]);
            route.push(nums[i]);
            usedArr[i] = true;
            backTracking(nums, route);
            usedArr[i] = false;
            route.pop();
        }
    }
};
```

### [TypeScript](#typescript)

**90. 子集 II**

```
function subsetsWithDup(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const resArr: number[][] = [];
    backTraking(nums, 0, []);
    return resArr;
    function backTraking(nums: number[], startIndex: number, route: number[]): void {
        resArr.push([...route]);
        const helperSet: Set<number> = new Set();
        for (let i = startIndex, length = nums.length; i < length; i++) {
            if (helperSet.has(nums[i])) continue;
            helperSet.add(nums[i]);
            route.push(nums[i]);
            backTraking(nums, i + 1, route);
            route.pop();
        }
    }
};
```

**40. 组合总和 II**

```
function combinationSum2(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);
    const resArr: number[][] = [];
    backTracking(candidates, target, 0, 0, []);
    return resArr;
    function backTracking(
        candidates: number[], target: number,
        curSum: number, startIndex: number, route: number[]
    ) {
        if (curSum > target) return;
        if (curSum === target) {
            resArr.push([...route]);
            return;
        }
        const helperSet: Set<number> = new Set();
        for (let i = startIndex, length = candidates.length; i < length; i++) {
            let tempVal: number = candidates[i];
            if (helperSet.has(tempVal)) continue;
            helperSet.add(tempVal);
            route.push(tempVal);
            backTracking(candidates, target, curSum + tempVal, i + 1, route);
            route.pop();

        }
    }
};
```

**47. 全排列 II**

```
function permuteUnique(nums: number[]): number[][] {
    const resArr: number[][] = [];
    const usedArr: boolean[] = [];
    backTracking(nums, []);
    return resArr;
    function backTracking(nums: number[], route: number[]): void {
        if (nums.length === route.length) {
            resArr.push([...route]);
            return;
        }
        const usedSet: Set<number> = new Set();
        for (let i = 0, length = nums.length; i < length; i++) {
            if (usedArr[i] === true || usedSet.has(nums[i])) continue;
            usedSet.add(nums[i]);
            route.push(nums[i]);
            usedArr[i] = true;
            backTracking(nums, route);
            usedArr[i] = false;
            route.pop();
        }
    }
};
```

### [Rust](#rust)

**90. 子集 II**：

```
use std::collections::HashSet;
impl Solution {
    pub fn subsets_with_dup(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut res = vec![];
        let mut path = vec![];
        nums.sort();
        Self::backtracking(&nums, &mut path, &mut res, 0);
        res
    }

    pub fn backtracking(
        nums: &Vec<i32>,
        path: &mut Vec<i32>,
        res: &mut Vec<Vec<i32>>,
        start_index: usize,
    ) {
        res.push(path.clone());
        let mut helper_set = HashSet::new();
        for i in start_index..nums.len() {
            if helper_set.contains(&nums[i]) {
                continue;
            }
            helper_set.insert(nums[i]);
            path.push(nums[i]);
            Self::backtracking(nums, path, res, i + 1);
            path.pop();
        }
    }
}
```

**40. 组合总和 II**

```
use std::collections::HashSet;
impl Solution {
    pub fn backtracking(
        candidates: &Vec<i32>,
        target: i32,
        sum: i32,
        path: &mut Vec<i32>,
        res: &mut Vec<Vec<i32>>,
        start_index: usize,
    ) {
        if sum > target {
            return;
        }
        if sum == target {
            res.push(path.clone());
        }
        let mut helper_set = HashSet::new();
        for i in start_index..candidates.len() {
            if sum + candidates[i] <= target {
                if helper_set.contains(&candidates[i]) {
                    continue;
                }
                helper_set.insert(candidates[i]);
                path.push(candidates[i]);
                Self::backtracking(candidates, target, sum + candidates[i], path, res, i + 1);
                path.pop();
            }
        }
    }

    pub fn combination_sum2(mut candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
        let mut res = vec![];
        let mut path = vec![];
        candidates.sort();
        Self::backtracking(&candidates, target, 0, &mut path, &mut res, 0);
        res
    }
}
```

**47. 全排列 II**

```
use std::collections::HashSet;
impl Solution {
    pub fn permute_unique(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut res = vec![];
        let mut path = vec![];
        let mut used = vec![false; nums.len()];
        Self::backtracking(&mut res, &mut path, &nums, &mut used);
        res
    }
    pub fn backtracking(
        res: &mut Vec<Vec<i32>>,
        path: &mut Vec<i32>,
        nums: &Vec<i32>,
        used: &mut Vec<bool>,
    ) {
        if path.len() == nums.len() {
            res.push(path.clone());
            return;
        }
        let mut helper_set = HashSet::new();
        for i in 0..nums.len() {
            if used[i] || helper_set.contains(&nums[i]) {
                continue;
            }
            helper_set.insert(nums[i]);
            path.push(nums[i]);
            used[i] = true;
            Self::backtracking(res, path, nums, used);
            used[i] = false;
            path.pop();
        }
    }
}
```

![](https://github.com/youngyangyang04/leetcode-master/raw/master/pics/网站星球宣传海报.jpg)