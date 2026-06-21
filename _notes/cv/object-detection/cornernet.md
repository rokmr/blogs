---
title: "CornerNet"
description: "Anchor-free detection using top-left and bottom-right corner heatmaps"
subject: cv
math: true
tags: [anchor-free, computer-vision, cornernet, cv, keypoint, object-detection]
paper: "https://arxiv.org/pdf/1808.01244"
order: 7
---

![CornerNet img2]({{ "/assets/img/notes/cv/object-detection/CornerNet_img2.png" | relative_url }})



![CornerNet img3]({{ "/assets/img/notes/cv/object-detection/CornerNet_img3.png" | relative_url }})



![CornerNet img1]({{ "/assets/img/notes/cv/object-detection/CornerNet_img1.png" | relative_url }})


Bounding box coordinates as top-left and bottom-right corner. Uses hourglass network backbone with corner pooling.

## Issues
- Many incorrect bounding boxes (especially small) — too many False Positives
- Hard to infer the class of the box when network focuses on boundaries
