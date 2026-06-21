---
title: "Vision & Late Interaction RAG"
description: "ColBERT, ColPali, and Vision-based RAG (VisRAG) for multi-modal document retrieval"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, vision, colpali, colbert, visrag, multi-modal]
status: wip
sitemap: false
---

## Late Interaction Models (ColBERT)

Traditional embeddings (Bi-Encoders) squash an entire document into a single vector. While fast, this loses fine-grained token-level detail. 
**ColBERT** introduces **Late Interaction**:
- **Mechanism:** Both the query and the document are encoded into *multiple* vectors (at the token level). Instead of computing a single dot product, ColBERT computes the maximum similarity (MaxSim) between every query token and every document token, summing them up.
- **Benefit:** Highly accurate and excellent for complex queries while remaining much faster than heavy Cross-Encoders.

## ColPali
[ColPali](https://github.com/illuin-tech/colpali) applies the ColBERT late-interaction mechanism to **Vision Language Models (VLMs)** (specifically PaliGemma).
- **Visual Document Retrieval:** Instead of relying on OCR to parse text out of PDFs/images, ColPali takes raw images of document pages and produces high-quality multi-vector embeddings of the visual patches.
- **Why it matters:** It entirely removes the brittle OCR/parsing step, drastically outperforming modern text-based pipelines by natively understanding layouts, charts, and text visually.

## VisRAG (Vision-based RAG)
[VisRAG](https://github.com/OpenBMB/VisRAG) introduces a parsing-free RAG system supported entirely by VLMs. 
- **The Problem:** Traditional RAG converts PDFs to text, completely losing visual information like complex layouts, figures, and charts.
- **The Solution:** The **VisRAG-Retriever** fetches whole visual documents based on multimodal evidence, and passes them directly to a generative VLM to answer the query, ensuring zero information loss from bad text parsing.

TODO: Add diagrams of the MaxSim computation in late interaction.
