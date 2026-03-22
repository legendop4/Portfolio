export class SkillsNetworkApp {
    constructor(osData) {
        this.osData = osData;
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.links = [];
        this.transform = { x: 0, y: 0, scale: 1 };
        this.targetTransform = { x: 0, y: 0, scale: 1 };
        
        // Interaction state
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragTransformStart = { x: 0, y: 0 };
        this.hoveredNode = null;
        this.selectedNode = null;
        this.tooltipEl = null;
        this.searchInput = null;
        this.searchQuery = '';
        
        this.animationId = null;
    }

    init(containerEl) {
        this.container = containerEl;
        this.container.innerHTML = `
            <div class="skills-app" style="display: flex; height: 100%; position: relative; background: #0a0e14;">
                <div style="position: absolute; top: 12px; left: 12px; z-index: 10; display: flex; gap: 8px; align-items: center;">
                    <input id="skills-search" type="text" placeholder="🔍 Search skills or tools..." 
                        style="background: rgba(20,25,35,0.9); border: 1px solid #2a3040; border-radius: 6px; padding: 8px 14px; color: #ccc; font-size: 13px; font-family: var(--font-sans); width: 220px; outline: none; backdrop-filter: blur(8px);"
                    />
                </div>
                <canvas class="skills-canvas" id="skills-main-canvas" style="flex-grow: 1;"></canvas>
                <div class="skills-controls" style="position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10;">
                    <button class="skills-btn" id="btn-zoom-in" style="background: rgba(20,25,35,0.9); border: 1px solid #2a3040; color: #ccc; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px;">+</button>
                    <button class="skills-btn" id="btn-zoom-out" style="background: rgba(20,25,35,0.9); border: 1px solid #2a3040; color: #ccc; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px;">-</button>
                    <button class="skills-btn" id="btn-reset" style="background: rgba(20,25,35,0.9); border: 1px solid #2a3040; color: #ccc; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 14px;">↺</button>
                </div>
                <div class="skills-tooltip" id="skills-tooltip" style="position: absolute; background: rgba(10,14,20,0.95); border: 1px solid rgba(0,212,255,0.3); border-radius: 6px; padding: 10px 14px; color: #ddd; font-size: 12px; font-family: var(--font-sans); pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 20; max-width: 250px; backdrop-filter: blur(8px);"></div>
            </div>
        `;

        this.canvas = this.container.querySelector('#skills-main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tooltipEl = this.container.querySelector('#skills-tooltip');
        this.searchInput = this.container.querySelector('#skills-search');

        this.setupGraph();
        this.resize();
        
        // Center initial view
        this.transform.x = this.canvas.width / 2;
        this.transform.y = this.canvas.height / 2;
        this.targetTransform.x = this.transform.x;
        this.targetTransform.y = this.transform.y;

        this.updateLayout();
        this.addEventListeners();
        this.loop();
    }

    setupGraph() {
        let rawNodes = [];
        let rawLinks = [];
        
        if (this.osData.skills) {
            const s = this.osData.skills;
            rawNodes.push({ id: "hub", type: "hub", label: s.hub || "Skills" });
            if (s.routers) {
                s.routers.forEach(r => {
                    rawNodes.push({ id: r.id, type: "router", label: r.name, parent: "hub", description: r.description });
                    rawLinks.push({ source: "hub", target: r.id });
                    if (r.switches) {
                        r.switches.forEach(sw => {
                            rawNodes.push({ id: sw.id, type: "switch", label: sw.name, parent: r.id, description: sw.description });
                            rawLinks.push({ source: r.id, target: sw.id });
                            if (sw.tools) {
                                sw.tools.forEach((t, i) => {
                                    const tId = `${sw.id}_t${i}`;
                                    rawNodes.push({ id: tId, type: "pc", label: t, parent: sw.id });
                                    rawLinks.push({ source: sw.id, target: tId });
                                });
                            }
                        });
                    }
                });
            }
        } else if (this.osData.skillsNetwork) {
            rawNodes = this.osData.skillsNetwork.nodes || [];
            rawLinks = this.osData.skillsNetwork.links || [];
        }
        
        if (rawNodes.length === 0) return;
        
        // Node sizing
        const radiusMap = { hub: 40, router: 28, switch: 18, pc: 10 };
        
        this.nodes = rawNodes.map(n => ({
            ...n,
            x: 0, y: 0,
            targetX: 0, targetY: 0,
            visible: n.type === 'hub' || n.type === 'router', // Only hub + domains initially
            expanded: false, // Nothing expanded initially
            radius: radiusMap[n.type] || 12,
            opacity: 1,
            targetOpacity: 1,
            children: [],
            searchMatch: false
        }));

        this.links = rawLinks;
        
        // Build parent-child relationships
        this.nodes.forEach(n => {
            n.children = this.nodes.filter(child => child.parent === n.id);
        });
    }

    addEventListeners() {
        const resizer = new ResizeObserver(() => this.resize());
        resizer.observe(this.container);

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        this.canvas.addEventListener('dblclick', this.onDblClick.bind(this));

        this.container.querySelector('#btn-zoom-in').addEventListener('click', () => {
            this.targetTransform.scale = Math.min(3, this.targetTransform.scale * 1.3);
        });
        
        this.container.querySelector('#btn-zoom-out').addEventListener('click', () => {
            this.targetTransform.scale = Math.max(0.3, this.targetTransform.scale / 1.3);
        });
        
        this.container.querySelector('#btn-reset').addEventListener('click', () => {
            // Collapse everything
            this.nodes.forEach(n => {
                n.expanded = false;
                if (n.type !== 'hub' && n.type !== 'router') {
                    n.visible = false;
                } else {
                    n.visible = true;
                }
            });
            this.selectedNode = null;
            this.targetTransform.x = this.canvas.width / 2;
            this.targetTransform.y = this.canvas.height / 2;
            this.targetTransform.scale = 1;
            this.updateLayout();
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.applySearch();
        });

        this.searchInput.addEventListener('focus', () => {
            this.searchInput.style.borderColor = 'rgba(0,212,255,0.5)';
            this.searchInput.style.width = '280px';
        });
        this.searchInput.addEventListener('blur', () => {
            this.searchInput.style.borderColor = '#2a3040';
            this.searchInput.style.width = '220px';
        });
    }

    applySearch() {
        // Reset all search matches
        this.nodes.forEach(n => n.searchMatch = false);
        
        if (!this.searchQuery) return;
        
        // Find matching nodes
        const matches = this.nodes.filter(n => 
            n.label.toLowerCase().includes(this.searchQuery)
        );
        
        if (matches.length === 0) return;
        
        // Mark matches and expand their parent chain
        matches.forEach(m => {
            m.searchMatch = true;
            this.expandParentChain(m);
        });
        
        this.updateLayout();
        
        // Center on first match
        if (matches.length > 0) {
            const first = matches[0];
            setTimeout(() => {
                this.centerOnNode(first);
            }, 100);
        }
    }

    expandParentChain(node) {
        let current = node;
        while (current.parent) {
            const parent = this.nodes.find(n => n.id === current.parent);
            if (parent) {
                parent.expanded = true;
                parent.visible = true;
                current.visible = true;
                current = parent;
            } else break;
        }
        node.visible = true;
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    toWorld(screenX, screenY) {
        return {
            x: (screenX - this.transform.x) / this.transform.scale,
            y: (screenY - this.transform.y) / this.transform.scale
        };
    }

    toScreen(worldX, worldY) {
        return {
            x: worldX * this.transform.scale + this.transform.x,
            y: worldY * this.transform.scale + this.transform.y
        };
    }

    distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    getNodeAt(mouseX, mouseY) {
        const worldPos = this.toWorld(mouseX, mouseY);
        const tolerance = 15;
        // Reverse order to pick topmost first
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const n = this.nodes[i];
            if (n.visible && n.opacity > 0.3 && this.distance(n.x, n.y, worldPos.x, worldPos.y) < n.radius + tolerance) {
                return n;
            }
        }
        return null;
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const clickedNode = this.getNodeAt(mouseX, mouseY);
        
        if (clickedNode) {
            this.handleNodeClick(clickedNode);
        } else {
            this.isDragging = true;
            this.dragStart = { x: mouseX, y: mouseY };
            this.dragTransformStart = { x: this.transform.x, y: this.transform.y };
        }
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            const dx = mouseX - this.dragStart.x;
            const dy = mouseY - this.dragStart.y;
            this.transform.x = this.dragTransformStart.x + dx;
            this.transform.y = this.dragTransformStart.y + dy;
            this.targetTransform.x = this.transform.x;
            this.targetTransform.y = this.transform.y;
            return;
        }

        const node = this.getNodeAt(mouseX, mouseY);
        this.hoveredNode = node;

        if (node) {
            this.canvas.style.cursor = 'pointer';
            this.showTooltip(node, mouseX, mouseY);
        } else {
            this.canvas.style.cursor = 'grab';
            this.hideTooltip();
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onDblClick(e) {
        // Double-click to center on node
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const node = this.getNodeAt(mouseX, mouseY);
        if (node) {
            this.centerOnNode(node);
        }
    }

    onWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldPosBefore = this.toWorld(mouseX, mouseY);
        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
        const newScale = Math.max(0.25, Math.min(4, this.transform.scale * zoomFactor));
        
        this.transform.scale = newScale;
        this.targetTransform.scale = newScale;

        const worldPosAfter = this.toWorld(mouseX, mouseY);
        this.transform.x += (worldPosAfter.x - worldPosBefore.x) * this.transform.scale;
        this.transform.y += (worldPosAfter.y - worldPosBefore.y) * this.transform.scale;
        this.targetTransform.x = this.transform.x;
        this.targetTransform.y = this.transform.y;
    }

    showTooltip(node, x, y) {
        let content = `<div style="font-weight:600; color:#fff; margin-bottom:4px;">${node.label}</div>`;
        if (node.description) {
            content += `<div style="color:#999; font-size:11px; line-height:1.4;">${node.description}</div>`;
        }
        if (node.children && node.children.length > 0 && !node.expanded) {
            content += `<div style="color:var(--accent-blue); font-size:11px; margin-top:6px;">Click to expand ${node.children.length} items</div>`;
        }
        this.tooltipEl.innerHTML = content;
        this.tooltipEl.style.left = `${Math.min(x + 15, this.canvas.width - 270)}px`;
        this.tooltipEl.style.top = `${Math.max(y - 10, 10)}px`;
        this.tooltipEl.style.opacity = '1';
    }

    hideTooltip() {
        this.tooltipEl.style.opacity = '0';
    }

    handleNodeClick(node) {
        this.selectedNode = node;

        if (node.type === 'hub') {
            // Toggle all routers — if any expanded, collapse all; otherwise expand all
            const anyExpanded = this.nodes.filter(n => n.type === 'router').some(n => n.expanded);
            this.nodes.filter(n => n.type === 'router').forEach(r => {
                r.expanded = !anyExpanded;
                if (!r.expanded) this.collapseRecursive(r);
            });
        } else if (node.type === 'pc') {
            // Tools are leaf nodes — no expansion, just select
            return;
        } else {
            // Router or Switch: toggle this node, collapse siblings
            if (!node.expanded) {
                // Collapse siblings at same level
                const siblings = this.nodes.filter(n => n.parent === node.parent && n.id !== node.id);
                siblings.forEach(s => {
                    s.expanded = false;
                    this.collapseRecursive(s);
                });
                
                // Expand this node
                node.expanded = true;
                node.children.forEach(c => {
                    c.visible = true;
                });
            } else {
                // Collapse this node
                node.expanded = false;
                this.collapseRecursive(node);
            }
        }
        
        this.updateLayout();
        this.centerOnNode(node);
    }

    collapseRecursive(node) {
        node.children.forEach(c => {
            c.expanded = false;
            c.visible = false;
            c.targetX = node.targetX || node.x;
            c.targetY = node.targetY || node.y;
            this.collapseRecursive(c);
        });
    }

    centerOnNode(node) {
        // Smoothly pan to center on this node
        this.targetTransform.x = this.canvas.width / 2 - node.targetX * this.targetTransform.scale;
        this.targetTransform.y = this.canvas.height / 2 - node.targetY * this.targetTransform.scale;
    }

    updateLayout() {
        const hub = this.nodes.find(n => n.type === 'hub');
        if (!hub) return;
        
        hub.targetX = 0;
        hub.targetY = 0;
        hub.visible = true;

        // Layout routers around hub
        const routers = this.nodes.filter(n => n.type === 'router');
        const routerRadius = 200;
        const routerStep = (Math.PI * 2) / Math.max(1, routers.length);
        
        routers.forEach((r, i) => {
            r.visible = true;
            const angle = -Math.PI / 2 + i * routerStep; // Start from top
            r.targetX = hub.targetX + Math.cos(angle) * routerRadius;
            r.targetY = hub.targetY + Math.sin(angle) * routerRadius;
            
            // If router just became visible and is at origin, seed position near parent
            if (r.x === 0 && r.y === 0) {
                r.x = hub.targetX;
                r.y = hub.targetY;
            }
            
            if (r.expanded) {
                this.layoutChildren(r, 150, angle, Math.PI * 0.6);
            } else {
                // Collapse children to parent position
                r.children.forEach(c => {
                    if (!c.visible) {
                        c.targetX = r.targetX;
                        c.targetY = r.targetY;
                    }
                });
            }
        });
    }

    layoutChildren(parent, dist, baseAngle, angleSpan) {
        const visibleChildren = parent.children.filter(c => c.visible);
        const count = visibleChildren.length;
        if (count === 0) return;
        
        const step = angleSpan / Math.max(1, count);
        const startAngle = baseAngle - angleSpan / 2 + step / 2;
        
        visibleChildren.forEach((c, i) => {
            const angle = startAngle + i * step;
            c.targetX = parent.targetX + Math.cos(angle) * dist;
            c.targetY = parent.targetY + Math.sin(angle) * dist;
            
            // Seed position at parent if first appearance
            if (c.x === 0 && c.y === 0) {
                c.x = parent.targetX;
                c.y = parent.targetY;
            }
            
            if (c.expanded) {
                this.layoutChildren(c, dist * 0.7, angle, angleSpan * 0.7);
            } else {
                c.children.forEach(gc => {
                    if (!gc.visible) {
                        gc.targetX = c.targetX;
                        gc.targetY = c.targetY;
                    }
                });
            }
        });
    }

    // --- Rendering Loop ---
    loop() {
        this.updatePhysics();
        this.draw();
        this.animationId = requestAnimationFrame(this.loop.bind(this));
    }

    updatePhysics() {
        const lerp = 0.08;
        
        // Smooth camera pan
        this.transform.x += (this.targetTransform.x - this.transform.x) * lerp;
        this.transform.y += (this.targetTransform.y - this.transform.y) * lerp;
        this.transform.scale += (this.targetTransform.scale - this.transform.scale) * lerp;

        // Node positions
        this.nodes.forEach(n => {
            n.x += (n.targetX - n.x) * lerp;
            n.y += (n.targetY - n.y) * lerp;
            n.opacity += (n.targetOpacity - n.opacity) * 0.12;
        });

        // Compute hover dimming
        if (this.hoveredNode) {
            const connected = this.getConnectedIds(this.hoveredNode);
            this.nodes.forEach(n => {
                n.targetOpacity = connected.has(n.id) ? 1 : 0.15;
            });
        } else {
            this.nodes.forEach(n => {
                n.targetOpacity = n.visible ? 1 : 0;
            });
        }
    }

    getConnectedIds(node) {
        const ids = new Set([node.id]);
        // Parent
        if (node.parent) ids.add(node.parent);
        // Children
        node.children.forEach(c => { if (c.visible) ids.add(c.id); });
        // Grandparent (for context)
        if (node.parent) {
            const parent = this.nodes.find(n => n.id === node.parent);
            if (parent && parent.parent) ids.add(parent.parent);
        }
        return ids;
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, w, h);

        // Subtle grid
        this.drawGrid();

        ctx.save();
        ctx.translate(this.transform.x, this.transform.y);
        ctx.scale(this.transform.scale, this.transform.scale);

        // Draw edges
        this.drawEdges();

        // Draw nodes (sorted: hub first, then routers, then rest)
        const drawOrder = [...this.nodes].sort((a, b) => {
            const order = { hub: 0, router: 1, switch: 2, pc: 3 };
            return (order[a.type] || 4) - (order[b.type] || 4);
        });
        
        drawOrder.forEach(n => {
            if (!n.visible && this.distance(n.x, n.y, n.targetX, n.targetY) < 1) return;
            if (n.opacity < 0.02) return;
            this.drawNode(n);
        });

        ctx.restore();
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = 'rgba(40, 60, 80, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 50 * this.transform.scale;
        const offsetX = this.transform.x % gridSize;
        const offsetY = this.transform.y % gridSize;

        for (let x = offsetX; x < this.canvas.width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); ctx.stroke();
        }
        for (let y = offsetY; y < this.canvas.height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y); ctx.stroke();
        }
        ctx.restore();
    }

    drawEdges() {
        const ctx = this.ctx;
        const time = performance.now() / 1000;

        this.nodes.forEach(n => {
            if (!n.visible || n.opacity < 0.05) return;
            if (!n.parent) return;
            
            const parent = this.nodes.find(p => p.id === n.parent);
            if (!parent || !parent.visible || parent.opacity < 0.05) return;

            const edgeOpacity = Math.min(n.opacity, parent.opacity);
            
            // Edge line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${edgeOpacity * 0.25})`;
            ctx.lineWidth = n.type === 'pc' ? 1 : 1.5;
            ctx.moveTo(parent.x, parent.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
            
            // Animated data packet
            if (edgeOpacity > 0.3) {
                const offset = (n.id.charCodeAt(0) + (n.id.charCodeAt(n.id.length - 1) || 0)) % 10 / 10;
                const progress = ((time + offset) % 2.5) / 2.5;
                const px = parent.x + (n.x - parent.x) * progress;
                const py = parent.y + (n.y - parent.y) * progress;
                
                ctx.beginPath();
                ctx.fillStyle = `rgba(0, 212, 255, ${edgeOpacity * 0.7})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = `rgba(0, 212, 255, ${edgeOpacity * 0.5})`;
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
    }

    drawNode(n) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = n.opacity;
        ctx.translate(n.x, n.y);

        const isHovered = this.hoveredNode === n;
        const isSelected = this.selectedNode === n;
        const isSearchMatch = n.searchMatch && this.searchQuery;

        // Glow
        if (isHovered || isSelected || isSearchMatch) {
            ctx.shadowColor = isSearchMatch ? '#ffcc00' : '#00d4ff';
            ctx.shadowBlur = isHovered ? 30 : 18;
        }

        if (n.type === 'hub') {
            // Pulsing hub
            const pulse = Math.sin(performance.now() / 800) * 0.08 + 1;
            const r = n.radius * pulse;
            
            // Outer ring
            ctx.beginPath();
            ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Main circle
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = '#0d1520';
            ctx.fill();
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 3;
            ctx.stroke();

        } else if (n.type === 'router') {
            // Domain node — filled circle
            ctx.beginPath();
            ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = n.expanded ? '#0a2a3a' : '#0d1825';
            ctx.fill();
            ctx.strokeStyle = n.expanded ? '#00d4ff' : '#1a5070';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            
            // Inner icon indicator
            if (n.children.length > 0) {
                ctx.fillStyle = n.expanded ? '#00d4ff' : '#1a5070';
                ctx.font = '11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.expanded ? '−' : '+', 0, 0);
            }

        } else if (n.type === 'switch') {
            // Subskill node — rounded rect
            const rw = 14, rh = 14;
            ctx.beginPath();
            ctx.arc(0, 0, rh, 0, Math.PI * 2);
            ctx.fillStyle = n.expanded ? '#152030' : '#111822';
            ctx.fill();
            ctx.strokeStyle = n.expanded ? '#00ffaa' : '#1a4040';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            if (n.children.length > 0) {
                ctx.fillStyle = n.expanded ? '#00ffaa' : '#1a4040';
                ctx.font = '9px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.expanded ? '−' : '+', 0, 0);
            }

        } else {
            // Tool node — small dot
            ctx.beginPath();
            ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = isSearchMatch ? '#ffcc00' : '#00d4ff';
            ctx.fill();
        }

        // Reset shadow
        ctx.shadowBlur = 0;

        // Label
        let fontSize, fontWeight, labelColor;
        if (n.type === 'hub') {
            fontSize = 14; fontWeight = '700'; labelColor = '#00d4ff';
        } else if (n.type === 'router') {
            fontSize = 13; fontWeight = '600'; labelColor = '#e0e8f0';
        } else if (n.type === 'switch') {
            fontSize = 11; fontWeight = '500'; labelColor = '#b0c0d0';
        } else {
            fontSize = 10; fontWeight = '400'; labelColor = '#90a8c0';
        }

        ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const labelY = n.radius + 6;
        const text = n.label;
        
        // Wrap long labels
        const maxWidth = n.type === 'router' ? 140 : (n.type === 'switch' ? 120 : 100);
        const lines = this.wrapText(text, maxWidth, ctx);
        const lineHeight = fontSize + 3;
        const totalHeight = lines.length * lineHeight;
        
        // Semi-transparent background pill behind label
        const longestLine = lines.reduce((max, line) => {
            const w = ctx.measureText(line).width;
            return w > max ? w : max;
        }, 0);
        
        const bgPadX = 6, bgPadY = 3;
        ctx.fillStyle = 'rgba(8, 12, 18, 0.85)';
        const bgX = -longestLine / 2 - bgPadX;
        const bgY = labelY - bgPadY;
        const bgW = longestLine + bgPadX * 2;
        const bgH = totalHeight + bgPadY * 2;
        
        // Rounded rect background
        const cr = 4;
        ctx.beginPath();
        ctx.moveTo(bgX + cr, bgY);
        ctx.lineTo(bgX + bgW - cr, bgY);
        ctx.quadraticCurveTo(bgX + bgW, bgY, bgX + bgW, bgY + cr);
        ctx.lineTo(bgX + bgW, bgY + bgH - cr);
        ctx.quadraticCurveTo(bgX + bgW, bgY + bgH, bgX + bgW - cr, bgY + bgH);
        ctx.lineTo(bgX + cr, bgY + bgH);
        ctx.quadraticCurveTo(bgX, bgY + bgH, bgX, bgY + bgH - cr);
        ctx.lineTo(bgX, bgY + cr);
        ctx.quadraticCurveTo(bgX, bgY, bgX + cr, bgY);
        ctx.closePath();
        ctx.fill();

        // Search highlight border on pill
        if (isSearchMatch && this.searchQuery) {
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Draw text lines
        ctx.fillStyle = isSearchMatch && this.searchQuery ? '#ffcc00' : labelColor;
        lines.forEach((line, idx) => {
            ctx.fillText(line, 0, labelY + idx * lineHeight);
        });

        ctx.restore();
    }

    wrapText(text, maxWidth, ctx) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.container.innerHTML = '';
        this.container = null;
    }
}
