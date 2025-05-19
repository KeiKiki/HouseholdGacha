// Global GachaUI class for managing gacha interface
class GachaUI {
    constructor(gachaSystem) {
        this.gs = gachaSystem;
        this.bannersContainer = document.getElementById('banners');
        this.resultContainer = document.getElementById('gacha-result');
        this.init();
    }

    init() {
        document.querySelector('.task-button[data-target="gacha"]')?.addEventListener('click', () => 
            document.querySelector('.gacha-section')?.scrollIntoView({ behavior: 'smooth' }));
        window.addEventListener('characterChanged', () => this.displayBanners());
        window.addEventListener('currencyUpdated', () => this.displayBanners());
        this.displayBanners();
    }

    displayBanners() {
        const character = this.gs.characterManager?.getCharacter(this.gs.characterManager.currentCharacter);
        if (!character) return;

        const currency = character.type === 'kid' ? 'Points' : 'Coins';
        
        const canAfford = (banner) => {
            if (character.type === 'kid') {
                return (character.points || 0) >= banner.cost;
            } else {
                return (character.coins || 0) >= banner.cost;
            }
        };

        const renderItem = (item, className = '') => `
            <div class="${className}" data-rarity="${item.rarity}">
                <img src="${item.imagePath}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
        `;

        this.bannersContainer.innerHTML = this.gs.banners.map(banner => `
            <div class="banner ${canAfford(banner) ? 'can-afford' : 'cannot-afford'}" data-banner-id="${banner.id}">
                <h3>${banner.name}</h3>
                <div class="banner-cost">${banner.cost} ${currency}</div>
                <div class="banner-items-preview">
                    <div class="items-container">
                        ${[...banner.items, ...banner.items]
                            .map(item => renderItem(item, 'banner-preview-item')).join('')}
                    </div>
                </div>
                <div class="banner-buttons">
                    <button class="pull-button" ${!canAfford(banner) ? 'disabled' : ''} data-banner-id="${banner.id}">
                        Pull (${banner.cost} ${currency})
                    </button>
                </div>
            </div>
        `).join('');

        this.attachEventListeners();
    }

    attachEventListeners() {
        const handleClick = (selector, callback) => {
            this.bannersContainer.querySelectorAll(selector).forEach(button => 
                button.addEventListener('click', e => {
                    const bannerId = e.target.dataset.bannerId;
                    if (bannerId) callback(bannerId);
                }));
        };

        handleClick('.pull-button', id => this.gs.pull(id));
    }

    showMessage(message, duration = 3000) {
        this.resultContainer.innerHTML = message;
        this.resultContainer.style.display = 'block';
        setTimeout(() => this.resultContainer.style.display = 'none', duration);
    }
} 