---
title: "Ensemble Methods"
description: "Bagging, Random Forest, Boosting (AdaBoost, XGBoost) for reducing variance and bias"
subject: ml
math: true
tags: [ml, ensemble, random-forest, boosting, bagging, xgboost]
---

## Bagging (Bootstrap Aggregating)

**Bootstrapping:** Sample with replacement

- Creates multiple trees using bootstrap samples
- Uses all features
- No pruning (reduces bias)
- Reduces variance through averaging
- Problem: Creates correlated trees

## Random Forest

- Extension of bagging
- Randomly selects subset of features at each split
- Feature subset size:
    - Classification: $\sqrt{M}$
    - Regression: $M/3$
    - Can be reduced for correlated features

## Boosting
- Sequential tree growth
- Each tree learns from previous errors
- Controls tree depth

### Gradient Boosting
- Fits trees to residuals
- Slow learning procedure
- Uses gradient descent

### AdaBoost
- Adjusts observation weights
- Focus on misclassified instances
- Adaptive learning rate

### XGBoost
- Regularized gradient boosting
- L1 (Lasso) and L2 (Ridge) regularization
- Handles missing values
- Tree pruning
