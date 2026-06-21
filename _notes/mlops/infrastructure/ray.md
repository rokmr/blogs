---
title: "Ray (Distributed Computing)"
description: "Distributed computing and ML orchestration using Ray Core, Ray Serve, and Ray Train"
subject: mlops
math: false
tags: [mlops, infrastructure, ray, distributed-computing, orchestration]
status: wip
sitemap: false
---

## Overview

[Ray](https://github.com/ray-project/ray) is an open-source unified framework for scaling AI and Python applications. It abstracts away the complexity of distributed computing, allowing you to run massive parallel workloads across clusters easily.

## Core Ecosystem

### Ray Core
Provides the foundational primitives (Tasks, Actors, and Objects) to parallelize generic Python code dynamically.

### Ray Serve
A scalable model-serving library for building online inference APIs. It allows you to compose multiple models (e.g., embedding model + LLM + image classifier) into a single fast endpoint.

### Ray Train & Tune
- **Ray Train:** Scales deep learning training across multiple GPUs and nodes (integrates with PyTorch DDP/FSDP).
- **Ray Tune:** Scalable hyperparameter tuning.

### Ray Data
A scalable dataset library for loading, transforming, and streaming data into ML models.

TODO: Add cluster setup examples and basic Actor/Task code snippets.
