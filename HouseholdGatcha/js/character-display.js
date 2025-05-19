class CharacterDisplay {
    constructor(characterManager) {
        this.characterManager = characterManager;
        this.layers = [
            { type: 'background', zIndex: 0 },
            { type: 'base', imagePath: 'img/Player.png', zIndex: 1 },
            { type: 'bottom', zIndex: 2 },
            { type: 'top', zIndex: 3 },
            { type: 'footwear', zIndex: 4 },
            { type: 'overwear', zIndex: 5 },
            { type: 'accessories', zIndex: 6 },
            { type: 'headwear', zIndex: 10 }
        ];

        ['characterChanged', 'characterUpdated'].forEach(event => {
            window.addEventListener(event, () => {
                // Update main character display
                this.updateDisplay(document.querySelector('.character-display'));
                // Update any floating displays
                document.querySelectorAll('.character-preview').forEach(display => {
                    this.updateDisplay(display, true);
                });
            });
        });
    }

    updateDisplay(targetElement, isFloating = false) {
        if (!targetElement) return;
        
        const character = this.characterManager?.getCharacter(this.characterManager.currentCharacter);
        if (!character) {
            targetElement.innerHTML = isFloating ? '' : '<p>No character selected</p>';
            if (isFloating) targetElement.classList.remove('active');
            return;
        }

        if (isFloating) targetElement.classList.add('active');

        const container = document.createElement('div');
        container.className = isFloating ? 'character-preview' : 'character-display-container';
        
        // Render all layers
        this.layers.forEach(({ type, imagePath, zIndex }) => {
            const itemPath = type === 'base' ? imagePath : character.equippedItems?.[type]?.imagePath;
            if (itemPath) {
                const img = document.createElement('img');
                img.src = itemPath;
                img.className = 'character-layer';
                img.style.zIndex = zIndex;
                container.appendChild(img);
            }
        });

        // Render accessories with incremental z-index
        character.equippedItems?.accessories?.forEach((acc, index) => {
            if (acc?.imagePath) {
                const img = document.createElement('img');
                img.src = acc.imagePath;
                img.className = 'character-layer';
                img.style.zIndex = 6 + (index * 0.1);
                container.appendChild(img);
            }
        });

        targetElement.innerHTML = '';
        targetElement.appendChild(container);
    }
}

// Make CharacterDisplay globally accessible
window.CharacterDisplay = CharacterDisplay; 