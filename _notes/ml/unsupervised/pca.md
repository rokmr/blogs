---
title: "Principal Component Analysis"
description: "Unsupervised dimensionality reduction via eigenvectors of the covariance matrix"
subject: ml
math: true
tags: [ml, unsupervised, dimensionality-reduction, pca]
---

Unsupervised dimensionality reduction.

**Assumption:** PCA needs linear correlation between all variables (not non-linear). The eigenvectors of the covariance matrix are the principal components and eigenvalues represent variance carried in each component.

## Process
1. Standardize the data (PCA is sensitive to variance within features)
2. Calculate the covariance matrix
3. Calculate eigenvectors and eigenvalues — these are the principal components

Choose number of components to capture 95-99% of variance.

## Drawbacks
1. Computationally expensive
2. Information is always lost
3. Explainability becomes much more difficult

## Questions

**Optimal number of components?**

$$k = \min\left\{n: \frac{\sum_{i=1}^n \lambda_i}{\sum_{i=1}^N \lambda_i} \geq \text{threshold}\right\}$$

Use a scree plot (x-axis: component number, y-axis: variance explained).
