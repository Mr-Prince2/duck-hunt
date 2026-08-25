// Audio Manager with preloading and sound pooling
class AudioManager {
    constructor() {
        this.sounds = {
            shot: new Audio("duck-shot.mp3"),
            score: new Audio("dog-score.mp3"),
            quack: new Audio("duck-quack.mp3"),
            flap: new Audio("duck-flap.mp3")
        };
        // Preload sounds
        Object.values(this.sounds).forEach(audio => {
            audio.load();
        });
    }

    play(name) {
        if (this.sounds[name]) {
            // Clone node to allow rapid overlapping sounds (e.g. fast shots)
            let sound = this.sounds[name].cloneNode();
            sound.volume = 0.8;
            sound.play().catch(e => console.log("Audio play blocked by browser policy:", e));
        }
    }
}

const audioMgr = new AudioManager();

// Constants & Assets
const DUCK_IMAGE_NAMES = ["duck-left.gif", "duck-right.gif"];
const DUCK_WIDTH = 96;
const DUCK_HEIGHT = 93;
const FLYAWAY_SPEED = -10;
const DUCKS_PER_ROUND = 10;
const PASSING_HITS_REQUIRED = 6;

// Game State Engine
let gameState = 'START_SCREEN'; // START_SCREEN, WAVE_START, PLAYING, WAVE_CLEAR, DOG_ANIMATION, ROUND_CLEAR, GAME_OVER
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight - 90;

let score = 0;
let topScore = parseInt(localStorage.getItem('duckhunt_top_score')) || 0;
let round = 1;

let currentWaveDucks = [];
let roundDuckIndex = 0; // 0 to 9
let roundHits = 0;
let roundHitTracker = Array(DUCKS_PER_ROUND).fill(null); // 'hit' or 'missed'

let shotsLeft = 3;
let waveTimer = null;
let waveStartTime = 0;
let waveDuration = 7000;
let waveRemainingTime = 7000;
let lastFrameTime = performance.now();

// DOM Cache
const gameBoard = document.getElementById("game-board");
const startScreen = document.getElementById("start-screen");
const startPrompt = document.querySelector(".start-prompt");
const pauseScreen = document.getElementById("pause-screen");
const bannerOverlay = document.getElementById("banner-overlay");
const bannerText = document.getElementById("banner-text");
const flashOverlay = document.getElementById("flash-overlay");

const scoreDisplay = document.getElementById("score");
const topScoreDisplay = document.getElementById("top-score");
const startTopScoreDisplay = document.getElementById("start-top-score");
const roundDisplay = document.getElementById("round-display");
const bulletsContainer = document.getElementById("bullets-container");
const duckIndicators = document.querySelectorAll(".duck-indicator");

// Initialize on Load
window.onload = function() {
    updateTopScoreDisplays();
    updateHUD();
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    startPrompt.addEventListener("click", startGame);
    gameBoard.addEventListener("click", handleBackgroundShot);

    // Start main game loop using requestAnimationFrame
    requestAnimationFrame(gameLoop);
};

function handleKeyDown(e) {
    if (e.key === "Escape" || e.code === "Escape") {
        togglePause();
    }
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        let elapsed = Date.now() - waveStartTime;
        waveRemainingTime = Math.max(0, waveDuration - elapsed);
        clearTimeout(waveTimer);
        pauseScreen.classList.remove("hidden");
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        pauseScreen.classList.add("hidden");
        waveStartTime = Date.now();
        waveDuration = waveRemainingTime;
        waveTimer = setTimeout(() => {
            if (gameState === 'PLAYING') {
                triggerFlyAway();
            }
        }, waveDuration);
    }
}

function handleResize() {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight - 90;
}

function updateTopScoreDisplays() {
    let formattedTop = String(topScore).padStart(6, '0');
    topScoreDisplay.innerText = formattedTop;
    startTopScoreDisplay.innerText = formattedTop;
}

function updateHUD() {
    // Score & Round
    scoreDisplay.innerText = String(score).padStart(6, '0');
    roundDisplay.innerText = `R=${round}`;

    // Bullets
    const bullets = bulletsContainer.querySelectorAll(".bullet");
    bullets.forEach((bullet, idx) => {
        if (idx < shotsLeft) {
            bullet.classList.remove("used");
        } else {
            bullet.classList.add("used");
        }
    });

    // Duck Hit Indicators
    duckIndicators.forEach((indicator, idx) => {
        indicator.classList.remove("hit", "missed", "active");
        if (roundHitTracker[idx] === 'hit') {
            indicator.classList.add("hit");
        } else if (roundHitTracker[idx] === 'missed') {
            indicator.classList.add("missed");
        } else if (idx === roundDuckIndex && gameState === 'PLAYING') {
            indicator.classList.add("active");
        }
    });
}

