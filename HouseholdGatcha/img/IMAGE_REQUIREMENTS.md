# Image Requirements and Issues

## Required Image Specifications
- All images MUST be exactly 200x400 pixels
- All images MUST use PNG format with transparency
- All images MUST be properly layered according to z-index values

## Missing Images
1. Banner Backgrounds:
   - `img/banners/kids-fashion-banner/adult_kids_banner.png`

2. Achievement Rewards:
   - `img/banners/achievements/FashionCrown.png` (exists but empty)
   - `img/banners/achievements/MissionBadge.png` (exists but empty)

## Image Cleanup Needed
1. Remove backup files (files ending with ~):
   - `img/banners/kids-fashion-banner/BlackBrimHat.png~`
   - `img/banners/kids-fashion-banner/Mustachio.png~`
   - `img/banners/hat-stand-banner/RareBowlerHat.png~`
   - `img/banners/hat-stand-banner/BowlerHat.png~`

## Z-Index Layer Order
1. Background (z-index: 0)
2. Base player (z-index: 1)
3. Clothing (z-index: 2)
4. Bottom/pants (z-index: 3)
5. Top/shirt (z-index: 4)
6. Shoes (z-index: 5)
7. Accessories (z-index: 6)
8. Headwear (z-index: 10)

## Directory Structure
```
img/
├── banners/
│   ├── achievements/
│   ├── kids-fashion-banner/
│   ├── hat-stand-banner/
│   └── kids-corner-banner/
├── raw/
│   ├── characters/
│   ├── items/
│   └── backgrounds/
└── Player.png
``` 