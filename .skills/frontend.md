# blogs.rohit.vision — Frontend Design System Skill

> Complete reference skill for building, styling, and extending the blog at [blogs.rohit.vision](https://blogs.rohit.vision). This is a Jekyll-based sub-site inheriting the rohit.vision dark design language, extended with academic/ML-specific components for technical notes, blog posts, and interactive visualizations.

---

## 0. Relationship to Parent Site

| Property | Parent (rohit.vision) | Blog (blogs.rohit.vision) |
|---|---|---|
| **Stack** | Static HTML + vanilla JS | Jekyll + Liquid + Kramdown |
| **Deploy** | GitHub Pages (root) | GitHub Pages (`/blogs` subpath) |
| **Branding** | `rohit.vision` | `rohit.vision` (shared identity, header links to blog home `/`) |
| **CSS** | Single `main.css` | `assets/css/main.css` + `slide-viewer.css` |
| **JS** | Single `script.js` | Modular: 22 focused modules orchestrated by `main.js` |
| **Content** | Hand-coded sections | Markdown → HTML via Jekyll collections (`_posts`, `_notes`) |
| **Math** | None | KaTeX (client-side, `$$` and `$` delimiters) |
| **Diagrams** | Canvas (Lorenz attractor) | Mermaid.js + inline SVGs |
| **Code** | None | Rouge (server) + Prism.js (client) + Pyodide (runnable) |

The blog **inherits** the parent's color palette, typography, and interaction patterns but **extends** them for long-form academic content, equation rendering, interactive code blocks, slide viewers, and knowledge management (backlinks, cross-references, citations).

---

## 1. Design Philosophy

- **Inherited aesthetic:** Dark, monospaced-meets-sans, minimal, technical — the ML training dashboard feel
- **Extended purpose:** Long-form reading, study notes, mathematical derivations, code tutorials
- **Content-first:** Every component serves readability or interactivity — no decoration for decoration's sake
- **Academic rigor:** LaTeX-quality math, numbered theorems, proper citations, cross-references
- **Progressive enhancement:** Core content works without JS; JS adds interactivity (runnable code, lightbox, TOC highlighting, search)
- **Consistent with parent:** Same color tokens, same font pairing, same card patterns, same hover behaviors

---

## 2. Color Palette

### 2.1 Core Tokens (Inherited from Parent)

```css
:root {
  --bg:             #0a0a0a;   /* Page background (near-black) */
  --bg-card:        #111111;   /* Cards, elevated surfaces, code blocks */
  --bg-elevated:    #161616;   /* Tags, code headers, toolbar backgrounds */
  --text:           #e8e8e8;   /* Primary text (soft white, never pure #fff) */
  --text-secondary: #999999;   /* Body copy, descriptions, paragraphs */
  --dim:            #666666;   /* Labels, metadata, muted text */
  --border:         #222222;   /* Default borders everywhere */
  --border-hover:   #444444;   /* Hover-state borders */
  --accent:         #4ade80;   /* Green accent — CTAs, active states, tags */
}
```

> **Note:** The blog uses `--dim: #666666` (slightly darker than parent's `#888888`). This is intentional for better contrast in long-form reading.

### 2.2 Callout / Semantic Colors

```css
:root {
  /* Callout system — 5 built-in types */
  --tip-bg:       rgba(74, 222, 128, 0.1);   --tip-border:      #4ade80;   /* Green — tips, success */
  --note-bg:      rgba(59, 130, 246, 0.1);   --note-border:     #3b82f6;   /* Blue — notes, definitions */
  --warning-bg:   rgba(234, 179, 8, 0.1);    --warning-border:  #eab308;   /* Yellow — warnings */
  --danger-bg:    rgba(239, 68, 68, 0.1);    --danger-border:   #ef4444;   /* Red — danger, critical */
  --question-bg:  rgba(168, 85, 247, 0.1);   --question-border: #a855f7;   /* Purple — questions */
}
```

### 2.3 Extended Callout Colors (Academic)

| Type | Background | Border | Title Color | Use Case |
|---|---|---|---|---|
| **Abstract** | `rgba(139,92,246,0.1)` gradient | `#8b5cf6` | `#a78bfa` | Paper/section abstracts |
| **Definition** | `rgba(59,130,246,0.08)` | `#3b82f6` | `#60a5fa` | Formal definitions |
| **Proof** | `rgba(34,197,94,0.08)` | `#22c55e` | `#4ade80` | Mathematical proofs |
| **Example** | `rgba(249,115,22,0.08)` | `#f97316` | `#fb923c` | Worked examples |
| **Critical** | `rgba(239,68,68,0.1)` | `#ef4444` | `#f87171` | Critical warnings (pulsing border) |
| **Success** | `rgba(34,197,94,0.08)` | `#22c55e` | `#4ade80` | Successful outcomes |
| **Theorem** | `rgba(147,51,234,0.1)` | `#9333ea` | `#a855f7` | Theorems, lemmas, corollaries |
| **Axiom/Remark** | `rgba(99,102,241,0.1)` | `#6366f1` | `#818cf8` | Axioms, remarks |

### 2.4 Syntax Highlighting Colors (Code Blocks)

```css
/* Prism.js / CodeMirror — Material Darker variant */
.token.keyword    { color: #c792ea; }  /* purple — if, for, class, def */
.token.function   { color: #82aaff; }  /* blue — function names */
.token.class-name { color: #ffcb6b; }  /* gold — class names, decorators */
.token.string     { color: #c3e88d; }  /* green — strings */
.token.number     { color: #f78c6c; }  /* orange — numbers, booleans */
.token.operator   { color: #89ddff; }  /* cyan — operators, punctuation */
.token.comment    { color: #676e95; }  /* muted — comments (italic) */
.token.builtin    { color: #ffcb6b; }  /* gold — builtins */
```

### 2.5 Notes-Page Extended Tokens (For Future ML Visualizations)

These tokens extend the palette for equation blocks, graph charts, neural net diagrams, and annotations when building interactive ML content:

```css
:root {
  /* Equation blocks */
  --eq-bg:          #0d0f0d;                    /* Green-tinted near-black */
  --eq-border:      #1a2e1a;                    /* Green-tinted border */
  --eq-glow:        rgba(74, 222, 128, 0.06);   /* Inset terminal glow */

  /* Graph / chart system (4-color priority order) */
  --graph-grid:     #181818;
  --graph-axis:     #2a2a2a;
  --graph-line-1:   #4ade80;   /* Primary: train loss, main signal */
  --graph-line-2:   #60a5fa;   /* Secondary: val loss, reference */
  --graph-line-3:   #f472b6;   /* Tertiary: gradient, highlight */
  --graph-line-4:   #fb923c;   /* Quaternary: lr, auxiliary */
  --graph-fill:     rgba(74, 222, 128, 0.08);

  /* Neural net diagram nodes */
  --node-input:     #0d1a0d;   /* Green-tinted — input layer */
  --node-hidden:    #0d0d1a;   /* Blue-tinted — hidden layers */
  --node-output:    #1a0d0d;   /* Warm-tinted — output layer */
  --node-border:    #2a2a2a;

  /* Equation syntax coloring */
  --eq-var:         #60a5fa;   /* Variables */
  --eq-op:          #f472b6;   /* Operators */
  --eq-num:         #fb923c;   /* Numbers */
  --eq-func:        #a78bfa;   /* Functions */

  /* Annotations & highlights */
  --annotation:     rgba(74, 222, 128, 0.7);
  --highlight-bg:   rgba(96, 165, 250, 0.1);
  --highlight-border: rgba(96, 165, 250, 0.3);

  /* Concept pill semantic colors */
  /* .pill.active (green): math/foundation topics */
  /* .pill.info (blue): architecture/model topics */
  /* .pill.warn (orange): training/optimization topics */
  /* .pill.danger (pink): advanced/research topics */
}
```

### 2.6 Inline Formatting Colors

```css
.inline-highlight { background: rgba(234, 179, 8, 0.3); color: #fbbf24; }  /* ==highlight== */
kbd               { background: var(--bg-elevated); border: 1px solid var(--border); }
```

### 2.7 Surface Elevation Hierarchy

```
#0a0a0a  (--bg)           Page canvas
 └─ #111111 (--bg-card)     Cards, code blocks, citation boxes, post-cards
     └─ #161616 (--bg-elevated)  Code headers, toolbars, tags, table headers
```

### 2.8 Color Usage Rules

| Color | When to use |
|---|---|
| `--accent` (#4ade80) | Links, active nav, subject badges, tag backgrounds, button CTA, accent borders, graph primary line |
| `#fff` | Strong emphasis text, card titles on hover, button text |
| `#000` | Text on accent-colored buttons (e.g., "Run" button, "Copy BibTeX") |
| Callout colors | Only inside their respective callout blocks — never as general-purpose decoration |
| Syntax colors | Only inside code blocks — harmonized with but distinct from equation syntax tokens |

---

## 3. Typography

### 3.1 Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

--font-sans: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### 3.2 Type Scale — CSS Custom Properties (Single Source of Truth)

All `font-size` values are defined as CSS custom properties. **Never use raw rem/px values** — always use a token.

```css
:root {
  --text-xs:   0.65rem;  /* 10.4px — Tags, badges, nav, buttons, chrome labels */
  --text-sm:   0.75rem;  /* 12px   — Section labels, table headers, captions, callout titles */
  --text-base: 0.875rem; /* 14px   — Sidebar items, secondary body, table cells, code blocks */
  --text-md:   1rem;     /* 16px   — Body text, content paragraphs */
  --text-lg:   1.125rem; /* 18px   — Card titles, search results, descriptions */
  --text-xl:   1.25rem;  /* 20px   — Content h3, post card titles */
  --text-2xl:  1.5rem;   /* 24px   — Content h2, section headings */
  --text-3xl:  2rem;     /* 32px   — Page titles (about, notes, mobile post) */
  --text-4xl:  2.25rem;  /* 36px   — Post title (hero) */
  --text-5xl:  2.5rem;   /* 40px   — Search header (largest) */
  --text-code: 0.875em;  /* Inline code (relative to parent) */
}
```

### 3.3 Font Assignment Rules

| Element | Font | Weight | Token | Extra |
|---|---|---|---|---|
| **Body default** | Inter | 400 | `--text-md` (16px) | `line-height: 1.6` |
| **Post/Note title** | Inter | 700 | `--text-4xl` / `--text-3xl` | `line-height: 1.2`, `letter-spacing: -0.02em` |
| **Section H2** | Inter | 700 | `--text-2xl` | `border-bottom: 1px solid var(--border)` |
| **Subsection H3** | Inter | 600 | `--text-xl` | — |
| **Body paragraphs** | Inter | 400 | `--text-md` | `line-height: 1.8` (post-content), color: `--text-secondary` |
| **Logo / site title** | JetBrains Mono | 600 | `--text-sm` | `letter-spacing: 2px` |
| **Nav links** | JetBrains Mono | 400 | `--text-xs` | `text-transform: uppercase`, `letter-spacing: 1px` |
| **Section titles** | JetBrains Mono | 600 | `--text-sm` | `text-transform: uppercase`, `letter-spacing: 2px`, color: `--accent` |
| **TOC title / Quick actions** | JetBrains Mono | 600 | `--text-xs` | `text-transform: uppercase`, `letter-spacing: 1px`, color: `--dim` |
| **Tags/pills** | JetBrains Mono | — | `--text-xs` | `text-transform: uppercase`, `letter-spacing: 0.5px` |
| **Code blocks** | JetBrains Mono | 400 | `--text-base` | `line-height: 1.6` |
| **Inline code** | JetBrains Mono | — | `--text-code` (0.875em) | Green text, bg-elevated bg |
| **Code headers / Labels** | JetBrains Mono | 600 | `--text-xs` | `text-transform: uppercase`, `letter-spacing: 1px`, color: `--dim` |
| **Callout titles** | JetBrains Mono | 600 | `--text-sm` | `text-transform: uppercase`, `letter-spacing: 1px` |
| **Callout content** | Inter | 400 | `--text-base` | color: `--text-secondary` |
| **Buttons** | JetBrains Mono | — | `--text-xs` | — |
| **Post meta** | — | 400 | `--text-base` | color: `--dim` |
| **Captions / Figcaptions** | — | — | `--text-sm` | color: `--dim` |
| **Subject badge** | JetBrains Mono | — | `--text-sm` | `text-transform: uppercase`, `letter-spacing: 1px` |
| **Footer links** | JetBrains Mono | — | `--text-xs` | `text-transform: uppercase`, color: `--dim` |
| **Copyright** | — | — | `--text-sm` | color: `--dim` |
| **WIP badge** | JetBrains Mono | 600 | `--text-xs` | `text-transform: uppercase`, yellow |
| **Breadcrumb** | — | — | `--text-base` | color: `--dim` |
| **Seq nav label** | JetBrains Mono | 600 | `--text-xs` | `text-transform: uppercase`, color: `--dim` |
| **Seq nav title** | Inter | 500 | `--text-base` | color: `--text-secondary`, truncate |
| **Tables (th)** | JetBrains Mono | 600 | `--text-sm` | `text-transform: uppercase`, color: `--dim` |
| **Tables (td, body)** | Inter | 400 | `--text-base` | color: `--text-secondary` |
| **KaTeX (display)** | KaTeX fonts | — | `1.1em` | — |
| **KaTeX (inline)** | KaTeX fonts | — | `1.0em` | Inherits from surrounding text |

### 3.4 Typography Principles

1. **Monospace = structural/technical.** Nav, labels, tags, code, callout titles, buttons, badges, section headers — all JetBrains Mono
2. **Sans-serif = narrative.** Paragraphs, headings, descriptions, body text — all Inter
3. **Uppercase + letter-spacing** on ALL labels, nav items, section titles, badges, callout headers
4. **No decorative fonts.** Strict two-font system; KaTeX handles its own math rendering
5. **`line-height: 1.8`** for post/note content (more generous than parent's `1.6`) to aid reading long-form content
6. **Proofs** use Georgia/serif italic (`font-family: 'Georgia', 'Times New Roman', serif`) — the one exception to the two-font rule
7. **Never use raw font-size values.** Always use `var(--text-*)` tokens in CSS. This ensures the entire site's typography can be tuned from 10 variables in `:root`
8. **SVG diagrams** have their own 4-step scale (`SVG_XS`, `SVG_SM`, `SVG_BASE`, `SVG_LG`) defined in `visual-diagrams.js`, separate from CSS tokens since SVGs use unitless viewBox coordinates

---

## 4. Layout System

### 4.1 Centralized Spacing Variables (CSS Custom Properties)

Every spacing value in the system flows from these 13 CSS custom properties. To adjust spacing site-wide, change **only these variables** — never hardcode values in component CSS.

```css
:root {
  /* ── Max-Width Tiers ── */
  --max-width-ultra:   1800px;  /* Ultra-wide: graph, search */
  --max-width-wide:    1600px;  /* Wide: home, notes index, subject pages */
  --max-width-default: 1400px;  /* Reserved for future layouts */
  --max-width-content: 900px;   /* Reading: individual posts, notes */
  --sidebar-width:     280px;   /* TOC sidebar width */

  /* ── Page-Level Spacing ── */
  --spacing-horizontal:     80px;   /* All side padding (SINGLE SOURCE OF TRUTH) */
  --header-height:          54px;   /* Fixed header approx height (1rem padding × 2 + content) */
  --spacing-vertical-top:   120px;  /* Clears fixed header (54px) + breathing room */
  --spacing-vertical-bottom: 60px;  /* Content → footer distance */

  /* ── Section Spacing (major content divisions) ── */
  --section-margin-top:     4rem;   /* Space above a new section (H2-level) */
  --section-margin-bottom:  3rem;   /* Space below a section */
  --section-padding-top:    3rem;   /* Padding inside section when has border-top */
  --section-padding-bottom: 2.5rem; /* Padding inside section when has border-bottom */

  /* ── Card Spacing ── */
  --card-padding:        1.5rem;    /* Internal padding of all cards */
  --card-margin-bottom:  1.5rem;    /* Vertical gap between stacked cards */
  --card-gap:            1.5rem;    /* Grid gap in card grids */

  /* ── Content Element Spacing (within post/note body) ── */
  --content-element-margin: 2rem;   /* Block elements: callouts, embeds, code blocks */
  --paragraph-margin:       1.5rem; /* Between paragraphs (<p>) */
  --heading-margin-top:     3rem;   /* Space above H2 and H3 */
  --heading-margin-bottom:  1.5rem; /* Space below H2 (0.75rem for H3) */

  /* ── Footer ── */
  --footer-margin-top:      5rem;   /* Space above footer */
}
```

#### Responsive Overrides

| Breakpoint | `--spacing-horizontal` | `--spacing-vertical-top` | `--spacing-vertical-bottom` |
|---|---|---|---|
| `>1440px` | `100px` | `120px` | `60px` |
| `1025–1440px` (default) | `80px` | `120px` | `60px` |
| `769–1024px` | `60px` | `120px` | `60px` |
| `481–768px` | `24px` | `80px` | `60px` |
| `<=480px` | `20px` | `80px` | `60px` |

### 4.2 Page Layout Grid

```css
/* Base: all pages */
.content {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--spacing-vertical-top) var(--spacing-horizontal) var(--spacing-vertical-bottom);
  display: grid;
  gap: 60px;
}

/* Two-column (posts & notes) — content + TOC sidebar */
.content {
  grid-template-columns: 1fr var(--sidebar-width);
}

/* Single-column variants */
.content.home-content,
.content.notes-content,
.content.wide-content,
.content.search-content {
  grid-template-columns: 1fr;
}
```

### 4.3 Content Width Rules

| Page Type | Layout | Max-Width | Sidebar |
|---|---|---|---|
| **Home** (`home-content`) | Single column | `--max-width-content` (900px) for `.home` | None |
| **Notes Index** (`notes-content`) | Single column | `--max-width-wide` | None |
| **Subject / Sub-subject** (`wide-content`) | Single column | `--max-width-wide` | None |
| **Post** | Two-column | `--max-width-content` (900px) for `<article>` | TOC sticky sidebar |
| **Note** | Two-column | `--max-width-content` (900px) for `<article>` | TOC sticky sidebar |
| **Search** | Single column centered | 700px | None |

### 4.4 Fixed Header

```css
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  padding: 1rem 0;
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 10, 0.9);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.header-container {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--spacing-horizontal);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Nav structure:**
```
rohit.vision  ·  Notes  ·  Graph  ·  Search  ·  About  ·  Portfolio ⇗
     ↓            ↓         ↓         ↓          ↓          ↓
   home (/)    /notes/   /graph    /search     /about   rohit.vision (external)
```

- **`rohit.vision`** (site title) — links to blog home (`/`), serves as the "Home" link
- **No "Posts" link** — removed to avoid redundancy with site title
- **Active tab highlighting** — `class="active"` added via Liquid based on `page.url` or `page.layout`
- **Portfolio** — external link (`target="_blank"`), uses `--dim` color (not accent), accent on hover only

```css
.site-nav a.active { color: var(--accent); }
.site-nav .external-link { color: var(--dim); }  /* NOT accent by default */
.site-nav .external-link:hover { color: var(--accent); }
```

### 4.5 Sticky Sidebar (TOC)

```css
.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  align-self: start;
}
```

Hidden on `<=1024px` — sidebar disappears, content goes full-width single-column.

### 4.6 Home Page Layout

The home page is a **minimal posts feed** — no hero header, no category sidebar. The site title in the fixed nav is sufficient branding. Posts are content-first, immediately visible on load.

```css
/* Posts feed — flat list, full width within content max-width */
.posts-feed {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Home constrains to reading width (not full wide) */
.home-content .home {
  max-width: var(--max-width-content);  /* 900px */
}
```

**Design rationale:**
- The site title `rohit.vision` in the fixed header serves as the home link — no redundant "Posts" or "Home" nav item needed
- Category filters are premature with few posts — add when post count exceeds ~10
- Posts get full reading width instead of being squeezed by a sidebar

### 4.7 Notes Index — Subject Grid

```css
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);  /* 6 columns desktop */
  gap: 1.25rem;
}
/* Responsive: 4 cols at <=1200px, 3 cols at <=900px, 2 cols at <=768px */
```

### 4.8 Vertical Rhythm — Content Element Spacing

Inside `.post-content` and `.note-content`, every block element follows strict vertical spacing:

```
┌─ Post/Note Title ──────────────────────────────────────┐
│  margin-bottom: 1.5rem                                  │
│  padding-bottom: var(--section-padding-bottom) (2.5rem) │
│  border-bottom: 1px solid var(--border)                 │
└────────────────────────────────────────────────────────┘
  ↕ 3.5rem gap (post-header margin-bottom)
┌─ H2 ──────────────────────────────────────────────────┐
│  margin-top: var(--section-margin-top) = 4rem          │
│  margin-bottom: var(--heading-margin-bottom) = 1.5rem  │
│  padding-bottom: 0.5rem                                │
│  border-bottom: 1px solid var(--border)                │
└────────────────────────────────────────────────────────┘
  ↕ 1.5rem
┌─ Paragraph ───────────────────────────────────────────┐
│  margin-bottom: var(--paragraph-margin) = 1.5rem       │
└────────────────────────────────────────────────────────┘
  ↕ 1.5rem
┌─ Paragraph ───────────────────────────────────────────┐
│  margin-bottom: 1.5rem                                 │
└────────────────────────────────────────────────────────┘
  ↕ 1.5rem
┌─ Code Block / Table / Image / KaTeX ──────────────────┐
│  margin: 1.5rem 0                                      │
└────────────────────────────────────────────────────────┘
  ↕ 1.5rem
┌─ Callout Block ───────────────────────────────────────┐
│  margin: var(--content-element-margin) 0 = 2rem 0      │
└────────────────────────────────────────────────────────┘
  ↕ 2rem
┌─ H3 ──────────────────────────────────────────────────┐
│  margin-top: var(--heading-margin-top) = 3rem          │
│  margin-bottom: 0.75rem                                │
└────────────────────────────────────────────────────────┘
  ↕ 0.75rem
┌─ List (ul/ol) ────────────────────────────────────────┐
│  margin-bottom: var(--paragraph-margin) = 1.5rem       │
│  padding-left: 1.5rem                                  │
│  li margin-bottom: 0.75rem                             │
└────────────────────────────────────────────────────────┘
```

**Exact values per element:**

| Content Element | `margin-top` | `margin-bottom` | `padding` | Notes |
|---|---|---|---|---|
| **H2** (post-content) | `var(--section-margin-top)` = `4rem` | `var(--heading-margin-bottom)` = `1.5rem` | `pb: 0.5rem` | Has `border-bottom`, `scroll-margin-top: 100px` |
| **H3** (post-content) | `var(--heading-margin-top)` = `3rem` | `0.75rem` | — | `scroll-margin-top: 100px` |
| **Paragraph** | — | `var(--paragraph-margin)` = `1.5rem` | — | |
| **ul / ol** | — | `var(--paragraph-margin)` = `1.5rem` | `pl: 1.5rem` | `li` margin-bottom: `0.75rem` |
| **Blockquote** | — | `1.5rem` top & bottom | `1rem 1.5rem` | |
| **Code block (pre)** | `1.5rem` | `1.5rem` | `1.25rem` | |
| **Table wrapper** | `1.5rem` | `1.5rem` | — | `th` padding: `0.75rem 1rem`, `td`: `0.75rem 1rem` |
| **KaTeX display** | `1.5rem` | `1.5rem` | `1.5rem 1rem` | |
| **Image** | `1.5rem` | `1.5rem` | — | |
| **Callout** | `var(--content-element-margin)` = `2rem` | `2rem` | `1rem 1.5rem` (= `1rem var(--card-padding)`) | |
| **Embed wrapper** | `1.5rem` | `1.5rem` | — | |
| **Runnable code** | `1.5rem` | `1.5rem` | — | |
| **Mermaid wrapper** | `1.5rem` | `1.5rem` | `1.5rem` inner | |
| **Slide viewer** | `2rem` | `2rem` | — | |
| **Figcaption** | `-1rem` (overlaps image) | `1.5rem` | — | |

### 4.9 Section Divider Patterns

Sections that separate major content regions follow a consistent divider pattern:

```css
/* Pattern: border-top divider with padding */
.related-notes,
.comments,
.references-section,
.slides-section,
.backlinks-section,
.note-sequence-nav {
  margin-top: var(--section-margin-top);    /* 4rem above */
  padding-top: var(--section-padding-top);  /* 3rem below the border */
  border-top: 1px solid var(--border);
}

/* Pattern: border-bottom divider with padding (headers) */
.post-header,
.note-header,
.notes-index .post-header {
  margin-bottom: 3.5rem;                        /* gap after header */
  padding-bottom: var(--section-padding-bottom); /* 2.5rem inside */
  border-bottom: 1px solid var(--border);
}

/* Pattern: inline divider (post actions bar) */
.post-actions {
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* Pattern: borderless list divider (home post feed) */
.post-card {
  border-bottom: 1px solid var(--border);
}
.post-card:last-of-type {
  border-bottom: none;
}
```

### 4.10 Grid Gap Reference

Every grid in the system uses a specific gap value:

| Grid Context | `gap` Value | Notes |
|---|---|---|
| **Page-level** `.content` | `60px` | Between `<article>` and `<aside>` | Mobile: `40px` |
| **Posts feed** (home) | `0` | Borderless list, dividers via `border-bottom` |
| **Subject grid** (notes index) | `1.25rem` | 6-column card grid |
| **Topics grid** (subject page) | `1.5rem` | Sub-subject card grid |
| **Related posts grid** | `1rem` | `auto-fill, minmax(250px, 1fr)` |
| **General notes grid** | `1.5rem` | `auto-fill, minmax(280px, 1fr)` |
| **Post tags** | `0.5rem` | Inline flex row |
| **Post meta items** | `1rem` | Inline flex row |
| **Nav links** | `2rem` | Horizontal nav |
| **Footer links** | `1.5rem` | Horizontal flex |
| **Breadcrumb** | `0.5rem` | Inline flex |
| **Callout title icons** | `0.5rem` | Icon + text flex |
| **Image row** | `1rem` | 2-column grid |
| **Image grid** | `1rem` | Auto-fit grid |
| **Post actions** | `0.75rem` | Button row |
| **Quick actions** (sidebar) | `0.5rem` (via margin) | Stacked buttons |
| **Social links** (share dropdown) | `0.5rem` padding | Stacked items |

### 4.11 Scroll Offset Rules

Because the header is `position: fixed`, scroll targets need offsets:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;          /* Global offset for anchor links */
}

/* Individual elements anchored by TOC or cross-refs */
.post-content h2,
.post-content h3,
.note-content h2,
.note-content h3,
.reference-item {
  scroll-margin-top: 100px;          /* 80px header + 20px breathing room */
}

/* Sidebar sticks below header */
.sidebar {
  top: 100px;                        /* Fixed header height + gap */
}
```

### 4.12 Component Internal Spacing

Exact padding/margin within each component:

| Component | Internal Padding | Title `mb` | Internal Gap |
|---|---|---|---|
| **TOC panel** | `1.25rem` | `1rem` (title) | `0.5rem` between items |
| **Quick actions panel** | `1.5rem` top (border-top + padding) | `1rem` (title) | `0.5rem` between buttons |
| **Card (post/note, home)** | `2rem 0` (link padding) | `0.5rem` (title→meta) | `0.5rem` (meta→excerpt), `0.75rem` (excerpt→tags) |
| **Subject card** | `1.25rem 1rem` | — | `0.75rem` (flex gap) |
| **Topic card** | `1.5rem` | `0.5rem` (title→count) | — |
| **Callout** | `1rem var(--card-padding)` = `1rem 1.5rem` | `0.5rem` (title) | — |
| **Code header** | `0.5rem 1rem` | — | `0.5rem` (between actions) |
| **Code body (pre)** | `1.25rem` | — | — |
| **Runnable header** | `0.5rem 1rem` | — | `0.5rem` (between label + buttons) |
| **Output area** | `1rem 1.25rem` | — | — |
| **Citation header** | `0.75rem 1rem` | — | — |
| **Citation body (pre)** | Standard pre padding | — | — |
| **Search input** | `1rem 1.25rem 1rem 3.5rem` | — | — |
| **Search result** | `1.5rem` | `0.5rem` (title→excerpt) | `0.75rem` (excerpt→meta) |
| **Slide viewer toolbar** | `0.75rem 1rem` | — | `0.5rem` (between controls) |
| **Slide canvas container** | `1rem auto` (canvas margin) | — | — |
| **Backlink item** | `1rem 1.25rem` | `0.25rem` (title→context) | — |
| **Reference item** | `0.75rem` | — | `0.75rem` (number↔text) |
| **WIP badge** | `0.3rem 0.75rem` | — | `0.4rem` (icon↔text) |
| **Tag pill** | `0.2rem 0.6rem` | — | — |
| **Button (action)** | `0.5rem 1rem` | — | `0.5rem` (icon↔text) |
| **Button (quick action)** | `0.5rem 0.75rem` | — | `0.5rem` (icon↔text) |
| **Button (run)** | `0.35rem 0.75rem` | — | `0.4rem` (icon↔text) |
| **Footer container** | `1rem 0` (vertical), sides from `--spacing-horizontal` | — | `1.5rem` between links; `0.5rem` links→copyright |
| **Embed header** | `0.5rem 1rem` | — | `0.75rem` (logo↔title) |
| **Embed body** | — | — | `600px` height |
| **Lecture item** | `1.5rem 0` | — | `1.5rem` (number↔info) |
| **Seq nav link** | — | `0.15rem` (label→title) | `0.75rem` (icon↔text) |
| **Related note link** | `1rem 0` | — | — |
| **Breadcrumb** | — | `1.5rem` bottom | `0.5rem` between items |
| **Math tooltip** | `0.5rem 0.75rem` | — | Arrow: `5px` solid transparent |

### 4.13 Footer Spacing

```css
.site-footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 1rem 0;             /* Vertical: 1rem top and bottom */
  margin-top: auto;            /* STICKY FOOTER: pushes to viewport bottom when content is short */
}
.footer-container {
  max-width: 500px;            /* Narrow, centered footer */
  margin: 0 auto;
  padding: 0 var(--spacing-horizontal);
  text-align: center;
}
.footer-links {
  margin-bottom: 0.5rem;       /* Links → copyright gap */
  gap: 1.5rem;                 /* Between individual links */
}
```

> **Key:** `margin-top: auto` ensures the footer sticks to the viewport bottom on short-content pages (e.g., home with 2 posts) instead of floating in the middle.

---

## 5. Component Library

### 5.1 Cards — Universal Pattern

```css
/* Base card (used by post-card, note-card, related-post-card, subject-card, topic-card) */
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: 4px;  /* or 6-8px for subject-card */
padding: 1.25rem–1.5rem;
transition: all 0.3s;

/* Hover: translateX for lists, translateY for grids */
&:hover {
  border-color: var(--border-hover);  /* or --accent for subject-card */
  transform: translateX(4px);          /* list cards */
  /* OR */
  transform: translateY(-4px);         /* grid cards */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);  /* or rgba(74,222,128,0.12) for subject cards */
}
```

### 5.2 Post Card (Home Feed)

On the home page, post cards use a **borderless divider style** — clean lines between posts, no boxed cards. The entire card is wrapped in a single `<a>` link.

```css
.post-card {
  border-bottom: 1px solid var(--border);  /* Divider, not box */
  transition: all 0.2s;
}
.post-card:last-of-type {
  border-bottom: none;
}
.post-card-link {
  display: block;
  padding: 2rem 0;          /* Generous vertical breathing */
  text-decoration: none;
  color: inherit;
}
.post-card:hover {
  background: var(--bg-card);
  margin: 0 -1.5rem;         /* Bleed outward to show bg */
  padding: 0 1.5rem;
  border-radius: 6px;
  border-color: transparent;
}
.post-card-title {
  font-size: 1.2rem;         /* Slightly larger than old 1.1rem */
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text);
}
.post-card:hover .post-card-title {
  color: var(--accent);      /* Green on hover */
}
/* Meta: flex row, --dim, 0.8rem */
/* Excerpt: --text-secondary, 0.9rem, mt 0.5rem */
/* Tags: mt 0.75rem, standard .tag pills */
```

> **Note:** On other pages (notes index, search results), post-card variants may still use the boxed card pattern with `translateX(4px)` hover.

### 5.3 Subject Card (Notes Index)

```css
.subject-card {
  border-radius: 8px;
  padding: 1.25rem 1rem;
  text-align: center;
  min-height: 140px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem;
}
.subject-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(74, 222, 128, 0.12);
}
/* Icon: 48px container, rgba(74,222,128,0.08) bg, 12px border-radius */
/* Name: Inter 600, 0.95rem */
/* Count: JetBrains Mono 0.65rem, uppercase, --dim → --accent on hover */
/* .empty state: opacity 0.4, cursor not-allowed, no hover effects */
```

### 5.4 Tags / Pills

```css
.tag {
  background: var(--bg-elevated);
  color: var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
/* Variant: .tag-small — 0.6rem font, slightly smaller padding */
/* Subject badge: .note-subject — accent color, rgba(74,222,128,0.1) bg */
```

### 5.5 Callout Blocks

**Markdown syntax:**
```markdown
> [!TIP]
> Content here...

> [!NOTE]       > [!WARNING]     > [!DANGER]
> [!QUESTION]   > [!ABSTRACT]    > [!DEFINITION]
> [!PROOF]      > [!EXAMPLE]     > [!CRITICAL]
> [!SUCCESS]    > [!THEOREM]     > [!LEMMA]
```

**CSS structure:**
```css
.callout {
  padding: 1rem 1.5rem;
  border-radius: 4px;
  margin: 2rem 0;
  border-left: 3px solid;  /* Color varies by type */
}
.callout-title {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}
.callout-content {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
```

### 5.6 Code Blocks

**Three variants:**

1. **Basic code block** (Rouge-highlighted):
   ```css
   pre {
     background: var(--bg-card);
     padding: 1.25rem;
     border: 1px solid var(--border);
     border-radius: 4px;
   }
   pre code { font-size: 0.85rem; line-height: 1.6; }
   ```

2. **Code block with header** (language label + copy button):
   ```css
   .code-block { border: 1px solid var(--border); border-radius: 4px; overflow: hidden; }
   .code-header { background: var(--bg-elevated); padding: 0.5rem 1rem; border-bottom: 1px solid var(--border); }
   .code-language { font-family: var(--font-mono); font-size: 0.6rem; uppercase; letter-spacing: 1px; color: --dim; }
   ```

3. **Runnable code block** (Pyodide-powered):
   ```css
   .runnable-code { border: 1px solid var(--border); border-radius: 4px; }
   .runnable-header { background: var(--bg-elevated); }
   .runnable-label { color: var(--accent); font-family: var(--font-mono); 0.6rem; uppercase; }
   .run-btn { background: var(--accent); color: #000; font-family: var(--font-mono); 0.6rem; }
   .output-content { background: #0d0d0d; font-family: var(--font-mono); 0.9rem; }
   ```

**Inline code:**
```css
:not(pre) > code {
  background: var(--bg-elevated);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  color: var(--accent);
  border: 1px solid var(--border);
}
```

### 5.7 Math (KaTeX)

```css
/* Display math */
.katex-display {
  overflow-x: auto;
  padding: 1.5rem 1rem;
  margin: 1.5rem 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.katex { font-size: 1.1em; }

/* Equation numbering (auto by JS) */
.numbered-equation .equation-number {
  position: absolute;
  right: 0; top: 50%; transform: translateY(-50%);
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

/* Copy LaTeX button — appears on hover */
.eq-copy-btn { opacity: 0; }
.katex-display:hover .eq-copy-btn { opacity: 1; }
```

### 5.8 Tables

```css
.table-wrapper {
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border);
  border-radius: 4px;
}
th {
  background: var(--bg-elevated);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
}
td {
  color: var(--text-secondary);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}
```

### 5.9 Blockquotes

```css
blockquote {
  border-left: 3px solid var(--accent);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: var(--bg-card);
  border-radius: 0 4px 4px 0;
  color: var(--text-secondary);
  font-style: italic;
}
```

### 5.10 Images

```css
.post-content img {
  max-width: 100%;
  border-radius: 4px;
  margin: 1.5rem 0;
  border: 1px solid var(--border);
}

/* Multi-image layouts via {% include img.html %} */
.image-row   { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.image-grid  { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.image-grid.cols-2 { repeat(2, 1fr); }
.image-grid.cols-3 { repeat(3, 1fr); }

/* Lightbox: fullscreen overlay, 90vw/90vh max, close/nav buttons */
/* Image compare: before/after slider with accent-colored handle */
```

### 5.11 Citation Box

```css
.citation-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 4px; }
.citation-header { background: var(--bg-elevated); border-bottom: 1px solid var(--border); }
.copy-bibtex-btn { background: var(--accent); color: #000; /* JetBrains Mono 0.6rem uppercase */ }
```

### 5.12 Slide Viewer

```css
.slide-viewer { border: 1px solid var(--border); border-radius: 4px; background: var(--bg-card); }
.slide-viewer-toolbar { background: var(--bg-elevated); border-bottom: 1px solid var(--border); }
.slide-btn { border: 1px solid var(--border); color: --text-secondary; }
.slide-btn:hover { border-color: var(--accent); color: var(--accent); }
/* Fullscreen: position fixed, 100vw/100vh, z-index 9999 */
/* Canvas container: bg #0a0a0a, min-height 500px */
```

### 5.13 Post Actions Bar

All reactions and comments are powered by **Giscus (GitHub Discussions)**. The Like and Comments buttons scroll to the Giscus widget; counts are fetched from the Giscus API and shown as badges.

```css
.post-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.post-action-btn {
  background: transparent;
  border: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.post-action-btn:hover { border-color: var(--accent); color: var(--accent); }
/* Count badges: .action-count — hidden by default, shown when count > 0 */
.action-count {
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 9px;
  background: rgba(74, 222, 128, 0.1);
  color: var(--accent);
  display: none; /* JS toggles to inline when count > 0 */
}
```

**Giscus integration flow:**
1. `fetchDiscussionCounts()` — fetches reaction/comment counts from `giscus.app/api/discussions`
2. `listenForGiscusMetadata()` — listens for `postMessage` from Giscus iframe to keep counts in sync
3. Like/Comments buttons → `scrollToGiscus()` → smooth scroll + `.giscus-highlight` flash animation

### 5.14 WIP Badge

```css
.wip-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
  padding: 0.3rem 0.75rem;
  border-radius: 2px;
}
```

### 5.15 Breadcrumb Navigation

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--dim);
}
.breadcrumb a { color: var(--dim); }
.breadcrumb a:hover { color: var(--accent); }
.breadcrumb .current { color: var(--text); }
.breadcrumb .sep { opacity: 0.5; }
```

### 5.16 Search

```css
.search-input {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.95rem;
}
.search-input:hover { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(74,222,128,0.08); }
.search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(74,222,128,0.12); }
/* Status dot: warning yellow when loading, accent green when ready, red on error */
/* Result cards: border-radius 6px, hover → accent border + translateY(-2px) */
```

### 5.17 Related Notes / Backlinks

```css
/* Related notes: flat list, each item has bottom border, hover → translateX(4px) + accent */
.related-notes a {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}
.related-notes a:hover {
  color: var(--accent);
  transform: translateX(4px);
  border-bottom-color: var(--accent);
}

