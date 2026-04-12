---
title: "Support Vector Machine"
description: "Margin-maximizing classifier with kernel trick for non-linear boundaries"
subject: ml
math: true
tags: [ml, supervised, classification, svm, kernel]
---

- Used for both classification and regression tasks.
- Core idea: Find optimal hyperplane that maximizes margin between classes.

## Geometric Interpretation

- There are many hyperplanes that separate positive and negative points.
- We want to find the margin-maximizing hyperplane.
- Margin is the perpendicular distance between two hyperplanes $H^{+}$ and $H^{-}$.
- Points through which $H^{+}$ or $H^{-}$ pass are called support vectors.

## Derivation

- $H$: $w^T x + b = 0$
- $H^{+}$: $w^T x + b = 1$ (positive class boundary)
- $H^{-}$: $w^T x + b = -1$ (negative class boundary)
- Margin: $d = \frac{2}{\|w\|}$

**For linearly separable data:**

$$w^{\star}, b^{\star} = \arg\min_{w,b} \frac{\|w\|^2}{2} \quad \text{s.t. } y_i(w^T x_i + b) \ge 1 \; \forall i$$

**For non-linearly separable data (soft margin):**

$$w^{\star}, b^{\star} = \arg\min_{w,b} \frac{\|w\|^2}{2} + C \sum_i^N \xi_i$$

where $\xi_i \ge 0$ are slack variables and $C$ is the regularization parameter.

## Hinge Loss

$L_{hinge}(y_i, f(x_i))=\max(0, 1-y_i f(x_i))$ where $f(x_i) = w^T x_i + b$

Complete objective: $\mathcal{L} = \min_{w,b} \frac{1}{n}\sum_i^N \max(0, 1 - y_i(w^T x_i +b)) + \lambda \|w\|^2$

### Gradient Updates

1. For points outside margin ($y_i(w^T x_i + b) \geq 1$):
   - $w = w - \eta \lambda w$

2. For margin violations ($y_i(w^T x_i + b) < 1$):
   - $w = w - \eta(\lambda w - y_i x_i)$
   - $b = b + \eta y_i$

## Dual Form

$$\max_{\alpha} \sum_i^N \alpha_i - \frac{1}{2}\sum_i \sum_j \alpha_i \alpha_j y_i y_j x_i^T x_j$$

subject to: $\sum_i^N \alpha_i y_i = 0$ and $0 \le \alpha_i \le C$

## Kernel SVM

Kernel trick: $K(x,y) = \phi(x)^T\phi(y)$

**Common Kernels:**
- **Linear:** $K(x,y) = x^T y$
- **Polynomial:** $K(x,y) = (\gamma x^Ty + r)^d$
- **RBF (Gaussian):** $K(x,y) = \exp(-\gamma\|x-y\|^2)$

**Prediction:** $f(x) = \text{sign}(\sum_{i \in SV} \alpha_i y_i K(x_i,x) + b)$
