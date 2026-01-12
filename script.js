// State management
let participants = [];
let isSelecting = false;
let animationInterval = null;

// DOM elements
const nameInput = document.getElementById('nameInput');
const imageInput = document.getElementById('imageInput');
const addBtn = document.getElementById('addBtn');
const participantsContainer = document.getElementById('participantsContainer');
const countSpan = document.getElementById('count');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const riggedOptions = document.getElementById('riggedOptions');
const preselectedChoice = document.getElementById('preselectedChoice');
const selectBtn = document.getElementById('selectBtn');
const animationArea = document.getElementById('animationArea');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const resultName = document.getElementById('resultName');
const resetBtn = document.getElementById('resetBtn');

// Initialize
function init() {
    loadParticipants();
    updateUI();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addParticipant);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });
    imageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });

    modeRadios.forEach(radio => {
        radio.addEventListener('change', handleModeChange);
    });

    selectBtn.addEventListener('click', startSelection);
    resetBtn.addEventListener('click', resetSelection);
}

// Add participant
function addParticipant() {
    const name = nameInput.value.trim();
    const imageUrl = imageInput.value.trim();

    if (!name) {
        alert('Please enter a name');
        return;
    }

    const participant = {
        id: Date.now(),
        name: name,
        imageUrl: imageUrl || null
    };

    participants.push(participant);
    nameInput.value = '';
    imageInput.value = '';
    
    saveParticipants();
    updateUI();
}

// Remove participant
function removeParticipant(id) {
    participants = participants.filter(p => p.id !== id);
    saveParticipants();
    updateUI();
}

// Update UI
function updateUI() {
    countSpan.textContent = participants.length;
    
    // Update participants list
    if (participants.length === 0) {
        participantsContainer.innerHTML = '<div class="empty-state">No participants added yet</div>';
    } else {
        participantsContainer.innerHTML = participants.map(p => `
            <div class="participant-card">
                ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="participant-image" onerror="this.style.display='none'">` : '<div class="participant-image" style="background: #667eea; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">' + p.name.charAt(0).toUpperCase() + '</div>'}
                <span class="participant-name">${p.name}</span>
                <button class="remove-btn" onclick="removeParticipant(${p.id})">×</button>
            </div>
        `).join('');
    }

    // Update preselected choice dropdown
    preselectedChoice.innerHTML = '<option value="">Select a participant...</option>' +
        participants.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    // Enable/disable select button
    selectBtn.disabled = participants.length === 0 || isSelecting;
}

// Handle mode change
function handleModeChange() {
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    if (selectedMode === 'rigged') {
        riggedOptions.style.display = 'block';
    } else {
        riggedOptions.style.display = 'none';
    }
}

// Start selection process
function startSelection() {
    if (participants.length === 0 || isSelecting) return;

    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    let selectedParticipant;

    if (selectedMode === 'rigged') {
        const preselectedId = parseInt(preselectedChoice.value);
        if (!preselectedId) {
            alert('Please select a participant for preset selection');
            return;
        }
        selectedParticipant = participants.find(p => p.id === preselectedId);
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

// Animate selection with suspense
function animateSelection(items, selectedParticipant) {
    let iteration = 0;
    const totalIterations = 50; // Number of animation cycles
    const duration = 2000; // Total duration in ms
    const intervalTime = duration / totalIterations;

    // Remove all highlights first
    items.forEach(item => item.classList.remove('highlight'));

    animationInterval = setInterval(() => {
        // Move all items randomly
        items.forEach(item => {
            const newX = Math.random() * (animationArea.offsetWidth - 150);
            const newY = Math.random() * (animationArea.offsetHeight - 100);
            item.style.left = newX + 'px';
            item.style.top = newY + 'px';
        });

        // Gradually slow down and highlight the selected item more frequently
        if (iteration > totalIterations * 0.7) {
            // In the last 30% of iterations, highlight the selected item more often
            if (Math.random() > 0.3) {
                items.forEach(item => {
                    if (parseInt(item.dataset.id) === selectedParticipant.id) {
                        item.classList.add('highlight');
                    } else {
                        item.classList.remove('highlight');
                    }
                });
            }
        }

        iteration++;

        if (iteration >= totalIterations) {
            clearInterval(animationInterval);
            // Final highlight
            items.forEach(item => {
                item.classList.remove('highlight');
                if (parseInt(item.dataset.id) === selectedParticipant.id) {
                    item.classList.add('highlight');
                    // Center the selected item
                    item.style.left = (animationArea.offsetWidth / 2 - 75) + 'px';
                    item.style.top = (animationArea.offsetHeight / 2 - 50) + 'px';
                } else {
                    // Fade out other items
                    item.style.opacity = '0.3';
                }
            });

            // Show result after a brief delay
            setTimeout(() => {
                showResult(selectedParticipant);
            }, 500);
        }
    }, intervalTime);
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
        clearInterval(animationInterval);
        animationInterval = null;
    }
    isSelecting = false;
    selectBtn.disabled = participants.length === 0;
}

// Load participants from TeamPictures folder
function loadParticipantsFromFolder() {
    // List of image files in TeamPictures folder
    const imageFiles = [
        'Branden.jpeg',
        'Chavis.jpeg',
        'David.jpg',
        'De\'Andre.jpeg',
        'Destin.jpg',
        'Doug.png',
        'Hayley.jpg',
        'James.png',
        'Karla.jpg',
        'Kelvin.png',
        'Kim.jpg',
        'Mandi.png',
        'Nicole.JPG',
        'Ren.jpeg',
        'Rich.jpg',
        'Sergio.png',
        'Sharon.png',
        'Sondrea.jpg',
        'Steven.jpg',
        'Toby.jpg',
        'Tom.jpg',
        'Troy.jpg',
        'Tyler.jpg',
        'Zeb.jpeg'
    ];

    // Extract name from filename (remove extension)
    function getNameFromFilename(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    // Create participants from image files
    participants = imageFiles.map((filename, index) => {
        const name = getNameFromFilename(filename);
        return {
            id: index + 1, // Use index-based ID for consistency
            name: name,
            imageUrl: `TeamPictures/${filename}`
        };
    });
}

// Save/Load participants from localStorage
function saveParticipants() {
    localStorage.setItem('participants', JSON.stringify(participants));
}

function loadParticipants() {
    // First, try to load from TeamPictures folder
    loadParticipantsFromFolder();
    
    // Optionally, you could check localStorage first and only load from folder if empty
    // const saved = localStorage.getItem('participants');
    // if (saved) {
    //     participants = JSON.parse(saved);
    // } else {
    //     loadParticipantsFromFolder();
    // }
}

// Make removeParticipant available globally for onclick handlers
window.removeParticipant = removeParticipant;

// Initialize app
init();

