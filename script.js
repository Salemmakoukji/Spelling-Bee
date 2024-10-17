let playerName = '';
let currentScore = 0;

// Load user data from JSON file on page load
document.addEventListener('DOMContentLoaded', function () {
  fetch('userScores.json')
    .then(response => response.json())
    .then(data => {
      playerName = data.user.name;
      currentScore = data.user.score;

      // Display initial player name and score
      document.getElementById('playerNameInput').value = playerName;
      document.getElementById('playerScore').textContent = `Score: ${currentScore}`;

      // Listen for changes to the player name input
      document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    })
    .catch(error => console.error('Error loading user data:', error));
});

// Update player name in the JSON file when changed
function updatePlayerName() {
  playerName = document.getElementById('playerNameInput').value;

  fetch('userScores.json', {
    method: 'POST', // In a real setup, this should be a PUT or PATCH request
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: playerName,
        score: currentScore
      }
    })
  })
    .then(() => {
      console.log('Player name updated successfully');
    })
    .catch(error => console.error('Error updating player name:', error));
}
