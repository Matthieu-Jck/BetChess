const getPhaseTrack = () => document.getElementById("phase-track");
const getPhaseCards = () => ({
  bet: document.getElementById("phase-bet"),
  move: document.getElementById("phase-move"),
  opponent: document.getElementById("phase-opponent"),
  second: document.getElementById("phase-second")
});

const setTurnIndicator = (text, tone = "idle") => {
  const indicator = document.getElementById("turn-indicator");
  if (!indicator) {
    return;
  }

  indicator.textContent = text;
  indicator.className = `turn-indicator turn-indicator--${tone}`;
};

const setPhaseState = ({ active = null, completed = [], showBonus = false }) => {
  const track = getPhaseTrack();
  const cards = getPhaseCards();
  const phaseOrder = ["opponent", "move", "second", "bet"];

  track?.classList.toggle("has-bonus", showBonus);
  cards.second?.classList.toggle("is-hidden", !showBonus);
  cards.second?.setAttribute("aria-hidden", String(!showBonus));

  phaseOrder.forEach((phase) => {
    const card = cards[phase];
    if (!card) {
      return;
    }

    card.classList.remove("phase-card--active", "phase-card--complete");

    if (completed.includes(phase)) {
      card.classList.add("phase-card--complete");
    }

    if (active === phase) {
      card.classList.add("phase-card--active");
    }
  });

  const betStep = document.querySelector("#phase-bet .phase-card__eyebrow");
  if (betStep) {
    betStep.textContent = showBonus ? "4" : "3";
  }
};

const sayWaitingForMatch = () => {
  setTurnIndicator("Waiting for a match", "idle");
  setPhaseState({ showBonus: false });
};

const sayYourTurn = () => {
  setTurnIndicator("Your move", "active");
  setPhaseState({ active: "move", showBonus: false });
};

const sayOpponentTurn = () => {
  setTurnIndicator("Opponent's turn", "waiting");
  setPhaseState({ active: "opponent", showBonus: false });
};

const sayBet = () => {
  const showBonus = !document.getElementById("phase-second")?.classList.contains("is-hidden");
  setTurnIndicator("Place your bet", "active");
  setPhaseState({
    active: "bet",
    completed: showBonus ? ["move", "second"] : ["move"],
    showBonus
  });
};

const sayExtraMove = () => {
  setTurnIndicator("Your second move", "active");
  setPhaseState({
    active: "second",
    completed: ["move"],
    showBonus: true
  });
};

const sayPredictionPlaced = (prediction) => {
  setTurnIndicator(`Bet locked: ${prediction}`, "waiting");
  setPhaseState({
    active: "opponent",
    completed: ["move", "bet"],
    showBonus: false
  });
};

const sayCorrectBet = () => {
  setTurnIndicator("Correct bet. Bonus turn live.", "success");
  setPhaseState({
    active: "move",
    showBonus: true
  });
};

const sayIncorrectBet = () => {
  setTurnIndicator("Missed bet. Normal turn.", "active");
  setPhaseState({
    active: "move",
    showBonus: false
  });
};

const sayYouWin = (result) => {
  setTurnIndicator(result, "success");
  setPhaseState({ showBonus: false });
};

const sayYouLose = (result) => {
  setTurnIndicator(result, "danger");
  setPhaseState({ showBonus: false });
};

const sayGameDraw = (result) => {
  setTurnIndicator(result, "idle");
  setPhaseState({ showBonus: false });
};

export {
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
};
