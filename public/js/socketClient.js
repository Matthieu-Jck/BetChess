import { updateTimerDisplay, setupTimers } from './timer.js';
import initBoard from './board.js';
import displayPlayers from './players.js';
import game from './game.js';

let gameEnded = false;
let playerColor = null;
let username = null;

export const socketClient = (userName, onPlayersFn) => {

  let onGameStartFn = null;
  let onMoveFn = null;
  const socket = io(window.SOCKET_URL);
  const emitEvent = (event, data) => socket.emit(event, data);
  const initiate = (startFn, moveFn) => { onGameStartFn = startFn; onMoveFn = moveFn; };

  socket.on("connect", () => emitEvent("userConnected", { userName }));

  socket.on("players", (data) => onPlayersFn(userName, data, (players) => emitEvent("challenge", players)));

  socket.on("gameStart", (gameData) => {
    onGameStartFn(gameData);
    playerColor = gameData.white === userName ? 'white' : 'black';
    setupTimers(gameData, playerColor);
    if (playerColor === 'white') {
      emitEvent("startTimer", { game: gameData });
    }
  });

  socket.on("move", (data) => {
    console.log("Move received:", data);
    onMoveFn(data);
  });

  socket.on('timerUpdate', (data) => {
    const timerId = data.color === playerColor ? 'bottom_timer' : 'top_timer';
    updateTimerDisplay(timerId, data.time);
  });

  socket.on("gameEnd", (data) => {
    alert(data.result);
    gameEnded = true;
  });

  return {
    initiate,
    onMoveSent: (data) => emitEvent("move", data),
    startTimer: (color, user1, user2) => emitEvent("startTimer", { color, user1, user2 }),
    setupTimers
  };
};

const initializeGame = () => {
  if (!username) {
    username = prompt("Enter username");
  }

  if (username) {
    const ws = socketClient(username, displayPlayers);
    const board = initBoard(username);
    game(ws, board);
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('load', initializeGame);
}

export default socketClient;