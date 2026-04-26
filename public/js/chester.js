import { onLanguageChange, t } from "./i18n.js";

const getPhaseTrack = () => document.getElementById("phase-track");
const getPhaseTrackShell = () => document.getElementById("phase-track-shell");
const getPhaseCards = () => ({
  bet: document.getElementById("phase-bet"),
  move: document.getElementById("phase-move"),
  opponent: document.getElementById("phase-opponent"),
  second: document.getElementById("phase-second")
});
let detachBonusToastDismiss = null;
let turnIndicatorState = { key: "turn.waiting", tone: "idle", values: {} };

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

const setTurnIndicator = (key, tone = "idle", values = {}) => {
  const indicator = document.getElementById("turn-indicator");
  turnIndicatorState = { key, tone, values };

  if (!indicator) {
    return;
  }

  indicator.textContent = t(key, values);
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
  setTurnIndicator("turn.waiting", "idle");
  setPhaseState({ showBonus: false });
};

const sayYourTurn = () => {
  hideBonusToast();
  setTurnIndicator("turn.yourMove", "active");
  setPhaseState({ active: "move", showBonus: false });
};

const sayOpponentTurn = () => {
  hideBonusToast();
  setTurnIndicator("turn.opponent", "waiting");
  setPhaseState({ active: "opponent", showBonus: false });
};

const sayBet = () => {
  hideBonusToast();
  const showBonus = !document.getElementById("phase-second")?.classList.contains("is-hidden");
  setTurnIndicator("turn.bet", "active");
  setPhaseState({
    active: "bet",
    completed: showBonus ? ["move", "second"] : ["move"],
    showBonus
  });
};

const sayExtraMove = () => {
  hideBonusToast();
  setTurnIndicator("turn.secondMove", "active");
  setPhaseState({
    active: "second",
    completed: ["move"],
    showBonus: true
  });
};

const sayPredictionPlaced = (prediction) => {
  hideBonusToast();
  setTurnIndicator("turn.betLocked", "waiting", { prediction });
  setPhaseState({
    active: "opponent",
    completed: ["move", "bet"],
    showBonus: false
  });
};

const sayCorrectBet = () => {
  setTurnIndicator("turn.correctBet", "success");
  setPhaseState({
    active: "move",
    showBonus: true
  });
  showBonusToast();
};

const sayIncorrectBet = () => {
  hideBonusToast();
  setTurnIndicator("turn.missedBet", "active");
  setPhaseState({
    active: "move",
    showBonus: false
  });
};

const sayYouWin = (resultLine) => {
  hideBonusToast();
  setTurnIndicator("result.reason.generic", "success", { reason: resultLine });
  setPhaseState({ showBonus: false });
};

const sayYouLose = (resultLine) => {
  hideBonusToast();
  setTurnIndicator("result.reason.generic", "danger", { reason: resultLine });
  setPhaseState({ showBonus: false });
};

const sayGameDraw = (resultLine) => {
  hideBonusToast();
  setTurnIndicator("result.reason.generic", "idle", { reason: resultLine });
  setPhaseState({ showBonus: false });
};

onLanguageChange(() => {
  setTurnIndicator(turnIndicatorState.key, turnIndicatorState.tone, turnIndicatorState.values);
});

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
