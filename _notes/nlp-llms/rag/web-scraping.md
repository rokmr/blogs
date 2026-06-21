---
title: "Web Scraping & Crawling"
description: "Tools for scraping, crawling, and extracting web data for AI pipelines (Spider, Playwright, Crawl4AI)"
subject: nlp-llms
math: false
tags: [nlp, llm, rag, scraping, crawling, crawl4ai, scrapy, spider, playwright]
status: wip
sitemap: false
---

## Overview

For dynamic knowledge ingestion, RAG systems and Agents need robust tools to fetch, crawl, and parse web pages efficiently.

## Modern Crawlers

### Spider
[Spider](https://github.com/spider-rs/spider) is an insanely fast, concurrency-first crawling engine written in Rust (ported to Python via `spider-py`). 
- **Features:** It streams pages the moment they arrive, natively supports JavaScript rendering (headless Chrome), and can scale from a single script to a distributed fleet effortlessly.

### Playwright
[Playwright](https://github.com/microsoft/playwright-python) by Microsoft is a powerful browser automation library. 
- **Use Case in AI:** Since modern websites are heavily dynamic (React/Vue) and require JavaScript to load content, simple HTTP requests fail. Playwright spins up a headless browser to render the exact DOM a human would see, making it perfect for Agents that need to "see" and scrape modern web apps.

## Python Legacy / High-Level Crawlers

### Scrapy
A mature, fast, high-level web crawling and web scraping framework for Python. Highly scalable.
TODO: Add details on spiders and pipelines.

### Scrapling
TODO: Add details on Scrapling capabilities and setup.

## AI-Centric Extraction

### Crawl4AI
An AI-centric crawler designed to fetch web data and immediately return it in a clean format (like Markdown) tailored for LLM context windows.

### SearXNG
A privacy-respecting metasearch engine. Highly useful for giving Agents secure, API-driven access to search the web without getting blocked or tracked.

TODO: Add implementation details and examples for integrating these tools into agentic workflows.
