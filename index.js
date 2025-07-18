// DECLARING
let score = 0;
let selectedTiles = [];
let time = 60;
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
let colors = ["😃", "😄", "😁", "😆", "😅", "😂"];

let width = 6;
let height = 6; 
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
    if (selectedTiles.includes(tile) || selectedTiles.length >= 3) return;
    
    tile.style.backgroundColor = "yellow"; // highlight selection
    selectedTiles.push(tile);

    if (selectedTiles.length === 3) {
        checkForMatch();
    }
    console.log("Tile clicked: " + tile);
}

function checkForMatch() {
    let [a, b, c] = selectedTiles;
    let scoreEl = document.getElementById("score");
    scoreEl.textContent = score;
    if (a.textContent === b.textContent && b.textContent === c.textContent) { //three tiles match
        score++;
        scoreEl.textContent = score;
        console.log("Match! Score:", score);
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
function endGame() {
    let endGameEl = document.getElementById("end-game");
    clearInterval(interval);
    endGameEl.textContent = "Game Over! Your score is: " + score;
}

// RESTART GAME