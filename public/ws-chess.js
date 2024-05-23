import initBoard from './js/board.js';
import connectWs from './js/ws.js'
import displayPlayers from './js/players.js';
import game from './js/game.js';

let username = null; // localStorage.getItem("username");

if (username === null) {
  username = prompt("Enter username");
  // localStorage.setItem("username", username);
}

if (username) {
  const ws = connectWs(username, displayPlayers);
  const board = initBoard(username);
  game(ws, board);
}
