---
title: "GraphRAG"
description: "Combining Knowledge Graphs with RAG for multi-hop reasoning and global context retrieval"
subject: nlp-llms
math: false
tags: [graph-rag, graphs-trees, knowledge-graphs, lightrag, llm, nlp, rag]
status: wip
sitemap: false
order: 9
---

## Overview

While traditional Vector RAG excels at finding specific chunks of text (needle in a haystack), it struggles with queries requiring holistic understanding or connecting dots across multiple documents ("What is the main theme of this entire dataset?").

**GraphRAG** solves this by extracting entities and relationships from the text to build a Knowledge Graph (KG).

## Core Mechanisms
- **Entity Extraction:** LLMs process documents to identify entities (people, places, concepts) and their relationships.
- **Graph Clustering:** Nodes are clustered into communities, and LLMs generate summaries for these communities. This provides *global* context.
- **Query Time:** When a user asks a complex question, the system traverses the graph (multi-hop reasoning) to synthesize an answer derived from multiple dispersed documents.

## Frameworks
- **Microsoft GraphRAG:** The pioneer of this methodology, though known to be extremely token-heavy and slow during the indexing phase.
- **LightRAG:** A faster, more efficient alternative that combines both vector embeddings and graph structures simultaneously.

TODO: Add diagrams for node extraction and community clustering.
