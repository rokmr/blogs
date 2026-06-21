---
title: "Distance Metrics"
description: "Euclidean, Manhattan, and Cosine distance/similarity measures"
subject: maths
math: true
tags: [cosine-similarity, distance, linear-algebra, math, mathematics, maths]
order: 1
---

## Euclidean Distance
- Straight-line distance between two points
- $d(p,q) = \sqrt{\sum_{i=1}^{n}(p_i - q_i)^2}$

## Manhattan Distance
- Sum of absolute differences between coordinates
- $d(p,q) = \sum_{i=1}^{n}|p_i - q_i|$

## Cosine Similarity
- Measures cosine of angle between two vectors
- Range: [-1, 1] where 1 means identical
- $\cos(\theta) = \frac{A \cdot B}{\|A\| \cdot \|B\|}$
- Cosine distance: $d(p,q) = 1 - \cos(\theta)$
