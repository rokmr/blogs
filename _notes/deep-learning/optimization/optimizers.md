---
title: "Optimizers"
description: "SGD, Momentum, Nesterov, AdaGrad, RMSProp, Adam with update rules"
subject: deep-learning
math: true
tags: [adam, deep-learning, dl, dl-optimization, gradient-descent, optimization, sgd]
order: 3
---

## SGD

$w_{t+1} = w_t - \eta \nabla w_t$

## Momentum Based GD

$u_t = \gamma \cdot u_{t-1} + \eta \nabla w_t$

$w_{t+1} = w_t - u_t$

## Nesterov Accelerated GD

$u_t = \gamma \cdot u_{t-1} + \eta \nabla (w_t- \gamma \cdot u_{t-1})$

$w_{t+1} = w_t - u_t$

## AdaGrad

$v_t = v_{t-1} + (\nabla w_t)^2$

$w_{t+1} = w_t - \frac{\eta}{\sqrt{v_t + \epsilon}} \cdot \nabla w_t$

effective\_lr = initial\_lr / sqrt(accumulated\_squared\_gradients + eps)

## RMSProp

$v_t = \alpha \cdot v_{t-1} + (1- \alpha) \cdot (\nabla w_t)^2$

$w_{t+1} = w_t - \frac{\eta}{\sqrt{v_t + \epsilon}} \cdot \nabla w_t$

## Adam

$m_t = \beta_1 \cdot m_{t-1} + (1- \beta_1) \cdot \nabla w_t$

$v_t = \beta_2 \cdot v_{t-1} + (1- \beta_2) \cdot (\nabla w_t)^2$

**Bias Correction:**

$\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}$

$w_{t+1} = w_t - \frac{\eta}{\sqrt{\hat{v}_t + \epsilon}} \cdot \hat{m}_t$
