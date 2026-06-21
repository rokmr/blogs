---
title: "LLMs for Recommender Systems (LLMRec, RLMRec)"
description: "Leveraging Large Language Models and Recursive Language Models for RecSys"
subject: nlp-llms
math: false
tags: [language-models, llm, llmrec, nlp, reclm, recommender-systems, rlmrec]
status: wip
sitemap: false
order: 8
---

## Overview

Traditional recommender systems rely heavily on graph-based ID tracking, which often ignores deep textual context. Recent frameworks integrate LLMs to understand the rich semantics of user behaviors and item descriptions.

## Frameworks (by HKUDS)

### LLMRec
[LLMRec](https://github.com/HKUDS/LLMRec) focuses on Large Language Models with Graph Augmentation for Recommendation. It uses LLM-enhanced data augmentors to improve recommendation accuracy over sparse benchmark graphs.

### RLMRec
[RLMRec](https://github.com/HKUDS/RLMRec) is a model-agnostic framework that enhances existing recommenders with LLM-empowered representation learning, capturing intricate semantic aspects of user-item relationships.

### RecLM
Focuses on enhancing the capability of capturing user preference diversity using Reinforcement Learning reward functions to facilitate self-augmentation of the language models.

## Recursive Language Models (RLMs)
A distinct concept involving an inference strategy where an LLM can decompose and recursively interact with an input context of unbounded length through REPL environments (sandboxes).

TODO: Add architectural overviews on how LLM representations are merged with Graph Neural Networks.
