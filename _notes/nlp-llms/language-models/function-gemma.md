---
title: "Function Gemma"
description: "Google's open-weights LLM specifically tuned for function calling and on-device agents"
subject: nlp-llms
math: false
tags: [function-calling, gemma, language-models, llm, nlp, on-device]
status: wip
sitemap: false
order: 7
---

## Overview

[FunctionGemma](https://github.com/google/gemma) is a specialized open-weights model by Google DeepMind. It is specifically built on top of the Gemma 3 architecture (e.g., the 270M parameter size) but tuned explicitly for **function calling**.

## Key Features
- **On-Device Agents:** Because of its tiny parameter size (270M), it is designed to run completely locally, on-device (e.g., phones or edge devices), serving as a fast, private agent.
- **Natural Language to API:** It acts as a highly optimized base model for further training into custom agents that translate natural language commands directly into executable API actions.
- **Text-Only Focus:** While the base Gemma 3 model introduces multimodal vision abilities, FunctionGemma is stripped down to focus purely on executing text-based function calling with an altered chat format.

TODO: Add prompt structure format for FunctionGemma.
