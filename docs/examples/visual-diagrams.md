# Visual Diagrams — Reference Examples

> Dev reference. Not a published post. Every diagram type rendered by `visual-diagrams.js` with copy-paste configs.

## Line Chart — Training Curves

The most common ML visualization: tracking loss over epochs.

<div class="visual-diagram" data-type="line-chart" data-config='{
  "title": "Training & Validation Loss",
  "caption": "Model converges around epoch 60, slight overfitting visible after epoch 80",
  "xLabel": "Epoch",
  "yLabel": "Loss",
  "xTicks": 10,
  "yTicks": 5,
  "showGrid": true,
  "showLegend": true,
  "lines": [
    {
      "label": "Train Loss",
      "data": [[0,2.5],[10,2.1],[20,1.7],[30,1.3],[40,1.0],[50,0.75],[60,0.55],[70,0.4],[80,0.3],[90,0.22],[100,0.18]],
      "color": 1,
      "fill": true
    },
    {
      "label": "Val Loss",
      "data": [[0,2.6],[10,2.2],[20,1.85],[30,1.5],[40,1.25],[50,1.05],[60,0.9],[70,0.82],[80,0.78],[90,0.76],[100,0.75]],
      "color": 2,
      "dashed": true
    }
  ]
}'></div>

## Bar Chart — Model Benchmarks

Compare model performance across architectures:

<div class="visual-diagram" data-type="bar-chart" data-config='{
  "title": "ImageNet Top-1 Accuracy (%)",
  "caption": "Larger models and vision transformers consistently outperform CNNs",
  "xLabel": "Model",
  "yLabel": "Accuracy (%)",
  "bars": [
    { "label": "ResNet-50", "value": 76.1, "color": 1 },
    { "label": "EfficientNet-B0", "value": 77.1, "color": 2 },
    { "label": "ViT-B/16", "value": 81.2, "color": 3 },
    { "label": "DeiT-B", "value": 83.4, "color": 4 },
    { "label": "CLIP ViT-L", "value": 85.4, "color": 1 }
  ]
}'></div>

## Scatter Plot — Embedding Clusters

Visualize learned representations in 2D:

<div class="visual-diagram" data-type="scatter-plot" data-config='{
  "title": "t-SNE Embedding Space",
  "caption": "Three distinct clusters emerge after fine-tuning",
  "xLabel": "Dimension 1",
  "yLabel": "Dimension 2",
  "showGrid": true,
  "clusters": [
    {
      "label": "Dogs",
      "color": 1,
      "points": [[1.2,2.1],[1.5,2.3],[0.8,1.8],[1.1,2.5],[1.4,1.9],[0.9,2.2],[1.3,2.0]]
    },
    {
      "label": "Cats",
      "color": 2,
      "points": [[4.1,5.0],[4.3,4.7],[3.8,5.3],[4.0,4.9],[4.5,5.1],[3.9,4.8],[4.2,5.2]]
    },
    {
      "label": "Birds",
      "color": 3,
      "points": [[7.0,1.5],[7.3,1.8],[6.8,1.2],[7.1,1.6],[6.9,1.9],[7.4,1.3],[7.2,1.7]]
    }
  ]
}'></div>

## Pie Chart — Dataset Distribution

Show how your dataset is split:

<div class="visual-diagram" data-type="pie-chart" data-config='{
  "title": "COCO Dataset Split",
  "caption": "Standard 70/15/15 split for training, validation, and testing",
  "donut": true,
  "slices": [
    { "label": "Train", "value": 118287, "color": 1 },
    { "label": "Val", "value": 5000, "color": 2 },
    { "label": "Test", "value": 40670, "color": 3 }
  ]
}'></div>

## Heatmap — Attention Weights

Visualize self-attention patterns:

<div class="visual-diagram" data-type="heatmap" data-config='{
  "title": "Self-Attention Weights (Head 3)",
  "caption": "\"sat\" strongly attends to \"cat\" (its subject) — a syntactic relation",
  "xLabels": ["The", "cat", "sat", "on", "mat"],
  "yLabels": ["The", "cat", "sat", "on", "mat"],
  "data": [
    [0.82, 0.08, 0.04, 0.03, 0.03],
    [0.05, 0.72, 0.12, 0.06, 0.05],
    [0.03, 0.45, 0.35, 0.10, 0.07],
    [0.02, 0.06, 0.10, 0.72, 0.10],
    [0.02, 0.04, 0.08, 0.12, 0.74]
  ],
  "colorScale": "green"
}'></div>

