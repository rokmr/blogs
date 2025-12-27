/**
 * Mermaid Diagrams Module
 * Initializes and renders Mermaid.js diagrams with blog-matching theme
 */

function initMermaidDiagrams() {
    if (typeof mermaid === 'undefined') return;

    // Configure Mermaid with dark theme matching blog aesthetic
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
            primaryColor: '#4ade80',
            primaryTextColor: '#e8e8e8',
            primaryBorderColor: '#222222',
            lineColor: '#666666',
            secondaryColor: '#161616',
            tertiaryColor: '#111111',
            background: '#111111',
            mainBkg: '#111111',
            nodeBorder: '#4ade80',
            clusterBkg: '#161616',
            clusterBorder: '#222222',
            titleColor: '#e8e8e8',
            edgeLabelBackground: '#111111'
        },
        flowchart: {
            curve: 'basis',
            padding: 20
        },
        sequence: {
            actorMargin: 50,
            boxMargin: 10
        }
    });

    // Find all mermaid code blocks and render them
    document.querySelectorAll('pre code.language-mermaid, .highlight-mermaid pre code').forEach(async (codeBlock, index) => {
        const code = codeBlock.textContent;
        const pre = codeBlock.closest('pre');
        const container = pre.closest('.highlight') || pre;

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';
        wrapper.innerHTML = `
      <div class="mermaid-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <span>Diagram</span>
      </div>
      <div class="mermaid-body" id="mermaid-${index}"></div>
    `;

        container.replaceWith(wrapper);

        // Render the diagram
        try {
            const { svg } = await mermaid.render(`mermaid-svg-${index}`, code);
            wrapper.querySelector('.mermaid-body').innerHTML = svg;
        } catch (e) {
            wrapper.querySelector('.mermaid-body').innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${e.message}</pre>`;
        }
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initMermaidDiagrams = initMermaidDiagrams;
}
