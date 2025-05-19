# Household Gacha Game

A household-exclusive gacha game where family members can collect and customize their characters with various cosmetic items.

## Important Note: Script Loading
This project uses traditional script loading (not ES6 modules) to ensure compatibility with direct file access. Do not use ES6 module syntax (`import`/`export`) as it requires a web server to function. Instead:

- Use global scope for classes and functions
- Load scripts in the correct order in index.html
- Access components through the global scope (e.g., `window.gachaSystem`)

## Features

### Character System
- Create and manage multiple characters
- Support for both adult and kid characters (using the same base character image)
- Character customization with detailed clothing categories (tops, bottoms, footwear, overwear)
- Persistent character data storage
- Floating character card display in header

### Currency System
- Two currency types with strict separation:
  - Points: Available to all characters (both adults and kids)
  - Coins: Exclusive to adult characters
- Centralized currency management through `CurrencyManager`
- Strict currency type enforcement:
  - Kids can only use points for purchases
  - Adults must use coins for gacha pulls
- Automatic persistence to localStorage
- Real-time UI updates across all components
- Event-based synchronization between UI components

### Gacha System
- Multiple themed banners (Adult Fashion, Kids Collection, Hat Stand)
- Currency type enforcement (Coins for adults, Points for kids)
- Rarity tiers: Common (60%), Uncommon (25%), Rare (10%), Epic (5%)
- Visual feedback for pulls with animations
- Special effects for rare and epic pulls
- Detailed banner information display
- Automatic inventory updates after successful pulls
- Automatic item name standardization to match filenames with proper capitalization and spacing

### Task System
- Simple daily tasks with age-appropriate rewards
- Points for kids, Coins for adults
- Progress tracking and completion rewards
- Task windows
- Automatic daily task reset at midnight
- Current tasks:
  - Wash a Dish (20 points/coins) - Medium difficulty
  - Make Your Bed (10 points/coins) - Easy difficulty
  - Put Shoes Away (10 points/coins) - Easy difficulty
  - Play with Kitty (10 points/coins) - Easy difficulty
  - 5 Minutes Exercise (20 points/coins) - Medium difficulty
- Tasks automatically reset when:
  - Opening the tasks window on a new day
  - Refreshing tasks on a new day
  - Selecting a character on a new day
- Persistent task reset tracking to prevent multiple resets in the same day

### Random Reward Popup
- Surprise gift icon that randomly appears every 30-120 minutes
- Rewards all characters when clicked:
  - 50 points for all characters
  - 25 coins for adult characters only
- Floating animation to attract attention
- Auto-hides after 30 seconds if not clicked
- Kid-safe implementation following currency rules

### Inventory System
- Categorized item storage with specialized clothing categories:
  - Tops: Shirts, tank tops, etc.
  - Bottoms: Pants, skirts, shorts, etc.
  - Footwear: Shoes, boots, sandals, etc.
  - Overwear: Dresses, coats, jackets, robes, etc.
  - Accessories: Jewelry, ties, etc.
  - Headwear: Hats, crowns, etc.
- Item preview functionality
- Equip/unequip items by category
- Filter items by category

### Admin Panel
- Add/remove currency
- Manage tasks
- Character management
- System settings
- Admin button is automatically hidden in kid mode for child safety

### Windows XP Taskbar Theme
- Classic Windows XP-inspired taskbar design
- Custom Windows XP logo in the start button
- Nostalgic Windows XP taskbar color scheme
- Authentic Windows XP taskbar styling and animations
- Adaptive UI based on character type (kid/adult mode)

## Technical Specifications

### File Structure
```
HouseholdGatcha/
├── css/
│   ├── main-screen.css      # Global styles and variables
│   ├── character.css        # Character-related styles
│   ├── banners.css         # Banner and gacha styles
│   ├── kid-mode.css        # Kid mode specific styles
│   ├── taskbar.css         # Taskbar styles
│   ├── header.css          # Header component styles
│   ├── inventory.css       # Inventory styles
│   ├── character-select.css # Character selection styles
│   ├── admin.css           # Admin panel styles
│   ├── tasks.css           # Task system styles
│   ├── windows.css         # Window system styles
│   ├── windows-xp.css      # Windows XP theme styles
│   └── random-reward-popup.css # Random reward popup styles
├── js/
│   ├── character.js        # Base character class
│   ├── character-management.js # Character data management
│   ├── currency.js         # Currency management
│   ├── banner-data.js      # Banner and item definitions
│   ├── banner-utils.js     # Banner item name standardization
│   ├── gacha.js           # Gacha mechanics
│   ├── gacha-ui.js        # Gacha interface
│   ├── tasks.js           # Task system
│   ├── header.js          # Header component
│   ├── inventory.js       # Inventory management
│   ├── character-select.js # Character selection
│   ├── character-display.js # Character display
│   ├── admin.js           # Admin panel
│   ├── taskbar.js         # Taskbar
│   ├── random-reward-popup.js # Random reward popup system
│   └── main.js            # Main initialization
├── img/
│   ├── items/             # Item images
│   ├── characters/        # Character images
│   └── windows-logo.svg   # Windows XP logo
└── index.html             # Main HTML file
```

### Component Architecture

#### Header Component
The header component (`header.js`) provides:
- Sticky header with scroll behavior
- Character type-based currency display
- Floating character card
- Kid mode support
- Event-based updates

