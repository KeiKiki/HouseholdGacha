class TaskManager {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.domElements = {
            tasksContainer: document.getElementById('tasks-content'),
            tasksOverlay: document.getElementById('tasks-overlay'),
            tasksFilters: document.getElementById('tasks-filters'),
            closeButton: document.getElementById('close-tasks-btn')
        };
        this.currentFilter = 'all';
        this.setupEventListeners();
        this.refreshTasks();
    }

    setupEventListeners() {
        ['characterChanged', 'tasksUpdated', 'currencyUpdated'].forEach(event => 
            window.addEventListener(event, () => this.refreshTasks())
        );
        
        // Taskbar button click
        document.getElementById('open-tasks-btn')?.addEventListener('click', () => {
            this.openTasksWindow();
        });

        // Close button click
        this.domElements.closeButton?.addEventListener('click', () => {
            this.closeTasksWindow();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.domElements.tasksOverlay?.classList.contains('active')) {
                this.closeTasksWindow();
            }
        });

        // Close on overlay click
        this.domElements.tasksOverlay?.addEventListener('click', (e) => {
            if (e.target === this.domElements.tasksOverlay) {
                this.closeTasksWindow();
            }
        });

        // Setup filter buttons
        if (this.domElements.tasksFilters) {
            this.domElements.tasksFilters.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.currentFilter = e.target.dataset.filter;
                    this.updateFilterButtons();
                    this.refreshTasks();
                }
            });
        }
    }

    openTasksWindow() {
        const { tasksOverlay, tasksSection } = this.domElements;
        if (!tasksOverlay) return;

        // Reset position
        const section = tasksOverlay.querySelector('.tasks-section');

        tasksOverlay.classList.add('active');
        this.refreshTasks();
    }

    closeTasksWindow() {
        this.domElements.tasksOverlay?.classList.remove('active');
    }

    updateFilterButtons() {
        const buttons = this.domElements.tasksFilters?.querySelectorAll('.filter-btn');
        buttons?.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    refreshTasks() {
        const { tasksContainer } = this.domElements;
        if (!tasksContainer) return;

        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!character) {
            tasksContainer.innerHTML = '<div class="empty-state"><p>Please select a character to view tasks</p></div>';
            return;
        }

        // Check if tasks need to be reset for a new day
        const today = new Date().toDateString();
        if (!character.lastResetDate || character.lastResetDate !== today) {
            // Reset all tasks for the new day
            if (character.tasks) {
                character.tasks.forEach(task => {
                    task.completed = false;
                    task.progress = 0;
                });
            }
            character.lastResetDate = today;
            this.characterManager.updateCharacter(character.id, { 
                tasks: character.tasks,
                lastResetDate: today 
            });
        }

        if (!character.tasks?.length) {
            character.tasks = this.getDefaultTasks(character.type);
            this.characterManager.updateCharacter(character.id, { tasks: character.tasks });
        }

        let visibleTasks = character.tasks.filter(task => task.visibility !== 'hidden');
        
        // Apply filters
        if (this.currentFilter !== 'all') {
            visibleTasks = visibleTasks.filter(task => {
                if (this.currentFilter === 'completed') return task.completed;
                if (this.currentFilter === 'active') return !task.completed;
                return task.category === this.currentFilter;
            });
        }

        const currencyName = character.type === 'kid' ? 'Points' : 'Coins';
        
        tasksContainer.innerHTML = visibleTasks.length ? '' : 
            '<div class="empty-state"><p>No tasks available for the current filter</p></div>';

        visibleTasks.forEach(task => this.renderTask(task, currencyName, tasksContainer));
    }

    getDefaultTasks(characterType) {
        const defaultRewardType = characterType === 'kid' ? 'points' : 'coins';
        return [
            { 
                name: 'Wash a Dish', 
                category: 'chores', 
                difficulty: 'medium', 
                reward: 20, 
                rewardType: defaultRewardType,
                description: 'Rinse your dish after a meal',
                progress: 0
            },
            { 
                name: 'Make Your Bed', 
                category: 'chores', 
                difficulty: 'easy', 
                reward: 10, 
                rewardType: defaultRewardType,
                description: 'Make your bed neatly',
                progress: 0
            },
            { 
                name: 'Put Shoes Away', 
                category: 'chores', 
                difficulty: 'easy', 
                reward: 10, 
                rewardType: defaultRewardType,
                description: 'Put your shoes by the door',
                progress: 0
            },
            { 
                name: 'Play with Kitty', 
                category: 'fun', 
                difficulty: 'easy', 
                reward: 10, 
                rewardType: defaultRewardType,
                description: 'Spend some time playing with the cat',
                progress: 0
            },
            { 
                name: '5 Minutes Exercise', 
                category: 'exercise', 
                difficulty: 'medium', 
                reward: 20, 
                rewardType: defaultRewardType,
                description: 'Stretch or strengthen your body',
                progress: 0
            }
        ].map((task, index) => ({
            ...task,
            id: `task-${index}-${Date.now()}`,
            completed: false,
            visibility: 'visible'
        }));
    }

    renderTask(task, currencyName, container) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''} ${task.difficulty || 'medium'}`;
        taskElement.dataset.taskId = task.id;
        
        const reward = task.reward;
        const rewardType = task.rewardType || 'points';
        const rewardIcon = rewardType === 'points' ? '⭐' : '💰';
        
        taskElement.innerHTML = `
            <div class="task-header">
                <h3>${task.name}</h3>
                <div class="task-meta">
                    <span class="task-category">${task.category || 'Uncategorized'}</span>
                    <span class="task-difficulty ${task.difficulty || 'medium'}">${task.difficulty || 'Medium'}</span>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-progress">
                <div class="task-progress-bar" style="width: ${task.progress || 0}%"></div>
            </div>
            <div class="task-footer">
                <span class="task-reward">
                    <span class="task-reward-icon">${rewardIcon}</span>
                    ${reward} ${rewardType}
                </span>
                <div class="task-actions">
                    <button class="complete-btn" ${task.completed ? 'disabled' : ''}>Complete</button>
                </div>
            </div>
        `;
        
        taskElement.querySelector('.complete-btn')?.addEventListener('click', () => this.updateTaskStatus(task.id, true));
        
        container.appendChild(taskElement);
    }

    calculateReward(task) {
        return task.reward;
    }

    updateTaskStatus(taskId, complete) {
        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!character) return;

        const task = character.tasks.find(t => t.id === taskId);
        if (!task || task.completed === complete) return;

        if (complete) {
            const reward = this.calculateReward(task);
            if (reward <= 0 || reward > 1000) return;

            const currencyType = task.rewardType || 'points';
            
            if (window.currencyManager) {
                window.currencyManager.processCurrency(character, currencyType, reward);
            } else {
                this.characterManager.updateCurrency(character.id, currencyType, reward);
            }
        }

        task.completed = complete;
        task.progress = complete ? 100 : 0;
        this.characterManager.updateCharacter(character.id, { tasks: character.tasks });
        window.dispatchEvent(new CustomEvent('tasksUpdated', {
            detail: { characterId: character.id, taskId: task.id, action: complete ? 'complete' : 'reset' }
        }));
        
        this.refreshTasks();
    }

    updateTaskProgress(taskId, progress) {
        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!character) return;

        const task = character.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.progress = Math.min(100, Math.max(0, progress));
        this.characterManager.updateCharacter(character.id, { tasks: character.tasks });
        this.refreshTasks();
    }
} 