/**
 * AI Research Blog - Main JavaScript
 * Features: TOC, Callout blocks, HuggingFace embeds, Mermaid diagrams,
 *           Interactive math tooltips, Copy buttons, Code editing, Post actions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMermaidDiagrams();
  enableLineNumbers();
  addCopyButtons();
  buildTableOfContents();
  wrapTables();
  processCallouts();
  initReadingProgress();
  initHuggingFaceEmbeds();
  initRunnableCodeBlocks();
  initInteractiveMath();
  initPostActions();
  initLikeButtons();
  // Phase 2: Visual Enhancements
  initVideoEmbeds();
  initCollapsibleCode();
  if (typeof initImageCompare !== 'undefined') initImageCompare();
  if (typeof initLightbox !== 'undefined') initLightbox();
  // Phase 1: Knowledge Management
  if (typeof initBacklinks !== 'undefined') initBacklinks();
});

/**
 * Enable line numbers on all code blocks using Prism.js
 * Must add class before Prism runs, then trigger highlight
 */
function enableLineNumbers() {
  document.querySelectorAll('pre').forEach(pre => {
    pre.classList.add('line-numbers');
  });

  // Re-run Prism highlighting to apply line numbers
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
}

/**
 * Build Table of Contents from headings
 * Preserves math/LaTeX by using innerHTML
 */
function buildTableOfContents() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  const headings = document.querySelectorAll('.post-content h2, .post-content h3');
  if (!headings.length) {
    document.querySelector('.toc')?.remove();
    return;
  }

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    // Use innerHTML to preserve KaTeX-rendered math
    a.innerHTML = heading.innerHTML;
    a.className = heading.tagName === 'H3' ? 'toc-h3' : '';

    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Re-render KaTeX on TOC links if available
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(tocList, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  }

  // Highlight active section on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -66%' });

  headings.forEach(h => observer.observe(h));
}

/**
 * Wrap tables for horizontal scroll
 */
