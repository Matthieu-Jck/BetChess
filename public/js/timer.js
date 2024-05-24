let whiteTime = 600, blackTime = 600;
let whiteTimerInterval = null, blackTimerInterval = null;
let gameEnded = false;

const clearTimers = () => {
    clearInterval(whiteTimerInterval);
    clearInterval(blackTimerInterval);
};

const handleTimeUpdate = (color, io) => {
    const time = color === 'white' ? --whiteTime : --blackTime;
    if (time <= 0) {
        io.emit('gameEnd', { result: `${color.charAt(0).toUpperCase() + color.slice(1)} loses on time!` });
        gameEnded = true;
        clearTimers();
    }
    io.emit('timerUpdate', { color, time });
};

const startTimer = (color, io) => {
    if (gameEnded) return;
    clearTimers();
    const interval = setInterval(() => handleTimeUpdate(color, io), 1000);
    color === 'white' ? whiteTimerInterval = interval : blackTimerInterval = interval;
};

export const handleTimerEvents = (socket, io) => {
    socket.on("startTimer", ({ color }) => startTimer(color, io));
    socket.on("switchTimer", ({ color }) => startTimer(color, io));
};

export const updateTimerDisplay = (elementId, time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(elementId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const setupTimers = (color) => {
    const [topTimer, bottomTimer] = ['top_timer', 'bottom_timer'].map(id => document.getElementById(id));
    [topTimer, bottomTimer].forEach((timer, index) => {
        timer.style.display = 'block';
        updateTimerDisplay(timer.id, index === 0 ? blackTime : whiteTime);
    });

    const timerStyles = { white: { backgroundColor: 'white', color: 'black' }, black: { backgroundColor: 'black', color: 'white' } };
    Object.assign(bottomTimer.style, timerStyles[color]);
    Object.assign(topTimer.style, timerStyles[color === 'white' ? 'black' : 'white']);
};