/**
 * Semantic Search Module
 * Uses Transformers.js for client-side embedding generation
 * Falls back to keyword search if model fails to load
 */

let pipeline = null;
let postsData = null;
let embeddings = null;
let isModelLoading = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSemanticSearch);

async function initSemanticSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchStatus = document.getElementById('search-status');

    if (!searchInput || !searchResults) return;

    // Load posts data first
    try {
        // Try to find posts.json at the site root or with base path
        const basePath = document.querySelector('base')?.href || '';
        let response = await fetch('/posts.json');
        if (!response.ok) {
            // Fallback: try with /blogs/ prefix (production path)
            response = await fetch('/blogs/posts.json');
        }
        if (!response.ok) throw new Error('Failed to load posts');
        postsData = await response.json();
    } catch (error) {
        console.error('Failed to load posts:', error);
        updateStatus('error', 'Failed to load posts');
        return;
    }

    // Try to load the embedding model
    loadEmbeddingModel();

    // Set up search input handler with debounce
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performSearch(e.target.value), 300);
    });
}

/**
 * Load the embedding model using Transformers.js
 */
async function loadEmbeddingModel() {
    if (isModelLoading) return;
    isModelLoading = true;

    updateStatus('loading', 'Loading AI model...');

    try {
        // Dynamically import Transformers.js
        const { pipeline: createPipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');

        // Load the embedding model (this downloads ~30MB on first use)
        pipeline = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            progress_callback: (progress) => {
                if (progress.status === 'downloading') {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    updateStatus('loading', `Downloading model: ${percent}%`);
                }
            }
        });

        updateStatus('ready', 'AI search ready');

        // Pre-compute embeddings for all posts
        await precomputeEmbeddings();

    } catch (error) {
        console.error('Failed to load embedding model:', error);
        updateStatus('fallback', 'Using keyword search');
        pipeline = null;
    }

    isModelLoading = false;
}

/**
 * Pre-compute embeddings for all posts
 */
async function precomputeEmbeddings() {
    if (!pipeline || !postsData) return;

    updateStatus('loading', 'Indexing posts...');

    embeddings = [];

    for (let i = 0; i < postsData.length; i++) {
        const post = postsData[i];
        const text = `${post.title} ${post.excerpt || ''} ${(post.tags || []).join(' ')}`;

        try {
            const output = await pipeline(text, { pooling: 'mean', normalize: true });
            embeddings.push({
                postIndex: i,
                embedding: Array.from(output.data)
            });
        } catch (error) {
            console.error(`Failed to embed post ${i}:`, error);
        }

        // Update progress
        updateStatus('loading', `Indexing: ${i + 1}/${postsData.length}`);
    }

    updateStatus('ready', 'AI search ready');

    // Cache embeddings in IndexedDB for faster future loads
    cacheEmbeddings();
}

/**
 * Perform search (semantic or keyword fallback)
 */
async function performSearch(query) {
    const searchResults = document.getElementById('search-results');

    if (!query.trim()) {
        searchResults.innerHTML = `
      <div class="search-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>Start typing to search your notes</p>
        <p class="search-hint">Semantic search finds related concepts even without exact keyword matches</p>
      </div>
    `;
        return;
    }

    searchResults.innerHTML = '<div class="search-loading"><span class="spinner"></span>Searching...</div>';

    let results;

    if (pipeline && embeddings) {
        // Semantic search
        results = await semanticSearch(query);
    } else {
        // Fallback to keyword search
        results = keywordSearch(query);
        searchResults.innerHTML = `
      <div class="search-fallback-notice">
        Using keyword search. Enable AI model for semantic search.
      </div>
    ` + searchResults.innerHTML;
    }

    renderResults(results /* , query */);
}

/**
 * Semantic search using embeddings
 */
async function semanticSearch(query) {
    try {
        // Get query embedding
        const queryOutput = await pipeline(query, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(queryOutput.data);

        // Calculate cosine similarity with all posts
        const scores = embeddings.map(({ postIndex, embedding }) => {
            const similarity = cosineSimilarity(queryEmbedding, embedding);
            return { postIndex, similarity };
        });

        // Sort by similarity and return top results
        scores.sort((a, b) => b.similarity - a.similarity);

        return scores
            .filter(s => s.similarity > 0.3) // Threshold
            .slice(0, 10)
            .map(({ postIndex, similarity }) => ({
                ...postsData[postIndex],
                score: similarity
            }));

    } catch (error) {
        console.error('Semantic search failed:', error);
        return keywordSearch(query);
    }
}

/**
 * Fallback keyword search
 */
function keywordSearch(query) {
    const queryWords = query.toLowerCase().split(/\s+/);

    const results = postsData.map(post => {
        const searchText = `${post.title} ${post.excerpt || ''} ${post.content_snippet || ''} ${(post.tags || []).join(' ')}`.toLowerCase();

        let score = 0;
        queryWords.forEach(word => {
            if (searchText.includes(word)) {
                score += 1;
                // Boost for title matches
                if (post.title.toLowerCase().includes(word)) {
                    score += 2;
                }
            }
        });

        return { ...post, score: score / queryWords.length };
    });

    return results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

/**
 * Render search results
 */
function renderResults(results) {
    const searchResults = document.getElementById('search-results');

    if (results.length === 0) {
        searchResults.innerHTML = `
      <div class="search-no-results">
        <p>No matching posts found.</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Try different keywords or a broader search term.</p>
      </div>
    `;
        return;
    }

    searchResults.innerHTML = results.map(post => `
    <a href="${post.url}" class="search-result">
      <div class="search-result-title">${post.title}</div>
      <div class="search-result-excerpt">${post.excerpt || ''}</div>
      <div class="search-result-meta">
        <span class="search-result-score">${Math.round(post.score * 100)}% match</span>
        <span>${post.date}</span>
        ${post.tags && post.tags.length > 0 ? `
          <div class="search-result-tags">
            ${post.tags.slice(0, 3).map(tag => `<span class="search-result-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </a>
  `).join('');
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Update status indicator
 */
function updateStatus(state, message) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    if (!statusDot || !statusText) return;

    statusDot.className = 'status-dot';

    switch (state) {
        case 'ready':
            statusDot.classList.add('ready');
            break;
        case 'error':
        case 'fallback':
            statusDot.classList.add('error');
            break;
        // loading state uses default (pulsing)
    }

    statusText.textContent = message;
}

/**
 * Cache embeddings to IndexedDB for faster future loads
 */
async function cacheEmbeddings() {
    if (!embeddings || !('indexedDB' in window)) return;

    try {
        const request = indexedDB.open('SemanticSearchCache', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('embeddings')) {
                db.createObjectStore('embeddings');
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction('embeddings', 'readwrite');
            const store = tx.objectStore('embeddings');

            store.put({
                embeddings,
                timestamp: Date.now()
            }, 'cached');
        };
    } catch (error) {
        console.error('Failed to cache embeddings:', error);
    }
}