function showBanner(text, durationMs = 2000, callback = null) {
    bannerText.innerText = text;
    bannerOverlay.classList.remove("hidden");
    
    if (durationMs > 0) {
        setTimeout(() => {
            bannerOverlay.classList.add("hidden");
            if (callback) callback();
        }, durationMs);
    }
}

function hideBanner() {
    bannerOverlay.classList.add("hidden");
}

function startGame() {
    startScreen.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    score = 0;
    round = 1;
    startRound();
}

function startRound() {
    roundDuckIndex = 0;
    roundHits = 0;
    roundHitTracker = Array(DUCKS_PER_ROUND).fill(null);
    updateHUD();

    showBanner(`ROUND ${round}`, 2000, () => {
        startWave();
    });
}

function startWave() {
    if (roundDuckIndex >= DUCKS_PER_ROUND) {
        endRound();
        return;
    }

    gameState = 'WAVE_START';
    shotsLeft = 3;
    updateHUD();

    // Determine 1 or 2 ducks for this wave
    let remainingDucksInRound = DUCKS_PER_ROUND - roundDuckIndex;
    let duckCount = (remainingDucksInRound >= 2 && Math.random() > 0.5) ? 2 : 1;

    currentWaveDucks = [];
    audioMgr.play("quack");

    for (let i = 0; i < duckCount; i++) {
        let isLeft = Math.random() > 0.5;
        let duckImg = document.createElement("img");
        duckImg.src = isLeft ? DUCK_IMAGE_NAMES[0] : DUCK_IMAGE_NAMES[1];
        duckImg.className = "duck-sprite";
        duckImg.style.width = `${DUCK_WIDTH}px`;
        duckImg.style.height = `${DUCK_HEIGHT}px`;
        duckImg.draggable = false;

        let startX = randomPosition(gameWidth - DUCK_WIDTH);
        let startY = gameHeight - DUCK_HEIGHT - 50;

        let baseSpeed = 5 + round * 0.5;
        let vx = isLeft ? -baseSpeed : baseSpeed;
        let vy = -(baseSpeed * (0.8 + Math.random() * 0.4));

        duckImg.style.left = `${startX}px`;
        duckImg.style.top = `${startY}px`;

        let duckObj = {
            element: duckImg,
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            state: 'FLYING', // FLYING, SHOT, ESCAPING
            indexInRound: roundDuckIndex + i,
            lastQuack: Date.now()
        };

        duckImg.onclick = (e) => {
            e.stopPropagation();
            onDuckClick(duckObj);
        };

        gameBoard.appendChild(duckImg);
        currentWaveDucks.push(duckObj);
    }

    gameState = 'PLAYING';
    updateHUD();

    // Escape timer (7 seconds to shoot ducks)
    clearTimeout(waveTimer);
    waveDuration = 7000;
    waveRemainingTime = 7000;
    waveStartTime = Date.now();
    waveTimer = setTimeout(() => {
        if (gameState === 'PLAYING') {
            triggerFlyAway();
        }
    }, waveDuration);
}

function handleBackgroundShot(e) {
    if (gameState !== 'PLAYING') return;

    triggerLightgunFlash();
    audioMgr.play("shot");

    shotsLeft = Math.max(0, shotsLeft - 1);
    updateHUD();

    if (shotsLeft === 0) {
        // Check if all active ducks are shot
        let activeDucks = currentWaveDucks.filter(d => d.state === 'FLYING');
        if (activeDucks.length > 0) {
            triggerFlyAway();
        }
    }
}

function triggerLightgunFlash() {
    flashOverlay.classList.add("flash");
    setTimeout(() => {
        flashOverlay.classList.remove("flash");
    }, 80);
}

function onDuckClick(duckObj) {
    if (gameState !== 'PLAYING' || duckObj.state !== 'FLYING' || shotsLeft <= 0) return;

    triggerLightgunFlash();
    audioMgr.play("shot");

    shotsLeft = Math.max(0, shotsLeft - 1);
    duckObj.state = 'SHOT';
    duckObj.element.classList.add("shot");

    score += 500;
    if (score > topScore) {
        topScore = score;
        localStorage.setItem('duckhunt_top_score', topScore);
        updateTopScoreDisplays();
    }

    roundHits++;
    roundHitTracker[duckObj.indexInRound] = 'hit';
    updateHUD();

    // Check if wave finished
    let remainingFlying = currentWaveDucks.filter(d => d.state === 'FLYING');
    if (remainingFlying.length === 0) {
        clearTimeout(waveTimer);
        setTimeout(onWaveComplete, 1000);
    }
}

