export class StateManager {
    constructor() {
        this.states = {
            BOOT: 'boot',
            LOCK: 'lock',
            DESKTOP: 'desktop'
        };
        this.currentState = null;
        this.screens = {
            boot: document.getElementById('boot-screen'),
            lock: document.getElementById('lock-screen'),
            desktop: document.getElementById('desktop')
        };
    }

    init() {
        this.transitionTo(this.states.BOOT);
    }

    transitionTo(newState) {
        if (this.currentState === newState) return;
        
        // Hide current
        if (this.currentState && this.screens[this.currentState]) {
            this.screens[this.currentState].classList.remove('active');
            this.screens[this.currentState].classList.add('hidden');
        }

        this.currentState = newState;

        // Show new
        if (this.screens[this.currentState]) {
            setTimeout(() => {
                this.screens[this.currentState].classList.remove('hidden');
                this.screens[this.currentState].classList.add('active');
            }, 50); // small delay to ensure DOM updates and transitions trigger
        }
    }
}
