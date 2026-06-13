---
title: "Evaluation Metrics"
description: "Classification and detection metrics — precision, recall, F1, IoU, NMS"
subject: ml
math: true
tags: [ml, supervised, metrics, precision, recall, iou, nms]
---

## Basics
- **True Positives (TP):** actual 1, prediction 1
- **True Negative (TN):** actual 0, prediction 0
- **False Positive (FP):** actual 0, prediction 1
- **False Negative (FN):** actual 1, prediction 0

## Accuracy

$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$

## Recall

Out of all True **observations** how many were actually True.

$\text{Recall} = \frac{TP}{TP+FN}$

Use when false negatives are costly (cancer detection, criminal detection).

## Precision

Out of all True **predictions** how many were actually True.

$\text{Precision} = \frac{TP}{TP+FP}$

Use when false positives are costly (spam filter, fraud detection).

> High threshold leads to high precision while recall decreases.

<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Precision-Recall Tradeoff",
  "caption": "As decision threshold increases: precision rises, recall falls — F1 finds the balance",
  "xLabel": "Threshold",
  "yLabel": "Score",
  "xTicks": 10,
  "lines": [
    {
      "label": "Precision",
      "data": [[0.0,0.3054],[0.025,0.3067],[0.05,0.3084],[0.075,0.3105],[0.1,0.3131],[0.125,0.3163],[0.15,0.3204],[0.175,0.3253],[0.2,0.3314],[0.225,0.3389],[0.25,0.3480],[0.275,0.3591],[0.3,0.3724],[0.325,0.3883],[0.35,0.4072],[0.375,0.4291],[0.4,0.4544],[0.425,0.4831],[0.45,0.5149],[0.475,0.5495],[0.5,0.5863],[0.525,0.6246],[0.55,0.6633],[0.575,0.7016],[0.6,0.7386],[0.625,0.7733],[0.65,0.8053],[0.675,0.8341],[0.7,0.8596],[0.725,0.8817],[0.75,0.9007],[0.775,0.9168],[0.8,0.9303],[0.825,0.9415],[0.85,0.9507],[0.875,0.9582],[0.9,0.9644],[0.925,0.9694],[0.95,0.9735],[0.975,0.9767],[1.0,0.9794]],
      "color": 1
    },
    {
      "label": "Recall",
      "data": [[0.0,0.9873],[0.025,0.9854],[0.05,0.9830],[0.075,0.98],[0.1,0.9763],[0.125,0.9717],[0.15,0.9659],[0.175,0.9589],[0.2,0.9502],[0.225,0.9395],[0.25,0.9265],[0.275,0.9107],[0.3,0.8916],[0.325,0.8689],[0.35,0.8420],[0.375,0.8107],[0.4,0.7746],[0.425,0.7337],[0.45,0.6883],[0.475,0.6389],[0.5,0.5863],[0.525,0.5317],[0.55,0.4763],[0.575,0.4216],[0.6,0.3689],[0.625,0.3193],[0.65,0.2737],[0.675,0.2326],[0.7,0.1962],[0.725,0.1646],[0.75,0.1374],[0.775,0.1145],[0.8,0.0953],[0.825,0.0793],[0.85,0.0661],[0.875,0.0553],[0.9,0.0465],[0.925,0.0394],[0.95,0.0336],[0.975,0.029],[1.0,0.0252]],
      "color": 2
    },
    {
      "label": "F1-Score",
      "data": [[0.0,0.4665],[0.025,0.4678],[0.05,0.4695],[0.075,0.4716],[0.1,0.4742],[0.125,0.4773],[0.15,0.4811],[0.175,0.4858],[0.2,0.4914],[0.225,0.4981],[0.25,0.5059],[0.275,0.5151],[0.3,0.5254],[0.325,0.5368],[0.35,0.5489],[0.375,0.5612],[0.4,0.5728],[0.425,0.5826],[0.45,0.5891],[0.475,0.5908],[0.5,0.5863],[0.525,0.5744],[0.55,0.5545],[0.575,0.5267],[0.6,0.4921],[0.625,0.4520],[0.65,0.4085],[0.675,0.3637],[0.7,0.3195],[0.725,0.2774],[0.75,0.2385],[0.775,0.2036],[0.8,0.1728],[0.825,0.1463],[0.85,0.1237],[0.875,0.1046],[0.9,0.0888],[0.925,0.0757],[0.95,0.0650],[0.975,0.0562],[1.0,0.0491]],
      "color": 3,
      "dashed": true
    }
  ]
}'></div>


## F1-Score

Harmonic Mean of Precision (P) and Recall (R):

$F1 = \frac{2 \cdot P \cdot R}{P+R}$

## R2 Score

Range: [0, 1]. 1 is good, 0 is bad.

## IoU (Intersection over Union)

$IoU = \frac{\text{Area of Overlap}}{\text{Area of Union}}$

![IoU]({{ "/assets/img/notes/ml/supervised/IoU.png" | relative_url }})

## Dice Coefficient

$\text{Dice} = \frac{2 \times \text{Intersection}}{\text{Area of Prediction + Area of Ground Truth}} = \frac{2 \times IoU}{1 + IoU}$

## Non-Maximum Suppression (NMS)

<div class="visual-diagram" data-type="flowchart" data-config='{
  "title": "NMS Algorithm",
  "caption": "Iteratively keeps highest-confidence box and removes overlapping boxes above IoU threshold",
  "direction": "TB",
  "nodes": [
    { "id": "input", "label": "All predicted\nboxes + scores", "shape": "rounded" },
    { "id": "sort", "label": "Sort by\nconfidence", "shape": "rounded" },
    { "id": "pick", "label": "Pick highest\nscore box", "shape": "rounded", "accent": true },
    { "id": "iou", "label": "IoU > threshold?", "shape": "diamond" },
    { "id": "remove", "label": "Remove\noverlapping box", "shape": "rounded" },
    { "id": "keep", "label": "Keep box", "shape": "rounded" },
    { "id": "done", "label": "Remaining\nboxes empty?", "shape": "diamond" },
    { "id": "output", "label": "Final\ndetections", "shape": "rounded", "accent": true }
  ],
  "edges": [
    { "from": "input", "to": "sort" },
    { "from": "sort", "to": "pick" },
    { "from": "pick", "to": "iou" },
    { "from": "iou", "to": "remove", "label": "Yes" },
    { "from": "iou", "to": "keep", "label": "No" },
    { "from": "remove", "to": "done" },
    { "from": "keep", "to": "done" },
    { "from": "done", "to": "pick", "label": "No" },
    { "from": "done", "to": "output", "label": "Yes" }
  ]
}'></div>

![NMS Algorithm]({{ "/assets/img/notes/ml/supervised/NMSAlgo.png" | relative_url }})

![NMS Issues]({{ "/assets/img/notes/ml/supervised/NMSIssue.png" | relative_url }})

- Narrow Threshold (High IoU): Low Precision (More FP)
- Wide Threshold (Low IoU): Low Recall (More FN)

See also: [$\lambda_{NMS}$](https://arxiv.org/pdf/1511.06437) for learned NMS.
