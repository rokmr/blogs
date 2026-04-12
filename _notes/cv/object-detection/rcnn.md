---
title: "R-CNN Family"
description: "R-CNN, SPPNet, Fast R-CNN, Faster R-CNN evolution of region-based detectors"
subject: cv
math: true
tags: [cv, object-detection, rcnn, faster-rcnn, rpn]
paper: "https://arxiv.org/pdf/1311.2524"
---

**Papers:** [R-CNN](https://arxiv.org/pdf/1311.2524) · [SPPNet](https://arxiv.org/pdf/1406.4729) · [Fast R-CNN](https://arxiv.org/pdf/1504.08083) · [Faster R-CNN](https://arxiv.org/pdf/1506.01497)

## R-CNN

![R-CNN Overview]({{ "/assets/img/notes/cv/object-detection/RCNNOverview.png" | relative_url }})

![R-CNN Architecture]({{ "/assets/img/notes/cv/object-detection/RCNN.png" | relative_url }})
1. Selective Search generates ~2000 region proposals
2. Warp to 227x227
3. Run CNN on each proposal
4. SVM for classification + linear regressor for bbox

**Cons:** Redundant computation, slow training (no end-to-end), fixed region proposals.

## SPPNet

![SPPNet Overview]({{ "/assets/img/notes/cv/object-detection/SPPNetOverview.png" | relative_url }})

![SPPNet Architecture]({{ "/assets/img/notes/cv/object-detection/SPPNet.png" | relative_url }})

- Makes R-CNN fast at test time by running CNN once on full image
- Still: slow training, fixed region proposals

## Fast R-CNN

![Fast R-CNN Overview]({{ "/assets/img/notes/cv/object-detection/FastRCNNOverview.png" | relative_url }})

![Fast R-CNN Architecture]({{ "/assets/img/notes/cv/object-detection/FastRCNN.png" | relative_url }})

1. Feature extraction over full image (one CNN pass)
2. RoI Pooling layer for fixed-size features
3. Softmax replaces SVM

![RoI Pooling Layer]({{ "/assets/img/notes/cv/object-detection/RoIPoolingLayer.png" | relative_url }})

## Faster R-CNN

![Faster R-CNN]({{ "/assets/img/notes/cv/object-detection/FasterRCNN.png" | relative_url }})

- Introduces **Region Proposal Network (RPN)**
- 9 anchor boxes per location (3 scales x 3 aspect ratios)

![RPN Architecture]({{ "/assets/img/notes/cv/object-detection/FasterRCNNRPN.png" | relative_url }})

![RPN Explained]({{ "/assets/img/notes/cv/object-detection/FasterRCNNRPNExplained.png" | relative_url }})

### RPN Training

![Training Pipeline]({{ "/assets/img/notes/cv/object-detection/FasterRCNNTraining.png" | relative_url }})

- $p^* = 1$ if IoU > 0.7, $p^* = 0$ if IoU < 0.3
- Network predicts relative offsets $(t_x, t_y, t_w, t_h)$:
  - $t_x = (x-x_a)/w_a$, $t_w = \log(w/w_a)$
- Binary CE loss + Smooth L1 loss

### Performance

|                           | R-CNN | Fast R-CNN | Faster R-CNN |
|---------------------------|-------|-----------|-------------|
| Test time/image (sec)     | 50    | 2         | 0.2         |
| Speed-Up                  | 1X    | 25X       | 250X        |
| mAP (VOC 2007)            | 66.0  | 66.9      | 66.9        |
