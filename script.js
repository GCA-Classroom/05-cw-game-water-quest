// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let score = 0;              // Initialize score
let timeLeft = 30;          // Time left in seconds
let timerInterval;          // Holds the interval for the timer

// Arrays of game end messages
const winningMessages = [
    "Congratulations! You're a water collecting champion with {score} points!",
    "Amazing job! You won with {score} points!",
    "Victory! You collected {score} points like a pro!",
    "Fantastic work! You've mastered the game with {score} points!"
];

const losingMessages = [
    "You did great but let's try again! You scored {score} points.",
    "Nice effort! Keep practicing to reach 20 points!",
    "Almost there! You collected {score} points. One more try?",
    "Good attempt! Let's see if you can get to 20 points next time!"
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));
  
  const randomCell = cells[Math.floor(Math.random() * cells.length)];
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can" onclick="handleCanClick(this)"></div>
    </div>
  `;
}

function handleCanClick(can) {
  if (!gameActive) return;
  updateScore();
  can.parentElement.remove(); // Remove the clicked can
  currentCans++;
  document.getElementById('current-cans').textContent = currentCans;
}

// Update the score display
function updateScore() {
  score += 1; // Increment score
  document.getElementById('score').textContent = score; // Update score display
}

// Update the timer display
function updateTimer() {
  timeLeft--;
  document.getElementById('timer').textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

// Starts the timer countdown
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

// Confetti effect for winning
function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Ends the game
function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the timer

  // Disable clicking on water cans
  const waterCans = document.querySelectorAll('.water-can');
  waterCans.forEach(can => {
      can.style.pointerEvents = 'none';
  });

  // Select random message from appropriate array
  const messages = score >= 20 ? winningMessages : losingMessages;
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex].replace('{score}', score);

  // Launch confetti if player wins
  if (score >= 20) {
    launchConfetti();
  }

  alert(message);
}

// Spawns a new item in a random grid cell, either a water can or an obstacle
function spawnWaterCanOrObstacle() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));

  // 10% fancy mud droplet, 10% water droplet, 80% water can
  const rand = Math.random();
  let itemType;
  if (rand < 0.1) {
    itemType = 'fancyMud';
  } else if (rand < 0.2) {
    itemType = 'droplet';
  } else {
    itemType = 'can';
  }

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  if (itemType === 'fancyMud') {
    randomCell.innerHTML = `
      <div class="fancy-mud-wrapper">
        <div class="fancy-mud" onclick="handleFancyMudClick(this)">
          <div class="mud-gloss"></div>
          <div class="mud-sparkle"></div>
        </div>
      </div>
    `;
  } else if (itemType === 'droplet') {
    randomCell.innerHTML = `
      <div class="droplet-wrapper">
        <div class="droplet" onclick="handleDropletClick(this)"></div>
      </div>
    `;
  } else {
    randomCell.innerHTML = `
      <div class="water-can-wrapper">
        <div class="water-can" onclick="handleCanClick(this)"></div>
      </div>
    `;
  }
}

function handleFancyMudClick(mud) {
  if (!gameActive) return;
  score = Math.max(0, score - 5); // Decrease score by 5, not below 0
  document.getElementById('score').textContent = score;
  mud.parentElement.remove();
}

function handleDropletClick(droplet) {
  if (!gameActive) return;
  score += 15;
  document.getElementById('score').textContent = score;
  droplet.parentElement.remove();
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  score = 0; // Reset score
  timeLeft = 30; // Reset time left
  currentCans = 0;
  document.getElementById('score').textContent = score; // Update score display
  document.getElementById('timer').textContent = timeLeft; // Update timer display
  document.getElementById('current-cans').textContent = currentCans;
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCanOrObstacle, 1000); // Spawn water cans or obstacles every second
  startTimer(); // Start the timer
}

// Resets the game to its initial state
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 30;
  currentCans = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('current-cans').textContent = currentCans;
  createGrid();
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame); // Add reset button handler
function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 30;
  currentCans = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('current-cans').textContent = currentCans;
  createGrid();
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame); // Add reset button handler
