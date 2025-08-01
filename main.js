const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

const gravity = 0.5;
const friction = 0.8;
let pastRun = [];

class Player {
  constructor(x, y, color) {
    this.startX = x;
    this.startY = y;
    this.reset();
    this.color = color;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.record = [];
    this.timer = 0;
  }

  update(input, platforms) {
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

    // Collision with ground/platforms
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

const player = new Player(100, 100, 'cyan');
const clone = new Player(100, 100, 'rgba(255,0,0,0.5)');
const platforms = [
  new Platform(0, 480, 800, 20),
  new Platform(150, 400, 100, 20),
  new Platform(300, 330, 100, 20),
  new Platform(500, 270, 100, 20),
  new Platform(650, 200, 100, 20)
];

let playing = true;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  for (let p of platforms) p.draw();

  // Update & draw player
  if (playing) {
    player.update(true, platforms);
  } else {
    player.reset();
    clone.reset();
  }
  player.draw();

  // Update & draw clone (from memory)
  if (pastRun.length > 0 && pastRun[player.timer]) {
    let pos = pastRun[player.timer];
    clone.x = pos.x;
    clone.y = pos.y;
    clone.draw();
  }

  // Finish line
  ctx.fillStyle = 'gold';
  ctx.fillRect(750, 180, 30, 100);

  if (player.x > 750 && player.y > 180 && player.y < 280) {
    playing = false;
    if (pastRun.length === 0 || player.timer < pastRun.length) {
      pastRun = player.record.slice();
      alert('🎉 New Best Time! Shadow clone updated.');
    } else {
      alert('😎 You finished, but slower than your clone!');
    }
    player.reset();
    setTimeout(() => { playing = true; }, 1000);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
