---
title: "Document Parsing & Extraction"
description: "Libraries for parsing documents and extracting structured data (Docling, LangExtract) for RAG pipelines"
subject: nlp-llms
math: false
tags: [data-extraction, docling, document-parsing, langextract, llm, nlp, rag]
status: wip
sitemap: false
order: 2
---

## Overview

High-quality RAG relies heavily on good data ingestion. Extracting clean text, tables, and images from dense formats (like PDFs) requires specialized tooling, and converting unstructured text into highly structured schemas requires precise LLM extraction.

## Document Parsers & Vision OCR Models

### Chandra
[Chandra](https://github.com/datalab-to/chandra) by Datalab is an open-source, highly accurate Vision OCR model specifically fine-tuned to handle complex document parsing. 
- **Capabilities:** It excels at converting raw images and PDFs into structured HTML, Markdown, or JSON while explicitly preserving complex layout information, reading tables, forms, and even handwriting perfectly.

### OlmOCR-2
[OlmOCR-2](https://github.com/allenai/olmocr) by Allen AI is an open-source Vision Language Model (VLM) fine-tuned on top of Qwen2.5-VL-7B.
- **Capabilities:** Designed for high-throughput conversion of academic papers, PDFs, and digitized print documents into plain text while strictly preserving the natural reading order (which classic OCR constantly breaks). It fully supports mathematical equations, tables, and handwriting extraction.

### Dolphin
[Dolphin](https://github.com/bytedance/Dolphin) is a highly efficient, multimodal document image parsing model by ByteDance.
- **Architecture:** It utilizes "Heterogeneous Anchor Prompting" within a two-stage execution architecture. Stage 1 classifies the document type and analyzes the layout (generating element bounding boxes in natural reading order). Stage 2 processes the content.
- **Efficiency:** Despite having a tiny parameter footprint (~322M parameters), it processes digital-born and photographed documents (formulas, tables, dense paragraphs) directly into Markdown/JSON with speeds and accuracy rivaling massive VLMs, running easily on a 16GB consumer GPU.

### Docling
Docling is an advanced tool that parses various document formats (PDFs, Word, PPT) into clean markdown or structured JSON. It handles complex layouts, tables, and OCR.

TODO: Add Docling usage examples and comparison with other parsers (e.g., Unstructured, LlamaParse).

## Structured Extraction

### LangExtract
[LangExtract](https://github.com/google/langextract) is a Python library by Google that uses LLMs (like Gemini or GPT) to extract structured, trustworthy information from unstructured text documents (like clinical notes or raw reports).
- **Precise Source Grounding:** Not only does it extract data based on user-defined schemas/instructions, but it provides precise source mapping (locating exactly where in the original text the data came from).
- **Few-Shot Prompting:** Uses provided examples to fine-tune the extraction based on the chosen LLM backend.

TODO: Add LangExtract schema examples.
