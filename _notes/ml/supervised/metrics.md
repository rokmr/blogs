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
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "Precision",
      "data": [[0,0.3057],[0.025,0.3077],[0.05,0.3103],[0.075,0.3139],[0.1,0.3186],[0.125,0.3249],[0.15,0.3332],[0.175,0.3441],[0.2,0.3582],[0.225,0.3764],[0.25,0.3993],[0.275,0.4277],[0.3,0.462],[0.325,0.5023],[0.35,0.548],[0.375,0.5979],[0.4,0.65],[0.425,0.7021],[0.45,0.752],[0.475,0.7977],[0.5,0.838],[0.525,0.8723],[0.55,0.9007],[0.575,0.9236],[0.6,0.9418],[0.625,0.9559],[0.65,0.9668],[0.675,0.9751],[0.7,0.9814],[0.725,0.9861],[0.75,0.9897],[0.775,0.9923],[0.8,0.9943],[0.825,0.9958],[0.85,0.9969],[0.875,0.9977],[0.9,0.9983],[0.925,0.9987],[0.95,0.999],[0.975,0.9993],[1,0.9995]],
      "color": 1
    },
    {
      "label": "Recall",
      "data": [[0,0.9959],[0.025,0.9948],[0.05,0.9933],[0.075,0.9914],[0.1,0.989],[0.125,0.9859],[0.15,0.982],[0.175,0.977],[0.2,0.9707],[0.225,0.9627],[0.25,0.9526],[0.275,0.9399],[0.3,0.9241],[0.325,0.9047],[0.35,0.8808],[0.375,0.852],[0.4,0.8176],[0.425,0.7773],[0.45,0.7311],[0.475,0.6792],[0.5,0.6225],[0.525,0.5622],[0.55,0.5],[0.575,0.4378],[0.6,0.3775],[0.625,0.3208],[0.65,0.2689],[0.675,0.2227],[0.7,0.1824],[0.725,0.148],[0.75,0.1192],[0.775,0.0953],[0.8,0.0759],[0.825,0.0601],[0.85,0.0474],[0.875,0.0373],[0.9,0.0293],[0.925,0.023],[0.95,0.018],[0.975,0.0141],[1,0.011]],
      "color": 2
    },
    {
      "label": "F1-Score",
      "data": [[0,0.4678],[0.025,0.47],[0.05,0.4729],[0.075,0.4768],[0.1,0.4819],[0.125,0.4887],[0.15,0.4976],[0.175,0.5089],[0.2,0.5233],[0.225,0.5412],[0.25,0.5627],[0.275,0.5879],[0.3,0.616],[0.325,0.646],[0.35,0.6756],[0.375,0.7027],[0.4,0.7242],[0.425,0.7378],[0.45,0.7414],[0.475,0.7337],[0.5,0.7144],[0.525,0.6837],[0.55,0.643],[0.575,0.594],[0.6,0.539],[0.625,0.4804],[0.65,0.4208],[0.675,0.3626],[0.7,0.3076],[0.725,0.2574],[0.75,0.2128],[0.775,0.1739],[0.8,0.141],[0.825,0.1134],[0.85,0.0905],[0.875,0.0719],[0.9,0.0569],[0.925,0.045],[0.95,0.0354],[0.975,0.0278],[1,0.0218]],
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
