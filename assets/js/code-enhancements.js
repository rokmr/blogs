/**
 * Code Enhancement Module
 * Handles copy buttons, line numbers, and collapsible code blocks
 */

/**
 * Enable line numbers on all code blocks using Prism.js
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
 * Collapsible Code Blocks
 * Usage: <div class="collapsible" data-label="Show Implementation">```python...```</div>
 */
function initCollapsibleCode() {
    document.querySelectorAll('.collapsible').forEach(container => {
        const label = container.dataset.label || 'Show Code';
        const pre = container.querySelector('pre');
        if (!pre) return;

        const details = document.createElement('details');
        details.className = 'collapsible-code';

        const summary = document.createElement('summary');
        summary.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
      ${label}
    `;

        details.appendChild(summary);
        details.appendChild(pre.cloneNode(true));
        container.replaceWith(details);
    });
}

/**
 * Escape HTML for safe insertion
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.enableLineNumbers = enableLineNumbers;
    window.addCopyButtons = addCopyButtons;
    window.initCollapsibleCode = initCollapsibleCode;
    window.escapeHtml = escapeHtml;
}
