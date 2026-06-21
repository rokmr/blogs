---
title: "Naive Bayes"
description: "Probabilistic classifier based on Bayes' theorem with class-conditional independence"
subject: ml
math: true
tags: [bayes, classification, machine-learning, ml, probability, probability-stats, supervised, supervised-learning]
order: 6
---

Naive Bayes classifiers have a general assumption that the effect of an attribute value on a given class is independent of the values of the other attributes. This assumption is called class-conditional independence.

$P(A\|B) = \frac{P(B\|A) P(A)}{P(B)}$

$\text{posterior} = \frac{\text{likelihood prob} \times \text{prior}}{\text{marginal}}$

In the context of Naive Bayes classification, we often work with log probabilities to avoid numerical underflow:

$\log P(A\|B) = \log P(B\|A) + \log P(A) - \log P(B)$

The denominator $P(B)$ is omitted since it's constant across classes and doesn't affect the $\text{argmax}$:

$\log P(A\|B) = \log P(B\|A) + \log P(A)$

## Additional Details
- **Prior Probability $P(A)$:** Initial belief about probability of each class before seeing evidence.
- **Likelihood Probability $P(B\|A)$:** Probability of observing features given a particular class.
- **Marginal Probability $P(B)$:** Probability of observing features regardless of class (normalizing constant).
- **Posterior Probability $P(A\|B)$:** Final probability of a class given observed features.

Gaussian PDF: $P(x\|c) = \frac{1}{\sqrt{2\pi\sigma_c^2}} e^{-\frac{(x-\mu_c)^2}{2\sigma_c^2}}$

## Advantages
1. Simple and fast to train and predict
2. Works well with small datasets
3. Can handle both continuous and discrete features
4. Less prone to overfitting

## Disadvantages
1. Assumes features are independent (naive assumption)
2. May not perform well when features are correlated
3. Requires features to be normally distributed for optimal performance
4. Sensitive to feature scaling

## Laplacian Smoothing

Handles zero probability problems. For a feature value x and class c:

$P(x\|c) = \frac{count(x,c) + \alpha}{count(c) + \alpha\|V\|}$

Where $\alpha$ is the smoothing parameter (typically 1) and $\|V\|$ is the vocabulary size.

## Questions

**Why Naive Bayes is called Naive?** Simplified assumption that all features are independent: $P(y\|x_1,...,x_n) = \frac{P(y) \prod_{i=1}^{n} P(x_i\|y)}{P(X)}$

## Code

```python
class NaiveBayes:
    def fit(self, X, y):
        n_samples, n_features = X.shape
        self._classes = np.unique(y)
        n_classes = len(self._classes)
        self._mean = np.zeros((n_classes, n_features), dtype=np.float64)
        self._var = np.zeros((n_classes, n_features), dtype=np.float64)
        self._priors = np.zeros(n_classes, dtype=np.float64)
        for idx, c in enumerate(self._classes):
            X_c = X[y == c]
            self._mean[idx, :] = X_c.mean(axis=0)
            self._var[idx, :] = X_c.var(axis=0)
            self._priors[idx] = X_c.shape[0] / float(n_samples)

    def predict(self, X):
        y_pred = [self._predict(x) for x in X]
        return np.array(y_pred)

    def _predict(self, x):
        posteriors = []
        for idx, c in enumerate(self._classes):
            prior = np.log(self._priors[idx])
            posterior = np.sum(np.log(self._pdf(idx, x)))
            posterior = prior + posterior
            posteriors.append(posterior)
        return self._classes[np.argmax(posteriors)]

    def _pdf(self, class_idx, x):
        mean = self._mean[class_idx]
        var = self._var[class_idx]
        numerator = np.exp(-((x - mean) ** 2) / (2 * var))
        denominator = np.sqrt(2 * np.pi * var)
        return numerator / denominator
```
