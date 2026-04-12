---
title: "RetinaNet"
description: "Focal loss for dense object detection addressing class imbalance"
subject: cv
math: true
tags: [cv, object-detection, retinanet, focal-loss]
paper: "https://arxiv.org/pdf/1708.02002"
---

![FocalLoss]({{ "/assets/img/notes/cv/object-detection/FocalLoss.png" | relative_url }})


Addresses class imbalance in anchor-based detection (most anchors contain no object).

## Key Points
- **Proposed:** Focal loss — as $\gamma$ increases, easy sample weight decreases
- **Backbone:** ResNet for powerful feature extraction
- Multi-scale prediction
- 9 anchors per level, each with classification and regression target
