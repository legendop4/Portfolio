// ======= THEME SYSTEM =======
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check local storage for theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
    } else {
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    }
} else {
    // Default to dark
    body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '☀️';
    }
});

// ======= SMOOTH SCROLL =======
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======= GLOBAL DATA STATE =======
let pData = null;

// ======= INITIALIZE APP =======
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data/portfolio-data.json');
        if (!response.ok) throw new Error('Data fetch failed');
        pData = await response.json();

        // Remove loading state from terminal
        const loadTxt = document.getElementById('data-loading-status');
        if (loadTxt) loadTxt.remove();
        document.getElementById('terminal-input').removeAttribute('disabled');

        renderPortfolio();

    } catch (err) {
        console.error('Error loading portfolio data:', err);
        const lStatus = document.getElementById('data-loading-status');
        if (lStatus) {
            lStatus.textContent = '[sys] Error fetching portfolio-data.json';
            lStatus.style.color = '#ff5f56';
        }
    }
});

function renderPortfolio() {
    renderHero();
    renderAbout();
    renderCodingProfiles();
    renderProjects();
    renderLabs();
    initSkillsNetwork();
    renderCertifications();
    renderContact();
}

function renderHero() {
    // ASCII art for "Shivam Sharma"
    document.getElementById('ascii-title').innerHTML =
        `&nbsp;&nbsp;███████╗██╗&nbsp;&nbsp;██╗██╗██╗&nbsp;&nbsp;&nbsp;██╗&nbsp;█████╗&nbsp;███╗&nbsp;&nbsp;&nbsp;███╗<br>`+
        `&nbsp;&nbsp;██╔════╝██║&nbsp;&nbsp;██║██║██║&nbsp;&nbsp;&nbsp;██║██╔══██╗████╗&nbsp;████║<br>`+
        `&nbsp;&nbsp;███████╗███████║██║██║&nbsp;&nbsp;&nbsp;██║███████║██╔████╔██║<br>`+
        `&nbsp;&nbsp;╚════██║██╔══██║██║╚██╗&nbsp;██╔╝██╔══██║██║╚██╔╝██║<br>`+
        `&nbsp;&nbsp;███████║██║&nbsp;&nbsp;██║██║&nbsp;╚████╔╝&nbsp;██║&nbsp;&nbsp;██║██║&nbsp;╚═╝&nbsp;██║<br>`+
        `&nbsp;&nbsp;╚══════╝╚═╝&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;╚═══╝&nbsp;&nbsp;╚═╝&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╚═╝<br>`+
        `<br>`+
        `&nbsp;&nbsp;███████╗██╗&nbsp;&nbsp;██╗&nbsp;█████╗&nbsp;██████╗&nbsp;███╗&nbsp;&nbsp;&nbsp;███╗&nbsp;█████╗&nbsp;<br>`+
        `&nbsp;&nbsp;██╔════╝██║&nbsp;&nbsp;██║██╔══██╗██╔══██╗████╗&nbsp;████║██╔══██╗<br>`+
        `&nbsp;&nbsp;███████╗███████║███████║██████╔╝██╔████╔██║███████║<br>`+
        `&nbsp;&nbsp;╚════██║██╔══██║██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║<br>`+
        `&nbsp;&nbsp;███████║██║&nbsp;&nbsp;██║██║&nbsp;&nbsp;██║██║&nbsp;&nbsp;██║██║&nbsp;╚═╝&nbsp;██║██║&nbsp;&nbsp;██║<br>`+
        `&nbsp;&nbsp;╚══════╝╚═╝&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╚═╝╚═╝&nbsp;&nbsp;╚═╝<br>`;

    // Subtitles
    const subC = document.getElementById('hero-subtitle-container');
    subC.innerHTML = '';
    pData.heroSubtitles.forEach((s, idx) => {
        subC.appendChild(document.createTextNode(s));
        if (idx < pData.heroSubtitles.length - 1) {
            const span = document.createElement('span');
            span.className = 'divider';
            span.textContent = '|';
            subC.appendChild(span);
        }
    });
}

function renderAbout() {
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent || !pData.about) return;

    if (Array.isArray(pData.about)) {
        aboutContent.innerHTML = pData.about.map(p => `<p style="margin-bottom: 1rem;">${p}</p>`).join('');
    } else {
        aboutContent.innerHTML = `<p>${pData.about}</p>`;
    }
}

