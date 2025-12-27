/**
 * Table of Contents Module
 * Builds TOC from headings with active state tracking
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

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.buildTableOfContents = buildTableOfContents;
    window.initReadingProgress = initReadingProgress;
}