```javascript
// Example usage
window.header.updateDisplay(); // Update header display
```

#### Currency System
The currency system is managed through the `CurrencyManager` class:

```javascript
// Example usage
window.currencyManager.processCurrency(character, 'points', 100); // Add points
window.currencyManager.processCurrency(character, 'coins', 50, true); // Remove coins
```

Key features:
- Strict currency type enforcement based on character type
- Real-time UI updates across all components
- Automatic persistence to localStorage
- Event-based synchronization
- Validation and error handling

### Global Components and Functions

All components are globally accessible through the `window` object. Here's a complete list of available components and their main functions:

#### Core Systems
- `window.characterManager` (CharacterManager)
  - `loadCharacters()`: Load saved characters from storage
  - `addCharacter(char)`: Add a new character
  - `updateCurrency(id, type, amount, subtract)`: Update character's currency
  - `manageTask(id, task, action)`: Manage character tasks (add/update/remove)
  - `addToInventory(id, item)`: Add item to character's inventory

- `window.currencyManager` (CurrencyManager)
  - `processCurrency(character, type, amount, subtract)`: Process currency transactions
  - `update(type, amount)`: Update currency display
  - `updateAll(character)`: Update all currency displays for a character
  - `saveCharacterData()`: Save character data to localStorage

- `window.bannerUtils` (BannerUtils)
  - `verifyBannerItemNames()`: Verify and correct item names to match their filenames

- `window.gachaSystem` (GachaSystem)
  - `pull(bannerId)`: Perform a gacha pull
  - `roll()`: Calculate the rarity of a pull
  - `showPullAnimation(callback)`: Show pull animation
  - `showEffects(rarity)`: Show special effects for rare/epic pulls
  - `showResult(item)`: Display pull result

- `window.taskManager` (TaskManager)
  - `refreshTasks()`: Refresh task display
  - `updateTaskStatus(taskId, complete)`: Update task completion status

#### UI Components
- `window.header` (Header)
  - `updateDisplay()`: Update header display

- `window.inventory` (Inventory)
  - `openInventory()`: Open inventory panel
  - `updateDisplay()`: Update inventory display

- `window.characterSelect` (CharacterSelect)
  - `render()`: Render character selection UI
  - `#renderCharacterPreview(char)`: Render character preview

- `window.characterDisplay` (CharacterDisplay)
  - `updateDisplay(element)`: Update character display

- `window.adminPanel` (AdminPanel)
  - `open()`: Open admin panel
  - `close()`: Close admin panel

- `window.taskbar` (Taskbar)
  - `init(inventory, adminPanel, characterSelect, gachaSystem)`: Initialize taskbar
  - `startClock()`: Start the system clock
  - `updateAdminButtonVisibility()`: Toggle admin button visibility based on character type

#### Event System
- `window.game.eventSystem.dispatch(event, data)`: Dispatch custom events
  - Common events:
    - `characterSelected`: When a character is selected
    - `characterChanged`: When the current character changes
    - `currencyUpdated`: When currency is updated
    - `pointsUpdated`, `coinsUpdated`: When specific currency types are updated
    - `tasksUpdated`: When tasks are updated
    - `inventoryUpdated`: When inventory is updated

### Window System
The application uses a unified window system for all modal dialogs and panels. The window system is defined in `windows.css` and provides consistent styling and behavior across all windows.

#### Base Window Components
- `.window-overlay`: The full-screen backdrop with blur effect
- `.window-container`: The main window container with consistent styling
- `.window-header`: Standard header layout for all windows
- `.window-title`: Consistent title styling
- `.window-close-btn`: Standard close button with hover effects
- `.window-content`: Scrollable content area with custom scrollbar

#### Window Features
- Consistent positioning and animations
- Responsive design for all screen sizes
- Custom scrollbar styling
- Blur effect backdrop
- Hover animations
- Kid mode support with special styling

### Dependencies
- No external libraries required
- Pure JavaScript implementation
- Local storage for data persistence

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No server required - runs directly from file system
- No ES6 modules - uses traditional script loading

## Development Guidelines

### Code Style
- Use traditional JavaScript (no ES6 modules)
- Classes and functions should be globally accessible
- Follow the established file structure
- Maintain consistent naming conventions
- Keep components focused and minimal

### Migration Features
- Automatic migration from the legacy clothing system to the new categorized system
- Intelligent categorization of existing items based on name matching
- Support for both new and migrated items
- Seamless transition for users without data loss

### Adding New Features
1. Create necessary CSS files
2. Add JavaScript files in the correct order
3. Update index.html with new script tags
4. Ensure global scope accessibility
5. Update README.md with new features

### Kid Mode Customizations
- Kid mode automatically activates when a kid character is selected
- UI elements use child-friendly styling with Comic Sans font and vibrant colors
- Certain advanced features are hidden in kid mode for simplicity:
  - Admin panel is completely hidden from the start menu
  - Complex filter buttons are hidden
  - Character controls are simplified
  - Rarity indicators are hidden

### Testing
- Test in multiple browsers
- Verify local storage functionality
- Check character persistence
- Validate gacha mechanics
- Test task system rewards
- Verify currency system functionality
- Test responsive design
- Verify kid mode functionality and appropriate feature hiding

## License
This project is for household use only. Not for commercial distribution.
