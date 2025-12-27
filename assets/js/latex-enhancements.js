/**
 * LaTeX Enhancements Module
 * Provides theorem environments and enhanced math features
 * 
 * Syntax (in callouts):
 *   > [!THEOREM]
 *   > **Theorem Name**: Statement of the theorem...
 *   
 *   > [!LEMMA]
 *   > > [!COROLLARY]
 *   > > [!PROPOSITION]
 *   > > [!DEFINITION]
 */

// Counters for theorem-like environments
const theoremCounters = {
    theorem: 0,
    lemma: 0,
    corollary: 0,
    proposition: 0,
    definition: 0,
    axiom: 0,
    remark: 0
};

/**
 * Initialize LaTeX enhancements
 */
function initLatexEnhancements() {
    // Number theorem environments
    numberTheoremEnvironments();

    // Add copy button to equation blocks
    addEquationCopyButtons();

    // Initialize equation tooltips
    initEquationTooltips();
}

/**
 * Add numbers to theorem-like callouts
 */
function numberTheoremEnvironments() {
    const theoremTypes = ['theorem', 'lemma', 'corollary', 'proposition', 'definition', 'axiom', 'remark'];

    theoremTypes.forEach(type => {
        document.querySelectorAll(`.callout-${type}`).forEach(callout => {
            const title = callout.querySelector('.callout-title');
            if (title && !title.dataset.numbered) {
                theoremCounters[type]++;
                const typeName = type.charAt(0).toUpperCase() + type.slice(1);

                // Check if there's a custom name in the title
                const titleText = title.textContent.trim();
                const customName = titleText.replace(new RegExp(typeName, 'i'), '').trim();

                title.innerHTML = title.innerHTML.replace(
                    /(<\/svg>)\s*\w+/,
                    `$1 <span class="theorem-type">${typeName} ${theoremCounters[type]}</span>${customName ? ` (${customName})` : ''}`
                );
                title.dataset.numbered = 'true';

                // Add ID for cross-referencing
                callout.id = `${type}-${theoremCounters[type]}`;
            }
        });
    });
}

/**
 * Add copy buttons to display equations
 */
function addEquationCopyButtons() {
    document.querySelectorAll('.katex-display').forEach(eq => {
        if (eq.querySelector('.eq-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'eq-copy-btn';
        btn.title = 'Copy LaTeX';
        btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;

        btn.addEventListener('click', async () => {
            // Get the LaTeX source from the annotation
            const annotation = eq.querySelector('annotation[encoding="application/x-tex"]');
            const latex = annotation ? annotation.textContent : eq.textContent;

            try {
                await navigator.clipboard.writeText(latex);
                btn.classList.add('copied');
                btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
                }, 2000);
            } catch (e) {
                console.error('Failed to copy equation:', e);
            }
        });

        eq.style.position = 'relative';
        eq.appendChild(btn);
    });
}

/**
 * Initialize equation tooltips for inline math
 */
function initEquationTooltips() {
    // Add tooltips to inline math with data-tooltip attribute
    document.querySelectorAll('.katex[data-tooltip]').forEach(math => {
        const tooltip = document.createElement('span');
        tooltip.className = 'math-tooltip';
        tooltip.textContent = math.dataset.tooltip;
        math.appendChild(tooltip);
        math.classList.add('has-tooltip');
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initLatexEnhancements = initLatexEnhancements;
}
