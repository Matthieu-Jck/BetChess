import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { startTimer } from "../src/timerServer.js";

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
  const playersData = {
    gameId: uuidv4(),
    white: challenger.username,
    black: challengee.username
  };
  socketIO.to(challenger.socketId).emit("gameStart", playersData);
  socketIO.to(challengee.socketId).emit("gameStart", playersData);
};

const onMoveSent = (data) => {
  const player = findPlayer(data.to);
  if (player && player.socketId) {
    socketIO.to(player.socketId).emit("move", data);
  } else {
    console.log("Player not found or invalid socket ID", data);
  }
};

const getSocketByUsername = (username) => {
  const player = findPlayer(username);
  return player ? socketIO.sockets.sockets.get(player.socketId) : null;
};

const onConnect = (socket) => {
  socket.on("userConnected", onUserConnected(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("challenge", onChallenge);
  socket.on("move", (data) => onMoveSent(data));
  socket.on("startTimer", ({ color, user1, user2 }) => {
    console.log('received event start timer for users ', user1, ' and ', user2);
    const socket1 = getSocketByUsername(user1);
    const socket2 = getSocketByUsername(user2);
    if (socket1 && socket2) {
      startTimer(color, user1, user2, socket1, socket2);
    } else {
      console.log('One or both player sockets not found');
    }
  });
};

const socketServer = (server) => {
  socketIO = new Server(server);
  socketIO.on("connection", onConnect);
};

export default socketServer;