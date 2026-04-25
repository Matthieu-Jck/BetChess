const lobbyState = {
  currentUser: null,
  incomingInvitations: new Map(),
  noticeTimeoutId: null,
  onChallenge: null,
  onChallengeResponse: null,
  outgoingInvitations: new Map(),
  players: [],
  systemNotice: null
};

const getMe = () => lobbyState.players.find((player) => player.username === lobbyState.currentUser);
const getInviteStack = () => document.getElementById("invite-stack");
const hasOutgoingInviteTo = (username) => Array.from(lobbyState.outgoingInvitations.values()).some((invite) => invite.to === username);
const hasIncomingInviteFrom = (username) => Array.from(lobbyState.incomingInvitations.values()).some((invite) => invite.from === username);

const createInviteButton = (player, meIsBusy) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "invite-button";

  if (player.inGame) {
    button.textContent = "In game";
    button.disabled = true;
    return button;
  }

  if (meIsBusy) {
    button.textContent = "Playing";
    button.disabled = true;
    return button;
  }

  if (hasOutgoingInviteTo(player.username)) {
    button.textContent = "Sent";
    button.disabled = true;
    return button;
  }

  if (hasIncomingInviteFrom(player.username)) {
    button.textContent = "Respond";
    button.disabled = true;
    return button;
  }

  button.textContent = "Challenge";
  button.addEventListener("click", () => {
    lobbyState.onChallenge?.({ from: lobbyState.currentUser, to: player.username });
  });
  return button;
};

const renderInviteStack = () => {
  const inviteStack = getInviteStack();
  if (!inviteStack) {
    return;
  }

  inviteStack.replaceChildren();

  if (lobbyState.systemNotice) {
    const notice = document.createElement("div");
    notice.className = `invite-card invite-card--${lobbyState.systemNotice.tone}`;
    notice.textContent = lobbyState.systemNotice.message;
    inviteStack.appendChild(notice);
  }

  lobbyState.incomingInvitations.forEach((invite) => {
    const card = document.createElement("div");
    card.className = "invite-card invite-card--incoming";

    const title = document.createElement("strong");
    title.textContent = `${invite.from} challenged you`;

    const actions = document.createElement("div");
    actions.className = "invite-card__actions";

    const acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.className = "invite-card__button invite-card__button--accept";
    acceptButton.textContent = "Accept";
    acceptButton.addEventListener("click", () => {
      lobbyState.incomingInvitations.delete(invite.invitationId);
      renderPlayers();
      renderInviteStack();
      lobbyState.onChallengeResponse?.({ accept: true, invitationId: invite.invitationId });
    });

    const declineButton = document.createElement("button");
    declineButton.type = "button";
    declineButton.className = "invite-card__button invite-card__button--decline";
    declineButton.textContent = "Decline";
    declineButton.addEventListener("click", () => {
      lobbyState.incomingInvitations.delete(invite.invitationId);
      renderPlayers();
      renderInviteStack();
      lobbyState.onChallengeResponse?.({ accept: false, invitationId: invite.invitationId });
    });

    actions.append(acceptButton, declineButton);
    card.append(title, actions);
    inviteStack.appendChild(card);
  });

  lobbyState.outgoingInvitations.forEach((invite) => {
    const card = document.createElement("div");
    card.className = "invite-card invite-card--outgoing";
    card.textContent = `Invitation sent to ${invite.to}`;
    inviteStack.appendChild(card);
  });
};

const renderPlayers = () => {
  const me = lobbyState.currentUser;
  const players = lobbyState.players;
  const otherPlayers = players.filter((player) => player.username !== me);
  const listContainer = document.getElementById("players-list-container");
  const title = document.getElementById("players-title");
  const count = document.getElementById("players-count");
  const currentPlayer = document.getElementById("current-player");
  const mePlayer = getMe();
  const meIsBusy = Boolean(mePlayer?.inGame);

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

      const identity = document.createElement("div");
      identity.className = "player-item__identity";

      const playerName = document.createElement("div");
      playerName.className = "player-item__name";
      playerName.textContent = player.username;

      const playerStatus = document.createElement("span");
      playerStatus.className = `player-item__status ${player.inGame ? "player-item__status--busy" : "player-item__status--available"}`;
      playerStatus.textContent = player.inGame ? "In game" : "Available";

      identity.append(playerName, playerStatus);
      item.append(identity, createInviteButton(player, meIsBusy));
      playerList.appendChild(item);
    });

    listContainer.appendChild(playerList);
  }

  currentPlayer.textContent = `Signed in as ${me}${meIsBusy ? " - Playing" : " - Available"}`;
};

const setTransientNotice = (message, tone = "neutral") => {
  lobbyState.systemNotice = { message, tone };
  renderInviteStack();

  if (lobbyState.noticeTimeoutId) {
    window.clearTimeout(lobbyState.noticeTimeoutId);
  }

  lobbyState.noticeTimeoutId = window.setTimeout(() => {
    lobbyState.systemNotice = null;
    renderInviteStack();
  }, 4000);
};

export const displayPlayers = (me, players, onChallenge, onChallengeResponse) => {
  lobbyState.currentUser = me;
  lobbyState.players = players;
  lobbyState.onChallenge = onChallenge;
  lobbyState.onChallengeResponse = onChallengeResponse;
  renderPlayers();
  renderInviteStack();
};

export const trackIncomingChallenge = (invite) => {
  lobbyState.incomingInvitations.set(invite.invitationId, invite);
  renderPlayers();
  renderInviteStack();
};

export const trackOutgoingChallenge = (invite) => {
  lobbyState.outgoingInvitations.set(invite.invitationId, invite);
  renderPlayers();
  renderInviteStack();
};

export const clearChallenge = (invitationId) => {
  lobbyState.incomingInvitations.delete(invitationId);
  lobbyState.outgoingInvitations.delete(invitationId);
  renderPlayers();
  renderInviteStack();
};

export const clearAllChallenges = () => {
  lobbyState.incomingInvitations.clear();
  lobbyState.outgoingInvitations.clear();
  lobbyState.systemNotice = null;

  if (lobbyState.noticeTimeoutId) {
    window.clearTimeout(lobbyState.noticeTimeoutId);
    lobbyState.noticeTimeoutId = null;
  }

  renderPlayers();
  renderInviteStack();
};

export const showLobbyNotice = (message, tone = "neutral") => {
  setTransientNotice(message, tone);
};

export default displayPlayers;
