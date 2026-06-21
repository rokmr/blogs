---
title: "YOLO-World"
description: "Open-vocabulary YOLO with vision-language modeling and RepVL-PAN"
subject: cv
math: true
tags: [computer-vision, cv, object-detection, open-vocabulary, vision-language, yolo-world]
paper: "https://arxiv.org/pdf/2401.17270"
order: 13
---

![RepVL PAN]({{ "/assets/img/notes/cv/object-detection/RepVL-PAN.png" | relative_url }})



![YOLO World Arch]({{ "/assets/img/notes/cv/object-detection/YOLO-World_Arch.png" | relative_url }})



![Comparison with Detection Paradigm]({{ "/assets/img/notes/cv/object-detection/Comparison_with_Detection_Paradigm.png" | relative_url }})


Open-vocabulary detection via vision-language modeling and pre-training on large-scale datasets.

## Architecture
1. **YOLO Detector** — YOLOv8
2. **Text Encoder** — CLIP
3. **Text Contrastive Head** — object-text similarity:
   $s_{k,j} = \alpha \cdot \text{L2-Norm}(e_k) \cdot \text{L2-Norm}(w_j)^T + \beta$

## Re-parameterizable Vision-Language PAN (RepVL-PAN)

### Text-guided CSPLayer
$X_l' = X_l \cdot \delta(\max_{j \in \{1..C\}} (X_l W_j^T))$

### Image-Pooling Attention
$W' = W + \text{MultiHead-Attention}(W, \tilde{X}, \tilde{X})$

## Training
$\mathcal{L}(I) = \mathcal{L}_{con} + \lambda_I \cdot (\mathcal{L}_{iou} + \mathcal{L}_{dfl})$

- $\lambda_I = 1$ for detection/grounding data, $0$ for image-text data
