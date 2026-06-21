---
title: "RAG Evaluation Metrics"
description: "Core metrics for evaluating Retrieval and Generation quality in RAG pipelines"
subject: nlp-llms
math: true
tags: [evaluation, llm, metrics, mrr, ndcg, nlp, rag]
status: wip
sitemap: false
order: 5
---

## Overview

Evaluating a Retrieval-Augmented Generation (RAG) pipeline requires assessing two distinct phases: how well the system fetches information (Retrieval) and how well the LLM synthesizes that information (Generation).

## Retrieval Metrics
These measure the performance of your vector database and embedding models:

### MRR (Mean Reciprocal Rank)
Measures how far down the ranked list the first relevant chunk appears. Perfect if you only care about the *top* result.
$$ \text{MRR} = \frac{1}{|Q|} \sum_{i=1}^{|Q|} \frac{1}{\text{rank}_i} $$
*(where $Q$ is a sample of queries and $\text{rank}_i$ is the position of the first relevant document for the $i$-th query)*

### NDCG (Normalized Discounted Cumulative Gain)
Evaluates the entire ranking of retrieved chunks, heavily penalizing relevant chunks that are ranked lower down.
$$ \text{DCG}_p = \sum_{i=1}^{p} \frac{rel_i}{\log_2(i+1)} $$
$$ \text{NDCG}_p = \frac{\text{DCG}_p}{\text{IDCG}_p} $$
*(where $rel_i$ is the graded relevance of the result at position $i$, and $\text{IDCG}_p$ is the Ideal DCG, i.e., the max possible DCG)*

### Time-Weighted / Recency-Biased Metrics
When retrieving information where freshness matters (e.g., news, user activity logs, financial data), standard relevance metrics fall short. A chunk might be highly relevant textually, but outdated.
- **Recency Penalty/Weighting:** Modifies the relevance score ($rel_i$) based on the age of the document. A common approach is exponential decay:
$$ rel_i^{\text{time}} = rel_i \times e^{-\lambda (t_{\text{now}} - t_{\text{doc}})} $$
*(where $\lambda$ controls the decay rate, and $t$ represents time)*
- Time-weighted ranking ensures that between two equally relevant documents, the more recent one is ranked higher, which is crucial for dynamic RAG applications.

### Precision@K / Recall@K
- **Precision@K:** Measures the fraction of retrieved chunks in the top K that are relevant.
$$ \text{Precision@K} = \frac{\text{Relevant Documents in Top } K}{K} $$
- **Recall@K:** Measures the fraction of total relevant chunks that were successfully retrieved in the top K.
$$ \text{Recall@K} = \frac{\text{Relevant Documents in Top } K}{\text{Total Relevant Documents}} $$

## Generation Metrics
These measure the final LLM output based on the retrieved context:
- **Faithfulness / Hallucination Rate:** Does the answer rely *only* on the retrieved context?
- **Answer Relevance:** Does the answer actually address the user's query without tangential rambling?
- **Context Relevance:** Were the retrieved chunks actually useful for generating the answer?
