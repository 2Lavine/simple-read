---
标题: "修改图中的边权 - 修改图中的边权 - 力扣（LeetCode）"
创建时间: 2023-06-09 11:52
更新时间: 2023-06-09 13:07
笔记ID: H83B569
---

## 划线列表
%%begin highlights%%
，每一条可以修改的边的长度范围为
[
1
,
�
]
[1,D]。此时，我们就可以构造出下面
�
×
(
�
−
1
)
+
1
k×(D−1)+1 种不同的边权情况，其中
�
k 是可以修改的边的数量

学习
题库
竞赛
讨论
求职
商店
Plus 会员
力扣面试
33
展示方式
题目描述
评论 (113)
题解 (42)
提交记录
排序
写题解
不限
JavaScript
Java
C++
贪心
广度优先搜索
图
二分查找
最短路
堆（优先队列）
修改图中的边权
官方
前言 本题难度较大。读者需要首先掌握朴素的 Dijkstra 算法，时间复杂度为 $O(n^2)$，其中 $n$ 是图中的节点数量。如果使用优先队列进行优化，时间复杂度为 $O(m \log m)$，其中 $m$ 是图中的边的数量，而本题中 $m$ 的范围可以达到 $O(n^2)$ 的级别，因此使用朴素的版本，时间复杂
13
3.2k
29
详细分析两次 Dijkstra（稠密图下是线性做法）
视频讲解 见【周赛 346】第四题，欢迎点赞投币！ 什么时候无解？ 题目要求把边权为 -1 的至少修改为 1。如果都修改成 1，跑最短路（Dijkstra），发现从起点到终点的最短路长度大于 \textit{target}，那么由于边权变大，最短路不可能变小，所以此时无解。 另外一种无解的情况是，如果都修改成无穷大
115
4.7k
38
[Python3/Java/C++/Go/TypeScript] 一题一解：最短路（Dijkstra 算法）
方法一：最短路（Dijkstra 算法） 我们先不考虑边权为 -1 的边，使用 Dijkstra 算法求出从 source 到 destination 的最短距离 d。 如果 d \lt target，说明存在一条完全由正权边组成的最短路径，此时无论我们如何修改边权为 -1 的边，都无法使得 source 到 dest
10
373
0
二分猜最少需要修改成1的-1的边的数量+Dijkstra
思路和官解方法一类似，但二分的次数和路径权重值域无关，每条-1的边默认修改成1，先二分找到最少需要修改的边数，然后如果改完最短路小于target，就给最后一条边补差价。 有点反直觉的是按任意顺序修改都是对的，所以按天然顺序，省去排序~ 正确性说明：由于修改least-1条边时最短路还是大于target的，因此修改第le
1
124
0
js
Problem: 2699. 修改图中的边权 Code Code
1
18
0
[python3] 两次 Dijkstra
Problem: 2699. 修改图中的边权 解题方法 创建邻接表：根据输入的边列表 edges 创建了一个邻接表 adj，用于表示图中各个节点之间的连接关系。这里使用了列表和嵌套列表的形式来表示邻接表。 Dijkstra 算法：定义了一个 dijkstra 函数，用于执行 Dijkstra 算法来计算最短路径
1
84
0
逐条加边 最短路 C++双100%
先假装所有-1的边都不在图中，计算最短路dist。这个时候有3种情况: dist < target: 这种情况无解。因为存在一条完全由非-1的边组成的最短路，无论你再怎么调-1的边都无法使它变长。 dist == target: 有解。存在一条完全由非-1的边组成的最短路，所以直接把所有的-1边设成最大即可。 dis
18
817
9
宽搜
解题思路 1、如果存在一条路径，不经过任何-1边，其权和依然小于target，那无论怎么改边，都不会改变这条路径的权和，那结果就是不存在。 2、将所有可变边权全部设置为1，如果最短路径依然大于target，那么必然也是不存在目标路径的。 最后就是在存在路径的前提下，找到修改方案的路径 我们要寻找一条路径S，满足S经过
9
687
1
两次 Dijkstra，n^2 * lgn 复杂度
赛中贪心贪到坑里去了，赛后看牛叉队友的题解，想到了这个两次Dij的做法： 先把待定边都记录下来，边权并且赋值为1，然后 第一次： 跑完普通的Dij，看 S 到 T 的距离，如果大于 D，就失败。（跟所有题解最开始的判断思路类似） 这个过程中 S 到所有点的最短路长度记在 dist0 中 当前 S 到 T 的距离，跟 D
8
799
2
反向dijkstra构造边权 排除其他更短路经
这题的构造部分远比判断是否可行部分要难。判断是否可解很简单：普通的最短路是求到起点的距离，改成求到起点的距离的范围即可，具体来说，可修改边全修改为 111 就是最小，全修改为 2×1092 \times 10^92×109 就是最大。构造部分容易想到的一个贪心方案是：找到一条最短路，最短路上先将所有边改为 111，然后
6
295
0
1
2
3
4
5
题目列表
随机一题
上一题
2699/3112
下一题
JavaScript
智能模式
模拟面试
4544434241403839363733343510313267892345146
····················nth·=·0····················adjMatrix[b][a]·=·nth····················adjMatrix[a][b]·=·nth················}·else·{····················nth·=·nth·-·target····················adjMatrix[b][a]·=·target················if·(nth·>=·target)·{····················adjMatrix[a][b]·=·target············let·[a,·b,·w]·=·arr;············if·(w·==·-1)·{········//nth·从·1·开始·········let·adjMatrix·=·new·Array(n).fill(0).map(val·=>·new·Array(n).fill(0))········edges.forEach((arr)·=>·{····let·dijk·=·(source,·destination,·adjMatrix)·=>·{····}····let·getAdj·=·(nth)·=>·{·*·@param·{number}·target·*·@return·{number[][]}·*/var·modifiedGraphEdges·=·function·(n,·edges,·source,·destination,·target)·{·*·@param·{number}·n·*·@param·{number[][]}·edges·*·@param·{number}·source·*·@param·{number}·destination/**················}
测试用例
代码执行结果
调试器
Beta
控制台
填入示例
如何创建一个测试用例?
执行代码
提交
关闭
上一题解
1 / 42
下一题解
修改图中的边权
关注 TA
力扣官方题解
L6
3.2k
发布于 2 天前
未知归属地
官方
图
二分查找
最短路
C++
C#
Go
Java
JavaScript
Python
前言
本题难度较大。读者需要首先掌握朴素的 Dijkstra 算法，时间复杂度为
�
(
�
2
)
O(n
2
)，其中
�
n 是图中的节点数量。如果使用优先队列进行优化，时间复杂度为
�
(
�
log
⁡
�
)
O(mlogm)，其中
�
m 是图中的边的数量，而本题中
�
m 的范围可以达到
�
(
�
2
)
O(n
2
) 的级别，因此使用朴素的版本，时间复杂度更低。
下面会介绍两种方法，第一种方法只需要使用不修改的朴素 Dijkstra 算法，但时间复杂度较高。第二种方法需要在 Dijkstra 算法的基础上进行修改，且有较高的思维难度，但时间复杂度较低。
为了叙述方便，下文用
�
,
�
,
�
s,t,D 分别表示题目中的起点
source
source，终点
destiation
destiation 和目标的最短距离
target
target。
方法一：二分查找 + 最短路
提示
1
1
给定任意一个图，如果节点
�
s 到
�
t 的最短路长度为
�
min
⁡
(
�
,
�
)
d
min
​
(s,t)，那么如果我们给图中的任意一条边的长度增加
1
1，那么新的最短路长度要么仍然为
�
min
⁡
(
�
,
�
)
d
min
​
(s,t)，要么为
�
min
⁡
(
�
,
�
)
+
1
d
min
​
(s,t)+1。
提示
1
1 证明
如果所有的
�
−
�
s−t 最短路都经过了修改的边，那么最短路的长度会增加
1
1。否则，存在一条
�
−
�
s−t 最短路没有任何改动，最短路的长度不变。
思路与算法
根据题目的描述，我们可以得到下面的结论：
当所有可以修改的边的长度为
1
1 时，
�
−
�
s−t 最短路的长度达到最小值；
当所有可以修改的边的长度为
2
×
1
0
9
2×10
9
时，
�
−
�
s−t 的最短路长度达到最大值。
然而，把一条边的长度定为
�
D 以上的值是没有意义的，因为：
如果我们希望这条边出现在最短路中，那么它的长度一定不可能大于
�
D；
如果我们不希望这条边出现在最短路中，那么将它的值定为
�
D，加上任意一条路径上的边，就会得到大于
�
D 的路径长度，这样就是合理的。
因此，每一条可以修改的边的长度范围为
[
1
,
�
]
[1,D]。此时，我们就可以构造出下面
�
×
(
�
−
1
)
+
1
k×(D−1)+1 种不同的边权情况，其中
�
k 是可以修改的边的数量：
[
1
,
1
,
1
,
⋯
,
1
]
[1,1,1,⋯,1]
[
2
,
1
,
1
,
⋯
,
1
]
[2,1,1,⋯,1]
[
3
,
1
,
1
,
⋯
,
1
]
[3,1,1,⋯,1]
⋯
⋯
[
�
,
1
,
1
,
⋯
,
1
]
[D,1,1,⋯,1]
[
�
,
2
,
1
,
⋯
,
1
]
[D,2,1,⋯,1]
[
�
,
3
,
1
,
⋯
,
1
]
[D,3,1,⋯,1]
⋯
⋯
[
�
,
�
,
�
,
⋯
,
�
]
[D,D,D,⋯,D]
即每次将第一条可以修改的并且长度没有到达
�
D 的边的长度增加
1
1。根据提示
1
1，相邻两种边权情况对应的最短路长度要么相同，要么增加
1
1。因此：
这
�
×
(
�
−
1
)
+
1
k×(D−1)+1 种不同的边权情况，包含了最短路长度的最小值到最大值之间的所有可能的最短路值，并且上面构造的边权情况的序列，其最短路的长度是满足单调性的。
这样一来，我们就可以设计出如下的算法：
我们对边权情况为
[
1
,
1
,
1
,
⋯
,
1
]
[1,1,1,⋯,1] 计算一次最短路。如果最短路的长度大于
�
D，那么无解；
我们对边权情况为
[
�
,
�
,
�
,
⋯
,
�
]
[D,D,D,⋯,D] 计算一次最短路。如果最短路的长度小于
�
D，那么无解；
此时，答案一定存在。我们可以在
�
×
(
�
−
1
)
+
1
k×(D−1)+1 种不同的边权情况中进行二分查找。
代码
C++JavaC#Python3GolangCJavaScript
var modifiedGraphEdges = function(n, edges, source, destination, target) {
let k = 0;
for (const e of edges) {
if (e[2] === -1) {
++k;
}
}
if (dijkstra(source, destination, construct(n, edges, 0, target)) > target) {
return [];
}
if (dijkstra(source, destination, construct(n, edges, k * (target - 1), target)) < target) {
return [];
}
let left = 0, right = k * (target - 1), ans = 0;
while (left <= right) {
const mid = Math.floor((left + right) / 2);
if (dijkstra(source, destination, construct(n, edges, mid, target)) >= target) {
ans = mid;
right = mid - 1;
} else {
left = mid + 1;
}
}
for (const e of edges) {
if (e[2] === -1) {
if (ans >= target - 1) {
e[2] = target;
ans -= target - 1;
} else {
e[2] = 1 + ans;
ans = 0;
}
}
}
return edges;
}
const dijkstra = (source, destination, adjMatrix) => {
// 朴素的 dijkstra 算法
// adjMatrix 是一个邻接矩阵
const n = adjMatrix.length;
const dist = new Array(n).fill(Number.MAX_VALUE);
const used = new Array(n).fill(false);
dist[source] = 0;
for (let round = 0; round < n - 1; ++round) {
let u = -1;
for (let i = 0; i < n; ++i) {
if (!used[i] && (u === -1 || dist[i] < dist[u])) {
u = i;
}
}
used[u] = true;
for (let v = 0; v < n; ++v) {
if (!used[v] && adjMatrix[u][v] != -1) {
dist[v] = Math.min(dist[v], dist[u] + adjMatrix[u][v]);
}
}
}
return dist[destination];
}
const construct = (n, edges, idx, target) => {
// 需要构造出第 idx 种不同的边权情况，返回一个邻接矩阵
const adjMatrix = new Array(n).fill(0).map(() => new Array(n).fill(-1));
for (const e of edges) {
let u = e[0], v = e[1], w = e[2];
if (w !== -1) {
adjMatrix[u][v] = adjMatrix[v][u] = w;
} else {
if (idx >= target - 1) {
adjMatrix[u][v] = adjMatrix[v][u] = target;
idx -= (target - 1);
} else {
adjMatrix[u][v] = adjMatrix[v][u] = (1 + idx);
idx = 0;
}
}
}
return adjMatrix;
};
复杂度分析
时间复杂度：
�
(
(
�
2
+
�
)
(
log
⁡
�
+
log
⁡
target
)
)
O((n
2
+m)(logm+logtarget))，其中
�
m 是图中边的数量。二分查找需要进行
�
(
log
⁡
(
�
×
(
target
−
1
)
)
)
O(log(k×(target−1))) 次，在最坏情况下，所有的边都是可以修改的边，即
�
(
log
⁡
�
+
log
⁡
target
)
O(logm+logtarget)。每一次二分查找中需要
�
(
�
2
+
�
)
O(n
2
+m) 的时间构造邻接矩阵，以及
�
(
�
2
)
O(n
2
) 的时间使用朴素的 Dijkstra 算法计算最短路。
空间复杂度：
�
(
�
2
)
O(n
2
)，即为朴素的 Dijkstra 算法中邻接矩阵需要的空间。返回的答案可以直接在给定的数组
edges
edges 上进行修改得到，省去
�
(
�
)
O(m) 的空间。
方法二：动态修改边权的 Dijkstra 算法
思路与算法
在方法一中，我们每次给一条可以修改的边长度增加
1
1。虽然使用了二分查找进行加速，但这样做效率仍然较低。如何进一步进行优化呢？我们可以产生一个简单的想法：
现在固定所有可以修改的边的长度为
1
1，再选择其中一条可以修改的边
�
−
�
u−v。
�
−
�
s−u 的最短路长度为
�
min
⁡
(
�
,
�
)
d
min
​
(s,u)，
�
−
�
v−t 的最短路长度为
�
min
⁡
(
�
,
�
)
d
min
​
(v,t)，那么将
�
−
�
u−v 的长度修改为
�
−
�
min
⁡
(
�
,
�
)
−
�
min
⁡
(
�
,
�
)
D−d
min
​
(s,u)−d
min
​
(v,t)，这样
�
−
�
−
�
−
�
s−u−v−t 就是一条长度恰好为
�
D 的路径。
然而
�
−
�
−
�
−
�
s−u−v−t 不一定是最短的路径，但我们可以不断重复这个步骤，直到最短路径的长度为
�
D 为止。具体的步骤如下：
每次选择一条可以修改的边
�
−
�
u−v，并且这条边之前没有选择过。修改这条边的长度，使得
�
−
�
−
�
−
�
s−u−v−t 这一条路径的长度恰好为
�
D，其中
�
−
�
s−u 以及
�
−
�
v−t 的路径是在「没有选择过的边的长度均为
1
1，选择过的边的长度均为修改后的长度」情况下的最短路径。
可以证明，如果存在满足题目要求的方案，那么上面的做法也一定能得到一种方案：
首先，每条边最多会被选择一次。因为在修改的过程中，
�
−
�
s−u 和
�
−
�
v−t 的最短路径长度都是单调不降的（有其它长度为
1
1 的边被修改成了长度大于
1
1），因此如果第二次选择
�
−
�
u−v 这条边，会使得这条边的长度减少，这是没有任何意义的；
其次，如果当所有可以被选择的边都被选择过一次后，
�
−
�
s−t 的最短路径长度不为
�
D，那么：
要么初始时（即所有可以修改的边的长度为
1
1 时）最短路径的长度已经大于
�
D，此时不存在满足题目要求的方案；
要么存在一条
�
−
�
s−t 的长度小于
�
D 的路径，这条路径上不可能有可以修改的边（否则可以修改对应的边使得长度等于
�
D），这就说明这条路径与所有可以修改的边无关，图中的最短路径本来就小于
�
D，此时也不存在满足题目要求的方案。
因此，「
�
−
�
s−t 的最短路径长度不为
�
D」只会出现在不存在满足题目要求的方案时。这就说明在重复上述的步骤之后，
�
−
�
s−t 的最短路径长度一定为
�
D。
这样一来，我们就可以得到如下的算法：
我们每次选择一条可以修改的边
�
−
�
u−v，并且这条边之前没有选择过；
我们使用 Dijkstra 算法，求出
�
−
�
s−u 以及
�
−
�
u−v 的最短路
�
min
⁡
(
�
,
�
)
d
min
​
(s,u) 和
�
min
⁡
(
�
,
�
)
d
min
​
(v,t)。如果
�
min
⁡
(
�
,
�
)
+
�
min
⁡
(
�
,
�
)
<
�
d
min
​
(s,u)+d
min
​
(v,t)<D，那么将
�
−
�
u−v 的长度修改为
�
−
�
min
⁡
(
�
,
�
)
−
�
min
⁡
(
�
,
�
)
D−d
min
​
(s,u)−d
min
​
(v,t)。
当所有可以修改的边都被选择过后，如果
�
−
�
s−t 的最短路长度为
�
D，说明存在一种满足要求的方案。
由于可以修改的边的数量最多为
�
(
�
)
O(m)，因此上述算法的时间复杂度为
�
(
�
�
2
)
O(mn
2
)，需要继续进行优化。可以发现，该算法的瓶颈在于，当我们修改了
�
−
�
u−v 的长度后，后续选择的边的两部分最短路的值
�
min
⁡
(
�
,
�
)
d
min
​
(s,u) 和
�
min
⁡
(
�
,
�
)
d
min
​
(v,t) 会发生变化，需要重新进行计算。
因此，我们可以考虑在进行 Dijkstra 算法的同时对边进行修改。在 Dijkstra 算法中，当我们遍历到节点
�
u 时，再去修改所有以
�
u 为端点的（且没有修改过的）边，此时就可以保证
�
min
⁡
(
�
,
�
)
d
min
​
(s,u) 的值都是最新的。同时，当我们枚举
�
u 的相邻节点
�
v 时，
�
v 到
�
t 的最短路长度
�
min
⁡
(
�
,
�
)
d
min
​
(v,t) 要么与第一次 Dijkstra 算法中计算出的值相同，要么会变成一个非常大的值，使得
�
min
⁡
(
�
,
�
)
+
�
min
⁡
(
�
,
�
)
d
min
​
(s,u)+d
min
​
(v,t) 已经至少为
�
D（证明见下一段）。这样就只需要一次 Dijkstra 算法即可，时间复杂度降低为
�
(
�
2
)
O(n
2
)。
关于
�
min
⁡
(
�
,
�
)
d
min
​
(v,t) 正确性的证明：如果此时的
�
min
⁡
(
�
,
�
)
d
min
​
(v,t) 与第一次 Dijkstra 算法中计算出的值不同，那么说明
�
v 到
�
t 的任意一条原来的（即所有可以修改的边的长度均为
1
1）最短路中，都有一条边的长度修改为了大于
1
1 的值。对于任意一条最短路：
如果修改的边的某个端点为
�
v，记这条边为
�
′
−
�
u
′
−v，由于
�
v 还没有遍历过，说明
�
′
u
′
已经遍历过，但
�
′
u
′
在
�
v 到
�
t 的最短路上，而最短路上不可能先经过离
�
t 较近的点
�
′
u
′
，再经过离
�
t 较远的点
�
v，这说明最终的最短路不可能从
�
s 到
�
′
u
′
到
�
v 再到
�
t，而是会跳过
�
v，因此这种情况并不会出现；
否则，记最短路上的
�
′
−
�
′
u
′
−v
′
这条边被修改过，并且遍历过的节点是
�
′
u
′
。根据 Dijkstra 算法的性质，我们有
�
min
⁡
(
�
,
�
′
)
≤
�
min
⁡
(
�
,
�
)
d
min
​
(s,u
′
)≤d
min
​
(s,u)；根据最短路的性质，我们有
�
min
⁡
(
�
′
,
�
)
<
�
min
⁡
(
�
,
�
)
d
min
​
(v
′
,t)<d
min
​
(v,t)，那么
�
′
−
�
′
u
′
−v
′
这条边被修改成的值就为
�
=
�
−
�
min
⁡
(
�
,
�
′
)
−
�
min
⁡
(
�
′
,
�
)
>
�
−
�
min
⁡
(
�
,
�
)
−
�
min
⁡
(
�
,
�
)
V=D−d
min
​
(s,u
′
)−d
min
​
(v
′
,t)>D−d
min
​
(s,u)−d
min
​
(v,t)，
�
v 到
�
t 的路径长度增加了至少
�
−
1
≥
�
−
�
min
⁡
(
�
,
�
)
−
�
min
⁡
(
�
,
�
)
V−1≥D−d
min
​
(s,u)−d
min
​
(v,t)，即路径长度至少为
�
min
⁡
′
(
�
,
�
)
=
�
min
⁡
(
�
,
�
)
+
�
−
1
≥
�
−
�
min
⁡
(
�
,
�
)
d
min
′
​
(v,t)=d
min
​
(v,t)+V−1≥D−d
min
​
(s,u)。此时，
�
min
⁡
(
�
,
�
)
+
�
min
⁡
′
(
�
,
�
)
≥
�
d
min
​
(s,u)+d
min
′
​
(v,t)≥D。
因此，如果
�
min
⁡
(
�
,
�
)
d
min
​
(v,t) 与第一次 Dijkstra 算法中计算出的值不同，
�
−
�
u−v 这条边本身就没有任何意义了。
最终的算法如下：
首先以
�
t 为起始点进行一次 Dijkstra 算法，此时所有可以修改的边长度均为
1
1；
随后以
�
s 为起始点进行一次 Dijkstra 算法。当遍历到节点
�
u 时，修改所有以
�
u 为端点的边
�
−
�
u−v：
如果不是可以修改的边，或已经修改过，则不进行任何操作；
如果
�
−
�
s−u 的最短路长度（当前 Dijkstra 算法求出）加上
�
−
�
v−t 的最短路长度（第一次 Dijkstra 算法求出）已经大于
�
D，则
�
−
�
u−v 是一条没有用处的边，将它修改为任意值，例如
�
D；
否则，将边的长度进行修改，值等于
�
D 减去
�
−
�
s−u 的最短路长度与
�
−
�
v−t 的最短路长度之和，构造出一条长度为
�
D 的路径。
再通过这些边更新到
�
v 的最短路长度；
两次 Dijkstra 算法完成后，如果
�
−
�
s−t 的最短路长度为
�
D，则返回修改后的边，否则无解。
代码
C++JavaC#Python3GolangJavaScriptC
class Solution {
public:
vector<vector<int>> modifiedGraphEdges(int n, vector<vector<int>>& edges, int source, int destination, int target) {
this->target = target;
vector<vector<int>> adj_matrix(n, vector<int>(n, -1));
// 邻接矩阵中存储边的下标
for (int i = 0; i < edges.size(); ++i) {
int u = edges[i][0], v = edges[i][1];
adj_matrix[u][v] = adj_matrix[v][u] = i;
}
from_destination = dijkstra(0, destination, edges, adj_matrix);
if (from_destination[source] > target) {
return {};
}
vector<long long> from_source = dijkstra(1, source, edges, adj_matrix);
if (from_source[destination] != target) {
return {};
}
return edges;
}
vector<long long> dijkstra(int op, int source, vector<vector<int>>& edges, const vector<vector<int>>& adj_matrix) {
// 朴素的 dijkstra 算法
// adj_matrix 是一个邻接矩阵
int n = adj_matrix.size();
vector<long long> dist(n, INT_MAX / 2);
vector<int> used(n);
dist[source] = 0;
for (int round = 0; round < n - 1; ++round) {
int u = -1;
for (int i = 0; i < n; ++i) {
if (!used[i] && (u == -1 || dist[i] < dist[u])) {
u = i;
}
}
used[u] = true;
for (int v = 0; v < n; ++v) {
if (!used[v] && adj_matrix[u][v] != -1) {
if (edges[adj_matrix[u][v]][2] != -1) {
dist[v] = min(dist[v], dist[u] + edges[adj_matrix[u][v]][2]);
}
else {
if (op == 0) {
dist[v] = min(dist[v], dist[u] + 1);
}
else {
int modify = target - dist[u] - from_destination[v];
if (modify > 0) {
dist[v] = min(dist[v], dist[u] + modify);
edges[adj_matrix[u][v]][2] = modify;
}
else {
edges[adj_matrix[u][v]][2] = target;
}
}
}
}
}
}
return dist;
}
private:
vector<long long> from_destination;
int target;
};
复杂度分析
时间复杂度：
�
(
�
2
+
�
)
O(n
2
+m)，其中
�
m 是图中边的数量。我们需要
�
(
�
2
+
�
)
O(n
2
+m) 的时间构造邻接矩阵，以及两次
�
(
�
2
)
O(n
2
) 的时间使用朴素的 Dijkstra 算法计算最短路。
空间复杂度：
�
(
�
2
)
O(n
2
)，即为朴素的 Dijkstra 算法中邻接矩阵需要的空间。返回的答案可以直接在给定的数组
edges
edges 上进行修改得到，省去
�
(
�
)
O(m) 的空间。
下一篇：详细分析两次 Dijkstra（稠密图下是线性做法）
© 著作权归作者所有
16
条评论
最热
编辑
预览
评论
精选评论(3)
Carl_Czerny
L5
来自四川
（编辑过）2 天前
【友情提示】这是CF标2300的原题，也应该是整个主站/美国站（非LCP）的天花板。之所以难度分没有超过1719题，一方面这道题单组case卡不掉O(m^2logm)的做法（常数太小，py单组4s左右），另一方面双周赛43的第二题（1717）有点绕，把1718和1719两道题的难度分都顶高了。当然O(m^2logm)的做法可以开脑洞来优化，即先定好修改-1的边的先后顺序，然后二分让最短路小于等于target需要修改的最少边数，修改时直接把-1改成1即可，确定好最少次数后，如果最短路小于target再在最后一个修改位置补差价。有点反直觉的是按任意顺序修改-1的边都可以，这样做时间复杂度和边权值域无关。如果未来哪天真的作为置顶打卡题，建议广大普通天坑转码人量力而行，没必要过分执着于此…… （好吧，官方果然一次又一次不让人失望，那给个参考实现，https://leetcode.cn/problems/modify-graph-edge-weights/solution/er-fen-cai-zui-shao-xu-yao-xiu-gai-cheng-lfdu/ ）
21
查看 5 条回复
回复
lijc016
来自北京
2 天前
（就是这题那天上了又撤了，吞了张补签卡）
11
查看 1 条回复
回复
ziuch
L2
来自江苏
13 小时前
唯一一个两次荣登每题一日的题目，是不是那天本来要上写题解的发现搞不定，研究了两天灵神的视频才又放出来
10
查看 5 条回复
回复
评论(16)
白
L5
来自江西
（编辑过）12 小时前
这道题最大的难点在于修改边权部分：修改一条边的边权，会影响最短路的走向，导致这条边不再在最短路上。官方题解二在第二次 dijkstra 时同时处理判断是否可行和求出可行方案，会难想些，如果把判断可行性和求可行方案分开来更好想： 首先将所有边改为 1 和 +∞ 求两次最短路，可以得到每个点的最短路范围 [l,r]，对于范围 [l,r] 内的每个距离 d，都存在一种构造边权的方式使最短路刚好是 d，这保证了可行性。 有了可行性保证，就可以专心构造方案，这时更容易理解的方案自然是反向构造，从终点的距离 target 反推每个点的距离，只要保证距离落在上一步求出的范围内就能保证可行性，有了可行性保证，只需要考虑构造方法会简单很多，细节可以看 题解。
2
回复
shixuewei
L4
来自北京
2 天前
2800分的题，真看的起我
1
查看 2 条回复
回复
nico
L1
来自亚太地区
1 小时前
“我们就可以构造出下面 k×(D−1)+1 种不同的边权情况”->对于k个修改的边，从第一个 1 1 ...1开始，每次整个序列和增加1,一直到d d ... d。共有k X (d - 1) + 1个
赞
回复
feihustc
来自安徽
1 小时前
欸不是，你这，不是
赞
回复
知白守黑
来自四川
1 小时前
贴一个官方方法一 java 版本带注释的代码
public int[][] modifiedGraphEdges(int n, int[][] edges, int source, int destination, int target) {
int k = 0;//边权为-1的节点数量
for (int[] edge : edges){
if (edge[2] == -1){
k++;
}
}
//如果未修改边的权值为-1的边的权值之前 最短路径的大小大于 target 那么无解
if(dijkstra(source,destination,construct(n,edges,0,target)) > target){
return new int[0][];
}
////如果将边的权值为-1的边全部修改为权值为taeget 最短路径的大小小于 target 那么无解
if(dijkstra(source,destination,construct(n,edges,(long) k * (target - 1),target)) < target){
return new int[0][];
}
//二分枚举答案 找到最佳答案
long left = 0,right = (long) k * (target - 1),ans = 0;
while (left <= right){
long mid = (left + right) / 2;
if (dijkstra(source,destination,construct(n,edges,mid,target)) >= target){
ans = mid;
right = mid - 1;
}else {
left = mid + 1;
}
}
//找到最短路径之后 修改edges
for (int[] edge : edges){
if (edge[2] == -1){
if (ans >= target - 1){
edge[2] = target;
ans -= target - 1;
}else {
edge[2] = (int) (1 + ans);
ans = 0;
}
}
}
return edges;
}
//使用dijkstra算法 求两个节点间的最短路径
private long dijkstra(int source,int destination,int[][] adjMatrix){
int n = adjMatrix.length;
long[] dist = new long[n];//距离数组
Arrays.fill(dist,Integer.MAX_VALUE / 2);
boolean[] used = new boolean[n];
dist[source] = 0;
//每次循环找到当前距离最小的节点 u
for (int round = 0;round < n - 1;round++){
int u = -1;
//遍历所有还未使用的节点,如果当前节点未被使用且其距离小于 u 节点的距离
//则更新最小距离节点为当前节点
for (int i = 0;i < n;i++){
if (!used[i] && (u == -1 || dist[i] < dist[u])){
u = i;
}
}
//将 u 节点标记为已使用,表示已经找到从源结点到该节点的最短路径
used[u] = true;
/**
* 遍历所有未使用的节点 v
* 如果 v 节点未被使用且节点 u 到节点 v 有边,则尝试更新源节点到 v 节点最短路径
*/
for (int v = 0;v < n;v++){
if (!used[v] && adjMatrix[u][v] != -1){
dist[v] = Math.min(dist[v],dist[u] + adjMatrix[u][v]);
}
}
}
//循环结束后 dist 中存储了源节点到所有其它节点的最短路径
return dist[destination];
}
//求当前图的邻接矩阵
private int[][] construct(int n,int[][] edges,long x,int target){
//需要构造出第 x 种不同的修改边权的情况 返回1个邻接矩阵
int[][] adjMatrix = new int[n][n];
//将邻接矩阵的值全设为 -1
for (int i = 0;i < n;i++){
Arrays.fill(adjMatrix[i],-1);
}
for (int[] edge : edges){
int u = edge[0],v = edge[1],w = edge[2];
if (w != -1){//如果不等于-1 那么就不用修改
adjMatrix[u][v] = adjMatrix[v][u] = w;
}else {
if (x >= target - 1){
adjMatrix[u][v] = adjMatrix[v][u] = target;
//更新 x ,实现对权值为 -1 的边的权值的修改
x -= (target - 1);
}else {
//修改完当前边之后 在当前方案下 后续的权值为-1的边就只能修改为1了
adjMatrix[u][v] = adjMatrix[v][u] = (int) (1 + x);
x = 0;
}
}
}
return adjMatrix;
}
1
回复
Pein
L4
来自河南
（编辑过）1 小时前
一边跑Dijkstra一边改边权的解法真的想不到，比赛的时候用的二分答案。
假设有 x 条边是可以修改边权的，先把所有边权为 -1 的边改成 1，然后跑一遍 Dijkstra 算法求最短路，如果此时 source 到 destination 不连通或最短路大于 target ，那肯定就无解，返回空数组。
单调性：如果对 x 条可以修改边权的边 e1, e2, ... , ex每次按 [1,x] 的顺序增加 1 的权重（对ex增加权重后，下一次又从e1开始），那么每对一条边增加1的权重，source和destination之间的最短路要么不变，要么也只会增加1（这条边是最短路的必经之路就会使最短路+1，如果改了之后最短路绕道了，最短路就不变）。
因此用二分答案来确定能够使得 source 到 destination 最短路不小于 target 的最小增加边权的操作数。
如果增加x次边权后，能够使得source到destination的最短距离（用Dijkstra算法求解）大于等于 target，说明 x 次操作是可以的，记录一下答案，往左搜索看能不能更小。
否则x次操作就太小了，需要继续增加边权，往右搜索。
二分完之后判断一下是否无解，否则判断不了已经存在一条路径的最短距离小于 target 的情况。
typedef long long LL;
const int N = 1005;
LL INF = 0x3f3f3f3f3f3f3f3f;
LL dist[N], graph[N][N];
bool visited[N];
int free_edges[N*N];
class Solution {
public:
int free_degree;     // 可修改的边数
vector<vector<int>> invalid, edges;
vector<vector<int>> modifiedGraphEdges(int n, vector<vector<int>>& edges, int source, int destination, int target) {
this->edges = edges;
int m = edges.size();
memset(graph, 0x3f, sizeof(graph));
for(int i = 0; i < m; i++) {
int a = edges[i][0], b = edges[i][1], w = edges[i][2];
if(w == -1) {
free_edges[free_degree++] = i;
w = 1;
}
graph[a][b] = graph[b][a] = w;
}
dijkstra(n, source, destination);
if(dist[destination] == INF || dist[destination] > target) return invalid;
LL left = 0, right = (LL)m*target;
while(left < right) {
LL mid = left + ((right - left) >> 1);
if(check(n, source, destination, mid) >= target) {
right = mid;
}else {
left = mid + 1;
}
}
if(check(n, source, destination, right) < target) return invalid;
for(int i = 0; i < free_degree; i++) {
edges[free_edges[i]][2] = calc(right, i);
}
return edges;
}
LL check(int n, int src, int dest, LL x){
for(int i = 0; i < free_degree; i++) {
int a = edges[free_edges[i]][0], b = edges[free_edges[i]][1];
graph[a][b] = graph[b][a] = calc(x, i);
}
dijkstra(n, src, dest);
return dist[dest];
}
// 朴素版Dijkstra算法
void dijkstra(int n, int src, int dest) {
memset(dist, 0x3f, sizeof(dist));
memset(visited, 0, sizeof(visited));
dist[src] = 0;
for(int i = 0; i < n; i++) {
int t = -1;
for(int j = 0; j < n; j++) {
if(!visited[j] && (t == -1 || dist[j] < dist[t])) {
t = j;
}
}
visited[t] = true;
for(int j = 0; j < n; j++) {
dist[j] = min(dist[j], dist[t] + graph[t][j]);
}
}
}
// 计算边i加cnt次后的权值
LL calc(LL cnt, int i) {
LL weight = 1 + cnt / free_degree;      // 1是个初始权值
int remainder = cnt % free_degree;
if(remainder - 1 >= i) weight++;
return weight;
}
};
1
回复
jhy705-
来自山东
2 小时前
直接cv了，我不配
赞
回复
wesker926
L1
来自广东
3 小时前
既然你都说难度较大，那我就却之不恭了。
1
回复
Time
L5
来自北京
3 小时前
2023年6月4号的打卡题
赞
回复
你鑫爹爹爱刷题
L3
来自江西
4 小时前
cv收藏，心安理得
4
回复
小姜可
L3
来自陕西
（编辑过）6 小时前
最喜欢做难题了，开心的直接cv，下一题有缘再见。
3
回复
chenwf
L3
来自广东
12 小时前
我就说我的每日一题怎么断了
赞
回复
1
2
有用 13
29 条评论
收藏
分享
全部题目
1
#1 两数之和
简单
#2 两数相加
中等
#3 无重复字符的最长子串
中等
#4 寻找两个正序数组的中位数
困难
#5 最长回文子串
中等
#6 N 字形变换
中等
#7 整数反转
中等
#8 字符串转换整数 (atoi)
中等
#9 回文数
简单
#10 正则表达式匹配
困难
#11 盛最多水的容器
中等
#12 整数转罗马数字
中等
#13 罗马数字转整数
简单
#14 最长公共前缀
简单
#15 三数之和
中等
#16 最接近的三数之和
中等
#17 电话号码的字母组合
中等
#18 四数之和
中等
#19 删除链表的倒数第 N 个结点
中等
#20 有效的括号
简单
#21 合并两个有序链表
简单
#22 括号生成
中等
#23 合并 K 个升序链表
困难
#24 两两交换链表中的节点
中等
#25 K 个一组翻转链表
困难
#26 删除有序数组中的重复项
简单
#27 移除元素
简单
#28 找出字符串中第一个匹配项的下标
中等
#29 两数相除
中等
#30 串联所有单词的子串
困难
#31 下一个排列
中等
#32 最长有效括号
困难
#33 搜索旋转排序数组
中等
#34 在排序数组中查找元素的第一个和最后一个位置
中等
#35 搜索插入位置
简单
#36 有效的数独
中等
#37 解数独
困难
#38 外观数列
中等
#39 组合总和
中等
#40 组合总和 II
中等
#41 缺失的第一个正数
困难
#42 接雨水
困难
#43 字符串相乘
中等
#44 通配符匹配
困难
#45 跳跃游戏 II
中等
#46 全排列
中等
#47 全排列 II
中等
#48 旋转图像
中等
#49 字母异位词分组
中等
#50 Pow(x, n)
中等
Made 2 formatting edits on line 81

%%end highlights%%

## 页面笔记
%%begin pagenote%%
每次将第一条可以修改的并且长度没有到达 
�
D 的边的长度增加 
1
1。根据提示 
1
1，相邻两种边权情况对应的最短路长度要么相同，要么增加 
1
1
%%end pagenote%%

 #五彩插件 [原文](https://leetcode.cn/problems/modify-graph-edge-weights/solution/xiu-gai-tu-zhong-de-bian-quan-by-leetcod-66bg/)