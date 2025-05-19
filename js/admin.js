window.AdminPanel = class AdminPanel {
    constructor(characterManager) {
        if (!window.currencyManager) throw new Error('CurrencyManager is required');
        this.cm = characterManager;
        this.char = null;
        this.initUI();
    }

    initUI() {
        this.overlay = document.createElement('div');
        this.panel = document.createElement('div');
        [this.overlay.className, this.panel.className] = ['admin-panel-overlay window-overlay', 'admin-panel window-container'];
        this.panel.innerHTML = `
            <div class="window-header"><h2>Admin Panel</h2><button class="close">&times;</button></div>
            <div class="window-content">
                <select id="char-select"></select>
                <div id="currency" style="display:none">
                    <span class="label"></span><span class="amount">0</span>
                    <input type="number" min="1" placeholder="Amount">
                    <button class="add">Add</button><button class="remove">Remove</button>
                </div>
                <div class="admin-actions">
                    <button id="reset-all-tasks" class="admin-button">Reset All Tasks for Everyone</button>
                </div>
                <ul class="tasks"></ul>
                <form id="task-form">
                    <input type="hidden" name="id">
                    <input required name="name" placeholder="Task Name">
                    <select name="category">
                        ${['chores','education','exercise','personal'].map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                    <select name="difficulty">
                        ${['easy','medium','hard'].map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                    <select name="rewardType">
                        <option value="points">Points</option>
                        <option value="coins">Coins</option>
                    </select>
                    <input type="number" required name="reward" min="1" placeholder="Reward Amount">
                    <select name="visibility">
                        ${['visible','hidden'].map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                    <textarea name="description" placeholder="Description"></textarea>
                    <button type="submit">Save</button>
                    <button type="reset" style="display:none">Cancel</button>
                </form>
            </div>`;
        this.overlay.appendChild(this.panel);
        document.body.appendChild(this.overlay);
        this.setupEvents();
    }

    setupEvents() {
        const $ = s => this.panel.querySelector(s);
        const getFormData = () => Object.fromEntries(new FormData($('#task-form')));
        
        $('#char-select').onchange = e => {
            this.char = this.cm.getCharacter(e.target.value);
            if (!this.char) return;
            
            const type = this.char.type === 'kid' ? 'points' : 'coins';
            $('#currency .label').textContent = type;
            $('#currency .amount').textContent = this.char[type] || 0;
            $('#currency').style.display = 'block';
            
            // Set default reward type based on character type
            $('#task-form select[name="rewardType"]').value = type;
            
            const tasks = this.char.tasks || [];
            $('.tasks').innerHTML = tasks.length ? tasks.map(t => `
                <li class="${t.completed ? 'completed' : ''} ${t.visibility}">
                    <h4>${t.name}</h4>
                    <div>${t.category} - ${t.difficulty} (${t.reward} ${t.rewardType || 'points'})</div>
                    ${t.description ? `<p>${t.description}</p>` : ''}
                    <div>
                        <button data-id="${t.id}" data-action="edit">Edit</button>
                        <button data-id="${t.id}" data-action="toggle">${t.visibility === 'hidden' ? 'Show' : 'Hide'}</button>
                        <button data-id="${t.id}" data-action="complete">${t.completed ? 'Reset' : 'Complete'}</button>
                        <button data-id="${t.id}" data-action="delete">Delete</button>
                    </div>
                </li>`).join('') : '<li>No tasks</li>';
        };

        $('.close').onclick = () => {
            this.overlay.classList.remove('active');
            window.dispatchEvent(new CustomEvent('adminPanelClosed'));
        };

        ['.add', '.remove'].forEach(cls => $(cls).onclick = () => {
            const amount = parseInt($('#currency input').value);
            if (isNaN(amount) || amount <= 0) return alert('Enter valid amount');
            const type = this.char.type === 'kid' ? 'points' : 'coins';
            if (window.currencyManager.processCurrency(this.char, type, amount, cls === '.remove')) {
                $('#char-select').onchange({ target: { value: this.char.id } });
            }
        });

        $('.tasks').onclick = e => {
            if (e.target.tagName !== 'BUTTON') return;
            const { id, action } = e.target.dataset;
            const task = this.char.tasks.find(t => t.id === id);
            if (!task) return;

            if (action === 'edit') {
                const form = $('#task-form');
                Object.entries(task).forEach(([k, v]) => {
                    const el = form.elements[k];
                    if (el) el.value = v;
                });
                form.querySelector('[type="submit"]').textContent = 'Update';
                form.querySelector('[type="reset"]').style.display = 'inline';
            } else if (action === 'toggle') {
                task.visibility = task.visibility === 'hidden' ? 'visible' : 'hidden';
                this.cm.manageTask(this.char.id, task, 'update');
                $('#char-select').onchange({ target: { value: this.char.id } });
            } else if (action === 'complete') {
                task.completed = !task.completed;
                if (task.completed) {
                    const type = task.rewardType || 'points';
                    if (!window.currencyManager.processCurrency(this.char, type, task.reward)) {
                        return alert('Failed to process reward');
                    }
                }
                this.cm.manageTask(this.char.id, task, 'update');
                $('#char-select').onchange({ target: { value: this.char.id } });
            } else if (action === 'delete' && confirm('Delete task?')) {
                this.cm.manageTask(this.char.id, task, 'remove');
                $('#char-select').onchange({ target: { value: this.char.id } });
            }
        };

        $('#task-form').onsubmit = e => {
            e.preventDefault();
            if (!this.char) return alert('Select character first');
            
            const data = getFormData();
            data.reward = parseInt(data.reward);
            data.rewardType = data.rewardType || (this.char.type === 'kid' ? 'points' : 'coins'); // Default based on character type
            data.completed = false;

            if (!data.name || !data.reward || data.reward <= 0) {
                return alert('Fill required fields with valid values');
            }

            this.cm.manageTask(this.char.id, data, data.id ? 'update' : 'add');
            $('#task-form').reset();
            $('#char-select').onchange({ target: { value: this.char.id } });
        };

        $('#task-form [type="reset"]').onclick = () => {
            $('#task-form').reset();
            $('#task-form [type="submit"]').textContent = 'Save';
            $('#task-form [type="reset"]').style.display = 'none';
        };

        // Add reset all tasks functionality
        $('#reset-all-tasks').onclick = () => {
            if (!confirm('Are you sure you want to reset all tasks for ALL characters?')) return;
            
            // Get all characters and reset their tasks
            const characters = this.cm.getCharacters();
            characters.forEach(character => {
                if (character.tasks && character.tasks.length > 0) {
                    // Reset all tasks to their initial state
                    character.tasks = character.tasks.map(task => ({
                        ...task,
                        completed: false,
                        progress: 0
                    }));
                    
                    this.cm.manageTask(character.id, character.tasks, 'update');
                }
            });
            
            // Refresh the current view if a character is selected
            if (this.char) {
                $('#char-select').onchange({ target: { value: this.char.id } });
            }
        };
    }

    open() {
        this.overlay.classList.add('active');
        this.panel.querySelector('#char-select').innerHTML = '<option value="">Select character...</option>' +
            this.cm.getCharacters().map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
} 