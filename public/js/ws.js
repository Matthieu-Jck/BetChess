const connectWs = (userName, onPlayersFn) => {
  const socket = io(window.SOCKET_URL);

  let onGameStartFn = null;
  let onMoveFn = null;

  const initiate = (startFn, moveFn) => {
    onGameStartFn = startFn;
    onMoveFn = moveFn;
  };

  const onChallenge = (players) => socket.emit("challenge", players);

  const onMove = (data) => socket.emit("move", data);

  socket.on("connect", () => socket.emit("userConnected", { userName }));

  socket.on("players", (data) => onPlayersFn(userName, data, onChallenge));

  socket.on("gameStart", (data) => onGameStartFn(data));

  socket.on("move", (data) => onMoveFn(data));

  return { initiate, onMove };
};
