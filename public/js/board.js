import {
  sayBet,
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
import {
  playBetPlaced,
  playCorrectBet,
  playDraw,
  playGameStart,
  playIncorrectBet,
  playLose,
  playMove,
  playMoveSequence,
  playWin
} from "./sound.js";
import { resetTimers } from "./timer.js";

const SNAPBACK = "snapback";
const MOVE_STAGE = "move";
const PREDICTION_STAGE = "prediction";
const EMPTY_POSITION = {};

const createMovePayload = (move) => ({
  captured: move.captured ?? null,
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
    gameEnded: false,
    isMyTurn: false,
    activeBonusTurn: false,
    moveAllowance: 1,
    predictedMove: null,
    queuedBonusTurn: false,
    sendMove: null,
    stage: MOVE_STAGE,
    turnMoves: []
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

  const renderBoard = ({ draggable, orientation, position }) => {
    const config = {
      draggable,
      onDragStart,
      onDrop,
      orientation,
      pieceTheme: "/public/images/pieces/{piece}.svg",
      position
    };

    if (state.board) {
      state.board.destroy();
    }

    state.board = Chessboard("chess-board", config);
    removeArrows();
  };

  const resetTurnState = () => {
    state.turnMoves = [];
    state.stage = MOVE_STAGE;
  };

  const renderIdleBoard = () => {
    state.engine.reset();
    state.gameData = null;
    state.gameEnded = false;
    state.isMyTurn = false;
    state.activeBonusTurn = false;
    state.queuedBonusTurn = false;
    state.moveAllowance = 1;
    state.predictedMove = null;
    resetTurnState();
    resetTimers();
    renderBoard({
      draggable: false,
      orientation: "white",
      position: EMPTY_POSITION
    });
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

  const beginPlayerTurn = ({ predictionMatched = null } = {}) => {
    state.isMyTurn = true;
    state.gameEnded = false;
    state.activeBonusTurn = state.queuedBonusTurn;
    state.queuedBonusTurn = false;
    state.moveAllowance = state.activeBonusTurn ? 2 : 1;
    resetTurnState();

    if (predictionMatched === false) {
      sayIncorrectBet();
      playIncorrectBet();
      return;
    }

    if (state.activeBonusTurn) {
      sayCorrectBet();
      playCorrectBet();
      return;
    }

    sayYourTurn();
  };

  const finishLocalGame = (result) => {
    state.gameEnded = true;
    state.isMyTurn = false;
    state.predictedMove = null;

    const lowered = result.toLowerCase();
    if (lowered.includes("draw")) {
      sayGameDraw(result);
      playDraw();
      renderIdleBoard();
      return;
    }

    if (lowered.startsWith(`${state.username.toLowerCase()} wins`)) {
      sayYouWin(result);
      playWin();
      renderIdleBoard();
      return;
    }

    sayYouLose(result);
    playLose();
    renderIdleBoard();
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
      moves: state.turnMoves.map(createMovePayload),
      result,
      to: opponent
    };

    state.sendMove(movesData);
    state.isMyTurn = false;

    if (result) {
      finishLocalGame(result);
    }
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
    playMove(Boolean(move.captured));

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
    playBetPlaced();
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
    state.predictedMove = null;
    resetTurnState();

    renderBoard({
      draggable: true,
      orientation: state.gameData.color,
      position: "start"
    });
    playGameStart();

    if (state.gameData.color === "white") {
      beginPlayerTurn();
      return;
    }

    state.isMyTurn = false;
    sayOpponentTurn();
  };

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
    playMoveSequence(data.moves);

    if (data.result) {
      finishLocalGame(data.result);
      return;
    }

    const predictionMatched = state.predictedMove ? verifyPrediction(data.moves) : null;
    beginPlayerTurn({ predictionMatched });
  };

  const onGameEnd = (result) => {
    if (!state.gameData) {
      return;
    }

    removeArrows();
    finishLocalGame(result);
  };

  const initiate = (callback) => {
    state.sendMove = callback;
    renderIdleBoard();
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

    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "prediction-shadow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    const dropShadow = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow");
    dropShadow.setAttribute("dx", "0");
    dropShadow.setAttribute("dy", "0.35");
    dropShadow.setAttribute("stdDeviation", "0.9");
    dropShadow.setAttribute("flood-color", "#10141b");
    dropShadow.setAttribute("flood-opacity", "0.45");
    filter.appendChild(dropShadow);

    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "prediction-arrowhead");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8.2");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "5.2");
    marker.setAttribute("markerHeight", "5.2");
    marker.setAttribute("orient", "auto");

    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M 0 1.25 L 10 5 L 0 8.75 z");
    markerPath.setAttribute("fill", "#f0c36a");
    marker.appendChild(markerPath);

    defs.append(filter, marker);
    svg.appendChild(defs);

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.hypot(dx, dy) || 1;
    const unitX = dx / length;
    const unitY = dy / length;
    const startInset = Math.min(1.6, length * 0.12);
    const endInset = Math.min(4.6, Math.max(2.4, length * 0.18));
    const startX = fromPos.x + unitX * startInset;
    const startY = fromPos.y + unitY * startInset;
    const endX = toPos.x - unitX * endInset;
    const endY = toPos.y - unitY * endInset;

    const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
    trail.setAttribute("x1", startX);
    trail.setAttribute("y1", startY);
    trail.setAttribute("x2", endX);
    trail.setAttribute("y2", endY);
    trail.setAttribute("stroke", "#f0c36a");
    trail.setAttribute("stroke-width", "2.2");
    trail.setAttribute("stroke-linecap", "round");
    trail.setAttribute("marker-end", "url(#prediction-arrowhead)");
    trail.setAttribute("filter", "url(#prediction-shadow)");

    const startDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    startDot.setAttribute("cx", fromPos.x);
    startDot.setAttribute("cy", fromPos.y);
    startDot.setAttribute("r", "1.6");
    startDot.setAttribute("fill", "#f4f0e6");
    startDot.setAttribute("stroke", "#f0c36a");
    startDot.setAttribute("stroke-width", "0.5");
    startDot.setAttribute("filter", "url(#prediction-shadow)");

    svg.append(trail, startDot);
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
