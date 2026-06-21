---
title: "Aider"
description: "AI pair programming in your terminal"
subject: setup
math: false
tags: [setup, ai-coding, aider, terminal, copilot]
status: wip
sitemap: false
---

## Overview

[Aider](https://github.com/paul-gauthier/aider) is a CLI-based AI pair programmer. It allows you to chat with models like Claude 3.5 Sonnet or GPT-4o directly in your terminal, and the agent will edit files in your codebase automatically.

## Key Features
- **Git Integration:** Aider automatically commits the changes it makes with descriptive commit messages.
- **Repository Map:** It creates a "map" of your entire codebase to send to the LLM, giving it global context without overflowing the token limit.
- **Multi-File Editing:** Excels at making complex refactors across dozens of files at once.

TODO: Add commands for launching Aider with local models and configuring `.aider.conf.yml`.
