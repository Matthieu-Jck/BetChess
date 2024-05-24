import { setupTimers } from './timer.js';

export const game = (ws, board) => {
  const onGameStart = (data) => {
    board.startGame(data);
    const playerColor = data.white === ws.userName ? 'white' : 'black';
    setupTimers(playerColor);
  };

  const onMove = (data) => {
    board.onMove(data);
  };

  const onPlayerMove = (data) => {
    ws.onMove(data);
  };

  ws.initiate(onGameStart, onMove);
  board.initiate(onPlayerMove);
};

export default game;
