const game = (ws, board) => {
  const onGameStart = (data) => board.startGame(data);

  const onMove = (data) => board.onMove(data);

  const onPlayerMove = (data) => ws.onMove(data);

  ws.initiate(onGameStart, onMove);
  board.initiate(onPlayerMove);
};

document.getElementById('toggle-players').addEventListener('click', function() {
  var playersDiv = document.getElementById('players');
  if (playersDiv.classList.contains('show')) {
    playersDiv.classList.remove('show');
  } else {
    playersDiv.classList.add('show');
  }
});
