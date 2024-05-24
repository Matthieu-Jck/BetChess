let whiteTime = 600, blackTime = 600;
let whiteTimerInterval = null, blackTimerInterval = null;
let gameEnded = false;

const clearTimers = () => {
    clearInterval(whiteTimerInterval);
    clearInterval(blackTimerInterval);
};

const handleTimeUpdate = (color, io) => {
    if (color === 'white') {
        whiteTime--;
        if (whiteTime <= 0) {
            io.emit('gameEnd', { result: 'White loses on time!' });
            gameEnded = true;
        }
        io.emit('timerUpdate', { color, time: whiteTime });
    } else {
        blackTime--;
        if (blackTime <= 0) {
            io.emit('gameEnd', { result: 'Black loses on time!' });
            gameEnded = true;
        }
        io.emit('timerUpdate', { color, time: blackTime });
    }
};

const startTimer = (color, io) => {
    if (gameEnded) return;
    clearTimers();
    const interval = setInterval(() => {
        handleTimeUpdate(color, io);
        if (gameEnded) {
            clearTimers();
        }
    }, 1000);
    if (color === 'white') {
        whiteTimerInterval = interval;
    } else {
        blackTimerInterval = interval;
    }
};

const switchTimer = (color, io) => startTimer(color, io);

export const handleTimerEvents = (socket, io) => {
    socket.on("startTimer", ({ color }) => startTimer(color, io));
    socket.on("switchTimer", ({ color }) => switchTimer(color, io));
};

export const updateTimerDisplay = (elementId, time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(elementId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const setupTimers = (color) => {
    const [topTimer, bottomTimer] = ['top_timer', 'bottom_timer'].map(id => document.getElementById(id));
    [topTimer, bottomTimer].forEach(timer => {
        timer.style.display = 'block';
        updateTimerDisplay(timer.id, timer.id === 'top_timer' ? blackTime : whiteTime);
    });

    const timerStyles = { white: { backgroundColor: 'white', color: 'black' }, black: { backgroundColor: 'black', color: 'white' } };
    Object.assign(bottomTimer.style, timerStyles[color]);
    Object.assign(topTimer.style, timerStyles[color === 'white' ? 'black' : 'white']);
};