function renderCodingProfiles() {
    const grid = document.getElementById('coding-profiles-grid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.style.padding = '0 5%';
    
    const profiles = [
        { name: 'LeetCode', data: pData.codingProfiles.leetcode, icon: 'fa-code' },
        { name: 'Codeforces', data: pData.codingProfiles.codeforces, icon: 'fa-trophy' },
        { name: 'CodeChef', data: pData.codingProfiles.codechef, icon: 'fa-utensils' }
    ];

    profiles.forEach(p => {
        const solvedHtml = p.data.solved ? `<p style="font-size:0.9rem; color:#888;">Solved: <span class="highlight">${p.data.solved}</span></p>` : '';
        grid.innerHTML += `
            <div class="card" style="text-align: center; padding: 2rem;">
                <i class="fa-solid ${p.icon}" style="font-size: 2.5rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">${p.name}</h3>
                <p style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem;">@${p.data.username}</p>
                <p style="font-size: 0.9rem; color: #888;">Rating: <span class="highlight">${p.data.rating}</span></p>
                ${solvedHtml}
                <a href="${p.data.link}" class="btn btn-sm btn-outline" target="_blank" style="margin-top: 1rem; display: inline-block;">View Profile</a>
            </div>
        `;
    });
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    pData.projects.forEach(p => {
        const badges = p.techStack.map(t => `<span class="badge">${t}</span>`).join('');
        const demoBtn = p.demo ? `<a href="${p.demo}" class="btn btn-sm btn-primary" target="_blank">Live Demo</a>` : '';
        const gitBtn = p.github ? `<a href="${p.github}" class="btn btn-sm btn-outline" target="_blank">GitHub</a>` : '';

        grid.innerHTML += `
            <div class="card project-card">
                <div class="card-content">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="tech-badges">${badges}</div>
                </div>
                <div class="card-footer">${gitBtn}${demoBtn}</div>
            </div>`;
    });
}

function renderLabs() {
    const grid = document.getElementById('labs-grid');
    grid.innerHTML = '';

    pData.labs.forEach(l => {
        const difficultyBadgeHtml = l.difficulty ? `<span class="badge" style="background:var(--accent-color); color:#fff;">${l.difficulty}</span>` : '';
        const categoryHtml = l.category ? `<p style="font-size: 0.9rem; color: #888; margin-bottom: 0.5rem;">${l.category}</p>` : '';
        const descHtml = l.description ? `<p style="font-size: 0.95rem; margin-top: 1rem; color: #ccc;">${l.description}</p>` : '';

        grid.innerHTML += `
            <div class="card lab-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="margin: 0; padding-right: 1rem;">${l.title}</h3>
                    ${difficultyBadgeHtml}
                </div>
                ${categoryHtml}
                ${descHtml}
            </div>`;
    });
}

function renderContact() {
    const list = document.getElementById('contact-links-list');
    list.style.display = 'flex';
    list.style.gap = '1.5rem';
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.marginTop = '2rem';

    list.innerHTML = `
        <li><a href="mailto:${pData.contact.email}" title="Email Me" style="font-size: 2rem; color: var(--accent-color); transition: transform 0.3s;"><i class="fa-solid fa-envelope"></i></a></li>
        <li><a href="${pData.contact.github}" target="_blank" title="GitHub Profile" style="font-size: 2rem; color: var(--accent-color); transition: transform 0.3s;"><i class="fa-brands fa-github"></i></a></li>
        <li><a href="${pData.contact.linkedin}" target="_blank" title="LinkedIn Profile" style="font-size: 2rem; color: var(--accent-color); transition: transform 0.3s;"><i class="fa-brands fa-linkedin"></i></a></li>
    `;

    // Add hover effects interactively
    const links = list.querySelectorAll('a');
    links.forEach(l => {
        l.addEventListener('mouseenter', () => l.style.transform = 'scale(1.2)');
        l.addEventListener('mouseleave', () => l.style.transform = 'scale(1)');
    });
}

// ======= TERMINAL SECTION =======
const termInput = document.getElementById('terminal-input');
const termBody = document.getElementById('terminal-body');

// Floating Terminal Logic
const terminalLauncher = document.getElementById('terminal-launcher');
const terminalOverlay = document.getElementById('terminal-overlay');
const termCloseBtn = document.getElementById('term-close-btn');

function openTerminal() {
    terminalOverlay.classList.remove('hidden');
    setTimeout(() => termInput.focus(), 300); // Focus input after transition
}

function closeTerminal() {
    terminalOverlay.classList.add('hidden');
}

terminalLauncher.addEventListener('click', openTerminal);
termCloseBtn.addEventListener('click', closeTerminal);

// Close on background click
terminalOverlay.addEventListener('click', (e) => {
    if (e.target === terminalOverlay) closeTerminal();
});

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !terminalOverlay.classList.contains('hidden')) {
        closeTerminal();
    }
});

termInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        appendTermLine(`<span class="prompt">guest@shrma:~$</span> ${cmd}`);

        if (cmd === 'clear') {
            termBody.innerHTML = '';
        } else if (cmd !== '') {
            handleCommand(cmd);
        }

        this.value = '';
        termBody.scrollTop = termBody.scrollHeight;
    }
});

function handleCommand(cmd) {
    if (!pData) return appendTermLine('Error: Data not loaded.');

    let out = '';
    if (cmd === 'help') {
        out = `Available commands:
  <span class="highlight">whoami</span>    - Display about information
  <span class="highlight">projects</span>  - Display list of projects
  <span class="highlight">skills</span>    - Display skill categories
  <span class="highlight">labs</span>      - Display hands-on cybersecurity labs
  <span class="highlight">certs</span>     - Display certifications
  <span class="highlight">lc</span>        - LeetCode profile
  <span class="highlight">cf</span>        - Codeforces profile
  <span class="highlight">cc</span>        - CodeChef profile
  <span class="highlight">contact</span>   - Display contact information
  <span class="highlight">clear</span>     - Clear terminal output`;
    } else if (cmd === 'whoami') {
        out = pData.about;
    } else if (cmd === 'projects') {
        out = `Projects:\n` + pData.projects.map((p, i) => `${i + 1}. ${p.title}`).join('\n') + `\n\n*(Scrolling to projects section...)*`;
        setTimeout(() => scrollToSection('projects'), 500);
    } else if (cmd === 'skills') {
        out = `Skill Categories:\n` + pData.skills.routers.map(r => `- ${r.name}`).join('\n');
    } else if (cmd === 'labs') {
        out = `Practice Labs:\n` + pData.labs.map(l => `- ${l.title} (${l.tools.join(', ')})`).join('\n');
    } else if (cmd === 'certs') {
        out = `Certifications:\n` + pData.certifications.map(c => `- ${c.title}`).join('\n');
    } else if (cmd === 'lc') {
        const v = pData.codingProfiles.leetcode;
        out = `LeetCode: ${v.username} | Rating: ${v.rating} | Solved: ${v.solved} | <a href="${v.link}" target="_blank">Profile</a>`;
    } else if (cmd === 'cf') {
        const v = pData.codingProfiles.codeforces;
        out = `Codeforces: ${v.username} | Rating: ${v.rating} | <a href="${v.link}" target="_blank">Profile</a>`;
    } else if (cmd === 'cc') {
        const v = pData.codingProfiles.codechef;
        out = `CodeChef: ${v.username} | Rating: ${v.rating} | <a href="${v.link}" target="_blank">Profile</a>`;
    } else if (cmd === 'contact') {
        out = `Email: ${pData.contact.email}\nGitHub: ${pData.contact.github}\nLinkedIn: ${pData.contact.linkedin}`;
    } else {
        out = `bash: ${cmd}: command not found. Type 'help' for available commands.`;
    }
    appendTermLine(out);
}

function appendTermLine(htmlStr) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = htmlStr.replace(/\n/g, '<br>');
    termBody.appendChild(div);
}

// ======= HERO BACKGROUND ANIMATION =======
const heroCanvas = document.getElementById('hero-canvas');
const hctx = heroCanvas.getContext('2d');

let heroNodes = [];
let heroPackets = [];
let mouse = { x: null, y: null };

function resizeHero() {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeHero);
resizeHero();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

class HeroNode {
    constructor() {
        this.x = Math.random() * heroCanvas.width;
        this.y = Math.random() * heroCanvas.height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;
    }
    draw() {
        hctx.beginPath();
        hctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        hctx.fillStyle = getComputedStyle(body).getPropertyValue('--accent-color').trim();
        hctx.fill();
    }
}

