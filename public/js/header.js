const togglePlayersButton = document.getElementById('toggle-players');
togglePlayersButton.addEventListener('click', function () {
    var playersDiv = document.getElementById('players');
    if (playersDiv.style.display === 'none') {
        playersDiv.style.display = 'flex';
    } else {
        playersDiv.style.display = 'none';
    }
});
