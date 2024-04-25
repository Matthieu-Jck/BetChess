let initBoard = (username) => {
  let board = null;
  let engine = new Chess();
  let fn = null;
  let gameData = null;

  let turn = true;
  let actionCount = 0;
  let firstMove = null;
  let secondMove = null;
  let predictedMove = null;

  let turnCounter = 0;
  let correctBet = false;

  let gameOver = () => engine.game_over();

  let illegalMove = (piece, color) => {
    let illegal = gameData.color === color && piece.search(new RegExp(`^${color === "white" ? 'b' : 'w'}`)) !== -1;
    return illegal;
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

  function onDragStart(source, piece, position, orientation) {
    if (gameOver() || !turn) {
      console.log(`Drag start denied: game over or not player's turn.`);
      return false;
    }

    // If it's the first action, play a move
    if (actionCount === 0) {
      return !illegalMove(piece, gameData.color);
    }
    // If it's your second action and your bet wasn't correct, bet
    if (actionCount === 1 && !correctBet) {
      return gameData.color !== (piece.charAt(0) === 'w' ? 'white' : 'black');
    }
    // If it's your second action and your bet was correct, play a move
    if (actionCount === 1 && correctBet) {
      return !illegalMove(piece, gameData.color);
    }
  }

  function onDrop(source, target) {
    if (actionCount === 0){
      firstMove = engine.move({
        from: source,
        to: target,
        promotion: 'q'
      });
    }
    
    if (actionCount === 1) {
      if (correctBet) {
        //doesn't work. I think the engine doesn't want to create a second move
        secondMove = engine.move({
          from: source,
          to: target,
          promotion: 'q'
        })
      }
      else {
        predictedMove = { from: source, to: target };
        console.log("prediction of the following move: ", predictedMove);
        drawBetArrow(source, target, gameData.color);
        endTurn();
        return 'snapback';
      }
    }
    if (firstMove === null && secondMove === null) return 'snapback';

    actionCount++;
    if (actionCount === 2) {
      endTurn();
    }
    return;
  }

  function verifyPrediction(opponentMove) {
    console.log("opponent move: ", opponentMove, " / predicted move: ", predictedMove);
    if (opponentMove && predictedMove && opponentMove.from === predictedMove.from && opponentMove.to === predictedMove.to) {
      correctBet = true;
      console.log(`Prediction correct! Extra turn granted.`);
    } else {
      correctBet = false;
      console.log(`Prediction incorrect or move details not provided.`);
    }
  }

  function proceedToOpponentTurn() {
    // Determine the opponent's username
    const opponent = gameData.player1 === username ? gameData.player2 : gameData.player1;
    
    // Build the data payload for the first move
    let movesData = {
      fen: engine.fen(),
      from: username,
      to: opponent,
      moves: [{
        from: firstMove.from,
        to: firstMove.to,
        promotion: firstMove.promotion
      }]
    };
  
    // Check if there was a second move made after a successful prediction
    console.log(secondMove, (" isNull?"))
    if (secondMove !== null) {
      // Add the second move to the moves array in the payload
      movesData.moves.push({
        from: secondMove.from,
        to: secondMove.to,
        promotion: secondMove.promotion
      });
    }
  
    // Send the moves to the opponent
    fn(movesData);
    
    // Reset the turn control
    turn = false;
  }
  

  function endTurn() {
    proceedToOpponentTurn();
  }

  const initiate = (callback) => {
    fn = callback;
  };

  // This function handles the arrival of the opponent's move data
  const onMove = (fen) => {
    board.position(fen);
    engine.load(fen);
    turnCounter++;
    if (turnCounter == 1 && predictedMove) {
      verifyPrediction(predictedMove);
    }
    actionCount = 0;
    turn = true;
    firstMove = null;
    secondMove = null;
  };

  function drawBetArrow(from, to, color) {
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

  return {
    initiate,
    startGame,
    onMove
  };
};