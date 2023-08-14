> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6919308174151385096)

### 设置目标，分解目标

整个流程，主要分为 
- 创建文件阶段 ， 
- 构建，
- 集成 webpack 阶段， 
- 运行项目阶段

二 创建文件阶段
========

1 终端命令行交互

1 终端命令行交互
---
### ① node 修改 bin
我们希望的终端能够识别`mycli` , 然后通过 `mycli create`创建一个项目。
实际上流程大致是这样的通过`mycli`可以指向性执行指定的`node`文件。

1. 新建**mycli.js 文件**
在`bin`文件夹创建的 `mycli.js`文件
```
#!/usr/bin/env node
'use strict';
console.log('hello,world')
```

2. 在`package.json`中声明一下`bin`。

```
{
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "bin": {
    "mycli": "./bin/mycli.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "👽",
}
```


为了在本地调试，`my-cli`文件夹下用`npm link`, 如果在`mac`上需要执行 `sudo npm link`
然后我们随便新建一个文件夹，执行一下 `mycli`。看到成功打印`hello,world`, 第一步算是成功了。

---
在package.json文件中，bin字段用于指定可执行文件的路径。它允许您将项目中的某个脚本或命令行工具作为全局命令使用。

当您在全局安装项目时，bin字段中指定的脚本将被链接到全局的可执行文件路径中，从而使您可以在命令行中直接运行该脚本。这样，您就可以像运行其他全局命令一样运行项目中的脚本。

例如，假设您的项目有一个名为"my-script.js"的脚本，并且您在package.json的bin字段中指定了该脚本的路径为"./bin/my-script.js"。当您在全局安装项目后，可以在命令行中直接运行"my-script"命令，而不需要指定完整的脚本路径。

这对于将项目作为命令行工具分发给其他开发人员或用户非常有用。他们可以通过全局安装您的项目，然后直接在命令行中使用您的工具。

### ② commander -nodejs 终端命令行
---
接下来我们做的是让`node`文件 (`demo`项目中的`mycli.js`) 能够读懂我们的终端命令。
比如说 `mycli create` 创建项目； `mycli start`运行项目; `mycli build` 打包项目； 
为了能够在终端流利的操纵命令行 ，我们引入 `commander` 模块。

---
为了能在终端打印出花里胡哨的颜色，我们引入`chalk`库。

```
const chalk = require('chalk')
const colors = [ 'green' , 'blue' , 'yellow' ,'red'  ]
const consoleColors = {}
/* console color */
colors.forEach(color=>{
    consoleColors[color] = function(text,isConsole=true){
         return isConsole ? console.log( chalk[color](text) ) : chalk[color](text)
    }
})
module.exports = consoleColors
```

#### 简介 commander 常用 api

`Commander.js node.js`命令行界面的完整解决方案, 受 `Ruby Commander`启发。 
前端开发`node cli` 必备技能。
##### 1 `version`版本

```
var program = require('commander');
program
    .version('0.0.1')
    .parse(process.argv);  
```
执行结果
node index.js -V
0.0.1
##### 2 `option`选项
使用`.option()`方法定义`commander`的选项`options`
示例：.option('-n, --name [items2]', 'name description', 'default value')。

```
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
program.parse(process.argv)
if( program.debug ){
    blue('option is debug')
}else if(program.small){
    blue('option is small')
}
```

**终端输入** mycli -d
**终端输出** option is debug

##### 3 `commander`自定义指令 (重点)

作用：添加命令名称， 示例：`.command('add <num>`

1 命令名称 <必须>：命令后面可跟用 <> 或 [] 包含的参数；命令的最后一个参数可以是可变的，像实例中那样在数组后面加入 ... 标志；在命令后面传入的参数会被传入到 `action` 的回调函数以及 `program.args` 数组中。

2 命令描述 <可省略>：如果存在，且没有显示调用 `action(fn)` ，就会启动子命令程序，否则会报错 配置选项 <可省略>：可配置`noHelp、isDefault`等。
#### 使用 commander，添加自定义命令

因为我们做的是脚手架，最基本的功能，创建项目，运行项目 (开发环境), 打包项目 (生产环境)，所以我们添加三个命令

```
/* mycli create 创建项目 */
program
    .command('create')
    .description('create a project ')
    .action(function(){
        green('👽 👽 👽 '+'欢迎使用mycli,轻松构建react ts项目～🎉🎉🎉')
    })

/* mycli start 运行项目 */
program
.command('start')
 .description('start a project')
 .action(function(){
    green('--------运行项目-------')
 })

/* mycli build 打包项目 */
program
.command('build')
.description('build a project')
.action(function(){
    green('--------构建项目-------')
})

program.parse(process.argv)
```

### ③ inquirer 模块命令行交互

我们期望像`vue-cli`或者`dva-cli`再或者是`taro-cli`一样，实现和终端的交互功能。
这就需要另外一个 `nodejs`模块 `inquirer`。`Inquirer.js`提供用户界面和查询会话。
上手：
```
var inquirer = require('inquirer');
inquirer
  .prompt([
    /* 把你的问题传过来 */
  ])
  .then(answers => {
    /* 反馈用户内容 */
  })
  .catch(error => {
    /* 出现错误 */
  });
```

