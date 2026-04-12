---
title: "Bipartite Matching"
description: "Hungarian algorithm for linking detections with predictions in tracking"
subject: cv
math: true
tags: [cv, tracking, bipartite-matching, hungarian-algorithm]
---

![BipartiteMatching2]({{ "/assets/img/notes/cv/tracking/BipartiteMatching2.png" | relative_url }})



![BipartiteMatching1]({{ "/assets/img/notes/cv/tracking/BipartiteMatching1.png" | relative_url }})


- Links detections with predictions using distance metrics
- Uses IoU, Pixel, or 3D distances between boxes

## Process
1. Calculate distances between boxes
2. Apply Hungarian algorithm for optimal matching
3. Set thresholds to handle missing/unsuitable matches

## Edge Cases
- Missing prediction: Add dummy nodes
- No suitable match: Use cost threshold
- Unmatched boxes: Create new tracks

## Output
- Matched pairs
- New tracks from unmatched detections
- Lost tracks from unmatched predictions

[Hungarian Algorithm Demo](http://www.hungarianalgorithm.com/solve.php)
