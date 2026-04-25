import {
  sayBet,
  sayBegin,
  sayCorrectBet,
  sayExtraMove,
  sayGameDraw,
  sayIncorrectBet,
  sayOpponentTurn,
  sayPredictionPlaced,
  sayWaitingForMatch,
  sayYourTurn,
  sayYouLose,
  sayYouWin
} from "./chester.js";

const SNAPBACK = "snapback";
const MOVE_STAGE = "move";
const PREDICTION_STAGE = "prediction";

const createMovePayload = (move) => ({
  from: move.from,
  to: move.to,
  san: move.san,
  promotion: move.promotion ?? null
});

const formatPrediction = (move) => `${move.from} to ${move.to}`;

const initBoard = (username) => {
  const state = {
    username,
    board: null,
    engine: new Chess(),
    gameData: null,
    sendMove: null,
    gameEnded: false,
    isMyTurn: false,
    stage: MOVE_STAGE,
    activeBonusTurn: false,
    queuedBonusTurn: false,
    moveAllowance: 1,
    turnMoves: [],
    predictedMove: null
  };

  const getOpponent = () => {
    if (!state.gameData) {
      return null;
    }

    return state.gameData.white === state.username ? state.gameData.black : state.gameData.white;
  };

  const isPlayerPiece = (piece) => {
    const pieceColor = piece.charAt(0) === "w" ? "white" : "black";
    return pieceColor === state.gameData.color;
  };

  const setEngineTurn = (color) => {
    const fenParts = state.engine.fen().split(" ");
    fenParts[1] = color === "white" ? "w" : "b";
    state.engine.load(fenParts.join(" "));
  };

  const resetTurnState = () => {
    state.turnMoves = [];
    state.stage = MOVE_STAGE;
  };

  const beginPlayerTurn = ({ predictionMatched = null } = {}) => {
    state.isMyTurn = true;
    state.gameEnded = false;
    state.activeBonusTurn = state.queuedBonusTurn;
    state.queuedBonusTurn = false;
    state.moveAllowance = state.activeBonusTurn ? 2 : 1;
    state.turnMoves = [];
    state.stage = MOVE_STAGE;

    if (predictionMatched === false) {
      sayIncorrectBet();
    } else if (state.activeBonusTurn) {
      sayCorrectBet();
    } else {
      sayYourTurn();
    }
  };

  const finishLocalGame = (result) => {
    state.gameEnded = true;
    state.isMyTurn = false;
    state.predictedMove = null;

    const lowered = result.toLowerCase();
    if (lowered.includes("draw")) {
      sayGameDraw(result);
      return;
    }

    if (lowered.startsWith(`${state.username.toLowerCase()} wins`)) {
      sayYouWin(result);
      return;
    }

    sayYouLose(result);
  };

  const buildResultMessage = () => {
    if (state.engine.in_checkmate()) {
      return `${state.username} wins by checkmate.`;
    }

    if (state.engine.in_stalemate()) {
      return "Draw by stalemate.";
    }

    if (state.engine.in_threefold_repetition()) {
      return "Draw by repetition.";
    }

    if (state.engine.insufficient_material()) {
      return "Draw by insufficient material.";
    }

    if (state.engine.in_draw()) {
      return "Draw.";
    }

    return null;
  };

  const endTurn = (result = null) => {
    const opponent = getOpponent();
    if (!opponent || !state.sendMove) {
      return;
    }

    const movesData = {
      gameId: state.gameData.gameId,
      fen: state.engine.fen(),
      from: state.username,
      to: opponent,
      moves: state.turnMoves.map(createMovePayload),
      result
    };

    state.sendMove(movesData);
    state.isMyTurn = false;

    if (result) {
      finishLocalGame(result);
      return;
    }

    sayOpponentTurn();
  };

  const validatePrediction = (source, target) => {
    const preview = new Chess(state.engine.fen());
    const move = preview.move({
      from: source,
      to: target,
      promotion: "q"
    });

    return move ? createMovePayload(move) : null;
  };

  const onDragStart = (_source, piece) => {
    if (!state.gameData || state.gameEnded || !state.isMyTurn) {
      return false;
    }

    if (state.stage === MOVE_STAGE) {
      return isPlayerPiece(piece);
    }

    return !isPlayerPiece(piece);
  };

  const handleTurnMove = (source, target) => {
    const move = state.engine.move({
      from: source,
      to: target,
      promotion: "q"
    });

    if (!move) {
      return SNAPBACK;
    }

    state.turnMoves.push(move);
    state.board.position(state.engine.fen());
    removeArrows();

    const result = buildResultMessage();
    if (result) {
      endTurn(result);
      return;
    }

    if (state.turnMoves.length < state.moveAllowance) {
      setEngineTurn(state.gameData.color);
      sayExtraMove();
      return;
    }

    state.stage = PREDICTION_STAGE;
    sayBet();
    return;
  };

  const handlePrediction = (source, target) => {
    const prediction = validatePrediction(source, target);
    if (!prediction) {
      return SNAPBACK;
    }

    state.predictedMove = prediction;
    drawArrow(source, target, state.gameData.color);
    sayPredictionPlaced(formatPrediction(prediction));
    endTurn();
    return SNAPBACK;
  };

  const startGame = (data) => {
    state.engine.reset();
    state.gameEnded = false;
    state.gameData = {
      ...data,
      color: state.username === data.white ? "white" : "black"
    };
    state.queuedBonusTurn = false;
    state.activeBonusTurn = false;
    state.moveAllowance = 1;
    resetTurnState();
    state.predictedMove = null;

    const config = {
      position: "start",
      orientation: state.gameData.color,
      draggable: true,
      onDragStart,
      onDrop,
      pieceTheme: "/public/images/pieces/{piece}.svg"
    };

    if (state.board) {
      state.board.destroy();
    }

    state.board = Chessboard("chess-board", config);
    removeArrows();
    sayBegin();

    if (state.gameData.color === "white") {
      beginPlayerTurn();
    } else {
      state.isMyTurn = false;
      sayOpponentTurn();
    }
  };

  function onDrop(source, target) {
    if (source === target) {
      return SNAPBACK;
    }

    if (state.stage === MOVE_STAGE) {
      return handleTurnMove(source, target);
    }

    return handlePrediction(source, target);
  }

  const verifyPrediction = (opponentMoves = []) => {
    const predictionMatched = opponentMoves.some((move) => {
      return state.predictedMove && move.from === state.predictedMove.from && move.to === state.predictedMove.to;
    });

    state.predictedMove = null;
    state.queuedBonusTurn = predictionMatched;
    return predictionMatched;
  };

  const onMoveReceived = (data) => {
    removeArrows();
    state.board.position(data.fen);
    state.engine.load(data.fen);
    resetTurnState();

    if (data.result) {
      finishLocalGame(data.result);
      return;
    }

    const predictionMatched = state.predictedMove ? verifyPrediction(data.moves) : null;
    beginPlayerTurn({ predictionMatched });
  };

  const onGameEnd = (result) => {
    removeArrows();
    finishLocalGame(result);
  };

  const initiate = (callback) => {
    state.sendMove = callback;
    sayWaitingForMatch();
  };

  function drawArrow(from, to, perspectiveColor) {
    const fromPos = notationToPosition(from, perspectiveColor);
    const toPos = notationToPosition(to, perspectiveColor);
    const svg = document.querySelector(".chessboard-svg-overlay");

    if (!svg) {
      return;
    }

    removeArrows();

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "7");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("orient", "auto");

    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    markerPath.setAttribute("fill", "#d97706");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", fromPos.x);
    line.setAttribute("y1", fromPos.y);
    line.setAttribute("x2", toPos.x);
    line.setAttribute("y2", toPos.y);
    line.setAttribute("stroke", "#d97706");
    line.setAttribute("stroke-width", "1.65");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);
  }

  function notationToPosition(notation, color) {
    let file = notation.charCodeAt(0) - "a".charCodeAt(0);
    let rank = Number.parseInt(notation[1], 10);

    if (color === "white") {
      rank = 8 - rank;
    } else {
      file = 7 - file;
      rank -= 1;
    }

    return {
      x: file * 12.5 + 6.25,
      y: rank * 12.5 + 6.25
    };
  }

  function removeArrows() {
    const svg = document.querySelector(".chessboard-svg-overlay");
    if (!svg) {
      return;
    }

    svg.replaceChildren();
  }

  return {
    initiate,
    onGameEnd,
    onMoveReceived,
    startGame
  };
};

export default initBoard;
