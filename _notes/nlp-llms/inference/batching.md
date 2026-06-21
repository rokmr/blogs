---
title: "Batching & Disaggregated Inference"
description: "The evolution of LLM serving: Continuous Batching (Orca), Chunked Prefill (Sarathi), and Disaggregated Inference (DistServe)"
subject: nlp-llms
math: false
tags: [nlp, llm, inference, batching, orca, sarathi, distserve, disaggregated-inference]
status: wip
sitemap: false
---

## The Batching Evolution Arc

To make LLM inference efficient, we must increase Arithmetic Intensity (see the Hardware & Roofline model). The primary way to do this is via batching. However, standard static batching breaks down in auto-regressive text generation because sequences have varying lengths and arrive at unpredictable times.

### 1. Static Batching (The Baseline)
Initially, requests were grouped into a fixed batch. The GPU had to wait for the longest sequence in the batch to finish generating before returning the results, or pad shorter sequences. This resulted in massive wasted GPU cycles and terrible Time-to-First-Token (TTFT) for new requests waiting in the queue.

### 2. Continuous Batching (Orca)
Introduced in the seminal paper *[Orca: A Distributed Serving System for Transformer-Based Generative Models](https://www.usenix.org/conference/osdi22/presentation/yu)*. 
- **Iteration-Level Scheduling:** Instead of waiting for a batch to finish, continuous batching operates at the granularity of a single generation step (iteration). 
- **Dynamic Queue:** When a sequence finishes generating an EOS token, it is immediately removed from the batch, and a new request from the queue is slotted in to replace it *on the very next forward pass*.
- **Result:** Massive throughput improvements and the standard for all modern serving engines (vLLM, TGI, etc.). See Anyscale's blog on [Continuous Batching](https://www.anyscale.com/blog/continuous-batching-llm-inference) for a great visual explanation.

### 3. Chunked Prefill (Sarathi)
While Continuous Batching solved dynamic sequence lengths, it created a new problem: **Prefill Spikes**.
- **The Problem:** The "prefill" phase (processing the input prompt) is highly compute-bound, while the "decode" phase is memory-bound. If a new request with a 4,000-token prompt is added to a continuous batch of decoding sequences, the massive compute requirement of the prefill causes the decode sequences to stall. This results in horrific latency spikes for users waiting for their next token.
- **The Solution (Sarathi/Sarathi-Serve):** Break the large prefill prompt into smaller chunks (e.g., 512 tokens). Schedule one prefill chunk alongside the decoding tokens. This smooths out the compute load, ensuring stable Time-Between-Tokens (TBT) while still processing the prompt efficiently.

## Disaggregated Inference (DistServe)

The most important systems story in LLM serving right now is the move to disaggregated architectures.

### The TTFT vs TBT Conflict
In LLM serving, there are two competing metrics:
1. **Time To First Token (TTFT):** Dominated by the compute-heavy Prefill phase.
2. **Time Between Tokens (TBT):** Dominated by the memory-bound Decode phase.

Serving them on the same GPU leads to interference. Optimizing for TTFT hurts TBT, and vice versa.

### The DistServe Architecture
The Hao AI Lab retrospective blog ("Disaggregated Inference: 18 Months Later") details how the industry adopted the architecture proposed by DistServe.
- **Prefill Workers:** Dedicated GPUs optimized purely for compute. They handle massive prompts, running at high batch sizes, optimizing for throughput.
- **Decode Workers:** Dedicated GPUs optimized purely for memory bandwidth and latency. They run with smaller batch sizes to ensure low TBT.
- **KV Cache Transfer:** Once the Prefill worker finishes the prompt, it transfers the generated KV Cache over the network (e.g., via NVLink or InfiniBand) to the Decode worker. 

This separation allows cluster operators to scale Prefill and Decode independently, resolving the fundamental tension between compute-bound and memory-bound workloads.
