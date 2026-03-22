export class EmailApp {
    constructor(osData) {
        this.contact = osData.contact || {};
        this.container = null;
    }

    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #222; font-family: var(--font-sans);">
                <!-- Toolbar -->
                <div style="background: #333; padding: 10px 15px; border-bottom: 1px solid #444; display: flex; gap: 15px; color: #ccc; font-size: 13px;">
                    <span style="cursor: pointer; display: flex; align-items: center; gap: 5px; color: var(--accent-blue);">✉️ Compose</span>
                    <span style="cursor: pointer; display: flex; align-items: center; gap: 5px;">📥 Inbox</span>
                    <span style="cursor: pointer; display: flex; align-items: center; gap: 5px;">📤 Sent</span>
                </div>
                
                <div style="display: flex; flex-grow: 1; overflow: hidden;">
                    <!-- Sidebar -->
                    <div style="width: 200px; background: #1a1a1a; border-right: 1px solid #333; padding: 20px 10px;">
                        <ul style="list-style: none; padding: 0; margin: 0; color: #aaa; font-size: 14px; display: flex; flex-direction: column; gap: 10px;">
                            <li style="padding: 10px; background: rgba(0, 212, 255, 0.1); color: #fff; border-radius: 4px; cursor: pointer; border: 1px solid var(--accent-blue);">✏️ Compose New</li>
                            <li style="padding: 10px; cursor: pointer;">📥 Inbox <span style="float: right; font-size: 12px; background: #333; padding: 2px 6px; border-radius: 10px;">0</span></li>
                            <li style="padding: 10px; cursor: pointer;">⭐ Starred</li>
                            <li style="padding: 10px; cursor: pointer;">🗑️ Trash</li>
                            <li style="padding: 10px; cursor: pointer;">📁 Drafts</li>
                        </ul>
                    </div>
                    
                    <!-- Main Body -->
                    <div style="flex-grow: 1; padding: 40px; background: #222; overflow-y: auto; display: flex; justify-content: center; position: relative;">
                        <div id="email-success" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #fff;">
                            <div style="font-size: 50px; margin-bottom: 20px; color: var(--accent-blue);">✔️</div>
                            <h3>Message Dispatched Successfully</h3>
                            <p style="color: #aaa;">The system has securely routed your message.<br>I will get back to you shortly.</p>
                            <button id="email-compose-btn" style="margin-top: 20px; background: #333; color: #fff; border: 1px solid #555; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Compose Another</button>
                        </div>
                        
                        <form id="email-form" style="display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 700px;">
                            <h2 style="color: #fff; margin-top: 0; margin-bottom: 10px; font-weight: 300;">New Secure Message</h2>
                            
                            <div style="display: flex; border-bottom: 1px solid #444; padding-bottom: 10px; align-items: center;">
                                <span style="color: #888; width: 60px;">To:</span>
                                <input type="text" value="${this.contact.email || 'shivam@example.com'}" readonly style="background: transparent; border: none; color: #0f0; flex-grow: 1; font-family: var(--font-mono); outline: none;">
                            </div>
                            
                            <div style="display: flex; border-bottom: 1px solid #444; padding-bottom: 10px; align-items: center;">
                                <span style="color: #888; width: 60px;">Subject:</span>
                                <input id="email-subject" type="text" placeholder="Opportunity / Collaboration" required style="background: transparent; border: none; color: #fff; flex-grow: 1; font-family: var(--font-sans); outline: none; font-size: 16px;">
                            </div>
                            
                            <textarea id="email-body" placeholder="Write your message here... The simulated OS will package and proxy this dispatch." required style="background: #1a1a1a; border: 1px solid #444; color: #fff; border-radius: 6px; padding: 20px; height: 300px; font-family: var(--font-sans); resize: none; outline: none; font-size: 15px; margin-top: 10px; transition: border-color 0.3s;" onfocus="this.style.borderColor='var(--accent-blue)'" onblur="this.style.borderColor='#444'"></textarea>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                <span id="email-status-text" style="color: #666; font-size: 12px; font-family: var(--font-mono);">&gt; Ready to dispatch</span>
                                <button type="submit" id="email-send-btn" style="background: var(--accent-dark); color: #fff; border: none; padding: 12px 30px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--accent-blue)'; this.style.color='#000';" onmouseout="this.style.background='var(--accent-dark)'; this.style.color='#fff';">
                                    Send Message 🚀
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Attach form events
        const form = this.container.querySelector('#email-form');
        const successView = this.container.querySelector('#email-success');
        const sendBtn = this.container.querySelector('#email-send-btn');
        const statusText = this.container.querySelector('#email-status-text');
        const composeBtn = this.container.querySelector('#email-compose-btn');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Animate sending state
                sendBtn.innerHTML = 'Encrypting & Sending... ⏳';
                sendBtn.style.opacity = '0.7';
                sendBtn.disabled = true;
                statusText.innerHTML = '&gt; Establishing secure connection...';
                
                setTimeout(() => {
                    statusText.innerHTML = '&gt; Transmitting packets...';
                }, 800);
                
                setTimeout(() => {
                    form.style.display = 'none';
                    successView.style.display = 'block';
                    form.reset();
                    
                    // Reset button for next time
                    sendBtn.innerHTML = 'Send Message 🚀';
                    sendBtn.style.opacity = '1';
                    sendBtn.disabled = false;
                    statusText.innerHTML = '&gt; Ready to dispatch';
                }, 2000);
            });
        }
        
        if (composeBtn) {
            composeBtn.addEventListener('click', () => {
                successView.style.display = 'none';
                form.style.display = 'flex';
            });
        }
    }

    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
