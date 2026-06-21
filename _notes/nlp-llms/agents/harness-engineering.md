---
title: "Harness Engineering & Observability"
description: "Evaluation harnesses, testing, and observability frameworks for agents (ART, Opik, AutoEvals)"
subject: nlp-llms
math: false
tags: [agents, art, autoevals, evaluation, grpo, harness, llm, llm-agents, nlp, opik]
status: wip
sitemap: false
order: 8
---

## Overview

Harness engineering involves building safe, deterministic environments to evaluate, run, benchmark, and observe agentic workflows. Because agents can take hundreds of non-deterministic steps, standard unit testing is insufficient. 

## Agent Reinforcement Training

### ART (Agent Reinforcement Trainer)
[ART](https://github.com/OpenPipe/ART) by OpenPipe is an open-source training framework that provides "on-the-job training" for agentic LLMs. 
- **Mechanism:** Instead of manually crafting prompts, ART uses **GRPO (Group Relative Policy Optimization)** to give agents end-to-end reinforcement learning based on their success or failure in multi-step workflows. 
- **Integration:** It wraps around existing agents (like LangGraph) to dramatically improve their tool-use reliability through experience.

## Evaluation & Observability

### Opik
[Opik](https://github.com/comet-ml/opik) (built by Comet) is an open-source platform designed for AI Observability in the agentic era.
- **Tracing:** Logs every step an agent takes, tracking context retrieval, tool calls, and LLM-as-a-judge feedback scores.
- **Agent Optimizer:** Features an automated optimization system where candidate prompts are evaluated against datasets to continuously improve the agent over time.

### AutoEvals (Braintrust)
[AutoEvals](https://github.com/braintrustdata/autoevals) is a library to quickly and easily evaluate AI model outputs. It comes packed with best-practice evaluators (Factuality, Battle, JSON structural integrity) to score an agent's output programmatically.

*(Note: [Promptfoo](https://github.com/promptfoo/promptfoo) also heavily operates in this space, acting as a matrix testing framework. See the `meta-prompting` note for details).*
