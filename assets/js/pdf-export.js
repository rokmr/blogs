/**
 * PDF Export Module
 * Downloads the current post as a PDF with proper math and code rendering
 * Uses html2pdf.js library
 */

async function exportToPDF() {
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        // Load html2pdf dynamically
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }

    const postContent = document.querySelector('.post-content');
    const postTitle = document.querySelector('.post-title')?.textContent || 'Document';
    const postMeta = document.querySelector('.post-meta');

    if (!postContent) {
        console.error('No post content found');
        return;
    }

    // Show loading state
    const exportBtn = document.querySelector('[onclick*="exportToPDF"]');
    if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<span class="spinner"></span> Generating...';
    }

    // Clone content for PDF generation
    const clone = document.createElement('div');
    clone.className = 'pdf-export-container';
    clone.innerHTML = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #333; max-width: 100%; padding: 20px;">
      <h1 style="font-size: 24px; margin-bottom: 8px; color: #000;">${postTitle}</h1>
      ${postMeta ? `<div style="font-size: 12px; color: #666; margin-bottom: 24px;">${postMeta.textContent}</div>` : ''}
      <div class="pdf-content"></div>
    </div>
  `;

    // Clone the actual content
    const contentClone = postContent.cloneNode(true);

    // Remove interactive elements not suitable for PDF
    contentClone.querySelectorAll('.runnable-header, .runnable-output, .copy-btn, .hf-space, .video-embed, .image-compare').forEach(el => el.remove());

    clone.querySelector('.pdf-content').appendChild(contentClone);

    // Temporarily add to document for rendering
    document.body.appendChild(clone);

    // Wait for any remaining KaTeX to render
    await new Promise(resolve => setTimeout(resolve, 500));

    // PDF options
    const opt = {
        margin: [15, 15, 15, 15],
        filename: `${postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        await html2pdf().set(opt).from(clone).save();
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF generation failed. Please try again.');
    } finally {
        // Cleanup
        document.body.removeChild(clone);

        // Reset button
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download PDF
      `;
        }
    }
}

/**
 * Helper function to load external scripts
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Export for global access
if (typeof window !== 'undefined') {
    window.exportToPDF = exportToPDF;
}
