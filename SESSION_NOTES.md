# Team Randomizer - Development Session Notes

## Overview
This document outlines the development of a Team Randomizer web application built during this session. The app allows users to randomly select participants from a pool of names and images, with an option for a "rigged" mode that appears random but selects a predetermined participant.

## Initial Requirements
- HTML-based web app for random selection
- Pool of names/images to select from
- Option for "rigged" mode (appears random but user preselects the winner)
- Animation displaying all images/names moving around the screen
- Suspenseful animation before landing on the final selection

## Development Timeline

### Phase 1: Initial Implementation
**Files Created:**
- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `script.js` - Core functionality

**Features Implemented:**
- Add participants manually with names and optional image URLs
- Two selection modes: Random and Preset (rigged)
- Suspense animation with items moving around screen
- Result display with selected participant's image and name
- LocalStorage persistence for participants

### Phase 2: Image Folder Integration
**Changes:**
- Modified code to automatically load images from `TeamPictures/` folder
- Extracted participant names from image filenames (removing extensions)
- Populated rigged selection dropdown with all participants from folder
- 24 participants automatically loaded:
  - Branden, Chavis, David, De'Andre, Destin, Doug, Hayley, James, Karla, Kelvin, Kim, Mandi, Nicole, Ren, Rich, Sergio, Sharon, Sondrea, Steven, Toby, Tom, Troy, Tyler, Zeb

### Phase 3: Two-Page Architecture
**Files Created:**
- `setup.html` - Setup/configuration page
- `setup.js` - Setup page logic
- `randomizer.html` - Main randomizer page
- `randomizer.js` - Randomizer functionality

**Changes:**
- Split application into two pages:
  1. **Setup Page**: User selects between Random or Preset mode
     - Visual mode cards with icons
     - Dropdown for selecting preset participant (if Preset mode)
     - "Continue to Randomizer" button
  2. **Randomizer Page**: Displays the animation and selection
     - "Start Randomizer!" button
     - Animation area
     - Result display
     - "Back to Setup" button for navigation
- Settings stored in localStorage between pages
- `index.html` updated to redirect to setup page

### Phase 4: Animation Improvements
**Enhancements:**
- Slowed down animation from 2 seconds to 5 seconds for more drama
- Implemented three-phase animation:
  - **Phase 1 (0-40%)**: Fast, chaotic movement
  - **Phase 2 (40-80%)**: Gradual slowdown, highlighting 1-2 candidates
  - **Phase 3 (80-100%)**: Final dramatic selection with pulsing effect
- Added candidate slowdown effect - animation appears to slow down on 1-2 participants before final selection
- Enhanced visual effects with pulsing glow animations

### Phase 5: Animation Smoothing
**Technical Improvements:**
- Replaced `setInterval` with `requestAnimationFrame` for smoother animations
- Implemented time-based animation using `performance.now()`
- Added easing functions:
  - `easeInOutCubic` - Smooth phase transitions
  - `easeOutCubic` - Final selection easing
  - `easeInOutQuad` - General movement easing
- Physics-based movement system with velocity vectors
- Smooth phase blending instead of abrupt transitions
- Candidate switching every 800ms with smooth transitions
- Proper cleanup using `cancelAnimationFrame`

### Phase 6: GitHub Deployment
**Setup:**
- Initialized git repository
- Created initial commit with all files (31 files total)
- Added remote: `https://github.com/fulfillmentops/randomizer.git`
- Set branch to `main`
- Pushed to GitHub
- Added `.nojekyll` file for GitHub Pages compatibility

## File Structure
```
Team-Randomizer/
├── index.html          # Redirects to setup.html
├── setup.html          # Setup/configuration page
├── setup.js            # Setup page logic
├── randomizer.html     # Main randomizer page
├── randomizer.js       # Randomizer functionality
├── styles.css          # All styling and animations
├── script.js           # (Legacy - not used in final version)
├── .nojekyll           # GitHub Pages compatibility
├── TeamPictures/       # Folder with 24 participant images
│   ├── Branden.jpeg
│   ├── Chavis.jpeg
│   ├── David.jpg
│   ├── De'Andre.jpeg
│   ├── Destin.jpg
│   ├── Doug.png
│   ├── Hayley.jpg
│   ├── James.png
│   ├── Karla.jpg
│   ├── Kelvin.png
│   ├── Kim.jpg
│   ├── Mandi.png
│   ├── Nicole.JPG
│   ├── Ren.jpeg
│   ├── Rich.jpg
│   ├── Sergio.png
│   ├── Sharon.png
│   ├── Sondrea.jpg
│   ├── Steven.jpg
│   ├── Toby.jpg
│   ├── Tom.jpg
│   ├── Troy.jpg
│   ├── Tyler.jpg
│   └── Zeb.jpeg
└── SESSION_NOTES.md    # This file
```

## Key Features

### Setup Page
- Visual mode selection cards
- Dropdown populated with all participants from TeamPictures folder
- Validation to ensure preset participant is selected before continuing

### Randomizer Page
- Smooth, dramatic 5-second animation
- Three-phase animation system:
  1. Fast chaotic movement
  2. Gradual slowdown with candidate highlighting
  3. Final dramatic selection
- Works identically for both random and rigged modes
- Result display with participant image and name
- "Select Again" functionality

### Technical Highlights
- **No external dependencies** - Pure HTML, CSS, and JavaScript
- **LocalStorage** - Settings and participants persist between sessions
- **Responsive design** - Works on desktop and mobile
- **Smooth animations** - requestAnimationFrame for 60fps animations
- **Easing functions** - Professional animation curves
- **GitHub Pages ready** - All relative paths, no external resources

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard web APIs (localStorage, requestAnimationFrame)
- No polyfills required

## Deployment
- Repository: `https://github.com/fulfillmentops/randomizer.git`
- Branch: `main`
- GitHub Pages compatible with `.nojekyll` file
- All paths are relative for easy deployment

## Future Enhancement Ideas
- Add sound effects during animation
- Multiple selection modes (select 2-3 participants)
- Custom animation speeds
- Export/import participant lists
- Statistics tracking (who was selected how many times)

## Notes
- All image paths use relative paths (`TeamPictures/filename`)
- Participant names extracted from filenames (extension removed)
- Animation works for both random and rigged modes identically
- Settings persist in localStorage between page navigations