/* Backlink items: card-style with hover translateX(4px) */
.backlink-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1rem 1.25rem;
}
```

### 5.18 Note Sequence Navigation (Prev / Next)

Automatic prev/next links at the bottom of individual notes within the same sub-subject folder. Built entirely in Liquid (no JS). Only renders when there are 2+ sibling notes.

**Liquid logic** (in `note.html`):
1. Parse `page.path` → extract `subject_slug` and `sub_subject_slug`
2. Find all sibling notes in the same folder (excluding `index.md`)
3. Sort by `path` (filename prefix gives sequence: `01_`, `02_`, etc.)
4. Determine current index → derive prev/next

**HTML structure:**
```html
<nav class="note-sequence-nav">
  <a class="seq-nav-link seq-nav-prev">
    <svg class="seq-nav-icon"><!-- left arrow --></svg>
    <span class="seq-nav-text">
      <span class="seq-nav-label">Previous</span>
      <span class="seq-nav-title">Lec 01 - Introduction</span>
    </span>
  </a>
  <a class="seq-nav-link seq-nav-next">
    <span class="seq-nav-text">
      <span class="seq-nav-label">Next</span>
      <span class="seq-nav-title">Lec 03 - Policy Gradients</span>
    </span>
    <svg class="seq-nav-icon"><!-- right arrow --></svg>
  </a>
