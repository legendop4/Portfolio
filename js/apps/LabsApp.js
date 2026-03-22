export class LabsApp {
    constructor(osData) {
        this.labs = osData.labs || [];
        this.container = null;
        this.activeFilter = 'all';
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    getCategories() {
        const cats = new Set();
        this.labs.forEach(l => cats.add(l.category));
        return Array.from(cats);
    }

    render() {
        const categories = this.getCategories();
        const filtered = this.activeFilter === 'all' 
            ? this.labs 
            : this.labs.filter(l => l.category === this.activeFilter);

        let html = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #0a0e14; font-family: var(--font-sans); overflow: hidden;">
                <!-- Header -->
                <div style="padding: 20px 25px 15px; border-bottom: 1px solid #1a2030; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                        <h2 style="color: #fff; margin: 0; font-weight: 600; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 22px;">🧪</span> Security Labs
                            <span style="background: rgba(0,212,255,0.15); color: var(--accent-blue); font-size: 12px; padding: 3px 10px; border-radius: 12px; font-weight: 500;">${this.labs.length} completed</span>
                        </h2>
                    </div>
                    <!-- Filter chips -->
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="lab-filter-btn" data-filter="all" style="${this.filterStyle('all')}">All</button>
                        ${categories.map(c => `
                            <button class="lab-filter-btn" data-filter="${c}" style="${this.filterStyle(c)}">${c}</button>
                        `).join('')}
                    </div>
                </div>

                <!-- Cards grid -->
                <div style="flex-grow: 1; overflow-y: auto; padding: 20px 25px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        `;

        filtered.forEach((lab, idx) => {
            const hasWriteup = lab.writeup && lab.writeup !== null && lab.writeup !== '';
            const diffColor = this.getDifficultyColor(lab.difficulty);
            
            html += `
                <div class="lab-card" style="background: #111620; border: 1px solid #1a2535; border-radius: 10px; padding: 20px; transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s; cursor: default; display: flex; flex-direction: column; gap: 12px;"
                    onmouseover="this.style.borderColor='rgba(0,212,255,0.4)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,212,255,0.08)';"
                    onmouseout="this.style.borderColor='#1a2535'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    
                    <!-- Top row: category & difficulty -->
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 11px; color: #607090; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">${lab.category}</span>
                        ${lab.difficulty ? `<span style="font-size: 11px; font-weight: 600; color: ${diffColor}; background: ${diffColor}18; padding: 2px 8px; border-radius: 4px;">${lab.difficulty}</span>` : ''}
                    </div>
                    
                    <!-- Title -->
                    <h3 style="color: #e8eef5; margin: 0; font-size: 15px; font-weight: 600; line-height: 1.3;">${lab.title}</h3>
                    
                    <!-- Description -->
                    <p style="color: #6a7a90; font-size: 12.5px; line-height: 1.55; margin: 0; flex-grow: 1;">${lab.description || ''}</p>
                    
                    <!-- Writeup link or status -->
                    <div style="margin-top: 4px;">
                        ${hasWriteup 
                            ? `<a href="${lab.writeup}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.25); border-radius: 6px; color: var(--accent-blue); font-size: 12px; font-weight: 600; text-decoration: none; transition: background 0.2s, border-color 0.2s;"
                                onmouseover="this.style.background='rgba(0,212,255,0.2)'; this.style.borderColor='rgba(0,212,255,0.5)';"
                                onmouseout="this.style.background='rgba(0,212,255,0.1)'; this.style.borderColor='rgba(0,212,255,0.25)';">
                                📄 Read Writeup <span style="font-size: 13px;">→</span>
                              </a>` 
                            : `<span class="lab-coming-soon" style="display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; color: rgba(255,255,255,0.4); font-weight: 500; cursor: default; position: relative;"
                                title="Writeup will be published on Medium soon">
                                📝 Writeup coming soon
                              </span>`
                        }
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.setupFilters();
    }

    filterStyle(filter) {
        const isActive = this.activeFilter === filter;
        return `
            background: ${isActive ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)'};
            border: 1px solid ${isActive ? 'rgba(0,212,255,0.35)' : 'rgba(255,255,255,0.08)'};
            color: ${isActive ? 'var(--accent-blue)' : '#607090'};
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            font-family: var(--font-sans);
            transition: all 0.2s;
        `.replace(/\n/g, ' ');
    }

    getDifficultyColor(diff) {
        if (!diff) return '#607090';
        switch(diff.toLowerCase()) {
            case 'easy': return '#22c55e';
            case 'medium': return '#eab308';
            case 'hard': return '#ef4444';
            default: return '#607090';
        }
    }

    setupFilters() {
        const buttons = this.container.querySelectorAll('.lab-filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.dataset.filter;
                this.render(); // Re-render with new filter
            });
        });
    }

    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
