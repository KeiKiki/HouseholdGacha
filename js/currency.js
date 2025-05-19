/**
 * CurrencyManager - Handles currency (points/coins) for characters
 */
class CurrencyManager {
    constructor() {
        this.elements = {
            points: document.querySelector('.header-points span'),
            coins: document.querySelector('.header-coins span')
        };
        this.setupEvents();
    }

    update(type, amount) {
        if (this.elements[type]) {
            this.elements[type].textContent = amount.toLocaleString();
        }
    }

    updateAll(character) {
        if (!character) return;
        const isKid = character.type === 'kid';
        
        this.update('points', character.points || 0);
        this.update('coins', isKid ? 0 : (character.coins || 0));
        
        document.querySelector('.header-points').style.display = isKid ? 'flex' : 'none';
        document.querySelector('.header-coins').style.display = isKid ? 'none' : 'flex';
    }

    processCurrency(character, type, amount, subtract = false) {
        if (!character || !type || amount <= 0) return false;
        
        const currency = type.toLowerCase();
        const current = character[currency] || 0;
        const newAmount = subtract ? current - amount : current + amount;
        
        if (subtract && newAmount < 0) return false;
        
        character[currency] = newAmount;
        this.update(currency, newAmount);
        
        // Save changes to localStorage
        this.saveCharacterData();
        
        // Dispatch event for currency update
        window.dispatchEvent(new CustomEvent('currencyUpdated', {
            detail: { characterId: character.id, type: currency, amount: subtract ? -amount : amount }
        }));
        
        // Also dispatch specific currency event for better synchronization
        window.dispatchEvent(new CustomEvent(`${currency}Updated`, {
            detail: { characterId: character.id, amount: newAmount }
        }));
        
        // Force character select to update
        if (window.characterSelect) {
            window.characterSelect.render();
        }
        
        return true;
    }
    
    saveCharacterData() {
        // Save characters to localStorage if characterManager is available
        if (window.characterManager?.characters) {
            localStorage.setItem('characters', JSON.stringify(window.characterManager.characters));
        }
    }

    setupEvents() {
        document.addEventListener('characterChanged', e => this.updateAll(e.detail.character));
        ['points', 'coins'].forEach(type => {
            document.addEventListener(`${type}Updated`, e => this.update(type, e.detail.amount));
        });
        
        // Listen for currency updates from other components
        document.addEventListener('currencyUpdated', e => {
            const character = window.characterManager?.getCharacter(e.detail.characterId);
            if (character) {
                this.update(e.detail.type, character[e.detail.type] || 0);
                // Force character select to update
                if (window.characterSelect) {
                    window.characterSelect.render();
                }
            }
        });
    }
}

window.CurrencyManager = CurrencyManager;
window.currencyManager = new CurrencyManager(); 