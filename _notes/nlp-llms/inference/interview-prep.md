---
title: "Interview Prep: Systems Design & Questions"
description: "Cheat sheet for LLM serving interview questions and the 10K RPS system design prompt."
subject: nlp-llms
math: false
tags: [nlp, llm, inference, interview, system-design]
status: wip
sitemap: false
---

## Common Interview Questions

1. **"Walk me through what happens when a request hits vLLM — from HTTP request to token output."**
   - *Key points:* API Server (validation/formatting) → Scheduler (Iteration-level continuous batching, checks block manager) → Block Manager (Allocates physical PagedAttention blocks for the prompt) → Model Runner (GPU execution using FlashAttention/Marlin) → Async Detokenization → Stream to client.

2. **"Why is decode memory-bandwidth-bound but prefill compute-bound? What are the implications for hardware selection?"**
   - *Key points:* Prefill does Matrix×Matrix multiplication (high arithmetic intensity). Decode does Matrix×Vector multiplication (loads all weights from VRAM to generate 1 token, low arithmetic intensity).
   - *Implications:* Use compute-heavy GPUs for prefill, and VRAM bandwidth-heavy GPUs for decode (Disaggregated Inference).

3. **"How does PagedAttention differ from virtual memory in an OS? What problem does it solve that continuous batching alone couldn't?"**
   - *Key points:* Both use block tables to map logical to physical memory. PagedAttention solves VRAM fragmentation (wasting up to 30% of VRAM due to unknown sequence lengths). Continuous batching schedules efficiently, but without PagedAttention, the memory manager would still block new requests from joining the batch due to contiguous memory constraints.

4. **"When would you NOT use speculative decoding? What's the failure mode?"**
   - *Key points:* Don't use it if the draft model acceptance rate is low (e.g., highly complex reasoning tasks, code generation, or obscure languages), or if you are already running at maximum batch size (compute-bound regime). The failure mode is that running the draft model and verifying rejected tokens adds overhead, making inference *slower* than standard decoding.

5. **"Compare INT8 weight-only quantization vs INT8 activation quantization. Why is the latter harder?"**
   - *Key points:* Weight-only simply reduces VRAM footprint. Activation quantization requires quantizing the hidden states at runtime. It is harder because of "outlier features" (a few feature dimensions have massive activation values). Scaling uniformly destroys precision. Requires mixed-precision techniques like LLM.int8().

## System Design: 10K RPS LLM Serving

**Prompt:** "Design an LLM serving system for 10K RPS with p99 latency < 500ms and TTFT < 200ms."

For a comprehensive curriculum on inference optimization and system design, refer to the [Vizuara Inference Curriculum](https://inference.vizuara.ai/#curriculum).

### 1. Architecture Breakdown
- **Disaggregated Inference:** To meet the strict TTFT (<200ms) and TBT constraints, the architecture must separate Prefill and Decode.
  - *Prefill Cluster:* Optimized for compute. Processes prompts and transfers KV cache via fast interconnects (RDMA/InfiniBand).
  - *Decode Cluster:* Optimized for memory bandwidth. Handles generation with continuous batching.

### 2. KV Cache & Memory Management
- **PagedAttention:** Mandatory for high throughput to avoid VRAM fragmentation.
- **Shared KV Cache (e.g., LMCache or SGLang RadixAttention):** If the 10K RPS includes overlapping system prompts or RAG contexts, implementing a shared KV cache layer prevents recomputing the same prefill across different workers.

### 3. Optimization Stack
- **Quantization:** Deploy W8A8 or FP8 (if using H100s) to halve the VRAM requirement and double the decode batch size. Use Marlin kernels for INT4 if deploying smaller models.
- **Speculative Decoding:** Use EAGLE-3 to boost decode throughput 2-3x, allowing fewer GPUs to handle the 10K RPS load while keeping p99 latency low.
- **Chunked Prefill:** Implement Sarathi-style chunking to prevent the prefill workers from spiking latency on concurrent requests.

### 4. Load Balancing
- Implement a token-aware load balancer (not just standard Round Robin). The load balancer should route requests based on KV cache locality (sending users with identical prompts to the same node to leverage RadixAttention).