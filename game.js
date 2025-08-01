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
  [
    // 20x20 maze (0 = path, 1 = wall)
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
  ]
];

document.addEventListener("keydown", handleKey);

function startGame() {
  level = 0;
  resetLevel();
  startTimer();
  draw();
}

function resetLevel() {
  const current = levels[level];
  for (let y = 0; y < current.length; y++) {
    for (let x = 0; x < current[y].length; x++) {
      if (current[y][x] === 0) {
        player = { x: 1, y: 1 };
        goal = { x: 18, y: 18 };
        return;
      }
    }
  }
}

function startTimer() {
  timer = 30;
  timerEl.textContent = timer;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      alert("⏱️ You ran out of time!");
      resetLevel();
      startTimer();
    }
  }, 1000);
}

function handleKey(e) {
  const { x, y } = player;
  let nx = x, ny = y;

  if (e.key === "ArrowUp") ny--;
  if (e.key === "ArrowDown") ny++;
  if (e.key === "ArrowLeft") nx--;
  if (e.key === "ArrowRight") nx++;

  if (levels[level][ny][nx] === 0) {
    player = { x: nx, y: ny };
    draw();
    checkGoal();
  }
}

function checkGoal() {
  if (player.x === goal.x && player.y === goal.y) {
    clearInterval(timerInterval);
    alert("🎉 You escaped the labyrinth!");
    levelEl.textContent = level + 1;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maze = levels[level];

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#555";
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
    }
  }

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = "gold";
  ctx.fillRect(goal.x * gridSize, goal.y * gridSize, gridSize, gridSize);
}

startGame();
