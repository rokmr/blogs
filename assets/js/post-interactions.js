/**
 * Post Interactions Module
 * Handles share buttons, like buttons, and comments navigation
 */

/**
 * Initialize post action buttons (share, scroll to comments)
 */
function initPostActions() {
    const actionsBar = document.querySelector('.post-actions');
    if (!actionsBar) return;

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

    // Scroll to comments
    const commentsBtn = actionsBar.querySelector('.comments-btn');
    if (commentsBtn) {
        commentsBtn.addEventListener('click', () => {
            const comments = document.querySelector('.comments') || document.querySelector('.giscus');
            if (comments) {
                comments.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
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
 * Initialize like buttons with localStorage persistence
 */
function initLikeButtons() {
    const likeBtn = document.querySelector('.like-btn');
    if (!likeBtn) return;

    const postId = likeBtn.dataset.postId;
    const likesKey = 'blog_likes';
    const likedKey = 'blog_liked_posts';

    // Get current likes data from localStorage
    function getLikesData() {
        try {
            return JSON.parse(localStorage.getItem(likesKey) || '{}');
        } catch {
            return {};
        }
    }

    // Get liked posts set
    function getLikedPosts() {
        try {
            return new Set(JSON.parse(localStorage.getItem(likedKey) || '[]'));
        } catch {
            return new Set();
        }
    }

    // Save likes data
    function saveLikesData(data) {
        localStorage.setItem(likesKey, JSON.stringify(data));
    }

    // Save liked posts
    function saveLikedPosts(posts) {
        localStorage.setItem(likedKey, JSON.stringify([...posts]));
    }

    // Update UI
    function updateUI() {
        const likesData = getLikesData();
        const likedPosts = getLikedPosts();
        const count = likesData[postId] || 0;
        const isLiked = likedPosts.has(postId);

        const countEl = likeBtn.querySelector('.like-count');
        const textEl = likeBtn.querySelector('.like-text');

        if (count > 0) {
            countEl.textContent = count;
            countEl.style.display = 'inline';
        } else {
            countEl.style.display = 'none';
        }

        if (isLiked) {
            likeBtn.classList.add('liked');
            textEl.textContent = 'Liked';
        } else {
            likeBtn.classList.remove('liked');
            textEl.textContent = 'Like';
        }
    }

    // Toggle like
    likeBtn.addEventListener('click', () => {
        const likesData = getLikesData();
        const likedPosts = getLikedPosts();

        if (likedPosts.has(postId)) {
            // Unlike
            likedPosts.delete(postId);
            likesData[postId] = Math.max(0, (likesData[postId] || 1) - 1);
        } else {
            // Like
            likedPosts.add(postId);
            likesData[postId] = (likesData[postId] || 0) + 1;
        }

        saveLikesData(likesData);
        saveLikedPosts(likedPosts);
        updateUI();

        // Add animation
        likeBtn.classList.add('like-animate');
        setTimeout(() => likeBtn.classList.remove('like-animate'), 300);
    });

    // Initial UI update
    updateUI();
}

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.initPostActions = initPostActions;
    window.showShareFallback = showShareFallback;
    window.initLikeButtons = initLikeButtons;
}