---
由于我们做的是`react`脚手架，所以我们和用户交互问题设定为，
是否创建新的项目？(是 / 否) -> 请输入项目名称？(文本输入) -> 请输入作者？(文本输入) -> 请选择公共管理状态？(单选) `mobx` 或 `redux`。
上述`prompt`第一个参数需要对这些问题做基础配置。我们的 `question` 配置大致是这样

```
const question = [
   {
        name:'conf',              /* key */
        type:'confirm',           /* 确认 */
        message:'是否创建新的项目？' /* 提示 */
    },{
        name:'name',
        message:'请输入项目名称？',
        when: res => Boolean(res.conf) /* 是否进行 */
    },{
        name:'author',
        message:'请输入作者？',
        when: res => Boolean(res.conf)
    },{
        type: 'list',            /* 选择框 */
        message: '请选择公共管理状态？',
        name: 'state',
        choices: ['mobx','redux'], /* 选项*/
        filter: function(val) {    /* 过滤 */
          return val.toLowerCase()
        },
        when: res => Boolean(res.conf)
    }
]

```

---
然后我们在 `command('create')` 回调 `action()`里面继续加上如下代码。

```
program
    .command('create')
    .description('create a project ')
    .action(function(){
        green('👽 👽 👽 '+'欢迎使用mycli,轻松构建react ts项目～🎉🎉🎉')
        inquirer.prompt(question).then(answer=>{
            console.log('answer=', answer )
        })
    })
```

---
接下来我们要做的是，根据用户提供的信息`copy`项目文件，
`copy`文件有两种方案，
第一种项目模版存在脚手架中，第二种就是向`github`这种远程拉取项目模版，
我们在这里用的是第一种方案。
我们在脚手架项目中新建`template`文件夹。放入`react-typescript`模版。接下来要做的是就是复制整个`template`项目模版了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c851b111b10f4766a3bd4dc98cd4e9e2~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

2 深拷贝文件
---

由于我们的`template`项目模版，有可能是深层次的 文件夹 -> 文件 结构，我们需要深复制项目文件和文件夹。所以需要`node`中原生模块`fs`模块来助阵。`fs`大部分`api`是异步 I/O 操作, 所以需要一些小技巧来处理这些异步操作，我们稍后会讲到。

### 2 递归复制项目文件

#### 实现思路

思路：

① 选择项目模版 ：首先解析在第一步`inquirer`交互模块下用户选择的项目配置，我们项目有可能有多套模版。因为比如上述选择状态管理`mobx`或者是`redux`，再比如说是选择`js`项目，或者是`ts`项目，项目的架构和配置都是不同的，一套模版满足不了所有情况。我们在`demo`中，就用了一种模版, 就是最常见的`react ts`项目模版，这里指的就是在`template`文件下的项目模版。

② 修改配置：对于我们在`inquirer`阶段，提供的配置项，比如项目名称，作者等等，需要我们对项目模版单独处理, 修改配置项。这些信息一般都存在`package.json`中。

③ 复制模版生成项目： 选择好了项目模版，首先我们遍历整个`template`文件夹下面所有文件，判断子文件**文件类型**，如果是文件就直接复制文件，如果是文件夹，创建文件夹，然后**递归**遍历文件夹下子文件，重复以上的操作。直到所有的文件全部复制完成。

④ 通知主程序执行下一步操作。
#### 核心代码

```
const create = require('../src/create')

program
    .command('create')
    .description('create a project ')
    .action(function(){
        green('👽 👽 👽 '+'欢迎使用mycli,轻松构建react ts项目～🎉🎉🎉')
        /* 和开发者交互，获取开发项目信息 */
        inquirer.prompt(question).then(answer=>{
           if(answer.conf){
              /* 创建文件 */
              create(answer)
           }
        })
    })

```

接下来就是第一阶段核心：

##### 第一步：选择模版

**`create`方法**

```
module.exports = function(res){
    /* 创建文件 */
    utils.green('------开始构建-------')
    /* 找到template文件夹下的模版项目 */
    const sourcePath = __dirname.slice(0,-3)+'template'
    utils.blue('当前路径:'+ process.cwd())
    /* 修改package.json*/
    revisePackageJson( res ,sourcePath ).then(()=>{
        copy( sourcePath , process.cwd() ,npm() )
    })
}
```

在这里我们要弄明白两个路径的意义：

**`__dirname`**:`Node.js`中,`__dirname`总是指向被执行 `js` 文件的绝对路径, 所以当你在 `/d1/d2/mycli.js`文件中写了`__dirname`, 它的值就是`/d1/d2`。

**`process.cwd()`** : `process.cwd()` 方法会返回 `Node.js` 进程的当前工作目录。

第一步实际很简单，选择好我们要复制文件夹的路径，然后根据用户信息进行修改`package.json`

##### 第二步：修改配置

模版项目中的`package.json`，我们这里简单的做一个替换，将 `demoName` 和 `demoAuthor` 替换成用户输入的项目名称和项目作者。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a24e7a86362468c8e0fa582f761b1db~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```
{
  "name": "demoName",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "mycli start",
    "build": "mycli build"
  },
  "author": "demoAuthor",
  "license": "ISC",
  "dependencies": {
    "@types/react": "^16.9.25",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-router": "^5.1.2",
    "react-router-dom": "^5.1.2",
    //...更多内容
  },
}
```

