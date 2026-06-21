---
title: "JEPA (Joint Embedding Predictive Architecture)"
description: "Yann LeCun's vision for autonomous machine intelligence: I-JEPA, V-JEPA, and EchoJEPA"
subject: deep-learning
math: false
tags: [computer-vision, deep-learning, dl, dl-optimization, jepa, self-supervised-learning, yann-lecun]
status: wip
sitemap: false
order: 11
---

## Overview

Introduced by Yann LeCun in 2022 ("A Path Towards Autonomous Intelligence"), the **Joint Embedding Predictive Architecture (JEPA)** is a blueprint for self-supervised learning. Unlike generative models (like masked autoencoders) that try to predict raw pixels, JEPAs learn to predict *abstract representations* in a latent space.

By predicting features rather than reconstructing noisy pixels, JEPAs build a highly efficient, semantic understanding of the world.

## The JEPA Family

### I-JEPA (Image)
Learns by creating an internal model of the outside world, comparing abstract representations of image patches rather than comparing the pixels themselves. 

### V-JEPA (Video)
A collection of vision models trained solely using a feature prediction objective on 2 million videos. It operates by passively watching videos and predicting what happens next in the latent space. Crucially, it does not use text or image encoders for supervision.

### EchoJEPA (Echocardiography Foundation Model)
An application of the V-JEPA architecture specifically for medical imaging. Trained on 18 million echocardiograms, it solves a massive problem in ultrasound: **speckle noise**. 
By leveraging JEPA's latent predictive objective, EchoJEPA learns robust anatomical representations that completely ignore stochastic speckle and acquisition artifacts, outperforming prior models even when trained on just 1% of labeled data.

TODO: Add block diagram of the Joint Embedding prediction loss.
