---
title: "Model Selection Guide"
description: "How to choose the right LLM based on GPU constraints, task requirements, and architecture (MoE vs Dense)"
subject: nlp-llms
math: false
tags: [gpu, hardware, language-models, llm, model-selection, nlp]
status: wip
sitemap: false
order: 3
---

## Overview

Choosing the right Large Language Model (LLM) depends heavily on the specific use case (coding, vision, general reasoning) and the available hardware (VRAM, compute).

## Hardware Constraints (VRAM & GPU)
- Estimating VRAM requirements for Inference (Parameters vs Quantization).
- Matching model size to available GPUs (Consumer vs Enterprise).

## Architecture: MoE vs Dense
- **Dense Models:** Full parameter activation, steady VRAM/compute scaling.
- **Mixture of Experts (MoE):** High parameter count with sparse activation. Faster inference for the size, but requires high VRAM to hold all experts.

## Task-Specific Requirements
- **Coding Models:** DeepSeek Coder, CodeLlama, etc. Context windows and exact syntax generation.
- **Vision Models (VLMs):** Qwen-VL, LLaVA. Multimodal requirements.
- **Tool-Use/Agents:** Models fine-tuned for structured outputs (e.g., Hermes, Functionary).

TODO: Add detailed matrices and recommendations.
