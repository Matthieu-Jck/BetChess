const headerMenusConfig = [
  {
    buttonId: "toggle-help",
    id: "help",
    panelId: "help"
  },
  {
    buttonId: "toggle-players",
    id: "players",
    panelId: "players",
    persistentQuery: "(min-width: 1180px) and (min-height: 680px)"
  },
  {
    buttonId: "language-button",
    id: "language",
    panelSelector: "[data-language-menu-list]",
    rootSelector: "[data-language-menu]"
  }
];

const VIEWPORT_MARGIN = 10;
const PANEL_GAP = 10;

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const initializeHeaderMenus = () => {
  const phoneDrawerQuery = window.matchMedia("(max-width: 720px)");
  let mobileLobbyTimer = null;

  const menus = headerMenusConfig
    .map((config) => {
      const button = document.getElementById(config.buttonId);
      const panel = config.panelId
        ? document.getElementById(config.panelId)
        : document.querySelector(config.panelSelector);
      const root = config.rootSelector ? document.querySelector(config.rootSelector) : panel;
      const persistentQuery = config.persistentQuery ? window.matchMedia(config.persistentQuery) : null;

      if (!button || !panel) {
        return null;
      }

      return {
        ...config,
        button,
        panel,
        persistentQuery,
        root
      };
    })
    .filter(Boolean);

  const getMenu = (id) => menus.find((menu) => menu.id === id);
  const isPersistent = (menu) => Boolean(menu?.persistentQuery?.matches);

  const setPanelHidden = (menu, hidden) => {
    menu.panel.setAttribute("aria-hidden", String(hidden));

    if (menu.panel.hasAttribute("data-language-menu-list")) {
      menu.panel.hidden = hidden;
    }
  };

  const clearPosition = (menu) => {
    menu.panel.style.removeProperty("--menu-left");
    menu.panel.style.removeProperty("--menu-top");
    menu.panel.style.removeProperty("--menu-width");
    menu.panel.style.removeProperty("--menu-max-height");
    menu.panel.style.removeProperty("--menu-arrow-x");
  };

  const closeMenu = (menu) => {
    if (isPersistent(menu)) {
      menu.button.setAttribute("aria-expanded", "true");
      menu.panel.classList.remove("is-open");
      menu.root?.classList.remove("is-open");
      setPanelHidden(menu, false);
      clearPosition(menu);
      return;
    }

    menu.button.setAttribute("aria-expanded", "false");
    menu.panel.classList.remove("is-open");
    menu.root?.classList.remove("is-open");
    setPanelHidden(menu, true);
  };

  const closeMenus = () => {
    menus.forEach(closeMenu);
  };

  const positionMenu = (menu) => {
    setPanelHidden(menu, false);
    menu.panel.classList.add("is-positioning");

    const buttonRect = menu.button.getBoundingClientRect();
    const panelRect = menu.panel.getBoundingClientRect();
    const panelWidth = Math.min(
      panelRect.width || 320,
      window.innerWidth - VIEWPORT_MARGIN * 2
    );
    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const left = clamp(
      buttonCenter - panelWidth / 2,
      VIEWPORT_MARGIN,
      window.innerWidth - panelWidth - VIEWPORT_MARGIN
    );
    const headerBottom = document.querySelector(".game-header")?.getBoundingClientRect().bottom ?? buttonRect.bottom;
    const top = Math.max(buttonRect.bottom, headerBottom) + PANEL_GAP;
    const maxHeight = Math.max(180, window.innerHeight - top - VIEWPORT_MARGIN);

    menu.panel.style.setProperty("--menu-left", `${left}px`);
    menu.panel.style.setProperty("--menu-top", `${top}px`);
    menu.panel.style.setProperty("--menu-width", `${panelWidth}px`);
    menu.panel.style.setProperty("--menu-max-height", `${maxHeight}px`);
    menu.panel.style.setProperty("--menu-arrow-x", `${buttonCenter - left}px`);
    menu.panel.classList.remove("is-positioning");
  };

  const openMenu = (id) => {
    const activeMenu = getMenu(id);
    if (!activeMenu || isPersistent(activeMenu)) {
      return;
    }

    closeMenus();
    positionMenu(activeMenu);
    activeMenu.button.setAttribute("aria-expanded", "true");
    activeMenu.panel.classList.add("is-open");
    activeMenu.root?.classList.add("is-open");

    if (activeMenu.id === "language") {
      activeMenu.panel.querySelector("[aria-selected='true']")?.focus({ preventScroll: true });
    }
  };

  const toggleMenu = (menu) => {
    if (menu.panel.classList.contains("is-open")) {
      closeMenus();
      return;
    }

    openMenu(menu.id);
  };

  menus.forEach((menu) => {
    menu.button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu(menu);
    });
  });

  document.querySelectorAll("[data-language-option]").forEach((option) => {
    option.addEventListener("click", () => {
      window.setTimeout(() => {
        closeMenus();
        getMenu("language")?.button.focus({ preventScroll: true });
      }, 0);
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menus.some((menu) => {
      return menu.button.contains(event.target) || menu.panel.contains(event.target);
    });

    if (!clickedInsideMenu) {
      closeMenus();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openMenuItem = menus.find((menu) => menu.panel.classList.contains("is-open"));
      closeMenus();
      openMenuItem?.button.focus({ preventScroll: true });
    }
  });

  window.addEventListener("resize", () => {
    const openMenuItem = menus.find((menu) => menu.panel.classList.contains("is-open"));
    if (openMenuItem) {
      positionMenu(openMenuItem);
    }
  });

  document.addEventListener("usernameSet", () => {
    if (mobileLobbyTimer) {
      window.clearTimeout(mobileLobbyTimer);
    }

    mobileLobbyTimer = window.setTimeout(() => {
      const playersMenu = getMenu("players");
      const menuAlreadyOpen = menus.some((menu) => menu.panel.classList.contains("is-open"));
      if (!playersMenu || !phoneDrawerQuery.matches || isPersistent(playersMenu) || menuAlreadyOpen) {
        return;
      }

      openMenu("players");
    }, 1800);
  });

  menus.forEach((menu) => {
    if (!menu.persistentQuery) {
      closeMenu(menu);
      return;
    }

    const syncPersistentMenu = () => closeMenu(menu);
    syncPersistentMenu();
    menu.persistentQuery.addEventListener("change", () => {
      closeMenus();
      syncPersistentMenu();
    });
  });
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializeHeaderMenus);
}
