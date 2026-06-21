---
title: "Agentic RAG Frameworks"
description: "Agentic RAG, self-reflection, iterative retrieval, and graph-based frameworks (LightRAG, RAG-Anything)"
subject: nlp-llms
math: false
tags: [nlp, llm, agents, rag, retrieval, lightrag, graph-rag]
status: wip
sitemap: false
---

## Overview

Unlike standard linear RAG pipelines, RAG Agents actively decide when to search, how to formulate queries, and when to reflect on retrieved context. This includes hybridizing traditional vector search with Knowledge Graphs (KG).

## Advanced RAG Frameworks

### LightRAG
[LightRAG](https://github.com/HKUDS/LightRAG) is a lightweight knowledge-graph RAG framework and an efficient alternative to Microsoft GraphRAG.
- **Dual-Layer Architecture:** Bridges the gap between traditional vector-based RAG and graph-based RAG by managing both Knowledge Graphs and vector embeddings.
- **Multi-hop Subgraphs:** Extracts global information from constructed graph structures, drastically enhancing the model's ability to handle complex queries that span multiple document chunks.

### RAG-Anything
[RAG-Anything](https://github.com/HKUDS/RAG-Anything) acts as an all-in-one RAG framework, highly extensible for various data sources, designed by the HKUDS lab.

## Self-Reflection (CRITIC / Self-RAG)
TODO: Add details.

## Query Routing
TODO: Add details.
