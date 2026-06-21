---
title: "ExtremeNet"
description: "Object detection via extreme point prediction"
subject: cv
math: true
tags: [computer-vision, cv, extremenet, keypoint, object-detection]
paper: "https://arxiv.org/pdf/1901.08043"
order: 9
---

## Overview

![ExtremeNet]({{ "/assets/img/notes/cv/object-detection/ExtremeNet.png" | relative_url }})

## Key Ideas

- Predicting corners where objects don't lie is hard for CNNs
- Represents objects by their extreme points (top, bottom, left, right)
- No need to predict embeddings for box computation
- Extreme points are commonly used for annotation
