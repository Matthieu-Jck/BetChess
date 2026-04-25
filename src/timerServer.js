const INITIAL_TIME = 20 * 60;
const gameTimers = new Map();

const ensureTimerState = (gameId) => {
  if (!gameTimers.has(gameId)) {
    gameTimers.set(gameId, {
      activeColor: null,
      blackTime: INITIAL_TIME,
      intervalId: null,
      onTimeout: null,
      whiteTime: INITIAL_TIME
    });
  }

  return gameTimers.get(gameId);
};

const emitTimerUpdate = (color, time, socket1, socket2) => {
  socket1?.emit("timerUpdate", { color, time });
  socket2?.emit("timerUpdate", { color, time });
};

const clearPlayerTimers = (gameId) => {
  const timerState = gameTimers.get(gameId);
  if (!timerState) {
    return;
  }

  clearInterval(timerState.intervalId);
  gameTimers.delete(gameId);
};

const finishOnTime = (activeColor, socket1, socket2, gameId) => {
  const timerState = gameTimers.get(gameId);
  const loser = activeColor === "white" ? socket1?.data.username : socket2?.data.username;
  const winner = activeColor === "white" ? socket2?.data.username : socket1?.data.username;
  const result = `${winner} wins on time against ${loser}.`;

  timerState?.onTimeout?.(result);
  clearPlayerTimers(gameId);
};

const startColorTimer = (gameId, color, socket1, socket2) => {
  const timerState = ensureTimerState(gameId);
  clearInterval(timerState.intervalId);
  timerState.activeColor = color;

  timerState.intervalId = setInterval(() => {
    const timeKey = color === "white" ? "whiteTime" : "blackTime";
    timerState[timeKey] -= 1;

    if (timerState[timeKey] <= 0) {
      finishOnTime(color, socket1, socket2, gameId);
      return;
    }

    emitTimerUpdate(color, timerState[timeKey], socket1, socket2);
  }, 1000);
};

const startTimer = (gameId, socket1, socket2, onTimeout) => {
  const timerState = ensureTimerState(gameId);
  timerState.onTimeout = onTimeout;
  startColorTimer(gameId, "white", socket1, socket2);
};

const switchTimer = (gameId, socket1, socket2, onTimeout) => {
  const timerState = gameTimers.get(gameId);
  if (!timerState || !timerState.activeColor) {
    return;
  }

  timerState.onTimeout = onTimeout;
  const nextColor = timerState.activeColor === "white" ? "black" : "white";
  startColorTimer(gameId, nextColor, socket1, socket2);
};

export { clearPlayerTimers, startTimer, switchTimer };
