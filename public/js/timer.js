const INITIAL_TIME = 20 * 60;

const updateTimerDisplay = (elementId, time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
};

const setupTimers = (color) => {
  const topTimer = document.getElementById("top_timer");
  const bottomTimer = document.getElementById("bottom_timer");
  const topCard = document.querySelector(".timer-card--top");
  const bottomCard = document.querySelector(".timer-card--bottom");

  [topTimer, bottomTimer].forEach((timer) => {
    if (timer) {
      updateTimerDisplay(timer.id, INITIAL_TIME);
    }
  });

  if (topCard && bottomCard) {
    bottomCard.dataset.color = color;
    topCard.dataset.color = color === "white" ? "black" : "white";
  }
};

export { setupTimers, updateTimerDisplay };
