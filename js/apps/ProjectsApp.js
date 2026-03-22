export class ProjectsApp {
    constructor(osData) {
        this.projects = osData.projects || [];
        this.projects.forEach(p => {
            if (p.techStack && !p.tech) p.tech = p.techStack;
        });
        this.container = null;
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        let html = `
            <div style="padding: 20px; font-family: var(--font-sans); display: flex; flex-direction: column; height: 100%; background: #1a1a1a;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #333; padding-bottom: 15px;">
                    <div style="font-size: 24px;">📁</div>
                    <div style="flex-grow: 1;">
                        <h2 style="color: #fff; margin: 0; font-weight: 500;">/home/shivam/projects</h2>
                    </div>
                </div>
                <div style="display: flex; gap: 20px; flex-wrap: wrap; overflow-y: auto; align-content: flex-start; flex-grow: 1;">
        `;
        
        this.projects.forEach(p => {
            const problemHtml = p.problemStatement ? `<div style="margin-bottom: 15px;"><strong style="color:var(--accent-blue); font-size:13px;">Problem:</strong><p style="margin:4px 0 0; font-size:13px; color:#aaa; line-height:1.4;">${p.problemStatement}</p></div>` : '';
            const learnedHtml = p.learned ? `<div style="margin-bottom: 20px;"><strong style="color:var(--accent-blue); font-size:13px;">Learned:</strong><p style="margin:4px 0 0; font-size:13px; color:#aaa; line-height:1.4;">${p.learned}</p></div>` : '';
            const demoBtn = p.demo ? `<a href="${p.demo}" target="_blank" onclick="event.stopPropagation()" style="display: block; text-align: center; flex: 1; padding: 10px 15px; background: #00d4ff; color: #000; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#00b3cc'" onmouseout="this.style.background='#00d4ff'">Live Demo</a>` : '';
            const githubBtn = `<a href="${p.github}" target="_blank" onclick="event.stopPropagation()" style="display: block; text-align: center; flex: 1; padding: 10px 15px; background: #2d3748; color: #fff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='#4a5568'" onmouseout="this.style.background='#2d3748'">View Code</a>`;
            
            html += `
                <div style="background: #1a1e24; border: 1px solid #2d3748; border-radius: 8px; padding: 25px; width: 320px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; display: flex; flex-direction: column;" 
                    onmouseover="this.style.transform='translateY(-8px)'; this.style.borderColor='var(--accent-blue)'; this.style.boxShadow='0 12px 24px rgba(0,212,255,0.15)';" 
                    onmouseout="this.style.transform='none'; this.style.borderColor='#2d3748'; this.style.boxShadow='none';">
                    
                    <h3 style="color: var(--accent-blue); margin-top: 0; margin-bottom: 12px; font-size: 19px; font-weight: 600;">${p.title}</h3>
                    <p style="font-size: 14px; color: #a0aec0; line-height: 1.6; margin-bottom: 15px; flex-grow: 1;">${p.description}</p>
                    ${problemHtml}
                    ${learnedHtml}
                    
                    <div style="margin-bottom: 25px; display: flex; gap: 8px; flex-wrap: wrap;">
                        ${p.tech.map(t => `<span style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.2); color: var(--accent-blue); padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">${t}</span>`).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: auto;">
                        ${githubBtn}
                        ${demoBtn}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
