---
title: "Examples"
layout: default
permalink: /examples/
---

<article class="post">
  <header class="post-header">
    <h1 class="post-title">Feature Examples</h1>
    <p class="post-meta">Interactive showcase of all blog features</p>
  </header>

  <div class="post-content">

## Citations

Use `[@key]` to cite papers. Citations are auto-numbered and collected in a References section.

**Syntax:**
```markdown
The transformer architecture [@vaswani2017attention] revolutionized NLP.
Multiple citations: [@devlin2019bert; @brown2020gpt3]
```

**Result:**
The transformer architecture [@vaswani2017attention] revolutionized NLP.

---

## Cross-References

Label and reference figures, tables, and equations.

**Syntax:**
```markdown
<!-- Label a figure -->
![Attention visualization](image.png){#fig:attn}

<!-- Reference it -->
As shown in {@fig:attn}, the attention pattern...

<!-- Label a table -->
| Col A | Col B |{#tbl:results}

See {@tbl:results} for results.

<!-- Equations -->
$$E = mc^2 \label{eq:einstein}$$

Equation \eqref{eq:einstein} shows...
```

---

## Inline Formatting

**Highlights:**
```markdown
This is ==highlighted text== in your content.
```
Result: This is ==highlighted text== for emphasis.

**Keyboard shortcuts:**
```markdown
Press [[Ctrl+C]] to copy.
```
Result: Press [[Ctrl+C]] to copy.

**Abbreviations:**
```markdown
The ::GPU|Graphics Processing Unit:: accelerates training.
```
Result: The ::GPU|Graphics Processing Unit:: accelerates training.

---

## Callout Blocks

> [!NOTE]
> Basic information or context.

> [!TIP]
> Helpful suggestions.

> [!WARNING]
> Important cautions.

> [!THEOREM]
> For any bounded sequence, there exists a convergent subsequence.

> [!DEFINITION]
> A **metric space** is a set equipped with a distance function.

> [!PROOF]
> By contradiction, assume the opposite and derive a contradiction. ∎

> [!EXAMPLE]
> Consider $f(x) = x^2$ on the interval $[0, 1]$.

**Syntax:**
```markdown
> [!TYPE]
> Content here...
```

Available types: `NOTE`, `TIP`, `WARNING`, `DANGER`, `QUESTION`, `THEOREM`, `DEFINITION`, `PROOF`, `EXAMPLE`, `CRITICAL`, `SUCCESS`, `ABSTRACT`

---

## Math (LaTeX)

**Inline:** `$E = mc^2$` → $E = mc^2$

**Display:**
```latex
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

---

## Interactive Code

<div class="runnable" data-lang="python" markdown="1">

```python
# This code runs in your browser!
import numpy as np

x = np.linspace(0, 2*np.pi, 100)
print(f"Sum of sin(x): {np.sum(np.sin(x)):.4f}")
print(f"Max of cos(x): {np.max(np.cos(x)):.4f}")
```

</div>

---

## Collapsible Code

<div class="collapsible" data-label="Show Implementation" markdown="1">

```python
class AttentionHead:
    def __init__(self, d_model, d_k):
        self.W_q = np.random.randn(d_model, d_k)
        self.W_k = np.random.randn(d_model, d_k)
        self.W_v = np.random.randn(d_model, d_k)
    
    def forward(self, x):
        Q = x @ self.W_q
        K = x @ self.W_k
        V = x @ self.W_v
        scores = Q @ K.T / np.sqrt(self.d_k)
        return softmax(scores) @ V
```

</div>

---

## Embeds

**HuggingFace Space:**
```html
<div class="hf-space" data-src="owner/space-name" data-height="500"></div>
```

**Video (YouTube/Vimeo/local):**
```html
<div class="video-embed" data-src="https://youtube.com/watch?v=..." data-caption="Demo"></div>
```

---

## Image Comparison

```html
<div class="image-compare" 
     data-before="/path/to/before.png" 
     data-after="/path/to/after.png">
</div>
```

---

## Notes

Notes are organized by subject at `/notes/`. They support all features above plus:

- Subject-based navigation
- Related notes suggestions
- Backlinks

Create notes in `_notes/` folder:
```yaml
---
title: "Note Title"
subject: "Transformers"
tags: [attention, nlp]
---
```

  </div>
</article>
