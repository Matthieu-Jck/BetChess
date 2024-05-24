import { updateTimerDisplay, setupTimers } from './timer.js';
import initBoard from './board.js';
import displayPlayers from './players.js';
import game from './game.js';

let gameEnded = false;
let playerColor = null;
let username = null;

export const connectWs = (userName, onPlayersFn) => {
  const socket = io(window.SOCKET_URL);

  let onGameStartFn = null;
  let onMoveFn = null;

  const initiate = (startFn, moveFn) => {
    onGameStartFn = startFn;
    onMoveFn = moveFn;
  };

  const emitEvent = (event, data) => socket.emit(event, data);

  socket.on("connect", () => emitEvent("userConnected", { userName }));

  socket.on("players", (data) => onPlayersFn(userName, data, (players) => emitEvent("challenge", players)));

  socket.on("gameStart", (data) => {
    onGameStartFn(data);
    playerColor = data.white === userName ? 'white' : 'black';
    setupTimers(playerColor);
    if (playerColor === 'white') emitEvent("startTimer", { color: 'white' });
  });

  socket.on("move", (data) => {
    console.log("Move event received", data);
    onMoveFn(data);
    emitEvent("switchTimer", { color: playerColor });
  });

  socket.on('timerUpdate', (data) => {
    const timerId = (data.color === 'white') === (playerColor === 'white') ? 'bottom_timer' : 'top_timer';
    updateTimerDisplay(timerId, data.time);
  });

  socket.on("gameEnd", (data) => {
    console.log("Game end event received", data);
    alert(data.result);
    gameEnded = true;
  });

  return {
    initiate,
    onMove: (data) => emitEvent("move", data),
    startTimer: (color) => emitEvent("startTimer", { color }),
    switchTimer: (color) => emitEvent("switchTimer", { color }),
    setupTimers
  };
};

const initializeGame = () => {
  if (username === null) {
    username = prompt("Enter username");
  }

  if (username) {
    const ws = connectWs(username, displayPlayers);
    const board = initBoard(username);
    game(ws, board);
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('load', initializeGame);
}

export default connectWs;