const gameArea = document.getElementById("gameArea");
const bird = document.getElementById("bird");
const scoreText = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let birdTop = 250;
let gravity = 1;       // caída suave
let birdVelocity = 0;
let jumpStrength = -10; // salto más largo
let score = 0;
let gameInterval;
let obstacleInterval;
let obstacles = [];
let obstacleSpeed = 2; // obstáculos más lentos

// Función para saltar
function jump() {
  birdVelocity = jumpStrength;
}

// Crear obstáculos
function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const height = Math.floor(Math.random() * 300) + 100;
  obstacle.style.height = height + "px";

  const gap = 150;
  const topObstacle = document.createElement("div");
  topObstacle.classList.add("obstacle");
  topObstacle.style.height = (gameArea.clientHeight - height - gap) + "px";
  topObstacle.style.top = "0";
  topObstacle.style.background = "green";

  obstacle.style.left = gameArea.clientWidth + "px";
  topObstacle.style.left = gameArea.clientWidth + "px";

  gameArea.appendChild(obstacle);
  gameArea.appendChild(topObstacle);

  obstacles.push({ bottom: obstacle, top: topObstacle, passed: false });
}

// Actualizar el juego
function updateGame() {
  // Movimiento del pájaro
  birdVelocity += gravity;
  birdTop += birdVelocity;
  bird.style.top = birdTop + "px";

  // Checar colisiones y mover obstáculos
  obstacles.forEach((obs, index) => {
    let left = parseInt(obs.bottom.style.left);
    left -= obstacleSpeed;
    obs.bottom.style.left = left + "px";
    obs.top.style.left = left + "px";

    // Colisión con el suelo o techo
    if(birdTop + bird.clientHeight >= gameArea.clientHeight || birdTop <= 0){
      endGame();
    }

    // Colisión con obstáculos
    if (
      (bird.offsetLeft + bird.clientWidth > left && bird.offsetLeft < left + obs.bottom.clientWidth) &&
      (bird.offsetTop + bird.clientHeight > gameArea.clientHeight - parseInt(obs.bottom.style.height) ||
       bird.offsetTop < parseInt(obs.top.style.height))
    ) {
      endGame();
    }

    // Sumar puntos
    if (!obs.passed && left + obs.bottom.clientWidth < bird.offsetLeft) {
      score++;
      scoreText.textContent = "Puntos: " + score;
      obs.passed = true;
    }

    // Remover obstáculos fuera de la pantalla
    if(left + obs.bottom.clientWidth < 0){
      gameArea.removeChild(obs.bottom);
      gameArea.removeChild(obs.top);
      obstacles.splice(index,1);
    }
  });
}

// Iniciar juego
function startGame() {
  birdTop = 250;
  birdVelocity = 0;
  score = 0;
  scoreText.textContent = "Puntos: 0";
  obstacles.forEach(obs => {
    gameArea.removeChild(obs.bottom);
    gameArea.removeChild(obs.top);
  });
  obstacles = [];
  restartBtn.style.display = "none";

  gameInterval = setInterval(updateGame, 20);
  obstacleInterval = setInterval(createObstacle, 2500);
}

// Terminar juego
function endGame() {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  restartBtn.style.display = "inline-block";
}

// Evento de salto
document.addEventListener("keydown", (e) => {
  if(e.code === "Space"){
    jump();
  }
});

// Reiniciar juego
restartBtn.addEventListener("click", startGame);

// Iniciar juego al cargar
startGame();
