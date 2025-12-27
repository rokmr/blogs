---
title: "Documentation"
layout: default
permalink: /docs/
---

<article class="post">
  <header class="post-header">
    <h1 class="post-title">Blog Documentation</h1>
    <p class="post-meta">Complete reference for all features</p>
  </header>

  <div class="post-content">

## Table of Contents

- [Citations](#citations)
- [Cross-References](#cross-references)
- [Inline Formatting](#inline-formatting)
- [Callouts](#callouts)
- [LaTeX Math](#latex-math)
- [Code Blocks](#code-blocks)
- [Embeds](#embeds)
- [Notes Collection](#notes-collection)

---

## Citations

Academic-style citations with auto-generated References section.

### Global Bibliography

Define frequently-used citations in `_data/bibliography.yml`:

```yaml
vaswani2017attention:
  type: article
  authors: "Vaswani, A., et al."
  title: "Attention Is All You Need"
  venue: "NeurIPS 2017"
  year: 2017
  url: "https://arxiv.org/abs/1706.03762"
  doi: "10.48550/arXiv.1706.03762"
```

### Per-Post Citations

Add to post frontmatter:

```yaml
---
citations:
  mykey2024:
    authors: "Author Name"
    title: "Paper Title"
    venue: "Conference"
    year: 2024
    url: "https://..."
---
```

### Usage

```markdown
Single citation: [@vaswani2017attention]
Multiple: [@devlin2019bert; @brown2020gpt3]
```

---

## Cross-References

Reference figures, tables, equations, and sections.

### Labels

| Type | Syntax | Example |
|------|--------|---------|
| Figure | `{#fig:name}` | `![Caption](img.png){#fig:arch}` |
| Table | `{#tbl:name}` | `| Header |{#tbl:results}` |
| Equation | `\label{eq:name}` | `$$x^2 \label{eq:quad}$$` |
| Code | `{#code:name}` | `{#code:impl}` |
| Section | `{#sec:name}` | `## Title {#sec:methods}` |

### References

| Type | Syntax | Renders As |
|------|--------|------------|
| Figure | `{@fig:arch}` | "Figure 1" |
| Table | `{@tbl:results}` | "Table 1" |
| Equation | `\eqref{eq:quad}` | "(1)" |

---

## Inline Formatting

| Syntax | Result | Description |
|--------|--------|-------------|
| `==text==` | <mark>text</mark> | Highlight |
| `[[Ctrl+C]]` | <kbd>Ctrl</kbd>+<kbd>C</kbd> | Keyboard |
| `::GPU\|Graphics Processing Unit::` | <abbr>GPU</abbr> | Abbreviation |
| `///Small Caps///` | <span class="small-caps">Small Caps</span> | Small caps |

---

## Callouts

### Syntax

```markdown
> [!TYPE]
> Content goes here...
```

### Available Types

| Type | Use For |
|------|---------|
| `NOTE` | General information |
| `TIP` | Helpful suggestions |
| `WARNING` | Cautions |
| `DANGER` | Critical warnings |
| `QUESTION` | Questions/FAQs |
| `THEOREM` | Mathematical theorems |
| `DEFINITION` | Formal definitions |
| `PROOF` | Mathematical proofs |
| `EXAMPLE` | Worked examples |
| `ABSTRACT` | Summaries |
| `CRITICAL` | Important points |
| `SUCCESS` | Positive outcomes |

---

## LaTeX Math

Powered by KaTeX for fast rendering.

### Inline

```markdown
The equation $E = mc^2$ shows...
```

### Display

```markdown
$$
\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Numbered Equations

```markdown
$$
\nabla \cdot E = \frac{\rho}{\epsilon_0} \label{eq:gauss}
$$

Gauss's law \eqref{eq:gauss} states...
```

---

## Code Blocks

### Static

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### Interactive (Runnable)

```html
<div class="runnable" data-lang="python" markdown="1">

```python
# This code runs in browser via Pyodide
print("Hello from Python!")
```

</div>
```

### Collapsible

```html
<div class="collapsible" data-label="Show Code" markdown="1">

```python
# Hidden by default
def secret_function():
    pass
```

</div>
```

---

## Embeds

### HuggingFace Spaces

```html
<div class="hf-space" data-src="owner/space-name" data-height="500"></div>
```

### Videos

```html
<div class="video-embed" 
     data-src="https://youtube.com/watch?v=VIDEO_ID" 
     data-caption="Video title">
</div>
```

Supports: YouTube, Vimeo, local MP4 files.

### Image Comparison

```html
<div class="image-compare" 
     data-before="/path/to/before.png" 
     data-after="/path/to/after.png">
</div>
```

---

## Notes Collection

Subject-organized notes with all post features.

### Creating Notes

1. Create file in `_notes/` folder
2. Add frontmatter:

```yaml
---
title: "Note Title"
subject: "Subject Name"
description: "Brief description"
tags: [tag1, tag2]
updated: 2024-12-26
---
```

### Subjects

Notes are automatically grouped by `subject` in the sidebar navigation.

### URLs

Notes are available at `/notes/filename/`

---

## Post Frontmatter

Complete frontmatter options:

```yaml
---
title: "Post Title"
date: 2024-12-26
tags: [tag1, tag2]
math: true           # Enable KaTeX
comments: true       # Enable Giscus comments
citations:           # Per-post citations
  key:
    authors: "..."
    title: "..."
---
```

  </div>
</article>
