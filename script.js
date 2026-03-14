// Configuration: The Secret Targets
// This maps keyboard shortcuts to specific gifts/people
const secretTargets = {
    "01": { name: "박지윤", number: "1" },
    "02": { name: "김효정", number: "2" },
    "03": { name: "오재현", number: "3" },
    "04": { name: "김민혁", number: "4" },
    "05": { name: "송서우", number: "5" },
    "06": { name: "이아민", number: "6" },
    "07": { name: "김혜원", number: "7" },
    "08": { name: "오준우", number: "8" },
    "09": { name: "서다은", number: "9" },
    "10": { name: "서희원", number: "10" },
    "11": { name: "서찬영", number: "11" },
    "12": { name: "이지호", number: "12" }
};

// Fallback gifts for normal random draws (when no secret code is used)
const randomGifts = [];
for (let i = 1; i <= 12; i++) {
    randomGifts.push({ name: "랜덤 뽑기", number: i.toString() });
}

// State
let currentSecretKeys = "";
let activeTarget = null; // Will hold the target object if a secret code is matched
let isDrawing = false;
let currentSelectedBox = null; // Keep track of the currently selected box
let drawnNumbers = new Set(); // Keep track of numbers that have already been drawn

// DOM Elements
const gridContainer = document.getElementById("grid-container");
const secretIndicator = document.getElementById("secret-indicator");
const resultModal = document.getElementById("result-modal");
const winnerNameEl = document.getElementById("winner-name");
const giftIconEl = document.getElementById("gift-icon");
const giftDescriptionEl = document.getElementById("gift-description");
const closeModalBtn = document.getElementById("close-modal-btn");

// 1. Initialize the 12 Grid Boxes
function initGrid() {
    for (let i = 1; i <= 12; i++) {
        const box = document.createElement("div");
        box.className = "gift-box";
        box.innerHTML = `
            <img src="mystery-box.jpeg" alt="Gift Box" class="box-image">
        `;

        // Add click listener
        box.addEventListener("click", () => handleBoxClick(box));
        gridContainer.appendChild(box);
    }
}

// 2. Listen for the Secret Keyboard Hotkeys
document.addEventListener("keydown", (e) => {
    // Only listen if we are not currently drawing
    if (isDrawing || !resultModal.classList.contains("hidden")) return;

    // Build the secret key string (keep last 2 characters)
    currentSecretKeys += e.key.toLowerCase();
    if (currentSecretKeys.length > 2) {
        currentSecretKeys = currentSecretKeys.slice(-2);
    }

    // Check if the 2-letter code matches any in our secretTargets
    if (secretTargets[currentSecretKeys]) {
        // Ensure this secret number hasn't been drawn yet
        if (!drawnNumbers.has(secretTargets[currentSecretKeys].number)) {
            activeTarget = secretTargets[currentSecretKeys];
            // Turn on the tiny 1px indicator to show the MC the trick is set
            secretIndicator.classList.add("active");
        }

        // Optional: Reset keys after match
        currentSecretKeys = "";
    }
});

// 3. Handle Box Selection (The Trick Execution)
function handleBoxClick(selectedBox) {
    if (isDrawing) return;
    isDrawing = true;

    // Dim all boxes
    const allBoxes = document.querySelectorAll(".gift-box");
    allBoxes.forEach(b => {
        if (b !== selectedBox) {
            b.classList.add("dimmed");
        }
    });

    // Highlight selected box
    selectedBox.classList.add("selected");
    currentSelectedBox = selectedBox; // Store the selected box for later deletion

    // Clear the secret indicator immediately so it doesn't linger
    secretIndicator.classList.remove("active");

    // Add suspense delay
    setTimeout(() => {
        openModal(activeTarget);
    }, 1500); // 1.5 seconds suspense building
}

// 4. Show Result
function openModal(target) {
    let result = target;

    // If no secret target was set, just pick a random default gift to maintain the illusion
    if (!result) {
        const availableGifts = randomGifts.filter(g => !drawnNumbers.has(g.number));
        if (availableGifts.length > 0) {
            result = availableGifts[Math.floor(Math.random() * availableGifts.length)];
        }
    }

    if (result && result.number !== "끝") {
        drawnNumbers.add(result.number);
    }

    // Apply the trick: inject the target's data into the modal
    winnerNameEl.textContent = "축하합니다!";
    giftIconEl.textContent = result.number;
    giftDescriptionEl.textContent = "";

    // Show modal
    resultModal.classList.remove("hidden");

    // Play confetti/sound effects here if you want to extend it
}

// 5. Reset for the next person
closeModalBtn.addEventListener("click", () => {
    resultModal.classList.add("hidden");

    // Hide the box that was just opened
    if (currentSelectedBox) {
        currentSelectedBox.classList.remove("selected");
        currentSelectedBox.classList.add("hidden-box");
        currentSelectedBox = null;
    }

    // Reset Grid visuals
    const allBoxes = document.querySelectorAll(".gift-box:not(.hidden-box)");
    allBoxes.forEach(b => {
        b.classList.remove("dimmed");
    });

    // Reset State
    activeTarget = null;
    currentSecretKeys = "";
    isDrawing = false;
});

// Boot up
initGrid();
