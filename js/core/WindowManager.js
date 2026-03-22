export class WindowManager {
    constructor(desktopEl, taskbarAppsEl) {
        this.desktopEl = desktopEl;
        this.taskbarAppsEl = taskbarAppsEl;
        this.windows = {}; // map of id -> { el, taskbarBtn, isMinimized, isMaximized }
        this.zIndexCounter = 100;
        this.activeWindowId = null;
        
        // Dragging state
        this.isDragging = false;
        this.draggedWindowEl = null;
        this.dragOffset = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        // Add resize listener to constrain windows within viewport
        window.addEventListener('resize', () => {
             // Optional: handle repositioning if windows go offscreen
        });
    }

    openWindow(config) {
        const { id, title, contentHtml, width = 600, height = 400, icon = '', appInstance = null, maximized = false } = config;

        // If window already exists, focus or unminimize it
        if (this.windows[id]) {
            this.restoreWindow(id);
            this.focusWindow(id);
            return;
        }

        // Create Window DOM
        const winEl = document.createElement('div');
        winEl.className = 'os-window';
        winEl.id = `window-${id}`;
        winEl.style.width = `${width}px`;
        winEl.style.height = `${height}px`;
        
        // Center roughly
        const startX = Math.max(50, (window.innerWidth - width) / 2 + (Object.keys(this.windows).length * 20));
        const startY = Math.max(50, (window.innerHeight - height - 40) / 2 + (Object.keys(this.windows).length * 20));
        winEl.style.left = `${startX}px`;
        winEl.style.top = `${startY}px`;
        winEl.style.zIndex = ++this.zIndexCounter;

        winEl.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    ${icon ? `<img src="${icon}" style="width:16px; height:16px;">` : ''}
                    ${title}
                </div>
                <div class="window-controls">
                    <button class="win-btn minimize" data-action="minimize"></button>
                    <button class="win-btn maximize" data-action="maximize"></button>
                    <button class="win-btn close" data-action="close"></button>
                </div>
            </div>
            <div class="window-content" id="content-${id}">
                ${contentHtml || ''}
            </div>
        `;

        this.desktopEl.appendChild(winEl);

        // Taskbar Button
        const taskbarBtn = document.createElement('div');
        taskbarBtn.className = 'taskbar-app active';
        taskbarBtn.innerHTML = `
            ${icon ? `<img src="${icon}" style="width:16px; height:16px;">` : ''}
            <span>${title}</span>
        `;
        taskbarBtn.addEventListener('click', () => this.toggleMinimize(id));
        this.taskbarAppsEl.appendChild(taskbarBtn);

        // Store
        this.windows[id] = {
            el: winEl,
            taskbarBtn: taskbarBtn,
            isMinimized: false,
            isMaximized: maximized,
            appInstance: appInstance
        };

        if (maximized) {
            winEl.classList.add('maximized');
        }

        // Events
        winEl.addEventListener('mousedown', () => this.focusWindow(id));
        
        const header = winEl.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('win-btn')) return;
            this.startDrag(e, winEl);
        });

        // Controls
        winEl.querySelector('.close').addEventListener('click', () => this.closeWindow(id));
        winEl.querySelector('.minimize').addEventListener('click', () => this.toggleMinimize(id));
        winEl.querySelector('.maximize').addEventListener('click', () => this.toggleMaximize(id));

        // Call init on app instance if exists
        if (appInstance && typeof appInstance.init === 'function') {
            appInstance.init(winEl.querySelector(`#content-${id}`));
        }

        // Animate spawn
        requestAnimationFrame(() => {
            winEl.classList.add('spawned');
            this.focusWindow(id);
        });
    }

    focusWindow(id) {
        if (this.activeWindowId === id && !this.windows[id].isMinimized) return;
        
        // Remove active class from old window
        if (this.activeWindowId && this.windows[this.activeWindowId]) {
            this.windows[this.activeWindowId].el.classList.remove('active');
            this.windows[this.activeWindowId].taskbarBtn.classList.remove('active');
        }

        const win = this.windows[id];
        win.el.style.zIndex = ++this.zIndexCounter;
        win.el.classList.add('active');
        win.taskbarBtn.classList.add('active');
        this.activeWindowId = id;
    }

    closeWindow(id) {
        const win = this.windows[id];
        if (!win) return;

        // Animate out
        win.el.style.opacity = '0';
        win.el.style.transform = 'scale(0.95)';
        
        if (win.appInstance && typeof win.appInstance.destroy === 'function') {
            win.appInstance.destroy();
        }

        setTimeout(() => {
            win.el.remove();
            win.taskbarBtn.remove();
            delete this.windows[id];
            
            if (this.activeWindowId === id) {
                this.activeWindowId = null;
                // Focus top-most window
                const remaining = Object.keys(this.windows);
                if (remaining.length > 0) {
                    let highest = remaining[0];
                    for (let w of remaining) {
                        if (parseInt(this.windows[w].el.style.zIndex) > parseInt(this.windows[highest].el.style.zIndex)) {
                            highest = w;
                        }
                    }
                    this.focusWindow(highest);
                }
            }
        }, 200);
    }

    toggleMinimize(id) {
        const win = this.windows[id];
        if (win.isMinimized) {
            this.restoreWindow(id);
            this.focusWindow(id);
        } else {
            if (this.activeWindowId === id) {
                // Minimize active
                win.el.classList.add('minimized');
                win.taskbarBtn.classList.remove('active');
                win.isMinimized = true;
                this.activeWindowId = null;
            } else {
                // Focus inactive unminimized window
                this.focusWindow(id);
            }
        }
    }

    restoreWindow(id) {
        const win = this.windows[id];
        win.el.classList.remove('minimized');
        win.isMinimized = false;
    }

    toggleMaximize(id) {
        const win = this.windows[id];
        if (win.isMaximized) {
            win.el.classList.remove('maximized');
            win.isMaximized = false;
        } else {
            win.el.classList.add('maximized');
            win.isMaximized = true;
        }
    }

    startDrag(e, winEl) {
        // Prevent drag if maximized
        const matchId = winEl.id.replace('window-', '');
        if (this.windows[matchId] && this.windows[matchId].isMaximized) return;

        this.isDragging = true;
        this.draggedWindowEl = winEl;
        
        const rect = winEl.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        // Remove transitions during drag
        winEl.style.transition = 'none';
        
        // Also focus it
        this.focusWindow(matchId);
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.draggedWindowEl) return;
        
        let newX = e.clientX - this.dragOffset.x;
        let newY = e.clientY - this.dragOffset.y;
        
        // Prevent dragging above top edge
        newY = Math.max(0, newY);
        
        this.draggedWindowEl.style.left = `${newX}px`;
        this.draggedWindowEl.style.top = `${newY}px`;
    }

    onMouseUp(e) {
        if (this.isDragging && this.draggedWindowEl) {
            // Restore transitions
            this.draggedWindowEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
            this.isDragging = false;
            this.draggedWindowEl = null;
        }
    }
}
