import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { clearPlayerTimers, startTimer, switchTimer } from "./timerServer.js";

let socketIO = null;

const playersByUsername = new Map();
const socketToUsername = new Map();
const gamesById = new Map();

const listPlayers = () => Array.from(playersByUsername.values()).map(({ socketId, username }) => ({ socketId, username }));

const getSocketByUsername = (username) => {
  const player = playersByUsername.get(username);
  return player ? socketIO.sockets.sockets.get(player.socketId) : null;
};

const getGameById = (gameId) => gamesById.get(gameId);

const getGameByUsername = (username) => {
  return Array.from(gamesById.values()).find((game) => game.white === username || game.black === username);
};

const broadcastPlayers = () => {
  socketIO.emit("players", listPlayers());
};

const removeGame = (gameId) => {
  clearPlayerTimers(gameId);
  gamesById.delete(gameId);
};

const emitGameEnd = (game, result) => {
  [game.white, game.black].forEach((username) => {
    const socket = getSocketByUsername(username);
    socket?.emit("gameEnd", { result });
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

  const activeGame = getGameByUsername(username);
  if (activeGame) {
    const opponent = activeGame.white === username ? activeGame.black : activeGame.white;
    const result = `${opponent} wins because ${username} disconnected.`;
    emitGameEnd(activeGame, result);
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

  if (getGameByUsername(from) || getGameByUsername(to)) {
    const challengerSocket = getSocketByUsername(from);
    challengerSocket?.emit("challengeFailed", { message: "One of those players is already in a game." });
    return;
  }

  const game = {
    gameId: uuidv4(),
    white: from,
    black: to
  };

  gamesById.set(game.gameId, game);
  getSocketByUsername(from)?.emit("gameStart", game);
  getSocketByUsername(to)?.emit("gameStart", game);
};

const onMove = (data) => {
  const game = getGameById(data.gameId);
  if (!game) {
    return;
  }

  const receiverSocket = getSocketByUsername(data.to);
  receiverSocket?.emit("move", data);

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
