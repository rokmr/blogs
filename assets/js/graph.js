/**
 * Knowledge Graph — hub-spoke topology with gentle interactions
 *
 * Topology:
 *   - Virtual hub node per sub-subject (e.g. "Object Detection")
 *   - Each note connects to its sub-subject hub     → star clusters
 *   - Shared tags (≥2) bridge notes across clusters  → cross-links
 *   - Explicit href links                            → strongest
 *
 * Hover:
 *   - Gentle opacity fade (no color changes on non-hovered nodes)
 *   - Hovered node gets a subtle ring, neighbors stay at full opacity
 *   - Tooltip shows title
 */

// ── Palette ──────────────────────────────────────────────────
const SUBJECT_COLOR = {
    'cv':             '#60a5fa',
    'ml':             '#4ade80',
    'deep-learning':  '#f472b6',
    'maths':          '#fb923c',
    'nlp-llms':       '#a78bfa',
    'mlops':          '#38bdf8',
    'setup':          '#94a3b8',
    'rl':             '#fbbf24',
};
const colorOf = s => SUBJECT_COLOR[s] || '#555';

// ── Build graph data ─────────────────────────────────────────
function buildGraphData(posts) {
    const nodes = [];
    const links = [];
    const linkSet = new Set();
    const urlToId = new Map();
    const nodeMap = new Map();           // id → node ref (fast lookup)

    function addLink(src, tgt, type) {
        if (src === tgt) return;
        const key = src < tgt ? `${src}|${tgt}` : `${tgt}|${src}`;
        if (linkSet.has(key)) return;
        linkSet.add(key);
        links.push({ source: src, target: tgt, type });
        nodeMap.get(src).linkCount++;
        nodeMap.get(tgt).linkCount++;
    }

    // 1 ── Content nodes
    posts.forEach((p, i) => {
        const id = `n-${i}`;
        urlToId.set(normalizeUrl(p.url), id);
        const n = {
            id, title: p.title, url: p.url,
            tags: p.tags || [], subject: p.subject || null,
            subSubject: p.sub_subject || null,
            kind: 'note', linkCount: 0,
        };
        nodes.push(n);
        nodeMap.set(id, n);
    });

    // 2 ── Hub nodes (one per sub-subject that has ≥2 notes)
    const buckets = new Map();           // "cv/object-detection" → [id…]
    nodes.forEach(n => {
        if (!n.subject || !n.subSubject) return;
        const key = `${n.subject}/${n.subSubject}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(n.id);
    });

    const hubIds = new Map();            // bucketKey → hubId
    for (const [key, ids] of buckets) {
        if (ids.length < 2) continue;    // no hub for singletons
        const hubId = `hub-${key}`;
        const subject = key.split('/')[0];
        const label = key.split('/')[1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
        const hub = {
            id: hubId, title: label, url: null,
            tags: [], subject,
            subSubject: key.split('/')[1],
            kind: 'hub', linkCount: 0,
        };
        nodes.push(hub);
        nodeMap.set(hubId, hub);
        hubIds.set(key, hubId);
        // spoke links: note → hub
        ids.forEach(nid => addLink(nid, hubId, 'spoke'));
    }

    // 3 ── Explicit href links
    posts.forEach((p, i) => {
        if (!p.links) return;
        p.links.forEach(href => {
            const tid = urlToId.get(normalizeUrl(href));
            if (tid) addLink(`n-${i}`, tid, 'explicit');
        });
    });

    // 4 ── Tag bridges (≥2 shared, cross-cluster only, cap 4/node)
    const TAG_MIN = 2, TAG_CAP = 4;
    const tagCount = new Map();
    for (let i = 0; i < posts.length; i++) {
        const a = nodes[i], aT = new Set(a.tags);
        if (aT.size === 0) continue;
        for (let j = i + 1; j < posts.length; j++) {
            const b = nodes[j], bT = b.tags;
            if (bT.length === 0) continue;
            // skip same sub-subject (already spoke-linked through hub)
            if (a.subject && a.subject === b.subject &&
                a.subSubject && a.subSubject === b.subSubject) continue;
            const shared = bT.filter(t => aT.has(t)).length;
            if (shared < TAG_MIN) continue;
            const ac = tagCount.get(a.id) || 0;
            const bc = tagCount.get(b.id) || 0;
            if (ac >= TAG_CAP || bc >= TAG_CAP) continue;
            addLink(a.id, b.id, 'tag');
            tagCount.set(a.id, ac + 1);
            tagCount.set(b.id, bc + 1);
        }
    }

    // 5 ── Hub-to-hub within same subject (keeps subject cluster together)
    const subjectHubs = new Map();       // subject → [hubId…]
    for (const [key, hubId] of hubIds) {
        const subj = key.split('/')[0];
        if (!subjectHubs.has(subj)) subjectHubs.set(subj, []);
        subjectHubs.get(subj).push(hubId);
    }
    for (const [, hubs] of subjectHubs) {
        for (let i = 0; i < hubs.length; i++) {
            for (let j = i + 1; j < hubs.length; j++) {
                addLink(hubs[i], hubs[j], 'spine');
            }
        }
    }

    // Orphan notes without a hub: connect directly to another same-subject note
    // so they don't float away
    nodes.forEach(n => {
        if (n.kind !== 'note' || n.linkCount > 0) return;
        // find any hub for the same subject
        if (n.subject && subjectHubs.has(n.subject)) {
            const hubs = subjectHubs.get(n.subject);
            addLink(n.id, hubs[0], 'spoke');
        }
    });

    return { nodes, links };
}

// ── Render ───────────────────────────────────────────────────
async function initGraph() {
    const container = document.getElementById('graph-container');
    if (!container) return;
    const W = container.clientWidth;
    const H = container.clientHeight;

    try {
        const baseElement = document.querySelector('meta[name="baseurl"]');
        const baseUrl = baseElement ? (baseElement.content || '') : '';
        const fetchUrl = baseUrl ? `${baseUrl}/posts.json` : '/posts.json';
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error('Failed to load graph data');
        const posts = await res.json();
        const { nodes, links } = buildGraphData(posts);

        container.innerHTML = '';

        // ── SVG + zoom ──────────────────────────────────────
        const svg = d3.select(container)
            .append('svg').attr('width', W).attr('height', H);
        const g = svg.append('g');
        const zoom = d3.zoom().scaleExtent([0.15, 5])
            .on('zoom', e => g.attr('transform', e.transform));
        svg.call(zoom);

        // ── Tooltip ─────────────────────────────────────────
        const tip = d3.select(container).append('div')
            .attr('class', 'graph-tooltip')
            .style('position', 'absolute').style('pointer-events', 'none')
            .style('opacity', 0);

        // ── Forces ──────────────────────────────────────────
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id)
                .distance(d => {
                    if (d.type === 'spoke')    return 40;
                    if (d.type === 'spine')    return 80;
                    if (d.type === 'explicit') return 60;
                    return 120;  // tag
                })
                .strength(d => {
                    if (d.type === 'spoke')    return 1.0;
                    if (d.type === 'spine')    return 0.6;
                    if (d.type === 'explicit') return 0.8;
                    return 0.15; // tag — gentle pull
                }))
            .force('charge', d3.forceManyBody()
                .strength(d => d.kind === 'hub' ? -250 : -80))
            .force('center', d3.forceCenter(W / 2, H / 2))
            .force('x', d3.forceX(W / 2).strength(0.03))
            .force('y', d3.forceY(H / 2).strength(0.03))
            .force('collision', d3.forceCollide()
                .radius(d => d.kind === 'hub' ? 30 : 14));

        // ── Draw links ──────────────────────────────────────
        const linkG = g.append('g');
        const link = linkG.selectAll('line').data(links).join('line')
            .attr('stroke', d => {
                if (d.type === 'explicit') return '#4ade80';
                if (d.type === 'tag')      return '#555';
                return '#333';  // spoke, spine
            })
            .attr('stroke-opacity', d => {
                if (d.type === 'explicit') return 0.5;
                if (d.type === 'tag')      return 0.18;
                if (d.type === 'spine')    return 0.25;
                return 0.15;   // spoke — very subtle
            })
            .attr('stroke-width', d => d.type === 'explicit' ? 1.5 : 0.75)
            .attr('stroke-dasharray', d => d.type === 'tag' ? '2,3' : null);

        // ── Draw nodes ──────────────────────────────────────
        const nodeG = g.append('g');
        const node = nodeG.selectAll('g').data(nodes).join('g')
            .attr('class', d => `node node--${d.kind}`)
            .attr('cursor', d => d.url ? 'pointer' : 'default')
            .call(d3.drag()
                .on('start', (e) => { if (!e.active) simulation.alphaTarget(0.3).restart(); e.subject.fx = e.subject.x; e.subject.fy = e.subject.y; })
                .on('drag',  (e) => { e.subject.fx = e.x; e.subject.fy = e.y; })
                .on('end',   (e) => { if (!e.active) simulation.alphaTarget(0); e.subject.fx = null; e.subject.fy = null; }));

        // circles
        node.append('circle')
            .attr('r', d => d.kind === 'hub' ? 10 : Math.min(4 + d.linkCount * 0.8, 9))
            .attr('fill', d => d.kind === 'hub'
                ? colorOf(d.subject)
                : colorOf(d.subject))
            .attr('fill-opacity', d => d.kind === 'hub' ? 0.9 : 0.7)
            .attr('stroke', d => colorOf(d.subject))
            .attr('stroke-width', d => d.kind === 'hub' ? 2 : 0)
            .attr('stroke-opacity', 0.4);

        // labels
        node.append('text')
            .attr('class', 'node-label')
            .attr('dy', d => d.kind === 'hub' ? -14 : -10)
            .attr('text-anchor', 'middle')
            .attr('fill', d => d.kind === 'hub' ? '#aaa' : '#555')
            .attr('font-size', d => d.kind === 'hub' ? '11px' : '9px')
            .attr('font-weight', d => d.kind === 'hub' ? 600 : 400)
            .text(d => truncateText(d.title, d.kind === 'hub' ? 30 : 22));

        // ── Hover — gentle opacity, no color thrashing ──────
        node.on('mouseover', function (event, d) {
            // Build neighbor set
            const neighbors = new Set([d.id]);
            const activeLinks = new Set();
            links.forEach((l, i) => {
                const sid = typeof l.source === 'object' ? l.source.id : l.source;
                const tid = typeof l.target === 'object' ? l.target.id : l.target;
                if (sid === d.id) { neighbors.add(tid); activeLinks.add(i); }
                if (tid === d.id) { neighbors.add(sid); activeLinks.add(i); }
            });

            // Dim non-neighbors (only opacity, never change color)
            node.select('circle')
                .transition().duration(150)
                .attr('fill-opacity', n => neighbors.has(n.id)
                    ? (n.kind === 'hub' ? 0.95 : 0.9) : 0.12);
            node.select('text')
                .transition().duration(150)
                .attr('fill-opacity', n => neighbors.has(n.id) ? 1 : 0.15);
            link.transition().duration(150)
                .attr('stroke-opacity', (l, i) => activeLinks.has(i) ? 0.5 : 0.03);

            // Hovered node: subtle ring (add a second circle via class)
            d3.select(this).select('circle')
                .attr('stroke', '#e8e8e8')
                .attr('stroke-width', 2)
                .attr('stroke-opacity', 0.8);

            // Tooltip
            tip.html(`<span style="color:${colorOf(d.subject)}">${d.subject || 'post'}</span> › ${d.title}`)
                .style('opacity', 1)
                .style('left', (event.offsetX + 14) + 'px')
                .style('top',  (event.offsetY - 8)  + 'px');
        })
        .on('mousemove', function (event) {
            tip.style('left', (event.offsetX + 14) + 'px')
               .style('top',  (event.offsetY - 8)  + 'px');
        })
        .on('mouseout', function (event, d) {
            // Restore everything
            node.select('circle')
                .transition().duration(300)
                .attr('fill-opacity', n => n.kind === 'hub' ? 0.9 : 0.7)
                .attr('stroke', n => colorOf(n.subject))
                .attr('stroke-width', n => n.kind === 'hub' ? 2 : 0)
                .attr('stroke-opacity', 0.4);
            node.select('text')
                .transition().duration(300)
                .attr('fill-opacity', 1);
            link.transition().duration(300)
                .attr('stroke-opacity', l => {
                    if (l.type === 'explicit') return 0.5;
                    if (l.type === 'tag')      return 0.18;
                    if (l.type === 'spine')    return 0.25;
                    return 0.15;
                });
            tip.style('opacity', 0);
        })
        .on('click', function (event, d) {
            if (d.url) window.location.href = d.url;
        });

        // ── Tick ─────────────────────────────────────────────
        simulation.on('tick', () => {
            link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // ── Search ───────────────────────────────────────────
        const searchInput = document.getElementById('graph-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                if (!q) {
                    // restore
                    node.select('circle').transition().duration(200)
                        .attr('fill-opacity', d => d.kind === 'hub' ? 0.9 : 0.7);
                    node.select('text').transition().duration(200)
                        .attr('fill-opacity', 1);
                    return;
                }
                node.select('circle').transition().duration(200)
                    .attr('fill-opacity', d =>
                        d.title.toLowerCase().includes(q) ? 1 : 0.08);
                node.select('text').transition().duration(200)
                    .attr('fill-opacity', d =>
                        d.title.toLowerCase().includes(q) ? 1 : 0.08);
            });
        }

        // ── Reset ────────────────────────────────────────────
        const resetBtn = document.getElementById('graph-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
                if (searchInput) searchInput.value = '';
                node.select('circle').transition().duration(300)
                    .attr('fill-opacity', d => d.kind === 'hub' ? 0.9 : 0.7);
                node.select('text').transition().duration(300)
                    .attr('fill-opacity', 1);
                link.transition().duration(300)
                    .attr('stroke-opacity', l => {
                        if (l.type === 'explicit') return 0.5;
                        if (l.type === 'tag')      return 0.18;
                        if (l.type === 'spine')    return 0.25;
                        return 0.15;
                    });
            });
        }

    } catch (err) {
        console.error('Graph init failed:', err);
        container.innerHTML = `
      <div style="text-align:center;padding:3rem;color:var(--dim)">
        <p>Failed to load graph data.</p>
        <p style="font-size:0.8rem">Ensure posts.json is generated.</p>
      </div>`;
    }
}

function normalizeUrl(url) {
    return url.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '')
              .replace(/\/index\.html$/, '').toLowerCase();
}
function truncateText(t, max) {
    return t.length <= max ? t : t.substring(0, max - 1) + '\u2026';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGraph);
} else { initGraph(); }
