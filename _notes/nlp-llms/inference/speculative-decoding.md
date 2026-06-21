---
title: "Speculative Decoding"
description: "Accelerating LLM inference using draft models, rejection sampling math, and state-of-the-art methods like EAGLE-3."
subject: nlp-llms
math: true
tags: [eagle, inference, llm, nlp, serving, speculative-decoding]
status: wip
sitemap: false
order: 6
---

## The Concept

Because LLM decoding is memory-bandwidth bound (low arithmetic intensity), the GPU has massive amounts of spare compute power idling while waiting for weights to load from VRAM.

**Speculative Decoding** uses this spare compute to guess multiple future tokens simultaneously. [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)

### The Mechanism
1. **Drafting:** A smaller, much faster "draft model" auto-regressively generates a sequence of $K$ tokens.
2. **Verification:** The large, slow "target model" processes those $K$ tokens in a *single forward pass* (batch processing). Because processing $K$ tokens in parallel is compute-bound, it takes roughly the same time as generating 1 token.
3. **Acceptance:** If the target model agrees with the draft model's predictions, we get $K$ tokens for the time cost of 1. If it disagrees at token $i$, we accept $i-1$ tokens, discard the rest, and use the target model's output for token $i$.

## The Losslessness Proof & Rejection Sampling

A frequent interview question: *How does Speculative Decoding guarantee identical output distributions to the target model, even when the draft model makes mistakes?*

The answer lies in **Modified Rejection Sampling**.

Let $p(x)$ be the probability distribution of the target model, and $q(x)$ be the distribution of the draft model.
When the draft model proposes a token $x$:
1. We sample a random uniform value $u \sim U(0, 1)$.
2. We accept $x$ if:
   $$ u < \min\left(1, \frac{p(x)}{q(x)}\right) $$

If the token is rejected, we resample a new token from the modified distribution:
$$ p'(x) = \frac{\max(0, p(x) - q(x))}{\sum_y \max(0, p(y) - q(y))} $$

**Mathematical Guarantee:** The probability of generating token $x$ is exactly $p(x)$, ensuring the output is mathematically indistinguishable from running the target model alone.

## Modern Implementations: EAGLE-3

While traditional speculative decoding uses a smaller standalone model as the draft model, managing two separate models is complex and requires maintaining two separate KV caches.

**EAGLE (Extrapolating second-order features for Auto-reGressive LLM Efficiency)**:
EAGLE (and EAGLE-3, the current production standard) bypasses the separate draft model entirely. Instead of guessing tokens using a separate neural network, EAGLE trains a lightweight "head" on top of the target model itself. [EAGLE Paper](https://arxiv.org/abs/2401.15077)
- It uses the rich feature representations (the hidden states) from the target model's penultimate layer to predict future tokens.
- **EAGLE-3:** Incorporates tree-based attention and advanced draft structures, achieving massive speedups (3–6.5×) without the overhead of a separate LLM.