function triggerFlyAway() {
    clearTimeout(waveTimer);
    gameState = 'WAVE_CLEAR';
    showBanner("FLY AWAY", 2000);

    currentWaveDucks.forEach(duck => {
        if (duck.state === 'FLYING') {
            duck.state = 'ESCAPING';
            duck.vx = 0;
            duck.vy = FLYAWAY_SPEED;
            roundHitTracker[duck.indexInRound] = 'missed';
        }
    });

    audioMgr.play("quack");
    updateHUD();

    setTimeout(onWaveComplete, 2200);
}

function onWaveComplete() {
    // Clean remaining duck elements
    currentWaveDucks.forEach(duck => {
        if (duck.element.parentNode) {
            duck.element.parentNode.removeChild(duck.element);
        }
    });

    let waveDuckCount = currentWaveDucks.length;
    let waveHits = currentWaveDucks.filter(d => d.state === 'SHOT').length;
    roundDuckIndex += waveDuckCount;

    showDogAnimation(waveHits, () => {
        startWave();
    });
}

function showDogAnimation(hits, callback) {
    gameState = 'DOG_ANIMATION';

    let dogImg = document.createElement("img");
    dogImg.className = "dog-sprite";

    if (hits > 0) {
        dogImg.src = hits === 1 ? "dog-duck1.png" : "dog-duck2.png";
        dogImg.style.width = hits === 1 ? "172px" : "224px";
        dogImg.style.height = "152px";
        audioMgr.play("score");
    } else {
        // Laughing dog fallback / missed duck dog sprite
        dogImg.src = "dog-duck1.png";
        dogImg.style.width = "172px";
        dogImg.style.height = "152px";
        audioMgr.play("quack");
    }

    gameBoard.appendChild(dogImg);

    setTimeout(() => {
        if (dogImg.parentNode) {
            dogImg.parentNode.removeChild(dogImg);
        }
        if (callback) callback();
    }, 2500);
}

function endRound() {
    if (roundHits >= PASSING_HITS_REQUIRED) {
        showBanner("ROUND CLEAR!", 2500, () => {
            round++;
            startRound();
        });
    } else {
        showBanner("GAME OVER", 3500, () => {
            gameState = 'START_SCREEN';
            startScreen.classList.remove("hidden");
        });
    }
}

// 60+ FPS Physics Game Loop
function gameLoop(timestamp) {
    let dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (gameState === 'PLAYING' || gameState === 'WAVE_CLEAR') {
        currentWaveDucks.forEach(duck => {
            if (duck.state === 'FLYING') {
                // Update position
                duck.x += duck.vx;
                duck.y += duck.vy;

                // Horizontal boundary collision & sprite direction flip
                if (duck.x < 0) {
                    duck.x = 0;
                    duck.vx = Math.abs(duck.vx);
                    duck.element.src = DUCK_IMAGE_NAMES[1]; // Right
                    audioMgr.play("flap");
                } else if (duck.x + DUCK_WIDTH > gameWidth) {
                    duck.x = gameWidth - DUCK_WIDTH;
                    duck.vx = -Math.abs(duck.vx);
                    duck.element.src = DUCK_IMAGE_NAMES[0]; // Left
                    audioMgr.play("flap");
                }

                // Vertical boundary collision
                if (duck.y < 0) {
                    duck.y = 0;
                    duck.vy = Math.abs(duck.vy);
                } else if (duck.y + DUCK_HEIGHT > gameHeight) {
                    duck.y = gameHeight - DUCK_HEIGHT;
                    duck.vy = -Math.abs(duck.vy);
                }

                // Periodically quack
                if (Date.now() - duck.lastQuack > 3500) {
                    audioMgr.play("quack");
                    duck.lastQuack = Date.now();
                }

                duck.element.style.left = `${duck.x}px`;
                duck.element.style.top = `${duck.y}px`;
            } else if (duck.state === 'ESCAPING') {
                duck.y += duck.vy;
                duck.element.style.top = `${duck.y}px`;
            }
        });
    }

    requestAnimationFrame(gameLoop);
}

function randomPosition(limit) {
    return Math.floor(Math.random() * Math.max(1, limit));
}