---
title: "Agent Memory"
description: "Types of agent memory (Procedural, Semantic, Episodic) and strategies for updating them"
subject: nlp-llms
math: false
tags: [agents, coala, langchain, llm, llm-agents, memory, nlp]
status: wip
sitemap: false
order: 3
---

## Overview

At a high level, memory is a system that allows an agent to remember something about previous interactions. Because LLMs do not inherently remember things (they are stateless functions), memory must be intentionally engineered into the agent's architecture. 

As noted in [LangChain's Blog on Memory for Agents](https://www.langchain.com/blog/memory-for-agents), memory is highly application-specific. A coding agent might need to remember a user's preferred Python libraries, while a research agent might need to remember specific industry verticals.

## Types of Agent Memory

The [CoALA (Cognitive Architectures for Language Agents) paper](https://arxiv.org/abs/2309.02427) provides an excellent framework for mapping human memory types to agent architectures.

### 1. Procedural Memory
Long-term memory for *how* to perform tasks, acting as the brain's core instruction set.
- **In Humans:** Remembering how to ride a bike.
- **In Agents:** The combination of the LLM's weights and the agent's hardcoded logic/code. It fundamentally determines how the agent works.
- **Implementation:** Rarely updated dynamically (agents don't usually rewrite their own code or update their own weights on the fly), though an agent updating its own system prompt based on meta-feedback is a primitive form of this.

### 2. Semantic Memory
A long-term store of knowledge, facts, and concepts.
- **In Humans:** Facts learned in school, understanding what concepts mean.
- **In Agents:** A repository of facts about the world or the user. This is primarily used for **personalization**.
- **Implementation:** An LLM extracts key facts from a conversation ("The user prefers functional programming") and stores them in a database or vector store. In future conversations, these facts are retrieved and injected into the system prompt to influence the agent's responses.

### 3. Episodic Memory
Recalling specific past events or sequences.
- **In Humans:** Recalling what you ate for dinner last Tuesday.
- **In Agents:** Storing sequences of the agent's past actions and interactions. This is used to ensure the agent performs tasks correctly based on past successes.
- **Implementation:** Often implemented via **Dynamic Few-Shot Prompting**. The system retrieves successful past interactions (where the user provided positive feedback or the task succeeded) and includes them in the prompt as examples of *how* to solve the current problem.

## Updating Memory

How and when an agent writes to its memory store is a critical architectural decision.

### 1. "In the Hot Path" (Synchronous)
The agent explicitly decides to remember a fact *during* the reasoning loop, usually by calling a `save_memory()` tool before generating the final response to the user. 
- **Pros:** The memory is updated immediately. The agent knows exactly what it just stored. (This is how ChatGPT's memory works).
- **Cons:** Introduces latency. The user has to wait for the tool call to complete before getting their answer.

### 2. "In the Background" (Asynchronous)
A background process or a separate LLM call runs after the conversation turn is complete to summarize and extract memories.
- **Pros:** Zero added latency for the user. Separates memory logic from the core agent reasoning logic.
- **Cons:** The memory isn't updated instantly, meaning an immediate follow-up query might not have access to the newly extracted fact. Requires infrastructure to manage asynchronous background jobs.

### 3. Feedback-Driven
Particularly relevant for Episodic memory. If a user marks an agent's response as helpful (e.g., a thumbs-up), that specific trajectory is saved to the episodic memory store to be used as a few-shot example for future, similar queries.
