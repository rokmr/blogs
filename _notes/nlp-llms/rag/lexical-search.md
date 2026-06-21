---
title: "Lexical Search (TF-IDF & BM25)"
description: "Statistical keyword matching, term frequency, and the BM25 ranking function"
subject: nlp-llms
math: true
tags: [nlp, llm, rag, retrieval, bm25, tf-idf, lexical-search]
status: wip
sitemap: false
---

## Overview

Before dense vector embeddings (Semantic Search), search engines relied entirely on **Lexical Search**—matching the exact keywords of a query to the exact keywords in a document. The two most foundational algorithms for this are **TF-IDF** and **BM25**.

## TF-IDF (Term Frequency - Inverse Document Frequency)
TF-IDF calculates how important a specific word is to a document within a larger corpus.
- **Term Frequency (TF):** How often does the word appear in this specific document? (More appearances = higher score).
- **Inverse Document Frequency (IDF):** How often does this word appear across *all* documents in the database? If a word appears in every document (like "the" or "is"), it is useless for searching. IDF heavily penalizes common words and boosts rare words.

**Equation:**
$$ \text{TF-IDF} = \text{TF}(t, d) \times \log\left(\frac{N}{\text{DF}(t)}\right) $$
*(Where $N$ is total documents, and $\text{DF}$ is the number of documents containing term $t$).*

## BM25 (Best Matching 25)
BM25 is an evolution of TF-IDF and is the default ranking function used by massive search engines like Elasticsearch and Lucene. 
- **The Problem with TF-IDF:** In TF-IDF, if a document repeats a keyword 100 times, its score skyrockets linearly. This leads to keyword stuffing.
- **The BM25 Solution:** BM25 introduces **Term Frequency Saturation**. After a keyword appears a certain number of times, its score flatlines. Adding the word more times does not increase the score.
- **Document Length Normalization:** BM25 also penalizes extremely long documents. If a 10,000-word document contains the word "Python" 5 times, it is ranked lower than a 100-word document containing "Python" 5 times.

### Use Case in Modern RAG
BM25 is still heavily used today in **Hybrid Search** pipelines. While Dense Vectors handle "vibes" and semantic meaning, BM25 handles exact match constraints (e.g., searching for exact error codes, specific user IDs, or exact proper nouns where embeddings often fail).

TODO: Add exact BM25 mathematical formula.
