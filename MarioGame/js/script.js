const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const restartButton = document.getElementById('restart-button');
const velocidadePorSegundo = window.innerWidth / 1.5;
const velocidadePorPixels = '1s';
let marioStatus = 'alive';
let score = 0;
let record = parseInt(localStorage.getItem('record')) || 0;

pipe.style.animationDuration = `${velocidadePorPixels} ${velocidadePorSegundo}px`;


restartButton.style.display = 'none';

const jump = () => {
  mario.classList.add('jump');

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
}

document.addEventListener('touchstart', (event) => {
  if (event.touches.length === 1) {
    jump();
  }
});

document.addEventListener('click', (event) => {
  if (event.target === mario) {
    jump();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    restart();
  }

  if (event.key === ' ') {
    jump();
  }

  if (event.key === 'ArrowUp') {
    jump();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === ' ' && marioStatus === 'dead') {
    restart();
  }
});

const updateScore = () => {
  if (marioStatus === 'alive') {
    score += 1;
    document.getElementById('score').innerHTML = score;
    if (score > record) {
      record = score;
      localStorage.setItem('record', record);
      document.getElementById('record').innerHTML = record;
    }
  }
  setTimeout(updateScore, 600);
}

const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));
  if (marioStatus === 'dead') {
    restartButton.style.display = 'block';
  }
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;
    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = './images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';
    marioStatus = 'dead';
    clearInterval(scoreInterval);
    clearInterval(loop);
  }
}, 10);

const restart = () => {
  location.reload();
}

restartButton.addEventListener('click', restart);

setTimeout(updateScore, 600);

document.getElementById('record').innerHTML = record;

