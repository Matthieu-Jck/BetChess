import { setupTimers } from './timer.js';

export const game = (socketClient, board) => {

  const onGameStart = (gameData) => {
    board.startGame(gameData);
  };

  const onMoveReceived = (data) => {
    board.onMoveReceived(data);
  };

  const onMoveSent = (data) => {
    socketClient.onMoveSent(data);
  };

  socketClient.initiate(onGameStart, onMoveReceived);
  board.initiate(onMoveSent);
};

export default game;