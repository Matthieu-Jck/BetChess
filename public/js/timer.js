const updateTimerDisplay = (elementId, time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(elementId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const setupTimers = (gameData, color) => {
    console.log("Timer SETUP for ",color," , data: ",gameData);

    const [topTimer, bottomTimer] = ['top_timer', 'bottom_timer'].map(id => document.getElementById(id));
    [topTimer, bottomTimer].forEach((timer, index) => {
        timer.style.display = 'block';
        updateTimerDisplay(timer.id, 1200);
    });

    const timerStyles = { white: { backgroundColor: 'white', color: 'black' }, black: { backgroundColor: 'black', color: 'white' } };
    Object.assign(bottomTimer.style, timerStyles[color]);
    Object.assign(topTimer.style, timerStyles[color === 'white' ? 'black' : 'white']);
};

export { updateTimerDisplay, setupTimers };