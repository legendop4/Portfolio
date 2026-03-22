export class CertificationsApp {
    constructor(osData) {
        this.certifications = osData.certifications || [];
        this.certifications.forEach(c => {
            if (c.link && !c.verifyLink) c.verifyLink = c.link;
        });
        this.container = null;
        this.animationId = null;
        this.scrollPos = 0;
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        let html = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #0a0a0a; font-family: var(--font-sans); position: relative; overflow: hidden;">
                <div style="padding: 20px; border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between; z-index: 2; background: #0a0a0a;">
                    <h2 style="color: #fff; margin: 0; font-weight: 500; font-size: 22px;">🥇 Certifications & Badges</h2>
                    <span style="color: #888; font-size: 13px;">Scroll horizontally or click to view details</span>
                </div>
                
                <div id="cert-carousel-container" style="flex-grow: 1; position: relative; display: flex; align-items: center; justify-content: flex-start; overflow: hidden; padding: 20px 40px;">
                    <!-- Auto-scrolling Track -->
                    <div id="cert-track" style="display: flex; gap: 30px; padding: 20px 0; width: max-content;">
        `;
        
        let cardsHtml = '';
        this.certifications.forEach((c, idx) => {
            const hasImage = c.image && c.image !== '';
            cardsHtml += `
                <div class="cert-card" data-index="${idx}" style="min-width: 350px; max-width: 350px; background: #1a1e24; border: 1px solid #2d3748; border-radius: 12px; padding: 25px; cursor: pointer; transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s;" 
                    onmouseover="this.style.transform='scale(1.05)'; this.style.borderColor='var(--accent-blue)'; this.style.boxShadow='0 10px 30px rgba(0,212,255,0.1)';" 
                    onmouseout="this.style.transform='scale(1)'; this.style.borderColor='#2d3748'; this.style.boxShadow='none';">
                    
                    <div style="height: 200px; width: 100%; pointer-events: none; background: ${hasImage ? 'transparent' : '#2d3748'}; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; ${hasImage ? `background-image: url('${c.image}'); background-size: contain; background-repeat: no-repeat; background-position: center;` : ''}">
                        ${!hasImage ? `<span style="font-size: 40px; color: #718096;">🎓</span>` : ''}
                    </div>
                    <h3 style="color: #fff; font-size: 18px; margin: 0 0 10px 0; text-align: center; font-weight: 600;">${c.title}</h3>
                    <p style="color: var(--accent-blue); font-size: 14px; margin: 0; text-align: center; font-weight: bold;">${c.issuer}</p>
                </div>
            `;
        });
        
        // Append twice for seamless marquee loop
        html += cardsHtml + cardsHtml;
        
        html += `
                    </div>
                </div>
                
                <!-- Modal overlay (hidden by default) -->
                <div id="cert-modal" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;">
                    <div style="background: #1a1a1a; padding: 40px; border-radius: 12px; border: 1px solid var(--accent-blue); max-width: 500px; width: 90%; position: relative; box-shadow: 0 10px 40px rgba(0,212,255,0.2);">
                        <button id="close-modal" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;">&times;</button>
                        <div id="modal-content" style="text-align: center;"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        this.startCarousel();
        this.setupModal();
    }

    startCarousel() {
        const container = this.container.querySelector('#cert-carousel-container');
        const track = this.container.querySelector('#cert-track');
        if (container && track) {
            // Inject CSS Keyframes for infinitely smooth hardware-accelerated scrolling
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes scrollMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                #cert-track {
                    animation: scrollMarquee 30s linear infinite;
                }
                #cert-track:hover {
                    animation-play-state: paused;
                }
                #cert-carousel-container::-webkit-scrollbar { height: 8px; }
                #cert-carousel-container::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
                #cert-carousel-container::-webkit-scrollbar-thumb { background: var(--accent-dark); border-radius: 4px; }
                #cert-carousel-container::-webkit-scrollbar-thumb:hover { background: var(--accent-blue); }
            `;
            this.container.appendChild(style);
        }
    }

    setupModal() {
        const modal = this.container.querySelector('#cert-modal');
        const modalContent = this.container.querySelector('#modal-content');
        const closeBtn = this.container.querySelector('#close-modal');
        
        const cards = this.container.querySelectorAll('.cert-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.index);
                const cert = this.certifications[idx];
                const hasImage = cert.image && cert.image !== '';
                
                modalContent.innerHTML = `
                    <div style="height: 200px; background: ${hasImage ? 'transparent' : '#222'}; border-radius: 8px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; ${hasImage ? `background-image: url('${cert.image}'); background-size: contain; background-repeat: no-repeat; background-position: center;` : ''}">
                        ${!hasImage ? `<span style="font-size: 50px; color: #444;">🎓</span>` : ''}
                    </div>
                    <h2 style="color: #fff; margin: 0 0 10px 0;">${cert.title}</h2>
                    <h4 style="color: var(--accent-blue); margin: 0 0 25px 0;">Issued by: ${cert.issuer}</h4>
                    
                    <a href="${cert.verifyLink}" target="_blank" style="display: inline-block; padding: 12px 30px; background: var(--accent-dark); color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background 0.2s;" onmouseover="this.style.background='var(--accent-blue)'; this.style.color='#000';" onmouseout="this.style.background='var(--accent-dark)'; this.style.color='#fff';">
                        Verify Credential
                    </a>
                `;
                
                modal.style.display = 'flex';
                // Trigger reflow
                void modal.offsetWidth;
                modal.style.opacity = '1';
                window.certPaused = true;
            });
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                window.certPaused = false;
            }, 200);
        });
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.container.innerHTML = '';
        this.container = null;
    }
}
