---
title: "YOLO"
description: "You Only Look Once — single-shot grid-based object detection"
subject: cv
math: true
tags: [cv, object-detection, yolo, single-shot]
---

![YOLO Overview]({{ "/assets/img/notes/cv/object-detection/YOLO_img1.png" | relative_url }})

It does not have region proposal network and also it does not have the fully-connected layer.

## Process

![YOLO Grid]({{ "/assets/img/notes/cv/object-detection/YOLO_img2.png" | relative_url }})

![YOLO Architecture]({{ "/assets/img/notes/cv/object-detection/YOLO_img3.png" | relative_url }})

1. Divide the image into grid ($S \times S$ cells)
2. Predict $B$ anchor boxes at the center of each cell along with confidence score
3. Predict $C$ classes for each grid cell

**YOLO Tensor:** $S \times S \times (B \times 5 + C)$

where $B$ boxes have $(P_c, b_x, b_y, b_h, b_w)$

## Loss Function

![YOLO Loss]({{ "/assets/img/notes/cv/object-detection/YOLO_Loss.png" | relative_url }})

$L_{total} = L_{localization} + L_{confidence} + L_{classification}$

$L_{localization} = \lambda_{coord} \sum_{i=0}^{S^2} \sum_{j=0}^{B} \mathbb{1}_{ij}^{obj} [(x_i - \hat{x}_i)^2 + (y_i - \hat{y}_i)^2 + (\sqrt{w_i} - \sqrt{\hat{w}_i})^2 + (\sqrt{h_i} - \sqrt{\hat{h}_i})^2]$

$L_{confidence} = \sum_{i=0}^{S^2} \sum_{j=0}^{B} \mathbb{1}_{ij}^{obj} (C_i - \hat{C}_i)^2 + \lambda_{noobj} \sum_{i=0}^{S^2} \sum_{j=0}^{B} \mathbb{1}_{ij}^{noobj} (C_i - \hat{C}_i)^2$

$L_{classification} = \sum_{i=0}^{S^2} \mathbb{1}_{i}^{obj} \sum_{c \in classes} (p_i(c) - \hat{p}_i(c))^2$

$\lambda_{coord} = 5, \quad \lambda_{noobj} = 0.5$

## YOLO Papers

- [YOLO Survey](https://arxiv.org/html/2304.00501v6)
- [YOLOv1](https://arxiv.org/pdf/1506.02640) - [YOLOv2](https://arxiv.org/pdf/1612.08242) - [YOLOv3](https://arxiv.org/pdf/1804.02767) - [YOLOv4](https://arxiv.org/pdf/2004.10934)
- [YOLOv5](https://github.com/ultralytics/yolov5) - [YOLOv6](https://arxiv.org/pdf/2209.02976) - [YOLOv7](https://arxiv.org/pdf/2207.02696) - YOLOv8 - YOLO-NAS
