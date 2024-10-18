let currentClue = {};
let userData = JSON.parse(localStorage.getItem('user'));

// Load player name and score on page load
document.addEventListener('DOMContentLoaded', function () {
  // Set the player name and score from localStorage
  document.getElementById('playerNameInput').value = userData.name;
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

  // Listen for changes to the player name input
  document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);

  // Load the first clue when the page loads
  loadNewClue();
});

function loadNewClue() {
  // Fetch a random clue from Clues.json
  fetch('Clues.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.clues.length);
      currentClue = data.clues[randomIndex];

      // Display the clue
      document.getElementById('clueText').textContent = `Clue: ${currentClue.clue}`;

      // Reset game message and guess input
      document.getElementById('gameMessage').textContent = '';
      document.getElementById('guess').value = '';
    })
    .catch(error => console.error('Error loading clues:', error));
}

function submitGuess() {
  const userGuess = document.getElementById('guess').value.trim().toLowerCase();
  const messageElement = document.getElementById('gameMessage');

  if (userGuess === currentClue.answer.toLowerCase()) {
    // Correct guess, add 10 points
    userData.score += 10;
    messageElement.textContent = 'Correct! You earned 10 points.';
  } else {
    // Incorrect guess, subtract 5 points
    userData.score -= 5;
    messageElement.textContent = `Incorrect! The correct answer was "${currentClue.answer}". You lost 5 points.`;
  }

  // Update the score in localStorage
  updateScore();

  // Load a new clue for the next round
  loadNewClue();
}

function updateScore() {
  // Save the updated score to localStorage
  localStorage.setItem('user', JSON.stringify(userData));

  // Update the displayed score
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
}

function updatePlayerName() {
  // Update the player name and save it in localStorage
  userData.name = document.getElementById('playerNameInput').value;
  localStorage.setItem('user', JSON.stringify(userData));
}
