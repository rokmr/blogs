---
title: "CenterNet"
description: "Center-based keypoint detection using corners as proposals"
subject: cv
math: true
tags: [anchor-free, centernet, computer-vision, cv, keypoint, object-detection]
paper: "https://arxiv.org/pdf/1904.08189"
order: 8
---

## Overview

![CenterNet]({{ "/assets/img/notes/cv/object-detection/CenterNet.png" | relative_url }})

- Focus on the center of the object to infer its class
- Use corners as proposals, center to verify class and filter outliers
- Anchor-free: detects object centers as keypoints

## Center Pooling Module

![Center Pooling Module]({{ "/assets/img/notes/cv/object-detection/CenterNet_CenterPoolingModule.png" | relative_url }})

- Extracts richer interior visual patterns for better center keypoint detection
- Cascade Top Corner Pooling Module refines corner predictions using center information
