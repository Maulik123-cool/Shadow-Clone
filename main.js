const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const countdownDiv = document.getElementById('countdown');
const levelSelect = document.getElementById('levelSelect');

let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

const gravity = 0.5;
const friction = 0.8;

let player, clone, platforms = [], goal = {};
let pastRuns = [[], [], []];
let currentLevel = 0;
let gameRunning = false;
let countdown = 3;
let timeLeft = 30;
let timerInterval = null;

class Player {
  constructor(x, y, color) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.record = [];
    this.timer = 0;
  }

  update(input) {
    if (input) {
      if (keys['ArrowLeft']) this.vx -= 0.5;
      if (keys['ArrowRight']) this.vx += 0.5;
      if (keys['Space'] && this.onGround) {
        this.vy = -10;
        this.onGround = false;
      }
    }

    this.vy += gravity;
    this.vx *= friction;

    this.x += this.vx;
    this.y += this.vy;

    this.onGround = false;
    for (let p of platforms) {
      if (
        this.x < p.x + p.w &&
        this.x + 20 > p.x &&
        this.y + 20 > p.y &&
        this.y + 20 < p.y + p.h
      ) {
        this.y = p.y - 20;
        this.vy = 0;
        this.onGround = true;
      }
    }

    if (input) {
      this.record.push({ x: this.x, y: this.y });
      this.timer++;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    ctx.fillStyle = '#555';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

function loadLevel(n) {
  currentLevel = n;
  platforms = [];

  const levelData = [
    // Level 1 – easier spacing
    [
      new Platform(0, 480, 800, 20),
      new Platform(150, 420, 100, 20),
      new Platform(300, 360, 100, 20),
      new Platform(450, 300, 100, 20),
      new Platform(600, 240, 100, 20),
    ],
    // Level 2 – medium difficulty
    [
      new Platform(0, 480, 800, 20),
      new Platform(200, 400, 100, 20),
      new Platform(350, 340, 100, 20),
      new Platform(500, 280, 100, 20),
      new Platform(650, 220, 100, 20),
    ],
    // Level 3 – hardest but still beatable
    [
      new Platform(0, 480, 800, 20),
      new Platform(100, 400, 100, 20),
      new Platform(250, 320, 100, 20),
      new Platform(400, 260, 100, 20),
      new Platform(550, 200, 100, 20),
      new Platform(700, 140, 100, 20),
    ]
  ];

  platforms = levelData[n];
  goal = { x: 750, y: 120, w: 30, h: 100 };

  player = new Player(100, 100, 'cyan');
  clone = new Player(100, 100, 'rgba(255,0,0,0.5)');

  startCountdown();
}

function startLevel(n) {
  levelSelect.style.display = 'none';
  clearInterval(timerInterval);
  loadLevel(n);
}

function startCountdown() {
  countdown = 3;
  countdownDiv.textContent = countdown;
  const interval = setInterval(() => {
    countdown--;
    if (countdown === 0) {
      countdownDiv.textContent = "GO!";
      setTimeout(() => {
        countdownDiv.textContent = "";
        gameRunning = true;
        timeLeft = 30;
        timerInterval = setInterval(() => {
          timeLeft--;
          if (timeLeft <= 0) {
            endGame(false);
          }
        }, 1000);
      }, 500);
      clearInterval(interval);
    } else {
      countdownDiv.textContent = countdown;
    }
  }, 1000);
}

function endGame(success) {
  gameRunning = false;
  clearInterval(timerInterval);

  if (success) {
    if (
      pastRuns[currentLevel].length === 0 ||
      player.timer < pastRuns[currentLevel].length
    ) {
      pastRuns[currentLevel] = player.record.slice();
      alert("🎉 Level Complete! Shadow updated.");
    } else {
      alert("Finished, but slower than your clone!");
    }
  } else {
    alert("⏰ Time’s up! Try again.");
  }

  levelSelect.style.display = "block";
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of platforms) p.draw();
  ctx.fillStyle = 'gold';
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);

  if (gameRunning) {
    player.update(true);
    if (pastRuns[currentLevel].length > 0 && pastRuns[currentLevel][player.timer]) {
      const pos = pastRuns[currentLevel][player.timer];
      clone.x = pos.x;
      clone.y = pos.y;
      clone.draw();
    }
  }

  player.draw();

  if (
    player.x > goal.x &&
    player.y > goal.y &&
    player.y < goal.y + goal.h
  ) {
    endGame(true);
  }

  ctx.fillStyle = 'white';
  ctx.font = "16px sans-serif";
  if (gameRunning) ctx.fillText("⏱️ Time Left: " + timeLeft + "s", 10, 20);

  requestAnimationFrame(gameLoop);
}

gameLoop();
