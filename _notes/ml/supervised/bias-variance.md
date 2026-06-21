---
title: "Bias-Variance Tradeoff"
description: "Understanding underfitting, overfitting, and the bias-variance decomposition"
subject: ml
math: true
tags: [bias, machine-learning, ml, overfitting, supervised, supervised-learning, underfitting, variance]
order: 2
---

Let $f(x)$ be true model and $\hat{f}(x)$ be estimate of our model.

## Bias

- Measures the difference between the model's average prediction and the true value
- $\text{Bias}(\hat{f}(x)) = E[\hat{f}(x)] - f(x)$
- Simple models have very high bias, complex models have very low bias

## Variance

- Measures the model's sensitivity to fluctuations in the training set
- $\text{Variance}(\hat{f}(x)) = E[(\hat{f}(x) - E[\hat{f}(x)])^2]$
- Simple models have low variance, complex models have high variance

**Summary:**
- Simple Model: high bias, low variance, underfitting
- Complex Model: low bias, high variance, overfitting

## Trade-off

$$E[(y - \hat{f}(x))^2] = \text{Bias}^2 + \text{Variance} + \sigma^2 \text{ (irreducible error)}$$

<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Bias-Variance Tradeoff",
  "caption": "As model complexity increases, bias decreases but variance increases — total error is minimized at the sweet spot",
  "xLabel": "Model Complexity",
  "yLabel": "Error",
  "xTicks": 10,
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "Bias²",
      "data": [[0,4.5],[0.25,3.9712],[0.5,3.5046],[0.75,3.0928],[1,2.7294],[1.25,2.4087],[1.5,2.1256],[1.75,1.8759],[2,1.6555],[2.25,1.4609],[2.5,1.2893],[2.75,1.1378],[3,1.0041],[3.25,0.8861],[3.5,0.782],[3.75,0.6901],[4,0.609],[4.25,0.5374],[4.5,0.4743],[4.75,0.4186],[5,0.3694],[5.25,0.326],[5.5,0.2877],[5.75,0.2539],[6,0.224],[6.25,0.1977],[6.5,0.1745],[6.75,0.154],[7,0.1359],[7.25,0.1199],[7.5,0.1058],[7.75,0.0934],[8,0.0824],[8.25,0.0727],[8.5,0.0642],[8.75,0.0566],[9,0.05],[9.25,0.0441],[9.5,0.0389],[9.75,0.0344],[10,0.0303]],
      "color": 2
    },
    {
      "label": "Variance",
      "data": [[0,0.05],[0.25,0.056],[0.5,0.0626],[0.75,0.0701],[1,0.0784],[1.25,0.0878],[1.5,0.0982],[1.75,0.1099],[2,0.123],[2.25,0.1376],[2.5,0.154],[2.75,0.1723],[3,0.1929],[3.25,0.2158],[3.5,0.2415],[3.75,0.2703],[4,0.3025],[4.25,0.3385],[4.5,0.3788],[4.75,0.4239],[5,0.4744],[5.25,0.5309],[5.5,0.5941],[5.75,0.6648],[6,0.744],[6.25,0.8326],[6.5,0.9317],[6.75,1.0427],[7,1.1668],[7.25,1.3057],[7.5,1.4612],[7.75,1.6352],[8,1.8299],[8.25,2.0478],[8.5,2.2916],[8.75,2.5645],[9,2.8699],[9.25,3.2116],[9.5,3.594],[9.75,4.022],[10,4.5009]],
      "color": 3
    },
    {
      "label": "Total Error",
      "data": [[0,5.05],[0.25,4.5272],[0.5,4.0672],[0.75,3.6629],[1,3.3078],[1.25,2.9964],[1.5,2.7239],[1.75,2.4858],[2,2.2784],[2.25,2.0986],[2.5,1.9433],[2.75,1.8101],[3,1.697],[3.25,1.6019],[3.5,1.5235],[3.75,1.4604],[4,1.4115],[4.25,1.3759],[4.5,1.3531],[4.75,1.3425],[5,1.3438],[5.25,1.3569],[5.5,1.3818],[5.75,1.4187],[6,1.468],[6.25,1.5303],[6.5,1.6062],[6.75,1.6966],[7,1.8027],[7.25,1.9257],[7.5,2.067],[7.75,2.2286],[8,2.4123],[8.25,2.6205],[8.5,2.8558],[8.75,3.1212],[9,3.4199],[9.25,3.7557],[9.5,4.1329],[9.75,4.5563],[10,5.0312]],
      "color": 1,
      "fill": true
    },
    {
      "label": "Irreducible Error",
      "data": [[0,0.5],[10,0.5]],
      "color": 4,
      "dashed": true
    }
  ]
}'></div>

### Underfitting
- High loss for training and test
- **Fix:** More complex models, reduce regularization, increase training time

### Overfitting
- Low training loss but high test loss
- **Fix:** Regularization, more training data, data augmentation, K-fold cross-validation, reduce features