class HeroPacket {
    constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = Math.random() * 0.02 + 0.01;
    }
    update() {
        this.progress += this.speed;
    }
    draw() {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;
        hctx.beginPath();
        hctx.arc(x, y, 3, 0, Math.PI * 2);
        hctx.fillStyle = '#fff';
        hctx.fill();
        hctx.shadowBlur = 10;
        hctx.shadowColor = getComputedStyle(body).getPropertyValue('--accent-color').trim();
    }
}

for (let i = 0; i < 50; i++) heroNodes.push(new HeroNode());

function animateHero() {
    hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    hctx.lineWidth = 0.5;
    const accentColor = getComputedStyle(body).getPropertyValue('--accent-color').trim();

    for (let i = 0; i < heroNodes.length; i++) {
        for (let j = i + 1; j < heroNodes.length; j++) {
            const dx = heroNodes[i].x - heroNodes[j].x;
            const dy = heroNodes[i].y - heroNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                hctx.beginPath();
                hctx.moveTo(heroNodes[i].x, heroNodes[i].y);
                hctx.lineTo(heroNodes[j].x, heroNodes[j].y);
                hctx.strokeStyle = `rgba(128, 128, 128, ${1 - dist / 150})`;

                if (mouse.x && mouse.y) {
                    const mx = (heroNodes[i].x + heroNodes[j].x) / 2 - mouse.x;
                    const my = (heroNodes[i].y + heroNodes[j].y) / 2 - mouse.y;
                    const mDist = Math.sqrt(mx * mx + my * my);
                    if (mDist < 100) {
                        hctx.strokeStyle = accentColor;
                        hctx.lineWidth = 1;
                        if (Math.random() < 0.01) heroPackets.push(new HeroPacket(heroNodes[i], heroNodes[j]));
                    }
                }
                hctx.stroke();
            }
        }
        heroNodes[i].update();
        heroNodes[i].draw();
    }

    for (let i = heroPackets.length - 1; i >= 0; i--) {
        heroPackets[i].update();
        heroPackets[i].draw();
        if (heroPackets[i].progress >= 1) heroPackets.splice(i, 1);
    }
    hctx.shadowBlur = 0;
    requestAnimationFrame(animateHero);
}
animateHero();

// ======= PROJECTS SLIDER =======
const projectSlider = document.getElementById('project-slider-toggle');
const viewProjects = document.getElementById('view-projects');
const viewLabs = document.getElementById('view-labs');
const labelProjects = document.getElementById('label-projects');
const labelLabs = document.getElementById('label-labs');

projectSlider.addEventListener('change', (e) => {
    if (e.target.checked) {
        viewProjects.classList.remove('active');
        viewLabs.classList.add('active');
        labelProjects.classList.remove('active');
        labelLabs.classList.add('active');
    } else {
        viewLabs.classList.remove('active');
        viewProjects.classList.add('active');
        labelLabs.classList.remove('active');
        labelProjects.classList.add('active');
    }
});

// ======= CISCO TOPOLOGY SKILLS NETWORK =======
const sCanvas = document.getElementById('skills-canvas');
const sCtx = sCanvas.getContext('2d');
const sTooltip = document.getElementById('skills-tooltip');

let ciscoNodes = [];
let ciscoLinks = [];
let layoutPhysicsRunning = true;

// Preload Cisco SVG Icons
const ciscoImages = {
    'hub': new Image(),
    'router': new Image(),
    'switch': new Image(),
    'computer': new Image()
};
ciscoImages['hub'].src = 'assets/icons/cisco/cloud.svg';
ciscoImages['router'].src = 'assets/icons/cisco/router.svg';
ciscoImages['switch'].src = 'assets/icons/cisco/switch.svg';
ciscoImages['computer'].src = 'assets/icons/cisco/pc.svg';

function drawGrid() {
    sCtx.save();
    sCtx.strokeStyle = document.body.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
    sCtx.lineWidth = 1;
    const gridSize = 40;

    for (let x = 0; x < sCanvas.width; x += gridSize) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, sCanvas.height);
        sCtx.stroke();
    }
    for (let y = 0; y < sCanvas.height; y += gridSize) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(sCanvas.width, y);
        sCtx.stroke();
    }
    sCtx.restore();
}

function resizeSkills() {
    sCanvas.width = sCanvas.parentElement.clientWidth;
    sCanvas.height = sCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeSkills);
resizeSkills();

