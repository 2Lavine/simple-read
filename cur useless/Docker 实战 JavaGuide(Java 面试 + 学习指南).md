> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [javaguide.cn](https://javaguide.cn/tools/docker/docker-in-action.html)

[#](#docker-数据卷) Docker 数据卷
---------------------------

学习了容器的相关指令之后，我们来了解一下 Docker 中的数据卷，它能够实现宿主机与容器之间的文件共享，它的好处在于我们对宿主机的文件进行修改将直接影响容器，而无需再将宿主机的文件再复制到容器中。

现在若是想将宿主机中`/opt/apps`目录与容器中`webapps`目录做一个数据卷，则应该这样编写指令：

```
docker kill c2f5d78c5d1a
```

然而此时访问 tomcat 会发现无法访问：

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-data-volume-webapp-8080.png)

这就说明我们的数据卷设置成功了，Docker 会将容器内的`webapps`目录与`/opt/apps`目录进行同步，而此时`/opt/apps`目录是空的，导致`webapps`目录也会变成空目录，所以就访问不到了。

此时我们只需向`/opt/apps`目录下添加文件，就会使得`webapps`目录也会拥有相同的文件，达到文件共享，测试一下：

```
docker rm d5b6c177c151
```

在`/opt/apps`目录下创建了一个 `test.html` 文件，那么容器内的`webapps`目录是否会有该文件呢？进入容器的终端：

```
docker rm -f d5b6c177c151
```

容器内确实已经有了该文件，那接下来我们编写一个简单的 Web 应用：

```
docker rm -f $(docker ps -qa)
```

这是一个非常简单的 Servlet，我们将其打包上传到`/opt/apps`中，那么容器内肯定就会同步到该文件，此时进行访问：

![](https://oss.javaguide.cn/github/javaguide/tools/docker/docker-data-volume-webapp-8080-hello-world.png)

这种方式设置的数据卷称为自定义数据卷，因为数据卷的目录是由我们自己设置的，Docker 还为我们提供了另外一种设置数据卷的方式：

```
docker logs 289cc00dc5ed
```

此时的`aa`并不是数据卷的目录，而是数据卷的别名，Docker 会为我们自动创建一个名为`aa`的数据卷，并且会将容器内`webapps`目录下的所有内容复制到数据卷中，该数据卷的位置在`/var/lib/docker/volumes`目录下：

```
docker logs -f 289cc00dc5ed
```

此时我们只需修改该目录的内容就能能够影响到容器。

最后再介绍几个容器和镜像相关的指令：

```
docker logs -ft 289cc00dc5ed
```

该指令能够将容器打包成一个镜像，此时查询镜像：

```
docker top 289cc00dc5ed
```

若是想将镜像备份出来，则可以使用指令：

```
docker exec -it 289cc00dc5ed bash
```

```
docker cp ./test.html 289cc00dc5ed:/usr/local/tomcat/webapps
```

若是拥有`.tar`格式的镜像，该如何将其加载到 Docker 中呢？执行指令：

```
[root@izrcf5u3j3q8xaz ~]# docker exec -it 289cc00dc5ed bash
root@289cc00dc5ed:/usr/local/tomcat# cd webapps
root@289cc00dc5ed:/usr/local/tomcat/webapps# ls
test.html
root@289cc00dc5ed:/usr/local/tomcat/webapps#
```

```
docker cp 289cc00dc5ed:/usr/local/tomcat/webapps/test.html ./
```

