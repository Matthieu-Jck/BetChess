import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { clearPlayerTimers, startTimer, switchTimer } from "./timerServer.js";

let socketIO = null;

const playersByUsername = new Map();
const socketToUsername = new Map();
const gamesById = new Map();
const invitationsById = new Map();

const isParticipant = (game, username) => game.white === username || game.black === username;

const getGameByUsername = (username, predicate = () => true) => {
  return Array.from(gamesById.values()).find((game) => isParticipant(game, username) && predicate(game));
};

const getActiveGameByUsername = (username) => getGameByUsername(username, (game) => game.status === "active");

const getFinishedGameByUsername = (username) => getGameByUsername(username, (game) => game.status === "finished");

const isPlayerBusy = (username) => {
  return Boolean(getGameByUsername(username));
};

const listPlayers = () =>
  Array.from(playersByUsername.values()).map(({ socketId, username }) => ({
    inGame: isPlayerBusy(username),
    socketId,
    username
  }));

const getSocketByUsername = (username) => {
  const player = playersByUsername.get(username);
  return player ? socketIO.sockets.sockets.get(player.socketId) : null;
};

const getGameById = (gameId) => gamesById.get(gameId);

const broadcastPlayers = () => {
  socketIO.emit("players", listPlayers());
};

const notifyPlayer = (username, event, payload) => {
  getSocketByUsername(username)?.emit(event, payload);
};

const findExistingInvitation = (from, to) => {
  return Array.from(invitationsById.values()).find((invite) => invite.from === from && invite.to === to);
};

const cancelInvitation = (invitationId, message) => {
  const invite = invitationsById.get(invitationId);
  if (!invite) {
    return;
  }

  invitationsById.delete(invitationId);
  notifyPlayer(invite.from, "challengeCancelled", { invitationId, message });
  notifyPlayer(invite.to, "challengeCancelled", { invitationId, message });
};

const cancelInvitationsForPlayer = (username, message, excludedInvitationId = null) => {
  Array.from(invitationsById.values())
    .filter((invite) => (invite.from === username || invite.to === username) && invite.invitationId !== excludedInvitationId)
    .forEach((invite) => cancelInvitation(invite.invitationId, message));
};

const acknowledgeFinishedGame = (game, username) => {
  if (!game || game.status !== "finished" || !isParticipant(game, username)) {
    return false;
  }

  game.acknowledgedUsers ??= new Set();
  const previousSize = game.acknowledgedUsers.size;
  game.acknowledgedUsers.add(username);
  return game.acknowledgedUsers.size !== previousSize;
};

const shouldRemoveFinishedGame = (game) => {
  if (!game || game.status !== "finished") {
    return false;
  }

  return [game.white, game.black].every(
    (username) => !playersByUsername.has(username) || game.acknowledgedUsers?.has(username)
  );
};

const removeGame = (gameId) => {
  clearPlayerTimers(gameId);
  gamesById.delete(gameId);
  broadcastPlayers();
};

const finishGame = (game, result) => {
  if (!game || game.status === "finished") {
    return;
  }

  clearPlayerTimers(game.gameId);
  game.status = "finished";
  game.result = result;
  game.acknowledgedUsers = new Set();

  [game.white, game.black].forEach((username) => {
    notifyPlayer(username, "gameEnd", { gameId: game.gameId, result });
  });

  broadcastPlayers();
};

const onUserConnected = (socket) => ({ userName }) => {
  const trimmedUsername = userName?.trim();
  if (!trimmedUsername) {
    socket.emit("usernameRejected", { message: "Please choose a valid username." });
    return;
  }

  const existingPlayer = playersByUsername.get(trimmedUsername);
  if (existingPlayer && existingPlayer.socketId !== socket.id) {
    socket.emit("usernameRejected", { message: "That username is already in use." });
    return;
  }

  socket.data.username = trimmedUsername;
  playersByUsername.set(trimmedUsername, { socketId: socket.id, username: trimmedUsername });
  socketToUsername.set(socket.id, trimmedUsername);
  broadcastPlayers();
};

