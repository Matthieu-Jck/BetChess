export const game = (socketClient, board) => {
  const onGameStart = (gameData) => {
    board.startGame(gameData);
  };

  const onMoveReceived = (data) => {
    board.onMoveReceived(data);
  };

  const onGameEnd = (result) => {
    board.onGameEnd(result);
  };

  const onMoveSent = (data) => {
    socketClient.onMoveSent(data);
  };

  socketClient.initiate(onGameStart, onMoveReceived, onGameEnd);
  board.initiate(onMoveSent);
};

export default game;
