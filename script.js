// DECLARING
let score = 0;
let selectedTiles = [];
let time = 30;
let timerEl = document.getElementById("timer");

//TIMER LOGIC
let interval = setInterval(() => {
    time--;
    timerEl.textContent = time;
    console.log("Time left:", time);

    if (time <= 0) {
        clearInterval(interval);
        console.log("Time's up!");
        endGame(); 
    }
}, 1000);

// GRID LOGIC
let gridEl = document.getElementById("grid");
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

// BASIC MATCHING LOGIC
function clickTiles(tile) {
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

function checkForMatch() {
    let [a, b, c] = selectedTiles;
    let scoreEl = document.getElementById("score");
    scoreEl.textContent = score;
    if (a.textContent === b.textContent && b.textContent === c.textContent) { //three tiles match
        score++;
        scoreEl.textContent = score;
        time += 3; // Add time reward

        selectedTiles.forEach(tile => { //clear matched tiles and refil
            tile.textContent = colors[Math.floor(Math.random() * colors.length)];
            tile.style.backgroundColor = ""; // remove highlight
        });
    } else { //didn't match
        scoreEl.textContent = score;
        time -= 2;
        selectedTiles.forEach(tile => {
            tile.style.backgroundColor = ""; // remove highlight
        });
    }

    selectedTiles = []; // reset selected tiles
}

// END GAME LOGIC
function endGame() { //pop up in general
    let endGameEl = document.getElementById("end-game");
    clearInterval(interval);
    endGameEl.textContent = "Game Over! Your score is: " + score;
    if (score > (localStorage.getItem("highScore") || 0)) {
        localStorage.setItem("highScore", score);
    }

    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverPopup").style.display = "flex";

    //stop tappings after time's up
    document.querySelectorAll('.title').forEach(tile => { //not really needed because of game over popup, but just in case
        tile.style.pointerEvents = 'none';
    });
}



// add music
// add sound effects
// beautify overall