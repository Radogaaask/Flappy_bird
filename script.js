const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();

img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Основные настройки игры
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.0;
const size = [51, 36];
const jump = -10.5;
const scale = canvas.width / 431;
const cTenth = canvas.width / 10 / scale;

let index = 0;
let bestScore = localStorage.getItem("bestScore") || 0; // Получаем лучший результат из localStorage
let flight;
let flyHeight;
let currentScore;
let pipes;

// Настройки трубы
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  flyHeight = canvas.height / 2 - size[1] / 2;

  // Установка первых трех труб
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

const render = () => {
  // Создание трубы и полета птицы
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background (часть 1)
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width / scale,
    canvas.height / scale,
    -(index * (speed / 2)) % (canvas.width / scale),
    0,
    canvas.width,
    canvas.height
  );
  // background (часть2)
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width / scale,
    canvas.height / scale,
    (-(index * (speed / 2)) % (canvas.width / scale)) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // Отображение труб
  if (gamePlaying) {
    pipes.map((pipe) => {
      // Движение трубы
      pipe[0] -= speed;

      // Верхние трубы
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      // Нижние трубы
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // Набор очков и создание новой трубы
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        // Проверка на лучший результат
        bestScore = Math.max(bestScore, currentScore);

        // Удаление и создание новых труб
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }

      // Конец игры
      if (
        (pipe[0] <= cTenth + size[0] &&
          pipe[0] + pipeWidth >= cTenth &&
          (pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1])) ||
        flyHeight + size[1] >= canvas.height
      ) {
        // Птица коснулась трубы или нижней части игрового поля, игра заканчивается
        gamePlaying = false;

        // Обновляем лучший результат
        bestScore = Math.max(bestScore, currentScore);
        localStorage.setItem("bestScore", bestScore); // Записываем лучший результат в localStorage

        setup();
      } else {
        // Проверка верхней границы игрового поля
        if (flyHeight <= 0) {
          // Птица достигла верхней границы игрового поля, ограничим ее движение
          flyHeight = 0;
          flight = 0;
        }
      }
    });
  }
  // Отрисовка птицы
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;
    // Текст
    ctx.fillText(`Best score : ${bestScore}`, 235, 150);
    ctx.fillText("Click to play", 250, 450);
    ctx.font = "bold 36px courier";
  }

  document.getElementById("bestScore").innerHTML = `Best : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Current : ${currentScore}`;

  // Отображение анимации в браузере
  window.requestAnimationFrame(render);
};

// Запуск
setup();
img.onload = render;

// Начало игры
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);