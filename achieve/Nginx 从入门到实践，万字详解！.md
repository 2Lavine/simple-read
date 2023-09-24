> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844904144235413512?searchId=20230915142219A3CD8A18673BC5C81FAC)



Nginx 介绍
-----------
传统的 Web 服务器，每个客户端连接作为一个单独的进程或线程处理，需在切换任务时将 CPU 切换到新的任务并创建一个新的运行时上下文，消耗额外的内存和 CPU 时间


---
Nginx 的最重要的几个使用场景：
1.  静态资源服务，通过本地文件系统提供服务；
2.  反向代理服务，延伸出包括缓存、负载均衡等；
3.  API 服务，OpenResty ；


相关概念
-------

### 2.1 简单请求和非简单请求

首先我们来了解一下简单请求和非简单请求，如果同时满足下面两个条件，就属于简单请求：
1.  请求方法是 `HEAD`、`GET`、`POST` 三种之一；
2.  HTTP 头信息不超过右边着几个字段：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID` `Content-Type` 只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`；

凡是不同时满足这两个条件的，都属于非简单请求。


### **简单请求**
对于简单请求，浏览器会在头信息中增加 `Origin` 字段后直接发出，`Origin` 字段用来说明，本次请求来自的哪个源（协议 + 域名 + 端口）。

如果服务器发现 `Origin` 指定的源不在许可范围内，服务器会返回一个正常的 HTTP 回应，浏览器取到回应之后发现回应的头信息中没有包含 `Access-Control-Allow-Origin` 字段，就抛出一个错误给 XHR 的 `error` 事件；

如果服务器发现 `Origin` 指定的域名在许可范围内，服务器返回的响应会多出几个 `Access-Control-` 开头的头信息字段。

### **非简单请求**
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或 `Content-Type` 值为 `application/json`。浏览器会在正式通信之前，发送一次 HTTP 预检 `OPTIONS` 请求，先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 请求方法和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XHR` 请求，否则报错。

### 2.3 正向代理和反向代理


**正向代理：** 一般的访问流程是客户端直接向目标服务器发送请求并获取内容，使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转交请求并获得的内容，再返回给客户端。正向代理隐藏了真实的客户端，为客户端收发请求，使真实客户端对服务器不可见；
举个具体的例子 🌰，你的浏览器无法直接访问谷哥，这时候可以通过一个代理服务器来帮助你访问谷哥，那么这个服务器就叫正向代理。


---
**反向代理：** 与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后将请求转发给内部网络上真正进行处理的服务器，得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器收发请求，使真实服务器对客户端不可见。一般在处理跨域请求的时候比较常用。现在基本上所有的大型网站都设置了反向代理。



---
举个具体的例子 🌰，去饭店吃饭，可以点川菜、粤菜、江浙菜，饭店也分别有三个菜系的厨师 👨‍🍳，但是你作为顾客不用管哪个厨师给你做的菜，只用点菜即可，小二将你菜单中的菜分配给不同的厨师来具体处理，那么这个小二就是反向代理服务器。

简单的说，一般给客户端做代理的都是正向代理，给服务器做代理的就是反向代理。
正向代理和反向代理主要的原理区别可以参见下图：

![[../_resources/fdde0a042a13510755dae142f74d6b4d_MD5.webp]]

### 2.5 动静分离

为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务器的压力。

![[../_resources/72f7e9547028153e9bca11bfafac5323_MD5.png]]

一般来说，都需要将动态资源和静态资源分开，由于 Nginx 的高并发和静态资源缓存等特性，经常将静态资源部署在 Nginx 上。如果请求的是静态资源，直接到静态资源目录获取资源，如果是动态资源的请求，则利用反向代理的原理，把请求转发给对应后台应用去处理，从而实现动静分离。

使用前后端分离后，可以很大程度提升静态资源的访问速度，即使动态服务不可用，静态资源的访问也不会受到影响。

Nginx 快速安装
-------------
### 3.3 跑起来康康

安装之后开启 Nginx，如果系统开启了防火墙，那么需要设置一下在防火墙中加入需要开放的端口，下面列举几个常用的防火墙操作（没开启的话不用管这个）：

```
systemctl start firewalld  # 开启防火墙
systemctl stop firewalld   # 关闭防火墙
systemctl status firewalld # 查看防火墙开启状态，显示running则是正在运行
firewall-cmd --reload      # 重启防火墙，永久打开端口需要reload一下

