const target = document.getElementById("target");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const sound = document.getElementById("sound");

let score = 0;
let time = 30;
let interval;
let moveIntervalTime = 1500;

// Mueve el cuadrado a una posición aleatoria
function moveTarget() {
  const x = Math.random() * (gameArea.clientWidth - target.clientWidth);
  const y = Math.random() * (gameArea.clientHeight - target.clientHeight);
  target.style.left = x + "px";
  target.style.top = y + "px";
}

// Actualiza el temporizador cada segundo
function startTimer() {
  interval = setInterval(() => {
    time--;
    timerText.textContent = "Tiempo: " + time + "s";

    if(time <= 0) {
      endGame();
    }
  }, 1000);
}

// Fin del juego
function endGame() {
  clearInterval(interval);
  clearInterval(moveInterval);
  alert("¡Tiempo terminado! Puntaje final: " + score);
  restartBtn.style.display = "inline-block";
  target.style.display = "none";
}

// Reiniciar juego
restartBtn.addEventListener("click", () => {
  score = 0;
  time = 30;
  scoreText.textContent = "Puntos: " + score;
  timerText.textContent = "Tiempo: " + time + "s";
  restartBtn.style.display = "none";
  target.style.display = "block";
  moveIntervalTime = 1500;
  moveInterval = setInterval(moveTarget, moveIntervalTime);
  startTimer();
  moveTarget();
});

// Evento de click en el cuadrado
target.addEventListener("click", () => {
  score++;
  scoreText.textContent = "Puntos: " + score;
  sound.play();
  moveTarget();

  // Aumenta la dificultad cada 5 puntos
  if(score % 5 === 0 && moveIntervalTime > 300){
    moveIntervalTime -= 200;
    clearInterval(moveInterval);
    moveInterval = setInterval(moveTarget, moveIntervalTime);
  }
});

// Intervalo para mover el cuadrado automáticamente
let moveInterval = setInterval(moveTarget, moveIntervalTime);

// Inicia el juego
moveTarget();
startTimer();
