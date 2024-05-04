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

  let possibleMoves = [];

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
    if (actionCount === 0) {
      possibleMoves = engine.moves({ verbose: true });
      if (correctBet) {
        firstMove = ({
          from: source,
          to: target
        })
        drawArrow(source,target,gameData.color,gameData.color);
        actionCount++;
        return 'snapback';
      }
      firstMove = engine.move({
        from: source,
        to: target,
        promotion: 'q'
      });

      if (firstMove === null) {
        return 'snapback';
      }
    }

    if (actionCount === 1) {
      if (correctBet) {
        let valid = false;
        for (let m of possibleMoves) {
          if (m.from === source && m.to === target && m) {
            valid = true;
          }
        }
        if (!valid) {
          return 'snapback';
        }
        console.log("O");
        secondPieceToMove = engine.get(source);
        engine.remove(source);
        engine.put(secondPieceToMove, target);
        console.log("U");
        firstPieceToMove = engine.get(firstMove.from);
        console.log("fm.s: ",firstMove.from," / firstPieceToMove: ",firstPieceToMove);
        engine.remove(firstMove.from);
        engine.put(firstPieceToMove, firstMove.to);
        correctBet = false;
      }
      else {
        predictedMove = { from: source, to: target };
        let arrowColor = gameData.color === 'white' ? 'black' : 'white';
        drawArrow(source, target, gameData.color, arrowColor);        
        endTurn();
        return 'snapback';
      }
    }

    actionCount++;
    if (actionCount === 2) {
      endTurn();
    }
    return;
  }

  function verifyPrediction(opponentMoves) {
    for (let opponentMove of opponentMoves) {
      if (opponentMove && predictedMove && opponentMove.from === predictedMove.from && opponentMove.to === predictedMove.to) {
        correctBet = true;
        console.log(`Prediction correct! Extra turn granted.`);
      } else {
        correctBet = false;
        console.log(`Prediction incorrect or move details not provided.`);
      }
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

    if (secondMove !== null) {
      // Add the second move to the moves array in the payload
      movesData.moves.push({
        from: secondMove.from,
        to: secondMove.to,
        promotion: secondMove.promotion
      });
    }
    fn(movesData);
    turn = false;
  }


  function endTurn() {
    proceedToOpponentTurn();
  }

  const initiate = (callback) => {
    fn = callback;
  };

  // This function handles the arrival of the opponent's move data
  const onMove = (data) => {
    // Remove all existing arrows
    const svg = document.querySelector('.chessboard-svg-overlay');
    const existingArrows = svg.querySelectorAll('line');
    existingArrows.forEach((arrow) => arrow.remove());
  
    // Rest of the onMove function
    board.position(data.fen);
    engine.load(data.fen);
    turnCounter++;
    if (turnCounter >= 1 && predictedMove) {
      verifyPrediction(data.moves);
    }
    actionCount = 0;
    turn = true;
    firstMove = null;
    secondMove = null;
  };  

  function drawArrow(from, to, color, arrowColor) {
    const fromPos = notationToPosition(from, color);
    const toPos = notationToPosition(to, color);
    const svg = document.querySelector('.chessboard-svg-overlay');
    const defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Define the arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', '5');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerWidth', '3');
    marker.setAttribute('markerHeight', '3');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    path.setAttribute('fill', arrowColor);
    marker.appendChild(path);
    defs.appendChild(marker);

    // Draw the arrow
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromPos.x);
    line.setAttribute('y1', fromPos.y);
    line.setAttribute('x2', toPos.x);
    line.setAttribute('y2', toPos.y);
    line.setAttribute('stroke', arrowColor);
    line.setAttribute('stroke-width', '10');
    line.setAttribute('marker-end', 'url(#arrowhead)');

    svg.appendChild(line);
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