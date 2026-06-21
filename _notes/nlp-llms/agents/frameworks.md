---
title: "Agentic Frameworks Overview"
description: "High-level overview of multi-agent and code-centric AI frameworks"
subject: nlp-llms
math: false
tags: [agents, autogen, crewai, frameworks, frameworks-tools, langalpha, llm, llm-agents, magentic-one, nlp, pydantic-ai, smolagents, swarm]
status: wip
sitemap: false
order: 1
---

## Multi-Agent Frameworks

### AutoGen
Created by Microsoft, AutoGen allows developers to build LLM applications via multiple conversational agents that can communicate with each other to solve tasks. It heavily relies on the "chat" paradigm between roles (e.g., User Proxy, Coder, Reviewer).

### CrewAI
Built on top of LangChain, CrewAI focuses heavily on role-playing. You define "Agents" with specific roles and backstories, "Tasks", and a "Crew" that executes the tasks sequentially or hierarchically. It is highly intuitive for building business processes.

### Swarm
[Swarm](https://github.com/openai/swarm) is a lightweight, educational multi-agent framework by OpenAI. It focuses on extreme simplicity, demonstrating how agents can "hand off" execution to other agents (routines and handoffs) without the heavy abstractions of LangGraph or CrewAI.

### Magentic-One
A highly advanced, generalist multi-agent system from Microsoft Research. It features a lead "Orchestrator" agent that directs other specialized agents (WebSurfer, FileSurfer, Coder) to solve complex open-ended tasks.

## Code-Centric & Type-Safe Frameworks

### smolagents (Hugging Face)
[smolagents](https://github.com/huggingface/smolagents) is a ridiculously lightweight agent framework. Instead of outputting JSON for function calling, its agents *write and execute Python code* directly to solve tasks. This code-generation approach often results in fewer errors and greater flexibility.

### PydanticAI
A framework built around `pydantic`. It enforces strict type-safety and structured outputs at the core of the agentic workflow, ensuring that the outputs agents pass to each other or back to the user always adhere to a strict schema.

## Specialized Frameworks

### LangAlpha
[LangAlpha](https://github.com/ginlix-ai/LangAlpha) is an agentic framework heavily specialized for financial research and vibe investing. It operates as an AI analyst that treats investing as an iterative, Bayesian process. It uses "Programmatic Tool Calling" (PTC) where the LLM writes Python to execute in cloud sandboxes to pull SEC filings, build models, and write memos across persistent multi-session workspaces.

### LlamaIndex Workflows
While LlamaIndex is famous for RAG, [LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/) is an event-driven, async-first framework. Instead of graph-based nodes, you write `@step` decorated python functions that emit and consume strongly typed events. This makes it highly flexible for chaining together agents, complex extraction flows, and human-in-the-loop patterns.

TODO: Add LangGraph specific details.
