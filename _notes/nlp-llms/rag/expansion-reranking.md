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

## Reranking (Cross-Encoders vs Bi-Encoders)

When matching a query to a document, systems use one of two architectural patterns:

### 1. Bi-Encoders (For Retrieval)
- **Mechanism:** The query and document are passed through the transformer model *independently*. The model outputs a single vector (dense embedding) for each.
- **Speed:** Extremely fast at inference. Documents can be pre-embedded in a vector database offline. When a user queries, the system embeds the query once and performs a fast Approximate Nearest Neighbors (ANN) search.
- **Accuracy:** Lower accuracy, as squashing all the meaning into a single vector loses the nuance of how specific words in the query relate to specific words in the document.

### 2. Cross-Encoders (For Reranking)
Standard embedding models (Bi-Encoders) are fast but shallow. To improve accuracy, we use Cross-Encoders.
- **Mechanism:** Take both the query and the retrieved document, concatenate them (e.g., `[CLS] Query [SEP] Document`), and pass them through the transformer model *together* as a single input.
- **Accuracy:** Highly accurate. The model's self-attention mechanism compares every word in the query directly against every word in the document simultaneously, outputting an exact relevance score (0 to 1).
- **Speed:** Computationally heavy. You cannot pre-compute embeddings. Running it across millions of documents at inference time is too slow.
- **Workflow:** **Two-Stage Retrieval.** Retrieve Top-100 using fast vector search (Bi-Encoder), then rerank the Top-100 using a Cross-Encoder to get the highly precise ultimate Top-5.

### 3. Late Interaction (ColBERT)
A middle-ground between Bi-Encoders and Cross-Encoders.
- **Mechanism:** Generates a separate embedding for *every single token* in the query and document. During search, it uses a fast "MaxSim" operation to compute relevance.
- **Pros:** Preserves fine-grained nuance like a Cross-Encoder, but is much faster and can be indexed (unlike Cross-Encoders).
- **Cons:** Massive storage overhead (a 500-token document requires 500 vectors).

### 4. Last But Not Late (LBNL) Interaction
An emerging architecture bridging the gap between listwise reranking and interaction models (e.g., Jina-Reranker-v3).
- **Mechanism:** Instead of encoding queries and documents entirely separately before matching them (Late Interaction), or running costly pairwise cross-attention for every single query-document combination (Cross-Encoders), LBNL passes the query and *multiple* candidate documents into the same context window simultaneously. Causal attention is applied between the query and all candidates, enabling rich, cross-document listwise interactions before extracting contextual embeddings from each document's final token.
- **Pros:** Achieves state-of-the-art listwise reranking accuracy (matching massive cross-encoders) while remaining computationally smaller and significantly faster than computing multiple independent cross-encoder passes.

## CRAG (Corrective Retrieval Augmented Generation)
[CRAG](https://arxiv.org/abs/2401.15884) introduces a self-correction mechanism to evaluate the quality of retrieved documents. 
- **Mechanism:** A lightweight evaluator judges the retrieved documents as `Correct`, `Incorrect`, or `Ambiguous`. 
- **Action:** If documents are incorrect, CRAG triggers an external web search to correct the context before passing it to the final generator.

TODO: Add diagram for CRAG workflow and HyDE logic.
