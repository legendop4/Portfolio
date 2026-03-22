export class TerminalApp {
    constructor(osData, desktop) {
        this.data = osData;
        this.desktop = desktop; // Reference to desktop to launch apps
        this.container = null;
        this.historyEl = null;
        this.inputEl = null;
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    init(containerEl) {
        this.container = containerEl;
        this.container.innerHTML = `
            <div class="terminal-app" id="terminal-root">
                <div class="terminal-history" id="terminal-history">
<span style="color:#00ff00">Kali GNU/Linux Rolling</span>
<span style="color:var(--accent-blue)">shivam@kali:~$</span> Welcome to the terminal. Type 'help' to see available commands.
                </div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt" style="color:var(--accent-blue)">shivam@kali:~$</span>
                    <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        `;

        this.historyEl = this.container.querySelector('#terminal-history');
        this.inputEl = this.container.querySelector('#terminal-input');
        
        // Focus when clicking terminal body
        const root = this.container.querySelector('#terminal-root');
        root.addEventListener('click', () => {
             this.inputEl.focus();
        });
        
        this.inputEl.addEventListener('keydown', this.handleInput.bind(this));
        
        // Focus initially
        setTimeout(() => this.inputEl.focus(), 100);
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const cmd = this.inputEl.value.trim();
            this.inputEl.value = '';
            
            // Print command to history instantly
            const echoDiv = document.createElement('div');
            echoDiv.innerHTML = `\n<span style="color:var(--accent-blue); font-weight:bold;">shivam@kali:~$</span> ${cmd}`;
            this.historyEl.appendChild(echoDiv);
            
            if (cmd) {
                this.commandHistory.push(cmd);
                this.historyIndex = this.commandHistory.length;
                this.processCommand(cmd);
            }
            this.scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.inputEl.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.inputEl.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.inputEl.value = '';
            }
        }
    }

    processCommand(cmdStr) {
        const args = cmdStr.split(' ');
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'sudo':
                if (args.join(' ') === 'sudo hack the world') {
                    this.print(`\n<span style="color:#ff0000; font-weight:bold;">[!] Access denied. Try harder.</span>`);
                } else {
                    this.print(`\n<span style="color:#ff0000; font-weight:bold;">[!] This incident will be reported.</span>`);
                }
                break;
            case 'whoami':
                this.print(`\n<span style="color:var(--accent-blue)">Cybersecurity enthusiast exploring systems and breaking them to understand defensive architectures.</span>\nName: ${this.data.name || 'Shivam'}\nRole: ${this.data.heroSubtitles && this.data.heroSubtitles[0] ? this.data.heroSubtitles[0] : 'Specialist'}\nContact: ${this.data.contact ? this.data.contact.email : 'shrma@kali'}`);
                break;
            case 'story':
                const storyContent = this.data.about ? this.data.about.join('<br><br>') : "Story data not available.";
                this.print(`\n<span style="color:#00ff00">[+] Technical Background</span><br><br>${storyContent}`);
                break;
            case 'neofetch':
                const distro = "Kali GNU/Linux";
                const kernel = "5.10.0-kali3-amd64";
                const uptime = "42 days, 13 hours, 37 mins";
                const packages = "1337 (dpkg)";
                const shell = "bash 5.1.4";
                const ascii = `
<span style="color:#00ff00;">
       ..                      shivam@kali
     .::::.                    -----------
    ..::::..                   OS: ${distro}
   ..::::::..                  Kernel: ${kernel}
  ...::::::...                 Uptime: ${uptime}
 ...::::::::...                Packages: ${packages}
...::::::::::...               Shell: ${shell}
         ...:..
</span>`;
                this.print(ascii);
                break;
            case 'skills':
                this.print("\nOpening Skills Network...");
                if (this.desktop) {
                    this.desktop.launchApp({ id: 'skills', label: 'Skills Network', icon: 'assets/packet.png' });
                }
                break;
            case 'projects':
                this.print("\nOpening Projects...");
                if (this.desktop) {
                    this.desktop.launchApp({ id: 'projects', label: 'Projects', icon: 'assets/fileexpo.jpg' });
                }
                break;
            case 'labs':
                let labStr = "\nAvailable Labs:\n\n";
                if(this.data.labs) {
                    this.data.labs.forEach(lab => {
                        labStr += `<span style="color:#00ffff">${lab.title}</span> [${lab.category}]\n  - ${lab.description}\n\n`;
                    });
                }
                this.print(labStr);
                break;
            case 'cc':
            case 'cf':
            case 'lc':
                this.print(`\nOpening Browser for competitive programming profile: ${cmd.toUpperCase()}...`);
                if (this.desktop) {
                     this.desktop.launchApp({ id: 'browser', label: 'Browser', icon: 'assets/browser.jpg' });
                }
                break;
            case 'resume':
                this.print("\nOpening Resume PDF Viewer...");
                if (this.desktop) {
                     this.desktop.launchApp({ id: 'resume', label: 'Adobe Reader', icon: 'assets/pdf.png' });
                }
                break;
            case 'clear':
                this.historyEl.innerHTML = '';
                break;
            case 'scan':
                if (args.length < 2) {
                    this.print(`\nUsage: scan [target_ip]\nExample: scan 192.168.1.1`);
                    return;
                }
                this.print(`\n<span style="color:#00ff00">[+]</span> Initializing Nmap stealth SYN scan on ${args[1]}...`);
                setTimeout(() => this.print(`\nTCP SYN -> ${args[1]}:22`), 800);
                setTimeout(() => this.print(`\nSYN-ACK <- ${args[1]}:22 (Port Open)`), 1200);
                setTimeout(() => this.print(`\n<span style="color:#00ff00">[+]</span> Discovered open port 22/tcp`), 1400);

                setTimeout(() => this.print(`\nTCP SYN -> ${args[1]}:80`), 1800);
                setTimeout(() => this.print(`\nSYN-ACK <- ${args[1]}:80 (Port Open)`), 2200);
                
                setTimeout(() => this.print(`\nTCP SYN -> ${args[1]}:21`), 2600);
                setTimeout(() => this.print(`\nSYN-ACK <- ${args[1]}:21 (Port Open)`), 3000);
                setTimeout(() => this.print(`\n<span style="color:#ff0000">[ALERT]</span> Possible vulnerable FTP service running on port 21/tcp`), 3500);

                setTimeout(() => {
                    this.print(`\n<span style="color:#00ff00">[+]</span> Scan completed in 4.21 seconds. 3 ports open.`);
                    if (this.desktop && this.desktop.showNotification) this.desktop.showNotification('Scan Complete', `Nmap scan on ${args[1]} finished. 3 ports open.`, 'info');
                }, 4200);
                break;
            case 'connect':
                if (args.length < 2) {
                    this.print(`\nUsage: connect [user@target_ip]\nExample: connect root@10.0.0.5`);
                    return;
                }
                this.print(`\n<span style="color:#00ff00">[+]</span> Establishing SSH connection to ${args[1]}...`);
                setTimeout(() => this.print(`\n<span style="color:#fff">Warning: Permanently added '${args[1]}' (ECDSA) to the list of known hosts.</span>`), 1200);
                setTimeout(() => this.print(`\n<span style="color:#fff">Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-104-generic x86_64)</span>`), 2500);
                setTimeout(() => {
                    this.print(`\n<span style="color:var(--accent-blue)">${args[1].split('@')[0]}@target:~$</span> Connection established. Session securely proxied.`);
                    if (this.desktop && this.desktop.showNotification) this.desktop.showNotification('Connection Active', `Secure SSH connection to ${args[1]} established.`, 'alert');
                }, 3500);
                break;
            case 'help':
                this.print(`\nAvailable commands:
  whoami   - Display basic info about me
  skills   - Launch Skills Network interactive map
  projects - Open projects file explorer
  resume   - Open resume in PDF viewer
  labs     - Show lab environment details
  cc/cf/lc - Open coding profiles 
  scan     - Initiate vulnerability scan [target]
  connect  - Establish remote connection [target]
  story    - Read my cybersecurity journey
  clear    - Clear terminal output
  help     - Show this help message`);
                break;
            default:
                this.print(`\nbash: ${cmd}: command not found. Try harder :)`);
        }
    }

    print(text) {
        // Simple fast typing effect
        const div = document.createElement('div');
        this.historyEl.appendChild(div);
        
        // Disable input while typing
        this.inputEl.disabled = true;
        
        let i = 0;
        // Check if text is HTML or plain text. If HTML, just output it at once to avoid breaking tags,
        // or parse it. For simplicity, if it contains '<', output instantly.
        if (text.includes('<')) {
            div.innerHTML = text;
            this.inputEl.disabled = false;
            this.inputEl.focus();
            this.scrollToBottom();
            return;
        }

        const typeInterval = setInterval(() => {
            div.textContent += text.charAt(i);
            i++;
            this.scrollToBottom();
            if (i >= text.length) {
                clearInterval(typeInterval);
                this.inputEl.disabled = false;
                this.inputEl.focus();
            }
        }, 10); // 10ms per char
    }

    scrollToBottom() {
        const root = this.container.querySelector('#terminal-root');
        if (root) root.scrollTop = root.scrollHeight;
    }

    destroy() {
        // Cleanup if needed
        this.container = null;
    }
}
