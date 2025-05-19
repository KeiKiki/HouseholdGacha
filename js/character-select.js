class CharacterSelect {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.selectedCharacter = null;
        this.dom = {
            modal: document.querySelector('.character-modal'),
            form: document.querySelector('.character-form'),
            grid: document.querySelector('.character-grid')
        };

        this.#setupEventListeners();
        window.addEventListener('characterUpdated', () => this.render());
        window.addEventListener('currencyUpdated', () => this.render());
        this.render();
    }

    #setupEventListeners() {
        // Modal controls
        document.addEventListener('keydown', e => e.key === 'Escape' && this.#closeModal());
        this.dom.modal?.addEventListener('click', e => e.target === this.dom.modal && this.#closeModal());
        document.getElementById('new-character-btn')?.addEventListener('click', () => this.dom.modal?.classList.add('active'));
        document.querySelector('.cancel-btn')?.addEventListener('click', () => this.#closeModal());

        // Form submission
        this.dom.form?.addEventListener('submit', e => {
            e.preventDefault();
            const { name, type } = Object.fromEntries(new FormData(e.target));
            if (!name?.trim()) return alert('Please enter a character name');
            this.characterManager.addCharacter(new Character(null, name.trim(), type));
            this.#closeModal();
            this.render();
        });

        // Character actions
        ['rename', 'delete'].forEach(action => {
            document.getElementById(`${action}-character`)?.addEventListener('click', () => {
                if (!this.selectedCharacter) return alert(`Please select a character to ${action}`);
                if (action === 'delete' && confirm(`Delete ${this.selectedCharacter.name}?`)) {
                    this.characterManager.removeCharacter(this.selectedCharacter.id);
                    this.selectedCharacter = null;
                } else if (action === 'rename') {
                    const newName = prompt('Enter new name:', this.selectedCharacter.name)?.trim();
                    if (newName) this.characterManager.updateCharacter(this.selectedCharacter.id, { name: newName });
                }
                this.render();
            });
        });
    }

    #closeModal() {
        this.dom.modal?.classList.remove('active');
        this.dom.form?.reset();
    }

    #getHighestRarity(char) {
        const rarities = ['common', 'uncommon', 'rare', 'epic'];
        const items = Object.values(char.equippedItems).flat().filter(Boolean);
        if (!items.length) return null;
        return rarities[Math.max(...items.map(item => rarities.indexOf(item.rarity)))];
    }

    #renderCharacterPreview(char) {
        const layers = [
            { item: char.equippedItems.background, z: 0 },
            { path: 'img/Player.png', z: 1 },
            { item: char.equippedItems.bottom, z: 2 },
            { item: char.equippedItems.top, z: 3 },
            { item: char.equippedItems.footwear, z: 4 },
            { item: char.equippedItems.overwear, z: 5 },
            ...char.equippedItems.accessories.map((acc, i) => ({ item: acc, z: 6 + i * 0.1 })),
            { item: char.equippedItems.headwear, z: 10 }
        ];

        return layers.map(({ item, path, z }) => {
            const imgPath = path || item?.imagePath;
            return imgPath ? `<img src="${imgPath}" style="z-index:${z};position:absolute;width:100%;height:100%;object-fit:contain;top:0;left:0">` : '';
        }).join('');
    }

    render() {
        if (!this.dom.grid) return;
        const characters = this.characterManager.getCharacters();
        const rarityColors = { common: '#808080', uncommon: '#00ff00', rare: '#0000ff', epic: '#800080' };

        this.dom.grid.innerHTML = characters.map(char => {
            const isSelected = this.selectedCharacter?.id === char.id;
            const rarity = this.#getHighestRarity(char);
            
            const freshChar = this.characterManager.getCharacter(char.id);
            const points = freshChar?.points || 0;
            const coins = freshChar?.coins || 0;
            
            return `
                <div class="character-card ${rarity ? `rarity-${rarity}` : ''}" data-id="${char.id}">
                    <div class="showcase-spotlight"></div>
                    ${isSelected ? '<div class="selected-badge"><span class="checkmark">✔</span></div>' : ''}
                    <div class="character-preview">${this.#renderCharacterPreview(char)}</div>
                    <div class="character-name">${char.name}</div>
                    <div class="character-points"><img src="img/points-icon.svg" alt="Points"> ${points}</div>
                    ${char.type !== 'kid' ? `<div class="character-coins"><img src="img/coins-icon.svg" alt="Coins"> ${coins}</div>` : ''}
                    ${rarity ? `<div class="rarity-star ${rarity}"><span style="color: ${rarityColors[rarity]}">★</span></div>` : ''}
                </div>
            `;
        }).join('');

        // Setup card click handlers
        this.dom.grid.querySelectorAll('.character-card').forEach(card => 
            card.addEventListener('click', () => {
                const character = this.characterManager.getCharacter(card.dataset.id);
                if (!character) return;
                this.selectedCharacter = character;
                this.characterManager.setCurrentCharacter(character.id);
                window.game.eventSystem.dispatch('characterSelected', character);
                window.characterDisplay.updateDisplay(document.querySelector('.character-display'));
                this.render();
            })
        );

        // Update action buttons
        ['rename', 'delete'].forEach(action => {
            const button = document.getElementById(`${action}-character`);
            if (button) button.disabled = !this.selectedCharacter;
        });
    }
} 