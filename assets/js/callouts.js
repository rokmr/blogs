/**
 * Callout Blocks Module
 * Transforms blockquotes with [!TYPE] syntax into styled callouts
 */

function processCallouts() {
    // Lucide-style inline SVG icons (matching rokmr.github.io aesthetic)
    const svgIcon = (path, viewBox = '0 0 24 24') =>
        `<svg width="18" height="18" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

    const types = {
        'tip': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
            title: 'Tip'
        },
        'note': {
            icon: svgIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>'),
            title: 'Note'
        },
        'warning': {
            icon: svgIcon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
            title: 'Warning'
        },
        'danger': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'),
            title: 'Danger'
        },
        'question': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
            title: 'Question'
        },
        'info': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'),
            title: 'Info'
        },
        'abstract': {
            icon: svgIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
            title: 'Abstract'
        },
        'definition': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
            title: 'Definition'
        },
        'proof': {
            icon: svgIcon('<polyline points="20 6 9 17 4 12"/>'),
            title: 'Proof'
        },
        'example': {
            icon: svgIcon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'),
            title: 'Example'
        },
        'critical': {
            icon: svgIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
            title: 'Critical'
        },
        'success': {
            icon: svgIcon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
            title: 'Success'
        },
        'important': {
            icon: svgIcon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
            title: 'Important'
        },
        'caution': {
            icon: svgIcon('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
            title: 'Caution'
        }
    };

    document.querySelectorAll('.post-content blockquote').forEach(bq => {
        const text = bq.innerHTML;
        const match = text.match(/\[!(TIP|NOTE|WARNING|DANGER|QUESTION|INFO|ABSTRACT|DEFINITION|PROOF|EXAMPLE|CRITICAL|SUCCESS|IMPORTANT|CAUTION)\]/i);

        if (match) {
            const type = match[1].toLowerCase();
            const config = types[type] || types.note;

            bq.innerHTML = text.replace(match[0], '').trim();
            bq.className = `callout callout-${type}`;

            const title = document.createElement('div');
            title.className = 'callout-title';
            title.innerHTML = `${config.icon} ${config.title}`;

            const content = document.createElement('div');
            content.className = 'callout-content';
            content.innerHTML = bq.innerHTML;

            bq.innerHTML = '';
            bq.appendChild(title);
            bq.appendChild(content);
        }
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.processCallouts = processCallouts;
}
