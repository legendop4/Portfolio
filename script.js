document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const isAdmin = window.location.pathname.includes('admin-secure.html') || window.location.pathname.includes('admin.html');
    
    if (isAdmin) {
        initAdmin();
    } else {
        initPortfolio();
    }
});

// --- PORTFOLIO LOGIC ---

async function initPortfolio() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        renderProfile(data.profile);
        renderCodingProfiles(data.codingProfiles);
        renderAbout(data.profile);
        renderSkillCategories(data.skillCategories);
        renderProjects(data.projects);
        renderCertifications(data.certifications);
        renderHackathons(data.hackathons);
        renderContact(data.contact);
        
        setupScrollAnimation();
        setupNavigation();
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

function renderProfile(profile) {
    if(!profile) return;
    document.getElementById('nav-name').textContent = profile.name;
    document.getElementById('nav-title').textContent = profile.title;
    document.getElementById('home-tagline').textContent = profile.tagline;
}

function renderCodingProfiles(profiles) {
    if(!profiles) return;
    const container = document.getElementById('coding-profiles');
    if(!container) return;
    
    container.innerHTML = '';
    profiles.forEach(p => {
        container.innerHTML += `
            <a href="${p.url}" target="_blank" class="profile-badge">
                ${p.icon ? `<img src="${p.icon}" class="badge-icon" alt="${p.platform}">` : ''}
                ${p.platform}
                ${p.rating ? `<span class="badge-rating">${p.rating}</span>` : ''}
            </a>
        `;
    });
}

function renderAbout(profile) {
    if(!profile || !profile.about) return;
    const aboutContent = document.getElementById('about-content');
    if(aboutContent) {
        aboutContent.innerHTML = `<p>${profile.about.replace(/\n/g, '</p><p>')}</p>`;
    }
}

function renderSkillCategories(categories) {
    if(!categories) return;
    const grid = document.getElementById('skill-categories-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-card';
        item.innerHTML = `
            <h3 class="category-title">${cat.name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${cat.skills ? cat.skills.length : 0} Skills</span>
        `;
        
        item.addEventListener('click', () => {
            openSkillsModal(cat);
        });
        
        grid.appendChild(item);
    });
    
    // Modal Close Logic
    const modal = document.getElementById('skills-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    if(closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; }
    }
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function openSkillsModal(category) {
    const modal = document.getElementById('skills-modal');
    const title = document.getElementById('modal-category-title');
    const grid = document.getElementById('modal-skills-grid');
    
    if(!modal || !title || !grid) return;
    
    title.textContent = category.name;
    grid.innerHTML = '';
    
    if(category.skills) {
        category.skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            
            let toolsHtml = '';
            if(skill.tools && skill.tools.length > 0) {
                toolsHtml = '<div class="skill-tools-container">';
                skill.tools.forEach(tool => {
                    const logoHtml = tool.logo ? `<img src="${tool.logo}" class="tool-tag-logo">` : `<i class="fas fa-hammer"></i>`;
                    toolsHtml += `<span class="tool-tag">${logoHtml} ${tool.name}</span>`;
                });
                toolsHtml += '</div>';
            }
            
            card.innerHTML = `
                <div class="skill-card-header">
                    <span class="skill-card-title">${skill.name}</span>
                    ${skill.tools && skill.tools.length > 0 ? '<i class="fas fa-chevron-down" style="color: var(--text-secondary); font-size: 0.8rem;"></i>' : ''}
                </div>
                ${toolsHtml}
            `;
            
            if(skill.tools && skill.tools.length > 0) {
                card.addEventListener('click', () => {
                    const toolsContainer = card.querySelector('.skill-tools-container');
                    const icon = card.querySelector('.fa-chevron-down, .fa-chevron-up');
                    
                    if(toolsContainer.classList.contains('active')) {
                        toolsContainer.classList.remove('active');
                        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                    } else {
                        toolsContainer.classList.add('active');
                        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                    }
                });
            }
            
            grid.appendChild(card);
        });
    }
    
    modal.style.display = 'flex';
}

