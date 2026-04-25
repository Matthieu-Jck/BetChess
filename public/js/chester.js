const setBubbleText = (text) => {
  const bubble = document.querySelector(".dialogue-bubble");
  if (bubble) {
    bubble.innerHTML = text;
  }
};

const setSummary = (id, text) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
};

const setTurnIndicator = (text, tone = "idle") => {
  const indicator = document.getElementById("turn-indicator");
  if (!indicator) {
    return;
  }

  indicator.textContent = text;
  indicator.className = `turn-indicator turn-indicator--${tone}`;
};

const sayWaitingForMatch = () => {
  setBubbleText("Pick a username, open the players drawer, and challenge someone when they appear online.");
  setTurnIndicator("Waiting for a match", "idle");
  setSummary("status-turn", "Waiting for a match");
  setSummary("status-bonus", "No bonus queued");
  setSummary("status-prediction", "No prediction yet");
};

const sayBegin = () => {
  setBubbleText("Game on. Use your move first, then lock in a prediction for the response.");
};

const sayYourTurn = () => {
  setTurnIndicator("Your turn", "active");
  setSummary("status-turn", "Your move");
  setSummary("status-bonus", "No bonus queued");
  setSummary("status-prediction", "Prediction opens after your move");
  setBubbleText("It's your turn. Make your move, then call your opponent's reply.");
};

const sayOpponentTurn = () => {
  setTurnIndicator("Opponent's turn", "waiting");
  setSummary("status-turn", "Waiting on opponent");
  setSummary("status-prediction", "Prediction locked in");
  setBubbleText("Your turn is submitted. Now we wait and see how the board answers back.");
};

const sayBet = () => {
  setTurnIndicator("Place your prediction", "active");
  setSummary("status-turn", "Prediction phase");
  setSummary("status-prediction", "Drag an opposing piece to mark the reply");
  setBubbleText("Now place your bet. Drag one of your opponent's pieces to the move you expect next.");
};

const sayExtraMove = () => {
  setTurnIndicator("Bonus move active", "active");
  setSummary("status-turn", "Play your extra move");
  setSummary("status-bonus", "One extra move is active");
  setSummary("status-prediction", "Prediction opens after your final move");
  setBubbleText("Nice read. Your bonus move is live this turn, so make one more chess move before placing a prediction.");
};

const sayPredictionPlaced = (prediction) => {
  setTurnIndicator("Prediction locked", "waiting");
  setSummary("status-turn", "Opponent's turn");
  setSummary("status-prediction", prediction);
  setBubbleText("Prediction saved. Let's see whether they walk into it.");
};

const sayCorrectBet = () => {
  setTurnIndicator("Your turn", "success");
  setSummary("status-turn", "Bonus turn ready");
  setSummary("status-bonus", "One extra move available");
  setSummary("status-prediction", "Last prediction hit");
  setBubbleText("Beautiful read. You earned an extra move this turn.");
};

const sayIncorrectBet = () => {
  setTurnIndicator("Your turn", "active");
  setSummary("status-turn", "Your move");
  setSummary("status-bonus", "No bonus queued");
  setSummary("status-prediction", "Last prediction missed");
  setBubbleText("Close, but not quite. You're back on move with a normal turn.");
};

const sayYouWin = (result) => {
  setTurnIndicator("Game over", "success");
  setSummary("status-turn", "Match finished");
  setBubbleText(result);
};

const sayYouLose = (result) => {
  setTurnIndicator("Game over", "danger");
  setSummary("status-turn", "Match finished");
  setBubbleText(result);
};

const sayGameDraw = (result) => {
  setTurnIndicator("Game over", "idle");
  setSummary("status-turn", "Match finished");
  setSummary("status-bonus", "No bonus queued");
  setSummary("status-prediction", "No active prediction");
  setBubbleText(result);
};

export {
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
};
