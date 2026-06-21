---
title: "TensorRT-LLM & Kernel-Level Optimizations"
description: "NVIDIA's framework for high-performance LLM inference, Kernel Fusion, and FlashInfer."
subject: nlp-llms
math: false
tags: [flashinfer, inference, kernels, llm, nlp, nvidia, optimization-compute, serving, tensorrt-llm]
status: wip
sitemap: false
order: 11
---

## Kernel Fusion in LLM Inference

In modern GPU programming, memory operations (loading/storing from HBM) are far slower than compute operations (FLOPs). If a framework executes a standard transformer layer sequentially via standard PyTorch:
1. Load LayerNorm weights, compute, save to HBM.
2. Load output of LayerNorm, compute QKV projections, save to HBM.
3. Load QKV for Attention, compute, save to HBM.

**Kernel Fusion** takes multiple sequential operations and writes a single custom CUDA (or Triton) kernel to compute them all at once. Data stays in the ultra-fast SRAM for the entire sequence of operations, drastically cutting down memory bandwidth bottlenecks. TensorRT-LLM is built entirely around this concept, fusing layernorm + attention + MLP into as few CUDA kernel launches as possible.

## FlashInfer

Introduced at MLSys 2025, FlashInfer is a next-generation attention engine designed to replace older compiler backends. It is specifically optimized for LLM serving architectures that rely heavily on complex KV-cache access patterns (like PagedAttention, prefix caching, and speculative decoding).
- **Impact:** It reduces inter-token latency by 29-69% compared to standard compiler-generated kernels, making it highly preferred for production frameworks like vLLM and SGLang.

## TensorRT-LLM Framework

TensorRT-LLM provides a highly optimized backend for serving large language models exclusively on NVIDIA GPUs. 

### Core Features
1. **Ahead-of-Time Compilation:** Unlike PyTorch which compiles graphs dynamically (or uses `torch.compile` JIT), TensorRT-LLM compiles the entire model graph down to a highly optimized execution engine specific to the exact GPU architecture (e.g., an engine built for H100 will not run on A100).
2. **In-Flight Batching:** NVIDIA's implementation of continuous/iteration-level batching.
3. **Optimized Kernels:** Hand-written CUDA kernels for every major model architecture (Llama, Gemma, etc.) ensuring maximum TFLOPS utilization.

### Workflow
1. **Weight Conversion:** Convert HuggingFace Safetensors to a TensorRT checkpoint format.
2. **Engine Building:** Run `trtllm-build` to compile the checkpoint into an execution engine for the specific GPU architecture, defining max batch size, max sequence length, and quantization schema (e.g., FP8).
3. **Serving:** Deploy the compiled engine using Triton Inference Server.