</nav>
```

**CSS:**
```css
.note-sequence-nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: var(--section-margin-top);
  padding-top: var(--section-padding-top);
  border-top: 1px solid var(--border);  /* Standard section divider */
}
.seq-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  transition: color 0.2s;
}
.seq-nav-link:hover { color: var(--accent); }
.seq-nav-next { margin-left: auto; text-align: right; }  /* Right-aligned even when alone */
.seq-nav-icon { color: var(--dim); transition: transform 0.2s, color 0.2s; }
.seq-nav-prev:hover .seq-nav-icon { transform: translateX(-3px); color: var(--accent); }
.seq-nav-next:hover .seq-nav-icon { transform: translateX(3px); color: var(--accent); }
.seq-nav-label {
  font-family: var(--font-mono);
  font-size: 0.55rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--dim);
}
.seq-nav-title { font-size: 0.9rem; font-weight: 500; max-width: 320px; }
```

**Edge cases:**
- First note: only "Next →" (right-aligned via `margin-left: auto`)
- Last note: only "← Previous" (left-aligned naturally)
- Single note in folder: nav not rendered (`sibling_notes.size > 1` check)
- Mobile: stacks vertically, next link uses `flex-direction: row-reverse`

### 5.19 Lecture List (Sub-Subject Pages)

```css
.lecture-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px dotted var(--border);
}
.lecture-item:hover { transform: translateX(4px); }
.lecture-number { font-family: var(--font-mono); 0.9rem; color: var(--dim); width: 2rem; }
.lecture-title  { Inter 700, 1.15rem; }
.lecture-item:hover .lecture-title { color: var(--accent); }
```

---

## 6. Animations & Interactions

### 6.1 Card Hover — Three Patterns

**Home post cards** (borderless feed items):
```css
/* No translateX — instead, background fill + bleed */
.post-card:hover {
  background: var(--bg-card);
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  border-radius: 6px;
}
.post-card:hover .post-card-title { color: var(--accent); }
transition: all 0.2s;
```

**List cards** (note-card, lecture-item, related notes, backlinks):
```css
transform: translateX(4px);
transition: all 0.3s;
```

**Grid cards** (subject-card, topic-card, related-post-card):
```css
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
transition: all 0.3s;
```

### 6.2 Button Hover

```css
.post-action-btn:hover,
.quick-action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

