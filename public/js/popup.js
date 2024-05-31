$(document).ready(function() {
  const showPopup = () => {
    $('#usernamePopup').show();
  };

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{2,15}$/;
    return regex.test(username);
  };

  const displayError = (message) => {
    $('#error-message').text(message);
    $('#usernameInput').addClass('invalid');
  };

  const clearError = () => {
    $('#error-message').text('');
    $('#usernameInput').removeClass('invalid');
  };

  $('#validateButton').click(function() {
    const username = $('#usernameInput').val().trim();
    clearError();
    if (validateUsername(username)) {
      $('#usernamePopup').hide();
      window.setUsername(username);
    } else {
      displayError('Invalid username. Must be 2-15 characters and alphanumeric.');
    }
  });

  showPopup();
});

window.setUsername = (username) => {
  window.username = username;
  const event = new CustomEvent('usernameSet', { detail: { username } });
  document.dispatchEvent(event);
};