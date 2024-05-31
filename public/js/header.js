const togglePlayersButton = document.getElementById('toggle-players');
togglePlayersButton.addEventListener('click', function () {
    var playersDiv = document.getElementById('players');
    var computedStyle = window.getComputedStyle(playersDiv);
    if (computedStyle.display === 'none') {
        playersDiv.style.display = 'flex';
    } else {
        playersDiv.style.display = 'none';
    }
});