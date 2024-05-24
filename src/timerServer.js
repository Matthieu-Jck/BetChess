let playerTimers = {};

const clearPlayerTimers = (userName) => {
    if (playerTimers[userName]) {
        clearInterval(playerTimers[userName].whiteTimerInterval);
        clearInterval(playerTimers[userName].blackTimerInterval);
        delete playerTimers[userName];
    }
};

export const handleTimeUpdate = (color, userName, socket) => {
    console.log(`Updating time for ${color} player: ${userName}`);
    const timer = playerTimers[userName];
    if (!timer) return;
  
    const time = color === 'white' ? --timer.whiteTime : --timer.blackTime;
    if (time <= 0) {
        socket.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!`, userName });
      clearPlayerTimers(userName);
    }
    socket.emit('timerUpdate', { color, time, userName });
  };
  
  export const startTimer = (color, userName, socket) => {
    if (!playerTimers[userName]) {
        playerTimers[userName] = {
            whiteTime: 600,
            blackTime: 600,
            whiteTimerInterval: null,
            blackTimerInterval: null,
            gameEnded: false
        };
    }
    console.log(`Starting timer for ${color} player: ${userName}`);
    if (!playerTimers[userName] || playerTimers[userName].gameEnded) return;
  
    clearInterval(playerTimers[userName].whiteTimerInterval);
    clearInterval(playerTimers[userName].blackTimerInterval);
  
    console.log("about to bust handleTimeUpdate")
    const interval = setInterval(() => handleTimeUpdate(color, userName, socket), 1000);
    if (color === 'white') {
      playerTimers[userName].whiteTimerInterval = interval;
    } else {
      playerTimers[userName].blackTimerInterval = interval;
    }
  };

export { clearPlayerTimers };