function wrapTables() {
  document.querySelectorAll('.post-content table').forEach(table => {
    if (table.parentElement.classList.contains('table-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

/**
 * Process callout blocks from blockquotes
 * Syntax: > [!TYPE]
 */
function processCallouts() {
  // Lucide-style inline SVG icons (matching rokmr.github.io aesthetic)
  const svgIcon = (path, viewBox = '0 0 24 24') =>
    `<svg width="18" height="18" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  const types = {
    'tip': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
      title: 'Tip'
    },
    'note': {
      icon: svgIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>'),
      title: 'Note'
    },
    'warning': {
      icon: svgIcon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
      title: 'Warning'
    },
    'danger': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'),
      title: 'Danger'
    },
    'question': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
      title: 'Question'
    },
    'info': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'),
      title: 'Info'
    },
    // New enhanced callout types
    'abstract': {
      icon: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
      title: 'Abstract'
    },
    'definition': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
      title: 'Definition'
    },
    'proof': {
      icon: svgIcon('<polyline points="20 6 9 17 4 12"/>'),
      title: 'Proof'
    },
    'example': {
      icon: svgIcon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'),
      title: 'Example'
    },
    'critical': {
      icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
      title: 'Critical'
    },
    'success': {
      icon: svgIcon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
      title: 'Success'
    }
  };

  document.querySelectorAll('.post-content blockquote').forEach(bq => {
    const text = bq.innerHTML;
    const match = text.match(/\[!(TIP|NOTE|WARNING|DANGER|QUESTION|INFO|ABSTRACT|DEFINITION|PROOF|EXAMPLE|CRITICAL|SUCCESS)\]/i);

    if (match) {
      const type = match[1].toLowerCase();
      const config = types[type] || types.note;

      bq.innerHTML = text.replace(match[0], '').trim();
      bq.className = `callout callout-${type}`;

      const title = document.createElement('div');
      title.className = 'callout-title';
      title.innerHTML = `${config.icon} ${config.title}`;

      const content = document.createElement('div');
      content.className = 'callout-content';
      content.innerHTML = bq.innerHTML;

      bq.innerHTML = '';
      bq.appendChild(title);
      bq.appendChild(content);
    }
  });
}

/**
 * Reading progress bar
 */
function initReadingProgress() {
  if (!document.querySelector('.post-content')) return;

  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: var(--accent);
    z-index: 1001;
    width: 0%;
    transition: width 0.1s ease-out;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = `${Math.min(progress, 100)}%`;
  });
}

/**
 * HuggingFace embed
 */
function initHuggingFaceEmbeds() {
  document.querySelectorAll('.hf-space[data-src]').forEach(container => {
    const spacePath = container.dataset.src;
    const height = container.dataset.height || '500';

    // Convert "owner/space-name" to "owner-space-name.hf.space" for embedding
    const embedDomain = spacePath.replace('/', '-') + '.hf.space';

    const wrapper = document.createElement('div');
    wrapper.className = 'embed-wrapper';
    wrapper.innerHTML = `
      <div class="embed-header">
        <span class="embed-title">Hugging Face Space</span>
      </div>
      <div class="embed-body" style="height: ${height}px">
        <iframe 
          src="https://${embedDomain}" 
          loading="lazy"
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; clipboard-write; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; legacy-image-formats; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; sync-xhr; usb; vr; wake-lock; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
        ></iframe>
      </div>
    `;

    container.replaceWith(wrapper);
  });
}

/**
 * Runnable Python Code Blocks (Pyodide)
 * Usage: <div class="runnable" data-lang="python">```python\ncode\n```</div>
 */
let pyodideInstance = null;
let pyodideLoading = false;
let pyodideLoadPromise = null;

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoading = true;

  // Load Pyodide script
  pyodideLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.onload = async () => {
      try {
        pyodideInstance = await window.loadPyodide();
        pyodideLoading = false;
        resolve(pyodideInstance);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return pyodideLoadPromise;
}

async function runPythonCode(code, outputEl) {
  outputEl.classList.remove('error', 'empty');
  outputEl.textContent = 'Loading Python runtime...';

  try {
    const pyodide = await loadPyodide();

    // Auto-detect and load common packages
    const packages = [];
    if (code.includes('import numpy') || code.includes('from numpy')) packages.push('numpy');
    if (code.includes('import pandas') || code.includes('from pandas')) packages.push('pandas');
    if (code.includes('import matplotlib') || code.includes('from matplotlib')) packages.push('matplotlib');

    if (packages.length > 0) {
      outputEl.textContent = `Loading packages: ${packages.join(', ')}...`;
      await pyodide.loadPackagesFromImports(code);
    }

    // Capture stdout
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);

    // Run user code
    try {
      await pyodide.runPythonAsync(code);
    } catch (e) {
      // Get stderr if any
      const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()');
      outputEl.classList.add('error');
      outputEl.textContent = stderr || e.message;
      return;
    }

    // Get stdout
    const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');

    if (stdout.trim()) {
      outputEl.textContent = stdout;
    } else {
      outputEl.classList.add('empty');
      outputEl.textContent = '(No output)';
    }
  } catch (e) {
    outputEl.classList.add('error');
    outputEl.textContent = `Error: ${e.message}`;
  }
}

function initRunnableCodeBlocks() {
  document.querySelectorAll('.runnable').forEach(container => {
    const codeEl = container.querySelector('pre code');
    if (!codeEl) return;

    const originalCode = codeEl.textContent;
    const lang = container.dataset.lang || 'python';

    // Build wrapper structure with CodeMirror container
    const wrapper = document.createElement('div');
    wrapper.className = 'runnable-code';
    wrapper.innerHTML = `
      <div class="runnable-header">
        <span class="runnable-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Interactive ${lang}
        </span>
        <div class="runnable-actions">
          <button class="reset-btn" type="button" title="Reset to original code">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset
          </button>
          <button class="run-btn" type="button">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Run
          </button>
        </div>
      </div>
      <div class="runnable-body">
        <div class="code-editor-container"></div>
      </div>
      <div class="runnable-output" style="display: none;">
        <div class="output-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          Output
        </div>
        <div class="output-content"></div>
      </div>
    `;

    container.replaceWith(wrapper);

    // Initialize CodeMirror editor
    const editorContainer = wrapper.querySelector('.code-editor-container');
    const cmEditor = CodeMirror(editorContainer, {
      value: originalCode,
      mode: 'python',
      theme: 'material-darker',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      lineWrapping: true,
      viewportMargin: Infinity,
      extraKeys: {
        'Tab': (cm) => cm.execCommand('indentMore'),
        'Shift-Tab': (cm) => cm.execCommand('indentLess')
      }
    });

    // Wire up buttons
    const runBtn = wrapper.querySelector('.run-btn');
    const resetBtn = wrapper.querySelector('.reset-btn');
    const outputSection = wrapper.querySelector('.runnable-output');
    const outputContent = wrapper.querySelector('.output-content');

    // Run button - uses current editor content
    runBtn.addEventListener('click', async () => {
      runBtn.disabled = true;
      runBtn.classList.add('loading');
      runBtn.innerHTML = '<span class="spinner"></span> Running...';
      outputSection.style.display = 'block';

      const currentCode = cmEditor.getValue();
      await runPythonCode(currentCode, outputContent);

      runBtn.disabled = false;
      runBtn.classList.remove('loading');
      runBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run`;
    });

    // Reset button - restores original code
    resetBtn.addEventListener('click', () => {
      cmEditor.setValue(originalCode);
      resetBtn.classList.add('reset-flash');
      setTimeout(() => resetBtn.classList.remove('reset-flash'), 300);
    });
  });
}

/**
 * Escape HTML for safe insertion into textarea
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Initialize Mermaid.js diagrams
 * Converts ```mermaid code blocks to rendered diagrams
 */
function initMermaidDiagrams() {
  if (typeof mermaid === 'undefined') return;

  // Configure Mermaid with dark theme matching blog aesthetic
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#4ade80',
      primaryTextColor: '#e8e8e8',
      primaryBorderColor: '#222222',
      lineColor: '#666666',
      secondaryColor: '#161616',
      tertiaryColor: '#111111',
      background: '#111111',
      mainBkg: '#111111',
      nodeBorder: '#4ade80',
      clusterBkg: '#161616',
      clusterBorder: '#222222',
      titleColor: '#e8e8e8',
      edgeLabelBackground: '#111111'
    },
    flowchart: {
      curve: 'basis',
      padding: 20
    },
    sequence: {
      actorMargin: 50,
      boxMargin: 10
    }
  });

  // Find all mermaid code blocks and render them
  document.querySelectorAll('pre code.language-mermaid, .highlight-mermaid pre code').forEach(async (codeBlock, index) => {
    const code = codeBlock.textContent;
    const pre = codeBlock.closest('pre');
    const container = pre.closest('.highlight') || pre;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper';
    wrapper.innerHTML = `
      <div class="mermaid-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <span>Diagram</span>
      </div>
      <div class="mermaid-body" id="mermaid-${index}"></div>
    `;

    container.replaceWith(wrapper);

    // Render the diagram
    try {
      const { svg } = await mermaid.render(`mermaid-svg-${index}`, code);
      wrapper.querySelector('.mermaid-body').innerHTML = svg;
    } catch (e) {
      wrapper.querySelector('.mermaid-body').innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${e.message}</pre>`;
    }
  });
}

/**
 * Add copy buttons to all code blocks
 */
function addCopyButtons() {
  document.querySelectorAll('pre:not(.runnable-code pre)').forEach(pre => {
    // Skip if already has copy button or is inside runnable block
    if (pre.querySelector('.copy-btn') || pre.closest('.runnable-code')) return;

    const code = pre.querySelector('code');
    if (!code) return;

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    btn.title = 'Copy code';

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 2000);
      } catch (e) {
        console.error('Failed to copy:', e);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

/**
 * Initialize interactive math tooltips
 * Usage: <span class="math-term" data-tooltip="explanation">$Q$</span>
 */
function initInteractiveMath() {
  document.querySelectorAll('.math-term[data-tooltip]').forEach(term => {
    const tooltip = document.createElement('span');
    tooltip.className = 'math-tooltip';
    tooltip.textContent = term.dataset.tooltip;
    term.appendChild(tooltip);
  });
}

/**
 * Initialize post action buttons (share, scroll to comments)
 */
function initPostActions() {
  const actionsBar = document.querySelector('.post-actions');
  if (!actionsBar) return;

  // Share button
  const shareBtn = actionsBar.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const title = document.querySelector('.post-title')?.textContent || document.title;
      const url = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (e) {
          if (e.name !== 'AbortError') {
            showShareFallback(shareBtn, title, url);
          }
        }
      } else {
        showShareFallback(shareBtn, title, url);
      }
    });
  }

  // Scroll to comments
  const commentsBtn = actionsBar.querySelector('.comments-btn');
  if (commentsBtn) {
    commentsBtn.addEventListener('click', () => {
      const comments = document.querySelector('.comments') || document.querySelector('.giscus');
      if (comments) {
        comments.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/**
 * Show fallback share menu with Twitter/LinkedIn options
 */
function showShareFallback(btn, title, url) {
  // Remove existing dropdown if any
  const existing = document.querySelector('.share-dropdown');
  if (existing) {
    existing.remove();
    return;
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const dropdown = document.createElement('div');
  dropdown.className = 'share-dropdown';
  dropdown.innerHTML = `
    <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      Twitter / X
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
      LinkedIn
    </a>
    <button class="copy-link-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      Copy Link
    </button>
  `;

  btn.parentElement.style.position = 'relative';
  btn.parentElement.appendChild(dropdown);

  // Copy link button
  dropdown.querySelector('.copy-link-btn').addEventListener('click', async () => {
    await navigator.clipboard.writeText(url);
    dropdown.querySelector('.copy-link-btn').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    setTimeout(() => dropdown.remove(), 1000);
  });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 0);
}

/**
 * Initialize like buttons with localStorage persistence
 */
function initLikeButtons() {
  const likeBtn = document.querySelector('.like-btn');
  if (!likeBtn) return;

  const postId = likeBtn.dataset.postId;
  const likesKey = 'blog_likes';
  const likedKey = 'blog_liked_posts';

  // Get current likes data from localStorage
  function getLikesData() {
    try {
      return JSON.parse(localStorage.getItem(likesKey) || '{}');
    } catch {
      return {};
    }
  }

  // Get liked posts set
  function getLikedPosts() {
    try {
      return new Set(JSON.parse(localStorage.getItem(likedKey) || '[]'));
    } catch {
      return new Set();
    }
  }

  // Save likes data
  function saveLikesData(data) {
    localStorage.setItem(likesKey, JSON.stringify(data));
  }

  // Save liked posts
  function saveLikedPosts(posts) {
    localStorage.setItem(likedKey, JSON.stringify([...posts]));
  }

  // Update UI
  function updateUI() {
    const likesData = getLikesData();
    const likedPosts = getLikedPosts();
    const count = likesData[postId] || 0;
    const isLiked = likedPosts.has(postId);

    const countEl = likeBtn.querySelector('.like-count');
    const textEl = likeBtn.querySelector('.like-text');

    if (count > 0) {
      countEl.textContent = count;
      countEl.style.display = 'inline';
    } else {
      countEl.style.display = 'none';
    }

    if (isLiked) {
      likeBtn.classList.add('liked');
      textEl.textContent = 'Liked';
    } else {
      likeBtn.classList.remove('liked');
      textEl.textContent = 'Like';
    }
  }

  // Toggle like
  likeBtn.addEventListener('click', () => {
    const likesData = getLikesData();
    const likedPosts = getLikedPosts();

    if (likedPosts.has(postId)) {
      // Unlike
      likedPosts.delete(postId);
      likesData[postId] = Math.max(0, (likesData[postId] || 1) - 1);
    } else {
      // Like
      likedPosts.add(postId);
      likesData[postId] = (likesData[postId] || 0) + 1;
    }

    saveLikesData(likesData);
    saveLikedPosts(likedPosts);
    updateUI();

    // Add animation
    likeBtn.classList.add('like-animate');
    setTimeout(() => likeBtn.classList.remove('like-animate'), 300);
  });

  // Initial UI update
  updateUI();
}

/**
 * Video Embed Support
 * Usage: <div class="video-embed" data-src="/path/to/video.mp4" data-caption="Demo"></div>
 * Supports: local videos, YouTube, Vimeo
 */
function initVideoEmbeds() {
  document.querySelectorAll('.video-embed[data-src]').forEach(container => {
    const src = container.dataset.src;
    const caption = container.dataset.caption || '';
    const height = container.dataset.height || 'auto';

    // Detect video type
    let videoContent = '';

    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      // YouTube embed
      const videoId = src.includes('youtu.be')
        ? src.split('/').pop()
        : new URL(src).searchParams.get('v');
      videoContent = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    } else if (src.includes('vimeo.com')) {
      // Vimeo embed
      const videoId = src.split('/').pop();
      videoContent = `<iframe src="https://player.vimeo.com/video/${videoId}" allowfullscreen></iframe>`;
    } else {
      // Local video
      videoContent = `<video controls playsinline preload="metadata" style="max-height: ${height}px">
        <source src="${src}" type="video/${src.split('.').pop()}">
        Your browser does not support the video tag.
      </video>`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    wrapper.innerHTML = `
      <div class="video-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <span>Video</span>
      </div>
      <div class="video-body">${videoContent}</div>
      ${caption ? `<div class="video-caption">${caption}</div>` : ''}
    `;

    container.replaceWith(wrapper);
  });
}

/**
 * Collapsible Code Blocks
 * Usage: <div class="collapsible" data-label="Show Implementation">```python...```</div>
 * Or use inline attribute: <details class="collapsible-code"><summary>Show Code</summary>...</details>
 */
function initCollapsibleCode() {
  // Process .collapsible divs containing code blocks
  document.querySelectorAll('.collapsible').forEach(container => {
    const codeBlock = container.querySelector('pre');
    if (!codeBlock) return;

    const label = container.dataset.label || 'Show Code';
    const language = codeBlock.querySelector('code')?.className.match(/language-(\w+)/)?.[1] || 'Code';

    const details = document.createElement('details');
    details.className = 'collapsible-code';
    details.innerHTML = `
      <summary>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        ${label} (${language})
      </summary>
      <div class="code-content"></div>
    `;

    details.querySelector('.code-content').appendChild(codeBlock.cloneNode(true));
    container.replaceWith(details);
  });

  // Also handle any pre-existing <details class="collapsible-code"> elements
  // (already in correct format, just add styling hooks if needed)
}
