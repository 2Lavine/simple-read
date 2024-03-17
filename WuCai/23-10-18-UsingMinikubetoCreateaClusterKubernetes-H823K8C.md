%%begin highlights%%
Kubernetes automates the distribution and scheduling of application containers across a cluster in a more efficient way

A Kubernetes cluster consists of two types of resources:

The Control Plane coordinates the cluster

Nodes are the workers that run applications

The Control Plane is responsible for managing the cluster

such as scheduling applications, maintaining applications' desired state, scaling applications

A node is a VM or a physical computer

Each node has a Kubelet, which is an agent for managing the node and communicating with the Kubernetes control plane.

A Kubernetes cluster that handles production traffic should have a minimum of three nodes because if one node goes down, both an etcd member and a control plane instance are lost,

When you deploy applications on Kubernetes, you tell the control plane to start the application containers.

%%end highlights%%

!!!PAGE NOTE!!!
%%begin pagenote%%

%%end pagenote%%

 #五彩插件 [原文](https://kubernetes.io/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)
更新时间: 2023-10-18 22:22