# this

1. This 返回的是一个对象
2. this 的指向取决于他是如何被调用的



两个作用域中的 this 指向

- 在全局作用域中使用this，指代全局对象

- **在函数作用域中使用this，它的指向完全取决于函数是如何被调用的**

  | 调用方式         | 示例           | 函数中的this指向 |
  | ---------------- | -------------- | ---------------- |
  | **通过new调用**  | `new method()` | 新对象           |
  | **直接调用**     | `method()`     | 全局对象         |
  | **通过对象调用** | `obj.method()` | 前面的对象       |
  
  

## 给所有对象添加方法

添加print方法 让打印所有属性

```js
Object.prototype.print = function(){
  for(const key in this){
    if(this.hasOwnProperty(key)){
         console.log(this[key])
    }
  }
}
```



## 不用 new 创建对象

```js
function User(){}
u = {}
User.call(u)
```

