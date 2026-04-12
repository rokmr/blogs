# Visual Diagram Agent — Skill Definition

> An AI agent that generates inline visual elements (graphs, diagrams, flowcharts, neural network architectures, charts, timelines, state machines, etc.) for the rohit.vision/blogs site. Accepts **rough image descriptions**, **text explanations**, or **structured data** as input and outputs production-ready inline SVG/Canvas visuals that perfectly match the blog's dark design system.

---

## 0. Agent Purpose & Scope

| Property | Value |
|---|---|
| **Role** | Convert rough sketches/descriptions into styled visual elements |
| **Input** | Text description, rough image analysis, structured JSON data, or natural language |
| **Output** | Inline `<div>` blocks with `data-*` attributes that `visual-diagrams.js` renders into SVG/Canvas |
| **Design System** | Follows `.skills/frontend.md` exactly |
| **Integration** | Works in `_posts/*.md` and `_notes/**/*.md` via HTML blocks or `{% include diagram.html %}` |

---

## 1. Supported Visual Types

### 1.1 Chart Types

| Type Key | Visual | Use Case |
|---|---|---|
| `line-chart` | Line chart with axes, grid, legend | Training loss, metric curves |
| `bar-chart` | Vertical/horizontal bar chart | Comparisons, benchmarks |
| `scatter-plot` | Scatter plot with optional clusters | Data distributions, embeddings |
| `area-chart` | Filled area under line | Cumulative metrics, distributions |
| `pie-chart` | Donut/pie chart | Proportions, dataset splits |
| `heatmap` | Color-mapped grid | Attention matrices, confusion matrices |
| `radar-chart` | Spider/radar chart | Multi-metric comparison |

### 1.2 Diagram Types

| Type Key | Visual | Use Case |
|---|---|---|
| `flowchart` | Box-and-arrow flow diagram | Algorithms, pipelines, data flow |
| `architecture` | Layered block diagram | Model architectures, system design |
| `neural-net` | Neural network layer visualization | MLP, CNN, Transformer blocks |
| `tree` | Tree/hierarchy diagram | Decision trees, taxonomy |
| `timeline` | Horizontal/vertical timeline | Historical events, training phases |
| `state-machine` | State transition diagram | FSMs, Markov chains |
| `sequence` | Sequence diagram (vertical) | API calls, attention flow |
| `comparison` | Side-by-side comparison boxes | Model A vs B, approach comparison |
| `pipeline` | Horizontal pipeline with stages | ML pipeline, data processing |
| `matrix` | Labeled matrix/grid | Weight matrices, confusion matrices |
| `venn` | Venn diagram (2-3 circles) | Set relationships, concept overlaps |

### 1.3 Annotation Types

| Type Key | Visual | Use Case |
|---|---|---|
| `annotated-image` | Image with overlay labels/arrows | Pointing out features in screenshots |
| `equation-visual` | Visual representation of an equation | Geometric interpretation of math |
| `legend` | Standalone color-coded legend | Reference for multi-color visuals |

---

## 2. Design Tokens (MUST follow exactly)

All visuals inherit these tokens from the blog's CSS custom properties:

```
Background:        var(--bg-card) = #111111 (chart container)
Canvas Background: var(--bg) = #0a0a0a (inner drawing area)
Grid Lines:        var(--graph-grid) = #181818
Axis Lines:        var(--graph-axis) = #2a2a2a
Primary Color:     var(--graph-line-1) = #4ade80 (green)
Secondary Color:   var(--graph-line-2) = #60a5fa (blue)
Tertiary Color:    var(--graph-line-3) = #f472b6 (pink)
Quaternary Color:  var(--graph-line-4) = #fb923c (orange)
Fill:              var(--graph-fill) = rgba(74, 222, 128, 0.08)
Text/Labels:       var(--dim) = #666666
Title Text:        var(--text) = #e8e8e8
Border:            var(--border) = #222222
Accent:            var(--accent) = #4ade80
Font Labels:       var(--font-mono) = 'JetBrains Mono', monospace
Font Titles:       var(--font-sans) = 'Inter', sans-serif

Node Colors (neural nets):
  Input Layer:     var(--node-input) = #0d1a0d (green-tinted)
  Hidden Layer:    var(--node-hidden) = #0d0d1a (blue-tinted)
  Output Layer:    var(--node-output) = #1a0d0d (warm-tinted)
  Node Border:     var(--node-border) = #2a2a2a
```

---

## 3. Container Pattern

Every visual element follows this exact container pattern (matching mermaid-wrapper, code-block, embed-wrapper):

