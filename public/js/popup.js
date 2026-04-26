import { onLanguageChange, t, translateServerMessage } from "./i18n.js";

const USERNAME_PATTERN = /^[A-Za-z0-9_]{2,15}$/;

const initializePopup = () => {
  const popup = document.getElementById("usernamePopup");
  const form = document.getElementById("usernameForm");
  const input = document.getElementById("usernameInput");
  const error = document.getElementById("error-message");
  let currentErrorRenderer = null;

  if (!popup || !form || !input || !error) {
    return;
  }

  const showPopup = () => {
    popup.classList.add("is-visible");
    input.focus();
  };

  const hidePopup = () => {
    popup.classList.remove("is-visible");
  };

  const clearError = () => {
    currentErrorRenderer = null;
    error.textContent = "";
    input.classList.remove("invalid");
  };

  const setError = (message, renderer = () => message) => {
    currentErrorRenderer = renderer;
    error.textContent = message;
    input.classList.add("invalid");
    showPopup();
  };

  const submitUsername = (event) => {
    event.preventDefault();
    clearError();

    const username = input.value.trim();
    if (!USERNAME_PATTERN.test(username)) {
      setError(t("username.invalid"), () => t("username.invalid"));
      return;
    }

    hidePopup();
    document.dispatchEvent(new CustomEvent("usernameSet", { detail: { username } }));
  };

  form.addEventListener("submit", submitUsername);
  input.addEventListener("input", clearError);
  window.addEventListener("usernameRejected", (event) => {
    const message = event.detail.message;
    setError(translateServerMessage(message), () => translateServerMessage(message));
  });
  onLanguageChange(() => {
    if (currentErrorRenderer) {
      error.textContent = currentErrorRenderer();
    }
  });

  showPopup();
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializePopup);
}
