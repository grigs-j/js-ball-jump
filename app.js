const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let isGameOver = false;
let platformMax = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
}

class Platform {
    constructor(newPlatformBottom) {
        this.bottom = newPlatformBottom;
        //grid width - platform width = 315 total width to move
        this.left = Math.random() * 315;
        this.visual = document.createElement("div");

        const visual = this.visual;
        visual.classList.add("platform");
        visual.style.left = this.left + "px";
        visual.style.bottom = this.bottom + "px";
        grid.appendChild(visual);
    }
}

function createPlatforms() {
    for (let i = 0; i < platformMax; i++) {
        let platformGap = 600 / platformMax;
        //adding gap space of each loop increment
        let newPlatformBottom = 100 + i * platformGap;
        let newPlatform = new Platform(newPlatformBottom);
        platforms.push(newPlatform);
        // console.log(platforms);
    }
}

function movePlatforms() {
    if (doodlerBottomSpace > 200) {
        platforms.forEach((platform) => {
            platform.bottom -= 3;
            let visual = platform.visual;
            visual.style.bottom = platform.bottom + "px";

            if (platform.bottom < 10) {
                //defining platform at bottom of screen to remove
                let firstPlatform = platforms[0].visual;
                firstPlatform.classList.remove("platform");
                //removes first item from array
                platforms.shift();
                score++;
                // console.log(platforms);
                let newPlatform = new Platform(600);
                platforms.push(newPlatform);
            }
        });
    }
}

function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
        doodlerBottomSpace += 10;
        doodler.style.bottom = doodlerBottomSpace + "px";

        if (doodlerBottomSpace > startPoint + 200) {
            fall();
        }
    }, 50);
}

function fall() {
    //once falling we want to stop up timer set interval func
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
        doodlerBottomSpace -= 4;
        doodler.style.bottom = doodlerBottomSpace + "px";

        if (doodlerBottomSpace <= 0) {
            gameOver();
        }

        platforms.forEach((platform) => {
            if (
                //if doodler on platform or in platform
                doodlerBottomSpace >= platform.bottom &&
                doodlerBottomSpace <= platform.bottom + 15 &&
                doodlerLeftSpace + 60 >= platform.left &&
                doodlerLeftSpace <= platform.left + 85 &&
                !isJumping
            ) {
                console.log("landed");
                //overriding start point to reset to bottom of doodler after landing on a platform
                startPoint = doodlerBottomSpace;
                jump();
            }
        }, 50);
    });
}
function gameOver() {
    console.log("game over");
    isGameOver === true;

    //loops over grid as long as it has a child element
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

function control(e) {
    if (e.key === "ArrowLeft") {
        moveLeft();
    } else if (e.key === "ArrowRight") {
        moveRight();
    } else if (e.key === "ArrowUp") {
        moveStraight();
    }
}

function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -= 6;
            doodler.style.left = doodlerLeftSpace + "px";
        } else moveRight();
    }, 20);
}

function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
        //grid width - doodler width
        if (doodlerLeftSpace <= 340) {
            doodlerLeftSpace += 6;
            doodler.style.left = doodlerLeftSpace + "px";
        } else moveLeft();
    }, 20);
}

function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

function start() {
    if (!isGameOver) {
        createPlatforms();
        createDoodler();
        setInterval(movePlatforms, 30);
        jump(startPoint);

        document.addEventListener("keydown", control);
    }
}
//TODO: attach to button event
start();
