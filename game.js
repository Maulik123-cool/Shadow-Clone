const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timerEl = document.getElementById("timer");
const levelEl = document.getElementById("level");

let gridSize = 30;
let player = { x: 1, y: 1 };
let goal = { x: 18, y: 18 };
let level = 0;
let timer = 30;
let timerInterval;

const levels = [
  // Level 1 (Easy)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],

  // Level 2 (Medium)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],

  // Level 3 (Hard)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

// Initialize player and goal positions for each level
const playerStartPositions = [
  { x: 1, y: 1 }, // Level 1
  { x: 1, y: 1 }, // Level 2
  { x: 1, y: 1 }, // Level 3
];

const goalPositions = [
  { x: 18, y: 18 }, // Level 1
  { x: 18, y: 18 }, // Level 2
  { x: 18, y: 17 }, // Level 3 (different spot)
];

document.addEventListener("keydown", handleKey);

function startGame() {
  level = 0;
  levelEl.textContent = level + 1;
  resetLevel();
  startTimer();
  draw();
}

function resetLevel() {
  player = { ...playerStartPositions[level] };
  goal = { ...goalPositions[level] };
  timer = 30 + level * 15; // increase time per level
  timerEl.textContent = timer;
  if (timerInterval) clearInterval(timerInterval);
  startTimer();
  draw();
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      alert("⏱️ You ran out of time! Restarting level...");
      resetLevel();
    }
  }, 1000);
}

function handleKey(e) {
  const { x, y } = player;
  let nx = x, ny = y;

  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;
  else return; // ignore other keys

  // Check boundaries and walls
  if (
    ny >= 0 &&
    ny < levels[level].length &&
    nx >= 0 &&
    nx < levels[level][0].length &&
    levels[level][ny][nx] === 0
  ) {
    player = { x: nx, y: ny };
    draw();
    checkGoal();
  }
}

function checkGoal() {
  if (player.x === goal.x && player.y === goal.y) {
    clearInterval(timerInterval);
    alert(`🎉 You escaped Level ${level + 1}!`);

    level++;
    if (level >= levels.length) {
      alert("🏆 Congratulations! You escaped the labyrinth completely!");
      level = 0; // restart game
    }
    levelEl.textContent = level + 1;
    resetLevel();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maze = levels[level];

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#555"; // wall color
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      } else {
        ctx.fillStyle = "#222"; // path color
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }

  // Draw player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);

  // Draw goal
  ctx.fillStyle = "gold";
  ctx.fillRect(goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);
}

startGame();
