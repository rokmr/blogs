---
title: "Vector Search Algorithms"
description: "Approximate Nearest Neighbors (ANN), HNSW, IVF, and PQ for vector databases"
subject: nlp-llms
math: false
tags: [nlp, llm, embeddings, vector-search, hnsw, ann]
status: wip
sitemap: false
---

## Overview

When querying a vector database with millions of embeddings, calculating the exact distance (e.g., Cosine Similarity or L2 norm) between your query and *every single vector* (K-Nearest Neighbors / KNN) is computationally impossible. Instead, systems use **Approximate Nearest Neighbors (ANN)** algorithms to trade a tiny bit of accuracy for massive speed gains.

## Key Algorithms

### HNSW (Hierarchical Navigable Small World)
The industry standard used by Qdrant, Milvus, and Pinecone.
- **Mechanism:** Builds a multi-layered graph. The top layers have few, long-distance links to traverse the dataset quickly. Lower layers have dense, short-distance links to find the exact neighborhood. 
- **Pros/Cons:** Extremely fast and accurate, but uses a lot of RAM to store the graph structures.

### IVF (Inverted File Index)
- **Mechanism:** Clusters the vector space into Voronoi cells (using K-Means). When a query comes in, it only searches the vectors within the nearest cell (or a few nearest cells).
- **Pros/Cons:** Highly memory-efficient, but requires a training phase to establish the clusters. 

### PQ (Product Quantization)
- **Mechanism:** Compresses the vectors themselves by splitting them into sub-vectors and replacing them with short codes.
- **Usage:** Often combined with IVF (IVF-PQ) to achieve massive scale with low memory overhead.

TODO: Add diagrams for HNSW layer traversal.
