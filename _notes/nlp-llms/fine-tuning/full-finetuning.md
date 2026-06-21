---
title: "Full Fine-Tuning"
description: "Full parameter fine-tuning strategies for LLMs"
subject: nlp-llms
math: false
tags: [fine-tuning, full-finetuning, llm, nlp]
status: wip
sitemap: false
order: 1
---

## Overview

Unlike PEFT methods, full fine-tuning updates all parameters in the LLM. It requires massive compute and memory but is necessary for deep domain adaptation or continued pre-training.

## Challenges
- Memory bottlenecks (optimizer states, gradients).
- Catastrophic forgetting.

TODO: Add details on strategies (FSDP, DeepSpeed).
