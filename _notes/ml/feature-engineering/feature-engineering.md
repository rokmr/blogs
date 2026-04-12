---
title: "Feature Engineering"
description: "Feature selection and transformation techniques"
subject: ml
math: true
tags: [ml, feature-engineering, feature-selection]
---

## Feature Selection

- Find a **small** subset of features that has **best** correlation with class labels.
- Transform the original feature vector into a new feature vector to improve the features (e.g., make them uncorrelated).

## Handling Data Imbalance

- **Over-sampling:** Sample the minority class more to balance the dataset
- **Under-sampling:** Sample the majority class less to balance the dataset
- **SMOTE:** Creates synthetic minority examples by sampling feature values
- **Use tree-based models:** They perform well on imbalanced datasets
