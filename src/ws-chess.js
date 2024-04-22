import { Server } from "socket.io";

let socketIO = null;
const players = [];

const onUserConnected = (socket) => (data) => {
  console.log("User connected:", data.userName, "Socket ID:", socket.id);
  players.push({ username: data.userName, socketId: socket.id });
  socketIO.emit("players", players);  // Broadcast the updated list of players
  console.log("Current players:", players);
};

const onDisconnect = (socket) => () => {
  console.log("User disconnected, Socket ID:", socket.id);
  removePlayerBySocketId(socket.id);
  socketIO.emit("players", players);  // Broadcast the updated list of players
  console.log("Updated players after disconnection:", players);
};

const onChallenge = (data) => {
  console.log("Challenge received:", data);
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
  console.log("Game started between", challenger.username, "and", challengee.username);
};

const onMove = (data) => {
  console.log("Move received:", data);
  const player = findPlayer(data.to);
  socketIO.to(player.socketId).emit("move", data.fen);
};

const onConnect = (socket) => {
  console.log("New WebSocket connection, Socket ID:", socket.id);
  socket.on("userConnected", onUserConnected(socket));
  socket.on("disconnect", onDisconnect(socket));
  socket.on("challenge", onChallenge);
  socket.on("move", onMove);
};

const wsChess = (server) => {
  socketIO = new Server(server, {
    cors: {
      origin: "https://betchess.onrender.com",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });
  
  socketIO.on("connection", socket => {
    console.log("Client connected");
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });  
  console.log("WebSocket server initialized.");
};

export default wsChess;