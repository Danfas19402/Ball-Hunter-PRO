// ================== ESTADO ==================
let state = {
    score: 0,
    time: 30,
    lives: 3,
    speed: 800,
    running: false
};

let intervals = [];

// ================== ELEMENTOS ==================
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const livesDisplay = document.getElementById("lives");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const clearRankingBtn = document.getElementById("clearRankingBtn");
const rankingList = document.getElementById("ranking");

const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");

const clickSound = document.getElementById("clickSound");
const missSound = document.getElementById("missSound");

// ================== EVENTOS ==================
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
clearRankingBtn.addEventListener("click", clearRanking);

// ================== INICIAR ==================
function startGame() {
    const name = playerNameInput.value.trim();

    if (!name) {
        alert("Digite seu nome!");
        return;
    }

    resetGame();

    state.running = true;
    state.speed = parseInt(difficultySelect.value);

    startBtn.disabled = true;

    startTimer(name);
    startMovement();
}

// ================== TIMER ==================
function startTimer(name) {
    const timer = setInterval(() => {
        if (!state.running) return;

        state.time--;
        updateHUD();

        if (state.time <= 0 || state.lives <= 0) {
            endGame(name);
        }
    }, 1000);

    intervals.push(timer);
}

// ================== MOVIMENTO ==================
function startMovement() {
    const mover = setInterval(() => {
        if (!state.running) return;

        moveBall();

        if (state.speed > 300) {
            state.speed -= 10;
        }

    }, state.speed);

    intervals.push(mover);
}

// ================== MOVER ==================
function moveBall() {
    const container = document.querySelector(".container");

    const maxX = container.clientWidth - 60;
    const maxY = container.clientHeight - 60;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    ball.style.left = x + "px";
    ball.style.top = y + "px";
}

// ================== CLICK ==================
ball.addEventListener("click", () => {
    if (!state.running) return;

    state.score++;
    updateHUD();

    clickSound.currentTime = 0;
    clickSound.play();

    moveBall();
});

// ================== MISS ==================
document.querySelector(".container").addEventListener("click", (e) => {
    if (e.target !== ball && state.running) {
        state.lives--;
        updateHUD();

        missSound.currentTime = 0;
        missSound.play();
    }
});

// ================== RESET ==================
function resetGame() {
    state.running = false;

    state.score = 0;
    state.time = 30;
    state.lives = 3;

    updateHUD();

    startBtn.disabled = false;

    clearIntervals();
    moveBall();
}

// ================== LIMPAR INTERVALOS ==================
function clearIntervals() {
    intervals.forEach(i => clearInterval(i));
    intervals = [];
}

// ================== LIMPAR RANKING ==================
function clearRanking() {
    const confirmClear = confirm("Tem certeza que deseja apagar o ranking?");

    if (confirmClear) {
        localStorage.removeItem("ranking");
        renderRanking();
    }
}

// ================== HUD ==================
function updateHUD() {
    scoreDisplay.textContent = `Pontuação: ${state.score}`;
    timeDisplay.textContent = `Tempo: ${state.time}s`;
    livesDisplay.textContent = `Vidas: ${"❤️".repeat(state.lives)}`;
}

// ================== FIM ==================
function endGame(name) {
    state.running = false;
    startBtn.disabled = false;

    clearIntervals();

    saveScore(name, state.score);
    alert(`Fim de jogo, ${name}! Pontuação: ${state.score}`);
}

// ================== RANKING ==================
function saveScore(name, score) {
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    const date = new Date().toLocaleDateString();

    ranking.push({ name, score, date });

    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);

    localStorage.setItem("ranking", JSON.stringify(ranking));

    renderRanking();
}

function renderRanking() {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    rankingList.innerHTML = "";

    ranking.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.score} pts (${player.date})`;
        rankingList.appendChild(li);
    });
}

// ================== INIT ==================
renderRanking();
