# Slide Viewer Snippets

Quick copy-paste snippets for using the slide viewer.

## Basic Usage

### Single Slide in Frontmatter

```yaml
slides:
  - title: "Lecture Slides"
    url: "/path/to/slides.pdf"
```

### Multiple Slides

```yaml
slides:
  - title: "Main Lecture"
    url: "/path/to/lecture.pdf"
  - title: "Supplement"
    url: "/path/to/supplement.pdf"
```

### Inline HTML

```html
<div class="slide-viewer" data-pdf="/path/to/slides.pdf"></div>
```

### With Custom Title

```html
<div class="slide-viewer" data-pdf="/path/to/slides.pdf" data-title="My Custom Title"></div>
```

## Path Templates

### Local File in Resources

```yaml
url: "/blogs/_notes/subject/topic/resources/slides.pdf"
```

### Asset Directory

```yaml
url: "/blogs/assets/slides/topic/slides.pdf"
```

### External URL

```yaml
url: "https://university.edu/course/slides/lecture01.pdf"
```

## Complete Note Template

```markdown
---
title: "Lecture Title"
date: 2025-01-15
description: "Brief description"
tags: [tag1, tag2]
math: true
slides:
  - title: "Lecture Slides"
    url: "/path/to/slides.pdf"
references:
  - title: "Reference"
    url: "https://..."
---

# Lecture Title

Your content here...

<!-- Slides appear automatically after content -->
```

## Custom Placement

```markdown
## Section 1

Content...

<div class="slide-viewer" data-pdf="/path/to/section1.pdf" data-title="Section 1 Slides"></div>

## Section 2

Content...

<div class="slide-viewer" data-pdf="/path/to/section2.pdf" data-title="Section 2 Slides"></div>
```

## VS Code Snippets

Add to `.vscode/markdown.code-snippets`:

```json
{
  "Slide Viewer Frontmatter": {
    "prefix": "slides-front",
    "body": [
      "slides:",
      "  - title: \"$1\"",
      "    url: \"$2\""
    ],
    "description": "Add slides to frontmatter"
  },
  "Slide Viewer Inline": {
    "prefix": "slides-inline",
    "body": [
      "<div class=\"slide-viewer\" data-pdf=\"$1\" data-title=\"$2\"></div>"
    ],
    "description": "Inline slide viewer"
  }
}
```

## Common Patterns

### Course Lecture Notes

```yaml
---
title: "Lec 01 - Introduction"
course: "CS224R"
slides:
  - title: "Lecture 01"
    url: "/blogs/_notes/rl/CS224R/resources/01_intro.pdf"
references:
  - title: "Lecture Video"
    url: "https://youtube.com/..."
---
```

### Tutorial with Exercises

```yaml
---
title: "Tutorial: Deep Learning Basics"
slides:
  - title: "Theory"
    url: "/path/to/theory.pdf"
  - title: "Exercises"
    url: "/path/to/exercises.pdf"
  - title: "Solutions"
    url: "/path/to/solutions.pdf"
---
```

### Workshop Materials

```markdown
---
title: "Workshop: PyTorch Fundamentals"
---

## Part 1: Introduction

<div class="slide-viewer" data-pdf="/path/to/part1.pdf" data-title="Part 1"></div>

## Part 2: Practice

<div class="slide-viewer" data-pdf="/path/to/part2.pdf" data-title="Part 2"></div>
```
