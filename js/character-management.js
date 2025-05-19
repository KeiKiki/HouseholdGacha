class CharacterManager {
    constructor() {
        this.characters = this.loadCharacters();
        this.currentCharacter = null;
        this.eventSystem = window.game?.eventSystem;
    }

    #save() {
        localStorage.setItem('characters', JSON.stringify(this.characters));
    }

    saveCharacters() {
        this.#save();
    }

    #dispatch(event, data) {
        this.eventSystem?.dispatch(event, data);
    }

    #getImagePath(itemId) {
        const pathMap = {
            'blond-bob-bow': 'adults-banner/BlondBowBob.png',
            'black-brimmed-hat': 'adults-banner/BlackBrimHat.png',
            'green-tank': 'adults-banner/GreenTankTop.png',
            'wool-skirt': 'adults-banner/WoolSkirt.png',
            'magnificent-mustache': 'adults-banner/Mustachio.png',
            'elegant-dress': 'adults-banner/BlueBelleDress.png',
            'golden-crown': 'adults-banner/Clownsgh.png',
            'diamond-necklace': 'adults-banner/Tie.png',
            'royal-robe': 'adults-banner/BlueBelleDress.png',
            'black-heeled-boots': 'kids-banner/BlackHeeledBoots.png',
            'flower-shirt': 'kids-banner/FlowerShirt.png',
            'orange-onesie': 'kids-banner/OrangeOnesie.png',
            'rainbow-wings': 'kids-banner/RainbowPigtails.png',
            'magic-wand': 'kids-banner/WizardHat.png',
            'crown-tiara': 'kids-banner/WizardHat.png',
            'classic-bowler': 'hat-stand-banner/BowlerHat.png',
            'rare-bowler': 'hat-stand-banner/RareBowlerHat.png',
            'clown-shoes': 'adults-banner/Clownsgh.png'
        };
        return Object.entries(pathMap).find(([key]) => itemId.includes(key))?.[1] ? 
            `img/banners/${Object.entries(pathMap).find(([key]) => itemId.includes(key))[1]}` : null;
    }

    loadCharacters() {
        const characters = JSON.parse(localStorage.getItem('characters') || '[]');
        characters.forEach(char => {
            char.inventory?.forEach(item => {
                if (item.imagePath) {
                    const newPath = this.#getImagePath(item.id);
                    if (newPath) item.imagePath = newPath;
                }
            });
        });
        this.characters = characters;
        if (!this.currentCharacter && characters.length > 0) {
            this.setCurrentCharacter(characters[0].id);
        }
        return characters;
    }

    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }

    getCharacters() {
        return this.characters;
    }

    setCurrentCharacter(id) {
        this.currentCharacter = id;
        this.#dispatch('characterChanged', { characterId: id });
    }

    addCharacter(char) {
        Object.assign(char, {
            tasks: [], inventory: [],
            equippedItems: { background: null, clothing: null, bottom: null, top: null, shoes: null, accessories: [], headwear: null },
            points: 0, coins: 0
        });
        this.characters.push(char);
        this.#save();
        this.#dispatch('characterUpdated', { action: 'add', characterId: char.id });
    }

    updateCharacter(id, updates) {
        const char = this.getCharacter(id);
        if (!char) return;
        Object.assign(char, updates);
        this.#save();
        this.#dispatch('characterUpdated', { action: 'update', characterId: id });
    }

    removeCharacter(id) {
        this.characters = this.characters.filter(c => c.id !== id);
        if (this.currentCharacter === id) {
            this.setCurrentCharacter(this.characters[0]?.id || null);
        }
        this.#save();
        this.#dispatch('characterUpdated', { action: 'remove', characterId: id });
    }

    updateCurrency(id, type, amount, subtract = false) {
        const char = this.getCharacter(id);
        if (!char) return false;
        if (window.currencyManager) {
            return window.currencyManager.processCurrency(char, type, amount, subtract);
        }
        const currency = type.toLowerCase();
        char[currency] = (char[currency] || 0) + (subtract ? -amount : +amount);
        if (char[currency] < 0) return false;
        this.#save();
        this.#dispatch('currencyUpdated', { characterId: id, type: currency, amount: subtract ? -amount : +amount });
        return true;
    }

    addToInventory(id, item) {
        const char = this.getCharacter(id);
        if (!char?.inventory?.find(i => i.id === item.id)) {
            char?.inventory?.push(item);
            this.#save();
            this.#dispatch('inventoryUpdated', { characterId: id, item, action: 'add' });
        }
    }

    manageTask(id, task, action = 'add') {
        const char = this.getCharacter(id);
        if (!char) return;
        if (!char.tasks) char.tasks = [];
        
        switch(action) {
            case 'add':
                char.tasks.push(task);
                break;
            case 'update':
                const index = char.tasks.findIndex(t => t.id === task.id);
                if (index !== -1) char.tasks[index] = task;
                break;
            case 'remove':
                char.tasks = char.tasks.filter(t => t.id !== task.id);
                break;
        }
        
        this.#save();
        this.#dispatch('tasksUpdated', { characterId: id, taskId: task.id, action });
    }
}

// Remove the duplicate initialization
// document.addEventListener('DOMContentLoaded', () => {
//     // window.characterManager = new CharacterManager(); // Removed this line
// }); 