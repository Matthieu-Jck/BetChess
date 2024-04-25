const displayPlayers = (me, players, fn) => {
  const playerList = document.createElement("ul");
  playerList.setAttribute('id', 'players-ul');

  players.forEach((player) => {
    const listItem = document.createElement("li");
  
    if (player.username === me) {
      return
      //listItem.textContent = player.username + " (you)";
    } else {
      const button = document.createElement("button");
      button.textContent = "Invite to play";
      button.onclick = function () {
        fn({ from: me, to: player.username });
      };
      listItem.textContent = player.username + " ";
      listItem.appendChild(button);
    }
    playerList.appendChild(listItem);
  });

  const parent = document.getElementById("players");
  const child = document.getElementById("players-ul");
  if (child) {
    parent.removeChild(child);
  }
  parent.appendChild(playerList);
};