# 添加开启端口，--permanent表示永久打开，不加是临时打开重启之后失效
firewall-cmd --permanent --zone=public --add-port=8888/tcp

# 查看防火墙，添加的端口也可以看到
firewall-cmd --list-all
```

然后设置 Nginx 的开机启动：

```
systemctl enable nginx
```

启动 Nginx （其他命令后面有详细讲解）：

```
systemctl start nginx
```

然后访问你的 IP，这时候就可以看到 Nginx 的欢迎页面了～ `Welcome to nginx！` 👏

5 Nginx 配置语法
-------------

就跟前面文件作用讲解的图所示，Nginx 的主配置文件是 `/etc/nginx/nginx.conf`，你可以使用 `cat -n nginx.conf` 来查看配置。

`nginx.conf` 结构图可以这样概括：

```
main        # 全局配置，对全局生效
├── events  # 配置影响 Nginx 服务器或与用户的网络连接
├── http    # 配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置
│   ├── upstream # 配置后端服务器具体地址，负载均衡配置不可或缺的部分
│   ├── server   # 配置虚拟主机的相关参数，一个 http 块中可以有多个 server 块
│   ├── server
│   │   ├── location  # server 块可以包含多个 location 块，location 指令用于匹配 uri
│   │   ├── location
│   │   └── ...
│   └── ...
└── ...
```

一个 Nginx 配置文件的结构就像 `nginx.conf` 显示的那样，配置文件的语法规则：

1.  配置文件由指令与指令块构成；
2.  每条指令以 `;` 分号结尾，指令与参数间以空格符号分隔；
3.  指令块以 `{}` 大括号将多条指令组织在一起；
4.  `include` 语句允许组合多个配置文件以提升可维护性；
6.  使用 `$` 符号使用变量；

### 5.1 典型配置

Nginx 的典型配置：

```
user  nginx;                        # 运行用户，默认即是nginx，可以不进行设置
worker_processes  1;                # Nginx 进程数，一般设置为和 CPU 核数一样
error_log  /var/log/nginx/error.log warn;   # Nginx 的错误日志存放目录
pid        /var/run/nginx.pid;      # Nginx 服务启动时的 pid 存放位置

events {
    use epoll;     
	# 使用epoll的I/O模型(如果你不知道Nginx该使用哪种轮询方法，会自动选择一个最适合你操作系统的)
    worker_connections 1024;   # 每个进程允许最大并发数
}

