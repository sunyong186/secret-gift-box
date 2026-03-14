// Configuration: The Secret Targets
// This maps keyboard shortcuts to specific gifts/people
const secretTargets = {
    // Example: typing 'hg' sets the target to Hong Gil-dong receiving a Starbucks Gift Card
    "hg": { name: "홍길동", giftIcon: "☕️", giftText: "스타벅스 5만원 상품권" },
    "kc": { name: "김철수", giftIcon: "🥩", giftText: "한우 등심 세트" },
    "yj": { name: "이영자", giftIcon: "✈️", giftText: "제주도 왕복 항공권" },
    // Add up to 15 real people here.
    // ...
};

// Fallback gifts for normal random draws (when no secret code is used)
const randomGifts = [
    { name: "랜덤 뽑기", giftIcon: "🍬", giftText: "츄파춥스 사탕" },
    { name: "랜덤 뽑기", giftIcon: "🍿", giftText: "영화 관람권 1매" },
    { name: "랜덤 뽑기", giftIcon: "☕️", giftText: "아메리카노 쿠폰" },
    { name: "랜덤 뽑기", giftIcon: "🍫", giftText: "가나 초콜릿" }
];

// State
let currentSecretKeys = "";
let activeTarget = null; // Will hold the target object if a secret code is matched
let isDrawing = false;
let currentSelectedBox = null; // Keep track of the currently selected box

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
            <div class="box-icon">🎁</div>
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
        activeTarget = secretTargets[currentSecretKeys];
        // Turn on the tiny 1px indicator to show the MC the trick is set
        secretIndicator.classList.add("active");
        
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
        result = randomGifts[Math.floor(Math.random() * randomGifts.length)];
    }

    // Apply the trick: inject the target's data into the modal
    winnerNameEl.textContent = result.name === "랜덤 뽑기" ? "축하합니다!" : `${result.name}님 당첨!`;
    giftIconEl.textContent = result.giftIcon;
    giftDescriptionEl.textContent = result.giftText;

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
