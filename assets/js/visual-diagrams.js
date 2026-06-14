/**
 * Visual Diagrams Module
 * Renders charts, flowcharts, neural networks, timelines, and other visual elements
 * from declarative data-config attributes or diagram-* code blocks.
 *
 * Supported types:
 *   line-chart, bar-chart, scatter-plot, area-chart, pie-chart, heatmap,
 *   flowchart, architecture, neural-net, tree, timeline, comparison,
 *   pipeline, state-machine, venn, radar-chart, matrix, sequence
 *
 * Usage:
 *   <div class="visual-diagram" data-type="line-chart" data-config='{ ... }'></div>
 *
 * Or via fenced code blocks:
 *   ```diagram-flowchart
 *   { "nodes": [...], "edges": [...] }
 *   ```
 */

// ─── SVG Coordinate System ──────────────────────────────────────────────
// All diagrams use a standard viewBox width of 800 units.
// This matches the ~800px content area, so 1 SVG unit ≈ 1 CSS pixel.
// Diagrams that need more/less width still scale via width:100%, but the
// text-size-to-diagram-size *ratio* stays consistent.
//
const SVG_W = 800; // Standard viewBox width; renderers use this as default

// ─── SVG Font Size Scale (viewBox units, ≈ px at standard width) ────────
// 4 steps only. Every text element in every diagram uses one of these.
//
//   Token    Size  Rendered@800  Use
//   ─────    ────  ───────────   ─────────────────────────────────────────
//   SVG_XS   10    ~10px         Annotations: edge labels, step #, unit counts
//   SVG_SM   11    ~11px         Data: tick values, legends, grid labels
//   SVG_BASE 12    ~12px         Primary: axis labels, node text, dates
//   SVG_LG   14    ~14px         Emphasis: column titles, donut center
//
const SVG_XS   = '10';
const SVG_SM   = '11';
const SVG_BASE = '12';
const SVG_LG   = '14';

// ─── Font family shorthand ──────────────────────────────────────────────
const F_MONO = "'JetBrains Mono', monospace";
const F_SANS = "'Inter', sans-serif";

// ─── Color Palette ──────────────────────────────────────────────────────
const COLORS = {
  1: '#4ade80', 2: '#60a5fa', 3: '#f472b6', 4: '#fb923c',
  5: '#a78bfa', 6: '#fbbf24', 7: '#34d399', 8: '#f87171',
  dim: '#666666', text: '#e8e8e8', secondary: '#999999',
  bg: '#0a0a0a', card: '#111111', elevated: '#161616',
  border: '#222222', grid: '#181818', axis: '#2a2a2a',
  accent: '#4ade80', fill: 'rgba(74, 222, 128, 0.08)',
  nodeInput: '#0d1a0d', nodeHidden: '#0d0d1a', nodeOutput: '#1a0d0d',
  nodeBorder: '#2a2a2a'
};

function resolveColor(c) {
  if (typeof c === 'number') return COLORS[c] || COLORS[1];
  if (typeof c === 'string' && COLORS[c]) return COLORS[c];
  return c || COLORS[1];
}

// ─── SVG Helpers ────────────────────────────────────────────────────────
function svgEl(tag, attrs = {}, children = '') {
  const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${tag} ${a}>${children}</${tag}>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Type Icons ─────────────────────────────────────────────────────────
const TYPE_ICONS = {
  'line-chart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 8 13 13 9 9 2 16"/><polyline points="16 8 22 8 22 14"/></svg>',
  'bar-chart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="17" y="2" width="4" height="18" rx="1"/></svg>',
  'scatter-plot': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="14" r="2"/><circle cx="13" cy="8" r="2"/><circle cx="18" cy="16" r="2"/><circle cx="10" cy="18" r="1.5"/></svg>',
  'pie-chart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
  'flowchart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="6" rx="2"/><rect x="3" y="15" width="18" height="6" rx="2"/><line x1="12" y1="9" x2="12" y2="15"/><polyline points="8 13 12 15 16 13"/></svg>',
  'architecture': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="8" height="6" rx="1"/><rect x="14" y="2" width="8" height="6" rx="1"/><rect x="8" y="16" width="8" height="6" rx="1"/><line x1="6" y1="8" x2="12" y2="16"/><line x1="18" y1="8" x2="12" y2="16"/></svg>',
  'neural-net': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="8" r="2"/><circle cx="4" cy="16" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="20" cy="12" r="2"/><line x1="6" y1="8" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="12"/><line x1="6" y1="16" x2="10" y2="12"/><line x1="6" y1="16" x2="10" y2="19"/><line x1="14" y1="5" x2="18" y2="12"/><line x1="14" y1="12" x2="18" y2="12"/><line x1="14" y1="19" x2="18" y2="12"/></svg>',
  'timeline': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/><line x1="14" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="4" y2="12"/><line x1="14" y1="18" x2="20" y2="18"/></svg>',
  'comparison': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="8" height="18" rx="2"/><rect x="14" y="3" width="8" height="18" rx="2"/></svg>',
  'pipeline': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="8" width="6" height="8" rx="1"/><rect x="9" y="8" width="6" height="8" rx="1"/><rect x="17" y="8" width="6" height="8" rx="1"/><line x1="7" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="17" y2="12"/></svg>',
  'heatmap': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  'tree': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="4" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="3" cy="20" r="2"/><circle cx="9" cy="20" r="2"/><line x1="12" y1="6" x2="6" y2="10"/><line x1="12" y1="6" x2="18" y2="10"/><line x1="6" y1="14" x2="3" y2="18"/><line x1="6" y1="14" x2="9" y2="18"/></svg>',
  'state-machine': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><line x1="10" y1="12" x2="14" y2="12"/><polyline points="12 10 14 12 12 14"/></svg>',
  'venn': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>',
  'radar-chart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 20,8 18,18 6,18 4,8"/><polygon points="12,6 16,9 15,15 9,15 8,9" opacity="0.3"/></svg>',
  'matrix': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>'
};

const TYPE_LABELS = {
  'line-chart': 'Line Chart', 'bar-chart': 'Bar Chart', 'scatter-plot': 'Scatter Plot',
  'area-chart': 'Area Chart', 'pie-chart': 'Chart', 'heatmap': 'Heatmap',
  'radar-chart': 'Radar Chart', 'flowchart': 'Flowchart', 'architecture': 'Architecture',
  'neural-net': 'Neural Network', 'tree': 'Tree', 'timeline': 'Timeline',
  'state-machine': 'State Machine', 'comparison': 'Comparison', 'pipeline': 'Pipeline',
  'venn': 'Venn Diagram', 'matrix': 'Matrix', 'sequence': 'Sequence'
};

// ─── Main Init ──────────────────────────────────────────────────────────
function initVisualDiagrams() {
  // 1. Process data-attribute based diagrams
  document.querySelectorAll('.visual-diagram[data-type][data-config]').forEach(el => {
    try {
      const type = el.dataset.type;
      const config = JSON.parse(el.dataset.config);
      config.type = config.type || type;
      renderDiagram(el, config);
    } catch (e) {
      renderError(el, e.message);
    }
  });

  // 2. Process code-block based diagrams (```diagram-TYPE)
  const codeBlocks = document.querySelectorAll(
    'code[class*="language-diagram-"]'
  );
  codeBlocks.forEach(codeEl => {
    const cls = Array.from(codeEl.classList).find(c => c.startsWith('language-diagram-'));
    if (!cls) return;
    const type = cls.replace('language-diagram-', '');
    const pre = codeEl.closest('pre');
    const container = pre.closest('.highlight') || pre;

    try {
      let raw = codeEl.textContent.trim();
      let config;
      // Try JSON first, then YAML-like simple parse
      if (raw.startsWith('{')) {
        config = JSON.parse(raw);
      } else {
        config = simpleYamlParse(raw);
      }
      config.type = config.type || type;

      const wrapper = document.createElement('div');
      container.replaceWith(wrapper);
      renderDiagram(wrapper, config);
    } catch (e) {
      const wrapper = document.createElement('div');
      container.replaceWith(wrapper);
      renderError(wrapper, e.message);
    }
  });
}

// ─── Simple YAML-like Parser (for code blocks) ─────────────────────────
function simpleYamlParse(text) {
  // Very basic: tries JSON first, otherwise falls back to key: value per line
  try { return JSON.parse(text); } catch (_) { /* continue */ }
  const result = {};
  const lines = text.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (match) {
      let val = match[2].trim();
      try { val = JSON.parse(val); } catch (_) { /* keep string */ }
      result[match[1]] = val;
    }
  }
  return result;
}

