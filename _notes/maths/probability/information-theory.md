---
title: "Information Theory"
description: "Entropy, Information Gain, Gini Impurity, Cross-Entropy, KL-Divergence"
subject: maths
math: true
tags: [entropy, information-theory, kl-divergence, math, mathematics, maths, probability]
order: 6
---

## Entropy
$H(X) = -\sum_{i=1}^{n} p(x_i) \log_2 p(x_i)$

## Information Gain
$IG(T,a) = H(T) - \sum_{v \in values(a)} \frac{|T_v|}{|T|} H(T_v)$

## Gini Impurity
$Gini(T) = 1 - \sum_{i=1}^{c} (p_i)^2$

## Cross Entropy
$H(p,q) = -\sum_{x} p(x) \log q(x)$

## KL-Divergence
$D_{KL}(P\|Q) = \sum_{i} P(i) \log \frac{P(i)}{Q(i)}$
