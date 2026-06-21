---
title: "Linear Discriminant Analysis"
description: "Supervised dimensionality reduction maximizing class separation via Fisher's criterion"
subject: ml
math: true
tags: [classification, dimensionality-reduction, lda, machine-learning, ml, unsupervised-learning]
order: 7
---

Supervised dimensionality reduction that maximizes class separation while minimizing within-class variance.

## Scatter Matrices

**Within-Class Scatter Matrix:**

$$S_W = \sum_c S_c, \quad S_c = \sum_{i \in c} (x_i - \bar{x}_c)(x_i - \bar{x}_c)^T$$

**Between-Class Scatter Matrix:**

$$S_B = \sum_{c} n_c (\bar{x}_c - \bar{x})(\bar{x}_c - \bar{x})^T$$

## Fisher's Linear Discriminant

Objective: $J(w) = \frac{w^TS_Bw}{w^TS_Ww}$

Solution: $S_W^{-1}S_B w = \lambda w$ (generalized eigenvalue problem)

## Steps
1. Calculate $S_W$ and $S_B$
2. Compute eigenvalues/eigenvectors of $S_W^{-1}S_B$
3. Select top $k$ eigenvectors
4. Transform data

## Limitations
- Assumes normal distribution of features
- Max components = number of classes - 1
- May fail if within-class covariance is unequal across classes

## Questions

**Does LDA have a linear decision boundary?** Yes — a straight line in 2D, a plane in 3D, or a hyperplane in higher dimensions.
