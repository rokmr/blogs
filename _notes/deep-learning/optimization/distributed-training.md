---
title: "Distributed Training Paradigms"
description: "Tensor Parallelism, Sequence Parallelism, Pipeline Parallelism, and RingAttention"
subject: deep-learning
math: false
tags: [deep-learning, distributed-training, tensor-parallelism, sequence-parallelism, ring-attention]
status: wip
sitemap: false
---

## Overview

When models and context windows exceed the memory of a single GPU, the workload must be sharded across multiple GPUs.

## Tensor Parallelism (TP)
Splits the actual tensor operations (like matrix multiplications) across multiple GPUs.
- **Mechanism:** For an MLP layer, the weight matrix is divided into chunks. Each GPU computes its chunk of the multiplication, and an `AllReduce` operation sums the results together.
- **Overhead:** Extremely high communication overhead. TP is usually restricted to GPUs within the same physical node connected by NVLink, as standard network interfaces are too slow for the required latency.

## Sequence Parallelism (SP)
While TP shards the hidden dimensions, **Sequence Parallelism** shards the input sequence length across GPUs.
- **Why it's needed:** For massive context lengths (e.g., 1M+ tokens), the activation memory required for a single sequence easily exceeds an 80GB GPU. 
- **Overhead:** Requires heavy communication across the sequence dimension during the Attention mechanism, as tokens on GPU 1 need to attend to tokens on GPU 2.

## RingAttention
[RingAttention](https://arxiv.org/abs/2310.01889) is a major breakthrough that optimizes Sequence Parallelism for near-infinite context sizes.
- **Mechanism:** Instead of moving massive chunks of sequences between GPUs, GPUs are arranged in a logical "ring." During the attention computation, the Key and Value blocks are iteratively passed around the ring of GPUs while the Query blocks remain stationary.
- **Benefit:** It overlaps the communication of KV blocks with the computation of attention blocks. By the time a GPU finishes computing attention for one block, the next block has already arrived over the network. This removes the communication bottleneck, allowing context lengths to scale linearly with the number of GPUs available.

## Pipeline Parallelism (PP)
Splits the model layer-by-layer across GPUs (e.g., layers 1-10 on GPU 1, layers 11-20 on GPU 2).
- **Overhead:** Causes "pipeline bubbles" where GPU 2 sits idle waiting for GPU 1 to finish computing the forward pass.

TODO: Add diagrams of the RingAttention KV passing mechanism.
