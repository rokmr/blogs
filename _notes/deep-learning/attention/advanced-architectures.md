---
title: "Advanced Attention Architectures"
description: "MQA, GQA, SWA, MLA, and Dynamic Sparse Attention mechanisms"
subject: deep-learning
math: true
tags: [attention, deep-learning, dl, gqa, mla, mqa, transformer]
status: wip
sitemap: false
order: 2
---

## Standard Attention (MHA)
Standard Multi-Head Attention (MHA) maintains separate Key and Value (KV) heads for every single Query head. This requires massive memory to store the KV Cache during inference, acting as a major bottleneck for large sequence lengths.

## Multi-Query Attention (MQA)
MQA radically reduces memory consumption by forcing all Query heads to share a **single** Key and Value head. While this drops the KV cache size dramatically, it can lead to a slight degradation in model quality and reasoning capability.

## Grouped Query Attention (GQA)
GQA (used in Llama 2/3) acts as the perfect middle ground between MHA and MQA. Query heads are divided into "groups," and each group shares a single KV head. This provides inference speeds comparable to MQA while maintaining quality nearly identical to MHA.

## Sliding Window Attention (SWA)
Instead of every token attending to every previous token (which scales quadratically $O(N^2)$), SWA restricts attention to a fixed-size window of previous tokens (e.g., the last 4,096 tokens). This allows models (like Mistral) to handle infinite context lengths with linear $O(N)$ compute scaling, assuming that local context is the most important.

## Multi-Headed Latent Attention (MLA)
Introduced in DeepSeek-V2, MLA solves the KV cache bottleneck not by reducing heads, but by compressing the KV cache into a low-dimensional latent space. It projects the KV representations into a compressed vector, decoding it only when necessary. This drastically reduces KV cache memory footprint while maintaining high reasoning power.

## Dynamic Sparse Attention
Instead of using fixed sparse patterns (like Sliding Window or block-sparse), Dynamic Sparse Attention routes queries dynamically only to the specific KV tokens that are most relevant (often calculated via a routing network or thresholding). This ensures highly efficient processing without statically dropping important long-range context.

TODO: Add specific KV Cache parameter formulas for MQA vs GQA.
