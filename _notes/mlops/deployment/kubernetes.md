---
title: "Kubernetes (K8s)"
description: "Container orchestration, cluster architecture, and deploying ML models to Kubernetes"
subject: mlops
math: false
tags: [containers, deployment, deployment-serving, kubernetes, mlops, ops, orchestration]
status: wip
sitemap: false
order: 4
---

## Overview

Kubernetes (K8s) is the industry standard for automating the deployment, scaling, and management of containerized applications. In MLOps, it is heavily used to orchestrate model serving, data pipelines, and distributed training.

## Core Concepts
- **Pods:** The smallest deployable units (usually wraps a single container).
- **Deployments:** Manages stateless pods and handles rolling updates.
- **Services:** Exposes pods to network traffic (ClusterIP, NodePort, LoadBalancer).
- **Ingress:** Manages external access to the services in a cluster (HTTP/HTTPS routing).

## ML Deployments
- Often paired with tools like KServe, Ray Serve, or Seldon Core.
- GPU node pools and device plugins allow pods to request `nvidia.com/gpu`.

TODO: Add `kubectl` cheat sheet and example YAML manifests.
