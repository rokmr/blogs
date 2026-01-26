/**
 * Slide Viewer Component
 * 
 * Embeds PDF slides with interactive viewer and fullscreen support
 * Uses PDF.js for rendering
 * 
 * Usage in markdown:
 * ```html
 * <div class="slide-viewer" data-pdf="/path/to/slides.pdf"></div>
 * ```
 * 
 * Or with frontmatter:
 * slides:
 *   - title: "Lecture Slides"
 *     url: "/path/to/slides.pdf"
 */

// PDF.js configuration
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';
let pdfjsLib = null;

// Load PDF.js library dynamically
async function loadPDFJS() {
  if (pdfjsLib) return pdfjsLib;
  
  return new Promise((resolve, reject) => {
    // Load PDF.js script
    const script = document.createElement('script');
    script.src = `${PDFJS_CDN}/pdf.min.js`;
    script.onload = () => {
      pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_CDN}/pdf.worker.min.js`;
      resolve(pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

class SlideViewer {
  constructor(container, pdfUrl, lazy = false) {
    this.container = container;
    this.pdfUrl = pdfUrl;
    this.pdf = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.scale = 1.5;
    this.isFullscreen = false;
    this.canvas = null;
    this.context = null;
    this.lazy = lazy;
    this.initialized = false;
    
    // Store instance reference on container for later access
    this.container._slideViewerInstance = this;
    
    this.init();
  }

  async init() {
    this.render();
    if (!this.lazy) {
      await this.loadPDF();
    }
  }

  async ensureLoaded() {
    if (!this.initialized && !this.pdf) {
      this.initialized = true;
      await this.loadPDF();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="slide-viewer-wrapper">
        <div class="slide-viewer-toolbar">
          <div class="slide-viewer-info">
            <span class="slide-viewer-title">
              ${this.container.dataset.title || 'Slides'}
            </span>
          </div>
          <div class="slide-viewer-controls">
            <button class="slide-btn" data-action="prev" title="Previous slide">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 2L5 8l6 6V2z"/>
              </svg>
            </button>
            <span class="slide-viewer-page">
              <input type="number" class="slide-page-input" value="1" min="1"> 
              / <span class="slide-total-pages">-</span>
            </span>
            <button class="slide-btn" data-action="next" title="Next slide">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 2v12l6-6-6-6z"/>
              </svg>
            </button>
            <div class="slide-divider"></div>
            <button class="slide-btn" data-action="zoom-out" title="Zoom out">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 7h12v2H2z"/>
              </svg>
            </button>
            <span class="slide-zoom-level">150%</span>
            <button class="slide-btn" data-action="zoom-in" title="Zoom in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M7 2v5H2v2h5v5h2V9h5V7H9V2z"/>
              </svg>
            </button>
            <div class="slide-divider"></div>
            <button class="slide-btn" data-action="fullscreen" title="Fullscreen">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1v6h2V3h4V1H1zm8 0v2h4v4h2V1H9zM3 9H1v6h6v-2H3V9zm10 0v4H9v2h6V9h-2z"/>
              </svg>
            </button>
            <button class="slide-btn" data-action="download" title="Download PDF">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 11L3 6h3V0h4v6h3l-5 5zM0 14h16v2H0z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="slide-viewer-canvas-container">
          <canvas class="slide-viewer-canvas"></canvas>
          <div class="slide-loading">Loading slides...</div>
          <div class="slide-error" style="display: none;">
            Failed to load PDF. 
            <a href="${this.pdfUrl}" target="_blank">Open PDF directly</a>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('.slide-viewer-canvas');
    this.context = this.canvas.getContext('2d');
    
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Navigation buttons
    this.container.querySelector('[data-action="prev"]').addEventListener('click', async () => {
      await this.ensureLoaded();
      this.prevPage();
    });
    this.container.querySelector('[data-action="next"]').addEventListener('click', async () => {
      await this.ensureLoaded();
      this.nextPage();
    });
    
    // Zoom buttons
    this.container.querySelector('[data-action="zoom-in"]').addEventListener('click', async () => {
      await this.ensureLoaded();
      this.zoomIn();
    });
    this.container.querySelector('[data-action="zoom-out"]').addEventListener('click', async () => {
      await this.ensureLoaded();
      this.zoomOut();
    });
    
    // Fullscreen button
    this.container.querySelector('[data-action="fullscreen"]').addEventListener('click', async () => {
      await this.ensureLoaded();
      this.toggleFullscreen();
    });
    
    // Download button
    this.container.querySelector('[data-action="download"]').addEventListener('click', () => this.download());
    
    // Page input
    const pageInput = this.container.querySelector('.slide-page-input');
    pageInput.addEventListener('change', async (e) => {
      await this.ensureLoaded();
      const page = parseInt(e.target.value);
      if (page >= 1 && page <= this.totalPages) {
        this.goToPage(page);
      } else {
        e.target.value = this.currentPage;
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', async (e) => {
      if (!this.isInView()) return;
      
      await this.ensureLoaded();
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.prevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.nextPage();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToPage(this.totalPages);
      }
    });

    // Fullscreen change
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
      this.container.classList.toggle('fullscreen', this.isFullscreen);
      
      // Update fullscreen button icon
      const fullscreenBtn = this.container.querySelector('[data-action="fullscreen"]');
      if (fullscreenBtn) {
        fullscreenBtn.title = this.isFullscreen ? 'Exit fullscreen' : 'Fullscreen';
        const svg = fullscreenBtn.querySelector('svg');
        if (svg) {
          if (this.isFullscreen) {
            // Exit fullscreen icon (minimize)
            svg.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>';
          } else {
            // Enter fullscreen icon (maximize)
            svg.innerHTML = '<path d="M1 1v6h2V3h4V1H1zm8 0v2h4v4h2V1H9zM3 9H1v6h6v-2H3V9zm10 0v4H9v2h6V9h-2z"/>';
          }
        }
      }
      
      // Re-render with new size
      if (this.pdf) {
        setTimeout(() => this.renderPage(this.currentPage), 100);
      }
    });
  }

  isInView() {
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  async loadPDF() {
    try {
      const loading = this.container.querySelector('.slide-loading');
      const error = this.container.querySelector('.slide-error');
      
      loading.style.display = 'block';
      error.style.display = 'none';

      // Ensure PDF.js is loaded
      await loadPDFJS();

      // Load PDF
      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      this.pdf = await loadingTask.promise;
      this.totalPages = this.pdf.numPages;

      // Update UI
      this.container.querySelector('.slide-total-pages').textContent = this.totalPages;
      this.container.querySelector('.slide-page-input').max = this.totalPages;
      
      loading.style.display = 'none';
      
      // Render first page
      await this.renderPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      this.container.querySelector('.slide-loading').style.display = 'none';
      this.container.querySelector('.slide-error').style.display = 'block';
    }
  }

  async renderPage(pageNum) {
    if (!this.pdf || pageNum < 1 || pageNum > this.totalPages) return;

    this.currentPage = pageNum;
    this.container.querySelector('.slide-page-input').value = pageNum;

    const page = await this.pdf.getPage(pageNum);
    
    // Calculate scale based on container width
    const containerWidth = this.container.querySelector('.slide-viewer-canvas-container').clientWidth;
    const viewport = page.getViewport({ scale: 1 });
    const scale = this.scale * (containerWidth / viewport.width);
    const scaledViewport = page.getViewport({ scale });

    // Set canvas dimensions
    this.canvas.width = scaledViewport.width;
    this.canvas.height = scaledViewport.height;

    // Render
    const renderContext = {
      canvasContext: this.context,
      viewport: scaledViewport
    };

    await page.render(renderContext).promise;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
    // Remove focus from button
    document.activeElement?.blur();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
    // Remove focus from button
    document.activeElement?.blur();
  }

  goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.renderPage(pageNum);
    }
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.25, 3);
    this.updateZoomLevel();
    this.renderPage(this.currentPage);
    // Remove focus from button
    document.activeElement?.blur();
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.25, 0.5);
    this.updateZoomLevel();
    this.renderPage(this.currentPage);
    // Remove focus from button
    document.activeElement?.blur();
  }

  updateZoomLevel() {
    this.container.querySelector('.slide-zoom-level').textContent = Math.round(this.scale * 100) + '%';
  }

  toggleFullscreen() {
    const btn = this.container.querySelector('[data-action="fullscreen"]');
    
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
    
    // Remove focus from button after click
    if (btn) {
      btn.blur();
    }
  }

  download() {
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = this.pdfUrl.split('/').pop();
    link.click();
  }
}

// Initialize all slide viewers on page
function initSlideViewers() {
  const viewers = document.querySelectorAll('.slide-viewer');
  
  viewers.forEach(viewer => {
    const pdfUrl = viewer.dataset.pdf;
    const lazy = viewer.dataset.lazy === 'true';
    if (pdfUrl) {
      new SlideViewer(viewer, pdfUrl, lazy);
    }
  });

  // Setup collapsible sections
  setupSlidesCollapsible();

  // Also process frontmatter-based slides
  processSlidesFrontmatter();
}

// Setup collapsible slides section
function setupSlidesCollapsible() {
  const collapsibles = document.querySelectorAll('.slides-collapsible');
  
  collapsibles.forEach(collapsible => {
    collapsible.addEventListener('toggle', async () => {
      if (collapsible.open) {
        // Load all slide viewers inside this collapsible
        const viewers = collapsible.querySelectorAll('.slide-viewer');
        for (const viewer of viewers) {
          // Find the SlideViewer instance and ensure it's loaded
          const viewerInstance = viewer._slideViewerInstance;
          if (viewerInstance) {
            await viewerInstance.ensureLoaded();
          }
        }
      }
    });
  });
}

// Process slides from page frontmatter
function processSlidesFrontmatter() {
  // Check if slides data is available in page
  const slidesData = document.querySelector('[data-slides]');
  if (!slidesData) return;

  try {
    const slides = JSON.parse(slidesData.dataset.slides);
    if (!slides || !Array.isArray(slides)) return;

    // Create slide viewer for each slide entry
    slides.forEach(slide => {
      if (slide.url) {
        // Find reference to insert after (typically after references section)
        const refSection = document.querySelector('.references-section');
        const insertPoint = refSection || document.querySelector('.post-content');
        
        if (insertPoint) {
          const slideContainer = document.createElement('div');
          slideContainer.className = 'slide-viewer';
          slideContainer.dataset.pdf = slide.url;
          slideContainer.dataset.title = slide.title || 'Slides';
          
          if (refSection) {
            refSection.parentNode.insertBefore(slideContainer, refSection.nextSibling);
          } else {
            insertPoint.appendChild(slideContainer);
          }
          
          new SlideViewer(slideContainer, slide.url);
        }
      }
    });
  } catch (e) {
    console.error('Error processing slides frontmatter:', e);
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSlideViewers };
}
