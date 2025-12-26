/**
 * Presentation Mode (Reveal.js)
 * Converts the current post into a slide deck
 * Uses horizontal rules (---) as slide separators
 */

let presentationMode = false;
let originalContent = null;

async function startPresentation() {
    if (presentationMode) {
        exitPresentation();
        return;
    }

    const postContent = document.querySelector('.post-content');
    const postTitle = document.querySelector('.post-title')?.textContent || 'Presentation';

    if (!postContent) {
        console.error('No post content found');
        return;
    }

    // Load Reveal.js if not already loaded
    if (typeof Reveal === 'undefined') {
        await loadRevealJS();
    }

    // Store original content for restoration
    originalContent = postContent.innerHTML;

    // Parse content into slides
    const slides = parseSlides(postContent);

    // Create presentation container
    const presentationContainer = document.createElement('div');
    presentationContainer.id = 'presentation-overlay';
    presentationContainer.innerHTML = `
    <div class="reveal">
      <div class="slides">
        <section>
          <h1>${postTitle}</h1>
          <p style="opacity: 0.7; font-size: 0.5em;">Press ESC to exit • Arrow keys to navigate</p>
        </section>
        ${slides.map(slide => `<section>${slide}</section>`).join('\n')}
        <section>
          <h2>Thank You</h2>
          <p style="opacity: 0.7; font-size: 0.5em;">Press ESC to return to the article</p>
        </section>
      </div>
    </div>
    <button id="exit-presentation" aria-label="Exit presentation">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

    document.body.appendChild(presentationContainer);
    document.body.style.overflow = 'hidden';

    // Initialize Reveal.js
    Reveal.initialize({
        hash: false,
        controls: true,
        progress: true,
        center: true,
        transition: 'slide',
        width: 1280,
        height: 720,
        margin: 0.1,
        // Re-render KaTeX in slides
        plugins: []
    });

    // Re-render KaTeX math
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(presentationContainer, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
        });
    }

    // Highlight code in slides
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(presentationContainer);
    }

    presentationMode = true;

    // Exit handlers
    document.getElementById('exit-presentation').addEventListener('click', exitPresentation);
    document.addEventListener('keydown', handlePresentationKeydown);
}

function handlePresentationKeydown(e) {
    if (e.key === 'Escape' && presentationMode) {
        exitPresentation();
    }
}

function exitPresentation() {
    const overlay = document.getElementById('presentation-overlay');
    if (overlay) {
        overlay.remove();
    }

    document.body.style.overflow = '';
    document.removeEventListener('keydown', handlePresentationKeydown);

    // Destroy Reveal instance
    if (typeof Reveal !== 'undefined' && Reveal.isReady && Reveal.isReady()) {
        Reveal.destroy();
    }

    presentationMode = false;
}

/**
 * Parse post content into slides
 * Uses <hr> (---) as slide separators
 * Also creates new slides for each H2 heading
 */
function parseSlides(postContent) {
    const slides = [];
    let currentSlide = '';

    // Clone and process content
    const content = postContent.cloneNode(true);

    // Remove elements not suitable for slides
    content.querySelectorAll('.runnable-code, .hf-space, .video-embed, .citation-box').forEach(el => el.remove());

    // Get all child elements
    const children = Array.from(content.children);

    for (const child of children) {
        // HR creates a new slide
        if (child.tagName === 'HR') {
            if (currentSlide.trim()) {
                slides.push(currentSlide);
            }
            currentSlide = '';
            continue;
        }

        // H2 creates a new slide (section boundary)
        if (child.tagName === 'H2') {
            if (currentSlide.trim()) {
                slides.push(currentSlide);
            }
            currentSlide = child.outerHTML;
            continue;
        }

        // Add to current slide
        currentSlide += child.outerHTML;
    }

    // Don't forget the last slide
    if (currentSlide.trim()) {
        slides.push(currentSlide);
    }

    return slides;
}

/**
 * Dynamically load Reveal.js
 */
async function loadRevealJS() {
    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@4/dist/reveal.min.css';
    document.head.appendChild(cssLink);

    // Load theme
    const themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@4/dist/theme/black.min.css';
    document.head.appendChild(themeLink);

    // Load JS
    await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4/dist/reveal.min.js');

    // Add custom styles for presentation overlay
    const style = document.createElement('style');
    style.textContent = `
    #presentation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3000;
      background: #000;
    }
    #presentation-overlay .reveal {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    #presentation-overlay .reveal .slides section {
      text-align: left;
      padding: 40px;
    }
    #presentation-overlay .reveal h1,
    #presentation-overlay .reveal h2,
    #presentation-overlay .reveal h3 {
      text-transform: none;
      font-weight: 600;
    }
    #presentation-overlay .reveal h1 { font-size: 2.5em; }
    #presentation-overlay .reveal h2 { font-size: 1.8em; margin-bottom: 0.5em; }
    #presentation-overlay .reveal h3 { font-size: 1.3em; }
    #presentation-overlay .reveal p,
    #presentation-overlay .reveal li {
      font-size: 0.7em;
      line-height: 1.6;
    }
    #presentation-overlay .reveal pre {
      font-size: 0.5em;
      width: 100%;
    }
    #presentation-overlay .reveal code {
      font-size: 0.9em;
    }
    #presentation-overlay .reveal .katex {
      font-size: 0.9em;
    }
    #presentation-overlay .reveal img {
      max-height: 60vh;
    }
    #exit-presentation {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 3001;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.2s;
    }
    #exit-presentation:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  `;
    document.head.appendChild(style);
}

/**
 * Helper to load scripts dynamically
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
    window.startPresentation = startPresentation;
    window.exitPresentation = exitPresentation;
}
