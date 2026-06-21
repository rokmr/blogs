---
title: "Advanced Retrieval & Routing"
description: "Semantic routing, hybrid search (BM25 + Vector), and filtering strategies"
subject: nlp-llms
math: false
tags: [bm25, embeddings-vectors, hybrid-search, llm, nlp, rag, retrieval, semantic-routing]
status: wip
sitemap: false
order: 7
---

## Overview

A robust RAG pipeline requires more than just dumping embeddings into a vector store. You need to intelligently route queries and combine different search paradigms.

## Semantic Routing
Before querying the database, a Semantic Router classifies the user's intent to decide *which* pipeline or datastore to trigger.
- Example: "Give me the summary of X" routes to a Document Store, while "How many users did we get today" routes to an SQL agent.

## Hybrid Search: BM25 vs Vector Embeddings
- **BM25 (Lexical Search):** Excellent for exact keyword matching (e.g., searching for a specific product ID or exact name).
- **Vector Embeddings (Semantic Search):** Excellent for conceptual queries where the exact words might differ, but the meaning is the same.
- **Hybrid Search:** Runs both simultaneously and fuses the results using algorithms like Reciprocal Rank Fusion (RRF).

## Filtering
- **Pre-filtering:** Filtering the vector space *before* the similarity search using metadata (e.g., `date > 2023 AND category = 'finance'`). Ensures the search is fast and strictly bounded, but requires good metadata extraction.
- **Post-filtering:** Running the similarity search first, then filtering the results. Can lead to empty results if all top-K hits are filtered out.

TODO: Add implementation examples of Reciprocal Rank Fusion.
