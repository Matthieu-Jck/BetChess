export const game = (ws, board) => {
  const onGameStart = (data) => board.startGame(data);

  const onMove = (data) => {
    board.onMove(data);
  };
  
  const onPlayerMove = (data) => {
    ws.onMove(data); // Sending move to ws for emission
  };

  ws.initiate(onGameStart, onMove);
  board.initiate(onPlayerMove);
};

export default game;