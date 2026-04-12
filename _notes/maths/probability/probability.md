---
title: "Probability Theory"
description: "Axioms, random variables, distributions, expectations, covariance, and change of variables"
subject: maths
math: true
tags: [maths, probability, random-variables, bayes, expectation]
---

## Notations

$\Omega$ : Sample Space, $\mathcal{F}$ : set of all possible events, $P$ : Probability

## Axioms

$P : \mathcal{F} \rightarrow \mathbb{R}$ satisfying:
- Non-negativity: $P(A) \geq 0, \forall A \in \mathcal{F}$
- Normalization: $P(\Omega) = 1$
- $\sigma$-additivity: If $A_i \cap A_j = \emptyset, \forall i \neq j$ then $P(\cup_{i=1}^{\infty} A_i) = \sum_{i=1}^{\infty}P(A_i)$

## Key Rules

- **Independence:** $P(AB) = P(A) P(B)$
- **Conditional Independence:** $P(AB|C) = P(A|C)P(B|C)$
- **Chain Rule:** $f(x_1, \ldots, x_n) = f(x_1) \prod_{i=2}^{n} f(x_i | x_1, \ldots, x_{i-1})$
- **Conditional Probability:** $P(A|B) = \frac{P(A \cap B)}{P(B)}$
- **Total Probability:** $P(A) = \sum_{i} P(A|B_i)P(B_i)$
- **Bayes Rule:** $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$

## Random Variable

$X:\Omega \rightarrow \mathbb{R}$

### CDF
$F_X(x) = P(X < x)$, range $[0,1]$

### PMF (Discrete)
$p_X(x) = P(X=x)$, with $\sum_{x \in Val(X)} p_X(x) = 1$

### PDF (Continuous)
$f_X(x) = \frac{dF_X(x)}{dx}$. Note: $f_X(x) \neq P(X=x)$ as it can exceed 1.

### Expectation
- Discrete: $E[g(X)] = \sum_{x} g(x) p_X(x)$
- Continuous: $E[g(X)] = \int_{-\infty}^{\infty} g(x)f_X(x)dx$

### Variance
$Var(X) = E[(X - E(X))^2] = E[X^2] - E[X]^2$

---

## Two Random Variables

### Joint, Marginal, Conditional

- Joint PMF: $p_{XY}(x,y) = P(X=x, Y=y)$
- Marginal: $p_X(x) = \sum_{y} p_{XY}(x,y)$
- If independent: $E[f(X)g(Y)] = E[f(X)] E[g(Y)]$

### Covariance
$Cov(X,Y) = E[XY] - E[X]E[Y]$

$Var[X+Y] = Var[X] + Var[Y] + 2Cov[X,Y]$

---

## Random Vectors

$X \in \mathbb{R}^d$ with PDF $p_X : \mathbb{R}^d \rightarrow \mathbb{R}_{\geq 0}$

### Expectation
$E[X] = \arg\min_{z \in \mathbb{R}^d} \int \|x-z\|^2 p_X(x)dx = \int x \, p_X(x)dx$

### Tower Property
$E[E[X|Y]] = E[X]$

### Change of Variables

$Y = g(X)$, $X = h(Y) = g^{-1}(Y)$

$$p_Y(y) = |J| \cdot p_X(h(y))$$

where $J = \frac{\partial x}{\partial y}$ is the Jacobian.

**Flow Matching Example:** Given $Y = \psi(X)$:

$$p_Y(y) = |\det \partial_{y}\psi^{-1}(y)| \cdot p_X(\psi^{-1}(y))$$
