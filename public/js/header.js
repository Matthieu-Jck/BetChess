const drawerButtons = [
  { buttonId: "toggle-help", drawerId: "help" },
  { buttonId: "toggle-players", drawerId: "players" }
];

const initializeDrawers = () => {
  const scrim = document.getElementById("drawer-scrim");
  const persistentPlayersQuery = window.matchMedia("(min-width: 1180px) and (min-height: 680px)");
  const drawers = drawerButtons.map(({ buttonId, drawerId }) => ({
    button: document.getElementById(buttonId),
    drawer: document.getElementById(drawerId)
  }));
  const playersDrawer = drawers.find(({ drawer }) => drawer?.id === "players");

  const syncPersistentPlayers = () => {
    const shouldPersist = persistentPlayersQuery.matches;
    playersDrawer?.drawer?.setAttribute("aria-hidden", String(!shouldPersist));
    playersDrawer?.button?.setAttribute("aria-expanded", String(shouldPersist));

    if (shouldPersist) {
      playersDrawer?.drawer?.classList.remove("is-open");
    }
  };

  const closeDrawers = () => {
    drawers.forEach(({ button, drawer }) => {
      if (persistentPlayersQuery.matches && drawer?.id === "players") {
        button?.setAttribute("aria-expanded", "true");
        drawer.setAttribute("aria-hidden", "false");
        drawer.classList.remove("is-open");
        return;
      }

      button?.setAttribute("aria-expanded", "false");
      drawer?.classList.remove("is-open");
      drawer?.setAttribute("aria-hidden", "true");
    });

    if (scrim) {
      scrim.hidden = true;
      scrim.classList.remove("is-visible");
    }
  };

  const openDrawer = (activeDrawerId) => {
    drawers.forEach(({ button, drawer }) => {
      if (persistentPlayersQuery.matches && drawer?.id === "players") {
        button?.setAttribute("aria-expanded", "true");
        drawer.setAttribute("aria-hidden", "false");
        drawer.classList.remove("is-open");
        return;
      }

      const isActive = drawer?.id === activeDrawerId;
      button?.setAttribute("aria-expanded", String(isActive));
      drawer?.classList.toggle("is-open", isActive);
      drawer?.setAttribute("aria-hidden", String(!isActive));
    });

    if (scrim) {
      scrim.hidden = false;
      requestAnimationFrame(() => scrim.classList.add("is-visible"));
    }
  };

  drawers.forEach(({ button, drawer }) => {
    if (!button || !drawer) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      if (isOpen) {
        closeDrawers();
        return;
      }

      openDrawer(drawer.id);
    });
  });

  syncPersistentPlayers();
  persistentPlayersQuery.addEventListener("change", () => {
    closeDrawers();
    syncPersistentPlayers();
  });

  scrim?.addEventListener("click", closeDrawers);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawers();
    }
  });
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializeDrawers);
}
