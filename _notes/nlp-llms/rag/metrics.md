---
title: "RAG Evaluation Metrics"
description: "Core metrics for evaluating Retrieval and Generation quality in RAG pipelines"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, evaluation, metrics, mrr, ndcg]
status: wip
sitemap: false
---

## Overview

Evaluating a Retrieval-Augmented Generation (RAG) pipeline requires assessing two distinct phases: how well the system fetches information (Retrieval) and how well the LLM synthesizes that information (Generation).

## Retrieval Metrics
These measure the performance of your vector database and embedding models:
- **MRR (Mean Reciprocal Rank):** Measures how far down the ranked list the first relevant chunk appears. Perfect if you only care about the *top* result.
- **NDCG (Normalized Discounted Cumulative Gain):** Evaluates the entire ranking of retrieved chunks, heavily penalizing relevant chunks that are ranked lower down.
- **Precision@K / Recall@K:** Measures the fraction of retrieved chunks that are relevant (Precision) and the fraction of total relevant chunks that were successfully retrieved (Recall).

## Generation Metrics
These measure the final LLM output based on the retrieved context:
- **Faithfulness / Hallucination Rate:** Does the answer rely *only* on the retrieved context?
- **Answer Relevance:** Does the answer actually address the user's query without tangential rambling?
- **Context Relevance:** Were the retrieved chunks actually useful for generating the answer?

TODO: Add exact mathematical formulas for MRR and NDCG.
