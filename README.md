# AI Research Blog

Technical blog for AI/ML deep dives hosted at [rokmr.github.io/blogs](https://rokmr.github.io/blogs).

## Writing Posts

Create new posts in `_posts/` with naming: `YYYY-MM-DD-title-slug.md`

```yaml
---
title: "Your Post Title"
date: 2024-12-17
tags: [tag1, tag2]
math: true      # Enable KaTeX
comments: true  # Enable Giscus
---

Your content with $\LaTeX$ and ```python code blocks```
```

## Local Development

```bash
# Install dependencies
bundle install

# Run dev server
bundle exec jekyll serve --baseurl ""

# Visit http://localhost:4000
```

## Features

- **KaTeX**: Fast math rendering (`$inline$` and `$$block$$`)
- **Prism.js**: Syntax highlighting for Python, Bash, YAML, JSON
- **Giscus**: GitHub Discussions-based comments
- **Plotly**: Lazy-loaded interactive charts
- **BibTeX**: One-click citation export

## Setup Giscus Comments

1. Enable Discussions in this repo's Settings
2. Install [Giscus app](https://github.com/apps/giscus)
3. Get config at [giscus.app](https://giscus.app)
4. Update `_includes/giscus.html` with your repo ID