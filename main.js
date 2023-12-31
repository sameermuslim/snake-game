document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");
  const gameOverElement = document.getElementById("gameOver");

  const box = 20;
  let snake = [{ x: 0, y: 0 }];
  let food = { x: 0, y: 0 };
  let direction = "right";
  let score = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment) => {
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(segment.x, segment.y, box, box);
      ctx.strokeStyle = "#ecf0f1";
      ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // Draw food
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box, box);
    ctx.strokeStyle = "#ecf0f1";
    ctx.strokeRect(food.x, food.y, box, box);

    // Draw score
    scoreElement.textContent = "Score: " + score;

    // Move the snake
    let newHead = { x: snake[0].x, y: snake[0].y };

    if (direction === "right") newHead.x += box;
    if (direction === "left") newHead.x -= box;
    if (direction === "up") newHead.y -= box;
    if (direction === "down") newHead.y += box;

    snake.unshift(newHead);

    // Check for collision with food
    if (newHead.x === food.x && newHead.y === food.y) {
      // Generate new food
      food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
      };
      // Increase the score
      score++;
    } else {
      // Remove the last segment of the snake
      snake.pop();
    }

    // Check for collision with walls or itself
    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= canvas.width ||
      newHead.y >= canvas.height ||
      collision(newHead, snake.slice(1))
    ) {
      clearInterval(game);
      gameOverElement.style.display = "block";
    }
  }

  function collision(head, array) {
    return array.some(
      (segment) => head.x === segment.x && head.y === segment.y
    );
  }

  function changeDirection(event) {
    const key = event.keyCode;

    if (key === 37 && direction !== "right") {
      direction = "left";
    } else if (key === 38 && direction !== "down") {
      direction = "up";
    } else if (key === 39 && direction !== "left") {
      direction = "right";
    } else if (key === 40 && direction !== "up") {
      direction = "down";
    } else if (key === 32 && gameOverElement.style.display === "block") {
      // Restart the game on Space key press after game over
      resetGame();
    }
  }

  function resetGame() {
    snake = [{ x: 0, y: 0 }];
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    direction = "right";
    score = 0;
    gameOverElement.style.display = "none";
    game = setInterval(draw, 150);
  }

  document.addEventListener("keydown", changeDirection);

  let game = setInterval(draw, 150);
});
