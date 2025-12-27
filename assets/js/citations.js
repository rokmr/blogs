/**
 * Citation System Module
 * Parses [@key] citations and generates References section
 * 
 * Syntax: [@vaswani2017attention] → [1] with clickable link to References
 * 
 * Citations can be defined:
 * 1. Globally in _data/bibliography.yml
 * 2. Per-post in frontmatter under `citations:` key
 */

// Store for citations used in current page
const citationsUsed = new Map(); // key -> citation number
let citationCounter = 0;

/**
 * Load bibliography from global data and page-specific citations
 */
async function loadBibliography() {
    const bibliography = {};

    // Try to load global bibliography
    try {
        const baseUrl = document.querySelector('link[rel="alternate"]')?.href?.replace('/feed.xml', '') || '';
        const response = await fetch(`${baseUrl}/bibliography.json`);
        if (response.ok) {
            const global = await response.json();
            Object.assign(bibliography, global);
        }
    } catch (e) {
        // Global bibliography not available, that's okay
    }

    // Load page-specific citations from data attribute on body or post
    const pageData = document.querySelector('[data-citations]');
    if (pageData) {
        try {
            const pageCitations = JSON.parse(pageData.dataset.citations);
            Object.assign(bibliography, pageCitations);
        } catch (e) {
            console.warn('Failed to parse page citations:', e);
        }
    }

    return bibliography;
}

/**
 * Process all citations in the document
 */
async function initCitations() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    const bibliography = await loadBibliography();

    // Find all citation patterns [@key] or [@key1; @key2]
    const html = content.innerHTML;
    const citationPattern = /\[@([^\]]+)\]/g;

    // First pass: collect all citations and assign numbers
    let match;
    const allKeys = [];
    while ((match = citationPattern.exec(html)) !== null) {
        const keys = match[1].split(/;\s*@?/).map(k => k.trim().replace(/^@/, ''));
        keys.forEach(key => {
            if (!citationsUsed.has(key)) {
                citationCounter++;
                citationsUsed.set(key, citationCounter);
                allKeys.push(key);
            }
        });
    }

    if (citationsUsed.size === 0) return;

    // Second pass: replace citations with numbered links
    const processedHtml = html.replace(citationPattern, (match, keysStr) => {
        const keys = keysStr.split(/;\s*@?/).map(k => k.trim().replace(/^@/, ''));
        const numbers = keys.map(key => {
            const num = citationsUsed.get(key);
            return `<a href="#ref-${key}" class="citation-link" title="${getCitationTitle(key, bibliography)}">[${num}]</a>`;
        });
        return `<sup class="citation">${numbers.join(', ')}</sup>`;
    });

    content.innerHTML = processedHtml;

    // Generate References section
    generateReferencesSection(bibliography);
}

/**
 * Get citation title for tooltip
 */
function getCitationTitle(key, bibliography) {
    const cite = bibliography[key];
    if (!cite) return `Unknown citation: ${key}`;
    return `${cite.authors} (${cite.year}). ${cite.title}`;
}

/**
 * Generate the References section at the end of the post
 */
function generateReferencesSection(bibliography) {
    const content = document.querySelector('.post-content');
    if (!content || citationsUsed.size === 0) return;

    // Check if References section already exists
    if (document.querySelector('.references-section')) return;

    const referencesDiv = document.createElement('div');
    referencesDiv.className = 'references-section';
    referencesDiv.innerHTML = `
    <h2 id="references">References</h2>
    <ol class="references-list">
      ${Array.from(citationsUsed.entries())
            .sort((a, b) => a[1] - b[1])
            .map(([key, num]) => {
                const cite = bibliography[key];
                if (!cite) {
                    return `<li id="ref-${key}" class="reference-item reference-missing">
              <span class="ref-number">[${num}]</span>
              <span class="ref-text">Missing citation: ${key}</span>
            </li>`;
                }

                const urlHtml = cite.url
                    ? `<a href="${cite.url}" target="_blank" rel="noopener" class="ref-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>`
                    : '';

                const doiHtml = cite.doi
                    ? `<a href="https://doi.org/${cite.doi}" class="ref-doi" target="_blank" rel="noopener">DOI</a>`
                    : '';

                return `<li id="ref-${key}" class="reference-item">
            <span class="ref-number">[${num}]</span>
            <span class="ref-text">
              <span class="ref-authors">${cite.authors}</span>
              <span class="ref-year">(${cite.year}).</span>
              <span class="ref-title">${cite.title}.</span>
              ${cite.venue ? `<span class="ref-venue"><em>${cite.venue}</em>.</span>` : ''}
              ${urlHtml}
              ${doiHtml}
            </span>
          </li>`;
            }).join('')}
    </ol>
  `;

    // Insert before comments or at end of content
    const comments = document.querySelector('.comments') || document.querySelector('.giscus');
    if (comments) {
        comments.parentNode.insertBefore(referencesDiv, comments);
    } else {
        content.appendChild(referencesDiv);
    }
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initCitations = initCitations;
}
