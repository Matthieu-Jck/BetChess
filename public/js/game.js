const game = (ws, board) => {
  const onGameStart = (data) => board.startGame(data);

  const onMove = (data) => {
    console.log("Processing move on board", data);
    // Ensure that the entire data object, including the predicted move, is passed
    board.onMove(data.fen, data.predictedMove);
  };
  
  const onPlayerMove = (data) => {
    console.log("Player made a move", data);
    ws.onMove(data); // Sending move to ws for emission
  };

  ws.initiate(onGameStart, onMove);
  board.initiate(onPlayerMove);
};