# Slide Viewer Feature Guide

The slide viewer allows you to embed PDF slides directly in your notes with an interactive viewer and fullscreen support.

## Features

- 📄 **PDF Rendering**: Uses PDF.js for high-quality rendering
- 🎯 **Navigation**: Previous/next buttons, page input, keyboard shortcuts
- 🔍 **Zoom Controls**: Zoom in/out with +/- buttons
- 🖥️ **Fullscreen Mode**: View slides in fullscreen with dedicated button
- 📥 **Download**: Direct download button for the PDF
- ⌨️ **Keyboard Shortcuts**: Navigate with arrow keys, spacebar, and more
- 📱 **Responsive**: Works on mobile and desktop

## Usage

### Method 1: Frontmatter (Recommended)

Add slides to your note's frontmatter:

```yaml
---
title: "My Lecture Notes"
slides:
  - title: "Lecture Slides"
    url: "/path/to/slides.pdf"
  - title: "Supplementary Material"
    url: "/path/to/supplement.pdf"
---
```

The slides will automatically appear in a "Lecture Slides" section after your content.

### Method 2: Inline HTML

Embed slides anywhere in your markdown:

```html
<div class="slide-viewer" data-pdf="/path/to/slides.pdf" data-title="My Slides"></div>
```

## Path Options

### 1. Local Files (Relative to Jekyll site)

For PDFs in your repository:

```yaml
slides:
  - title: "Lecture 01"
    url: "/blogs/_notes/rl/CS224R/resources/01_cs224r_intro_2025.pdf"
```

### 2. External URLs

For PDFs hosted elsewhere:

```yaml
slides:
  - title: "Stanford Lecture"
    url: "https://cs224r.stanford.edu/slides/01_cs224r_intro_2025.pdf"
```

### 3. Asset Directory

Store PDFs in assets folder:

```yaml
slides:
  - title: "Tutorial"
    url: "/blogs/assets/slides/tutorial.pdf"
```

## File Organization

Recommended structure for course notes:

```
_notes/
  rl/
    CS224R/
      01_cs224r_intro_2025.md
      02_cs224r_imitation_2025.md
      resources/
        01_cs224r_intro_2025.pdf
        02_cs224r_imitation_2025.pdf
```

Or use a centralized assets folder:

```
assets/
  slides/
    rl/
      cs224r_01.pdf
      cs224r_02.pdf
```

## Keyboard Shortcuts

When the slide viewer is visible:

| Key | Action |
|-----|--------|
| `←` or `↑` | Previous slide |
| `→` or `↓` or `Space` | Next slide |
| `Home` | First slide |
| `End` | Last slide |
| `f` or `F` | Toggle fullscreen |

## Controls

### Toolbar Buttons

- **◄ / ►**: Navigate between slides
- **- / +**: Zoom out / Zoom in
- **⛶**: Toggle fullscreen mode
- **↓**: Download PDF

### Page Navigation

- Click the page number input to jump to a specific slide
- Format: `[input box] / [total pages]`

## Styling

The slide viewer automatically adapts to your site's theme:

- Light/dark mode support
- Responsive design for mobile
- Fullscreen mode with dark background
- Print-friendly (hides controls)

## Example: Complete Note with Slides

```markdown
---
title: "Lec 01 - Introduction to RL"
date: 2025-01-15
description: "Core concepts and fundamentals"
tags: [reinforcement-learning, cs224r]
math: true
slides:
  - title: "Lecture 01 - Introduction to RL"
    url: "/blogs/_notes/rl/CS224R/resources/01_cs224r_intro_2025.pdf"
references:
  - title: "Lecture Video"
    url: "https://www.youtube.com/watch?v=..."
    authors: "Chelsea Finn, Sergey Levine"
    venue: "CS224R Stanford"
    year: 2025
---

# Introduction to RL

Your lecture notes content here...

## Core Concepts

More content...

<!-- Slides will appear automatically after content -->
<!-- References will appear after slides -->
```

## Multiple Slide Decks

You can include multiple slide decks in one note:

```yaml
slides:
  - title: "Main Lecture"
    url: "/path/to/main-lecture.pdf"
  - title: "Supplementary Material"
    url: "/path/to/supplement.pdf"
  - title: "Additional Readings"
    url: "/path/to/readings.pdf"
```

Each will render as a separate viewer with its own controls.

## Advanced: Inline Placement

For precise control over where slides appear:

```markdown
## Theory Section

Some theory content...

<div class="slide-viewer" data-pdf="/path/to/theory-slides.pdf" data-title="Theory Slides"></div>

## Practice Section

Some practice content...

<div class="slide-viewer" data-pdf="/path/to/practice-slides.pdf" data-title="Practice Examples"></div>
```

## Browser Compatibility

The slide viewer works in all modern browsers:

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

PDF.js is loaded dynamically from CDN, so no additional setup is required.

## Performance Tips

1. **File Size**: Keep PDFs under 10MB for best performance
2. **Compression**: Use PDF compression tools to reduce file size
3. **External Hosting**: For large PDFs, consider hosting on external services
4. **Lazy Loading**: Slides load only when the viewer is initialized

## Troubleshooting

### Slides Not Loading

1. Check the PDF path is correct
2. Verify the PDF is accessible (check in browser directly)
3. Look for console errors in browser DevTools
4. Ensure PDF is not password-protected

### Path Issues

If slides don't load, try different path formats:

```yaml
# Try absolute path
url: "/blogs/_notes/rl/CS224R/resources/slide.pdf"

# Try relative path (from site root)
url: "_notes/rl/CS224R/resources/slide.pdf"

# Try baseurl-aware
url: "{{ site.baseurl }}/_notes/rl/CS224R/resources/slide.pdf"
```

### Cross-Origin Issues

If loading external PDFs:

- Ensure the server allows CORS
- Consider downloading and hosting locally
- Use a proxy service if needed

## Customization

### Custom Styling

Override default styles in your CSS:

```css
/* Custom slide viewer appearance */
.slide-viewer {
  border: 2px solid #your-color;
  border-radius: 12px;
}

.slide-viewer-toolbar {
  background: #your-background;
}

.slide-btn {
  color: #your-color;
}
```

### Initial Settings

Modify `slide-viewer.js` to change defaults:

```javascript
// Change default zoom level
this.scale = 1.5;  // Change to 1.0, 2.0, etc.

// Change initial page
this.currentPage = 1;  // Start at different page
```

## Accessibility

The slide viewer includes:

- Keyboard navigation support
- ARIA labels on controls
- Focus management in fullscreen
- Screen reader friendly page indicators

## Related Features

- **References**: Add PDF links in references section
- **Lightbox**: View images in fullscreen
- **PDF Export**: Export your notes to PDF
- **Presentation Mode**: Present your notes as slides
