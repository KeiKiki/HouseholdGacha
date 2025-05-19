/**
 * Household Gacha Game - Main Initialization
 * 
 * This file handles the core initialization of the game components
 * and sets up the event system. Following traditional script loading
 * pattern as specified in README.md.
 */

// Event system
window.game = { eventSystem: { dispatch: (e, d) => window.dispatchEvent(new CustomEvent(e, { detail: d })) } };

// Function to migrate existing character data to new clothing categories
function migrateCharacterItems() {
    const characters = window.characterManager.characters;
    
    characters.forEach(char => {
        // If the character has the old 'clothing' property
        if (char.equippedItems.clothing) {
            // Determine which new category the item belongs to
            const item = char.equippedItems.clothing;
            
            // Basic heuristic based on item name
            if (item.name.toLowerCase().includes('dress') || 
                item.name.toLowerCase().includes('shirt') || 
                item.name.toLowerCase().includes('tank')) {
                char.equippedItems.top = item;
            } else if (item.name.toLowerCase().includes('skirt') || 
                      item.name.toLowerCase().includes('pants') || 
                      item.name.toLowerCase().includes('shorts')) {
                char.equippedItems.bottom = item;
            } else if (item.name.toLowerCase().includes('boot') || 
                      item.name.toLowerCase().includes('shoe') || 
                      item.name.toLowerCase().includes('sandal')) {
                char.equippedItems.footwear = item;
            } else if (item.name.toLowerCase().includes('coat') || 
                      item.name.toLowerCase().includes('jacket') || 
                      item.name.toLowerCase().includes('robe')) {
                char.equippedItems.overwear = item;
            } else {
                // Default fallback - put it in overwear if unsure
                char.equippedItems.overwear = item;
            }
            
            // Remove the old property
            delete char.equippedItems.clothing;
        }
        
        // Convert 'shoes' to 'footwear' if it exists
        if (char.equippedItems.shoes) {
            char.equippedItems.footwear = char.equippedItems.shoes;
            delete char.equippedItems.shoes;
        }
        
        // Make sure all required properties exist
        if (!char.equippedItems.top) char.equippedItems.top = null;
        if (!char.equippedItems.bottom) char.equippedItems.bottom = null;
        if (!char.equippedItems.footwear) char.equippedItems.footwear = null;
        if (!char.equippedItems.overwear) char.equippedItems.overwear = null;
    });
    
    // Save the updated characters
    window.characterManager.saveCharacters();
    console.log("Character clothing migration complete");
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Core Systems
    window.characterManager = new CharacterManager();
    window.currencyManager = new CurrencyManager();
    window.gachaSystem = new GachaSystem(window.characterManager);
    window.taskManager = new TaskManager(window.characterManager);
    
    // UI Components
    window.header = new Header(window.characterManager);
    window.inventory = new Inventory(window.characterManager);
    window.characterSelect = new CharacterSelect(window.characterManager);
    window.characterDisplay = new CharacterDisplay(window.characterManager);
    window.adminPanel = new AdminPanel(window.characterManager);
    window.taskbar = new Taskbar();
    window.randomRewardPopup = new RandomRewardPopup(window.characterManager);
    
    // Initialize components
    window.taskbar.init(window.inventory, window.adminPanel, window.characterSelect, window.gachaSystem);
    window.characterManager.loadCharacters();
    window.taskManager.refreshTasks();
    window.header.updateDisplay();

    // Verify banner item names match their filenames
    if (window.bannerUtils && window.bannerUtils.verifyBannerItemNames) {
        window.bannerUtils.verifyBannerItemNames();
    }

    // Event listeners
    window.addEventListener('characterSelected', () => {
        window.header.updateDisplay();
        window.characterDisplay.updateDisplay(document.querySelector('.character-display'));
    });

    // Wait for character manager to initialize
    setTimeout(() => {
        if (window.characterManager) {
            migrateCharacterItems();
        }
    }, 500);
});

// Removed old initializer functions:
// initializeCharacter()
// initializeGacha() 
// initializeHeader() 