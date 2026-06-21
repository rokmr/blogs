---
title: "MCP (Model Context Protocol)"
description: "Anthropic's Model Context Protocol for standardizing agent tool-use and data access"
subject: nlp-llms
math: false
tags: [nlp, llm, agents, mcp, anthropic, protocol]
status: wip
sitemap: false
---

## Overview

Historically, providing an AI Agent with access to external data or tools required writing custom API integrations for every single datasource. If you wanted your agent to read Slack, query a Postgres database, and search GitHub, you had to write custom Python wrappers for all three.

The **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)**, introduced by Anthropic, acts as a universal, open standard that connects AI models to data sources and tools without custom integration code.

## How It Works

MCP uses a Client-Server architecture:
1. **MCP Host/Client:** The application where the LLM lives (e.g., Claude Desktop, Cursor, or an open-source agent like `nanobot` or `cline`).
2. **MCP Server:** A lightweight, standardized server attached to a specific data source (e.g., a SQLite database, a local filesystem, or the Slack API).

The Client asks the Server: *"What tools and resources do you have?"* The Server exposes them natively. The LLM can then request the Client to execute those tools on the Server.

## Key Primitives
- **Resources:** Data that the LLM can *read* (e.g., a file, an API response, a database schema). They are exposed like URIs.
- **Prompts:** Pre-defined templates the server exposes to help the LLM interact with its specific domain.
- **Tools:** Executable functions the LLM can call to *take action* (e.g., running a SQL query, sending a Slack message).

## Why It Matters
MCP does for AI Agents what USB-C did for electronics. By standardizing the connection, a developer can build an MCP Server for their internal corporate database once, and *any* MCP-compatible AI agent (Claude, Cursor, custom LangGraph agents) can instantly connect to it and use it.

TODO: Add an example of configuring an MCP server in Claude Desktop's `claude_desktop_config.json`.
