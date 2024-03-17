## git branch -f
`git branch -f` 命令用于强制移动或重置分支的指针位置。它通常用于以下情况：

1. 移动分支指针：可以使用 `git branch -f <branch> <commit>` 将分支 `<branch>` 的指针移动到指定的 `<commit>` 上。这对于修复错误或重新设置分支位置非常有用。
2. 重置分支位置：可以使用 `git branch -f <branch> HEAD` 将分支 `<branch>` 的指针重置到当前所在的提交上。这对于撤销错误的合并或重置分支状态非常有用。

需要注意的是，`git branch -f` 命令会强制移动分支指针，可能会导致丢失未提交的更改。因此，在使用该命令之前，请确保已经备份或提交了所有重要的更改。

## git branch -m
`git branch -m` 是 Git 命令的一部分，用于重命名分支。

具体来说，`git branch -m <old_branch_name> <new_branch_name>` 用于将旧的分支名 `<old_branch_name>` 改为新的分支名 `<new_branch_name>`。

例如，如果要将分支 `feature1` 改名


## git push -u  origin Branc1:branch2
含义为将本地branch1 推送到origin 的 branch2

## git revert HEAD

git revert HEAD的含义是撤销当前提交的更改。HEAD是指向当前分支最新提交的指针，通过执行git revert HEAD命令，可以创建一个新的提交，该提交会撤销当前分支最新的提交所做的更改。
是 HEAD 而不是 HEAD^1

## git cherry-pick   c1 c3

跳过来c2,pick 了p1和p2