http {   
	# 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
    # 设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   # Nginx访问日志存放位置

    sendfile            on;   # 开启高效传输模式
    tcp_nopush          on;   # 减少网络报文段的数量
    tcp_nodelay         on;
    keepalive_timeout   65;   # 保持连接的时间，也叫超时时间，单位秒
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;      # 文件扩展名与类型映射表
    default_type        application/octet-stream;   # 默认文件类型

    include /etc/nginx/conf.d/*.conf;   # 加载子配置项
    
    server {
    	listen       80;       # 配置监听的端口
    	server_name  localhost;    # 配置的域名
    	
    	location / {
    		root   /usr/share/nginx/html;  # 网站根目录
    		index  index.html index.htm;   # 默认首页文件
    		deny 172.168.22.11;   # 禁止访问的ip地址，可以为all
    		allow 172.168.33.44； # 允许访问的ip地址，可以为all
    	}
    	
    	error_page 500 502 503 504 /50x.html;  # 默认50x对应的访问页面
    	error_page 400 404 error.html;   # 同上
    }
}
```

server 块可以包含多个 location 块，location 指令用于匹配 uri，语法：

```
location [ = | ~ | ~* | ^~] uri {
	...
}
```

指令后面：

1.  `=` 精确匹配路径，用于不含正则表达式的 uri 前，如果匹配成功，不再进行后续的查找；
2.  `^~` 用于不含正则表达式的 uri； 前，表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找；
3.  `~` 表示用该符号后面的正则去匹配路径，区分大小写；
4.  `~*` 表示用该符号后面的正则去匹配路径，不区分大小写。跟 `~` 优先级都比较低，如有多个 location 的正则能匹配的话，则使用正则表达式最长的那个；

如果 uri 包含正则表达式，则必须要有 `~` 或 `~*` 标志。

### 5.2 全局变量

Nginx 有一些常用的全局变量，你可以在配置的任何位置使用它们，如下表如\$host，\$http_cookie：


6.设置二级域名虚拟主机
-------------

在某某云 ☁️ 上购买了域名之后，就可以配置虚拟主机了，一般配置的路径在 `域名管理 -> 解析 -> 添加记录` 中添加二级域名，配置后某某云会把二级域名也解析到我们配置的服务器 IP 上，然后我们在 Nginx 上配置一下虚拟主机的访问监听，就可以拿到从这个二级域名过来的请求了。
现在我自己的服务器上配置了一个 fe 的二级域名，也就是说在外网访问 `fe.sherlocked93.club` 的时候，也可以访问到我们的服务器了。

由于默认配置文件 `/etc/nginx/nginx.conf` 的 http 模块中有一句 `include /etc/nginx/conf.d/*.conf` 也就是说 `conf.d` 文件夹下的所有 `*.conf` 文件都会作为子配置项被引入配置文件中。为了维护方便，我在 `/etc/nginx/conf.d` 文件夹中新建一个 `fe.sherlocked93.club.conf` ：

```
# /etc/nginx/conf.d/fe.sherlocked93.club.conf

server {
  listen 80;
	server_name fe.sherlocked93.club;

	location / {
		root  /usr/share/nginx/html/fe;
		index index.html;
	}
}
```

然后在 `/usr/share/nginx/html` 文件夹下新建 fe 文件夹，新建文件 `index.html`，内容随便写点，改完 `nginx -s reload` 重新加载，浏览器中输入 `fe.sherlocked93.club`，发现从二级域名就可以访问到我们刚刚新建的 fe 文件夹：

![[../_resources/4e80a8960513b5b64fe2c780adb8779e_MD5.webp]]

7.配置反向代理
---------

首先进入 Nginx 的主配置文件：

```
vim /etc/nginx/nginx.conf
```

增加一行将默认网址重定向到最大学习网站 Bilibili 的 `proxy_pass` 配置 🤓 ：

![[../_resources/d0cdb40369a0e9421a03098611e63894_MD5.webp]]

改完保存退出，`nginx -s reload` 重新加载，进入默认网址，那么现在就直接跳转到 B 站了，实现了一个简单的代理。

实际使用中，可以将请求转发到本机另一个服务器上，也可以根据访问的路径跳转到不同端口的服务中。

比如我们监听 `9001` 端口，然后把访问不同路径的请求进行反向代理：

1.  把访问 `http://127.0.0.1:9001/edu` 的请求转发到 `http://127.0.0.1:8080`
2.  把访问 `http://127.0.0.1:9001/vod` 的请求转发到 `http://127.0.0.1:8081`

这种要怎么配置呢，首先同样打开主配置文件，然后在 http 模块下增加一个 server 块：

```
server {
  listen 9001;
  server_name *.sherlocked93.club;

  location ~ /edu/ {
    proxy_pass http://127.0.0.1:8080;
  }
  
  location ~ /vod/ {
    proxy_pass http://127.0.0.1:8081;
  }
}
```

反向代理还有一些其他的指令，可以了解一下：

1.  `proxy_set_header`：在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息。
2.  `proxy_connect_timeout`：配置 Nginx 与后端代理服务器尝试建立连接的超时时间。
3.  `proxy_read_timeout`：配置 Nginx 向后端服务器组发出 read 请求后，等待相应的超时时间。
4.  `proxy_send_timeout`：配置 Nginx 向后端服务器组发出 write 请求后，等待相应的超时时间。
5.  `proxy_redirect`：用于修改后端服务器返回的响应头中的 Location 和 Refresh。

