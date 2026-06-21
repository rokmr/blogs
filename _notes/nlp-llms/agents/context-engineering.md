---
title: "Context Engineering & Filesystems"
description: "How deep agents use filesystems as scratchpads for dynamic context engineering"
subject: nlp-llms
math: false
tags: [nlp, llm, agents, context-engineering, memory, filesystem, scratchpad]
status: wip
sitemap: false
---

## Deep Agents (LangChain)
"Deep Agents" also refers specifically to the open-source [DeepAgents](https://github.com/langchain-ai/deepagents) repository by LangChain. 
- **Architecture:** It acts as an opinionated "Agent Harness" built on top of LangGraph. Instead of manually wiring up prompts and tools, you get a pre-configured agent capable of handling long-running, multi-step workflows.
- **Key Capabilities:** It comes pre-bundled with Planning tools (`write_todos`), full Filesystem access (`ls`, `grep`, `edit_file`), and Sub-Agent delegation out of the box.
Agents frequently fail not because the underlying LLM is bad, but because they retrieve either **too much** or **too little** context.
- **Context Bloat:** A web search tool might return 10k tokens. Putting all 10k tokens directly into the conversation history inflates API costs, degrades reasoning, and risks hitting token limits.
- **Niche Information:** Relying purely on semantic vector search often fails to find highly specific, non-semantic facts (like exact code snippets or precise API arguments).

## Filesystems as Agent Context
Modern "Deep Agents" (e.g., Manus, Claude Code) bypass the conversation history bottleneck by treating a **Filesystem** as a dynamic context scratchpad.

### 1. Offloading Tool Results
Instead of injecting a massive 10k token web search directly into the chat history, the agent *writes the tool result to a file on disk*. The agent can then use `grep` or standard file reading tools to selectively pull out only the exact 100-200 tokens it actually needs to answer the user's prompt. 

### 2. Replacing Semantic Search with Glob/Grep
For complex repositories, filesystems allow agents to use deterministic terminal commands (`ls`, `glob`, `grep`) to hunt down exact file paths or variable names rather than hoping a Vector Database clusters the code correctly.

### 3. Self-Improving System Prompts
If a user corrects an agent ("always use PyTest for this project"), the agent can write that preference into a `instructions.txt` file within its own filesystem. Future agent runs read that file upon initialization, effectively allowing the agent to dynamically update its own instructions without developers hard-coding new system prompts.
