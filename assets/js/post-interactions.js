/**
 * Post Interactions Module
 * All reactions & comments go through Giscus (GitHub Discussions)
 * Single source of truth — shared counts visible to everyone
 */

/**
 * Initialize post action buttons
 */
function initPostActions() {
    const actionsBar = document.querySelector('.post-actions');
    if (!actionsBar) return;

    // Like button — scrolls to Giscus reactions
    const likeBtn = actionsBar.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => scrollToGiscus());
    }

    // Comments button — scrolls to Giscus comments
    const commentsBtn = actionsBar.querySelector('.comments-btn');
    if (commentsBtn) {
        commentsBtn.addEventListener('click', () => scrollToGiscus());
    }

    // Share button
    const shareBtn = actionsBar.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const title = document.querySelector('.post-title')?.textContent || document.title;
            const url = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({ title, url });
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        showShareFallback(shareBtn, title, url);
                    }
                }
            } else {
                showShareFallback(shareBtn, title, url);
            }
        });
    }

    // Fetch shared counts from GitHub Discussions
    fetchDiscussionCounts();
}

/**
 * Show fallback share menu with Twitter/LinkedIn options
 */
function showShareFallback(btn, title, url) {
    // Remove existing dropdown if any
    const existing = document.querySelector('.share-dropdown');
    if (existing) {
        existing.remove();
        return;
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const dropdown = document.createElement('div');
    dropdown.className = 'share-dropdown';
    dropdown.innerHTML = `
    <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      Twitter / X
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
      LinkedIn
    </a>
    <button class="copy-link-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      Copy Link
    </button>
  `;

    btn.parentElement.style.position = 'relative';
    btn.parentElement.appendChild(dropdown);

    // Copy link button
    dropdown.querySelector('.copy-link-btn').addEventListener('click', async () => {
        await navigator.clipboard.writeText(url);
        dropdown.querySelector('.copy-link-btn').innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
        setTimeout(() => dropdown.remove(), 1000);
    });

    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== btn) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
}

/**
 * Fetch shared reaction & comment counts from GitHub Discussions via Giscus API
 * No login needed to VIEW counts — visible to all visitors
 */
async function fetchDiscussionCounts() {
    const likeCountEl = document.querySelector('.like-count');
    const commentCountEl = document.querySelector('.comment-count');
    if (!likeCountEl && !commentCountEl) return;

    try {
        const params = new URLSearchParams({
            repo: 'rokmr/blogs',
            term: window.location.pathname,
            category: 'DIC_kwDOQqldOM4C6qXj',
            strict: 'false',
            first: '0',
        });

        const res = await fetch('https://giscus.app/api/discussions?' + params, {
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) return;
        const data = await res.json();
        const discussion = data?.discussion;
        if (!discussion) return;

        updateCountBadge(likeCountEl, 
            discussion.reactionCount ?? discussion.reactions?.totalCount ?? 0);
        updateCountBadge(commentCountEl, 
            discussion.totalCommentCount ?? discussion.comments?.totalCount ?? 0);
    } catch (e) {
        // Silently fail — counts just won't show
    }
}

/**
 * Listen for Giscus metadata events (fires when iframe loads)
 * Keeps counts in sync when user reacts/comments in Giscus
 */
function listenForGiscusMetadata() {
    window.addEventListener('message', (event) => {
        if (event.origin !== 'https://giscus.app') return;

        const meta = event.data?.giscus?.discussion;
        if (!meta) return;

        updateCountBadge(document.querySelector('.like-count'),
            meta.reactionCount ?? meta.totalReactionCount ?? 0);
        updateCountBadge(document.querySelector('.comment-count'),
            meta.totalCommentCount ?? 0);
    });
}

/**
 * Update a count badge element — show if > 0, hide if 0
 */
function updateCountBadge(el, count) {
    if (!el) return;
    if (count > 0) {
        el.textContent = count;
        el.style.display = 'inline';
    } else {
        el.style.display = 'none';
    }
}

/**
 * Scroll to the Giscus comments section and highlight it
 */
function scrollToGiscus() {
    const target = document.querySelector('#comments-section') 
        || document.querySelector('.comments') 
        || document.querySelector('.giscus');

    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    target.classList.add('giscus-highlight');
    setTimeout(() => target.classList.remove('giscus-highlight'), 2000);
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initPostActions = initPostActions;
    window.listenForGiscusMetadata = listenForGiscusMetadata;
    window.showShareFallback = showShareFallback;
    window.scrollToGiscus = scrollToGiscus;
}
