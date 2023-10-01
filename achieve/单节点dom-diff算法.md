
### 单节点 DOM Diff 算法介绍

当新的 react element 子元素只有一个节点时，React 会遍历旧的 fiber 列表，并比较 key 和 type，如果 key 和 type 都相同，则复用旧的 fiber 节点，并删掉其余的旧 fiber 节点。

如果 key 或者 type 不同，则创建新的 fiber 节点，并将旧的子 fiber 节点全部删除。
- key 和 type 都相同，则可以复用当前的 fiber 节点
  - 首先调用 deleteRemainingChildren 将当前 fiber 后面的兄弟元素全部标记为删除，并添加到父节点的副作用链表中
  - 调用 useFiber 复用当前的 fiber 节点
- 如果 key 相同，type 不同，就不需要再进行比较了，调用 deleteRemainingChildren 将当前 fiber 节点以及它后面的所有兄弟节点都标记为删除
- 如果 key 不同，则调用 deleteChild 将当前的 fiber 节点标记为删除，并继续比较下一个 fiber 节点
- 如果遍历完所有的子 fiber 列表都没找到 key 相同的 fiber 节点，则为新的 element 元素创建新的 fiber 节点。旧的子 fiber 节点此时已经全部被标记为删除
#### 性能不好的写法：没有给元素添加 key 属性
考虑下面的代码

```js
// 更新前
<div>
  <span>1</span>
  <h1>1</h1>
  <h3>2</h3>
</div>
// 更新后
<div>
  <h1>2</h1>
</div>
```

理论上，中间的`h1`节点是可以复用的，但是由于`h1`节点都没有`key`属性，在协调过程中，首先开始将`span`和新的 element 元素 `h1` 对比，发现这两个 `key` 相同(都是 null)，但是`type`不同，无法复用。同时无需再继续比较其余的 fiber 节点。

因此，在本例中，React 会将所有的子 fiber 节点标记为删除，并添加到父节点的副作用链表中，然后为 h1 创建新的 fiber 节点

**综上，如果是多节点变单节点的场景，建议还是加上 key 属性**

### 单节点 DOM Diff 主要源码

Dom Diff 协调从 `reconcileChildFibers` 函数开始，
如果新的element节点，即newChild是一个对象，则说明这是单一节点，调用reconcileSingleElement进行协调


```js
function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
  var isObject = typeof newChild === "object" && newChild !== null;
  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          )
        );
    }
  }
}

```

#### reconcileSingleElement
单节点 DOM Diff 算法都在 `reconcileSingleElement` 函数中
```js
//reconcileSingleElement负责协调单一节点场景
function reconcileSingleElement(
  returnFiber,
  currentFirstChild,
  element,
  lanes
) {
  var key = element.key;
  var child = currentFirstChild;

  while (child !== null) {
    if (child.key === key) {
      switch (child.tag) {
        default: {
          if (child.elementType === element.type) {
            // key和type都相同，则可以复用
            // 首先调用deleteRemainingChildren将当前fiber后面的兄弟元素全部标记为删除
            deleteRemainingChildren(returnFiber, child.sibling);
            // 重用当前旧的子fiber节点
            var _existing3 = useFiber(child, element.props);
            _existing3.return = returnFiber;
            return _existing3;
          }

          break;
        }
      }
      // 如果key相同，type不同，就不需要再进行比较了，将当前旧的子fiber节点以及它后面的所有兄弟节点都标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // 如果key不同，则调用deleteChild将当前的子fiber节点标记为删除
      deleteChild(returnFiber, child);
    }
    // 如果key不同，则继续比较下一个子fiber节点
    child = child.sibling;
  }
  // 如果遍历完当前所有的子fiber节点都没有找到key和type相同的节点，则为新的element元素创建新的fiber节点
  var _created4 = createFiberFromElement(element, returnFiber.mode, lanes);
  _created4.return = returnFiber;
  return _created4;
}
// 将fiber节点标记为删除，并添加到父节点的副作用链表中
function deleteChild(returnFiber, childToDelete) {
  var last = returnFiber.lastEffect;
  if (last !== null) {
    last.nextEffect = childToDelete;
    returnFiber.lastEffect = childToDelete;
  } else {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
  }
  childToDelete.nextEffect = null;
  childToDelete.flags = Deletion;
}
// 删除其余的fiber节点
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  var childToDelete = currentFirstChild;
  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }

  return null;
}
```