// ─── Render Dispatcher ──────────────────────────────────────────────────
function renderDiagram(el, config) {
  const type = config.type;
  const renderers = {
    'line-chart': renderLineChart,
    'bar-chart': renderBarChart,
    'scatter-plot': renderScatterPlot,
    'pie-chart': renderPieChart,
    'heatmap': renderHeatmap,
    'flowchart': renderFlowchart,
    'architecture': renderArchitecture,
    'neural-net': renderNeuralNet,
    'tree': renderTree,
    'timeline': renderTimeline,
    'comparison': renderComparison,
    'pipeline': renderPipeline,
    'state-machine': renderStateMachine,
    'venn': renderVenn
  };

  const renderFn = renderers[type];
  if (!renderFn) {
    renderError(el, `Unknown diagram type: "${type}"`);
    return;
  }

  try {
    const svgContent = renderFn(config);
    wrapDiagram(el, config, svgContent);
  } catch (e) {
    renderError(el, e.message);
  }
}

// ─── Wrapper Chrome ─────────────────────────────────────────────────────
function wrapDiagram(el, config, svgContent) {
  const type = config.type;
  const icon = TYPE_ICONS[type] || TYPE_ICONS['flowchart'];
  const label = TYPE_LABELS[type] || type;
  const title = config.title ? `<span class="visual-diagram-title">${escapeHtml(config.title)}</span>` : '';
  const caption = config.caption ? `<div class="visual-diagram-caption">${escapeHtml(config.caption)}</div>` : '';

  el.className = 'visual-diagram-wrapper';
  el.removeAttribute('data-type');
  el.removeAttribute('data-config');
  el.innerHTML = `
    <div class="visual-diagram-header">
      <span class="visual-diagram-icon">${icon}</span>
      <span class="visual-diagram-label">${escapeHtml(label)}</span>
      ${title}
      <div class="visual-diagram-actions">
        <button class="visual-diagram-action-btn" title="Download SVG" data-action="download">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="visual-diagram-action-btn" title="Fullscreen" data-action="fullscreen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
      </div>
    </div>
    <div class="visual-diagram-body">${svgContent}</div>
    ${caption}
  `;

  // Bind actions
  el.querySelector('[data-action="download"]')?.addEventListener('click', () => downloadSVG(el, config.title || type));
  el.querySelector('[data-action="fullscreen"]')?.addEventListener('click', () => fullscreenDiagram(el));
}

// ─── Error Renderer ─────────────────────────────────────────────────────
function renderError(el, message) {
  el.className = 'visual-diagram-wrapper';
  el.innerHTML = `
    <div class="visual-diagram-header">
      <span class="visual-diagram-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></span>
      <span class="visual-diagram-label" style="color: #ef4444;">Diagram Error</span>
    </div>
    <div class="visual-diagram-error">
      <span>Failed to render: ${escapeHtml(message)}</span>
    </div>
  `;
}

