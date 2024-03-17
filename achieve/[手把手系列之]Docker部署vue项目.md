> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903837774397447?searchId=202309121410453BA3E28C284DBAA99323)

Docker 部署 vue 项目具体步骤
--------

> 1.  用 vue cli 创建一个 vue 项目，
> 2. 基于 nginx docker 镜像构建成一个前端工程镜像，
> 3. 基于前端工程镜像，启动一个容器 vuenginxcontainer。
> 4.  启动基于 node 镜像的容器 nodewebserver，提供后端接口。
> 5.  修改 vuenginxcontainer 的 nginx 配置，使前端页面的接口请求转发到 nodewebserver 上。


---
  docker 镜像名称由 REPOSITORY 和 TAG 组成 `[REPOSITORY[:TAG]]`，TAG 默认为 latest


---
Docker 容器 Container： 镜像运行时的实体。镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等 。

#### 构建 vue 项目
build完之后工程根目录下多出一个`dist`文件夹。
如果将该 dist 目录整个传到服务器上，部署成静态资源站点就能直接访问到该项目。
接下来就来构建一个这样的静态资源站点。

### 4 构建 vue 应用镜像

我们选用 nginx 镜像作为基础来构建我们的 vue 应用镜像。
获取 nginx 镜像docker pull nginx
在项目根目录下创建`nginx`文件夹，新建文件`default.conf`
该配置文件定义了首页的指向为 `/usr/share/nginx/html/index.html`, 所以我们可以一会把构建出来的 index.html 文件和相关的静态资源放到`/usr/share/nginx/html`目录下。
接着准备 Docker 创建
#### 4.1创建 Dockerfile 文件

```
FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

> *   `FROM nginx` 命令的意思该镜像是基于 nginx:latest 镜像而构建的。
> *   `COPY dist/ /usr/share/nginx/html/` 命令的意思是将项目根目录下 dist 文件夹下的所有文件复制到镜像中 /usr/share/nginx/html/ 目录下。
> *   `COPY nginx/default.conf /etc/nginx/conf.d/default.conf` 命令的意思是将 nginx 目录下的 default.conf 复制到 etc/nginx/conf.d/default.conf，用本地的 default.conf 配置来替换 nginx 镜像里的默认配置。

#### 4.4 基于该 Dockerfile 构建 vue 应用镜像

运行命令（注意不要少了最后的 “.” ）
docker build -t vuenginxcontainer .
- `-t` 是给镜像命名 
- `.` 是基于当前目录的 Dockerfile 来构建镜像
此时我们的`vue`应用镜像 vuenginxcontainer 已经成功创建。

#### 4.5 基于镜像启动 vue app 容器

基于 vuenginxcontainer 镜像启动容器，运行命令：

```
docker run \
-p 3000:80 \
-d --name vueApp \
vuenginxcontainer
```

> *   `docker run` 基于镜像启动一个容器
> *   `-p 3000:80` 端口映射，将宿主的 3000 端口映射到容器的 80 端口
> *   `-d` 后台方式运行
> *   `--name` 容器名 查看 docker 进程


### 5 接口服务

> 再部署一个 node 的容器来提供接口服务

#### 5.1 express 服务

用 node web 框架 `express` 来写一个服务，注册一个返回 json 数据格式的路由 server.js:
运行该 `express` 应用需要 `node` 环境，我们基于 `node` 镜像来构建一个新镜像

-  首先获取 `node` 镜像    docker pull node
- 然后编写 Dockerfile 将 `express` 应用 `docker` 化
- 然后构建 nodewebserver 镜像
- 最后启动对应的容器

### 编写 Dockerfile 将 `express` 应用 `docker` 化
```
FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
```
（最后把本机的 5000 映射到这里的 8080 -p 5000:8080）
构建镜像的时候 node_modules 的依赖直接通过 `RUN npm install` 来安装，项目中创建一个 `.dockerignore`文件来忽略一些直接跳过的文件：

```
node_modules
npm-debug.log
```

### 6. 跨域转发

想要将 vueApp 容器 上的请求转发到 nodeserver 容器上。
*   Nginx 配置 location 指向 node 服务 default.conf 
*   添加一条重写规则，将 /api/{path} 转到目标服务的 /{path} 接口上。 在前面的 nginx/default.conf 文件中加入：

```
location /api/ {
  rewrite  /api/(.*)  /$1  break;
  proxy_pass http://172.17.0.2:8080;
}
```

修改完了之后意识到一个问题：vueApp 容器是基于 vuenginxcontainer 这个镜像运行的，而在一开始构建镜像的时候是将 nginx 配置 default.conf 直接构建进去了。
因此如果需要修改 default.conf 还得再重新构建一个新的镜像，再基于新镜像来运行新的容器。

### 7. 改进

能不能每次修改配置文件后直接重启容器就能让新配置生效，答案当然是有。
在构建镜像的时候不把 Nginx 配置复制到镜像中，而是直接挂载到宿主机上，每次修改配置后，直接重启容器即可。
- 把 vueclidemo 项目下的 Dockerfile 修改一下

```
FROM nginx
COPY dist/  /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

将`COPY nginx/default.conf /etc/nginx/conf.d/default.conf`命令删除，nginx 配置都通过挂载命令挂载在宿主机上。
`COPY dist/ /usr/share/nginx/html/` 命令也可以删除，可以使用挂载的方式来启动容器。

之后直接基于 nginx 镜像来启动容器 vuenginxnew ，运行命令：

```
docker run \
-p 3000:80 \
-d --name vuenginxnew \
--mount type=bind,source=$HOME/SelfWork/docker/vueclidemo/nginx,target=/etc/nginx/conf.d \
--mount type=bind,source=$HOME/SelfWork/docker/vueclidemo/dist,target=/usr/share/nginx/html \
nginx
```

> *   `--mount type=bind,source={sourceDir},target={targetDir}` 将宿主机的 sourceDir 挂载到容器的 targetDir 目录上。
> *   此处运行的命令较长，如果每次重新输入难免麻烦，我们可以将完整的命令保存到一个`shell`文件 `vueapp.sh` 中，然后直接执行 `sh vueapp.sh`。


#### 7.3 配置负载均衡

后端服务一般都是双机或者多机以确保服务的稳定性。
我们可以再启动一个后端服务容器，并修改`nginx`的配置 来优化资源利用率，最大化吞吐量，减少延迟，确保容错配置。

新启动一个容器，查看到 新容器的 IP (172.17.0.3)
修改一下 `nginx/default.conf`（新增 upstream ，修改 location /api/ 中的 proxy_pass）:

```
upstream backend {
      server 172.17.0.2:8080;
      server 172.17.0.3:8080;
  }

  ……

  location /api/ {
      rewrite  /api/(.*)  /$1  break;
      proxy_pass backend;
  }
```