**revisePackageJson 修改`package.json`**

```
function revisePackageJson(res,sourcePath){
    return new Promise((resolve)=>{
      /* 读取文件 */
        fs.readFile(sourcePath+'/package.json',(err,data)=>{
            if(err) throw err
            const { author , name  } = res
            let json = data.toString()
            /* 替换模版 */
            json = json.replace(/demoName/g,name.trim())
            json = json.replace(/demoAuthor/g,author.trim())
            const path = process.cwd()+ '/package.json'
            /* 写入文件 */
            fs.writeFile(path, new Buffer(json) ,()=>{
                utils.green( '创建文件：'+ path )
                resolve()
            })
        })
    })
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d89889e9b394cfcb1ef3ae88f90e517~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

效果如上所示, 这一步实际流程很简单，就是读取`template`中的`package.json`文件，然后根据模版替换，接下来重新在目标目录中生成`package.json`。接下来`revisePackageJson`返回的`promise`中进行真正的复制文件流程。

##### 第三步：复制文件

```
let fileCount = 0  /* 文件数量 */
let dirCount = 0   /* 文件夹数量 */
let flat = 0       /* readir数量 */
/**
 * 
 * @param {*} sourcePath   //template资源路径
 * @param {*} currentPath  //当前项目路径
 * @param {*} cb           //项目复制完成回调函数 
 */
function copy (sourcePath,currentPath,cb){
    flat++
    /* 读取文件夹下面的文件 */
    fs.readdir(sourcePath,(err,paths)=>{
        flat--
        if(err){
            throw err
        }
        paths.forEach(path=>{
            if(path !== '.git' && path !=='package.json' ) fileCount++
            const  newSoucePath = sourcePath + '/' + path
            const  newCurrentPath = currentPath + '/' + path
            /* 判断文件信息 */
            fs.stat(newSoucePath,(err,stat)=>{
                if(err){
                    throw err
                }
                /* 判断是文件，且不是 package.json  */
                if(stat.isFile() && path !=='package.json' ){
                    /* 创建读写流 */
                    const readSteam = fs.createReadStream(newSoucePath)
                    const writeSteam = fs.createWriteStream(newCurrentPath)
                    readSteam.pipe(writeSteam)
                    color.green( '创建文件：'+ newCurrentPath  )
                    fileCount--
                    completeControl(cb)
                /* 判断是文件夹，对文件夹单独进行 dirExist 操作 */    
                }else if(stat.isDirectory()){
                    if(path!=='.git' && path !=='package.json' ){
                        dirCount++
                        dirExist( newSoucePath , newCurrentPath ,copy,cb)
                    }
                }
            })
        })
    })
}

/**
 * 
 * @param {*} sourcePath  //template资源路径
 * @param {*} currentPath  //当前项目路径
 * @param {*} copyCallback  // 上面的 copy 函数
 * @param {*} cb    //项目复制完成回调函数 
 */
function dirExist(sourcePath,currentPath,copyCallback,cb){
    fs.exists(currentPath,(ext=>{
        if(ext){
            /* 递归调用copy函数 */
            copyCallback( sourcePath , currentPath,cb)
        }else {
            fs.mkdir(currentPath,()=>{
                fileCount--
                dirCount--
                copyCallback( sourcePath , currentPath,cb)
                color.yellow('创建文件夹：'+ currentPath )
                completeControl(cb)
            })
        }
    }))
}

```

这一步的流程大致是这样的，首先用 `fs.readdir`读取`template`文件夹下面的文件，然后通过 `fs.stat`读取文件信息，判断文件的类型，如果当前文件类型是**文件类型**，那么通过读写流`fs.createReadStream`和`fs.createWriteStream`创建文件；如果当前文件类型是**文件夹类型**，判断文件夹是否存在，如果当前文件夹存在，递归调用`copy`复制文件夹下面的文件, 如果不存在，那么重新新建文件夹，然后执行递归调用。这里有一点注意的是，由于我们对`package.json`单独处理，所以这里的一切文件操作应该排除`package.json`。因为我们要在整个项目文件全部复制后，进行自动下载依赖等后续操作。

### **小技巧：三变量计数法控制异步 I/O 操作**

**如何才能够判断所有的文件都已经复制完成呢** ，这里我们没有引入第三方异步流程库，而是巧妙的运用**变量计数法**来判断是否所有文件均以复制完毕。

变量一`flat`: 每一次 **copy** 函数调用, 会执行异步`fs.readdir`读取文件夹下面的所有文件, 我们用 `flat++`记录 `readdir`数量， 每次`readdir`完成执行`flat--`。

变量二`fileCount`: 每一次文件 (可能文件或者文件夹) 的遍历，我们用`fileCount++`来记录，当文件创建完成或者文件夹创建完成，执行 `fileCount--` 。

变量三`dirCount`: 每一次判断文件夹的操作，我们用 `dirCount++`来记录，当新的文件夹被创建完成，执行 `dirCount--`。

```
function completeControl(cb){
    /* 三变量均为0，异步I/O执行完毕。 */
    if(fileCount === 0 && dirCount ===0 && flat===0){
        color.green('------构建完成-------')
        if(cb && !isInstall ){
            isInstall = true
            color.blue('-----开始install-----')
            cb(()=>{
                color.blue('-----完成install-----')
                /* 判断是否存在webpack  */
                runProject()
            })
        }
    }
}

