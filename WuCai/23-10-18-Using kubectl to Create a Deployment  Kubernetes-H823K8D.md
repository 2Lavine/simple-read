%%begin highlights%%
Once the application instances are created, a Kubernetes Deployment controller continuously monitors those instances.

If the Node hosting an instance goes down or is deleted, the Deployment controller replaces the instance with an instance on another Node in the cluster.

ubectl uses the Kubernetes API to interact with the cluster. I

kubectl basics

The common format of a kubectl command is: kubectl action resource

action (like create, describe or delete)

resource (like node or deployment).

To view the nodes in the cluster, run the kubectl get nodes command.

deploy our first app on Kubernetes with the kubectl create deployment command.

We need to provide the deployment name and app image location

Pods that are running inside Kubernetes are running on a private, isolated network. By default they are visible from other pods and services within the same Kubernetes cluster,

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
更新时间: 2023-10-18 22:31