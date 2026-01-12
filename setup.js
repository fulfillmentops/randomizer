// State management
let participants = [];
let selectedMode = null;
let preselectedParticipantId = null;

// DOM elements
const modeCards = document.querySelectorAll('.mode-card');
const riggedSetup = document.getElementById('riggedSetup');
const preselectedChoice = document.getElementById('preselectedChoice');
const continueBtn = document.getElementById('continueBtn');

// Initialize
function init() {
    loadParticipants();
    populateRiggedDropdown();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    modeCards.forEach(card => {
        card.addEventListener('click', () => {
            selectMode(card.dataset.mode);
        });
    });

    preselectedChoice.addEventListener('change', (e) => {
        preselectedParticipantId = e.target.value ? parseInt(e.target.value) : null;
        updateContinueButton();
    });

    continueBtn.addEventListener('click', () => {
        if (selectedMode === 'rigged' && !preselectedParticipantId) {
            alert('Please select a participant for preset selection');
            return;
        }
        saveSettings();
        window.location.href = 'randomizer.html';
    });
}

// Select mode
function selectMode(mode) {
    selectedMode = mode;
    
    // Update UI
    modeCards.forEach(card => {
        if (card.dataset.mode === mode) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // Show/hide rigged options
    if (mode === 'rigged') {
        riggedSetup.style.display = 'block';
    } else {
        riggedSetup.style.display = 'none';
        preselectedParticipantId = null;
    }

    updateContinueButton();
}

// Update continue button state
function updateContinueButton() {
    if (selectedMode === 'rigged') {
        continueBtn.disabled = !preselectedParticipantId;
    } else {
        continueBtn.disabled = !selectedMode;
    }
}

// Load participants from TeamPictures folder
function loadParticipantsFromFolder() {
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

    function getNameFromFilename(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    participants = imageFiles.map((filename, index) => {
        const name = getNameFromFilename(filename);
        return {
            id: index + 1,
            name: name,
            imageUrl: `TeamPictures/${filename}`
        };
    });
}

function loadParticipants() {
    loadParticipantsFromFolder();
}

// Populate rigged dropdown
function populateRiggedDropdown() {
    preselectedChoice.innerHTML = '<option value="">Select a participant...</option>' +
        participants.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        mode: selectedMode,
        preselectedParticipantId: preselectedParticipantId,
        participants: participants
    };
    localStorage.setItem('randomizerSettings', JSON.stringify(settings));
}

// Initialize app
init();

