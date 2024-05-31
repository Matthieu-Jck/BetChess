export const displayPlayers = (me, players, fn) => {
  const playerList = document.createElement("ul");
  playerList.setAttribute('id', 'players-ul');

  players.forEach((player) => {
      if (player.username === me) return;

      const listItem = document.createElement("li");
      listItem.classList.add("player-item");

      const playerName = document.createElement("span");
      playerName.textContent = player.username;

      const button = document.createElement("button");
      button.textContent = "Invite to play";
      button.classList.add("invite-button");
      button.onclick = function () {
          fn({ from: me, to: player.username });
      };

      listItem.appendChild(playerName);
      listItem.appendChild(button);
      playerList.appendChild(listItem);
  });

  const currentUser = document.createElement("div");
  currentUser.classList.add("current-user");
  currentUser.textContent = me + " (you)";

  const parent = document.getElementById("players");
  const listContainer = document.getElementById("players-list-container");
  const oldList = document.getElementById("players-ul");
  const currentPlayerContainer = document.getElementById("current-player");

  if (oldList) {
      listContainer.removeChild(oldList);
  }

  listContainer.appendChild(playerList);

  if (currentPlayerContainer.firstChild) {
      currentPlayerContainer.removeChild(currentPlayerContainer.firstChild);
  }

  currentPlayerContainer.appendChild(currentUser);
};

export default displayPlayers;
