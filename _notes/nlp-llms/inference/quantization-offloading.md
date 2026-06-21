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

### GPTQ vs AWQ
- **GPTQ:** Uses a second-order (Hessian) approximation to quantize weights layer-by-layer. It is highly accurate but computationally expensive to calibrate and is mostly optimized for fixed-batch inference.
- **AWQ (Activation-Aware Weight Quantization):** Observes that not all weights are equally important. It keeps a small fraction (e.g., 1%) of "salient" weights (based on activation magnitudes) in FP16, and quantizes the rest to INT4. It is faster to calibrate than GPTQ and often performs better on hardware due to memory layout optimizations.

## Mixed Precision Decoding
Running a model where different layers or operations run at different precisions. For example, keeping the embedding and LM head in FP16 to preserve generation quality, while heavily quantizing the hidden MLP layers to INT4.

## Memory Offloading

When a model (or its KV cache) exceeds available GPU VRAM, memory must be offloaded.
- **CPU/GPU Memory Swapping:** Moving parts of the model or KV cache to system RAM. This allows running massive models (like 70B parameters on an 8GB GPU), but inference speed drops by orders of magnitude due to the slow PCIe bus transfer rates.
- **Activation Offloading:** During training (or complex inference), intermediate activations take up massive memory. Offloading these activations to CPU RAM frees up VRAM for larger batches, pulling them back only when needed for backpropagation.

TODO: Add notes on weight tying across replicas.
