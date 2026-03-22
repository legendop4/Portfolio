import { WindowManager } from './WindowManager.js?v=9';
import { TerminalApp } from '../apps/TerminalApp.js?v=9';
import { SkillsNetworkApp } from '../apps/SkillsNetworkApp.js?v=9';
import { ProjectsApp } from '../apps/ProjectsApp.js?v=9';
import { BrowserApp } from '../apps/BrowserApp.js?v=9';
import { CertificationsApp } from '../apps/CertificationsApp.js?v=9';
import { ResumeApp } from '../apps/ResumeApp.js?v=9';
import { SettingsApp } from '../apps/SettingsApp.js?v=9';
import { EmailApp } from '../apps/EmailApp.js?v=9';
import { LabsApp } from '../apps/LabsApp.js?v=9';

export class Desktop {
    constructor(data) {
        this.data = data;
        this.desktopEl = document.getElementById('desktop');
        this.iconsContainer = document.getElementById('desktop-icons');
        this.taskbarTimeEl = document.getElementById('taskbar-time');
        
        this.windowManager = new WindowManager(
            document.getElementById('window-container'),
            document.getElementById('taskbar-apps')
        );
        
        this.timeInterval = null;
    }

    init() {
        this.renderIcons();
        this.startClock();

        // Setup Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            const desktopEl = document.getElementById('desktop');
            if (desktopEl && desktopEl.classList.contains('hidden')) return;

            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.launchApp({ id: 'terminal', label: 'Terminal', icon: 'assets/terminal.png' });
            }
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.launchApp({ id: 'skills', label: 'Skills Network', icon: 'assets/packet.png' });
            }
            if (e.key === 'Escape') {
                if (this.windowManager && this.windowManager.windows.length > 0) {
                    const topWin = this.windowManager.windows[this.windowManager.windows.length - 1];
                    this.windowManager.closeWindow(topWin);
                }
            }
        });

        // Recruiter Modal Logic
        const recruiterBtn = document.getElementById('btn-recruiter-mode');
        const recruiterModal = document.getElementById('recruiter-modal');
        const closeRecruiter = document.getElementById('close-recruiter');
        
        if (recruiterBtn && recruiterModal) {
            recruiterBtn.addEventListener('click', () => {
                console.log("[DEBUG] Recruiter button clicked");
                
                // Hydrate Data
                if (this.data) {
                    const rName = document.getElementById('recruiter-name');
                    if (rName && this.data.name) rName.innerText = this.data.name;
                    
                    const rSub = document.getElementById('recruiter-subtitle');
                    if (rSub && this.data.heroSubtitles) rSub.innerText = this.data.heroSubtitles.join(' | ');

                    const rAbout = document.getElementById('recruiter-about');
                    if (rAbout && this.data.about) rAbout.innerText = this.data.about[0];

                    const rGithub = document.getElementById('recruiter-github');
                    if (rGithub && this.data.contact) rGithub.href = this.data.contact.github;

                    const rLinkedin = document.getElementById('recruiter-linkedin');
                    if (rLinkedin && this.data.contact) rLinkedin.href = this.data.contact.linkedin;

                    const rSkills = document.getElementById('recruiter-skills');
                    if (rSkills && this.data.skills && this.data.skills.routers) {
                        let tools = new Set();
                        this.data.skills.routers.forEach(r => r.switches.forEach(s => s.tools.forEach(t => tools.add(t))));
                        rSkills.innerText = Array.from(tools).slice(0, 10).join(' • ');
                    }
                }

                recruiterModal.classList.remove('hidden');
                setTimeout(() => recruiterModal.style.opacity = '1', 10);
                recruiterModal.style.pointerEvents = 'auto';
            });
            closeRecruiter.addEventListener('click', () => {
                console.log("[DEBUG] Recruiter modal closed");
                recruiterModal.style.opacity = '0';
                recruiterModal.style.pointerEvents = 'none';
                setTimeout(() => recruiterModal.classList.add('hidden'), 300);
            });
        } else {
            console.log("[DEBUG] Recruiter elements not found:", {recruiterBtn, recruiterModal});
        }

        // Demo Automation Logic
        const demoBtn = document.getElementById('btn-run-demo');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                console.log("[DEBUG] Demo button clicked!");
                this.runDemoSequence().catch(e => console.error("[DEBUG] Demo sequence error:", e));
            });
        } else {
            console.log("[DEBUG] Demo button not found");
        }
    }

    async runDemoSequence() {
        console.log("[DEBUG] Starting demo sequence");
        this.launchApp({ id: 'terminal', label: 'Terminal', icon: 'assets/terminal.png' });
        await new Promise(r => setTimeout(r, 1000));
        
        const term = this.activeTerminal;
        if (!term) {
            console.log("[DEBUG] Active terminal is null!");
            return;
        }

        const typeCommand = async (cmd) => {
            term.inputEl.value = '';
            for (let i = 0; i < cmd.length; i++) {
                term.inputEl.value += cmd[i];
                await new Promise(r => setTimeout(r, Math.random() * 50 + 50));
            }
            await new Promise(r => setTimeout(r, 300));
            term.inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        };

        await typeCommand('whoami');
        await new Promise(r => setTimeout(r, 3000));
        await typeCommand('skills');
        await new Promise(r => setTimeout(r, 3500));
        await typeCommand('scan 10.0.0.1');
    }

    renderIcons() {
        const icons = [
            { id: "terminal", label: "Terminal", type: "app", icon: "assets/terminal.png" },
            { id: "skills", label: "Skills Network", type: "app", icon: "assets/packet.png" },
            { id: "labs", label: "Labs", type: "app", icon: "assets/labs.png" },
            { id: "projects", label: "Projects", type: "folder", icon: "assets/fileexpo.jpg" },
            { id: "browser", label: "Browser", type: "app", icon: "assets/browser.jpg" },
            { id: "certifications", label: "Badges", type: "app", icon: "assets/photo.png" },
            { id: "resume", label: "Resume PDF", type: "app", icon: "assets/pdf.png" },
            { id: "email", label: "Contact Me", type: "app", icon: "assets/email.png" }
        ];

        const iconMap = {
            'terminal': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
            'skills': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.39 15.39A7.96 7.96 0 0 0 20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 1.5.4 2.91 1.1 4.11"></path><line x1="12" y1="15" x2="12" y2="22"></line><line x1="12" y1="22" x2="16" y2="22"></line><line x1="12" y1="22" x2="8" y2="22"></line><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="18" r="3"></circle></svg>`,
            'projects': `<svg viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            'browser': `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>`,
            'certifications': `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
            'resume': `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
            'email': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
            'labs': `<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v4.5l3 4.5v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6l3-4.5V3z"></path><line x1="9" y1="3" x2="15" y2="3"></line><path d="M10 14a2 2 0 1 0 4 0"></path></svg>`,
            'settings': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
        };

        icons.forEach(iconData => {
            const iconEl = document.createElement('div');
            iconEl.className = 'desktop-icon';
            iconEl.setAttribute('data-id', iconData.id);
            
            const svgContent = iconMap[iconData.id] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
            
            iconEl.innerHTML = `
                <div class="icon-img">
                    ${svgContent}
                </div>
                <span>${iconData.label}</span>
            `;

            iconEl.addEventListener('dblclick', () => {
                this.launchApp(iconData);
            });
            iconEl.addEventListener('click', (e) => {
                this.launchApp(iconData);
            });

            this.iconsContainer.appendChild(iconEl);
        });
    }

    startClock() {
        // Add Lock Button
        const lockBtn = document.createElement('button');
        lockBtn.className = 'taskbar-btn';
        lockBtn.innerHTML = '🔒 Lock';
        lockBtn.style.marginRight = '5px';
        lockBtn.title = 'Lock System';
        lockBtn.onclick = () => document.dispatchEvent(new CustomEvent('system:lock'));
        this.taskbarTimeEl.parentNode.insertBefore(lockBtn, this.taskbarTimeEl);

        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (this.taskbarTimeEl) this.taskbarTimeEl.textContent = timeStr;
        };
        updateTime();
        this.timeInterval = setInterval(updateTime, 10000);
    }

    showNotification(title, message, type='info') {
        const container = document.getElementById('desktop-notifications');
        if (!container) return;
        
        const notif = document.createElement('div');
        const color = type === 'alert' ? '#ef4444' : 'var(--accent-blue)';
        notif.style.cssText = `
            background: rgba(10, 10, 10, 0.9);
            border-left: 4px solid ${color};
            color: #fff;
            padding: 15px;
            width: 300px;
            border-radius: 4px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            font-family: var(--font-sans);
            font-size: 13px;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        `;
        notif.innerHTML = `<strong style="color:${color}; display:block; margin-bottom:5px; font-size:14px;">${title}</strong><span style="color:#ccc; line-height: 1.4; display: block;">${message}</span>`;
        container.appendChild(notif);
        
        // slide in
        requestAnimationFrame(() => notif.style.transform = 'translateX(0)');
        
        // slide out
        setTimeout(() => {
            notif.style.transform = 'translateX(120%)';
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }

    launchApp(appConfig) {
        let width = 800;
        let height = 500;
        let html = `<h2>${appConfig.label}</h2><p>Loading...</p>`;
        let appInstance = null;
        
        switch(appConfig.id) {
            case 'terminal':
                html = ''; 
                appInstance = new TerminalApp(this.data, this);
                this.activeTerminal = appInstance;
                width = 700;
                height = 450;
                break;
            case 'skills':
                html = ''; 
                appInstance = new SkillsNetworkApp(this.data);
                width = 900;
                height = 600;
                break;
            case 'projects':
                html = '';
                appInstance = new ProjectsApp(this.data);
                width = 750;
                height = 500;
                break;
            case 'browser':
                html = '';
                appInstance = new BrowserApp(this.data);
                width = 850;
                height = 600;
                break;
            case 'email':
                html = '';
                appInstance = new EmailApp(this.data);
                width = 800;
                height = 600;
                break;
            case 'certifications':
                html = '';
                appInstance = new CertificationsApp(this.data);
                width = 800;
                height = 350;
                break;
            case 'settings':
                html = '';
                appInstance = new SettingsApp(this.data);
                width = 450;
                height = 550;
                break;
            case 'labs':
                html = '';
                appInstance = new LabsApp(this.data);
                width = 900;
                height = 600;
                break;
            case 'resume':
                html = '';
                appInstance = new ResumeApp();
                width = 850;
                height = 650;
                break;
        }

        this.windowManager.openWindow({
            id: appConfig.id,
            title: appConfig.label,
            icon: appConfig.icon,
            width: width,
            height: height,
            contentHtml: html,
            appInstance: appInstance,
            maximized: appConfig.id === 'certifications'
        });
    }
}
