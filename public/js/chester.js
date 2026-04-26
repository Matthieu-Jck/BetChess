const getPhaseTrack = () => document.getElementById("phase-track");
const getPhaseTrackShell = () => document.getElementById("phase-track-shell");
const getPhaseCards = () => ({
  bet: document.getElementById("phase-bet"),
  move: document.getElementById("phase-move"),
  opponent: document.getElementById("phase-opponent"),
  second: document.getElementById("phase-second")
});
let detachBonusToastDismiss = null;

const hideBonusToast = () => {
  const toast = document.getElementById("bonus-toast");
  if (!toast) {
    return;
  }

  if (detachBonusToastDismiss) {
    detachBonusToastDismiss();
    detachBonusToastDismiss = null;
  }

  toast.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!toast.classList.contains("is-visible")) {
      toast.hidden = true;
    }
  }, 220);
};

const showBonusToast = () => {
  const toast = document.getElementById("bonus-toast");
  if (!toast) {
    return;
  }

  hideBonusToast();

  toast.hidden = false;
  toast.classList.remove("is-visible");

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  const dismissToast = () => {
    hideBonusToast();
  };

  const onPointerDown = () => {
    dismissToast();
  };

  window.addEventListener("pointerdown", onPointerDown, { once: true });
  detachBonusToastDismiss = () => {
    window.removeEventListener("pointerdown", onPointerDown);
  };
};

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
  const shell = getPhaseTrackShell();
  const cards = getPhaseCards();
  const phaseOrder = ["opponent", "move", "second", "bet"];
  const isVisible = active !== null || completed.length > 0 || showBonus;

  shell?.classList.toggle("is-active", isVisible);
  shell?.setAttribute("aria-hidden", String(!isVisible));
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
  hideBonusToast();
  setTurnIndicator("Waiting for a match", "idle");
  setPhaseState({ showBonus: false });
};

const sayYourTurn = () => {
  hideBonusToast();
  setTurnIndicator("Your move", "active");
  setPhaseState({ active: "move", showBonus: false });
};

const sayOpponentTurn = () => {
  hideBonusToast();
  setTurnIndicator("Opponent's turn", "waiting");
  setPhaseState({ active: "opponent", showBonus: false });
};

const sayBet = () => {
  hideBonusToast();
  const showBonus = !document.getElementById("phase-second")?.classList.contains("is-hidden");
  setTurnIndicator("Place your bet", "active");
  setPhaseState({
    active: "bet",
    completed: showBonus ? ["move", "second"] : ["move"],
    showBonus
  });
};

const sayExtraMove = () => {
  hideBonusToast();
  setTurnIndicator("Your second move", "active");
  setPhaseState({
    active: "second",
    completed: ["move"],
    showBonus: true
  });
};

const sayPredictionPlaced = (prediction) => {
  hideBonusToast();
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
  showBonusToast();
};

const sayIncorrectBet = () => {
  hideBonusToast();
  setTurnIndicator("Missed bet. Normal turn.", "active");
  setPhaseState({
    active: "move",
    showBonus: false
  });
};

const sayYouWin = (result) => {
  hideBonusToast();
  setTurnIndicator(result, "success");
  setPhaseState({ showBonus: false });
};

const sayYouLose = (result) => {
  hideBonusToast();
  setTurnIndicator(result, "danger");
  setPhaseState({ showBonus: false });
};

const sayGameDraw = (result) => {
  hideBonusToast();
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