## Flowchart — Training Pipeline

Describe an ML pipeline as a flow:

<div class="visual-diagram" data-type="flowchart" data-config='{
  "title": "Model Training Pipeline",
  "caption": "Standard ML workflow from raw data to deployed model",
  "direction": "TB",
  "nodes": [
    { "id": "data", "label": "Raw Data", "shape": "rounded" },
    { "id": "clean", "label": "Data Cleaning", "shape": "rounded" },
    { "id": "split", "label": "Train/Val/Test\nSplit", "shape": "diamond" },
    { "id": "aug", "label": "Augmentation", "shape": "rounded" },
    { "id": "train", "label": "Train Model", "shape": "rounded" },
    { "id": "eval", "label": "Evaluate", "shape": "rounded", "accent": true }
  ],
  "edges": [
    { "from": "data", "to": "clean" },
    { "from": "clean", "to": "split" },
    { "from": "split", "to": "aug", "label": "Train" },
    { "from": "split", "to": "eval", "label": "Test", "dashed": true },
    { "from": "aug", "to": "train" },
    { "from": "train", "to": "eval" }
  ]
}'></div>

## Architecture — Transformer Block

Visualize model architectures with skip connections:

<div class="visual-diagram" data-type="architecture" data-config='{
  "title": "Transformer Encoder Block",
  "caption": "Standard encoder block with multi-head attention, FFN, and residual connections",
  "blocks": [
    { "id": "input", "label": "Input\nEmbedding", "color": 1, "row": 0 },
    { "id": "attn", "label": "Multi-Head\nSelf-Attention", "color": 2, "row": 1 },
    { "id": "norm1", "label": "Add & LayerNorm", "color": "dim", "row": 2 },
    { "id": "ffn", "label": "Feed-Forward\nNetwork", "color": 3, "row": 3 },
    { "id": "norm2", "label": "Add & LayerNorm", "color": "dim", "row": 4 },
    { "id": "output", "label": "Output", "color": 1, "row": 5 }
  ],
  "connections": [
    { "from": "input", "to": "attn" },
    { "from": "attn", "to": "norm1" },
    { "from": "input", "to": "norm1", "skip": true, "label": "residual" },
    { "from": "norm1", "to": "ffn" },
    { "from": "ffn", "to": "norm2" },
    { "from": "norm1", "to": "norm2", "skip": true, "label": "residual" },
    { "from": "norm2", "to": "output" }
  ]
}'></div>

## Neural Network — MLP Visualization

See the structure of a multi-layer perceptron:

<div class="visual-diagram" data-type="neural-net" data-config='{
  "title": "Classifier MLP",
  "caption": "4-layer MLP with ReLU activation for image classification",
  "layers": [
    { "name": "Input (784)", "nodes": 6, "type": "input" },
    { "name": "Hidden 1", "nodes": 8, "type": "hidden" },
    { "name": "Hidden 2", "nodes": 6, "type": "hidden" },
    { "name": "Output (10)", "nodes": 4, "type": "output" }
  ],
  "showLabels": true,
  "activation": "ReLU"
}'></div>

## Timeline — Transformer History

Track the evolution of a research area:

<div class="visual-diagram" data-type="timeline" data-config='{
  "title": "Evolution of Transformers",
  "caption": "From the original paper to modern LLMs in just 7 years",
  "direction": "horizontal",
  "events": [
    { "date": "2017", "title": "Transformer", "desc": "Attention Is All You Need", "color": 1 },
    { "date": "2018", "title": "BERT", "desc": "Bidirectional pretraining", "color": 2 },
    { "date": "2020", "title": "GPT-3", "desc": "175B parameters", "color": 3 },
    { "date": "2022", "title": "ChatGPT", "desc": "RLHF + Instruct tuning", "color": 4 },
    { "date": "2024", "title": "GPT-4o", "desc": "Multimodal native", "color": 1 }
  ]
}'></div>

And the same data as a vertical timeline:

<div class="visual-diagram" data-type="timeline" data-config='{
  "title": "Key Milestones (Vertical)",
  "direction": "vertical",
  "events": [
    { "date": "Jun 2017", "title": "Attention Is All You Need", "desc": "Vaswani et al. — original Transformer", "color": 1 },
    { "date": "Oct 2018", "title": "BERT Released", "desc": "Bidirectional encoder pretraining", "color": 2 },
    { "date": "Jun 2020", "title": "GPT-3 Paper", "desc": "175B params, few-shot learning", "color": 3 },
    { "date": "Nov 2022", "title": "ChatGPT Launch", "desc": "RLHF-tuned GPT-3.5", "color": 4 }
  ]
}'></div>

