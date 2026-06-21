---
title: "KV Cache & Inference Dynamics"
description: "KV cache memory math, PagedAttention, prefill spikes, and eviction policies"
subject: nlp-llms
math: true
tags: [nlp, llm, inference, kv-cache, paged-attention, memory]
status: wip
sitemap: false
---

## Overview

In auto-regressive LLM generation, the **KV Cache (Key-Value Cache)** stores the intermediate key and value tensors from previous tokens so they don't need to be recomputed. While this saves compute, it heavily bounds inference by memory bandwidth and VRAM capacity.

## KV Cache Memory Math
The memory required to store the KV cache grows linearly with the sequence length and batch size.
The formula for the total size (in bytes) is:
$$ \text{Total Bytes} = 2 \times \text{num\_layers} \times \text{num\_kv\_heads} \times \text{head\_dim} \times \text{seq\_len} \times \text{batch\_size} \times \text{bytes\_per\_param} $$
*(Note: The '2' accounts for storing both Keys and Values. `bytes_per_param` is 2 for FP16/BF16).*

## Inference Phases
1. **Prefill Phase:** The model processes the entire input prompt in parallel. This phase is **compute-bound** and can cause massive **Prefill Memory Spikes** due to the creation of huge attention matrices before they are stored in the cache.
2. **Decode Phase:** The model generates one token at a time. This phase is **memory-bandwidth bound** because the entire KV cache and model weights must be loaded from VRAM into the compute cores for *every single token*.

## Context & Memory Management

### PagedAttention
Traditionally, KV cache memory was allocated contiguously, leading to massive fragmentation (up to 30% wasted VRAM). **PagedAttention** (introduced by [vLLM](https://arxiv.org/abs/2309.06180)) borrows OS-level virtual memory paging. It divides the KV cache into fixed-size "blocks," allowing non-contiguous memory allocation and enabling efficient memory sharing for complex sampling (like beam search).

### KV Cache Eviction Policies
When VRAM is exhausted by infinite context, we must evict tokens. 
- **StreamingLLM (Attention Sinks):** Keeps the first few "sink" tokens (which act as attention anchors) and a sliding window of recent tokens, evicting the middle.
- **Heavy-Hitter Oracle (H2O):** Evicts tokens that receive the least cumulative attention scores, keeping only the most semantically important tokens.

### GQA (Generalized Multi-Query Attention)
While standard Multi-Head Attention (MHA) keeps separate key and value heads for each query head, this balloons the KV cache size. [GQA](https://arxiv.org/abs/2305.13245) groups multiple query heads to share a single key and value head, significantly reducing the memory footprint of the KV cache while maintaining performance close to MHA.

### LMCache (Persistent Shared KV Cache)
[LMCache](https://github.com/LMCache/LMCache) is a multi-tier KV cache management layer integrated heavily with vLLM and SGLang. 
- **The Problem:** Traditionally, KV Cache is a temporary state. If a user asks a question about a 1M token document, the engine computes the KV cache. If a *second* user asks a question about the *same* document on a different GPU/instance, the entire document must be prefilled again.
- **The Solution:** LMCache turns KV cache into reusable AI-native knowledge. It extracts the KV cache out of GPU memory and shares it across different serving engines and queries (via CPU/Disk offloading or remote shared storage). 
- **Benefit:** Massive reduction in Time-To-First-Token (TTFT) and 3-10x GPU cycle savings in multi-round QA or RAG pipelines.

**Additional Resources:**
- [KV Caching Video](https://www.youtube.com/watch?v=Mn_9W1nCFLo&t=3869s)
- [FLOPS computation efficiency with KV cache](https://docs.google.com/presentation/d/14hK7SmkUNfSEIRGyptFD2bGO7K9sJOTnwjAVg3vgg6g/edit?slide=id.g286de50af37_0_933#slide=id.g286de50af37_0_933)
- [Understanding PagedAttention](https://datasciencedojo.com/blog/understanding-paged-attention/)
