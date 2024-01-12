> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7238199999732711481?searchId=20231223132102851DD7ACF52DA79BBC32)

Date( ) 基本使用
------------
`Date()`日期对象是构造函数，必须使用 **new** 来调用我们的日期对象。
*   若`Date()`没有参数时 返回当前时间
*   若`Date(timer)`有参数时 返回参数设置的时间
    *   参数写法：`'2012-2-2 08:54:32'`（字符串）
*   返回值格式：`Sun May 28 2023 23:36:28 GMT+0800 (中国标准时间)`

Date() 常用 API
-------------
`Date()` 可以通过许多方法获取日期和时间的各个部分，在格式化时间时我们经常用到这些 API。

```
let date = new Date();
    console.log(date.getFullYear()); //当前日期的年 2022
    console.log(date.getMonth() + 1); //月份+1 月份是0-11计算 所以需要 +1 
    console.log(date.getDate()); // 日
    console.log(date.getDay()); // 星期几  注意：星期日返回的是0
    console.log(date.getHours()); // 时
    console.log(date.getMinutes()); // 分
    console.log(date.getSeconds()); // 秒
```

1.1 日期格式化toLocaleString（原生方法）
------------------------
Date 对象有一个 `toLocaleString` 方法，该方法可以格式化日期和时间, 同时衍生出另外两种分别获得日期和时间的方法。
*   字段说明：
    *   日期 + 时间: `toLocaleString()`
    *   日期: `toLocaleDateString()`
    *   时间: `toLocaleTimeString()`
*   参数说明 **(非必填)**：
    *   `'en-US', { timeZone: 'America/New_York' }`
    *   `en-US` : 地区设置 (String）
    *   `{ timeZone: 'America/New_York' }`: 日期时间格式和时区信息 (Object)

```
let timer = new Date()
    console.log(timer.toLocaleString()) // 日期+时间 2023/5/28 23:07:35
    console.log(timer.toLocaleDateString()) // 日期 2023/5/28 
    console.log(timer.toLocaleTimeString()) // 时间 23:10:31
```

```
// 两个参数：（地区设置，日期时间格式和时区信息）console.log(time.toLocaleString('en-US', { timeZone: 'America/New_York' }))
// 打印结果 5/28/2023, 11:08:39 AM
```
1.2 字符串方法
---------
`string.padStart(字符串长度, 填充元素)` : 用`填充元素`填充`string`字符串，使得产生的新字符串达到所设置的长度（参数一：`字符串长度`）。
*   `padStart` 从原字符串左侧开始填充
*   `padEnd` 从原字符串右侧开始填充
```
let str = 'str'
    str.padStart(5,'0') // "00str"
    
    // 不指定填充元素时，以空字符串填充
    str.padStart(5) // "  abc" 
    // 填充元素超出指定长度时，从左->右对填充元素截取
    str.padStart(6,'123465'); // "123str"
    // 原字符串长度大于设定长度时，以原字符串长度为准 不截断原字符串
    str.padStart(2); // "str"
```
### 1) 利用字符串进行日期格式化
```
console.log(time.getFullYear().toString().padStart(4, '0')) // 年 2023
  console.log((time.getMonth() + 1).toString().padStart(2, '0')) // 月 05
  console.log(time.getDate().toString().padStart(2, '0')) // 日 29
  console.log('星期' + (time.getDay() === 0 ? 7 : time.getDay())) // 周 星期1
  console.log(time.getHours().toString().padStart(2, '0')) // 时 01
  console.log(time.getMinutes().toString().padStart(2, '0')) // 分 19
  console.log(time.getSeconds().toString().padStart(2, '0')) // 秒 55
```
### 2) 格式化函数封装
```
let time = new Date()
    // 定义格式化封装函数
    function formaData(timer) {
        const year = timer.getFullYear()
        const month = timer.getMonth() + 1 // 由于月份从0开始，因此需加1
        const day = timer.getDate()
        const hour = timer.getHours()
        const minute = timer.getMinutes()
        const second = timer.getSeconds()
        return `${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
    }
    // 定义具体处理标准
    // timeEl 传递过来具体的数值：年月日时分秒
    // total 字符串总长度 默认值为2
    // str 补充元素 默认值为"0"
    function pad(timeEl, total = 2, str = '0') {
        return timeEl.toString().padStart(total, str)
    }
    // 调用函数
    console.log(formaData(time)) // 2023-05-29 00:30:19
```

### 1.3 第三方库momentjs 格式化时间

```
// `this.$moment()` 输出当前时间的moment对象
console.log(this.$moment().format('YYYY-MM-DD HH:mm:ss')); // 2023-05-29 00:30:19
```

2.1 时间戳
-------
date 时间戳（毫秒数）：
*   获取 date 总的毫秒数，不是当前时间的毫秒数，而是距离`1970年1月1日`过了多少毫秒数。
*   获取方法：
    *   valueof() 、 getTime()
    *   const timer = + new Date() `常用`
    *   Date.now( ) 低版本浏览器打不开
    ```
    let date = new Date();
    // 写法一
    console.log(date.valueOf()); //现在时间距离1970.1.1的毫秒数
    console.log(date.getTime());
    
    // 写法二
    let date = +new Date(); 
    console.log(date); //返回当前总的毫秒数
    
    // 写法三
     console.log(Date.now()); // H5新增 低版本浏览器打不开
    ```
    

### 倒计时函数封装

```
function countDown(time) {
        let dateNow = +new Date(); // 获取当前时间的毫秒数
        let dateOver = +new Date(time); // 获取目标时间的毫秒数
        let gapTime = (dateOver - dateNow) / 1000 // 由毫秒得到秒
        let s = pad(parseInt(gapTime % 60)); // 秒数
        let m = pad(parseInt(gapTime / 60 % 60)); // 分钟数
        let h = pad(parseInt(gapTime / 60 / 60 % 24)); // 小时数
        let d = pad(parseInt(cha / 60 / 60 / 24)); // 天数
        return d + '天' + h + '小时' + m + '分钟' + s + '秒';
    }
    
    // 时间标准的处理函数
    function pad(timeEl, total = 2, str = '0') {
        return timeEl.toString().padStart(total, str)
    }
    
    // 调用函数
    console.log(countDown('2122-5-19 8:00:00'));
```