// DECLARING
let score = 0;
let selectedTiles = [];
let time = 30;
let timerEl = document.getElementById("timer");
let backgroundMusic;
let interval; 

// INITIALIZE MUSIC WHEN PAGE LOADS
window.addEventListener('load', function() {
    console.log("Page loaded!");
    backgroundMusic = document.getElementById("backgroundMusic");
    
    if (backgroundMusic) {
        console.log("Background music element found:", backgroundMusic.src);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        
        // Test if the audio file can load
        backgroundMusic.addEventListener('canplaythrough', () => {
            console.log("Audio file loaded successfully!");
        });
        
        backgroundMusic.addEventListener('error', (e) => {
            console.error("Audio file failed to load:", e);
        });
        
        if (localStorage.getItem("playMusic") === "true") {
            console.log("Should start music now");
            setTimeout(() => {
                backgroundMusic.play()
                    .then(() => {
                        console.log("Music started successfully!");
                    })
                    .catch(err => {
                        console.error("Music failed to start:", err);
                    });
            }, 100);
            localStorage.removeItem("playMusic");
        }
    } else {
        console.error("Background music element not found!");
    }
    
    // Start timer and create grid only if we're on the game page (index.html)
    if (document.getElementById("grid")) {
        startGameTimer();
        createGrid();
    }
});

// GO INTO GAME LOGIC 
function goIntoGame() {
    console.log("Going into game!!!");
    localStorage.setItem("playMusic", "true");
    
    const homeMusic = document.getElementById("backgroundMusic");
    if (homeMusic) {
        console.log("Trying to unlock audio on home page!!!");
        homeMusic.play()
            .then(() => console.log("Home audio unlocked!"))
            .catch(err => console.warn("Home audio unlock failed:", err));
    }
    
    window.location.href = 'index.html';
}

// TIMER LOGIC
function startGameTimer() {
    if (timerEl) {
        interval = setInterval(() => {
            time--;
            timerEl.textContent = time;
            console.log("Time left:", time);

            if (time <= 0) {
                clearInterval(interval);
                console.log("Time's up!");
                endGame(); 
            }
        }, 1000);
    }
}

// GRID LOGIC
function createGrid() {
    let gridEl = document.getElementById("grid");
    if (!gridEl) return; // Exit if no grid element
    
    let colors = ["😧","😦","😃", "😄", "😁", "😆", "😅", "😂"];
    let width = 5;
    let height = 5; 
    
    for (let i = 0; i < width * height; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile'); 
        tile.textContent = colors[Math.floor(Math.random() * colors.length)];

        tile.addEventListener('click', function() {
            clickTiles(tile);
        });

        gridEl.appendChild(tile); 
    }
}

// BASIC MATCHING LOGIC
function clickTiles(tile) {
    // Play tap sound
    const popSound = document.getElementById("popOneSound");
    if (popSound) {
        popSound.currentTime = 0;
        popSound.play();
    }

    // If the tile is already selected, unselect it
    if (selectedTiles.includes(tile)) {
        tile.style.backgroundColor = ""; // remove highlight
        selectedTiles = selectedTiles.filter(t => t !== tile); // remove from selection
        return; // cancel logic
    }

    // If 3 tiles are already selected, no more can be selected until resolved
    if (selectedTiles.length >= 3) return;

    tile.style.backgroundColor = "yellow"; // highlight with opacity
    selectedTiles.push(tile);

    if (selectedTiles.length === 3) {
        checkForMatch();
    }

    console.log("Tile clicked:", tile);
}

// SCORE OR NOT LOGIC
function checkForMatch() {
    let [a, b, c] = selectedTiles;
    let scoreEl = document.getElementById("score");
    if (scoreEl) {
        scoreEl.textContent = score;
    }
    
    if (a.textContent === b.textContent && b.textContent === c.textContent) { // three tiles match
        // play a noise
        const popTwoSound = document.getElementById("popTwoSound");
        if (popTwoSound) {
            popTwoSound.currentTime = 0;
            popTwoSound.play();
        }

        // add score and time
        score++;
        if (scoreEl) {
            scoreEl.textContent = score;
        }
        time += 3; 

        // clear matched tiles and refil
        let colors = ["😧","😦","😃", "😄", "😁", "😆", "😅", "😂"];
        selectedTiles.forEach(tile => {
            tile.textContent = colors[Math.floor(Math.random() * colors.length)];
            tile.style.backgroundColor = ""; // remove highlight
        });
    } else { // didn't match
        if (scoreEl) {
            scoreEl.textContent = score;
        }
        time -= 2;
        selectedTiles.forEach(tile => {
            tile.style.backgroundColor = ""; // remove highlight
        });
    }

    selectedTiles = []; // reset selected tiles
}

// END GAME LOGIC
function endGame() { // pop up in general
    let endGameEl = document.getElementById("end-game");
    if (interval) {
        clearInterval(interval);
    }
    if (endGameEl) {
        endGameEl.textContent = "Game Over! Your score is: " + score;
    }
    
    if (score > (localStorage.getItem("highScore") || 0)) {
        localStorage.setItem("highScore", score);
    }

    const finalScoreEl = document.getElementById("finalScore");
    if (finalScoreEl) {
        finalScoreEl.textContent = score;
    }
    
    const gameOverPopup = document.getElementById("gameOverPopup");
    if (gameOverPopup) {
        gameOverPopup.style.display = "flex";
    }

    // stop tappings after time's up
    document.querySelectorAll('.tile').forEach(tile => {
        tile.style.pointerEvents = 'none';
    });

    // game over noise
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    const gameOverSound = document.getElementById("gameOverSound");
    if (gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }
}

// SCORE POPUP LOGIC
function checkScore() {
    const popup = document.getElementById("scorePopup");
    const scoreDisplay = document.getElementById("highScoreValue"); 
    const highScore = localStorage.getItem("highScore") || 0;

    if (scoreDisplay) {
        scoreDisplay.textContent = highScore;
    }
    if (popup) {
        popup.style.display = "flex";
    }
}

// UNLOCK AUDIO ON TOUCH LOGIC FOR IOS 6
document.addEventListener('touchstart', function unlockAudio() {
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.play().catch(err => {
            console.warn("Audio unlock failed:", err);
        });
    }
    document.removeEventListener('touchstart', unlockAudio);
}, { once: true });

// MANUAL TEST FOR BROWSER DEBUGGING
if (document.getElementById("start-button")) {
    document.getElementById("start-button").addEventListener('click', () => {
        console.log("Start button clicked - trying to play music");
        const music = document.getElementById("backgroundMusic");
        if (music) {
            music.play()
                .then(() => console.log("Manual music start successful!"))
                .catch(err => console.error("Manual music start failed:", err));
        }
    });
}