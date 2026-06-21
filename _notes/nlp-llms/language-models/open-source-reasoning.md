---
title: "Open-Source Models: Reasoning & Small Models"
description: "Orca 2, Phi-3, and tiny parameter scaling for reasoning"
subject: nlp-llms
math: false
tags: [nlp, llm, language-models, open-source, orca, phi-3, slms]
status: wip
sitemap: false
---

## Small Language Models (SLMs)

### Phi-3 (Microsoft)
Phi-3 is a family of highly capable Small Language Models (SLMs). 
- **Architecture Insight:** Instead of scaling parameters (which requires massive VRAM), Microsoft scaled the *quality of the training data*. By generating highly curated "textbook quality" synthetic data using larger models (GPT-4), Phi-3 (e.g., the 3.8B parameter version) achieves reasoning capabilities rivaling models 10x its size. It is perfect for local, on-device deployments.

### Orca 2 (Microsoft)
Orca 2 explores how to teach smaller models (like 7B and 13B parameters) to reason step-by-step like massive proprietary models.
- **Mechanism:** It uses a technique called **Progressive Learning**. Instead of just mimicking the final answer of a teacher model (Imitation Learning), Orca 2 is trained using synthetic datasets that contain complex, step-by-step reasoning traces and explanation logic. This allows a tiny model to learn *how* to solve a problem rather than just hallucinating the answer.
