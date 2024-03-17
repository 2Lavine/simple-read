> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903736830066695?searchId=20240118154711D0B7224F42C488B76A60)

可能有很多的同学有用 setInterval 控制 ajax 不断向服务端请求最新数据的经历 (轮询) 看
```
setInterval(function() {
    $.get('/get/data-list', function(data, status) {
        console.log(data)
    })
}, 5000)
```

这样每隔 5 秒前端会向后台请求一次数据，实现上看起来很简单但是有个很重要的问题，就是我们没办法控制网速的稳定，不能保证在下次发请求的时候上一次的请求结果已经顺利返回，这样势必会有隐患，有聪明的同学马上会想到用 setTimeout 配合递归看下面的代码：

```
function poll() {
    setTimeout(function() {
        $.get('/get/data-list', function(data, status) {
            console.log(data)
            poll()
        })
    }, 5000)
}
```

当结果返回之后再延时触发下一次的请求，这样虽然没办法保证两次请求之间的间隔时间完全一致但是至少可以保证数据返回的节奏是稳定的，看似已经实现了需求但是这么搞我们先不去管他的性能就代码结构也算不上优雅，
- 为了解决这个问题可以让服务端长时间和客户端保持连接进行数据互通 h5新增了 WebSocket 和 EventSource 用来实现长轮询，下面我们来分析一下这两者的特点以及使用场景。

WebSocket
---------
**是什么：** WebSocket 是一种通讯手段，基于 TCP 协议，默认端口也是 80 和 443，协议标识符是 ws（加密为 wss），它实现了浏览器与服务器的全双工通信，扩展了浏览器与服务端的通信功能，使服务端也能主动向客户端发送数据，不受跨域的限制。

**有什么用：** WebSocket 用来解决 http 不能持久连接的问题，因为可以双向通信所以可以用来实现聊天室，以及其他由服务端主动推送的功能例如 实时天气、股票报价、余票显示、消息通知等。

EventSource
-----------

**是什么：** EventSource 的官方名称应该是 Server-sent events（缩写 SSE）服务端派发事件，EventSource 基于 http 协议只是简单的单项通信，实现了服务端推的过程客户端无法通过 EventSource 向服务端发送数据。
- 虽然不能实现双向通信但是在功能设计上他也有一些优点比如可以自动重连接, event IDs, 以及发送随机事件的能力（WebSocket 要借助第三方库比如 socket.io 可以实现重连。）

**有什么用：** 因为受单项通信的限制 EventSource 只能用来实现像股票报价、新闻推送、实时天气这些只需要服务器发送消息给客户端场景中。
- EventSource 的使用更加便捷这也是他的优点。

WebSocket & EventSource 的区别
---------------------------
1.  WebSocket 基于 TCP 协议，EventSource 基于 http 协议。
2.  EventSource 是单向通信，而 websocket 是双向通信。
3.  EventSource 只能发送文本，而 websocket 支持发送二进制数据。
4.  在实现上 EventSource 比 websocket 更简单。
5.  EventSource 有自动重连接（不借助第三方）以及发送随机事件的能力。
6.  websocket 的资源占用过大 EventSource 更轻量。
7.  websocket 可以跨域，EventSource 基于 http 跨域需要服务端设置请求头。

EventSource 的实现案例
-----------------
客户端代码
```
// 实例化 EventSource 参数是服务端监听的路由
var source = new EventSource('/EventSource-test')
source.onopen = function (event) { // 与服务器连接成功回调
  console.log('成功与服务器连接')
}
// 监听从服务器发送来的所有没有指定事件类型的消息(没有event字段的消息)
source.onmessage = function (event) { // 监听未命名事件
  console.log('未命名事件', event.data)
}
source.onerror = function (error) { // 监听错误
  console.log('错误')
}
// 监听指定类型的事件（可以监听多个）
source.addEventListener("myEve", function (event) {
  console.log("myEve", event.data)
})
```

服务端代码（node.js）

