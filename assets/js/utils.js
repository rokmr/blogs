/**
 * Utilities Module
 * Shared helper functions and small utilities
 */

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
 * Copy BibTeX citation (global function for onclick)
 */
window.copyBibtex = function () {
    const title = document.querySelector('.post-title')?.textContent || 'Blog Post';
    const author = 'Rohit Kumar';
    const year = new Date().getFullYear();
    const url = window.location.href;
    const slug = url.split('/').filter(Boolean).pop();

    const bibtex = `@misc{${slug.replace(/-/g, '_')}_${year},
  author = {${author}},
  title = {${title}},
  year = {${year}},
  url = {${url}},
  note = {Accessed: ${new Date().toISOString().split('T')[0]}}
}`;

    navigator.clipboard.writeText(bibtex).then(() => {
        const btn = document.querySelector('.quick-action-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }
    });
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.wrapTables = wrapTables;
    window.initInteractiveMath = initInteractiveMath;
}
