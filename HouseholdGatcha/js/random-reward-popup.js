class RandomRewardPopup {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.popupElement = null;
        this.isVisible = false;
        this.minTimeBetweenPopups = 30 * 60 * 1000; // 30 minutes minimum
        this.maxTimeBetweenPopups = 120 * 60 * 1000; // 2 hours maximum
        this.lastPopupTime = 0;
        this.rewardAmount = {
            points: 50,  // Points for all characters
            coins: 25    // Coins for adult characters
        };
        
        this.init();
    }

    init() {
        // Create popup element
        this.popupElement = document.createElement('div');
        this.popupElement.className = 'random-reward-popup';
        this.popupElement.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">🎁</div>
            </div>
        `;
        document.body.appendChild(this.popupElement);

        // Add click handler
        this.popupElement.addEventListener('click', () => this.giveReward());
        
        // Start the random timer
        this.scheduleNextPopup();
    }

    scheduleNextPopup() {
        const randomDelay = Math.random() * 
            (this.maxTimeBetweenPopups - this.minTimeBetweenPopups) + 
            this.minTimeBetweenPopups;
        
        setTimeout(() => {
            if (Date.now() - this.lastPopupTime >= this.minTimeBetweenPopups) {
                this.showPopup();
            }
            this.scheduleNextPopup();
        }, randomDelay);
    }

    showPopup() {
        if (this.isVisible) return;
        
        // Random position on screen
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        this.popupElement.style.left = `${x}px`;
        this.popupElement.style.top = `${y}px`;
        this.popupElement.classList.add('active');
        this.isVisible = true;
        
        // Auto-hide after 30 seconds if not clicked
        setTimeout(() => {
            if (this.isVisible) {
                this.hidePopup();
            }
        }, 30000);
    }

    hidePopup() {
        this.popupElement.classList.remove('active');
        this.isVisible = false;
        this.lastPopupTime = Date.now();
    }

    giveReward() {
        const characters = this.characterManager.getCharacters();
        
        characters.forEach(character => {
            // Give points to all characters
            window.currencyManager.processCurrency(character, 'points', this.rewardAmount.points);
            
            // Give coins only to adult characters
            if (character.type !== 'kid') {
                window.currencyManager.processCurrency(character, 'coins', this.rewardAmount.coins);
            }
        });

        // Show reward animation
        this.showRewardAnimation();
        this.hidePopup();
    }

    showRewardAnimation() {
        const animation = document.createElement('div');
        animation.className = 'reward-animation';
        animation.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">✨</div>
                <div class="reward-text">
                    <div>+${this.rewardAmount.points} Points</div>
                    <div>+${this.rewardAmount.coins} Coins</div>
                </div>
            </div>
        `;
        document.body.appendChild(animation);
        
        setTimeout(() => animation.remove(), 3000);
    }
} 