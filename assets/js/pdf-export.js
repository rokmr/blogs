/**
 * PDF Export — dom-to-image + jsPDF
 *
 * WHY: html2canvas has a broken CSS engine that doesn't support
 * CSS variables, causing blank/dark/cropped PDFs. ABANDONED.
 *
 * NEW APPROACH:
 *   dom-to-image-more uses SVG foreignObject → the BROWSER renders HTML.
 *   CSS variables, KaTeX, Prism syntax — everything works because the
 *   browser's own rendering engine handles it.
 *
 * Flow:
 *   1. Clone content, clean interactive elements
 *   2. Build container, set CSS variable overrides to light theme
 *   3. Prepend to body (behind white overlay — user sees "Generating PDF…")
 *   4. dom-to-image renders element → canvas (browser rendering = correct)
 *   5. jsPDF slices canvas into A4 pages
 *   6. Auto-download. No print dialog.
 */

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 15;
const CONTENT_W_MM = A4_W_MM - MARGIN_MM * 2; // 180mm
const PX_PER_MM = 3.7795;                      // 96dpi
const CONTAINER_PX = Math.round(CONTENT_W_MM * PX_PER_MM); // ~680px

/* Light-theme CSS variable overrides */
const LIGHT_VARS = {
    '--bg': '#ffffff', '--bg-secondary': '#f8f8f8', '--bg-card': '#f8f8f8',
    '--bg-elevated': '#f0f0f0', '--bg-code': '#f6f6f6', '--bg-code-header': '#eeeeee',
    '--text': '#222222', '--text-secondary': '#555555', '--text-muted': '#888888',
    '--dim': '#888888', '--border': '#dddddd', '--border-hover': '#cccccc',
    '--accent': '#333333', '--accent-text': '#222222',
    '--code-text': '#333333', '--code-keyword': '#555555', '--code-string': '#666666',
    '--code-comment': '#999999', '--code-function': '#333333',
    '--tip-bg': '#f0faf0', '--tip-border': '#4ade80', '--tip-text': '#166534',
    '--note-bg': '#f0f5ff', '--note-border': '#60a5fa', '--note-text': '#1e40af',
    '--warning-bg': '#fffbeb', '--warning-border': '#eab308', '--warning-text': '#854d0e',
    '--danger-bg': '#fef2f2', '--danger-border': '#ef4444', '--danger-text': '#991b1b',
    '--question-bg': '#faf5ff', '--question-border': '#a855f7',
    '--eq-bg': '#fafafa', '--eq-border': '#e5e5e5',
};

