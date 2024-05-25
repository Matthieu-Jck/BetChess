let playerTimers = {};

const clearPlayerTimers = (userName) => {
  if (playerTimers[userName]) {
      clearInterval(playerTimers[userName].whiteTimerInterval);
      clearInterval(playerTimers[userName].blackTimerInterval);
      delete playerTimers[userName];
  }
};

export const handleTimeUpdate = (color, user1, user2, socket1, socket2) => {
  console.log(`Updating time for ${color} player: ${user1}`);
  const timer = playerTimers[user1];
  if (!timer) return;

  const time = color === 'white' ? --timer.whiteTime : --timer.blackTime;
  if (time <= 0) {
      socket.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, user1 });
      clearPlayerTimers(user1);
  }
  socket1.emit('timerUpdate', { color, time });
  socket2.emit('timerUpdate', { color, time });
};

export const startTimer = (color, user1, user2, socket1, socket2) => {
  if (!playerTimers[user1]) {
      playerTimers[user1] = {
          whiteTime: 600,
          blackTime: 600,
          whiteTimerInterval: null,
          blackTimerInterval: null,
          gameEnded: false
      };
  }
  console.log(`Starting timer for ${color} player: ${user1}`);
  if (playerTimers[user1].gameEnded) return;

  if (color === 'white') {
      clearInterval(playerTimers[user1].whiteTimerInterval);
      playerTimers[user1].whiteTimerInterval = setInterval(() => handleTimeUpdate(color, user1, user2, socket1, socket2), 1000);
  } else {
      clearInterval(playerTimers[user1].blackTimerInterval);
      playerTimers[user1].blackTimerInterval = setInterval(() => handleTimeUpdate(color, user1, user2, socket1, socket2), 1000);
  }
};

export { clearPlayerTimers };
