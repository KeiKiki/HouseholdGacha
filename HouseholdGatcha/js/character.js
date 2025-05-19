// Character class - Core data structure for character management
class Character {
    constructor(id, name, type) {
        Object.assign(this, {
            id: id || Date.now().toString(),
            name: name || '',
            type: type || 'adult',
            points: 0,
            coins: 0,
            equippedItems: { background: null, top: null, bottom: null, footwear: null, overwear: null, accessories: [], headwear: null },
            inventory: [],
            tasks: []
        });
    }

    /**
     * Returns the highest rarity among equipped items
     * @returns {string|null} The highest rarity or null if no items equipped
     */
    getHighestEquippedRarity() {
        const rarities = ['common', 'uncommon', 'rare', 'epic'];
        return rarities[Math.max(...Object.values(this.equippedItems).flat().filter(Boolean).map(i => rarities.indexOf(i.rarity)), -1)] || null;
    }

    /**
     * Checks if a specific item is equipped
     * @param {Object} item - The item to check
     * @returns {boolean} True if the item is equipped
     */
    isItemEquipped(item) {
        return item.category === 'accessories' ? this.equippedItems.accessories.some(a => a.id === item.id) : this.equippedItems[item.category]?.id === item.id;
    }

    /**
     * Equips an item to the character
     * @param {Object} item - The item to equip
     * @returns {boolean} True if the item was equipped, false if already equipped
     */
    equipItem(item) {
        return this.isItemEquipped(item) ? (this.unequipItem(item), false) : (item.category === 'accessories' ? this.equippedItems.accessories.push(item) : this.equippedItems[item.category] = item, true);
    }

    /**
     * Unequips an item from the character
     * @param {Object} item - The item to unequip
     */
    unequipItem(item) {
        item.category === 'accessories' ? this.equippedItems.accessories = this.equippedItems.accessories.filter(a => a.id !== item.id) : this.equippedItems[item.category] = null;
    }

    /**
     * Adds currency to the character
     * @param {string} type - The type of currency ('coins' or 'points')
     * @param {number} amount - The amount to add
     */
    addCurrency(type, amount) {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;
        
        this[type] = (this[type] || 0) + numAmount;
    }

    /**
     * Removes currency from the character
     * @param {string} type - The type of currency ('coins' or 'points')
     * @param {number} amount - The amount to remove
     * @returns {boolean} True if successful, false if insufficient funds
     */
    removeCurrency(type, amount) {
        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) return false;
        
        if ((this[type] || 0) >= numAmount) {
            this[type] -= numAmount;
            return true;
        }
        return false;
    }

    /**
     * Adds an item to the character's inventory
     * @param {Object} item - The item to add
     * @returns {boolean} True if added successfully
     */
    addToInventory(item) {
        if (!this.inventory.some(i => i.id === item.id)) {
            this.inventory.push(item);
            return true;
        }
        return false;
    }

    /**
     * Completes a task and rewards the character
     * @param {string} taskId - The ID of the task to complete
     * @returns {Object|null} The task that was completed or null
     */
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return null;
        
        task.completed = true;
        const rewardAmount = task.reward || 0;
        const currencyType = this.type === 'kid' ? 'points' : 'coins';
        
        if (window.currencyManager) {
            window.currencyManager.processCurrency(this, currencyType, rewardAmount);
        } else {
            this[currencyType] = (this[currencyType] || 0) + rewardAmount;
        }
        
        return task;
    }

    /**
     * Resets a task's completion status
     * @param {string} taskId - The ID of the task to reset
     * @returns {Object|null} The task that was reset or null
     */
    resetTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return null;
        
        task.completed = false;
        return task;
    }
} 