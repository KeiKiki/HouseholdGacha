// Banner utilities for verifying and correcting item names
(function() {
    // Create a function to verify and correct banner item names
    function verifyBannerItemNames() {
        const itemNameMap = {
            // Adults Banner
            'BlondBowBob.png': 'Blond Bow Bob',
            'BlackBrimHat.png': 'Black Brim Hat',
            'GreenTankTop.png': 'Green Tank Top',
            'WoolSkirt.png': 'Wool Skirt',
            'Mustachio.png': 'Mustachio',
            'BlueBelleDress.png': 'Blue Belle Dress',
            'Clownsgh.png': 'Clown Shoes',
            'Tie.png': 'Tie',
            
            // Kids Banner
            'BlackHeeledBoots.png': 'Black Heeled Boots',
            'FlowerShirt.png': 'Flower Shirt',
            'OrangeOnesie.png': 'Orange Onesie',
            'RainbowPigtails.png': 'Rainbow Pigtails',
            'WizardHat.png': 'Wizard Hat',
            'BlackSkirt.png': 'Black Skirt',
            
            // Hat Stand Banner
            'BowlerHat.png': 'Bowler Hat', 
            'RareBowlerHat.png': 'Rare Bowler Hat'
        };
        
        console.log('Verifying banner item names...');
        let correctionsMade = 0;
        
        // Check each banner and its items
        window.bannerData.forEach(banner => {
            banner.items.forEach(item => {
                // Extract the filename from the image path
                const filename = item.imagePath.split('/').pop();
                
                // Check if the filename has an entry in our map
                if (itemNameMap[filename]) {
                    // Compare item name with the correct name from map
                    if (item.name !== itemNameMap[filename]) {
                        console.log(`Mismatch found: Item "${item.id}" has name "${item.name}" but should be "${itemNameMap[filename]}" based on filename "${filename}"`);
                        // Correct the name
                        item.name = itemNameMap[filename];
                        correctionsMade++;
                    }
                } else {
                    console.log(`Warning: No mapping found for file "${filename}"`);
                }
            });
        });
        
        console.log(`Banner item name verification complete. Corrections made: ${correctionsMade}`);
        return correctionsMade;
    }

    // Expose the function to the global scope
    window.bannerUtils = {
        verifyBannerItemNames: verifyBannerItemNames
    };
})(); 