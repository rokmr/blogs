---
title: "Logistic Regression"
description: "Binary and multi-class classification using logistic regression with MLE derivation"
subject: ml
math: true
tags: [ml, supervised, classification, cross-entropy, mle]
---

It is used for the classification problem. It uses linear regression equation to predict the class probabilities.

Equation:

$y = wx+b$

This $y$ is fed to the sigmoid function to get the output between 0 and 1 as probabilities. So,

$y = \frac{1}{1+ e^{-(wx+b)}}$


**Logistic regression doesn't require:**
- Normality of residuals
- Homoscedasticity

**Logistic regression specifically requires:**
- Binary/categorical outcome
- Linear relationship with log odds (not the outcome itself)

## Effect of Outlier
Since here we focus on finding the decision boundary that linearly separates the classes. So we mostly focus on the points which are closer to the boundary. Therefore, outlier will have very less effect here.

## Logistic Regression as Maximum Likelihood Estimation (MLE)

Assuming the Bernoulli distribution (i.e., binary classification). Let, $y \in \{0,1\}$ if $p$ is the probability of class as 1. Then according to MLE we need to maximize $p^y$ if class is 1 and $(1-p)^{(1-y)}$ if class is 0.

$$L = \prod_{i=1}^{N} p_i^{y_i} (1-p_i)^{(1-y_i)}$$

Multiplying such large number may result in overflow. So take `log` on both side.

$$L = \sum_{i=1}^{N} (y_i \ln p_i + (1 - y_i) \ln (1 - p_i))$$

$Loss = -Likelihood$

This loss penalizes much more than MSE when prediction is wrong.

## Optimization

- $z^{(i)} = wx^{(i)} + b$
    - $\frac{\partial z^{(i)}}{\partial w} = x^{(i)}$    
- $\hat{y}^{(i)} = \sigma(z^{(i)}) = \frac{1}{1 + e^{-z^{(i)}}}$
    - $\frac{\partial \hat{y}^{(i)}}{\partial z^{(i)}} = \hat{y}^{(i)}(1-\hat{y}^{(i)})$
- $J(w,b) = -\frac{1}{m} \sum_{i=1}^m [y^{(i)} \log(\hat{y}^{(i)}) + (1-y^{(i)}) \log(1-\hat{y}^{(i)})]$

$$\frac{\partial J}{\partial w} = \frac{1}{m} \sum_{i=1}^m (\hat{y}^{(i)} - y^{(i)})x^{(i)}$$

$$\frac{\partial J}{\partial b} = \frac{1}{m} \sum_{i=1}^m (\hat{y}^{(i)} - y^{(i)})$$


## Prediction
Here, $pred = \frac{1}{1+ e^{-(wx+b)}}$, if $pred > \tau$ then class 1 else class 0.

$\tau$ is decided according to problem statement.

## Multi-Class (N)
1. **One-vs-all:** We need to have N models. $pred = \text{argmax}_{i} f_{i}(x)$

2. **One-vs-one:** We need to have $\binom{N}{2}$ models, where each model is trained to distinguish between a pair of classes. The prediction is made by majority voting across all pairwise comparisons.

3. **Mathematical:** Use softmax instead of sigmoid and use cross-entropy loss.

## Questions

**Why logistic regression is a classifier and not regression?** Logistic regression outputs probabilities between 0 and 1 which are then converted to binary classes using a threshold $\tau$.

**Why cross-entropy instead of MSE?** Cross-entropy gives larger gradients for wrong predictions, leading to faster and better learning.

**BCE loss convexity?** For linear models, BCE with respect to w and b is convex. For neural networks, BCE is NOT convex due to non-linear activations and multiple layers.

## Code

```python
# Numpy
class LogisticRegression:
    def __init__(self, learning_rate=0.001, n_iters=1000):
        self.lr = learning_rate
        self.n_iters = n_iters
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        for _ in range(self.n_iters):
            linear_model = np.dot(X, self.weights) + self.bias
            y_predicted = self._sigmoid(linear_model)
            dw = (1 / n_samples) * np.dot(X.T, (y_predicted - y))
            db = (1 / n_samples) * np.sum(y_predicted - y)
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict(self, X):
        linear_model = np.dot(X, self.weights) + self.bias
        y_predicted = self._sigmoid(linear_model)
        y_predicted_cls = [1 if i > 0.5 else 0 for i in y_predicted]
        return np.array(y_predicted_cls)

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
```
