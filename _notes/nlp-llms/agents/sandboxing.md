---
title: "Agent Sandboxing"
description: "Techniques and tools for safely executing agent-generated code"
subject: nlp-llms
math: false
tags: [nlp, agents, sandboxing, security, docker, daytona, e2b]
status: wip
sitemap: false
---

## Overview

When LLM agents are given the ability to write and execute code, they pose a significant security and stability risk. A hallucinated command, a malicious prompt injection, or a simple logic error could delete files, leak secrets, or crash the host system. **Sandboxing** provides an isolated environment where agent-generated code can run safely, interacting with the real world only through strictly controlled interfaces.

## Sandboxing Techniques

### 1. Containerization (Docker)
The most common approach to sandboxing is running agent processes inside lightweight Linux containers.
- **Mechanism:** Using Docker or podman to spin up an ephemeral container with restricted network access, limited CPU/RAM, and no access to the host file system.
- **Pros:** Highly customizable, familiar ecosystem, easy to reset state.
- **Cons:** Container breakout vulnerabilities exist. Cold starts can be slow for highly interactive agents.

### 2. MicroVMs (Firecracker)
For higher security, micro-virtual machines provide hardware-level isolation.
- **Mechanism:** Tools like AWS Firecracker spin up tiny virtual machines in fractions of a second.
- **Pros:** Stronger isolation boundary than containers. Much faster boot times than traditional VMs.
- **Cons:** More complex to orchestrate. Requires KVM (Kernel-based Virtual Machine) support on the host.

### 3. WebAssembly (Wasm)
WebAssembly offers a completely different paradigm by compiling code into a highly restricted, platform-independent binary format.
- **Mechanism:** Running code through a Wasm runtime (like Wasmtime) limits execution to a strictly defined memory space with no default access to I/O (files, network) unless explicitly granted via WASI (WebAssembly System Interface).
- **Pros:** Near-instant startup, incredibly lightweight, exceptional security boundary.
- **Cons:** Language support is still evolving; not all Python/Node.js libraries compile easily to Wasm.

## Sandboxing Tools for Agents

### Daytona
[Daytona](https://github.com/daytonaio/daytona) is an open-source development environment manager that is increasingly used to sandbox AI agents. 
- It allows you to spin up standardized, isolated development environments (Workspaces) defined by a configuration file. 
- For agents, Daytona provides a secure, predictable environment where the agent has access to specific tools, dependencies, and network configurations without risking the host machine.

### E2B (English2Bits)
[E2B](https://e2b.dev/) is explicitly designed as a "cloud sandbox for AI agents". 
- It provides an SDK that allows agents to spin up secure microVMs in the cloud, execute Python/Node code, use browsers, and access terminals.
- It is optimized for long-running agentic tasks and handles the complex orchestration of keeping sandboxes alive, capturing logs, and managing state across agent steps.

### CodeSandbox / StackBlitz (WebContainers)
For web-focused or browser-based agents, these platforms utilize WebContainers to run full Node.js environments directly inside the browser's sandbox. 
- This means the agent's code runs completely client-side, offloading compute and security concerns away from your servers.
