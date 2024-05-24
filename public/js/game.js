import { setupTimers } from './timer.js';

export const game = (socketClient, board) => {

  const onGameStart = (gameData) => {
    board.startGame(gameData);
    setupTimers(gameData, gameData.white === socketClient.userName ? 'white' : 'black');
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