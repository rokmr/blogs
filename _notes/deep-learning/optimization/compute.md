---
title: "Compute Optimization Techniques"
description: "Sequence packing and efficient transformer implementations"
subject: deep-learning
math: false
tags: [deep-learning, compute, transformers, sequence-packing, optimization]
status: wip
sitemap: false
---

## Compute Optimization

### Sequence Packing
During training, data loaders naturally encounter sequences of varying lengths. Normally, you pad the short sequences with `<PAD>` tokens to match the longest sequence in the batch.
- **The Problem:** The GPU wastes massive amounts of compute cycles doing matrix multiplications on useless padding tokens.
- **The Solution:** Sequence Packing concatenates multiple training sequences together into one massive long sequence (separated by an `<EOS>` token). This entirely eliminates padding and ensures that 100% of the micro-batch token limit contains actual useful data, maximizing both GPU compute and memory utilization.

## Efficient Transformers
As context lengths grow, the standard $O(N^2)$ attention mechanism breaks down. Efficient transformers alter the architecture to survive massive inputs:

### Longformer & BigBird
- **Mechanism:** Instead of global attention where every token looks at every other token, they use a combination of Sliding Window (local) attention and randomized global attention. This reduces the complexity from $O(N^2)$ to $O(N)$.

### LongNet
- **Mechanism:** At lower layers, tokens only attend to nearby tokens (small dilation). At higher layers, the dilation factor grows exponentially, allowing tokens to reach further across the sequence. It scales linearly with sequence length $O(Nd)$.
