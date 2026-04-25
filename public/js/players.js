const createInviteButton = (playerName, onChallenge, me) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "invite-button";
  button.textContent = "Challenge";
  button.addEventListener("click", () => onChallenge({ from: me, to: playerName }));
  return button;
};

export const displayPlayers = (me, players, onChallenge) => {
  const otherPlayers = players.filter((player) => player.username !== me);
  const listContainer = document.getElementById("players-list-container");
  const title = document.getElementById("players-title");
  const count = document.getElementById("players-count");
  const currentPlayer = document.getElementById("current-player");

  if (!listContainer || !title || !count || !currentPlayer) {
    return;
  }

  title.textContent = "Players online";
  count.textContent = `${players.length} connected`;
  listContainer.replaceChildren();

  if (otherPlayers.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "players-empty";
    emptyState.textContent = "No opponents available yet.";
    listContainer.appendChild(emptyState);
  } else {
    const playerList = document.createElement("ul");
    playerList.id = "players-ul";

    otherPlayers.forEach((player) => {
      const item = document.createElement("li");
      item.className = "player-item";

      const playerName = document.createElement("div");
      playerName.className = "player-item__name";
      playerName.textContent = player.username;

      item.append(playerName, createInviteButton(player.username, onChallenge, me));
      playerList.appendChild(item);
    });

    listContainer.appendChild(playerList);
  }

  currentPlayer.textContent = `Signed in as ${me}`;
};

export default displayPlayers;
