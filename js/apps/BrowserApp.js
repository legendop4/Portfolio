export class BrowserApp {
    constructor(osData) {
        this.container = null;
        this.tabs = [];
        
        if (osData && osData.codingProfiles) {
            if (osData.codingProfiles.leetcode) {
                const solvedStr = osData.codingProfiles.leetcode.solved ? ` | Solved: ${osData.codingProfiles.leetcode.solved}` : '';
                this.tabs.push({ id: 'lc', name: 'LeetCode', url: osData.codingProfiles.leetcode.link, displayScore: `Rating: ${osData.codingProfiles.leetcode.rating}${solvedStr}`, icon: '🧩' });
            }
            if (osData.codingProfiles.codeforces) {
                this.tabs.push({ id: 'cf', name: 'Codeforces', url: osData.codingProfiles.codeforces.link, displayScore: `Rating: ${osData.codingProfiles.codeforces.rating}`, icon: '🏆' });
            }
            if (osData.codingProfiles.codechef) {
                this.tabs.push({ id: 'cc', name: 'CodeChef', url: osData.codingProfiles.codechef.link, displayScore: `Rating: ${osData.codingProfiles.codechef.rating}`, icon: '👨‍🍳' });
            }
        }
        
        if (this.tabs.length === 0) {
            this.tabs = [ { id: 'cf', name: 'Codeforces', url: 'https://codeforces.com', displayScore: 'No Data', icon: '🏆' } ];
        }
        
        this.activeTab = this.tabs[0].id;
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        let html = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #222; font-family: var(--font-sans);">
                <!-- Chrome-like Browser Header -->
                <div style="background: #111; display: flex; align-items: flex-end; padding: 10px 10px 0 10px; gap: 5px;">
        `;
        
        // Render Tabs
        this.tabs.forEach(t => {
            const isActive = t.id === this.activeTab;
            html += `
                <div data-tab="${t.id}" class="browser-tab" style="background: ${isActive ? '#222' : '#1a1a1a'}; color: ${isActive ? '#fff' : '#888'}; padding: 8px 20px; border-radius: 8px 8px 0 0; cursor: pointer; border: 1px solid #333; border-bottom: none; display: flex; align-items: center; gap: 8px; max-width: 200px; flex: 1; min-width: 100px;">
                    <span>${t.icon}</span>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;">${t.name}</span>
                </div>
            `;
        });
        
        const activeTabData = this.tabs.find(t => t.id === this.activeTab);
        
        html += `
                </div>
                </div>
                <!-- Browser Address Bar -->
                <div style="background: #222; padding: 10px; border-bottom: 1px solid #333; display: flex; gap: 10px; align-items: center; position: relative;">
                    <div style="position: absolute; bottom: -1px; left: 0; width: 0%; height: 2px; background: var(--accent-blue); transition: width 0.5s ease-out; z-index: 10;" id="browser-loading"></div>
                    <div style="display: flex; gap: 5px; color: #aaa;">
                        <span style="cursor: pointer;">◀</span>
                        <span style="cursor: pointer;">▶</span>
                        <span style="cursor: pointer;">↻</span>
                    </div>
                    <div style="flex-grow: 1; background: #111; padding: 6px 15px; border-radius: 20px; border: 1px solid #333; color: #fff; font-size: 13px; display: flex; justify-content: space-between;">
                        <span>🔒 <span style="color: #666">https://</span>${activeTabData.url.replace('https://', '')}</span>
                        <span style="color: #888">⭐</span>
                    </div>
                </div>
                
                <!-- Browser Fake Content Area -->
                <div style="flex-grow: 1; background: #fff; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 20px;">${activeTabData.icon}</div>
                    <h1 style="color: #333; font-size: 36px; margin-bottom: 10px;">${activeTabData.name} Profile</h1>
                    <p style="font-size: 24px; color: var(--accent-dark); font-weight: bold; margin-bottom: 30px;">${activeTabData.displayScore}</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; border: 1px solid #ddd; max-width: 600px;">
                        <p style="color: #666; margin-bottom: 20px;">This is a simulated browser view. For full analytics, activity heatmaps, and past contest performance, click the button below to visit the actual profile.</p>
                        
                        <a href="${activeTabData.url}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #1a73e8; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: background 0.2s;" onmouseover="this.style.background='#1557b0'" onmouseout="this.style.background='#1a73e8'">
                            Open in New Tab ↗
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Attach Tab Listeners
        const tabList = this.container.querySelectorAll('.browser-tab');
        tabList.forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.render();
            });
        });
        
        // Trigger loading animation
        const loader = this.container.querySelector('#browser-loading');
        if (loader) {
            setTimeout(() => {
                loader.style.width = '70%';
            }, 50);
            setTimeout(() => {
                loader.style.width = '100%';
                setTimeout(() => loader.style.opacity = '0', 200);
            }, 600);
        }
    }

    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
