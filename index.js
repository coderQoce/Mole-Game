let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let wrongTileClicks = 0;
let hearts = 3;

let moleInterval;
let plantInterval;

// Sound effects
const hitMoleSound = new Audio("./sounds/hacker-hit.mp3");
const hitPlantSound = new Audio("./sounds/plant-hit.mp3");
const gameOverSound = new Audio("./sounds/game-over.mp3");
const bgMusic = new Audio("./sounds/background-music.mp3");
bgMusic.loop = true;

window.onload = () => {
    initializeGame();
};

function initializeGame() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile");
        tile.addEventListener("click", handleTileClick);
        board.appendChild(tile);
    }

    updateHearts();

    moleInterval = setInterval(spawnMole, 1500);
    plantInterval = setInterval(spawnPlant, 2500);

    // Start background music
    bgMusic.play();
}

function getRandomTileID() {
    return Math.floor(Math.random() * 9).toString();
}

function spawnMole() {
    if (gameOver) return;
    if (currMoleTile) currMoleTile.innerHTML = "";

    const mole = document.createElement("img");
    mole.src = "./hacker.png";

    const tileId = getRandomTileID();
    if (currPlantTile && currPlantTile.id === tileId) return;

    currMoleTile = document.getElementById(tileId);
    currMoleTile.innerHTML = "";
    currMoleTile.appendChild(mole);
}

function spawnPlant() {
    if (gameOver) return;
    if (currPlantTile) currPlantTile.innerHTML = "";

    const plant = document.createElement("img");
    plant.src = "./plant.jpg";

    const tileId = getRandomTileID();
    if (currMoleTile && currMoleTile.id === tileId) return;

    currPlantTile = document.getElementById(tileId);
    currPlantTile.innerHTML = "";
    currPlantTile.appendChild(plant);
}

function handleTileClick() {
    if (gameOver) return;

    if (this === currMoleTile) {
        score += 10;
        wrongTileClicks = 0;
        document.getElementById("score").innerText = score.toString();
        hitMoleSound.play();
        adjustDifficulty(score);
    } else if (this === currPlantTile) {
        hitPlantSound.play();
        endGame("Hit a Plant!!");
    } else {
        hitPlantSound.play();
        wrongTileClicks++;
        hearts--;
        updateHearts();

        if (wrongTileClicks >= 3 || hearts <= 0) {
            endGame("Too Many Misses");
        }
    }
}

function adjustDifficulty(score) {
    if ([50, 100, 150, 200].includes(score)) {
        clearInterval(moleInterval);
        clearInterval(plantInterval);

        const speeds = {
            50: [1000, 2000],
            100: [800, 1600],
            150: [600, 1400],
            200: [400, 1000]
        };

        const [moleSpeed, plantSpeed] = speeds[score] || [1500, 2500];

        moleInterval = setInterval(spawnMole, moleSpeed);
        plantInterval = setInterval(spawnPlant, plantSpeed);
    }
}

function updateHearts() {
    const heartDisplay = document.getElementById("hearts");
    heartDisplay.innerHTML = "";

    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement("img");
        heart.src = "./heart.jpg";
        heartDisplay.appendChild(heart);
    }
}

function endGame(reason) {
    gameOver = true;
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    bgMusic.pause();
    gameOverSound.play();

    const finalScore = `GAME OVER! ${score} (${reason})`;
    document.getElementById("score").innerText = finalScore;

    document.getElementById("restartBtn").style.display = "inline-block";
    document.getElementById("shareBtn").style.display = "inline-block";

    setupTwitterShare(score);
}

function setupTwitterShare(score) {
    const tweet = `I scored ${score} points in the Mole Game! 🕹️ Can you beat my score? Play here: https://mole-game-alpha.vercel.app/ #MoleGame`;
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;

    document.getElementById("shareBtn").onclick = () => {
        window.open(twitterURL, "_blank");
    };
}

function restartGame() {
    window.location.reload();
}
