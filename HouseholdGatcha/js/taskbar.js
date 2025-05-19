class Taskbar {
    constructor() {
        this.domElements = {};
        this.initializeDOMElements();
    }

    initializeDOMElements() {
        const elements = {
            startButton: '.start-button',
            startMenu: '.start-menu',
            taskButtons: '.task-button',
            currentTime: '#current-time',
            adminButton: '#admin-panel',
            newCharacterButton: '#new-character-btn',
            tasksOverlay: '#tasks-overlay',
            closeTasksButton: '#close-tasks-btn',
            openTasksButton: '#open-tasks-btn'
        };

        Object.entries(elements).forEach(([key, selector]) => {
            if (selector.startsWith('#')) {
                this.domElements[key] = document.getElementById(selector.slice(1));
            } else if (selector === '.task-button') {
                this.domElements[key] = document.querySelectorAll(selector);
            } else {
                this.domElements[key] = document.querySelector(selector);
            }
        });
    }

    init(inventory, adminPanel, characterSelect, gachaSystem) {
        Object.assign(this, { inventory, adminPanel, characterSelect, gachaSystem });
        this.setupEventListeners();
        this.startClock();
        
        // Listen for character changes to toggle admin button visibility
        ['characterSelected', 'characterChanged', 'characterUpdated'].forEach(event => {
            window.addEventListener(event, () => this.updateAdminButtonVisibility());
        });
        
        // Initial update
        this.updateAdminButtonVisibility();
    }
    
    updateAdminButtonVisibility() {
        const { adminButton } = this.domElements;
        if (!adminButton) return;
        
        const currentCharacter = window.characterManager?.getCharacter(window.characterManager?.currentCharacter);
        const isKidMode = currentCharacter?.type === 'kid';
        
        // Hide admin button in kid mode
        adminButton.style.display = isKidMode ? 'none' : '';
    }

    setupEventListeners() {
        const { startButton, startMenu, taskButtons, adminButton, newCharacterButton, 
                tasksOverlay, closeTasksButton, openTasksButton } = this.domElements;

        // Start menu functionality
        if (startButton && startMenu) {
            startButton.addEventListener('click', () => startMenu.classList.toggle('active'));
            document.addEventListener('click', e => {
                if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                    startMenu.classList.remove('active');
                }
            });
        }

        // Task buttons functionality
        if (taskButtons?.length) {
            taskButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const target = button.getAttribute('data-target');
                    if (target === 'gacha' && this.gachaSystem?.ui) {
                        this.gachaSystem.ui.displayBanners();
                    } else if (target === 'inventory' && this.inventory) {
                        this.inventory.openInventory();
                    }
                });
            });
        }

        // Tasks window functionality
        if (openTasksButton && tasksOverlay) {
            openTasksButton.addEventListener('click', () => {
                tasksOverlay.classList.add('active');
                if (startMenu) startMenu.classList.remove('active');
            });
        }

        if (closeTasksButton && tasksOverlay) {
            closeTasksButton.addEventListener('click', () => tasksOverlay.classList.remove('active'));
        }

        // Admin panel functionality
        if (adminButton && this.adminPanel) {
            adminButton.addEventListener('click', () => {
                if (startMenu) startMenu.classList.remove('active');
                this.adminPanel.open();
            });
        }

        // New character functionality
        if (newCharacterButton && this.characterSelect) {
            newCharacterButton.addEventListener('click', () => this.characterSelect.showCharacterModal());
        }
    }

    startClock() {
        if (!this.domElements.currentTime) return;

        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            this.domElements.currentTime.textContent = `${hours % 12 || 12}:${minutes} ${ampm}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
}

// Make Taskbar available globally as specified in README
window.Taskbar = Taskbar; 