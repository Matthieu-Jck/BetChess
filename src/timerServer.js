let playerTimers = {};

const clearPlayerTimers = (userName) => {
  if (playerTimers[userName]) {
    clearInterval(playerTimers[userName].whiteTimerInterval);
    clearInterval(playerTimers[userName].blackTimerInterval);
    delete playerTimers[userName];
  }
};

export const handleTimeUpdate = (color, user, socket1, socket2) => {
  const timer = playerTimers[user];
  if (!timer) return;

  const time = color === 'white' ? --timer.whiteTime : --timer.blackTime;
  if (time <= 0) {
    socket1.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, user });
    socket2.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, user });
    clearPlayerTimers(user);
  } else {
    socket1.emit('timerUpdate', { color, time });
    socket2.emit('timerUpdate', { color, time });
  }
};

export const startTimer = (color, user, socket1, socket2) => {
  if (!playerTimers[user]) {
    playerTimers[user] = {
      whiteTime: 600,
      blackTime: 600,
      whiteTimerInterval: null,
      blackTimerInterval: null,
      gameEnded: false
    };
  }
  console.log(`Starting timer for ${color} player: ${user}`);
  if (playerTimers[user].gameEnded) return;

  if (color === 'white') {
    clearInterval(playerTimers[user].whiteTimerInterval);
    playerTimers[user].whiteTimerInterval = setInterval(() => handleTimeUpdate(color, user, socket1, socket2), 1000);
  } else {
    clearInterval(playerTimers[user].blackTimerInterval);
    playerTimers[user].blackTimerInterval = setInterval(() => handleTimeUpdate(color, user, socket1, socket2), 1000);
  }
};

export const switchTimer = (user, socket1, socket2) => {
  if (!playerTimers[user]) return;

  const timer = playerTimers[user];
  let currentColor;

  if (timer.whiteTimerInterval) {
    clearInterval(timer.whiteTimerInterval);
    currentColor = 'white';
  } else if (timer.blackTimerInterval) {
    clearInterval(timer.blackTimerInterval);
    currentColor = 'black';
  } else {
    console.log('No active timer found for user:', user);
    return;
  }

  const oppositeColor = currentColor === 'white' ? 'black' : 'white';

  startTimer(oppositeColor, user, socket1, socket2);
};

export { clearPlayerTimers };