const onDisconnect = (socket) => () => {
  const username = socketToUsername.get(socket.id);
  if (!username) {
    return;
  }

  cancelInvitationsForPlayer(username, `${username} left the lobby.`);

  const activeGame = getActiveGameByUsername(username);
  if (activeGame) {
    const opponent = activeGame.white === username ? activeGame.black : activeGame.white;
    finishGame(activeGame, `${opponent} wins because ${username} disconnected.`);
  }

  const finishedGame = getFinishedGameByUsername(username);
  const acknowledged = acknowledgeFinishedGame(finishedGame, username);

  playersByUsername.delete(username);
  socketToUsername.delete(socket.id);

  if (finishedGame && shouldRemoveFinishedGame(finishedGame)) {
    removeGame(finishedGame.gameId);
    return;
  }

  if (acknowledged || activeGame) {
    broadcastPlayers();
    return;
  }

  broadcastPlayers();
};

const onChallenge = ({ from, to }) => {
  const challenger = playersByUsername.get(from);
  const challengee = playersByUsername.get(to);

  if (!challenger || !challengee) {
    return;
  }

  if (from === to) {
    notifyPlayer(from, "challengeFailed", { message: "You cannot challenge yourself." });
    return;
  }

  if (isPlayerBusy(from) || isPlayerBusy(to)) {
    notifyPlayer(from, "challengeFailed", { message: "One of those players is already in a game." });
    return;
  }

  if (findExistingInvitation(from, to)) {
    notifyPlayer(from, "challengeFailed", { message: `You already invited ${to}.` });
    return;
  }

  const invite = {
    from,
    invitationId: uuidv4(),
    to
  };

  invitationsById.set(invite.invitationId, invite);
  notifyPlayer(to, "challengeReceived", invite);
  notifyPlayer(from, "challengeSent", invite);
};

const onChallengeResponse = (socket) => ({ accept, invitationId }) => {
  const invite = invitationsById.get(invitationId);
  if (!invite || socket.data.username !== invite.to) {
    return;
  }

  invitationsById.delete(invitationId);

  if (!accept) {
    notifyPlayer(invite.from, "challengeDeclined", {
      invitationId,
      message: `${invite.to} declined your invitation.`
    });
    return;
  }

  if (isPlayerBusy(invite.from) || isPlayerBusy(invite.to)) {
    notifyPlayer(invite.from, "challengeCancelled", {
      invitationId,
      message: "That invitation expired because one player is already busy."
    });
    notifyPlayer(invite.to, "challengeCancelled", {
      invitationId,
      message: "That invitation expired because one player is already busy."
    });
    return;
  }

  const game = {
    gameId: uuidv4(),
    status: "active",
    white: invite.from,
    black: invite.to
  };

  gamesById.set(game.gameId, game);
  cancelInvitationsForPlayer(invite.from, `${invite.from} is now in a match.`, invitationId);
  cancelInvitationsForPlayer(invite.to, `${invite.to} is now in a match.`, invitationId);
  notifyPlayer(invite.from, "gameStart", game);
  notifyPlayer(invite.to, "gameStart", game);
  broadcastPlayers();
};

const onMove = (data) => {
  const game = getGameById(data.gameId);
  if (!game || game.status !== "active") {
    return;
  }

  notifyPlayer(data.to, "move", data);

  if (data.result) {
    finishGame(game, data.result);
    return;
  }

  switchTimer(
    game.gameId,
    getSocketByUsername(game.white),
    getSocketByUsername(game.black),
    (result) => finishGame(game, result)
  );
};

const onStartTimer = ({ gameId }) => {
  const game = getGameById(gameId);
  if (!game || game.status !== "active") {
    return;
  }

  startTimer(
    game.gameId,
    getSocketByUsername(game.white),
    getSocketByUsername(game.black),
    (result) => finishGame(game, result)
  );
};

const onGameResultAcknowledged = (socket) => ({ gameId }) => {
  const username = socket.data.username;
  if (!username || !gameId) {
    return;
  }

  const game = getGameById(gameId);
  if (!game || game.status !== "finished") {
    return;
  }

  const acknowledged = acknowledgeFinishedGame(game, username);
  if (!acknowledged) {
    return;
  }

  if (shouldRemoveFinishedGame(game)) {
    removeGame(game.gameId);
    return;
  }

  broadcastPlayers();
};

const onConnect = (socket) => {
  socket.on("challenge", onChallenge);
  socket.on("challengeResponse", onChallengeResponse(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("gameResultAcknowledged", onGameResultAcknowledged(socket));
  socket.on("move", onMove);
  socket.on("startTimer", onStartTimer);
  socket.on("userConnected", onUserConnected(socket));
};

const socketServer = (server) => {
  socketIO = new Server(server);
  socketIO.on("connection", onConnect);
};

export default socketServer;
