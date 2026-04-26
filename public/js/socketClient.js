import { setupTimers, updateTimerDisplay } from "./timer.js";
import initBoard from "./board.js";
import game from "./game.js";
import {
  clearAllChallenges,
  clearChallenge,
  displayPlayers,
  showLobbyNotice,
  trackIncomingChallenge,
  trackOutgoingChallenge
} from "./players.js";
import { playChallengeReceived, playChallengeSent, playNotice } from "./sound.js";

export const socketClient = (userName) => {
  let callbacks = {
    onDisconnect: null,
    onGameEnd: null,
    onGameStart: null,
    onMove: null
  };
  let playerColor = null;
  const socket = io(window.location.origin);

  const emitEvent = (event, data) => socket.emit(event, data);

  const initiate = (onGameStart, onMove, onGameEnd, onDisconnect) => {
    callbacks = { onDisconnect, onGameEnd, onGameStart, onMove };
  };

  socket.on("connect", () => {
    emitEvent("userConnected", { userName });
  });

  socket.on("players", (players) => {
    displayPlayers(
      userName,
      players,
      (challenge) => emitEvent("challenge", challenge),
      (response) => emitEvent("challengeResponse", response)
    );
  });

  socket.on("usernameRejected", ({ message }) => {
    socket.disconnect();
    window.dispatchEvent(new CustomEvent("usernameRejected", { detail: { message } }));
  });

  socket.on("challengeFailed", ({ message }) => {
    showLobbyNotice(message, "danger");
    playNotice("danger");
  });

  socket.on("challengeSent", (invite) => {
    trackOutgoingChallenge(invite);
    playChallengeSent();
  });

  socket.on("challengeReceived", (invite) => {
    trackIncomingChallenge(invite);
    playChallengeReceived();
  });

  socket.on("challengeDeclined", ({ invitationId, message }) => {
    clearChallenge(invitationId);
    showLobbyNotice(message, "danger");
    playNotice("danger");
  });

  socket.on("challengeCancelled", ({ invitationId, message }) => {
    clearChallenge(invitationId);
    showLobbyNotice(message, "neutral");
    playNotice("neutral");
  });

  socket.on("gameStart", (gameData) => {
    clearAllChallenges();
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

  socket.on("disconnect", () => {
    playerColor = null;
    clearAllChallenges();
    callbacks.onDisconnect?.();
  });

  return {
    disconnect: () => socket.disconnect(),
    initiate,
    onGameResultAcknowledged: (data) => emitEvent("gameResultAcknowledged", data),
    onMoveSent: (data) => emitEvent("move", data),
    onSurrender: (data) => emitEvent("surrender", data)
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
    clearAllChallenges();

    const ws = socketClient(submittedUsername);
    const board = initBoard(submittedUsername);
    game(ws, board);
    currentSession = ws;
  });
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializeGame);
}

export default socketClient;
