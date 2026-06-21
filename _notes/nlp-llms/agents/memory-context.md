---
title: "Memory & Context Management"
description: "Managing short/long-term memory and context windows in agents, including Mem0 and MemU frameworks"
subject: nlp-llms
math: false
tags: [agents, context, llm, llm-agents, mem0, memory, memu, nlp]
status: wip
sitemap: false
order: 4
---

## Overview

Effective agents require both short-term conversational context and long-term memory retrieval to maintain personalized, coherent states across long-running interactions.

## Context Management
- Window management
- Context compression

## Memory Architectures
- **Episodic vs Semantic memory:** Tracking chronological events vs. extracting core facts.
- **Vector store integration:** Using embeddings to search through past memory snippets.

## Production Agent Memory Systems

### Claude-Mem
[Claude-Mem](https://github.com/thedotmack/claude-mem) is a persistent memory compression system initially designed for Claude Code, but extensible to other agents.
- **Context Preservation:** It seamlessly preserves context across sessions by automatically capturing tool usage observations (everything the agent did), compressing them with AI, and injecting relevant summaries into future sessions.
- **Workflow:** It turns disposable terminal agents into growing partners by maintaining continuity of knowledge about a project even after the terminal session is closed.

### Mem0
[Mem0](https://github.com/mem0ai/mem0) acts as a universal, self-improving memory layer for AI applications.
- **Core Mechanism:** It provides a persistent, project-aware memory that automatically extracts, stores, and retrieves user preferences, patterns, and conversational context. 
- **Efficiency:** Uses a single-pass "ADD-only" extraction method to reduce redundant context. Memories accumulate without costly UPDATE/DELETE loops.
- **Token Optimization:** Significantly lowers token costs and latency compared to dumping full interaction histories into context windows.

### MemU
[MemU](https://github.com/NevaMind-AI/memU) is an agentic memory framework heavily focused on multimodal inputs and autonomous, long-running agents (24/7 companions).
- **Hierarchical File System:** Instead of strictly relying on vector embeddings (RAG), MemU organizes memory into a hierarchical file system (Categories → Items → Resources). 
- **Dual Retrieval:** It supports both embedding-based RAG (for fast semantic lookups) and non-embedding LLM reading (where the model reads natural language memory files directly for complex, deep tracking).
- **Proactive Agents:** Designed to continuously predict user intentions and allow autonomous actions even when the user isn't directly interacting.

TODO: Add implementation examples for integrating Mem0/MemU with LangGraph or generic LLM pipelines.
