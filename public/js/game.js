import { setupTimers } from './timer.js';

export const game = (socketClient, board) => {
  const onGameStart = (data) => {
    board.startGame(data);
    const playerColor = data.white === socketClient.userName ? 'white' : 'black';
    setupTimers(playerColor);
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
