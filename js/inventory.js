class Inventory {
    constructor(characterManager) {
        if (!characterManager) {
            console.error('Character manager is required for inventory initialization');
            return;
        }
        this.characterManager = characterManager;
        this.currentFilter = 'all';
        this.dom = {
            overlay: document.querySelector('.inventory-overlay'),
            items: document.getElementById('inventory-items'),
            filters: document.querySelectorAll('.filter-btn'),
            close: document.querySelector('.close-inventory')
        };
        this.init();
        // Expose the instance globally
        window.inventory = this;
    }

    init() {
        this.dom.filters.forEach(btn => btn.addEventListener('click', () => this.setFilter(btn.dataset.filter)));
        this.dom.close.addEventListener('click', () => this.toggleInventory(false));
        this.dom.overlay.addEventListener('click', e => e.target === this.dom.overlay && this.toggleInventory(false));
    }

    openInventory() { this.toggleInventory(true); }
    closeInventory() { this.toggleInventory(false); }

    toggleInventory(show = true) {
        this.dom.overlay.style.display = show ? 'flex' : 'none';
        document.body.classList.toggle('inventory-open', show);
        if (show) this.displayItems();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.dom.filters.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
        this.displayItems();
    }

    displayItems() {
        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!character) {
            this.dom.items.innerHTML = '<p>No character selected</p>';
            return;
        }

        if (!character.inventory) {
            character.inventory = [];
            this.characterManager.saveCharacters();
        }

        const items = character.inventory;
        const filtered = this.currentFilter === 'all' ? items : items.filter(item => item.category === this.currentFilter);
        
        if (!filtered || filtered.length === 0) {
            this.dom.items.innerHTML = '<p>No items in inventory</p>';
            return;
        }

        // Clear existing items
        this.dom.items.innerHTML = '';
        
        // Create and append each item
        filtered.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <img src="${item.imagePath}" alt="${item.name}">
                <div class="item-name">${item.name}</div>
                <div class="item-rarity ${item.rarity}"></div>
            `;
            
            // Add equipped class if item is equipped
            if (this.isItemEquipped(character, item)) {
                itemElement.classList.add('equipped');
            }
            
            // Add click event listener for equipping
            itemElement.addEventListener('click', () => this.toggleEquip(item));
            
            // Append to container
            this.dom.items.appendChild(itemElement);
        });
    }

    isItemEquipped(character, item) {
        if (!character?.equippedItems) return false;
        return item.category === 'accessories' 
            ? character.equippedItems.accessories?.some(acc => acc.id === item.id)
            : character.equippedItems[item.category]?.id === item.id;
    }

    toggleEquip(item) {
        if (!item || !item.id || !item.category) {
            console.error('Invalid item data');
            return;
        }

        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!character) {
            console.error('No character selected');
            return;
        }

        // Initialize equippedItems if it doesn't exist
        if (!character.equippedItems) {
            character.equippedItems = {
                background: null,
                clothing: null,
                bottom: null,
                top: null,
                shoes: null,
                accessories: [],
                headwear: null
            };
        }

        // Ensure accessories array exists
        if (item.category === 'accessories' && !Array.isArray(character.equippedItems.accessories)) {
            character.equippedItems.accessories = [];
        }

        try {
            if (item.category === 'accessories') {
                const accessories = character.equippedItems.accessories;
                const isEquipped = accessories.some(acc => acc.id === item.id);
                
                if (isEquipped) {
                    character.equippedItems.accessories = accessories.filter(acc => acc.id !== item.id);
                } else {
                    character.equippedItems.accessories = [...accessories, item];
                }
            } else {
                const isEquipped = character.equippedItems[item.category]?.id === item.id;
                character.equippedItems[item.category] = isEquipped ? null : item;
            }

            // Save the updated character data
            this.characterManager.updateCharacter(character.id, { equippedItems: character.equippedItems });
            
            // Update the display
            this.displayItems();
            
            // Update character display if available
            if (window.characterSelect) {
                window.characterSelect.render();
            }
        } catch (error) {
            console.error('Error toggling equipment:', error);
        }
    }
} 