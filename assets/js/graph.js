/**
 * Knowledge Graph Visualization
 * D3.js force-directed graph showing connections between posts
 */

async function initGraph() {
    const container = document.getElementById('graph-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    try {
        // Get baseurl from meta tag or detect from current path
        const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
        const postsUrl = baseUrl ? `${baseUrl}/posts.json` : '/posts.json';
        
        const response = await fetch(postsUrl);
        if (!response.ok) throw new Error('Failed to load graph data');
        const posts = await response.json();

        // Build nodes and links
        const { nodes, links } = buildGraphData(posts);

        // Remove loading state
        container.innerHTML = '';

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // Add zoom behavior
        const g = svg.append('g');

        const zoom = d3.zoom()
            .scaleExtent([0.2, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(40));

        // Draw links
        const link = g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#666')
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', 1);

        // Draw nodes
        const node = g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Node circles
        node.append('circle')
            .attr('r', d => 8 + (d.linkCount || 0) * 2)
            .attr('fill', '#555')
            .attr('stroke', '#333')
            .attr('stroke-width', 1.5)
            .attr('cursor', 'pointer');

        // Node labels
        node.append('text')
            .attr('class', 'node-label')
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#666')
            .text(d => truncateText(d.title, 25));

        // Hover effects
        node.on('mouseover', function (event, d) {
            d3.select(this).select('circle')
                .attr('fill', '#4ade80')
                .attr('r', d => 10 + (d.linkCount || 0) * 2);

            d3.select(this).select('text')
                .classed('highlighted', true);

            // Highlight connected nodes
            const connectedIds = new Set();
            links.forEach(l => {
                if (l.source.id === d.id) connectedIds.add(l.target.id);
                if (l.target.id === d.id) connectedIds.add(l.source.id);
            });

            node.select('circle')
                .attr('fill', n => {
                    if (n.id === d.id) return '#4ade80';
                    if (connectedIds.has(n.id)) return '#60a5fa';
                    return '#444';
                });

            link.attr('stroke', l => {
                if (l.source.id === d.id || l.target.id === d.id) return '#4ade80';
                return '#666';
            }).attr('stroke-opacity', l => {
                if (l.source.id === d.id || l.target.id === d.id) return 1;
                return 0.3;
            }).attr('stroke-width', l => {
                if (l.source.id === d.id || l.target.id === d.id) return 3;
                return 1;
            });
        })
            .on('mouseout', function () {
                node.select('circle')
                    .attr('fill', '#555')
                    .attr('r', d => 8 + (d.linkCount || 0) * 2);

                node.select('text')
                    .classed('highlighted', false)
                    .attr('fill', '#666');

                link.attr('stroke', '#666').attr('stroke-opacity', 0.3).attr('stroke-width', 1);
            })
            .on('click', function (event, d) {
                window.location.href = d.url;
            });

        // Update positions on tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Search functionality
        const searchInput = document.getElementById('graph-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();

                node.select('circle').attr('fill', d => {
                    if (!query) return '#555';
                    return d.title.toLowerCase().includes(query) ? '#4ade80' : '#333';
                });
                
                node.select('text').attr('fill', d => {
                    if (!query) return '#666';
                    return d.title.toLowerCase().includes(query) ? '#fff' : '#444';
                });

                node.select('text').classed('highlighted', d => {
                    return query && d.title.toLowerCase().includes(query);
                });
            });
        }

        // Reset button
        const resetBtn = document.getElementById('graph-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
                if (searchInput) searchInput.value = '';
                node.select('circle').attr('fill', '#555');
                node.select('text').classed('highlighted', false).attr('fill', '#666');
                link.attr('stroke', '#666').attr('stroke-opacity', 0.3).attr('stroke-width', 1);
            });
        }

    } catch (error) {
        console.error('Graph initialization failed:', error);
        container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--dim);">
        <p>Failed to load graph data.</p>
        <p style="font-size: 0.8rem;">Make sure posts.json is generated.</p>
      </div>
    `;
    }
}

/**
 * Build graph data structure from posts
 */
function buildGraphData(posts) {
    const nodes = [];
    const links = [];
    const urlToId = new Map();

    // Create nodes
    posts.forEach((post, index) => {
        const id = `post-${index}`;
        urlToId.set(normalizeUrl(post.url), id);

        nodes.push({
            id,
            title: post.title,
            url: post.url,
            tags: post.tags || [],
            subject: post.subject || null,
            linkCount: 0
        });
    });

    // Create links from explicit links in content
    posts.forEach((post, sourceIndex) => {
        const sourceId = `post-${sourceIndex}`;

        if (post.links) {
            post.links.forEach(link => {
                const targetId = urlToId.get(normalizeUrl(link));
                if (targetId && targetId !== sourceId) {
                    // Check if link already exists
                    const linkExists = links.some(l => 
                        (l.source === sourceId && l.target === targetId) ||
                        (l.source === targetId && l.target === sourceId)
                    );
                    
                    if (!linkExists) {
                        links.push({
                            source: sourceId,
                            target: targetId,
                            type: 'explicit'
                        });

                        // Update link counts
                        const sourceNode = nodes.find(n => n.id === sourceId);
                        const targetNode = nodes.find(n => n.id === targetId);
                        if (sourceNode) sourceNode.linkCount++;
                        if (targetNode) targetNode.linkCount++;
                    }
                }
            });
        }
    });

    // Special handling: Connect "short notes" / hub notes to all notes in same subject
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        
        // Check if this is a hub note (contains "short" or "notes" in URL path)
        const isHubNote = post.url.toLowerCase().includes('short-notes') || 
                          post.url.toLowerCase().includes('quick-reference');
        
        if (isHubNote && post.subject) {
            // Connect this hub note to ALL notes with same subject
            for (let j = 0; j < posts.length; j++) {
                if (i === j) continue;
                const otherPost = posts[j];
                
                if (otherPost.subject === post.subject) {
                    const sourceId = `post-${i}`;
                    const targetId = `post-${j}`;
                    
                    const linkExists = links.some(l => 
                        (l.source === sourceId && l.target === targetId) ||
                        (l.source === targetId && l.target === sourceId)
                    );
                    
                    if (!linkExists) {
                        links.push({
                            source: sourceId,
                            target: targetId,
                            type: 'hub',
                            subject: post.subject
                        });

                        const sourceNode = nodes.find(n => n.id === sourceId);
                        const targetNode = nodes.find(n => n.id === targetId);
                        if (sourceNode) sourceNode.linkCount++;
                        if (targetNode) targetNode.linkCount++;
                    }
                }
            }
        }
    }

    return { nodes, links };
}

/**
 * Normalize URL for comparison
 */
function normalizeUrl(url) {
    return url
        .replace(/^https?:\/\/[^/]+/, '')
        .replace(/\/$/, '')
        .replace(/\/index\.html$/, '')
        .toLowerCase();
}

/**
 * Truncate text for display
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGraph);
} else {
    initGraph();
}
