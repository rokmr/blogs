---
title: "Loss Functions"
description: "MSE, Cross-Entropy, Focal, Triplet, Contrastive, KL Divergence and more"
subject: deep-learning
math: true
tags: [contrastive, cross-entropy, deep-learning, dl, dl-optimization, focal-loss, loss, probability-stats]
order: 1
---

<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Binary Classification Loss Functions",
  "caption": "Loss vs margin for true class y=1. Hinge has a hard cutoff at margin=1; Log Loss decays smoothly.",
  "xLabel": "Margin (y \u00b7 f(x))",
  "yLabel": "Loss",
  "xTicks": 8,
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "Hinge (SVM)",
      "data": [[-2.5,3.5],[-2.375,3.375],[-2.25,3.25],[-2.125,3.125],[-2,3],[-1.875,2.875],[-1.75,2.75],[-1.625,2.625],[-1.5,2.5],[-1.375,2.375],[-1.25,2.25],[-1.125,2.125],[-1,2],[-0.875,1.875],[-0.75,1.75],[-0.625,1.625],[-0.5,1.5],[-0.375,1.375],[-0.25,1.25],[-0.125,1.125],[0,1],[0.125,0.875],[0.25,0.75],[0.375,0.625],[0.5,0.5],[0.625,0.375],[0.75,0.25],[0.875,0.125],[1,0],[1.125,0],[1.25,0],[1.375,0],[1.5,0],[1.625,0],[1.75,0],[1.875,0],[2,0],[2.125,0],[2.25,0],[2.375,0],[2.5,0],[2.625,0],[2.75,0],[2.875,0],[3,0]],
      "color": 2
    },
    {
      "label": "Log Loss (BCE)",
      "data": [[-2.5,2.5789],[-2.375,2.4639],[-2.25,2.3502],[-2.125,2.2378],[-2,2.1269],[-1.875,2.0177],[-1.75,1.9102],[-1.625,1.8047],[-1.5,1.7014],[-1.375,1.6004],[-1.25,1.5019],[-1.125,1.4062],[-1,1.3133],[-0.875,1.2234],[-0.75,1.1369],[-0.625,1.0537],[-0.5,0.9741],[-0.375,0.8981],[-0.25,0.8259],[-0.125,0.7576],[0,0.6931],[0.125,0.6326],[0.25,0.5759],[0.375,0.5231],[0.5,0.4741],[0.625,0.4287],[0.75,0.3869],[0.875,0.3484],[1,0.3133],[1.125,0.2812],[1.25,0.2519],[1.375,0.2254],[1.5,0.2014],[1.625,0.1797],[1.75,0.1602],[1.875,0.1427],[2,0.1269],[2.125,0.1128],[2.25,0.1002],[2.375,0.0889],[2.5,0.0789],[2.625,0.0699],[2.75,0.062],[2.875,0.0549],[3,0.0486]],
      "color": 1
    },
    {
      "label": "0-1 Loss",
      "data": [[-2.5,1],[-2.375,1],[-2.25,1],[-2.125,1],[-2,1],[-1.875,1],[-1.75,1],[-1.625,1],[-1.5,1],[-1.375,1],[-1.25,1],[-1.125,1],[-1,1],[-0.875,1],[-0.75,1],[-0.625,1],[-0.5,1],[-0.375,1],[-0.25,1],[-0.125,1],[0,1],[0.125,0],[0.25,0],[0.375,0],[0.5,0],[0.625,0],[0.75,0],[0.875,0],[1,0],[1.125,0],[1.25,0],[1.375,0],[1.5,0],[1.625,0],[1.75,0],[1.875,0],[2,0],[2.125,0],[2.25,0],[2.375,0],[2.5,0],[2.625,0],[2.75,0],[2.875,0],[3,0]],
      "color": 4,
      "dashed": true
    }
  ]
}'></div>

## Mean Square Loss
- **Use:** Regression
- $$L_{MSE} = \frac{1}{n}\sum_i (y_i - \hat{y}_i)^2$$
- Sensitive to outliers

## Binary Cross Entropy Loss
- **Use:** Binary Classification
- $$L_{BCE} = -\sum_i y_i \log(\hat{y}_{i}) + (1 - y_i) \log(1 - \hat{y}_{i})$$
- Penalizes confident wrong predictions heavily

## Cross Entropy Loss
- **Use:** Multi-class Classification
- $$L_{CE} = -\sum_i y_i \log(\hat{y}_i)$$

## Hinge Loss
- **Use:** SVM Classification
- $$L_{hinge}=\max(0, 1-\hat{y} \cdot y)$$
- Robust to outliers

## [Focal Loss](https://arxiv.org/pdf/1708.02002)
- **Use:** Object Detection / Imbalanced Classification
- $$L_{focal} = - (1 - p_t)^{\gamma} \log(p_t)$$
- $\gamma$ controls focus on hard examples

## [Triplet Loss](https://arxiv.org/pdf/1503.03832)
- **Use:** Similarity Learning / Embedding Learning
- $$L_{triplet} = \sum_i^N [\|f(x_i^a) - f(x_i^p)\|_2^2 - \|f(x_i^a) - f(x_i^n)\|_2^2 + \alpha]_{+}$$
- Requires triplets (anchor, positive, negative). Used in face recognition.

## KL Divergence Loss
- **Use:** Distribution Learning
- $$KL(P\|Q)=\sum P(x) \log \frac{P(x)}{Q(x)}$$
- Not symmetric. Used in VAE.

## [Contrastive Loss](https://proceedings.mlr.press/v182/zhang22a/zhang22a.pdf)
- **Use:** Self-supervised / Multi-modal Learning
- $$l_i^{(u \rightarrow v)} = - \log \frac{\exp(sim(u_i,v_i)/\tau)}{\sum_{k=1}^N \exp(sim(u_i, v_k)/ \tau)}$$
- Pulls similar pairs together, pushes dissimilar apart. Used in CLIP, SimCLR.
