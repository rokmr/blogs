---
title: "Document Parsing & Extraction"
description: "Libraries for parsing documents and extracting structured data (Docling, LangExtract) for RAG pipelines"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, document-parsing, docling, langextract, data-extraction]
status: wip
sitemap: false
---

## Overview

High-quality RAG relies heavily on good data ingestion. Extracting clean text, tables, and images from dense formats (like PDFs) requires specialized tooling, and converting unstructured text into highly structured schemas requires precise LLM extraction.

## Document Parsers

### Docling
Docling is an advanced tool that parses various document formats (PDFs, Word, PPT) into clean markdown or structured JSON. It handles complex layouts, tables, and OCR.

TODO: Add Docling usage examples and comparison with other parsers (e.g., Unstructured, LlamaParse).

## Structured Extraction

### LangExtract
[LangExtract](https://github.com/google/langextract) is a Python library by Google that uses LLMs (like Gemini or GPT) to extract structured, trustworthy information from unstructured text documents (like clinical notes or raw reports).
- **Precise Source Grounding:** Not only does it extract data based on user-defined schemas/instructions, but it provides precise source mapping (locating exactly where in the original text the data came from).
- **Few-Shot Prompting:** Uses provided examples to fine-tune the extraction based on the chosen LLM backend.

TODO: Add LangExtract schema examples.