```
const fs = require('fs')
const express = require('express') // npm install express
const app = express()

// 启动一个简易的本地server返回index.html
app.get('/', (req, res) => {
  fs.stat('./index.html', (err, stats) => {
    if (!err && stats.isFile()) {
      res.writeHead(200)
      fs.createReadStream('./index.html').pipe(res)
    } else {
      res.writeHead(404)
      res.end('404 Not Found')
    }
  })
})

// 监听EventSource-test路由服务端返回事件流
app.get('/EventSource-test', (ewq, res) => {
  // 根据 EventSource 规范设置报头
  res.writeHead(200, {
    "Content-Type": "text/event-stream", // 规定把报头设置为 text/event-stream
    "Cache-Control": "no-cache" // 设置不对页面进行缓存
  })
  // 用write返回事件流，事件流仅仅是一个简单的文本数据流，每条消息以一个空行(\n)作为分割。
  res.write(':注释' + '\n\n')  // 注释行
  res.write('data:' + '消息内容1' + '\n\n') // 未命名事件

  res.write(  // 命名事件
    'event: myEve' + '\n' +
    'data:' + '消息内容2' + '\n' +
    'retry:' + '2000' + '\n' +
    'id:' + '12345' + '\n\n'
  )

  setInterval(() => { // 定时事件
    res.write('data:' + '定时消息' + '\n\n')
  }, 2000)
})

// 监听 6788
app.listen(6788, () => {
  console.log(`server runing on port 6788 ...`)
})
```

客户端访问 `http://127.0.0.1:6788/` 会看到如下的输出：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/13/167a6bf535ecd347~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png)

来总结一下相关的 api，客户端的 api 很简单都在注释里了，服务端有一些要注意的地方：

#### 事件流格式？

事件流仅仅是一个简单的文本数据流，文本应该使用 UTF-8 格式的编码。每条消息后面都由一个空行作为分隔符。以冒号开头的行为注释行，会被忽略。

#### 注释有何用？

注释行可以用来防止连接超时，服务器可以定期发送一条消息注释行，以保持连接不断。

#### EventSource 规范中规定了那些字段？

`event：` 事件类型，如果指定了该字段，则在客户端接收到该条消息时，会在当前的 EventSource 对象上触发一个事件，事件类型就是该字段的字段值，你可以使用 addEventListener() 方法在当前 EventSource 对象上监听任意类型的命名事件，如果该条消息没有 event 字段，则会触发 onmessage 属性上的事件处理函数。 `data：` 消息的数据字段，如果该条消息包含多个 data 字段, 则客户端会用换行符把它们连接成一个字符串来作为字段值。 `id：` 事件 ID，会成为当前 EventSource 对象的内部属性 "最后一个事件 ID" 的属性值。 `retry：` 一个整数值，指定了重新连接的时间 (单位为毫秒)，如果该字段值不是整数，则会被忽略。

上文提过 retry 字段是用来指定重连时间的，那为什么要重连呢，我们拿 node 来说，大家知道node 的特点是单线程异步 io，单线程就意味着如果 server 端报错那么服务就会停掉，当然在node 开发的过程中会处理这些异常，但是一旦服务停掉了这时就需要用 pm2 之类的工具去做重启操作，这时候 server 虽然正常了，但是客户端的 EventSource 链接还是断开的这时候就用到了重连。

#### EventSource案例中消息要用 \ n 结尾？

\n 是换行的转义字符，EventSource 规范规定每条消息后面都由一个空行作为分隔符，结尾加一个 \ n 表示一个字段结束，加两个 \ n 表示一条消息结束。(两个 \ n 表示换行之后又加了一个空行)

_注: 如果一行文本中不包含冒号，则整行文本会被解析成为字段名，其字段值为空。_

WebSocket 的实现案例
---------------

#### WebSocket 的客户端原生 api