function renderProjects(projects) {
    if(!projects) return;
    const projectsGrid = document.getElementById('projects-grid');
    if(!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-card';
        item.innerHTML = `
            <div class="project-img-container">
                <img src="${project.image || 'https://via.placeholder.com/800x400?text=No+Image'}" alt="${project.title}" class="project-img">
                <div class="project-img-overlay"></div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tech">${project.techStack}</div>
                <p class="project-desc">${project.description}</p>
                <div class="project-links">
                    <a href="${project.githubLink}" target="_blank" class="btn primary btn-small"><i class="fab fa-github"></i> GitHub</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(item);
    });
}

function renderCertifications(certs) {
    if(!certs) return;
    const certsGrid = document.getElementById('certs-grid');
    if(!certsGrid) return;
    
    certsGrid.innerHTML = '';
    certs.forEach(cert => {
        const item = document.createElement('div');
        item.className = 'cert-card';
        
        const imageHtml = cert.image ? `<img src="${cert.image}" class="cert-image" alt="${cert.title}">` : '';
        
        item.innerHTML = `
            ${imageHtml}
            <h3 class="cert-title">${cert.title}</h3>
            <div class="cert-org">${cert.organization}</div>
            <p class="cert-desc">${cert.description}</p>
        `;
        certsGrid.appendChild(item);
    });
}

function renderHackathons(hackathons) {
    if(!hackathons) return;
    const timeline = document.getElementById('hackathons-timeline');
    if(!timeline) return;
    
    timeline.innerHTML = '';
    hackathons.forEach(hack => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-date">${hack.year}</div>
            <div class="timeline-content">
                <h3 class="timeline-title">${hack.name}</h3>
                <p class="timeline-desc">${hack.description}</p>
            </div>
        `;
        timeline.appendChild(item);
    });
}

function renderContact(contact) {
    if(!contact) return;
    
    // Socials on home
    const homeSocial = document.getElementById('home-social');
    if(homeSocial) {
        homeSocial.innerHTML = '';
        if(contact.github) homeSocial.innerHTML += `<a href="${contact.github}" target="_blank"><i class="fab fa-github"></i></a>`;
        if(contact.linkedin) homeSocial.innerHTML += `<a href="${contact.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>`;
        if(contact.twitter) homeSocial.innerHTML += `<a href="${contact.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>`;
        if(contact.email) homeSocial.innerHTML += `<a href="mailto:${contact.email}"><i class="fas fa-envelope"></i></a>`;
    }
    
    // Contact Info section
    const contactInfo = document.getElementById('contact-info');
    if(contactInfo) {
        contactInfo.innerHTML = '';
        if(contact.email) contactInfo.innerHTML += `<p><i class="fas fa-envelope"></i> ${contact.email}</p>`;
        if(contact.github) contactInfo.innerHTML += `<p><i class="fab fa-github"></i> <a href="${contact.github}" target="_blank">GitHub Profile</a></p>`;
        if(contact.linkedin) contactInfo.innerHTML += `<p><i class="fab fa-linkedin"></i> <a href="${contact.linkedin}" target="_blank">LinkedIn Profile</a></p>`;
    }
}

// Intersect Observer for scroll animations
function setupScrollAnimation() {
    const sections = document.querySelectorAll('section');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => observer.observe(sec));
}

// Setup sidebar navigation highlighting
function setupNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// --- ADMIN LOGIC ---

let currentData = {};