const sFullscreenBtn = document.getElementById('skills-fullscreen-btn');
const sWrapper = document.getElementById('skills-network-wrapper');

if (sFullscreenBtn) {
    sFullscreenBtn.addEventListener('click', toggleSkillsFullscreen);
}

function toggleSkillsFullscreen() {
    sWrapper.classList.toggle('skills-fullscreen');
    if (sWrapper.classList.contains('skills-fullscreen')) {
        sFullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        sFullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
    // Delay to allow CSS reflow
    setTimeout(resizeSkills, 50);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sWrapper && sWrapper.classList.contains('skills-fullscreen')) {
        toggleSkillsFullscreen();
    }
});

function initSkillsNetwork() {
    if (!pData) return;

    // Parse JSON into flat nodes and links
    ciscoNodes = [];
    ciscoLinks = [];

    // Hub
    const hub = { id: 'hub', label: pData.skills.hub, type: 'hub', x: sCanvas.width / 2, y: sCanvas.height / 2, expanded: true, visible: true, size: 30, dataRef: pData.skills };
    ciscoNodes.push(hub);

    // Distribute Routers in circle
    const numRouters = pData.skills.routers.length;
    pData.skills.routers.forEach((r, i) => {
        const angle = (i / numRouters) * Math.PI * 2;
        const dist = 140;
        const routerNode = {
            id: r.id, label: r.name, type: 'router', parentId: 'hub',
            x: hub.x + Math.cos(angle) * dist, y: hub.y + Math.sin(angle) * dist,
            tx: hub.x + Math.cos(angle) * dist, ty: hub.y + Math.sin(angle) * dist,
            expanded: false, visible: true, size: 25,
            dataRef: r // Link to raw JSON for nested reading
        };
        ciscoNodes.push(routerNode);
        ciscoLinks.push({ source: 'hub', target: r.id, packets: [] });
    });

    drawTopology();
}

function expandNode(node) {
    node.expanded = !node.expanded;

    if (node.expanded) {
        if (node.type === 'hub') {
            // Generate Routers
            const numRouters = pData.skills.routers.length;
            pData.skills.routers.forEach((r, i) => {
                const angle = (i / numRouters) * Math.PI * 2;
                const dist = 140;
                const routerNode = {
                    id: r.id, label: r.name, type: 'router', parentId: node.id,
                    x: node.x, y: node.y, // animate from hub
                    tx: node.x + Math.cos(angle) * dist, ty: node.y + Math.sin(angle) * dist,
                    expanded: false, visible: true, size: 25,
                    dataRef: r
                };
                ciscoNodes.push(routerNode);
                ciscoLinks.push({ source: node.id, target: r.id, packets: [] });
            });
        }
        else if (node.type === 'router') {
            // Generate Switches
            const numSwitches = node.dataRef.switches.length;
            node.dataRef.switches.forEach((s, i) => {
                // Determine direction vector from hub to router out
                const dx = node.x - (sCanvas.width / 2);
                const dy = node.y - (sCanvas.height / 2);
                const baseAngle = Math.atan2(dy, dx);

                // Spread children outward
                const spread = Math.PI / 1.5;
                const angle = numSwitches === 1 ? baseAngle : baseAngle - spread / 2 + (spread / (numSwitches - 1)) * i;
                const dist = 120;

                const sNode = {
                    id: s.id, label: s.name, type: 'switch', parentId: node.id,
                    x: node.x, y: node.y, // animate from parent
                    tx: node.x + Math.cos(angle) * dist, ty: node.y + Math.sin(angle) * dist,
                    expanded: false, visible: true, size: 20,
                    dataRef: s
                };
                ciscoNodes.push(sNode);
                ciscoLinks.push({ source: node.id, target: s.id, packets: [] });
            });
        }
        else if (node.type === 'switch') {
            // Generate Computers
            const numTools = node.dataRef.tools.length;
            node.dataRef.tools.forEach((t, i) => {
                // Find parent router to extend outward direction
                const pNode = ciscoNodes.find(n => n.id === node.parentId);
                const dx = node.x - (pNode ? pNode.x : sCanvas.width / 2);
                const dy = node.y - (pNode ? pNode.y : sCanvas.height / 2);
                const baseAngle = Math.atan2(dy, dx);

                const spread = Math.PI / 2;
                const angle = numTools === 1 ? baseAngle : baseAngle - spread / 2 + (spread / (numTools - 1)) * i;
                const dist = 90;

                const cIndex = `comp_${node.id}_${i}`;
                const cNode = {
                    id: cIndex, label: t, type: 'computer', parentId: node.id,
                    x: node.x, y: node.y,
                    tx: node.x + Math.cos(angle) * dist, ty: node.y + Math.sin(angle) * dist,
                    expanded: false, visible: true, size: 15
                };
                ciscoNodes.push(cNode);
                ciscoLinks.push({ source: node.id, target: cIndex, packets: [] });
            });
        }
    } else {
        // Collapse recursively
        const idsToRemove = getDescendants(node.id);
        ciscoNodes = ciscoNodes.filter(n => !idsToRemove.includes(n.id));
        ciscoLinks = ciscoLinks.filter(l => !idsToRemove.includes(l.source) && !idsToRemove.includes(l.target));
    }
}

