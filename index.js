let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let missedMoles = 0;
let wrongTileClicks = 0;
let hearts = 3; 

let moleInterval;
let plantInterval;

window.onload = function () {
    setGame();
}

function setGame() {
 
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile");
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    
    updateHeartsDisplay();

    moleInterval = setInterval(setMole, 1500);
    plantInterval = setInterval(setPlant, 2500);
}

function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

function setMole() {
    if (gameOver) return;

    // if (currMoleTile && currMoleTile.innerHTML !== "") {
    //     missedMoles++;
    //     if (missedMoles >= 3) {
    //         endGame("GGS");
    //         return;
    //     }else {
    //         wrongTileClicks++;
    //         hearts--;
    //         updateHeartsDisplay(); 
    //         if (wrongTileClicks >= 3 || hearts <= 0) {
    //             endGame("GGS");
    //         }
    //     }
    // }

    if (currMoleTile) currMoleTile.innerHTML = "";

    let mole = document.createElement("img");
    mole.src = "./hacker.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id === num) return;

    currMoleTile = document.getElementById(num);
    currMoleTile.innerHTML = "";
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;

    if (currPlantTile) currPlantTile.innerHTML = "";

    let plant = document.createElement("img");
    plant.src = "./plant.jpg";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id === num) return;

    currPlantTile = document.getElementById(num);
    currPlantTile.innerHTML = "";
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile) {
        score += 10;
        missedMoles = 0;
        wrongTileClicks = 0;
        document.getElementById("score").innerText = score.toString();

        adjustSpeed(score);

    } else if (this === currPlantTile) {
        endGame("GGS");
    } else {
        wrongTileClicks++;
        hearts--;
        updateHeartsDisplay(); 
        if (wrongTileClicks >= 3 || hearts <= 0) {
            endGame("GGS");
        }
    }
}

function adjustSpeed(score) {
    if ([50, 100, 150, 200].includes(score)) {
        clearInterval(moleInterval);
        clearInterval(plantInterval);

        let moleSpeed = 1500;
        let plantSpeed = 2500;

        if (score === 50) {
            moleSpeed = 1000;
            plantSpeed = 2000;
        } else if (score === 100) {
            moleSpeed = 800;
            plantSpeed = 1600;
        } else if (score === 150) {
            moleSpeed = 600;
            plantSpeed = 1400;
        } else if (score === 200) {
            moleSpeed = 400;
            plantSpeed = 1000;
        }

        moleInterval = setInterval(setMole, moleSpeed);
        plantInterval = setInterval(setPlant, plantSpeed);
    }
}

// heart implementation

function updateHeartsDisplay() {
    // Clear previous hearts
    let heartDisplay = document.getElementById("hearts");
    heartDisplay.innerHTML = "";

    for (let i = 0; i < hearts; i++) {
        let heart = document.createElement("img");
        heart.src = "./heart.jpg";
        heartDisplay.appendChild(heart);
    }
}

function endGame(reason) {
    gameOver = true;
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    document.getElementById("score").innerText = `GAME OVER! ${score} (${reason})`;
}