async function exportToPDF() {
    /* ── Load libraries ── */
    await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/dom-to-image-more@3.3.0/dist/dom-to-image-more.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
    ]);

    const postContent = document.querySelector('.post-content') || document.querySelector('.note-content');
    if (!postContent) { console.error('No content found'); return; }

    /* ── Metadata ── */
    const title = (document.querySelector('.post-title') || document.querySelector('.note-title'))?.textContent?.trim() || 'Document';
    const metaEl = document.querySelector('.post-meta');
    const description = document.querySelector('.note-description')?.textContent?.trim() || '';
    const metaParts = [];
    if (metaEl) {
        const t = metaEl.querySelector('time');          if (t) metaParts.push(t.textContent.trim());
        const s = metaEl.querySelector('.note-subject');  if (s) metaParts.push(s.textContent.trim());
        const r = metaEl.querySelector('.reading-time');  if (r) metaParts.push(r.textContent.trim());
        const tags = metaEl.querySelectorAll('.tag');
        if (tags.length) metaParts.push(Array.from(tags).map(tg => tg.textContent.trim()).join(', '));
    }

    /* ── Button loading ── */
    const exportBtn = document.querySelector('[onclick*="exportToPDF"]');
    const originalHTML = exportBtn?.innerHTML;
    if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<span class="spinner"></span> Generating PDF…';
    }

    try {
        /* ── Clone & clean ── */
        const clone = postContent.cloneNode(true);
        [
            '.runnable-output', '.copy-btn', '.eq-copy-btn', '.hf-space',
            '.video-embed', '.video-wrapper', '.image-compare',
            '.slide-viewer', '.slides-section',
            '.code-actions', '.runnable-actions',
            '.visual-diagram-actions', '.visual-diagram-action-btn',
            '.lightbox-overlay', '.backlinks-section', '.backlinks-container',
        ].forEach(sel => clone.querySelectorAll(sel).forEach(e => e.remove()));
        clone.querySelectorAll('details, .collapsible-code').forEach(e => e.setAttribute('open', ''));
        clone.querySelectorAll('img.invert-dark').forEach(img => {
            img.style.filter = 'none';
            img.classList.remove('invert-dark');
        });

        /* ── Build container ── */
        const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
        const metaLine = metaParts.length ? metaParts.join(' · ') : '';
        const fDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        const root = document.createElement('div');
        root.id = 'pdf-render';

        root.innerHTML = `
          <div style="border-bottom:2px solid #ddd;padding-bottom:10px;margin-bottom:14px">
            <h1 style="font-size:17px;font-weight:700;color:#000;margin:0 0 3px;line-height:1.25;border:none;padding:0">${esc(title)}</h1>
            ${metaLine ? `<div style="font-size:8.5px;color:#888;font-family:'JetBrains Mono',monospace">${metaLine}</div>` : ''}
            ${description ? `<div style="font-size:10px;color:#555;margin-top:4px;font-style:italic">${esc(description)}</div>` : ''}
          </div>
          <div id="pdf-render-body"></div>
          <div style="margin-top:18px;padding-top:6px;border-top:1px solid #ddd;font-size:8px;color:#aaa;font-family:'JetBrains Mono',monospace;text-align:center">${esc(window.location.href)} · ${fDate}</div>
        `;
        root.querySelector('#pdf-render-body').appendChild(clone);

        /* ── Set light-theme CSS variables on container ── */
        for (const [k, v] of Object.entries(LIGHT_VARS)) {
            root.style.setProperty(k, v);
        }

        /* ── Container sizing: matches PDF content area exactly ── */
        /* Off-screen: dom-to-image serializes DOM, doesn't need on-screen */
        Object.assign(root.style, {
            position:   'fixed',
            left:       '-9999px',
            top:        '0',
            width:      CONTAINER_PX + 'px',
            maxWidth:   CONTAINER_PX + 'px',
            background: '#ffffff',
            color:      '#222',
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize:   '11px',
            lineHeight: '1.6',
            padding:    '0',
            margin:     '0',
            overflow:   'hidden',
            boxSizing:  'border-box',
            zIndex:     '-1',
        });

        /* ── Insert off-screen ── */
        document.body.appendChild(root);

        // Let layout + fonts settle
        await new Promise(r => setTimeout(r, 600));
        root.offsetHeight;

        const elHeight = root.scrollHeight;

        /* ── Render to canvas using dom-to-image (BROWSER rendering) ── */
        // Scale 2x for sharp text (~192 effective DPI — standard print quality)
        const scale = 2;
        const canvas = await domtoimage.toCanvas(root, {
            width:  CONTAINER_PX * scale,
            height: elHeight * scale,
            style:  {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: CONTAINER_PX + 'px',
                height: elHeight + 'px',
            },
            filter: (node) => {
                if (node.style && node.style.zIndex === '99999') return false;
                return true;
            },
        });

        /* ── Build multi-page A4 PDF from canvas ── */
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });

        const contentWidthMM = CONTENT_W_MM;
        const contentHeightMM = A4_H_MM - MARGIN_MM * 2; // 267mm

        // How many canvas pixels per PDF page
        const canvasPageHeight = Math.floor((contentHeightMM / contentWidthMM) * canvas.width);
        const totalPages = Math.ceil(canvas.height / canvasPageHeight);

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) pdf.addPage();

            // Slice this page's portion from the full canvas
            const sliceY = page * canvasPageHeight;
            const sliceH = Math.min(canvasPageHeight, canvas.height - sliceY);

            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sliceH;

            const ctx = pageCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas,
                0, sliceY, canvas.width, sliceH,   // source
                0, 0, canvas.width, sliceH           // dest
            );

            const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
            const imgHeightMM = (sliceH / canvas.width) * contentWidthMM;

            pdf.addImage(imgData, 'JPEG', MARGIN_MM, MARGIN_MM, contentWidthMM, imgHeightMM, undefined, 'FAST');
        }

        /* ── Save ── */
        const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf';
        pdf.save(filename);

        /* ── Cleanup ── */
        root.remove();

    } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF generation failed: ' + err.message);
    } finally {
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.innerHTML = originalHTML || `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF`;
        }
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

if (typeof window !== 'undefined') {
    window.exportToPDF = exportToPDF;
}
