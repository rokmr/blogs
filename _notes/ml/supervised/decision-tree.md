---
title: "Decision Tree"
description: "Recursive binary splitting for classification and regression with pruning"
subject: ml
math: true
tags: [ml, supervised, classification, regression, decision-tree]
---

A supervised learning method used for regression and classification.

## Terminology

1. **Root Node:** Starting point of the tree
2. **Decision Node:** Internal node where a split occurs
3. **Leaf Node:** Terminal node containing predictions
4. **Splitting:** Process of dividing a node into sub-nodes

## Feature Selection Measures

**For Classification:**

1. **Gini Index:** $\sum_{k=1}^K \hat{p}_k(1-\hat{p}_k)$ — Range: [0, 0.5] for binary
2. **Entropy:** $-\sum_{k=1}^K \hat{p}_k\log(\hat{p}_k)$ — Range: [0, log(k)]
3. **Misclassification Error:** $1 - \max(\hat{p}_i)$

**For Regression:**

1. **RSS:** $\sum_{j=1}^J \sum_{i \in R_j} (y_i -\hat{y}_i)^2$
2. **MSE:** $\frac{1}{N} \sum_{j=1}^J \sum_{i \in R_j} (y_i -\hat{y}_i)^2$

## Building Process

Uses top-down, greedy approach (binary splitting). Information gain:

$$IG = I(parent) - \sum_{j=1}^m \frac{N_j}{N}I(j)$$

**Stopping Criteria:**
1. Minimum samples at internal node
2. Minimum samples at leaf node
3. Maximum depth of tree
4. Maximum number of leaf nodes

## Pruning

Cost complexity function:

$$\sum_{m=1}^{|T|} \sum_{i:x_i \in R_m} (y_i - \hat{y}_{R_m})^2 + \alpha |T|$$

where $\|T\|$ is tree size and $\alpha$ is complexity parameter.

## Advantages and Disadvantages

**Advantages:** Interpretable, handles numerical/categorical data, minimal preprocessing, captures non-linear relationships.

**Disadvantages:** High variance (unstable), prone to overfitting, biased towards dominant classes.
