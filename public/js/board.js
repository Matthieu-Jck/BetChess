let initBoard = (username) => {
  let board = null;
  let engine = new Chess();
  let fn = null;
  let gameData = null;
  let turn = null;

  let gameOver = () => engine.game_over();
  let illegalWhiteMove = (piece) => gameData.color === "white" && piece.search(/^b/) !== -1;
  let illegalBlackMove = (piece) => gameData.color === "black" && piece.search(/^w/) !== -1;

  function onDragStart(_source, piece, _position, _orientation) {
    if (gameOver() || turn === -1 || illegalWhiteMove(piece) || illegalBlackMove(piece)) {
      return false;
    }
  }

  function onDrop(source, target) {
    let move = engine.move({
      from: source,
      to: target,
      promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";

    turn = -1;
    // notify the opponent with the move, uses fen to communicate the position.
    fn({
      fen: engine.fen(),
      from: username,
      to: gameData.player1 === username ? gameData.player2 : gameData.player1
    });
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd() {
    board.position(engine.fen());
    notifyGameOver();
  }

  const notifyGameOver = () => {
    if (gameOver()) {
      alert("Game is over");
    }
  }

  const initiate = (cb) => {
    fn = cb;
  };

  const startGame = (data) => {
    const color = (username === data.white) ? "white" : "black";
    turn = color === "white" ? 1 : -1;

    gameData = {
      ...data,
      color,
    };

    // configure the board with start position
    let config = {
      position: "start",
      orientation: color,
      draggable: true,
      onDragStart,
      onDrop,
      onSnapEnd,
      pieceTheme: "/public/images/pieces/{piece}.svg",
    };
  
    board = Chessboard("chess-board", config);
  }

  // listen to opponent's move, makesure to update both board and the engine.
  const onMove = (data) => {
    board.position(data);
    engine.load(data);
    turn = 1;
    notifyGameOver();
  };

  return {
    initiate,
    startGame,
    onMove
  };
};