### 6.3 Giscus Scroll Highlight

When Like or Comments button is clicked, the page scrolls to the Giscus widget and a flash animation highlights it:

```css
.giscus-highlight {
  animation: giscusFlash 2s ease;
}
@keyframes giscusFlash {
  0%   { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  30%  { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0.15); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}
```

### 6.4 Note Sequence Nav — Directional Arrow Pull

```css
/* Arrow slides 3px toward the link direction on hover */
.seq-nav-prev:hover .seq-nav-icon { transform: translateX(-3px); color: var(--accent); }
.seq-nav-next:hover .seq-nav-icon { transform: translateX(3px); color: var(--accent); }
transition: transform 0.2s, color 0.2s;
```

### 6.5 Loading Spinner

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### 6.6 Critical Callout Pulse

```css
@keyframes pulseBorder {
  0%, 100% { border-color: #ef4444; }
  50%      { border-color: #f87171; }
}
.callout-critical { animation: pulseBorder 2s ease-in-out infinite; }
```

### 6.7 Search Status Pulse

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}
.status-dot { animation: pulse 1.5s infinite; }
.status-dot.ready { animation: none; }
```

### 6.8 Collapsible Sections

```css
/* Triangle indicator rotates on open */
.collapsible-code summary::before { /* right-pointing triangle */ }
.collapsible-code[open] summary::before { transform: rotate(90deg); }
/* Same pattern for slides-collapsible and subject-group details */
```

### 6.9 TOC Active State

```css
.toc-list a.active {
  color: var(--accent);
  border-left-color: var(--accent);
}
/* Tracked by IntersectionObserver in toc.js */
```

---

## 7. Responsive Design

### 7.1 Breakpoints

| Breakpoint | Name | `--spacing-horizontal` |
|---|---|---|
| `>1440px` | Large desktop | `100px` |
| `1025px–1440px` | Standard desktop | `80px` (default) |
| `769px–1024px` | Tablet | `60px` |
| `481px–768px` | Mobile | `24px` |
| `<=480px` | Small mobile | `20px` |

### 7.2 Key Responsive Changes

| Element | Desktop | Tablet (<=1024px) | Mobile (<=768px) |
|---|---|---|---|
| **Layout grid** | `1fr sidebar` | Single column | Single column |
| **TOC sidebar** | Visible, sticky | `display: none` | `display: none` |
| **Content gap** | `60px` | `60px` | `40px` |
| **Post title** | `2.25rem` | — | `1.75rem` |

| **Home posts feed** | Full width (900px) | — | Full width (900px) |
| **Subject grid** | 6 cols | 4 cols (<=1200) → 3 (<=900) | 2 cols |
| **Image grids** | Multi-column | 2 cols | Single column |
| **Post actions** | Row | — | Wrapping row |
| **Slide viewer toolbar** | Horizontal row | — | Stacked column |
| **Note seq nav** | Flex row (prev left, next right) | — | Stacked column, next: `row-reverse` |

---

## 8. Information Architecture

### 8.1 URL Structure

```
/blogs/                             → Home (posts feed, no categories)
/blogs/posts/:title/                → Individual blog post
/blogs/notes/                       → Notes index (subject grid)
/blogs/notes/:subject/              → Subject page (topic cards)
/blogs/notes/:subject/:sub/         → Sub-subject page (note list)
/blogs/notes/:subject/:sub/:note/   → Individual note
/blogs/search                       → Search page
/blogs/graph                        → Knowledge graph
/blogs/about                        → About page
```

### 8.2 Jekyll Collections

```yaml
collections:
  posts:
    output: true
    permalink: /posts/:title/
  notes:
    output: true
    permalink: /notes/:path/
