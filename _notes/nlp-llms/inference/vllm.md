---
title: "vLLM Anatomy & Production Systems"
description: "Architecture of vLLM, the industry standard LLM serving engine. Required reading for ML systems interviews."
subject: nlp-llms
math: false
tags: [nlp, llm, inference, vllm, serving, optimization, systems]
status: wip
sitemap: false
---

## Overview

vLLM is the most widely adopted open-source LLM serving engine, heavily utilized in production by enterprises. Understanding its anatomy is critical for ML systems engineering and infrastructure roles.

## The vLLM Architecture

The [September 2025 "Anatomy of vLLM" blog](https://vllm.ai/blog/2025-09-05-anatomy-of-vllm) details the core components that make up the engine. It is not just a PyTorch script; it is a complex distributed system designed to maximize GPU utilization.

### 1. API Server & Frontend
Handles incoming HTTP/gRPC requests, validates them, and converts them into internal sequence groups. It is responsible for formatting prompts (applying Jinja chat templates) and handling OpenAI-compatible API responses.

### 2. LLM Engine & Scheduler
The brain of vLLM. It operates on **Continuous Batching** at the iteration level.
- Maintains three queues: `Waiting`, `Running`, and `Swapped`.
- Decides which sequences to prefill and which to decode based on available KV Cache blocks.
- If VRAM runs out during generation, the scheduler *preempts* running sequences and moves them to the `Swapped` queue (offloading their KV cache to CPU RAM).

### 3. Block Manager (PagedAttention)
Responsible for virtual memory management for the KV Cache.
- Divides VRAM into fixed-size blocks (e.g., 16 tokens per block).
- Maps logical sequence tokens to physical memory blocks via block tables.
- Enables memory sharing (crucial for parallel sampling, beam search, and prompt caching).

### 4. Worker & Model Runner
The actual GPU execution layer. 
- Loads the model weights.
- Executes the forward pass using optimized kernels (FlashAttention, Marlin, Triton).
- In multi-GPU setups (Tensor Parallelism / Pipeline Parallelism), the Worker process is distributed across multiple devices via Ray or native multiprocessing.

### 5. Async Output Processing
Once the model runner generates logits, a separate thread handles sampling (greedy, top-p, temperature) and Detokenization, returning the string chunk back to the API server for streaming.

## Why vLLM Won
1. **PagedAttention:** Solved the 30% VRAM fragmentation problem of static allocation.
2. **Standardization:** Adopted OpenAI's API schema, making it a drop-in replacement.
3. **Ecosystem:** First-class support for quantization (AWQ/Marlin), speculative decoding, and LoRA adapters.
