---
title: "K-Means Clustering"
description: "Iterative centroid-based clustering with elbow method for optimal K"
subject: ml
math: true
tags: [ml, unsupervised, clustering, kmeans]
---

## Process
- Initialize number of k
- Randomly choose k points as centroids
- While centroids do not change (or max iterations):
    - Assign each data point to its nearest centroid
    - Recompute the centroids of each cluster

## Optimal K (Elbow Method)
1. Calculate Within-Cluster Sum of Squares (WSS) for different k
2. Plot WSS vs k
3. Choose k at the "elbow" point

## Advantages
1. Simple and intuitive
2. Fast: $O(nkd)$ time complexity
3. Memory efficient — only stores centroids and assignments

## Drawbacks
1. Sensitive to initialization (may get stuck in local optima)
2. Assumes spherical, similarly-sized clusters
3. Requires pre-specification of k
4. Sensitive to outliers
