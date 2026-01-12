// State management
let participants = [];
let selectedMode = null;
let preselectedParticipantId = null;
let isSelecting = false;
let animationInterval = null;

// DOM elements
const modeSubtitle = document.getElementById('modeSubtitle');
const backBtn = document.getElementById('backBtn');
const selectBtn = document.getElementById('selectBtn');
const animationArea = document.getElementById('animationArea');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const resultName = document.getElementById('resultName');
const resetBtn = document.getElementById('resetBtn');

// Initialize
function init() {
    loadSettings();
    if (!selectedMode) {
        // If no settings found, redirect to setup
        window.location.href = 'setup.html';
        return;
    }
    updateUI();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    backBtn.addEventListener('click', () => {
        window.location.href = 'setup.html';
    });
    selectBtn.addEventListener('click', startSelection);
    resetBtn.addEventListener('click', resetSelection);
}

// Load settings from localStorage
function loadSettings() {
    const settingsJson = localStorage.getItem('randomizerSettings');
    if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        selectedMode = settings.mode;
        preselectedParticipantId = settings.preselectedParticipantId;
        participants = settings.participants || [];
    }
}

// Update UI
function updateUI() {
    if (selectedMode === 'rigged') {
        modeSubtitle.textContent = 'Preset Selection Mode';
    } else {
        modeSubtitle.textContent = 'Random Selection Mode';
    }
    
    selectBtn.disabled = participants.length === 0 || isSelecting;
}

// Start selection process
function startSelection() {
    if (participants.length === 0 || isSelecting) return;

    let selectedParticipant;

    if (selectedMode === 'rigged') {
        if (!preselectedParticipantId) {
            alert('No participant selected for preset selection');
            return;
        }
        selectedParticipant = participants.find(p => p.id === preselectedParticipantId);
    } else {
        // Random selection
        const randomIndex = Math.floor(Math.random() * participants.length);
        selectedParticipant = participants[randomIndex];
    }

    isSelecting = true;
    selectBtn.disabled = true;
    resultSection.style.display = 'none';
    animationArea.classList.add('active');
    animationArea.innerHTML = '';

    // Create animated items
    const items = participants.map(p => createAnimatedItem(p));
    items.forEach(item => animationArea.appendChild(item));

    // Start animation
    animateSelection(items, selectedParticipant);
}

// Create animated item element
function createAnimatedItem(participant) {
    const item = document.createElement('div');
    item.className = 'animated-item';
    item.dataset.id = participant.id;

    const img = participant.imageUrl 
        ? `<img src="${participant.imageUrl}" alt="${participant.name}" onerror="this.parentElement.innerHTML='<div style=\\'width:60px;height:60px;background:#667eea;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;\\'>${participant.name.charAt(0).toUpperCase()}</div>'">`
        : `<div style="width:60px;height:60px;background:#667eea;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">${participant.name.charAt(0).toUpperCase()}</div>`;
    
    item.innerHTML = img + `<span class="name">${participant.name}</span>`;

    // Random initial position
    item.style.left = Math.random() * (animationArea.offsetWidth - 150) + 'px';
    item.style.top = Math.random() * (animationArea.offsetHeight - 100) + 'px';

    return item;
}

