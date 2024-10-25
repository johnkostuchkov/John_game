var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 50;
var dx = 5;
var dy = -5;
var ballRadius = 10;
var paddleHeight = 20;
var paddleWidth = 125;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 6;
var brickHeight = 20;
var brickWidth = 100;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brick = [];
for (c = 0; c < brickColumnCount; c++) {
  brick[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    brick[c][r] = { x: 0, y: 0, status: 1 };
  }
}
var score = 0;
var lives = 3;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBrick() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (brick[c][r].status === 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                brick[c][r].x = brickX;
                brick[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brick[c][r].x, brick[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = brick[c][r];
            if (b.status == 1) {
                if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickColumnCount*brickRowCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBrick();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  drawLives();
  x += dx;
  y += dy;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      if (dx > 0) {
        dx += 0.3;
      } else {
        dx -= 0.3;
      }
      dy -= 0.3;
    } else if (y + dy > canvas.height - ballRadius + 5) {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
        
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 5;
        dy = -5;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  if (leftPressed && paddleX > 0) {
    paddleX += -10;
  }
  if (rightPressed && paddleX + paddleWidth < canvas.width) {
    paddleX += 10;
  }
  requestAnimationFrame(draw);
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
draw();