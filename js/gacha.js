/**
 * Gacha System Core
 */
class GachaSystem {
    constructor(characterManager) {
        if (!characterManager) throw new Error('CharacterManager required');
        this.characterManager = characterManager;
        this.rarityRates = { common: 0.6, uncommon: 0.25, rare: 0.1, epic: 0.05 };
        this.banners = window.bannerData || [];
        this.ui = new GachaUI(this);
    }

    /**
     * Initialize the gacha system
     */
    init() {
        // GachaUI handles banner display on characterChanged
    }

    /**
     * Perform a gacha pull from a specific banner
     * @param {string} bannerId - The ID of the banner to pull from
     * @returns {Object|null} The pulled item or null if pull failed
     */
    pull(bannerId) {
        const banner = this.banners.find(b => b.id === bannerId);
        const character = this.characterManager.getCharacter(this.characterManager.currentCharacter);
        if (!banner || !character) return null;

        // Determine the correct currency type based on character type
        const currencyType = character.type === 'kid' ? 'points' : 'coins';
        
        // Check if character has enough of the correct currency
        if ((character[currencyType] || 0) < banner.cost) {
            this.ui.showMessage(`Insufficient ${currencyType}! Need ${banner.cost}`, 3000);
            return null;
        }
        
        // Process currency using currencyManager
        if (!window.currencyManager.processCurrency(character, currencyType, banner.cost, true)) {
            this.ui.showMessage(`Failed to process ${currencyType}!`, 3000);
            return null;
        }

        this.showPullAnimation(() => {
            const rarity = this.roll();
            const items = banner.items.filter(item => item.rarity === rarity);
            
            // If no items of this rarity exist, default to common
            if (!items.length) {
                const commonItems = banner.items.filter(item => item.rarity === 'common');
                if (!commonItems.length) {
                    this.ui.showMessage('No items available in this banner!', 3000);
                    return;
                }
                const item = commonItems[Math.floor(Math.random() * commonItems.length)];
                this.showResult(item);
                this.characterManager.addToInventory(character.id, item);
                return;
            }

            const item = items[Math.floor(Math.random() * items.length)];
            if (item.rarity === 'epic' || item.rarity === 'rare') {
                this.showEffects(item.rarity);
            }
            this.showResult(item);
            
            // Add item to character's inventory
            this.characterManager.addToInventory(character.id, item);
        });
    }

    /**
     * Calculate the rarity of a pull based on configured rates
     * @returns {string} The rarity of the pull
     */
    roll() {
        const random = Math.random();
        let weight = 0;
        for (const [rarity, rate] of Object.entries(this.rarityRates)) {
            if (random <= (weight += rate)) return rarity;
        }
        return 'common';
    }

    showPullAnimation(callback) {
        const animation = document.createElement('div');
        animation.className = 'gacha-pull-animation';
        document.body.appendChild(animation);
        setTimeout(() => {
            animation.remove();
            callback();
        }, 2000);
    }

    showEffects(rarity) {
        const colors = {
            epic: ['#7c3aed', '#6d28d9', '#8b5cf6', '#a78bfa'],
            rare: ['#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa']
        };
        
        const count = rarity === 'epic' ? 50 : 30;
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}vw;
                color: ${colors[rarity][Math.floor(Math.random() * colors[rarity].length)]};
                transform: rotate(${Math.random() * 360}deg);
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    showResult(item) {
        const result = document.createElement('div');
        result.className = `pull-result ${item.rarity}`;
        result.innerHTML = `
            <img src="${item.imagePath}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="item-category">${item.category}</p>
            <span class="rarity-badge">${item.rarity}</span>
        `;
        document.body.appendChild(result);
        requestAnimationFrame(() => result.classList.add('reveal'));
        setTimeout(() => result.remove(), 5000);
    }

    /**
     * Display detailed information about a specific banner
     * @param {string} bannerId - The ID of the banner to show details for
     */
    showBannerDetails(bannerId) {
        this.ui.showBannerDetails(bannerId);
    }
}

// Make GachaSystem globally accessible
window.initializeGacha = (characterManager) => {
    if (!characterManager) {
        console.error('CharacterManager required for GachaSystem initialization');
        return null;
    }
    return new GachaSystem(characterManager);
}; 