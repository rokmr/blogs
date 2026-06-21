---
title: "OverFeat"
description: "Sliding window + bbox regression + classification"
subject: cv
math: true
tags: [computer-vision, cv, object-detection, overfeat, sliding-window]
paper: "https://arxiv.org/pdf/1312.6229"
order: 2
---

## Overview

Sliding window + bbox regression + classification.

## Pipeline

- **Sliding Window:** Implicitly encoded in CNN architecture, used at different scales
- **Localization:** Regression
- **Detection:** Classification

## Limitations

- Needs fixed-sized window (FC layer constraint)
- Expensive to try all positions, scales, and aspect ratios
