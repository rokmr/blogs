# Image & Visual Rules

## Decision Matrix

| Content Type | Method | Why |
|---|---|---|
| **Math plots** (activation fns, loss curves, schedulers, bias-variance) | `visual-diagram` `line-chart` | Reproducible, dark-themed, interactive, no external dependency |
| **Paper architecture figures** (RCNN, DETR, BiRefNet, YOLO, etc.) | Self-hosted image in `assets/img/notes/{subject}/` | Irreplaceable paper figures — can't be meaningfully recreated as SVG |
| **Conceptual diagrams** (pipelines, flowcharts, comparisons, trees) | `visual-diagram` (flowchart, architecture, tree, comparison, pipeline) | Better quality than raster, matches site theme |
| **3rd-party blog images** (Medium, WordPress, etc.) | **Remove** — replace with visual-diagram or omit | Fragile URLs, potential copyright, off-brand styling |
| **Wikipedia/Wikimedia images** | Case-by-case: replace with visual-diagram if possible, otherwise self-host with attribution | CC-licensed but off-brand |
| **GeoGebra** | Embed via iframe for interactive math (coordinate geometry, 3D plots) | When interactivity adds value over static SVG |

## Image Path Convention

```
assets/img/notes/{subject}/{sub-subject}/{filename}.png
```

Examples:
```
assets/img/notes/cv/object-detection/rcnn-overview.png
assets/img/notes/cv/segmentation/birefnet-arch.png
assets/img/notes/deep-learning/optimization/focal-loss.png
```

## Markdown Pattern

```markdown
![RCNN Architecture Overview]({{ '/assets/img/notes/cv/object-detection/rcnn-overview.png' | relative_url }})
{: .note-img}
```

## Rules

1. **Never hotlink** external URLs for critical content
2. **Prefer visual-diagram** over raster images when the content is data/charts/flows
3. **Always add alt text** to images
4. **Max width:** images render at `max-width: 100%` inside note content
5. **Paper figures:** download from your own GitHub repos, commit to `assets/img/`
6. **Captions:** use `<figcaption>` or diagram `caption` field