```html
<div class="visual-diagram" data-type="TYPE" data-config='JSON_CONFIG'>
  <!-- Rendered by visual-diagrams.js -->
</div>
```

After JS processing, becomes:

```html
<div class="visual-diagram-wrapper">
  <div class="visual-diagram-header">
    <svg><!-- type icon --></svg>
    <span class="visual-diagram-label">TYPE_LABEL</span>
    <span class="visual-diagram-title">OPTIONAL_TITLE</span>
    <div class="visual-diagram-actions">
      <button class="visual-diagram-action-btn" title="Download SVG">
        <svg><!-- download icon --></svg>
      </button>
      <button class="visual-diagram-action-btn" title="Fullscreen">
        <svg><!-- expand icon --></svg>
      </button>
    </div>
  </div>
  <div class="visual-diagram-body">
    <svg><!-- or <canvas> for complex charts --></svg>
  </div>
  <div class="visual-diagram-caption">OPTIONAL_CAPTION</div>
</div>
```

### 3.1 CSS Styling (follows embed-wrapper / mermaid-wrapper pattern)

```css
.visual-diagram-wrapper {
  margin: 1.5rem 0;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.visual-diagram-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
}

.visual-diagram-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--dim);
}

.visual-diagram-title {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid var(--border);
}

.visual-diagram-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.visual-diagram-action-btn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--dim);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-diagram-action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.visual-diagram-body {
  padding: 1.5rem;
  background: var(--bg-card);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  min-height: 200px;
}

.visual-diagram-body svg {
  max-width: 100%;
  height: auto;
}

.visual-diagram-caption {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  color: var(--dim);
  text-align: center;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  font-style: italic;
}
```

---

## 4. Data Configuration Schema

### 4.1 Line Chart

```json
{
  "type": "line-chart",
  "title": "Training Loss",
  "caption": "Loss decreases over 100 epochs",
  "xLabel": "Epoch",
  "yLabel": "Loss",
  "xTicks": 10,
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "Train Loss",
      "data": [[0,2.5],[20,1.8],[40,1.2],[60,0.8],[80,0.5],[100,0.3]],
      "color": 1,
      "dashed": false,
      "fill": true
    },
    {
      "label": "Val Loss",
      "data": [[0,2.6],[20,2.0],[40,1.5],[60,1.1],[80,0.9],[100,0.85]],
      "color": 2,
      "dashed": true,
      "fill": false
    }
  ]
}
```

**Color field:** `1` = `--graph-line-1` (green), `2` = blue, `3` = pink, `4` = orange. Or a hex string `"#custom"`.

### 4.2 Bar Chart

```json
{
  "type": "bar-chart",
  "title": "Model Comparison",
  "xLabel": "Model",
  "yLabel": "Accuracy (%)",
  "horizontal": false,
  "bars": [
    { "label": "ResNet-50", "value": 76.1, "color": 1 },
    { "label": "ViT-B/16", "value": 81.2, "color": 2 },
    { "label": "CLIP", "value": 85.4, "color": 3 }
  ]
}
```

### 4.3 Flowchart

```json
{
  "type": "flowchart",
  "title": "Training Pipeline",
  "direction": "TB",
  "nodes": [
    { "id": "data", "label": "Raw Data", "shape": "rect" },
    { "id": "preprocess", "label": "Preprocess", "shape": "rect" },
    { "id": "decision", "label": "Valid?", "shape": "diamond" },
    { "id": "train", "label": "Train Model", "shape": "rect" },
    { "id": "eval", "label": "Evaluate", "shape": "rect", "accent": true }
  ],
  "edges": [
    { "from": "data", "to": "preprocess" },
    { "from": "preprocess", "to": "decision" },
    { "from": "decision", "to": "train", "label": "Yes" },
    { "from": "decision", "to": "data", "label": "No", "dashed": true },
    { "from": "train", "to": "eval" }
  ]
}
```

**Node shapes:** `rect`, `rounded`, `diamond`, `circle`, `parallelogram`, `stadium`
**Direction:** `TB` (top→bottom), `LR` (left→right), `BT`, `RL`

### 4.4 Neural Network

```json
{
  "type": "neural-net",
  "title": "MLP Architecture",
  "layers": [
    { "name": "Input", "nodes": 4, "type": "input" },
    { "name": "Hidden 1", "nodes": 8, "type": "hidden" },
    { "name": "Hidden 2", "nodes": 6, "type": "hidden" },
    { "name": "Output", "nodes": 2, "type": "output" }
  ],
  "showWeights": false,
  "showLabels": true,
  "activation": "ReLU"
}
```

