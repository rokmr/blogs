---
title: "Open-Source Models: Reasoning & Alignment"
description: "Orca 2, Phi-3, and Nemotron for reasoning, alignment, and RAG"
subject: nlp-llms
math: false
tags: [language-models, llm, nemotron, nlp, nvidia, open-source, orca, phi-3, slms]
status: wip
sitemap: false
order: 6
---

## DeepSeek R1 & Frontier Reasoning

### DeepSeek R1
DeepSeek R1 is a massive open-source mixture-of-experts model specifically designed to rival proprietary models (like OpenAI's o1) in complex logic, math, and coding via extreme reasoning traces.
- **The RL Phase:** Unlike models trained purely on Supervised Fine-Tuning (SFT), DeepSeek R1 relies heavily on pure Reinforcement Learning to naturally surface "Chain-of-Thought" (CoT) behaviors. 
- **GRPO (Group Relative Policy Optimization):** To train R1 efficiently, DeepSeek avoided traditional PPO (Proximal Policy Optimization) which requires a memory-heavy separate critic model. Instead, they used GRPO, which estimates the baseline directly from the scores of a *group* of outputs generated from the same prompt. This massive optimization allowed them to perform large-scale RL training at a fraction of the hardware cost.

## Alignment & Agentic Reasoning

### Nemotron (NVIDIA)
[Nemotron](https://huggingface.co/nvidia) is a family of highly optimized, open-source models released by NVIDIA explicitly purpose-built for agentic AI and RAG pipelines.
- **Llama-3.1-Nemotron-70B-Instruct:** NVIDIA took the base Llama-3.1-70B model and heavily customized it to improve the helpfulness and alignment of generated responses. By utilizing advanced alignment techniques (like RLHF and Reward Modeling), it topped the AlpacaEval and LM Arena Hard benchmarks.
- **RAG Blueprints:** Nemotron models are heavily integrated into NVIDIA's RAG Blueprints via NIM microservices, making them the standard open-weights choice for building enterprise reasoning agents.

## Small Language Models (SLMs)

### Phi-3 (Microsoft)
Phi-3 is a family of highly capable Small Language Models (SLMs). 
- **Architecture Insight:** Instead of scaling parameters (which requires massive VRAM), Microsoft scaled the *quality of the training data*. By generating highly curated "textbook quality" synthetic data using larger models (GPT-4), Phi-3 (e.g., the 3.8B parameter version) achieves reasoning capabilities rivaling models 10x its size. It is perfect for local, on-device deployments.

### Orca 2 (Microsoft)
Orca 2 explores how to teach smaller models (like 7B and 13B parameters) to reason step-by-step like massive proprietary models.
- **Mechanism:** It uses a technique called **Progressive Learning**. Instead of just mimicking the final answer of a teacher model (Imitation Learning), Orca 2 is trained using synthetic datasets that contain complex, step-by-step reasoning traces and explanation logic. This allows a tiny model to learn *how* to solve a problem rather than just hallucinating the answer.
