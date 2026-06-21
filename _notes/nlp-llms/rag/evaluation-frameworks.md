---
title: "RAG Evaluation Frameworks"
description: "Tools for automating RAG evaluation: Ragas, DeepEval, and TruLens"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, evaluation, ragas, deepeval, trulens]
status: wip
sitemap: false
---

## Overview

Manually evaluating RAG pipelines is unscalable. Modern frameworks use "LLM-as-a-Judge" paradigms to automatically score pipelines against standard metrics (Faithfulness, Answer Relevance, Context Precision).

## Ragas
[Ragas (Retrieval Augmented Generation Assessment)](https://github.com/explodinggradients/ragas) is a popular open-source framework that evaluates RAG pipelines without requiring human-annotated ground-truth datasets.
- **Key Metrics:** Context Precision, Context Recall, Faithfulness, Answer Relevancy.

## DeepEval
[DeepEval](https://github.com/confident-ai/deepeval) is an open-source evaluation framework for LLMs, heavily inspired by PyTest.
- **Key Features:** It runs evaluations as unit tests (`deepeval test run ...`). Extremely easy to integrate into CI/CD pipelines.

## TruLens
[TruLens](https://github.com/truera/trulens) tracks and evaluates LLM apps. 
- **Key Features:** Introduces the "RAG Triad" (Context Relevance, Groundedness, Answer Relevance) and provides a powerful visual dashboard to explore where a pipeline failed across different queries.

TODO: Add code snippets for setting up a basic Ragas evaluation run.
