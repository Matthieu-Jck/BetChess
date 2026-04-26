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

  const onConnectionLost = () => {
    board.onConnectionLost();
  };

  const onMoveSent = (data) => {
    socketClient.onMoveSent(data);
  };

  const onGameResultAcknowledged = (data) => {
    socketClient.onGameResultAcknowledged(data);
  };

  const onSurrender = (data) => {
    socketClient.onSurrender(data);
  };

  socketClient.initiate(onGameStart, onMoveReceived, onGameEnd, onConnectionLost);
  board.initiate(onMoveSent, onGameResultAcknowledged, onSurrender);
};

export default game;
