const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const gameOverMsg = document.getElementById("gameOver");

const gridSize = 20;
const tileSize = 20;
let snake = [{x: 10, y: 10}];
let direction = {x: 0, y: 0};
let foodArray = [];
let score = 0;
let gameInterval;
let gameRunning = true;

// Dibujar juego
function draw() {
  gameArea.innerHTML = "";

  // Dibujar comida
  foodArray.forEach(food => {
    const foodElement = document.createElement("div");
    foodElement.classList.add("food");
    foodElement.style.left = food.x * tileSize + "px";
    foodElement.style.top = food.y * tileSize + "px";
    gameArea.appendChild(foodElement);
  });

  // Dibujar serpiente
  snake.forEach(segment => {
    const snakeElement = document.createElement("div");
    snakeElement.classList.add("snake");
    snakeElement.style.left = segment.x * tileSize + "px";
    snakeElement.style.top = segment.y * tileSize + "px";
    gameArea.appendChild(snakeElement);
  });
}

// Generar comida según la puntuación
function spawnFood() {
  foodArray = [];
  let foodCount = Math.floor(score / 10) * 2;
  if(foodCount === 0) foodCount = 1;

  for(let i = 0; i < foodCount; i++){
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while(
      snake.some(seg => seg.x === newFood.x && seg.y === newFood.y) ||
      foodArray.some(f => f.x === newFood.x && f.y === newFood.y)
    );
    foodArray.push(newFood);
  }
}

// Actualizar juego
function update() {
  if(!gameRunning) return;

  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // Colisiones (ignorar la cola porque se moverá en este tick)
  let bodyWithoutTail = snake.slice(0, -1);

  if (
    head.x < 0 || head.x >= gridSize || 
    head.y < 0 || head.y >= gridSize ||
    bodyWithoutTail.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    endGame("Game Over");
    return;
  }

  snake.unshift(head);

  // Comer comida
  let ateFood = false;
  foodArray.forEach((food, index) => {
    if(head.x === food.x && head.y === food.y){
      ateFood = true;
      foodArray.splice(index, 1);
      score++;
      scoreText.textContent = "Puntos: " + score;
    }
  });

  if(!ateFood){
    snake.pop();
  }

  // Generar nueva comida si se acabó
  if(foodArray.length === 0){
    spawnFood();
  }

  // Verificar victoria
  if(snake.length === gridSize * gridSize){
    endGame("¡Tu ganaste!");
    return;
  }

  draw();
}

// Terminar juego
function endGame(message) {
  clearInterval(gameInterval);
  gameRunning = false;
  gameOverMsg.innerHTML = message + "<br>Presiona cualquier tecla para reiniciar";
  gameOverMsg.style.display = "block";
}

// Iniciar juego
function startGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 0, y: 0};
  score = 0;
  scoreText.textContent = "Puntos: " + score;
  gameRunning = true;
  gameOverMsg.style.display = "none";
  spawnFood();
  draw();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 150);
}

// Controles
document.addEventListener("keydown", (e) => {
  if(gameRunning){
    if(e.key === "ArrowUp" && direction.y !== 1) direction = {x:0, y:-1};
    if(e.key === "ArrowDown" && direction.y !== -1) direction = {x:0, y:1};
    if(e.key === "ArrowLeft" && direction.x !== 1) direction = {x:-1, y:0};
    if(e.key === "ArrowRight" && direction.x !== -1) direction = {x:1, y:0};
  } else {
    startGame(); // reiniciar con cualquier tecla
  }
});

  // Función para hacer scroll al inicio de la página
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Animación suave
    });
  }

// Iniciar juego al cargar
startGame();

