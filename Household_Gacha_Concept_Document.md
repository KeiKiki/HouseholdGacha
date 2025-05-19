# Household Gacha: Cosmetic Collection - Concept Document

## 1. Introduction
This document outlines the concept for a gacha-style game designed exclusively for our household. The game focuses solely on collecting currency (virtual and/or physical) and using it to pull for cosmetic items for personalized in-game characters. There is no core gameplay loop beyond the collection and customization aspects. The primary goal is to foster a sense of fun, friendly competition, and creative expression within the household.

## 2. Core Concept
- **Character Customization Focus**: The game revolves around each household member creating and customizing their own unique character.
- **Gacha System**: Cosmetic items for character customization are acquired through a gacha system, where players spend currency (earned in-game or through real-world tasks) for a random chance to receive items of varying rarities.
- **No Gameplay (Beyond Collection)**: There are no traditional gameplay mechanics like combat, puzzles, or resource management. The "game" is the process of collecting currency, pulling on banners, and styling your character.
- **Household-Exclusive**: This game is designed and played only within our household. There is no external interaction or online component.

## 3. Currency
- **Name**: To be decided (e.g., "Glimmer," "Sparkles," "House Points," "Credits"). **Decision:** Using `Currency Coins` in implementation.
- **Acquisition**:
  - **Household Chores**: Completing assigned household tasks earns currency. (Example: Doing the dishes = 10 Currency Coins)
  - **Achievements/Milestones**: Achieving pre-defined personal or household goals (e.g., reading a book, finishing a project, having a good deed day) earns currency. (Example: Finishing a book = 25 Currency Coins)
  - **Challenges/Competitions**: Organizing fun challenges or friendly competitions (e.g., board game nights, fitness challenges) can award currency to participants. (Example: Winning the boardgame = 30 Currency Coins)
  - **Random Events**: Implementing random events that award small amounts of currency (e.g., "Found Currency Coins on the floor!" +5 Currency Coins). This is good for some flavor and fun suprises.
- **Tracking**: A shared spreadsheet (Google Sheets or similar) or even a physical whiteboard can be used to track each player's currency balance.

## 4. Characters
- **Creation**: Each player creates their own character, potentially with a short backstory or personality.
- **Appearance**: Initial character appearance might be customizable to a limited extent before any gacha pulls, or a basic starting character can be provided for everyone.
- **Uniqueness**: Encourage players to create characters that represent them or express their creativity.

## 5. Gacha Banners
- **Banner Themes**: Banners will feature specific themes of cosmetic items (e.g., "Fantasy Adventure," "Cyberpunk," "Seasonal Holiday," "Formal Wear," "Pets").
- **Item Pool**: Each banner will have a defined pool of cosmetic items with varying rarities.
- **Pull Cost**: Each "pull" on a banner costs a certain amount of currency (e.g., 50 Currency Coins per pull).
- **Rarity System**:
  - **Common**: More frequently obtained. Simpler designs, less visually striking.
  - **Uncommon**: Less frequently obtained. More detailed designs.
  - **Rare**: Significantly less frequently obtained. Visually impressive, unique designs.
  - **Epic/Legendary (Optional)**: Extremely rare. Highly desirable, elaborate, and potentially animated cosmetic items.
- **Duplication Handling**:
  - **Conversion**: Duplicate items could be automatically converted into a small amount of currency.
- **Banner Rotation**: Banners will rotate on a defined schedule (e.g., weekly, bi-weekly, monthly) to keep the content fresh and interesting.

## 6. Cosmetic Items
- **Categories**:
  - **Headwear**: Hats, helmets, hair accessories.
  - **Clothing**: Shirts, pants, dresses, coats.
  - **Accessories**: Necklaces, earrings, bracelets, glasses.
  - **Weapons/Tools (Cosmetic Only)**: Swords, staffs, wands, gardening tools (held by the character but have no functional use).
  - **Backgrounds**: Customize the background behind the character.
  - **Pets/Companions (Cosmetic Only)**: Small pets that accompany the character.
- **Visual Style**: Maintain a consistent art style for all cosmetic items to ensure they look cohesive when mixed and matched. Consider a simple, cartoonish style that is easy to implement.

## 7. Display & Presentation
- **Character Viewer**: A simple interface (e.g., a website, a presentation, a shared drawing) to view and customize the characters.
- **Cosmetic Inventory**: A list or visual representation of all the cosmetic items each player has collected.
- **Sharing**: Encourage players to share their character creations with the household. Maybe even have themed "fashion shows" or character design contests.

## 8. Implementation (Technical Considerations)
- **Low-Tech Approach**:
  - **Spreadsheet for Currency Tracking**: Google Sheets is sufficient for this.
  - **Physical Drawing/Art**: Characters and cosmetics can be hand-drawn.
  - **Photoshop/GIMP for Digital Art (Optional)**: If someone in the household has the skills, digital art can be used.
  - **PowerPoint or Google Slides for Character Viewer**: A simple slideshow with images of characters and the ability to swap out cosmetic items.
- **Higher-Tech Approach (Optional)**:
  - **Simple Website**: A basic website can be created to track currency, display banners, and allow character customization.
  - **Custom Software (For Experienced Programmers)**: A more complex but ultimately more streamlined experience.

## 9. Social & Collaborative Elements
- **Sharing Creations**: Encourage players to share their character designs with each other.
- **Themed Events**: Organize themed events where players create characters based on a specific prompt.
- **Fashion Shows/Contests**: Have fun "fashion shows" where players showcase their characters and vote on the best designs.

## 10. Long-Term Considerations
- **New Banners & Items**: Regularly create new banners and cosmetic items to keep the game fresh and engaging.
- **Feedback & Adjustments**: Solicit feedback from household members and adjust the game mechanics (e.g., currency earning rates, rarity percentages) as needed.
- **"Seasons" or "Updates"**: Consider introducing major updates or "seasons" with new features, items, and themes.

## 11. Example Scenario
- **Household Member**: Alison
- **Task**: Alison does the dishes (earns 10 Currency Coins).
- **Pull on "Fantasy Adventure" Banner**: Alison spends 50 Currency Coins and pulls a "Common" item (a basic leather backpack) and a "Rare" item (a magical glowing amulet).
- Alison equips the backpack and amulet.
- Alison shares their updated look with the household.

## 12. Conclusion
This Household Gacha game aims to provide a fun, creative, and engaging activity for our household. By combining elements of character customization, gacha mechanics, and friendly competition, we can create a unique and personalized experience that strengthens our bonds and encourages creativity. The key is to keep it lighthearted, flexible, and tailored to the specific interests and preferences of our household members.

## Optional Features to Consider:
- **Achievement System**: Add in-game achievements for collecting items, equipping full sets, etc.
- **Daily Login Rewards**: Encourage regular play with currency rewards for logging in daily.
- **Cosmetic Effects**: Add animated effects as collectible cosmetic items (sparkles, auras, etc.).
- **Multiple Characters**: Allow players to create and customize multiple characters.

## Core Loop:
1. Player earns currency through gameplay (missions, achievements).
2. Player spends currency on gacha pulls for cosmetic items.
3. Player equips and combines cosmetic items for character customization.
4. Player completes missions to earn more currency.
5. Player shows off their character customization to others. 