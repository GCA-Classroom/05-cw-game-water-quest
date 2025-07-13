const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

let score = 0;
let timeLeft = 30;
let gameInterval;
let dropInterval;

function createDrop() {
  const drop = document.createElement("div");
  const isClean = Math.random() < 0.7; // 70% chance clean
  drop.classList.add("drop");
  drop.classList.add(isClean ? "clean" : "polluted");
  drop.textContent = isClean ? "💧" : "☠️";
  drop.style.left = Math.random() * (window.innerWidth - 40) + "px";
  drop.style.top = "-40px";
  gameArea.appendChild(drop);

  // Drop animation
  let posY = -40;
  const fallSpeed = 2 + Math.random() * 2;
  const fall = setInterval(() => {
    posY += fallSpeed;
    drop.style.top = posY + "px";
    if (posY > window.innerHeight) {
      clearInterval(fall);
      drop.remove();
    }
  }, 20);

  drop.addEventListener("click", () => {
    if (drop.classList.contains("clean")) {
      score += 10;
    } else {
      score -= 5;
      if (score < 0) score = 0;
    }
    scoreDisplay.textContent = score;
    clearInterval(fall);
    drop.remove();
  });
}

function startGame() {
  dropInterval = setInterval(createDrop, 700);
  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(dropInterval);
      alert("Game over! Final score: " + score);
    }
  }, 1000);
}

window.onload = startGame;
