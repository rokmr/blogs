---
title: "Ray"
description: "Distributed computing framework for scaling ML workloads, training, and tuning"
subject: mlops
math: false
tags: [distributed-computing, infrastructure, mlops, ray]
status: wip
sitemap: false
order: 3
---

## Overview
[Ray](https://www.ray.io/) is an open-source unified compute framework that makes it easy to scale AI and Python applications from a single laptop to a massive cluster.

## Ray Distributed Training (Ray Train)
Scaling deep learning training (like fine-tuning an LLM) across multiple GPUs or multiple nodes is complex due to networking and synchronization overhead.
- **Mechanism:** Ray Train abstracts away the complexity of distributed setups. It wraps around standard frameworks (PyTorch DDP, DeepSpeed, Megatron, Hugging Face Accelerate).
- **Pros:** It handles the cluster orchestration, fault tolerance (restarting failed workers), and data loading across the network automatically.

## Ray Parameter Tuning (Ray Tune)
Hyperparameter optimization often requires running hundreds of parallel trials.
- **Mechanism:** Ray Tune is a scalable hyperparameter tuning library. Instead of running trials sequentially, it distributes the trials across a cluster.
- **Integration:** It pairs natively with optimization search algorithms (like Optuna or HyperOpt) but handles the actual distributed execution and resource scheduling (e.g., assigning exactly 0.5 GPUs to each trial to maximize throughput).
- **Features:** Supports advanced distributed algorithms like Population Based Training (PBT), which trains multiple models simultaneously and periodically replaces underperforming models with copies of the best ones (mutating their hyperparameters slightly).

## Other Core Libraries
- **Ray Data:** Distributed data processing for ML pipelines (loading and preprocessing massive datasets before feeding them to Ray Train).
- **Ray Serve:** Distributed model serving for deploying models to production with auto-scaling and traffic routing.
