let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
// draw on the screen to get the context, ask canvas  to get the 2d context

// snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;
// size and count of a tile
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
// head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
// apple size
let appleX = 5;
let appleY = 5;
// movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let hiScore = 0;
let newHiScore = false;

let gulpSound = new Audio("gulp.mp3");

function init() {
  // speed of the game
  speed = 7;
  // size and count of a tile
  tileCount = 20;
  tileSize = canvas.width / tileCount - 2;
  // head of the snake
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  // apple size
  appleX = 5;
  appleY = 5;
  // movement
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
  newHiScore = false;

  window.clearTimeout(moveTimeout);
}

let moveTimeout;

//game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > speed) {
    speed = score + 1;
  }

  this.moveTimeout = setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  //walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", " magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    ctx.font = "20px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText(
      "Press Space Bar to restart",
      canvas.width / 5,
      canvas.height / 1.5
    );
    if (newHiScore) {
      ctx.font = "28px Verdana";
      ctx.fillStyle = "#CE3030";
      ctx.fillText(
        `New Hi Score : ${hiScore}`,
        canvas.width / 5,
        canvas.height / 3
      );
    }
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("HiScore : " + hiScore, 10, 10);
  ctx.fillText("Score : " + score, canvas.width - 60, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); 
  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

    // Add the eyes
    ctx.fillStyle = "black";
    let eyeRadius = tileSize * 0.1;  // eye size
    let eyeOffsetX = tileSize * 0.2;
    let eyeOffsetY = tileSize * 0.3; 
  
    // left eye
    ctx.beginPath();
    ctx.arc(
      (headX * tileCount) + eyeOffsetX,
      (headY * tileCount) + eyeOffsetY,
      eyeRadius, 0, Math.PI * 2
    );
    ctx.fill();
  
    // right eye
    ctx.beginPath();
    ctx.arc(
      (headX * tileCount) + tileSize - eyeOffsetX,
      (headY * tileCount) + eyeOffsetY,
      eyeRadius, 0, Math.PI * 2
    );
    ctx.fill();

    // Add a cheeky tongue
  ctx.strokeStyle = "#D80073";
  ctx.lineWidth = 2; 
  // Where the tongue begins
  let tongueStartX = (headX * tileCount) + (tileSize / 2);
  let tongueStartY = (headY * tileCount) + tileSize;
  ctx.beginPath();
  ctx.moveTo(tongueStartX, tongueStartY); // Start in middle of head at bottom
  // Fork the tongue
  ctx.lineTo(tongueStartX, tongueStartY + tileSize * 0.3); // Main tongue
  ctx.moveTo(tongueStartX, tongueStartY + tileSize * 0.3); // Move back to fork
  ctx.lineTo(tongueStartX - tileSize * 0.1, tongueStartY + tileSize * 0.2); // Left fork
  ctx.moveTo(tongueStartX, tongueStartY + tileSize * 0.3); // Move back to fork
  ctx.lineTo(tongueStartX + tileSize * 0.1, tongueStartY + tileSize * 0.2); // Right fork

  ctx.stroke();
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  // apple itself
  ctx.fillStyle = "#CF3C2E";
  ctx.beginPath();
  ctx.arc(
    appleX * tileCount + tileSize / 2, // x-coord for circle center
    appleY * tileCount + tileSize / 2, // y-coord for the circle center
    tileSize / 2, // radius 
    0, // start angle
    Math.PI * 2 // end angle
  );
  ctx.fill();

  // cheeky leaf
  ctx.fillStyle = "#008000";
  ctx.beginPath();
  ctx.ellipse(
    appleX * tileCount + tileSize / 2, //
    appleY * tileCount + tileSize / 2 - tileSize / 2, 
    tileSize / 6, // leaf width
    tileSize / 10, // leaf height
    Math.PI / 4, // tilt the precious leaf.
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function checkAppleCollision() {
  if (appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    if (score > hiScore) {
      hiScore = score;
      newHiScore = true;
    }
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38 || event.keyCode == 87) {
    //87 is w
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  //down
  if (event.keyCode == 40 || event.keyCode == 83) {
    // 83 is s
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  //left
  if (event.keyCode == 37 || event.keyCode == 65) {
    // 65 is a
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  //right
  if (event.keyCode == 39 || event.keyCode == 68) {
    //68 is d
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }

  if (event.keyCode === 32 && isGameOver()) {
    console.log("Restarting Game");
    init();
    drawGame();
  }
}

drawGame();
