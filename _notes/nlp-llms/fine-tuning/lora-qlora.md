---
title: "LoRA & QLoRA"
description: "Parameter-efficient fine-tuning (PEFT) using Low-Rank Adaptation and Quantized LoRA"
subject: nlp-llms
math: true
tags: [fine-tuning, llm, lora, nlp, peft, qlora]
status: wip
sitemap: false
order: 2
---

## Overview

LoRA (Low-Rank Adaptation) is the leading Parameter-Efficient Fine-Tuning (PEFT) method. Instead of adjusting the massive, dense weight matrices of a pre-trained LLM during fine-tuning (Full Fine-Tuning or FullFT), LoRA leaves the original weights frozen. It learns a smaller set of *updates* represented as a low-rank matrix decomposition.

If $W$ is the original pre-trained weight matrix, the modified weight matrix $W'$ becomes:
$$ W' = W + \frac{\alpha}{r} BA $$
- **$B$ and $A$**: Two smaller matrices that have a much smaller inner dimension called the **rank ($r$)**. If $W$ is a $10,000 \times 10,000$ matrix, $A$ might be $10,000 \times 8$ and $B$ might be $8 \times 10,000$. 
- **$\alpha$**: A constant scaling factor (often set to 16 or 32).
- **$\frac{\alpha}{r}$**: A prefactor that normalizes the updates, ensuring that changing the rank $r$ doesn't drastically change the optimal learning rate.

## Why use LoRA?

1. **Massive Memory Savings:** Full fine-tuning requires storing optimizer states (gradients, momentum) for *every single parameter*, often in high-precision (FP32). This requires massive GPU memory. LoRA only tracks optimizer states for the tiny $A$ and $B$ matrices, meaning you can often train on consumer-grade GPUs.
2. **Multi-Tenant Serving:** You can deploy one massive frozen base model in VRAM, and swap out tiny (MB-sized) LoRA adapters per-user or per-request on the fly (supported by modern engines like vLLM).
3. **Portability:** Adapters are small and easy to distribute compared to gigabyte-heavy full model checkpoints.

## Where to Apply LoRA

While early literature (including the original paper) suggested applying LoRA only to Attention matrices (Q, K, V), modern empirical findings show:
- **Best Practice:** Apply LoRA to *all* linear layers, particularly the MLP (feed-forward) layers. 
- Applying LoRA to MLPs yields significantly better downstream performance than applying it to Attention layers alone. In fact, Attention-only LoRA significantly underperforms MLP-only LoRA, even when both configurations use the same total parameter count.

## LoRA vs. Full Fine-Tuning

Recent research indicates a "low-regret regime" where LoRA matches FullFT performance:
- **Supervised Fine-Tuning (SFT):** High-rank LoRAs (e.g., $r=256$ or $r=512$) can perfectly match the learning curves and final loss of FullFT. Lower rank LoRAs will eventually "fall off" the learning curve and plateau when they run out of capacity to memorize the training dataset.
- **Reinforcement Learning (RL):** In policy gradient methods (like PPO or GRPO for math/reasoning tasks), LoRA fully matches FullFT *even at ranks as low as $r=1$*. Because RL provides very little information per episode compared to SFT (an advantage score vs. exact token matches), the adapter's capacity is rarely the bottleneck.

## Hyperparameters

- **Learning Rate:** The optimal learning rate for LoRA is typically ~10x higher than the optimal learning rate for Full fine-tuning.
- **Batch Size:** LoRA is slightly more sensitive to large batch sizes than FullFT. When batch sizes grow too large, the LoRA loss curve diverges negatively compared to FullFT. Optimal performance usually occurs at smaller batch sizes (e.g., 32).

## QLoRA & Quantization
QLoRA extends LoRA by heavily quantizing the base model weights, allowing the fine-tuning of massive models on consumer GPUs.
TODO: Add details on 4-bit NormalFloat (NF4) and Double Quantization.