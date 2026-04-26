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

const setPhaseState = ({ active = null, completed = [], showBet = true, showBonus = false, showOpponent = true }) => {
  const track = getPhaseTrack();
  const shell = getPhaseTrackShell();
  const cards = getPhaseCards();
  const phaseOrder = ["opponent", "move", "second", "bet"];
  const isVisible = active !== null || completed.length > 0 || showBonus;
  const isFirstTurn = isVisible && !showBet && !showBonus && !showOpponent;

  shell?.classList.toggle("is-active", isVisible);
  shell?.setAttribute("aria-hidden", String(!isVisible));
  track?.classList.toggle("has-bonus", showBonus);
  track?.classList.toggle("is-first-turn", isFirstTurn);
  cards.opponent?.classList.toggle("is-hidden", !showOpponent);
  cards.opponent?.setAttribute("aria-hidden", String(!showOpponent));
  cards.second?.classList.toggle("is-hidden", !showBonus);
  cards.second?.setAttribute("aria-hidden", String(!showBonus));
  cards.bet?.classList.toggle("is-hidden", !showBet);
  cards.bet?.setAttribute("aria-hidden", String(!showBet));

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

  const moveStep = document.querySelector("#phase-move .phase-card__eyebrow");
  if (moveStep) {
    moveStep.textContent = isFirstTurn ? "" : "2";
  }
};

const sayWaitingForMatch = () => {
  hideBonusToast();
  setPhaseState({ showBet: true, showBonus: false });
};

const sayYourTurn = ({ skipBet = false } = {}) => {
  hideBonusToast();
  setPhaseState({ active: "move", showBet: !skipBet, showBonus: false, showOpponent: !skipBet });
};

const sayOpponentTurn = () => {
  hideBonusToast();
  setPhaseState({ active: "opponent", showBet: true, showBonus: false });
};

const sayBet = () => {
  hideBonusToast();
  const showBonus = !document.getElementById("phase-second")?.classList.contains("is-hidden");
  setPhaseState({
    active: "bet",
    completed: showBonus ? ["move", "second"] : ["move"],
    showBet: true,
    showBonus
  });
};

const sayExtraMove = () => {
  hideBonusToast();
  setPhaseState({
    active: "second",
    completed: ["move"],
    showBet: true,
    showBonus: true
  });
};

const sayPredictionPlaced = () => {
  hideBonusToast();
  setPhaseState({
    active: "opponent",
    completed: ["move", "bet"],
    showBet: true,
    showBonus: false
  });
};

const sayCorrectBet = () => {
  setPhaseState({
    active: "move",
    showBet: true,
    showBonus: true
  });
  showBonusToast();
};

const sayIncorrectBet = () => {
  hideBonusToast();
  setPhaseState({
    active: "move",
    showBet: true,
    showBonus: false
  });
};

const sayYouWin = () => {
  hideBonusToast();
  setPhaseState({ showBet: true, showBonus: false });
};

const sayYouLose = () => {
  hideBonusToast();
  setPhaseState({ showBet: true, showBonus: false });
};

const sayGameDraw = () => {
  hideBonusToast();
  setPhaseState({ showBet: true, showBonus: false });
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