## Comparison — CNN vs Transformer

Side-by-side comparison of approaches:

<div class="visual-diagram" data-type="comparison" data-config='{
  "title": "CNN vs Vision Transformer",
  "caption": "Key architectural differences between convolutional and attention-based vision models",
  "items": [
    {
      "title": "CNN (ResNet)",
      "color": 1,
      "points": [
        "Local receptive field",
        "Translation equivariant",
        "Fewer parameters",
        "Fast inference",
        "Strong inductive bias",
        "Works well with small data"
      ]
    },
    {
      "title": "ViT (Transformer)",
      "color": 2,
      "points": [
        "Global self-attention",
        "Learned position embeddings",
        "More parameters",
        "Parallelizable training",
        "Minimal inductive bias",
        "Needs large-scale pretraining"
      ]
    }
  ]
}'></div>

## Pipeline — Data Processing

Show sequential processing stages:

<div class="visual-diagram" data-type="pipeline" data-config='{
  "title": "MLOps Pipeline",
  "caption": "End-to-end ML pipeline from data ingestion to model serving",
  "stages": [
    { "label": "Ingest", "color": 1 },
    { "label": "Validate", "color": 2 },
    { "label": "Transform", "color": 3 },
    { "label": "Train", "color": 4 },
    { "label": "Evaluate", "color": 2 },
    { "label": "Deploy", "color": 1 }
  ]
}'></div>

## Tree — Decision Tree

Visualize tree-based models:

<div class="visual-diagram" data-type="tree" data-config='{
  "title": "Loan Approval Decision Tree",
  "caption": "Simplified decision boundary for credit approval",
  "root": {
    "label": "Credit Score > 700?",
    "children": [
      {
        "label": "Income > 50K?",
        "edge": "Yes",
        "children": [
          { "label": "APPROVE", "edge": "Yes", "accent": true },
          { "label": "Manual Review", "edge": "No" }
        ]
      },
      {
        "label": "Existing Debt?",
        "edge": "No",
        "children": [
          { "label": "DENY", "edge": "Yes", "color": 3 },
          { "label": "Manual Review", "edge": "No" }
        ]
      }
    ]
  }
}'></div>

## State Machine — Training Loop

Model state transitions:

<div class="visual-diagram" data-type="state-machine" data-config='{
  "title": "Training State Machine",
  "caption": "States and transitions in a typical training loop with early stopping",
  "states": [
    { "id": "init", "label": "Init", "initial": true },
    { "id": "train", "label": "Training" },
    { "id": "eval", "label": "Evaluating" },
    { "id": "save", "label": "Checkpoint" },
    { "id": "done", "label": "Done", "final": true }
  ],
  "transitions": [
    { "from": "init", "to": "train", "label": "start()" },
    { "from": "train", "to": "eval", "label": "epoch_end" },
    { "from": "eval", "to": "train", "label": "continue" },
    { "from": "eval", "to": "save", "label": "best_loss" },
    { "from": "save", "to": "train", "label": "resume" },
    { "from": "eval", "to": "done", "label": "converged" }
  ]
}'></div>

## Venn Diagram — Concept Overlaps

Show relationships between concepts:

<div class="visual-diagram" data-type="venn" data-config='{
  "title": "ML Paradigms",
  "caption": "Overlap between major machine learning approaches",
  "sets": [
    { "label": "Supervised", "color": 1 },
    { "label": "Unsupervised", "color": 2 },
    { "label": "Reinforcement", "color": 3 }
  ],
  "intersections": [
    { "sets": [0, 1], "label": "Semi-supervised" },
    { "sets": [1, 2], "label": "Exploration" },
    { "sets": [0, 2], "label": "Imitation" },
    { "sets": [0, 1, 2], "label": "Foundation\nModels" }
  ]
}'></div>

---

## Usage Reference

Every diagram follows the same pattern:

```html
<div class="visual-diagram" 
     data-type="TYPE" 
     data-config='{ JSON_CONFIG }'>
</div>
```

Each diagram automatically gets:
- A **header** with type icon, label, and title
- **Download SVG** button
- **Fullscreen** button
- Optional **caption** below

> [!TIP]
> All diagrams use the blog's 4-color system: green (primary), blue (secondary), pink (tertiary), orange (quaternary). Use `"color": 1` through `"color": 4` in your configs.

---

*All diagrams rendered client-side by `visual-diagrams.js` — zero external dependencies.*
