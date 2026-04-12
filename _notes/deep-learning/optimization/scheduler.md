---
title: "Learning Rate Schedulers"
description: "StepLR, MultiStepLR, ExponentialLR scheduling strategies"
subject: deep-learning
math: true
tags: [deep-learning, optimization, scheduler, learning-rate]
---

<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Learning Rate Schedules",
  "caption": "StepLR (step=30, γ=0.5), MultiStepLR (milestones=[30,60,80], γ=0.5), ExponentialLR (γ=0.97)",
  "xLabel": "Epoch",
  "yLabel": "Learning Rate",
  "xTicks": 10,
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "StepLR",
      "data": [[0,0.1],[29,0.1],[30,0.05],[59,0.05],[60,0.025],[89,0.025],[90,0.0125],[100,0.0125]],
      "color": 1
    },
    {
      "label": "MultiStepLR",
      "data": [[0,0.1],[29,0.1],[30,0.05],[59,0.05],[60,0.025],[79,0.025],[80,0.0125],[100,0.0125]],
      "color": 2
    },
    {
      "label": "ExponentialLR",
      "data": [[0,0.1],[2,0.09409],[4,0.08853],[6,0.0833],[8,0.07837],[10,0.07374],[12,0.06938],[14,0.06528],[16,0.06143],[18,0.0578],[20,0.05438],[22,0.05117],[24,0.04814],[26,0.0453],[28,0.04262],[30,0.0401],[32,0.03773],[34,0.0355],[36,0.0334],[38,0.03143],[40,0.02957],[42,0.02782],[44,0.02618],[46,0.02463],[48,0.02318],[50,0.02181],[52,0.02052],[54,0.01931],[56,0.01816],[58,0.01709],[60,0.01608],[62,0.01513],[64,0.01424],[66,0.01339],[68,0.0126],[70,0.01186],[72,0.01116],[74,0.0105],[76,0.00988],[78,0.00929],[80,0.00874],[82,0.00823],[84,0.00774],[86,0.00728],[88,0.00685],[90,0.00645],[92,0.00607],[94,0.00571],[96,0.00537],[98,0.00505],[100,0.00476]],
      "color": 3
    }
  ]
}'></div>

## StepLR

$$lr_{epoch} = \begin{cases}
\gamma \cdot lr_{epoch-1}, & \text{if epoch \% step\_size = 0} \\
lr_{epoch-1}, & \text{otherwise}
\end{cases}$$

## MultiStepLR

$$lr_{epoch} = \begin{cases}
\gamma \cdot lr_{epoch-1}, & \text{if epoch in milestones} \\
lr_{epoch-1}, & \text{otherwise}
\end{cases}$$

## ExponentialLR

$$lr_{epoch} = \gamma \cdot lr_{epoch-1}$$
