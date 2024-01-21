> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/7062178363800027173?searchId=202401111042005CE25745555C47841FB9)

requestAnimationFrame 
-------------------------
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

```
window.requestAnimationFrame(callback);
```
*   callback 下一次重绘之前更新动画帧所调用的函数 (即上面所说的回调函数)。该回调函数会被传入 DOMHighResTimeStamp 参数，该参数与 performance.now() 的返回值相同，它表示 requestAnimationFrame() 开始去执行回调函数的时刻。
*   返回值 一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 **window.cancelAnimationFrame()** 以取消回调函数。

### 基本应用
用法其实跟 setTimeout 完全一致，只不过当前的时间间隔是跟着系统的绘制频率走，是固定的
```
// 调用的是系统的时间间隔
const element = document.getElementById('some-element-you-want-to-animate');
let start;
function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;
  //这里使用`Math.min()`确保元素刚好停在200px的位置。
  element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';
  if (elapsed < 2000) { // 在两秒后停止动画
    window.requestAnimationFrame(step);
  }
}
var timer1 = window.requestAnimationFrame(step);
//取消回调函数
cancelAnimationFrame(timer1);
```
注意若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 window.requestAnimationFrame()

### 优点
* 使得动画更加流畅，防止动画失帧 requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
* 资源节能 (Cpu、内存等)
    1.  在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的 CPU、GPU 和内存使用量
    2.  requestAnimationFrame 是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销
### 注意点
* 为了提高性能和电池寿命，因此在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。
*  回调函数会被传入 DOMHighResTimeStamp 参数，DOMHighResTimeStamp 指示当前被 requestAnimationFrame() 排序的回调函数被触发的时间。在同一个帧中的多个回调函数，它们每一个都会接受到一个相同的时间戳，即使在计算上一个回调函数的工作负载期间已经消耗了一些时间。该时间戳是一个十进制数，单位毫秒，最小精度为 1ms(1000μs)。

requestAnimationFrame 和 setInterval、setTimeout 的联系
--------------------------------------------------
*   因为 setTimeout 和 setInterval 是异步 api，必须需要等同步任务执行，还需要等待微任务完成以后，然后才会去执行当前这个回调函数。
*   这里会存在一个问题，没有办法去精准地把时间定位到，哪怕你写成 16，它也没有办法，让时间精准定位到 16。时间间隔没有办法保证。
深入 requestAnimationFrame 与 Event Loop
-------------------------------------
Event Loop（事件循环）是用来协调事件、用户交互、脚本、渲染、网络的一种浏览器内部机制。
*   Event Loop 在浏览器内也分几种：
    *   window event loop
    *   worker event loop
    *   worklet event loop
我们这里主要讨论的是 window event loop。也就是浏览器一个渲染进程内主线程所控制的 Event Loop。
### Event Loop 的基本处理过程
1.  在所选 task queue (taskQueue) 中约定必须包含一个可运行任务。
	1. 如果没有此类 task queue，则跳转至下面 microtasks 步骤。
2.  pop 出taskQueue 中最老的 Task ，并将其设置为 event loop中正在运行的 task。
4.  执行 oldestTask。
5.  将 event loop 中正在运行的 task 设置为 null。
6.  执行 microtasks 检查点（也就是执行 microtasks 队列中的任务）。
7.  设置 hasARenderingOpportunity 为 false。
8.  更新渲染。
9.  如果当前是 window event loop 且 task queues 里没有 task 且 microtask queue 是空的，同时渲染时机变量 hasARenderingOpportunity 为 false ，去执行 idle period（requestIdleCallback）。
10.  返回到第一步。

大体上来说，event loop 就是不停地找 task queues 里是否有可执行的 task ，如果存在即将其推入到 call stack （执行栈）里执行，并且在合适的时机更新渲染。

下图 3（源）是 event loop 在浏览器主线程上运行的一个清晰的流程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca5ec835c88b4f89b06e0302bfe98a7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在上面规范的说明中，渲染的流程是在执行 microtasks 队列之后，更进一步，再来看看渲染的处理过程。


requestAnimationFrame 的应用场景
---------------------------
*   大数据渲染
在大数据渲染过程中，比如表格的渲染，如果不进行一些性能策略处理，就会出现 UI 冻结现象，用户体验极差。有个场景，将后台返回的十万条记录插入到表格中，如果一次性在循环中生成 DOM 元素，会导致页面卡顿 5s 左右。这时候我们就可以用 **requestAnimationFrame** 进行分步渲染，确定最好的时间间隔，使得页面加载过程中很流畅。
```
var total = 100000;
var size = 100;
var count = total / size;
var done = 0;
var ul = document.getElementById('list');

function addItems() {
    var li = null;
    var fg = document.createDocumentFragment();

    for (var i = 0; i < size; i++) {
        li = document.createElement('li');
        li.innerText = 'item ' + (done * size + i);
        fg.appendChild(li);
    }

    ul.appendChild(fg);
    done++;

    if (done < count) {
        requestAnimationFrame(addItems);
    }
};
requestAnimationFrame(addItems);
```

*   实现动画
css3 实现使得性能和流畅度都得到了很大的提升，但同时局限性也挺大比如不是所有的属性都能参与动画，动画过程不能完全控制，动画缓动效果太小等等。
 setTimeout 和 setInterval 能达成更多的可控性质的自有帧动画，但是由于刷新时间和定时器时间不同会出现掉帧现象，定时器时间设的越短掉帧时间越严重，而且性能牺牲很严重
 **requestAnimationFrame** 的出现让我们有了除了这两种我们常用的方案之外的另一种更优的选择
