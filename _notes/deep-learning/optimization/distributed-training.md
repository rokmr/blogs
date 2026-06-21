---
title: "Distributed Training Paradigms"
description: "Tensor Parallelism, Sequence Parallelism, Pipeline Parallelism, and RingAttention"
subject: deep-learning
math: false
tags: [deep-learning, distributed-training, dl, dl-optimization, optimization-compute, ring-attention, sequence-parallelism, tensor-parallelism]
status: wip
sitemap: false
order: 7
---

## Overview

When models and context windows exceed the memory of a single GPU, the workload must be sharded across multiple GPUs.

## Tensor Parallelism (TP)
Splits large matrix multiplications across multiple GPUs, enabling efficient scaling of model size.
- **Column-wise Parallelism:** The weight matrix is split along its columns. Each device holds a subset of columns, computes its partial output, and the results are concatenated (usually via an `AllGather` operation).
- **Row-wise Parallelism:** The input is split column-wise and the weight matrix is split row-wise. Each device computes a partial output, and the final result is obtained by summing these partial outputs via an `AllReduce` operation.
- **Overhead:** Extremely high communication overhead. TP is usually restricted to GPUs within the same physical node connected by NVLink, as standard network interfaces are too slow.

**Additional Resources:**
- [Megatron-LM Paper](https://arxiv.org/abs/1909.08053)
- [Megatron-LM GitHub](https://github.com/NVIDIA/Megatron-LM)

## Context Parallelism
When context windows become extreme, **Context Parallelism** shards the sequence length across GPUs. During forward propagation, each GPU handles a segment of the sequence, storing only the necessary KV pairs. In the backward pass, these KV pairs are reassembled using advanced communication schemes (like all-gather and reduce-scatter) transformed into point-to-point communications in a ring topology.

**Additional Resources:**
- [Context Parallelism Paper](https://arxiv.org/abs/2105.03824)
- [Sequence Parallelism](https://arxiv.org/abs/2104.04473)

## RingAttention
[RingAttention](https://arxiv.org/abs/2310.01889) is a major breakthrough that optimizes Sequence Parallelism for near-infinite context sizes.
- **Mechanism:** Instead of moving massive chunks of sequences between GPUs, GPUs are arranged in a logical "ring." During the attention computation, the Key and Value blocks are iteratively passed around the ring of GPUs while the Query blocks remain stationary.
- **Benefit:** It overlaps the communication of KV blocks with the computation of attention blocks. By the time a GPU finishes computing attention for one block, the next block has already arrived over the network. This removes the communication bottleneck, allowing context lengths to scale linearly with the number of GPUs available.

## Pipeline Parallelism (PP)
Splits the model layer-by-layer across GPUs (e.g., layers 1-10 on GPU 1, layers 11-20 on GPU 2).
- **The Bubble Problem:** Naive implementation leaves all but one GPU idle at any given moment.
- **GPipe:** Splits one minibatch into multiple microbatches to allow simultaneous processing.
- **PipeDream (1F1B):** Schedules each worker to alternatively process forward and backward passes (One-Forward-One-Backward), though it requires complex "Weight Stashing" to ensure the forward and backward passes use the exact same version of weights.
- **Zero Bubble Pipeline Parallelism (ZB-PP):** Splits the backward pass into two parts (Backward for Input and Backward for Weights) and reorders them to eliminate tail-end bubbles completely.
- **DualPipe (DeepSeek-V3):** Overlaps computation and communication within individual forward and backward chunks using a bidirectional pipeline schedule.

**Additional Resources:**
- [GPipe Paper](https://arxiv.org/abs/1811.06965)
- [PipeDream Paper](https://arxiv.org/abs/1806.03377)
- [Zero Bubble Pipeline](https://arxiv.org/abs/2011.06448)

## Expert Parallelism (MoE)
Instead of every token being processed by the same dense network, tokens are routed to specific experts (sub-networks) sharded across devices.
- **Load Balancing:** A major challenge. If an expert on GPU 1 is highly popular, GPU 1 bottlenecks the entire system while GPU 2 sits idle. Solved via Device Balance Loss, Capacity-based routing (hard caps on tokens), or Priority dropping.

**Additional Resources:**
- [Switch Transformer Paper](https://arxiv.org/abs/2101.03961)
- [GLaM Paper](https://arxiv.org/abs/2112.06905)
- [GShard Paper](https://arxiv.org/abs/2006.16668)
- [Mixture of Experts Survey](https://arxiv.org/abs/2202.08906)