```

我们在每次创建文件或文件夹事件执行之后，都会调用`completeControl`方法，通过判断`flat`,`fileCount`,`dirCount`三个变量均为 **0**，就能判断出整个复制流程, 执行完毕, 并作出下一步操作。

三 构建，集成项目阶段
===========
1 解析命令，自动运行命令行。
---------------
之前我们通过修改`bin`，借助`commander`模块来通过输入终端**命令行**，来执行`node`文件，来对应启动我们的程序。
接下来我们要做的是通过`nodejs`代码，来执行对应的**终端命令**。
我们需要在复制整个项目目录之后，来**自动下载依赖`npm, install`，启动项目`npm start`**。
首先我们在`mycli`脚手架项目的`src`文件夹下，新建`npm.js`，用来处理下载依赖，启动项目操作。
### ①`which`模块助力找到`npm`

像 unixwhich 实用程序一样。在 PATH 环境变量中查找指定可执行文件的第一个实例。
不缓存结果，因此 hash -rPATH 更改时不需要。
也就是说我们可以找到`npm`实例，通过代码层面控制`npm`做某些事。

**例子🌰🌰🌰：**

```
var which = require('which')
//异步用法
which('node', function (er, resolvedPath) {
  // 如果在PATH上找不到“节点”，则返回er
  // 如果找到，则返回exec的绝对路径
})
//同步用法
const resolved = which.sync('node')
```

**在 npm.js 下**
```
const which = require('which')
/* 找到npm */
function findNpm() {
  var npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm']
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i])
      console.log('use npm: ' + npms[i])
      return npms[i]
    } catch (e) {
    }
  }
  throw new Error('please install npm')
}
```

### ② child_process.spawn 运行终端命令

在上面我们成功找到`npm`之后，需要用 `child_process.spawn`运行当前命令。
`child_process.spawn(command[, args][, options])`
`command <string>` 要运行的命令。 `args <string[]>` 字符串参数列表。 

`options <Object>` 配置参数。

```
/**
 * 
 * @param {*} cmd   
 * @param {*} args 
 * @param {*} fn 
 */
/* 运行终端命令 */ 
function runCmd(cmd, args, fn) {
  args = args || []
  var runner = require('child_process').spawn(cmd, args, {
    stdio: 'inherit'
  })
  runner.on('close', function (code) {
    if (fn) {
      fn(code)
    }
  })
}

```

### ③编写 npm 方法

接下来我们①②步骤的内容整合在一起，把整个`npm.js` `npm`方法暴露出去.

```
/**
 * 
 * @param {*} installArg  执行命令 命令行组成的数组，默认为 install 
 */
module.exports = function (installArg = [ 'install' ]) {
  /* 通过第一步,闭包保存npm */  
  const npm = findNpm()
  return function (done){
    /* 执行命令 */  
    runCmd(which.sync(npm),installArg, function () {
        /* 执行成功回调 */
        done && done()
     })
  }
}
```

**使用例子🌰🌰**

```
const npm = require('./npm')

/* 执行 npm install  */
const install = npm()
install()

