export class ResumeApp {
    constructor() {
        this.container = null;
    }
    
    init(containerEl) {
        this.container = containerEl;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background: #2b2b2b; font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden;">
                <!-- Title Bar -->
                <div style="background: #e3e3e3; padding: 6px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #c8c8c8;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="background: #ed1c24; color: white; border-radius: 0; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: serif;">A</div>
                        <span style="color: #333; font-size: 12px; pointer-events: none;">shivam_sharma_resume.pdf - Adobe Acrobat Reader</span>
                    </div>
                </div>
                
                <!-- Menu Bar -->
                <div style="background: #fdfdfd; padding: 4px 15px; border-bottom: 1px solid #d3d3d3; display: flex; gap: 15px; font-size: 12px; color: #333; user-select: none;">
                    <span style="cursor: pointer;">File</span>
                    <span style="cursor: pointer;">Edit</span>
                    <span style="cursor: pointer;">View</span>
                    <span style="cursor: pointer;">Window</span>
                    <span style="cursor: pointer;">Help</span>
                </div>
                
                <!-- Toolbar -->
                <div style="background: #f0f0f0; padding: 8px 15px; border-bottom: 1px solid #d3d3d3; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 2;">
                    <div style="display: flex; gap: 15px; color: #555; font-size: 14px; align-items: center;">
                        <span style="cursor: pointer;" title="Save (Ctrl+S)">💾</span>
                        <span style="cursor: pointer;" title="Print (Ctrl+P)">🖨️</span>
                        <div style="width: 1px; height: 20px; background: #ccc;"></div>
                        <span style="cursor: pointer;" title="Previous Page">◀</span>
                        <span style="font-size: 12px;">1 / 1</span>
                        <span style="cursor: pointer;" title="Next Page">▶</span>
                        <div style="width: 1px; height: 20px; background: #ccc;"></div>
                        <span style="cursor: pointer;" title="Zoom Out">➖</span>
                        <span style="font-size: 12px;">100%</span>
                        <span style="cursor: pointer;" title="Zoom In">➕</span>
                    </div>
                    <div>
                        <a href="assets/resume.pdf" download="Shivam_Sharma_Resume.pdf" style="background: #0060aa; color: white; border: none; padding: 6px 14px; border-radius: 2px; font-size: 12px; font-weight: 500; text-decoration: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.2); display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s;" onmouseover="this.style.background='#004b87'" onmouseout="this.style.background='#0060aa'">
                            <span style="font-size: 14px;">📥</span> Download PDF
                        </a>
                    </div>
                </div>
                
                <!-- PDF Viewer Area -->
                <div style="flex-grow: 1; background: #525659; display: flex; justify-content: center; overflow: hidden; position: relative;">
                    <!-- Native Browser PDF Embed with hidden toolbars -->
                    <iframe src="assets/resume.pdf#toolbar=0&navpanes=0" style="width: 100%; height: 100%; border: none; flex-grow: 1;" title="Shivam Sharma - Resume"></iframe>
                </div>
            </div>
        `;
    }
    
    destroy() {
        this.container.innerHTML = '';
        this.container = null;
    }
}