```

### 8.3 Layouts Hierarchy

```
default.html              ← Base: <head>, header, <main.content>, footer, all JS
├── home.html             ← Minimal posts feed, no header/sidebar (single column)
├── post.html             ← Blog post + actions + related + backlinks + citation (two-column)
├── note.html             ← Study note (.note/.note-content) + slides + refs + seq-nav (two-column)
├── subject.html          ← Subject landing: breadcrumb + topic cards + general notes (wide)
└── sub-subject.html      ← Sub-subject: breadcrumb + lecture list (wide)
```

### 8.4 Frontmatter Schema

**Posts (`_posts/`):**
```yaml
---
title: "Post Title"
date: 2024-12-17
tags: [transformers, attention, deep-learning]
math: true              # Enable KaTeX
comments: true          # Enable Giscus
---
```

**Notes (`_notes/`):**
```yaml
---
title: "Note Title"
description: "One-line summary"
subject: "Deep Learning"
tags: [attention, transformers]
status: wip             # Optional: shows WIP badge
updated: 2025-01-15     # Optional: last updated date
math: true
slides:                 # Optional: lecture slides
  - url: /assets/resources/notes/rl/CS224R/01.pdf
    title: "Lecture 1"
slide_sections:         # Optional: organized slide groups
  - title: "Week 1"
    slides:
      - url: /path/to.pdf
        title: "Slides"