// ─── Download SVG ───────────────────────────────────────────────────────
function downloadSVG(wrapperEl, title) {
  const svgEl = wrapperEl.querySelector('.visual-diagram-body svg');
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (title || 'diagram').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.svg';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Fullscreen ─────────────────────────────────────────────────────────
function fullscreenDiagram(wrapperEl) {
  const body = wrapperEl.querySelector('.visual-diagram-body');
  if (!body) return;

  const overlay = document.createElement('div');
  overlay.className = 'visual-diagram-fullscreen';
  overlay.innerHTML = `
    <button class="visual-diagram-fs-close" title="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="visual-diagram-fs-body">${body.innerHTML}</div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  const close = () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  };
  overlay.querySelector('.visual-diagram-fs-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', handler); }
  });
}

// ═══════════════════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════════════════

// ─── Line Chart ─────────────────────────────────────────────────────────
function renderLineChart(cfg) {
  const W = cfg.width || SVG_W, H = cfg.height || 400;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
  const lines = cfg.lines || [];
  if (!lines.length) throw new Error('No line data provided');

  // Compute bounds
  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  lines.forEach(l => l.data.forEach(([x, y]) => {
    xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
  }));
  yMin = Math.min(yMin, 0);
  const yPad = (yMax - yMin) * 0.1 || 1;
  yMax += yPad;

  const sx = x => pad.left + ((x - xMin) / (xMax - xMin)) * cw;
  const sy = y => pad.top + ch - ((y - yMin) / (yMax - yMin)) * ch;

  let svg = '';

  // Grid
  if (cfg.showGrid !== false) {
    const yTicks = cfg.yTicks || 5;
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + (yMax - yMin) * (i / yTicks);
      svg += svgEl('line', { x1: pad.left, y1: sy(yVal), x2: W - pad.right, y2: sy(yVal), stroke: COLORS.grid, 'stroke-width': 0.5 });
      svg += svgEl('text', { x: pad.left - 8, y: sy(yVal) + 4, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'end' }, yVal.toFixed(1));
    }
    const xTicks = cfg.xTicks || 5;
    for (let i = 0; i <= xTicks; i++) {
      const xVal = xMin + (xMax - xMin) * (i / xTicks);
      svg += svgEl('line', { x1: sx(xVal), y1: pad.top, x2: sx(xVal), y2: H - pad.bottom, stroke: COLORS.grid, 'stroke-width': 0.5 });
      svg += svgEl('text', { x: sx(xVal), y: H - pad.bottom + 16, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'middle' }, Math.round(xVal));
    }
  }

  // Axes
  svg += svgEl('line', { x1: pad.left, y1: pad.top, x2: pad.left, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });
  svg += svgEl('line', { x1: pad.left, y1: H - pad.bottom, x2: W - pad.right, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });

  // Axis labels
  if (cfg.xLabel) svg += svgEl('text', { x: W / 2, y: H - 6, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(cfg.xLabel));
  if (cfg.yLabel) svg += svgEl('text', { x: 14, y: H / 2, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle', transform: `rotate(-90, 14, ${H / 2})` }, escapeHtml(cfg.yLabel));

  // Lines
  lines.forEach((line, idx) => {
    const color = resolveColor(line.color || (idx + 1));
    const sorted = [...line.data].sort((a, b) => a[0] - b[0]);
    const pts = sorted.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');

    // Fill area
    if (line.fill) {
      const fillPts = sorted.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ');
      const fillPath = `${sx(sorted[0][0])},${sy(yMin)} ${fillPts} ${sx(sorted[sorted.length - 1][0])},${sy(yMin)}`;
      svg += svgEl('polygon', { points: fillPath, fill: color, opacity: '0.08' });
    }

    // Line path
    const dashAttr = line.dashed ? 'stroke-dasharray="6,4"' : '';
    svg += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${dashAttr}/>`;

    // Data points — auto-hide when dense, override with cfg.showDots
    const showDots = cfg.showDots !== undefined ? cfg.showDots : sorted.length <= 20;
    if (showDots) {
      sorted.forEach(([x, y]) => {
        svg += svgEl('circle', { cx: sx(x), cy: sy(y), r: 3, fill: color, stroke: COLORS.card, 'stroke-width': 1.5 });
      });
    }
  });

  // Legend
  if (cfg.showLegend !== false && lines.length > 1) {
    let lx = pad.left + 10, ly = pad.top + 14;
    lines.forEach((line, idx) => {
      const color = resolveColor(line.color || (idx + 1));
      const dashAttr = line.dashed ? 'stroke-dasharray="4,3"' : '';
      svg += `<line x1="${lx}" y1="${ly}" x2="${lx + 20}" y2="${ly}" stroke="${color}" stroke-width="2" ${dashAttr}/>`;
      svg += svgEl('text', { x: lx + 26, y: ly + 4, fill: COLORS.secondary, 'font-size': SVG_SM, 'font-family': F_MONO }, escapeHtml(line.label || `Series ${idx + 1}`));
      ly += 18;
    });
  }

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Line Chart')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) +
    svg
  );
}