`var ws = new WebSocket('ws://localhost:8080')` WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例。
`ws.onopen = function(){}` 用于指定连接成功后的回调函数。
`ws.onclose = function(){}` 用于指定连接关闭后的回调函数
`ws.onmessage = function(){}` 用于指定收到服务器数据后的回调函数
`ws.send('data')` 实例对象的 send() 方法用于向服务器发送数据
`socket.onerror = function(){}` 用于指定报错时的回调函数
#### socket.io 和 ws 有什么不同

`Socket.io：` Socket.io 是一个 WebSocket 库，包括了客户端的 js 和服务器端的 nodejs，它会自动根据浏览器从 WebSocket、AJAX 长轮询、Iframe 流等等各种方式中选择最佳的方式来实现网络实时应用（不支持 WebSocket 的情况会降级到 AJAX 轮询），非常方便和人性化，兼容性非常好，支持的浏览器最低达 IE5.5。屏蔽了细节差异和兼容性问题，实现了跨浏览器 / 跨设备进行双向数据通信。
`ws：` 不像 [socket.io](https://link.juejin.cn?target=http%3A%2F%2Fsocket.io "http://socket.io") 模块， ws 是一个单纯的 websocket 模块，不提供向上兼容，不需要在客户端挂额外的 js 文件。在客户端不需要使用二次封装的 api 使用浏览器的原生 Websocket API 即可通信。
#### 基于 socket.io 实现 WebSocket 双向通信

客户端代码

```
<button id="closeSocket">断开连接</button>
<button id="openSocket">恢复连接</button>
<script src="/socket.io/socket.io.js"></script>
<script>
// 建立连接 默认指向 window.location
let socket = io('http://127.0.0.1:6788')

openSocket.onclick = () => {
  socket.open()  // 手动打开socket 也可以重新连接
}
closeSocket.onclick = () => {
  socket.close() // 手动关闭客户端对服务器的链接
}

socket.on('connect', () => { // 连接成功
  // socket.id是唯一标识，在客户端连接到服务器后被设置。
  console.log(socket.id)
})

socket.on('connect_error', (error) => {
  console.log('连接错误')
})
socket.on('disconnect', (timeout) => {
  console.log('断开连接')
})
socket.on('reconnect', (timeout) => {
  console.log('成功重连')
})
socket.on('reconnecting', (timeout) => {
  console.log('开始重连')
})
socket.on('reconnect_error', (timeout) => {
  console.log('重连错误')
})

// 监听服务端返回事件
socket.on('serverEve', (data) => {
  console.log('serverEve', data)
})

let num = 0
setInterval(() => {
  // 向服务端发送事件
  socket.emit('feEve', ++num)
}, 1000)
```

服务端代码（node.js）

```
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server, {})

// 启动一个简易的本地server返回index.html
app.get('/', (req, res) => {
  res.sendfile(__dirname + '/index.html')
})

// 监听 6788
server.listen(6788, () => {
  console.log(`server runing on port 6788 ...`)
})

// 服务器监听所有客户端 并返回该新连接对象
// 每个客户端socket连接时都会触发 connection 事件
let num = 0
io.on('connection', (socket) => {

  socket.on('disconnect', (reason) => {
    console.log('断开连接')
  })
  socket.on('error', (error) => {
    console.log('发生错误')
  })
  socket.on('disconnecting', (reason) => {
    console.log('客户端断开连接但尚未离开')
  })

  console.log(socket.id) // 获取当前连接进入的客户端的id
  io.clients((error, ids) => {
    console.log(ids)  // 获取已连接的全部客户机的ID
  })

  // 监听客户端发送的事件
  socket.on('feEve', (data) => {
    console.log('feEve', data)
  })
  // 给客户端发送事件
  setInterval(() => {
    socket.emit('serverEve', ++num)
  }, 1000)
})

/*
  io.close()  // 关闭所有连接
*/
```

`const io = require('socket.io')(server, {})` 第二个参数是配置项，可以传入如下参数：

*   path: '/socket.io' 捕获路径的名称
*   serveClient: false 是否提供客户端文件
*   pingInterval: 10000 发送消息的时间间隔
*   pingTimeout: 5000 在该时间下没有数据传输连接断开
*   origins: '*' 允许跨域
*   ...

上面基于 socket.io 的实现中 `express` 做为 socket 通信的依赖服务基础 `socket.io` 作为 socket 通信模块，实现了双向数据传输。最后，需要注意的是，在服务器端 `emit` 区分以下三种情况：

*   `socket.emit()` ：向建立该连接的客户端发送
*   `socket.broadcast.emit()` ：向除去建立该连接的客户端的所有客户端发送
*   `io.sockets.emit()` ：向所有客户端发送 等同于上面两个的和
*   `io.to(id).emit()` : 向指定 id 的客户端发送事件

#### 基于 ws 实现 WebSocket 双向通信
客户端代码
```
let num = 0
let ws = new WebSocket('ws://127.0.0.1:6788')
ws.onopen = (evt) => {
  console.log('连接成功')
  setInterval(() => {
    ws.send(++ num)  // 向服务器发送数据
  }, 1000)
}
ws.onmessage = (evt) => {
  console.log('收到服务端数据', evt.data)
}
ws.onclose = (evt) => {
  console.log('关闭')
}
ws.onerror = (evt) => {
  console.log('错误')
}
closeSocket.onclick = () => {
  ws.close()  // 断开连接
}
```

服务端代码（node.js）

```
const fs = require('fs')
const express = require('express')
const app = express()

// 启动一个简易的本地server返回index.html
const httpServer = app.get('/', (req, res) => {
  res.writeHead(200)
  fs.createReadStream('./index.html').pipe(res)
}).listen(6788, () => {
  console.log(`server runing on port 6788 ...`)
})

// ws
const WebSocketServer = require('ws').Server
const wssOptions = {  
  server: httpServer,
  // port: 6789,
  // path: '/test'
}
const wss = new WebSocketServer(wssOptions, () => {
  console.log(`server runing on port ws 6789 ...`)
})

let num = 1
wss.on('connection', (wsocket) => {
  console.log('连接成功')

  wsocket.on('message', (message) => {
    console.log('收到消息', message)
  })
  wsocket.on('close', (message) => {
    console.log('断开了')
  })
  wsocket.on('error', (message) => {
    console.log('发生错误')
  })
  wsocket.on('open', (message) => {
    console.log('建立连接')
  })

  setInterval(() => {
    wsocket.send( ++num )
  }, 1000)
})
```

上面代码中在 `new WebSocketServer` 的时候传入了 `server: httpServer` 目的是统一端口，虽然 WebSocketServer 可以使用别的端口，但是统一端口还是更优的选择，其实 express 并没有直接占用 6788 端口而是 express 调用了内置 http 模块创建了 http.Server 监听了 6788。express 只是把响应函数注册到该 http.Server 里面。类似的，WebSocketServer 也可以把自己的响应函数注册到 http.Server 中，这样同一个端口，根据协议，可以分别由 express 和 ws 处理。我们拿到 express 创建的 http.Server 的引用，再配置到 wssOptions.server 里让 WebSocketServer 根据我们传入的 http 服务来启动，就实现了统一端口的目的。

要始终注意，浏览器创建 WebSocket 时发送的仍然是标准的 HTTP 请求。无论是 WebSocket 请求，还是普通 HTTP 请求，都会被 http.Server 处理。具体的处理方式则是由 express 和 WebSocketServer 注入的回调函数实现的。WebSocketServer 会首先判断请求是不是 WS 请求，如果是，它将处理该请求，如果不是，该请求仍由 express 处理。所以，WS 请求会直接由 WebSocketServer 处理，它根本不会经过 express。

* 案例仓库：https://github.com/cp0725/YouChat/tree/master/webSocket-eventSource-test* * 部分概念参考自 https://www.w3cschool.cn/socket/*