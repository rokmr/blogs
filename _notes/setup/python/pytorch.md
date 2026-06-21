---
title: "PyTorch"
description: "Core concepts, distributed training, and tensor operations in PyTorch"
subject: setup
math: false
tags: [python, pytorch, deep-learning, framework]
status: wip
sitemap: false
---

## Overview

PyTorch is the dominant framework for deep learning research and production. 

## Core Concepts
- Autograd (Automatic Differentiation)
- Tensors and GPU execution

## Distributed Training

### Data Parallelism
- **DataParallel (DP):** Single-process, multi-threaded. Each GPU gets a copy of the model, processes different microbatches, and averages gradients. *Warning:* Suffers from Python's GIL contention and slow inter-GPU communication.
- **Distributed Data Parallel (DDP):** Multi-process (one per GPU). Uses the Ring All-Reduce algorithm to avoid central bottlenecks.

### Synchronization Approaches
At the end of each minibatch, workers synchronize to avoid staleness:
- **Bulk Synchronous Parallel (BSP):** Workers synchronize at the end of *every* minibatch. Prevents stale weights but forces machines to halt and wait for each other.
- **Asynchronous Parallel (ASP):** Every GPU processes data asynchronously without waiting. Increases raw computation speed but can lead to stale weights being used, lowering statistical learning efficiency.

### ZeRO (Zero Redundancy Optimizer) / FSDP
Instead of just replicating the entire model across all GPUs (which wastes massive memory), ZeRO shards the components:
- **Stage 1 (Optimizer State Partitioning):** 4x memory reduction. Splits Adam momentum and variance across GPUs.
- **Stage 2 (Gradient Partitioning):** 8x memory reduction.
- **Stage 3 (Parameter Partitioning / FSDP):** Slices the actual model weights across GPUs. Memory reduction is linear with the number of GPUs.

### Communication Primitives
- **All-Reduce:** Everyone ends up with the sum of all data (used for syncing gradients).
- **Ring All-Reduce:** GPUs pass data in a ring. Overhead is `2 × (N-1) × X/N`.
- **All-Gather:** Each process gathers data chunks from everyone else so everyone has the complete picture.
- **Reduce-Scatter:** Each process sums a chunk of data across all processes and keeps only its own chunk.

**Additional Resources:**
- [Scaling ML Models](https://www.youtube.com/watch?v=hc0u4avAkuM)
- [Training Optimization](https://www.youtube.com/watch?v=toUSzwR0EV8)
- [Understanding data parallelism, ZeRO, FSDP](https://www.youtube.com/watch?v=UVX7SYGCKkA)
- [Communication overhead slides](https://docs.google.com/presentation/d/14SxjHdkvIw80FCAu5c1NGvFKDVF5DgvD2MJ1OwQ-5Gs/edit?slide=id.g24fe79ce068_0_154#slide=id.g24fe79ce068_0_154)
