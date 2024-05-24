import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { handleTimerEvents } from "../public/js/timer.js";

let socketIO = null;
const players = [];

const findPlayer = (name) => players.find((player) => player.username === name);
const removePlayerBySocketId = (socketId) => {
  const index = players.findIndex(player => player.socketId === socketId);
  if (index !== -1) {
    players.splice(index, 1);
  }
};

const onUserConnected = (socket) => (data) => {
  players.push({ username: data.userName, socketId: socket.id });
  socketIO.emit("players", players);
};

const onDisconnect = (socket) => () => {
  removePlayerBySocketId(socket.id);
  socketIO.emit("players", players);
};

const onChallenge = (data) => {
  const challenger = findPlayer(data.from);
  const challengee = findPlayer(data.to);
  const message = {
    gameId: uuidv4(),
    white: challenger.username,
    player1: challenger.username,
    player2: challengee.username,
  };
  socketIO.to(challenger.socketId).emit("gameStart", message);
  socketIO.to(challengee.socketId).emit("gameStart", message);
};

const onMove = (data) => {
  const player = findPlayer(data.to);
  if (player && player.socketId) {
    socketIO.to(player.socketId).emit("move", data);
  } else {
    console.log("Player not found or invalid socket ID", data);
  }
};

const onConnect = (socket) => {
  socket.on("userConnected", onUserConnected(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("challenge", onChallenge);
  socket.on("move", (data) => onMove(data));
  
  handleTimerEvents(socket, socketIO);
};

const wsChess = (server) => {
  socketIO = new Server(server);
  socketIO.on("connection", onConnect);
};

export default wsChess;