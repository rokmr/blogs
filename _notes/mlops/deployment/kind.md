---
title: "Kind (Kubernetes in Docker)"
subject: mlops
tags: [deployment, docker, kubernetes, mlops, ops]
description: "Local Kubernetes clusters with Kind for development and testing"
order: 5
---
## Commands

```bash
kind create cluster --name my-cluster
kubectl get nodes
kind load --help
kind delete cluster --name my-cluster
```

## Key Features

- Allows running multiple clusters (not possible through minikube/Docker Desktop)
- Can create multinode clusters

## Node Types

- **Control Plane:** Manages cluster state
- **Worker:** Runs application workloads
