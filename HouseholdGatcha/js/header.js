// Header component for managing the application header
class Header {
    constructor(characterManager) {
        this.header = document.querySelector('.header');
        this.characterManager = characterManager;
        this.domElements = {
            floatingCard: document.getElementById('floating-character-card'),
            headerActions: document.querySelector('.header-actions'),
            currency: {
                points: document.querySelector('.header-points'),
                coins: document.querySelector('.header-coins')
            }
        };
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.header.classList.toggle('scrolled', window.scrollY > 50);
        });

        ['pointsUpdated', 'coinsUpdated', 'characterSelected', 'characterUpdated', 'kidModeChanged']
            .forEach(event => document.addEventListener(event, () => this.updateDisplay()));
    }

    updateDisplay() {
        const character = this.characterManager?.getCharacter(this.characterManager.currentCharacter);
        if (!character) {
            this.domElements.headerActions.style.display = 'none';
            return;
        }

        const isKid = character.type === 'kid';
        this.domElements.headerActions.style.display = 'flex';
        
        // Show points for all characters, coins only for adults
        this.domElements.currency.points.style.display = 'flex';
        this.domElements.currency.coins.style.display = !isKid ? 'flex' : 'none';
        
        // Update both currencies for adults, only points for kids
        window.currencyManager?.update('points', character.points || 0);
        if (!isKid) {
            window.currencyManager?.update('coins', character.coins || 0);
        }

        // Update floating character display
        window.characterDisplay?.updateDisplay(this.domElements.floatingCard, true);
    }
}

// Make Header available globally as specified in README
window.Header = Header; 