function getDescendants(id) {
    let arr = [];
    const children = ciscoNodes.filter(n => n.parentId === id);
    children.forEach(c => {
        arr.push(c.id);
        arr = arr.concat(getDescendants(c.id));
    });
    return arr;
}

function drawTopology() {
    if (!layoutPhysicsRunning) return;
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);

    // Draw the Cisco Packet Tracer Grid Background
    drawGrid();

    // Physics easing for nodes
    ciscoNodes.forEach(n => {
        if (n.tx !== undefined && !n.isDragging) n.x += (n.tx - n.x) * 0.1;
        if (n.ty !== undefined && !n.isDragging) n.y += (n.ty - n.y) * 0.1;
    });

    const themeHighlight = getComputedStyle(document.body).getPropertyValue('--accent-color').trim();

    // Draw edges
    sCtx.lineWidth = 2;
    // Darker cable color since typical packet tracer is solid black
    sCtx.strokeStyle = document.body.getAttribute('data-theme') === 'light' ? '#333' : '#666';

    ciscoLinks.forEach(link => {
        const source = ciscoNodes.find(n => n.id === link.source);
        const target = ciscoNodes.find(n => n.id === link.target);
        if (source && target) {
            // Draw Straight Cable
            sCtx.beginPath();
            sCtx.moveTo(source.x, source.y);
            sCtx.lineTo(target.x, target.y);
            sCtx.stroke();

            // Draw Link Lights (Green Triangles for active connection)
            const angle = Math.atan2(target.y - source.y, target.x - source.x);
            sCtx.fillStyle = '#27c93f';

            // Generate dummy packet occasionally
            if (Math.random() < 0.015) link.packets.push(0);

            // Draw moving packets along cable
            sCtx.fillStyle = themeHighlight;
            for (let i = link.packets.length - 1; i >= 0; i--) {
                link.packets[i] += 0.015;
                if (link.packets[i] > 1) {
                    link.packets.splice(i, 1);
                } else {
                    const px = source.x + (target.x - source.x) * link.packets[i];
                    const py = source.y + (target.y - source.y) * link.packets[i];
                    sCtx.beginPath();
                    sCtx.arc(px, py, 3, 0, Math.PI * 2);
                    sCtx.fill();
                    sCtx.shadowBlur = 5;
                    sCtx.shadowColor = themeHighlight;
                    sCtx.fill();
                    sCtx.shadowBlur = 0;
                }
            }
        }
    });

    // Draw nodes
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';

    ciscoNodes.forEach(node => {
        // Draw Cisco SVG Image instead of font-icons or generic circles
        const img = ciscoImages[node.type];
        const iconSize = node.size * 2.5; // Scale up the SVG to fit node boundaries

        if (img && img.complete) {
            // Draw SVG centered on x,y
            sCtx.drawImage(img, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
        } else {
            // Fallback while loading
            sCtx.beginPath();
            sCtx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            sCtx.fillStyle = '#333';
            sCtx.fill();
        }

        // Expansion hint for expandable nodes
        if ((node.type === 'router' || node.type === 'switch') && !node.expanded) {
            sCtx.beginPath();
            sCtx.arc(node.x + iconSize / 2 - 5, node.y - iconSize / 2 + 5, 5, 0, Math.PI * 2);
            sCtx.fillStyle = '#ff3366';
            sCtx.fill();
            sCtx.shadowBlur = 4;
            sCtx.shadowColor = '#ff3366';
            sCtx.fill();
            sCtx.shadowBlur = 0;
        }

        // Label persistent below the node Cisco Packet Tracer style
        sCtx.font = "12px 'Inter', sans-serif";
        sCtx.fillStyle = document.body.getAttribute('data-theme') === 'light' ? '#333' : '#ccc';
        sCtx.fillText(node.label, node.x, node.y + iconSize / 2 + 15);
    });

    requestAnimationFrame(drawTopology);
}

