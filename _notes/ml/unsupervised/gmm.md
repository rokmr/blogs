---
title: "Gaussian Mixture Models"
description: "Soft clustering using EM algorithm with Gaussian distributions"
subject: ml
math: true
tags: [ml, unsupervised, clustering, gmm, em-algorithm]
---

- Soft clustering: data points can belong to multiple clusters with probability scores
- Models data as a mixture of K Gaussian distributions
- Each cluster has its own mean ($\mu$), covariance ($\Sigma$), and mixing coefficient ($\pi$)

## Expectation-Maximization (EM)

1. **Initialization:** Randomly initialize parameters for K Gaussians

2. **E-step:** Calculate posterior probabilities (responsibilities) — probability of each point belonging to each cluster

3. **M-step:** Update means, covariances, and mixing coefficients using weighted averages

4. **Convergence:** Repeat until log-likelihood converges

## Advantages
- Provides soft assignments (probabilities)
- Can model elliptical clusters
- More flexible than K-means
- Handles overlapping clusters

## Limitations
- Computationally more expensive than K-means
- Sensitive to initialization
- May converge to local optima
