let initBoard = (username) => {
  let board = null;
  let engine = new Chess();
  let fn = null;
  let gameData = null;
  let turn = true;  // Initially true if the player starts the game
  let actionCount = 0;

  let gameOver = () => engine.game_over();

  let illegalMove = (piece, color) => {
    let illegal = gameData.color === color && piece.search(new RegExp(`^${color === "white" ? 'b' : 'w'}`)) !== -1;
    return illegal;
  };

  function onDragStart(source, piece, position, orientation) {
    if (gameOver() || !turn) {
      console.log(`Drag start denied: game over or not player's turn.`);
      return false;
    }

    if (actionCount === 1) {  // Betting phase
      return gameData.color !== (piece.charAt(0) === 'w' ? 'white' : 'black');  // Simulate only opponent's potential moves
    } else {
      return !illegalMove(piece, gameData.color);
    }
  }

  function onDrop(source, target) {
    if (actionCount === 1) {  // Betting phase
      let move = engine.move({
        from: source,
        to: target,
        promotion: 'q'  // Assumes queen promotion for simplicity
      }, { dryRun: true });  // Check the move legality without making the move

      if (!move) {
        console.log(`Illegal bet attempted from ${source} to ${target}`);
        return 'snapback';
      }

      drawBetArrow(source, target, gameData.color);
      engine.undo();  // Undo the dry run move
      endTurn();
      return 'snapback';
    }

    let move = engine.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) return 'snapback';

    actionCount++;
    if (actionCount === 1) {
      prepareForBetting();  // Prepare for betting after the move
    }
    return;
  }

  function prepareForBetting() {
    console.log("Preparing for betting phase.");
    actionCount = 1;
  }

  function endTurn() {
    actionCount = 0;
    turn = false;
    proceedToOpponentTurn();
  }

  function drawBetArrow(from, to, color) {
    console.log(`Drawing bet arrow from ${from} to ${to} for ${color}`);
    const fromPos = notationToPosition(from, color);
    const toPos = notationToPosition(to, color);

    const svg = document.querySelector('.chessboard-svg-overlay');
    if (!svg) {
        console.error("SVG overlay not found. Ensure your chessboard has a corresponding SVG overlay for drawing.");
        return;
    }

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    arrow.setAttribute('x1', fromPos.x);
    arrow.setAttribute('y1', fromPos.y);
    arrow.setAttribute('x2', toPos.x);
    arrow.setAttribute('y2', toPos.y);
    arrow.setAttribute('stroke', 'blue');
    arrow.setAttribute('stroke-width', 2);
    arrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(arrow);
  }

  function notationToPosition(notation, color) {
    let file = notation.charCodeAt(0) - 'a'.charCodeAt(0); // 'a' -> 0, 'b' -> 1, ..., 'h' -> 7
    let rank;

    if (color === 'white') {
      rank = '8' - notation[1]; // '1' -> 7, '2' -> 6, ..., '8' -> 0
    } else {
      // Flip both file and rank for black's perspective
      file = 7 - file; // Reverse file position: 'h' -> 0, 'g' -> 1, ..., 'a' -> 7
      rank = notation[1] - '1'; // '1' -> 0, '2' -> 1, ..., '8' -> 7
    }

    const squareSize = $('#chess-board .square-55d63').width(); // Use your actual square class

    return {
      x: file * squareSize + squareSize / 2, // Center of the square horizontally
      y: rank * squareSize + squareSize / 2  // Center of the square vertically
    };
  }

  function proceedToOpponentTurn() {
    console.log(`Switching to opponent's turn.`);
    // Logic to notify the opponent or switch the turn
    fn({
      fen: engine.fen(),
      from: username,
      to: gameData.player1 === username ? gameData.player2 : gameData.player1
    });
    turn = false; // It's now the opponent's turn
  }


  const initiate = (callback) => {
    fn = callback;
  };

  const startGame = (data) => {
    gameData = {
      ...data,
      color: (username === data.white) ? 'white' : 'black',
    };
    let config = {
      position: 'start',
      orientation: gameData.color,
      draggable: true,
      onDragStart,
      onDrop,
      pieceTheme: '/public/images/pieces/{piece}.svg',
    };
    board = Chessboard('chess-board', config);
  };

  const onMove = (fen) => {
    board.position(fen);
    engine.load(fen);
    turn = true;  // It's now this player's turn
  };

  return {
    initiate,
    startGame,
    onMove
  };
};