/* 执行 npm start */
const start = npm(['start])
start()

```

### ④ 完成自动项目安装，项目启动

我们在上一步复制项目中，回调函数`cb`到底是什么？ 相信细心的同学已经发现了。

```
const npm = require('./npm')
 copy( sourcePath , process.cwd() ,npm() )
```

`cb` 函数就是执行`npm install` 的方法。

我们接着上述的复制成功后，启动项目来讲。
在三变量判断项目创建成功之后, 我们开始执行安装项目.

```
function completeControl(cb){
    if(fileCount === 0 && dirCount ===0 && flat===0){
        color.green('------构建完成-------')
        if(cb && !isInstall ){
            isInstall = true
            color.blue('-----开始install-----')
            /* 下载项目 */
            cb(()=>{
                color.blue('-----完成install-----')
                runProject()
            })
        }
    }
}
```

我们在安装依赖成功的回调函数中，继续调用`runProject`启动项目。

```
function runProject(){
    try{
        /* 继续调用 npm 执行，npm start 命令 */
        const start = npm([ 'start' ])
        start()
    }catch(e){
       color.red('自动启动失败，请手动npm start 启动项目')
    }
} 
```

**效果：由于安装依赖时间过长，运行项目阶段没有在视频里展示**
`runProject`代码很简单，继续调用 `npm`， 执行 `npm start` 命令。

到此为止，我们实现了通过 `mycli create` **创建项目**，**安装依赖**，**运行项目**全流程，里面还有集成`webpack`, 进程通信等细节，我们马上慢慢道来。

2 创建子进程，进程通信
------------

我们既然搞定了`mycli create`细节和实现。接下来我们需要实现`mycli start` 和 `mycli build` 两个功能。

### ① 双进程解决方案

我们打算用`webpack`作为脚手架的构建工具。那么我们需要`mycli`主进程，创建一个子进程来管理`webpack`, 合并`webpack`配置项，运行`webpack-dev-serve`等，这里注意的是，我们的主进程是在`mycli`全局脚手架项目中，而我们的子进程要建立在我们本地通过`mycli create`创建的`react`新项目`node_modules`中，所以我们写了一个脚手架的`plugin`用来一方面建立和`mycli`进程通信, 另一方面管理我们的`react`项目的配置，操控`webpack`。

为了方便大家了解，我画了一个流程图。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44120cffa2ac434cb68f20a9ecba57d3~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

`mycli-react-webpack-plugin`在创建项目中`package.json`中，我们在安装依赖的过程中，已经安装在了新建项目的`node_modules`中。

### ② mycli start 和 mycli build

#### 第一步：完善 `mycli start` 和 `mycli build`

接下来我们在`mycli`脚手架项目`src`文件夹下面创建`start.js`为了和上述的`plugin`建立起进程通信。因为无论是执行`mycli start`或者是 `mycli build`都是需要操纵`webpack`所以我们写在了一起了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a15166d0a33439c817c8f87653a0894~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

我们继续在`mycli.js`中完善 `mycli start` 和 `mycli build`两个指令。

```
const start = require('../src/start')
/* mycli start 运行项目 */
program
.command('start')
 .description('start a project')
 .action(function(){
    green('--------运行项目-------')
    /* 运行项目 */
     start('start').then(()=>{
		green('-------✅  ✅运行完成-------')
	})
 })

/* mycli build 打包项目 */
program
.command('build')
.description('build a project')
.action(function(){
    green('--------构建项目-------')
    /* 打包项目 */
    start('build').then(()=>{
		green('-------✅  ✅构建完成-------')
	})
})

```

#### 第二步：start.js 进程通信

##### child_process.fork 介绍

`modulePath`：子进程运行的模块。

参数说明：（重复的参数说明就不在这里列举）

`execPath`： 用来创建子进程的可执行文件，默认是`/usr/local/bin/node`。也就是说，你可通过`execPath`来指定具体的`node`可执行文件路径。（比如多个`node`版本） `execArgv：:` 传给可执行文件的字符串参数列表。默认是 `process.execArgv`，跟父进程保持一致。 `silent：` 默认是`false`，即子进程的 stdio 从父进程继承。如果是`true`，则直接`pipe`向子进程的`child.stdin、child.stdout`等。 `stdio：` 如果声明了`stdio`，则会覆盖`silent`选项的设置。

##### 运行子程序

我们在`start.js`中启动**子进程**和上述的`mycli-react-webpack-plugin`建立起通信。接下来就是介绍`start.js`。

**start.js**

```
'use strict';
/* 启动项目 */
const child_process = require('child_process')
const chalk = require('chalk')
const fs = require('fs')
/* 找到mycli-react-webpack-plugin的路径*/
const currentPath = process.cwd()+'/node_modules/mycli-react-webpack-plugin'

/**
 * 
 * @param {*} type  type = start 本地启动项目  type = build 线上打包项目
 */
module.exports = (type) => {
    return new Promise((resolve,reject)=>{
        /* 判断 mycli-react-webpack-plugin 是否存在 */
        fs.exists(currentPath,(ext)=>{
            if(ext){ /* 存在 启动子进程  */
              const children = child_process.fork(currentPath + '/index.js' )
              /* 监听子进程信息 */
              children.on('message',(message)=>{
                  const msg = JSON.parse( message )
                  if(msg.type ==='end'){
                      /* 关闭子进程 */
                      children.kill()
                      resolve()
                  }else if(msg.type === 'error'){
                       /* 关闭子进程 */
                      children.kill()
                      reject()
                  }
              })
              /* 发送cwd路径 和 操作类型 start 还是 build  */
              children.send(JSON.stringify({
                  cwdPath:process.cwd(),
                  type: type || 'build'
              }))
            }else{ /* 不存在，抛出警告，下载 */
               console.log( chalk.red('mycli-react-webpack-plugin does not exist , please install mycli-react-webpack-plugin')   )
            }
        })
    })
}
```

这一步实际很简单，大致分为二步:

1 判断 `mycli-react-webpack-plugin` 是否存在，如果存在启动 `mycli-react-webpack-plugin`下的`index.js`为子进程。如果不存在，抛出警告下载`plugin`。

2 绑定子进程事件`message`, 向子进程发送指令，是**启动项目**还是**构建项目**。

### ③ mycli-react-webpack-plugin

接下来做的事就是让`mycli-react-webpack-plugin` 完成**项目配置**，**项目构建**流程。

#### 1 项目结构

**`mycli-react-webpack-plugin`插件项目文件结构**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8593363eb6c94455a4c25b717f1f95a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

项目目录大致是如上的样子，`config`文件下，是不同构建环境的基础配置文件, 在项目构建过程中，会读取创建新项目的`mycli.config.js`在生产环境和开发环境的配置项，然后合并配置项。

**我们的新创建项目的`mycli.config.js`**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9191ac6486c4df6b516e50289481df5~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 2 入口文件

```
const RunningWebpack = require('./lib/run')

/**
 * 创建一个运行程序，在webpack的不同环境下运行配置文件
 */

/* 启动 RunningWebpack 实例 */
const runner = new RunningWebpack()

process.on('message',message=>{
   const msg = JSON.parse( message )
   if(msg.type && msg.cwdPath ){
     runner.listen(msg).then(
          ()=>{
             /* 构建完成 ，通知主进程 ，结束子进程 */ 
             process.send(JSON.stringify({ type:'end' }))
          },(error)=>{
             /* 出现错误 ，通知主进程 ，结束子进程 */     
             process.send(JSON.stringify({ type:'error' , error }))
          }
      )
   }
})
```

我们这里用`RunningWebpack`来执行一系列的`webpack`启动, 打包操作。

3 合并配置项，自动启动 webpack。
---------------------

### ① 基于 `EventEmitter`的 `RunningWebpack`

我们的 `RunningWebpack` 基于 `nodejs` 的 `EventEmitter` 模块，`EventEmitter` 可以解决异步 I/O，可以在合适的场景触发不同的`webpack`命令，比如 `start` 或者是 `build`等。

#### EventEmitter 简介

`nodejs`所有的异步 I/O 操作在完成时都会发送一个事件到事件队列。

Node.js 里面的许多对象都会分发事件：一个 `net.Server` 对象会在每次有新连接时触发一个事件， 一个 `fs.readStream` 对象会在文件被打开的时候触发一个事件。 所有这些产生事件的对象都是 `events.EventEmitter` 的实例。

#### 简单用法

```
//event.js 文件
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
event.on('some_event', function() { 
    console.log('some_event 事件触发'); 
}); 
setTimeout(function() { 
    event.emit('some_event'); 
}, 1000); 
```

### ② 合并`webpack`配置项

上述介绍完用 `EventEmitter`作为运行`webpack`的事件模型，接下我们来分析以下，当运行入口文件的时候。

```
runner.listen(msg).then
```

```
const merge = require('./merge')
const webpack = require('webpack')
const runMergeGetConfig = require('../config/webpack.base')
   /**
     * 接受不同的webpack状态，合并
     */
    listen({ type,cwdPath }){
       this.path = cwdPath
       this.type = type
       /* 合并配置项，得到新的webpack配置项 */
       this.config = merge.call(this,runMergeGetConfig( cwdPath )(type))
       return new Promise((resolve,reject)=>{
           this.emit('running',type)
           this.once('error',reject)
           this.once('end',resolve)
       })
    }
```

`listen`入参参数有两个,`type`是主线程的传递过来的`webpack`命令，分为`start`和`build`,`cwdPath`是我们输入终端命令行的绝对路径，接下来我们要做的是读取新创建项目的`mycli.config.js`。然后和我们的**默认配置**进行**合并**操作。

#### runMergeGetConfig

**runMergeGetConfig** 可以根据我们传递的环境 (`start` or `build`) 得到对应的`webpack`基础配置。我们来一起看看`runMergeGetConfig` 做了什么。

```
const merge = require('webpack-merge')
module.exports = function(path){
  return type => {
    if (type==='start') {
      return merge(Appconfig(path), devConfig(path))
    } else {
      return merge(Appconfig(path), proConfig)
    }
  }
}
```

`runMergeGetConfig` 很简单就是将 `base`基础配置，和 `dev`或者`pro`环境进行合并得到脚手架的基本配置，然后再和`mycli.config.js`文件下的自定义配置项合并，我们接着看。

#### merge

我们接着看 `mycli-react-webpack-plugin`插件下，`lib`文件夹下的`merge.js`。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44530b901f1249beb5f37b694f4945ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

```
const fs = require('fs')
const merge = require('webpack-merge')


/* 合并配置 */
function configMegre(Pconf,config){
   const {
      dev = Object.create(null),
      pro = Object.create(null),
      base= Object.create(null)
   } = Pconf
   if(this.type === 'start'){
     return merge(config,base,dev)
   }else{
      return merge(config,base,pro)
   }
}

/**
 * @param {*} config 经过 runMergeGetConfig 得到的脚手架基础配置
 */
function megreConfig(config){
   const targetPath = this.path + '/mycli.config.js'
   const isExi = fs.existsSync(targetPath)
   if(isExi){
     /* 获取开发者自定义配置 */ 
      const perconfig = require(targetPath)
      /**/
      const mergeConfigResult = configMegre.call(this,perconfig,config)
      return mergeConfigResult
   }
   /* 返回最终打包的webpack配置项 */
   return config
}

module.exports = megreConfig
```

这一步实际很简单，获取开发者的自定义配置，然后和脚手架的默认配置合并，得到最终的配置。并会返回给我们的`running`实例。

### ③ 自动启动`webpack`

接下来我们做的是启动`webpack`。生产环境比较简单，直接 `webpack(config)`就可以了。在开发环境中，由于需要`webpack-dev-server`搭建起服务器，然后挂起项目，所以需要我们单独处理。首先将开发环境下的`config`传入`webpack`中得到`compiler`，然后启动`dev-server`服务，`compiler` 作为参数传入`webpack` 并监听我们设置的端口，完成整个流程。

```
const Server = require('webpack-dev-server/lib/Server')
    const webpack = require('webpack')
    const processOptions = require('webpack-dev-server/lib/utils/processOptions')
    const yargs = require('yargs')
    /* 运行生产环境webpack */
    build(){
        try{
            webpack(this.config,(err)=>{
               if(err){
                   /* 如果发生错误 */
                  this.emit('error')
               }else{
                   /* 结束 */
                  this.emit('end')
               }
            })
        }catch(e){
            this.emit('error')
        }

    }
    /* 运行开发环境webpack */
    start(){
        const _this = this
        processOptions(this.config,yargs.argv,(config,options)=>{
            /* 得到webpack  compiler*/
            const compiler = webpack(config)
            /* 创建dev-server服务 */
            const server = new Server(compiler , options )
            /* port 是在webpack.dev.js下的开发环境配置项中 设置的监听端口 */
            server.listen(options.port, options.host, (err) => {
              if (err) {
                _this.emit('error')
                throw err;
              }
            })
        })
    }
```

### ④效果展示

#### mycli start

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3409a0a825e441e883e6be65f3cba45f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

#### mycli build

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d34a9dd94f44cc58afb7aa7f5f35614~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

#### 完整代码

**完整代码**

```
const EventEmitter = require('events').EventEmitter
const Server = require('webpack-dev-server/lib/Server')
const processOptions = require('webpack-dev-server/lib/utils/processOptions')
const yargs = require('yargs')

const merge = require('./merge')
const webpack = require('webpack')
const runMergeGetConfig = require('../config/webpack.base')

/**
 * 运行不同环境下的webpack
 */
class RunningWebpack extends EventEmitter{
    
    /* 绑定 running 方法 */
    constructor(options){
       super()
       this._options = options
       this.path = null
       this.config = null
       this.on('running',(type,...arg)=>{
           this[type] && this[ type ](...arg)
       })
    }
    /* 接受不同状态下的webpack命令 */
    listen({ type,cwdPath }){
       this.path = cwdPath
       this.type = type
       this.config = merge.call(this,runMergeGetConfig( cwdPath )(type))
       return new Promise((resolve,reject)=>{
           this.emit('running',type)
           this.once('error',reject)
           this.once('end',resolve)
       })
    }
    /* 运行生产环境webpack */
    build(){
        try{
            webpack(this.config,(err)=>{
               if(err){
                  this.emit('error')
               }else{
                  this.emit('end')
               }
            })
        }catch(e){
            this.emit('error')
        }

    }
    /* 运行开发环境webpack */
    start(){
        const _this = this
        processOptions(this.config,yargs.argv,(config,options)=>{
            const compiler = webpack(config)
            const server = new Server(compiler , options )

            server.listen(options.port, options.host, (err) => {
              if (err) {
                _this.emit('error')
                throw err;
              }
            })
        })
    }
}
module.exports = RunningWebpack
```

四 运行项目，实现 plugin, 自动化收集 model 阶段
================================

接下来我们要讲的项目运行阶段，一些附加的配置项，和一起其他的操作。

1 实现一个简单的终端加载条的 `plugin`
------------------------

我们写一个`webpack` 的`plugin`做为`mycli`脚手架的工具，为了方便向开发者展示修改的文件，和一次`webpack`构建时间，整个插件是在`webpack`编译阶段完成的。我们需要简单了解`webpack`一些知识。

### ① Compiler 和 Compilation

在开发 `Plugin` 时最常用的两个对象就是 `Compiler` 和 `Compilation` ，它们是 `Plugin` 和 `Webpack` 之间的桥梁。 `Compiler` 和 `Compilation` 的含义如下：

`Compiler` 对象包含了 `Webpack` 环境所有的的配置信息，包含 `options，loaders，plugins` 这些信息，这个对象在 `Webpack` 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 `Webpack` 实例； `Compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 `Webpack` 以开发模式运行时，每当检测到一个文件变化，一次新的 `Compilation` 将被创建。 `Compilation` 对象也提供了很多事件回调供插件做扩展。通过 `Compilation` 也能读取到 `Compiler` 对象。 `Compiler` 和 `Compilation` 的区别在于： `Compiler` 代表了整个 `Webpack` 从启动到关闭的生命周期，而 `Compilation` 只是代表了一次新的编译。

### ② `Compiler` 编译阶段

我们要理解一次`Compiler`各个阶段要做的事，才能在特定的阶段用指定的钩子来完成我们的自定义`plugin`。

#### 1 run

启动一次新的编译

#### 2 watch-run

和 `run` 类似，区别在于它是在监听模式下启动的编译，在这个事件中可以获取到是**哪些文件发生了变化**导致重新启动一次新的编译。

#### 3 compile

该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上 `compiler` 对象。

#### 4 compilation

当 `Webpack` 以开发模式运行时，每当检测到文件变化，一次新的 `Compilation` 将被创建。一个 `Compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等。`Compilation` 对象也提供了很多事件回调供插件做扩展。

#### 5 make

一个新的 `Compilation` 创建完毕，即将从 `Entry` 开始读取文件，根据文件类型和配置的 `Loader` 对文件进行编译，编译完后再找出该文件依赖的文件，递归的编译和解析。

#### 6 after-compile

一次 `Compilation` 执行完成。

#### 7 invalid

当遇到文件不存在、文件编译错误等异常时会触发该事件，该事件不会导致 `Webpack` 退出。

### ③ 编写插件

我们编写的`webpack`插件，需要在改动时候，打印出当前改动的文件 , 并用进度条展示一次编译的时间。

#### 上代码

```
const chalk = require('chalk')
var slog = require('single-line-log');

class MycliConsolePlugin {
    
    constructor(options){
       this.options = options
    }
    apply(compiler){
        /* 监听文件改动 */
        compiler.hooks.watchRun.tap('MycliConsolePlugin', (watching) => {
            const changeFiles = watching.watchFileSystem.watcher.mtimes
            for(let file in changeFiles){
                console.log(chalk.green('当前改动文件：'+ file))
            }
        })
        /* 在一次编译创建之前 */
        compiler.hooks.compile.tap('MycliConsolePlugin',()=>{
            this.beginCompile()
        })
        /* 一次 compile 完成 */
        compiler.hooks.done.tap('MycliConsolePlugin',()=>{
            this.timer && clearInterval( this.timer )
            console.log( chalk.yellow(' 编译完成') )
        })
    }
    /* 开始记录编译 */
    beginCompile(){
       const lineSlog = slog.stdout
       let text  = '开始编译：'

       this.timer = setInterval(()=>{
          text +=  '█'
          lineSlog( chalk.green(text))
       },50)
    }
}
module.exports = RuxConsolePlugin
```

#### 使用

插件的使用，因为我们这个插件是在开发环境下，所以只需要在`webpack.dev.js`加入上述的`MycliConsolePlugin`插件。

```
const webpack = require('webpack')
const MycliConsolePlugin = require('../plugins/mycli-console-pulgin')
const devConfig =(path)=>{
  return  {
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    devServer: {
      contentBase: path + '/dist',
      open: true, /* 自动打开浏览器 */
      hot: true,
      historyApiFallback: true,
      publicPath: '/',
      port: 8888, /* 服务器端口 */
      inline: true,
      proxy: {  /* 代理服务器 */
      }    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MycliConsolePlugin({
        dec:1
      })
    ]
  }
}
module.exports = devConfig
```

#### 效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb18bd3962fb49598cecea40c006f311~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

2 require.context 实现前端自动化
-------------------------

前端自动化已经脱离 `mycli`范畴了，但是为了让大家明白前端自动化流程，这里用`webpack`提供的`API` 中的`require.context`为案例。

### require.context 讲解

```
require.context(directory, useSubdirectories = true, regExp = /^\.\/.*$/, mode = 'sync');
```

可以给这个函数传入三个参数： ① `directory` 要搜索的目录， ② `useSubdirectories` 标记表示是否还搜索其子目录， ③ `regExp` 匹配文件的正则表达式。

`webpack` 会在构建中解析代码中的 `require.context()` 。

官网示例：

```
/* （创建出）一个 context，其中文件来自 test 目录，request 以 `.test.js` 结尾。 */
require.context('./test', false, /\.test\.js$/);

/* （创建出）一个 context，其中所有文件都来自父文件夹及其所有子级文件夹，request 以 `.stories.js` 结尾。 */
require.context('../', true, /\.stories\.js$/);

```

### 实现自动化

我们接着用`mycli`创建的项目作为`demo`, 我们在项目`src`文件夹下面新建`model`文件夹，用来自动收集里面的文件。`model`文件下，有三个文件 `demo.ts` , `demo1.ts` ,`demo2.ts` , 我们接下来做的是自动收集文件下的数据。

**项目目录**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3db678edb60420d99540cc541360bdb~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**demo.ts**

```
const a = 'demo'

export default a
```

· **demo1.ts**

```
const b = 'demo1'

export default b
```

**demo2.ts**

```
const b = 'demo2'

export default b
```

**探索 `require.context`**

```
const file  = require.context('./model',false,/\.tsx?|jsx?$/)
console.log(file)

```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2806e1a51cc54088a5b5a2c32fd505f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

打印`file` ，我们发现`webpack`的方法。接下来我们获取文件名组成的数组。

```
const file  = require.context('./model',false,/\.tsx?|jsx?$/)
console.log(file.keys())
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9aaacad35554330b51cdc9177ad7e76~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

解析来我们自动收集文件下的 a , b ,c 变量。

```
/* 用来收集文件 */
const model ={} 
const file  = require.context('./model',false,/\.tsx?|jsx?$/)

/* 遍历文件 */
file.keys().map(item=>{
    /* 收集数据 */
    model[item] = file(item).default
})

console.log(model)
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adae9722fc234aee93e9e3f920146d07~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

到这里我们实现了自动收集流程。如果深层次递归收集，我们可以将 `require.context` 第二个参数设置为`true`

```
require.context('./model',true,/\.tsx?|jsx?$/)
```

**项目目录**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0553be6424764713be9a2158ebba33fd~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**demo3.ts**

```
const d = 'demo3'

export default d
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc4722b618fd402a8f01c6ba2fe773d2~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

**打印完美递归收集了子文件下的`model`**

