> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [leetcode.cn](https://leetcode.cn/problems/time-to-cross-a-bridge/solution/by-newhar-m53n/)

> 作者: newhar 摘要: 如何解模拟题 这个题目属于一类典型的模拟题：让你去 模拟一个过程，而这个过程一般是按照 时间顺序 去执行。

### 如何解模拟题

这个题目属于一类典型的模拟题：让你去 **模拟一个过程**，而这个过程一般是按照 **时间顺序** 去执行。  
对于此类问题，我们需要抓住其关键点：

1.  当前我们正在关注的 **时间**；
2.  在这个时间点，将会发生什么 **事件**；
3.  在这个时间点，题目所描述的环境的 **状态**。

我们需要在当前 「时间」，处理完这个时间点及其之前所发生的 「事件」（一般会导致 「状态」 的更新），然后基于当前的 「状态」，去按照规则做相应的 「决策」。决策完成后，我们需要等待下一个事件到来，将状态继续更新，进行下一轮决策。

### [](#本题解法)本题解法

对于本题，其各个要素具体表现如下：

1.  时间 - 这个无需进一步说明；
2.  事件 - 分析题目，可以发现有 4 种可能的事件：
    *   有工人到达右岸，开始拿旧仓库的箱子；
    *   有工人拿完了旧仓库的箱子，等待回左岸；
    *   有工人到达了左岸，开始放新仓库的箱子；
    *   有工人把箱子放到了新仓库，完成搬运，返回河左岸等待下一个任务。
3.  状态 - 分析题目，我们需要保存 5 个状态：
    *   位于河左岸、等待过河到右岸的工人列表；
    *   位于河右岸、等待过河到左岸的工人列表；
    *   当前桥上是否有人正在过河；
    *   当前尚需搬运的箱子数目；
    *   当前已经回到左岸的箱子数目。
4.  决策 - 在每个时间点，我们需要根据 状态 和题目要求进行决策：
    *   如果当前桥上有人，我们不能安排人过河；
    *   如果当前桥上没人，但是有右岸的工人需要过河，那么从右岸的工人中选择效率最低的工人（用优先队列选择），令其回到左岸；
    *   如果当前桥上没人，且没有右岸工人需要过河，但是有左岸工人可以过河，且有剩余尚需搬运的箱子，那么从左岸工人中选择效率最低的工人（用优先队列选择），令其到右岸搬箱子。

### [](#代码)代码

```
class Solution {
public:
    int findCrossingTime(int n, int k, vector<vector<int>>& time) {
        // 四种事件：
        // ReachRight - 有工人到达右岸，开始拿旧仓库的箱子
        // GoLeft - 有工人拿完了旧仓库的箱子，等待回左岸
        // ReachLeft - 有工人到达了左岸，开始放新仓库的箱子
        // Complete - 有工人完成搬运，返回河左岸等待下一个任务
        const int ReachRight = 0, GoLeft = 1, ReachLeft = 2, Complete = 3;
        
        // 时间-事件序列 <时间，事件类型，工人下标>
        priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<tuple<int,int,int>>> q_event;
        
        // 左岸工人 <耗时，下标>
        priority_queue<pair<int,int>> q_left;
        
        // 右岸工人 <耗时，下标>
        priority_queue<pair<int,int>> q_right;
        
        // 初始化，工人都在左岸
        for(int i = 0; i < k; ++i) 
            q_left.push({time[i][0] + time[i][2], i});
        
        // t - 当前时间
        // bridgecnt - 当前桥上的人数
        // needcnt - 尚需搬运的箱子数
        // returncnt - 返回左岸的箱子数
        int t = 0, bridgecnt = 0, needcnt = n, returncnt = 0, res = 0;
        while(returncnt < n) {
            // 如果桥上没人，那么安排人过桥
            if(bridgecnt == 0) {
                // 优先安排右岸
                if(q_right.size()) {
                    auto [unused, idx] = q_right.top(); q_right.pop();
                    q_event.push({t + time[idx][2], ReachLeft, idx});
                    bridgecnt = 1;
                } 
                // 右岸没人，安排左岸
                else if(q_left.size()) {
                    // 只有还有需要搬运的箱子时，才安排
                    if(needcnt) {
                        auto [unused, idx] = q_left.top(); q_left.pop();
                        q_event.push({t + time[idx][0], ReachRight, idx});
                        needcnt--;
                        bridgecnt = 1;
                    }
                }
            }

            // 等待下个事件到来
            if(q_event.size()) {
                // t -> 下个事件发生的时间；用while处理完所有同时发生的事件
                t = -1;
                while(q_event.size() && (t == -1 || get<0>(q_event.top()) == t)) {
                    auto [ne, type, idx] = q_event.top(); q_event.pop();
                    t = ne;
                    if(type == ReachRight) { // 有工人到达右岸，开始拿旧仓库的箱子
                        q_event.push({t + time[idx][1], GoLeft, idx});
                        bridgecnt = 0;
                    } else if(type == GoLeft) { // 有工人拿完了旧仓库的箱子，等待回左岸
                        q_right.push({time[idx][0] + time[idx][2], idx});
                    } else if(type == ReachLeft) { // 有工人到达了左岸，开始放新仓库的箱子
                        q_event.push({t + time[idx][3], Complete, idx});
                        returncnt++;
                        res = t;
                        bridgecnt = 0;
                    } else { // 有工人完成搬运，返回河左岸等待下一个任务
                        q_left.push({time[idx][0] + time[idx][2], idx});
                    }
                }
            }
        }
        
        return res;
    }
};
```