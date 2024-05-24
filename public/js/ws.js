import { updateTimerDisplay, setupTimers } from './timer.js';

let gameEnded = false;
let playerColor = null; // Store the player's color

export const connectWs = (userName, onPlayersFn) => {
  const socket = io(window.SOCKET_URL);

  let onGameStartFn = null;
  let onMoveFn = null;

  const initiate = (startFn, moveFn) => {
    onGameStartFn = startFn;
    onMoveFn = moveFn;
  };

  const onChallenge = (players) => socket.emit("challenge", players);

  const onMove = (data) => {
    socket.emit("move", data);
  };

  const startTimer = (color) => {
    socket.emit("startTimer", { color });
  };

  const switchTimer = (color) => {
    socket.emit("switchTimer", { color });
  };

  socket.on("connect", () => {
    socket.emit("userConnected", { userName });
  });

  socket.on("players", (data) => {
    onPlayersFn(userName, data, onChallenge);
  });

  socket.on("gameStart", (data) => {
    onGameStartFn(data);
    playerColor = data.white === userName ? 'white' : 'black';
    setupTimers(playerColor);
    if (playerColor === 'white') {
      startTimer('white');
    }
  });

  socket.on("move", (data) => {
    console.log("Move event received", data);
    onMoveFn(data);
    switchTimer(playerColor);
  });

  socket.on('timerUpdate', (data) => {
    const isWhitePlayer = playerColor === 'white';
    if (data.color === 'white') {
      updateTimerDisplay(isWhitePlayer ? 'bottom_timer' : 'top_timer', data.time);
    } else {
      updateTimerDisplay(isWhitePlayer ? 'top_timer' : 'bottom_timer', data.time);
    }
  });

  socket.on("gameEnd", (data) => {
    console.log("Game end event received", data);
    alert(data.result);
    gameEnded = true;
  });

  return { initiate, onMove, startTimer, switchTimer, setupTimers };
};

export default connectWs;
