/**
 * AI Research Blog - Main JavaScript
 * 
 * This is a lightweight orchestrator that initializes all modules.
 * The actual functionality is split into focused modules:
 * 
 * - toc.js: Table of contents, reading progress
 * - callouts.js: GitHub-style callout blocks
 * - code-runner.js: Runnable Python code (Pyodide)
 * - code-enhancements.js: Copy buttons, line numbers, collapsible code
 * - mermaid-init.js: Mermaid diagram rendering
 * - post-interactions.js: Share, like, comments
 * - embeds.js: HuggingFace, video embeds
 * - utils.js: Table wrappers, math tooltips
 * - citations.js: Academic citations with References section
 * - cross-references.js: Figure/table/equation referencing
 * - inline-formatting.js: Highlights, keyboard shortcuts
 * - latex-enhancements.js: Theorem numbering, equation features
 * - backlinks.js: Post backlink detection
 * - image-compare.js: Before/after image comparison
 * - lightbox.js: Image lightbox
 * - pdf-export.js: Export to PDF
 * - presentation.js: Presentation mode
 * - semantic-search.js: AI-powered search
 * - graph.js: Knowledge graph visualization
 * - slide-viewer.js: PDF slide viewer with fullscreen support
 */

document.addEventListener('DOMContentLoaded', () => {
  // Diagrams (must run first before Prism)
  if (typeof initMermaidDiagrams !== 'undefined') initMermaidDiagrams();

  // Code highlighting
  if (typeof enableLineNumbers !== 'undefined') enableLineNumbers();
  if (typeof addCopyButtons !== 'undefined') addCopyButtons();

  // Navigation
  if (typeof buildTableOfContents !== 'undefined') buildTableOfContents();

  // Content processing
  if (typeof wrapTables !== 'undefined') wrapTables();
  if (typeof processCallouts !== 'undefined') processCallouts();

  // Academic features (run after content processing)
  if (typeof initInlineFormatting !== 'undefined') initInlineFormatting();
  if (typeof initCrossReferences !== 'undefined') initCrossReferences();
  if (typeof initCitations !== 'undefined') initCitations();
  if (typeof initLatexEnhancements !== 'undefined') initLatexEnhancements();

  // Reading experience
  if (typeof initReadingProgress !== 'undefined') initReadingProgress();

  // Embeds
  if (typeof initHuggingFaceEmbeds !== 'undefined') initHuggingFaceEmbeds();
  if (typeof initVideoEmbeds !== 'undefined') initVideoEmbeds();

  // Interactive code
  if (typeof initRunnableCodeBlocks !== 'undefined') initRunnableCodeBlocks();
  if (typeof initCollapsibleCode !== 'undefined') initCollapsibleCode();

  // Math
  if (typeof initInteractiveMath !== 'undefined') initInteractiveMath();

  // Post interactions
  if (typeof initPostActions !== 'undefined') initPostActions();
  if (typeof initLikeButtons !== 'undefined') initLikeButtons();

  // Visual enhancements
  if (typeof initImageCompare !== 'undefined') initImageCompare();
  if (typeof initLightbox !== 'undefined') initLightbox();
  if (typeof initCategoryNav !== 'undefined') initCategoryNav();

  // Knowledge management
  if (typeof initBacklinks !== 'undefined') initBacklinks();

  // Slide viewer
  if (typeof initSlideViewers !== 'undefined') initSlideViewers();
});

