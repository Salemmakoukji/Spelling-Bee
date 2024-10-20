let currentClue = {};
let userData = JSON.parse(localStorage.getItem('user')) || { name: "Player", score: 0, gameScores: {} };

// Load player name and total score on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    loadNewClue();
});

// Function to show score breakdown
function showScoreDetails() {
    const scoreBreakdownDiv = document.getElementById('scoreBreakdown');
    const gameScores = userData.gameScores || {};

    let scoreDetails = '<strong>Game Scores:</strong><br>';
    scoreDetails += `Spelling Game: ${gameScores.spelling || 0} points<br>`;
    scoreDetails += `Who Am I?: ${gameScores.whoami || 0} points<br>`;
    scoreDetails += `Hangman: ${gameScores.hangman || 0} points<br>`;
    scoreDetails += `What Is It?: ${gameScores.whatisit || 0} points<br>`;
    scoreDetails += `Missing Letters: ${gameScores.missingletters || 0} points<br>`;
    scoreDetails += `10 Words: ${gameScores.tenwords || 0} points`;

    scoreBreakdownDiv.innerHTML = scoreDetails;
    scoreBreakdownDiv.classList.add('tooltip-visible');
}

// Function to hide score breakdown
function hideScoreDetails() {
    const scoreBreakdownDiv = document.getElementById('scoreBreakdown');
    scoreBreakdownDiv.classList.remove('tooltip-visible');
}

// Function to update player name
function updatePlayerName() {
    userData.name = document.getElementById('playerNameInput').value;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Example function for a game to update the score
function updateGameScore(game, points) {
    if (!userData.gameScores) {
        userData.gameScores = {};
    }
    if (!userData.gameScores[game]) {
        userData.gameScores[game] = 0;
    }
    userData.gameScores[game] += points;
    userData.score += points;

    // Update total score display
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

    // Save updated user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
}

// Example of how a game might call the update function
// Call updateGameScore('spelling', 10) for the spelling game, for example.


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
    updateGameScore('whoami', 10);
    messageElement.textContent = 'Correct! You earned 10 points.';
  } else {
    // Incorrect guess, subtract 5 points
    updateGameScore('whoami', -5);
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
