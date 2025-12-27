/**
 * Inline Formatting Module
 * Handles special inline syntax: highlights, abbreviations
 * 
 * Syntax:
 *   ==highlighted text== → <mark>highlighted text</mark>
 *   ^^superscript^^ → <sup>superscript</sup>
 *   ~~subscript~~ → <sub>subscript</sub> (note: different from strikethrough)
 *   ::abbreviation|full text:: → <abbr title="full text">abbreviation</abbr>
 */

function initInlineFormatting() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    let html = content.innerHTML;

    // Process highlights ==text==
    html = html.replace(/==([^=]+)==/g, '<mark class="inline-highlight">$1</mark>');

    // Process keyboard shortcuts [[Ctrl+C]]
    html = html.replace(/\[\[([^\]]+)\]\]/g, (match, keys) => {
        const keyParts = keys.split('+').map(k => `<kbd>${k.trim()}</kbd>`);
        return `<span class="kbd-combo">${keyParts.join('<span class="kbd-plus">+</span>')}</span>`;
    });

    // Process abbreviations ::abbr|full::
    html = html.replace(/::([^|]+)\|([^:]+)::/g, '<abbr title="$2" class="inline-abbr">$1</abbr>');

    // Process small caps ///text///
    html = html.replace(/\/\/\/([^/]+)\/\/\//g, '<span class="small-caps">$1</span>');

    content.innerHTML = html;
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initInlineFormatting = initInlineFormatting;
}
