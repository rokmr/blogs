---
title: "TRL (Transformer Reinforcement Learning)"
description: "Hugging Face library for RLHF, SFT, DPO, and post-training AI agents"
subject: nlp-llms
math: false
tags: [agents, dpo, fine-tuning, llm, nlp, post-training, reinforcement-learning, rlhf, trl]
status: wip
sitemap: false
order: 3
---

## Overview

[TRL (Transformer Reinforcement Learning)](https://huggingface.co/docs/trl/index) is a Hugging Face library designed to train transformer language models with Reinforcement Learning. It covers the full post-training pipeline: from Supervised Fine-tuning (SFT) to Reward Modeling (RM), Proximal Policy Optimization (PPO), and Direct Preference Optimization (DPO).

## Key Features
- **SFTTrainer:** A wrapper around Hugging Face `Trainer` for easy Supervised Fine-Tuning.
- **DPOTrainer:** For Direct Preference Optimization.
- **PPOTrainer:** For classical RLHF pipelines.

## Agent Post-Training
TRL is increasingly being used to fine-tune models to act as **Agents** (tool use, reasoning paths, step-by-step thinking). By using datasets of function-calling and agentic behavior, you can use TRL to post-train base models to explicitly output structured commands and reflect on tool outputs.

## Examples & Notebooks
- [SFT Nemotron Notebook](https://colab.research.google.com/github/huggingface/trl/blob/main/examples/notebooks/sft_nemotron_3.ipynb) - A great starting point for Supervised Fine-Tuning.

TODO: Add specific code snippets for SFTTrainer and post-training agentic behaviors.
