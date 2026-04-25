import { setupTimers, updateTimerDisplay } from "./timer.js";
import initBoard from "./board.js";
import game from "./game.js";
import displayPlayers from "./players.js";

export const socketClient = (userName, onPlayersFn) => {
  let callbacks = {
    onGameEnd: null,
    onGameStart: null,
    onMove: null
  };
  let playerColor = null;
  const socket = io(window.location.origin);

  const emitEvent = (event, data) => socket.emit(event, data);

  const initiate = (onGameStart, onMove, onGameEnd) => {
    callbacks = { onGameEnd, onGameStart, onMove };
  };

  socket.on("connect", () => {
    emitEvent("userConnected", { userName });
  });

  socket.on("players", (players) => {
    onPlayersFn(userName, players, (challenge) => emitEvent("challenge", challenge));
  });

  socket.on("usernameRejected", ({ message }) => {
    socket.disconnect();
    window.dispatchEvent(new CustomEvent("usernameRejected", { detail: { message } }));
  });

  socket.on("challengeFailed", ({ message }) => {
    window.alert(message);
  });

  socket.on("gameStart", (gameData) => {
    playerColor = gameData.white === userName ? "white" : "black";
    setupTimers(playerColor);
    callbacks.onGameStart?.(gameData);

    if (playerColor === "white") {
      emitEvent("startTimer", { gameId: gameData.gameId });
    }
  });

  socket.on("move", (data) => {
    callbacks.onMove?.(data);
  });

  socket.on("timerUpdate", (data) => {
    const timerId = data.color === playerColor ? "bottom_timer" : "top_timer";
    updateTimerDisplay(timerId, data.time);
  });

  socket.on("gameEnd", ({ result }) => {
    callbacks.onGameEnd?.(result);
  });

  return {
    disconnect: () => socket.disconnect(),
    initiate,
    onMoveSent: (data) => emitEvent("move", data)
  };
};

const initializeGame = () => {
  let currentSession = null;

  document.addEventListener("usernameSet", (event) => {
    const submittedUsername = event.detail.username;
    if (!submittedUsername) {
      return;
    }

    currentSession?.disconnect();

    const ws = socketClient(submittedUsername, displayPlayers);
    const board = initBoard(submittedUsername);
    game(ws, board);
    currentSession = ws;
  });
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializeGame);
}

export default socketClient;
