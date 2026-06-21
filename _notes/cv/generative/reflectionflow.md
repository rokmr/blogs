---
title: "Inference-Time Scaling in Diffusion (ReflectionFlow)"
description: "Iterative refinement and self-reflection in text-to-image diffusion models"
subject: cv
math: false
tags: [cv, generative, diffusion, reflectionflow, self-reflection, text-to-image]
status: wip
sitemap: false
---

## Overview

Recent advancements in Large Language Models (like OpenAI's o1) have proven that scaling compute at *inference time* (Chain-of-Thought, self-reflection) dramatically improves output quality. 

[ReflectionFlow](https://diffusion-cot.github.io/reflection2perfection/) applies this exact paradigm to **Text-to-Image Diffusion Models** (specifically FLUX.1-dev). It allows the diffusion model to iteratively assess its own output, generate an actionable "reflection" on what is wrong with the image, and refine it.

## Inference-Time Scaling Axes
ReflectionFlow introduces three scaling axes during image generation:
1. **Noise-level scaling:** Optimizing latent initialization via multiple samples.
2. **Prompt-level scaling:** Tweaking semantic guidance.
3. **Reflection-level scaling:** Iteratively assessing and correcting previous generations based on an explicit "reflection" text. Deeper sequential refinement consistently outperforms simply generating a wider batch of parallel images.

## The GenRef Dataset
To achieve this, the researchers constructed **GenRef**, a dataset of 1 million triplets structured as `(flawed image, refined image, textual reflection)`.
- The dataset incorporates rule-based challenging prompts, reward-based scoring (using PickScore, CLIP), and high-quality editing pairs.
- It leverages a dedicated MLLM verifier (e.g., Qwen2.5-VL-7B) to dynamically generate these textual reflections.

## Core Benefit
For highly complex scenes (like intricate spatial arrangements or exact text rendering), a single forward pass of a diffusion model often fails. ReflectionFlow allows the model to act like a human artist: draw a draft, look at it, spot the mistakes (reflection), and redraw the complex parts until perfect.

TODO: Add architectural diagram showing the multimodal input loop.
