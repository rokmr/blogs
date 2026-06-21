---
title: "Inference Optimization & Decoding"
description: "Latency vs throughput, decoding strategies, Speculative Decoding, and Stateful Caching"
subject: deep-learning
math: false
tags: [deep-learning, inference, decoding, speculative-decoding, caching]
status: wip
sitemap: false
---

## Performance Metrics

### Latency vs Throughput
- **Latency (Time-To-First-Token / TTFT):** How fast the model outputs the first token. Critical for interactive chatbots. Bounded by memory bandwidth and the compute-heavy prefill phase.
- **Throughput:** How many total tokens the system can generate per second across all users. Critical for batch processing and offline tasks.

### Core Optimization Techniques
Deploying LLMs in production requires overcoming massive computational and memory bottlenecks (inference is typically memory-bandwidth bound). As outlined in NVIDIA's guide to [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/), the primary levers for improving throughput and latency include:

1. **Continuous (In-Flight) Batching:** Traditional static batching waits for an entire batch to finish generating before starting the next. Continuous batching evicts a request the moment it finishes and immediately slots a new incoming request into the batch, dramatically increasing GPU utilization.
2. **KV Caching & PagedAttention:** Storing historical Key and Value tensors in memory prevents redundant computation. PagedAttention eliminates memory fragmentation by breaking this cache into non-contiguous "pages".
3. **Quantization:** Reducing precision (e.g., FP16 to INT8 or INT4) for both the model weights and the KV cache to alleviate memory bandwidth bottlenecks.
4. **Tensor Parallelism:** Slicing individual matrix multiplications across multiple GPUs to reduce generation latency for massive models.

## Decoding Strategies

### Speculative Decoding
A technique used to achieve 2-3x speedups in auto-regressive generation without changing the target model's weights.
- **Mechanism:** You use a tiny, fast "Draft Model" to quickly hallucinate/generate the next $K$ tokens. Then, you pass those $K$ tokens to the massive "Target Model" in a single forward pass. The Target Model verifies if the Draft Model was correct. 
- **Benefit:** If the draft is correct, you just generated $K$ tokens in the time it usually takes to generate 1. If it's wrong, you discard the wrong tokens and continue normally.

### Stateful Caching
When users interact with an agent, they often send overlapping prefixes (e.g., repeating the same system prompt or conversation history).
- **Mechanism:** Stateful caching stores conversation histories using rolling hashes organized in a tree structure with LRU (Least Recently Used) eviction. 
- **Execution:** For a new query, the system computes rolling hashes for all its prefixes, finds the longest cached match, loads the exact KV tensors directly from the cache, and computes only the new tokens.

## Model Compression

### Pruning
Removing weights or entire neurons from the network that contribute little to the final output, enforcing sparsity and speeding up matrix multiplications.

### Distillation
Training a smaller "student" model to replicate the outputs (and often the intermediate activation states or logits) of a massive "teacher" model.

**Additional Resources:**
- [NVIDIA NeMo Framework](https://docs.nvidia.com/nemo-framework/user-guide/24.07/nemotoolkit/index.html)
- [Lilian Weng's Inference Optimization](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/)
- [Efficient Training and Tradeoffs](https://www.youtube.com/watch?v=UVX7SYGCKkA)
