---
title: "Context Scaling & Flash Attention"
description: "Context Length VRAM curves, Flash Attention benefits, and RoPE scaling side effects"
subject: nlp-llms
math: false
tags: [nlp, llm, inference, flash-attention, rope, context-window]
status: wip
sitemap: false
---

## Context Length and VRAM Curves
As context length increases, compute requirements scale quadratically ($O(N^2)$) while memory (KV Cache) scales linearly ($O(N)$). However, at extremely long contexts (e.g., 100K+ tokens), the VRAM required for the KV Cache will easily dwarf the VRAM required for the actual model weights. 

## Flash Attention Benefits
Standard attention requires materializing the massive $N \times N$ attention matrix in HBM (High Bandwidth Memory), which is disastrous for long sequences. 
**Flash Attention** (and Flash Attention-2/3) fuses the attention operations by tiling the matrix and computing it directly in the ultra-fast SRAM of the GPU. 
- **Mechanism:** The tiling technique decomposes inputs based on shared memory size, and computes softmax one tile at a time. The recomputation technique stores softmax normalization factors (which are linear to sequence length) instead of the massive quadratic softmax results.
- **Benefits:** It drastically reduces VRAM consumption (no $N \times N$ matrix in HBM) and speeds up the prefill phase massively, making 100K+ context lengths computationally feasible.

**Additional Resources:**
- [Matrix multiplication tiling](https://docs.nvidia.com/deeplearning/performance/dl-performance-matrix-multiplication/index.html)
- [Online softmax and tiling](https://www.youtube.com/watch?v=LKwyHWYEIMQ&t=14s)

## RoPE Scaling Side Effects
To extend a model's context window beyond its pre-training limit, techniques like **RoPE (Rotary Position Embedding) Scaling** (e.g., YaRN, Linear Interpolation) are used.
- **Side Effects:** While it allows the model to accept longer inputs, interpolating the positional embeddings often degrades performance on short-context tasks. The model's "attention resolution" becomes blurred, sometimes leading to the "Lost in the Middle" phenomenon where the model forgets facts placed in the center of massive contexts.

TODO: Add diagrams of SRAM vs HBM memory access.