### 4.5 Architecture (Block Diagram)

```json
{
  "type": "architecture",
  "title": "Transformer Block",
  "blocks": [
    { "id": "input", "label": "Input\nEmbedding", "color": 1, "row": 0 },
    { "id": "attn", "label": "Multi-Head\nAttention", "color": 2, "row": 1 },
    { "id": "norm1", "label": "LayerNorm", "color": "dim", "row": 2 },
    { "id": "ffn", "label": "Feed\nForward", "color": 3, "row": 3 },
    { "id": "norm2", "label": "LayerNorm", "color": "dim", "row": 4 },
    { "id": "output", "label": "Output", "color": 1, "row": 5 }
  ],
  "connections": [
    { "from": "input", "to": "attn" },
    { "from": "attn", "to": "norm1" },
    { "from": "input", "to": "norm1", "skip": true, "label": "residual" },
    { "from": "norm1", "to": "ffn" },
    { "from": "ffn", "to": "norm2" },
    { "from": "norm1", "to": "norm2", "skip": true, "label": "residual" }
  ]
}
```

### 4.6 Timeline

```json
{
  "type": "timeline",
  "title": "Transformer History",
  "direction": "horizontal",
  "events": [
    { "date": "2017", "title": "Attention Is All You Need", "desc": "Original Transformer", "color": 1 },
    { "date": "2018", "title": "BERT", "desc": "Bidirectional encoder", "color": 2 },
    { "date": "2020", "title": "GPT-3", "desc": "175B parameters", "color": 3 },
    { "date": "2022", "title": "ChatGPT", "desc": "RLHF revolution", "color": 4 }
  ]
}
```

### 4.7 Comparison

```json
{
  "type": "comparison",
  "title": "CNN vs Transformer",
  "items": [
    {
      "title": "CNN",
      "color": 1,
      "points": [
        "Local receptive field",
        "Translation invariant",
        "Fewer parameters",
        "Fast inference"
      ]
    },
    {
      "title": "Transformer",
      "color": 2,
      "points": [
        "Global attention",
        "Position embeddings",
        "More parameters",
        "Parallelizable"
      ]
    }
  ]
}
```

### 4.8 Pipeline

```json
{
  "type": "pipeline",
  "title": "Data Processing Pipeline",
  "stages": [
    { "label": "Ingest", "icon": "download", "color": 1 },
    { "label": "Clean", "icon": "filter", "color": 2 },
    { "label": "Transform", "icon": "shuffle", "color": 3 },
    { "label": "Train", "icon": "cpu", "color": 4 },
    { "label": "Deploy", "icon": "rocket", "color": 1 }
  ]
}
```

### 4.9 Heatmap / Matrix

```json
{
  "type": "heatmap",
  "title": "Attention Weights",
  "xLabels": ["The", "cat", "sat", "on", "mat"],
  "yLabels": ["The", "cat", "sat", "on", "mat"],
  "data": [
    [0.8, 0.1, 0.05, 0.03, 0.02],
    [0.1, 0.7, 0.1, 0.05, 0.05],
    [0.05, 0.1, 0.6, 0.15, 0.1],
    [0.03, 0.05, 0.15, 0.7, 0.07],
    [0.02, 0.05, 0.1, 0.07, 0.76]
  ],
  "colorScale": "green"
}
```

**Color scales:** `"green"` (black→accent), `"blue"` (black→blue), `"diverging"` (blue→white→red)

### 4.10 Tree

```json
{
  "type": "tree",
  "title": "Decision Tree",
  "root": {
    "label": "Age > 30?",
    "children": [
      {
        "label": "Income > 50K?",
        "edge": "Yes",
        "children": [
          { "label": "Approve", "edge": "Yes", "accent": true },
          { "label": "Review", "edge": "No" }
        ]
      },
      {
        "label": "Deny",
        "edge": "No",
        "color": 3
      }
    ]
  }
}
```

### 4.11 Scatter Plot

```json
{
  "type": "scatter-plot",
  "title": "Embedding Space",
  "xLabel": "Dim 1",
  "yLabel": "Dim 2",
  "showGrid": true,
  "clusters": [
    { "label": "Class A", "color": 1, "points": [[1,2],[1.5,2.3],[0.8,1.8]] },
    { "label": "Class B", "color": 2, "points": [[4,5],[4.2,4.8],[3.8,5.2]] }
  ]
}
```

