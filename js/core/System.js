import { Config } from '../config.js?v=9';
import { StateManager } from './StateManager.js?v=9';
import { Desktop } from './Desktop.js?v=9';

export class System {
    constructor() {
        this.stateManager = new StateManager();
        this.data = null;
        this.desktop = null;
        
        // DOM Elements
        this.bootLogsEl = document.getElementById('boot-logs');
        this.lockForm = document.getElementById('login-form');
        this.passwordInput = document.getElementById('password-input');
    }

    async init() {
        await this.loadData();
        this.stateManager.init();
        
        this.runBootSequence();
        this.setupLockScreen();
        
        // Listen for global lock events
        document.addEventListener('system:lock', () => {
            this.stateManager.transitionTo(this.stateManager.states.LOCK);
            if (this.passwordInput) this.passwordInput.value = '';
        });
    }

    async loadData() {
        try {
            const response = await fetch(Config.DATA_URL + '?t=' + new Date().getTime());
            this.data = await response.json();
            
            // Make data globally accessible for apps
            window.PortfolioData = this.data;
        } catch (error) {
            console.error("Failed to load system data:", error);
        }
    }

    runBootSequence() {
        let index = 0;
        const totalLogs = Config.BOOT_LOGS.length;

        if (!this.bootLogsEl) return;
        this.bootLogsEl.innerHTML = '';

        const nextLog = () => {
            if (index < totalLogs) {
                const logLine = document.createElement('div');
                // Use systemd-style [  OK  ] coloring
                logLine.innerHTML = `<span style="color: #00ff00; font-weight: bold;">[  OK  ]</span> ${Config.BOOT_LOGS[index]}`;
                this.bootLogsEl.appendChild(logLine);
                this.bootLogsEl.scrollTop = this.bootLogsEl.scrollHeight;
                index++;
                
                // Randomize delay between 20ms and 150ms for realism
                const delay = Math.random() * 130 + 20;
                setTimeout(nextLog, delay);
            } else {
                setTimeout(() => {
                    this.stateManager.transitionTo(this.stateManager.states.LOCK);
                    this.startLoginSequence();
                }, 800);
            }
        };

        nextLog();
    }

    startLoginSequence() {
        const loginText = document.getElementById('lock-login-text');
        const loginForm = document.getElementById('login-form');
        
        if (!loginText || !loginForm) return;
        
        loginText.innerHTML = '';
        loginForm.style.display = 'none';
        
        const username = this.data && this.data.name ? this.data.name.toLowerCase().split(' ')[0] : 'shivam';
        
        // Output prompt instantly
        loginText.innerHTML = `<span style="color:var(--accent-blue)">${username}@kali:~$</span> `;
        
        let i = 0;
        const textToType = "login";
        
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                loginText.innerHTML += textToType.charAt(i);
                i++;
                if (i >= textToType.length) {
                    clearInterval(typeInterval);
                    loginText.innerHTML += '<br>';
                    setTimeout(() => {
                        loginForm.style.display = 'flex';
                        if (this.passwordInput) {
                            this.passwordInput.value = '';
                            this.passwordInput.focus();
                        }
                    }, 300);
                }
            }, 100);
        }, 600);
    }

    setupLockScreen() {
        if (!this.lockForm) return;
        
        this.lockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pwd = this.passwordInput.value.trim();
            const container = document.getElementById('lock-container');
            
            if (!pwd) {
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 400);
            } else {
                this.passwordInput.blur();
                this.stateManager.transitionTo(this.stateManager.states.DESKTOP);
                
                // Initialize Desktop when unlocked
                if (!this.desktop) {
                    this.desktop = new Desktop(this.data);
                    this.desktop.init();
                }
                
                // Signal other components that OS is ready
                document.dispatchEvent(new CustomEvent('system:unlocked', { detail: this.data }));
            }
        });
    }
}
