---
title: "Hardware & Roofline Model"
description: "First-principles of LLM inference arithmetic, memory bandwidth vs compute bound, and the Roofline model."
subject: nlp-llms
math: true
tags: [nlp, llm, inference, hardware, roofline, memory-bandwidth]
status: wip
sitemap: false
---

## The Core Mental Model

The most fundamental concept in LLM inference is understanding the bottleneck: **Decode is memory-bandwidth-bound, not compute-bound.**

To understand why every optimization (PagedAttention, Quantization, Speculative Decoding) exists, you must first internalize this hardware constraint.

### Kipply's Inference Arithmetic
According to Kipply's foundational writeups on [inference arithmetic](https://kipp.ly/p/transformer-inference-arithmetic), generating a token requires reading the entire model weights and the KV cache from High Bandwidth Memory (HBM) to the compute units (SRAM/Registers). 

In auto-regressive decoding, for a batch size of 1, generating 1 token requires doing 2 FLOPs per parameter, but requires moving 2 bytes per parameter (assuming FP16).
- **Compute:** Modern GPUs like the A100 have massive compute capability (e.g., 312 TFLOPS for FP16).
- **Memory Bandwidth:** The memory bandwidth is comparatively much lower (e.g., 1.5 TB/s to 2 TB/s for A100).

Because arithmetic intensity (FLOPs per byte) is extremely low during batch-1 decoding, the GPU finishes the compute instantly and spends all its time idle, waiting for weights to be loaded from HBM.

### The Roofline Model
The Roofline Model is a visual representation of performance, plotting Performance (GFLOPS) against Arithmetic Intensity (FLOPs/Byte).

- **Compute-Bound Regime:** If Arithmetic Intensity is high (e.g., during the **Prefill Phase** of LLM inference or Matrix Multiplication of large batches), the GPU is running at its maximum TFLOPS ceiling.
- **Memory-Bound Regime:** If Arithmetic Intensity is low (e.g., during the **Decode Phase** of LLM inference for small batch sizes), the GPU performance hits the sloped "roof" determined by memory bandwidth.

### Horace He "Go Brrrr" Insights
Horace He's blog ["Making Deep Learning Go Brrrr"](https://horace.io/brrr_intro.html) emphasizes that for most modern AI workloads (especially inference), tensor cores are starved. 
Optimizations focus on:
1. **Fusing Operations:** (Like [FlashAttention](https://arxiv.org/abs/2307.08691)) to keep data in fast SRAM and avoid HBM round-trips.
2. **Quantization:** Reducing the precision of weights (e.g., INT8, INT4) so that 1 byte of memory bandwidth can load more parameters, effectively shifting the operation higher up the memory-bound slope of the roofline.

### Why Optimizations Exist
- **Batching:** Increases arithmetic intensity by reusing the loaded weights for multiple sequences, moving the decode phase closer to the compute-bound regime.
- **Quantization:** Reduces memory footprint and bandwidth requirements.
- **Speculative Decoding:** Uses spare compute (which is virtually "free" during the memory-bound decode phase) to guess multiple tokens at once, effectively increasing batch size.
- **PagedAttention / KV Cache Management:** Maximizes the batch size you can fit in VRAM, enabling higher arithmetic intensity.

**Additional Resources:**
- [Mastering LLM Techniques: Inference Optimization (NVIDIA)](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/)
