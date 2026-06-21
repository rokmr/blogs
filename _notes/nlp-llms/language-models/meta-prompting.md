---
title: "Meta-Prompting & Frameworks"
description: "Frameworks for algorithmic prompt optimization instead of manual prompt engineering"
subject: nlp-llms
math: false
tags: [nlp, llm, prompt-engineering, meta-prompting, dspy, promptfoo]
status: wip
sitemap: false
---

## Overview

Manual "prompt engineering" (tweaking words to get a better LLM output) is brittle and unscalable. Meta-prompting frameworks treat prompts like weights in a neural network—optimizing them algorithmically based on evaluation metrics.

## DSPy
[DSPy (Declarative Self-improving Python)](https://github.com/stanfordnlp/dspy) is a framework developed by Stanford that shifts the paradigm from *prompting* to *programming* language models.
- **Concept:** You define the declarative logic of your pipeline (e.g., retrieve -> read -> answer) and provide a few training examples.
- **Optimization:** DSPy's optimizers (like `BootstrapFewShot`) automatically compile your program by finding the best possible prompt instructions and few-shot examples that maximize your target metric.
- **Result:** You never write raw string prompts. You write signatures (e.g., `question -> answer`), and DSPy finds the best way to prompt the underlying LLM.

## Promptfoo
[Promptfoo](https://github.com/promptfoo/promptfoo) is a framework for testing and evaluating LLM prompts, models, and RAG applications. 
- **Mechanism:** It allows you to systematically test multiple prompt variations across different models side-by-side using a matrix of test cases.
- **Assertions:** You can write deterministic tests (e.g., "output must contain X", "output must be valid JSON") or LLM-as-a-judge tests to score prompt variations.

TODO: Add DSPy code snippet for a basic `dspy.Signature`.
