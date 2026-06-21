---
title: "Cline"
description: "Autonomous AI agent for VS Code capable of executing shell commands and making deep file edits"
subject: setup
math: false
tags: [agent, ai-coding, cline, ide, setup, tools]
status: wip
sitemap: false
order: 2
---

## Overview

[Cline](https://github.com/cline/cline) (formerly Claude Dev) acts as an autonomous agent operating directly inside your IDE. While standard copilots just chat or autocomplete, Cline can actively execute bash commands, run tests, and debug errors.

## Key Features
- **Terminal Execution:** It can execute scripts and install packages (always asking for permission first).
- **Model Context Protocol (MCP):** Connects to external MCP servers to gain abilities like reading databases, searching Slack, or browsing the web.
- **Project Context:** Automatically crawls necessary files and manages its own context window.

TODO: Add instructions for setting up MCP tools within Cline.