// ─── Bar Chart ──────────────────────────────────────────────────────────
function renderBarChart(cfg) {
  const bars = cfg.bars || [];
  if (!bars.length) throw new Error('No bar data provided');
  const W = cfg.width || SVG_W, H = cfg.height || 400;
  const pad = { top: 30, right: 30, bottom: 60, left: 60 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;

  const maxVal = Math.max(...bars.map(b => b.value)) * 1.15;
  const barW = Math.min(50, (cw / bars.length) * 0.6);
  const gap = (cw - barW * bars.length) / (bars.length + 1);

  let svg = '';

  // Grid
  for (let i = 0; i <= 5; i++) {
    const yVal = maxVal * (i / 5);
    const y = pad.top + ch - (yVal / maxVal) * ch;
    svg += svgEl('line', { x1: pad.left, y1: y, x2: W - pad.right, y2: y, stroke: COLORS.grid, 'stroke-width': 0.5 });
    svg += svgEl('text', { x: pad.left - 8, y: y + 4, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'end' }, yVal.toFixed(0));
  }

  // Axes
  svg += svgEl('line', { x1: pad.left, y1: pad.top, x2: pad.left, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });
  svg += svgEl('line', { x1: pad.left, y1: H - pad.bottom, x2: W - pad.right, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });

  // Bars
  bars.forEach((bar, i) => {
    const color = resolveColor(bar.color || (i + 1));
    const x = pad.left + gap + i * (barW + gap);
    const barH = (bar.value / maxVal) * ch;
    const y = pad.top + ch - barH;

    svg += svgEl('rect', { x, y, width: barW, height: barH, fill: color, opacity: '0.85', rx: 2 });
    // Value on top
    svg += svgEl('text', { x: x + barW / 2, y: y - 6, fill: color, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'middle', 'font-weight': '600' }, bar.value);
    // Label below
    svg += svgEl('text', { x: x + barW / 2, y: H - pad.bottom + 16, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(bar.label || ''));
  });

  // Axis labels
  if (cfg.xLabel) svg += svgEl('text', { x: W / 2, y: H - 6, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(cfg.xLabel));
  if (cfg.yLabel) svg += svgEl('text', { x: 14, y: H / 2, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle', transform: `rotate(-90, 14, ${H / 2})` }, escapeHtml(cfg.yLabel));

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Bar Chart')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Scatter Plot ───────────────────────────────────────────────────────
function renderScatterPlot(cfg) {
  const clusters = cfg.clusters || [];
  if (!clusters.length) throw new Error('No cluster data provided');
  const W = cfg.width || SVG_W, H = cfg.height || 500;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;

  let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
  clusters.forEach(c => c.points.forEach(([x, y]) => {
    xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
  }));
  const xPad = (xMax - xMin) * 0.1 || 1;
  const yPad = (yMax - yMin) * 0.1 || 1;
  xMin -= xPad; xMax += xPad; yMin -= yPad; yMax += yPad;

  const sx = x => pad.left + ((x - xMin) / (xMax - xMin)) * cw;
  const sy = y => pad.top + ch - ((y - yMin) / (yMax - yMin)) * ch;

  let svg = '';

  // Grid
  if (cfg.showGrid !== false) {
    for (let i = 0; i <= 5; i++) {
      const yVal = yMin + (yMax - yMin) * (i / 5);
      svg += svgEl('line', { x1: pad.left, y1: sy(yVal), x2: W - pad.right, y2: sy(yVal), stroke: COLORS.grid, 'stroke-width': 0.5 });
      const xVal = xMin + (xMax - xMin) * (i / 5);
      svg += svgEl('line', { x1: sx(xVal), y1: pad.top, x2: sx(xVal), y2: H - pad.bottom, stroke: COLORS.grid, 'stroke-width': 0.5 });
    }
  }

  // Axes
  svg += svgEl('line', { x1: pad.left, y1: pad.top, x2: pad.left, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });
  svg += svgEl('line', { x1: pad.left, y1: H - pad.bottom, x2: W - pad.right, y2: H - pad.bottom, stroke: COLORS.axis, 'stroke-width': 1.5 });

  // Points
  clusters.forEach((cluster, idx) => {
    const color = resolveColor(cluster.color || (idx + 1));
    cluster.points.forEach(([x, y]) => {
      svg += svgEl('circle', { cx: sx(x), cy: sy(y), r: 5, fill: color, opacity: '0.8', stroke: COLORS.card, 'stroke-width': 1 });
    });
  });

  // Legend
  if (clusters.length > 1) {
    let ly = pad.top + 14;
    clusters.forEach((c, idx) => {
      const color = resolveColor(c.color || (idx + 1));
      svg += svgEl('circle', { cx: pad.left + 14, cy: ly, r: 4, fill: color });
      svg += svgEl('text', { x: pad.left + 24, y: ly + 4, fill: COLORS.secondary, 'font-size': SVG_SM, 'font-family': F_MONO }, escapeHtml(c.label || `Cluster ${idx + 1}`));
      ly += 18;
    });
  }

  // Labels
  if (cfg.xLabel) svg += svgEl('text', { x: W / 2, y: H - 6, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(cfg.xLabel));
  if (cfg.yLabel) svg += svgEl('text', { x: 14, y: H / 2, fill: COLORS.dim, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle', transform: `rotate(-90, 14, ${H / 2})` }, escapeHtml(cfg.yLabel));

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Scatter Plot')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Pie / Donut Chart ──────────────────────────────────────────────────
function renderPieChart(cfg) {
  const slices = cfg.slices || [];
  if (!slices.length) throw new Error('No slice data provided');
  const W = cfg.width || SVG_W, H = cfg.height || 450;
  const cx = W / 2, cy = H / 2 - 10;
  const R = Math.min(W, H) / 2 - 40;
  const innerR = cfg.donut ? R * 0.55 : 0;
  const total = slices.reduce((s, sl) => s + sl.value, 0);

  let svg = '';
  let angle = -Math.PI / 2;

  slices.forEach((slice, idx) => {
    const color = resolveColor(slice.color || (idx + 1));
    const frac = slice.value / total;
    const startAngle = angle;
    const endAngle = angle + frac * 2 * Math.PI;
    const large = frac > 0.5 ? 1 : 0;

    const x1 = cx + R * Math.cos(startAngle), y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle), y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle), iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle), iy2 = cy + innerR * Math.sin(endAngle);

    let d;
    if (cfg.donut) {
      d = `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${innerR},${innerR} 0 ${large} 0 ${ix1},${iy1} Z`;
    } else {
      d = `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} Z`;
    }
    svg += svgEl('path', { d, fill: color, stroke: COLORS.card, 'stroke-width': 2, opacity: '0.85' });

    // Label
    const midAngle = (startAngle + endAngle) / 2;
    const labelR = R + 18;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    svg += svgEl('text', { x: lx, y: ly + 4, fill: COLORS.secondary, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': midAngle > Math.PI / 2 && midAngle < 3 * Math.PI / 2 ? 'end' : 'start' },
      `${escapeHtml(slice.label)} (${Math.round(frac * 100)}%)`);

    angle = endAngle;
  });

  // Center label for donut
  if (cfg.donut) {
    svg += svgEl('text', { x: cx, y: cy, fill: COLORS.text, 'font-size': SVG_LG, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '600' }, total.toFixed(0));
    svg += svgEl('text', { x: cx, y: cy + 14, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, 'TOTAL');
  }

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Chart')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Heatmap ────────────────────────────────────────────────────────────
function renderHeatmap(cfg) {
  const data = cfg.data || [];
  const xLabels = cfg.xLabels || [];
  const yLabels = cfg.yLabels || [];
  if (!data.length) throw new Error('No heatmap data provided');

  const rows = data.length, cols = data[0].length;
  const cellSize = cfg.cellSize || 50;
  const labelPad = 60;
  const W = Math.max(SVG_W, cols * cellSize + labelPad + 20);
  const H = rows * cellSize + labelPad + 20;

  let maxVal = -Infinity, minVal = Infinity;
  data.forEach(row => row.forEach(v => { maxVal = Math.max(maxVal, v); minVal = Math.min(minVal, v); }));

  const scale = cfg.colorScale || 'green';
  const getColor = (v) => {
    const t = maxVal === minVal ? 0.5 : (v - minVal) / (maxVal - minVal);
    if (scale === 'green') {
      const r = Math.round(10 + t * 64), g = Math.round(10 + t * 212), b = Math.round(10 + t * 118);
      return `rgb(${r},${g},${b})`;
    } else if (scale === 'blue') {
      const r = Math.round(10 + t * 86), g = Math.round(10 + t * 127), b = Math.round(10 + t * 240);
      return `rgb(${r},${g},${b})`;
    }
    return `rgba(74, 222, 128, ${0.1 + t * 0.9})`;
  };

  let svg = '';

  data.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const x = labelPad + ci * cellSize;
      const y = labelPad + ri * cellSize;
      svg += svgEl('rect', { x, y, width: cellSize - 1, height: cellSize - 1, fill: getColor(val), rx: 2 });
      // Value text
      const textColor = (val - minVal) / (maxVal - minVal) > 0.5 ? '#000' : COLORS.text;
      svg += svgEl('text', { x: x + cellSize / 2, y: y + cellSize / 2 + 4, fill: textColor, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'middle' }, val.toFixed(2));
    });
  });

  // Labels
  xLabels.forEach((label, i) => {
    svg += svgEl('text', { x: labelPad + i * cellSize + cellSize / 2, y: labelPad - 8, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(label));
  });
  yLabels.forEach((label, i) => {
    svg += svgEl('text', { x: labelPad - 8, y: labelPad + i * cellSize + cellSize / 2 + 4, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'end' }, escapeHtml(label));
  });

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Heatmap')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Flowchart ──────────────────────────────────────────────────────────
function renderFlowchart(cfg) {
  const nodes = cfg.nodes || [];
  const edges = cfg.edges || [];
  if (!nodes.length) throw new Error('No flowchart nodes provided');

  const dir = cfg.direction || 'TB';
  const isHorizontal = dir === 'LR' || dir === 'RL';

  const nodeW = 160, nodeH = 54, gapX = 70, gapY = 55;
  const nodeMap = {};

  // Layout: assign positions
  const hasExplicit = nodes.some(n => n.row !== undefined && n.col !== undefined);

  if (hasExplicit) {
    let minCol = Infinity, maxCol = -Infinity;
    nodes.forEach(n => {
      if (n.col < minCol) minCol = n.col;
      if (n.col > maxCol) maxCol = n.col;
    });
    const gridCols = maxCol - minCol + 1;
    const offsetX = Math.max(0, (3 - gridCols)) * (nodeW + gapX) / 2;

    nodes.forEach(node => {
      const c = node.col - minCol;
      const x = isHorizontal ? node.row * (nodeW + gapX) + 60 : c * (nodeW + gapX) + 60 + offsetX;
      const y = isHorizontal ? c * (nodeH + gapY) + 50 : node.row * (nodeH + gapY) + 50;
      nodeMap[node.id] = { ...node, x, y, w: nodeW, h: nodeH };
    });
  } else {
    const cols = cfg.columns || (isHorizontal ? Math.ceil(Math.sqrt(nodes.length)) : Math.min(3, nodes.length));
    nodes.forEach((node, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const totalInRow = Math.min(cols, nodes.length - row * cols);
      const offsetX = (cols - totalInRow) * (nodeW + gapX) / 2;
      nodeMap[node.id] = {
        ...node,
        x: isHorizontal ? row * (nodeW + gapX) + 60 : col * (nodeW + gapX) + 60 + offsetX,
        y: isHorizontal ? col * (nodeH + gapY) + 50 : row * (nodeH + gapY) + 50,
        w: nodeW,
        h: nodeH
      };
    });
  }

  const allX = Object.values(nodeMap).map(n => n.x + n.w);
  const allY = Object.values(nodeMap).map(n => n.y + n.h);
  const W = Math.max(SVG_W, Math.max(...allX) + 60);
  const H = Math.max(...allY) + 60;

  let svg = '';

  // Edges
  edges.forEach(edge => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) return;

    const fx = from.x + from.w / 2, fy = from.y + from.h;
    const tx = to.x + to.w / 2, ty = to.y;
    const dashAttr = edge.dashed ? ' stroke-dasharray="6,4"' : '';

    // Simple path with a midpoint
    let d, lx, ly;
    if (edge.route === 'right') {
      const rx = Math.max(from.x, to.x) + from.w + gapX * 0.5;
      d = `M${from.x + from.w},${from.y + from.h / 2} L${rx},${from.y + from.h / 2} L${rx},${to.y + to.h / 2} L${to.x + to.w},${to.y + to.h / 2}`;
      lx = rx + 6;
      ly = (from.y + from.h / 2 + to.y + to.h / 2) / 2;
    } else if (edge.route === 'left') {
      const xLeft = Math.min(from.x, to.x) - gapX * 0.5;
      d = `M${from.x},${from.y + from.h / 2} L${xLeft},${from.y + from.h / 2} L${xLeft},${to.y + to.h / 2} L${to.x},${to.y + to.h / 2}`;
      lx = xLeft - 6;
      ly = (from.y + from.h / 2 + to.y + to.h / 2) / 2;
    } else {
      const my = (fy + ty) / 2;
      d = isHorizontal
        ? `M${from.x + from.w},${from.y + from.h / 2} C${from.x + from.w + gapX / 2},${from.y + from.h / 2} ${to.x - gapX / 2},${to.y + to.h / 2} ${to.x},${to.y + to.h / 2}`
        : `M${fx},${fy} C${fx},${my} ${tx},${my} ${tx},${ty}`;
      lx = isHorizontal ? (from.x + from.w + to.x) / 2 : (fx + tx) / 2 + 8;
      ly = isHorizontal ? (from.y + from.h / 2 + to.y + to.h / 2) / 2 - 6 : (fy + ty) / 2 - 6;
    }

    svg += `<path d="${d}" fill="none" stroke="${COLORS.dim}" stroke-width="1.5"${dashAttr} marker-end="url(#arrowhead)"/>`;

    // Edge label
    if (edge.label) {
      const align = edge.route === 'left' ? 'end' : (edge.route === 'right' ? 'start' : 'middle');
      svg += svgEl('text', { x: lx, y: ly, fill: COLORS.accent, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': align }, escapeHtml(edge.label));
    }
  });

  // Arrowhead marker
  svg = `<defs><marker id="arrowhead" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="${COLORS.dim}"/></marker></defs>` + svg;

  // Nodes
  Object.values(nodeMap).forEach(node => {
    const shape = node.shape || 'rounded';
    const isAccent = node.accent;
    const fill = isAccent ? 'rgba(74, 222, 128, 0.1)' : COLORS.elevated;
    const stroke = isAccent ? COLORS.accent : COLORS.border;
    const textColor = isAccent ? COLORS.accent : COLORS.text;

    if (shape === 'diamond') {
      const cx = node.x + node.w / 2, cy = node.y + node.h / 2;
      const dx = node.w / 2, dy = node.h / 2;
      svg += svgEl('polygon', { points: `${cx},${cy - dy} ${cx + dx},${cy} ${cx},${cy + dy} ${cx - dx},${cy}`, fill, stroke, 'stroke-width': 1 });
    } else if (shape === 'circle') {
      svg += svgEl('circle', { cx: node.x + node.w / 2, cy: node.y + node.h / 2, r: Math.min(node.w, node.h) / 2, fill, stroke, 'stroke-width': 1 });
    } else {
      const rx = shape === 'rounded' || shape === 'stadium' ? 6 : 2;
      svg += svgEl('rect', { x: node.x, y: node.y, width: node.w, height: node.h, fill, stroke, 'stroke-width': 1, rx });
    }

    // Label (supports \n)
    const lines = (node.label || '').split('\n');
    const startY = node.y + node.h / 2 - (lines.length - 1) * 8;
    lines.forEach((line, li) => {
      svg += svgEl('text', { x: node.x + node.w / 2, y: startY + li * 16, fill: textColor, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '500' }, escapeHtml(line));
    });
  });

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Flowchart')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Architecture (Block Diagram) ───────────────────────────────────────
function renderArchitecture(cfg) {
  const blocks = cfg.blocks || [];
  const connections = cfg.connections || [];
  if (!blocks.length) throw new Error('No architecture blocks provided');

  const blockW = 180, blockH = 54, gap = 35;
  const pad = 60;

  // Group by row
  const rows = {};
  blocks.forEach(b => {
    const row = b.row ?? 0;
    if (!rows[row]) rows[row] = [];
    rows[row].push(b);
  });
  const sortedRows = Object.keys(rows).map(Number).sort((a, b) => a - b);

  const blockMap = {};
  sortedRows.forEach((rowIdx, ri) => {
    const rowBlocks = rows[rowIdx];
    const totalW = rowBlocks.length * blockW + (rowBlocks.length - 1) * gap;
    rowBlocks.forEach((block, ci) => {
      blockMap[block.id] = {
        ...block,
        x: pad + ci * (blockW + gap) + (rowBlocks.length === 1 ? (totalW > blockW ? 0 : gap) : 0),
        y: pad + ri * (blockH + gap),
        w: blockW, h: blockH
      };
    });
  });

  // Auto-center
  const maxRowW = Math.max(...sortedRows.map(r => rows[r].length));
  const W = Math.max(SVG_W, maxRowW * (blockW + gap) + pad * 2);
  const H = sortedRows.length * (blockH + gap) + pad * 2;

  // Re-center each row
  sortedRows.forEach(rowIdx => {
    const rowBlocks = rows[rowIdx].map(b => blockMap[b.id]);
    const rowW = rowBlocks.length * blockW + (rowBlocks.length - 1) * gap;
    const offset = (W - rowW) / 2 - pad;
    rowBlocks.forEach(b => b.x += offset);
  });

  let svg = '';

  // Connections
  connections.forEach(conn => {
    const from = blockMap[conn.from];
    const to = blockMap[conn.to];
    if (!from || !to) return;

    const fx = from.x + from.w / 2, fy = from.y + from.h;
    const tx = to.x + to.w / 2, ty = to.y;

    if (conn.skip) {
      // Skip/residual connection: curve to the side
      const side = fx <= tx ? -30 : 30;
      const d = `M${fx + side},${from.y + from.h / 2} C${fx + side * 3},${from.y + from.h / 2} ${tx + side * 3},${to.y + to.h / 2} ${tx + side},${to.y + to.h / 2}`;
      svg += `<path d="${d}" fill="none" stroke="${COLORS.accent}" stroke-width="1" stroke-dasharray="4,3" opacity="0.5" marker-end="url(#arch-arrow)"/>`;
      if (conn.label) {
        const ly = (from.y + from.h / 2 + to.y + to.h / 2) / 2;
        svg += svgEl('text', { x: fx + side * 2.5, y: ly, fill: COLORS.accent, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle', opacity: '0.7' }, escapeHtml(conn.label));
      }
    } else {
      svg += `<line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${COLORS.dim}" stroke-width="1.5" marker-end="url(#arch-arrow)"/>`;
    }
  });

  svg = `<defs><marker id="arch-arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="${COLORS.dim}"/></marker></defs>` + svg;

  // Blocks
  Object.values(blockMap).forEach(block => {
    const color = resolveColor(block.color || 'dim');
    const fill = `${color}15`; // 15 = ~8% opacity in hex
    svg += svgEl('rect', { x: block.x, y: block.y, width: block.w, height: block.h, fill, stroke: color, 'stroke-width': 1, rx: 4 });

    const lines = (block.label || '').split('\n');
    const startY = block.y + block.h / 2 - (lines.length - 1) * 8;
    lines.forEach((line, li) => {
      svg += svgEl('text', { x: block.x + block.w / 2, y: startY + li * 16, fill: COLORS.text, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '500' }, escapeHtml(line));
    });
  });

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Architecture')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Neural Network ─────────────────────────────────────────────────────
function renderNeuralNet(cfg) {
  const layers = cfg.layers || [];
  if (!layers.length) throw new Error('No neural network layers provided');

  const maxNodes = Math.max(...layers.map(l => l.nodes));
  const nodeR = 14;
  const layerGap = 120;
  const nodeGap = 38;
  const pad = 60;

  const W = Math.max(SVG_W, layers.length * layerGap + pad);
  const H = maxNodes * nodeGap + pad * 2;

  const layerColors = { input: '#4ade80', hidden: '#60a5fa', output: '#f472b6' };
  const layerBg = { input: COLORS.nodeInput, hidden: COLORS.nodeHidden, output: COLORS.nodeOutput };

  const getNodePos = (layerIdx, nodeIdx, totalNodes) => {
    const x = pad + layerIdx * layerGap;
    const totalH = (totalNodes - 1) * nodeGap;
    const y = (H - totalH) / 2 + nodeIdx * nodeGap;
    return { x, y };
  };

  let svg = '';

  // Connections (draw first, behind nodes)
  for (let li = 0; li < layers.length - 1; li++) {
    for (let ni = 0; ni < layers[li].nodes; ni++) {
      for (let nj = 0; nj < layers[li + 1].nodes; nj++) {
        const from = getNodePos(li, ni, layers[li].nodes);
        const to = getNodePos(li + 1, nj, layers[li + 1].nodes);
        svg += svgEl('line', { x1: from.x + nodeR, y1: from.y, x2: to.x - nodeR, y2: to.y, stroke: COLORS.border, 'stroke-width': 0.5, opacity: '0.4' });
      }
    }
  }

  // Nodes
  layers.forEach((layer, li) => {
    const type = layer.type || 'hidden';
    const color = layerColors[type] || layerColors.hidden;
    const bg = layerBg[type] || layerBg.hidden;

    for (let ni = 0; ni < layer.nodes; ni++) {
      const pos = getNodePos(li, ni, layer.nodes);
      svg += svgEl('circle', { cx: pos.x, cy: pos.y, r: nodeR, fill: bg, stroke: color, 'stroke-width': 1.5, opacity: '0.9' });
    }

    // Layer label
    if (cfg.showLabels !== false) {
      const labelY = H - 16;
      svg += svgEl('text', { x: pad + li * layerGap, y: labelY, fill: color, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(layer.name || type));
      svg += svgEl('text', { x: pad + li * layerGap, y: labelY + 12, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, `${layer.nodes} units`);
    }
  });

  // Activation label
  if (cfg.activation) {
    svg += svgEl('text', { x: W / 2, y: 18, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, `activation: ${escapeHtml(cfg.activation)}`);
  }

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Neural Network')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Timeline ───────────────────────────────────────────────────────────
function renderTimeline(cfg) {
  const events = cfg.events || [];
  if (!events.length) throw new Error('No timeline events provided');

  const isHoriz = cfg.direction === 'horizontal';

  if (isHoriz) {
    const eventW = 150, gap = 30;
    const W = Math.max(SVG_W, events.length * (eventW + gap) + 80);
    const H = 220;
    const lineY = 80;

    let svg = '';
    // Main line
    svg += svgEl('line', { x1: 40, y1: lineY, x2: W - 40, y2: lineY, stroke: COLORS.axis, 'stroke-width': 2 });

    events.forEach((ev, i) => {
      const x = 60 + i * (eventW + gap);
      const color = resolveColor(ev.color || (i + 1));

      // Dot
      svg += svgEl('circle', { cx: x, cy: lineY, r: 6, fill: color, stroke: COLORS.card, 'stroke-width': 2 });
      // Vertical line
      svg += svgEl('line', { x1: x, y1: lineY + 10, x2: x, y2: lineY + 30, stroke: color, 'stroke-width': 1, opacity: '0.5' });
      // Date
      svg += svgEl('text', { x, y: lineY - 16, fill: color, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(ev.date));
      // Title
      svg += svgEl('text', { x, y: lineY + 48, fill: COLORS.text, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(ev.title));
      // Description
      if (ev.desc) {
        svg += svgEl('text', { x, y: lineY + 64, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_SANS, 'text-anchor': 'middle' }, escapeHtml(ev.desc));
      }
    });

    return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
      svgEl('title', {}, escapeHtml(cfg.title || 'Timeline')) +
      svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
    );
  } else {
    // Vertical timeline
    const eventH = 80;
    const W = SVG_W, H = events.length * eventH + 80;
    const lineX = 80;

    let svg = '';
    svg += svgEl('line', { x1: lineX, y1: 20, x2: lineX, y2: H - 20, stroke: COLORS.axis, 'stroke-width': 2 });

    events.forEach((ev, i) => {
      const y = 40 + i * eventH;
      const color = resolveColor(ev.color || (i + 1));

      svg += svgEl('circle', { cx: lineX, cy: y, r: 6, fill: color, stroke: COLORS.card, 'stroke-width': 2 });
      svg += svgEl('line', { x1: lineX + 10, y1: y, x2: lineX + 30, y2: y, stroke: color, 'stroke-width': 1, opacity: '0.5' });
      svg += svgEl('text', { x: lineX - 16, y: y + 4, fill: color, 'font-size': SVG_BASE, 'font-family': F_MONO, 'text-anchor': 'end', 'font-weight': '600' }, escapeHtml(ev.date));
      svg += svgEl('text', { x: lineX + 36, y: y - 2, fill: COLORS.text, 'font-size': SVG_BASE, 'font-family': F_SANS, 'font-weight': '600' }, escapeHtml(ev.title));
      if (ev.desc) svg += svgEl('text', { x: lineX + 36, y: y + 14, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_SANS }, escapeHtml(ev.desc));
    });

    return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
      svgEl('title', {}, escapeHtml(cfg.title || 'Timeline')) +
      svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
    );
  }
}

// ─── Comparison ─────────────────────────────────────────────────────────
function renderComparison(cfg) {
  const items = cfg.items || [];
  if (items.length < 2) throw new Error('Comparison needs at least 2 items');

  const colW = 340, pad = 40, gap = 30;
  const itemH = 22;
  const maxPts = Math.max(...items.map(it => it.points.length));
  const headerH = 50;
  const W = Math.max(SVG_W, items.length * colW + (items.length - 1) * gap + pad * 2);
  const H = headerH + maxPts * itemH + pad * 2 + 30;

  let svg = '';

  items.forEach((item, idx) => {
    const x = pad + idx * (colW + gap);
    const color = resolveColor(item.color || (idx + 1));

    // Column background
    svg += svgEl('rect', { x, y: pad, width: colW, height: H - pad * 2, fill: `${color}08`, stroke: color, 'stroke-width': 1, rx: 4, opacity: '0.7' });

    // Title
    svg += svgEl('text', { x: x + colW / 2, y: pad + 28, fill: color, 'font-size': SVG_LG, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '700' }, escapeHtml(item.title));

    // Divider
    svg += svgEl('line', { x1: x + 12, y1: headerH + pad, x2: x + colW - 12, y2: headerH + pad, stroke: color, 'stroke-width': 0.5, opacity: '0.3' });

    // Points
    (item.points || []).forEach((pt, pi) => {
      const py = headerH + pad + 20 + pi * itemH;
      svg += svgEl('circle', { cx: x + 18, cy: py, r: 2.5, fill: color });
      svg += svgEl('text', { x: x + 28, y: py + 4, fill: COLORS.secondary, 'font-size': SVG_BASE, 'font-family': F_SANS }, escapeHtml(pt));
    });
  });

  // VS divider
  if (items.length === 2) {
    const vsX = pad + colW + gap / 2;
    const vsY = H / 2;
    svg += svgEl('circle', { cx: vsX, cy: vsY, r: 16, fill: COLORS.elevated, stroke: COLORS.border, 'stroke-width': 1 });
    svg += svgEl('text', { x: vsX, y: vsY + 4, fill: COLORS.dim, 'font-size': SVG_SM, 'font-family': F_MONO, 'text-anchor': 'middle', 'font-weight': '600' }, 'VS');
  }

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Comparison')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Pipeline ───────────────────────────────────────────────────────────
function renderPipeline(cfg) {
  const stages = cfg.stages || [];
  if (!stages.length) throw new Error('No pipeline stages provided');

  const stageW = 115, stageH = 60, arrowW = 32, pad = 40;
  const W = Math.max(SVG_W, stages.length * stageW + (stages.length - 1) * arrowW + pad * 2);
  const H = stageH + pad * 2 + 30;
  const cy = pad + stageH / 2;

  let svg = '';

  stages.forEach((stage, i) => {
    const x = pad + i * (stageW + arrowW);
    const color = resolveColor(stage.color || (i + 1));

    // Box
    svg += svgEl('rect', { x, y: pad, width: stageW, height: stageH, fill: `${color}12`, stroke: color, 'stroke-width': 1.5, rx: 6 });
    // Label
    svg += svgEl('text', { x: x + stageW / 2, y: cy + 4, fill: COLORS.text, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(stage.label));
    // Step number
    svg += svgEl('text', { x: x + stageW / 2, y: pad + stageH + 18, fill: COLORS.dim, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, `STEP ${i + 1}`);

    // Arrow between stages
    if (i < stages.length - 1) {
      const ax = x + stageW + 4;
      svg += svgEl('line', { x1: ax, y1: cy, x2: ax + arrowW - 8, y2: cy, stroke: COLORS.dim, 'stroke-width': 1.5 });
      svg += svgEl('polygon', { points: `${ax + arrowW - 8},${cy - 4} ${ax + arrowW},${cy} ${ax + arrowW - 8},${cy + 4}`, fill: COLORS.dim });
    }
  });

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Pipeline')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Tree ───────────────────────────────────────────────────────────────
function renderTree(cfg) {
  const root = cfg.root;
  if (!root) throw new Error('No tree root provided');

  const nodeW = 140, nodeH = 40, gapX = 40, gapY = 65;

  // Compute tree dimensions
  function countLeaves(node) {
    if (!node.children || !node.children.length) return 1;
    return node.children.reduce((s, c) => s + countLeaves(c), 0);
  }
  function getDepth(node) {
    if (!node.children || !node.children.length) return 1;
    return 1 + Math.max(...node.children.map(getDepth));
  }

  const totalLeaves = countLeaves(root);
  const depth = getDepth(root);
  const W = Math.max(SVG_W, totalLeaves * (nodeW + gapX) + 60);
  const H = depth * (nodeH + gapY) + 60;

  let svg = '';
  let leafIdx = 0;

  function drawNode(node, d, parentPos) {
    let x, y;
    y = 30 + d * (nodeH + gapY);

    if (!node.children || !node.children.length) {
      x = 30 + leafIdx * (nodeW + gapX);
      leafIdx++;
    } else {
      const childPositions = node.children.map(c => drawNode(c, d + 1, null));
      x = (childPositions[0].x + childPositions[childPositions.length - 1].x) / 2;

      // Draw edges
      childPositions.forEach((cp, ci) => {
        const child = node.children[ci];
        svg += `<line x1="${x + nodeW / 2}" y1="${y + nodeH}" x2="${cp.x + nodeW / 2}" y2="${cp.y}" stroke="${COLORS.dim}" stroke-width="1.5"/>`;
        if (child.edge) {
          const mx = (x + nodeW / 2 + cp.x + nodeW / 2) / 2;
          const my = (y + nodeH + cp.y) / 2;
          svg += svgEl('text', { x: mx + 8, y: my - 2, fill: COLORS.accent, 'font-size': SVG_XS, 'font-family': F_MONO }, escapeHtml(child.edge));
        }
      });
    }

    // Draw node
    const isAccent = node.accent;
    const color = resolveColor(node.color || (isAccent ? 1 : 'dim'));
    const fill = isAccent ? 'rgba(74, 222, 128, 0.1)' : COLORS.elevated;
    const stroke = isAccent ? COLORS.accent : COLORS.border;

    svg += svgEl('rect', { x, y, width: nodeW, height: nodeH, fill, stroke, 'stroke-width': 1, rx: 4 });
    svg += svgEl('text', { x: x + nodeW / 2, y: y + nodeH / 2 + 4, fill: isAccent ? COLORS.accent : COLORS.text, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '500' }, escapeHtml(node.label));

    return { x, y };
  }

  drawNode(root, 0, null);

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Tree')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── State Machine ──────────────────────────────────────────────────────
function renderStateMachine(cfg) {
  const states = cfg.states || [];
  const transitions = cfg.transitions || [];
  if (!states.length) throw new Error('No states provided');

  const stateR = 40, gap = 130, pad = 70;
  const cols = Math.min(4, states.length);
  const rows = Math.ceil(states.length / cols);
  const W = Math.max(SVG_W, cols * (stateR * 2 + gap) + pad);
  const H = rows * (stateR * 2 + gap) + pad;

  const stateMap = {};
  states.forEach((s, i) => {
    const row = Math.floor(i / cols), col = i % cols;
    stateMap[s.id] = {
      ...s,
      cx: pad + col * (stateR * 2 + gap) + stateR,
      cy: pad + row * (stateR * 2 + gap) + stateR
    };
  });

  let svg = '';
  svg += `<defs><marker id="sm-arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse"><polygon points="0 0, 10 3.5, 0 7" fill="${COLORS.dim}"/></marker></defs>`;

  // Transitions
  transitions.forEach(t => {
    const from = stateMap[t.from], to = stateMap[t.to];
    if (!from || !to) return;

    if (t.from === t.to) {
      // Self-loop
      const d = `M${from.cx},${from.cy - stateR} C${from.cx - 30},${from.cy - stateR - 40} ${from.cx + 30},${from.cy - stateR - 40} ${from.cx},${from.cy - stateR}`;
      svg += `<path d="${d}" fill="none" stroke="${COLORS.dim}" stroke-width="1.5" marker-end="url(#sm-arrow)"/>`;
      if (t.label) svg += svgEl('text', { x: from.cx, y: from.cy - stateR - 30, fill: COLORS.accent, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(t.label));
    } else {
      const dx = to.cx - from.cx, dy = to.cy - from.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / dist, ny = dy / dist;
      const x1 = from.cx + nx * stateR, y1 = from.cy + ny * stateR;
      const x2 = to.cx - nx * (stateR + 8), y2 = to.cy - ny * (stateR + 8);

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${COLORS.dim}" stroke-width="1.5" marker-end="url(#sm-arrow)"/>`;
      if (t.label) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        svg += svgEl('text', { x: mx, y: my - 6, fill: COLORS.accent, 'font-size': SVG_XS, 'font-family': F_MONO, 'text-anchor': 'middle' }, escapeHtml(t.label));
      }
    }
  });

  // States
  Object.values(stateMap).forEach(s => {
    const isInitial = s.initial, isFinal = s.final;
    const color = isInitial ? COLORS.accent : isFinal ? '#f472b6' : COLORS.secondary;
    const fill = isInitial ? 'rgba(74, 222, 128, 0.08)' : isFinal ? 'rgba(244, 114, 182, 0.08)' : COLORS.elevated;

    svg += svgEl('circle', { cx: s.cx, cy: s.cy, r: stateR, fill, stroke: color, 'stroke-width': 1.5 });
    if (isFinal) svg += svgEl('circle', { cx: s.cx, cy: s.cy, r: stateR - 5, fill: 'none', stroke: color, 'stroke-width': 0.5 });
    if (isInitial) {
      // Initial arrow
      svg += `<line x1="${s.cx - stateR - 20}" y1="${s.cy}" x2="${s.cx - stateR - 2}" y2="${s.cy}" stroke="${COLORS.accent}" stroke-width="2" marker-end="url(#sm-arrow)"/>`;
    }
    svg += svgEl('text', { x: s.cx, y: s.cy + 4, fill: color, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(s.label));
  });

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'State Machine')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Venn Diagram ───────────────────────────────────────────────────────
function renderVenn(cfg) {
  const sets = cfg.sets || [];
  if (sets.length < 2) throw new Error('Venn needs at least 2 sets');

  const W = SVG_W, H = 450;
  const cx = W / 2, cy = H / 2 - 10;
  const R = 120;

  // Position sets
  const positions = sets.length === 2
    ? [{ x: cx - 60, y: cy }, { x: cx + 60, y: cy }]
    : [{ x: cx, y: cy - 45 }, { x: cx - 65, y: cy + 40 }, { x: cx + 65, y: cy + 40 }];

  let svg = '';

  sets.forEach((s, i) => {
    const p = positions[i];
    const color = resolveColor(s.color || (i + 1));
    svg += svgEl('circle', { cx: p.x, cy: p.y, r: R, fill: color, opacity: '0.1', stroke: color, 'stroke-width': 1.5 });
    // Label outside
    const labelAngle = sets.length === 2 ? (i === 0 ? Math.PI : 0) : (i * 2 * Math.PI / 3 - Math.PI / 2);
    const lx = p.x + (R + 20) * Math.cos(labelAngle);
    const ly = p.y + (R + 20) * Math.sin(labelAngle);
    svg += svgEl('text', { x: lx, y: ly + 4, fill: color, 'font-size': SVG_BASE, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '600' }, escapeHtml(s.label));
  });

  // Intersection labels
  if (cfg.intersections) {
    cfg.intersections.forEach(inter => {
      // Place at centroid of referenced sets
      let ix = 0, iy = 0;
      inter.sets.forEach(si => { ix += positions[si].x; iy += positions[si].y; });
      ix /= inter.sets.length; iy /= inter.sets.length;
      svg += svgEl('text', { x: ix, y: iy + 4, fill: COLORS.text, 'font-size': SVG_SM, 'font-family': F_SANS, 'text-anchor': 'middle', 'font-weight': '500' }, escapeHtml(inter.label));
    });
  }

  return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, xmlns: 'http://www.w3.org/2000/svg', style: 'width:100%;height:auto;' },
    svgEl('title', {}, escapeHtml(cfg.title || 'Venn Diagram')) +
    svgEl('rect', { width: W, height: H, fill: COLORS.card, rx: 0 }) + svg
  );
}

// ─── Export ─────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.initVisualDiagrams = initVisualDiagrams;
}
