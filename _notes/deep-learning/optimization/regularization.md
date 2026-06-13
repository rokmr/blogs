---
title: "Regularization"
description: "L1, L2, Elastic Net, Dropout, Early Stopping and other regularization techniques"
subject: deep-learning
math: true
tags: [deep-learning, regularization, dropout, l1, l2]
---

## Lasso (L1)

- Shrinks least important features' coefficients to zero (built-in feature selection)
- $\mathcal{L} = \sum_{i=0}^{N}(y_i - \sum_{j=0}^{M}x_{ij}w_j)^2 + \lambda \|\sum_{j=0}^{M}w_j\|$

## Ridge (L2)

- More computationally efficient (differentiable at 0)
- $\tilde{\mathcal{L}}(w) = \mathcal{L}(w) + \frac{\lambda}{2} \|w\|^2$
- $\nabla \tilde{\mathcal{L}}(w) = \nabla \mathcal{L}(w) + \lambda w$

## Elastic Net (L1+L2)

$\mathcal{L} = \sum_{i=0}^{N}(y_i - \sum_{j=0}^{M}x_{ij}w_j)^2 + \lambda_1 \|\sum_{j=0}^{M}w_j\| + \lambda_2 \sum_{j=0}^{M}w_j^2$

## Dropout

### Inverted Dropout

During inference: keep dropout active, run multiple forward passes to get uncertainty estimates (approximate probability distribution).

## Other Techniques

- Dataset Augmentation
- Parameter Sharing and Tying
- Adding Noise to Input/Output
- Early Stopping
- Ensemble Methods

## Questions

**How L1 helps in feature selection?** The derivative of $\|w\|$ is $\pm 1$ (or subgradient $[-1,1]$ at $w=0$). The constant push towards zero means weights stay exactly at zero if $\|\frac{\partial L}{\partial w}\| < \lambda$.

**Dropout for uncertainty estimation?** Keep dropout active at inference, run ~100 forward passes. Mean = prediction, variance = uncertainty.
