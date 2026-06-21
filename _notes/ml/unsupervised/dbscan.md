---
title: "DBSCAN"
description: "Density-based clustering for arbitrary cluster shapes"
subject: ml
math: true
tags: [clustering, dbscan, density, machine-learning, ml, unsupervised, unsupervised-learning]
order: 4
---

DBSCAN is a density-based clustering algorithm.

## Process
Parameters: $\varepsilon$ (epsilon), $n$ (min points)

1. Start with an arbitrary unvisited point $p$
2. Find all points within $\varepsilon$ radius (neighbors)
3. If number of neighbors $\geq n$:
   - Create a new cluster
   - Add $p$ and its neighbors to the cluster
   - For each neighbor: find its neighbors, expand cluster if $\geq n$
4. Mark processed points as visited
5. Repeat until all points are processed

**Pros:** Discovers arbitrary cluster shapes

**Cons:** Two parameters to tune, fixed $\varepsilon$ can't handle varying densities
