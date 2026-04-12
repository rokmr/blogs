---
title: "Convex & Concave Functions"
description: "Properties of convex/concave functions, parametric vs non-parametric models, generative vs discriminative models"
subject: maths
math: true
tags: [maths, optimization, convexity, models]
---

## Convex Functions

$f(tx_1 + (1-t)x_2) \leq tf(x_1) + (1-t)f(x_2)$ for all $t \in [0,1]$

The graph curves upward.

**Properties:**
- Sum of convex functions is convex
- Jensen's inequality: $f(E[X]) \leq E[f(X)]$
- $f$ is convex $\iff$ $f''(x) \geq 0$
- Examples: $x^2$, $e^x$, $|x|$

## Concave Functions

$f(tx_1 + (1-t)x_2) \geq tf(x_1) + (1-t)f(x_2)$

The graph curves downward.

**Properties:**
- Sum of concave functions is concave
- $f(E[X]) \geq E[f(X)]$
- $f$ is concave $\iff$ $f''(x) \leq 0$
- Examples: $\log(x)$, $\sqrt{x}$, $-x^2$

---

## Parametric vs Non-parametric Models

**Parametric:** Fixed number of parameters. Strong distribution assumptions. (Linear Regression, Logistic Regression, Neural Networks, LDA)

**Non-parametric:** Parameters grow with data. Fewer assumptions. (KNN, Decision Trees, Random Forests, SVM, Gaussian Processes)

---

## Generative vs Discriminative Models

**Generative:** Models $P(X|Y)P(Y)$, then uses Bayes' rule. (Naive Bayes, GMM, LDA, GANs, HMM)

**Discriminative:** Directly models $P(Y|X)$. (Logistic Regression, SVM, Decision Tree, Neural Network)