// Easing functions for smooth transitions
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Animate selection with suspense
function animateSelection(items, selectedParticipant) {
    const duration = 5000; // 5 seconds total duration
    const startTime = performance.now();
    let animationFrameId = null;
    
    // Remove all highlights first
    items.forEach(item => {
        item.classList.remove('highlight');
        item.style.transition = '';
        item.style.opacity = '1';
        item.style.transform = '';
    });

    // Pick 1-2 candidates to slow down on (always include the selected one)
    const candidates = [selectedParticipant];
    if (items.length > 2 && Math.random() > 0.5) {
        // Sometimes add one more random candidate for extra drama
        const otherItems = items.filter(item => 
            parseInt(item.dataset.id) !== selectedParticipant.id
        );
        if (otherItems.length > 0) {
            const randomItem = otherItems[Math.floor(Math.random() * otherItems.length)];
            const randomCandidateId = parseInt(randomItem.dataset.id);
            const randomCandidate = participants.find(p => p.id === randomCandidateId);
            if (randomCandidate) {
                candidates.push(randomCandidate);
            }
        }
    }

    // Store initial positions and velocities for smooth movement
    const itemData = items.map(item => ({
        element: item,
        id: parseInt(item.dataset.id),
        x: parseFloat(item.style.left) || Math.random() * (animationArea.offsetWidth - 150),
        y: parseFloat(item.style.top) || Math.random() * (animationArea.offsetHeight - 100),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        targetX: null,
        targetY: null
    }));

    let currentCandidateIndex = 0;
    let lastCandidateSwitchTime = 0;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth phase transitions using easing
        let phase1Progress, phase2Progress, phase3Progress;
        
        if (progress < 0.4) {
            // Phase 1: Fast and chaotic (0-40%)
            phase1Progress = progress / 0.4;
            phase2Progress = 0;
            phase3Progress = 0;
        } else if (progress < 0.8) {
            // Phase 2: Slowing down (40-80%)
            phase1Progress = 1;
            phase2Progress = (progress - 0.4) / 0.4;
            phase3Progress = 0;
        } else {
            // Phase 3: Final dramatic selection (80-100%)
            phase1Progress = 1;
            phase2Progress = 1;
            phase3Progress = (progress - 0.8) / 0.2;
        }

        // Apply smooth easing to phase transitions
        const easedPhase2 = easeInOutCubic(phase2Progress);
        const easedPhase3 = easeOutCubic(phase3Progress);

        // Calculate movement speed based on phase
        let baseSpeed;
        if (progress < 0.4) {
            baseSpeed = 200 * (1 - easeInOutQuad(phase1Progress) * 0.3); // Start fast, slightly slow
        } else if (progress < 0.8) {
            const slowdownFactor = 1 - easedPhase2; // Goes from 1 to 0
            baseSpeed = 140 * slowdownFactor + 20; // Gradually slow down
        } else {
            baseSpeed = 10 * (1 - easedPhase3); // Very slow in final phase
        }

        // Update candidate highlighting in phase 2
        if (progress >= 0.4 && progress < 0.8) {
            const candidateSwitchInterval = 800; // Switch candidates every 800ms
            if (currentTime - lastCandidateSwitchTime > candidateSwitchInterval) {
                lastCandidateSwitchTime = currentTime;
                if (currentCandidateIndex < candidates.length - 1) {
                    currentCandidateIndex++;
                } else {
                    // Loop back to first candidate (selected participant)
                    currentCandidateIndex = 0;
                }
            }
        } else if (progress >= 0.8) {
            // In final phase, always highlight selected participant
            currentCandidateIndex = 0;
        }

        const currentCandidate = candidates[currentCandidateIndex];
        const centerX = (animationArea.offsetWidth / 2) - 75;
        const centerY = (animationArea.offsetHeight / 2) - 50;

        // Update each item
        itemData.forEach(data => {
            const isSelected = data.id === selectedParticipant.id;
            const isCurrentCandidate = data.id === currentCandidate.id;
            
            if (progress < 0.4) {
                // Phase 1: Fast random movement
                data.vx += (Math.random() - 0.5) * 0.5;
                data.vy += (Math.random() - 0.5) * 0.5;
                data.vx = Math.max(-8, Math.min(8, data.vx));
                data.vy = Math.max(-8, Math.min(8, data.vy));
                
                data.x += data.vx * baseSpeed * 0.1;
                data.y += data.vy * baseSpeed * 0.1;
                
                // Bounce off walls
                if (data.x < 0 || data.x > animationArea.offsetWidth - 150) {
                    data.vx *= -0.8;
                    data.x = Math.max(0, Math.min(animationArea.offsetWidth - 150, data.x));
                }
                if (data.y < 0 || data.y > animationArea.offsetHeight - 100) {
                    data.vy *= -0.8;
                    data.y = Math.max(0, Math.min(animationArea.offsetHeight - 100, data.y));
                }
                
                data.element.classList.remove('highlight');
                data.element.style.transition = 'all 0.08s ease-out';
            } else if (progress < 0.8) {
                // Phase 2: Slow down and highlight candidates
                const slowdownEase = easedPhase2;
                
                if (isCurrentCandidate) {
                    data.element.classList.add('highlight');
                    // Candidate moves slowly, slightly towards center
                    const targetX = centerX + (Math.random() - 0.5) * 100;
                    const targetY = centerY + (Math.random() - 0.5) * 100;
                    data.x += (targetX - data.x) * 0.05 * (1 - slowdownEase * 0.5);
                    data.y += (targetY - data.y) * 0.05 * (1 - slowdownEase * 0.5);
                    data.element.style.transition = `all ${0.15 + slowdownEase * 0.25}s ease-out`;
                } else {
                    data.element.classList.remove('highlight');
                    // Other items slow down and move less
                    data.vx *= 0.95;
                    data.vy *= 0.95;
                    data.x += data.vx * baseSpeed * 0.05 * (1 - slowdownEase);
                    data.y += data.vy * baseSpeed * 0.05 * (1 - slowdownEase);
                    data.element.style.transition = `all ${0.15 + slowdownEase * 0.25}s ease-out`;
                }
            } else {
                // Phase 3: Final dramatic selection
                if (isSelected) {
                    data.element.classList.add('highlight');
                    // Smoothly move to center
                    data.x += (centerX - data.x) * 0.15;
                    data.y += (centerY - data.y) * 0.15;
                    
                    // Pulsing effect
                    const pulseScale = 1.1 + Math.sin(easedPhase3 * Math.PI * 6) * 0.15;
                    data.element.style.transform = `scale(${pulseScale})`;
                    data.element.style.transition = 'all 0.2s ease-out';
                } else {
                    data.element.classList.remove('highlight');
                    // Fade out smoothly
                    data.element.style.opacity = (1 - easedPhase3 * 0.8).toString();
                    data.element.style.transition = 'all 0.3s ease-out';
                }
            }
            
            // Apply position
            data.x = Math.max(0, Math.min(animationArea.offsetWidth - 150, data.x));
            data.y = Math.max(0, Math.min(animationArea.offsetHeight - 100, data.y));
            data.element.style.left = data.x + 'px';
            data.element.style.top = data.y + 'px';
        });

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Final dramatic reveal
            itemData.forEach(data => {
                if (data.id === selectedParticipant.id) {
                    data.element.classList.add('highlight');
                    data.element.style.left = centerX + 'px';
                    data.element.style.top = centerY + 'px';
                    data.element.style.transform = 'scale(1.2)';
                    data.element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                } else {
                    data.element.style.opacity = '0.2';
                    data.element.style.transition = 'all 0.5s ease-out';
                }
            });

            // Show result after a dramatic delay
            setTimeout(() => {
                showResult(selectedParticipant);
            }, 800);
        }
    }

    animationFrameId = requestAnimationFrame(animate);
    animationInterval = animationFrameId; // Store for cleanup
}

// Show result
function showResult(participant) {
    animationArea.classList.remove('active');
    resultSection.style.display = 'block';
    
    if (participant.imageUrl) {
        resultImage.src = participant.imageUrl;
        resultImage.style.display = 'block';
        resultImage.onerror = () => {
            resultImage.style.display = 'none';
        };
    } else {
        resultImage.style.display = 'none';
    }
    
    resultName.textContent = participant.name;
    isSelecting = false;
    selectBtn.disabled = false;
}

// Reset selection
function resetSelection() {
    resultSection.style.display = 'none';
    animationArea.classList.remove('active');
    animationArea.innerHTML = '';
    if (animationInterval) {
        cancelAnimationFrame(animationInterval);
        animationInterval = null;
    }
    isSelecting = false;
    selectBtn.disabled = participants.length === 0;
}

// Initialize app
init();

