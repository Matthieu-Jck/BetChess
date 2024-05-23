export let myTime = 600; // 10 minutes in seconds
export let opponentTime = 600; // 10 minutes in seconds
let myTimerInterval = null;
let opponentTimerInterval = null;
let gameEnded = false; // Flag to check if the game has ended

export const startTimer = (player) => {
    console.log("STARTED TIMER: ", player);
    if (gameEnded) return; // Prevent starting the timer if the game has ended

    if (player === 'my') {
        clearInterval(myTimerInterval); // Clear any existing interval before starting a new one
        myTimerInterval = setInterval(() => {
            myTime--;
            updateTimerDisplay('bottom_timer', myTime);
            if (myTime <= 0 && !gameEnded) {
                clearInterval(myTimerInterval);
                clearInterval(opponentTimerInterval); // Ensure opponent timer is also stopped
                alert('You lose on time!');
                gameEnded = true;
            }
        }, 1000);
    } else {
        clearInterval(opponentTimerInterval); // Clear any existing interval before starting a new one
        opponentTimerInterval = setInterval(() => {
            opponentTime--;
            updateTimerDisplay('top_timer', opponentTime);
            if (opponentTime <= 0 && !gameEnded) {
                clearInterval(myTimerInterval); // Ensure my timer is also stopped
                clearInterval(opponentTimerInterval);
                alert('Opponent loses on time!');
                gameEnded = true;
            }
        }, 1000);
    }
};

export const switchTimer = (player) => {
    console.log("SWITCH TIMER: ", player);
    if (player === 'my') {
        clearInterval(myTimerInterval); // Ensure the current timer is stopped before switching
        startTimer('opponent');
    } else {
        clearInterval(opponentTimerInterval); // Ensure the current timer is stopped before switching
        startTimer('my');
    }
};

const updateTimerDisplay = (elementId, time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(elementId).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const setupTimers = (color) => {
    document.getElementById('top_timer').style.display = 'block';
    document.getElementById('bottom_timer').style.display = 'block';
    if (color === 'white') {
        document.getElementById('bottom_timer').style.backgroundColor = 'white';
        document.getElementById('bottom_timer').style.color = 'black';
        document.getElementById('top_timer').style.backgroundColor = 'rgba(0, 0, 0)';
        document.getElementById('top_timer').style.color = 'white';
    } else {
        document.getElementById('top_timer').style.backgroundColor = 'white';
        document.getElementById('top_timer').style.color = 'black';
        document.getElementById('bottom_timer').style.backgroundColor = 'rgba(0, 0, 0)';
        document.getElementById('bottom_timer').style.color = 'white';
    }
};