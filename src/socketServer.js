import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { startTimer, switchTimer, clearPlayerTimers } from "../src/timerServer.js";

let socketIO = null;
const players = [];
const games = [];

const findPlayer = (name) => players.find((player) => player.username === name);
const findGameById = (gameId) => games.find((game) => game.gameId === gameId);
const findGameByPlayers = (username1, username2) => {
  return games.find(game => 
    (game.white === username1 && game.black === username2) || 
    (game.white === username2 && game.black === username1)
  );
};

const removePlayerBySocketId = (socketId) => {
  const index = players.findIndex(player => player.socketId === socketId);
  if (index !== -1) {
    players.splice(index, 1);
  }
};

const onConnect = (socket) => {
  socket.on("userConnected", onUserConnected(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("challenge", onChallenge);
  socket.on("move", (data) => onMoveSent(data));
  socket.on("startTimer", (data) => onStartTimer(data));
};

const onUserConnected = (socket) => (data) => {
  players.push({ username: data.userName, socketId: socket.id });
  socketIO.emit("players", players);
};

const onDisconnect = (socket) => () => {
  removePlayerBySocketId(socket.id);
  socketIO.emit("players", players);
  const userGames = games.filter(game => game.white === socket.id || game.black === socket.id);
  userGames.forEach(game => {
    clearPlayerTimers(game.gameId);
    games.splice(games.indexOf(game), 1);
  });
  socketIO.emit("games", games);
};

const onChallenge = (data) => {
  const challenger = findPlayer(data.from);
  const challengee = findPlayer(data.to);
  const playersData = {
    gameId: uuidv4(),
    white: challenger.username,
    black: challengee.username
  };
  games.push(playersData);
  socketIO.to(challenger.socketId).emit("gameStart", playersData);
  socketIO.to(challengee.socketId).emit("gameStart", playersData);
  socketIO.emit("games", games);
};

const onMoveSent = (data) => {
  let game = findGameByPlayers(data.from,data.to);
  let playerReceiver = findPlayer(data.to);
  if (playerReceiver && playerReceiver.socketId) {
    socketIO.to(playerReceiver.socketId).emit("move", data);
    console.log("switching timers for game: ",game);
    onSwitchTimer({ game });
  } else {
    console.log("Player not found or invalid socket ID", data);
  }
};

const onStartTimer = ({ game }) => {
  let gameId = game.gameId;
  let socket1 = getSocketByUsername(game.white);
  let socket2 = getSocketByUsername(game.black);
  if (socket1 && socket2) {
    startTimer(gameId, socket1, socket2);
  } else {
    console.log('One or both player sockets not found');
  }
};

const onSwitchTimer = ({ game }) => {
  let gameId = game.gameId;
  let socket1 = getSocketByUsername(game.white);
  let socket2 = getSocketByUsername(game.black);
  if (socket1 && socket2) {
    switchTimer(gameId, socket1, socket2);
  } else {
    console.log('One or both player sockets not found');
  }
};

const getSocketByUsername = (username) => {
  let player = findPlayer(username);
  return player ? socketIO.sockets.sockets.get(player.socketId) : null;
};

const socketServer = (server) => {
  socketIO = new Server(server);
  socketIO.on("connection", onConnect);
};

export default socketServer;