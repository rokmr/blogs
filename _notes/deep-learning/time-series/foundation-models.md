---
title: "Time Series Foundation Models"
description: "Chronos (Amazon), TimesFM (Google), and MOMENT for zero-shot forecasting"
subject: deep-learning
math: false
tags: [deep-learning, time-series, forecasting, chronos, timesfm, moment]
status: wip
sitemap: false
---

## Overview

Unlike NLP or Vision, Time Series lacks massive, cohesive public repositories, making Foundation Models (FMs) difficult to build. However, recent models have solved this by leveraging massive pre-training on diverse telemetry, finance, and weather datasets to enable **zero-shot forecasting**—predicting horizons without any task-specific fine-tuning.

## Amazon Chronos
[Chronos](https://github.com/amazon-science/chronos-forecasting) is a family of time series models by Amazon that treats time series like a language modeling problem. 
- **Mechanism:** It tokenizes time series values using scaling and quantization into a fixed vocabulary, then trains standard transformer architectures (based on T5) via cross-entropy loss.
- **Chronos-2:** Expanded capabilities for univariate, multivariate, and covariate-informed forecasting entirely zero-shot via In-Context Learning (ICL).

## Google TimesFM
[TimesFM](https://github.com/google-research/timesfm) is Google's 200M parameter zero-shot forecasting model.
- **Mechanism:** Predicts future horizons via patch-based processing.
- **Features:** Supports 16K context windows, quantile heads for probabilistic forecasting, and LoRA fine-tuning.

## MOMENT
An open-source family of foundation models for general-purpose time series analysis, attempting to solve the massive data heterogeneity problem across diverse datasets.

TODO: Add patch-based forecasting mechanisms vs tokenization mechanisms.