// Skills interactivity mapping
let clickTarget = null;
let dragTarget = null;
let isDragMoved = false;

const skCard = document.getElementById('skills-detail-card');
const skCardTitle = document.getElementById('sk-card-title');
const skCardIcon = document.getElementById('sk-card-icon');
const skCardType = document.getElementById('sk-card-type');
const skCardContent = document.getElementById('sk-card-content');
const skCardClose = document.getElementById('sk-card-close');

if (skCardClose) skCardClose.addEventListener('click', () => {
    skCard.classList.add('hidden');
});

sCanvas.addEventListener('mousedown', (e) => {
    const rect = sCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    clickTarget = null;
    dragTarget = null;
    isDragMoved = false;

    for (let node of ciscoNodes.slice().reverse()) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (dx * dx + dy * dy < (node.size) * (node.size)) {
            clickTarget = node;
            dragTarget = node;
            node.isDragging = true;
            break;
        }
    }
});

window.addEventListener('mouseup', () => {
    if (dragTarget) {
        dragTarget.isDragging = false;
        dragTarget = null;
        sCanvas.style.cursor = 'default';
    }
});

sCanvas.addEventListener('mousemove', (e) => {
    const rect = sCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragTarget) {
        isDragMoved = true;
        dragTarget.tx = mx;
        dragTarget.ty = my;
        dragTarget.x = mx;
        dragTarget.y = my;
        sCanvas.style.cursor = 'grabbing';
        sTooltip.classList.add('hidden');
        return;
    }

    let hovered = null;
    for (let node of ciscoNodes.slice().reverse()) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (dx * dx + dy * dy < (node.size) * (node.size)) {
            hovered = node;
            break;
        }
    }

    if (hovered) {
        sCanvas.style.cursor = 'pointer';
        sTooltip.textContent = hovered.label + (hovered.type !== 'computer' ? (hovered.expanded ? ' (Click to collapse)' : ' (Click to expand)') : '');
        sTooltip.style.left = (hovered.x + 20) + 'px';
        sTooltip.style.top = (hovered.y + 20) + 'px';
        sTooltip.classList.remove('hidden');
        clickTarget = hovered;
    } else {
        sCanvas.style.cursor = 'default';
        sTooltip.classList.add('hidden');
        clickTarget = null;
    }
});

sCanvas.addEventListener('mouseleave', () => sTooltip.classList.add('hidden'));

sCanvas.addEventListener('click', () => {
    if (isDragMoved) return; // Prevent expanding/opening cards if the user was just dragging the node

    if (clickTarget) {
        if (clickTarget.type !== 'computer') {
            expandNode(clickTarget);
        }
        showSkillCard(clickTarget);
        sTooltip.classList.add('hidden');
    } else {
        skCard.classList.add('hidden');
    }
});

