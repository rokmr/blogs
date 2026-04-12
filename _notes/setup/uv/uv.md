---
title: "UV Package Manager"
date: 2025-01-15
description: "Fast Python package and project manager written in Rust - dependency management, virtual environments, and workspace configuration"
tags: [python, package-manager, uv, rust, tools]
subject: setup
status: wip
sitemap: false
---

> Package manager developed in Rust for Python projects with superior performance.

## Installation

### macOS
```bash
brew install uv
```

### Universal
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
pip install uv
```

### Shell Completion (Zsh)
```bash
autoload -Uz compinit && compinit
eval "$(uv generate-shell-completion zsh)"
```

## Project Initialization

```bash
# Create new project (default is --app)
uv init

# Create application project
uv init --app

# Create library project
uv init --lib

# Create package (for publishing to PyPI)
uv init . --package package_name
```

## Dependency Management

```bash
# Add dependencies
uv add package_name1 package_name2

# Add development dependencies
uv add package_name --dev

# Remove dependencies
uv remove package_name1

# Sync dependencies with lock file
uv sync

# Update lock file
uv lock

# View dependency tree
uv tree
```

## Python Version Management

```bash
# List installed Python versions
uv python list

# Install specific Python version
uv python install 3.12.0

# Install multiple Python versions
uv python install 3.12 3.11 3.13

# Pin default Python version
uv python pin 3.12

# Create virtual environment with specific version
uv venv --python 3.12.0
```

## Tools

```bash
# Run tool without installing
uv tool run ruff
uv tool run ruff check
uvx ruff check  # Shorter alias

# Install tool globally
uv tool install ruff

# Manage installed tools
uv tool update-shell  # Configure shell integration
uv tool dir           # View installation directory
uv tool uninstall ruff
uv tool upgrade ruff  # Note: typo in original docs
```

## Workspace Configuration

Workspaces enable multiple Python packages in a mono repo with a shared virtual environment.

### Setup

```bash
# Create workspace root
uv init

# Add member projects
uv init another_project 
uv init yet_another_project --no-workspace
```

### Update `pyproject.toml`
```toml
[tool.uv.workspace]
members = ["folder_where_packages/*"]
```

### Commands
```bash
# Sync all workspace packages
uv sync --all-packages

# Run project code
uv run folder_where_packages/package_folder/main.py
```

### Local Package Dependencies

For packages not in PyPI, add to `pyproject.toml`:
```toml
[tool.uv.sources]
package_name = {workspace = true}
```

## Publishing Packages

```bash
# Set PyPI token
export UV_PUBLISH_TOKEN=your_pypi_token

# Build package without sources
uv build --no-sources

# Publish to PyPI
uv publish
```

## Quick Start Example

```bash
# Initialize project
uv init my-project
cd my-project

# Add dependencies
uv add openai python-dotenv fastapi
uv add --dev ipykernel

# Setup environment file
echo "API_KEY=your-key" > .env

# Setup git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository
gh repo create my-project --private --source=. --remote=origin --push
```

