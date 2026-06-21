---
title: "DETR"
description: "End-to-end object detection with transformers using bipartite matching"
subject: cv
math: true
tags: [computer-vision, cv, detr, hungarian, object-detection, transformer]
paper: "https://arxiv.org/pdf/2005.12872"
order: 10
---

![DETRResults]({{ "/assets/img/notes/cv/object-detection/DETRResults.png" | relative_url }})



![DETRArch]({{ "/assets/img/notes/cv/object-detection/DETRArch.png" | relative_url }})



![DETRIntro]({{ "/assets/img/notes/cv/object-detection/DETRIntro.png" | relative_url }})


A direct set prediction approach bypassing proposals, anchors, and NMS. Encoder-decoder transformer that predicts all objects at once with bipartite matching loss.

## Set Prediction Loss

Finds optimal permutation via Hungarian algorithm:

$$\hat{\sigma} = \arg\min_{\sigma \in \mathfrak{G}_N} \sum_{i}^N \mathcal{L}_{\text{match}}(y_i, \hat{y}_{\sigma(i)})$$

**Hungarian loss:**

$$\mathcal{L}_{\text{Hungarian}} = \sum_{i=1}^N \left[-\log \hat{p}_{\hat{\sigma}(i)}(c_i) + \mathbb{1}_{\{c_i \neq \varnothing\}} \mathcal{L}_{\text{box}}(b_i, \hat{b}_{\hat{\sigma}(i)})\right]$$

**Box loss:** $\mathcal{L}_{\text{box}} = \lambda_{\text{iou}}\mathcal{L}_{\text{iou}} + \lambda_{\text{L1}}\|b_i - \hat{b}_{\sigma(i)}\|_1$

## Architecture

1. **CNN Backbone** — feature extraction
2. **Transformer Encoder** — with fixed positional encodings
3. **Transformer Decoder** — decodes N objects in parallel (not autoregressive)
4. **FFN** — 3-layer perceptron for final predictions

## Variants
- RT-DETR, Fast-DETR, SAM-Det, ULTRA-DETR