function showSkillCard(node) {
    if (!node) return;
    skCardTitle.textContent = node.label;
    skCardType.textContent = `Type: ${node.type}`;

    skCardIcon.className = 'fa-solid';
    if (node.type === 'hub') skCardIcon.classList.add('fa-cloud');
    else if (node.type === 'router') skCardIcon.classList.add('fa-server');
    else if (node.type === 'switch') skCardIcon.classList.add('fa-connectdevelop');
    else if (node.type === 'computer') skCardIcon.classList.add('fa-desktop');

    let contentHtml = '';
    const customDesc = (node.dataRef && node.dataRef.description) ? 
        `<p class="sk-custom-desc" style="margin-top:0.8rem; padding:0.5rem; background:rgba(0,0,0,0.2); border-left:3px solid var(--accent-color); font-style:italic; color:#ddd;">${node.dataRef.description}</p>` : '';

    if (node.type === 'hub') {
        contentHtml = `<p>Central Network Hub. Acts as the overarching infrastructure.</p>
                       ${customDesc}
                       <p style="margin-top:0.8rem;">Contains <strong>${pData.skills.routers.length}</strong> top-level domains.</p>`;
    } else if (node.type === 'router') {
        contentHtml = `<p><strong>Domain Level</strong></p>
                       <p>High-level cluster of related cybersecurity and IT disciplines.</p>
                       ${customDesc}
                       <p style="margin-top:1rem;"><strong>Nested Skills:</strong></p>
                       <ul class="sk-list">` + node.dataRef.switches.map(s => `<li>${s.name}</li>`).join('') + `</ul>`;
    } else if (node.type === 'switch') {
        contentHtml = `<p><strong>Skill Module</strong></p>
                       <p>Specific expertise capabilities and tools used in field operations.</p>
                       ${customDesc}
                       <p style="margin-top:1rem;"><strong>Tools & Technologies:</strong></p>
                       <ul class="sk-list">` + node.dataRef.tools.map(t => `<li>${t}</li>`).join('') + `</ul>`;
    } else if (node.type === 'computer') {
        const parentSwitch = ciscoNodes.find(n => n.id === node.parentId);
        const skillName = parentSwitch ? parentSwitch.label : 'Unknown Skill';
        contentHtml = `<p><strong>Terminal Endpoint (Tool)</strong></p>
                       <p>Active utility deployed for the <span class="highlight">${skillName}</span> operational domain.</p>
                       ${customDesc}`;
    }

    skCardContent.innerHTML = contentHtml;
    skCard.classList.remove('hidden');
}


// ======= CERTIFICATIONS CAROUSEL & MODAL =======
const track = document.getElementById('cert-track');
const btnLeft = document.getElementById('carousel-left');
const btnRight = document.getElementById('carousel-right');

function renderCertifications() {
    track.innerHTML = '';

    const dupes = [...pData.certifications, ...pData.certifications];

    dupes.forEach((c, idx) => {
        const cHTML = `
            <div class="cert-card" data-title="${c.title}" data-issuer="${c.issuer}" data-desc="${c.description}" data-link="${c.link || ''}" data-image="${c.image || ''}">
                 <img class="cert-image" src="${c.image}" alt="${c.title}" style="max-width: 100%; height: auto; object-fit: contain;">
                <h4>${c.title}</h4>
                <p>${c.issuer}</p>
            </div>
        `;
        track.innerHTML += cHTML;
    });

    const cards = document.querySelectorAll('.cert-card');
    cards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });
}

let manualOverrideActive = false;
let certIndex = 0;

function jumpManualSlide(direction) {
    if (!manualOverrideActive) {
        track.classList.add('manual-mode');
        manualOverrideActive = true;
    }

    const maxIndex = pData.certifications.length - 1;
    if (direction === 'right' && certIndex < maxIndex) certIndex++;
    if (direction === 'left' && certIndex > 0) certIndex--;

    const cardWidth = 300;
    const gap = 32;
    track.style.transform = `translateX(-${certIndex * (cardWidth + gap)}px)`;
}

btnRight.addEventListener('click', () => jumpManualSlide('right'));
btnLeft.addEventListener('click', () => jumpManualSlide('left'));

// Modal
const modal = document.getElementById('cert-modal');
const closeModal = document.querySelector('.close-modal');
const modalTitle = document.getElementById('modal-title');
const modalIssuer = document.getElementById('modal-issuer');
const modalDesc = document.getElementById('modal-desc');
const modalLink = document.getElementById('modal-verify-btn');

function openModal(card) {
    modalTitle.textContent = card.getAttribute('data-title');
    modalIssuer.textContent = card.getAttribute('data-issuer');
    modalDesc.textContent = card.getAttribute('data-desc');

    const image = card.getAttribute('data-image');
    const modalImg = document.getElementById('modal-img');
    if (image && image !== "null" && image !== "") {
        modalImg.src = image;
        modalImg.style.display = 'block';
    } else {
        modalImg.src = '';
        modalImg.style.display = 'none';
    }

    const link = card.getAttribute('data-link');
    if (link && link !== "null" && link !== "") {
        modalLink.href = link;
        modalLink.style.display = 'inline-block';
    } else {
        modalLink.style.display = 'none';
    }

    modal.classList.add('show');
}

closeModal.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
});

// ======= GITHUB GRAPH DUMMY =======
// Dummy trace removed as element no longer exists.


// ======= CONTACT FORM =======
// Formspree handles form submissions natively via the HTML action attribute.