references:             # Optional: bibliography
  - id: vaswani2017
    authors: "Vaswani et al."
    title: "Attention Is All You Need"
    venue: "NeurIPS 2017"
    url: "https://arxiv.org/abs/1706.03762"
---
```

**Subject index pages (`_notes/:subject/index.md`):**
```yaml
---
title: "Deep Learning"
layout: subject
subject_slug: deep-learning
description: "Neural networks, architectures, optimization"
sub_subjects: [attention, cnns, rnns, transformers, optimization]
---
```

**Sub-subject index pages (`_notes/:subject/:sub/index.md`):**
```yaml
---
title: "Attention Mechanisms"
layout: sub-subject
subject: deep-learning
subject_name: "Deep Learning"
sub_subject: attention
description: "Self-attention, multi-head, cross-attention"
---
```

---

## 9. Markdown Syntax Extensions

### 9.1 Callouts (Processed by `callouts.js`)

```markdown
> [!TYPE]
> Content here. Supports **bold**, `code`, $math$, and links.

Types: TIP, NOTE, WARNING, DANGER, QUESTION, ABSTRACT, DEFINITION,
       PROOF, EXAMPLE, CRITICAL, SUCCESS, THEOREM, LEMMA, COROLLARY
```

### 9.2 Inline Formatting (Processed by `inline-formatting.js`)

```markdown
==highlighted text==           → <mark class="inline-highlight">
[[Ctrl]]+[[S]]                 → <kbd> combo
::abbreviation|full form::     → <abbr> with tooltip
```

### 9.3 Cross-References (Processed by `cross-references.js`)

```markdown
{#eq:attention}                → Anchor on equation
{@eq:attention}                → Link: "Equation (1)"
{#fig:architecture}            → Anchor on figure
{@fig:architecture}            → Link: "Figure 1"
{#tab:comparison}              → Anchor on table
{@tab:comparison}              → Link: "Table 1"
```

### 9.4 Citations (Processed by `citations.js`)

```markdown
[@vaswani2017]                 → Inline citation → auto-generates References section
```

Requires `references:` in frontmatter or `bibliography.json`.

### 9.5 Embeds

```html
<!-- HuggingFace Space -->
<div class="hf-space" data-src="username/space-name" data-height="600"></div>

<!-- Video -->
<div class="video-embed" data-src="https://youtube.com/watch?v=..." data-caption="..."></div>

<!-- Image comparison slider -->
<div class="image-compare" data-before="/path/before.png" data-after="/path/after.png">
  <span class="compare-label-before">Before</span>
  <span class="compare-label-after">After</span>
</div>

<!-- Runnable Python code (Pyodide) -->
<div class="runnable" data-lang="python" markdown="1">
```python
print("Hello from the browser!")
```
</div>

<!-- Collapsible code block -->
<div class="collapsible" data-label="Show Implementation" markdown="1">
```python
# Hidden by default...
```
</div>

<!-- Multi-image layouts -->
{% include img.html src="/img1.png, /img2.png" cap="Left, Right" %}
{% include img.html src="/a.png, /b.png, /c.png" cols="3" %}
```

### 9.6 Slides in Notes

```yaml
# In frontmatter:
slides:
  - url: /assets/resources/notes/rl/CS224R/01.pdf
    title: "Lecture 1: Introduction"
```

Renders as collapsible slide viewer with PDF.js, prev/next navigation, zoom, and fullscreen.

---

## 10. JavaScript Module Architecture

### 10.1 Module Registry

All modules are loaded via `<script defer>` in `default.html` and initialized by `main.js`:

| Module | File | Purpose |
|---|---|---|
| **TOC** | `toc.js` | Build table of contents, track active heading, reading progress |
| **Callouts** | `callouts.js` | Transform `> [!TYPE]` blockquotes into styled callout blocks |
| **Code Runner** | `code-runner.js` | Pyodide-powered runnable Python blocks with CodeMirror editor |
| **Code Enhancements** | `code-enhancements.js` | Copy buttons, line numbers, collapsible code blocks |
| **Mermaid Init** | `mermaid-init.js` | Initialize Mermaid.js diagrams with dark theme |
| **Post Interactions** | `post-interactions.js` | Share, Giscus reactions/comments, scroll-to-comments |
| **Embeds** | `embeds.js` | HuggingFace space iframes, video embeds |
| **Utils** | `utils.js` | Table wrappers, math tooltips |
| **Category Nav** | `category-nav.js` | No-op stub (home filtering removed; file retained for compatibility, can be deleted) |
| **Citations** | `citations.js` | Parse `[@id]`, build References section from bibliography |
| **Cross-References** | `cross-references.js` | Parse `{#id}` anchors and `{@id}` links, auto-number |
| **Inline Formatting** | `inline-formatting.js` | `==highlights==`, `[[kbd]]`, `~~abbr|full~~` |
| **LaTeX Enhancements** | `latex-enhancements.js` | Equation numbering, theorem numbering, copy LaTeX |
| **Backlinks** | `backlinks.js` | Scan all posts/notes for links to current page |
| **Image Compare** | `image-compare.js` | Before/after slider |
| **Lightbox** | `lightbox.js` | Fullscreen image viewer with navigation |
| **PDF Export** | `pdf-export.js` | Print-to-PDF functionality |
| **Presentation** | `presentation.js` | Presentation mode (H2 sections as slides) |
| **Semantic Search** | `semantic-search.js` | AI-powered search page |
| **Graph** | `graph.js` | Knowledge graph visualization |
| **Slide Viewer** | `slide-viewer.js` | PDF slide viewer with PDF.js |

### 10.2 Initialization Order (in `main.js`)

```
1. Mermaid diagrams (must run before Prism re-highlights)
2. Code enhancements (line numbers, copy buttons)
3. TOC generation
4. Table wrappers + callout processing
5. Inline formatting → Cross-references → Citations → LaTeX
6. Reading progress
7. Embeds
8. Code runner (Pyodide)
9. Interactive math tooltips
10. Post actions (Giscus reactions, share) + Giscus metadata listener
11. Visual enhancements (image compare, lightbox)
12. Backlinks
13. Slide viewers
```

### 10.3 Dual-Selector Pattern for Post/Note Content

All JS modules that query `.post-content` also query `.note-content` using the fallback pattern:

```js
// Query both content containers
const content = document.querySelector('.post-content') || document.querySelector('.note-content');

// Or for querySelectorAll across both:
document.querySelectorAll('.post-content h2, .post-content h3, .note-content h2, .note-content h3');
```

Modules using this pattern: `toc.js`, `callouts.js`, `citations.js`, `cross-references.js`, `inline-formatting.js`, `lightbox.js`, `pdf-export.js`, `presentation.js`, `slide-viewer.js`, `utils.js`.

Similarly, title selectors use:
```js
const title = document.querySelector('.post-title')?.textContent
  || document.querySelector('.note-title')?.textContent
  || 'Document';
```

### 10.4 Note Layout CSS Classes

The `note.html` layout uses distinct classes from `post.html`:

| Element | Post class | Note class |
|---|---|---|
| `<article>` | `.post` | `.note` |
| `<header>` | `.post-header` | `.note-header` |
| `<h1>` | `.post-title` | `.note-title` |
| Content div | `.post-content` | `.note-content` |

Both `.post-content` and `.note-content` have identical element styling (h2, h3, p, lists, tables, blockquotes, images). The note-content styles are duplicated in CSS to avoid coupling.

### 10.5 External Dependencies

| Library | Version | Purpose | Loading |
|---|---|---|---|
| **KaTeX** | 0.16.9 | Math rendering | `<link>` CSS + `<script defer>` + auto-render |
| **Mermaid** | 10.x | Diagrams | `<script>` (sync for SSR timing) |
| **Prism.js** | 1.29.0 | Syntax highlighting | `<script defer>` + python/bash/yaml plugins |
| **CodeMirror** | 5.65.16 | Code editor for runnable blocks | `<script>` (sync for editor init) |
| **PDF.js** | (via CDN) | Slide viewer PDF rendering | Loaded by `slide-viewer.js` on demand |
| **Pyodide** | (via CDN) | In-browser Python | Loaded on first "Run" click |

---

## 11. Performance Patterns

| Technique | Implementation |
|---|---|
| **Preconnect** | `fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.jsdelivr.net` |
| **Font display** | `display=swap` on Google Fonts URL |
| **Deferred JS** | All `<script defer>` except CodeMirror + Mermaid (need sync) |
| **Lazy PDF loading** | Slide viewers use `data-lazy="true"`, load on expand |
| **Pyodide on-demand** | Heavy WASM runtime only loads when user clicks "Run" |
| **Passive scroll** | TOC and reading progress use passive scroll listeners |
| **CSS variables** | Single source of truth — changing one variable updates globally |

---

## 12. SEO & Metadata

- **SEO plugin:** `jekyll-seo-tag` auto-generates OG/Twitter tags
- **Sitemap:** `jekyll-sitemap` plugin
- **RSS feed:** `jekyll-feed` plugin at `/blogs/feed.xml`
- **Canonical URL:** Auto via jekyll-seo-tag
- **Theme color:** `<meta name="theme-color" content="#0a0a0a">` (via favicon SVG)
- **Favicon:** Inline SVG data URI (gear icon, accent green stroke)
- **Schema.org:** `BlogPosting` for posts, `Article` for notes
- **Skip to content:** Not yet implemented (accessibility gap)

---

## 13. File Structure

```
blogs/
├── _config.yml                    # Jekyll config, collections, defaults
├── _config_dev.yml                # Dev overrides
├── index.md                       # Home page (layout: home)
├── notes.md                       # Notes index (layout: default, notes-content, no header)
├── about.md                       # About page
├── search.html                    # Search page
├── graph.html                     # Knowledge graph page
├── _layouts/
│   ├── default.html               # Base: head, header, main, footer, all JS
│   ├── home.html                  # Minimal posts feed (single column)
│   ├── post.html                  # Blog post (actions, related, citation)
│   ├── note.html                  # Study note (slides, references, seq-nav, related)
│   ├── subject.html               # Subject index (topic cards)
│   └── sub-subject.html           # Sub-subject (lecture list)
├── _includes/
│   ├── header.html                # Fixed header with nav
│   ├── footer.html                # Footer with social links
│   ├── breadcrumb.html            # Breadcrumb navigation
│   ├── page-header.html           # Page header pattern
│   ├── references.html            # References section (auto from frontmatter)
│   ├── giscus.html                # Comments embed
│   ├── img.html                   # Multi-image include
│   ├── image-row.html             # Two-column image layout
│   └── image-grid.html            # Grid image layout
├── _posts/                        # Blog posts (date-prefixed .md)
│   ├── 2024-12-17-transformer-attention-deep-dive.md
│   └── 2024-12-18-flash-attention-scaling.md
├── _notes/                        # Study notes (nested by subject)
│   ├── deep-learning/
│   │   ├── index.md               # Subject page (layout: subject)
│   │   ├── attention/
│   │   │   ├── index.md           # Sub-subject page (layout: sub-subject)
│   │   │   └── 1.md              # Individual note
│   │   ├── cnns/
│   │   ├── rnns/
│   │   ├── transformers/
│   │   └── optimization/
│   ├── maths/
│   ├── cv/
│   ├── nlp-llms/
│   ├── ml/
│   ├── rl/
│   ├── mlops/
│   └── setup/
├── assets/
│   ├── css/
│   │   ├── main.css               # All styles (~4400 lines)
│   │   └── slide-viewer.css       # Slide viewer styles
│   ├── js/
│   │   ├── main.js                # Orchestrator
│   │   ├── toc.js                 # Table of contents
│   │   ├── callouts.js            # Callout blocks
│   │   ├── code-runner.js         # Pyodide runner
│   │   ├── code-enhancements.js   # Copy, line numbers
│   │   ├── mermaid-init.js        # Mermaid diagrams
│   │   ├── post-interactions.js   # Giscus reactions, share, scroll-to-comments
│   │   ├── embeds.js              # HF, video
│   │   ├── utils.js               # Table wrappers, tooltips
│   │   ├── category-nav.js        # No-op stub (can be deleted)
│   │   ├── citations.js           # Academic citations
│   │   ├── cross-references.js    # Figure/equation refs
│   │   ├── inline-formatting.js   # Highlights, kbd
│   │   ├── latex-enhancements.js  # Theorem numbering
│   │   ├── backlinks.js           # Bidirectional links
│   │   ├── image-compare.js       # Before/after slider
│   │   ├── lightbox.js            # Image lightbox
│   │   ├── pdf-export.js          # PDF export
│   │   ├── presentation.js        # Presentation mode
│   │   ├── semantic-search.js     # AI search
│   │   ├── slide-viewer.js        # PDF slide viewer
│   │   └── graph.js               # Knowledge graph
│   ├── images/                    # Post/note images
│   └── resources/
│       ├── notes/                 # PDFs, slides
│       └── posts/                 # Post resources
├── _data/
│   ├── bibliography.yml           # Global bibliography
│   └── layout.yml                 # Layout config
├── bibliography.json              # Alternative bib format
├── posts.json                     # Posts metadata for search
├── Gemfile                        # Ruby dependencies
├── Makefile                       # Build scripts
└── .github/workflows/
    ├── deploy.yml                 # GitHub Actions deploy
    └── jekyll.yml                 # Jekyll build
```

---

## 14. Quick Reference — Design Tokens Cheat Sheet

```
COLORS
  Background:       #0a0a0a → #111111 → #161616  (3-tier elevation)
  Text:             #e8e8e8 → #999999 → #666666  (3-tier hierarchy)
  Accent:           #4ade80                        (green, single accent)
  Borders:          #222222 → #444444              (default → hover)
  Callouts:         green / blue / yellow / red / purple  (5 semantic colors)
  Syntax:           purple / blue / gold / green / orange / cyan / muted

TYPOGRAPHY
  Fonts:            JetBrains Mono (technical) + Inter (narrative)
  Type Scale:       10 tokens in :root — var(--text-xs) through var(--text-5xl)
                    + var(--text-code) for inline code (em-based)
  Body:             Inter 400 var(--text-md)=1rem, line-height 1.8
  Headings:         Inter 700 (H1: --text-4xl, H2: --text-2xl, H3: --text-xl)
  Labels:           JetBrains Mono 600, var(--text-xs)/(--text-sm), UPPERCASE
  Code:             JetBrains Mono 400, var(--text-base)=0.875rem
  Tags:             JetBrains Mono, var(--text-xs), UPPERCASE
  SVG Diagrams:     4-step scale: SVG_XS=10, SVG_SM=11, SVG_BASE=12, SVG_LG=14
                    viewBox width: SVG_W=800 (1 unit ≈ 1 CSS pixel)

LAYOUT
  Max-width wide:   1600px (home, notes index, subject pages)
  Max-width content:900px (posts, individual notes)
  Sidebar:          280px sticky TOC (hidden <=1024px)
  Horizontal pad:   80px desktop → 24px mobile
  Vertical pad:     120px top (clears fixed 54px header), 60px bottom

INTERACTIONS
  Cards (list):     translateX(4px) on hover
  Cards (grid):     translateY(-4px) + box-shadow on hover
  Seq nav arrows:   translateX(±3px) directional pull on hover
  Borders:          → var(--accent) or var(--border-hover) on hover
  Buttons:          → accent border + accent text on hover
  Giscus scroll:    smooth scroll + green glow flash (giscusFlash 2s)
  Transition:       0.3s for most, 0.2s for buttons/inputs/nav arrows
  Border-radius:    2px (tags, buttons) · 4px (cards, code) · 6-8px (subject cards, search)

SPACING — CSS CUSTOM PROPERTIES (all in :root, change here only)
  --spacing-horizontal:      80px (→ 100/60/24/20 responsive)
  --header-height:           54px
  --spacing-vertical-top:    120px (→ 80px mobile) — clears fixed header
  --spacing-vertical-bottom: 60px
  --section-margin-top:      4rem     (above new sections)
  --section-margin-bottom:   3rem     (below sections)
  --section-padding-top:     3rem     (inside, after border-top)
  --section-padding-bottom:  2.5rem   (inside, before border-bottom)
  --card-padding:            1.5rem   (all card internal padding)
  --card-margin-bottom:      1.5rem   (between stacked cards)
  --card-gap:                1.5rem   (grid gap in card grids)
  --content-element-margin:  2rem     (callouts, embeds, heavy blocks)
  --paragraph-margin:        1.5rem   (between paragraphs)
  --heading-margin-top:      3rem     (above H2 and H3)
  --heading-margin-bottom:   1.5rem   (below H2; 0.75rem below H3)
  --footer-margin-top:       5rem     (above footer)

SPACING — FIXED VALUES
  Page content gap:   60px (40px mobile)    (.content grid gap)
  Posts feed gap:     0 (dividers via border-bottom)
  Subject grid gap:   1.25rem               (6-col notes index)
  Scroll offset:      scroll-padding-top: 80px; scroll-margin-top: 100px
  Code block padding: 1.25rem
  Table cell padding: 0.75rem 1rem
  Callout padding:    1rem 1.5rem
  Blockquote padding: 1rem 1.5rem
  KaTeX padding:      1.5rem 1rem
  Footer padding:     1rem 0; margin-top: auto (sticky); links gap 1.5rem
```

---

## 15. Patterns to Follow When Adding New Components

### Pattern: New Card Type
1. Use `background: var(--bg-card)`, `border: 1px solid var(--border)`, `border-radius: 4px`
2. Choose hover pattern: `translateX(4px)` for list items, `translateY(-4px)` for grid items
3. Title in Inter 600, meta in JetBrains Mono uppercase with `--dim` color
4. Add `transition: all 0.3s`

### Pattern: New Callout Type
1. Pick a semantic color not already in heavy use
2. Add CSS: `.callout-{type} { background: rgba(R,G,B,0.08-0.1); border-color: #{hex}; }`
3. Add to `callouts.js` processing regex
4. Title uses that color, content uses `--text-secondary`

### Pattern: New Section/Page
1. Use `var(--max-width-wide)` for index/grid pages, `var(--max-width-content)` for reading pages
2. Follow breadcrumb pattern: Notes / Subject / Sub-subject / Title
3. Add appropriate layout file in `_layouts/`
4. Use CSS custom properties — never hardcode colors

### Pattern: Interactive Visualization
1. Container: `background: var(--bg-card)`, `border: 1px solid var(--border)`, `border-radius: 4px`
2. Canvas/SVG area: `background: var(--bg)` or `--graph-grid` (#181818)
3. Labels: JetBrains Mono, font-size `var(--text-xs)`, color `--dim`
4. Primary data: `--accent` (#4ade80), secondary: `--graph-line-2` (#60a5fa)
5. Controls: match slide-viewer button style (border, hover → accent)
6. Wrap in a module JS file, check `typeof` before init in `main.js`

### Pattern: SVG Diagram Text
1. Standard viewBox width: `SVG_W = 800` (matches ~800px CSS content area, so 1 SVG unit ≈ 1 CSS px)
2. Font sizes use 4 named constants: `SVG_XS` (10), `SVG_SM` (11), `SVG_BASE` (12), `SVG_LG` (14)
3. Font families use `F_MONO` / `F_SANS` constants — never inline font-family strings
4. Dynamic-width diagrams use `Math.max(SVG_W, computed)` to prevent text blowup from scaling
5. To change all diagram text sizes, edit the 4 constants at the top of `visual-diagrams.js`

### Pattern: New Markdown Extension
1. Create JS module in `assets/js/`
2. Register in `main.js` initialization sequence
3. Process markdown-generated HTML DOM (not raw markdown)
4. Guard with `typeof functionName !== 'undefined'`
5. Document syntax in this skill under Section 9
