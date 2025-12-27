/**
 * Cross-References Module
 * Handles labeling and referencing figures, tables, equations, and code blocks
 * 
 * Label Syntax: {#type:name} where type is fig, tbl, eq, code, sec
 * Reference Syntax: {@type:name} creates clickable link
 * 
 * Examples:
 *   ![Attention diagram](image.png){#fig:attention}
 *   {@fig:attention} → "Figure 1"
 *   
 *   | Header |{#tbl:results}
 *   {@tbl:results} → "Table 1"
 */

// Counters for each reference type
const refCounters = {
    fig: 0,
    tbl: 0,
    eq: 0,
    code: 0,
    sec: 0,
    alg: 0
};

// Map of labels to their numbers and elements
const labelMap = new Map();

// Display names for each type
const typeNames = {
    fig: 'Figure',
    tbl: 'Table',
    eq: 'Equation',
    code: 'Listing',
    sec: 'Section',
    alg: 'Algorithm'
};

/**
 * Initialize cross-references system
 */
function initCrossReferences() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    // First pass: find all labels and assign numbers
    processLabels(content);

    // Second pass: replace all references with links
    processReferences(content);

    // Add equation numbers to display math
    numberEquations(content);
}

/**
 * Process labels {#type:name} in content
 */
function processLabels(content) {
    const html = content.innerHTML;
    const labelPattern = /\{#(fig|tbl|eq|code|sec|alg):([^}]+)\}/g;

    let match;
    while ((match = labelPattern.exec(html)) !== null) {
        const [fullMatch, type, name] = match;
        if (!labelMap.has(`${type}:${name}`)) {
            refCounters[type]++;
            labelMap.set(`${type}:${name}`, {
                number: refCounters[type],
                type: type,
                name: name
            });
        }
    }

    // Remove label markers from content but add IDs
    content.innerHTML = html.replace(labelPattern, (match, type, name) => {
        const info = labelMap.get(`${type}:${name}`);
        return `<span id="${type}-${name}" class="ref-anchor" data-ref-type="${type}" data-ref-num="${info.number}"></span>`;
    });

    // Add figure/table captions with numbers
    addCaptionNumbers(content);
}

/**
 * Add numbers to figure and table captions
 */
function addCaptionNumbers(content) {
    // Process figures with labels
    content.querySelectorAll('.ref-anchor[data-ref-type="fig"]').forEach(anchor => {
        const num = anchor.dataset.refNum;
        const figure = anchor.closest('figure') || anchor.previousElementSibling;
        if (figure) {
            const caption = figure.querySelector('figcaption');
            if (caption && !caption.dataset.numbered) {
                caption.innerHTML = `<strong>Figure ${num}:</strong> ${caption.innerHTML}`;
                caption.dataset.numbered = 'true';
            }
        }
    });

    // Process tables with labels
    content.querySelectorAll('.ref-anchor[data-ref-type="tbl"]').forEach(anchor => {
        const num = anchor.dataset.refNum;
        const table = anchor.closest('table') || anchor.nextElementSibling;
        if (table && table.tagName === 'TABLE') {
            const caption = table.querySelector('caption');
            if (caption && !caption.dataset.numbered) {
                caption.innerHTML = `<strong>Table ${num}:</strong> ${caption.innerHTML}`;
                caption.dataset.numbered = 'true';
            } else if (!caption) {
                const newCaption = document.createElement('caption');
                newCaption.innerHTML = `<strong>Table ${num}</strong>`;
                newCaption.dataset.numbered = 'true';
                table.insertBefore(newCaption, table.firstChild);
            }
        }
    });
}

/**
 * Process references {@type:name} in content
 */
function processReferences(content) {
    const html = content.innerHTML;
    const refPattern = /\{@(fig|tbl|eq|code|sec|alg):([^}]+)\}/g;

    content.innerHTML = html.replace(refPattern, (match, type, name) => {
        const info = labelMap.get(`${type}:${name}`);
        if (!info) {
            return `<span class="ref-broken" title="Undefined reference: ${type}:${name}">[??]</span>`;
        }

        const displayText = `${typeNames[type]} ${info.number}`;
        return `<a href="#${type}-${name}" class="cross-ref" data-ref-type="${type}">${displayText}</a>`;
    });
}

/**
 * Number display equations with \label{eq:name}
 */
function numberEquations(content) {
    // Find equations with labels using KaTeX's equation numbering
    content.querySelectorAll('.katex-display').forEach((eq, index) => {
        const eqText = eq.textContent;
        const labelMatch = eqText.match(/\\label\{eq:([^}]+)\}/);

        if (labelMatch) {
            const name = labelMatch[1];
            if (!labelMap.has(`eq:${name}`)) {
                refCounters.eq++;
                labelMap.set(`eq:${name}`, {
                    number: refCounters.eq,
                    type: 'eq',
                    name: name
                });
            }

            const info = labelMap.get(`eq:${name}`);

            // Add equation number
            eq.id = `eq-${name}`;
            eq.classList.add('numbered-equation');

            const numSpan = document.createElement('span');
            numSpan.className = 'equation-number';
            numSpan.textContent = `(${info.number})`;
            eq.appendChild(numSpan);
        }
    });

    // Process \eqref{eq:name} references
    const html = content.innerHTML;
    const eqrefPattern = /\\eqref\{eq:([^}]+)\}/g;

    content.innerHTML = html.replace(eqrefPattern, (match, name) => {
        const info = labelMap.get(`eq:${name}`);
        if (!info) {
            return `<span class="ref-broken">(??)</span>`;
        }
        return `<a href="#eq-${name}" class="cross-ref eq-ref">(${info.number})</a>`;
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initCrossReferences = initCrossReferences;
}
