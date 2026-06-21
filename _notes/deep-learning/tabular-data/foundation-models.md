---
title: "Tabular Foundation Models (TFMs)"
description: "Zero-shot classification and regression on tabular data (TabPFN, TabuLa, TabDPT)"
subject: deep-learning
math: false
tags: [deep-learning, dl, foundation-models, tabdpt, tabpfn, tabula, tabular-data]
status: wip
sitemap: false
order: 1
---

## Overview

Tabular data (CSVs, databases) remains the dominant modality for healthcare, finance, and enterprise software. Typically, tabular modeling relies on heavily tuned XGBoost or Random Forest models per dataset. 

**Tabular Foundation Models (TFMs)** attempt to pre-train on millions of diverse tables to generalize across heterogeneous columns and rows, allowing zero-shot classification or regression in a single forward pass.

## Key Models

### TabPFN (Prior Labs)
The pioneer of this space. TabPFN (and TabPFNv2 / v2.5) are incredibly strong models capable of zero-shot inference on small tabular datasets. It uses Prior-Data Fitted Networks to instantly output probabilities without any gradient descent or hyperparameter tuning at inference time.

### TabuLa
[TabuLa-8B](https://github.com/mlfoundations/tabula) (Tabular Llama-8B) is a foundation model built via Large Scale Transfer Learning from Language Models. It serializes tabular data into text and leverages the reasoning capabilities of LLMs to perform classification and binned regression.

### TabDPT
An open-source foundation model based heavily on In-Context Learning (ICL). You feed it examples of your tabular data in the context window, and it generalizes to predict the target column without additional training.

TODO: Add prompt serialization formats for TabuLa.
