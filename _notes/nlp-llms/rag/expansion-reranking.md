---
title: "Query Expansion & Reranking"
description: "HyDE, Query Rewriting, Cross-Encoders, and CRAG (Corrective RAG)"
subject: nlp-llms
math: false
tags: [crag, cross-encoder, hyde, llm, nlp, rag, reranking]
status: wip
sitemap: false
order: 8
---

## Query Expansion & Generation

### Query Rewriting
Users often provide poor, ambiguous, or conversational queries ("What about it?"). An LLM rewrites the query into a highly optimized search query before hitting the vector database.

### HyDE (Hypothetical Document Embeddings)
Instead of searching with the user's short query, HyDE asks an LLM to hallucinate a *hypothetical answer* to the query. The system then embeds this hypothetical answer and uses it to search the vector database. It works because the hypothetical document is structurally closer to the target document than a raw query.

## Reranking (Cross-Encoders)
Standard embedding models (Bi-Encoders) are fast but shallow, as they compress documents independently. 
- **Cross-Encoders:** Take both the query and the retrieved document as a single input and output an exact relevance score. They are highly accurate but computationally heavy.
- **Workflow:** Retrieve Top-50 using fast vector search, then rerank the Top-50 using a Cross-Encoder to get the ultimate Top-5.

## CRAG (Corrective Retrieval Augmented Generation)
[CRAG](https://arxiv.org/abs/2401.15884) introduces a self-correction mechanism to evaluate the quality of retrieved documents. 
- **Mechanism:** A lightweight evaluator judges the retrieved documents as `Correct`, `Incorrect`, or `Ambiguous`. 
- **Action:** If documents are incorrect, CRAG triggers an external web search to correct the context before passing it to the final generator.

TODO: Add diagram for CRAG workflow and HyDE logic.
