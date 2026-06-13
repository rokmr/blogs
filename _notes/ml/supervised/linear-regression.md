---
title: "Linear Regression"
description: "Closed-form and gradient descent solutions for linear regression"
subject: ml
math: true
tags: [ml, supervised, regression, gradient-descent]
---

Linear Regression would be appropriate since we are predicting a continuous value.

Linear Regression works when these 4 assumtion being followed:

1. **Linearity:** this means that the relationship must be linear between the independent variables and dependent variables. 
$y= \beta_0 + \beta_1 x_1 + \beta_2 x_2$ or $y= \beta_0 + \beta_1 sin(x) + \beta_2 cosx(x)$

2. **Homoscedasticity:** Constant variance of residuals. 

3. **Independence:** independent variables (observations) are not highly correlated.

4. **Normality:** Residuals are normally distributed for any fixed value of our observations 

**Note**

- Find the collinearity by using Variance Inflation Factors (VIF). VIF > 5 variable are dependent.

- Solve collinearity by either removing one of the features or linearly combine both features. 

## Metrics
- **Root Mean Square Error (RMSE) :** Calculates the average of the squared difference between the predicted and actual values. Thus, larger errors (outliers or poor prediction) are flagged 
more than when using MAE due to squaring errors. $RMSE = \sqrt{\frac{\sum_{i=1}^{N}(y_i - \hat{y_i})^2}{N}}$

- **Mean Absolute Error (MAE) :** Calculates the average of the absolute difference between the predicted and actual values. As a result, it does not punish large errors as much as RMSE. $MAE = \frac{\sum_{i=1}^{N}\|y_i - \hat{y_i}\|}{N}$

## Methods
1. Closed form solution
    - $XW=y$
    - $X^TXW=X^Ty$
    - $W = (X^TX)^{-1}X^Ty$
    - Useful, when optimal solution is needed. Issue when inverse does not exist and computationally expensive when data is too large.

2. Optimization algorithm, typically Gradient Descent (GD) or Stochastic Gradient Descent (SGD).
    - $\text{L} = \frac{1}{2} \|\hat{y} - y\|^2$ where $\hat{y} = X*W + b$ 
    - $\frac{\partial L}{\partial W} = X*(\hat{y}- y)$
    - $\frac{\partial L}{\partial b} = \hat{y}- y$

## Feature Importance
If the features are normalized then the coefficients are an indication of feature importance, i.e. features with higher coefficients are more useful for 
prediction.

## Prediction

$y = \sum_{i}w_ix_i + b$

## Question

**Why linear regression is called linear?**

The relationship between the independent variables (X) and dependent variable (Y) is expressed as a linear combination of parameters (coefficients). The coefficients (β) appear in the equation in a linear way: $Y = β_0 + β_1X_1 + β_2X_2 + ... + β_nX_n$. These parameters are not raised to powers or modified by other functions. The variables themselves (X) can be non-linear (like $X^2$, $\log(X)$, etc.). For example: $Y = β_0 + β_1X^2$ is still a linear regression model because the coefficient $β_1$ is linear.

**Explain the concept of correlation between features and its problems.**

Correlation measures linear relationship between variables (range: -1 to +1). Problems with correlated features include multicollinearity in regression, unstable coefficients, and reduced model interpretability.

## Code

```python
# Closed Form
class LinearRegressionClosedForm:
    def __init__(self):
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        n_samples, n_features = X.shape
        bias = np.ones((n_samples, 1))
        X_new = np.column_stack((X, bias))
        W = np.linalg.inv(X_new.T @ X_new) @ X_new.T @ y
        self.weights = W[:-1]
        self.bias = W[-1]

    def predict(self, X):
        y_approximated = np.dot(X, self.weights) + self.bias
        return y_approximated
```

```python
# Gradient Descent
class LinearRegression:
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
            y_predicted = np.dot(X, self.weights) + self.bias
            dw = (1 / n_samples) * np.dot(X.T, (y_predicted - y))
            db = (1 / n_samples) * np.sum(y_predicted - y)
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict(self, X):
        y_approximated = np.dot(X, self.weights) + self.bias
        return y_approximated
```
