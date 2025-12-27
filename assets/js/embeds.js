/**
 * Embeds Module
 * Handles HuggingFace spaces, video embeds, and other third-party content
 */

/**
 * HuggingFace space embed
 */
function initHuggingFaceEmbeds() {
    document.querySelectorAll('.hf-space[data-src]').forEach(container => {
        const spacePath = container.dataset.src;
        const height = container.dataset.height || '500';

        // Convert "owner/space-name" to "owner-space-name.hf.space" for embedding
        const embedDomain = spacePath.replace('/', '-') + '.hf.space';

        const wrapper = document.createElement('div');
        wrapper.className = 'embed-wrapper';
        wrapper.innerHTML = `
      <div class="embed-header">
        <span class="embed-title">Hugging Face Space</span>
      </div>
      <div class="embed-body" style="height: ${height}px">
        <iframe 
          src="https://${embedDomain}" 
          loading="lazy"
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; clipboard-write; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; legacy-image-formats; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; sync-xhr; usb; vr; wake-lock; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
        ></iframe>
      </div>
    `;

        container.replaceWith(wrapper);
    });
}

/**
 * Video Embed Support
 * Usage: <div class="video-embed" data-src="/path/to/video.mp4" data-caption="Demo"></div>
 * Supports: local videos, YouTube, Vimeo
 */
function initVideoEmbeds() {
    document.querySelectorAll('.video-embed[data-src]').forEach(container => {
        const src = container.dataset.src;
        const caption = container.dataset.caption || '';
        const height = container.dataset.height || 'auto';

        // Detect video type
        let videoContent = '';

        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            // YouTube embed
            const videoId = src.includes('youtu.be')
                ? src.split('/').pop()
                : new URL(src).searchParams.get('v');

            videoContent = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          style="width: 100%; height: ${height === 'auto' ? '400px' : height};"
        ></iframe>
      `;
        } else if (src.includes('vimeo.com')) {
            // Vimeo embed
            const videoId = src.split('/').pop();
            videoContent = `
        <iframe 
          src="https://player.vimeo.com/video/${videoId}" 
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen
          style="width: 100%; height: ${height === 'auto' ? '400px' : height};"
        ></iframe>
      `;
        } else {
            // Local video
            videoContent = `
        <video controls style="width: 100%; height: ${height};">
          <source src="${src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.innerHTML = `
      <div class="video-container">
        ${videoContent}
      </div>
      ${caption ? `<p class="video-caption">${caption}</p>` : ''}
    `;

        container.replaceWith(wrapper);
    });
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initHuggingFaceEmbeds = initHuggingFaceEmbeds;
    window.initVideoEmbeds = initVideoEmbeds;
}
