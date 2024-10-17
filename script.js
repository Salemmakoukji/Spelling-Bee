// Initialize default values if nothing is in localStorage
if (!localStorage.getItem('user')) {
  localStorage.setItem('user', JSON.stringify({
    name: 'Player1',
    score: 0
  }));
}

let userData = JSON.parse(localStorage.getItem('user'));

// Load player name and score on page load
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('playerNameInput').value = userData.name;
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

  // Listen for changes to the player name input
  document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
});

// Update player name in localStorage when changed
function updatePlayerName() {
  userData.name = document.getElementById('playerNameInput').value;

  localStorage.setItem('user', JSON.stringify(userData));
  console.log('Player name updated successfully');
}
