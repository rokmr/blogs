---
title: "Quantization & Offloading"
description: "AWQ vs GPTQ tradeoffs, INT8/INT4 quantization, activation offloading, and mixed-precision decoding"
subject: nlp-llms
math: false
tags: [nlp, llm, inference, quantization, awq, gptq, offloading]
status: wip
sitemap: false
---

## Post-Training Quantization (PTQ)

Quantization reduces the precision of model weights (from FP16 to INT8 or INT4), drastically cutting down VRAM requirements and increasing memory bandwidth throughput.

### The "Outlier Feature" Problem (Why naive INT8 fails)
Naive quantization assumes you can just scale all FP16 weights to an INT8 range [-127, 127]. This mathematically destroys the model because of **Activation Outliers**. 
- In massive models, a tiny fraction of feature dimensions (e.g., 0.01%) contain outlier activations that are 100x larger than the rest. 
- If you use a single uniform scale across the tensor, the massive outliers warp the scale. Normal values (like 0.3) get compressed down to identical integers (like 1), meaning you lose 99% of your precision. You are effectively using a bathroom scale to weigh an ant and an elephant simultaneously.

### LLM.int8() & Mixed Precision
Because these outliers are *dimension-specific* (always occurring at specific feature indices regardless of the token), the solution is mixed-precision quantization:
1. Identify the outlier feature dimensions (the top 0.5%).
2. Keep the outliers in pure FP16 to preserve their massive impact on quality.
3. Quantize the remaining 99.5% of "normal" features to INT8.

This approach prevents perplexity collapse while still granting a ~1.8x throughput increase (loading 70GB from VRAM instead of 140GB).

### GPTQ vs AWQ vs GGUF vs FP8
- **FP8:** Minimal quality loss, gives 1.5-2x speedup. The standard for serving on newer A100/H100 hardware.
- **INT8 (W8A8):** 8-bit weight and activation quantization. Low quality loss, gives ~1.5x throughput.
- **GPTQ (W4A16):** 4-bit weights, 16-bit activations. Uses a second-order (Hessian) approximation to quantize weights layer-by-layer. Highly accurate but computationally expensive to calibrate, optimized for fixed-batch inference. Gives 2x memory reduction. [GPTQ Paper](https://arxiv.org/abs/2210.17323)
- **AWQ (W4A16):** Activation-Aware Weight Quantization. Keeps a small fraction (e.g., 1%) of "salient" weights in FP16, quantizes the rest to INT4. Faster to calibrate than GPTQ, often better quality and performs better on hardware due to memory layout optimizations. (Won MLSys 2024 Best Paper). [AWQ Paper](https://arxiv.org/abs/2306.00978)
- **GGUF (e.g., Q4_K_M):** Moderate quality loss, highly optimized for CPU-friendly edge inference (e.g., Llama.cpp).

### The Kernel Problem & Marlin
A common misunderstanding in quantization is assuming that smaller weights automatically mean faster inference. 
- A 4-bit weight must be *dequantized* back to FP16 in the GPU registers before the actual matrix multiplication can happen. 
- If the dequantization kernel is poorly written, the compute overhead of dequantization wipes out the memory bandwidth savings of loading smaller weights.

**Marlin (Mixed Auto-Regressive Linear kernel):**
Marlin is an ultra-optimized INT4 dequantization kernel. It is specifically designed to maximize memory bandwidth utilization and overlap the dequantization math with the memory loading. As shown in the **Jarvis Labs vLLM benchmark**, using AWQ/GPTQ formats *without* Marlin often results in slower inference than native FP16. Using the Marlin kernel is what actually unlocks the 2x-3x throughput gains promised by quantization.

## Quantization-Aware Training (QAT)
Instead of applying quantization after the fact (PTQ), QAT simulates quantization and dequantization during the forward pass of training or fine-tuning.
- **Mechanism:** The quantization error acts as a regularizer, making the model robust to lower precision. 
- **Backpropagation:** Since quantization is not differentiable, gradients are approximated using the Straight-Through Estimator (STE), which sets the gradient to 1 within the quantization range and 0 outside.

## Mixed Precision Decoding
Running a model where different layers or operations run at different precisions. For example, keeping the embedding and LM head in FP16 to preserve generation quality, while heavily quantizing the hidden MLP layers to INT4.

## Memory Offloading

When a model (or its KV cache) exceeds available GPU VRAM, memory must be offloaded.
- **CPU/GPU Memory Swapping:** Moving parts of the model or KV cache to system RAM. This allows running massive models (like 70B parameters on an 8GB GPU), but inference speed drops by orders of magnitude due to the slow PCIe bus transfer rates.
- **Activation Offloading:** During training (or complex inference), intermediate activations take up massive memory. Offloading these activations to CPU RAM frees up VRAM for larger batches, pulling them back only when needed for backpropagation.

**Additional Resources:**
- [Quantization Video](https://www.youtube.com/watch?v=0VdNflU08yA)
- [HuggingFace Quantization Overview](https://huggingface.co/docs/transformers/main/quantization/overview)
