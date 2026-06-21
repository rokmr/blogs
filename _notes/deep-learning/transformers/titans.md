---
title: "Titans (Google Research)"
description: "Learning to memorize at test time and deep memory architectures"
subject: deep-learning
math: false
tags: [architecture, deep-learning, dl, memory, titans, transformer, transformers]
status: wip
sitemap: false
order: 2
---

## Overview

[Titans: Learning to Memorize at Test Time](https://arxiv.org/abs/2501.00663) (Google Research, Dec 2024) proposes a new model architecture designed to mitigate the quadratic cost issue of traditional Transformers while achieving long-term memory. 

## The Core Concept
For over a decade, sequence modeling has been split between:
1. **Recurrent Models (RNNs/LSTMs):** Compress data into a fixed-size hidden state. Great for compute, terrible for long-range recall.
2. **Attention (Transformers):** Attend to the entire context window. Perfect for recall, but computationally quadratic ($O(N^2)$).

**Titans** bridge this gap by using a neural architecture inspired by human cognitive memory. It features "learning by surprise," where the model utilizes a test-time training mechanism to dynamically update its internal memory representations as it encounters new tokens, effectively learning to memorize during inference.

TODO: Add structural diagram of Titans Memory Module.