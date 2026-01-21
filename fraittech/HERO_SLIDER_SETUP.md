# Hero Slider Implementation Guide

## Overview
The About page hero section has been converted to a responsive image slider with 3 slides that automatically rotate every 5 seconds. The slider is fully responsive and works perfectly on both desktop and mobile devices.

## Features
- ✅ Auto-rotating slider (5-second interval)
- ✅ Manual navigation with Previous/Next buttons
- ✅ Indicator dots for direct slide selection
- ✅ Smooth fade-in animations
- ✅ Fully responsive design
- ✅ Touch-friendly buttons
- ✅ Desktop & Mobile optimized

## Image Setup Instructions

### Required Images
You need to add 3 high-quality images to the `img/` folder with the following filenames:

1. **hero-slide-1.jpg** - About Us hero image
2. **hero-slide-2.jpg** - Team/Professional image
3. **hero-slide-3.jpg** - Mission/Growth image

### Image Specifications

**Recommended Dimensions:**
- Desktop: 1920 x 600 pixels (or wider)
- Minimum: 1200 x 400 pixels

**Format:** JPG or PNG (JPG recommended for file size)

**Aspect Ratio:** 16:9 is ideal for desktop, but the slider will work with any ratio due to `object-fit: cover`

**File Size:** Keep images under 500KB each for optimal performance (compressed JPG recommended)

### Image Placement
1. Save your 3 images as:
   - `img/hero-slide-1.jpg`
   - `img/hero-slide-2.jpg`
   - `img/hero-slide-3.jpg`

2. The images will automatically be referenced in the slider HTML

## How the Slider Works

### Auto-Play
- Slides automatically change every 5 seconds
- Auto-play resets when you manually navigate

### Navigation
- **Left/Right Buttons**: Click the arrow buttons to move between slides
- **Indicator Dots**: Click any dot at the bottom to jump to that specific slide
- **Keyboard**: You can also use left/right arrow keys by adding keyboard event listeners if desired

### Responsive Behavior

**Desktop (992px and above)**
- Hero height: 600px
- H1 font size: 3.5rem

**Tablets (768px - 991px)**
- Hero height: 500px
- H1 font size: 2.5rem

**Mobile (576px - 767px)**
- Hero height: 400px
- H1 font size: 2rem

**Small Mobile (below 576px)**
- Hero height: 300px
- H1 font size: 1.5rem

## Customization Options

### Change Auto-Play Duration
Edit `js/main.js` line ~61:
```javascript
}, 5000); // Change 5000 to milliseconds you want (e.g., 7000 for 7 seconds)
```

### Change Slider Height
Edit `css/style.css` in `.hero-slider-container`:
```css
.hero-slider-container {
    height: 600px; /* Adjust this value */
}
```

### Change Overlay Color/Opacity
Edit `css/style.css` in `.hero-overlay`:
```css
.hero-overlay {
    background: rgba(112, 180, 233, 0.5); /* RGBA = Red, Green, Blue, Alpha(0-1) */
}
```

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Internet Explorer 11+ (basic support)

## Performance Tips
1. Compress images using online tools (TinyPNG, ImageOptim)
2. Use JPG for photos, PNG for graphics
3. Consider WebP format for even smaller file sizes (with JPG fallback)
4. Lazy load images if needed for very large portfolios

## Files Modified
- `about.html` - Updated hero section to slider
- `css/style.css` - Added slider CSS styles
- `js/main.js` - Added slider JavaScript functionality

## Notes
- The slider uses vanilla JavaScript (no jQuery required for slider)
- All existing navbar and page functionality remains unchanged
- The slider automatically adjusts to different screen sizes
- Images use `object-fit: cover` to maintain aspect ratio while filling the container
