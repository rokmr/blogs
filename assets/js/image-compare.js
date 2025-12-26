/**
 * Image Comparison Slider Component
 * Interactive before/after image slider for CV results
 * 
 * Usage in posts:
 * <div class="image-compare" data-before="/path/to/before.jpg" data-after="/path/to/after.jpg">
 *   <span class="compare-label-before">Before</span>
 *   <span class="compare-label-after">After</span>
 * </div>
 */

function initImageCompare() {
    document.querySelectorAll('.image-compare[data-before][data-after]').forEach(container => {
        const beforeSrc = container.dataset.before;
        const afterSrc = container.dataset.after;
        const labelBefore = container.querySelector('.compare-label-before')?.textContent || 'Before';
        const labelAfter = container.querySelector('.compare-label-after')?.textContent || 'After';

        // Build the comparison structure
        container.innerHTML = `
      <div class="compare-wrapper">
        <div class="compare-after">
          <img src="${afterSrc}" alt="${labelAfter}" draggable="false">
          <span class="compare-label compare-label-right">${labelAfter}</span>
        </div>
        <div class="compare-before">
          <img src="${beforeSrc}" alt="${labelBefore}" draggable="false">
          <span class="compare-label compare-label-left">${labelBefore}</span>
        </div>
        <div class="compare-slider">
          <div class="compare-handle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    `;

        const wrapper = container.querySelector('.compare-wrapper');
        const beforeDiv = container.querySelector('.compare-before');
        const slider = container.querySelector('.compare-slider');
        let isDragging = false;

        // Set initial position to 50%
        const setPosition = (percent) => {
            const clampedPercent = Math.max(0, Math.min(100, percent));
            beforeDiv.style.clipPath = `inset(0 ${100 - clampedPercent}% 0 0)`;
            slider.style.left = `${clampedPercent}%`;
        };

        setPosition(50);

        // Calculate position from mouse/touch event
        const getPositionFromEvent = (e) => {
            const rect = wrapper.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const x = clientX - rect.left;
            return (x / rect.width) * 100;
        };

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            setPosition(getPositionFromEvent(e));
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            setPosition(getPositionFromEvent(e));
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Click anywhere on the image to move slider
        wrapper.addEventListener('click', (e) => {
            if (e.target === slider || slider.contains(e.target)) return;
            setPosition(getPositionFromEvent(e));
        });
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initImageCompare = initImageCompare;
}
