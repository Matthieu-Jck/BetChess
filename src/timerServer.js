const playerTimers = {};

export const handleTimeUpdate = (color, gameId, socket1, socket2) => {
  const timer = playerTimers[gameId];
  if (!timer) return;

  const time = color === 'white' ? --timer.whiteTime : --timer.blackTime;
  if (time <= 0) {
    socket1.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, gameId });
    socket2.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, gameId });
    clearPlayerTimers(gameId);
  } else {
    socket1.emit('timerUpdate', { color, time });
    socket2.emit('timerUpdate', { color, time });
  }
};

const initializePlayerTimers = (gameId) => {
  if (!playerTimers[gameId]) {
    playerTimers[gameId] = {
      whiteTime: 600,
      blackTime: 600,
      whiteTimerInterval: null,
      blackTimerInterval: null,
      gameEnded: false
    };
  }
};

const tickTimer = (color, gameId, socket1, socket2) => {
  clearInterval(playerTimers[gameId][`${color}TimerInterval`]);
  playerTimers[gameId][`${color}TimerInterval`] = setInterval(() => handleTimeUpdate(color, gameId, socket1, socket2), 1000);
};

export const startTimer = (gameId, socket1, socket2) => {
  initializePlayerTimers(gameId);
  if (playerTimers[gameId].gameEnded) return;

  tickTimer('white', gameId, socket1, socket2);
};

export const switchTimer = (gameId, socket1, socket2) => {
  if (!playerTimers[gameId]) return;

  const timer = playerTimers[gameId];
  let currentColor;
  if (timer.whiteTimerInterval) {
    clearInterval(timer.whiteTimerInterval);
    timer.whiteTimerInterval = null;
    currentColor = 'white';
  } else if (timer.blackTimerInterval) {
    clearInterval(timer.blackTimerInterval);
    timer.blackTimerInterval = null;
    currentColor = 'black';
  } else {
    console.log('No active timer found for game:', gameId);
    return;
  }
  let oppositeColor = currentColor === 'white' ? 'black' : 'white';
  tickTimer(oppositeColor, gameId, socket1, socket2);
};

export const clearPlayerTimers = (gameId) => {
  if (playerTimers[gameId]) {
    clearInterval(playerTimers[gameId].whiteTimerInterval);
    clearInterval(playerTimers[gameId].blackTimerInterval);
    delete playerTimers[gameId];
  }
};