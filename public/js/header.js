const togglePlayersButton = document.getElementById('toggle-players');
togglePlayersButton.addEventListener('click', function () {
    var playersDiv = document.getElementById('players');
    var helpDiv = document.getElementById('help');
    
    if (playersDiv.style.right === '-20em' || playersDiv.style.right === '') {
        playersDiv.style.right = '0';
        helpDiv.style.right = '-20em';
    } else {
        playersDiv.style.right = '-20em';
    }
});

const toggleHelpButton = document.getElementById('toggle-help');
toggleHelpButton.addEventListener('click', function () {
    var helpDiv = document.getElementById('help');
    var playersDiv = document.getElementById('players');
    
    if (helpDiv.style.right === '-20em' || helpDiv.style.right === '') {
        helpDiv.style.right = '0';
        playersDiv.style.right = '-20em';
    } else {
        helpDiv.style.right = '-20em';
    }
});