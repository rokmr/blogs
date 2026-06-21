---
title: "K-Nearest Neighbors"
description: "Non-parametric algorithm for classification and regression using distance metrics"
subject: ml
math: true
tags: [classification, knn, machine-learning, ml, non-parametric, supervised, supervised-learning]
order: 5
---

It is non-parametric learning algorithm. It is mainly used for classification but also can be used for regression by averaging out the nearest value based on distance.

## Process
1. Choose the number of k and a distance metric (Euclidean, Manhattan, Cosine etc.)
2. Find the k-nearest neighbors of the data record that we want to classify
3. Assign the class label by majority vote

The right choice of k is crucial to finding a good balance between overfitting and underfitting.

## Effect of k

As k increases, variance decreases while bias increases. Conversely, as k decreases, variance increases while bias decreases.

## Key Points
- It is a memory-based approach that immediately adapts as we collect new training data
- Computational complexity for classifying new examples grows linearly with the number of training examples (worst case)
- KNN is very susceptible to overfitting due to the curse of dimensionality. Regularization methods cannot be applied here
- All features should be scaled as we will be taking distance based on features
- Optimization can be done through dimensionality reduction using methods like PCA, LDA etc.