### 4.12 Pie / Donut Chart

```json
{
  "type": "pie-chart",
  "title": "Dataset Split",
  "donut": true,
  "slices": [
    { "label": "Train", "value": 70, "color": 1 },
    { "label": "Val", "value": 15, "color": 2 },
    { "label": "Test", "value": 15, "color": 3 }
  ]
}
```

### 4.13 Venn Diagram

```json
{
  "type": "venn",
  "title": "NLP Concepts",
  "sets": [
    { "label": "NLU", "color": 1 },
    { "label": "NLG", "color": 2 },
    { "label": "Dialogue", "color": 3 }
  ],
  "intersections": [
    { "sets": [0, 1], "label": "Translation" },
    { "sets": [0, 1, 2], "label": "Chatbots" }
  ]
}
```

### 4.14 State Machine

```json
{
  "type": "state-machine",
  "title": "Training State",
  "states": [
    { "id": "init", "label": "Init", "initial": true },
    { "id": "train", "label": "Training" },
    { "id": "eval", "label": "Evaluating" },
    { "id": "done", "label": "Done", "final": true }
  ],
  "transitions": [
    { "from": "init", "to": "train", "label": "start()" },
    { "from": "train", "to": "eval", "label": "epoch_end" },
    { "from": "eval", "to": "train", "label": "continue" },
    { "from": "eval", "to": "done", "label": "converged" }
  ]
}
```

---

## 5. Usage in Markdown

### 5.1 Inline HTML Block (Direct)

```html
<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Training Curves",
  "lines": [
    {"label": "Loss", "data": [[0,2.5],[50,0.8],[100,0.3]], "color": 1, "fill": true}
  ],
  "xLabel": "Epoch",
  "yLabel": "Loss"
}'></div>
```

### 5.2 Jekyll Include (Recommended for complex configs)

```liquid
{% include diagram.html type="flowchart" title="Pipeline" config=page.pipeline_config %}
```

With frontmatter:
```yaml
pipeline_config:
  nodes:
    - { id: a, label: "Step 1", shape: rect }
    - { id: b, label: "Step 2", shape: rect }
  edges:
    - { from: a, to: b }
```

### 5.3 Markdown Code Block (Processed by JS)

~~~markdown
```diagram-flowchart
title: Training Pipeline
nodes:
  - id: data
    label: Raw Data
  - id: train
    label: Train
edges:
  - from: data
    to: train
```
~~~

The JS module detects `language-diagram-*` code blocks and renders them.

---

## 6. Agent Workflow

When the user provides input (rough image, text description, etc.), the agent should:

### Step 1: Identify Visual Type
- Analyze the input (text or image description)
- Map to the closest `data-type` from the supported types
- If ambiguous, ask the user

### Step 2: Extract Data
- Parse specific data points, labels, relationships
- Map colors to the 4-color system (green=primary, blue=secondary, pink=tertiary, orange=quaternary)
- Determine appropriate dimensions

### Step 3: Generate Config
- Build the JSON config object following the exact schema
- Use sensible defaults (renderers default to `SVG_W=800` width; heights vary by type)
- Always include title and caption

### Step 4: Output HTML Block
- Output the `<div class="visual-diagram" ...>` block
- The user pastes this into their markdown file
- `visual-diagrams.js` handles rendering on page load

### Step 5: Verify
- Confirm the visual matches the user's intent
- Iterate if needed

---

## 7. Rendering Rules

### 7.1 SVG Coordinate System & Font Scale

All diagrams use a **standard viewBox width of `SVG_W = 800`** units. Since the CSS content area is ~800px, **1 SVG unit ≈ 1 CSS pixel** — no scaling distortion.

Dynamic-width diagrams (flowchart, tree, state-machine, etc.) use `Math.max(SVG_W, computed)` so the viewBox is never smaller than 800, preventing text from blowing up when the SVG is scaled to fill the container.

**Font size tokens** (defined as JS constants at the top of `visual-diagrams.js`):

| Token | Value | Rendered | Use |
|---|---|---|---|
| `SVG_XS` | `10` | ~10px | Annotations: edge labels, step numbers, unit counts, transition labels |
| `SVG_SM` | `11` | ~11px | Data: tick values, axis tick numbers, legends, cell values |
| `SVG_BASE` | `12` | ~12px | Primary: axis labels, node text, block labels, dates |
| `SVG_LG` | `14` | ~14px | Emphasis: comparison column titles, donut center number |