async function initAdmin() {
    // Check Auth
    const loginOverlay = document.getElementById('login-overlay');
    const adminApp = document.getElementById('admin-app');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');

    loginBtn.addEventListener('click', () => {
        if(passwordInput.value === 'admin123') {
            loginOverlay.style.display = 'none';
            adminApp.style.opacity = '1';
            adminApp.style.pointerEvents = 'all';
            loadAdminData();
        } else {
            loginError.style.display = 'block';
            passwordInput.value = '';
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
}

async function loadAdminData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        currentData = await response.json();
        
        // Setup initial UI data
        setupProfileForm(currentData.profile);
        setupContactForm(currentData.contact);
        renderAdminCodingProfiles(currentData.codingProfiles);
        renderAdminCategories(currentData.skillCategories);
        renderAdminProjects(currentData.projects);
        renderAdminCerts(currentData.certifications);
        renderAdminHackathons(currentData.hackathons);
        
        // Setup Event Listeners
        document.getElementById('save-all-btn').addEventListener('click', saveAllData);
        setupAdminNavigation();
        
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

// Generate unique ID
function generateId(prefix) {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
}

function setupProfileForm(profile) {
    if(!profile) return;
    document.getElementById('edit-name').value = profile.name || '';
    document.getElementById('edit-title').value = profile.title || '';
    document.getElementById('edit-tagline').value = profile.tagline || '';
    document.getElementById('edit-about').value = profile.about || '';
}

function setupContactForm(contact) {
    if(!contact) return;
    document.getElementById('edit-email').value = contact.email || '';
    document.getElementById('edit-github').value = contact.github || '';
    document.getElementById('edit-linkedin').value = contact.linkedin || '';
    document.getElementById('edit-twitter').value = contact.twitter || '';
}

function renderAdminCodingProfiles(profiles) {
    const list = document.getElementById('coding-list');
    list.innerHTML = '';
    (profiles || []).forEach(p => {
        list.appendChild(createCodingProfileItem(p));
    });
}

function createCodingProfileItem(p) {
    const div = document.createElement('div');
    div.className = 'admin-list-item coding-admin-item';
    div.dataset.id = p.id || generateId('cp');
    div.style.flexDirection = 'column';
    div.style.gap = '10px';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; width:100%;">
            <input type="text" class="admin-input item-platform" value="${p.platform || ''}" placeholder="Platform (e.g., LeetCode)" style="flex:1;">
            <button class="btn btn-small btn-danger" style="margin-left:10px;" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
        </div>
        <div style="display:flex; gap:10px; width:100%;">
            <input type="text" class="admin-input item-rating" value="${p.rating || ''}" placeholder="Rating (optional)" style="flex:1;">
            <input type="text" class="admin-input item-url" value="${p.url || ''}" placeholder="URL" style="flex:2;">
        </div>
        <input type="text" class="admin-input item-icon" value="${p.icon || ''}" placeholder="Icon path (e.g., assets/icons/leetcode.svg)">
    `;
    return div;
}

function addCodingProfile() {
    document.getElementById('coding-list').appendChild(createCodingProfileItem({}));
}
// --- SKILL CATEGORIES MANAGER (V3) ---
function renderAdminCategories(categories) {
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    categories.forEach((cat, index) => {
        list.appendChild(createCategoryItem(cat, index));
    });
}

function createCategoryItem(cat = {name: '', skills: []}, index = Date.now()) {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.dataset.index = index;
    
    // Build Skills HTML
    let skillsHtml = '';
    if(cat.skills) {
        cat.skills.forEach((skill, sIdx) => {
            skillsHtml += createNestedSkillHtml(skill, sIdx);
        });
    }

    div.innerHTML = `
        <div class="form-group">
            <label>Category Name</label>
            <input type="text" class="admin-input cat-name" value="${cat.name}" placeholder="e.g. Cybersecurity">
        </div>
        
        <div class="nested-skills-container" style="margin-top: 1rem; padding-left: 1rem; border-left: 2px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="color: var(--text-secondary); font-family: var(--font-mono);">Included Skills</h4>
                <button type="button" class="btn btn-small btn-add-nested-skill" onclick="addNestedSkill(this)"><i class="fas fa-plus"></i> Add Skill</button>
            </div>
            <div class="nested-skills-list">
                ${skillsHtml}
            </div>
        </div>
        
        <button type="button" class="btn btn-small danger" style="margin-top: 1rem;" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i> Remove Category</button>
    `;
    return div;
}

function addCategory() {
    document.getElementById('categories-list').appendChild(createCategoryItem());
}

function createNestedSkillHtml(skill = {name: '', tools: []}, sIdx = Date.now()) {
    let toolsHtml = '';
    if(skill.tools) {
        skill.tools.forEach((tool, tIdx) => {
            toolsHtml += createNestedToolHtml(tool, tIdx);
        });
    }

    return `
        <div class="nested-skill-item" style="background: rgba(0,255,42,0.05); border: 1px solid var(--border-color); padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
            <div style="display: flex; gap: 10px; align-items: flex-end;">
                <div class="form-group" style="flex-grow: 1; margin-bottom: 0;">
                    <label style="font-size: 0.8rem;">Skill Name</label>
                    <input type="text" class="admin-input nested-skill-name" value="${skill.name}">
                </div>
                <button type="button" class="btn btn-small danger" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
            
            <div class="nested-tools-container" style="margin-top: 1rem;">
                <label style="font-size: 0.8rem; color: var(--text-secondary);">Associated Tools</label>
                <div class="nested-tools-list" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                    ${toolsHtml}
                </div>
                <button type="button" class="btn btn-small" style="font-size: 0.7rem; padding: 0.3rem 0.6rem; margin-top: 0.5rem;" onclick="addNestedTool(this)"><i class="fas fa-plus"></i> Add Tool</button>
            </div>
        </div>
    `;
}

function addNestedSkill(btn) {
    const list = btn.parentElement.nextElementSibling; // .nested-skills-list
    list.insertAdjacentHTML('beforeend', createNestedSkillHtml());
}

function createNestedToolHtml(tool = {name: '', logo: ''}, tIdx = Date.now()) {
    return `
        <div class="nested-tool-item" style="display: flex; align-items: center; gap: 5px; background: var(--bg-color); border: 1px solid var(--border-color); padding: 0.2rem 0.5rem; border-radius: 20px;">
            <input type="text" class="admin-input nested-tool-name" value="${tool.name}" placeholder="Tool Name" style="padding: 0.2rem; min-height: auto; font-size: 0.8rem; width: 100px; border: none; background: transparent;">
            <input type="text" class="admin-input nested-tool-logo" value="${tool.logo || ''}" placeholder="Logo URL (opt)" style="padding: 0.2rem; min-height: auto; font-size: 0.8rem; width: 100px; border: none; background: transparent; border-left: 1px solid var(--border-color);">
            <button type="button" style="background: none; border: none; color: #ff3333; cursor: pointer;" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        </div>
    `;
}

function addNestedTool(btn) {
    const list = btn.previousElementSibling; // .nested-tools-list
    list.insertAdjacentHTML('beforeend', createNestedToolHtml());
}

function renderAdminProjects(projects) {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    (projects || []).forEach(proj => {
        list.appendChild(createProjectItem(proj));
    });
}

function createProjectItem(proj) {
    const div = document.createElement('div');
    div.className = 'admin-list-item project-admin-item';
    div.dataset.id = proj.id || generateId('p');
    div.style.flexDirection = 'column';
    div.style.gap = '10px';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; width:100%;">
            <input type="text" class="admin-input item-title" value="${proj.title || ''}" placeholder="Project Title" style="flex:1;">
            <button class="btn btn-small btn-danger" style="margin-left:10px;" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
        </div>
        <input type="text" class="admin-input item-tech" value="${proj.techStack || ''}" placeholder="Tech Stack">
        <textarea class="admin-input item-desc" placeholder="Description" rows="2">${proj.description || ''}</textarea>
        <div style="display:flex; gap:10px; width:100%;">
            <input type="text" class="admin-input item-img" value="${proj.image || ''}" placeholder="Image URL (optional)" style="flex:1;">
            <input type="text" class="admin-input item-github" value="${proj.githubLink || ''}" placeholder="GitHub URL" style="flex:1;">
        </div>
    `;
    return div;
}

function addProject() {
    document.getElementById('projects-list').appendChild(createProjectItem({}));
}

function renderAdminCerts(certs) {
    const list = document.getElementById('certs-list');
    list.innerHTML = '';
    (certs || []).forEach(cert => {
        list.appendChild(createCertItem(cert));
    });
}

function createCertItem(cert) {
    const div = document.createElement('div');
    div.className = 'admin-list-item cert-admin-item';
    div.dataset.id = cert.id || generateId('c');
    div.style.flexDirection = 'column';
    div.style.gap = '10px';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; width:100%;">
            <input type="text" class="admin-input item-title" value="${cert.title || ''}" placeholder="Cert Title" style="flex:1;">
            <button class="btn btn-small btn-danger" style="margin-left:10px;" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
        </div>
        <div style="display:flex; gap:10px; width:100%;">
            <input type="text" class="admin-input item-org" value="${cert.organization || ''}" placeholder="Organization" style="flex:1;">
            <input type="text" class="admin-input item-img" value="${cert.image || ''}" placeholder="Image path (e.g., assets/certificates/ccna.png)" style="flex:1;">
        </div>
        <textarea class="admin-input item-desc" placeholder="Description" rows="2">${cert.description || ''}</textarea>
    `;
    return div;
}

function addCert() {
    document.getElementById('certs-list').appendChild(createCertItem({}));
}

function renderAdminHackathons(hacks) {
    const list = document.getElementById('hackathons-list');
    list.innerHTML = '';
    (hacks || []).forEach(hack => {
        list.appendChild(createHackItem(hack));
    });
}

function createHackItem(hack) {
    const div = document.createElement('div');
    div.className = 'admin-list-item hack-admin-item';
    div.dataset.id = hack.id || generateId('h');
    div.style.flexDirection = 'column';
    div.style.gap = '10px';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; width:100%;">
            <input type="text" class="admin-input item-name" value="${hack.name || ''}" placeholder="Hackathon Name" style="flex:1;">
            <button class="btn btn-small btn-danger" style="margin-left:10px;" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
        </div>
        <input type="text" class="admin-input item-year" value="${hack.year || ''}" placeholder="Year">
        <textarea class="admin-input item-desc" placeholder="Description" rows="2">${hack.description || ''}</textarea>
    `;
    return div;
}

function addHackathon() {
    document.getElementById('hackathons-list').appendChild(createHackItem({}));
}

async function saveAllData() {
    // Collect Profile
    const profile = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        tagline: document.getElementById('edit-tagline').value,
        about: document.getElementById('edit-about').value
    };
    
    // Collect Contact
    const contact = {
        email: document.getElementById('edit-email').value,
        github: document.getElementById('edit-github').value,
        linkedin: document.getElementById('edit-linkedin').value,
        twitter: document.getElementById('edit-twitter').value
    };
    
    // Collect Coding Profiles
    const codingProfiles = [];
    document.querySelectorAll('.coding-admin-item').forEach(el => {
        codingProfiles.push({
            id: el.dataset.id,
            platform: el.querySelector('.item-platform').value,
            rating: el.querySelector('.item-rating').value,
            url: el.querySelector('.item-url').value,
            icon: el.querySelector('.item-icon').value
        });
    });
    
    const skillCategories = [];
    document.querySelectorAll('#categories-list .admin-list-item').forEach((catItem, cIdx) => {
        const cat = {
            id: 'sc_' + Date.now() + cIdx,
            name: catItem.querySelector('.cat-name').value,
            skills: []
        };
        
        catItem.querySelectorAll('.nested-skill-item').forEach((skillItem, sIdx) => {
            const skill = {
                id: 'sk_' + Date.now() + cIdx + sIdx,
                name: skillItem.querySelector('.nested-skill-name').value,
                tools: []
            };
            
            skillItem.querySelectorAll('.nested-tool-item').forEach((toolItem) => {
                const toolName = toolItem.querySelector('.nested-tool-name').value;
                if(toolName) {
                    skill.tools.push({
                        name: toolName,
                        logo: toolItem.querySelector('.nested-tool-logo').value || ""
                    });
                }
            });
            
            if(skill.name) cat.skills.push(skill);
        });
        
        if(cat.name) skillCategories.push(cat);
    });

    // Collect Projects
    const projects = [];
    document.querySelectorAll('.project-admin-item').forEach(el => {
        projects.push({
            id: el.dataset.id,
            title: el.querySelector('.item-title').value,
            techStack: el.querySelector('.item-tech').value,
            description: el.querySelector('.item-desc').value,
            githubLink: el.querySelector('.item-github').value,
            image: el.querySelector('.item-img').value
        });
    });
    
    // Collect Certs
    const certifications = [];
    document.querySelectorAll('.cert-admin-item').forEach(el => {
        certifications.push({
            id: el.dataset.id,
            title: el.querySelector('.item-title').value,
            organization: el.querySelector('.item-org').value,
            image: el.querySelector('.item-img').value,
            description: el.querySelector('.item-desc').value
        });
    });
    
    // Collect Hackathons
    const hackathons = [];
    document.querySelectorAll('.hack-admin-item').forEach(el => {
        hackathons.push({
            id: el.dataset.id,
            name: el.querySelector('.item-name').value,
            year: el.querySelector('.item-year').value,
            description: el.querySelector('.item-desc').value
        });
    });
    
    // Construct final payload
    const payload = {
        profile,
        contact,
        codingProfiles,
        skillCategories,
        projects,
        certifications,
        hackathons
    };
    
    // Save to API
    const btn = document.getElementById('save-all-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('Failed to save');
        
        showNotification();
    } catch(err) {
        alert('Transmission Failed: ' + err.message);
    } finally {
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> SAVE ALL';
        }, 500);
    }
}

function showNotification() {
    const notif = document.getElementById('save-notification');
    if(!notif) return;
    notif.classList.add('show');
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

function setupAdminNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.admin-section');
    
    // On admin dashboard, we could hide/show sections or just scroll
    // Let's implement smooth scrolling and active state manually
    navLinks.forEach(link => {
        if(link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const targetId = link.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if(targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}
