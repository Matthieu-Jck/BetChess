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
const HIGHLIGHT_CLASS = "betchess-highlight";
const FILES = "abcdefgh".split("");

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
    updatePieceHighlights();
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

  const getOpponentColor = () => {
    if (!state.gameData) {
      return null;
    }

    return state.gameData.color === "white" ? "black" : "white";
  };

  const getBlockedBonusSquare = () => {
    if (!state.activeBonusTurn || state.turnMoves.length !== 1) {
      return null;
    }

    return state.turnMoves[0].to;
  };

  const getPieceAtSquare = (square) => {
    if (typeof state.engine.get !== "function") {
      return null;
    }

    return state.engine.get(square);
  };

  const clearPieceHighlights = () => {
    const boardElement = document.getElementById("chess-board");
    if (!boardElement) {
      return;
    }

    boardElement.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((squareElement) => {
      squareElement.classList.remove(HIGHLIGHT_CLASS);
    });
  };

  const getHighlightedSquares = () => {
    if (!state.gameData || state.gameEnded || !state.isMyTurn) {
      return [];
    }

    const targetColor = state.stage === MOVE_STAGE ? state.gameData.color : getOpponentColor();
    const blockedSquare = state.stage === MOVE_STAGE ? getBlockedBonusSquare() : null;
    const highlightedSquares = [];

    for (const file of FILES) {
      for (let rank = 1; rank <= 8; rank += 1) {
        const square = `${file}${rank}`;
        const piece = getPieceAtSquare(square);
        if (!piece) {
          continue;
        }

        const pieceColor = piece.color === "w" ? "white" : "black";
        if (pieceColor !== targetColor || square === blockedSquare) {
          continue;
        }

        highlightedSquares.push(square);
      }
    }

    return highlightedSquares;
  };

  const updatePieceHighlights = () => {
    clearPieceHighlights();

    const boardElement = document.getElementById("chess-board");
    if (!boardElement) {
      return;
    }

    getHighlightedSquares().forEach((square) => {
      boardElement.querySelector(`[data-square="${square}"]`)?.classList.add(HIGHLIGHT_CLASS);
    });
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
      updatePieceHighlights();
      return;
    }

    if (state.activeBonusTurn) {
      sayCorrectBet();
      playCorrectBet();
      updatePieceHighlights();
      return;
    }

    sayYourTurn();
    updatePieceHighlights();
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
    updatePieceHighlights();

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

  const onDragStart = (source, piece) => {
    if (!state.gameData || state.gameEnded || !state.isMyTurn) {
      return false;
    }

    if (state.stage === MOVE_STAGE) {
      if (source === getBlockedBonusSquare()) {
        return false;
      }

      return isPlayerPiece(piece);
    }

    return !isPlayerPiece(piece);
  };

  const handleTurnMove = (source, target) => {
    if (source === getBlockedBonusSquare()) {
      return SNAPBACK;
    }

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
      updatePieceHighlights();
      return;
    }

    state.stage = PREDICTION_STAGE;
    sayBet();
    updatePieceHighlights();
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
    updatePieceHighlights();
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
    updatePieceHighlights();
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

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.hypot(dx, dy) || 1;
    const unitX = dx / length;
    const unitY = dy / length;
    const perpX = -unitY;
    const perpY = unitX;
    const startInset = Math.min(2.2, Math.max(1.4, length * 0.12));
    const ringRadius = 2.35;
    const headLength = Math.min(4.9, Math.max(3.5, length * 0.24));
    const headWidth = headLength * 0.72;
    const shaftEndInset = ringRadius + headLength * 0.74;
    const startX = fromPos.x + unitX * startInset;
    const startY = fromPos.y + unitY * startInset;
    const endX = toPos.x - unitX * shaftEndInset;
    const endY = toPos.y - unitY * shaftEndInset;
    const tipX = toPos.x - unitX * (ringRadius + 0.5);
    const tipY = toPos.y - unitY * (ringRadius + 0.5);
    const baseX = tipX - unitX * headLength;
    const baseY = tipY - unitY * headLength;
    const leftX = baseX + perpX * (headWidth / 2);
    const leftY = baseY + perpY * (headWidth / 2);
    const rightX = baseX - perpX * (headWidth / 2);
    const rightY = baseY - perpY * (headWidth / 2);

    const shadowLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    shadowLine.setAttribute("x1", startX);
    shadowLine.setAttribute("y1", startY);
    shadowLine.setAttribute("x2", endX);
    shadowLine.setAttribute("y2", endY);
    shadowLine.setAttribute("stroke", "rgba(11, 14, 20, 0.46)");
    shadowLine.setAttribute("stroke-width", "3.6");
    shadowLine.setAttribute("stroke-linecap", "round");

    const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
    trail.setAttribute("x1", startX);
    trail.setAttribute("y1", startY);
    trail.setAttribute("x2", endX);
    trail.setAttribute("y2", endY);
    trail.setAttribute("stroke", "#f1cb74");
    trail.setAttribute("stroke-width", "2.15");
    trail.setAttribute("stroke-linecap", "round");

    const arrowShadow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrowShadow.setAttribute("points", `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`);
    arrowShadow.setAttribute("fill", "rgba(11, 14, 20, 0.46)");

    const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrowHead.setAttribute("points", `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`);
    arrowHead.setAttribute("fill", "#f1cb74");

    const startDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    startDot.setAttribute("cx", fromPos.x);
    startDot.setAttribute("cy", fromPos.y);
    startDot.setAttribute("r", "1.45");
    startDot.setAttribute("fill", "#f4f0e6");
    startDot.setAttribute("stroke", "#f1cb74");
    startDot.setAttribute("stroke-width", "0.5");

    const targetRingShadow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    targetRingShadow.setAttribute("cx", toPos.x);
    targetRingShadow.setAttribute("cy", toPos.y);
    targetRingShadow.setAttribute("r", ringRadius + 0.35);
    targetRingShadow.setAttribute("fill", "none");
    targetRingShadow.setAttribute("stroke", "rgba(11, 14, 20, 0.42)");
    targetRingShadow.setAttribute("stroke-width", "2.6");

    const targetRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    targetRing.setAttribute("cx", toPos.x);
    targetRing.setAttribute("cy", toPos.y);
    targetRing.setAttribute("r", ringRadius);
    targetRing.setAttribute("fill", "rgba(241, 203, 116, 0.16)");
    targetRing.setAttribute("stroke", "#f1cb74");
    targetRing.setAttribute("stroke-width", "0.85");

    svg.append(shadowLine, targetRingShadow, trail, arrowShadow, arrowHead, startDot, targetRing);
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
