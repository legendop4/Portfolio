export class SettingsApp {
    constructor(osData) {
        this.profile = {
            name: osData.name || (osData.profile && osData.profile.name) || 'User',
            title: (osData.heroSubtitles && osData.heroSubtitles.join(' | ')) || (osData.profile && osData.profile.title) || '',
            about: (osData.about && Array.isArray(osData.about) ? osData.about.join('<br><br>') : (osData.profile && osData.profile.about)) || '',
            avatar: osData.avatar || (osData.profile && osData.profile.avatar) || 'assets/prof.jpg'
        };
        this.contact = osData.contact || {};
        this.container = null;
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div style="padding: 30px; color: #fff; font-family: var(--font-sans); background: #111; height: 100%; display: flex; flex-direction: column; gap: 30px; overflow-y: auto;">
                <div style="display: flex; gap: 20px; align-items: center; border-bottom: 1px solid #333; padding-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: #222 ${this.profile.avatar ? `url('${this.profile.avatar}') center/cover` : ''}; border-radius: 50%; border: 2px solid var(--accent-blue); display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);">
                        ${this.profile.avatar ? '' : '👤'}
                    </div>
                    <div>
                        <h2 style="margin: 0 0 5px 0;">${this.profile.name || 'User'}</h2>
                        <p style="color: var(--accent-blue); margin: 0; font-size: 14px;">${this.profile.title || 'Portfolio'}</p>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px; padding-left: 5px;">About System</h3>
                    <p style="color: #ddd; line-height: 1.6; background: #1a1a1a; padding: 25px; border-radius: 12px; border: 1px solid #333; font-size: 14px;">
                        ${this.profile.about || 'No details specified.'}
                    </p>
                </div>
                
                <div>
                    <h3 style="color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px; padding-left: 5px;">Contact Protocols</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <a href="mailto:${this.contact.email}" style="display: flex; align-items: center; gap: 15px; padding: 18px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; color: #fff; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#252525'; this.style.borderColor='var(--accent-blue)';" onmouseout="this.style.background='#1a1a1a'; this.style.borderColor='#333';">
                            <span style="font-size: 20px;">📧</span> 
                            <div>
                                <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">Email Communication</div>
                                <div style="color: #888; font-size: 12px;">${this.contact.email}</div>
                            </div>
                        </a>
                        <a href="${this.contact.github}" target="_blank" style="display: flex; align-items: center; gap: 15px; padding: 18px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; color: #fff; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#252525'; this.style.borderColor='var(--accent-blue)';" onmouseout="this.style.background='#1a1a1a'; this.style.borderColor='#333';">
                            <span style="font-size: 20px;">🐙</span> 
                            <div>
                                <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">GitHub Database</div>
                                <div style="color: #888; font-size: 12px;">Repositories & Commits</div>
                            </div>
                        </a>
                        <a href="${this.contact.linkedin}" target="_blank" style="display: flex; align-items: center; gap: 15px; padding: 18px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; color: #fff; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#252525'; this.style.borderColor='var(--accent-blue)';" onmouseout="this.style.background='#1a1a1a'; this.style.borderColor='#333';">
                            <span style="font-size: 20px;">💼</span> 
                            <div>
                                <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">LinkedIn Network</div>
                                <div style="color: #888; font-size: 12px;">Professional Connections</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
