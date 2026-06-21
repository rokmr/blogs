---
title: "DIS (IS-Net)"
description: "Dichotomous Image Segmentation with intermediate supervision strategy"
subject: cv
math: true
tags: [computer-vision, cv, dichotomous, dis, is-net, segmentation]
paper: "https://arxiv.org/pdf/2203.03041"
order: 2
---

Dichotomous Image Segmentation — proposes **IS-Net** with 3 components:

![IS-Net Architecture]({{ "/assets/img/notes/cv/segmentation/ISNet.png" | relative_url }})
1. Ground truth (GT) encoder
2. Image segmentation component ($U^2$-Net based)
3. Intermediate supervision strategy

## Stage 1: Self-supervised GT Encoder Training

$L_{gt} = \sum_{d=1}^{D} \lambda_{d}^{gt} BCE(F_{gt}(\theta_{gt}, G)_d, G)$

GT encoder is frozen after this stage.

## Stage 2: Feature Consistency

**Feature Consistency Loss (intermediate supervision):**

$L_{fs} = \sum_{d=1}^{D} \lambda_{d}^{fs} \|f_{d}^{I} - f_{d}^{G}\|^2$

$L_{sg} = \sum_{d=1}^{D} \lambda_{d}^{sg} BCE(F_{sg}(\theta_{sg}, I), G)$

Total loss: $L = L_{fs} + L_{sg}$

## Results

![DIS Results]({{ "/assets/img/notes/cv/segmentation/DIS_Result.png" | relative_url }})

## Metric: Human Correction Efforts (HCE)

![HCE Algorithm]({{ "/assets/img/notes/cv/segmentation/Relax_HCE_Algo.png" | relative_url }})
