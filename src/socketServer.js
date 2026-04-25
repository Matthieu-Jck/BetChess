import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { clearPlayerTimers, startTimer, switchTimer } from "./timerServer.js";

let socketIO = null;

const playersByUsername = new Map();
const socketToUsername = new Map();
const gamesById = new Map();
const invitationsById = new Map();

const getGameByUsername = (username) => {
  return Array.from(gamesById.values()).find((game) => game.white === username || game.black === username);
};

const listPlayers = () =>
  Array.from(playersByUsername.values()).map(({ socketId, username }) => ({
    inGame: Boolean(getGameByUsername(username)),
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

const removeGame = (gameId) => {
  clearPlayerTimers(gameId);
  gamesById.delete(gameId);
  broadcastPlayers();
};

const emitGameEnd = (game, result) => {
  [game.white, game.black].forEach((username) => {
    notifyPlayer(username, "gameEnd", { result });
  });
  removeGame(game.gameId);
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

  const activeGame = getGameByUsername(username);
  if (activeGame) {
    const opponent = activeGame.white === username ? activeGame.black : activeGame.white;
    emitGameEnd(activeGame, `${opponent} wins because ${username} disconnected.`);
  }

  playersByUsername.delete(username);
  socketToUsername.delete(socket.id);
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

  if (getGameByUsername(from) || getGameByUsername(to)) {
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

  if (getGameByUsername(invite.from) || getGameByUsername(invite.to)) {
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
  if (!game) {
    return;
  }

  notifyPlayer(data.to, "move", data);

  if (data.result) {
    emitGameEnd(game, data.result);
    return;
  }

  switchTimer(
    game.gameId,
    getSocketByUsername(game.white),
    getSocketByUsername(game.black),
    (result) => emitGameEnd(game, result)
  );
};

const onStartTimer = ({ gameId }) => {
  const game = getGameById(gameId);
  if (!game) {
    return;
  }

  startTimer(
    game.gameId,
    getSocketByUsername(game.white),
    getSocketByUsername(game.black),
    (result) => emitGameEnd(game, result)
  );
};

const onConnect = (socket) => {
  socket.on("challenge", onChallenge);
  socket.on("challengeResponse", onChallengeResponse(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("move", onMove);
  socket.on("startTimer", onStartTimer);
  socket.on("userConnected", onUserConnected(socket));
};

const socketServer = (server) => {
  socketIO = new Server(server);
  socketIO.on("connection", onConnect);
};

export default socketServer;
