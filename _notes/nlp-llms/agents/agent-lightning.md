---
title: "Agent Lightning"
description: "Microsoft's extensible framework for RL-based training of any AI agent"
subject: nlp-llms
math: false
tags: [agent-lightning, agents, framework, llm, llm-agents, nlp, reinforcement-learning]
status: wip
sitemap: false
order: 16
---

## Overview

[Agent Lightning](https://github.com/microsoft/agent-lightning) is a framework developed by Microsoft Research (ICLR 2026) to train AI agents using Reinforcement Learning (RL) with practically zero code changes to the original agent codebase.

## The Core Concept
Traditionally, training an LLM-based agent with RL required tightly coupling the RL training logic directly into the agent's code, or relying on messy sequence concatenation. 

**Agent Lightning completely decouples agent execution from RL training.**
- **Seamless Optimization:** You can take ANY existing agent framework (like LangGraph, CrewAI, or custom Python agents) and optimize them via RL data-driven techniques (fine-tuning, prompt tuning, model selection).
- **Use Cases:** E.g., Training an AI agent to write and self-correct SQL queries through trial-and-error using Reinforcement Learning environments without rewriting the original SQL-agent script.

TODO: Add diagram showing the decoupling between the RL Engine and the Agent Executor.
