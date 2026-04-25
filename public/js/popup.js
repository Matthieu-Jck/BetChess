const USERNAME_PATTERN = /^[A-Za-z0-9_]{2,15}$/;

const initializePopup = () => {
  const popup = document.getElementById("usernamePopup");
  const form = document.getElementById("usernameForm");
  const input = document.getElementById("usernameInput");
  const error = document.getElementById("error-message");

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
    error.textContent = "";
    input.classList.remove("invalid");
  };

  const setError = (message) => {
    error.textContent = message;
    input.classList.add("invalid");
    showPopup();
  };

  const submitUsername = (event) => {
    event.preventDefault();
    clearError();

    const username = input.value.trim();
    if (!USERNAME_PATTERN.test(username)) {
      setError("Use 2 to 15 letters, numbers, or underscores.");
      return;
    }

    hidePopup();
    document.dispatchEvent(new CustomEvent("usernameSet", { detail: { username } }));
  };

  form.addEventListener("submit", submitUsername);
  input.addEventListener("input", clearError);
  window.addEventListener("usernameRejected", (event) => {
    setError(event.detail.message);
  });

  showPopup();
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializePopup);
}
