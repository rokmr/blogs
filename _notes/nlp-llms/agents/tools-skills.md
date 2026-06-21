---
title: "Tools, Skills, & Connectors"
description: "Function calling, skill libraries, plugins, and data connectors for AI Agents"
subject: nlp-llms
math: false
tags: [agents, connectors, function-calling, llm, llm-agents, nlp, plugins, skills, tools]
status: wip
sitemap: false
order: 2
---

## Overview

A Large Language Model is isolated in a text-in/text-out loop. It becomes an **Agent** when you grant it the ability to interact with the outside world. This is achieved through a hierarchy of integrations: Tools, Skills, Plugins, and Connectors.

## Function Calling (The Foundation)
Function Calling is the underlying mechanic. Base models are fine-tuned to recognize when a user's prompt requires external data. Instead of generating a conversational response, the model outputs a structured JSON or XML string that perfectly matches the signature of a predefined programmatic function. 
- *Example:* `{"name": "get_weather", "arguments": {"location": "London"}}`

## Hierarchy of Interaction

### 1. Tools (Atomic)
Tools are the atomic unit of agent action. They are single, deterministic, programmatic functions (e.g., `calculate_math()`, `search_web()`, `read_file()`). The agent decides *when* to use a tool and *what* arguments to pass.

### 2. Skills (Composite)
Skills are composite workflows made up of multiple atomic tools combined with a specific system prompt or behavioral guideline. 
- *Example:* A "Financial Analyst Skill" might be a wrapper around three tools (`fetch_stock_price()`, `read_sec_filing()`, `calculate_pe_ratio()`) alongside a strict prompt instructing the agent on exactly *how* to write a financial report using those tools.

### 3. Plugins
Plugins are third-party, standardized wrappers (popularized by OpenAI) that allow agents to interact with external APIs over the web. They define the API's capabilities using an OpenAPI specification (Swagger), allowing the LLM to understand what endpoints are available without the developer writing custom Python wrappers.

### 4. Connectors
While tools *take action*, Connectors *ingest data*. Data Connectors (like those found in LlamaIndex or Airbyte) are responsible for maintaining a live pipeline between an agent's Vector Database/Filesystem and an external data source (e.g., syncing a Notion workspace, a Jira board, or a Google Drive into the agent's memory).

TODO: Add LangChain `@tool` decorator syntax examples.

**Additional Resources:**
- [Agent Skills with Anthropic (DeepLearning.AI)](https://www.deeplearning.ai/courses/agent-skills-with-anthropic)
