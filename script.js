// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
const WIN_SCORE = 20;        // Minimum score needed to win
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let countdownInterval;      // Holds the interval for the game timer
let timeLeft = 30;          // Seconds remaining in the current round

// Removes any confetti currently shown on the page
function clearConfetti() {
  const existingConfetti = document.querySelector('.confetti-overlay');
  if (existingConfetti) {
    existingConfetti.remove();
  }
}

// Creates a simple confetti rain animation for winning rounds
function showConfetti() {
  clearConfetti();

  const confettiOverlay = document.createElement('div');
  confettiOverlay.className = 'confetti-overlay';

  const confettiColors = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F5402C'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2.4 + Math.random() * 1.6}s`;
    piece.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    confettiOverlay.appendChild(piece);
  }

  document.body.appendChild(confettiOverlay);
}

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
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Fill every square with a water drop decoy first
  cells.forEach(cell => {
    cell.innerHTML = '<div class="water-drop" aria-hidden="true"></div>';
  });

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Replace one random square with the real water can target
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

// Updates the visible score and timer values
function updateStats() {
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timeLeft;
}

// Handles clicks on water cans using event delegation on the grid
function handleGridClick(event) {
  if (!gameActive) return;

  const clickedCan = event.target.closest('.water-can');
  if (!clickedCan) return;

  currentCans += 1;
  updateStats();

  // Remove the clicked can so each can can only be counted once
  const wrapper = clickedCan.closest('.water-can-wrapper');
  if (wrapper) {
    wrapper.remove();
  }
}

// Starts and manages the 30-second game countdown
function startTimer() {
  countdownInterval = setInterval(() => {
    timeLeft -= 1;
    updateStats();

    if (timeLeft <= 0) {
      endGame();
      const achievements = document.getElementById('achievements');

      if (currentCans >= WIN_SCORE) {
        achievements.textContent = `You win! Final Score: ${currentCans}`;
        showConfetti();
      } else {
        achievements.textContent = `👎 Sorry, try again. Final Score: ${currentCans}`;
      }
    }
  }, 1000);
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active

  currentCans = 0;
  timeLeft = 30;
  document.getElementById('achievements').textContent = '';
  clearConfetti();
  updateStats();

  gameActive = true;
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  spawnWaterCan(); // Show the first can immediately
  startTimer();
}

// Resets the board and score so the player controls when to start again
function resetGame() {
  endGame();
  currentCans = 0;
  timeLeft = 30;
  document.getElementById('achievements').textContent = 'Game reset. Press Start Game when ready.';
  clearConfetti();
  updateStats();
  createGrid();
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(countdownInterval); // Stop the game timer

  // Clear any remaining cans from the board
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));
}

document.querySelector('.game-grid').addEventListener('click', handleGridClick);

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
