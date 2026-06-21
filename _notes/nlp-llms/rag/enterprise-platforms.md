---
title: "Enterprise RAG Platforms"
description: "End-to-end open-source RAG platforms: MaxKB, Dify, and FastGPT"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, platforms, maxkb, dify, fastgpt, workflow]
status: wip
sitemap: false
---

## Overview

Building a RAG pipeline from scratch involves wiring together document parsers, chunking strategies, vector databases, embedding models, and generative LLMs. **Enterprise RAG Platforms** provide out-of-the-box GUI-driven frameworks that bundle all of this together.

## MaxKB (Max Knowledge Brain)
[MaxKB](https://github.com/1Panel-dev/MaxKB) is an open-source platform designed for building enterprise-grade agents and corporate internal knowledge bases.
- **Out-of-the-box RAG:** It automates the messy parts of RAG. Users can directly upload documents or set up automatic web crawling. MaxKB automatically handles the text splitting, vectorization, and indexing.
- **Workflow & Tools:** It integrates robust workflows and advanced MCP (Model Context Protocol) tool-use capabilities, allowing the deployed agent to actually interact with internal APIs alongside answering questions.
- **Deployment:** Provides quick embed codes to drop the finished RAG chatbot directly into business web portals or customer service platforms.

## Other Notable Platforms

### Dify
An open-source LLM application development platform. It acts as an orchestrator, allowing developers to visually build RAG pipelines, agents, and custom workflows via a drag-and-drop interface, with heavy focus on prompt management and multi-model support.

### FastGPT
A knowledge-based QA system built around LLMs. It focuses heavily on precise data processing and provides visual workflow orchestration, specifically tailored for enterprise customer service scenarios.

TODO: Add architectural comparisons of chunking strategies between MaxKB and RagFlow.
