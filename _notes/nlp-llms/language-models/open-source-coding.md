---
title: "Open-Source Models: Coding & Action"
description: "Salesforce xLAM/xGen/CodeGen, DeepSeek-Coder, and Qwen-2.5-Coder"
subject: nlp-llms
math: false
tags: [nlp, llm, language-models, open-source, coding, agents, xlam, qwen, deepseek]
status: wip
sitemap: false
---

## Action Models (Agents)

### xLAM (Salesforce)
[xLAM (Large Action Models)](https://github.com/SalesforceAIResearch/xLAM) is a family of open-source models designed specifically to empower AI Agent systems. 
- **Focus:** While standard LLMs focus on chit-chat or generic reasoning, xLAM is fine-tuned explicitly for **Function Calling (FC)** and taking executable actions across a broad range of agentic benchmarks. 

## Code Generation Models

### DeepSeek-Coder (v2)
DeepSeek-Coder is an open-source Mixture-of-Experts (MoE) code language model. 
- **Architecture Insight:** By utilizing MoE, it achieves massive parameter counts (and thus deep reasoning and extensive syntax knowledge) while maintaining highly efficient active parameters during inference. It is consistently ranked as one of the best open-source models for complex coding tasks.

### Qwen-2.5-Coder
Part of the massive Qwen 2.5 release by Alibaba.
- **Focus:** It achieves state-of-the-art performance across dozens of programming languages. It natively supports incredibly long context windows, allowing developers to dump entire repositories into the prompt for deep refactoring.

### CodeGen & XGen (Salesforce)
- **CodeGen:** An early family of autoregressive language models for program synthesis. It was one of the first major open-source alternatives to OpenAI's Codex.
- **XGen:** A family of models designed specifically to handle long input sequences (up to 8,000 tokens in early iterations), pushing the limits of dense attention on extensive context lengths.
