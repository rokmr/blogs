---
title: "Lexical Search (TF-IDF & BM25)"
description: "Statistical keyword matching, term frequency, and the BM25 ranking function"
subject: nlp-llms
math: true
tags: [bm25, embeddings-vectors, lexical-search, llm, nlp, rag, retrieval, tf-idf]
status: wip
sitemap: false
order: 4
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

### The BM25 Formula
$$ \text{Score}(Q, d) = \sum_{i=1}^{n} \text{IDF}(q_i) \cdot \frac{f(q_i, d) \cdot (k_1 + 1)}{f(q_i, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\text{avgdl}}\right)} $$
- **$f(q_i, d)$**: Term frequency of the query term $q_i$ in document $d$.
- **$|d|$**: Length of the document in words.
- **$\text{avgdl}$**: Average document length across the entire text corpus.
- **$k_1$ (typically 1.2 to 2.0)**: Controls term frequency saturation. Lower means quicker saturation.
- **$b$ (typically 0.75)**: Controls length normalization. $b=1$ fully penalizes long documents, $b=0$ applies no penalty.

### Use Case in Modern RAG & Agents
BM25 is heavily used today in **Hybrid Search** pipelines. While Dense Vectors handle "vibes" and semantic meaning, BM25 handles exact match constraints (e.g., searching for exact error codes, specific user IDs, or exact proper nouns where embeddings often fail).

A practical example of BM25 in an agentic workflow is [Context Hub](https://github.com/andrewyng/context-hub), an open-source tool that curates versioned API documentation specifically for coding agents. When an agent runs a search command (e.g., `chub search openai`), Context Hub runs a pure BM25 search over a curated documentation corpus. It tokenizes the documents and queries, removes stop words, and applies multi-field scoring (giving higher weight to matches in document IDs and Titles compared to matches in the body text) to rapidly return the exact technical documentation the agent needs without the hallucination risks of dense vector search.
