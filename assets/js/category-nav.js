/**
 * Category Navigation Module
 * Handles smooth scroll and active state for category navigation
 */

/**
 * Initialize category navigation with smooth scroll and active state
 */
function initCategoryNav() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const sections = document.querySelectorAll('.category-section');

    if (categoryLinks.length === 0 || sections.length === 0) return;

    // Smooth scroll and active state on click
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active state on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
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
