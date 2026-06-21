---
title: "LLM Gateways"
description: "Routing, load balancing, and API management for LLMs"
subject: mlops
math: false
tags: [gateway, infrastructure, mlops, ops, routing]
status: wip
sitemap: false
order: 2
---

## Overview

LLM Gateways (like LiteLLM, Kong, or Portkey) sit between the application and the LLM inference engine.

## Core Capabilities
- **Routing & Fallbacks:** Automatically route traffic from OpenAI to Anthropic on failure.
- **Load Balancing:** Distribute requests across multiple deployments.
- **Semantic Caching:** Cache identical or semantically similar queries to reduce latency/cost.
- **Observability:** Track token usage and costs across models.

TODO: Add details.
