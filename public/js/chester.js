// Function to change the text of the dialogue bubble
function changeDialogueText(text) {
    $('.dialogue-bubble').html(text);
}

// Function to display the beginning message
function sayBegin() {
    changeDialogueText("Alright, let's begin.");
}

function sayYourTurn(){
    changeDialogueText("It's your turn now, try not to play a move easily predictable.");
}

// Function to display "Opponent's Turn" message
function sayOpponentTurn() {
    changeDialogueText('It\'s your opponent\'s turn. Give him a second.');
}

// Function to display "Place Your Bet" message
function sayBet() {
    changeDialogueText('Place your bet on what you think your opponent\'s next move will be by dragging one of his pieces.');
}

// Function to display "Correct Bet" message
function sayCorrectBet() {
    changeDialogueText('Congratulations! You guessed correctly. You can play twice this turn.');
}

// Function to display "Incorrect Bet" message
function sayIncorrectBet() {
    changeDialogueText("Sorry, your guess was incorrect. Let's try again.");
}

// Function to display "You Win" message
function sayYouWin() {
    changeDialogueText('You win! Great job.');
}

// Function to display "You Lose" message
function sayYouLose() {
    changeDialogueText('You lose. Better luck next time.');
}

// Function to display "5 Minutes Left" message
function say5minLeft() {
    changeDialogueText('Hurry up! Only 5 minutes left.');
}

// Exporting functions for external use
export {
    sayBegin,
    sayYourTurn,
    sayOpponentTurn,
    sayBet,
    sayCorrectBet,
    sayIncorrectBet,
    sayYouWin,
    sayYouLose,
    say5minLeft
};
