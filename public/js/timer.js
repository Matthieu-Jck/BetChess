let whiteTime = 600; // 10 minutes in seconds
let blackTime = 600; // 10 minutes in seconds
let whiteTimerInterval = null;
let blackTimerInterval = null;
let gameEnded = false;

const startTimer = (color, io) => {
  if (gameEnded) return;
  if (color === 'white') {
    clearInterval(whiteTimerInterval);
    whiteTimerInterval = setInterval(() => {
      whiteTime--;
      io.emit('timerUpdate', { color: 'white', time: whiteTime });
      if (whiteTime <= 0 && !gameEnded) {
        clearInterval(whiteTimerInterval);
        clearInterval(blackTimerInterval);
        io.emit('gameEnd', { result: 'White loses on time!' });
        gameEnded = true;
      }
    }, 1000);
  } else {
    clearInterval(blackTimerInterval);
    blackTimerInterval = setInterval(() => {
      blackTime--;
      io.emit('timerUpdate', { color: 'black', time: blackTime });
      if (blackTime <= 0 && !gameEnded) {
        clearInterval(whiteTimerInterval);
        clearInterval(blackTimerInterval);
        io.emit('gameEnd', { result: 'Black loses on time!' });
        gameEnded = true;
      }
    }, 1000);
  }
};

const switchTimer = (color, io) => {
  if (color === 'white') {
    clearInterval(blackTimerInterval);
    startTimer('white', io); 
  } else {
    clearInterval(whiteTimerInterval);
    startTimer('black', io);
  }
};

export const handleTimerEvents = (socket, io) => {
  socket.on("startTimer", (data) => startTimer(data.color, io));
  socket.on("switchTimer", (data) => switchTimer(data.color, io));
};

export const updateTimerDisplay = (elementId, time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById(elementId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const setupTimers = (color) => {
  document.getElementById('top_timer').style.display = 'block';
  document.getElementById('bottom_timer').style.display = 'block';
  if (color === 'white') {
    document.getElementById('bottom_timer').style.backgroundColor = 'white';
    document.getElementById('bottom_timer').style.color = 'black';
    document.getElementById('top_timer').style.backgroundColor = 'rgba(0, 0, 0)';
    document.getElementById('top_timer').style.color = 'white';
  } else {
    document.getElementById('top_timer').style.backgroundColor = 'white';
    document.getElementById('top_timer').style.color = 'black';
    document.getElementById('bottom_timer').style.backgroundColor = 'rgba(0, 0, 0)';
    document.getElementById('bottom_timer').style.color = 'white';
  }
};