**Font family constants:**
- `F_MONO = "'JetBrains Mono', monospace"` — data values, labels, code-like text
- `F_SANS = "'Inter', sans-serif"` — titles, node labels, descriptive text

**Rules:**
- **Never use raw font-size strings** in `svgEl()` calls — always use `SVG_XS` / `SVG_SM` / `SVG_BASE` / `SVG_LG`
- **Never use raw font-family strings** — always use `F_MONO` / `F_SANS`
- To change all diagram typography, edit the 4 size constants + 2 family constants

### 7.2 Additional SVG Standards

1. **Stroke widths:** Lines = `2px`, Axes = `1.5px`, Grid = `0.5px`, Borders = `1px`
2. **Border radius:** Nodes = `4px`, Charts container = inner `0` (container has `4px`)
3. **Margins:** Chart area padded `30px` top, `60px` left (for y-axis), `30px` right, `50px` bottom (for x-axis)
4. **Animations:** Subtle fade-in on load (`opacity 0→1, 0.5s ease`), line draw for line charts

### 7.3 Color Priority

When multiple data series exist, always assign colors in this priority order:
1. `--graph-line-1` (#4ade80) — primary/most important
2. `--graph-line-2` (#60a5fa) — secondary/comparison
3. `--graph-line-3` (#f472b6) — tertiary/highlight
4. `--graph-line-4` (#fb923c) — quaternary/auxiliary

### 7.4 Responsive Behavior

- SVGs use `viewBox` + `style="width:100%;height:auto;"` and scale with container
- Standard viewBox width of 800 means text stays proportional at any container size
- On mobile (`<=768px`), legends move below the chart
- Flowcharts/architectures: horizontal direction switches to vertical on narrow screens
- Minimum touch targets: `44px` for interactive elements

### 7.5 Accessibility

- All SVGs include `<title>` and `<desc>` elements
- Color is never the only differentiator (also use dashes, shapes, labels)
- ARIA labels on interactive elements
- Sufficient contrast (all colors pass AA against `#111111` background)

---

## 8. Integration with Existing System

### 8.1 Module Registration

In `main.js`, add:
```js
if (typeof initVisualDiagrams !== 'undefined') initVisualDiagrams();
```

### 8.2 Script Loading

In `default.html`, add before main.js:
```html
<script defer src="{{ '/assets/js/visual-diagrams.js' | relative_url }}"></script>
```

### 8.3 CSS

All styles go into `assets/css/main.css` under a new section:
```css
/* ========================================
   Visual Diagrams (Charts, Flowcharts, Neural Nets)
   ======================================== */
```

### 8.4 Dual Selector Support

Like all other modules, visual-diagrams.js queries both content areas:
```js
const content = document.querySelector('.post-content') || document.querySelector('.note-content');
```

And processes `code.language-diagram-*` blocks in both contexts:
```js
document.querySelectorAll(
  '.post-content code[class*="language-diagram-"], .note-content code[class*="language-diagram-"]'
);
```

---

## 9. Examples for Common Requests

### "Draw me a training loss curve"
→ `line-chart` with 1-2 lines (train/val), x=Epoch, y=Loss, fill on train

### "Show the transformer architecture"
→ `architecture` with blocks: Input Embed → Multi-Head Attention → Add & Norm → FFN → Add & Norm → Output, with skip connections

### "Compare BERT vs GPT"
→ `comparison` type with two columns listing key differences

### "Show the ML pipeline"
→ `pipeline` type with stages: Data → Preprocess → Feature Eng → Model → Eval → Deploy

### "Visualize a 3-layer neural network"
→ `neural-net` type with layers [input=4, hidden=8, hidden=4, output=2]

### "Attention heatmap for 'the cat sat'"
→ `heatmap` type with 5x5 grid, green color scale

### "Timeline of NLP breakthroughs"
→ `timeline` type with events, horizontal direction

### "Decision tree for classification"
→ `tree` type with nested node structure

---

## 10. Error Handling

If config is malformed:
```html
<div class="visual-diagram-error">
  <svg><!-- warning icon --></svg>
  <span>Failed to render diagram: [error message]</span>
</div>
```

Styled:
```css
.visual-diagram-error {
  padding: 1rem;
  color: var(--danger-border);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

---

## 11. Download / Export

Each diagram includes a download button that:
1. Serializes the SVG element
2. Creates a blob URL
3. Triggers download as `.svg` file
4. Filename: `{title-slugified}.svg`

Fullscreen button:
1. Wraps the diagram body in a fixed overlay (same pattern as lightbox)
2. Scales SVG to fit viewport
3. ESC or click outside to close
