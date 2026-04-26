import { onLanguageChange, t } from "./i18n.js";

const INITIAL_TIME = 20 * 60;
let timerLabelState = null;

const updateTimerDisplay = (elementId, time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
};

const setTimerLabels = () => {
  const topLabel = document.querySelector(".timer-card--top .timer-label");
  const bottomLabel = document.querySelector(".timer-card--bottom .timer-label");

  if (!topLabel || !bottomLabel) {
    return;
  }

  if (!timerLabelState) {
    topLabel.textContent = t("timer.opponent");
    bottomLabel.textContent = t("timer.you");
    return;
  }

  topLabel.textContent = timerLabelState.opponentName;
  bottomLabel.textContent = t("timer.youName", { name: timerLabelState.playerName });
};

const setupTimers = (color, { opponentName, playerName } = {}) => {
  const topTimer = document.getElementById("top_timer");
  const bottomTimer = document.getElementById("bottom_timer");
  const topCard = document.querySelector(".timer-card--top");
  const bottomCard = document.querySelector(".timer-card--bottom");
  timerLabelState = playerName && opponentName ? { opponentName, playerName } : null;

  [topTimer, bottomTimer].forEach((timer) => {
    if (timer) {
      updateTimerDisplay(timer.id, INITIAL_TIME);
    }
  });

  if (topCard && bottomCard) {
    bottomCard.dataset.color = color;
    topCard.dataset.color = color === "white" ? "black" : "white";
  }

  setTimerLabels();
};

const resetTimers = () => {
  const topTimer = document.getElementById("top_timer");
  const bottomTimer = document.getElementById("bottom_timer");
  const topCard = document.querySelector(".timer-card--top");
  const bottomCard = document.querySelector(".timer-card--bottom");

  [topTimer, bottomTimer].forEach((timer) => {
    if (timer) {
      updateTimerDisplay(timer.id, INITIAL_TIME);
    }
  });

  topCard?.removeAttribute("data-color");
  bottomCard?.removeAttribute("data-color");
  timerLabelState = null;
  setTimerLabels();
};

onLanguageChange(setTimerLabels);

export { resetTimers, setupTimers, updateTimerDisplay };
