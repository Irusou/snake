const BOARD_WIDTH = 600;
const BOARD_HEIGHT = BOARD_WIDTH;
const SNAKE_BODY_SIZE = 20;
const MOVE_UNIT = SNAKE_BODY_SIZE;
const START_POINT = BOARD_WIDTH / 2;
const EATING_SCORE = SNAKE_BODY_SIZE / 2;
const TICK = 100;
const CANVA_BACKGROUND = "#8FBC8F";
const CANVA_STROKE = "black";
const SNAKE_HEAD_COLOR = "darkgreen";
const SNAKE_BODY_COLOR = "lightgreen";
const FRUIT_COLOR = "red";
const FRUIT_STROKE = "darkred";
const KEY_UP = 87;
const KEY_DOWN = 83;
const KEY_LEFT = 65;
const KEY_RIGHT = 68;
const KEY_PAUSE = 80;
const KEY_START = 75;
const KEY_RESTART = 82;

const scoreLabel = document.querySelector(".score");
const controls = document.querySelector(".controls");
const canvas = document.getElementById("gameCanvas");
canvas.width = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;

const ctx = canvas.getContext("2d");

let dx = MOVE_UNIT;
let dy = 0;
let foodX;
let foodY;

ctx.fillStyle = CANVA_BACKGROUND;
ctx.fillRect(0, 0, canvas.width, canvas.height);

let head = { x: START_POINT, y: START_POINT };
let snake = [
  head,
  { x: head.x - 1 * SNAKE_BODY_SIZE, y: head.y },
  { x: head.x - 2 * SNAKE_BODY_SIZE, y: head.y },
  { x: head.x - 3 * SNAKE_BODY_SIZE, y: head.y },
  { x: head.x - 4 * SNAKE_BODY_SIZE, y: head.y },
];
let score = 0;

function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_BODY_COLOR;
  ctx.strokeStyle = CANVA_STROKE;
  ctx.fillRect(snakePart.x, snakePart.y, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
  ctx.strokeRect(snakePart.x, snakePart.y, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
}

function drawSnakeHead(head) {
  ctx.fillStyle = SNAKE_HEAD_COLOR;
  ctx.strokeStyle = CANVA_STROKE;
  ctx.fillRect(head.x, head.y, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
  ctx.strokeRect(head.x, head.y, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
  drawSnakeHead(snake[0]);
}

function advanceSnake(dx, dy) {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    createFood();
    score += EATING_SCORE;
    scoreLabel.innerText = `score: ${score}`;
  } else {
    snake.pop();
  }
}

function clearCanvas() {
  ctx.fillStyle = CANVA_BACKGROUND;
  ctx.strokeStyle = CANVA_STROKE;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function changeDirection(event) {
  switch (event.keyCode) {
    case KEY_UP:
      dx = 0;
      if (dy == 0) dy = -MOVE_UNIT;
      break;
    case KEY_DOWN:
      dx = 0;
      if (dy == 0) dy = MOVE_UNIT;
      break;
    case KEY_LEFT:
      if (dx == 0) dx = -MOVE_UNIT;
      dy = 0;
      break;
    case KEY_RIGHT:
      if (dx == 0) dx = MOVE_UNIT;
      dy = 0;
      break;
    case KEY_PAUSE:
      console.error("TODO!");
      return;
      let old_tick = 0;
      if (current_tick != 0) {
        old_tick = current_tick;
        current_tick = 0;
      } else {
        current_tick = old_tick;
      }
      console.log({ current_tick, old_tick });
      break;
    case KEY_START:
      main();
      break;
    case KEY_RESTART:
      head = { x: START_POINT, y: START_POINT };
      snake = [
        head,
        { x: head.x - 1 * SNAKE_BODY_SIZE, y: head.y },
        { x: head.x - 2 * SNAKE_BODY_SIZE, y: head.y },
        { x: head.x - 3 * SNAKE_BODY_SIZE, y: head.y },
        { x: head.x - 4 * SNAKE_BODY_SIZE, y: head.y },
      ];
      dx = MOVE_UNIT;
      dy = 0;
      score = 0;
      main();
      break;
  }
}

function randomTen(min, max) {
  return (
    Math.round((Math.random() * (max - min) + min) / SNAKE_BODY_SIZE) *
    SNAKE_BODY_SIZE
  );
}

function createFood() {
  foodX = randomTen(0, canvas.width - SNAKE_BODY_SIZE);
  foodY = randomTen(0, canvas.height - SNAKE_BODY_SIZE);

  snake.forEach((part) => {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = FRUIT_COLOR;
  ctx.strokestyle = FRUIT_STROKE;
  ctx.fillRect(foodX, foodY, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
  ctx.strokeRect(foodX, foodY, SNAKE_BODY_SIZE, SNAKE_BODY_SIZE);
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (didCollide) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - SNAKE_BODY_SIZE;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - SNAKE_BODY_SIZE;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

document.addEventListener("keydown", changeDirection);

function main() {
  controls.style.display = "none";
  if (didGameEnd()) return;
  scoreLabel.innerText = `Score: ${score}`;
  createFood();
  const intervalId = setInterval(() => {
    if (didGameEnd()) {
      clearInterval(intervalId);
      scoreLabel.innerText = `Final Score: ${score}`;
      controls.style.display = "flex";
      return;
    }
    clearCanvas();
    drawFood();
    advanceSnake(dx, dy);
    drawSnake();
  }, TICK);
}
