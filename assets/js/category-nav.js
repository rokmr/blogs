/**
 * Category Navigation Module
 * (Filter pills are handled inline in home.html)
 */

function initCategoryNav() {
    // No-op: filtering is now inline in home layout
}

/**
 * Copy BibTeX citation to clipboard
 */
function copyBibtex() {
    const bibtexEl = document.getElementById('bibtex-content');
    if (!bibtexEl) return;

    const bibtex = bibtexEl.textContent;
    navigator.clipboard.writeText(bibtex).then(() => {
        const btn = document.querySelector('.copy-bibtex-btn');
        if (!btn) return;

        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#22c55e';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
        }, 2000);
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initCategoryNav = initCategoryNav;
    window.copyBibtex = copyBibtex;
}
